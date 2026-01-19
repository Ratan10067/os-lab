import os
import asyncio
import time
import uuid
from dataclasses import dataclass, field
from typing import Dict, Optional
import logging

from .sandbox import Sandbox

logger = logging.getLogger(__name__)


@dataclass
class Session:
    """Represents a terminal session"""
    id: str
    sandbox: Sandbox
    created_at: float = field(default_factory=time.time)
    last_activity: float = field(default_factory=time.time)
    
    def touch(self):
        """Update last activity time"""
        self.last_activity = time.time()
    
    def is_expired(self, timeout: int) -> bool:
        """Check if session has expired"""
        return time.time() - self.last_activity > timeout


class SessionManager:
    """Manages terminal sessions"""
    
    def __init__(self):
        self.sessions: Dict[str, Session] = {}
        self.max_sessions = int(os.getenv("MAX_SESSIONS", "50"))
        self.session_timeout = int(os.getenv("SESSION_TIMEOUT", "1800"))  # 30 minutes
        self._cleanup_task: Optional[asyncio.Task] = None
        self._lock = asyncio.Lock()
    
    async def create_session(self, session_id: Optional[str] = None, user_folder: Optional[str] = None) -> Session:
        """Create a new terminal session"""
        async with self._lock:
            # Check session limit
            if len(self.sessions) >= self.max_sessions:
                # Try to clean up expired sessions first
                await self._cleanup_expired()
                
                if len(self.sessions) >= self.max_sessions:
                    raise RuntimeError("Maximum session limit reached")
            
            # Generate session ID if not provided
            if not session_id:
                session_id = str(uuid.uuid4())
            
            # Check if session already exists
            if session_id in self.sessions:
                session = self.sessions[session_id]
                session.touch()
                return session
            
            # Create new sandbox and session with optional user folder
            sandbox = Sandbox(session_id, user_folder)
            await sandbox.start()
            
            session = Session(id=session_id, sandbox=sandbox)
            self.sessions[session_id] = session
            
            logger.info(f"Created session {session_id}, total: {len(self.sessions)}")
            
            # Start cleanup task if not running
            if self._cleanup_task is None or self._cleanup_task.done():
                self._cleanup_task = asyncio.create_task(self._cleanup_loop())
            
            return session
    
    async def get_session(self, session_id: str) -> Optional[Session]:
        """Get a session by ID"""
        session = self.sessions.get(session_id)
        if session:
            session.touch()
        return session
    
    async def remove_session(self, session_id: str):
        """Remove and cleanup a session"""
        async with self._lock:
            if session_id in self.sessions:
                session = self.sessions.pop(session_id)
                await session.sandbox.stop()
                logger.info(f"Removed session {session_id}, remaining: {len(self.sessions)}")
    
    def get_active_count(self) -> int:
        """Get count of active sessions"""
        return len(self.sessions)
    
    async def _cleanup_expired(self):
        """Remove expired sessions"""
        expired = [
            sid for sid, session in self.sessions.items()
            if session.is_expired(self.session_timeout)
        ]
        
        for session_id in expired:
            session = self.sessions.pop(session_id, None)
            if session:
                await session.sandbox.stop()
                logger.info(f"Cleaned up expired session {session_id}")
    
    async def _cleanup_loop(self):
        """Background task to cleanup expired sessions"""
        while True:
            await asyncio.sleep(60)  # Check every minute
            try:
                async with self._lock:
                    await self._cleanup_expired()
            except Exception as e:
                logger.error(f"Cleanup error: {e}")
    
    async def cleanup_all(self):
        """Cleanup all sessions (for shutdown)"""
        async with self._lock:
            for session in list(self.sessions.values()):
                try:
                    await session.sandbox.stop()
                except Exception as e:
                    logger.error(f"Error stopping session {session.id}: {e}")
            self.sessions.clear()
        
        if self._cleanup_task:
            self._cleanup_task.cancel()
