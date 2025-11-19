from fastapi import APIRouter, HTTPException
from datetime import datetime
from app.models.schemas import HealthMetric
from app.services.data_service import get_user_health_data, add_health_data
from app.services.mock_data import generate_mock_health_data, generate_elderly_user_profile
import json

router = APIRouter()

# Store generated data
INITIALIZED = {}

@router.get("/init/{user_id}")
async def initialize_health_data(user_id: str = "elderly_001"):
    """Initialize mock health data for a user"""
    if user_id not in INITIALIZED:
        # Generate 30 days of mock data
        mock_data = generate_mock_health_data(user_id, days=30)
        for metric in mock_data:
            add_health_data(user_id, metric)
        INITIALIZED[user_id] = True
    
    return {
        "status": "initialized",
        "user_id": user_id,
        "message": "Health data initialized with 30 days of mock data"
    }

@router.get("/metrics/{user_id}")
async def get_health_metrics(user_id: str, days: int = 30):
    """Get health metrics for a user"""
    metrics = get_user_health_data(user_id)
    
    if not metrics:
        # Auto-initialize if no data exists
        await initialize_health_data(user_id)
        metrics = get_user_health_data(user_id)
    
    # Filter by days if requested
    if days < len(metrics):
        metrics = metrics[-days:]
    
    return {
        "user_id": user_id,
        "metrics": metrics,
        "count": len(metrics)
    }

@router.get("/profile/{user_id}")
async def get_user_profile(user_id: str = "elderly_001"):
    """Get user health profile"""
    profile = generate_elderly_user_profile(user_id)
    return profile

@router.get("/summary/{user_id}")
async def get_health_summary(user_id: str):
    """Get a summary of user's health status"""
    metrics = get_user_health_data(user_id)
    
    if not metrics:
        await initialize_health_data(user_id)
        metrics = get_user_health_data(user_id)
    
    if not metrics:
        raise HTTPException(status_code=404, detail="No health data found")
    
    # Calculate averages from latest data
    latest = metrics[-1] if metrics else None
    avg_hr = sum(m["heart_rate"] for m in metrics[-7:]) / min(7, len(metrics))
    avg_bp_sys = sum(m["blood_pressure_systolic"] for m in metrics[-7:]) / min(7, len(metrics))
    avg_glucose = sum(m["blood_glucose"] for m in metrics[-7:]) / min(7, len(metrics))
    
    return {
        "user_id": user_id,
        "last_updated": latest.get("timestamp") if latest else None,
        "latest_metrics": latest,
        "weekly_averages": {
            "heart_rate": round(avg_hr),
            "blood_pressure_systolic": round(avg_bp_sys),
            "blood_glucose": round(avg_glucose)
        },
        "alerts": [
            {
                "type": "high_blood_pressure",
                "severity": "warning",
                "message": f"Recent BP readings averaging {round(avg_bp_sys)}/{round(sum(m['blood_pressure_diastolic'] for m in metrics[-7:]) / min(7, len(metrics)))} mmHg - consider consulting physician"
            },
            {
                "type": "pre_diabetes",
                "severity": "info",
                "message": f"Average glucose {round(avg_glucose)} mg/dL - maintain healthy diet and exercise"
            }
        ]
    }

@router.post("/metrics/{user_id}")
async def add_health_metric(user_id: str, metric: dict):
    """Add a new health metric (for real device data)"""
    metric["timestamp"] = datetime.now().isoformat()
    add_health_data(user_id, metric)
    
    return {
        "status": "success",
        "message": "Health metric recorded",
        "metric": metric
    }
