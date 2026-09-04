from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db

router = APIRouter()

@router.get("/")
async def get_analytics(
    db: Session = Depends(get_db)
):
    """Get platform analytics"""
    return {
        "total_jobs": 0,
        "total_candidates": 0,
        "total_applications": 0,
        "active_companies": 0
    }

@router.get("/jobs")
async def job_analytics(
    db: Session = Depends(get_db)
):
    """Get job analytics"""
    return {
        "jobs_by_type": {"full_time": 0, "part_time": 0},
        "jobs_by_location": {},
        "trending_skills": []
    }
