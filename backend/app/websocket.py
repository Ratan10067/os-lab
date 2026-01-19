import json
import asyncio
from typing import Optional
from fastapi import WebSocket, WebSocketDisconnect
import logging

from .sessions import SessionManager, Session

logger = logging.getLogger(__name__)


class WebSocketManager:
    """Manages WebSocket connections for terminal sessions"""
    
    def __init__(self, session_manager: SessionManager):
        self.session_manager = session_manager
    
    async def handle_connection(self, websocket: WebSocket, session_id: Optional[str], user_folder: Optional[str] = None):
        """Handle a new WebSocket connection"""
        await websocket.accept()
        
        session: Optional[Session] = None
        
        try:
            # Create or get session with optional user folder
            session = await self.session_manager.create_session(session_id, user_folder)
            logger.info(f"WebSocket connected for session {session.id}")
            
            # Set up output callback to send data to client
            def on_output(data: bytes):
                asyncio.create_task(self._send_output(websocket, data))
            
            session.sandbox.set_output_callback(on_output)
            
            # Main message loop
            while True:
                message = await websocket.receive()
                
                if message["type"] == "websocket.disconnect":
                    break
                
                if "text" in message:
                    await self._handle_text_message(session, message["text"])
                elif "bytes" in message:
                    await self._handle_binary_message(session, message["bytes"])
        
        except WebSocketDisconnect:
            logger.info(f"WebSocket disconnected for session {session.id if session else 'unknown'}")
        
        except Exception as e:
            logger.error(f"WebSocket error: {e}")
            try:
                await websocket.close(code=1011, reason=str(e))
            except:
                pass
        
        finally:
            # Note: We don't remove the session immediately to allow reconnection
            # Sessions will be cleaned up by the timeout mechanism
            pass
    
    async def _send_output(self, websocket: WebSocket, data: bytes):
        """Send output data to the client"""
        try:
            await websocket.send_bytes(data)
        except Exception as e:
            logger.error(f"Error sending output: {e}")
    
    async def _handle_text_message(self, session: Session, text: str):
        """Handle text message from client"""
        session.touch()
        
        # Check if it's a JSON control message
        try:
            message = json.loads(text)
            
            if message.get("type") == "resize":
                cols = message.get("cols", 80)
                rows = message.get("rows", 24)
                await session.sandbox.resize(cols, rows)
                logger.debug(f"Resized terminal to {cols}x{rows}")
                return
            
            if message.get("type") == "ping":
                # Keep-alive ping
                return
        
        except json.JSONDecodeError:
            # Not JSON, treat as terminal input
            pass
        
        # Send as terminal input
        await session.sandbox.write(text.encode('utf-8'))
    
    async def _handle_binary_message(self, session: Session, data: bytes):
        """Handle binary message from client"""
        session.touch()
        await session.sandbox.write(data)
