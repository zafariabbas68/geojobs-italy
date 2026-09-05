"""
Applications API - Complete application system
"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User, Candidate
from app.models.job import Job
from app.models.application import Application, ApplicationMessage, ApplicationDocument
from app.schemas.application import ApplicationCreate, ApplicationResponse, ApplicationUpdate, ApplicationMessageCreate
import uuid
import os
import shutil

router = APIRouter()

@router.post("/apply/{job_id}")
async def apply_to_job(
    job_id: str,
    application_data: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit a job application"""
    try:
        # Check if job exists
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Get or create candidate profile
        candidate = db.query(Candidate).filter(Candidate.user_id == current_user.id).first()
        if not candidate:
            candidate = Candidate(
                user_id=current_user.id,
                first_name=application_data.first_name,
                last_name=application_data.last_name,
                email=application_data.email,
                phone=application_data.phone,
                city=application_data.city,
                country=application_data.country
            )
            db.add(candidate)
            db.commit()
            db.refresh(candidate)
        
        # Check if already applied
        existing = db.query(Application).filter(
            Application.job_id == job_id,
            Application.candidate_id == candidate.id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="You have already applied for this job")
        
        # Create application
        application = Application(
            job_id=job_id,
            candidate_id=candidate.id,
            first_name=application_data.first_name,
            last_name=application_data.last_name,
            email=application_data.email,
            phone=application_data.phone,
            address=application_data.address,
            city=application_data.city,
            country=application_data.country,
            current_title=application_data.current_title,
            years_experience=application_data.years_experience,
            summary=application_data.summary,
            cover_letter_text=application_data.cover_letter_text,
            portfolio_url=application_data.portfolio_url,
            linkedin_url=application_data.linkedin_url,
            github_url=application_data.github_url,
            education=application_data.education,
            work_experience=application_data.work_experience,
            skills=application_data.skills,
            certifications=application_data.certifications,
            languages=application_data.languages,
            additional_answers=application_data.additional_answers,
            status="pending"
        )
        
        db.add(application)
        db.commit()
        db.refresh(application)
        
        return {
            "message": "Application submitted successfully",
            "application_id": str(application.id),
            "status": "pending"
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error applying to job: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload-document/{application_id}")
async def upload_document(
    application_id: str,
    document_type: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload a document for an application"""
    try:
        application = db.query(Application).filter(Application.id == application_id).first()
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
        
        # Check if user owns this application
        candidate = db.query(Candidate).filter(Candidate.user_id == current_user.id).first()
        if application.candidate_id != candidate.id:
            raise HTTPException(status_code=403, detail="Not authorized")
        
        # Save file
        upload_dir = Path("uploads/applications")
        upload_dir.mkdir(parents=True, exist_ok=True)
        
        file_extension = file.filename.split(".")[-1]
        filename = f"{application_id}_{document_type}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.{file_extension}"
        file_path = upload_dir / filename
        
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        
        # Save document record
        document = ApplicationDocument(
            application_id=application_id,
            document_type=document_type,
            file_name=file.filename,
            file_url=str(file_path),
            file_size=os.path.getsize(file_path)
        )
        db.add(document)
        db.commit()
        db.refresh(document)
        
        return {
            "message": "Document uploaded successfully",
            "document_id": str(document.id),
            "file_url": str(file_path)
        }
    except Exception as e:
        print(f"Error uploading document: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/my-applications")
async def get_my_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all applications for the current user"""
    try:
        candidate = db.query(Candidate).filter(Candidate.user_id == current_user.id).first()
        if not candidate:
            return {"applications": [], "total": 0}
        
        applications = db.query(Application).filter(
            Application.candidate_id == candidate.id
        ).order_by(Application.submitted_at.desc()).all()
        
        result = []
        for app in applications:
            job = app.job
            result.append({
                "id": str(app.id),
                "job_title": job.title if job else "Unknown",
                "company_name": job.company.name if job and job.company else "Unknown",
                "city": job.city if job else "Unknown",
                "status": app.status,
                "submitted_at": app.submitted_at.isoformat() if app.submitted_at else None,
                "match_score": app.match_score
            })
        
        return {"applications": result, "total": len(result)}
    except Exception as e:
        print(f"Error getting applications: {e}")
        return {"applications": [], "total": 0}

@router.get("/company-applications/{job_id}")
async def get_company_applications(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all applications for a company's job"""
    try:
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Check if user owns the company
        company = db.query(Company).filter(Company.user_id == current_user.id).first()
        if job.company_id != company.id:
            raise HTTPException(status_code=403, detail="Not authorized")
        
        applications = db.query(Application).filter(Application.job_id == job_id).all()
        
        result = []
        for app in applications:
            candidate = app.candidate
            result.append({
                "id": str(app.id),
                "candidate_name": f"{app.first_name} {app.last_name}",
                "email": app.email,
                "phone": app.phone,
                "current_title": app.current_title,
                "years_experience": app.years_experience,
                "status": app.status,
                "submitted_at": app.submitted_at.isoformat() if app.submitted_at else None,
                "match_score": app.match_score
            })
        
        return {"applications": result, "total": len(result)}
    except Exception as e:
        print(f"Error getting company applications: {e}")
        return {"applications": [], "total": 0}

@router.put("/{application_id}/status")
async def update_application_status(
    application_id: str,
    status: str,
    notes: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update application status (for companies)"""
    try:
        application = db.query(Application).filter(Application.id == application_id).first()
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
        
        # Check if user owns the company
        job = application.job
        company = db.query(Company).filter(Company.user_id == current_user.id).first()
        if job.company_id != company.id:
            raise HTTPException(status_code=403, detail="Not authorized")
        
        application.status = status
        if notes:
            application.notes = notes
        
        db.commit()
        
        return {"message": "Status updated successfully", "status": status}
    except Exception as e:
        db.rollback()
        print(f"Error updating status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{application_id}/message")
async def send_message(
    application_id: str,
    message_data: ApplicationMessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a message about an application"""
    try:
        application = db.query(Application).filter(Application.id == application_id).first()
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
        
        message = ApplicationMessage(
            application_id=application_id,
            sender_id=current_user.id,
            message=message_data.message
        )
        db.add(message)
        db.commit()
        
        return {"message": "Message sent successfully", "message_id": str(message.id)}
    except Exception as e:
        db.rollback()
        print(f"Error sending message: {e}")
        raise HTTPException(status_code=500, detail=str(e))
