import React from 'react';

const ExplanationBlock = ({ title, intro, children }) => {
  return (
    <div className="explanation">
      {title && <h3 className="explanation-title">{title}</h3>}
      {intro && <p className="explanation-intro">{intro}</p>}
      <div className="explanation-content">
        {children}
      </div>
    </div>
  );
};

export default ExplanationBlock;

