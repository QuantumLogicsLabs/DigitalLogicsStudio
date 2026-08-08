import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  Shuffle,
  Zap,
  X,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Plug,
} from "lucide-react";
import Boolforge from "../../../features/boolforge/Boolforge";
import { useAuth } from "../../../auth/context/AuthContext";
import { validateCircuit } from "../../utils/circuitProblemValidator";
import "./CircuitModal.css";

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
    setAssignment((prev) => {
      const nextMap = { ...prev[kind] };
      if (id === "") {
        delete nextMap[name];
      } else {
        nextMap[name] = Number(id);
      }
      return { ...prev, [kind]: nextMap };
    });
  };

  return (
    <div
      className="circuit-modal-assignment-overlay"
      onClick={onClose}
    >
      <div
        className="circuit-modal-assignment-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="circuit-modal-assignment-title">
          <Shuffle size={18} style={{ display: "inline", marginRight: 6 }} />
          Assign Gates to Ports
        </h3>
        <p className="circuit-modal-assignment-desc">
          Map each problem port to the circuit gate that represents it. Leave on
          auto to use positional order.
        </p>

        <div className="circuit-modal-assign-panel">
          <strong className="circuit-modal-assignment-section inputs">
            Inputs
          </strong>
          {(problem?.inputs || []).map((name) => (
            <div key={name} className="circuit-modal-assign-row">
              <span className="circuit-modal-assign-label">{name}</span>
              <select
                className="circuit-modal-assign-select"
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

        <div className="circuit-modal-assign-panel no-border">
          <strong className="circuit-modal-assignment-section outputs">
            Outputs
          </strong>
          {(problem?.outputs || []).map((name) => (
            <div key={name} className="circuit-modal-assign-row">
              <span className="circuit-modal-assign-label output">
                {name}
              </span>
              <select
                className="circuit-modal-assign-select"
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

        <div className="circuit-modal-assign-actions">
          <button
            className="circuit-modal-btn-reset"
            onClick={() => {
              setAssignment({ inputMap: {}, outputMap: {} });
              onClose();
            }}
          >
            Reset to Auto
          </button>
          <button
            className="circuit-modal-btn-done"
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

  const boolforgeExpression = useMemo(() => {
    if (!isExperimentMode || !expression) return null;
    return expression.replace(/^[A-Za-z]\s*=\s*/, "").trim();
  }, [isExperimentMode, expression]);

  const boolforgePortNames = useMemo(
    () => ({ inputs: problem?.inputs || [], outputs: problem?.outputs || [] }),
    [problem?.inputs, problem?.outputs],
  );
  const emptyVariables = useMemo(() => [], []);

  const [gates, setGates] = useState([]);
  const [wires, setWires] = useState([]);
  const [result, setResult] = useState(null);
  const [showAssign, setShowAssign] = useState(false);
  const [completionError, setCompletionError] = useState("");
  const [isSavingCompletion, setIsSavingCompletion] = useState(false);
  const isSavingRef = React.useRef(false);
  const [assignment, setAssignment] = useState({ inputMap: {}, outputMap: {} });
  const solvedNotifiedRef = React.useRef(false);
  const [validationPage, setValidationPage] = useState(1);

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
    setValidationPage(1);
  }, [open, problemId]);

  const isSolvedForUser =
    !isExperimentMode && problemId !== null
      ? hasSolvedProblem(problemId)
      : false;

  const handleCircuitChange = useCallback((g, w) => {
    setGates(g);
    setWires(w);
    setResult(null);
    setValidationPage(1);
    solvedNotifiedRef.current = false;
  }, []);

  const handleSolvedLocally = useCallback(() => {
    if (isExperimentMode || !problem) return;
    if (solvedNotifiedRef.current) return;
    solvedNotifiedRef.current = true;
    onSolved?.(problem);
  }, [isExperimentMode, onSolved, problem]);

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

  const handleSubmit = () => {
    if (!problem) return;
    const useAssignment = isAssigned ? assignment : null;
    const res = validateCircuit(gates, wires, problem, useAssignment);
    setResult(res);
    setValidationPage(1);
    if (res.pass) {
      handleSolvedLocally();
      persistSolvedState();
    }
  };

  const inputGates = gates.filter((g) => g.type === "INPUT");
  const outputGates = gates.filter((g) => g.type === "OUTPUT");
  const needInputs = problem?.inputs?.length ?? 0;
  const needOutputs = problem?.outputs?.length ?? 0;
  const hasRight =
    inputGates.length === needInputs && outputGates.length === needOutputs;

  // Auto-validate only for graded problems
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
    <div className="circuit-modal-overlay">
      {showAssign && (
        <AssignmentPanel
          problem={problem}
          gates={gates}
          assignment={assignment}
          setAssignment={setAssignment}
          onClose={() => setShowAssign(false)}
        />
      )}

      {/* ── Top bar ── */}
      <div className="circuit-modal-topbar">
        <span className="circuit-modal-title">
          {isExperimentMode ? (
            <>
              <Plug size={16} style={{ display: "inline", marginRight: 6 }} />
              Experiment: {problem.title}
            </>
          ) : (
            `#${problem.id} ${problem.title}`
          )}
        </span>

        {/* I/O pills */}
        <div className="circuit-modal-iobar">
          <span className="circuit-modal-need-label">Need:</span>
          <span className="circuit-modal-pill circuit-modal-pill-inputs">
            {needInputs} INPUT{needInputs !== 1 ? "S" : ""} (
            {(problem?.inputs || []).join(", ")})
          </span>
          <span className="circuit-modal-pill circuit-modal-pill-outputs">
            {needOutputs} OUTPUT{needOutputs !== 1 ? "S" : ""} (
            {(problem?.outputs || []).join(", ")})
          </span>
          <span
            className={`circuit-modal-gate-match-status ${
              hasRight ? "valid" : "invalid"
            }`}
          >
            {hasRight ? (
              <>
                <CheckCircle2 size={14} style={{ display: "inline", marginRight: 4 }} />
                Gate count matches
              </>
            ) : (
              `Circuit has ${inputGates.length} input(s) / ${outputGates.length} output(s)`
            )}
          </span>
        </div>

        {/* Map gates — graded problems only */}
        {!isExperimentMode && (
          <button
            className={`circuit-modal-map-btn ${isAssigned ? "assigned" : ""}`}
            title="Manually assign which circuit gate maps to which problem port."
            onClick={() => setShowAssign(true)}
          >
            <Shuffle size={14} style={{ display: "inline", marginRight: 6 }} />
            Map Gates {isAssigned ? "(custom)" : "(auto)"}
          </button>
        )}

        {/* Submit — graded problems only */}
        {!isExperimentMode && (
          <button
            className="circuit-modal-submit-btn"
            disabled={!hasRight}
            onClick={handleSubmit}
            title={
              !hasRight
                ? `Add exactly ${needInputs} INPUT and ${needOutputs} OUTPUT gate(s)`
                : "Validate circuit against truth table"
            }
          >
            <Zap size={14} style={{ display: "inline", marginRight: 6 }} />
            Submit Circuit
          </button>
        )}

        {/* Progress card — graded problems only */}
        {!isExperimentMode && (
          <div className={`circuit-modal-status-card ${completionTone}`}>
            <span className="circuit-modal-status-title">Progress</span>
            <span className="circuit-modal-status-label">
              {completionLabel}
            </span>
            <span className="circuit-modal-status-subtext">
              {completionSubtext}
            </span>
          </div>
        )}

        <button className="circuit-modal-close-btn" onClick={onClose}>
          <X size={16} style={{ display: "inline", marginRight: 4 }} /> Close
        </button>
      </div>

      {/* ── Problem description bar ── */}
      {!isExperimentMode && problem?.description && (
        <div className="circuit-modal-descbar">
          <span className="circuit-modal-descbar-indicator" />
          <span className="circuit-modal-descbar-text">
            <b>PROBLEM :</b> {problem.description}
          </span>

          {problem?.equations?.length > 0 && (
            <div className="circuit-modal-equations-wrap">
              {(problem.equations || []).map((eq, i) => (
                <code key={i} className="circuit-modal-equation-code">
                  {eq}
                </code>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Body ── */}
      <div className="circuit-modal-body">
        <div className="circuit-modal-canvas">
          <Boolforge
            embedded={true}
            initialGates={gates}
            initialWires={wires}
            onCircuitChange={handleCircuitChange}
            portNames={boolforgePortNames}
            simplifiedExpression={isExperimentMode ? boolforgeExpression : null}
            variables={isExperimentMode ? variables : emptyVariables}
          />
        </div>

        {/* Result panel — graded problems only */}
        {!isExperimentMode && result && (
          <div className="circuit-modal-result-panel">
            <div
              className={`circuit-modal-result-header ${
                result.pass ? "pass" : "fail"
              }`}
            >
              {result.pass ? (
                <CheckCircle2 size={24} color="#16a34a" />
              ) : (
                <XCircle size={24} color="#dc2626" />
              )}
              <h3
                className={`circuit-modal-result-title ${
                  result.pass ? "pass" : "fail"
                }`}
              >
                {result.pass ? "Circuit Correct!" : "Circuit Incorrect"}
              </h3>
              {result.pass && (
                <span className="circuit-modal-result-pass-sub">
                  All {result.rows.length} rows pass
                </span>
              )}
              <button
                onClick={() => setResult(null)}
                className={`circuit-modal-result-close-btn ${
                  result.pass ? "pass" : "fail"
                }`}
                title="Close result panel"
                aria-label="Close result panel"
              >
                <X size={16} />
              </button>
            </div>

            {result.error && (
              <div className="circuit-modal-error-box">
                <AlertTriangle size={16} style={{ display: "inline", marginRight: 6 }} />
                {result.error}
              </div>
            )}

            {!result.error &&
              result.rows.length > 0 &&
              (() => {
                const inputKeys = problem?.inputs || [];
                const outputKeys = problem?.outputs || [];
                const failCount = result.rows.filter((r) => !r.pass).length;

                const rowsPerPage = 16;
                const totalPages = Math.ceil(result.rows.length / rowsPerPage);
                const effectivePage = Math.min(
                  validationPage,
                  Math.max(1, totalPages),
                );
                const startIndex = (effectivePage - 1) * rowsPerPage;
                const paginatedRows = result.rows.slice(
                  startIndex,
                  startIndex + rowsPerPage,
                );

                return (
                  <div className="circuit-modal-table-wrap">
                    {!result.pass && (
                      <div className="circuit-modal-fail-banner">
                        {failCount} of {result.rows.length} rows failed
                      </div>
                    )}
                    <table className="circuit-modal-table">
                      <thead>
                        <tr>
                          {inputKeys.map((k) => (
                            <th key={k} className="circuit-modal-th">
                              {k}
                            </th>
                          ))}
                          {outputKeys.map((k) => (
                            <React.Fragment key={k}>
                              <th className="circuit-modal-th expected">
                                {k} <CheckCircle2 size={12} style={{ display: "inline" }} />
                              </th>
                              <th className="circuit-modal-th got">Got</th>
                            </React.Fragment>
                          ))}
                          <th className="circuit-modal-th">
                            <CheckCircle2 size={12} style={{ display: "inline" }} />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedRows.map((row, i) => (
                          <tr
                            key={i}
                            className={`circuit-modal-tr ${
                              row.pass ? "pass" : "fail"
                            }`}
                          >
                            {inputKeys.map((k) => (
                              <td key={k} className="circuit-modal-td">
                                {row.inputs[k]}
                              </td>
                            ))}
                            {outputKeys.map((k) => {
                              const exp = row.expected[k];
                              const got = row.got[k];
                              const match = exp === got;
                              return (
                                <React.Fragment key={k}>
                                  <td className="circuit-modal-td output match">
                                    {exp}
                                  </td>
                                  <td
                                    className={`circuit-modal-td output ${
                                      match ? "match" : "mismatch"
                                    }`}
                                  >
                                    {got}
                                  </td>
                                </React.Fragment>
                              );
                            })}
                            <td
                              className={`circuit-modal-td status ${
                                row.pass ? "pass" : "fail"
                              }`}
                            >
                              {row.pass ? (
                                <CheckCircle2 size={14} color="#16a34a" />
                              ) : (
                                <XCircle size={14} color="#dc2626" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {totalPages > 1 && (
                      <div className="circuit-modal-pagination">
                        <button
                          type="button"
                          onClick={() =>
                            setValidationPage((p) => Math.max(1, p - 1))
                          }
                          disabled={effectivePage === 1}
                          className="circuit-modal-page-btn"
                        >
                          <ChevronLeft size={14} style={{ display: "inline", marginRight: 2 }} /> Prev
                        </button>
                        <span className="circuit-modal-page-info">
                          Page <strong>{effectivePage}</strong> of {totalPages}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setValidationPage((p) =>
                              Math.min(totalPages, p + 1),
                            )
                          }
                          disabled={effectivePage === totalPages}
                          className="circuit-modal-page-btn"
                        >
                          Next <ChevronRight size={14} style={{ display: "inline", marginLeft: 2 }} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default CircuitModal;
