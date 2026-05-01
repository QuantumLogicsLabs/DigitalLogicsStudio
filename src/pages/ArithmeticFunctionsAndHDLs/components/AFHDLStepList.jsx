import React from "react";

const AFHDLStepList = ({ steps }) => (
  <ol className="afhdl-steps">
    {steps.map((step, idx) => (
      <li key={idx}>{step}</li>
    ))}
  </ol>
);

export default AFHDLStepList;
