/**
 * FunctionGeneratorDemo.jsx
 *
 * Shows how a 2-to-4 decoder can implement any 2-input Boolean
 * function by OR-ing selected outputs.  The user clicks table rows
 * to toggle which minterms (outputs) contribute to F.
 *
 * Key insight: decoder outputs ARE minterms, so any SOP function
 * can be built without additional AND gates — just one OR gate.
 */
import React, { useState } from "react";
import { COLORS } from "../../shared/theme.js";

const FunctionGeneratorDemo = () => {
  // funcRows[i] = true means minterm i is selected (F=1 for that row)
  const [funcRows, setFuncRows] = useState([false, false, false, false]);

  const toggleRow = (i) =>
    setFuncRows((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });

  // Indices of selected minterms
  const selected = funcRows.map((on, i) => (on ? i : -1)).filter((i) => i >= 0);

  // "F = D0 + D2" style equation using decoder output names
  const decoderOutputEq =
    selected.length === 0 ? "F = 0" : "F = " + selected.map((i) => `D${i}`).join(" + ");

  // Fully expanded minterm SOP
  const mintermSopEq =
    selected.length === 0
      ? "F = 0"
      : "F = " +
        selected
          .map((i) => {
            const a1 = (i >> 1) & 1;
            const a0 = i & 1;
            return `(${a1 ? "A1" : "A1'"}·${a0 ? "A0" : "A0'"})`;
          })
          .join(" + ");

  return (
    <div
      style={{
        background: COLORS.darkBg,
        borderRadius: "14px",
        padding: "22px",
        border: "1px solid rgba(0,255,136,0.25)",
      }}
    >
      <h4 style={{ color: "#86efac", marginBottom: "8px", fontSize: "0.95rem" }}>
        🧩 Decoder as Function Generator
      </h4>
      <p style={{ color: COLORS.textSecondary, fontSize: "0.83rem", lineHeight: "1.6", marginBottom: "18px" }}>
        Check rows where your Boolean function = 1. The decoder + OR gate implements any function of A1, A0 — no K-map needed!
      </p>

      {/* ── Truth table with toggleable F column ── */}
      <div style={{ overflowX: "auto", marginBottom: "18px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "monospace", fontSize: "0.85rem" }}>
          <thead>
            <tr>
              {["Row", "A1", "A0", "Decoder Output", "F = ?"].map((h, i) => (
                <th
                  key={i}
                  style={{
                    padding: "9px 14px",
                    background: "rgba(15,23,42,0.9)",
                    color: i < 3 ? COLORS.blue : i === 3 ? COLORS.warn : COLORS.high,
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
          <tbody>
            {[0, 1, 2, 3].map((i) => {
              const a1 = (i >> 1) & 1;
              const a0 = i & 1;
              return (
                <tr
                  key={i}
                  style={{ background: funcRows[i] ? "rgba(0,255,136,0.07)" : "transparent", cursor: "pointer" }}
                  onClick={() => toggleRow(i)}
                >
                  {/* Row index */}
                  <td style={{ padding: "9px 14px", textAlign: "center", color: COLORS.textSecondary, borderBottom: "1px solid rgba(30,40,60,0.4)" }}>{i}</td>
                  {/* A1 */}
                  <td style={{ padding: "9px 14px", textAlign: "center", color: a1 ? COLORS.blue : COLORS.textDim, borderBottom: "1px solid rgba(30,40,60,0.4)" }}>{a1}</td>
                  {/* A0 */}
                  <td style={{ padding: "9px 14px", textAlign: "center", color: a0 ? COLORS.blue : COLORS.textDim, borderBottom: "1px solid rgba(30,40,60,0.4)" }}>{a0}</td>
                  {/* Decoder output name */}
                  <td style={{ padding: "9px 14px", textAlign: "center", color: COLORS.warn, fontWeight: "600", borderBottom: "1px solid rgba(30,40,60,0.4)" }}>D{i}</td>
                  {/* Toggle F */}
                  <td style={{ padding: "9px 14px", textAlign: "center", borderBottom: "1px solid rgba(30,40,60,0.4)" }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleRow(i); }}
                      style={{
                        width: "32px", height: "20px", borderRadius: "5px",
                        background: funcRows[i] ? COLORS.high : "rgba(99,102,241,0.15)",
                        border: `1.5px solid ${funcRows[i] ? COLORS.high : "rgba(99,102,241,0.3)"}`,
                        color: funcRows[i] ? "#0a0f1a" : COLORS.textDim,
                        cursor: "pointer", fontFamily: "monospace", fontWeight: "800", fontSize: "0.8rem",
                      }}
                    >
                      {funcRows[i] ? "1" : "0"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Equation display ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div style={{ padding: "14px", background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.25)", borderRadius: "10px" }}>
          <div style={{ color: "#86efac", fontSize: "0.75rem", fontWeight: "700", marginBottom: "6px" }}>USING DECODER OUTPUTS</div>
          <code style={{ color: COLORS.high, fontSize: "0.9rem" }}>{decoderOutputEq}</code>
        </div>
        <div style={{ padding: "14px", background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "10px" }}>
          <div style={{ color: COLORS.indigoLight, fontSize: "0.75rem", fontWeight: "700", marginBottom: "6px" }}>EQUIVALENT MINTERM SOP</div>
          <code style={{ color: COLORS.indigoLight, fontSize: "0.85rem", lineHeight: "1.5" }}>{mintermSopEq}</code>
        </div>
      </div>

      {selected.length > 0 && (
        <div style={{ marginTop: "12px", padding: "10px 14px", background: "rgba(251,191,36,0.06)", borderRadius: "8px", color: COLORS.warn, fontSize: "0.82rem" }}>
          ✨ OR gate connects D{selected.join(", D")} outputs → implements your function without any AND gates!
        </div>
      )}
    </div>
  );
};

export default FunctionGeneratorDemo;
