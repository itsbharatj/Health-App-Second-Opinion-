// Test Gemini API
import axios from 'axios';

const GEMINI_API_KEY = 'ENTER YOU API KEY';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

async function testGemini() {
  try {
    console.log('Testing Gemini API...');
    console.log('API URL:', GEMINI_API_URL);
    console.log('API Key:', GEMINI_API_KEY.substring(0, 10) + '...');
    
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: 'Say hello in a friendly way'
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    console.log('Success! Response:', response.data);
    console.log('AI said:', response.data.candidates[0]?.content?.parts[0]?.text);
  } catch (error) {
    console.error('Error details:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('Full error:', error);
  }
}

testGemini();
