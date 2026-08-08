import { useState } from "react";

// ── Generic topic quiz ─────────────────────────────────────────────
// Fully data-driven: pass `questions` = [{ q, opts, ans, explain }].
// Used by any theory topic (DLD or COAL) via section.quiz in the
// content data — not tied to any one subject.
export default function TheoryQuiz({ questions, title = "Quiz — Test Your Understanding" }) {
  const [mode, setMode] = useState("idle"); // idle | active | done
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [score, setScore] = useState(0);

  if (!questions?.length) return null;

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
    <div className="theory-quiz">
      {mode === "idle" && (
        <div>
          <div className="theory-quiz-start-title">🧠 {title}</div>
          <div className="theory-quiz-start-sub">
            {questions.length} questions · Test what you've learned
          </div>
          <button className="theory-btn theory-btn-primary theory-btn-full" onClick={start}>
            Start Quiz →
          </button>
        </div>
      )}

      {mode === "active" && (
        <div>
          <div className="theory-quiz-meta">
            <span>Q {idx + 1} / {questions.length}</span>
            <span>⬥ {score} correct</span>
          </div>
          <div className="theory-quiz-progress-bar">
            <div
              className="theory-quiz-progress-fill"
              style={{ width: `${(idx / questions.length) * 100}%` }}
            />
          </div>

          <div className="theory-quiz-question">{questions[idx].q}</div>

          <div className="theory-quiz-options">
            {questions[idx].opts.map((opt, i) => {
              const isCorrect = i === questions[idx].ans;
              const selected = answer === i;
              let cls = "theory-quiz-option";
              if (answer !== null) {
                if (isCorrect) cls += " correct";
                else if (selected) cls += " wrong";
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
              <div className={`theory-quiz-explain ${answer === questions[idx].ans ? "correct-explain" : "wrong-explain"}`}>
                <strong>{answer === questions[idx].ans ? "✅ Correct!" : "❌ Not quite."}</strong>{" "}
                {questions[idx].explain}
              </div>
              <button
                className="theory-btn theory-btn-primary theory-btn-full"
                style={{ marginTop: "0.75rem" }}
                onClick={next}
              >
                {idx + 1 >= questions.length ? "See Results →" : "Next Question →"}
              </button>
            </>
          )}
        </div>
      )}

      {mode === "done" && (
        <div>
          <div className="theory-quiz-done-emoji">
            {pct >= 75 ? "🎉" : pct >= 50 ? "📚" : "💪"}
          </div>
          <div className="theory-quiz-done-score">{score}/{questions.length}</div>
          <div className="theory-quiz-done-label">
            {pct >= 75 ? "Excellent work!" : pct >= 50 ? "Good effort! Review the material." : "Keep studying — you've got this!"}
          </div>
          <div className="theory-btn-group" style={{ marginTop: "1rem", justifyContent: "center" }}>
            <button className="theory-btn theory-btn-primary" onClick={start}>Try Again</button>
            <button className="theory-btn theory-btn-secondary" onClick={reset}>Exit</button>
          </div>
        </div>
      )}
    </div>
  );
}
