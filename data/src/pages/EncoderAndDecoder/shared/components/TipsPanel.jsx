/**
 * TipsPanel.jsx — Floating tips & tricks panel
 *
 * A fixed-position button (bottom-right) that opens a pop-up card
 * cycling through an array of tips.  Shared by both pages; just
 * pass a different `tips` array.
 *
 * Each tip object: { icon, title, text }
 */
import React, { useState } from "react";
import { COLORS } from "../theme.js";

const TipsPanel = ({ tips }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tipIdx, setTipIdx] = useState(0);

  const tip = tips[tipIdx];

  const prev = () => setTipIdx((tipIdx - 1 + tips.length) % tips.length);
  const next = () => setTipIdx((tipIdx + 1) % tips.length);

  return (
    <>
      {/* ── Toggle button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: isOpen ? "rgba(251,191,36,0.3)" : "rgba(99,102,241,0.85)",
          border: `2px solid ${isOpen ? COLORS.warn : COLORS.indigo}`,
          color: isOpen ? COLORS.warn : COLORS.textPrimary,
          fontSize: "1.4rem",
          cursor: "pointer",
          zIndex: 999,
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          transition: "all 0.2s",
        }}
      >
        {isOpen ? "✕" : "💡"}
      </button>

      {/* ── Pop-up panel ── */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "88px",
            right: "24px",
            width: "320px",
            background: "rgba(8,14,30,0.97)",
            border: "1px solid rgba(99,102,241,0.4)",
            borderRadius: "16px",
            padding: "20px",
            zIndex: 998,
            boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
          }}
        >
          {/* Header */}
          <div
            style={{
              color: COLORS.indigoLight,
              fontSize: "0.75rem",
              fontWeight: "700",
              marginBottom: "14px",
              letterSpacing: "0.08em",
            }}
          >
            💡 TIPS & TRICKS
          </div>

          {/* Tip content */}
          <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>{tip.icon}</div>
          <div
            style={{
              color: COLORS.warn,
              fontWeight: "700",
              marginBottom: "8px",
              fontSize: "0.9rem",
            }}
          >
            {tip.title}
          </div>
          <p
            style={{
              color: COLORS.textSecondary,
              fontSize: "0.83rem",
              lineHeight: "1.65",
              margin: "0 0 16px",
            }}
          >
            {tip.text}
          </p>

          {/* Navigation row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: COLORS.textDim, fontSize: "0.75rem" }}>
              {tipIdx + 1} / {tips.length}
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              {[{ label: "←", fn: prev }, { label: "→", fn: next }].map(({ label, fn }) => (
                <button
                  key={label}
                  onClick={fn}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "6px",
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.3)",
                    color: COLORS.indigoLight,
                    cursor: "pointer",
                    fontSize: "0.8rem",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TipsPanel;
