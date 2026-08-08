import { memo } from "react";
import { F } from "../utils/constants";

// ── Status bar ───────────────────────────────────────────────────
function StatusBar({
  clkOn, clkHz, clk,
  switches, dec,
  wires, placedICs,
  mode,
  hasShortCircuit, shortNodes,
}) {
  return (
    <div
      style={{
        marginTop: 8,
        padding: "5px 12px",
        background: "linear-gradient(90deg,#030b18,#060e22,#030b18)",
        border: "1px solid #0c1c36",
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 8,
        color: "#2a5a7a",
        fontFamily: F,
      }}
    >
      <span style={{ color: "#ff8800" }}>
        CLK {clkOn ? `${clkHz}Hz` : "OFF"}{" "}
        {clkOn ? (clk ? "▐█" : "░░") : ""}
      </span>
      <span style={{ color: "#334" }}>|</span>
      <span>
        SW:{" "}
        <span style={{ color: "#00ee44" }}>
          {switches.slice().reverse().join("")}b
        </span>{" "}
        ={dec}
      </span>
      <span style={{ color: "#334" }}>|</span>
      <span>
        WIRES:<span style={{ color: "#6699ff" }}> {wires.length}</span>
      </span>
      <span style={{ color: "#334" }}>|</span>
      <span>
        ICs:
        <span style={{ color: "#bb44ff" }}> {placedICs.length}</span>
      </span>
      <span style={{ color: "#334" }}>|</span>
      <span>
        MODE:
        <span style={{ color: "#88bbdd" }}> {mode.toUpperCase()}</span>
      </span>
      <span style={{ color: "#334" }}>|</span>
      <span className={hasShortCircuit ? "short-blink" : ""}>
        SHORT:
        <span style={{ color: hasShortCircuit ? "#ff2222" : "#2a5a2a" }}>
          {" "}{hasShortCircuit ? `⚠ ${shortNodes.size}` : "OK"}
        </span>
      </span>
      <span style={{ marginLeft: "auto", color: "#14243a" }}>
        ∞ INFINIT TECHNOLOGIES · IT-300 DIGITAL LOGIC TRAINING SYSTEM
      </span>
    </div>
  );
}

export default memo(StatusBar);
