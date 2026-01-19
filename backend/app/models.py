from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    """Schema for user registration"""
    username: str = Field(..., min_length=3, max_length=30, pattern=r'^[a-zA-Z0-9_]+$')
    password: str = Field(..., min_length=6, max_length=100)


class UserLogin(BaseModel):
    """Schema for user login"""
    username: str
    password: str


class UserResponse(BaseModel):
    """Schema for user response (no password)"""
    id: str
    username: str
    created_at: datetime
    folder_path: str


class TokenResponse(BaseModel):
    """Schema for token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class UserDocument(BaseModel):
    """Schema for user document in MongoDB"""
    username: str
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    folder_path: str
    last_active: Optional[datetime] = None
