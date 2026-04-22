/**
 * SevenSeg.jsx — 7-segment display SVG
 *
 * Renders a single digit using seven rectangular segments (a–g).
 * Segments that are ON glow bright green; OFF segments are nearly invisible.
 *
 * Props:
 *   segs  : { a,b,c,d,e,f,g } — 1 = ON, 0 = OFF
 *   digit : number             — decimal digit shown below (cosmetic only)
 */
import React from "react";

const ON_COLOR  = "#00ff88";
const OFF_COLOR = "rgba(0,255,136,0.06)";

const SevenSeg = ({ segs }) => {
  // Helper: pick ON or OFF color for a named segment
  const s = (name) => (segs[name] ? ON_COLOR : OFF_COLOR);

  const activeSegNames = ["a","b","c","d","e","f","g"].filter((k) => segs[k]);

  return (
    <div style={{ textAlign: "center" }}>
      <svg
        viewBox="0 0 70 120"
        width="90"
        height="130"
        style={{ filter: "drop-shadow(0 0 10px rgba(0,255,136,0.25))" }}
      >
        {/* a — top horizontal bar */}
        <rect x="10" y="4"   width="50" height="9"  rx="4" fill={s("a")} />
        {/* b — top-right vertical */}
        <rect x="58" y="8"   width="9"  height="48" rx="4" fill={s("b")} />
        {/* c — bottom-right vertical */}
        <rect x="58" y="62"  width="9"  height="48" rx="4" fill={s("c")} />
        {/* d — bottom horizontal bar */}
        <rect x="10" y="107" width="50" height="9"  rx="4" fill={s("d")} />
        {/* e — bottom-left vertical */}
        <rect x="3"  y="62"  width="9"  height="48" rx="4" fill={s("e")} />
        {/* f — top-left vertical */}
        <rect x="3"  y="8"   width="9"  height="48" rx="4" fill={s("f")} />
        {/* g — middle horizontal bar */}
        <rect x="10" y="56"  width="50" height="9"  rx="4" fill={s("g")} />
      </svg>

      {/* Active segments label (for reference) */}
      <div
        style={{
          marginTop: "6px",
          fontSize: "0.7rem",
          color: "rgba(0,255,136,0.5)",
          fontFamily: "monospace",
          letterSpacing: "2px",
        }}
      >
        {activeSegNames.length > 0 ? activeSegNames.join("") : "–"}
      </div>
    </div>
  );
};

export default SevenSeg;
