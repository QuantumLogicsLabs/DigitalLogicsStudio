import React, { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import ExplanationBlock from '../components/ExplanationBlock';
import InteractiveCalculator from '../components/InteractiveCalculator';
import CircuitModal from '../components/CircuitModal';

const CircuitCost = () => {
  const [open, setOpen] = useState(false);
  const [literalCostResult, setLiteralCostResult] = useState('');
  const [gateInputCostResult, setGateInputCostResult] = useState('');

  // Parse boolean expression and calculate literal cost
  const calculateLiteralCost = (expression) => {
    try {
      // Remove spaces and convert to uppercase
      const expr = expression.replace(/\s+/g, '').toUpperCase();

      // Count literals (variables and their complements)
      let literalCount = 0;
      const variables = new Set();

      for (let i = 0; i < expr.length; i++) {
        const char = expr[i];
        if (/[A-Z]/.test(char)) {
          variables.add(char);
          if (i > 0 && expr[i - 1] === "'") {
            // Complemented variable
            literalCount++;
          } else if (i < expr.length - 1 && expr[i + 1] === "'") {
            // Variable that will be complemented
            literalCount++;
          } else {
            // Non-complemented variable
            literalCount++;
          }
        }
      }

      const result = {
        expression: expression,
        literalCount: literalCount,
        uniqueVariables: variables.size,
        variables: Array.from(variables).sort().join(', ')
      };

      setLiteralCostResult(
        `Expression: ${result.expression}\n` +
        `Literal Cost: ${result.literalCount}\n` +
        `Unique Variables: ${result.uniqueVariables} (${result.variables})\n\n` +
        `Explanation:\n` +
        `• Each variable occurrence (complemented or not) counts as 1 literal\n` +
        `• Total literals: ${result.literalCount}\n` +
        `• This represents the number of literal inputs needed`
      );
    } catch (error) {
      setLiteralCostResult('Error: Invalid expression format');
    }
  };

  // Parse boolean expression and calculate gate input cost
  const calculateGateInputCost = (expression) => {
    try {
      const expr = expression.replace(/\s+/g, '').toUpperCase();

      // Count operators and their inputs
      let gateInputCount = 0;
      let currentGateInputs = 0;

      for (let i = 0; i < expr.length; i++) {
        const char = expr[i];

        if (char === '(') {
          // Opening parenthesis
        } else if (char === ')') {
          if (currentGateInputs > 0) {
            gateInputCount += currentGateInputs;
            currentGateInputs = 0;
          }
        } else if (/[A-Z]/.test(char)) {
          currentGateInputs++;
          // Skip complement if present
          if (i < expr.length - 1 && expr[i + 1] === "'") {
            i++;
          }
        } else if (char === '+' || char === '·' || char === '*') {
          if (currentGateInputs > 0) {
            gateInputCount += currentGateInputs;
            currentGateInputs = 0;
          }
        }
      }

      // Add remaining inputs
      if (currentGateInputs > 0) {
        gateInputCount += currentGateInputs;
      }

      // Count gates
      const andGates = (expr.match(/[+]/g) || []).length;
      const orGates = (expr.match(/[·*]/g) || []).length;
      const notGates = (expr.match(/'/g) || []).length;
      const totalGates = andGates + orGates + notGates;

      setGateInputCostResult(
        `Expression: ${expression}\n` +
        `Gate Input Cost: ${gateInputCount}\n` +
        `Total Gates: ${totalGates}\n` +
        `AND Gates: ${andGates}, OR Gates: ${orGates}, NOT Gates: ${notGates}\n\n` +
        `Explanation:\n` +
        `• Gate input cost = sum of inputs to all gates\n` +
        `• Each gate input counts as 1 toward the cost\n` +
        `• This represents the total number of gate inputs required\n` +
        `• Lower cost generally means simpler implementation`
      );
    } catch (error) {
      setGateInputCostResult('Error: Invalid expression format');
    }
  };

  const literalExample = "F = A'B + AB' + C";
  const gateInputExample = "F = (A·B) + (C·D')";

  return (
    <ToolLayout
      title="Circuit Cost Analysis"
      subtitle="Understand literal cost and gate input cost for Boolean expressions"
    >

      <ExplanationBlock
        title="What is Circuit Cost?"
        intro="Circuit cost helps us understand the complexity and efficiency of Boolean expressions. Two main metrics are used:"
      >
        <div className="cost-types">
          <div className="cost-type">
            <h4>Literal Cost</h4>
            <p>
              The total number of variable occurrences (both complemented and non-complemented)
              in a Boolean expression. Each literal represents one input to a gate.
            </p>
            <div className="cost-example">
              <strong>Example:</strong> F = A'B + AB'
              <br />
              Literals: A', B, A, B' = <strong>4 literals</strong>
            </div>
          </div>

          <div className="cost-type">
            <h4>Gate Input Cost</h4>
            <p>
              The total number of inputs to all gates in the circuit. This includes inputs
              to AND, OR, NOT, NAND, NOR, XOR, and XNOR gates.
            </p>
            <div className="cost-example">
              <strong>Example:</strong> F = (A·B) + (C·D')
              <br />
              AND gates: 2 inputs each = 4 inputs
              <br />
              OR gate: 2 inputs = 2 inputs
              <br />
              NOT gate: 1 input = 1 input
              <br />
              <strong>Total: 7 gate inputs</strong>
            </div>
          </div>
        </div>
      </ExplanationBlock>

      <ExplanationBlock
        title="Disadvantages of Literal Cost"
        intro="While literal cost is simple to calculate, it has several limitations:"
      >
        <div className="disadvantages">
          <div className="disadvantage-item">
            <h4>❌ Ignores Gate Complexity</h4>
            <p>
              Literal cost treats all literals equally, but different gates have different
              implementation complexities. A 3-input AND gate is more complex than a 2-input AND gate.
            </p>
          </div>

          <div className="disadvantage-item">
            <h4>❌ No Technology Consideration</h4>
            <p>
              Different logic families (TTL, CMOS, etc.) have different cost structures.
              NAND gates might be cheaper in some technologies, but literal cost doesn't account for this.
            </p>
          </div>

          <div className="disadvantage-item">
            <h4>❌ Doesn't Reflect Propagation Delay</h4>
            <p>
              Expressions with the same literal cost can have very different timing characteristics.
              More gate levels generally mean longer propagation delays.
            </p>
          </div>

          <div className="disadvantage-item">
            <h4>❌ Limited Optimization Insight</h4>
            <p>
              Literal cost alone doesn't always indicate which expression is more optimal.
              Sometimes a higher literal cost expression might be better for specific implementations.
            </p>
          </div>
        </div>
      </ExplanationBlock>

      <InteractiveCalculator
        title="Literal Cost Calculator"
        description="Enter a Boolean expression to calculate its literal cost"
        inputLabel="Boolean Expression"
        inputPlaceholder="e.g., A'B + AB' + C"
        onCalculate={calculateLiteralCost}
        result={literalCostResult}
        example={literalExample}
      />

      <InteractiveCalculator
        title="Gate Input Cost Calculator"
        description="Enter a Boolean expression to calculate its gate input cost"
        inputLabel="Boolean Expression"
        inputPlaceholder="e.g., (A·B) + (C·D')"
        onCalculate={calculateGateInputCost}
        result={gateInputCostResult}
        example={gateInputExample}
      />

      <ExplanationBlock
        title="Comparison and Best Practices"
        intro="Understanding both cost metrics helps in circuit optimization:"
      >
        <div className="comparison">
          <div className="comparison-table">
            <table>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Pros</th>
                  <th>Cons</th>
                  <th>Best Use Case</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Literal Cost</td>
                  <td>Easy to calculate, good for quick estimates</td>
                  <td>Ignores gate complexity, technology factors</td>
                  <td>Initial expression comparison</td>
                </tr>
                <tr>
                  <td>Gate Input Cost</td>
                  <td>More accurate implementation cost</td>
                  <td>Requires gate-level analysis</td>
                  <td>Final circuit optimization</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="best-practices">
            <h4>🎯 Optimization Tips:</h4>
            <ul>
              <li>Start with literal cost for quick comparisons</li>
              <li>Use gate input cost for final implementation decisions</li>
              <li>Consider technology-specific factors (NAND vs NOR implementations)</li>
              <li>Balance cost with timing requirements</li>
              <li>Factor in fan-out limitations in real circuits</li>
            </ul>
          </div>
        </div>
      </ExplanationBlock>

      <CircuitModal
        open={open}
        onClose={() => setOpen(false)}
        expression={literalExample}
        variables={['A', 'B', 'C']}
      />

      <style jsx>{`
        .cost-types {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        
        .cost-type {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(148, 163, 184, 0.25);
          border-radius: 12px;
          padding: 20px;
        }
        
        .cost-type h4 {
          color: #93c5fd;
          margin-bottom: 12px;
        }
        
        .cost-type p {
          color: #9ca3af;
          margin-bottom: 16px;
          line-height: 1.6;
        }
        
        .cost-example {
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 8px;
          padding: 12px;
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
          color: #e2e8f0;
        }
        
        .disadvantages {
          display: grid;
          gap: 16px;
          margin-top: 20px;
        }
        
        .disadvantage-item {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          padding: 20px;
        }
        
        .disadvantage-item h4 {
          color: #fca5a5;
          margin-bottom: 12px;
        }
        
        .disadvantage-item p {
          color: #9ca3af;
          margin: 0;
          line-height: 1.6;
        }
        
        .comparison {
          margin-top: 20px;
        }
        
        .comparison-table {
          overflow-x: auto;
          margin-bottom: 20px;
        }
        
        .comparison-table table {
          width: 100%;
          border-collapse: collapse;
          background: rgba(15, 23, 42, 0.4);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .comparison-table th,
        .comparison-table td {
          padding: 12px;
          text-align: left;
          border: 1px solid rgba(148, 163, 184, 0.2);
          color: #e2e8f0;
        }
        
        .comparison-table th {
          background: rgba(99, 102, 241, 0.2);
          color: #93c5fd;
          font-weight: 600;
        }
        
        .best-practices {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 12px;
          padding: 20px;
        }
        
        .best-practices h4 {
          color: #86efac;
          margin-bottom: 16px;
        }
        
        .best-practices ul {
          margin: 0;
          padding-left: 20px;
          color: #9ca3af;
        }
        
        .best-practices li {
          margin-bottom: 8px;
          line-height: 1.6;
        }
      `}</style>
    </ToolLayout>
  );
};

export default CircuitCost;
