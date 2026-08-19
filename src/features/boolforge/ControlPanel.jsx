import React from "react";
import { TruthTableGenerator } from "./components/TruthTable";
import { SaveAndLoad } from "./components/SaveAndLoad";

const ControlPanel = ({
  embedded,
  aiPrompt,
  setAiPrompt,
  handleRequestHint,
  hintLoading,
  handleGenerateCircuit,
  isGenLoading,
  hint,
  hintError,
  setHint,
  setHintError,
  inputGates,
  outputGates,
  toggleInput,
  evaluateGate,
  truthTable,
  undo,
  redo,
  historyIndex,
  history,
  gates,
  wires,
  gateIdCounter,
  wireIdCounter,
  inputCounter,
  outputCounter,
  setGates,
  setWires,
  setGateIdCounter,
  setWireIdCounter,
  setInputCounter,
  setOutputCounter,
  saveToHistory,
  clearCircuit,
  zoom,
  setZoom,
  setPanOffset,
  fitToView,
}) => {
  return (
    <div className="truth-table-panel">
      <h2>Circuit Control</h2>

      {!embedded && (
        <div className="ai-assistant-section">
          <h3 className="ai-title">🤖 CircuitMind Assistant</h3>
          <textarea
            className="ai-textarea"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Describe the circuit (e.g. 'half adder', 'A AND B OR C')…"
            rows={2}
          />
          <div className="controls">
            <button
              className="btn hint-btn"
              onClick={handleRequestHint}
              disabled={hintLoading}
              style={{ cursor: hintLoading ? "wait" : "pointer" }}
            >
              {hintLoading ? "💡 Thinking…" : "💡 Get Hint"}
            </button>
            <button
              className="btn generate-btn"
              onClick={handleGenerateCircuit}
              disabled={isGenLoading}
              style={{ cursor: isGenLoading ? "wait" : "pointer" }}
            >
              {isGenLoading ? "⚡ Generating…" : "⚡ AI Generate"}
            </button>
          </div>
          {(hint || hintError) && (
            <div className={`ai-response ${hintError ? "error" : ""}`}>
              {hintError || hint}
              <button
                className="dismiss-hint"
                onClick={() => {
                  setHint(null);
                  setHintError("");
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {inputGates.length > 0 && (
        <div className="input-controls">
          <h3
            style={{
              fontSize: "12px",
              color: "var(--accent-primary)",
              marginBottom: "10px",
            }}
          >
            Input Toggles
          </h3>
          {inputGates.map((gate) => (
            <div key={gate.id} className="input-toggle">
              <label>{gate.label}</label>
              <div
                className={`toggle-btn ${gate.inputValues[0] ? "on" : ""}`}
                onClick={() => toggleInput(gate)}
              />
            </div>
          ))}
        </div>
      )}

      {outputGates.length > 0 && (
        <div className="output-display">
          <h3>Output Values</h3>
          {outputGates.map((gate) => (
            <div key={gate.id} className="output-item">
              <label>{gate.label}</label>
              <div className={`output-value ${evaluateGate(gate) ? "high" : "low"}`}>
                {evaluateGate(gate) ? "1" : "0"}
              </div>
            </div>
          ))}
        </div>
      )}

      <TruthTableGenerator truthTable={truthTable} />

      <div className="controls">
        <button className="btn" onClick={undo} disabled={historyIndex <= 0}>
          ↶ Undo
        </button>
        <button
          className="btn"
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
        >
          ↷ Redo
        </button>
        <SaveAndLoad
          data={{
            gates,
            wires,
            gateIdCounter,
            wireIdCounter,
            inputCounter,
            outputCounter,
          }}
          setGates={setGates}
          setWires={setWires}
          setGateIdCounter={setGateIdCounter}
          setWireIdCounter={setWireIdCounter}
          setInputCounter={setInputCounter}
          setOutputCounter={setOutputCounter}
          saveToHistory={saveToHistory}
        />
        <button className="btn danger" onClick={clearCircuit}>
          🗑️ Clear All
        </button>
      </div>

      <div className="zoom-controls">
        <button
          className="btn zoom-btn"
          onClick={() => setZoom(Math.min(3, zoom * 1.2))}
          title="Zoom In"
        >
          🔍+
        </button>
        <span className="zoom-level">{Math.round(zoom * 100)}%</span>
        <button
          className="btn zoom-btn"
          onClick={() => setZoom(Math.max(0.1, zoom * 0.8))}
          title="Zoom Out"
        >
          🔍−
        </button>
        <button
          className="btn zoom-btn"
          onClick={() => {
            setZoom(1);
            setPanOffset({ x: 0, y: 0 });
          }}
          title="Reset Zoom"
        >
          ⟲
        </button>
        <button
          className="btn zoom-btn"
          onClick={fitToView}
          title="Fit all gates into view"
          style={{ flex: 1 }}
        >
          ⊡ Fit
        </button>
      </div>

      <div className="stats">
        <div>
          <span>Gates:</span> <strong>{gates.length}</strong>
        </div>
        <div>
          <span>Wires:</span> <strong>{wires.length}</strong>
        </div>
        <div>
          <span>Inputs:</span> <strong>{inputGates.length}</strong>
        </div>
        <div>
          <span>Outputs:</span> <strong>{outputGates.length}</strong>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
