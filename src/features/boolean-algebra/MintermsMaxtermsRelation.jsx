import React, { useState, useMemo } from "react";
import BALayout from "./BALayout";
import CircuitModal from "../../shared/components/CircuitModal";
import { generateTruthTable } from "../../shared/utils/boolMath";

const MintermsMaxtermsRelation = () => {
  const variables = useMemo(() => ["A", "B", "C"], []);
  const [expr, setExpr] = useState("F = AB' + C");
  const [open, setOpen] = useState(false);
  const tt = useMemo(
    () => generateTruthTable(variables, expr),
    [variables, expr],
  );

  const mins = tt.rows
    .map((row, i) => (row[row.length - 1] === 1 ? i : null))
    .filter((x) => x !== null);
  const maxs = tt.rows
    .map((row, i) => (row[row.length - 1] === 0 ? i : null))
    .filter((x) => x !== null);

  return (
    <BALayout
      title="Minterms & Maxterms"
      subtitle="Mapping 1s and 0s across forms"
      intro="Minterms and maxterms are dual concepts that provide complete coverage of all possible input combinations. Every combination is either a minterm (F=1) or a maxterm (F=0), never both."
    >
      <section className="ba-section">
        <div className="ba-section-header">
          <h2 className="ba-section-title">
            Understanding Minterm-Maxterm Duality
          </h2>
        </div>
        <div className="comparison-grid">
          <div className="info-card">
            <h5>Minterms (Σ notation)</h5>
            <ul>
              <li>Represent where F = 1</li>
              <li>Used in SOP form</li>
              <li>Product terms (AND operations)</li>
              <li>Sum of minterms = F</li>
              <li>Example: F = Σm(1,3,7)</li>
            </ul>
          </div>
          <div className="info-card">
            <h5>Maxterms (Π notation)</h5>
            <ul>
              <li>Represent where F = 0</li>
              <li>Used in POS form</li>
              <li>Sum terms (OR operations)</li>
              <li>Product of maxterms = F</li>
              <li>Example: F = ΠM(0,2,4,5,6)</li>
            </ul>
          </div>
        </div>
        <div className="ba-note-card" style={{ marginTop: "1rem" }}>
          <h4>Fundamental Relationship</h4>
          <p>
            For n variables, there are 2ⁿ total combinations. If there are k
            minterms, there must be 2ⁿ-k maxterms. The sets are complementary
            and partition the entire input space.
          </p>
        </div>
      </section>

      <section className="ba-section">
        <div className="ba-section-header">
          <h2 className="ba-section-title">Interactive Analysis</h2>
          <p className="ba-section-description">
            Enter a Boolean expression to see its minterm and maxterm
            decomposition.
          </p>
        </div>
        <div className="ba-field-group">
          <label className="ba-field-label">Expression (SOP)</label>
          <input
            type="text"
            className="ba-input"
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
          />
        </div>

        <div className="ba-card" style={{ marginTop: "1rem" }}>
          <h3 className="ba-card-title">Current Function Analysis</h3>
          <div className="ba-card-content">
            <p>
              <strong>Minterms (F=1):</strong>{" "}
              <span className="highlight">{mins.join(", ") || "—"}</span>
            </p>
            <p>
              <strong>Maxterms (F=0):</strong>{" "}
              <span className="highlight">{maxs.join(", ") || "—"}</span>
            </p>
            <p>
              <strong>Total combinations:</strong> {mins.length + maxs.length}{" "}
              (should be 2³ = 8 for 3 variables)
            </p>
          </div>
        </div>

        <div className="ba-card" style={{ marginTop: "0.75rem" }}>
          <h3 className="ba-card-title">Conversion Between Forms</h3>
          <div className="ba-card-content">
            <p>
              <strong>Minterms → Maxterms:</strong> Take all numbers from 0 to
              2ⁿ-1 not in minterm list
            </p>
            <p>
              <strong>Maxterms → Minterms:</strong> Take all numbers from 0 to
              2ⁿ-1 not in maxterm list
            </p>
            <p>
              <strong>Example:</strong> If minterms = [1,3,7], then maxterms =
              [0,2,4,5,6]
            </p>
          </div>
        </div>

        <div className="ba-note-card" style={{ marginTop: "0.75rem" }}>
          <h4>Form Selection Strategy</h4>
          <p>
            Choose the form with fewer terms for more efficient implementation.
            If minterms count is less, use SOP form. If maxterms count is less,
            use POS form.
          </p>
        </div>
      </section>

      <section className="ba-section">
        <div className="ba-section-header">
          <h2 className="ba-section-title">Interactive Examples</h2>
        </div>
        <div className="ba-actions">
          <button
            className="kmap-btn kmap-btn-secondary"
            onClick={() => setExpr("F = A + B")}
          >
            A + B
          </button>
          <button
            className="kmap-btn kmap-btn-secondary"
            onClick={() => setExpr("F = AB + C")}
          >
            AB + C
          </button>
          <button
            className="kmap-btn kmap-btn-secondary"
            onClick={() => setExpr("F = A ⊕ B")}
          >
            A ⊕ B
          </button>
          <button
            className="kmap-btn kmap-btn-secondary"
            onClick={() => setExpr("F = A • B + C'")}
          >
            A • B + C'
          </button>
        </div>

        <div className="ba-card" style={{ marginTop: "1rem" }}>
          <h3 className="ba-card-title">Practice Problem</h3>
          <div className="ba-card-content">
            <p>
              For F = A + BC, identify minterms and maxterms. Which form is more
              efficient?
            </p>
            <details style={{ marginTop: "0.75rem" }}>
              <summary style={{ cursor: "pointer", color: "var(--ba-accent)" }}>
                Show Solution
              </summary>
              <p style={{ marginTop: "0.5rem" }}>
                <strong>Analysis:</strong> F = 1 when: A=1 (any B,C) OR (A=0 AND
                B=1 AND C=1)
              </p>
              <p>
                <strong>Minterms:</strong> [1,2,3,4,5,6,7] (7 terms)
              </p>
              <p>
                <strong>Maxterms:</strong> [0] (1 term)
              </p>
              <p>
                <strong>Conclusion:</strong> POS form is much more efficient: F
                = (A + B + C)
              </p>
            </details>
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
          <h2 className="ba-section-title">Practical Applications</h2>
        </div>
        <div className="comparison-grid">
          <div className="info-card">
            <h5>When to Use Minterms</h5>
            <ul>
              <li>Fewer 1s than 0s</li>
              <li>AND-OR implementation</li>
              <li>PLA programming</li>
              <li>K-map simplification</li>
            </ul>
          </div>
          <div className="info-card">
            <h5>When to Use Maxterms</h5>
            <ul>
              <li>Fewer 0s than 1s</li>
              <li>OR-AND implementation</li>
              <li>NOR-based design</li>
              <li>POS optimization</li>
            </ul>
          </div>
        </div>
        <div className="ba-note-card" style={{ marginTop: "0.75rem" }}>
          <h4>Design Trade-offs</h4>
          <p>
            The choice between minterms and maxterms affects circuit complexity,
            gate count, and implementation technology. Smart form selection can
            significantly reduce hardware requirements.
          </p>
        </div>
        <div className="kmap-card" style={{ marginTop: "1rem" }}>
          <button
            className="kmap-btn kmap-btn-primary kmap-btn-full"
            onClick={() => setOpen(true)}
          >
            🔌 Visualize SOP vs POS circuit
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

export default MintermsMaxtermsRelation;
