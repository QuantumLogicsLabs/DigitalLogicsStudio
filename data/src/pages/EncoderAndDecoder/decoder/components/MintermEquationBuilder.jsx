/**
 * MintermEquationBuilder.jsx
 *
 * Teaches the minterm-to-equation derivation rule interactively.
 * The user picks how many input bits and which output minterm to
 * examine. The component shows:
 *   - The binary representation of the selected address
 *   - Which inputs are used direct vs complemented
 *   - The resulting Boolean equation
 *
 * Key concept: bit=1 in address → use input directly
 *              bit=0 in address → complement the input
 */
import React, { useState } from "react";
import { COLORS } from "../../shared/theme.js";

// Generate input names for n bits: A, B, C... or A0, A1, A2...
const makeInputNames = (n) => {
  if (n <= 3) return ["A2", "A1", "A0"].slice(3 - n);
  return Array.from({ length: n }, (_, i) => `A${n - 1 - i}`);
};

const MintermEquationBuilder = () => {
  const [numBits,        setNumBits]        = useState(2); // number of address bits
  const [selectedMinterm, setSelectedMinterm] = useState(0); // which output Di to explore

  const numOutputs = 1 << numBits;  // 2^numBits
  const inputs     = makeInputNames(numBits);
  const binary     = selectedMinterm.toString(2).padStart(numBits, "0");

  // Build the equation term for each input bit based on address bit value
  const termParts = inputs.map((inp, i) => {
    const bit = (selectedMinterm >> (numBits - 1 - i)) & 1;
    return bit === 1 ? inp : inp + "'"; // complement if bit is 0
  });
  const equation = "E · " + termParts.join(" · ");

  return (
    <div
      style={{
        background: COLORS.darkBg,
        borderRadius: "14px",
        padding: "22px",
        border: "1px solid rgba(99,102,241,0.3)",
      }}
    >
      <h4 style={{ color: "#86efac", marginBottom: "14px", fontSize: "0.95rem" }}>
        🔢 Step-by-Step Equation Builder
      </h4>

      {/* ── Control row: bit count selector ── */}
      <div style={{ marginBottom: "18px" }}>
        <label style={{ color: COLORS.textSecondary, fontSize: "0.8rem", display: "block", marginBottom: "10px" }}>
          Number of Input Bits:
        </label>
        <div style={{ display: "flex", gap: "8px" }}>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              onClick={() => { setNumBits(n); setSelectedMinterm(0); }}
              style={{
                padding: "8px 18px",
                borderRadius: "9px",
                border: `1.5px solid ${numBits === n ? COLORS.indigo : "rgba(99,102,241,0.25)"}`,
                background: numBits === n ? "rgba(99,102,241,0.25)" : "transparent",
                color: numBits === n ? COLORS.indigoLight : COLORS.textMuted,
                cursor: "pointer",
                fontFamily: "monospace",
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* ── Output minterm selector ── */}
      <div style={{ marginBottom: "18px" }}>
        <label style={{ color: COLORS.textSecondary, fontSize: "0.8rem", display: "block", marginBottom: "10px" }}>
          Select Output (click to explore which minterm to build):
        </label>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {Array.from({ length: numOutputs }, (_, i) => (
            <button
              key={i}
              onClick={() => setSelectedMinterm(i)}
              style={{
                padding: "9px 14px",
                borderRadius: "9px",
                border: `2px solid ${selectedMinterm === i ? COLORS.warn : "rgba(99,102,241,0.2)"}`,
                background: selectedMinterm === i ? "rgba(251,191,36,0.15)" : "rgba(12,18,35,0.6)",
                color: selectedMinterm === i ? COLORS.warn : COLORS.textMuted,
                cursor: "pointer",
                fontFamily: "monospace",
                fontWeight: selectedMinterm === i ? "700" : "400",
                transition: "all 0.2s",
              }}
            >
              D{i}
            </button>
          ))}
        </div>
      </div>

      {/* ── Binary address + rule display ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "18px" }}>
        {/* Binary address card */}
        <div style={{ padding: "16px", background: "rgba(12,18,35,0.8)", borderRadius: "10px", border: "1px solid rgba(99,102,241,0.2)" }}>
          <div style={{ color: COLORS.textSecondary, fontSize: "0.75rem", marginBottom: "8px" }}>ADDRESS IN BINARY</div>
          <div style={{ fontFamily: "monospace", fontSize: "1.3rem", color: COLORS.blue, fontWeight: "700", letterSpacing: "6px" }}>
            {binary}₂
          </div>
          <div style={{ color: COLORS.textDim, fontSize: "0.78rem", marginTop: "4px" }}>
            = {selectedMinterm}₁₀
          </div>
        </div>

        {/* Complement / direct rule card */}
        <div style={{ padding: "16px", background: "rgba(12,18,35,0.8)", borderRadius: "10px", border: "1px solid rgba(251,191,36,0.3)" }}>
          <div style={{ color: COLORS.textSecondary, fontSize: "0.75rem", marginBottom: "8px" }}>RULE</div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {inputs.map((inp, i) => {
              const bit = (selectedMinterm >> (numBits - 1 - i)) & 1;
              return (
                <div key={inp} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                  <span style={{ fontFamily: "monospace", fontSize: "0.85rem", color: bit ? "#4ade80" : "#f87171" }}>
                    {bit === 1 ? inp : inp + "'"}
                  </span>
                  <span style={{ fontSize: "0.65rem", color: bit ? "#4ade80" : "#f87171" }}>
                    {bit === 1 ? "DIRECT" : "COMPLEMENT"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Resulting equation ── */}
      <div style={{ background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: "10px", padding: "16px" }}>
        <div style={{ color: COLORS.textSecondary, fontSize: "0.75rem", marginBottom: "6px" }}>RESULTING BOOLEAN EQUATION</div>
        <code style={{ color: COLORS.warn, fontSize: "1.05rem", fontWeight: "700" }}>
          D{selectedMinterm} = {equation}
        </code>
        <p style={{ color: COLORS.textSecondary, fontSize: "0.82rem", marginTop: "10px", lineHeight: "1.6", marginBottom: 0 }}>
          🔑 <strong style={{ color: COLORS.textPrimary }}>Pattern:</strong> Bit=1 in address → use input directly.
          Bit=0 → complement it. AND everything together with E.
        </p>
      </div>
    </div>
  );
};

export default MintermEquationBuilder;
