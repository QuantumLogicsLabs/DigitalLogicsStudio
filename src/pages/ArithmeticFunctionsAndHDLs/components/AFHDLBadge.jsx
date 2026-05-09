import React from "react";

const AFHDLBadge = ({ label, color = "#60a5fa" }) => (
  <span
    style={{
      display: "inline-block",
      backgroundColor: color,
      color: "white",
      borderRadius: "999px",
      padding: "0.2rem 0.65rem",
      fontSize: "0.78rem",
      marginRight: "0.35rem",
      fontWeight: 600,
    }}
  >
    {label}
  </span>
);

export default AFHDLBadge;
