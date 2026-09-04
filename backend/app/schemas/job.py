"""
Job schemas for API validation
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
import uuid

class JobBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: str = Field(..., min_length=20)
    requirements: Optional[str] = None
    city: Optional[str] = None
    province: Optional[str] = None
    country: str = "Italy"
    is_remote: bool = False
    job_type: str = "FULL_TIME"
    experience_level: str = "MID"
    salary_min: Optional[int] = Field(None, ge=0)
    salary_max: Optional[int] = Field(None, ge=0)
    salary_currency: str = "EUR"
    skills: List[str] = []
    category: Optional[str] = None
    subcategory: Optional[str] = None

class JobCreate(JobBase):
    @validator('job_type')
    def validate_job_type(cls, v):
        valid_types = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE']
        v_upper = v.upper()
        if v_upper not in valid_types:
            mapping = {
                'FULL TIME': 'FULL_TIME',
                'PART TIME': 'PART_TIME',
                'FULLTIME': 'FULL_TIME',
                'PARTTIME': 'PART_TIME',
            }
            if v_upper in mapping:
                return mapping[v_upper]
            return 'FULL_TIME'
        return v_upper
    
    @validator('experience_level')
    def validate_experience_level(cls, v):
        valid_levels = ['ENTRY', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE']
        v_upper = v.upper()
        if v_upper not in valid_levels:
            mapping = {
                'JUNIOR': 'ENTRY',
                'INTERMEDIATE': 'MID',
                'SENIOR': 'SENIOR',
            }
            if v_upper in mapping:
                return mapping[v_upper]
            return 'MID'
        return v_upper

class JobResponse(BaseModel):
    id: uuid.UUID
    company_id: uuid.UUID
    title: str
    description: str
    requirements: Optional[str] = None
    city: Optional[str] = None
    province: Optional[str] = None
    country: str
    is_remote: bool
    job_type: str
    experience_level: str
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: str
    skills: List[str]
    category: Optional[str] = None
    subcategory: Optional[str] = None
    status: str
    views_count: int
    applications_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    company_name: Optional[str] = None
    
    class Config:
        from_attributes = True
