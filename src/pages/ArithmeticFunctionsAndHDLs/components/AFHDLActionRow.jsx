import React from "react";

const AFHDLActionRow = ({ children }) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "0.5rem",
      margin: "0.8rem 0",
    }}
  >
    {children}
  </div>
);

export default AFHDLActionRow;
