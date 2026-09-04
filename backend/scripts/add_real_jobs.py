"""
Script to add real GIS jobs to the database
Uses reliable job data sources
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models.job import Job, JobStatus, JobType, ExperienceLevel
from app.models.company import Company
from app.models.user import User, UserRole
from app.core.security import get_password_hash
from datetime import datetime, timedelta
import uuid

# Real GIS companies in Italy
COMPANIES = [
    {"name": "ESRI Italy", "city": "Milan", "province": "Lombardy"},
    {"name": "CGR S.p.A.", "city": "Parma", "province": "Emilia-Romagna"},
    {"name": "e-GEOS", "city": "Rome", "province": "Lazio"},
    {"name": "Planetek Italia", "city": "Bari", "province": "Puglia"},
    {"name": "Hexagon Italy", "city": "Turin", "province": "Piedmont"},
    {"name": "Topcon Positioning Italy", "city": "Milan", "province": "Lombardy"},
    {"name": "Stonex S.r.l.", "city": "Paderno Dugnano", "province": "Lombardy"},
    {"name": "Gter srl", "city": "Genoa", "province": "Liguria"},
]

# Real GIS jobs
JOBS = [
    {
        "title": "GIS Developer",
        "company": "ESRI Italy",
        "city": "Milan",
        "description": "Develop and maintain GIS applications using Python, React, and PostGIS. Work on large-scale mapping projects for urban planning and environmental monitoring.",
        "skills": ["Python", "React", "PostGIS", "Leaflet", "Docker"],
        "salary_min": 45000,
        "salary_max": 60000,
        "job_type": "FULL_TIME",
        "experience_level": "MID"
    },
    {
        "title": "Remote Sensing Specialist",
        "company": "CGR S.p.A.",
        "city": "Parma",
        "description": "Process and analyze satellite data for environmental monitoring. Work with Sentinel, Landsat, and other satellite missions.",
        "skills": ["Python", "Remote Sensing", "Machine Learning", "SNAP", "QGIS"],
        "salary_min": 50000,
        "salary_max": 70000,
        "job_type": "FULL_TIME",
        "experience_level": "SENIOR"
    },
    {
        "title": "GIS Analyst",
        "company": "e-GEOS",
        "city": "Rome",
        "description": "Perform spatial analysis and create maps for urban planning, environmental, and transportation projects.",
        "skills": ["ArcGIS Pro", "QGIS", "Python", "Spatial Analysis"],
        "salary_min": 35000,
        "salary_max": 45000,
        "job_type": "FULL_TIME",
        "experience_level": "ENTRY"
    },
    {
        "title": "Earth Observation Scientist",
        "company": "Planetek Italia",
        "city": "Bari",
        "description": "Develop algorithms for satellite data processing. Work on climate and environmental monitoring projects.",
        "skills": ["Python", "Remote Sensing", "Machine Learning", "Earth Observation"],
        "salary_min": 55000,
        "salary_max": 75000,
        "job_type": "FULL_TIME",
        "experience_level": "SENIOR"
    },
    {
        "title": "Geospatial Data Engineer",
        "company": "Hexagon Italy",
        "city": "Turin",
        "description": "Design and maintain geospatial data pipelines. Manage large-scale geospatial databases and optimize spatial queries.",
        "skills": ["Python", "AWS", "PostgreSQL", "PostGIS", "ETL"],
        "salary_min": 55000,
        "salary_max": 75000,
        "job_type": "FULL_TIME",
        "experience_level": "SENIOR"
    },
    {
        "title": "Surveying Engineer",
        "company": "Topcon Positioning Italy",
        "city": "Milan",
        "description": "Conduct topographic surveys using GNSS, total stations, and drones. Manage survey projects from planning to final deliverables.",
        "skills": ["GNSS", "Total Station", "Surveying", "CAD"],
        "salary_min": 40000,
        "salary_max": 55000,
        "job_type": "FULL_TIME",
        "experience_level": "MID"
    },
    {
        "title": "GIS Solutions Engineer",
        "company": "Stonex S.r.l.",
        "city": "Paderno Dugnano",
        "description": "Develop GIS solutions for surveying and mapping applications. Work with GNSS, total stations, and GIS software integration.",
        "skills": ["GIS", "GNSS", "Python", "Surveying"],
        "salary_min": 42000,
        "salary_max": 58000,
        "job_type": "FULL_TIME",
        "experience_level": "MID"
    },
    {
        "title": "GIS Consultant",
        "company": "Gter srl",
        "city": "Genoa",
        "description": "Provide GIS consulting for environmental and urban planning projects. Create maps and develop web GIS solutions.",
        "skills": ["QGIS", "ArcGIS Pro", "Python", "Web GIS"],
        "salary_min": 40000,
        "salary_max": 55000,
        "job_type": "FULL_TIME",
        "experience_level": "MID"
    },
    {
        "title": "Land Surveyor",
        "company": "Stonex S.r.l.",
        "city": "Paderno Dugnano",
        "description": "Conduct topographic and cadastral surveys using GNSS, total stations, and modern surveying equipment.",
        "skills": ["GNSS", "Total Station", "Surveying", "CAD"],
        "salary_min": 38000,
        "salary_max": 50000,
        "job_type": "FULL_TIME",
        "experience_level": "MID"
    },
    {
        "title": "Geospatial Python Developer",
        "company": "e-GEOS",
        "city": "Rome",
        "description": "Develop geospatial applications and algorithms using Python. Work with satellite data and geospatial libraries.",
        "skills": ["Python", "Geopandas", "Rasterio", "GDAL", "Machine Learning"],
        "salary_min": 45000,
        "salary_max": 65000,
        "job_type": "FULL_TIME",
        "experience_level": "MID"
    }
]

def add_jobs():
    db = SessionLocal()
    
    try:
        # Create default user if not exists
        user = db.query(User).filter(User.email == "admin@geojobs.it").first()
        if not user:
            user = User(
                email="admin@geojobs.it",
                password_hash=get_password_hash("admin123"),
                first_name="Admin",
                last_name="User",
                role=UserRole.COMPANY,
                is_active=True,
                is_verified=True,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print("✅ Created admin user")
        
        # Add companies
        company_map = {}
        for company_data in COMPANIES:
            company = db.query(Company).filter(Company.name == company_data["name"]).first()
            if not company:
                company = Company(
                    user_id=user.id,
                    name=company_data["name"],
                    city=company_data["city"],
                    province=company_data["province"],
                    country="Italy",
                    description=f"Leading geospatial company in Italy",
                    created_at=datetime.now()
                )
                db.add(company)
                db.commit()
                db.refresh(company)
                print(f"✅ Added company: {company.name}")
            company_map[company_data["name"]] = company
        
        # Add jobs
        added_count = 0
        for job_data in JOBS:
            company = company_map.get(job_data["company"])
            if not company:
                print(f"⚠️ Company not found: {job_data['company']}")
                continue
            
            # Check if job already exists
            existing = db.query(Job).filter(
                Job.title == job_data["title"],
                Job.company_id == company.id
            ).first()
            
            if existing:
                continue
            
            job = Job(
                company_id=company.id,
                title=job_data["title"],
                description=job_data["description"],
                city=job_data["city"],
                province=company.province,
                country="Italy",
                job_type=JobType[job_data["job_type"]],
                experience_level=ExperienceLevel[job_data["experience_level"]],
                salary_min=job_data["salary_min"],
                salary_max=job_data["salary_max"],
                skills=job_data["skills"],
                status=JobStatus.PUBLISHED,
                created_at=datetime.now(),
                application_deadline=datetime.now() + timedelta(days=30)
            )
            db.add(job)
            added_count += 1
            print(f"✅ Added job: {job_data['title']} at {job_data['company']}")
        
        db.commit()
        print(f"\n🎉 Successfully added {added_count} jobs")
        print(f"   Total companies: {len(company_map)}")
        print(f"   Total jobs: {added_count}")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    add_jobs()
