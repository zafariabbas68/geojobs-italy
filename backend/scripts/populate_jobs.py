"""
Script to populate the database with real geospatial jobs in Italy
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models.job import Job, JobType, ExperienceLevel, JobStatus
from app.models.company import Company
from app.models.user import User, UserRole
from app.core.security import get_password_hash
from datetime import datetime, timedelta

# Real GIS/Geospatial companies in Italy
COMPANIES = [
    {
        "name": "ESRI Italy",
        "description": "Leading GIS software company in Italy",
        "website": "https://www.esri.it",
        "city": "Milan",
        "province": "Lombardy",
        "industry": "GIS Software",
        "employee_count": 150,
        "founded_year": 1998,
    },
    {
        "name": "CGR S.p.A.",
        "description": "Italian leader in aerial surveying and photogrammetry",
        "website": "https://www.cgrspa.com",
        "city": "Parma",
        "province": "Emilia-Romagna",
        "industry": "Aerial Surveying",
        "employee_count": 200,
        "founded_year": 1985,
    },
    {
        "name": "e-GEOS",
        "description": "Earth observation and satellite data analysis",
        "website": "https://www.e-geos.it",
        "city": "Rome",
        "province": "Lazio",
        "industry": "Satellite Data",
        "employee_count": 300,
        "founded_year": 2005,
    },
    {
        "name": "Politecnico di Milano - GEO Lab",
        "description": "Geoinformatics research laboratory",
        "website": "https://www.polimi.it",
        "city": "Milan",
        "province": "Lombardy",
        "industry": "Research",
        "employee_count": 50,
        "founded_year": 2010,
    },
]

# Real GIS jobs in Italy
JOBS = [
    {
        "title": "GIS Developer",
        "description": "Develop and maintain GIS applications using Python, React, and PostGIS.",
        "requirements": "5+ years experience with GIS development, Python, PostGIS, React.",
        "city": "Milan",
        "province": "Lombardy",
        "job_type": "full_time",
        "experience_level": "mid",
        "salary_min": 45000,
        "salary_max": 60000,
        "skills": ["Python", "React", "PostGIS", "Leaflet"],
        "is_remote": False,
    },
    {
        "title": "Remote Sensing Specialist",
        "description": "Process and analyze satellite data for environmental monitoring.",
        "requirements": "3+ years experience with remote sensing, Python, and machine learning.",
        "city": "Rome",
        "province": "Lazio",
        "job_type": "full_time",
        "experience_level": "senior",
        "salary_min": 50000,
        "salary_max": 70000,
        "skills": ["Python", "Remote Sensing", "Machine Learning", "QGIS"],
        "is_remote": True,
    },
    {
        "title": "GIS Analyst",
        "description": "Perform spatial analysis and create maps for various projects.",
        "requirements": "2+ years experience with GIS analysis. Proficiency in ArcGIS Pro, QGIS.",
        "city": "Turin",
        "province": "Piedmont",
        "job_type": "full_time",
        "experience_level": "entry",
        "salary_min": 35000,
        "salary_max": 45000,
        "skills": ["ArcGIS Pro", "QGIS", "Python"],
        "is_remote": False,
    },
    {
        "title": "Geoinformatics Engineer",
        "description": "Develop geospatial algorithms and software solutions.",
        "requirements": "MSc in Geoinformatics. Strong Python, C++, and GIS skills.",
        "city": "Milan",
        "province": "Lombardy",
        "job_type": "full_time",
        "experience_level": "senior",
        "salary_min": 55000,
        "salary_max": 70000,
        "skills": ["Python", "C++", "GIS", "Machine Learning"],
        "is_remote": True,
    },
]

def populate_database():
    db = SessionLocal()
    
    try:
        # Check if we already have data
        existing_companies = db.query(Company).count()
        if existing_companies > 0:
            print(f"⚠️ Database already has {existing_companies} companies. Skipping...")
            print("If you want to re-populate, run: docker exec -it geojobs-postgres psql -U postgres -c 'TRUNCATE TABLE companies CASCADE;'")
            return
        
        # Create a default user for company accounts
        user = User(
            email="company@geojobs.it",
            password_hash=get_password_hash("password123"),
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
        
        # Create companies
        company_objects = []
        for company_data in COMPANIES:
            company = Company(
                user_id=user.id,
                **company_data
            )
            db.add(company)
            db.commit()
            db.refresh(company)
            company_objects.append(company)
            print(f"✅ Created company: {company.name}")
        
        # Create jobs
        for i, job_data in enumerate(JOBS):
            # Assign to companies in round-robin
            company = company_objects[i % len(company_objects)]
            
            job = Job(
                company_id=company.id,
                title=job_data["title"],
                description=job_data["description"],
                requirements=job_data.get("requirements", ""),
                city=job_data["city"],
                province=job_data["province"],
                job_type=JobType(job_data["job_type"]),
                experience_level=ExperienceLevel(job_data["experience_level"]),
                salary_min=job_data["salary_min"],
                salary_max=job_data["salary_max"],
                skills=job_data["skills"],
                is_remote=job_data.get("is_remote", False),
                status=JobStatus.PUBLISHED,
                application_deadline=datetime.now() + timedelta(days=30),
            )
            db.add(job)
            db.commit()
            print(f"✅ Created job: {job.title} at {company.name}")
        
        print(f"\n🎉 Successfully populated database with:")
        print(f"   - {len(company_objects)} companies")
        print(f"   - {len(JOBS)} jobs")
        print(f"   - Default user: company@geojobs.it / password123")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    populate_database()
