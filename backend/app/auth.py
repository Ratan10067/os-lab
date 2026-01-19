import os
from datetime import datetime, timedelta
from typing import Optional
import bcrypt
from jose import JWTError, jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import logging

from .config import get_settings
from .database import get_database
from .models import UserCreate, UserDocument, UserResponse, TokenResponse

logger = logging.getLogger(__name__)
settings = get_settings()

# JWT Bearer
security = HTTPBearer(auto_error=False)

# Users folder base path - use /tmp for development on macOS
USERS_BASE_PATH = os.environ.get("USERS_BASE_PATH", "/tmp/oslab_users")


def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    # Encode password to bytes and hash
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against hash"""
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.jwt_expire_minutes))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> Optional[dict]:
    """Decode JWT token"""
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        return payload
    except JWTError:
        return None


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Optional[dict]:
    """Get current user from JWT token"""
    if not credentials:
        return None
    
    payload = decode_token(credentials.credentials)
    if not payload:
        return None
    
    username = payload.get("sub")
    if not username:
        return None
    
    db = get_database()
    user = await db.users.find_one({"username": username})
    return user


async def require_auth(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Require authenticated user"""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    payload = decode_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    username = payload.get("sub")
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    db = get_database()
    user = await db.users.find_one({"username": username})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user


async def create_user(user_data: UserCreate) -> TokenResponse:
    """Create a new user"""
    try:
        db = get_database()
    except RuntimeError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection unavailable. Please try again later."
        )
    
    # Check if username exists
    existing = await db.users.find_one({"username": user_data.username})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )
    
    # Check if email exists
    existing_email = await db.users.find_one({"email": user_data.email})
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user folder path
    folder_path = f"{USERS_BASE_PATH}/{user_data.username}"
    
    # Create user document
    user_doc = UserDocument(
        username=user_data.username,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        folder_path=folder_path,
        created_at=datetime.utcnow()
    )
    
    # Insert into database
    result = await db.users.insert_one(user_doc.model_dump())
    
    # Create indexes for username and email (unique)
    try:
        await db.users.create_index("username", unique=True)
        await db.users.create_index("email", unique=True)
    except Exception as e:
        logger.debug(f"Index already exists or creation failed: {e}")
    
    # Create user folder on filesystem
    try:
        os.makedirs(folder_path, exist_ok=True)
        # Create a welcome file
        with open(f"{folder_path}/README.txt", "w") as f:
            f.write(f"Welcome to OS Lab, {user_data.username}!\n")
            f.write("Your files will be stored here.\n")
            f.write("Files are automatically deleted after 15 days.\n")
    except Exception as e:
        logger.error(f"Failed to create user folder: {e}")
    
    # Generate token
    access_token = create_access_token(data={"sub": user_data.username})
    
    logger.info(f"Created user: {user_data.username} ({user_data.email})")
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse(
            id=str(result.inserted_id),
            username=user_data.username,
            email=user_data.email,
            created_at=user_doc.created_at,
            folder_path=folder_path
        )
    )


async def authenticate_user(username: str, password: str) -> TokenResponse:
    """Authenticate user and return token"""
    try:
        db = get_database()
    except RuntimeError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection unavailable. Please try again later."
        )
    
    user = await db.users.find_one({"username": username})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    if not verify_password(password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    # Update last active
    await db.users.update_one(
        {"username": username},
        {"$set": {"last_active": datetime.utcnow()}}
    )
    
    # Generate token
    access_token = create_access_token(data={"sub": username})
    
    logger.info(f"User logged in: {username}")
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse(
            id=str(user["_id"]),
            username=user["username"],
            email=user.get("email", ""),
            created_at=user["created_at"],
            folder_path=user["folder_path"]
        )
    )
