import React from 'react';
import { BarChart3 } from 'lucide-react';

const TruthTable = ({ tt }) => {
  return (
    <div className="truth-table-container">
      <div className="truth-table-wrapper">
        <table className="premium-table">
          <thead>
            <tr>
              {tt.headers.map(h => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {tt.rows.map((row, i) => {
              const result = row[row.length - 1];
              return (
                <tr key={i} className={result === 1 ? 'row-active' : ''}>
                  {row.map((cell, j) => (
                    <td key={j} className={j === row.length - 1 ? '' : `cell-${cell}`}>
                      {j === row.length - 1 ? (
                        <span className={`result-badge badge-${cell}`}>{cell === 1 ? 'TRUE' : 'FALSE'}</span>
                      ) : cell}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="table-summary">
        <BarChart3 size={18} className="summary-icon" />
        <span>
          This expression is <strong>TRUE</strong> in {tt.rows.filter(r => r[r.length-1] === 1).length} out of {tt.rows.length} possible cases.
        </span>
      </div>
    </div>
  );
};

export default TruthTable;
