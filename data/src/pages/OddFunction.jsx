import React, { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import ExplanationBlock from '../components/ExplanationBlock';
import InteractiveDemo from '../components/InteractiveDemo';
import CircuitModal from '../components/CircuitModal';

const OddFunction = () => {
  const [open, setOpen] = useState(false);
  const [inputValues, setInputValues] = useState({
    A: false,
    B: false,
    C: false
  });

  const inputs = [
    { name: 'A', label: 'Input A' },
    { name: 'B', label: 'Input B' },
    { name: 'C', label: 'Input C' }
  ];

  // Calculate XOR output for 3 variables
  const calculateXOR3 = (inputs) => {
    const values = Object.values(inputs);
    // XOR of 3 variables: (A ⊕ B) ⊕ C
    return values[0] !== values[1] !== values[2];
  };

  // Calculate parity (odd number of 1s)
  const calculateParity = (inputs) => {
    const values = Object.values(inputs);
    const ones = values.filter(v => v).length;
    return ones % 2 === 1;
  };

  const xorOutput = calculateXOR3(inputValues);
  const parityOutput = calculateParity(inputValues);

  const handleInputChange = (newInputs) => {
    setInputValues(newInputs);
  };

  // Truth table for 3-variable XOR
  const truthTableData = [
    { inputs: { A: false, B: false, C: false }, outputs: { 'A⊕B⊕C': false, 'Parity': false } },
    { inputs: { A: false, B: false, C: true }, outputs: { 'A⊕B⊕C': true, 'Parity': true } },
    { inputs: { A: false, B: true, C: false }, outputs: { 'A⊕B⊕C': true, 'Parity': true } },
    { inputs: { A: false, B: true, C: true }, outputs: { 'A⊕B⊕C': false, 'Parity': false } },
    { inputs: { A: true, B: false, C: false }, outputs: { 'A⊕B⊕C': true, 'Parity': true } },
    { inputs: { A: true, B: false, C: true }, outputs: { 'A⊕B⊕C': false, 'Parity': false } },
    { inputs: { A: true, B: true, C: false }, outputs: { 'A⊕B⊕C': false, 'Parity': false } },
    { inputs: { A: true, B: true, C: true }, outputs: { 'A⊕B⊕C': true, 'Parity': true } }
  ];

  return (
    <ToolLayout 
      title="Odd Function (3-Variable XOR)" 
      subtitle="Understanding XOR with three variables and parity detection"
    >
      <div className="kmap-card" style={{ marginBottom: '1rem' }}>
        <button
          className="kmap-btn kmap-btn-primary kmap-btn-full"
          onClick={() => setOpen(true)}
        >
          🔌 Experiment with Circuit
        </button>
      </div>

      <ExplanationBlock 
        title="What is an Odd Function?"
        intro="An odd function outputs 1 when there's an odd number of 1s in the input. For 3 variables, this is equivalent to a 3-input XOR gate."
      >
        <div className="odd-function-intro">
          <div className="function-definition">
            <h4>Mathematical Definition</h4>
            <div className="formula">
              <p>F(A,B,C) = A ⊕ B ⊕ C</p>
              <p>F(A,B,C) = Σm(1,2,4,7) - Sum of minterms</p>
              <p>F(A,B,C) = ΠM(0,3,5,6) - Product of maxterms</p>
            </div>
          </div>

          <div className="parity-explanation">
            <h4>Parity Detection</h4>
            <p>
              The odd function acts as a parity detector. It outputs 1 when the number of 
              1s in the input is odd (1 or 3), and 0 when the number is even (0 or 2).
            </p>
            <div className="parity-examples">
              <div className="example">
                <code>101 → 2 ones → Output: 0</code>
              </div>
              <div className="example">
                <code>110 → 2 ones → Output: 0</code>
              </div>
              <div className="example">
                <code>111 → 3 ones → Output: 1</code>
              </div>
            </div>
          </div>
        </div>
      </ExplanationBlock>

      <InteractiveDemo
        title="Interactive 3-Variable XOR"
        description="Toggle inputs to see the XOR and parity outputs in real-time"
        inputs={inputs}
        outputs={[
          { name: 'A⊕B⊕C', label: 'XOR Output', value: xorOutput },
          { name: 'Parity', label: 'Parity (Odd)', value: parityOutput }
        ]}
        onInputChange={handleInputChange}
        showTruthTable={true}
        truthTableData={truthTableData}
      />

      <ExplanationBlock 
        title="Boolean Expressions"
        intro="The 3-variable XOR can be expressed in multiple forms:"
      >
        <div className="expressions-grid">
          <div className="expression-card">
            <h4>Sum of Products (SOP)</h4>
            <div className="expression-content">
              <code>F = A'B'C + A'BC' + AB'C' + ABC</code>
              <p>Direct implementation from minterms</p>
            </div>
          </div>

          <div className="expression-card">
            <h4>Product of Sums (POS)</h4>
            <div className="expression-content">
              <code>F = (A + B + C)(A + B' + C')(A' + B + C')(A' + B' + C)</code>
              <p>Implementation from maxterms</p>
            </div>
          </div>

          <div className="expression-card">
            <h4>Cascaded 2-input XORs</h4>
            <div className="expression-content">
              <code>F = (A ⊕ B) ⊕ C</code>
              <p>Using only 2-input XOR gates</p>
            </div>
          </div>

          <div className="expression-card">
            <h4>Optimized SOP</h4>
            <div className="expression-content">
              <code>F = A'⊕B⊕C (simplified)</code>
              <p>Most compact form</p>
            </div>
          </div>
        </div>
      </ExplanationBlock>

      <ExplanationBlock 
        title="Circuit Implementations"
        intro="Different ways to implement the 3-variable XOR function:"
      >
        <div className="implementations">
          <div className="implementation-card">
            <h4>🔗 Direct XOR Gate</h4>
            <p>Single 3-input XOR gate (if available)</p>
            <div className="gate-diagram">
              <div className="gate-symbol">⊕</div>
              <div className="gate-inputs">
                <span>A</span>
                <span>B</span>
                <span>C</span>
              </div>
              <div className="gate-output">
                <span>F</span>
              </div>
            </div>
          </div>

          <div className="implementation-card">
            <h4>🔗 Cascaded 2-input XORs</h4>
            <p>Two 2-input XOR gates in series</p>
            <div className="cascaded-diagram">
              <div className="gate-stage">
                <div className="gate-symbol">⊕</div>
                <div className="stage-labels">
                  <span>A</span>
                  <span>B</span>
                </div>
                <span className="intermediate">X</span>
              </div>
              <div className="gate-stage">
                <div className="gate-symbol">⊕</div>
                <div className="stage-labels">
                  <span>X</span>
                  <span>C</span>
                </div>
                <span className="output">F</span>
              </div>
            </div>
          </div>

          <div className="implementation-card">
            <h4>🔗 AND-OR Implementation</h4>
            <p>Using basic gates from SOP form</p>
            <div className="and-or-diagram">
              <div className="and-gates">
                <div className="and-group">
                  <span>A'B'C</span>
                </div>
                <div className="and-group">
                  <span>A'BC'</span>
                </div>
                <div className="and-group">
                  <span>AB'C'</span>
                </div>
                <div className="and-group">
                  <span>ABC</span>
                </div>
              </div>
              <div className="or-gate">
                <span>OR</span>
              </div>
            </div>
          </div>
        </div>
      </ExplanationBlock>

      <ExplanationBlock 
        title="Interactive Activities"
        intro="Hands-on exercises to master the odd function:"
      >
        <div className="activities">
          <div className="activity-card">
            <h4>🎯 Activity 1: Parity Detection</h4>
            <p>
              Test your understanding of parity by predicting the output before toggling inputs:
            </p>
            <div className="activity-steps">
              <ol>
                <li>Choose an input combination (e.g., 101)</li>
                <li>Count the number of 1s (2 in this case)</li>
                <li>Predict: Even count → 0, Odd count → 1</li>
                <li>Verify with the interactive demo</li>
              </ol>
            </div>
          </div>

          <div className="activity-card">
            <h4>🧮 Activity 2: Expression Simplification</h4>
            <p>
              Try simplifying the SOP expression step by step:
            </p>
            <div className="simplification-steps">
              <div className="step">
                <strong>Start:</strong> F = A'B'C + A'BC' + AB'C' + ABC
              </div>
              <div className="step">
                <strong>Step 1:</strong> Group terms: A'(B'C + BC') + A(B'C' + BC)
              </div>
              <div className="step">
                <strong>Step 2:</strong> Apply XOR identity: A'(B⊕C) + A(B⊕C)'
              </div>
              <div className="step">
                <strong>Final:</strong> F = A⊕B⊕C
              </div>
            </div>
          </div>

          <div className="activity-card">
            <h4>🔍 Activity 3: Truth Table Analysis</h4>
            <p>
              Analyze patterns in the truth table:
            </p>
            <div className="patterns">
              <div className="pattern">
                <strong>Hamming Weight:</strong> Output equals 1 when Hamming weight is odd
              </div>
              <div className="pattern">
                <strong>Complement Property:</strong> F(A,B,C) = F'(A',B',C')
              </div>
              <div className="pattern">
                <strong>Symmetry:</strong> Output is unchanged by any permutation of inputs
              </div>
            </div>
          </div>

          <div className="activity-card">
            <h4>🏗️ Activity 4: Build Your Own</h4>
            <p>
              Implement the 3-variable XOR using only:
            </p>
            <div className="build-challenges">
              <div className="challenge">
                <strong>NAND Gates:</strong> Use 4 NAND gates
              </div>
              <div className="challenge">
                <strong>NOR Gates:</strong> Use 5 NOR gates
              </div>
              <div className="challenge">
                <strong>AND-OR-NOT:</strong> Use 4 AND gates, 1 OR gate, 3 NOT gates
              </div>
            </div>
          </div>
        </div>
      </ExplanationBlock>

      <ExplanationBlock 
        title="Applications"
        intro="Where 3-variable XOR is used in real-world systems:"
      >
        <div className="applications-grid">
          <div className="application-item">
            <h4>🔒 Error Detection</h4>
            <p>
              Parity bits in data transmission use odd functions to detect 
              single-bit errors during transmission.
            </p>
          </div>

          <div className="application-item">
            <h4>🎮 Game Logic</h4>
            <p>
              Three-player game scenarios where odd number of players 
              choosing "yes" triggers an action.
            </p>
          </div>

          <div className="application-item">
            <h4>🔐 Cryptography</h4>
            <p>
              Stream ciphers and cryptographic algorithms use XOR operations 
              for their reversible properties.
            </p>
          </div>

          <div className="application-item">
            <h4>📊 Signal Processing</h4>
            <p>
              Digital signal processing uses XOR for edge detection 
              and signal comparison operations.
            </p>
          </div>
        </div>
      </ExplanationBlock>

      <CircuitModal
        open={open}
        onClose={() => setOpen(false)}
        expression="A⊕B⊕C"
        variables={['A', 'B', 'C']}
      />

      <style jsx>{`
        .odd-function-intro {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 20px;
        }
        
        .function-definition,
        .parity-explanation {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(148, 163, 184, 0.25);
          border-radius: 12px;
          padding: 20px;
        }
        
        .function-definition h4,
        .parity-explanation h4 {
          color: #93c5fd;
          margin-bottom: 16px;
        }
        
        .formula p {
          color: #e2e8f0;
          font-family: 'Courier New', monospace;
          margin-bottom: 8px;
          background: rgba(99, 102, 241, 0.1);
          padding: 8px;
          border-radius: 4px;
        }
        
        .parity-explanation p {
          color: #9ca3af;
          margin-bottom: 16px;
          line-height: 1.6;
        }
        
        .parity-examples {
          display: grid;
          gap: 8px;
        }
        
        .example {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 6px;
          padding: 8px;
        }
        
        .example code {
          color: #86efac;
          font-family: 'Courier New', monospace;
        }
        
        .expressions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        
        .expression-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(148, 163, 184, 0.25);
          border-radius: 12px;
          padding: 20px;
        }
        
        .expression-card h4 {
          color: #93c5fd;
          margin-bottom: 12px;
        }
        
        .expression-content code {
          display: block;
          color: #e2e8f0;
          font-family: 'Courier New', monospace;
          background: rgba(99, 102, 241, 0.1);
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 8px;
          word-break: break-all;
        }
        
        .expression-content p {
          color: #9ca3af;
          margin: 0;
          font-size: 0.9rem;
        }
        
        .implementations {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        
        .implementation-card {
          background: rgba(251, 146, 60, 0.1);
          border: 1px solid rgba(251, 146, 60, 0.3);
          border-radius: 12px;
          padding: 20px;
        }
        
        .implementation-card h4 {
          color: #fdba74;
          margin-bottom: 12px;
        }
        
        .implementation-card p {
          color: #9ca3af;
          margin-bottom: 16px;
        }
        
        .gate-diagram {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        
        .gate-symbol {
          width: 60px;
          height: 40px;
          background: rgba(99, 102, 241, 0.2);
          border: 2px solid #6366f1;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #93c5fd;
          font-weight: bold;
          font-size: 1.2rem;
        }
        
        .gate-inputs,
        .gate-output {
          display: flex;
          gap: 20px;
          color: #e2e8f0;
          font-family: 'Courier New', monospace;
        }
        
        .cascaded-diagram {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        
        .gate-stage {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .stage-labels {
          display: flex;
          gap: 8px;
          color: #e2e8f0;
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
        }
        
        .intermediate,
        .output {
          color: #93c5fd;
          font-family: 'Courier New', monospace;
          font-weight: bold;
        }
        
        .and-or-diagram {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .and-gates {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        
        .and-group {
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 6px;
          padding: 8px;
          color: #e2e8f0;
          font-family: 'Courier New', monospace;
          font-size: 0.8rem;
          text-align: center;
        }
        
        .or-gate {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 6px;
          padding: 8px;
          color: #86efac;
          font-family: 'Courier New', monospace;
          text-align: center;
        }
        
        .activities {
          display: grid;
          gap: 20px;
          margin-top: 20px;
        }
        
        .activity-card {
          background: rgba(168, 85, 247, 0.1);
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 12px;
          padding: 20px;
        }
        
        .activity-card h4 {
          color: #c4b5fd;
          margin-bottom: 12px;
        }
        
        .activity-card p {
          color: #9ca3af;
          margin-bottom: 16px;
          line-height: 1.6;
        }
        
        .activity-steps {
          background: rgba(15, 23, 42, 0.4);
          border-radius: 8px;
          padding: 16px;
        }
        
        .activity-steps ol {
          margin: 0;
          padding-left: 20px;
          color: #e2e8f0;
        }
        
        .activity-steps li {
          margin-bottom: 8px;
        }
        
        .simplification-steps {
          display: grid;
          gap: 8px;
          margin-top: 16px;
        }
        
        .step {
          background: rgba(15, 23, 42, 0.4);
          border-radius: 6px;
          padding: 8px;
          color: #e2e8f0;
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
        }
        
        .patterns {
          display: grid;
          gap: 8px;
          margin-top: 16px;
        }
        
        .pattern {
          background: rgba(15, 23, 42, 0.4);
          border-radius: 6px;
          padding: 8px;
          color: #e2e8f0;
        }
        
        .pattern strong {
          color: #93c5fd;
        }
        
        .build-challenges {
          display: grid;
          gap: 8px;
          margin-top: 16px;
        }
        
        .challenge {
          background: rgba(15, 23, 42, 0.4);
          border-radius: 6px;
          padding: 8px;
          color: #e2e8f0;
        }
        
        .challenge strong {
          color: #fdba74;
        }
        
        .applications-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        
        .application-item {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 12px;
          padding: 20px;
        }
        
        .application-item h4 {
          color: #86efac;
          margin-bottom: 12px;
        }
        
        .application-item p {
          color: #9ca3af;
          margin: 0;
          line-height: 1.6;
        }
        
        @media (max-width: 768px) {
          .odd-function-intro {
            grid-template-columns: 1fr;
          }
          
          .expressions-grid {
            grid-template-columns: 1fr;
          }
          
          .implementations {
            grid-template-columns: 1fr;
          }
          
          .applications-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </ToolLayout>
  );
};

export default OddFunction;
