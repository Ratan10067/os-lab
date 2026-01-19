import asyncio
import os
import pty
import select
import struct
import fcntl
import termios
from typing import Optional, Callable
import logging

logger = logging.getLogger(__name__)


class Sandbox:
    """
    A sandboxed shell environment for terminal sessions.
    """
    
    def __init__(self, session_id: str, user_folder: Optional[str] = None):
        self.session_id = session_id
        self.user_folder = user_folder
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
        
        # Prepare environment
        env = os.environ.copy()
        
        # Determine working directory
        work_dir = self.user_folder if self.user_folder and os.path.exists(self.user_folder) else None
        
        # Build command - use proot if available and rootfs exists
        rootfs_path = '/app/rootfs'
        use_proot = os.path.exists('/usr/bin/proot') and os.path.isdir(rootfs_path)
        
        if use_proot:
            # Docker/Linux environment with proot
            home_dir = self.user_folder or '/home/user'
            env.update({
                'TERM': 'xterm-256color',
                'HOME': home_dir,
                'USER': 'user',
                'SHELL': '/bin/bash',
                'PS1': '\\[\\033[32m\\]user@oslab\\[\\033[0m\\]:\\[\\033[34m\\]\\w\\[\\033[0m\\]\\$ ',
                'PATH': '/usr/local/bin:/usr/bin:/bin',
            })
            cmd = [
                '/usr/bin/proot',
                '-r', rootfs_path,
                '-w', home_dir,
                '-0',
                '/bin/bash', '--login'
            ]
            logger.info(f"Starting proot sandbox for session {self.session_id}")
        else:
            # Local development (macOS/Linux without proot)
            env['TERM'] = 'xterm-256color'
            if self.user_folder:
                os.makedirs(self.user_folder, exist_ok=True)
                env['HOME'] = self.user_folder
            shell = '/bin/zsh' if os.path.exists('/bin/zsh') else '/bin/bash'
            cmd = [shell]
            logger.info(f"Starting {shell} for session {self.session_id}, folder: {self.user_folder or 'default'}")
        
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
        """Read output from the shell continuously"""
        loop = asyncio.get_event_loop()
        
        while self._running and self.master_fd is not None:
            try:
                # Check if data is available using select with short timeout
                readable, _, _ = await loop.run_in_executor(
                    None,
                    lambda: select.select([self.master_fd], [], [], 0.05)
                )
                
                if readable:
                    try:
                        data = os.read(self.master_fd, 4096)
                        if data and self._output_callback:
                            self._output_callback(data)
                    except OSError as e:
                        if e.errno == 5:  # Input/output error - process likely exited
                            logger.info(f"Shell exited for session {self.session_id}")
                            break
                        logger.error(f"Read error: {e}")
                else:
                    # No data, small yield to prevent busy loop
                    await asyncio.sleep(0.01)
                    
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Read loop error for session {self.session_id}: {e}")
                await asyncio.sleep(0.1)
