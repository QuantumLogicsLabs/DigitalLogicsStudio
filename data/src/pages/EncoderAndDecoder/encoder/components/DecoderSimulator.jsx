/**
 * DecoderSimulator.jsx — Interactive decoder simulator
 *
 * Lets the user toggle address inputs (and the Enable pin) and watch
 * which output goes HIGH in real time.  Also shows:
 *   - A summary box with the active decoding
 *   - The 7-segment display (BCD mode)
 *   - Expandable Boolean equations with explanations
 *
 * Props:
 *   selectedType : string
 *   inputVals    : number[]   — current input bit array (shared with parent)
 *   setInputVals : fn         — setter from parent
 *   types        : object     — DECODER_TYPES map
 */
import React, { useState, useMemo } from "react";
import { COLORS, bitIndicatorStyle } from "../../shared/theme.js";
import TruthTable from "../../shared/components/TruthTable.jsx";
import SevenSeg from "./SevenSeg.jsx";

// ─── Sub: single input toggle button ──────────────────────────────────────────
const InputToggle = ({ label, value, isActive, onClick, activeColor = COLORS.blue }) => (
  <button
    onClick={onClick}
    style={{
      width: "100%",
      padding: "10px 14px",
      borderRadius: "9px",
      border: `2px solid ${isActive ? activeColor : COLORS.indigoMuted}`,
      background: isActive ? `${activeColor}1a` : COLORS.inputBg,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      marginBottom: "8px",
      transition: "all 0.2s",
    }}
  >
    <span style={{ color: isActive ? activeColor : COLORS.textMuted, fontFamily: "monospace", fontWeight: "700" }}>
      {label}
    </span>
    <span style={bitIndicatorStyle(isActive, activeColor)}>
      {value}
    </span>
  </button>
);

// ─── Sub: expandable Boolean equation row ─────────────────────────────────────
const EquationRow = ({ eq, isExpanded, onToggle }) => (
  <div
    style={{
      borderRadius: "10px",
      border: `1px solid ${eq.color}30`,
      background: "rgba(8,14,30,0.7)",
      marginBottom: "8px",
      overflow: "hidden",
    }}
  >
    {/* Collapsed header (always visible) */}
    <button
      onClick={onToggle}
      style={{
        width: "100%",
        padding: "12px 16px",
        background: "transparent",
        border: "none",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <div>
        <span style={{ color: eq.color, fontFamily: "monospace", fontWeight: "700", fontSize: "0.88rem" }}>
          {eq.out}
        </span>
        <span style={{ color: COLORS.textSecondary, fontFamily: "monospace", marginLeft: "12px", fontSize: "0.85rem" }}>
          {eq.eq}
        </span>
      </div>
      <span style={{ color: COLORS.textMuted, fontSize: "0.75rem" }}>
        {isExpanded ? "▲" : "▼"}
      </span>
    </button>

    {/* Expanded explanation */}
    {isExpanded && (
      <div style={{ padding: "0 16px 14px", borderTop: `1px solid ${eq.color}20` }}>
        <p style={{ color: COLORS.textSecondary, fontSize: "0.86rem", lineHeight: "1.7", margin: "12px 0" }}>
          {eq.explanation}
        </p>
        <div
          style={{
            padding: "10px 14px",
            background: `${eq.color}12`,
            border: `1px solid ${eq.color}35`,
            borderRadius: "8px",
          }}
        >
          <span style={{ color: eq.color, fontSize: "0.78rem", fontWeight: "700" }}>🎯 MEMORY TRICK: </span>
          <span style={{ color: COLORS.textPrimary, fontSize: "0.82rem" }}>{eq.trick}</span>
        </div>
      </div>
    )}
  </div>
);

// ─── Main component ────────────────────────────────────────────────────────────
const DecoderSimulator = ({ selectedType, inputVals, setInputVals, types }) => {
  const config = types[selectedType];
  const [expandedEq, setExpandedEq] = useState(null);
  const [enable, setEnable]         = useState(true);

  const is7seg = selectedType === "BCD7seg";

  // Slice the input array to match how many code inputs this type has
  const codeVals = config.codeInputs.map((_, i) => inputVals[i] ?? 0);

  // Re-run the decode function whenever inputs change
  const result = useMemo(
    () => config.decode(codeVals, enable),
    [config, codeVals, enable],
  );

  // The decimal value of the current address
  const binaryValue = codeVals.reduce(
    (acc, bit, i) => acc + (bit << (config.codeInputs.length - 1 - i)),
    0,
  );

  const outputEntries = config.outputs.map((name) => ({ name, val: result[name] ?? 0 }));

  const toggleCode = (idx) => {
    const next = [...inputVals];
    next[idx] = next[idx] ? 0 : 1;
    setInputVals(next);
  };

  const resetInputs = () => setInputVals(Array(4).fill(0));

  const toggleEq = (i) => setExpandedEq(expandedEq === i ? null : i);

  // ── Render ──
  return (
    <div>
      {/* ── Row: inputs on left, outputs on right ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>

        {/* Left: address inputs + enable */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
            <h4 style={{ color: COLORS.blue, margin: 0, fontSize: "0.9rem" }}>📥 Address Inputs</h4>
            <button onClick={resetInputs} style={{ padding: "5px 12px", borderRadius: "7px", border: "1px solid rgba(148,163,184,0.2)", background: "transparent", color: COLORS.textMuted, cursor: "pointer", fontSize: "0.78rem" }}>
              Reset
            </button>
          </div>

          {/* Enable toggle (not shown for BCD-7seg) */}
          {config.enableInput && (
            <InputToggle
              label="E (Enable)"
              value={enable ? 1 : 0}
              isActive={enable}
              onClick={() => setEnable(!enable)}
              activeColor={COLORS.warn}
            />
          )}

          {/* Code input toggles */}
          {config.codeInputs.map((name, idx) => (
            <InputToggle
              key={name}
              label={name}
              value={codeVals[idx]}
              isActive={!!codeVals[idx]}
              onClick={() => toggleCode(idx)}
              activeColor={COLORS.blue}
            />
          ))}

          {/* Decoding summary */}
          <div style={{ padding: "12px 14px", background: "rgba(8,14,30,0.8)", border: `1px solid ${COLORS.indigoMuted}`, borderRadius: "9px", marginTop: "8px" }}>
            {enable && result.active >= 0 ? (
              <>
                <div style={{ color: "#86efac", fontSize: "0.75rem", fontWeight: "700", marginBottom: "4px" }}>DECODING</div>
                <div style={{ fontFamily: "monospace", color: COLORS.high, fontSize: "1.05rem", fontWeight: "700" }}>
                  {codeVals.join("")}₂ = {binaryValue}₁₀ → {is7seg ? `digit ${binaryValue}` : `D${result.active}`}
                </div>
              </>
            ) : !enable ? (
              <div style={{ color: COLORS.low, fontSize: "0.85rem" }}>⚠️ Chip disabled (E=0) — all outputs LOW</div>
            ) : (
              <div style={{ color: COLORS.textDim, fontSize: "0.85rem", fontStyle: "italic" }}>
                {is7seg ? "BCD > 9 = invalid input" : "No input selected"}
              </div>
            )}
          </div>
        </div>

        {/* Right: output indicators */}
        <div>
          <h4 style={{ color: COLORS.warn, marginBottom: "12px", fontSize: "0.9rem" }}>
            📤 Outputs {is7seg ? "— 7 Segment" : ""}
          </h4>

          {is7seg ? (
            /* 7-seg display + segment list */
            <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
              <SevenSeg segs={result} />
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {outputEntries.map(({ name, val }) => (
                  <div key={name} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span style={{ color: COLORS.textDim, fontFamily: "monospace", fontSize: "0.8rem", width: "16px" }}>{name}</span>
                    <div style={{ ...bitIndicatorStyle(!!val, COLORS.high), width: "20px", height: "12px" }}>
                      <span style={{ fontSize: "0.65rem" }}>{val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Standard output list */
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              {outputEntries.map(({ name, val }) => {
                const isHigh = !!val;
                return (
                  <div key={name} style={{ padding: "9px 14px", borderRadius: "9px", border: `2px solid ${isHigh ? COLORS.high : "rgba(148,163,184,0.12)"}`, background: isHigh ? "rgba(0,255,136,0.08)" : COLORS.inputBg, display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s" }}>
                    <span style={{ color: isHigh ? COLORS.high : COLORS.textSecondary, fontFamily: "monospace", fontWeight: "700" }}>{name}</span>
                    <span style={bitIndicatorStyle(isHigh, COLORS.high)}>{val}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Boolean equations (expandable) ── */}
      <h4 style={{ color: "#c4b5fd", marginBottom: "12px", fontSize: "0.9rem" }}>
        📐 Boolean Equations — click to expand
      </h4>
      {config.booleanEqs.map((eq, i) => (
        <EquationRow
          key={eq.out}
          eq={eq}
          isExpanded={expandedEq === i}
          onToggle={() => toggleEq(i)}
        />
      ))}

      {/* ── Truth table ── */}
      <h4 style={{ color: "#93c5fd", margin: "20px 0 12px", fontSize: "0.9rem" }}>📊 Truth Table</h4>
      <TruthTable
        headers={config.truthHeaders}
        rows={config.truthRows}
        activeRow={enable ? (result.active >= 0 ? result.active + (config.enableInput ? 1 : 0) : -1) : 0}
        inputCount={config.codeInputs.length + (config.enableInput ? 1 : 0)}
      />
    </div>
  );
};

export default DecoderSimulator;
