from fastapi import APIRouter, Depends, HTTPException
from app.services.job_scraper import LinkedInJobScraperService
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/scrape/linkedin")
async def scrape_linkedin_jobs(
    current_user: User = Depends(get_current_user)
):
    """Trigger LinkedIn job scraping"""
    # Only admin can trigger scraping
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    scraper = LinkedInJobScraperService()
    scraper.run()
    
    return {"message": "LinkedIn scraping completed"}
