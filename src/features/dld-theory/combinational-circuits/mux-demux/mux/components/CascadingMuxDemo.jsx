/**
 * CascadingMuxDemo.jsx
 *
 * Shows how two 4-to-1 MUXes feed into one 2-to-1 MUX to build an 8-to-1 MUX.
 * The user selects:
 *   - Top group (S2=0 → lower MUX, S2=1 → upper MUX)
 *   - Inner select (S1, S0) → which of 4 within that group
 */
import React, { useState } from "react";
import { COLORS } from "../../shared/theme.js";

const CascadingMuxDemo = () => {
  const [s2, setS2] = useState(0);
  const [s1, setS1] = useState(0);
  const [s0, setS0] = useState(0);

  const groupLabel = s2 === 0 ? "Lower MUX (D0–D3)" : "Upper MUX (D4–D7)";
  const groupRange = s2 === 0 ? "D0–D3" : "D4–D7";
  const innerIdx   = (s1 << 1) | s0;
  const finalInput = s2 * 4 + innerIdx;

  return (
    <div style={{ background: COLORS.darkBg, borderRadius: "14px", padding: "22px", border: "1px solid rgba(251,191,36,0.25)" }}>
      <h4 style={{ color: COLORS.warn, marginBottom: "8px", fontSize: "0.95rem" }}>
        🔗 Building an 8-to-1 MUX from Two 4-to-1 MUXes
      </h4>
      <p style={{ color: COLORS.textSecondary, fontSize: "0.83rem", lineHeight: "1.6", marginBottom: "18px" }}>
        Think of the 8 inputs as two groups of 4. <strong style={{ color: COLORS.textPrimary }}>S2</strong> picks
        the group. Then <strong style={{ color: COLORS.textPrimary }}>S1 and S0</strong> pick one input inside that group.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "18px", alignItems: "start" }}>
        {/* Left: S2 group select */}
        <div style={{ textAlign: "center" }}>
          <div style={{ color: COLORS.textSecondary, fontSize: "0.75rem", marginBottom: "8px" }}>Step 1 — S2 picks the group</div>
          {[0, 1].map((v) => (
            <button
              key={v}
              onClick={() => setS2(v)}
              style={{
                display: "block", width: "100%", padding: "9px 16px", marginBottom: "6px",
                borderRadius: "8px", border: `1.5px solid ${s2 === v ? COLORS.warn : "rgba(99,102,241,0.2)"}`,
                background: s2 === v ? "rgba(251,191,36,0.15)" : COLORS.darkBg,
                color: s2 === v ? COLORS.warn : COLORS.textMuted,
                cursor: "pointer", fontFamily: "monospace", fontSize: "0.82rem",
              }}
            >
              S2={v} → {v === 0 ? "Lower MUX (D0–D3)" : "Upper MUX (D4–D7)"}
            </button>
          ))}
        </div>

        {/* Right: S1,S0 inner + result */}
        <div>
          <div style={{ color: COLORS.textSecondary, fontSize: "0.75rem", marginBottom: "8px" }}>
            Step 2 — S1, S0 pick one input from {groupRange}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "14px" }}>
            {["S1", "S0"].map((label, li) => {
              const val = li === 0 ? s1 : s0;
              const set = li === 0 ? setS1 : setS0;
              return (
                <button
                  key={label}
                  onClick={() => set((v) => v ^ 1)}
                  style={{
                    padding: "9px", borderRadius: "8px",
                    border: `1.5px solid ${val ? COLORS.high : "rgba(99,102,241,0.2)"}`,
                    background: val ? "rgba(0,255,136,0.12)" : COLORS.darkBg,
                    color: val ? COLORS.high : COLORS.textMuted,
                    cursor: "pointer", fontFamily: "monospace", fontSize: "0.85rem",
                  }}
                >
                  {label} = {val}
                </button>
              );
            })}
          </div>

          {/* Active input display */}
          <div style={{ padding: "14px", background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.3)", borderRadius: "10px" }}>
            <div style={{ color: "#86efac", fontSize: "0.75rem", fontWeight: "700", marginBottom: "6px" }}>SELECTED INPUT</div>
            <div style={{ fontFamily: "monospace", color: COLORS.high, fontSize: "1.1rem", fontWeight: "700" }}>
              D{finalInput} passes to output Y
            </div>
            <div style={{ color: COLORS.textSecondary, fontSize: "0.8rem", marginTop: "6px" }}>
              Shortcut: read S2 S1 S0 as one binary number → {s2}{s1}{s0} = {finalInput}, so D{finalInput}.
            </div>
          </div>

          <div style={{ marginTop: "12px", padding: "12px 14px", background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "9px" }}>
            <p style={{ color: COLORS.textSecondary, fontSize: "0.82rem", margin: 0, lineHeight: "1.6" }}>
              💡 <strong style={{ color: COLORS.textPrimary }}>In plain words:</strong>{" "}
              S2 = {s2}, so we use the <strong style={{ color: COLORS.warn }}>{groupLabel}</strong>.
              S1 S0 = {s1}{s0} in binary, which is {innerIdx}. So we take input number {innerIdx} of
              that group (counting 0, 1, 2, 3) → <strong style={{ color: COLORS.high }}>D{finalInput}</strong>.
            </p>
            <p style={{ color: COLORS.textMuted, fontSize: "0.78rem", margin: "8px 0 0", lineHeight: "1.6" }}>
              Inside the real circuit, both 4-to-1 MUXes use S1 S0 at the same time. The final 2-to-1 MUX
              then uses S2 to decide which of their two outputs reaches Y.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CascadingMuxDemo;
