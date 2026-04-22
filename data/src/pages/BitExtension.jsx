import React, { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import ControlPanel from '../components/ControlPanel';
import ControlGroup from '../components/ControlGroup';
import ResultCard from '../components/ResultCard';
import ExplanationBlock from '../components/ExplanationBlock';

const extendBits = (value, targetBits, mode) => {
  if (!/^[01]+$/.test(value)) {
    return { error: 'Input must be a binary string of 0s and 1s.' };
  }
  const n = parseInt(targetBits, 10);
  if (Number.isNaN(n) || n <= 0 || n > 32) {
    return { error: 'Target bits should be between 1 and 32.' };
  }
  if (value.length > n) {
    return { error: 'Target width must be at least as large as the original bit width.' };
  }

  if (mode === 'unsigned') {
    const extended = value.padStart(n, '0');
    return {
      error: null,
      original: value,
      extended,
      explanation: `For unsigned values we use zero‑extension: pad with 0s on the left until the bit‑width is ${n}.`,
    };
  }

  // two's complement sign extension
  const signBit = value[0];
  const extended = value.padStart(n, signBit);
  return {
    error: null,
    original: value,
    extended,
    explanation:
      `For two's‑complement signed values we copy the sign bit (${signBit}) into the new higher‑order bits. ` +
      `This preserves the numeric value while changing the width to ${n} bits.`,
  };
};

const BitExtension = () => {
  const [binary, setBinary] = useState('');
  const [bits, setBits] = useState(8);
  const [mode, setMode] = useState('signed');

  const hasInput = binary !== '';
  const result = hasInput ? extendBits(binary, bits, mode === 'unsigned' ? 'unsigned' : 'signed') : null;

  return (
    <ToolLayout
      title="Bit Extension"
      subtitle="Compare unsigned zero‑extension vs signed two's‑complement sign extension"
    >
      <ControlPanel>
        <ControlGroup label="Binary value">
          <input
            type="text"
            className="control-input"
            value={binary}
            onChange={(e) => {
              const val = e.target.value.replace(/\s+/g, '');
              if (val === '' || /^[01]+$/.test(val)) {
                setBinary(val);
              }
            }}
            placeholder="e.g. 1010"
          />
        </ControlGroup>

        <ControlGroup label="Target bit‑width">
          <input
            type="number"
            className="control-input"
            value={bits}
            onChange={(e) => setBits(e.target.value)}
            min="1"
            max="32"
          />
        </ControlGroup>

        <ControlGroup label="Mode">
          <select
            className="control-select"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="signed">Signed (two&apos;s complement)</option>
            <option value="unsigned">Unsigned (zero‑extension)</option>
          </select>
        </ControlGroup>
      </ControlPanel>

      {hasInput && (
        <ResultCard title="Extension Result">

          <ExplanationBlock title="How the bits change">
            {result && result.error && (
              <p className="explanation-intro">
                <span className="highlight">Error:</span> {result.error}
              </p>
            )}
            {result && !result.error && (
              <>
                <p className="explanation-intro">
                  <span className="highlight">Original:</span> {result.original} ({result.original.length} bits)
                </p>
                <p className="explanation-intro">
                  <span className="highlight">Extended:</span> {result.extended} ({bits} bits)
                </p>
                <p>{result.explanation}</p>
              </>
            )}
          </ExplanationBlock>

          <ExplanationBlock title="Signed vs unsigned intuition">
            <>
              <p className="explanation-intro">
                With <span className="highlight">unsigned</span> numbers, the leftmost bit is just another
                magnitude bit, so new bits must be <strong>0</strong> to avoid changing the value.
              </p>
              <p className="explanation-intro">
                With <span className="highlight">two&apos;s‑complement signed</span> numbers, the leftmost bit
                encodes the sign. Repeating it into new higher‑order bits keeps the encoded integer the same, even
                though the word size grows.
              </p>
            </>
          </ExplanationBlock>
        </ResultCard>
      )}
    </ToolLayout>
  );
};

export default BitExtension;

