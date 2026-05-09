import React from "react";

const AFHDLStepList = ({ steps }) => (
  <ol style={{ textAlign: "left", marginLeft: "1rem" }}>
    {steps.map((step, idx) => (
      <li key={idx} style={{ margin: "0.32rem 0" }}>
        {step}
      </li>
    ))}
  </ol>
);

export default AFHDLStepList;
