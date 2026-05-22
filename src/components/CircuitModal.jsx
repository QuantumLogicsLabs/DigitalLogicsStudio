import React, { useState, useCallback, useEffect, useMemo } from "react";
import Boolforge from "../pages/Boolforge";
import { useAuth } from "../context/AuthContext";
import { validateCircuit } from "../utils/circuitProblemValidator";

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
    backdropFilter: "blur(6px)",
    zIndex: 3000,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  topBar: {
    background: "var(--bg-medium,#141b2d)",
    borderBottom: "1px solid var(--border-color,#2a3550)",
    padding: "0.6rem 1.25rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    flexShrink: 0,
    flexWrap: "wrap",
  },
  ioBar: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    flexWrap: "wrap",
    flex: 1,
  },
  pill: (color) => ({
    background: `${color}18`,
    border: `1px solid ${color}55`,
    color,
    borderRadius: 999,
    padding: "0.2rem 0.7rem",
    fontSize: "0.75rem",
    fontWeight: 700,
    fontFamily: "monospace",
    letterSpacing: "0.05em",
  }),
  needLabel: {
    fontSize: "0.7rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "var(--secondary-text,#8899aa)",
  },
  closeBtn: {
    marginLeft: "auto",
    background: "none",
    border: "1px solid var(--border-color,#2a3550)",
    color: "var(--secondary-text,#8899aa)",
    borderRadius: 6,
    padding: "0.3rem 0.7rem",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "all 0.2s",
  },
  submitBtn: (disabled) => ({
    background: disabled
      ? "rgba(99,102,241,0.2)"
      : "linear-gradient(135deg,#3b82f6,#8b5cf6)",
    border: "none",
    color: "#fff",
    borderRadius: 8,
    padding: "0.45rem 1.1rem",
    fontSize: "0.88rem",
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: "opacity 0.2s",
    whiteSpace: "nowrap",
  }),
  body: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  canvas: {
    flex: 1,
    overflow: "hidden",
  },
  resultPanel: {
    width: 420,
    minWidth: 320,
    background: "var(--bg-medium,#141b2d)",
    borderLeft: "1px solid var(--border-color,#2a3550)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  resultHeader: (pass) => ({
    padding: "0.75rem 1rem",
    borderBottom: "1px solid var(--border-color,#2a3550)",
    background: pass ? "rgba(0,255,136,0.06)" : "rgba(255,51,102,0.06)",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  }),
  resultTitle: (pass) => ({
    fontSize: "1rem",
    fontWeight: 800,
    color: pass
      ? "var(--accent-primary,#00ff88)"
      : "var(--accent-danger,#ff3366)",
    margin: 0,
  }),
  tableWrap: {
    flex: 1,
    overflowY: "auto",
    padding: "0.5rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.72rem",
  },
  th: {
    background: "rgba(0,212,255,0.08)",
    color: "var(--accent-secondary,#00d4ff)",
    padding: "0.35rem 0.5rem",
    border: "1px solid var(--border-color,#2a3550)",
    fontWeight: 700,
    textAlign: "center",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  td: (isOutput, pass, isExpected) => ({
    padding: "0.3rem 0.5rem",
    border: "1px solid var(--border-color,#2a3550)",
    textAlign: "center",
    color: isOutput
      ? pass
        ? "var(--accent-primary,#00ff88)"
        : isExpected
          ? "var(--accent-primary,#00ff88)"
          : "var(--accent-danger,#ff3366)"
      : "var(--text-color,#e8f0ff)",
    fontWeight: isOutput ? 700 : 400,
    background:
      isOutput && !pass && !isExpected
        ? "rgba(255,51,102,0.06)"
        : "transparent",
  }),
  errorBox: {
    margin: "1rem",
    padding: "0.75rem 1rem",
    background: "rgba(255,51,102,0.08)",
    border: "1px solid rgba(255,51,102,0.3)",
    borderRadius: 8,
    color: "var(--accent-danger,#ff3366)",
    fontSize: "0.85rem",
    lineHeight: 1.5,
  },
  assignPanel: {
    padding: "1rem",
    borderBottom: "1px solid var(--border-color,#2a3550)",
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
  },
  assignRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  assignLabel: {
    width: 48,
    fontSize: "0.78rem",
    fontWeight: 700,
    fontFamily: "monospace",
    color: "var(--accent-secondary,#00d4ff)",
    flexShrink: 0,
  },
  assignSelect: {
    flex: 1,
    background: "var(--bg-light,#1e2842)",
    border: "1px solid var(--border-color,#2a3550)",
    color: "var(--text-color,#e8f0ff)",
    borderRadius: 6,
    padding: "0.25rem 0.5rem",
    fontSize: "0.78rem",
    cursor: "pointer",
  },
  statusCard: (tone) => ({
    borderRadius: 10,
    padding: "0.45rem 0.8rem",
    minWidth: 170,
    display: "flex",
    flexDirection: "column",
    gap: "0.12rem",
    border:
      tone === "complete"
        ? "1px solid rgba(0,255,136,0.35)"
        : tone === "warning"
          ? "1px solid rgba(255,193,7,0.35)"
          : tone === "error"
            ? "1px solid rgba(255,51,102,0.35)"
            : "1px solid var(--border-color,#2a3550)",
    background:
      tone === "complete"
        ? "rgba(0,255,136,0.08)"
        : tone === "warning"
          ? "rgba(255,193,7,0.08)"
          : tone === "error"
            ? "rgba(255,51,102,0.08)"
            : "rgba(255,255,255,0.03)",
  }),
};

// ─── Gate Assignment Modal ────────────────────────────────────────────────────
function AssignmentPanel({
  problem,
  gates,
  assignment,
  setAssignment,
  onClose,
}) {
  const inputGates = gates.filter((g) => g.type === "INPUT");
  const outputGates = gates.filter((g) => g.type === "OUTPUT");

  const update = (kind, name, id) => {
    setAssignment((prev) => ({
      ...prev,
      [kind]: { ...prev[kind], [name]: Number(id) },
    }));
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 4000,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--bg-medium,#141b2d)",
          border: "1px solid var(--border-color,#2a3550)",
          borderRadius: 12,
          padding: "1.25rem",
          minWidth: 320,
          maxWidth: 480,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          style={{
            margin: "0 0 1rem",
            color: "var(--text-color,#e8f0ff)",
            fontSize: "1rem",
            fontWeight: 800,
          }}
        >
          🔀 Assign Gates to Ports
        </h3>
        <p
          style={{
            fontSize: "0.78rem",
            color: "var(--secondary-text,#8899aa)",
            margin: "0 0 0.75rem",
            lineHeight: 1.5,
          }}
        >
          Map each problem port to the circuit gate that represents it. Leave on
          auto to use positional order.
        </p>

        <div style={S.assignPanel}>
          <strong
            style={{
              fontSize: "0.72rem",
              color: "var(--accent-secondary,#00d4ff)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Inputs
          </strong>
          {problem.inputs.map((name) => (
            <div key={name} style={S.assignRow}>
              <span style={S.assignLabel}>{name}</span>
              <select
                style={S.assignSelect}
                value={assignment.inputMap[name] ?? ""}
                onChange={(e) => update("inputMap", name, e.target.value)}
              >
                <option value="">Auto</option>
                {inputGates.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label} (gate #{g.id})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div style={{ ...S.assignPanel, borderBottom: "none" }}>
          <strong
            style={{
              fontSize: "0.72rem",
              color: "var(--accent-primary,#00ff88)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Outputs
          </strong>
          {problem.outputs.map((name) => (
            <div key={name} style={S.assignRow}>
              <span
                style={{
                  ...S.assignLabel,
                  color: "var(--accent-primary,#00ff88)",
                }}
              >
                {name}
              </span>
              <select
                style={S.assignSelect}
                value={assignment.outputMap[name] ?? ""}
                onChange={(e) => update("outputMap", name, e.target.value)}
              >
                <option value="">Auto</option>
                {outputGates.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label} (gate #{g.id})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.5rem",
            marginTop: "0.75rem",
          }}
        >
          <button
            style={{
              background: "none",
              border: "1px solid var(--border-color,#2a3550)",
              color: "var(--secondary-text,#8899aa)",
              borderRadius: 6,
              padding: "0.35rem 0.8rem",
              cursor: "pointer",
              fontSize: "0.82rem",
            }}
            onClick={() => {
              setAssignment({ inputMap: {}, outputMap: {} });
              onClose();
            }}
          >
            Reset to Auto
          </button>
          <button
            style={{
              background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
              border: "none",
              color: "#fff",
              borderRadius: 6,
              padding: "0.35rem 0.8rem",
              cursor: "pointer",
              fontSize: "0.82rem",
              fontWeight: 700,
            }}
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main CircuitModal ────────────────────────────────────────────────────────
const CircuitModal = ({
  open,
  onClose,
  problem: problemProp,
  expression,
  variables,
  onSolved,
}) => {
  // Experiment mode: BA pages pass expression + variables instead of a problem object.
  // useMemo keeps these stable so they're safe in useEffect dependency arrays.
  const isExperimentMode = useMemo(
    () => !problemProp && Boolean(expression && variables),
    [problemProp, expression, variables],
  );

  const problem = useMemo(() => {
    if (problemProp) return problemProp;
    if (!isExperimentMode) return null;
    return {
      id: null,
      title: expression,
      inputs: variables,
      outputs: ["F"],
    };
  }, [problemProp, isExperimentMode, expression, variables]);

  // Boolforge's parseExpressionToCircuit expects just the RHS (e.g. "A + B").
  // Strip any leading "F = " / "X = " prefix that BA pages include.
  const boolforgeExpression = useMemo(() => {
    if (!isExperimentMode || !expression) return null;
    return expression.replace(/^[A-Za-z]\s*=\s*/, "").trim();
  }, [isExperimentMode, expression]);

  const [gates, setGates] = useState([]);
  const [wires, setWires] = useState([]);
  const [result, setResult] = useState(null);
  const [showAssign, setShowAssign] = useState(false);
  const [completionError, setCompletionError] = useState("");
  const [isSavingCompletion, setIsSavingCompletion] = useState(false);
  const isSavingRef = React.useRef(false);
  const [assignment, setAssignment] = useState({ inputMap: {}, outputMap: {} });
  const solvedNotifiedRef = React.useRef(false);

  const {
    isAuthenticated = false,
    user = null,
    markProblemSolved = async () => {},
    hasSolvedProblem = () => false,
  } = useAuth() || {};

  const problemId = problem?.id ?? null;
  const isAssigned =
    Object.keys(assignment.inputMap).length > 0 ||
    Object.keys(assignment.outputMap).length > 0;

  useEffect(() => {
    solvedNotifiedRef.current = false;
  }, [open, problemId]);

  // Never call hasSolvedProblem(null): Number(null) === 0 which is a valid
  // integer and would accidentally match problem id 0 in the solved set.
  const isSolvedForUser =
    !isExperimentMode && problemId !== null
      ? hasSolvedProblem(problemId)
      : false;

  const handleCircuitChange = useCallback((g, w) => {
    setGates(g);
    setWires(w);
    setResult(null);
    solvedNotifiedRef.current = false;
  }, []);

  const handleSolvedLocally = useCallback(() => {
    if (isExperimentMode || !problem) return;
    if (solvedNotifiedRef.current) return;
    solvedNotifiedRef.current = true;
    onSolved?.(problem);
  }, [isExperimentMode, onSolved, problem]);

  const handleSubmit = () => {
    if (!problem) return;
    const useAssignment = isAssigned ? assignment : null;
    const res = validateCircuit(gates, wires, problem, useAssignment);
    setResult(res);
    if (res.pass) {
      handleSolvedLocally();
      persistSolvedState();
    }
  };

  const inputGates = gates.filter((g) => g.type === "INPUT");
  const outputGates = gates.filter((g) => g.type === "OUTPUT");
  const needInputs = problem?.inputs.length ?? 0;
  const needOutputs = problem?.outputs.length ?? 0;
  const hasRight =
    inputGates.length === needInputs && outputGates.length === needOutputs;

  const persistSolvedState = useCallback(async () => {
    if (
      !problemId ||
      !isAuthenticated ||
      isSolvedForUser ||
      isSavingRef.current
    ) {
      return;
    }
    isSavingRef.current = true;
    setIsSavingCompletion(true);
    setCompletionError("");
    try {
      await markProblemSolved(problemId);
    } catch (error) {
      setCompletionError(
        error.response?.data?.message ||
          "Circuit is correct, but progress could not be saved.",
      );
    } finally {
      isSavingRef.current = false;
      setIsSavingCompletion(false);
    }
  }, [isAuthenticated, isSolvedForUser, markProblemSolved, problemId]);

  // Auto-validate only for graded problems — experiment mode has no truth table.
  useEffect(() => {
    if (!open || !problem || isExperimentMode || !hasRight || isSolvedForUser) {
      return;
    }
    const validationResult = validateCircuit(
      gates,
      wires,
      problem,
      isAssigned ? assignment : null,
    );
    if (!validationResult.pass) return;
    setResult((prev) => {
      if (prev?.pass) return prev;
      return validationResult;
    });
    handleSolvedLocally();
    persistSolvedState();
  }, [
    assignment,
    gates,
    handleSolvedLocally,
    hasRight,
    isAssigned,
    isExperimentMode,
    isSolvedForUser,
    open,
    persistSolvedState,
    problem,
    wires,
  ]);

  const completionTone = !isAuthenticated
    ? "warning"
    : completionError
      ? "error"
      : isSolvedForUser
        ? "complete"
        : "default";

  const completionLabel = !isAuthenticated
    ? "Guest mode"
    : completionError
      ? "Save issue"
      : isSolvedForUser
        ? "Completed"
        : isSavingCompletion
          ? "Saving..."
          : "In progress";

  const completionSubtext = !isAuthenticated
    ? "Log in to save problem progress"
    : completionError
      ? completionError
      : isSolvedForUser
        ? `Saved for ${user?.name || "current user"}`
        : "Build a correct circuit to complete this task";

  if (!open || !problem) return null;

  return (
    <div style={S.overlay}>
      {/* ── Top bar ── */}
      <div style={S.topBar}>
        <span
          style={{
            fontWeight: 800,
            color: "var(--text-color,#e8f0ff)",
            fontSize: "0.95rem",
            whiteSpace: "nowrap",
          }}
        >
          {isExperimentMode
            ? `🔌 Experiment: ${problem.title}`
            : `#${problem.id} ${problem.title}`}
        </span>

        {/* I/O pills */}
        <div style={S.ioBar}>
          <span style={S.needLabel}>Need:</span>
          <span style={S.pill("#00ff88")}>
            {needInputs} INPUT{needInputs !== 1 ? "S" : ""} (
            {problem.inputs.join(", ")})
          </span>
          <span style={S.pill("#00d4ff")}>
            {needOutputs} OUTPUT{needOutputs !== 1 ? "S" : ""} (
            {problem.outputs.join(", ")})
          </span>
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 600,
              color: hasRight
                ? "var(--accent-primary,#00ff88)"
                : "var(--accent-danger,#ff3366)",
            }}
          >
            {hasRight
              ? "✓ Gate count matches"
              : `Circuit has ${inputGates.length} input(s) / ${outputGates.length} output(s)`}
          </span>
        </div>

        {/* Map gates — graded problems only */}
        {!isExperimentMode && (
          <button
            style={{
              background: isAssigned ? "rgba(0,212,255,0.12)" : "none",
              border: isAssigned
                ? "1px solid var(--accent-secondary,#00d4ff)"
                : "1px solid var(--border-color,#2a3550)",
              color: isAssigned
                ? "var(--accent-secondary,#00d4ff)"
                : "var(--secondary-text,#8899aa)",
              borderRadius: 6,
              padding: "0.3rem 0.7rem",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: isAssigned ? 700 : 400,
              whiteSpace: "nowrap",
            }}
            title="Manually assign which circuit gate maps to which problem port."
            onClick={() => setShowAssign(true)}
          >
            🔀 Map Gates {isAssigned ? "(custom)" : "(auto)"}
          </button>
        )}

        {/* Submit — graded problems only */}
        {!isExperimentMode && (
          <button
            style={S.submitBtn(!hasRight)}
            disabled={!hasRight}
            onClick={handleSubmit}
            title={
              !hasRight
                ? `Add exactly ${needInputs} INPUT and ${needOutputs} OUTPUT gate(s)`
                : "Validate circuit against truth table"
            }
          >
            ⚡ Submit Circuit
          </button>
        )}

        {/* Progress card — graded problems only */}
        {!isExperimentMode && (
          <div style={S.statusCard(completionTone)}>
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--secondary-text,#8899aa)",
              }}
            >
              Progress
            </span>
            <span
              style={{
                fontSize: "0.86rem",
                fontWeight: 800,
                color:
                  completionTone === "complete"
                    ? "var(--accent-primary,#00ff88)"
                    : completionTone === "warning"
                      ? "#fbbf24"
                      : completionTone === "error"
                        ? "var(--accent-danger,#ff3366)"
                        : "var(--text-color,#e8f0ff)",
              }}
            >
              {completionLabel}
            </span>
            <span
              style={{
                fontSize: "0.72rem",
                color: "var(--secondary-text,#8899aa)",
                lineHeight: 1.4,
              }}
            >
              {completionSubtext}
            </span>
          </div>
        )}

        <button style={S.closeBtn} onClick={onClose}>
          ✕ Close
        </button>
      </div>

      {/* ── Body ── */}
      <div style={S.body}>
        <div style={S.canvas}>
          <Boolforge
            onCircuitChange={handleCircuitChange}
            portNames={{ inputs: problem.inputs, outputs: problem.outputs }}
            // Pass the expression so Boolforge auto-builds the circuit via its
            // existing parseExpressionToCircuit + hasAutoBuilt hook.
            // Only set these in experiment mode; leave null for graded problems
            // so Boolforge starts with a blank canvas as before.
            simplifiedExpression={isExperimentMode ? boolforgeExpression : null}
            variables={isExperimentMode ? variables : []}
          />
        </div>

        {/* Result panel — graded problems only */}
        {!isExperimentMode && result && (
          <div style={S.resultPanel}>
            <div style={S.resultHeader(result.pass)}>
              <span style={{ fontSize: "1.4rem" }}>
                {result.pass ? "✅" : "❌"}
              </span>
              <h3 style={S.resultTitle(result.pass)}>
                {result.pass ? "Circuit Correct!" : "Circuit Incorrect"}
              </h3>
              {result.pass && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "0.78rem",
                    color: "var(--accent-primary,#00ff88)",
                  }}
                >
                  All {result.rows.length} rows pass
                </span>
              )}
            </div>

            {result.error && <div style={S.errorBox}>⚠️ {result.error}</div>}

            {!result.error &&
              result.rows.length > 0 &&
              (() => {
                const inputKeys = problem.inputs;
                const outputKeys = problem.outputs;
                const failCount = result.rows.filter((r) => !r.pass).length;
                return (
                  <div style={S.tableWrap}>
                    {!result.pass && (
                      <div
                        style={{
                          padding: "0.4rem 0.6rem",
                          marginBottom: "0.5rem",
                          background: "rgba(255,51,102,0.08)",
                          border: "1px solid rgba(255,51,102,0.2)",
                          borderRadius: 6,
                          fontSize: "0.75rem",
                          color: "var(--accent-danger,#ff3366)",
                        }}
                      >
                        {failCount} of {result.rows.length} rows failed
                      </div>
                    )}
                    <table style={S.table}>
                      <thead>
                        <tr>
                          {inputKeys.map((k) => (
                            <th key={k} style={S.th}>
                              {k}
                            </th>
                          ))}
                          {outputKeys.map((k) => (
                            <React.Fragment key={k}>
                              <th
                                style={{
                                  ...S.th,
                                  color: "var(--accent-primary,#00ff88)",
                                }}
                              >
                                {k} ✓
                              </th>
                              <th style={{ ...S.th, color: "#a5b4fc" }}>Got</th>
                            </React.Fragment>
                          ))}
                          <th style={S.th}>✓</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.rows.map((row, i) => (
                          <tr
                            key={i}
                            style={{
                              background: row.pass
                                ? "transparent"
                                : "rgba(255,51,102,0.04)",
                            }}
                          >
                            {inputKeys.map((k) => (
                              <td key={k} style={S.td(false, true, true)}>
                                {row.inputs[k]}
                              </td>
                            ))}
                            {outputKeys.map((k) => {
                              const exp = row.expected[k];
                              const got = row.got[k];
                              const match = exp === got;
                              return (
                                <React.Fragment key={k}>
                                  <td style={S.td(true, true, true)}>{exp}</td>
                                  <td style={S.td(true, match, false)}>
                                    {got}
                                  </td>
                                </React.Fragment>
                              );
                            })}
                            <td
                              style={{
                                ...S.td(false, true, true),
                                color: row.pass
                                  ? "var(--accent-primary,#00ff88)"
                                  : "var(--accent-danger,#ff3366)",
                              }}
                            >
                              {row.pass ? "✓" : "✗"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}

            {!result.error && (
              <div
                style={{
                  padding: "0.6rem 0.8rem",
                  borderTop: "1px solid var(--border-color,#2a3550)",
                  fontSize: "0.72rem",
                  color: "var(--secondary-text,#8899aa)",
                  lineHeight: 1.5,
                }}
              >
                {isAssigned
                  ? "🔀 Using custom gate assignment."
                  : `⚡ Inputs matched by position: ${problem.inputs
                      .map((name, i) => {
                        const g = inputGates[i];
                        return g ? `${name}→${g.label}` : name;
                      })
                      .join(", ")}. Outputs: ${problem.outputs
                      .map((name, i) => {
                        const g = outputGates[i];
                        return g ? `${name}→${g.label}` : name;
                      })
                      .join(", ")}.`}{" "}
                Wrong mapping?{" "}
                <button
                  onClick={() => setShowAssign(true)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--accent-secondary,#00d4ff)",
                    textDecoration: "underline",
                    fontSize: "0.72rem",
                    padding: 0,
                  }}
                >
                  Map gates manually →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Assignment modal — graded problems only */}
      {!isExperimentMode && showAssign && (
        <AssignmentPanel
          problem={problem}
          gates={gates}
          assignment={assignment}
          setAssignment={setAssignment}
          onClose={() => setShowAssign(false)}
        />
      )}
    </div>
  );
};

export default CircuitModal;
