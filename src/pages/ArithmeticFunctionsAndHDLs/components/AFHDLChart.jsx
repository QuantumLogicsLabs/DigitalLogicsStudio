import React from "react";

const AFHDLChart = ({ data }) => (
  <div className="arithmetic-card" style={{ padding: "0.8rem" }}>
    <h4>Binary metrics</h4>
    <ul>
      {data.map((item, idx) => (
        <li key={idx} style={{ marginBottom: "0.3rem" }}>
          <strong>{item.label}:</strong> {item.value}
        </li>
      ))}
    </ul>
  </div>
);

export default AFHDLChart;
