import React from "react";

const normalizeKey = (value) =>
  String(value)
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[()/]/g, "")
    .replace(/[^a-z0-9\u0300-\u036f\u0330-\u033f\u20d0-\u20ff]/g, "");

const resolveCellValue = (row, header) => {
  if (Object.prototype.hasOwnProperty.call(row, header)) return row[header];

  const targetKey = normalizeKey(header);
  const matchingKey = Object.keys(row).find((key) => normalizeKey(key) === targetKey);
  if (matchingKey) return row[matchingKey];

  return "—";
};

export default function SeqTable({ data }) {
  if (!data) return null; // Handle empty data gracefully
  const { headers, rows } = data;

  return (
    <div className="seq-table-wrap">
      <table className="seq-table seq-table-comparison">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className={index === 0 ? 'seq-table-head seq-table-head-feature' : 'seq-table-head'}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {headers.map((header, i) => (
                <td key={i} className={i === 0 ? 'seq-table-cell seq-table-cell-feature' : 'seq-table-cell'}>
                  {resolveCellValue(row, header)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
