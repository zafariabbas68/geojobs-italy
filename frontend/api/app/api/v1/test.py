from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class TestUser(BaseModel):
    email: str
    password: str
    name: str

@router.post("/register-test")
async def test_register(user: TestUser):
    try:
        return {
            "message": "Test successful",
            "received": user.dict(),
            "status": "ok"
        }
    except Exception as e:
        return {"error": str(e)}
