/**
 * ComparisonTable.jsx — Basic vs Priority Encoder comparison
 *
 * A static reference table showing the key differences between
 * a plain binary encoder and a priority encoder.
 */
import React from "react";
import { COLORS } from "../../shared/theme.js";

// Table data: [feature, basicEncoder, priorityEncoder]
const ROWS = [
  ["Multiple inputs HIGH?",  "❌ Undefined / garbage output",            "✅ Highest-indexed input wins"],
  ["Valid flag V",            "Usually absent",                          "✅ Present — V=1 if any input active"],
  ["Circuit complexity",      "Simpler — OR gates only",                 "Slightly more complex — adds masking"],
  ["Use case",                "Keyboards (1 key at a time)",             "Interrupt controllers (concurrent events)"],
  ["Equations",               "Direct OR of relevant inputs",            "Masking terms added for conflicts"],
  ["Real IC example",         "74HC148 (basic)",                         "74LS148 (priority)"],
];

const ComparisonTable = () => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "system-ui", fontSize: "0.87rem" }}>
      <thead>
        <tr>
          {["Feature", "Basic Binary Encoder", "Priority Encoder"].map((h, i) => (
            <th
              key={i}
              style={{
                padding: "12px 16px",
                background: "rgba(15,23,42,0.9)",
                color: i === 0 ? COLORS.textSecondary : i === 1 ? COLORS.blue : COLORS.warn,
                textAlign: "left",
                borderBottom: "2px solid rgba(99,102,241,0.3)",
                fontWeight: "700",
                fontSize: "0.82rem",
                letterSpacing: "0.04em",
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {ROWS.map(([feat, plain, prio], ri) => (
          <tr key={ri} style={{ background: ri % 2 === 0 ? "rgba(15,23,42,0.4)" : "transparent" }}>
            <td style={{ padding: "11px 16px", color: COLORS.textPrimary,  fontWeight: "600", borderBottom: "1px solid rgba(30,40,60,0.5)" }}>{feat}</td>
            <td style={{ padding: "11px 16px", color: COLORS.blue,         lineHeight: "1.5", borderBottom: "1px solid rgba(30,40,60,0.5)" }}>{plain}</td>
            <td style={{ padding: "11px 16px", color: COLORS.warn,         lineHeight: "1.5", borderBottom: "1px solid rgba(30,40,60,0.5)" }}>{prio}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ComparisonTable;
