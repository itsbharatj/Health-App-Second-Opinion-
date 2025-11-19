import axios from 'axios';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const GEMINI_VISION_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export interface ChatContext {
  documents?: string[];
  healthData?: any;
  userProfile?: any;
}

export const geminiService = {
  async chat(message: string, context?: ChatContext): Promise<string> {
    if (!GEMINI_API_KEY) {
      console.error('Gemini API key is missing!');
      return "Please configure your Gemini API key in the .env file to use this feature.";
    }

    try {
      let systemContext = `You are a compassionate AI health assistant designed specifically for elderly users. 
Your role is to provide clear, simple, and caring health advice. Always:
- Use simple, easy-to-understand language
- Be empathetic and encouraging
- Provide practical, actionable suggestions
- Consider the user's age and limitations
- Explain medical terms in simple words
- Show concern for their wellbeing
- Keep responses concise but informative

`;

      if (context?.healthData) {
        systemContext += `\n\nUser's Current Health Data:
- Heart Rate: ${context.healthData.heartRate || 'N/A'} bpm
- Blood Pressure: ${context.healthData.bloodPressure || 'N/A'}
- Steps Today: ${context.healthData.steps || 'N/A'}
- Sleep Last Night: ${context.healthData.sleep || 'N/A'} hours
- Calories: ${context.healthData.calories || 'N/A'}
- Water Intake: ${context.healthData.water || 'N/A'} glasses
- Blood Sugar: ${context.healthData.bloodSugar || 'N/A'} mg/dL
- Oxygen Level: ${context.healthData.oxygen || 'N/A'}%
- Recent Activities: ${context.healthData.activities || 'N/A'}

`;
      }

      if (context?.userProfile) {
        systemContext += `\n\nUser Profile:
- Name: ${context.userProfile.name || 'User'}
- Age: ${context.userProfile.age || 'N/A'}
- Medical Conditions: ${context.userProfile.conditions?.join(', ') || 'None reported'}
- Current Medications: ${context.userProfile.medications?.join(', ') || 'None reported'}
- Allergies: ${context.userProfile.allergies?.join(', ') || 'None reported'}
- Emergency Contacts: ${context.userProfile.emergencyContacts?.join(', ') || 'None'}
- Recent Activities: ${context.userProfile.recentActivities?.join(', ') || 'None'}

`;
      }

      if (context?.documents && context.documents.length > 0) {
        systemContext += `\n\nUser's Medical Documents Summary:
${context.documents.join('\n')}

`;
      }

      const fullPrompt = `${systemContext}\n\nUser Question: ${message}\n\nPlease provide a helpful, caring response in simple language suitable for an elderly person:`;

      console.log('Sending request to Gemini API...');
      console.log('API URL:', GEMINI_API_URL);
      console.log('API Key present:', !!GEMINI_API_KEY);

      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE"
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000
        }
      );

      console.log('Gemini API response received:', response.data);

      if (!response.data.candidates || response.data.candidates.length === 0) {
        console.error('No candidates in response');
        return "I'm here to help, but I couldn't generate a response. Please try again.";
      }

      const candidate = response.data.candidates[0];
      
      if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
        console.error('No content parts in response. Finish reason:', candidate.finishReason);
        if (candidate.finishReason === 'MAX_TOKENS') {
          return "I apologize, but my response was too long. Could you please ask a more specific question?";
        }
        return "I'm here to help, but I couldn't generate a response. Please try again.";
      }

      const aiResponse = candidate.content.parts[0].text || 
        "I'm here to help, but I couldn't generate a response. Please try again.";
      
      return aiResponse;
    } catch (error: any) {
      console.error('Gemini API Error Details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        fullError: error
      });
      
      if (error.code === 'ECONNABORTED') {
        return "The request took too long. Please try again.";
      } else if (error.response?.status === 400) {
        const errorMsg = error.response?.data?.error?.message || '';
        console.error('Bad Request Details:', errorMsg);
        return `I apologize, but there was an issue: ${errorMsg}. Please try again.`;
      } else if (error.response?.status === 403) {
        return "The API key doesn't have the right permissions. Please check your Gemini API key configuration.";
      } else if (error.response?.status === 429) {
        return "We've reached the rate limit. Please wait a moment and try again.";
      } else if (error.response?.status === 404) {
        return "The API endpoint was not found. Please check your configuration.";
      }
      
      return `Connection error: ${error.message}. Please check your internet and API key.`;
    }
  },

  async analyzeMealFromImage(imageBase64: string): Promise<{ calories: number; breakdown: any; description: string }> {
    try {
      const prompt = `You are a nutrition expert. Analyze this meal image and provide:
1. Total estimated calories
2. Breakdown of macronutrients (protein, carbs, fats in grams)
3. A simple description of the meal
4. Portion size estimate

Please respond in JSON format:
{
  "calories": number,
  "protein": number,
  "carbs": number,
  "fats": number,
  "description": "string",
  "portionSize": "string"
}`;

      const response = await axios.post(
        `${GEMINI_VISION_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: imageBase64
                }
              }
            ]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const aiResponse = response.data.candidates[0]?.content?.parts[0]?.text || '{}';
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

      return {
        calories: parsed.calories || 0,
        breakdown: {
          protein: parsed.protein || 0,
          carbs: parsed.carbs || 0,
          fats: parsed.fats || 0,
          portionSize: parsed.portionSize || 'Unknown'
        },
        description: parsed.description || 'Meal analysis unavailable'
      };
    } catch (error) {
      console.error('Meal analysis error:', error);
      return {
        calories: 0,
        breakdown: { protein: 0, carbs: 0, fats: 0, portionSize: 'Unknown' },
        description: 'Unable to analyze meal. Please enter manually.'
      };
    }
  },

  async generateHealthInsights(healthData: any): Promise<string> {
    try {
      const prompt = `You are a caring health advisor for an elderly person. Based on this health data, provide warm, encouraging insights and simple suggestions for improvement:

Health Data:
- Heart Rate: ${healthData.heartRate} bpm
- Blood Pressure: ${healthData.bloodPressure} mmHg
- Steps: ${healthData.steps} steps
- Sleep: ${healthData.sleep} hours
- Recent Pattern: ${healthData.pattern || 'Normal activity'}

Please provide:
1. A kind assessment of their health (2-3 sentences)
2. One specific, actionable suggestion to improve
3. Words of encouragement

Keep the language simple, warm, and easy to understand.`;

      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      return response.data.candidates[0]?.content?.parts[0]?.text || 
        "You're doing well! Keep up with your daily activities and remember to rest when needed.";
    } catch (error) {
      console.error('Health insights error:', error);
      return "You're doing well! Keep up with your daily activities.";
    }
  },

  async processDocument(fileContent: string, fileName: string): Promise<string> {
    try {
      const prompt = `You are analyzing a medical document for an elderly patient. Please extract and summarize the key health information in simple, easy-to-understand language.

Document: ${fileName}
Content: ${fileContent.substring(0, 4000)}

Please provide:
1. What type of document this is
2. Key findings in simple words
3. Any important dates or values
4. What the patient should know

Keep the summary brief and use simple language.`;

      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      return response.data.candidates[0]?.content?.parts[0]?.text || 
        "Document processed successfully.";
    } catch (error) {
      console.error('Document processing error:', error);
      return "Document uploaded successfully.";
    }
  }
};
