import React from 'react';
import { AlertCircle } from 'lucide-react';
import './SkillsCard.css';

function SkillsCard({ title, skills }) {
  return (
    <div className="skills-card card">
      <div className="card-header">
        <AlertCircle size={24} />
        <h3>{title}</h3>
      </div>
      
      <div className="skills-list">
        {skills.map((skill, index) => (
          <span key={index} className="skill-tag">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default SkillsCard;
