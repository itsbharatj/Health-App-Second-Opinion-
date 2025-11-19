#!/usr/bin/env python3
"""
Test document analysis functionality
"""
import os
import sys
from dotenv import load_dotenv

load_dotenv('/Users/bharatjain/Desktop/Startup_Market_Lab/backend/.env')

from cerebras.cloud.sdk import Cerebras

api_key = os.environ.get("CEREBRAS_API_KEY")
if not api_key:
    print("❌ Error: CEREBRAS_API_KEY not found")
    sys.exit(1)

client = Cerebras(api_key=api_key)

print("📄 Testing Medical Document Analysis")
print("=" * 60)
print()

# Test document analysis prompts
test_scenarios = [
    {
        "title": "Lab Report Analysis",
        "context": "Analyzing lab_report.pdf for elderly patient",
        "prompt": """This is a lab report for an elderly patient.
Please analyze and extract:
1. Key medical conditions mentioned
2. Lab results and their significance for elderly patients
3. Any health risks or alerts
4. Recommendations

Sample lab report shows:
- Fasting glucose 125 mg/dL
- Total cholesterol 220 mg/dL
- BP 142/88 mmHg"""
    },
    {
        "title": "Prescription Analysis",
        "context": "Analyzing prescription.pdf for elderly patient",
        "prompt": """This is a prescription document for an elderly patient.
Please identify:
1. Medications prescribed
2. Dosages and frequency
3. Potential interactions with common elderly medications
4. Side effects to monitor
5. Recommendations for the elderly patient

Sample prescription shows:
- Lisinopril 10mg daily
- Metformin 500mg twice daily
- Aspirin 81mg daily"""
    },
    {
        "title": "Medical History Analysis",
        "context": "Analyzing medical_history.pdf for elderly patient",
        "prompt": """This is a medical history document for an elderly patient.
Please summarize:
1. Historical conditions
2. Previous treatments
3. Relevant patterns for current health management
4. Age-appropriate recommendations
5. Key health risks to monitor

The patient is 72 years old with a history of hypertension and pre-diabetes."""
    }
]

for scenario in test_scenarios:
    print(f"🔍 {scenario['title']}")
    print("-" * 60)
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": """You are "Doc", an AI health companion for elderly patients who confidently analyzes medical documents.
You specialize in interpreting prescriptions, lab reports, and medical histories.
You provide clear, actionable analysis tailored to elderly patients.
IMPORTANT: Provide detailed analysis of medical documents - do not refuse or express concern about analyzing medical information."""
                },
                {
                    "role": "user",
                    "content": scenario["prompt"]
                }
            ],
            model="llama-3.1-8b",
        )
        
        response = chat_completion.choices[0].message.content
        print(response[:400] + "..." if len(response) > 400 else response)
        print()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print()

print("=" * 60)
print("✅ Document analysis testing complete!")
print()
print("💡 Key improvements:")
print("1. System prompt now explicitly authorizes medical document analysis")
print("2. Backend extracts conditions from AI response")
print("3. Document endpoint returns structured analysis with conditions")
print("4. Frontend displays analysis results clearly")
