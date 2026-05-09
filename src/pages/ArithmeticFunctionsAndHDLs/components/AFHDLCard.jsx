import React from "react";

const AFHDLCard = ({ title, subtitle, children }) => (
  <div className="arithmetic-card">
    <h3>{title}</h3>
    {subtitle && <p className="subtext">{subtitle}</p>}
    <div>{children}</div>
  </div>
);

export default AFHDLCard;
