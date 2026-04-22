import React, { useState, useEffect, useMemo } from 'react';
import ToolLayout from '../components/ToolLayout';
import ExplanationBlock from '../components/ExplanationBlock';
import CircuitModal from '../components/CircuitModal';

const TimeDiagrams = () => {
  const [delay, setDelay] = useState(2);
  const signal = useMemo(() => [0, 1, 1, 0, 1, 0, 0, 1], []);
  const [output, setOutput] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const out = signal.map((_, i) => signal[Math.max(0, i - delay)] ?? 0);
    setOutput(out);
  }, [signal, delay]);

  return (
    <ToolLayout title="Timing Diagrams & Gate Delay" subtitle="Visualizing propagation effects">
      <div className="kmap-card" style={{ marginBottom: '1rem' }}>
        <button
          className="kmap-btn kmap-btn-primary kmap-btn-full"
          onClick={() => setOpen(true)}
        >
          🔌 Experiment with Circuit
        </button>
      </div>

      <ExplanationBlock title="Propagation Delay">
        <p className="explanation-intro">
          Real gates take time to respond. The output reflects the input after a delay.
        </p>
        <div className="timing-controls">
          <label className="control-label">Gate delay (ticks)</label>
          <input
            type="range"
            min="0"
            max="5"
            value={delay}
            onChange={(e) => setDelay(parseInt(e.target.value))}
          />
          <span className="highlight">{delay}</span>
        </div>
        <div className="timing-diagram">
          <div className="wave-row">
            <span className="wave-label">Input</span>
            <div className="wave">
              {signal.map((bit, idx) => (
                <div key={idx} className={bit ? 'wave-high' : 'wave-low'} />
              ))}
            </div>
          </div>
          <div className="wave-row">
            <span className="wave-label">Output</span>
            <div className="wave">
              {output.map((bit, idx) => (
                <div key={idx} className={bit ? 'wave-high' : 'wave-low'} />
              ))}
            </div>
          </div>
        </div>
      </ExplanationBlock>

      <CircuitModal
        open={open}
        onClose={() => setOpen(false)}
        expression={"F = A.B' + C"}
        variables={['A', 'B', 'C']}
      />

      <style>{`
        .timing-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .timing-diagram {
          display: grid;
          gap: 10px;
        }
        .wave-row {
          display: grid;
          grid-template-columns: 80px 1fr;
          align-items: center;
          gap: 8px;
        }
        .wave {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 4px;
        }
        .wave-high, .wave-low {
          height: 24px;
          border-radius: 6px;
          border: 1px solid rgba(148,163,184,0.3);
        }
        .wave-high {
          background: rgba(34,197,94,0.4);
        }
        .wave-low {
          background: rgba(239,68,68,0.3);
        }
      `}</style>
    </ToolLayout>
  );
};

export default TimeDiagrams;
