import { memo } from "react";
import { LEDCOL } from "../utils/constants";

// ── LED dot ───────────────────────────────────────────────────────
function LED({ on, c = "G", size = 10 }) {
  const col = LEDCOL[c] || LEDCOL.G;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        background: on ? col : "#111",
        boxShadow: on
          ? `0 0 4px ${col}, 0 0 10px ${col}55`
          : "inset 0 1px 3px #000",
        border: "1px solid #000",
      }}
    />
  );
}

export default memo(LED);
