import React from 'react';

const ResultCard = ({ title, children }) => {
  return (
    <div className="results-section fade-in">
      <div className="result-card">
        {title && <h2 className="result-title">{title}</h2>}
        {children}
      </div>
    </div>
  );
};

export default ResultCard;
