/**
 * Quiz.jsx — Reusable quiz widget.
 *
 * Props:
 *   questions    : { q, opts, ans, exp, hint }[]
 *   feedbackText : { perfect, good, review }
 *
 * Submitting with at least the pass mark ticks the topic as complete in the
 * learning path (via the shell's useLessonCompletion).
 */
import React, { useState } from "react";
import { COLORS } from "../theme.js";
import { useLessonCompletion } from "../../../../../../shared/components/topics/lessonCompletion";
import { getQuizPassMark } from "../../../combinationalConfig";

const countCorrect = (questions, answers) =>
  questions.reduce((s, q, i) => s + (answers[i] === q.ans ? 1 : 0), 0);

const Quiz = ({ questions, feedbackText }) => {
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { isComplete, markComplete } = useLessonCompletion();
  const passMark = getQuizPassMark(questions.length);
  const q = questions[current];

  const choose = (qi, oi) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qi]: oi }));
  };

  const submit = () => {
    setSubmitted(true);
    if (countCorrect(questions, answers) >= passMark) markComplete();
  };
  const restart = () => {
    setAnswers({});
    setCurrent(0);
    setShowHint(false);
    setSubmitted(false);
  };

  const goPrev = () => {
    setCurrent((idx) => Math.max(0, idx - 1));
    setShowHint(false);
  };

  const goNext = () => {
    setCurrent((idx) => Math.min(questions.length - 1, idx + 1));
    setShowHint(false);
  };

  const score = submitted ? countCorrect(questions, answers) : null;
  const passed = score !== null && score >= passMark;

  const feedbackMsg =
    score === null ? null
    : score === questions.length ? feedbackText.perfect
    : score >= Math.ceil(questions.length / 2) ? feedbackText.good
    : feedbackText.review;
  const answeredCount = Object.keys(answers).length;

  if (submitted) {
    return (
      <div>
        <div style={{ padding: "18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", marginBottom: "14px" }}>
          <div style={{ color: COLORS.indigoLight, fontWeight: "700", fontSize: "1rem" }}>
            Score: {score} / {questions.length}
          </div>
          <p style={{ color: COLORS.textSecondary, fontSize: "0.85rem", marginTop: "6px", lineHeight: "1.6" }}>{feedbackMsg}</p>
          <p style={{ color: passed ? COLORS.high : COLORS.warn, fontSize: "0.85rem", fontWeight: "700", margin: "8px 0 0" }}>
            {passed
              ? "✅ Passed! This topic is now ticked as complete."
              : `You need ${passMark}/${questions.length} to complete this topic. Review the lesson and try again.`}
          </p>
        </div>

        <div style={{ display: "grid", gap: "10px" }}>
          {questions.map((item, qi) => {
            const chosen = answers[qi];
            const correct = chosen === item.ans;
            return (
              <div
                key={qi}
                style={{
                  padding: "14px",
                  background: COLORS.darkBg,
                  borderRadius: "10px",
                  border: `1px solid ${correct ? "rgba(0,255,136,0.35)" : "rgba(239,68,68,0.35)"}`,
                }}
              >
                <p style={{ margin: "0 0 8px", color: COLORS.textPrimary, fontWeight: 700, fontSize: "0.86rem", lineHeight: "1.5" }}>
                  {correct ? "✅" : "❌"} {qi + 1}. {item.q}
                </p>
                <p style={{ margin: 0, color: COLORS.textSecondary, fontSize: "0.82rem", lineHeight: "1.6" }}>
                  Your answer: <strong style={{ color: correct ? COLORS.high : COLORS.low }}>{chosen !== undefined ? item.opts[chosen] : "Not answered"}</strong>
                  <br />
                  Correct answer: <strong style={{ color: COLORS.high }}>{item.opts[item.ans]}</strong>
                  <br />
                  💡 {item.exp}
                </p>
              </div>
            );
          })}
        </div>

        <button
          onClick={restart}
          style={{
            marginTop: "14px",
            padding: "11px 24px",
            borderRadius: "10px",
            border: "1.5px solid rgba(99,102,241,0.6)",
            background: "rgba(99,102,241,0.22)",
            color: COLORS.indigoLight,
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          marginBottom: "14px",
          padding: "9px 13px",
          borderRadius: "8px",
          fontSize: "0.8rem",
          background: isComplete ? "rgba(0,255,136,0.07)" : "rgba(99,102,241,0.08)",
          border: `1px solid ${isComplete ? "rgba(0,255,136,0.3)" : "rgba(99,102,241,0.25)"}`,
          color: isComplete ? COLORS.high : COLORS.textSecondary,
        }}
      >
        {isComplete
          ? "✓ Topic completed. Keep practicing as much as you like — your completion is saved."
          : `🎯 Score at least ${passMark}/${questions.length} to complete this topic.`}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "14px",
        }}
      >
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {questions.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setCurrent(idx);
                setShowHint(false);
              }}
              style={{
                width: "30px",
                height: "7px",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                background:
                  idx === current
                    ? COLORS.indigo
                    : answers[idx] !== undefined
                      ? COLORS.high
                      : "rgba(99,102,241,0.22)",
              }}
              aria-label={`Go to question ${idx + 1}`}
            />
          ))}
        </div>
        <span style={{ color: COLORS.textMuted, fontSize: "0.82rem", whiteSpace: "nowrap" }}>
          {answeredCount}/{questions.length} answered
        </span>
      </div>

      <div
        style={{
          padding: "18px",
          background: COLORS.darkBg,
          borderRadius: "12px",
          border: "1px solid rgba(99,102,241,0.2)",
          marginBottom: "14px",
        }}
      >
        <p style={{ color: COLORS.textPrimary, fontWeight: "700", marginBottom: "12px", fontSize: "0.92rem", lineHeight: "1.6" }}>
          Question {current + 1} of {questions.length}: {q.q}
        </p>

        {q.hint && (
          <button
            type="button"
            onClick={() => setShowHint((v) => !v)}
            style={{
              marginBottom: showHint ? "10px" : "12px",
              padding: "6px 13px",
              borderRadius: "7px",
              background: "rgba(251,191,36,0.1)",
              border: "1px solid rgba(251,191,36,0.3)",
              color: COLORS.warn,
              cursor: "pointer",
              fontSize: "0.78rem",
            }}
          >
            {showHint ? "Hide Hint" : "Show Hint"}
          </button>
        )}

        {showHint && (
          <div style={{ marginBottom: "12px", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(251,191,36,0.25)", background: "rgba(251,191,36,0.07)", color: COLORS.warn, fontSize: "0.82rem", lineHeight: "1.55" }}>
            💡 {q.hint}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {q.opts.map((opt, oi) => {
            const chosen = answers[current] === oi;
            return (
              <button
                key={oi}
                onClick={() => choose(current, oi)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: `1.5px solid ${chosen ? COLORS.indigo : COLORS.indigoMuted}`,
                  background: chosen ? COLORS.indigoMuted : COLORS.inputBg,
                  color: chosen ? COLORS.indigoLight : COLORS.textSecondary,
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "0.86rem",
                  transition: "all 0.2s",
                }}
              >
                <span style={{ opacity: 0.75, marginRight: "8px" }}>
                  {String.fromCharCode(65 + oi)}.
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
        <button
          onClick={goPrev}
          disabled={current === 0}
          style={{
            padding: "10px 18px",
            borderRadius: "10px",
            border: "1px solid rgba(148,163,184,0.24)",
           background: current === 0 ? COLORS.darkBg : COLORS.inputBg,
            color: current === 0 ? COLORS.textMuted : COLORS.textSecondary,
            fontWeight: "700",
            cursor: current === 0 ? "not-allowed" : "pointer",
          }}
        >
          ← Previous
        </button>

        {current < questions.length - 1 ? (
          <button
            onClick={goNext}
            style={{
              padding: "10px 22px",
              borderRadius: "10px",
              border: "1.5px solid rgba(99,102,241,0.6)",
              background: "rgba(99,102,241,0.22)",
              color: COLORS.indigoLight,
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Next →
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={answeredCount < questions.length}
            style={{
              padding: "10px 22px",
              borderRadius: "10px",
              border: "none",
              background: answeredCount < questions.length ? "rgba(99,102,241,0.35)" : COLORS.indigo,
              color: "#fff",
              fontWeight: "700",
              cursor: answeredCount < questions.length ? "not-allowed" : "pointer",
              fontSize: "0.9rem",
            }}
            title={answeredCount < questions.length ? "Answer all questions before submitting" : "Submit answers"}
          >
            Submit Answers
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
