/**
 * Quiz.jsx — Reusable quiz widget
 *
 * Accepts a `questions` array so the same component works for both
 * the Decoder page and the Encoder page — just pass different data.
 *
 * Each question object:
 *   { q, opts, ans, exp, hint }
 *   - q    : question string
 *   - opts : string[]  (answer choices)
 *   - ans  : number    (index of correct option)
 *   - exp  : string    (explanation shown after answering)
 *   - hint : string    (shown on demand before answering)
 *
 * Features: hint toggle, streak tracking, progress bar, score summary.
 */
import React, { useState } from "react";
import { COLORS } from "../theme.js";

// ─── Sub-component: score summary shown after finishing all questions ───────────
const QuizResults = ({ score, total, bestStreak, onRestart, feedbackText }) => (
  <div style={{ textAlign: "center", padding: "40px 20px" }}>
    <div style={{ fontSize: "3.5rem", marginBottom: "12px" }}>
      {score >= total - 1 ? "🏆" : score >= Math.floor(total / 2) ? "🎯" : "📚"}
    </div>
    <h3 style={{ color: COLORS.warn, marginBottom: "8px" }}>Quiz Complete!</h3>
    <p style={{ color: COLORS.textSecondary, marginBottom: "4px" }}>
      Score:{" "}
      <strong style={{ color: COLORS.high, fontSize: "1.2rem" }}>
        {score}/{total}
      </strong>
    </p>
    <p style={{ color: COLORS.textSecondary, marginBottom: "4px" }}>
      Best Streak: <strong style={{ color: "#f97316" }}>🔥 {bestStreak}</strong>
    </p>
    <p style={{ color: COLORS.textSecondary, marginBottom: "24px", fontSize: "0.9rem" }}>
      {feedbackText}
    </p>
    <button
      onClick={onRestart}
      style={{
        padding: "12px 28px",
        borderRadius: "10px",
        background: "rgba(99,102,241,0.25)",
        border: "1.5px solid rgba(99,102,241,0.6)",
        color: COLORS.indigoLight,
        cursor: "pointer",
        fontWeight: "600",
      }}
    >
      ↺ Try Again
    </button>
  </div>
);

// ─── Sub-component: progress bar across all questions ─────────────────────────
const ProgressBar = ({ total, current }) => (
  <div style={{ display: "flex", gap: "4px" }}>
    {Array.from({ length: total }, (_, i) => (
      <div
        key={i}
        style={{
          width: "28px",
          height: "5px",
          borderRadius: "3px",
          background:
            i < current
              ? COLORS.high
              : i === current
              ? COLORS.indigo
              : "rgba(99,102,241,0.2)",
        }}
      />
    ))}
  </div>
);

// ─── Main Quiz component ───────────────────────────────────────────────────────
const Quiz = ({ questions, feedbackText }) => {
  const [qi, setQi] = useState(0);          // current question index
  const [sel, setSel] = useState(null);     // user's selected option index
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const q = questions[qi];

  // Called when the user clicks an answer option
  const choose = (i) => {
    if (sel !== null) return; // already answered
    setSel(i);
    if (i === q.ans) {
      setScore((s) => s + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    if (qi + 1 >= questions.length) {
      setDone(true);
      return;
    }
    setQi(qi + 1);
    setSel(null);
    setShowHint(false);
  };

  const restart = () => {
    setQi(0);
    setSel(null);
    setScore(0);
    setDone(false);
    setStreak(0);
    setShowHint(false);
  };

  // ── Finished screen ──
  if (done)
    return (
      <QuizResults
        score={score}
        total={questions.length}
        bestStreak={bestStreak}
        onRestart={restart}
        feedbackText={feedbackText(score, questions.length)}
      />
    );

  // ── Active question screen ──
  return (
    <div>
      {/* Progress + streak row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
          alignItems: "center",
        }}
      >
        <ProgressBar total={questions.length} current={qi} />
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          {streak >= 2 && (
            <span style={{ color: "#f97316", fontSize: "0.82rem" }}>
              🔥 {streak} streak!
            </span>
          )}
          <span style={{ color: COLORS.high, fontSize: "0.85rem" }}>
            Score: {score}
          </span>
        </div>
      </div>

      {/* Question text */}
      <p
        style={{
          color: COLORS.textPrimary,
          fontWeight: "600",
          marginBottom: "18px",
          lineHeight: "1.65",
        }}
      >
        {q.q}
      </p>

      {/* Hint button (only before answering) */}
      {!showHint && sel === null && (
        <button
          onClick={() => setShowHint(true)}
          style={{
            marginBottom: "12px",
            padding: "6px 14px",
            borderRadius: "7px",
            background: "rgba(251,191,36,0.1)",
            border: "1px solid rgba(251,191,36,0.3)",
            color: COLORS.warn,
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          💡 Show Hint
        </button>
      )}

      {/* Hint box */}
      {showHint && (
        <div
          style={{
            marginBottom: "14px",
            padding: "10px 14px",
            background: "rgba(251,191,36,0.07)",
            border: "1px solid rgba(251,191,36,0.3)",
            borderRadius: "8px",
            color: COLORS.warn,
            fontSize: "0.83rem",
          }}
        >
          🔍 {q.hint}
        </div>
      )}

      {/* Answer options */}
      <div
        style={{ display: "flex", flexDirection: "column", gap: "9px", marginBottom: "16px" }}
      >
        {q.opts.map((opt, i) => {
          // Compute styles based on whether this is the correct / selected option
          let border = "rgba(148,163,184,0.2)";
          let bg = "rgba(15,23,42,0.6)";
          let color = COLORS.textSecondary;

          if (sel !== null) {
            if (i === q.ans) {
              bg = "rgba(0,255,136,0.1)";
              border = COLORS.high;
              color = COLORS.high;
            } else if (i === sel) {
              bg = "rgba(239,68,68,0.1)";
              border = COLORS.low;
              color = COLORS.low;
            }
          }

          return (
            <button
              key={i}
              onClick={() => choose(i)}
              style={{
                padding: "11px 16px",
                borderRadius: "9px",
                border: `1.5px solid ${border}`,
                background: bg,
                color,
                fontFamily: COLORS.mono,
                cursor: sel !== null ? "default" : "pointer",
                textAlign: "left",
                transition: "all 0.2s",
                fontSize: "0.9rem",
              }}
            >
              <span style={{ marginRight: "10px", opacity: 0.7 }}>
                {String.fromCharCode(65 + i)}.
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Explanation (shown after answering) */}
      {sel !== null && (
        <div
          style={{
            padding: "14px",
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: "10px",
            marginBottom: "16px",
          }}
        >
          <p
            style={{
              color: "#c4b5fd",
              margin: 0,
              fontSize: "0.88rem",
              lineHeight: "1.65",
            }}
          >
            {sel === q.ans ? "✅ " : "❌ "}
            {q.exp}
          </p>
        </div>
      )}

      {/* Next / See Results button */}
      {sel !== null && (
        <button
          onClick={next}
          style={{
            padding: "11px 24px",
            borderRadius: "9px",
            background: "rgba(99,102,241,0.25)",
            border: "1.5px solid rgba(99,102,241,0.6)",
            color: COLORS.indigoLight,
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          {qi + 1 < questions.length ? "Next Question →" : "See Results"}
        </button>
      )}
    </div>
  );
};

export default Quiz;
