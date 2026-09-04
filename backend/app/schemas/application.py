"""
Application schemas for API validation
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

class ApplicationBase(BaseModel):
    cover_letter: Optional[str] = None
    status: str = "pending"

class ApplicationCreate(ApplicationBase):
    job_id: uuid.UUID

class ApplicationUpdate(BaseModel):
    status: str
    notes: Optional[str] = None

class ApplicationResponse(ApplicationBase):
    id: uuid.UUID
    job_id: uuid.UUID
    candidate_id: uuid.UUID
    match_score: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
