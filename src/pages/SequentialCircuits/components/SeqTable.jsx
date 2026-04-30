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

const renderCellContent = (content) => {
  if (React.isValidElement(content)) return content;
  if (typeof content === 'string') {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return content;
};

export default function SeqTable({ data, className = 'seq-table-comparison' }) {
  if (!data) return null;
  const { headers, rows } = data;

  return (
    <div className="seq-table-wrap">
      <table className={`seq-table ${className}`}>
        <thead>
          <tr>
            {headers.map((header, index) => {
              const isFirst = index === 0;
              const headerClass = isFirst ? 'seq-table-head seq-table-head-feature' : 'seq-table-head';
              const content = typeof header === 'string' ? <div dangerouslySetInnerHTML={{ __html: header }} /> : header;
              return (
                <th key={index} className={headerClass}>
                  {content}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {headers.map((header, i) => {
                const isFirst = i === 0;
                const cellClass = isFirst ? 'seq-table-cell seq-table-cell-feature' : 'seq-table-cell';
                const value = resolveCellValue(row, header);
                return (
                  <td key={i} className={cellClass}>
                    {renderCellContent(value)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
