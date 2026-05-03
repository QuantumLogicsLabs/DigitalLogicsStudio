// ═══════════════════════════════════════════════════════
//  MEMORY SYSTEMS — Shared UI Components
// ═══════════════════════════════════════════════════════

import React, { useState } from "react";

// ── Section wrapper ──────────────────────────────────────
export const MemSection = ({ kicker, title, description, children, delay = 0 }) => (
  <div className="mem-section" style={{ animationDelay: `${delay}ms` }}>
    <div className="mem-section-header">
      {kicker && <p className="mem-section-kicker">{kicker}</p>}
      {title   && <h2 className="mem-section-title">{title}</h2>}
      {description && <p className="mem-section-desc">{description}</p>}
    </div>
    {children}
  </div>
);

// ── Card ─────────────────────────────────────────────────
export const MemCard = ({ title, children, accent }) => (
  <div className="mem-card" style={accent ? { borderColor: `${accent}55` } : {}}>
    {title && <div className="mem-card-title">{title}</div>}
    {children}
  </div>
);

// ── Card Group (responsive grid) ─────────────────────────
export const MemCardGroup = ({ children }) => (
  <div className="mem-card-group">{children}</div>
);

// ── Info Panel ───────────────────────────────────────────
export const MemInfoPanel = ({ title, content, icon, color }) => (
  <div className="mem-info-panel" style={color ? { borderColor: `${color}30` } : {}}>
    {icon && <div style={{ fontSize: "1.4rem", marginBottom: "0.4rem" }}>{icon}</div>}
    <div className="mem-info-panel-title" style={color ? { color } : {}}>{title}</div>
    <div className="mem-info-panel-content">{content}</div>
  </div>
);

// ── Step List ────────────────────────────────────────────
export const MemStepList = ({ steps }) => (
  <div className="mem-steps">
    {steps.map((step, i) => (
      <div key={i} className="mem-step">
        <span className="mem-step-num">{i + 1}</span>
        <span className="mem-step-text">{step}</span>
      </div>
    ))}
  </div>
);

// ── Code Block ───────────────────────────────────────────
export const MemCode = ({ children, lines = [] }) => (
  <div className="mem-code-block">
    {lines.length > 0
      ? lines.map((line, i) => (
          <div key={i} style={{ color: line.color || "var(--mem-text)" }}>{line.text}</div>
        ))
      : children}
  </div>
);

// ── Divider ──────────────────────────────────────────────
export const MemDivider = () => <div className="mem-divider" />;

// ── Comparison Table ─────────────────────────────────────
export const MemTable = ({ headers, rows, colColors = [] }) => (
  <div className="mem-table-wrap">
    <table className="mem-table">
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} style={colColors[i] ? { color: colColors[i] } : {}}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => (
              <td key={ci} style={colColors[ci] ? { color: colColors[ci] } : {}}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ── Chip Diagram ─────────────────────────────────────────
export const MemChip = ({ label, pins = [], dataPins = [] }) => (
  <div className="mem-chip">
    <div className="mem-chip-label">{label}</div>
    {pins.map((p, i) => <div key={i} className="mem-chip-pin">▸ {p}</div>)}
    {dataPins.map((p, i) => <div key={i} className="mem-chip-pin-data">◈ {p}</div>)}
  </div>
);

// ── Tooltip Wrapper ──────────────────────────────────────
export const MemTooltip = ({ label, children }) => (
  <span className="mem-tooltip-wrap">
    {children}
    <span className="mem-tooltip">{label}</span>
  </span>
);

// ── Quiz Component ───────────────────────────────────────
export const MemQuiz = ({ questions, title = "Quiz — Test Your Understanding" }) => {
  const [mode, setMode]     = useState("idle"); // idle | active | done
  const [idx, setIdx]       = useState(0);
  const [answer, setAnswer] = useState(null);
  const [score, setScore]   = useState(0);

  const reset = () => { setIdx(0); setAnswer(null); setScore(0); setMode("idle"); };
  const start = () => { reset(); setMode("active"); };

  const handleAnswer = (i) => {
    if (answer !== null) return;
    setAnswer(i);
    if (i === questions[idx].ans) setScore((s) => s + 1);
  };

  const next = () => {
    if (idx + 1 >= questions.length) { setMode("done"); return; }
    setIdx((i) => i + 1);
    setAnswer(null);
  };

  const pct = Math.round((score / questions.length) * 100);

  return (
    <div className="mem-quiz-container">
      {/* ── IDLE ── */}
      {mode === "idle" && (
        <div>
          <div className="mem-quiz-start-title">🧠 {title}</div>
          <div className="mem-quiz-start-sub">
            {questions.length} questions · Test what you've learned
          </div>
          <button className="mem-btn mem-btn-primary mem-btn-full" onClick={start}>
            Start Quiz →
          </button>
        </div>
      )}

      {/* ── ACTIVE ── */}
      {mode === "active" && (
        <div>
          <div className="mem-quiz-meta">
            <span className="mem-quiz-idx">Q {idx + 1} / {questions.length}</span>
            <span className="mem-quiz-score">⬥ {score} correct</span>
          </div>
          <div className="mem-quiz-progress-bar">
            <div
              className="mem-quiz-progress-fill"
              style={{ width: `${(idx / questions.length) * 100}%` }}
            />
          </div>

          <div className="mem-quiz-question">{questions[idx].q}</div>

          <div className="mem-quiz-options">
            {questions[idx].opts.map((opt, i) => {
              const isCorrect = i === questions[idx].ans;
              const selected  = answer === i;
              let cls = "mem-quiz-option";
              if (answer !== null) {
                if (isCorrect)       cls += " correct";
                else if (selected)   cls += " wrong";
              }
              return (
                <button key={i} className={cls} disabled={answer !== null} onClick={() => handleAnswer(i)}>
                  {answer !== null && (isCorrect ? "✅ " : selected ? "❌ " : "◦ ")}
                  {opt}
                </button>
              );
            })}
          </div>

          {answer !== null && (
            <>
              <div className={`mem-quiz-explain ${answer === questions[idx].ans ? "correct-explain" : "wrong-explain"}`}>
                <strong>{answer === questions[idx].ans ? "✅ Correct!" : "❌ Not quite."}</strong>
                👩‍🏫 {questions[idx].explain}
              </div>
              <button
                className="mem-btn mem-btn-primary mem-btn-full"
                style={{ marginTop: "0.75rem" }}
                onClick={next}
              >
                {idx + 1 >= questions.length ? "See Results →" : "Next Question →"}
              </button>
            </>
          )}
        </div>
      )}

      {/* ── DONE ── */}
      {mode === "done" && (
        <div>
          <div className="mem-quiz-done-emoji">
            {pct >= 75 ? "🎉" : pct >= 50 ? "📚" : "💪"}
          </div>
          <div className="mem-quiz-done-score">{score}/{questions.length}</div>
          <div className="mem-quiz-done-label">
            {pct >= 75 ? "Excellent work!" : pct >= 50 ? "Good effort! Review the material." : "Keep studying — you've got this!"}
          </div>
          <div className="mem-btn-group" style={{ marginTop: "1rem", justifyContent: "center" }}>
            <button className="mem-btn mem-btn-primary" onClick={start}>Try Again</button>
            <button className="mem-btn mem-btn-secondary" onClick={reset}>Exit</button>
          </div>
        </div>
      )}
    </div>
  );
};
