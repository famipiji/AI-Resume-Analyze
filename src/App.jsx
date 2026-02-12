import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import UploadSection from './components/UploadSection';
import LoadingSpinner from './components/LoadingSpinner';
import AIFeatures from './components/AIFeatures';
import { API_URL } from './config';
import './App.css';

function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResume, setCurrentResume] = useState('');
  const [currentJobDesc, setCurrentJobDesc] = useState('');

  const handleAnalyze = async (resume, jobDescription) => {
    setIsAnalyzing(true);
    setCurrentResume(resume);
    setCurrentJobDesc(jobDescription);
    
    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resume, jobDescription, useAI: true }),
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed');
      }
      
      const data = await response.json();
      setAnalysisData(data);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      alert('Failed to analyze resume. Make sure the server is running on port 3001.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>AI Resume Analyzer</h1>
        <p>Get instant insights on how well your resume matches the job</p>
      </header>
      
      <UploadSection onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
      
      {isAnalyzing && <LoadingSpinner />}
      
      {!isAnalyzing && analysisData && (
        <>
          <Dashboard data={analysisData} />
          <AIFeatures resume={currentResume} jobDescription={currentJobDesc} />
        </>
      )}
    </div>
  );
}

export default App;
