import React from 'react';
import { Hash } from 'lucide-react';
import './KeywordMatch.css';

function KeywordMatch({ data }) {
  return (
    <div className="keyword-match card">
      <div className="card-header">
        <Hash size={24} />
        <h3>Keyword Analysis</h3>
      </div>
      
      <div className="keyword-section">
        <h4 className="matched-title">✅ Matched Keywords</h4>
        <div className="keyword-tags">
          {data.matched.map((keyword, index) => (
            <span key={index} className="keyword-tag matched">
              {keyword}
            </span>
          ))}
        </div>
      </div>
      
      <div className="keyword-section">
        <h4 className="missing-title">❌ Missing Keywords</h4>
        <div className="keyword-tags">
          {data.missing.map((keyword, index) => (
            <span key={index} className="keyword-tag missing">
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default KeywordMatch;
