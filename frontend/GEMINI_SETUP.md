# Gemini AI Integration Setup

## Features Implemented

The frontend now includes comprehensive AI features powered by Google's Gemini API:

### 1. **AI Health Chat** (Chat Page)
- Natural conversation with health context
- Understands your health metrics (heart rate, blood pressure, steps, sleep)
- Knows your medical profile (age, conditions, medications)
- Can discuss uploaded documents
- Elderly-friendly language and caring tone

### 2. **Photo Meal Analysis** (Food Tracking Page)
- Take/upload a photo of your meal
- AI automatically identifies food items
- Calculates calories and nutrition breakdown (protein, carbs, fats)
- Manual entry fallback option

### 3. **Document Processing** (Document Upload Page)
- Upload PDF, DOC, or TXT medical documents
- AI automatically generates summaries
- Highlights important findings
- Simplifies medical terminology for elderly users

### 4. **Health Insights** (Dashboard)
- AI analyzes your health data
- Provides personalized suggestions
- Caring recommendations for improvement
- Based on your activity, sleep, and nutrition patterns

### 5. **Daily Health Journal** (Dashboard)
- Log daily activities and mood
- Track sleep and energy levels
- Add notes about how you're feeling
- Historical entries for pattern recognition

### 6. **Companion Management** (Companions Page)
- Add family members and caregivers
- Assign relationships (Family, Doctor, Trainer, etc.)
- Enable/disable access with toggles
- Profile pictures auto-generated

## Setup Instructions

### Step 1: Get a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API Key"
3. Create a new API key or use an existing one
4. Copy the API key

### Step 2: Configure Environment Variables

1. Open the file: `frontend/.env`
2. Replace `your_gemini_api_key_here` with your actual API key:
   ```
   VITE_GEMINI_API_KEY=AIzaSyC_your_actual_api_key_here
   VITE_API_URL=http://localhost:8000
   ```

### Step 3: Install Dependencies

```bash
cd frontend
npm install
```

### Step 4: Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Features Overview

### AI Chat Features
- **Context-Aware**: Knows your health metrics, medications, and medical history
- **Document Integration**: Can reference uploaded medical documents
- **Elderly-Focused**: Simple language, caring tone, actionable advice
- **Real-time**: Streaming responses for better UX

### Meal Photo Analysis
- **Image Recognition**: Upload a photo of any meal
- **Nutrition Details**: Get calories, protein, carbs, and fat content
- **Automatic Logging**: Saves to your daily food tracker
- **Manual Override**: Edit or manually enter if needed

### Document AI
- **Medical Summaries**: Converts complex medical reports into simple language
- **Key Findings**: Highlights important information
- **Searchable**: Ask questions about your documents in chat
- **Multiple Formats**: Supports PDF, DOC, TXT files

### Health Insights
- **Personalized**: Based on YOUR specific health data
- **Actionable**: Practical suggestions you can follow
- **Caring**: Written in a supportive, elderly-friendly tone
- **Updated**: Refreshes based on latest metrics

## Important Notes

1. **API Key Security**: Never commit your `.env` file to version control
2. **Rate Limits**: Gemini has usage limits - monitor your API usage
3. **Privacy**: Health data is sent to Gemini API - ensure compliance with healthcare regulations
4. **Offline**: AI features require internet connection
5. **Accuracy**: While AI is helpful, always consult healthcare professionals for medical advice

## Troubleshooting

### "API Key not found" Error
- Check that your `.env` file exists in the `frontend` folder
- Verify the API key starts with `AIzaSy`
- Restart the development server after changing `.env`

### "Failed to analyze image" Error
- Ensure the image is clear and well-lit
- Try manual entry if AI analysis fails
- Check API quota limits

### Chat Not Responding
- Verify internet connection
- Check browser console for errors
- Confirm API key is valid

### Document Processing Fails
- Only TXT files are currently supported for processing (PDF requires backend integration)
- Ensure file is text-based, not scanned images
- Check file size limits

## Next Steps

1. Add your Gemini API key to `.env`
2. Test the chat feature with health questions
3. Try uploading a meal photo
4. Log a daily health journal entry
5. Add family members as companions

Enjoy your AI-powered health companion! 🏥💙
