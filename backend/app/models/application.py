"""
Application models - Complete application system
"""

from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer, Text, Float, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.core.database import Base

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"), nullable=False)
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("candidates.id"), nullable=False)
    
    # Personal Information
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(20))
    address = Column(Text)
    city = Column(String(100))
    country = Column(String(100))
    
    # Professional Information
    current_title = Column(String(255))
    years_experience = Column(Integer, default=0)
    summary = Column(Text)
    
    # Application Documents
    cv_url = Column(String(500))
    cover_letter_url = Column(String(500))
    cover_letter_text = Column(Text)
    portfolio_url = Column(String(500))
    linkedin_url = Column(String(255))
    github_url = Column(String(255))
    
    # Education
    education = Column(JSON)  # List of education entries
    
    # Work Experience
    work_experience = Column(JSON)  # List of work experience entries
    
    # Skills & Certifications
    skills = Column(JSON)  # List of skills
    certifications = Column(JSON)  # List of certifications
    languages = Column(JSON)  # List of languages
    
    # Additional Questions (job-specific)
    additional_answers = Column(JSON)
    
    # Status
    status = Column(String(50), default="pending")  # pending, reviewed, shortlisted, interviewed, offered, rejected, hired
    match_score = Column(Integer)
    notes = Column(Text)
    
    # Timestamps
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    reviewed_at = Column(DateTime(timezone=True))
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    job = relationship("Job", back_populates="applications")
    candidate = relationship("Candidate", back_populates="applications")
    messages = relationship("ApplicationMessage", back_populates="application")

class ApplicationMessage(Base):
    __tablename__ = "application_messages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id"), nullable=False)
    sender_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    application = relationship("Application", back_populates="messages")
    sender = relationship("User")

class ApplicationDocument(Base):
    __tablename__ = "application_documents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id"), nullable=False)
    document_type = Column(String(50))  # cv, cover_letter, portfolio, certificate, etc.
    file_name = Column(String(255))
    file_url = Column(String(500))
    file_size = Column(Integer)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    application = relationship("Application", back_populates="documents")
