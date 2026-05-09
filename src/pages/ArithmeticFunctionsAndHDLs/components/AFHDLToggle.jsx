import React from "react";

const AFHDLToggle = ({ checked, label, onChange }) => (
  <div className="arithmetic-toggle">
    <label>
      <input type="checkbox" checked={checked} onChange={onChange} /> {label}
    </label>
  </div>
);

export default AFHDLToggle;
