import asyncio
import os
import pty
import signal
import struct
import fcntl
import termios
from typing import Optional, Callable
import logging

logger = logging.getLogger(__name__)


class Sandbox:
    """
    A sandboxed shell environment for terminal sessions.
    
    Uses proot when available for stronger isolation,
    falls back to a regular shell otherwise.
    """
    
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.process: Optional[asyncio.subprocess.Process] = None
        self.master_fd: Optional[int] = None
        self.slave_fd: Optional[int] = None
        self._reader_task: Optional[asyncio.Task] = None
        self._output_callback: Optional[Callable[[bytes], None]] = None
        self._running = False
    
    async def start(self):
        """Start the sandbox shell"""
        if self._running:
            return
        
        # Create pseudo-terminal
        self.master_fd, self.slave_fd = pty.openpty()
        
        # Set non-blocking mode on master
        flags = fcntl.fcntl(self.master_fd, fcntl.F_GETFL)
        fcntl.fcntl(self.master_fd, fcntl.F_SETFL, flags | os.O_NONBLOCK)
        
        # Prepare environment
        env = os.environ.copy()
        
        # Build command - use proot if available and rootfs exists
        rootfs_path = '/app/rootfs'
        use_proot = os.path.exists('/usr/bin/proot') and os.path.isdir(rootfs_path)
        
        if use_proot:
            # Docker/Linux environment with proot
            env.update({
                'TERM': 'xterm-256color',
                'HOME': '/home/user',
                'USER': 'user',
                'SHELL': '/bin/bash',
                'PS1': r'\[\033[32m\]user@oslab\[\033[0m\]:\[\033[34m\]\w\[\033[0m\]\$ ',
                'PATH': '/usr/local/bin:/usr/bin:/bin',
                'LANG': 'en_US.UTF-8',
                'LC_ALL': 'en_US.UTF-8'
            })
            cmd = [
                '/usr/bin/proot',
                '-r', rootfs_path,
                '-w', '/home/user',
                '-0',  # Fake root
                '/bin/bash', '--login'
            ]
            logger.info(f"Starting proot sandbox for session {self.session_id}")
        else:
            # Local development (macOS/Linux without proot)
            home_dir = os.environ.get('HOME', '/tmp')
            env.update({
                'TERM': 'xterm-256color',
                'PS1': r'\[\033[32m\]user@oslab\[\033[0m\]:\[\033[34m\]\w\[\033[0m\]\$ ',
            })
            # Use zsh on macOS if available, otherwise bash
            shell = '/bin/zsh' if os.path.exists('/bin/zsh') else '/bin/bash'
            cmd = [shell, '-i']
            logger.info(f"Starting regular shell for session {self.session_id}")
        
        # Start the process
        self.process = await asyncio.create_subprocess_exec(
            *cmd,
            stdin=self.slave_fd,
            stdout=self.slave_fd,
            stderr=self.slave_fd,
            env=env,
            start_new_session=True
        )
        
        # Close slave in parent process
        os.close(self.slave_fd)
        self.slave_fd = None
        
        self._running = True
        
        # Start reader task
        self._reader_task = asyncio.create_task(self._read_output())
        
        logger.info(f"Sandbox started for session {self.session_id}, PID: {self.process.pid}")
    
    async def stop(self):
        """Stop the sandbox shell"""
        if not self._running:
            return
        
        self._running = False
        
        # Cancel reader task
        if self._reader_task:
            self._reader_task.cancel()
            try:
                await self._reader_task
            except asyncio.CancelledError:
                pass
        
        # Terminate process
        if self.process:
            try:
                self.process.terminate()
                await asyncio.wait_for(self.process.wait(), timeout=2.0)
            except asyncio.TimeoutError:
                self.process.kill()
                await self.process.wait()
            except ProcessLookupError:
                pass
        
        # Close master fd
        if self.master_fd is not None:
            try:
                os.close(self.master_fd)
            except OSError:
                pass
            self.master_fd = None
        
        logger.info(f"Sandbox stopped for session {self.session_id}")
    
    def set_output_callback(self, callback: Callable[[bytes], None]):
        """Set callback for output data"""
        self._output_callback = callback
    
    async def write(self, data: bytes):
        """Write data to the shell"""
        if self.master_fd is not None and self._running:
            try:
                os.write(self.master_fd, data)
            except OSError as e:
                logger.error(f"Write error for session {self.session_id}: {e}")
    
    async def resize(self, cols: int, rows: int):
        """Resize the terminal"""
        if self.master_fd is not None:
            try:
                winsize = struct.pack('HHHH', rows, cols, 0, 0)
                fcntl.ioctl(self.master_fd, termios.TIOCSWINSZ, winsize)
            except OSError as e:
                logger.error(f"Resize error for session {self.session_id}: {e}")
    
    async def _read_output(self):
        """Read output from the shell"""
        loop = asyncio.get_event_loop()
        
        while self._running and self.master_fd is not None:
            try:
                # Use asyncio to read from fd
                data = await loop.run_in_executor(
                    None,
                    self._safe_read
                )
                
                if data and self._output_callback:
                    self._output_callback(data)
                
                # Small delay to prevent CPU spin
                await asyncio.sleep(0.01)
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                if self._running:
                    logger.error(f"Read error for session {self.session_id}: {e}")
                break
    
    def _safe_read(self) -> Optional[bytes]:
        """Safely read from master fd"""
        if self.master_fd is None:
            return None
        try:
            return os.read(self.master_fd, 4096)
        except BlockingIOError:
            return None
        except OSError:
            return None
