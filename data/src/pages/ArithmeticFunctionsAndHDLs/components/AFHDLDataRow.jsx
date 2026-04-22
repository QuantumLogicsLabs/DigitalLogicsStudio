import React from "react";

const AFHDLDataRow = ({ label, value }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "0.3rem 0",
    }}
  >
    <span style={{ color: "#a5b4fc" }}>{label}</span>
    <span style={{ color: "#e5e7eb", fontWeight: 600 }}>{value}</span>
  </div>
);

export default AFHDLDataRow;
