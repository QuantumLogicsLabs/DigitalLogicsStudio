import { memo } from "react";
import { F } from "../utils/constants";

// ── Header — logo, board title, rail voltage indicators ────────────
function BoardHeader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(90deg,#04101e,#0b1e40,#04101e)",
        border: "1px solid #1a3470",
        borderRadius: 6,
        padding: "7px 16px",
        marginBottom: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            fontSize: 32,
            color: "#3a8fff",
            filter: "drop-shadow(0 0 10px #3a8fff)",
            lineHeight: 1,
          }}
        >
          ∞
        </span>
        <div>
          <div
            style={{
              fontFamily: "'Orbitron',monospace",
              fontSize: 17,
              fontWeight: 900,
              color: "#d0e8ff",
              letterSpacing: 3,
            }}
          >
            INFINIT
          </div>
          <div
            style={{
              fontFamily: "'Orbitron',monospace",
              fontSize: 7,
              color: "#5575aa",
              letterSpacing: 2,
            }}
          >
            Technologies
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "'Orbitron',monospace",
            fontSize: 18,
            color: "#ffcc44",
            letterSpacing: 6,
            textShadow: "0 0 12px #ffcc4466",
          }}
        >
          IT-300
        </div>
        <div
          style={{
            fontFamily: "'Orbitron',monospace",
            fontSize: 8,
            color: "#8aaacf",
            letterSpacing: 2,
          }}
        >
          DIGITAL LOGIC TRAINING SYSTEM
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {[
          ["+5V", "#ff2200"],
          ["+15V", "#00ff44"],
          ["-15V", "#ffcc00"],
        ].map(([lbl, c]) => (
          <div key={lbl} style={{ textAlign: "center" }}>
            <div
              style={{
                width: 10,
                height: 20,
                borderRadius: "5px 5px 3px 3px",
                margin: "0 auto 3px",
                background: c,
                boxShadow: `0 0 10px ${c}88`,
              }}
            />
            <div style={{ fontSize: 6, color: c, fontFamily: F }}>
              {lbl}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(BoardHeader);
