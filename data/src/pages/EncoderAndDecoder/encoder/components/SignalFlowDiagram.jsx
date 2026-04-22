/**
 * SignalFlowDiagram.jsx — Animated step-by-step signal flow
 *
 * Shows 4 pipeline stages with a "Play Animation" button that
 * lights them up sequentially, describing what happens inside the
 * encoder at each step.
 *
 * Props:
 *   config    : one entry from ENCODER_TYPES
 *   inputVals : number[]
 *   result    : encode() return value
 */
import React, { useState } from "react";
import { COLORS } from "../../shared/theme.js";

// The four stages of signal flow through an encoder
const STAGE_ICONS = ["📥", "⚖️", "🔧", "📤"];

const buildSteps = (activeIdx) => [
  {
    label: "Inputs Ready",
    desc: "All input lines are stable. We're waiting for one (or more) to go HIGH.",
    color: COLORS.blue,
  },
  {
    label: "Priority Check",
    desc: activeIdx >= 0
      ? `Input I${activeIdx} is the highest active input. It wins priority.`
      : "No inputs are active. Nothing to encode.",
    color: COLORS.warn,
  },
  {
    label: "OR Gate Layer",
    desc: "Each output bit OR-gates the relevant inputs. Active inputs drive the OR gates.",
    color: COLORS.purple,
  },
  {
    label: "Output Ready",
    desc: activeIdx >= 0
      ? `Output code = ${activeIdx} in binary. Valid flag V=1.`
      : "All outputs = 0. Valid flag V=0.",
    color: COLORS.high,
  },
];

const SignalFlowDiagram = ({ result }) => {
  const [step, setStep]           = useState(0);
  const [animating, setAnimating] = useState(false);

  const steps = buildSteps(result.active);

  // Auto-advance through steps with a delay between each
  const runAnimation = () => {
    setAnimating(true);
    setStep(0);
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setStep(current);
      if (current >= steps.length - 1) {
        clearInterval(interval);
        setAnimating(false);
      }
    }, 900);
  };

  return (
    <div
      style={{
        background: COLORS.darkBg,
        borderRadius: "14px",
        padding: "22px",
        border: "1px solid rgba(99,102,241,0.25)",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
        <h4 style={{ color: COLORS.textPrimary, margin: 0, fontSize: "0.95rem" }}>
          ⚡ Signal Flow Animation
        </h4>
        <button
          onClick={runAnimation}
          disabled={animating}
          style={{
            padding: "8px 18px",
            borderRadius: "8px",
            background: animating ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.25)",
            border: "1.5px solid rgba(99,102,241,0.5)",
            color: animating ? COLORS.textMuted : COLORS.indigoLight,
            cursor: animating ? "default" : "pointer",
            fontSize: "0.85rem",
          }}
        >
          {animating ? "⏳ Playing..." : "▶ Play Animation"}
        </button>
      </div>

      {/* Stage pipeline */}
      <div style={{ display: "flex", gap: "0", overflowX: "auto", paddingBottom: "8px" }}>
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            {/* Stage bubble + label + description */}
            <div
              style={{
                flex: "1",
                minWidth: "120px",
                textAlign: "center",
                opacity: step >= i ? 1 : 0.3,
                transition: "all 0.5s ease",
              }}
            >
              {/* Circle icon */}
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: step >= i ? `${s.color}22` : "rgba(20,30,50,0.5)",
                  border: `2px solid ${step >= i ? s.color : "rgba(99,102,241,0.2)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 10px",
                  fontSize: "1.2rem",
                  boxShadow: step >= i ? `0 0 12px ${s.color}55` : "none",
                  transition: "all 0.5s ease",
                }}
              >
                {STAGE_ICONS[i]}
              </div>

              {/* Stage label */}
              <div
                style={{
                  color: step >= i ? s.color : COLORS.textDim,
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  marginBottom: "6px",
                  transition: "all 0.5s",
                }}
              >
                {s.label}
              </div>

              {/* Active description (only for current step) */}
              {step === i && (
                <div
                  style={{
                    color: COLORS.textSecondary,
                    fontSize: "0.72rem",
                    lineHeight: "1.5",
                    padding: "8px",
                    background: "rgba(0,0,0,0.3)",
                    borderRadius: "8px",
                    animation: "fadeInUp 0.4s ease",
                  }}
                >
                  {s.desc}
                </div>
              )}
            </div>

            {/* Arrow connector between stages */}
            {i < steps.length - 1 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  paddingTop: "22px",
                  color: step > i ? COLORS.indigo : "#1e293b",
                  transition: "all 0.5s",
                  fontSize: "1.1rem",
                }}
              >
                →
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SignalFlowDiagram;
