/**
 * TruthTable.jsx — Shared truth-table renderer
 *
 * Renders a bordered table from plain arrays.  An optional
 * `activeRow` index highlights the currently decoded/encoded row.
 *
 * Props:
 *   headers    : string[]      — column headers
 *   rows       : string[][]   — data rows
 *   activeRow  : number | null — index of highlighted row (-1 = none)
 *   inputCount : number        — how many leading columns are "inputs"
 *                               (colored blue vs amber for outputs)
 */
import React from "react";
import { COLORS } from "../theme.js";

const TruthTable = ({ headers, rows, activeRow = -1, inputCount = 1 }) => (
  <div style={{ overflowX: "auto" }}>
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontFamily: "monospace",
        fontSize: "0.82rem",
      }}
    >
      {/* ── Header row ── */}
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th
              key={i}
              style={{
                padding: "8px 14px",
                background: "rgba(15,23,42,0.9)",
                color: i < inputCount ? COLORS.blue : COLORS.warn,
                textAlign: "center",
                borderBottom: "1px solid rgba(99,102,241,0.3)",
                fontSize: "0.8rem",
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>

      {/* ── Data rows ── */}
      <tbody>
        {rows.map((row, ri) => {
          const isActive = ri === activeRow;
          return (
            <tr
              key={ri}
              style={{
                background: isActive
                  ? "rgba(0,255,136,0.08)"
                  : "transparent",
                transition: "background 0.2s",
              }}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  style={{
                    padding: "8px 14px",
                    textAlign: "center",
                    borderBottom: "1px solid rgba(30,40,60,0.4)",
                    color:
                      isActive
                        ? ci < inputCount
                          ? COLORS.blue
                          : COLORS.high
                        : ci < inputCount
                        ? COLORS.textMuted
                        : COLORS.textDim,
                    fontWeight: isActive ? "700" : "400",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default TruthTable;
