# Second Opinion - AI Health Companion

A personalized AI health companion app for elderly users that integrates real-time health data, AI-powered insights, medical document analysis, and family sharing.

## Features

- **Health Dashboard**: Real-time vital signs monitoring with interactive charts
- **AI Health Assistant (Doc)**: 24/7 personalized health guidance using Cerebras API
- **Medical Document Upload**: Upload and analyze prescriptions, lab reports, and medical records
- **Guardian Sharing**: Share health data with family members with customizable access levels
- **Health Insights**: Weekly trends, alerts, and personalized recommendations

## Tech Stack

**Frontend:**
- React + TypeScript
- Vite
- Tailwind CSS
- Recharts (data visualization)

**Backend:**
- FastAPI (Python)
- Cerebras API (AI chat)
- Mock data service

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your Cerebras API key to .env
python -m uvicorn app.main:app --reload
```

Backend runs on `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## API Endpoints

- `GET /api/health/init/{user_id}` - Initialize mock data
- `GET /api/health/metrics/{user_id}` - Get health metrics
- `GET /api/health/profile/{user_id}` - Get user profile
- `GET /api/health/summary/{user_id}` - Get health summary & alerts
- `POST /api/chat/send` - Send message to AI assistant
- `POST /api/documents/upload/{user_id}` - Upload medical document
- `GET /api/guardians/list/{user_id}` - Get guardians
- `POST /api/guardians/add/{user_id}` - Add guardian

## Environment Variables

**Backend (.env):**
```
CEREBRAS_API_KEY=your_key_here
ALLOWED_ORIGINS=http://localhost:3000
DEBUG=true
```

## Mock Data

The app comes with realistic elderly health data including:
- Heart rate variations (55-95 bpm)
- Blood pressure readings (130-150 systolic)
- Blood glucose levels (100-180 mg/dL, simulating pre-diabetes)
- Oxygen saturation
- Step count
- Sleep hours

## User Profile

Default test user: Margaret Thompson (72 years old)
- Medical Conditions: Hypertension, Type 2 Diabetes (pre-diabetic), Mild Arthritis
- Medications: Lisinopril, Metformin, Aspirin
- Allergies: Penicillin, Sulfa drugs

## Notes

- The frontend is optimized for mobile view (390px width)
- Cerebras API is required for full AI functionality
- All data is stored in-memory (not persistent between sessions)
