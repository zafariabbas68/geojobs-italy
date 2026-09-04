"""
Script to add engineering jobs across all disciplines
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models.job import Job
from app.models.company import Company
from app.models.user import User, UserRole
from app.core.security import get_password_hash
from datetime import datetime, timedelta
import uuid

# Engineering companies in Italy
COMPANIES = [
    {"name": "Leonardo S.p.A.", "city": "Rome", "province": "Lazio", "industry": "Aerospace & Defense"},
    {"name": "Eni S.p.A.", "city": "Milan", "province": "Lombardy", "industry": "Energy & Chemicals"},
    {"name": "Enel S.p.A.", "city": "Rome", "province": "Lazio", "industry": "Energy & Utilities"},
    {"name": "Ferrari N.V.", "city": "Maranello", "province": "Emilia-Romagna", "industry": "Automotive"},
    {"name": "Stellantis", "city": "Turin", "province": "Piedmont", "industry": "Automotive"},
    {"name": "Pirelli", "city": "Milan", "province": "Lombardy", "industry": "Manufacturing"},
    {"name": "Saipem", "city": "Milan", "province": "Lombardy", "industry": "Energy & Construction"},
    {"name": "Webuild S.p.A.", "city": "Milan", "province": "Lombardy", "industry": "Civil Construction"},
    {"name": "Terna S.p.A.", "city": "Rome", "province": "Lazio", "industry": "Energy & Utilities"},
    {"name": "FS Group", "city": "Rome", "province": "Lazio", "industry": "Transportation & Infrastructure"},
]

# Engineering jobs across all disciplines
ENGINEERING_JOBS = [
    # Civil Engineering
    {
        "title": "Structural Engineer",
        "category": "Civil Engineering",
        "subcategory": "Structural",
        "company": "Webuild S.p.A.",
        "city": "Milan",
        "description": "Design and analyze structural systems for large-scale infrastructure projects. Work on bridges, tunnels, and high-rise buildings.",
        "skills": ["AutoCAD", "Revit", "SAP2000", "ETABS", "Structural Analysis"],
        "salary_min": 40000,
        "salary_max": 60000,
        "job_type": "FULL_TIME",
        "experience_level": "SENIOR"
    },
    {
        "title": "Project Manager - Infrastructure",
        "category": "Civil Engineering",
        "subcategory": "Project Management",
        "company": "Webuild S.p.A.",
        "city": "Rome",
        "description": "Lead large-scale infrastructure projects from planning to completion. Coordinate teams, budgets, and timelines.",
        "skills": ["Project Management", "Primavera", "MS Project", "Risk Management"],
        "salary_min": 55000,
        "salary_max": 75000,
        "job_type": "FULL_TIME",
        "experience_level": "SENIOR"
    },
    
    # Mechanical Engineering
    {
        "title": "Mechanical Design Engineer",
        "category": "Mechanical Engineering",
        "subcategory": "Design",
        "company": "Ferrari N.V.",
        "city": "Maranello",
        "description": "Design and develop high-performance automotive components. Work on engine, transmission, and chassis systems.",
        "skills": ["SolidWorks", "CATIA", "FEA", "Automotive", "CFD"],
        "salary_min": 45000,
        "salary_max": 65000,
        "job_type": "FULL_TIME",
        "experience_level": "MID"
    },
    {
        "title": "Manufacturing Engineer",
        "category": "Mechanical Engineering",
        "subcategory": "Manufacturing",
        "company": "Stellantis",
        "city": "Turin",
        "description": "Optimize manufacturing processes for automotive production. Implement lean manufacturing principles.",
        "skills": ["Lean Manufacturing", "Six Sigma", "Automation", "CAD"],
        "salary_min": 40000,
        "salary_max": 58000,
        "job_type": "FULL_TIME",
        "experience_level": "MID"
    },
    
    # Electrical Engineering
    {
        "title": "Power Systems Engineer",
        "category": "Electrical Engineering",
        "subcategory": "Power",
        "company": "Enel S.p.A.",
        "city": "Rome",
        "description": "Design and optimize power distribution systems for renewable and traditional energy sources.",
        "skills": ["Power Systems", "SCADA", "Renewable Energy", "MATLAB"],
        "salary_min": 42000,
        "salary_max": 62000,
        "job_type": "FULL_TIME",
        "experience_level": "MID"
    },
    {
        "title": "Control Systems Engineer",
        "category": "Electrical Engineering",
        "subcategory": "Control Systems",
        "company": "Leonardo S.p.A.",
        "city": "Rome",
        "description": "Develop control systems for aerospace and defense applications. Work with PLCs, sensors, and automation.",
        "skills": ["PLC", "SCADA", "Control Systems", "Python", "MATLAB"],
        "salary_min": 45000,
        "salary_max": 65000,
        "job_type": "FULL_TIME",
        "experience_level": "SENIOR"
    },
    
    # Software Engineering
    {
        "title": "Full Stack Developer",
        "category": "Software Engineering",
        "subcategory": "Web Development",
        "company": "Eni S.p.A.",
        "city": "Milan",
        "description": "Build and maintain web applications for energy management and data visualization.",
        "skills": ["React", "Python", "Node.js", "PostgreSQL", "Docker"],
        "salary_min": 42000,
        "salary_max": 62000,
        "job_type": "FULL_TIME",
        "experience_level": "MID"
    },
    {
        "title": "Data Engineer",
        "category": "Software Engineering",
        "subcategory": "Data Engineering",
        "company": "Enel S.p.A.",
        "city": "Rome",
        "description": "Design and maintain data pipelines for IoT and energy data analytics.",
        "skills": ["Python", "SQL", "Big Data", "AWS", "ETL"],
        "salary_min": 45000,
        "salary_max": 65000,
        "job_type": "FULL_TIME",
        "experience_level": "SENIOR"
    },
    
    # Chemical Engineering
    {
        "title": "Process Engineer",
        "category": "Chemical Engineering",
        "subcategory": "Process",
        "company": "Eni S.p.A.",
        "city": "Milan",
        "description": "Optimize chemical processes for energy production and refining.",
        "skills": ["Process Simulation", "ChemCAD", "Aspen", "Safety"],
        "salary_min": 42000,
        "salary_max": 60000,
        "job_type": "FULL_TIME",
        "experience_level": "MID"
    },
    {
        "title": "Environmental Engineer",
        "category": "Chemical Engineering",
        "subcategory": "Environmental",
        "company": "Saipem",
        "city": "Milan",
        "description": "Design and implement environmental protection systems for industrial projects.",
        "skills": ["Environmental Impact", "Waste Management", "Sustainability", "EIA"],
        "salary_min": 40000,
        "salary_max": 58000,
        "job_type": "FULL_TIME",
        "experience_level": "MID"
    },
    
    # Aerospace Engineering
    {
        "title": "Aerospace Systems Engineer",
        "category": "Aerospace Engineering",
        "subcategory": "Systems",
        "company": "Leonardo S.p.A.",
        "city": "Rome",
        "description": "Design and integrate aerospace systems for aviation and space applications.",
        "skills": ["Systems Engineering", "MATLAB", "C++", "Aerospace"],
        "salary_min": 48000,
        "salary_max": 70000,
        "job_type": "FULL_TIME",
        "experience_level": "SENIOR"
    },
    {
        "title": "Space Systems Engineer",
        "category": "Aerospace Engineering",
        "subcategory": "Space",
        "company": "Leonardo S.p.A.",
        "city": "Rome",
        "description": "Design satellite and space vehicle systems for scientific and commercial missions.",
        "skills": ["Space Systems", "Satellite", "C++", "Python", "Orbital Mechanics"],
        "salary_min": 50000,
        "salary_max": 75000,
        "job_type": "FULL_TIME",
        "experience_level": "SENIOR"
    },
    
    # Industrial Engineering
    {
        "title": "Supply Chain Engineer",
        "category": "Industrial Engineering",
        "subcategory": "Supply Chain",
        "company": "Pirelli",
        "city": "Milan",
        "description": "Optimize supply chain operations for manufacturing and logistics.",
        "skills": ["Supply Chain", "Logistics", "SAP", "Lean", "Six Sigma"],
        "salary_min": 40000,
        "salary_max": 58000,
        "job_type": "FULL_TIME",
        "experience_level": "MID"
    },
    {
        "title": "Quality Engineer",
        "category": "Industrial Engineering",
        "subcategory": "Quality",
        "company": "Stellantis",
        "city": "Turin",
        "description": "Ensure product quality through testing, standards compliance, and process improvement.",
        "skills": ["Quality Management", "ISO Standards", "Six Sigma", "Auditing"],
        "salary_min": 38000,
        "salary_max": 55000,
        "job_type": "FULL_TIME",
        "experience_level": "MID"
    },
    
    # Robotics & Automation
    {
        "title": "Robotics Engineer",
        "category": "Robotics & Automation",
        "subcategory": "Robotics",
        "company": "Leonardo S.p.A.",
        "city": "Rome",
        "description": "Design robotic systems for industrial and defense applications.",
        "skills": ["ROS", "Python", "C++", "Robot Control", "Machine Learning"],
        "salary_min": 45000,
        "salary_max": 68000,
        "job_type": "FULL_TIME",
        "experience_level": "MID"
    },
    {
        "title": "Automation Engineer",
        "category": "Robotics & Automation",
        "subcategory": "Automation",
        "company": "Ferrari N.V.",
        "city": "Maranello",
        "description": "Design and implement automated manufacturing systems for automotive production.",
        "skills": ["PLC", "Industrial Automation", "SCADA", "Robot Programming"],
        "salary_min": 42000,
        "salary_max": 62000,
        "job_type": "FULL_TIME",
        "experience_level": "MID"
    },
]

def add_engineering_jobs():
    db = SessionLocal()
    
    try:
        # Create admin user if not exists
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
            print("✅ Admin user created")
        
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
                    industry=company_data["industry"],
                    country="Italy",
                    description=f"Leading {company_data['industry']} company in Italy",
                    created_at=datetime.now()
                )
                db.add(company)
                db.commit()
                db.refresh(company)
                print(f"✅ Added company: {company.name}")
            company_map[company_data["name"]] = company
        
        # Add engineering jobs
        added_count = 0
        for job_data in ENGINEERING_JOBS:
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
                job_type=job_data["job_type"],
                experience_level=job_data["experience_level"],
                salary_min=job_data["salary_min"],
                salary_max=job_data["salary_max"],
                skills=job_data["skills"],
                category=job_data["category"],
                subcategory=job_data["subcategory"],
                status="PUBLISHED",
                created_at=datetime.now(),
                application_deadline=datetime.now() + timedelta(days=30)
            )
            db.add(job)
            added_count += 1
            print(f"✅ Added {job_data['category']} job: {job_data['title']}")
        
        db.commit()
        print(f"\n🎉 Successfully added {added_count} engineering jobs!")
        print(f"   Total companies: {len(company_map)}")
        
        # Show breakdown by category
        db = SessionLocal()
        categories = db.query(Job.category, db.func.count(Job.id)).group_by(Job.category).all()
        print("\n📊 Job Distribution by Category:")
        for cat, count in categories:
            print(f"   • {cat}: {count} jobs")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    add_engineering_jobs()
