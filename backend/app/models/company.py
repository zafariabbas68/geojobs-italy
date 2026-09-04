"""
Company model
"""

from sqlalchemy import Column, String, Boolean, DateTime, Integer, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
import uuid
from app.core.database import Base

class Company(Base):
    __tablename__ = "companies"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=True)  # Can be null for demo data
    name = Column(String(255), nullable=False)
    description = Column(Text)
    website = Column(String(255))
    linkedin_url = Column(String(255))
    location = Column(Geometry(geometry_type="POINT", srid=4326))
    address = Column(Text)
    city = Column(String(100))
    province = Column(String(100))
    country = Column(String(100), default="Italy")
    logo_url = Column(String(500))
    industry = Column(String(100))
    employee_count = Column(Integer)
    founded_year = Column(Integer)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    jobs = relationship("Job", back_populates="company")
