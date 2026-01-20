import os
from pydantic_settings import BaseSettings
from pydantic import Field
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # MongoDB - reads from MONGODB_URL env var
    mongodb_url: str = Field(default="mongodb://localhost:27017")
    database_name: str = "oslab"
    
    # JWT - reads from JWT_SECRET env var
    jwt_secret: str = Field(default="your-secret-key-change-in-production")
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7  # 7 days
    
    # Admin Portal
    admin_secret: str = Field(default="change-this-admin-secret-in-production")
    
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
        # Enable reading env vars with different naming conventions
        populate_by_name = True


@lru_cache()
def get_settings() -> Settings:
    settings = Settings()
    # Log MongoDB connection info (masked for security)
    if settings.mongodb_url.startswith("mongodb+srv"):
        print(f"[Config] MongoDB: Using Atlas connection")
    else:
        print(f"[Config] MongoDB: {settings.mongodb_url[:30]}...")
    return settings
