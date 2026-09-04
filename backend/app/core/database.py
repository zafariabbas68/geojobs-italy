"""
Database configuration and session management
"""

from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings
import time

# Create engine with PostGIS support
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    echo=settings.DEBUG
)

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base model class
Base = declarative_base()

def get_db() -> Session:
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# PostGIS specific functions
def enable_postgis(engine):
    """Enable PostGIS extension on database"""
    max_retries = 5
    retry_delay = 3
    
    for attempt in range(max_retries):
        try:
            with engine.connect() as conn:
                # Check if we can connect first
                conn.execute(text("SELECT 1"))
                
                # Enable PostGIS extensions
                conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
                conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis_topology;"))
                conn.commit()
                print("✅ PostGIS extensions enabled successfully")
                return
        except Exception as e:
            print(f"⚠️ Attempt {attempt + 1}/{max_retries} failed: {e}")
            if attempt < max_retries - 1:
                print(f"   Waiting {retry_delay}s before retry...")
                time.sleep(retry_delay)
            else:
                print("❌ Could not enable PostGIS after all retries")
                raise

# Enable PostGIS on startup with retries
try:
    enable_postgis(engine)
except Exception as e:
    print(f"⚠️ PostGIS setup warning: {e}")
    print("   Continuing anyway...")
