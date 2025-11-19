#!/usr/bin/env python3
"""
Test script for Cerebras API integration
"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/Users/bharatjain/Desktop/Startup_Market_Lab/backend/.env')

from cerebras.cloud.sdk import Cerebras

api_key = os.environ.get("CEREBRAS_API_KEY")
if not api_key:
    print("❌ Error: CEREBRAS_API_KEY not found in .env file")
    sys.exit(1)

print("🧠 Testing Cerebras API Integration")
print("=" * 50)
print(f"API Key: {api_key[:20]}...")
print()

# Initialize Cerebras client
client = Cerebras(api_key=api_key)

# Test message for elderly health app
user_context = """User: Margaret Thompson (Age: 72)
Medical Conditions: Hypertension, Type 2 Diabetes (Pre-diabetic), Mild Arthritis
Current Medications: Lisinopril, Metformin, Aspirin
Allergies: Penicillin, Sulfa drugs

Recent Vital Signs:
- Heart Rate: 72 bpm
- Blood Pressure: 142/88 mmHg
- Blood Glucose: 135 mg/dL
- Oxygen Saturation: 97%
- Body Temperature: 37.2°C
- Steps Today: 5200
- Sleep Last Night: 7.5 hours"""

user_message = "Why is my blood pressure consistently high and what can I do to manage it?"

print("📨 Sending message to Cerebras API...")
print(f"User Message: {user_message}")
print()

try:
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": f"""You are "Doc", a personalized AI health companion for elderly patients. 
You have access to the patient's health data and medical history.
Always be compassionate, clear, and provide practical health advice.
Focus on elderly-specific health concerns.

Patient Context:
{user_context}

Guidelines:
- If discussing medical conditions, recommend consulting their primary care physician
- Be aware of medication interactions if mentioned
- Provide lifestyle recommendations tailored to elderly patients
- Keep responses concise and easy to understand"""
            },
            {
                "role": "user",
                "content": user_message
            }
        ],
        model="llama-3.1-8b",
    )
    
    print("✅ Success! Response from Cerebras AI:")
    print("-" * 50)
    print(chat_completion.choices[0].message.content)
    print("-" * 50)
    print()
    print("🎉 Cerebras API is working correctly!")
    
except Exception as e:
    print(f"❌ Error calling Cerebras API: {e}")
    sys.exit(1)
