import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from .websocket import WebSocketManager
from .sessions import SessionManager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="OS Lab Terminal API",
    description="WebSocket-based terminal server for OS Lab",
    version="1.0.0"
)

# CORS configuration
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins[0] != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize managers
session_manager = SessionManager()
ws_manager = WebSocketManager(session_manager)


@app.get("/")
async def root():
    """Root endpoint with API info"""
    return {
        "name": "OS Lab Terminal API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "websocket": "/ws",
            "health": "/health",
            "stats": "/stats"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "active_sessions": session_manager.get_active_count()
    }


@app.get("/stats")
async def get_stats():
    """Get server statistics"""
    return {
        "active_sessions": session_manager.get_active_count(),
        "max_sessions": session_manager.max_sessions,
        "uptime": "running"
    }


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, session: str = None):
    """
    WebSocket endpoint for terminal sessions.
    
    Query params:
        session: Optional session ID. If not provided, a new one is created.
    """
    await ws_manager.handle_connection(websocket, session)


@app.on_event("startup")
async def startup_event():
    """Initialize on startup"""
    logger.info("OS Lab Terminal API starting up...")
    logger.info(f"Max sessions: {session_manager.max_sessions}")
    logger.info(f"Session timeout: {session_manager.session_timeout}s")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down, cleaning up sessions...")
    await session_manager.cleanup_all()
