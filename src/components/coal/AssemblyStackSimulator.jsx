import React, { useEffect, useState } from "react";
import "./AssemblyStackSimulator.css";

const REGISTER_NAMES = ["AX", "BX", "CX"];
const OPERATIONS = ["MOV", "PUSH", "POP"];

function clampToByte(value) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return 0;
  return Math.min(255, Math.max(0, parsed));
}

function AssemblyStackSimulator() {
  const [registers, setRegisters] = useState({ AX: 0, BX: 0, CX: 0 });
  const [stack, setStack] = useState([]);
  const [operation, setOperation] = useState("MOV");
  const [target, setTarget] = useState("AX");
  const [value, setValue] = useState(42);
  const [log, setLog] = useState(["> System ready"]);
  const [error, setError] = useState("");
  const [highlightedRegister, setHighlightedRegister] = useState(null);
  const [highlightedStack, setHighlightedStack] = useState(false);

  useEffect(() => {
    if (!error) return undefined;

    const timer = window.setTimeout(() => setError(""), 1400);
    return () => window.clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (!highlightedRegister && !highlightedStack) return undefined;

    const timer = window.setTimeout(() => {
      setHighlightedRegister(null);
      setHighlightedStack(false);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [highlightedRegister, highlightedStack]);

  const handleExecute = (event) => {
    event.preventDefault();

    const nextRegisters = { ...registers };
    const nextStack = [...stack];
    const currentValue = nextRegisters[target];
    const instructionText = operation === "MOV"
      ? `> MOV ${target}, ${clampToByte(value)}`
      : `> ${operation} ${target}`;

    if (operation === "MOV") {
      nextRegisters[target] = clampToByte(value);
      setRegisters(nextRegisters);
      setHighlightedRegister(target);
      setLog((prev) => [...prev.slice(-7), instructionText]);
      return;
    }

    if (operation === "PUSH") {
      nextStack.push(currentValue);
      setRegisters(nextRegisters);
      setStack(nextStack);
      setHighlightedRegister(target);
      setHighlightedStack(true);
      setLog((prev) => [...prev.slice(-7), instructionText]);
      return;
    }

    if (nextStack.length === 0) {
      setError("Stack Underflow!");
      setLog((prev) => [...prev.slice(-7), instructionText]);
      return;
    }

    const poppedValue = nextStack.pop();
    nextRegisters[target] = poppedValue;
    setRegisters(nextRegisters);
    setStack(nextStack);
    setHighlightedRegister(target);
    setHighlightedStack(true);
    setLog((prev) => [...prev.slice(-7), instructionText]);
  };

  return (
    <div className="assembly-simulator">
      <div className="assembly-simulator__header">
        <div className="assembly-simulator__badge">Interactive CPU Sandbox</div>
        <h3 className="assembly-simulator__title">Assembly Stack &amp; Register Simulator</h3>
        <p className="assembly-simulator__description">
          Execute MOV, PUSH, and POP instructions to see how x86-style register values move between CPU registers and the runtime stack.
        </p>
      </div>

      <form className="assembly-simulator__panel" onSubmit={handleExecute}>
        <div className="assembly-simulator__controls">
          <label className="assembly-simulator__field">
            <span>Operation</span>
            <select value={operation} onChange={(event) => setOperation(event.target.value)}>
              {OPERATIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="assembly-simulator__field">
            <span>Target Register</span>
            <select value={target} onChange={(event) => setTarget(event.target.value)}>
              {REGISTER_NAMES.map((register) => (
                <option key={register} value={register}>
                  {register}
                </option>
              ))}
            </select>
          </label>

          <label className="assembly-simulator__field">
            <span>Value</span>
            <input
              type="number"
              min="0"
              max="255"
              value={value}
              onChange={(event) => setValue(clampToByte(event.target.value))}
              disabled={operation !== "MOV"}
              className={operation === "MOV" ? "" : "assembly-simulator__field--disabled"}
            />
          </label>

          <button type="submit" className="assembly-simulator__button">
            Execute
          </button>
        </div>

        {error ? <p className="assembly-simulator__error">{error}</p> : null}
      </form>

      <div className="assembly-simulator__grid">
        <section className="assembly-simulator__section">
          <div className="assembly-simulator__section-header">
            <h4>Registers</h4>
            <span>Fast CPU storage</span>
          </div>
          <div className="assembly-simulator__registers">
            {REGISTER_NAMES.map((name) => (
              <div
                key={name}
                className={`assembly-simulator__register ${highlightedRegister === name ? "is-active" : ""}`}
              >
                <span className="assembly-simulator__register-name">{name}</span>
                <strong>{registers[name]}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="assembly-simulator__section">
          <div className="assembly-simulator__section-header">
            <h4>Runtime Stack</h4>
            <span>LIFO memory</span>
          </div>
          <div className={`assembly-simulator__stack ${highlightedStack ? "is-active" : ""}`}>
            {stack.length === 0 ? (
              <div className="assembly-simulator__stack-empty">Empty stack</div>
            ) : (
              stack.map((entry, index) => (
                <div key={`${entry}-${index}`} className="assembly-simulator__stack-item">
                  <span>{index + 1}</span>
                  <strong>{entry}</strong>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="assembly-simulator__section assembly-simulator__section--log">
        <div className="assembly-simulator__section-header">
          <h4>Execution Log</h4>
          <span>Recent instructions</span>
        </div>
        <div className="assembly-simulator__log">
          {log.map((entry, index) => (
            <div key={`${entry}-${index}`} className="assembly-simulator__log-line">
              {entry}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AssemblyStackSimulator;
