import { memo } from "react";
// ── Seven Segment Display ─────────────────────────────────────────
function Seg7({ val, h = 48 }) {
  const w = h * 0.6,
    t = h * 0.09,
    g = h * 0.032;
  const ON = "#ff3a00",
    OFF = "#220800";
  const DIGITS = [
    [1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 0, 0, 0],
    [1, 1, 0, 1, 1, 0, 1],
    [1, 1, 1, 1, 0, 0, 1],
    [0, 1, 1, 0, 0, 1, 1],
    [1, 0, 1, 1, 0, 1, 1],
    [1, 0, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 1, 1],
  ];
  const s = val >= 0 && val <= 9 ? DIGITS[val] : Array(7).fill(0);
  const hw = w - g * 2 - t,
    hh = h / 2 - g - t;
  const path = (i) => {
    const x0 = g + t,
      x2 = w - g,
      y0 = g,
      y1 = g + t,
      M = h / 2,
      yB = h - g;
    switch (i) {
      case 0:
        return `M${x0},${y0} h${hw} l${-t * 0.5},${t} H${x0 + t * 0.5}Z`;
      case 1:
        return `M${x2},${y1} v${hh} l${-t},${t * 0.3} V${y1 + t * 0.3}Z`;
      case 2:
        return `M${x2},${M + t * 0.3} v${hh} l${-t},${-t * 0.3} V${M + t * 0.6}Z`;
      case 3:
        return `M${x0},${yB} h${hw} l${-t * 0.5},${-t} H${x0 + t * 0.5}Z`;
      case 4:
        return `M${g},${M + t * 0.3} v${hh} l${t},${-t * 0.3} V${M + t * 0.6}Z`;
      case 5:
        return `M${g},${y1} v${hh} l${t},${t * 0.3} V${y1 + t * 0.3}Z`;
      case 6:
        return `M${x0},${M - t * 0.4} h${hw} l${t * 0.4},${t * 0.4} l${-t * 0.4},${t * 0.4} H${x0} l${-t * 0.4},${-t * 0.4}Z`;
      default:
        return "";
    }
  };
  return (
    <svg
      width={w + 4}
      height={h + 4}
      style={{ display: "block", flexShrink: 0 }}
    >
      <rect width={w + 4} height={h + 4} rx={3} fill="#060100" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path
          key={i}
          d={path(i)}
          fill={s[i] ? ON : OFF}
          transform="translate(2,2)"
        />
      ))}
    </svg>
  );
}

export default memo(Seg7);
