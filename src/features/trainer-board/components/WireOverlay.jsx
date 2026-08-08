import { useState, memo } from "react";

// ── Wire overlay ──────────────────────────────────────────────────
// Uses SVG-local coords, rendered as an absolute overlay positioned
// exactly over the breadboard SVG.
function WireOverlay({ wires, preview, width, height, onWireClick }) {
  const [hoveredWireId, setHoveredWireId] = useState(null);
  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 999,
        overflow: "visible",
      }}
      width={width}
      height={height}
    >
      {wires.map((w) => {
        const mx = (w.ax + w.bx) / 2;
        const dy = Math.abs(w.bx - w.ax) * 0.25 + 10;
        const my = Math.min(w.ay, w.by) - dy;
        const isHovered = hoveredWireId === w.id;
        return (
          <g key={w.id}>
            {/* Wire shadow — no events here, purely visual */}
            <path
              d={`M${w.ax},${w.ay} Q${mx},${my} ${w.bx},${w.by}`}
              stroke="rgba(0,0,0,0.5)"
              strokeWidth={3.5}
              fill="none"
              strokeLinecap="round"
              pointerEvents="none"
            />
            {/* Wire — this is the ONLY path that gets hover/click */}
            <path
              d={`M${w.ax},${w.ay} Q${mx},${my} ${w.bx},${w.by}`}
              stroke={isHovered ? "#ffffff" : w.color}
              strokeWidth={isHovered ? 6 : 2.5}
              fill="none"
              strokeLinecap="round"
              opacity={isHovered ? 1 : 0.95}
              style={{ cursor: "pointer", pointerEvents: "stroke" }}
              onMouseEnter={() => setHoveredWireId(w.id)}
              onMouseLeave={() => setHoveredWireId((id) => (id === w.id ? null : id))}
              onClick={(e) => {
                e.stopPropagation();
                onWireClick?.(w.id);
              }}
            />
            {/* End dots */}
            <circle cx={w.ax} cy={w.ay} r={3} fill={w.color} pointerEvents="none" />
            <circle cx={w.bx} cy={w.by} r={3} fill={w.color} pointerEvents="none" />
          </g>
        );
      })}
      {preview && (
        <line
          x1={preview.ax}
          y1={preview.ay}
          x2={preview.bx}
          y2={preview.by}
          stroke={preview.color}
          strokeWidth={2}
          opacity={0.7}
          strokeDasharray="6,4"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export default memo(WireOverlay);
