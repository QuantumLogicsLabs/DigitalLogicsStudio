/**
 * CascadingExplainer.jsx
 *
 * Demonstrates how two layers of 2-to-4 decoders can be cascaded
 * to build a 4-to-16 decoder.
 *
 * The user selects:
 *   - Top-level select bits (A3, A2) → which of four child decoders is active
 *   - Inner address bits  (A1, A0)  → which of four outputs within that child
 *
 * The component computes and displays the final active output line.
 */
import React, { useState } from "react";
import { COLORS } from "../../shared/theme.js";

// Labels for each child decoder's output range
const CHIPS = [
  "Chip A (outputs 0–3)",
  "Chip B (outputs 4–7)",
  "Chip C (outputs 8–11)",
  "Chip D (outputs 12–15)",
];

const CascadingExplainer = () => {
  const [chipSelect, setChipSelect] = useState(0); // top-level 2-bit select (0–3)
  const [innerAddr,  setInnerAddr]  = useState(0); // inner 2-bit address (0–3)

  // Final output line in the 4-to-16 decoder
  const activeOutput = chipSelect * 4 + innerAddr;

  return (
    <div
      style={{
        background: COLORS.darkBg,
        borderRadius: "14px",
        padding: "22px",
        border: "1px solid rgba(251,191,36,0.25)",
      }}
    >
      <h4 style={{ color: COLORS.warn, marginBottom: "8px", fontSize: "0.95rem" }}>
        🔗 Cascading — Building a 4-to-16 from 2-to-4 Decoders
      </h4>
      <p style={{ color: COLORS.textSecondary, fontSize: "0.83rem", lineHeight: "1.6", marginBottom: "18px" }}>
        Connect high address bits to a top-level decoder. Each output enables one of four child
        decoders, each handling 4 outputs.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "16px", alignItems: "start" }}>

        {/* ── Left: top-level select ── */}
        <div style={{ textAlign: "center" }}>
          <div style={{ color: COLORS.textSecondary, fontSize: "0.75rem", marginBottom: "8px" }}>
            Top-level select (A3, A2)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {CHIPS.map((label, i) => (
              <button
                key={i}
                onClick={() => setChipSelect(i)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: `1.5px solid ${chipSelect === i ? COLORS.warn : "rgba(99,102,241,0.2)"}`,
                  background: chipSelect === i ? "rgba(251,191,36,0.15)" : "rgba(12,18,35,0.7)",
                  color: chipSelect === i ? COLORS.warn : COLORS.textMuted,
                  cursor: "pointer",
                  fontFamily: "monospace",
                  fontSize: "0.82rem",
                  textAlign: "left",
                }}
              >
                {i.toString(2).padStart(2, "0")}₂ → {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Right: inner address + result ── */}
        <div>
          <div style={{ color: COLORS.textSecondary, fontSize: "0.75rem", marginBottom: "8px" }}>
            Inner address (A1, A0) — select within {CHIPS[chipSelect]}
          </div>

          {/* Inner address buttons */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                onClick={() => setInnerAddr(i)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: `1.5px solid ${innerAddr === i ? COLORS.high : "rgba(99,102,241,0.2)"}`,
                  background: innerAddr === i ? "rgba(0,255,136,0.12)" : "rgba(12,18,35,0.7)",
                  color: innerAddr === i ? COLORS.high : COLORS.textMuted,
                  cursor: "pointer",
                  fontFamily: "monospace",
                  fontSize: "0.85rem",
                }}
              >
                {i.toString(2).padStart(2, "0")}₂
              </button>
            ))}
          </div>

          {/* Active output display */}
          <div style={{ padding: "14px", background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.3)", borderRadius: "10px" }}>
            <div style={{ color: "#86efac", fontSize: "0.75rem", fontWeight: "700", marginBottom: "6px" }}>ACTIVE OUTPUT</div>
            <div style={{ fontFamily: "monospace", color: COLORS.high, fontSize: "1.1rem", fontWeight: "700" }}>
              D{activeOutput} = output #{activeOutput} in the 4-to-16 decoder
            </div>
            <div style={{ color: COLORS.textSecondary, fontSize: "0.8rem", marginTop: "6px" }}>
              Full address: {chipSelect.toString(2).padStart(2,"0")}{innerAddr.toString(2).padStart(2,"0")}₂ = {activeOutput}₁₀
            </div>
          </div>

          {/* Architecture note */}
          <div style={{ marginTop: "14px", padding: "12px 14px", background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "9px" }}>
            <p style={{ color: COLORS.textSecondary, fontSize: "0.82rem", margin: 0, lineHeight: "1.6" }}>
              💡 <strong style={{ color: COLORS.textPrimary }}>How it works:</strong>{" "}
              A3,A2 go into the top decoder. Its output {chipSelect} (binary {chipSelect.toString(2).padStart(2,"0")}) becomes
              the Enable for <strong style={{ color: COLORS.warn }}>{CHIPS[chipSelect]}</strong>.
              Only that chip is enabled; the other three outputs are all LOW.
              Then A1,A0 = {innerAddr.toString(2).padStart(2,"0")} selects D{innerAddr} within that chip → final output D{activeOutput}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CascadingExplainer;
