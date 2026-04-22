/**
 * BCDDigitPad.jsx — Interactive BCD-to-7-segment demo
 *
 * Shows a clickable digit pad (0–9). Clicking a digit updates the
 * 7-segment display and shows the BCD code and active segments.
 *
 * Uses the SevenSeg component for the display itself.
 */
import React, { useState } from "react";
import { COLORS } from "../../shared/theme.js";
import SevenSeg from "./SevenSeg.jsx";

// BCD truth table: index = digit, value = [a,b,c,d,e,f,g]
const BCD_TABLE = [
  [1,1,1,1,1,1,0], // 0
  [0,1,1,0,0,0,0], // 1
  [1,1,0,1,1,0,1], // 2
  [1,1,1,1,0,0,1], // 3
  [0,1,1,0,0,1,1], // 4
  [1,0,1,1,0,1,1], // 5
  [1,0,1,1,1,1,1], // 6
  [1,1,1,0,0,0,0], // 7
  [1,1,1,1,1,1,1], // 8
  [1,1,1,1,0,1,1], // 9
];

const SEG_NAMES = ["a","b","c","d","e","f","g"];

// Convert segment array to segs object expected by SevenSeg
const toSegsObj = (arr) =>
  Object.fromEntries(SEG_NAMES.map((name, i) => [name, arr[i]]));

const BCDDigitPad = () => {
  const [digit, setDigit] = useState(0);

  const segs    = toSegsObj(BCD_TABLE[digit]);
  const bcdBits = digit.toString(2).padStart(4, "0");
  const activeSegNames = SEG_NAMES.filter((_, i) => BCD_TABLE[digit][i]);

  return (
    <div>
      {/* ── Digit pad ── */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "24px" }}>
        {Array.from({ length: 10 }, (_, i) => (
          <button
            key={i}
            onClick={() => setDigit(i)}
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "10px",
              border: `2px solid ${digit === i ? COLORS.high : "rgba(99,102,241,0.25)"}`,
              background: digit === i ? "rgba(0,255,136,0.15)" : "rgba(12,18,35,0.7)",
              color: digit === i ? COLORS.high : COLORS.textMuted,
              fontFamily: "monospace",
              fontWeight: "700",
              fontSize: "1.1rem",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: digit === i ? "0 0 12px rgba(0,255,136,0.3)" : "none",
            }}
          >
            {i}
          </button>
        ))}
      </div>

      {/* ── Display + info row ── */}
      <div style={{ display: "flex", gap: "28px", alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* 7-segment display */}
        <SevenSeg segs={segs} />

        {/* BCD info panel */}
        <div style={{ flex: 1, minWidth: "220px" }}>
          {/* BCD code */}
          <div style={{ marginBottom: "16px", padding: "14px", background: "rgba(12,18,35,0.8)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "10px" }}>
            <div style={{ color: COLORS.textSecondary, fontSize: "0.75rem", marginBottom: "6px" }}>BCD CODE (ABCD)</div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {bcdBits.split("").map((bit, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ color: COLORS.textDim, fontSize: "0.65rem", marginBottom: "4px" }}>{"ABCD"[i]}</div>
                  <div
                    style={{
                      width: "30px", height: "30px", borderRadius: "6px",
                      background: bit === "1" ? "rgba(0,255,136,0.15)" : "rgba(99,102,241,0.1)",
                      border: `1.5px solid ${bit === "1" ? COLORS.high : "rgba(99,102,241,0.2)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "monospace", fontWeight: "700",
                      color: bit === "1" ? COLORS.high : COLORS.textDim,
                    }}
                  >
                    {bit}
                  </div>
                </div>
              ))}
              <div style={{ color: COLORS.textMuted, fontSize: "0.8rem", marginLeft: "6px" }}>
                = {digit}₁₀
              </div>
            </div>
          </div>

          {/* Active segments */}
          <div style={{ padding: "14px", background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: "10px" }}>
            <div style={{ color: "#86efac", fontSize: "0.75rem", marginBottom: "8px" }}>ACTIVE SEGMENTS</div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {SEG_NAMES.map((seg) => {
                const isOn = segs[seg];
                return (
                  <span
                    key={seg}
                    style={{
                      padding: "3px 10px",
                      borderRadius: "5px",
                      fontFamily: "monospace",
                      fontWeight: "700",
                      fontSize: "0.85rem",
                      background: isOn ? "rgba(0,255,136,0.15)" : "rgba(99,102,241,0.08)",
                      color: isOn ? COLORS.high : COLORS.textDim,
                      border: `1px solid ${isOn ? "rgba(0,255,136,0.3)" : "rgba(99,102,241,0.15)"}`,
                    }}
                  >
                    {seg}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Segment name reference ── */}
      <div style={{ marginTop: "18px", padding: "14px", background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: "10px" }}>
        <h4 style={{ color: COLORS.warn, marginBottom: "10px", fontSize: "0.88rem" }}>
          💡 7-Segment Label Reference
        </h4>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {[
            ["a","top horizontal bar"],
            ["b","top-right vertical"],
            ["c","bottom-right vertical"],
            ["d","bottom horizontal bar"],
            ["e","bottom-left vertical"],
            ["f","top-left vertical"],
            ["g","middle horizontal bar"],
          ].map(([seg, name]) => (
            <div key={seg} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <span style={{ fontFamily: "monospace", color: COLORS.high, fontWeight: "700", width: "14px" }}>{seg}</span>
              <span style={{ color: COLORS.textMuted, fontSize: "0.78rem" }}>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BCDDigitPad;
