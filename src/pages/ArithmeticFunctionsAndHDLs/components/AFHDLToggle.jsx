import React from "react";

const AFHDLToggle = ({ checked, label, onChange }) => (
  <label className="afhdl-toggle">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span>{label}</span>
  </label>
);

export default AFHDLToggle;
