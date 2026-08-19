import React from "react";

const Sidebar = ({
  selectionToolActive,
  setSelectionToolActive,
  simplifiedExpression,
  addGate,
}) => {
  return (
    <div className="sidebar">
      <h2>Circuit Forge</h2>
      <button
        onClick={() => setSelectionToolActive((v) => !v)}
        className={`toggle-selection-btn${selectionToolActive ? " active" : ""}`}
      >
        <span className="icon">{selectionToolActive ? "✦" : "⬚"}</span>
        {selectionToolActive ? "Selection ON" : "Selection OFF"}
      </button>

      {simplifiedExpression && (
        <div className="simplified-expression-display">
          <h3>📐 K-Map Simplified Expression</h3>
          <div className="expression-content">{simplifiedExpression}</div>
          <p className="expression-hint">Circuit auto-generated below! ✨</p>
        </div>
      )}

      <div className="palette-section">
        <div className="palette-section-title">Logic Gates</div>
        <div className="gate-palette">
          {[
            "INPUT",
            "OUTPUT",
            "AND",
            "OR",
            "NOT",
            "NAND",
            "NOR",
            "XOR",
            "XNOR",
            "BUFFER",
          ].map((type) => (
            <button key={type} className="gate-btn" onClick={() => addGate(type)}>
              {type}
            </button>
          ))}
        </div>
      </div>
      <div className="palette-section">
        <div className="palette-section-title">Multiplexers</div>
        <div className="gate-palette">
          {[
            { type: "MUX2", label: "MUX 2:1" },
            { type: "MUX4", label: "MUX 4:1" },
            { type: "MUX8", label: "MUX 8:1" },
          ].map(({ type, label }) => (
            <button
              key={type}
              className="gate-btn gate-btn--ic"
              onClick={() => addGate(type)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="palette-section">
        <div className="palette-section-title">Demultiplexers</div>
        <div className="gate-palette">
          {[
            { type: "DEMUX2", label: "DEMUX 1:2" },
            { type: "DEMUX4", label: "DEMUX 1:4" },
            { type: "DEMUX8", label: "DEMUX 1:8" },
          ].map(({ type, label }) => (
            <button
              key={type}
              className="gate-btn gate-btn--ic"
              onClick={() => addGate(type)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="palette-section">
        <div className="palette-section-title">Encoders</div>
        <div className="gate-palette">
          {[
            { type: "ENC4", label: "ENC 4:2" },
            { type: "ENC8", label: "ENC 8:3" },
          ].map(({ type, label }) => (
            <button
              key={type}
              className="gate-btn gate-btn--ic"
              onClick={() => addGate(type)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="palette-section">
        <div className="palette-section-title">Decoders</div>
        <div className="gate-palette">
          {[
            { type: "DEC4", label: "DEC 2:4" },
            { type: "DEC8", label: "DEC 3:8" },
          ].map(({ type, label }) => (
            <button
              key={type}
              className="gate-btn gate-btn--ic"
              onClick={() => addGate(type)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="palette-section">
        <div className="palette-section-title">Adders</div>
        <div className="gate-palette">
          {[
            { type: "HALF_ADDER", label: "Half Adder" },
            { type: "FULL_ADDER", label: "Full Adder" },
            { type: "ADD4", label: "4 bit Adder" },
            { type: "CLADD4", label: "Carry LA 4" },
          ].map(({ type, label }) => (
            <button
              key={type}
              className="gate-btn gate-btn--ic"
              onClick={() => addGate(type)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="palette-section">
        <div className="palette-section-title">Subtractors</div>
        <div className="gate-palette">
          {[
            { type: "HALF_SUBTRACTOR", label: "Half Subtractor" },
            { type: "FULL_SUBTRACTOR", label: "Full Subtractor" },
          ].map(({ type, label }) => (
            <button
              key={type}
              className="gate-btn gate-btn--ic"
              onClick={() => addGate(type)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="instructions">
        <p>
          <strong>Controls:</strong>
        </p>
        <p>• Click buttons to add components</p>
        <p>• Drag gates to move them (Group Drag supported!)</p>
        <p>
          • <strong>Drag empty space</strong> to pan the canvas (default)
        </p>
        <p>
          • Enable <strong>⬚ Selection Tool</strong> to box-select components
        </p>
        <p>
          • Hold <strong>Space</strong> or drag with <strong>Middle Button</strong> to
          pan anytime
        </p>
        <p>• Ctrl + Click to add/remove individual gates</p>
        <p>• Click output dot → input dot to wire</p>
        <p>• Right-click wire to delete it</p>
        <p>• Right-click gate to delete (deletes selection)</p>
        <p>• Double-click gate to rename it</p>
        <p>• Scroll to zoom in/out</p>
        <p>
          • Click <strong>+</strong> / <strong>−</strong> to resize inputs
        </p>
        <p>
          <strong>Shortcuts:</strong>
        </p>
        <p>• Ctrl + Z: Undo &nbsp; Ctrl + Shift + Z: Redo</p>
        <p>• Ctrl + A: Select All &nbsp; Ctrl + D: Duplicate</p>
        <p>• Ctrl + C: Copy &nbsp; Ctrl + V: Paste</p>
        <p>• Delete / Backspace: Remove selected</p>
        <p>• Esc: Cancel wire / Clear selection</p>
      </div>
    </div>
  );
};

export default Sidebar;
