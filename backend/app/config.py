import os
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # MongoDB
    mongodb_url: str = Field(default="mongodb://localhost:27017", env="MONGODB_URL")
    database_name: str = "oslab"
    
    # JWT
    jwt_secret: str = Field(default="your-secret-key-change-in-production", env="JWT_SECRET")
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7  # 7 days
    
    # Sessions
    max_sessions: int = 50
    session_timeout: int = 1800  # 30 minutes
    
    # Cleanup
    file_retention_days: int = 15
    
    # CORS
    allowed_origins: str = "*"
    
    class Config:
        env_file = ".env"
        extra = "allow"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
