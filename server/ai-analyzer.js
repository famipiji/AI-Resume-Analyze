import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY); // Using OPENAI_API_KEY env var for Gemini key

export async function analyzeWithAI(resume, jobDescription) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert career coach and ATS specialist. Analyze this resume against the job description and provide detailed insights.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Provide a comprehensive analysis in the following JSON format:
{
  "matchScore": <number 0-100>,
  "strengths": [<array of 4-6 specific strengths>],
  "weaknesses": [<array of 3-5 specific weaknesses>],
  "missingSkills": [<array of 5-10 key missing skills>],
  "suggestions": [<array of 5-8 actionable improvement suggestions>],
  "toneAnalysis": "<brief assessment of resume tone and professionalism>",
  "atsCompatibility": "<assessment of ATS-friendliness>",
  "keywordMatch": {
    "matched": [<array of matched keywords>],
    "missing": [<array of missing important keywords>]
  }
}

Be specific, actionable, and honest in your assessment. Return ONLY valid JSON, no markdown or extra text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the response to extract JSON
    let jsonText = text.trim();
    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    const analysis = JSON.parse(jsonText);
    return analysis;
  } catch (error) {
    console.error('AI Analysis error:', error);
    throw error;
  }
}

export async function generateCoverLetter(resume, jobDescription, companyName = "the company") {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Based on this resume and job description, write a professional, compelling cover letter.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

COMPANY NAME: ${companyName}

Write a cover letter that:
- Is 3-4 paragraphs long
- Highlights relevant experience from the resume
- Shows enthusiasm for the role
- Addresses key requirements from the job description
- Has a professional yet personable tone
- Includes a strong opening and closing

Format as plain text, ready to use.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Cover letter generation error:', error);
    throw error;
  }
}

export async function generateInterviewQuestions(resume, jobDescription) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Based on this resume and job description, generate likely interview questions.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Generate 10-12 interview questions in JSON format:
{
  "technical": [<array of 4-5 technical questions>],
  "behavioral": [<array of 4-5 behavioral questions>],
  "roleSpecific": [<array of 3-4 role-specific questions>]
}

Questions should be realistic and based on the actual job requirements and candidate's background.
Return ONLY valid JSON, no markdown or extra text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the response to extract JSON
    let jsonText = text.trim();
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Interview questions generation error:', error);
    throw error;
  }
}

export async function optimizeBulletPoints(bulletPoints, jobDescription) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Rewrite these resume bullet points to be more impactful and ATS-friendly, aligned with this job description.

BULLET POINTS:
${bulletPoints}

JOB DESCRIPTION:
${jobDescription}

Rewrite each bullet point to:
- Start with strong action verbs
- Include quantifiable achievements where possible
- Incorporate relevant keywords from the job description
- Be concise and impactful
- Follow the STAR method when applicable

Return as JSON:
{
  "optimized": [<array of rewritten bullet points>]
}

Return ONLY valid JSON, no markdown or extra text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the response to extract JSON
    let jsonText = text.trim();
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Bullet point optimization error:', error);
    throw error;
  }
}
