import React, { useState, useEffect } from "react";
import "./Problems.css";

const difficultyColor = {
  Easy: "var(--accent-primary, #00ff88)",
  Medium: "var(--accent-secondary, #00d4ff)",
  Hard: "var(--accent-danger, #ff3366)",
};

const CoalProblemModal = ({ problem, onClose, onSolved, onAttempt }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null); // null | { success: boolean, message: string }
  const [isAnimating, setIsAnimating] = useState(false);

  // Reset inputs when problem changes
  useEffect(() => {
    setSelectedOption("");
    setTextAnswer("");
    setFeedback(null);
    setShowHint(false);
  }, [problem]);

  if (!problem) return null;

  const cleanString = (str) => {
    if (!str) return "";
    return str.trim().toLowerCase().replace(/^0x/, "");
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (feedback?.success) return; // Already solved

    let isCorrect = false;

    if (problem.type === "mcq") {
      if (!selectedOption) {
        setFeedback({ success: false, message: "Please select an option before submitting." });
        return;
      }
      isCorrect = cleanString(selectedOption) === cleanString(problem.correctAnswer);
    } else {
      if (!textAnswer.trim()) {
        setFeedback({ success: false, message: "Please enter an answer before submitting." });
        return;
      }
      // Standardize hex values, e.g. 0x1010 and 1010 should both match
      const userClean = cleanString(textAnswer);
      const correctClean = cleanString(problem.correctAnswer);
      isCorrect = userClean === correctClean;
    }

    // Trigger attempt logging in progress database
    if (onAttempt) {
      onAttempt(problem);
    }

    if (isCorrect) {
      setIsAnimating(true);
      setFeedback({
        success: true,
        message: "Correct! Outstanding job. You've earned +100 XP! 🎉",
      });
      if (onSolved) {
        onSolved(problem);
      }
      setTimeout(() => setIsAnimating(false), 1500);
    } else {
      setFeedback({
        success: false,
        message: "Incorrect answer. Check the hint, review the lesson, and try again!",
      });
    }
  };

  return (
    <div className="prob-modal-overlay" onClick={onClose}>
      <div className="prob-modal coal-theme-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="prob-modal-header">
          <div>
            <span className="prob-id">#{problem.listId}</span>
            <h2 className="prob-modal-title">{problem.title}</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span
              className="prob-difficulty"
              style={{
                color: difficultyColor[problem.difficulty],
                fontSize: "1rem",
                fontWeight: "600"
              }}
            >
              {problem.difficulty}
            </span>
            <button className="prob-close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="prob-modal-body">
          {/* Left panel: Problem Details */}
          <div className="prob-modal-left">
            <section className="prob-section">
              <h4>Description</h4>
              <div className="coal-problem-description">
                {problem.description.split("\n\n").map((para, i) => (
                  <p key={i} style={{ marginBottom: "0.8rem", lineHeight: "1.6" }}>{para}</p>
                ))}
              </div>
            </section>

            {/* Input / Output requirements */}
            <section className="prob-section">
              <h4>Tracing Register/Data States</h4>
              <div className="prob-io-info" style={{ marginTop: "0.5rem" }}>
                <div>
                  <span className="prob-io-label">Initial State / Inputs</span>
                  <div className="prob-io-pills">
                    {problem.inputs.map((inp) => (
                      <span key={inp} className="prob-io-pill input-pill coal-purple-pill">
                        {inp}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="prob-io-label">Target / Outputs</span>
                  <div className="prob-io-pills">
                    {problem.outputs.map((out) => (
                      <span key={out} className="prob-io-pill output-pill coal-indigo-pill">
                        {out}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Hint */}
            <section className="prob-section">
              {showHint && (
                <div className="prob-hint" style={{ marginTop: "1rem", padding: "1rem", borderRadius: "8px", background: "rgba(139, 92, 246, 0.08)", border: "1px solid rgba(139, 92, 246, 0.2)" }}>
                  <h4 style={{ color: "#a78bfa" }}>💡 Hint</h4>
                  <p style={{ fontStyle: "italic", fontSize: "0.9rem", color: "#e2e8f0", marginTop: "0.5rem" }}>
                    {problem.hint}
                  </p>
                </div>
              )}
              <button
                className="prob-hint-btn coal-btn-secondary"
                onClick={() => setShowHint((v) => !v)}
                style={{ marginTop: "1rem" }}
              >
                {showHint ? "Hide Hint" : "Show Hint"}
              </button>
            </section>
          </div>

          {/* Right panel: Interactive Solver */}
          <div className="prob-modal-right">
            <div className="prob-forge-panel coal-solver-panel">
              <div className="prob-forge-icon" style={{ color: "#a78bfa" }}>⚡</div>
              <h4>Submit Solution</h4>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "1.2rem" }}>
                Analyze the instruction execution or conceptual query on the left, select/type the solution, and test your understanding.
              </p>

              <form onSubmit={handleSubmit} className="coal-solver-form">
                {problem.type === "mcq" ? (
                  <div className="mcq-options-container">
                    {problem.options.map((option, idx) => {
                      const letter = String.fromCharCode(65 + idx); // A, B, C, D
                      const isSelected = selectedOption === option;

                      return (
                        <button
                          key={option}
                          type="button"
                          className={`mcq-option-btn ${isSelected ? "selected" : ""}`}
                          onClick={() => {
                            if (feedback?.success) return;
                            setSelectedOption(option);
                          }}
                          disabled={feedback?.success}
                        >
                          <span className="mcq-letter">{letter}</span>
                          <span className="mcq-text">{option}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="fill-in-container">
                    <label className="fill-in-label">Enter final value:</label>
                    <input
                      type="text"
                      className="fill-in-input"
                      placeholder="Type your answer (e.g. 0x1010 or 15)"
                      value={textAnswer}
                      onChange={(e) => {
                        if (feedback?.success) return;
                        setTextAnswer(e.target.value);
                      }}
                      disabled={feedback?.success}
                      autoFocus
                    />
                  </div>
                )}

                {feedback && (
                  <div className={`solver-feedback ${feedback.success ? "success" : "error"} ${isAnimating ? "animate-pulse" : ""}`}>
                    <span>{feedback.success ? "✓" : "✗"}</span>
                    <p>{feedback.message}</p>
                  </div>
                )}

                {!feedback?.success && (
                  <button type="submit" className="coal-submit-btn">
                    Submit Answer
                  </button>
                )}
              </form>

              {/* Workflow stats */}
              <div className="prob-divider" style={{ margin: "1.2rem 0" }} />
              <div className="prob-workflow">
                <div className="prob-workflow-step">
                  <span className="prob-workflow-num coal-num">1</span>
                  <span>Trace values through registers, addresses, or logic gates.</span>
                </div>
                <div className="prob-workflow-step">
                  <span className="prob-workflow-num coal-num">2</span>
                  <span>Verify signed arithmetic bounds,Little Endian ordering, or hazards.</span>
                </div>
                <div className="prob-workflow-step">
                  <span className="prob-workflow-num coal-num">3</span>
                  <span>Submit to the automated validator for immediate validation.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .coal-theme-modal {
          border: 1px solid rgba(139, 92, 246, 0.3) !important;
          background: rgba(15, 10, 31, 0.95) !important;
          box-shadow: 0 20px 50px rgba(139, 92, 246, 0.15) !important;
        }

        .coal-purple-pill {
          background: rgba(139, 92, 246, 0.15) !important;
          border: 1px solid rgba(139, 92, 246, 0.3) !important;
          color: #c084fc !important;
        }

        .coal-indigo-pill {
          background: rgba(99, 102, 241, 0.15) !important;
          border: 1px solid rgba(99, 102, 241, 0.3) !important;
          color: #a5b4fc !important;
        }

        .coal-btn-secondary {
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          color: #c084fc;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .coal-btn-secondary:hover {
          background: rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.5);
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.2);
        }

        .coal-solver-panel {
          border: 1px solid rgba(139, 92, 246, 0.2) !important;
          background: rgba(26, 18, 50, 0.4) !important;
        }

        .coal-solver-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
        }

        .mcq-options-container {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          width: 100%;
        }

        .mcq-option-btn {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(148, 163, 184, 0.12);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          color: #e2e8f0;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mcq-option-btn:hover:not(:disabled) {
          background: rgba(139, 92, 246, 0.08);
          border-color: rgba(139, 92, 246, 0.35);
          transform: translateX(4px);
        }

        .mcq-option-btn.selected {
          background: rgba(139, 92, 246, 0.18);
          border-color: rgba(139, 92, 246, 0.7);
          box-shadow: 0 0 12px rgba(139, 92, 246, 0.2);
          color: #ffffff;
        }

        .mcq-letter {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.8rem;
          font-weight: 700;
          color: #94a3b8;
        }

        .mcq-option-btn.selected .mcq-letter {
          background: #8b5cf6;
          border-color: #a78bfa;
          color: #ffffff;
        }

        .mcq-text {
          font-size: 0.88rem;
          line-height: 1.4;
        }

        .fill-in-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .fill-in-label {
          font-size: 0.85rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .fill-in-input {
          background: rgba(15, 10, 31, 0.6);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 8px;
          padding: 0.8rem 1rem;
          color: #ffffff;
          font-family: source-code-pro, Menlo, Monaco, Consolas, monospace;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .fill-in-input:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.25);
          background: rgba(15, 10, 31, 0.8);
        }

        .coal-submit-btn {
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          border: none;
          color: #ffffff;
          font-weight: 600;
          font-size: 0.9rem;
          padding: 0.8rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.25);
        }

        .coal-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
        }

        .solver-feedback {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          padding: 0.8rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          line-height: 1.5;
        }

        .solver-feedback.success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #34d399;
        }

        .solver-feedback.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
        }

        .coal-num {
          background: rgba(139, 92, 246, 0.15) !important;
          border-color: rgba(139, 92, 246, 0.35) !important;
          color: #c084fc !important;
        }

        .animate-pulse {
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default CoalProblemModal;
