import React from 'react';
import { FileText, Award, TrendingUp, Sparkles } from 'lucide-react';
import './AnalysisDetails.css';

function AnalysisDetails({ analysis }) {
  if (!analysis) return null;

  return (
    <div className="analysis-details card">
      <div className="card-header">
        <FileText size={24} />
        <h3>Resume Analysis</h3>
        {analysis.aiPowered && (
          <span className="ai-badge">
            <Sparkles size={14} />
            AI Powered
          </span>
        )}
      </div>
      
      <div className="details-grid">
        <div className="detail-item">
          <div className="detail-icon">
            <FileText size={20} />
          </div>
          <div className="detail-content">
            <span className="detail-label">Resume Length</span>
            <span className="detail-value">{analysis.resumeLength} characters</span>
          </div>
        </div>
        
        <div className="detail-item">
          <div className="detail-icon">
            <TrendingUp size={20} />
          </div>
          <div className="detail-content">
            <span className="detail-label">Experience</span>
            <span className="detail-value">
              {analysis.experienceYears > 0 
                ? `${analysis.experienceYears}+ years` 
                : 'Not specified'}
            </span>
          </div>
        </div>
        
        <div className="detail-item">
          <div className="detail-icon">
            <Award size={20} />
          </div>
          <div className="detail-content">
            <span className="detail-label">Education</span>
            <span className="detail-value">
              {analysis.educationLevel ? 'Mentioned' : 'Not found'}
            </span>
          </div>
        </div>
        
        <div className="detail-item">
          <div className="detail-icon">
            <TrendingUp size={20} />
          </div>
          <div className="detail-content">
            <span className="detail-label">Metrics</span>
            <span className="detail-value">
              {analysis.hasQuantifiableAchievements ? 'Includes metrics' : 'Add metrics'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalysisDetails;
