import React from 'react';
import { Download } from 'lucide-react';
import './ExportButton.css';

function ExportButton({ data }) {
  const exportToPDF = () => {
    const content = `
RESUME ANALYSIS REPORT
Generated: ${new Date().toLocaleDateString()}

MATCH SCORE: ${data.matchScore}%

STRENGTHS:
${data.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

WEAKNESSES:
${data.weaknesses.map((w, i) => `${i + 1}. ${w}`).join('\n')}

MISSING SKILLS:
${data.missingSkills.join(', ')}

SUGGESTIONS:
${data.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

MATCHED KEYWORDS:
${data.keywordMatch.matched.join(', ')}

MISSING KEYWORDS:
${data.keywordMatch.missing.join(', ')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-analysis-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button className="export-btn" onClick={exportToPDF}>
      <Download size={18} />
      Export Report
    </button>
  );
}

export default ExportButton;
