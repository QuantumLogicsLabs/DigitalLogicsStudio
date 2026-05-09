/**
 * EncoderSimulator.jsx — Interactive encoder simulator
 *
 * Lets the user toggle input lines and watch which output code appears.
 * Highlights the winner (highest-priority active input), shows overridden
 * inputs in orange, and displays expandable Boolean equations.
 *
 * Props:
 *   config      : one entry from ENCODER_TYPES
 *   inputVals   : number[]  (shared with parent)
 *   setInputVals: fn
 */
import React, { useState, useMemo } from "react";
import { COLORS, bitIndicatorStyle } from "../../shared/theme.js";
import TruthTable from "../../shared/components/TruthTable.jsx";

// ─── Sub: single input toggle button ──────────────────────────────────────────
const InputToggle = ({ name, isActive, isWinner, onClick }) => {
  const color = isActive ? (isWinner ? COLORS.high : "#f97316") : COLORS.indigoMuted;
  const bg = isActive ? (isWinner ? "rgba(0,255,136,0.1)" : "rgba(249,115,22,0.1)") : COLORS.inputBg;

  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 14px",
        borderRadius: "9px",
        border: `2px solid ${isActive ? (isWinner ? COLORS.high : "#f97316") : "rgba(99,102,241,0.2)"}`,
        background: bg,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
        transition: "all 0.2s",
        boxShadow: isWinner ? "0 0 10px rgba(0,255,136,0.3)" : "none",
        width: "100%",
        marginBottom: "6px",
      }}
    >
      <span style={{ color: isActive ? (isWinner ? COLORS.high : "#f97316") : COLORS.textMuted, fontFamily: "monospace", fontWeight: "700", fontSize: "0.95rem" }}>
        {name}
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {isWinner && <span style={{ color: COLORS.high, fontSize: "0.72rem" }}>👑 WINNER</span>}
        {isActive && !isWinner && <span style={{ color: "#f97316", fontSize: "0.72rem" }}>overridden</span>}
        <span style={bitIndicatorStyle(isActive, isWinner ? COLORS.high : "#f97316")}>
          {isActive ? "1" : "0"}
        </span>
      </span>
    </button>
  );
};

// ─── Sub: expandable equation row ─────────────────────────────────────────────
const EquationRow = ({ eq, isExpanded, onToggle }) => (
  <div
    style={{
      borderRadius: "14px",
      border: `1px solid ${eq.color}40`,
      background: COLORS.glassBg,
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      marginBottom: "10px",
      overflow: "hidden",
      transition: "all 0.3s ease",
    }}
  >
    <div
      style={{
        width: "100%",
        padding: "14px 18px",
        background: isExpanded ? `${eq.color}15` : "transparent",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
      }}
      onClick={onToggle}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <code style={{ color: eq.color, fontFamily: "monospace", fontSize: "0.95rem", fontWeight: "800" }}>
          {eq.eq}
        </code>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(eq.eq);
            alert("Equation copied!");
          }}
          style={{
            padding: "2px 8px",
            fontSize: "0.65rem",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: COLORS.textSecondary,
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "700",
          }}
        >
          📋 COPY
        </button>
        <span style={{ color: COLORS.textMuted, fontSize: "0.8rem" }}>
          {isExpanded ? "▲" : "▼"}
        </span>
      </div>
    </div>

    {isExpanded && (
      <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${eq.color}20` }}>
        <p style={{ color: COLORS.textSecondary, fontSize: "0.9rem", lineHeight: "1.7", margin: "16px 0" }}>
          {eq.explanation}
        </p>
        <div
          style={{
            padding: "12px 16px",
            background: `${eq.color}15`,
            border: `1px solid ${eq.color}40`,
            borderRadius: "10px",
            boxShadow: `inset 0 0 10px ${eq.color}10`,
          }}
        >
          <span style={{ color: eq.color, fontSize: "0.8rem", fontWeight: "800" }}>🎯 MEMORY TRICK: </span>
          <span style={{ color: COLORS.textPrimary, fontSize: "0.85rem", opacity: 0.9 }}>{eq.trick}</span>
        </div>
      </div>
    )}
  </div>
);

// ─── Main component ────────────────────────────────────────────────────────────
const EncoderSimulator = ({ config, inputVals, setInputVals }) => {
  const [expandedEq, setExpandedEq] = useState(null);

  const activeVals = inputVals.slice(0, config.inputs.length);
  const result = useMemo(() => config.encode(activeVals), [config, activeVals]);
  const outputEntries = config.outputs.map((name) => ({ name, val: result[name] ?? 0 }));

  const toggleInput = (idx) => {
    const next = [...inputVals];
    next[idx] = next[idx] ? 0 : 1;
    setInputVals(next);
  };

  const resetInputs = () => setInputVals(Array(10).fill(0));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

      {/* ── Left: inputs ── */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px", alignItems: "center" }}>
          <h4 style={{ color: COLORS.blue, margin: 0, fontSize: "0.9rem" }}>📥 Inputs</h4>
          <button
            onClick={resetInputs}
            style={{ padding: "5px 12px", borderRadius: "7px", border: "1px solid rgba(148,163,184,0.2)", background: "transparent", color: COLORS.textMuted, cursor: "pointer", fontSize: "0.78rem" }}
          >
            Reset
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {config.inputs.map((name, idx) => (
            <InputToggle
              key={name}
              name={name}
              isActive={!!activeVals[idx]}
              isWinner={result.active === idx}
              onClick={() => toggleInput(idx)}
            />
          ))}
        </div>
      </div>

      {/* ── Right: outputs + summary ── */}
      <div>
        <h4 style={{ color: COLORS.warn, marginBottom: "14px", fontSize: "0.9rem" }}>📤 Outputs</h4>

        <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: "20px" }}>
          {outputEntries.map(({ name, val }) => (
            <div
              key={name}
              style={{
                padding: "10px 14px", borderRadius: "9px",
                border: `2px solid ${val ? COLORS.warn : "rgba(148,163,184,0.12)"}`,
                background: val ? "rgba(251,191,36,0.1)" : COLORS.inputBg,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                transition: "all 0.2s",
                boxShadow: val ? "0 0 8px rgba(251,191,36,0.2)" : "none",
              }}
            >
              <span style={{ color: val ? COLORS.warn : COLORS.textSecondary, fontFamily: "monospace", fontWeight: "700" }}>
                {name}
              </span>
              <span style={bitIndicatorStyle(!!val, COLORS.warn)}>{val}</span>
            </div>
          ))}
        </div>

        {/* Encoding result summary */}
        <div style={{ padding: "14px", background: "rgba(8,14,30,0.8)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "10px" }}>
          {result.active >= 0 ? (
            <>
              <div style={{ color: "#86efac", fontSize: "0.78rem", fontWeight: "700", marginBottom: "6px" }}>ENCODING RESULT</div>
              <div style={{ fontFamily: "monospace", color: COLORS.high, fontSize: "1.15rem", fontWeight: "700" }}>
                I{result.active} → {result.active.toString(2).padStart(config.outputs.filter((o) => o !== "V").length, "0")}₂
              </div>
              <div style={{ color: COLORS.textSecondary, fontSize: "0.78rem", marginTop: "4px" }}>
                Input {result.active} encoded as binary {result.active}
              </div>
            </>
          ) : (
            <div style={{ color: COLORS.textDim, fontSize: "0.85rem", fontStyle: "italic" }}>
              No inputs active. Output = 0, V = 0.
            </div>
          )}
        </div>
      </div>

      {/* ── Truth table (full width) ── */}
      <div style={{ gridColumn: "1 / -1" }}>
        <h4 style={{ color: "#93c5fd", marginBottom: "12px", fontSize: "0.9rem" }}>📊 Truth Table</h4>
        <TruthTable headers={config.truthHeaders} rows={config.truthRows} activeRow={result.active} inputCount={1} />
      </div>

      {/* ── Boolean equations (full width) ── */}
      <div style={{ gridColumn: "1 / -1" }}>
        <h4 style={{ color: COLORS.indigoLight, marginBottom: "14px", fontSize: "0.9rem" }}>
          📐 Boolean Equations — Click to Expand
        </h4>
        {config.booleanEqs.map((eq, i) => (
          <EquationRow
            key={i}
            eq={eq}
            isExpanded={expandedEq === i}
            onToggle={() => setExpandedEq(expandedEq === i ? null : i)}
          />
        ))}
      </div>
    </div>
  );
};

export default EncoderSimulator;
