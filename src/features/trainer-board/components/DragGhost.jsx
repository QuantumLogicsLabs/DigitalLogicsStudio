import { memo } from "react";
import { ICS } from "../utils/icCatalog";

// ── Drag ghost ───────────────────────────────────────────────────
// The floating IC preview that follows the cursor while dragging a chip
// out of the tray, before it's dropped/snapped onto the breadboard.
function DragGhost({ dragging }) {
  if (!dragging) return null;
  const ic = ICS[dragging.icKey];
  return (
    <div
      style={{
        position: "fixed",
        left: dragging.ghostX,
        top: dragging.ghostY,
        pointerEvents: "none",
        zIndex: 9999,
        opacity: 0.88,
        transform: "rotate(-4deg) scale(1.05)",
        filter: "drop-shadow(0 6px 16px rgba(0,0,0,.9))",
      }}
    >
      <div
        style={{
          background: `linear-gradient(160deg,${ic.bg},#080808)`,
          border: "2px solid #888",
          borderRadius: 4,
          padding: "5px 10px",
          minWidth: 60,
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 11,
            fontWeight: "bold",
            color: ic.txt,
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          {dragging.icKey}
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 13,
            color: ic.txt,
            textAlign: "center",
          }}
        >
          {ic.sym}
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 6,
            color: "#aaa",
            textAlign: "center",
            marginTop: 1,
          }}
        >
          {ic.name}
        </div>
      </div>
    </div>
  );
}

export default memo(DragGhost);
