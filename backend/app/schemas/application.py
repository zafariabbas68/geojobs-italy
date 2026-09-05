"""
Application schemas
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

class EducationEntry(BaseModel):
    institution: str
    degree: str
    field: str
    start_date: str
    end_date: Optional[str] = None
    gpa: Optional[str] = None
    description: Optional[str] = None

class WorkExperienceEntry(BaseModel):
    company: str
    title: str
    start_date: str
    end_date: Optional[str] = None
    current: bool = False
    description: Optional[str] = None
    skills_used: List[str] = []

class SkillEntry(BaseModel):
    name: str
    level: str  # beginner, intermediate, advanced, expert
    years: Optional[int] = None

class CertificationEntry(BaseModel):
    name: str
    issuer: str
    date: str
    expiry_date: Optional[str] = None
    credential_id: Optional[str] = None

class LanguageEntry(BaseModel):
    name: str
    proficiency: str  # native, fluent, professional, conversational, basic

class ApplicationCreate(BaseModel):
    # Personal Information
    first_name: str = Field(..., min_length=1)
    last_name: str = Field(..., min_length=1)
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    
    # Professional Information
    current_title: Optional[str] = None
    years_experience: Optional[int] = 0
    summary: Optional[str] = None
    
    # Application Content
    cover_letter_text: Optional[str] = None
    portfolio_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    
    # Structured Data
    education: Optional[List[EducationEntry]] = []
    work_experience: Optional[List[WorkExperienceEntry]] = []
    skills: Optional[List[SkillEntry]] = []
    certifications: Optional[List[CertificationEntry]] = []
    languages: Optional[List[LanguageEntry]] = []
    
    # Job-specific questions
    additional_answers: Optional[Dict[str, Any]] = {}

class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    match_score: Optional[int] = None

class ApplicationMessageCreate(BaseModel):
    message: str

class ApplicationResponse(BaseModel):
    id: uuid.UUID
    job_id: uuid.UUID
    candidate_id: uuid.UUID
    first_name: str
    last_name: str
    email: str
    status: str
    submitted_at: datetime
    match_score: Optional[int] = None
    notes: Optional[str] = None
    
    class Config:
        from_attributes = True
