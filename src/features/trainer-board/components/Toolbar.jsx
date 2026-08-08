import { memo } from "react";
import { F, WIRE_COLORS } from "../utils/constants";

// ── Toolbar ──────────────────────────────────────────────────────
// Mode switcher (wire/delete), wire color picker, transient warnings,
// board-clearing actions, and the save/load/new circuit controls.
function Toolbar({
  mode, setMode,
  wireCol, pickWireColor,
  wireStart, cancelWire,
  wireWarning,
  hasShortCircuit, shortNodes,
  onClearWires, onClearICs,
  circuitName, setCircuitName,
  isAuthenticated,
  saveState,
  onSave, onSaveAsNew, onOpenBrowser, onNewCircuit,
  loadedCircuitId,
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 5,
        marginBottom: 7,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {[
        ["wire", "⚡ WIRE"],
        ["delete", "✂ DELETE"],
      ].map(([m, lbl]) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          style={{
            background: mode === m ? "#0e2436" : "#050d14",
            color: mode === m ? "#4fc3f7" : "#3a5566",
            border: `1px solid ${mode === m ? "#4fc3f7" : "#1e3344"}`,
            borderRadius: 3,
            padding: "3px 10px",
            cursor: "pointer",
            fontSize: 9,
            fontFamily: F,
            letterSpacing: 1,
          }}
        >
          {lbl}
        </button>
      ))}
      {mode === "wire" && (
        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
          <span style={{ fontSize: 7, color: "#446" }}>wire:</span>
          {WIRE_COLORS.map((c, i) => (
            <div
              key={c}
              onClick={() => pickWireColor(c, i)}
              style={{
                width: 13,
                height: 13,
                borderRadius: "50%",
                background: c,
                cursor: "pointer",
                border:
                  wireCol === c
                    ? "2px solid #fff"
                    : "2px solid transparent",
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      )}
      {wireStart && (
        <div style={{ fontSize: 8, color: "#4fc3f7", fontFamily: F }}>
          ● from <b style={{ color: "#fff" }}>{wireStart.id}</b> → click
          dest hole &nbsp;
          <span
            style={{ cursor: "pointer", color: "#f66" }}
            onClick={cancelWire}
          >
            ✕
          </span>
        </div>
      )}

      {/* "pin already wired" warning */}
      {wireWarning && (
        <div
          style={{
            fontSize: 8,
            color: "#ffcc00",
            fontFamily: F,
            background: "#2a1e00",
            border: "1px solid #ffcc00",
            borderRadius: 3,
            padding: "2px 7px",
          }}
        >
          ⚠ {wireWarning}
        </div>
      )}
      {/* Short-circuit warning banner */}
      {hasShortCircuit && (
        <div
          className="short-blink"
          style={{
            fontSize: 9,
            color: "#ff2222",
            fontFamily: F,
            fontWeight: "bold",
            background: "#2a0000",
            border: "1px solid #ff2222",
            borderRadius: 3,
            padding: "3px 8px",
          }}
        >
          ⚠ SHORT CIRCUIT DETECTED ({shortNodes.size})
        </div>
      )}
      <div style={{ marginLeft: "auto", display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
        <button
          onClick={onClearWires}
          style={{
            background: "#1e0808",
            color: "#f44",
            border: "1px solid #f44",
            borderRadius: 3,
            padding: "3px 9px",
            cursor: "pointer",
            fontSize: 9,
            fontFamily: F,
          }}
        >
          🗑 Wires
        </button>
        <button
          onClick={onClearICs}
          style={{
            background: "#16081e",
            color: "#b44fff",
            border: "1px solid #b44fff",
            borderRadius: 3,
            padding: "3px 9px",
            cursor: "pointer",
            fontSize: 9,
            fontFamily: F,
          }}
        >
          ✕ ICs
        </button>
        <button
          onClick={onNewCircuit}
          title="Clear the board and start a new circuit"
          style={{
            background: "#0a0a1e",
            color: "#8899ff",
            border: "1px solid #8899ff",
            borderRadius: 3,
            padding: "3px 9px",
            cursor: "pointer",
            fontSize: 9,
            fontFamily: F,
          }}
        >
          🆕 New
        </button>
        <input
          value={circuitName}
          onChange={(e) => setCircuitName(e.target.value)}
          placeholder="Circuit name"
          style={{
            background: "#050d14",
            color: "#cde",
            border: "1px solid #1e3344",
            borderRadius: 3,
            padding: "3px 7px",
            fontSize: 9,
            fontFamily: F,
            width: 110,
          }}
        />
        <button
          onClick={onOpenBrowser}
          title={isAuthenticated ? "Load a saved circuit" : "Log in to load your circuits"}
          style={{
            background: "#08161e",
            color: "#4fc3f7",
            border: "1px solid #4fc3f7",
            borderRadius: 3,
            padding: "3px 10px",
            cursor: "pointer",
            fontSize: 9,
            fontFamily: F,
          }}
        >
          📂 {isAuthenticated ? "LOAD" : "LOGIN TO LOAD"}
        </button>
        <button
          onClick={onSave}
          disabled={saveState.status === "saving"}
          title={
            isAuthenticated
              ? loadedCircuitId
                ? "Save changes to this circuit"
                : "Save this circuit to your account"
              : "Log in to save your circuit"
          }
          style={{
            background: "#08221e",
            color: "#2ee6a8",
            border: "1px solid #2ee6a8",
            borderRadius: 3,
            padding: "3px 10px",
            cursor: saveState.status === "saving" ? "wait" : "pointer",
            fontSize: 9,
            fontFamily: F,
            opacity: saveState.status === "saving" ? 0.6 : 1,
          }}
        >
          {isAuthenticated ? (loadedCircuitId ? "💾 UPDATE" : "💾 SAVE") : "🔒 LOGIN TO SAVE"}
        </button>
        {isAuthenticated && loadedCircuitId && (
          <button
            onClick={onSaveAsNew}
            disabled={saveState.status === "saving"}
            title="Save a separate copy without overwriting the loaded circuit"
            style={{
              background: "#141414",
              color: "#8aaacf",
              border: "1px solid #2a3a4a",
              borderRadius: 3,
              padding: "3px 8px",
              cursor: saveState.status === "saving" ? "wait" : "pointer",
              fontSize: 8,
              fontFamily: F,
            }}
          >
            SAVE AS NEW
          </button>
        )}
        {saveState.message && (
          <span
            style={{
              fontSize: 8,
              fontFamily: F,
              color: saveState.status === "error" ? "#f66" : "#2ee6a8",
            }}
          >
            {saveState.message}
          </span>
        )}
      </div>
    </div>
  );
}

export default memo(Toolbar);
