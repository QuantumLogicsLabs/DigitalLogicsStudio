import { memo } from "react";
import { ICS } from "../utils/icCatalog";
import { pinoutSummary } from "../utils/simulationEngine";

// ── IC Tray item ──────────────────────────────────────────────────
function TrayIC({ icKey, onMouseDown, onContextMenu }) {
  const ic = ICS[icKey];
  return (
    <div
      onMouseDown={(e) => onMouseDown(e, icKey)}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu?.(e.clientX, e.clientY, icKey);
      }}
      title={`${icKey} — ${ic.desc} (${ic.pins}-pin)\nPins: ${pinoutSummary(icKey) || "see datasheet"}\nDrag onto breadboard\nRight-click for datasheet`}
      style={{
        background: `linear-gradient(160deg,${ic.bg},#080808)`,
        border: "1px solid #555",
        borderRadius: 4,
        padding: "5px 7px",
        cursor: "grab",
        userSelect: "none",
        minWidth: 58,
        boxShadow: "0 2px 6px rgba(0,0,0,.6)",
        transition: "filter .1s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.4)")}
      onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
    >
      <div
        style={{
          position: "relative",
          height: 4,
          marginBottom: 3,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 10,
            height: 4,
            background: "#080808",
            borderRadius: "0 0 4px 4px",
            border: "1px solid #555",
            borderTop: "none",
          }}
        />
      </div>
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 10,
          fontWeight: "bold",
          color: ic.txt,
          letterSpacing: 1,
          textAlign: "center",
        }}
      >
        {icKey}
      </div>
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 12,
          color: ic.txt,
          textAlign: "center",
          opacity: 0.9,
          lineHeight: 1,
        }}
      >
        {ic.sym}
      </div>
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 6,
          color: "#888",
          textAlign: "center",
          marginTop: 2,
        }}
      >
        {ic.name}
      </div>
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 5,
          color: "#555",
          textAlign: "center",
        }}
      >
        {ic.pins}p
      </div>
    </div>
  );
}

export default memo(TrayIC);
