import React, { useState, useMemo } from 'react';
import ToolLayout from '../components/ToolLayout';
import ExplanationBlock from '../components/ExplanationBlock';
import ControlPanel from '../components/ControlPanel';
import ControlGroup from '../components/ControlGroup';
import CircuitModal from '../components/CircuitModal';
import { generateTruthTable } from '../utils/boolMath';

const listMinterms = (variables, expression) => {
  const tt = generateTruthTable(variables, expression);
  const res = [];
  tt.rows.forEach((row, i) => {
    if (row[row.length - 1] === 1) res.push(i);
  });
  return res;
};

const MintermsPage = () => {
  const variables = useMemo(() => ['A', 'B', 'C'], []);
  const [expr, setExpr] = useState("F = AB' + C");
  const [open, setOpen] = useState(false);
  const tt = useMemo(() => generateTruthTable(variables, expr), [variables, expr]);
  const mins = useMemo(() => listMinterms(variables, expr), [variables, expr]);

  return (
    <ToolLayout title="Minterms" subtitle="Where the function outputs 1">
      <ExplanationBlock title="Understanding Minterms">
        <p className="explanation-intro">
          Minterms are fundamental building blocks in Boolean algebra that represent specific input combinations where a Boolean function outputs 1. Each minterm corresponds to exactly one row in the truth table where the function is true.
        </p>
        <div className="info-card">
          <h4>Minterm Properties:</h4>
          <ul>
            <li><strong>Unique Representation:</strong> Each minterm corresponds to one unique input combination</li>
            <li><strong>Complete Coverage:</strong> Every variable appears exactly once (true or complemented)</li>
            <li><strong>Product Terms:</strong> Minterms are always AND operations</li>
            <li><strong>Index Notation:</strong> Represented by decimal equivalent of binary input</li>
          </ul>
        </div>
        <div className="example-box">
          <h4>Minterm Examples (3 variables A, B, C):</h4>
          <ul>
            <li><strong>m₀:</strong> A'B'C' (000₂ = 0₁₀)</li>
            <li><strong>m₁:</strong> A'B'C (001₂ = 1₁₀)</li>
            <li><strong>m₂:</strong> A'BC' (010₂ = 2₁₀)</li>
            <li><strong>m₇:</strong> ABC (111₂ = 7₁₀)</li>
          </ul>
        </div>
        <div className="key-insight">
          <h4>Why Minterms Matter:</h4>
          <p>Minterms provide a systematic way to represent any Boolean function. The sum of all minterms where F=1 creates the canonical SOP form, which is the starting point for optimization techniques like Karnaugh maps.</p>
        </div>
      </ExplanationBlock>
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

      <ExplanationBlock title="Minterm Analysis">
        <p className="explanation-intro">Current minterm indexes: <span className="highlight">{mins.join(', ') || '—'}</span></p>
        <div className="info-card">
          <h4>What These Indexes Mean:</h4>
          <p>Each number represents a truth table row where the function outputs 1:</p>
          <ul>
            <li>Index 0 = Input combination 000 (A'=0, B'=0, C'=0)</li>
            <li>Index 3 = Input combination 011 (A'=0, B=1, C=1)</li>
            <li>Index 7 = Input combination 111 (A=1, B=1, C=1)</li>
          </ul>
        </div>
        <div className="example-box">
          <h4>From Minterms to Expression:</h4>
          <p>If minterms are [1, 3, 7], the canonical SOP is:</p>
          <p>F = m₁ + m₃ + m₇ = A'B'C + A'BC + ABC</p>
          <p>This can often be simplified using Boolean algebra!</p>
        </div>
      </ExplanationBlock>

      <ExplanationBlock title="Interactive Examples">
        <div className="interactive-example">
          <h4>Try These Expressions:</h4>
          <div className="example-buttons">
            <button className="kmap-btn kmap-btn-secondary" onClick={() => setExpr("F = A + B")}>
              A + B
            </button>
            <button className="kmap-btn kmap-btn-secondary" onClick={() => setExpr("F = AB + C")}>
              AB + C
            </button>
            <button className="kmap-btn kmap-btn-secondary" onClick={() => setExpr("F = A'B + AC")}>
              A'B + AC
            </button>
            <button className="kmap-btn kmap-btn-secondary" onClick={() => setExpr("F = A ⊕ B")}>
              A ⊕ B
            </button>
          </div>
        </div>
        <div className="example-box">
          <h4>Practice Problem:</h4>
          <p>What are the minterms for F = A + BC?</p>
          <details>
            <summary>Show Solution</summary>
            <p><strong>Truth Table Analysis:</strong></p>
            <p>F = 1 when: A=1 (any B,C) OR (A=0 AND B=1 AND C=1)</p>
            <p><strong>Minterms:</strong> [1, 2, 3, 4, 5, 6, 7]</p>
            <p><strong>Canonical SOP:</strong> F = Σm(1,2,3,4,5,6,7)</p>
          </details>
        </div>
      </ExplanationBlock>

      <div className="binary-table-container">
        <table className="binary-table">
          <thead className="binary-table-header">
            <tr>{tt.headers.map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {tt.rows.map((row, i) => (
              <tr key={i} className="binary-table-row">
                {row.map((c, j) => <td key={j} className={`binary-table-cell ${j === tt.headers.length - 1 && c === 1 ? 'binary-table-cell-primary' : ''}`}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ExplanationBlock title="Minterm Applications">
        <div className="comparison-grid">
          <div className="comparison-card">
            <h5>Design Applications</h5>
            <ul>
              <li>PLA/PAL programming</li>
              <li>ROM memory addressing</li>
              <li>Logic synthesis</li>
              <li>Truth table to circuit conversion</li>
            </ul>
          </div>
          <div className="comparison-card">
            <h5>Optimization Uses</h5>
            <ul>
              <li>Karnaugh map grouping</li>
              <li>Quine-McCluskey algorithm</li>
              <li>Espresso heuristic</li>
              <li>Automated minimization</li>
            </ul>
          </div>
        </div>
        <div className="key-insight">
          <h4>Efficiency Consideration:</h4>
          <p>For functions with few 1's and many 0's, using minterms (SOP form) is more efficient. For the opposite case, maxterms (POS form) may be better.</p>
        </div>
      </ExplanationBlock>

      <div className="kmap-card">
        <button className="kmap-btn kmap-btn-primary kmap-btn-full" onClick={() => setOpen(true)}>
          🔌 Visualize Circuit
        </button>
      </div>

      <CircuitModal open={open} onClose={() => setOpen(false)} expression={expr} variables={variables} />
    </ToolLayout>
  );
};

export default MintermsPage;
