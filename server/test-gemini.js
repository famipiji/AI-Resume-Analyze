import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY);

async function testGemini() {
  try {
    console.log('Testing Gemini API...');
    console.log('API Key:', process.env.OPENAI_API_KEY?.substring(0, 20) + '...');

    // Try different model names
    const modelNames = ['gemini-pro', 'gemini-1.5-pro', 'gemini-1.5-flash', 'models/gemini-pro'];

    for (const modelName of modelNames) {
      try {
        console.log(`\nTrying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say hello');
        const response = await result.response;
        const text = response.text();
        console.log(`✅ SUCCESS with ${modelName}:`, text.substring(0, 50));
        break;
      } catch (error) {
        console.log(`❌ Failed with ${modelName}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testGemini();
