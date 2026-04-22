/**
 * BinaryIndexExplorer.jsx
 *
 * Teaches the "binary-index trick" interactively.
 * The user picks a number of inputs (4, 8, or 16) and an output bit
 * to examine (A0, A1, …).  The table highlights every input index
 * whose binary representation has that bit set, and auto-generates
 * the OR equation for that output.
 */
import React, { useState } from "react";
import { COLORS } from "../../shared/theme.js";

const BinaryIndexExplorer = () => {
  const [numInputs,   setNumInputs]   = useState(8);
  const [selectedBit, setSelectedBit] = useState(0);

  const numBits   = Math.log2(numInputs);                          // number of output bits
  const indices   = Array.from({ length: numInputs }, (_, i) => i);
  const highlighted = indices.filter((i) => (i >> selectedBit) & 1); // indices where bit k = 1

  const equation =
    highlighted.length > 0
      ? `A${selectedBit} = ${highlighted.map((i) => `I${i}`).join(" + ")}`
      : `A${selectedBit} = 0`;

  return (
    <div
      style={{
        background: COLORS.darkBg,
        borderRadius: "14px",
        padding: "22px",
        border: "1px solid rgba(99,102,241,0.3)",
      }}
    >
      {/* ── Controls row ── */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
        {/* Number of inputs picker */}
        <div>
          <label style={{ color: COLORS.textSecondary, fontSize: "0.8rem", display: "block", marginBottom: "6px" }}>
            Number of Inputs
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            {[4, 8, 16].map((n) => (
              <button
                key={n}
                onClick={() => { setNumInputs(n); setSelectedBit(0); }}
                style={{
                  padding: "7px 16px",
                  borderRadius: "8px",
                  border: `1.5px solid ${numInputs === n ? COLORS.indigo : "rgba(99,102,241,0.25)"}`,
                  background: numInputs === n ? "rgba(99,102,241,0.25)" : "transparent",
                  color: numInputs === n ? COLORS.indigoLight : COLORS.textMuted,
                  cursor: "pointer",
                  fontFamily: "monospace",
                  fontSize: "0.9rem",
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Output bit picker */}
        <div>
          <label style={{ color: COLORS.textSecondary, fontSize: "0.8rem", display: "block", marginBottom: "6px" }}>
            Select Output Bit Aₖ
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            {Array.from({ length: numBits }, (_, k) => (
              <button
                key={k}
                onClick={() => setSelectedBit(k)}
                style={{
                  padding: "7px 16px",
                  borderRadius: "8px",
                  border: `1.5px solid ${selectedBit === k ? COLORS.warn : "rgba(251,191,36,0.2)"}`,
                  background: selectedBit === k ? "rgba(251,191,36,0.15)" : "transparent",
                  color: selectedBit === k ? COLORS.warn : COLORS.textMuted,
                  cursor: "pointer",
                  fontFamily: "monospace",
                }}
              >
                A{k}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Binary index table ── */}
      <div style={{ overflowX: "auto", marginBottom: "18px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "monospace", fontSize: "0.82rem" }}>
          <thead>
            <tr>
              <th style={{ padding: "8px 12px", color: COLORS.blue, textAlign: "center", borderBottom: "1px solid rgba(99,102,241,0.3)", background: "rgba(15,23,42,0.8)" }}>
                Index
              </th>
              {Array.from({ length: numBits }, (_, k) => (
                <th
                  key={k}
                  style={{
                    padding: "8px 12px",
                    color: k === selectedBit ? COLORS.warn : COLORS.textSecondary,
                    textAlign: "center",
                    borderBottom: "1px solid rgba(99,102,241,0.3)",
                    background: k === selectedBit ? "rgba(251,191,36,0.1)" : "rgba(15,23,42,0.8)",
                    fontWeight: k === selectedBit ? "800" : "600",
                  }}
                >
                  bit-{k} {k === selectedBit ? "← selected" : ""}
                </th>
              ))}
              <th style={{ padding: "8px 12px", color: COLORS.textSecondary, textAlign: "center", borderBottom: "1px solid rgba(99,102,241,0.3)", background: "rgba(15,23,42,0.8)" }}>
                Include in A{selectedBit}?
              </th>
            </tr>
          </thead>
          <tbody>
            {indices.map((i) => {
              const isHighlighted = !!((i >> selectedBit) & 1);
              return (
                <tr
                  key={i}
                  style={{ background: isHighlighted ? "rgba(251,191,36,0.07)" : "transparent" }}
                >
                  {/* Index label */}
                  <td style={{ padding: "7px 12px", textAlign: "center", color: COLORS.textPrimary, borderBottom: "1px solid rgba(30,40,60,0.5)" }}>
                    I{i}
                  </td>
                  {/* Bit columns */}
                  {Array.from({ length: numBits }, (_, k) => {
                    const bit = (i >> k) & 1;
                    return (
                      <td
                        key={k}
                        style={{
                          padding: "7px 12px",
                          textAlign: "center",
                          color: k === selectedBit ? (bit ? COLORS.warn : "#374151") : (bit ? COLORS.blue : "#374151"),
                          fontWeight: k === selectedBit && bit ? "800" : "400",
                          borderBottom: "1px solid rgba(30,40,60,0.5)",
                          background: k === selectedBit ? "rgba(251,191,36,0.05)" : "transparent",
                        }}
                      >
                        {bit}
                      </td>
                    );
                  })}
                  {/* Include? */}
                  <td style={{ padding: "7px 12px", textAlign: "center", borderBottom: "1px solid rgba(30,40,60,0.5)" }}>
                    {isHighlighted
                      ? <span style={{ color: COLORS.high, fontWeight: "700" }}>✓ YES</span>
                      : <span style={{ color: "#374151" }}>—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Generated equation ── */}
      <div style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.35)", borderRadius: "10px", padding: "16px" }}>
        <div style={{ color: COLORS.textSecondary, fontSize: "0.8rem", marginBottom: "4px" }}>Generated Equation:</div>
        <code style={{ color: COLORS.warn, fontSize: "1.05rem", fontWeight: "700" }}>{equation}</code>
        <p style={{ color: COLORS.textSecondary, fontSize: "0.82rem", margin: "10px 0 0", lineHeight: "1.6" }}>
          ✨ <strong style={{ color: COLORS.textPrimary }}>The trick:</strong>{" "}
          Look at the column for bit-{selectedBit}. Every row with a 1 in that column
          contributes its input to A{selectedBit}. Just OR them all!
        </p>
      </div>
    </div>
  );
};

export default BinaryIndexExplorer;
