import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, Depends
from fastapi.middleware.cors import CORSMiddleware
import logging

from .websocket import WebSocketManager
from .sessions import SessionManager
from .database import Database
from .models import UserCreate, UserLogin, TokenResponse, UserResponse
from .auth import create_user, authenticate_user, require_auth, get_current_user
from .config import get_settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup/shutdown"""
    # Startup
    logger.info("OS Lab Terminal API starting up...")
    try:
        await Database.connect()
    except Exception as e:
        logger.warning(f"MongoDB not available: {e}. Auth features disabled.")
    
    logger.info(f"Max sessions: {settings.max_sessions}")
    logger.info(f"Session timeout: {settings.session_timeout}s")
    
    yield
    
    # Shutdown
    logger.info("Shutting down, cleaning up sessions...")
    await session_manager.cleanup_all()
    await Database.disconnect()


# Create FastAPI app
app = FastAPI(
    title="OS Lab Terminal API",
    description="WebSocket-based terminal server for OS Lab",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
allowed_origins = settings.allowed_origins.split(",")
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


# ===== Auth Endpoints =====

@app.post("/api/auth/signup", response_model=TokenResponse)
async def signup(user_data: UserCreate):
    """Register a new user"""
    return await create_user(user_data)


@app.post("/api/auth/login", response_model=TokenResponse)
async def login(user_data: UserLogin):
    """Login and get access token"""
    return await authenticate_user(user_data.username, user_data.password)


@app.get("/api/auth/me", response_model=UserResponse)
async def get_me(user: dict = Depends(require_auth)):
    """Get current user info"""
    from bson import ObjectId
    return UserResponse(
        id=str(user["_id"]),
        username=user["username"],
        created_at=user["created_at"],
        folder_path=user["folder_path"]
    )


# ===== General Endpoints =====

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
            "stats": "/stats",
            "auth": {
                "signup": "/api/auth/signup",
                "login": "/api/auth/login",
                "me": "/api/auth/me"
            }
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


# ===== WebSocket Endpoint =====

@app.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket, 
    session: str = None,
    token: str = None
):
    """
    WebSocket endpoint for terminal sessions.
    
    Query params:
        session: Optional session ID. If not provided, a new one is created.
        token: Optional JWT token for authenticated sessions.
    """
    # Get user folder if authenticated
    user_folder = None
    if token:
        from .auth import decode_token
        from .database import get_database
        payload = decode_token(token)
        if payload:
            username = payload.get("sub")
            if username:
                try:
                    db = get_database()
                    user = await db.users.find_one({"username": username})
                    if user:
                        user_folder = user.get("folder_path")
                except:
                    pass
    
    await ws_manager.handle_connection(websocket, session, user_folder)
