import React from 'react';
import { Target } from 'lucide-react';
import './ScoreCard.css';

function ScoreCard({ score }) {
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Needs Improvement';
  };

  return (
    <div className="score-card card">
      <div className="card-header">
        <Target size={24} />
        <h3>Match Score</h3>
      </div>
      
      <div className="score-display">
        <div className="score-circle" style={{ '--score-color': getScoreColor(score) }}>
          <svg viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" className="score-bg" />
            <circle 
              cx="100" 
              cy="100" 
              r="90" 
              className="score-progress"
              style={{ 
                strokeDasharray: `${score * 5.65} 565`,
                stroke: getScoreColor(score)
              }}
            />
          </svg>
          <div className="score-text">
            <span className="score-number">{score}</span>
            <span className="score-percent">%</span>
          </div>
        </div>
        
        <p className="score-label" style={{ color: getScoreColor(score) }}>
          {getScoreLabel(score)}
        </p>
      </div>
    </div>
  );
}

export default ScoreCard;
