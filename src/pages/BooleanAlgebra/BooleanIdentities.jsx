import React, { useState } from "react";
import ToolLayout from "../../components/ToolLayout";
import ExplanationBlock from "../../components/ExplanationBlock";
import CircuitModal from "../../components/CircuitModal";

const BooleanIdentities = () => {
  const [open, setOpen] = useState(false);
  const [modalExpr, setModalExpr] = useState("");
  const [modalVars, setModalVars] = useState([]);

  const openModal = (expr, vars) => {
    setModalExpr(expr);
    setModalVars(vars);
    setOpen(true);
  };

  const identities = [
    {
      name: "Idempotent",
      add: "A + A = A",
      mul: "A • A = A",
      explanation: "Repeating the same input does not change the outcome.",
      vars: ["A"],
    },
    {
      name: "Identity Elements",
      add: "A + 0 = A",
      mul: "A • 1 = A",
      explanation: "0 is the identity for OR; 1 is the identity for AND.",
      vars: ["A"],
    },
    {
      name: "Domination",
      add: "A + 1 = 1",
      mul: "A • 0 = 0",
      explanation: "1 dominates OR; 0 dominates AND.",
      vars: ["A"],
    },
    {
      name: "Complementarity",
      add: "A + A' = 1",
      mul: "A • A' = 0",
      explanation:
        "A and its complement cover all cases for OR and exclude all cases for AND.",
      vars: ["A"],
    },
    {
      name: "Commutative",
      add: "A + B = B + A",
      mul: "A • B = B • A",
      explanation: "Order of operands does not affect the result.",
      vars: ["A", "B"],
    },
    {
      name: "Associative",
      add: "A + (B + C) = (A + B) + C",
      mul: "A • (B • C) = (A • B) • C",
      explanation: "Grouping of operands does not affect the result.",
      vars: ["A", "B", "C"],
    },
    {
      name: "Distributive",
      add: "A + (B • C) = (A + B) • (A + C)",
      mul: "A • (B + C) = A•B + A•C",
      explanation: "OR distributes over AND and vice versa.",
      vars: ["A", "B", "C"],
    },
    {
      name: "Absorption",
      add: "A + A•B = A",
      mul: "A • (A + B) = A",
      explanation: "A absorbs redundant combinations with A.",
      vars: ["A", "B"],
    },
    {
      name: "De Morgan",
      add: "(A + B)' = A' • B'",
      mul: "(A • B)' = A' + B'",
      explanation:
        "Complement of a sum equals product of complements, and vice versa.",
      vars: ["A", "B"],
    },
  ];

  const getLHS = (law) => law.split("=")[0].trim();
  const toExpr = (lhs) => `F = ${lhs}`;

  const expandProductOfSum = (lhs) => {
    // Handles patterns like A•(B+C+...), including complements
    const m = lhs.match(/^([A-Z](?:'))?•\((.+)\)$/);
    if (!m) return lhs;
    const outside = m[1] || "";
    const inside = m[2];
    const parts = inside
      .split("+")
      .map((p) => p.trim())
      .filter(Boolean);
    const outsideVar = outside.replace("'", "");
    const outsideLit = outsideVar ? outside : "";
    const terms = parts.map((p) => {
      const lit = p;
      if (!outsideLit) return lit;
      return outsideLit + "•" + lit;
    });
    return terms.join(" + ");
  };

  return (
    <ToolLayout
      title="Boolean Identities"
      subtitle="Explanation-first, with per-identity circuit experiments"
    >
      <ExplanationBlock title="What are Boolean Identities?">
        <p className="explanation-intro">
          Boolean identities are fundamental algebraic rules that allow you to
          simplify and manipulate Boolean expressions without changing their
          logical meaning. These identities are the foundation for optimizing
          digital circuits, reducing hardware complexity, and improving
          computational efficiency.
        </p>
        <div className="info-card">
          <h4>Why Identities Matter:</h4>
          <ul>
            <li>
              <strong>Circuit Optimization:</strong> Reduce the number of gates
              needed
            </li>
            <li>
              <strong>Power Efficiency:</strong> Fewer gates mean less power
              consumption
            </li>
            <li>
              <strong>Speed Improvement:</strong> Simplified logic reduces
              propagation delay
            </li>
            <li>
              <strong>Cost Reduction:</strong> Less silicon area required for
              implementation
            </li>
            <li>
              <strong>Reliability:</strong> Fewer components mean fewer failure
              points
            </li>
          </ul>
        </div>
        <div className="example-box">
          <h4>Real-World Impact:</h4>
          <p>
            Modern processors contain billions of logic gates. Even a 1%
            reduction in gate count through Boolean optimization can save
            millions of transistors, reduce power consumption by watts, and
            improve clock speeds by megahertz.
          </p>
        </div>
      </ExplanationBlock>

      <div className="identity-grid">
        {identities.map((id) => (
          <div key={id.name} className="identity-card">
            <h3 className="explanation-title">{id.name}</h3>
            <p className="explanation-intro">{id.explanation}</p>
            <div className="binary-table-container">
              <table className="binary-table">
                <thead className="binary-table-header">
                  <tr>
                    <th>Law (+)</th>
                    <th>Law (•)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="binary-table-cell">{id.add}</td>
                    <td className="binary-table-cell">{id.mul}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
              <div className="example-box">
                <p>
                  <strong>Example Application:</strong>
                </p>
                <p>Using {id.name} identity to simplify expressions:</p>
                <ul style={{ marginLeft: 30, marginTop: 10 }}>
                  <li>For OR: {id.add.replace("=", "→")}</li>
                  <li>For AND: {id.mul.replace("=", "→")}</li>
                </ul>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="kmap-btn kmap-btn-primary"
                  onClick={() => openModal(toExpr(getLHS(id.add)), id.vars)}
                >
                  🔌 Experiment (+)
                </button>
                <button
                  className="kmap-btn kmap-btn-secondary"
                  onClick={() =>
                    openModal(
                      toExpr(expandProductOfSum(getLHS(id.mul))),
                      id.vars,
                    )
                  }
                >
                  🔌 Experiment (.)
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CircuitModal
        open={open}
        onClose={() => setOpen(false)}
        expression={modalExpr}
        variables={modalVars}
      />
    </ToolLayout>
  );
};

export default BooleanIdentities;
