import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY);

async function listModels() {
  try {
    console.log('Checking API key and available models...\n');

    // Try to list models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.OPENAI_API_KEY}`
    );

    if (!response.ok) {
      console.error('❌ API Error:', response.status, response.statusText);
      const text = await response.text();
      console.error('Response:', text);
      return;
    }

    const data = await response.json();
    console.log('✅ API Key is valid!');
    console.log('\nAvailable models:');
    data.models?.forEach(model => {
      console.log(`- ${model.name} (${model.displayName})`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();
