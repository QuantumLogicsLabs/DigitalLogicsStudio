import React, { useMemo, useState } from "react";
import "./AluFlagsSimulator.css";

const OPERATIONS = ["ADD", "SUB", "AND", "OR", "XOR"];

function clampToRange(value) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return 0;
  return Math.min(255, Math.max(-128, parsed));
}

function toUnsignedByte(value) {
  return ((value % 256) + 256) % 256;
}

function toSignedByte(value) {
  const unsigned = toUnsignedByte(value);
  return unsigned > 127 ? unsigned - 256 : unsigned;
}

function formatHex(value) {
  return `0x${toUnsignedByte(value).toString(16).toUpperCase().padStart(2, "0")}`;
}

function formatBinary(value) {
  return toUnsignedByte(value).toString(2).padStart(8, "0");
}

function AluFlagsSimulator() {
  const [operandA, setOperandA] = useState(10);
  const [operandB, setOperandB] = useState(5);
  const [operation, setOperation] = useState("ADD");

  const metrics = useMemo(() => {
    const a = clampToRange(operandA);
    const b = clampToRange(operandB);
    const byteA = toUnsignedByte(a);
    const byteB = toUnsignedByte(b);

    let resultUnsigned = 0;
    let zf = 0;
    let cf = 0;
    let sf = 0;
    let of = 0;

    if (operation === "ADD") {
      const sum = byteA + byteB;
      resultUnsigned = sum & 0xff;
      cf = sum > 255 ? 1 : 0;
      const signedA = toSignedByte(byteA);
      const signedB = toSignedByte(byteB);
      const signedResult = toSignedByte(resultUnsigned);
      of = (signedA >= 0 && signedB >= 0 && signedResult < 0) || (signedA < 0 && signedB < 0 && signedResult >= 0) ? 1 : 0;
    } else if (operation === "SUB") {
      const diff = byteA - byteB;
      resultUnsigned = diff & 0xff;
      cf = byteA < byteB ? 1 : 0;
      const signedA = toSignedByte(byteA);
      const signedB = toSignedByte(byteB);
      const signedResult = toSignedByte(resultUnsigned);
      of = (signedA >= 0 && signedB < 0 && signedResult < 0) || (signedA < 0 && signedB >= 0 && signedResult >= 0) ? 1 : 0;
    } else if (operation === "AND") {
      resultUnsigned = byteA & byteB;
    } else if (operation === "OR") {
      resultUnsigned = byteA | byteB;
    } else if (operation === "XOR") {
      resultUnsigned = byteA ^ byteB;
    }

    zf = resultUnsigned === 0 ? 1 : 0;
    sf = (resultUnsigned & 0x80) !== 0 ? 1 : 0;

    if (operation === "AND" || operation === "OR" || operation === "XOR") {
      cf = 0;
      of = 0;
    }

    const resultDecimal = toSignedByte(resultUnsigned);
    const explanation = [
      `ZF is ${zf ? "set" : "clear"} because the final 8-bit result ${zf ? "is exactly 0x00" : `is ${formatHex(resultUnsigned)} instead of zero`}.`,
      `CF is ${cf ? "set" : "clear"} because the unsigned operation ${cf ? "wrapped around or required a borrow" : "stayed within the 8-bit range"}.`,
      `SF is ${sf ? "set" : "clear"} because the MSB of ${formatBinary(resultUnsigned)} is ${sf ? "1" : "0"}.`,
      `OF is ${of ? "set" : "clear"} because the signed result ${of ? "crossed the -128 to 127 boundary" : "stayed inside the signed range"}.`,
    ];

    return {
      a,
      b,
      byteA,
      byteB,
      resultUnsigned,
      resultDecimal,
      zf,
      cf,
      sf,
      of,
      explanation,
    };
  }, [operandA, operandB, operation]);

  const handleOperandChange = (setter, rawValue) => {
    const nextValue = rawValue === "" ? 0 : clampToRange(rawValue);
    setter(nextValue);
  };

  const flags = [
    { key: "ZF", label: "Zero Flag", value: metrics.zf, tone: "from-emerald-500 to-green-400", activeText: "Zero result" },
    { key: "CF", label: "Carry Flag", value: metrics.cf, tone: "from-rose-500 to-red-400", activeText: "Carry / borrow" },
    { key: "SF", label: "Sign Flag", value: metrics.sf, tone: "from-sky-500 to-cyan-400", activeText: "Negative sign" },
    { key: "OF", label: "Overflow Flag", value: metrics.of, tone: "from-violet-500 to-fuchsia-400", activeText: "Signed overflow" },
  ];

  return (
    <div className="alu-simulator">
      {/* Header Section */}
      <div className="alu-header">
        <div className="alu-header-badge">
          <span className="alu-header-badge-dot"></span> Interactive Simulator
        </div>
        <h3 className="alu-header-title">8-Bit ALU & Flags Simulator</h3>
        <p className="alu-header-description">
          Enter two 8-bit values, select an operation, and observe how the CPU's arithmetic logic unit processes the data. Watch the status flags update in real time.
        </p>
      </div>

      <div className="alu-grid-main">
        {/* Input Controls */}
        <div className="alu-setup-box">
          <h4 className="alu-setup-header">
            <span className="alu-setup-header-accent"></span> Setup
          </h4>

          <div className="alu-inputs-grid">
            {/* Operand A */}
            <div className="alu-input-group">
              <label className="alu-input-label">
                Operand A (Value 1)
              </label>
              <div className="alu-input-container">
                <input
                  type="number"
                  min="-128"
                  max="255"
                  value={operandA}
                  onChange={(event) => handleOperandChange(setOperandA, event.target.value)}
                  className="alu-input-field"
                />
                <div className="alu-input-binary-hint">
                  {formatBinary(operandA)}
                </div>
              </div>
            </div>

            {/* Operand B */}
            <div className="alu-input-group">
              <label className="alu-input-label">
                Operand B (Value 2)
              </label>
              <div className="alu-input-container">
                <input
                  type="number"
                  min="-128"
                  max="255"
                  value={operandB}
                  onChange={(event) => handleOperandChange(setOperandB, event.target.value)}
                  className="alu-input-field"
                />
                <div className="alu-input-binary-hint">
                  {formatBinary(operandB)}
                </div>
              </div>
            </div>
          </div>

          {/* Operation Selector */}
          <div className="alu-operation-section">
            <label className="alu-operation-label">
              Operation
            </label>
            <div className="alu-operation-buttons">
              {OPERATIONS.map((op) => (
                <button
                  key={op}
                  onClick={() => setOperation(op)}
                  className={`alu-operation-btn ${operation === op ? "active" : ""}`}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Display */}
        <div className="alu-results-box">
          <h4 className="alu-results-header">
            <span className="alu-results-header-accent"></span> Result
          </h4>
          <div className="alu-results-grid">
            {/* Decimal */}
            <div className="alu-result-card">
              <p className="alu-result-label">Decimal</p>
              <p className="alu-result-value">{metrics.resultDecimal}</p>
              <p className="alu-result-description">Signed value</p>
            </div>

            {/* Hex */}
            <div className="alu-result-card">
              <p className="alu-result-label">Hexadecimal</p>
              <p className="alu-result-value">{formatHex(metrics.resultUnsigned)}</p>
              <p className="alu-result-description">Compact form</p>
            </div>

            {/* Binary */}
            <div className="alu-result-card">
              <p className="alu-result-label">8-Bit Binary</p>
              <p className="alu-result-value alu-result-value-binary">
                {formatBinary(metrics.resultUnsigned)}
              </p>
              <p className="alu-result-description">Raw bits</p>
            </div>
          </div>
        </div>

        {/* Flags Grid */}
        <div className="alu-flags-box">
          <h4 className="alu-flags-header">
            <span className="alu-flags-header-accent"></span> Status Flags
          </h4>
          <div className="alu-flags-grid">
            {flags.map((flag) => {
              const flagClassMap = {
                ZF: "alu-flag-card--zf",
                CF: "alu-flag-card--cf",
                SF: "alu-flag-card--sf",
                OF: "alu-flag-card--of",
              };
              return (
                <div
                  key={flag.key}
                  className={`alu-flag-card ${flagClassMap[flag.key]} ${flag.value ? "active" : ""}`}
                >
                  <div className="alu-flag-value">{flag.value}</div>
                  <p className="alu-flag-name">{flag.key}</p>
                  <div className="alu-flag-indicator"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explanation Panel */}
        <div className="alu-explanation-box">
          <h4 className="alu-explanation-header">
            <span className="alu-explanation-header-accent"></span> Why
          </h4>
          <ul className="alu-explanation-list">
            {metrics.explanation.map((line, idx) => {
              const flagName = ["ZF", "CF", "SF", "OF"][idx];
              const isSet = [metrics.zf, metrics.cf, metrics.sf, metrics.of][idx];
              return (
                <li
                  key={line}
                  className={`alu-explanation-item ${isSet ? "active" : ""}`}
                >
                  <span className="alu-explanation-flag-name">{flagName}:</span> {line.split(" is ")[1]}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AluFlagsSimulator;
