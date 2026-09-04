"""
Jobs API endpoints - FIXED
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User, Company
from app.models.job import Job
from app.schemas.job import JobCreate
from datetime import datetime, timedelta

router = APIRouter()

@router.get("")
@router.get("/")
async def list_jobs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    search: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List all jobs"""
    try:
        query = db.query(Job)
        
        if search:
            query = query.filter(
                Job.title.ilike(f"%{search}%") |
                Job.description.ilike(f"%{search}%")
            )
        
        if category:
            query = query.filter(Job.category.ilike(f"%{category}%"))
        
        jobs = query.offset(skip).limit(limit).all()
        
        result = []
        for job in jobs:
            result.append({
                "id": str(job.id),
                "title": job.title,
                "description": job.description[:200] if job.description else "",
                "company_name": job.company.name if job.company else "Unknown",
                "city": job.city or "Italy",
                "job_type": job.job_type or "FULL_TIME",
                "experience_level": job.experience_level or "MID",
                "salary_min": job.salary_min,
                "salary_max": job.salary_max,
                "skills": job.skills or [],
                "category": job.category or "General",
                "created_at": job.created_at.isoformat() if job.created_at else None
            })
        
        return result
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return []

@router.get("/test")
async def test():
    return {"message": "Jobs API is working"}

@router.post("")
@router.post("/")
async def create_job(
    job_data: JobCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a job"""
    try:
        company = db.query(Company).filter(Company.user_id == current_user.id).first()
        if not company:
            company = Company(
                user_id=current_user.id,
                name=f"{current_user.first_name}'s Company",
                city=job_data.city or "Milan",
                province="Lombardy",
                country="Italy"
            )
            db.add(company)
            db.commit()
            db.refresh(company)
        
        job = Job(
            company_id=company.id,
            title=job_data.title,
            description=job_data.description,
            city=job_data.city,
            province=job_data.province or "Lombardy",
            country=job_data.country or "Italy",
            job_type=job_data.job_type,
            experience_level=job_data.experience_level,
            salary_min=job_data.salary_min or 0,
            salary_max=job_data.salary_max or 0,
            skills=job_data.skills or [],
            category=job_data.category,
            subcategory=job_data.subcategory,
            status="PUBLISHED"
        )
        
        db.add(job)
        db.commit()
        db.refresh(job)
        
        return {"message": "Job created", "id": str(job.id)}
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        return {"error": str(e)}

@router.get("/{job_id}")
async def get_job(job_id: str, db: Session = Depends(get_db)):
    """Get a single job"""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        return {"error": "Job not found"}
    
    return {
        "id": str(job.id),
        "title": job.title,
        "description": job.description,
        "company_name": job.company.name if job.company else "Unknown",
        "city": job.city,
        "job_type": job.job_type,
        "experience_level": job.experience_level,
        "salary_min": job.salary_min,
        "salary_max": job.salary_max,
        "skills": job.skills or [],
        "category": job.category,
        "subcategory": job.subcategory
    }
