from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db

router = APIRouter()

@router.get("/")
async def search(
    q: str = Query(..., min_length=2),
    type: str = Query("jobs", regex="^(jobs|candidates)$"),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Search jobs or candidates"""
    return {
        "query": q,
        "type": type,
        "results": [],
        "total": 0
    }
