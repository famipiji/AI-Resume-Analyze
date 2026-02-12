import React, { useState } from 'react';
import { FileText, MessageSquare, Sparkles, Loader } from 'lucide-react';
import './AIFeatures.css';

function AIFeatures({ resume, jobDescription }) {
  const [coverLetter, setCoverLetter] = useState('');
  const [interviewQuestions, setInterviewQuestions] = useState(null);
  const [loading, setLoading] = useState({ coverLetter: false, interview: false });
  const [companyName, setCompanyName] = useState('');

  const generateCoverLetter = async () => {
    setLoading(prev => ({ ...prev, coverLetter: true }));
    try {
      const response = await fetch('http://localhost:3001/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription, companyName }),
      });
      
      if (!response.ok) throw new Error('Failed to generate cover letter');
      
      const data = await response.json();
      setCoverLetter(data.coverLetter);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate cover letter. Make sure OpenAI API key is configured.');
    } finally {
      setLoading(prev => ({ ...prev, coverLetter: false }));
    }
  };

  const generateInterviewQuestions = async () => {
    setLoading(prev => ({ ...prev, interview: true }));
    try {
      const response = await fetch('http://localhost:3001/api/generate-interview-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription }),
      });
      
      if (!response.ok) throw new Error('Failed to generate questions');
      
      const data = await response.json();
      setInterviewQuestions(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate interview questions. Make sure OpenAI API key is configured.');
    } finally {
      setLoading(prev => ({ ...prev, interview: false }));
    }
  };

  const copyCoverLetter = () => {
    navigator.clipboard.writeText(coverLetter);
    alert('Cover letter copied to clipboard!');
  };

  if (!resume || !jobDescription) {
    return null;
  }

  return (
    <div className="ai-features">
      <div className="ai-features-header">
        <Sparkles size={24} />
        <h2>AI-Powered Tools</h2>
      </div>

      <div className="ai-tools-grid">
        {/* Cover Letter Generator */}
        <div className="ai-tool-card card">
          <div className="card-header">
            <FileText size={24} />
            <h3>Cover Letter Generator</h3>
          </div>
          
          <input
            type="text"
            placeholder="Company name (optional)"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="company-input"
          />
          
          <button 
            onClick={generateCoverLetter} 
            disabled={loading.coverLetter}
            className="ai-btn"
          >
            {loading.coverLetter ? (
              <>
                <Loader size={18} className="spinner" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Cover Letter
              </>
            )}
          </button>

          {coverLetter && (
            <div className="ai-result">
              <div className="result-header">
                <h4>Your Cover Letter</h4>
                <button onClick={copyCoverLetter} className="copy-btn">
                  Copy
                </button>
              </div>
              <pre className="cover-letter-text">{coverLetter}</pre>
            </div>
          )}
        </div>

        {/* Interview Questions */}
        <div className="ai-tool-card card">
          <div className="card-header">
            <MessageSquare size={24} />
            <h3>Interview Prep</h3>
          </div>
          
          <p className="tool-description">
            Get likely interview questions based on your resume and the job description
          </p>
          
          <button 
            onClick={generateInterviewQuestions} 
            disabled={loading.interview}
            className="ai-btn"
          >
            {loading.interview ? (
              <>
                <Loader size={18} className="spinner" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Questions
              </>
            )}
          </button>

          {interviewQuestions && (
            <div className="ai-result">
              <div className="questions-section">
                <h4>💻 Technical Questions</h4>
                <ol>
                  {interviewQuestions.technical?.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ol>
              </div>

              <div className="questions-section">
                <h4>🤝 Behavioral Questions</h4>
                <ol>
                  {interviewQuestions.behavioral?.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ol>
              </div>

              <div className="questions-section">
                <h4>🎯 Role-Specific Questions</h4>
                <ol>
                  {interviewQuestions.roleSpecific?.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AIFeatures;
