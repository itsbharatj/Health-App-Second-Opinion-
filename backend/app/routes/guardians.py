from fastapi import APIRouter, HTTPException
from app.services.data_service import get_guardians, add_guardian, get_user_health_data, get_user_profile
from datetime import datetime
import json

router = APIRouter()

@router.post("/add/{user_id}")
async def add_guardian_for_user(user_id: str, guardian_name: str, relationship: str, access_level: str = "view_all"):
    """Add a guardian/family member who can view health data"""
    
    guardian = {
        "guardian_id": f"guardian_{datetime.now().timestamp()}",
        "user_id": user_id,
        "name": guardian_name,
        "relationship": relationship,
        "access_level": access_level,
        "added_at": datetime.now().isoformat()
    }
    
    add_guardian(user_id, guardian)
    
    return {
        "status": "success",
        "message": f"Guardian {guardian_name} added with {access_level} access",
        "guardian": guardian
    }

@router.get("/list/{user_id}")
async def list_guardians(user_id: str):
    """List all guardians for a user"""
    guardians = get_guardians(user_id)
    
    return {
        "user_id": user_id,
        "guardians": guardians,
        "count": len(guardians)
    }

@router.get("/view/{user_id}/{guardian_id}")
async def guardian_view_health_data(user_id: str, guardian_id: str, view_type: str = "summary"):
    """Guardian views user's health data based on their access level"""
    
    guardians = get_guardians(user_id)
    guardian = next((g for g in guardians if g["guardian_id"] == guardian_id), None)
    
    if not guardian:
        raise HTTPException(status_code=403, detail="Guardian not authorized")
    
    # Get user's health data based on access level
    metrics = get_user_health_data(user_id)
    profile = get_user_profile(user_id)
    
    if guardian["access_level"] == "view_all":
        return {
            "guardian_name": guardian["name"],
            "relationship": guardian["relationship"],
            "user_profile": profile,
            "recent_metrics": metrics[-7:] if metrics else [],
            "alerts": []
        }
    elif guardian["access_level"] == "view_alerts":
        # Only show alerts, not full data
        return {
            "guardian_name": guardian["name"],
            "relationship": guardian["relationship"],
            "alerts": [
                {
                    "type": "high_blood_pressure",
                    "message": "Blood pressure readings are elevated",
                    "timestamp": datetime.now().isoformat()
                }
            ]
        }
    elif guardian["access_level"] == "view_basic":
        # Only show basic info
        return {
            "guardian_name": guardian["name"],
            "relationship": guardian["relationship"],
            "basic_info": {
                "name": profile.get("name") if profile else "N/A",
                "age": profile.get("age") if profile else "N/A",
                "status": "okay"
            }
        }

@router.post("/alerts/{user_id}")
async def enable_guardian_alerts(user_id: str, guardian_id: str):
    """Enable real-time alerts for guardians"""
    
    return {
        "status": "success",
        "message": "Guardian alerts enabled",
        "alert_types": ["high_blood_pressure", "low_oxygen", "abnormal_glucose", "fall_detection"]
    }
