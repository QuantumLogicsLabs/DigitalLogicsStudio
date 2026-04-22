import React from "react";

export default function SeqTable({ data }) {
  if (!data) return null; // Handle empty data gracefully
  const { headers, rows } = data;

  return (
    <div className="seq-table-wrap">
      <table className="seq-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {headers.map((header, i) => (
                <td key={i}>{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
