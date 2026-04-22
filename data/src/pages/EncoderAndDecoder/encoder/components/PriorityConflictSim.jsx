/**
 * PriorityConflictSim.jsx
 *
 * Lets the user turn on multiple inputs simultaneously and observe
 * how the priority encoder always picks the highest-numbered one.
 * Includes a tip explaining why this matters in real hardware.
 */
import React, { useState } from "react";
import { COLORS } from "../../shared/theme.js";

const PriorityConflictSim = () => {
  const [active, setActive] = useState(Array(8).fill(false));

  const toggle = (i) =>
    setActive((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });

  const clear = () => setActive(Array(8).fill(false));

  // Find the winner: highest-numbered active input
  let winner = -1;
  for (let i = 7; i >= 0; i--) {
    if (active[i]) { winner = i; break; }
  }

  const activeList = active.map((a, i) => (a ? i : -1)).filter((i) => i >= 0);

  return (
    <div
      style={{
        background: COLORS.darkBg,
        borderRadius: "14px",
        padding: "22px",
        border: "1px solid rgba(99,102,241,0.25)",
      }}
    >
      <h4 style={{ color: COLORS.textPrimary, marginBottom: "6px", fontSize: "0.95rem" }}>
        ⚔️ Priority Conflict Simulator
      </h4>
      <p style={{ color: COLORS.textSecondary, fontSize: "0.82rem", marginBottom: "18px", lineHeight: "1.5" }}>
        Toggle multiple inputs ON at once to see how priority resolution works.
        The highest-numbered active input always wins.
      </p>

      {/* ── Input grid ── */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {Array.from({ length: 8 }, (_, i) => {
          const isActive = active[i];
          const isWinner = i === winner;
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "10px",
                border: `2px solid ${isActive ? (isWinner ? COLORS.high : "#f97316") : "rgba(99,102,241,0.25)"}`,
                background: isActive
                  ? isWinner ? "rgba(0,255,136,0.15)" : "rgba(249,115,22,0.15)"
                  : "rgba(15,23,42,0.6)",
                color: isActive ? (isWinner ? COLORS.high : "#f97316") : COLORS.textDim,
                fontFamily: "monospace",
                fontWeight: "700",
                fontSize: "0.9rem",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: isActive && isWinner ? "0 0 12px rgba(0,255,136,0.4)" : "none",
              }}
            >
              I{i}
            </button>
          );
        })}

        {/* Clear button */}
        <button
          onClick={clear}
          style={{
            padding: "0 16px",
            borderRadius: "10px",
            border: "1px solid rgba(148,163,184,0.2)",
            background: "transparent",
            color: COLORS.textMuted,
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          Clear
        </button>
      </div>

      {/* ── Conflict resolution display ── */}
      {activeList.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px", color: COLORS.textDim, fontStyle: "italic" }}>
          No inputs active. Toggle some above.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          {/* Competing inputs */}
          <div style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: "10px", padding: "14px" }}>
            <div style={{ color: "#fb923c", fontSize: "0.75rem", fontWeight: "700", marginBottom: "8px" }}>COMPETING INPUTS</div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {activeList.map((i) => (
                <span
                  key={i}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "6px",
                    background: i === winner ? "rgba(0,255,136,0.15)" : "rgba(249,115,22,0.1)",
                    border: `1px solid ${i === winner ? COLORS.high : "rgba(249,115,22,0.4)"}`,
                    color: i === winner ? COLORS.high : "#f97316",
                    fontFamily: "monospace",
                    fontSize: "0.85rem",
                  }}
                >
                  I{i} {i === winner ? "👑" : ""}
                </span>
              ))}
            </div>
          </div>

          {/* Encoded output */}
          <div style={{ background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.3)", borderRadius: "10px", padding: "14px" }}>
            <div style={{ color: "#86efac", fontSize: "0.75rem", fontWeight: "700", marginBottom: "8px" }}>ENCODED OUTPUT</div>
            {winner >= 0 ? (
              <>
                <div style={{ fontFamily: "monospace", color: COLORS.high, fontSize: "1.1rem", fontWeight: "700" }}>
                  {winner.toString(2).padStart(3, "0")}₂
                </div>
                <div style={{ color: COLORS.textSecondary, fontSize: "0.8rem", marginTop: "4px" }}>
                  I{winner} wins — index {winner} in binary
                </div>
                <div style={{ color: "#4ade80", fontSize: "0.78rem", marginTop: "4px" }}>V = 1 (valid)</div>
              </>
            ) : (
              <div style={{ color: COLORS.textDim, fontStyle: "italic" }}>No output</div>
            )}
          </div>
        </div>
      )}

      {/* Explanatory note */}
      <div style={{ marginTop: "14px", padding: "12px", background: "rgba(99,102,241,0.08)", borderRadius: "8px", color: COLORS.textSecondary, fontSize: "0.8rem", lineHeight: "1.6" }}>
        💡 <strong style={{ color: COLORS.textPrimary }}>Why priority matters:</strong>{" "}
        In real systems, multiple interrupt signals can fire simultaneously.
        The CPU needs ONE clear winner to service. Priority encoders guarantee exactly that.
      </div>
    </div>
  );
};

export default PriorityConflictSim;
