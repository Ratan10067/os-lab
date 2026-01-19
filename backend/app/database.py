from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
import logging

from .config import get_settings

logger = logging.getLogger(__name__)

settings = get_settings()


class Database:
    client: Optional[AsyncIOMotorClient] = None
    
    @classmethod
    async def connect(cls):
        """Connect to MongoDB"""
        try:
            cls.client = AsyncIOMotorClient(settings.mongodb_url)
            # Verify connection
            await cls.client.admin.command('ping')
            logger.info("Connected to MongoDB")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise
    
    @classmethod
    async def disconnect(cls):
        """Disconnect from MongoDB"""
        if cls.client:
            cls.client.close()
            logger.info("Disconnected from MongoDB")
    
    @classmethod
    def get_db(cls):
        """Get database instance"""
        if cls.client is None:
            raise RuntimeError("Database not connected")
        return cls.client[settings.database_name]


def get_database():
    """Dependency for getting database"""
    return Database.get_db()
