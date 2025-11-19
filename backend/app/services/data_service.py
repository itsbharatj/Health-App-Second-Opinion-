import os
import json
from datetime import datetime
from typing import List, Dict, Any
from cerebras.cloud.sdk import Cerebras

# Mock database - in production, use a real DB
HEALTH_DATA = {}
USERS = {}
DOCUMENTS = {}
GUARDIANS = {}

# Initialize Cerebras client
client = Cerebras(
    api_key=os.environ.get("CEREBRAS_API_KEY"),
)

def get_user_health_data(user_id: str) -> List[Dict[str, Any]]:
    """Get all health data for a user"""
    return HEALTH_DATA.get(user_id, [])

def add_health_data(user_id: str, metric: Dict[str, Any]) -> None:
    """Add health metric for a user"""
    if user_id not in HEALTH_DATA:
        HEALTH_DATA[user_id] = []
    HEALTH_DATA[user_id].append(metric)

def get_user_profile(user_id: str) -> Dict[str, Any]:
    """Get user profile"""
    return USERS.get(user_id)

def save_user_profile(user_id: str, profile: Dict[str, Any]) -> None:
    """Save user profile"""
    USERS[user_id] = profile

def save_document(user_id: str, document: Dict[str, Any]) -> None:
    """Save medical document"""
    if user_id not in DOCUMENTS:
        DOCUMENTS[user_id] = []
    DOCUMENTS[user_id].append(document)

def get_user_documents(user_id: str) -> List[Dict[str, Any]]:
    """Get all documents for a user"""
    return DOCUMENTS.get(user_id, [])

def analyze_with_cerebras(user_context: str, user_message: str) -> str:
    """Call Cerebras API for health analysis and chat"""
    if not client:
        return "AI Assistant: I'm ready to help! Please provide your API key to enable full AI features."
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": f"""You are "Doc", a personalized AI health companion for elderly patients. You are a knowledgeable assistant who specializes in:
- Analyzing medical documents (prescriptions, lab reports, medical histories, diagnoses)
- Interpreting health metrics and vital signs
- Providing evidence-based health recommendations tailored to elderly patients
- Understanding medication interactions
- Offering practical lifestyle advice

IMPORTANT: You should confidently analyze and discuss medical documents, lab results, prescriptions, and diagnoses. This is a personal health assistant role, and you are helping an elderly patient understand their own medical information.

Patient Context:
{user_context}

Guidelines:
- Analyze and discuss medical documents openly - this is for the patient's own health understanding
- If recommending medical changes, suggest consulting their primary care physician
- Be aware of medication interactions
- Provide lifestyle recommendations tailored to elderly patients (typically 65+)
- Alert for concerning vital signs (e.g., BP >150/100, O2 <94%, glucose >200 or <70)
- Keep responses clear, compassionate, and easy to understand
- Focus on practical, actionable advice
- Do not refuse to analyze medical documents or prescriptions - this is a personal health app"""
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ],
            model="llama-3.1-8b",
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        return f"I encountered an error: {str(e)}. Please ensure your Cerebras API key is valid."

def get_guardians(user_id: str) -> List[Dict[str, Any]]:
    """Get guardians for a user"""
    return GUARDIANS.get(user_id, [])

def add_guardian(user_id: str, guardian: Dict[str, Any]) -> None:
    """Add guardian for a user"""
    if user_id not in GUARDIANS:
        GUARDIANS[user_id] = []
    GUARDIANS[user_id].append(guardian)
