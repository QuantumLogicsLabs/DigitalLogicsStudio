import React from "react";

const AFHDLChart = ({ data }) => (
  <div className="afhdl-chart">
    <h4 className="afhdl-info-title">Binary metrics</h4>
    <ul>
      {data.map((item, idx) => (
        <li key={idx}>
          <strong>{item.label}:</strong> {item.value}
        </li>
      ))}
    </ul>
  </div>
);

export default AFHDLChart;
