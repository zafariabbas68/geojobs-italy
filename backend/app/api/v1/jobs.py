"""
Jobs API endpoints - Enhanced with filters
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User, Company
from app.models.job import Job
from app.schemas.job import JobCreate

router = APIRouter()

# Italian regions mapping
ITALY_REGIONS = {
    "Lombardy": ["Milan", "Bergamo", "Brescia", "Monza", "Como", "Varese", "Pavia", "Cremona", "Mantua"],
    "Lazio": ["Rome", "Latina", "Viterbo", "Rieti", "Frosinone"],
    "Campania": ["Naples", "Salerno", "Caserta", "Avellino", "Benevento"],
    "Veneto": ["Venice", "Verona", "Padua", "Vicenza", "Treviso", "Rovigo"],
    "Emilia-Romagna": ["Bologna", "Parma", "Modena", "Reggio Emilia", "Rimini", "Ravenna", "Ferrara"],
    "Piedmont": ["Turin", "Novara", "Alessandria", "Asti", "Cuneo", "Vercelli"],
    "Tuscany": ["Florence", "Pisa", "Siena", "Lucca", "Arezzo", "Livorno", "Prato"],
    "Puglia": ["Bari", "Lecce", "Taranto", "Brindisi", "Foggia"],
    "Sicily": ["Palermo", "Catania", "Messina", "Syracuse", "Trapani"],
    "Sardinia": ["Cagliari", "Sassari", "Nuoro", "Oristano"],
}

JOB_CATEGORIES = [
    "GIS & Geospatial",
    "Remote Sensing & Earth Observation",
    "Surveying & Geodesy",
    "Civil Engineering",
    "Environmental Engineering",
    "Software & Data Engineering",
    "Aerospace & Defense",
    "Industrial & Manufacturing",
    "Energy & Utilities",
    "General"
]

@router.get("/")
async def list_jobs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    search: Optional[str] = None,
    category: Optional[str] = None,
    region: Optional[str] = None,
    city: Optional[str] = None,
    date_range: Optional[str] = Query(None, regex="^(24h|3d|7d|14d|30d)$"),
    db: Session = Depends(get_db)
):
    """List all jobs with enhanced filters"""
    try:
        query = db.query(Job)
        
        # Search filter
        if search:
            query = query.filter(
                Job.title.ilike(f"%{search}%") |
                Job.description.ilike(f"%{search}%") |
                Job.category.ilike(f"%{search}%")
            )
        
        # Category filter
        if category:
            query = query.filter(Job.category.ilike(f"%{category}%"))
        
        # Region filter - check if city belongs to region
        if region and region in ITALY_REGIONS:
            region_cities = ITALY_REGIONS[region]
            city_conditions = [Job.city.ilike(f"%{city}%") for city in region_cities]
            query = query.filter(sqlalchemy.or_(*city_conditions))
        
        # City filter
        if city:
            query = query.filter(Job.city.ilike(f"%{city}%"))
        
        # Date range filter
        if date_range:
            days = {"24h": 1, "3d": 3, "7d": 7, "14d": 14, "30d": 30}
            days_ago = days.get(date_range, 14)
            cutoff_date = datetime.now() - timedelta(days=days_ago)
            query = query.filter(Job.created_at >= cutoff_date)
        
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
                "region": get_region(job.city) if job.city else "Unknown",
                "created_at": job.created_at.isoformat() if job.created_at else None
            })
        
        return result
    except Exception as e:
        print(f"Error in list_jobs: {e}")
        import traceback
        traceback.print_exc()
        return []

@router.get("/filters")
async def get_filters(db: Session = Depends(get_db)):
    """Get available filters"""
    # Get all categories from database
    categories = db.query(Job.category).distinct().all()
    category_list = [c[0] for c in categories if c[0]]
    
    # Get all cities
    cities = db.query(Job.city).distinct().all()
    city_list = [c[0] for c in cities if c[0]]
    
    return {
        "categories": category_list or JOB_CATEGORIES,
        "regions": list(ITALY_REGIONS.keys()),
        "cities": city_list,
        "date_ranges": ["24h", "3d", "7d", "14d", "30d"]
    }

def get_region(city: str) -> str:
    """Get region from city"""
    if not city:
        return "Unknown"
    city_lower = city.lower()
    for region, cities in ITALY_REGIONS.items():
        for c in cities:
            if c.lower() in city_lower or city_lower in c.lower():
                return region
    return "Other"

@router.post("/")
async def create_job(
    job_data: JobCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new job posting"""
    try:
        print(f"Creating job for user: {current_user.email}")
        
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
            category=job_data.category or "General",
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
        "subcategory": job.subcategory,
        "region": get_region(job.city) if job.city else "Unknown"
    }
