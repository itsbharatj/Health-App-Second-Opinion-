from datetime import datetime, timedelta
import random
import json

def generate_mock_health_data(user_id: str, days: int = 30) -> list:
    """Generate realistic elderly health data for the last N days"""
    data = []
    
    for i in range(days):
        date = datetime.now() - timedelta(days=days-i)
        
        # Realistic elderly health patterns
        heart_rate = random.randint(55, 85)  # Elderly average: 60-100
        systolic = random.randint(130, 150)  # Slightly elevated for elderly
        diastolic = random.randint(80, 95)
        glucose = random.randint(100, 160)  # Possible pre-diabetes
        oxygen = random.randint(94, 99)  # Should be high
        temperature = 37 + random.uniform(-0.5, 0.5)
        steps = random.randint(2000, 8000)  # Lower for elderly
        sleep = random.uniform(6.5, 8.5)  # 7-8 hours typical
        
        # Add some realistic variations
        if i % 3 == 0:  # Occasional stress days
            heart_rate = random.randint(75, 95)
            glucose = random.randint(150, 180)
        
        data.append({
            "heart_rate": heart_rate,
            "blood_pressure_systolic": systolic,
            "blood_pressure_diastolic": diastolic,
            "blood_glucose": glucose,
            "oxygen_saturation": oxygen,
            "body_temperature": round(temperature, 1),
            "steps": steps,
            "sleep_hours": round(sleep, 1),
            "timestamp": date.isoformat()
        })
    
    return data

def generate_elderly_user_profile(user_id: str = "elderly_001") -> dict:
    """Generate a realistic elderly user profile"""
    return {
        "user_id": user_id,
        "name": "Margaret Thompson",
        "age": 72,
        "medical_conditions": [
            "Hypertension",
            "Type 2 Diabetes (Pre-diabetic)",
            "Mild Arthritis",
            "Sleep Apnea"
        ],
        "medications": [
            "Lisinopril 10mg daily",
            "Metformin 500mg twice daily",
            "Aspirin 81mg daily",
            "CPAP therapy at night"
        ],
        "allergies": [
            "Penicillin",
            "Sulfa drugs"
        ],
        "emergency_contact": "+1-555-0102",
        "lifestyle_goal": "longevity",
        "phone": "555-0101",
        "email": "margaret@example.com"
    }

def generate_mock_document(user_id: str) -> dict:
    """Generate a mock medical document"""
    return {
        "document_id": "doc_001",
        "user_id": user_id,
        "document_type": "lab_report",
        "file_name": "2024_lab_results.pdf",
        "uploaded_at": datetime.now().isoformat(),
        "analysis": {
            "diabetes_risk": "moderate",
            "hypertension_risk": "high",
            "cholesterol": "elevated",
            "key_findings": [
                "Fasting glucose 125 mg/dL (pre-diabetic range)",
                "Total cholesterol 220 mg/dL (borderline high)",
                "BP consistently around 140/90 (Stage 1 Hypertension)"
            ]
        },
        "extracted_conditions": [
            "Pre-diabetes",
            "Hypertension",
            "High Cholesterol"
        ]
    }
