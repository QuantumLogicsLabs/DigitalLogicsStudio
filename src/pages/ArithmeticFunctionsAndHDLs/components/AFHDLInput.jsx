import React from "react";

const AFHDLInput = ({ label, value, onChange }) => (
  <div className="afhdl-field-group">
    <label className="afhdl-field-label">{label}</label>
    <input
      className="afhdl-input"
      value={value}
      onChange={onChange}
      spellCheck={false}
      autoComplete="off"
    />
  </div>
);

export default AFHDLInput;
