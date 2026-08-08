import { memo } from "react";
// ── Toggle Switch ─────────────────────────────────────────────────
function ToggleSW({ label, val, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <div
        style={{
          width: 18,
          height: 36,
          borderRadius: 3,
          background: "linear-gradient(#2a2a2a,#111)",
          border: "1px solid #555",
          position: "relative",
          boxShadow: "inset 0 1px 3px #000, 0 2px 4px #000",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 2,
            right: 2,
            height: 14,
            background: "linear-gradient(#e0e0e0,#aaa)",
            borderRadius: 2,
            top: val ? 2 : 19,
            transition: "top .1s ease",
            boxShadow: "0 2px 4px #000",
          }}
        />
      </div>
      <span style={{ fontFamily: "monospace", fontSize: 7, color: "#d4a843" }}>
        {label}
      </span>
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 8,
          fontWeight: "bold",
          color: val ? "#00ee44" : "#334",
        }}
      >
        {val}
      </span>
    </div>
  );
}

export default memo(ToggleSW);
