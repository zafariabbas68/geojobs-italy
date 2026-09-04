"""
Configuration settings for GeoJobs Italy
"""

from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    APP_NAME: str = "GeoJobs Italy"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    API_PREFIX: str = "/api"
    API_V1_PREFIX: str = "/api/v1"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-this")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database - use the container name directly
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@geojobs-postgres:5432/geojobs")
    POSTGIS_URL: str = os.getenv("POSTGIS_URL", "postgresql://postgres:postgres@geojobs-postgres:5432/geojobs")
    
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://geojobs-redis:6379/0")
    
    ALLOWED_ORIGINS: List[str] = ["*"]
    ALLOWED_HOSTS: List[str] = ["*"]
    
    APIFY_API_TOKEN: str = os.getenv("APIFY_API_TOKEN", "")
    
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", 587))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_PERIOD: int = 60
    
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024
    ALLOWED_FILE_TYPES: List[str] = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
