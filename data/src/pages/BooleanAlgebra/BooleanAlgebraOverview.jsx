import React, { useState, useMemo } from 'react';
import ToolLayout from '../components/ToolLayout';
import ExplanationBlock from '../components/ExplanationBlock';
import { generateTruthTable } from '../utils/boolMath';


const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const BooleanAlgebraOverview = () => {
  const [vars, setVars] = useState(['A', 'B']);

  const combinations = Math.pow(2, vars.length);
  const tt = useMemo(() => generateTruthTable(vars), [vars]);



  return (
    <ToolLayout title="Boolean Algebra" subtitle="Variables, literals, terms, and 2ⁿ combinations">


      <ExplanationBlock title="What is Boolean Algebra?">
        <p className="explanation-intro">
          Boolean Algebra is a mathematical system developed by George Boole in 1854 that forms the foundation of digital logic and computer science. It deals with binary variables (0 and 1) and logical operations that model how digital circuits process information.
        </p>
        <div className="info-card">
          <h4>Key Concepts:</h4>
          <ul>
            <li><strong>Binary Variables:</strong> Can only take values 0 (false) or 1 (true)</li>
            <li><strong>Logical Operations:</strong> AND (•), OR (+), NOT (')</li>
            <li><strong>Truth Tables:</strong> Show all possible input combinations and outputs</li>
            <li><strong>Boolean Expressions:</strong> Mathematical representations of logic functions</li>
          </ul>
        </div>
        <div className="example-box">
          <h4>Real-World Applications:</h4>
          <p>Boolean algebra is used in:</p>
          <ul>
            <li>Digital circuit design (CPU, memory, processors)</li>
            <li>Search engine algorithms and database queries</li>
            <li>Programming conditions and control flow</li>
            <li>Artificial intelligence and machine learning</li>
            <li>Cryptographic systems</li>
          </ul>
        </div>
      </ExplanationBlock>

      <ExplanationBlock title="Variables & Combinations (2ⁿ)">
        <p className="explanation-intro">
          Variables: <span className="highlight">{vars.join(', ')}</span> • Combinations: <span className="highlight">{combinations}</span>
        </p>
        <div className="info-card">
          <h4>Understanding 2ⁿ Combinations:</h4>
          <p>For n variables, each variable can be either 0 or 1, giving us 2 choices per variable. Since choices are independent, we multiply: 2 × 2 × ... × 2 (n times) = 2ⁿ.</p>
          <div className="example-box">
            <p><strong>Examples:</strong></p>
            <ul>
              <li>1 variable: 2¹ = 2 combinations (0, 1)</li>
              <li>2 variables: 2² = 4 combinations (00, 01, 10, 11)</li>
              <li>3 variables: 2³ = 8 combinations (000 to 111)</li>
              <li>4 variables: 2⁴ = 16 combinations</li>
            </ul>
          </div>
        </div>
        <div className="var-row" style={{ marginBottom: 12, display: 'flex', gap: 12 }}>
          <button className="btn" type="button" onClick={() => {
            const next = letters[vars.length] || `V${vars.length + 1}`;
            setVars([...vars, next]);
          }}>Add Variable</button>
          <button className="btn" type="button" onClick={() => {
            if (vars.length > 1) setVars(vars.slice(0, -1));
          }}>Remove Variable</button>
        </div>
        <div className="binary-table-container">
          <table className="binary-table">
            <thead className="binary-table-header">
              <tr>
                {tt.headers.map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {tt.rows.map((row, i) => (
                <tr key={i} className="binary-table-row">
                  {row.map((cell, j) => (
                    <td key={j} className="binary-table-cell">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ExplanationBlock>

      <ExplanationBlock title="Literals, Terms, Standard Forms">
        <div className="info-card">
          <h4>Fundamental Building Blocks:</h4>
          <ul>
            <li><strong>Literal:</strong> A variable in its true or complemented form (A or A')</li>
            <li><strong>Product Term:</strong> AND operation on literals (e.g., AB'C)</li>
            <li><strong>Sum Term:</strong> OR operation on literals (e.g., A + B')</li>
            <li><strong>Minterm:</strong> Product term where each variable appears exactly once</li>
            <li><strong>Maxterm:</strong> Sum term where each variable appears exactly once</li>
          </ul>
        </div>
        <div className="example-box">
          <h4>Standard Forms:</h4>
          <ul>
            <li><strong>SOP (Sum of Products):</strong> OR of product terms</li>
            <li>Example: F = AB' + AC + BC'</li>
            <li><strong>POS (Product of Sums):</strong> AND of sum terms</li>
            <li>Example: F = (A + B')(A + C)(B + C')</li>
          </ul>
          <p className="note">Both forms represent the same logic function but are used in different contexts.</p>
        </div>
        <div className="interactive-example">
          <h4>Try It Yourself:</h4>
          <p>Can you identify the literals and terms in: F = A'BC + AB' + C?</p>
          <details>
            <summary>Show Answer</summary>
            <p><strong>Literals:</strong> A', B, C, A, B', C</p>
            <p><strong>Product terms:</strong> A'BC, AB', C</p>
            <p><strong>Form:</strong> Sum of Products (SOP)</p>
          </details>
        </div>
      </ExplanationBlock>

      <ExplanationBlock title="Logic Gates - The Physical Implementation">
        <div className="info-card">
          <h4>Basic Logic Gates:</h4>
          <p>Logic gates are electronic circuits that implement Boolean operations. They're the building blocks of all digital systems.</p>
        </div>
        <div className="gates-grid">
          <div className="gate-card">
            <h5>NOT Gate (Inverter)</h5>
            <p><strong>Function:</strong> Outputs the complement of input</p>
            <p><strong>Expression:</strong> F = A'</p>
            <p><strong>Truth Table:</strong> A=0→F=1, A=1→F=0</p>
            <p><strong>Symbol:</strong> Triangle with circle</p>
          </div>
          <div className="gate-card">
            <h5>AND Gate</h5>
            <p><strong>Function:</strong> Outputs 1 only if all inputs are 1</p>
            <p><strong>Expression:</strong> F = A • B</p>
            <p><strong>Truth Table:</strong> Only (1,1)→1, others→0</p>
            <p><strong>Symbol:</strong> D-shaped gate</p>
          </div>
          <div className="gate-card">
            <h5>OR Gate</h5>
            <p><strong>Function:</strong> Outputs 1 if any input is 1</p>
            <p><strong>Expression:</strong> F = A + B</p>
            <p><strong>Truth Table:</strong> Only (0,0)→0, others→1</p>
            <p><strong>Symbol:</strong> Curved shield shape</p>
          </div>
          <div className="gate-card">
            <h5>NAND Gate</h5>
            <p><strong>Function:</strong> NOT of AND (universal gate)</p>
            <p><strong>Expression:</strong> F = (A • B)'</p>
            <p><strong>Truth Table:</strong> Inverse of AND</p>
            <p><strong>Importance:</strong> Can build any logic circuit</p>
          </div>
          <div className="gate-card">
            <h5>NOR Gate</h5>
            <p><strong>Function:</strong> NOT of OR (universal gate)</p>
            <p><strong>Expression:</strong> F = (A + B)'</p>
            <p><strong>Truth Table:</strong> Inverse of OR</p>
            <p><strong>Importance:</strong> Can build any logic circuit</p>
          </div>
          <div className="gate-card">
            <h5>XOR Gate</h5>
            <p><strong>Function:</strong> Outputs 1 if inputs differ</p>
            <p><strong>Expression:</strong> F = A ⊕ B = AB' + A'B</p>
            <p><strong>Truth Table:</strong> (0,1)→1, (1,0)→1</p>
            <p><strong>Use:</strong> Addition, parity checking</p>
          </div>
        </div>
        <div className="example-box">
          <h4>Universal Gates:</h4>
          <p>NAND and NOR gates are called "universal" because you can construct any other logic gate using only NAND or only NOR gates. This is crucial for integrated circuit design where manufacturing consistency is important.</p>
        </div>
      </ExplanationBlock>

      <ExplanationBlock title="Minterms & Maxterms - Canonical Forms">
        <div className="info-card">
          <h4>Canonical Representations:</h4>
          <p>Minterms and maxterms provide unique, standardized ways to represent Boolean functions.</p>
        </div>
        <div className="comparison-grid">
          <div className="comparison-card">
            <h5>Minterms (Σ notation)</h5>
            <ul>
              <li>Represent input combinations where F = 1</li>
              <li>Each variable appears exactly once (true or complemented)</li>
              <li>Used in Sum of Products (SOP) form</li>
              <li>Notation: F(A,B) = Σm(0,2,3)</li>
            </ul>
            <div className="example-box">
              <p><strong>Example:</strong> For F = A + B</p>
              <p>Minterms: A'B + AB' + AB = m(1,2,3)</p>
            </div>
          </div>
          <div className="comparison-card">
            <h5>Maxterms (Π notation)</h5>
            <ul>
              <li>Represent input combinations where F = 0</li>
              <li>Each variable appears exactly once (true or complemented)</li>
              <li>Used in Product of Sums (POS) form</li>
              <li>Notation: F(A,B) = ΠM(0,1)</li>
            </ul>
            <div className="example-box">
              <p><strong>Example:</strong> For F = A + B</p>
              <p>Maxterms: (A + B) = M(0)</p>
            </div>
          </div>
        </div>
        <div className="key-insight">
          <h4>Key Relationship:</h4>
          <p>The set of minterms and maxterms are complementary - every input combination is either a minterm or a maxterm, never both. For n variables, there are 2ⁿ total combinations, split between minterms and maxterms.</p>
        </div>
        <div className="interactive-example">
          <h4>Practice Problem:</h4>
          <p>For F = A'B + AB', identify the minterms and maxterms:</p>
          <details>
            <summary>Show Solution</summary>
            <p><strong>Truth Table:</strong></p>
            <table className="mini-table">
              <tr><th>A</th><th>B</th><th>F</th></tr>
              <tr><td>0</td><td>0</td><td>0</td></tr>
              <tr><td>0</td><td>1</td><td>1</td></tr>
              <tr><td>1</td><td>0</td><td>1</td></tr>
              <tr><td>1</td><td>1</td><td>0</td></tr>
            </table>
            <p><strong>Minterms:</strong> m(1,2) where F=1</p>
            <p><strong>Maxterms:</strong> M(0,3) where F=0</p>
          </details>
        </div>
      </ExplanationBlock>


    </ToolLayout>
  );
};

export default BooleanAlgebraOverview;
