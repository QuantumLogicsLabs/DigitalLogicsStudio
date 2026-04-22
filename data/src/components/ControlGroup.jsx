import React from 'react';

const ControlGroup = ({ label, children, className }) => {
  return (
    <div className={["control-group", className].filter(Boolean).join(" ")}>
      {label && <label className="control-label">{label}</label>}
      {children}
    </div>
  );
};

export default ControlGroup;
