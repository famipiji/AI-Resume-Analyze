import React from 'react';
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import './InsightsCard.css';

function InsightsCard({ title, items, type }) {
  const getIcon = () => {
    switch(type) {
      case 'strength': return <CheckCircle size={24} />;
      case 'weakness': return <XCircle size={24} />;
      case 'suggestion': return <Lightbulb size={24} />;
      default: return null;
    }
  };

  return (
    <div className={`insights-card card ${type}`}>
      <div className="card-header">
        {getIcon()}
        <h3>{title}</h3>
      </div>
      
      <ul className="insights-list">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default InsightsCard;
