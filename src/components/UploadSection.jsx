import React, { useState } from 'react';
import { Upload, FileText, Briefcase, File } from 'lucide-react';
import { API_URL } from '../config';
import './UploadSection.css';

function UploadSection({ onAnalyze, isAnalyzing }) {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ resume: '', job: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (resume && jobDescription) {
      onAnalyze(resume, jobDescription);
    }
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(prev => ({ 
      ...prev, 
      [type]: `Uploading ${file.name}...` 
    }));

    const formData = new FormData();
    const fieldName = type === 'resume' ? 'resume' : 'jobDescription';
    formData.append(fieldName, file);

    try {
      const endpoint = type === 'resume' ? '/api/upload-resume' : '/api/upload-job';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      
      if (type === 'resume') {
        setResume(data.text);
        setUploadStatus(prev => ({ ...prev, resume: `✓ ${file.name} uploaded` }));
      } else {
        setJobDescription(data.text);
        setUploadStatus(prev => ({ ...prev, job: `✓ ${file.name} uploaded` }));
      }

      setTimeout(() => {
        setUploadStatus(prev => ({ ...prev, [type]: '' }));
      }, 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus(prev => ({ 
        ...prev, 
        [type]: `✗ ${error.message}` 
      }));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-section">
      <form onSubmit={handleSubmit}>
        <div className="input-grid">
          <div className="input-group">
            <label>
              <FileText size={20} />
              <span>Resume Text</span>
            </label>
            
            <div className="upload-controls">
              <input
                type="file"
                id="resume-file"
                accept=".pdf,.png,.jpg,.jpeg,.txt"
                onChange={(e) => handleFileUpload(e.target.files[0], 'resume')}
                style={{ display: 'none' }}
                disabled={isUploading}
              />
              <label htmlFor="resume-file" className="file-upload-btn">
                <File size={16} />
                Upload Resume (PDF/Image/TXT)
              </label>
              {uploadStatus.resume && (
                <span className="upload-status">{uploadStatus.resume}</span>
              )}
            </div>
            
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume here or upload a file..."
              rows={10}
              required
            />
          </div>
          
          <div className="input-group">
            <label>
              <Briefcase size={20} />
              <span>Job Description</span>
            </label>
            
            <div className="upload-controls">
              <input
                type="file"
                id="job-file"
                accept=".pdf,.png,.jpg,.jpeg,.txt"
                onChange={(e) => handleFileUpload(e.target.files[0], 'job')}
                style={{ display: 'none' }}
                disabled={isUploading}
              />
              <label htmlFor="job-file" className="file-upload-btn">
                <File size={16} />
                Upload Job Description
              </label>
              {uploadStatus.job && (
                <span className="upload-status">{uploadStatus.job}</span>
              )}
            </div>
            
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here or upload a file..."
              rows={10}
              required
            />
          </div>
        </div>
        
        <button type="submit" className="analyze-btn" disabled={isAnalyzing}>
          <Upload size={20} />
          {isAnalyzing ? 'Analyzing...' : 'Analyze Match'}
        </button>
      </form>
    </div>
  );
}

export default UploadSection;
