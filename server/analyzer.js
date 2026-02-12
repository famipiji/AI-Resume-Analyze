// AI-powered resume analyzer
export async function analyzeResume(resume, jobDescription) {
  const resumeWords = extractWords(resume);
  const jobWords = extractWords(jobDescription);
  
  // Extract skills from both texts
  const resumeSkills = extractSkills(resume);
  const jobSkills = extractSkills(jobDescription);
  
  // Calculate match score
  const matchScore = calculateMatchScore(resumeWords, jobWords, resumeSkills, jobSkills);
  
  // Identify missing skills
  const missingSkills = jobSkills.filter(skill => 
    !resumeSkills.some(rs => rs.toLowerCase() === skill.toLowerCase())
  );
  
  // Analyze strengths and weaknesses
  const strengths = identifyStrengths(resume, jobDescription, resumeSkills, jobSkills);
  const weaknesses = identifyWeaknesses(resume, jobDescription, missingSkills);
  
  // Generate suggestions
  const suggestions = generateSuggestions(resume, jobDescription, missingSkills, matchScore);
  
  // Keyword matching
  const keywordMatch = analyzeKeywords(resume, jobDescription);
  
  return {
    matchScore,
    strengths,
    weaknesses,
    missingSkills: missingSkills.slice(0, 10),
    suggestions,
    keywordMatch,
    analysis: {
      resumeLength: resume.length,
      experienceYears: extractExperience(resume),
      educationLevel: extractEducation(resume),
      hasQuantifiableAchievements: hasQuantifiableMetrics(resume)
    }
  };
}

function extractWords(text) {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
}

function extractSkills(text) {
  const commonSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Rust', 'PHP',
    'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'Git', 'GitHub',
    'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'GraphQL', 'REST API',
    'Machine Learning', 'AI', 'Data Science', 'TensorFlow', 'PyTorch',
    'Agile', 'Scrum', 'Leadership', 'Team Management', 'Communication',
    'HTML', 'CSS', 'SASS', 'Tailwind', 'Bootstrap', 'Webpack', 'Vite',
    'Testing', 'Jest', 'Mocha', 'Cypress', 'Selenium', 'Unit Testing',
    'Microservices', 'System Design', 'Architecture', 'DevOps', 'Linux'
  ];
  
  const foundSkills = [];
  const lowerText = text.toLowerCase();
  
  commonSkills.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });
  
  return foundSkills;
}

function calculateMatchScore(resumeWords, jobWords, resumeSkills, jobSkills) {
  const jobWordSet = new Set(jobWords);
  const matchingWords = resumeWords.filter(word => jobWordSet.has(word));
  const wordMatchRatio = matchingWords.length / jobWords.length;
  
  const skillMatchRatio = jobSkills.length > 0 
    ? resumeSkills.filter(rs => jobSkills.some(js => js.toLowerCase() === rs.toLowerCase())).length / jobSkills.length
    : 0;
  
  const score = Math.round((wordMatchRatio * 0.4 + skillMatchRatio * 0.6) * 100);
  return Math.min(Math.max(score, 0), 100);
}

function identifyStrengths(resume, jobDescription, resumeSkills, jobSkills) {
  const strengths = [];
  
  const matchedSkills = resumeSkills.filter(rs => 
    jobSkills.some(js => js.toLowerCase() === rs.toLowerCase())
  );
  
  if (matchedSkills.length > 5) {
    strengths.push(`Strong technical skill alignment with ${matchedSkills.length} matching skills`);
  }
  
  const experienceYears = extractExperience(resume);
  if (experienceYears >= 5) {
    strengths.push(`${experienceYears}+ years of relevant experience`);
  }
  
  if (hasQuantifiableMetrics(resume)) {
    strengths.push('Includes quantifiable achievements and metrics');
  }
  
  if (resume.toLowerCase().includes('lead') || resume.toLowerCase().includes('manage')) {
    strengths.push('Demonstrates leadership and management experience');
  }
  
  if (matchedSkills.some(skill => ['React', 'Angular', 'Vue', 'Node.js'].includes(skill))) {
    strengths.push('Modern technology stack experience');
  }
  
  return strengths.length > 0 ? strengths : ['Resume shows relevant experience'];
}

function identifyWeaknesses(resume, jobDescription, missingSkills) {
  const weaknesses = [];
  
  if (missingSkills.length > 5) {
    weaknesses.push(`Missing ${missingSkills.length} key skills mentioned in job description`);
  }
  
  if (!hasQuantifiableMetrics(resume)) {
    weaknesses.push('Lacks quantifiable achievements and impact metrics');
  }
  
  if (resume.length < 500) {
    weaknesses.push('Resume appears too brief, consider adding more detail');
  }
  
  const educationLevel = extractEducation(resume);
  if (!educationLevel && jobDescription.toLowerCase().includes('degree')) {
    weaknesses.push('Education section may need more prominence');
  }
  
  if (!resume.toLowerCase().includes('project')) {
    weaknesses.push('Consider adding relevant project examples');
  }
  
  return weaknesses.length > 0 ? weaknesses : ['Minor improvements possible'];
}

function generateSuggestions(resume, jobDescription, missingSkills, matchScore) {
  const suggestions = [];
  
  if (matchScore < 70) {
    suggestions.push('Tailor your resume more closely to the job description keywords');
  }
  
  if (missingSkills.length > 0) {
    suggestions.push(`Highlight experience with: ${missingSkills.slice(0, 3).join(', ')}`);
  }
  
  if (!hasQuantifiableMetrics(resume)) {
    suggestions.push('Add quantifiable achievements (e.g., "Increased performance by 40%")');
  }
  
  suggestions.push('Use action verbs at the start of bullet points (Led, Developed, Implemented)');
  
  if (!resume.toLowerCase().includes('certification')) {
    suggestions.push('Include relevant certifications or professional development courses');
  }
  
  suggestions.push('Ensure your resume is ATS-friendly with clear section headers');
  
  return suggestions;
}

function analyzeKeywords(resume, jobDescription) {
  const jobKeywords = extractKeywords(jobDescription);
  const resumeLower = resume.toLowerCase();
  
  const matched = jobKeywords.filter(keyword => 
    resumeLower.includes(keyword.toLowerCase())
  );
  
  const missing = jobKeywords.filter(keyword => 
    !resumeLower.includes(keyword.toLowerCase())
  );
  
  return {
    matched: matched.slice(0, 15),
    missing: missing.slice(0, 15)
  };
}

function extractKeywords(text) {
  const words = extractWords(text);
  const stopWords = new Set(['the', 'and', 'for', 'with', 'this', 'that', 'from', 'have', 'will', 'your', 'our']);
  
  const wordFreq = {};
  words.forEach(word => {
    if (!stopWords.has(word) && word.length > 3) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });
  
  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);
}

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
