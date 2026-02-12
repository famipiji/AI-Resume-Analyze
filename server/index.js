import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { analyzeResume } from './analyzer.js';
import { extractTextFromFile } from './ocr.js';
import { 
  analyzeWithAI, 
  generateCoverLetter, 
  generateInterviewQuestions,
  optimizeBulletPoints 
} from './ai-analyzer.js';

dotenv.config();

const app = express();
const PORT = 3001;

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, images, and text files are allowed.'));
    }
  }
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/api/analyze', async (req, res) => {
  try {
    const { resume, jobDescription, useAI = true } = req.body;
    
    if (!resume || !jobDescription) {
      return res.status(400).json({ error: 'Resume and job description are required' });
    }

    let analysis;

    if (useAI && process.env.OPENAI_API_KEY) {
      try {
        // Use AI-powered analysis
        analysis = await analyzeWithAI(resume, jobDescription);

        // Add additional analysis details
        analysis.analysis = {
          resumeLength: resume.length,
          experienceYears: extractExperience(resume),
          educationLevel: extractEducation(resume),
          hasQuantifiableAchievements: hasQuantifiableMetrics(resume),
          aiPowered: true
        };
      } catch (aiError) {
        console.log('AI analysis failed, falling back to rule-based analysis:', aiError.message);
        // Fallback to rule-based analysis
        analysis = await analyzeResume(resume, jobDescription);
        analysis.analysis.aiPowered = false;
      }
    } else {
      // Fallback to rule-based analysis
      analysis = await analyzeResume(resume, jobDescription);
      analysis.analysis.aiPowered = false;
    }
    
    res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

app.post('/api/generate-cover-letter', async (req, res) => {
  try {
    const { resume, jobDescription, companyName } = req.body;
    
    if (!resume || !jobDescription) {
      return res.status(400).json({ error: 'Resume and job description are required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: 'AI service not configured' });
    }

    const coverLetter = await generateCoverLetter(resume, jobDescription, companyName);
    res.json({ coverLetter });
  } catch (error) {
    console.error('Cover letter generation error:', error);
    res.status(500).json({ error: 'Failed to generate cover letter' });
  }
});

app.post('/api/generate-interview-questions', async (req, res) => {
  try {
    const { resume, jobDescription } = req.body;
    
    if (!resume || !jobDescription) {
      return res.status(400).json({ error: 'Resume and job description are required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: 'AI service not configured' });
    }

    const questions = await generateInterviewQuestions(resume, jobDescription);
    res.json(questions);
  } catch (error) {
    console.error('Interview questions generation error:', error);
    res.status(500).json({ error: 'Failed to generate interview questions' });
  }
});

app.post('/api/optimize-bullets', async (req, res) => {
  try {
    const { bulletPoints, jobDescription } = req.body;
    
    if (!bulletPoints || !jobDescription) {
      return res.status(400).json({ error: 'Bullet points and job description are required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: 'AI service not configured' });
    }

    const optimized = await optimizeBulletPoints(bulletPoints, jobDescription);
    res.json(optimized);
  } catch (error) {
    console.error('Bullet optimization error:', error);
    res.status(500).json({ error: 'Failed to optimize bullet points' });
  }
});

// Helper functions for basic analysis
function extractExperience(resume) {
  const yearMatches = resume.match(/(\d+)\+?\s*(years?|yrs?)/gi);
  if (yearMatches) {
    const years = yearMatches.map(match => parseInt(match.match(/\d+/)[0]));
    return Math.max(...years);
  }
  return 0;
}

function extractEducation(resume) {
  const educationKeywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college'];
  return educationKeywords.some(keyword => resume.toLowerCase().includes(keyword));
}

function hasQuantifiableMetrics(resume) {
  const metricPatterns = [
    /\d+%/,
    /\$\d+/,
    /\d+\s*(million|thousand|billion)/i,
    /increased.*\d+/i,
    /reduced.*\d+/i,
    /improved.*\d+/i
  ];
  
  return metricPatterns.some(pattern => pattern.test(resume));
}

app.post('/api/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const extractedText = await extractTextFromFile(req.file);
    
    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ error: 'No text could be extracted from the file' });
    }

    res.json({ 
      text: extractedText,
      filename: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to process file' });
  }
});

app.post('/api/upload-job', upload.single('jobDescription'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const extractedText = await extractTextFromFile(req.file);
    
    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ error: 'No text could be extracted from the file' });
    }

    res.json({ 
      text: extractedText,
      filename: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to process file' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
