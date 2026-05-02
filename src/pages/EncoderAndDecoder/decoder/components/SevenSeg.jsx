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
import { COLORS } from "../../shared/theme.js";

const SevenSeg = ({ segs }) => {
  // Helper: pick ON or OFF color for a named segment
  const isOn = (name) => !!segs[name];

  const getFill = (name) =>
    isOn(name) ? COLORS.high : "rgba(0, 255, 136, 0.04)";
  const getFilter = (name) =>
    isOn(name) ? `drop-shadow(0 0 8px ${COLORS.high}80)` : "none";

  const activeSegNames = ["a", "b", "c", "d", "e", "f", "g"].filter(
    (k) => segs[k],
  );

  return (
    <div style={{ textAlign: "center" }}>
      <svg
        viewBox="0 0 70 120"
        width="100"
        height="140"
        style={{
          filter: "drop-shadow(0 0 12px rgba(0,255,136,0.15))",
          transition: "all 0.3s ease",
        }}
      >
        {/* a — top horizontal bar */}
        <rect
          x="12"
          y="5"
          width="46"
          height="8"
          rx="4"
          fill={getFill("a")}
          style={{ filter: getFilter("a"), transition: "all 0.3s" }}
        />
        {/* b — top-right vertical */}
        <rect
          x="58"
          y="10"
          width="8"
          height="44"
          rx="4"
          fill={getFill("b")}
          style={{ filter: getFilter("b"), transition: "all 0.3s" }}
        />
        {/* c — bottom-right vertical */}
        <rect
          x="58"
          y="66"
          width="8"
          height="44"
          rx="4"
          fill={getFill("c")}
          style={{ filter: getFilter("c"), transition: "all 0.3s" }}
        />
        {/* d — bottom horizontal bar */}
        <rect
          x="12"
          y="107"
          width="46"
          height="8"
          rx="4"
          fill={getFill("d")}
          style={{ filter: getFilter("d"), transition: "all 0.3s" }}
        />
        {/* e — bottom-left vertical */}
        <rect
          x="4"
          y="66"
          width="8"
          height="44"
          rx="4"
          fill={getFill("e")}
          style={{ filter: getFilter("e"), transition: "all 0.3s" }}
        />
        {/* f — top-left vertical */}
        <rect
          x="4"
          y="10"
          width="8"
          height="44"
          rx="4"
          fill={getFill("f")}
          style={{ filter: getFilter("f"), transition: "all 0.3s" }}
        />
        {/* g — middle horizontal bar */}
        <rect
          x="12"
          y="56"
          width="46"
          height="8"
          rx="4"
          fill={getFill("g")}
          style={{ filter: getFilter("g"), transition: "all 0.3s" }}
        />
      </svg>

      {/* Active segments indicator */}
      <div
        style={{
          marginTop: "12px",
          fontSize: "0.75rem",
          color: COLORS.high,
          background: "rgba(0, 255, 136, 0.1)",
          padding: "4px 12px",
          borderRadius: "20px",
          display: "inline-block",
          fontFamily: "monospace",
          letterSpacing: "1px",
          fontWeight: "700",
          border: "1px solid rgba(0, 255, 136, 0.2)",
          opacity: activeSegNames.length > 0 ? 1 : 0.4,
        }}
      >
        {activeSegNames.length > 0
          ? activeSegNames.join("").toUpperCase()
          : "OFF"}
      </div>
    </div>
  );
};

export default SevenSeg;
