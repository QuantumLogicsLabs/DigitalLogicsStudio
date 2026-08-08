import React, { useState, useMemo } from "react";
import BALayout from "./BALayout";
import ControlPanel from "../../shared/components/ControlPanel";
import ControlGroup from "../../shared/components/ControlGroup";
import CircuitModal from "../../shared/components/CircuitModal";
import { generateTruthTable } from "../../shared/utils/boolMath";

const listMaxterms = (variables, expression) => {
  const tt = generateTruthTable(variables, expression);
  const res = [];
  tt.rows.forEach((row, i) => {
    if (row[row.length - 1] === 0) res.push(i);
  });
  return res;
};

const MaxtermsPage = () => {
  const variables = useMemo(() => ["A", "B", "C"], []);
  const [expr, setExpr] = useState("F = AB' + C");
  const [open, setOpen] = useState(false);
  const tt = useMemo(
    () => generateTruthTable(variables, expr),
    [variables, expr],
  );
  const maxs = useMemo(() => listMaxterms(variables, expr), [variables, expr]);

  return (
    <BALayout
      title="Maxterms"
      subtitle="Where the function outputs 0"
      intro="Maxterms are the complementary concept to minterms. They represent specific input combinations where a Boolean function outputs 0. Each maxterm corresponds to exactly one row in the truth table where the function is false."
    >
      <section className="ba-section">
        <div className="ba-section-header">
          <h2 className="ba-section-title">Understanding Maxterms</h2>
        </div>
        <div className="info-card">
          <h4>Maxterm Properties:</h4>
          <ul>
            <li>
              <strong>Unique Representation:</strong> Each maxterm corresponds
              to one unique input combination
            </li>
            <li>
              <strong>Complete Coverage:</strong> Every variable appears exactly
              once (true or complemented)
            </li>
            <li>
              <strong>Sum Terms:</strong> Maxterms are always OR operations
            </li>
            <li>
              <strong>Index Notation:</strong> Represented by decimal equivalent
              of binary input
            </li>
          </ul>
        </div>
        <div className="example-box">
          <h4>Maxterm Examples (3 variables A, B, C):</h4>
          <ul>
            <li>
              <strong>M₀:</strong> A + B + C (000₂ = 0₁₀)
            </li>
            <li>
              <strong>M₁:</strong> A + B + C' (001₂ = 1₁₀)
            </li>
            <li>
              <strong>M₂:</strong> A + B' + C (010₂ = 2₁₀)
            </li>
            <li>
              <strong>M₇:</strong> A' + B' + C' (111₂ = 7₁₀)
            </li>
          </ul>
        </div>
        <div className="key-insight">
          <h4>Why Maxterms Matter:</h4>
          <p>
            Maxterms provide the foundation for Product of Sums (POS)
            representation. The product of all maxterms where F=0 creates the
            canonical POS form, essential for certain optimization techniques
            and circuit implementations.
          </p>
        </div>
      </section>

      <section className="ba-section">
        <div className="ba-section-header">
          <h2 className="ba-section-title">Interactive Maxterm Finder</h2>
        </div>
        <ControlPanel>
          <ControlGroup label="Expression (SOP)">
            <input
              type="text"
              className="control-input"
              value={expr}
              onChange={(e) => setExpr(e.target.value)}
            />
          </ControlGroup>
        </ControlPanel>

        <div style={{ marginTop: "1rem" }}>
          <p className="explanation-intro">
            Current maxterm indexes:{" "}
            <span className="highlight">{maxs.join(", ") || "—"}</span>
          </p>
          <div className="info-card">
            <h4>From Maxterms to Expression:</h4>
            <p>If maxterms are [0, 2, 5], the canonical POS is:</p>
            <p>F = M₀ • M₂ • M₅ = (A + B + C) • (A + B' + C) • (A' + B + C')</p>
          </div>
        </div>

        <div className="interactive-example" style={{ marginTop: "1rem" }}>
          <h4>Try These Expressions:</h4>
          <div className="example-buttons">
            <button
              className="kmap-btn kmap-btn-secondary"
              onClick={() => setExpr("F = A • B")}
            >
              A • B
            </button>
            <button
              className="kmap-btn kmap-btn-secondary"
              onClick={() => setExpr("F = (A + C)(B + C)")}
            >
              (A + C)(B + C)
            </button>
            <button
              className="kmap-btn kmap-btn-secondary"
              onClick={() => setExpr("F = A' + B")}
            >
              A' + B
            </button>
            <button
              className="kmap-btn kmap-btn-secondary"
              onClick={() => setExpr("F = A ⊙ B")}
            >
              A ⊙ B (XNOR)
            </button>
          </div>
        </div>

        <div className="example-box" style={{ marginTop: "1rem" }}>
          <h4>Practice Problem:</h4>
          <p>What are the maxterms for F = A • (B + C)?</p>
          <details>
            <summary>Show Solution</summary>
            <p>
              <strong>Maxterms:</strong> [0, 1, 2, 3, 4]
            </p>
            <p>
              <strong>Canonical POS:</strong> F = ΠM(0,1,2,3,4)
            </p>
          </details>
        </div>
      </section>

      <section className="ba-section">
        <div className="ba-section-header">
          <h2 className="ba-section-title">Truth Table</h2>
        </div>
        <div className="binary-table-container">
          <table className="binary-table">
            <thead className="binary-table-header">
              <tr>
                {tt.headers.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tt.rows.map((row, i) => (
                <tr key={i} className="binary-table-row">
                  {row.map((c, j) => (
                    <td
                      key={j}
                      className={`binary-table-cell ${j === tt.headers.length - 1 && c === 0 ? "binary-table-cell-secondary" : ""}`}
                    >
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="ba-section">
        <div className="ba-section-header">
          <h2 className="ba-section-title">Maxterm Applications</h2>
        </div>
        <div className="comparison-grid">
          <div className="info-card">
            <h5>Design Applications</h5>
            <ul>
              <li>NOR-based implementations</li>
              <li>Error detection circuits</li>
              <li>Logic synthesis tools</li>
              <li>POS optimization</li>
            </ul>
          </div>
          <div className="info-card">
            <h5>Optimization Uses</h5>
            <ul>
              <li>POS form minimization</li>
              <li>Dual optimization</li>
              <li>Complement analysis</li>
              <li>Circuit simplification</li>
            </ul>
          </div>
        </div>
        <div className="key-insight">
          <h4>Efficiency Consideration:</h4>
          <p>
            For functions with few 0's and many 1's, using maxterms (POS form)
            is more efficient. For the opposite case, minterms (SOP form) may be
            better.
          </p>
        </div>
        <div className="kmap-card" style={{ marginTop: "1rem" }}>
          <button
            className="kmap-btn kmap-btn-primary kmap-btn-full"
            onClick={() => setOpen(true)}
          >
            🔌 Visualize Circuit
          </button>
        </div>
      </section>

      <CircuitModal
        open={open}
        onClose={() => setOpen(false)}
        expression={expr}
        variables={variables}
      />
    </BALayout>
  );
};

export default MaxtermsPage;
