import React, { useState, useCallback, useRef } from "react";
import Boolforge from "../pages/Boolforge";

// ─── Gate evaluator (mirrors Boolforge's evaluateGateWithGates) ───────────────
function evalGate(
  gate,
  gatesArray,
  wiresArray,
  depth = 0,
  visited = new Set(),
) {
  if (depth > 100 || !gate || visited.has(gate.id)) return false;
  if (gate.type === "INPUT") return gate.inputValues[0] || false;

  const newVisited = new Set(visited);
  newVisited.add(gate.id);
  const inputs = [];

  wiresArray.forEach((wire) => {
    if (wire.toId === gate.id) {
      const fromGate = gatesArray.find((g) => g.id === wire.fromId);
      if (fromGate)
        inputs[wire.toIndex] = evalGate(
          fromGate,
          gatesArray,
          wiresArray,
          depth + 1,
          newVisited,
        );
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
}

// ─── Validate circuit against a problem's truth table ────────────────────────
// Matches inputs by POSITION (order in the circuit's INPUT gate list)
// and outputs by POSITION (order in the circuit's OUTPUT gate list).
// Optionally uses a user-supplied assignment map: { inputMap, outputMap }
//   inputMap[problemInputName]  → circuit gate id
//   outputMap[problemOutputName] → circuit gate id
function validateCircuit(gates, wires, problem, assignment = null) {
  const inputGates = gates.filter((g) => g.type === "INPUT");
  const outputGates = gates.filter((g) => g.type === "OUTPUT");

  const probInputs = problem.inputs;
  const probOutputs = problem.outputs;

  if (inputGates.length !== probInputs.length)
    return {
      pass: false,
      rows: [],
      error: `Circuit has ${inputGates.length} INPUT gate(s) but problem needs ${probInputs.length}.`,
    };
  if (outputGates.length !== probOutputs.length)
    return {
      pass: false,
      rows: [],
      error: `Circuit has ${outputGates.length} OUTPUT gate(s) but problem needs ${probOutputs.length}.`,
    };

  // Build ordered arrays using assignment map if provided, else use position
  const orderedInputs = assignment
    ? probInputs.map((name) =>
        gates.find((g) => g.id === assignment.inputMap[name]),
      )
    : inputGates; // positional

  const orderedOutputs = assignment
    ? probOutputs.map((name) =>
        gates.find((g) => g.id === assignment.outputMap[name]),
      )
    : outputGates; // positional

  if (orderedInputs.some((g) => !g) || orderedOutputs.some((g) => !g))
    return {
      pass: false,
      rows: [],
      error: "Assignment is incomplete. Please map all inputs and outputs.",
    };

  const rows = [];
  let allPass = true;

  for (const truthRow of problem.truthTable) {
    // Set each input gate's value according to this truth-table row
    const tempGates = gates.map((g) => {
      const idx = orderedInputs.findIndex((ig) => ig && ig.id === g.id);
      if (idx !== -1) {
        return { ...g, inputValues: [!!truthRow[probInputs[idx]]] };
      }
      return g;
    });

    // Evaluate each output
    const gotValues = {};
    let rowPass = true;
    for (let oi = 0; oi < orderedOutputs.length; oi++) {
      const outGate = tempGates.find((g) => g.id === orderedOutputs[oi].id);
      const got = evalGate(outGate, tempGates, wires) ? 1 : 0;
      const expected = truthRow[probOutputs[oi]];
      gotValues[probOutputs[oi]] = got;
      if (got !== expected) rowPass = false;
    }

    if (!rowPass) allPass = false;
    rows.push({
      inputs: truthRow,
      expected: truthRow,
      got: gotValues,
      pass: rowPass,
    });
  }

  return { pass: allPass, rows, error: null };
}

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
  // Assignment panel
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
          borderRadius: 14,
          padding: "1.5rem",
          minWidth: 320,
          maxWidth: 480,
          boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.2rem" }}>🔀</span>
          <h3
            style={{
              margin: 0,
              color: "var(--text-color,#e8f0ff)",
              fontSize: "1rem",
            }}
          >
            Map Gates to Problem Ports
          </h3>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: "0.8rem",
            color: "var(--secondary-text,#8899aa)",
            lineHeight: 1.5,
          }}
        >
          Select which circuit gate corresponds to each problem input/output. By
          default the validator uses{" "}
          <strong style={{ color: "var(--accent-secondary,#00d4ff)" }}>
            position order
          </strong>{" "}
          — use this only if you need custom mapping.
        </p>

        <div>
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--accent-primary,#00ff88)",
              marginBottom: "0.4rem",
            }}
          >
            Inputs
          </div>
          {problem.inputs.map((name) => (
            <div key={name} style={S.assignRow}>
              <span style={S.assignLabel}>{name}</span>
              <select
                style={S.assignSelect}
                value={assignment.inputMap[name] ?? ""}
                onChange={(e) => update("inputMap", name, e.target.value)}
              >
                <option value="">— select gate —</option>
                {inputGates.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label} (id:{g.id})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div>
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--accent-secondary,#00d4ff)",
              marginBottom: "0.4rem",
            }}
          >
            Outputs
          </div>
          {problem.outputs.map((name) => (
            <div key={name} style={S.assignRow}>
              <span style={S.assignLabel}>{name}</span>
              <select
                style={S.assignSelect}
                value={assignment.outputMap[name] ?? ""}
                onChange={(e) => update("outputMap", name, e.target.value)}
              >
                <option value="">— select gate —</option>
                {outputGates.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label} (id:{g.id})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div
          style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}
        >
          <button
            onClick={() => setAssignment({ inputMap: {}, outputMap: {} })}
            style={{
              background: "none",
              border: "1px dashed var(--border-color,#2a3550)",
              color: "var(--secondary-text,#8899aa)",
              borderRadius: 6,
              padding: "0.35rem 0.8rem",
              cursor: "pointer",
              fontSize: "0.8rem",
            }}
          >
            Reset to Positional
          </button>
          <button
            onClick={onClose}
            style={{
              background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
              border: "none",
              color: "#fff",
              borderRadius: 6,
              padding: "0.35rem 0.9rem",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: 700,
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main CircuitModal ────────────────────────────────────────────────────────
const CircuitModal = ({ open, onClose, problem }) => {
  const [gates, setGates] = useState([]);
  const [wires, setWires] = useState([]);
  const [result, setResult] = useState(null); // { pass, rows, error }
  const [showAssign, setShowAssign] = useState(false);
  // assignment: null → use positional, else { inputMap, outputMap }
  const [assignment, setAssignment] = useState({ inputMap: {}, outputMap: {} });
  const isAssigned =
    Object.keys(assignment.inputMap).length > 0 ||
    Object.keys(assignment.outputMap).length > 0;

  const handleCircuitChange = useCallback((g, w) => {
    setGates(g);
    setWires(w);
    setResult(null); // clear result when circuit changes
  }, []);

  const handleSubmit = () => {
    const useAssignment = isAssigned ? assignment : null;
    const res = validateCircuit(gates, wires, problem, useAssignment);
    setResult(res);
  };

  if (!open || !problem) return null;

  const inputGates = gates.filter((g) => g.type === "INPUT");
  const outputGates = gates.filter((g) => g.type === "OUTPUT");
  const needInputs = problem.inputs.length;
  const needOutputs = problem.outputs.length;
  const hasRight =
    inputGates.length === needInputs && outputGates.length === needOutputs;

  return (
    <div style={S.overlay}>
      {/* ── Top bar ── */}
      <div style={S.topBar}>
        {/* Problem title */}
        <span
          style={{
            fontWeight: 800,
            color: "var(--text-color,#e8f0ff)",
            fontSize: "0.95rem",
            whiteSpace: "nowrap",
          }}
        >
          #{problem.id} {problem.title}
        </span>

        {/* I/O requirement pills */}
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

          {/* Live count feedback */}
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

        {/* Map gates button */}
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
          title="Manually assign which circuit gate maps to which problem port. Use this if auto (positional) matching gives wrong results."
          onClick={() => setShowAssign(true)}
        >
          🔀 Map Gates {isAssigned ? "(custom)" : "(auto)"}
        </button>

        {/* Submit */}
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

        {/* Close */}
        <button style={S.closeBtn} onClick={onClose}>
          ✕ Close
        </button>
      </div>

      {/* ── Body ── */}
      <div style={S.body}>
        {/* Boolforge canvas */}
        <div style={S.canvas}>
          <Boolforge onCircuitChange={handleCircuitChange} />
        </div>

        {/* Result panel */}
        {result && (
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
                // Build columns: all input keys + for each output: expected + got
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

            {/* Positional mapping note */}
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

      {/* Assignment modal */}
      {showAssign && (
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
