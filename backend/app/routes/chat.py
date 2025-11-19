from fastapi import APIRouter, HTTPException
from datetime import datetime
from app.models.schemas import ChatMessage, AIResponse
from app.services.data_service import get_user_health_data, analyze_with_cerebras, get_user_profile
import json

router = APIRouter()

@router.post("/send")
async def send_message(user_id: str, message: str):
    """Send a message to the AI health doc"""
    
    # Get user's health context
    metrics = get_user_health_data(user_id)
    profile = get_user_profile(user_id)
    
    # Initialize if needed
    if not metrics:
        metrics = []
    
    # Build context from latest health data
    context = f"""User: {profile.get('name', 'Patient') if profile else 'Patient'} (Age: {profile.get('age', 'unknown') if profile else 'unknown'})
Medical Conditions: {', '.join(profile.get('medical_conditions', []) if profile else [])}
Current Medications: {', '.join(profile.get('medications', []) if profile else [])}
Allergies: {', '.join(profile.get('allergies', []) if profile else [])}
"""
    
    if metrics:
        latest = metrics[-1]
        context += f"""
Recent Vital Signs:
- Heart Rate: {latest.get('heart_rate')} bpm
- Blood Pressure: {latest.get('blood_pressure_systolic')}/{latest.get('blood_pressure_diastolic')} mmHg
- Blood Glucose: {latest.get('blood_glucose')} mg/dL
- Oxygen Saturation: {latest.get('oxygen_saturation')}%
- Body Temperature: {latest.get('body_temperature')}°C
- Steps Today: {latest.get('steps')}
- Sleep Last Night: {latest.get('sleep_hours')} hours
"""
    
    # Call Cerebras API
    ai_response = analyze_with_cerebras(context, message)
    
    # Extract any recommendations if applicable
    recommendations = []
    if "recommend" in ai_response.lower() or "suggest" in ai_response.lower():
        recommendations = ["Consider consulting your physician for professional medical advice"]
    
    return {
        "response": ai_response,
        "medical_context": {
            "user_conditions": profile.get('medical_conditions', []) if profile else [],
            "user_medications": profile.get('medications', []) if profile else [],
        },
        "recommendations": recommendations,
        "timestamp": datetime.now().isoformat()
    }

@router.get("/health-insights/{user_id}")
async def get_health_insights(user_id: str):
    """Get AI-generated health insights"""
    
    profile = get_user_profile(user_id)
    metrics = get_user_health_data(user_id)
    
    if not metrics or not profile:
        return {
            "insights": "No data available yet",
            "recommendations": []
        }
    
    # Generate insight message
    latest = metrics[-1]
    insight_prompt = f"Based on a patient with {', '.join(profile.get('medical_conditions', []))}, recent vitals showing BP {latest.get('blood_pressure_systolic')}/{latest.get('blood_pressure_diastolic')} and glucose {latest.get('blood_glucose')}, what are key health recommendations for today?"
    
    insights = analyze_with_cerebras(f"Generate brief health insights for {profile.get('name')}", insight_prompt)
    
    return {
        "user_id": user_id,
        "insights": insights,
        "generated_at": datetime.now().isoformat()
    }
