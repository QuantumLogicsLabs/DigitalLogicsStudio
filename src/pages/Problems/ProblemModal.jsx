import React, { useState } from "react";
import CircuitModal from "../../components/CircuitModal";
import "./Problems.css";

const difficultyColor = {
  Easy: "var(--accent-primary, #00ff88)",
  Medium: "var(--accent-secondary, #00d4ff)",
  Hard: "var(--accent-danger, #ff3366)",
};

const ProblemModal = ({ problem, onClose, onSolved }) => {
  const [circuitOpen, setCircuitOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [circuitGates, setCircuitGates] = useState([]);
  const [circuitWires, setCircuitWires] = useState([]);
  const [submitResult, setSubmitResult] = useState(null); // null | { passed: bool, details: string }

  // Validate the circuit against the problem's truth table
  const handleSubmitCircuit = () => {
    const inputs = circuitGates.filter((g) => g.type === "INPUT");
    const outputs = circuitGates.filter((g) => g.type === "OUTPUT");

    if (inputs.length === 0 || outputs.length === 0) {
      setSubmitResult({
        passed: false,
        details:
          "Circuit has no INPUT or OUTPUT gates. Add and label them to match the problem ports.",
      });
      return;
    }

    // Check port name alignment
    const inputLabels = inputs.map((g) => g.label);
    const outputLabels = outputs.map((g) => g.label);
    const missingIn = (problem?.inputs || []).filter((p) => !inputLabels.includes(p));
    const missingOut = (problem?.outputs || []).filter((p) => !outputLabels.includes(p));
    if (missingIn.length > 0 || missingOut.length > 0) {
      const msg = [
        missingIn.length ? `Missing INPUT gates: ${missingIn.join(", ")}` : "",
        missingOut.length
          ? `Missing OUTPUT gates: ${missingOut.join(", ")}`
          : "",
      ]
        .filter(Boolean)
        .join("\n");
      setSubmitResult({
        passed: false,
        details: `Port name mismatch:\n${msg}\n\nRename your gates to match exactly.`,
      });
      return;
    }

    // Gate evaluation helper — tempGates must be passed explicitly so every
    // recursive call sees the INPUT values patched for the current truth-table row.
    const evaluateGate = (gate, rowGates, visited = new Set()) => {
      if (!gate || visited.has(gate.id)) return false;
      if (gate.type === "INPUT") return (gate.inputValues && gate.inputValues[0]) || false;
      const newVisited = new Set(visited);
      newVisited.add(gate.id);
      const inputs = [];
      (circuitWires || []).forEach((wire) => {
        if (wire && wire.toId === gate.id) {
          const from = (rowGates || []).find((g) => g && g.id === wire.fromId);
          if (from)
            inputs[wire.toIndex] = evaluateGate(from, rowGates, newVisited);
        }
      });
      const ci = inputs.filter((v) => v !== undefined);
      switch (gate.type) {
        case "AND":
          return ci.length > 0 && ci.every(Boolean);
        case "OR":
          return ci.some(Boolean);
        case "NOT":
          return inputs[0] !== undefined ? !inputs[0] : false;
        case "NAND":
          return !(ci.length > 0 && ci.every(Boolean));
        case "NOR":
          return !ci.some(Boolean);
        case "XOR":
          return ci.length >= 2 && ci.reduce((a, v) => a !== v, false);
        case "XNOR":
          return ci.length >= 2 && !ci.reduce((a, v) => a !== v, false);
        case "BUFFER":
        case "OUTPUT":
          return inputs[0] ?? false;
        default:
          return false;
      }
    };

    // Run against truth table
    const table = problem?.truthTable || [];
    if (!table.length) {
      setSubmitResult({
        passed: false,
        details: "No truth table available for automatic validation on this problem.",
      });
      return;
    }
    let failures = [];
    table.forEach((row, rowIdx) => {
      if (!row) return;
      const tempGates = circuitGates.map((g) => {
        if (!g) return g;
        if (g.type === "INPUT") {
          const val = row[g.label];
          return { ...g, inputValues: [val === 1 || val === true] };
        }
        return g;
      });
      (problem?.outputs || []).forEach((outLabel) => {
        const outGate = tempGates.find((g) => g && g.label === outLabel);
        if (!outGate) return;
        const computed = evaluateGate(outGate, tempGates, new Set()) ? 1 : 0;
        const expected = row[outLabel] !== undefined ? row[outLabel] : 0;
        if (computed !== expected) {
          failures.push({
            row: rowIdx + 1,
            output: outLabel,
            expected,
            computed,
          });
        }
      });
    });

    if (failures.length === 0) {
      setSubmitResult({
        passed: true,
        details: `All ${table.length} truth table rows passed! ✅`,
      });
    } else {
      const shown = failures.slice(0, 5);
      const detail = shown
        .map(
          (f) =>
            `Row ${f.row}: ${f.output} expected ${f.expected}, got ${f.computed}`,
        )
        .join("\n");
      setSubmitResult({
        passed: false,
        details: `${failures.length} row(s) failed:\n${detail}${failures.length > 5 ? `\n…and ${failures.length - 5} more` : ""}`,
      });
    }
  };

  if (!problem) return null;

  // If circuit modal is fullscreen, render it on top
  if (circuitOpen) {
    return (
      <CircuitModal
        open={true}
        onClose={() => setCircuitOpen(false)}
        problem={problem}
        onSolved={onSolved}
        onCircuitChange={(gates, wires) => {
          setCircuitGates(gates);
          setCircuitWires(wires);
        }}
        onSubmit={handleSubmitCircuit}
        submitResult={submitResult}
        onClearResult={() => setSubmitResult(null)}
        hasSolvedProblem={(problemId) =>
          submitResult?.passed === true &&
          (problemId === undefined || problemId === problem?.id)
        }
      />
    );
  }

  return (
    <div className="prob-modal-overlay" onClick={onClose}>
      <div className="prob-modal" onClick={(e) => e.stopPropagation()}>
        {/* ── Header ── */}
        <div className="prob-modal-header">
          <div>
            <span className="prob-id">#{problem?.id}</span>
            <h2 className="prob-modal-title">{problem?.title || "Untitled"}</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span
              className="prob-difficulty"
              style={{
                color: difficultyColor[problem?.difficulty || "Easy"],
                fontSize: "1rem",
              }}
            >
              {problem?.difficulty || "Easy"}
            </span>
            <button className="prob-close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="prob-modal-body">
          {/* ── Left: problem details ── */}
          <div className="prob-modal-left">
            <section className="prob-section">
              <h4>Description</h4>
              <p>{problem?.description || "No description available."}</p>
            </section>

            <section className="prob-section">
              <h4>Boolean Equations</h4>
              <div className="prob-equations">
                {(problem?.equations || []).map((eq, i) => (
                  <code key={i} className="prob-eq">
                    {eq}
                  </code>
                ))}
              </div>
            </section>

            {showHint && (
              <section className="prob-section prob-hint" style={{ marginTop: "1rem" }}>
                <h4>💡 Hint: Truth Table</h4>
                {problem?.truthTable?.length ? (
                  <div className="prob-table-wrap" style={{ marginTop: "0.75rem", marginBottom: "0.75rem" }}>
                    <table className="prob-truth-table">
                      <thead>
                        <tr>
                          {problem.truthTable[0] && Object.keys(problem.truthTable[0]).map((col) => (
                            <th key={col}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {problem.truthTable.map((row, i) => row && (
                          <tr key={i}>
                            {Object.values(row).map((val, j) => (
                              <td
                                key={j}
                                className={
                                  typeof val === "number" && val === 1
                                    ? "cell-one"
                                    : ""
                                }
                              >
                                {String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ color: "var(--secondary-text)", fontSize: "0.85rem" }}>
                    No truth table available for this problem type.
                  </p>
                )}
                {problem?.hint && (
                  <p style={{ marginTop: "0.5rem", fontStyle: "italic", color: "var(--text-color, #e8f0ff)" }}>
                    <strong>Tip:</strong> {problem.hint}
                  </p>
                )}
              </section>
            )}

            <button
              className="prob-hint-btn"
              onClick={() => setShowHint((v) => !v)}
              style={{ marginTop: "1rem" }}
            >
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
          </div>

          {/* ── Right: circuit builder CTA ── */}
          <div className="prob-modal-right">
            {!problem?.isSynthetic ? (
              <div className="prob-forge-panel">
                <div className="prob-forge-icon">⚡</div>
                <h4>Build in CircuitForge</h4>
                <p>
                  Open the interactive circuit builder, wire up your design using
                  the required gates, then hit <strong>Submit Circuit</strong> —
                  the system will validate every row of the truth table
                  automatically.
                </p>

                {/* I/O reference */}
                <div className="prob-io-info">
                  <div>
                    <span className="prob-io-label">Inputs</span>
                    <div className="prob-io-pills">
                      {(problem?.inputs || []).map((inp) => (
                        <span key={inp} className="prob-io-pill input-pill">
                          {inp}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="prob-io-label">Outputs</span>
                    <div className="prob-io-pills">
                      {(problem?.outputs || []).map((out) => (
                        <span key={out} className="prob-io-pill output-pill">
                          {out}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Important naming note */}
                <div className="prob-naming-note">
                  <span className="prob-naming-icon">ℹ️</span>
                  <span>
                    Name your INPUT and OUTPUT gates to match the labels above
                    exactly — the validator checks them by name.
                  </span>
                </div>

                <button
                  className="prob-forge-btn"
                  onClick={() => setCircuitOpen(true)}
                >
                  🔧 Open Circuit Builder
                </button>

                {/* What happens inside */}
                <div className="prob-divider" />
                <div className="prob-workflow">
                  <div className="prob-workflow-step">
                    <span className="prob-workflow-num">1</span>
                    <span>Add and connect logic gates on the canvas</span>
                  </div>
                  <div className="prob-workflow-step">
                    <span className="prob-workflow-num">2</span>
                    <span>
                      Label INPUT / OUTPUT gates to match the port names
                    </span>
                  </div>
                  <div className="prob-workflow-step">
                    <span className="prob-workflow-num">3</span>
                    <span>
                      Click <strong>Submit Circuit</strong> — get instant
                      pass/fail feedback with a truth-table diff
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="prob-forge-panel">
                <div className="prob-forge-icon" style={{ color: "#fbbf24" }}>📝</div>
                <h4>Conceptual Practice</h4>
                <p>
                  This is a theoretical design or analysis problem. Use the details and the truth table in the hint to solve and verify it conceptually.
                </p>
                <div className="prob-naming-note" style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.3)", color: "#fbbf24" }}>
                  <span className="prob-naming-icon">ℹ️</span>
                  <span>
                    Automatic verification is not active for this type. You can test circuit subcomponents in the general Circuit Forge sandbox.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Extra styles for new elements */}
      <style>{`
                .prob-naming-note {
                    display: flex;
                    gap: 0.5rem;
                    align-items: flex-start;
                    background: rgba(255,165,0,0.07);
                    border: 1px solid rgba(255,165,0,0.2);
                    border-radius: 8px;
                    padding: 0.6rem 0.75rem;
                    font-size: 0.8rem;
                    color: #ffc870;
                    line-height: 1.5;
                    margin: 0.25rem 0;
                }
                .prob-naming-icon { flex-shrink: 0; }

                .prob-workflow {
                    display: flex;
                    flex-direction: column;
                    gap: 0.6rem;
                }
                .prob-workflow-step {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.6rem;
                    font-size: 0.82rem;
                    color: var(--secondary-text, #8899aa);
                    line-height: 1.5;
                }
                .prob-workflow-num {
                    flex-shrink: 0;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: rgba(99,102,241,0.2);
                    border: 1px solid rgba(99,102,241,0.4);
                    color: #a5b4fc;
                    font-size: 0.72rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 1px;
                }
            `}</style>
    </div>
  );
};

export default ProblemModal;
