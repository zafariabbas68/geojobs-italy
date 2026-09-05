"""
Company schemas for API validation
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class CompanyBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = None
    website: Optional[str] = None
    linkedin_url: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    province: Optional[str] = None
    country: str = "Italy"
    industry: Optional[str] = None
    employee_count: Optional[int] = None
    founded_year: Optional[int] = None

class CompanyCreate(CompanyBase):
    pass

class CompanyResponse(CompanyBase):
    id: uuid.UUID
    logo_url: Optional[str] = None
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
