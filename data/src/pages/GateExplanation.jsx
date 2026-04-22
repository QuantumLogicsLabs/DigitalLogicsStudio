import React, { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import ExplanationBlock from '../components/ExplanationBlock';
import CircuitModal from '../components/CircuitModal';
import { gateSymbols } from '../data/gates';

const GateExplanation = () => {
  const [open, setOpen] = useState(false);
  const variables = ['A', 'B'];
  const example = "F = A'B + AB'";

  const gates = [
    { type: 'AND', title: 'AND', desc: 'Outputs 1 only if all inputs are 1.' },
    { type: 'OR', title: 'OR', desc: 'Outputs 1 if any input is 1.' },
    { type: 'NOT', title: 'NOT', desc: 'Inverts the input: 1 → 0, 0 → 1.' },
    { type: 'NAND', title: 'NAND', desc: 'Inverse of AND; outputs 0 only if all inputs are 1.' },
    { type: 'NOR', title: 'NOR', desc: 'Inverse of OR; outputs 1 only if all inputs are 0.' },
    { type: 'XOR', title: 'XOR', desc: 'Outputs 1 when inputs differ.' },
    { type: 'XNOR', title: 'XNOR', desc: 'Outputs 1 when inputs are equal.' },
    { type: 'BUFFER', title: 'BUFFER', desc: 'Passes input to output unchanged.' }
  ];

  return (
    <ToolLayout title="Logic Gates" subtitle="Symbols, behavior, and intuition">
      <div className="kmap-card" style={{ marginBottom: '1rem' }}>
        <button
          className="kmap-btn kmap-btn-primary kmap-btn-full"
          onClick={() => setOpen(true)}
        >
          🔌 Experiment with Circuit
        </button>
      </div>

      <ExplanationBlock title="Gate Library">
        <div className="gate-grid">
          {gates.map(g => (
            <div key={g.type} className="gate-card">
              <div className="gate-icon">{gateSymbols[g.type]}</div>
              <h4 className="gate-title">{g.title}</h4>
              <p className="gate-desc">{g.desc}</p>
            </div>
          ))}
        </div>
      </ExplanationBlock>

      <ExplanationBlock title="Truth Table Intuition">
        <p className="explanation-intro">
          Use XOR example {example} to see differing inputs produce 1. Open the circuit editor to experiment.
        </p>
      </ExplanationBlock>

      <CircuitModal
        open={open}
        onClose={() => setOpen(false)}
        expression={example}
        variables={variables}
      />

      <style jsx>{`
        .gate-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }
        .gate-card {
          background: rgba(15,23,42,0.6);
          border: 1px solid rgba(148,163,184,0.25);
          border-radius: 12px;
          padding: 16px;
        }
        .gate-icon {
          color: #93c5fd;
          margin-bottom: 8px;
          display: flex;
          justify-content: center;
        }
        .gate-title {
          margin: 4px 0;
        }
        .gate-desc {
          color: #9ca3af;
          margin: 0;
        }
      `}</style>
    </ToolLayout>
  );
};

export default GateExplanation;
