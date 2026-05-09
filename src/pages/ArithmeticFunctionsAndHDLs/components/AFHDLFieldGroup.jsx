import React from "react";

const AFHDLFieldGroup = ({ label, children }) => (
  <div style={{ marginBottom: "0.8rem" }}>
    <div style={{ color: "#cbd5e1", marginBottom: "0.2rem" }}>{label}</div>
    {children}
  </div>
);

export default AFHDLFieldGroup;
