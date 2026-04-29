import React from 'react';

const SeqTerm = ({ children, tooltip }) => {
  return (
    <span className="seq-term" data-tooltip={tooltip || ''}>
      {children}
    </span>
  );
};

export default SeqTerm;
