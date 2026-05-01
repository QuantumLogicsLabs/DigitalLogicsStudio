import React from "react";

const AFHDLDataRow = ({ label, value }) => (
  <div className="afhdl-data-row">
    <span className="afhdl-data-label">{label}</span>
    <span className="afhdl-data-value">{value}</span>
  </div>
);

export default AFHDLDataRow;
