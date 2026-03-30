import React from "react";

const AFHDLInput = ({ label, value, onChange }) => (
  <div style={{ marginBottom: "0.85rem" }}>
    <label
      style={{ display: "block", color: "#dbeafe", marginBottom: "0.25rem" }}
    >
      {label}
    </label>
    <input
      className="tool-input"
      value={value}
      onChange={onChange}
      style={{ width: "100%" }}
      spellCheck={false}
      autoComplete="off"
    />
  </div>
);

export default AFHDLInput;
