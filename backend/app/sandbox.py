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
        work_dir = None
        if self.user_folder:
            # Try to create the user folder if it doesn't exist
            try:
                os.makedirs(self.user_folder, exist_ok=True)
                work_dir = self.user_folder
            except (OSError, PermissionError) as e:
                # If we can't create the folder (e.g., /home/users on macOS), 
                # fall back to /tmp with a safe folder name
                logger.warning(f"Cannot create {self.user_folder}: {e}, falling back to /tmp")
                fallback_folder = f"/tmp/oslab_users/{os.path.basename(self.user_folder)}"
                try:
                    os.makedirs(fallback_folder, exist_ok=True)
                    work_dir = fallback_folder
                    self.user_folder = fallback_folder  # Update for later use
                except Exception as e2:
                    logger.error(f"Cannot create fallback folder: {e2}")
        
        if work_dir is None:
            work_dir = "/tmp"
        
        # Build command - use proot if available and rootfs exists
        rootfs_path = '/app/rootfs'
        use_proot = os.path.exists('/usr/bin/proot') and os.path.isdir(rootfs_path)
        
        if use_proot:
            # Docker/Linux environment with proot
            # Extract username from folder path (e.g., /home/users/username -> username)
            username = os.path.basename(self.user_folder) if self.user_folder else 'user'
            home_dir = f'/home/{username}'
            
            env.update({
                'TERM': 'xterm-256color',
                'HOME': home_dir,
                'USER': username,
                'SHELL': '/bin/bash',
                'PS1': f'\\[\\033[32m\\]{username}@oslab\\[\\033[0m\\]:\\[\\033[34m\\]\\w\\[\\033[0m\\]\\$ ',
                'PATH': '/usr/local/bin:/usr/bin:/bin',
            })
            
            # Use proot to jail user in their home directory
            # -r: set root filesystem
            # -b: bind mount directories
            # -w: set working directory
            # -0: simulate root user
            cmd = [
                '/usr/bin/proot',
                '-r', rootfs_path,
                '-b', '/dev',
                '-b', '/proc',
                '-b', f'{self.user_folder or "/tmp"}:{home_dir}',  # Mount user's real folder to /home/username
                '-w', home_dir,
                '-0',
                '/bin/bash', '--login', '--restricted'  # restricted bash prevents cd outside
            ]
            logger.info(f"Starting proot sandbox for session {self.session_id}, user: {username}")
        else:
            # Local development (macOS/Linux without proot)
            # Create a restricted shell environment that prevents escaping user's folder
            username = os.path.basename(self.user_folder) if self.user_folder else 'user'
            
            env['TERM'] = 'xterm-256color'
            env['HOME'] = work_dir
            env['USER'] = username
            env['OSLAB_ROOT'] = work_dir  # Our custom var to track allowed root
            
            # Create a custom rcfile that overrides cd to prevent escaping
            rc_content = f'''
# OS Lab Restricted Shell Configuration
export PS1="\\[\\033[32m\\]{username}@oslab\\[\\033[0m\\]:\\[\\033[34m\\]\\w\\[\\033[0m\\]\\$ "
export OSLAB_ROOT="{work_dir}"

# Override cd to prevent escaping user's folder
cd() {{
    local target="${{1:-$HOME}}"
    local abs_path
    
    # Handle special cases
    if [ "$target" = "-" ]; then
        builtin cd - 2>/dev/null || echo "cd: OLDPWD not set"
        return
    fi
    
    # Resolve absolute path
    if [[ "$target" = /* ]]; then
        # Already absolute
        abs_path="$target"
    elif [[ "$target" = "~"* ]]; then
        # Home-relative
        abs_path="${{HOME}}${{target:1}}"
    else
        # Relative path - resolve from current directory
        abs_path="$(pwd)/$target"
    fi
    
    # Normalize path (resolve . and ..)
    abs_path=$(cd "${{abs_path%/*}}" 2>/dev/null && pwd)"/${{abs_path##*/}}" 2>/dev/null || abs_path="$target"
    
    # Remove trailing slash for comparison
    abs_path="${{abs_path%/}}"
    local root="${{OSLAB_ROOT%/}}"
    
    # Check if path is within allowed root or is the root itself
    if [[ "$abs_path" == "$root" ]] || [[ "$abs_path" == "$root/"* ]]; then
        if [ -d "$target" ]; then
            builtin cd "$target"
        else
            echo "cd: $target: No such file or directory"
            return 1
        fi
    else
        echo "cd: Permission denied - cannot navigate outside your home folder"
        return 1
    fi
}}

# Also restrict pushd and popd
pushd() {{ echo "pushd: Permission denied - restricted shell"; return 1; }}
popd() {{ echo "popd: Permission denied - restricted shell"; return 1; }}

# Start in user's home
builtin cd "$HOME"

# Force prompt to appear (empty command)
:
'''
            
            # Write the rcfile to the user's folder
            rcfile_path = os.path.join(work_dir, '.oslab_bashrc')
            try:
                with open(rcfile_path, 'w') as f:
                    f.write(rc_content)
            except Exception as e:
                logger.error(f"Failed to create rcfile: {e}")
            
            # Use bash with our custom rcfile
            cmd = ['/bin/bash', '--rcfile', rcfile_path]
            logger.info(f"Starting restricted bash for session {self.session_id}, user: {username}, folder: {work_dir}")
        
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
