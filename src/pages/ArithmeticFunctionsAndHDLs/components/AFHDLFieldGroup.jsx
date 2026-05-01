import React from "react";

const AFHDLFieldGroup = ({ label, children }) => (
  <div className="afhdl-field-group">
    <div className="afhdl-field-label">{label}</div>
    {children}
  </div>
);

export default AFHDLFieldGroup;
