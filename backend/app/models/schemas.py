from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class HealthMetric(BaseModel):
    heart_rate: int
    blood_pressure_systolic: int
    blood_pressure_diastolic: int
    blood_glucose: float
    oxygen_saturation: float
    body_temperature: float
    steps: int
    sleep_hours: float
    timestamp: datetime

class UserProfile(BaseModel):
    user_id: str
    name: str
    age: int
    medical_conditions: List[str]
    medications: List[str]
    allergies: List[str]
    emergency_contact: str
    lifestyle_goal: str  # e.g., "longevity", "casual", "active"

class MedicalDocument(BaseModel):
    document_id: str
    user_id: str
    document_type: str  # e.g., "lab_report", "prescription", "medical_history"
    file_name: str
    uploaded_at: datetime
    analysis: Optional[str] = None
    extracted_conditions: Optional[List[str]] = None

class ChatMessage(BaseModel):
    message: str
    user_id: str
    timestamp: datetime

class AIResponse(BaseModel):
    response: str
    medical_context: Optional[dict] = None
    recommendations: Optional[List[str]] = None

class Guardian(BaseModel):
    guardian_id: str
    user_id: str
    name: str
    relationship: str
    access_level: str  # "view_all", "view_alerts", "view_basic"
