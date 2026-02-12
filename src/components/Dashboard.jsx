import React from 'react';
import ScoreCard from './ScoreCard';
import SkillsCard from './SkillsCard';
import InsightsCard from './InsightsCard';
import KeywordMatch from './KeywordMatch';
import AnalysisDetails from './AnalysisDetails';
import ExportButton from './ExportButton';
import './Dashboard.css';

function Dashboard({ data }) {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Analysis Results</h2>
        <ExportButton data={data} />
      </div>
      
      <div className="dashboard-grid">
        <ScoreCard score={data.matchScore} />
        
        <InsightsCard 
          title="Strengths"
          items={data.strengths}
          type="strength"
        />
        
        <InsightsCard 
          title="Weaknesses"
          items={data.weaknesses}
          type="weakness"
        />
        
        <SkillsCard 
          title="Missing Skills"
          skills={data.missingSkills}
        />
        
        <InsightsCard 
          title="Suggestions"
          items={data.suggestions}
          type="suggestion"
        />
        
        <KeywordMatch data={data.keywordMatch} />
        
        {data.analysis && <AnalysisDetails analysis={data.analysis} />}
      </div>
    </div>
  );
}

export default Dashboard;
