import React, { useState, useMemo } from "react";
import BALayout from "./BALayout";
import ControlPanel from "../../shared/components/ControlPanel";
import ControlGroup from "../../shared/components/ControlGroup";
import CircuitModal from "../../shared/components/CircuitModal";
import { generateTruthTable } from "../../shared/utils/boolMath";

const appliesConsensus = (expr) => {
  const e = expr.replace(/^F\s*=\s*/, "").trim();
  return /[A-Z][^+]*[A-Z]'\s*\+\s*[A-Z]'\s*[A-Z][^+]*\s*\+\s*[A-Z][^+]*[A-Z]/i.test(
    e,
  );
};

const ConsensusTheorem = () => {
  const [expr, setExpr] = useState("F = XY + X'Z + YZ");
  const vars = useMemo(() => ["X", "Y", "Z"], []);
  const [open, setOpen] = useState(false);
  const tt = useMemo(() => generateTruthTable(vars, expr), [vars, expr]);

  return (
    <BALayout
      title="Consensus Theorem"
      subtitle="XY + X'Z + YZ = XY + X'Z"
      intro="The Consensus Theorem is a powerful Boolean algebra identity that allows elimination of redundant terms. In an expression of the form XY + X'Z + YZ, the consensus term YZ is redundant and can be removed without changing the function's behavior."
    >
      <section className="ba-section">
        <div className="ba-section-header">
          <h2 className="ba-section-title">
            Understanding the Consensus Theorem
          </h2>
        </div>
        <div className="info-card">
          <h4>The Theorem:</h4>
          <p>
            <strong>XY + X'Z + YZ = XY + X'Z</strong>
          </p>
          <p>Where YZ is the "consensus term" that can be eliminated.</p>
        </div>
        <div className="example-box">
          <h4>Why It Works:</h4>
          <p>The consensus term YZ is covered by the other two terms:</p>
          <ul>
            <li>When X=1: XY covers all cases where Y=1 (including YZ)</li>
            <li>When X=0: X'Z covers all cases where Z=1 (including YZ)</li>
            <li>Therefore, YZ is always covered by either XY or X'Z</li>
          </ul>
        </div>
        <div className="key-insight">
          <h4>Practical Impact:</h4>
          <p>
            This theorem is extremely valuable for circuit optimization.
            Removing the consensus term reduces gate count, power consumption,
            and propagation delay while maintaining identical functionality.
          </p>
        </div>
      </section>

      <section className="ba-section">
        <div className="ba-section-header">
          <h2 className="ba-section-title">Interactive Consensus Checker</h2>
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
            Applies:{" "}
            <span className="highlight">
              {appliesConsensus(expr) ? "Yes" : "No"}
            </span>
          </p>
          <div className="info-card">
            <h4>Pattern Recognition:</h4>
            <p>The consensus theorem applies when you have:</p>
            <ul>
              <li>
                Two terms where a variable appears in true form in one term and
                complemented in another
              </li>
              <li>
                A third term that contains all the literals from both terms
                except the complementary variable
              </li>
            </ul>
            <p>
              <strong>Example Pattern:</strong> XY + X'Z + YZ
            </p>
          </div>
        </div>

        <div className="example-box" style={{ marginTop: "1rem" }}>
          <h4>Example: F = AB + A'C + BC</h4>
          <p>
            <strong>Step 1:</strong> Identify: AB (X=A, Y=B), A'C (X'=A', Z=C),
            BC (consensus)
          </p>
          <p>
            <strong>Step 2:</strong> Apply: F = AB + A'C (BC term eliminated)
          </p>
          <p>
            <strong>Result:</strong> 33% reduction in terms and literals!
          </p>
        </div>

        <div className="interactive-example" style={{ marginTop: "1rem" }}>
          <h4>Try These Examples:</h4>
          <div className="example-buttons">
            <button
              className="kmap-btn kmap-btn-secondary"
              onClick={() => setExpr("F = AB + A'C + BC")}
            >
              AB + A'C + BC
            </button>
            <button
              className="kmap-btn kmap-btn-secondary"
              onClick={() => setExpr("F = XY + X'Z + YZ")}
            >
              XY + X'Z + YZ
            </button>
            <button
              className="kmap-btn kmap-btn-secondary"
              onClick={() => setExpr("F = A'B + AC + BC")}
            >
              A'B + AC + BC
            </button>
          </div>
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
                    <td key={j} className="binary-table-cell">
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
          <h2 className="ba-section-title">Advanced Applications</h2>
        </div>
        <div className="info-card">
          <h4>Multiple Consensus Terms:</h4>
          <p>
            Complex expressions may have multiple consensus terms that can be
            eliminated sequentially.
          </p>
          <p>
            <strong>Example:</strong> F = AB + A'C + BC + B'D + AD
          </p>
          <ul>
            <li>First consensus: AB + A'C + BC → AB + A'C</li>
            <li>Second consensus: B'D + AD + AB → B'D + AD</li>
            <li>Final: F = AB + A'C + B'D + AD</li>
          </ul>
        </div>
        <div className="key-insight">
          <h4>Integration with Karnaugh Maps:</h4>
          <p>
            The consensus theorem corresponds to eliminating redundant groups in
            Karnaugh maps. When a group of 1's is completely covered by other
            groups, it can be removed without affecting the function.
          </p>
        </div>
        <div className="kmap-card" style={{ marginTop: "1rem" }}>
          <button
            className="kmap-btn kmap-btn-primary kmap-btn-full"
            onClick={() => setOpen(true)}
          >
            🔌 Show simplified vs unsimplified circuit
          </button>
        </div>
      </section>

      <CircuitModal
        open={open}
        onClose={() => setOpen(false)}
        expression={expr}
        variables={vars}
      />
    </BALayout>
  );
};

export default ConsensusTheorem;
