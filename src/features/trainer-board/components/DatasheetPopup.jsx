import { memo } from "react";
import { ICS } from "../utils/icCatalog";
import { pinoutSummary } from "../utils/simulationEngine";

// ── Datasheet Popup — built entirely from pinoutSummary() data ────
function DatasheetPopup({ icKey, x, y, onClose }) {
  const ic = ICS[icKey];
  if (!ic) return null;
  const pinLines = pinoutSummary(icKey).split("  ").filter(Boolean);

  // Keep the popup on-screen (rough clamp against viewport edges).
  const POPUP_W = 220;
  const clampedX = Math.min(x + 10, window.innerWidth - POPUP_W - 10);
  const clampedY = Math.min(y + 10, window.innerHeight - 320);

  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        left: Math.max(10, clampedX),
        top: Math.max(10, clampedY),
        width: POPUP_W,
        background: "linear-gradient(160deg,#0c1420,#050a10)",
        border: `1px solid ${ic.txt}`,
        borderRadius: 6,
        boxShadow: "0 12px 30px rgba(0,0,0,.8)",
        zIndex: 10000,
        fontFamily: "monospace",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: `linear-gradient(90deg,${ic.bg},#080808)`,
          padding: "6px 9px",
          borderBottom: `1px solid ${ic.txt}55`,
        }}
      >
        <div>
          <div style={{ fontSize: 11, fontWeight: "bold", color: ic.txt, letterSpacing: 1 }}>
            {icKey} <span style={{ opacity: 0.7 }}>{ic.sym}</span>
          </div>
          <div style={{ fontSize: 7, color: "#889", marginTop: 1 }}>{ic.name} · {ic.pins}-pin DIP</div>
        </div>
        <span
          onClick={onClose}
          style={{ cursor: "pointer", color: "#f66", fontSize: 12, fontWeight: "bold", padding: "0 3px" }}
        >
          ✕
        </span>
      </div>

      <div style={{ padding: "7px 9px", fontSize: 8, color: "#cde", lineHeight: 1.5, borderBottom: "1px solid #1e3344" }}>
        {ic.desc}
      </div>

      <div style={{ maxHeight: 200, overflowY: "auto", padding: "6px 9px" }}>
        <div style={{ fontSize: 6.5, color: "#d4a843", letterSpacing: 1, marginBottom: 4 }}>
          PINOUT
        </div>
        {pinLines.map((line, i) => {
          const [pinNum, role] = line.split(":");
          const isPower = role === "VCC" || role === "GND";
          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 8,
                padding: "1.5px 0",
                color: isPower ? "#ff8844" : role === "—" ? "#445" : "#9fe",
              }}
            >
              <span>PIN {pinNum}</span>
              <span>{role}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(DatasheetPopup);
