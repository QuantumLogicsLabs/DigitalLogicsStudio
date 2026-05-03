import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ================================================================
   IT-300 Digital Logic Training System — Infinit Technologies
   Fixed version: proper holes, correct wire coords, working drag-drop
   ================================================================ */

// ── IC Catalog ────────────────────────────────────────────────────
const ICS = {
  7400: {
    name: "Quad 2-in NAND",
    pins: 14,
    sym: "⊼",
    bg: "#1a1a40",
    txt: "#9090ff",
  },
  7402: {
    name: "Quad 2-in NOR",
    pins: 14,
    sym: "⊽",
    bg: "#0d2b0d",
    txt: "#60dd60",
  },
  7404: {
    name: "Hex Inverter",
    pins: 14,
    sym: "¬",
    bg: "#2d0a0a",
    txt: "#ff8080",
  },
  7408: {
    name: "Quad 2-in AND",
    pins: 14,
    sym: "∧",
    bg: "#1a1a00",
    txt: "#e0e060",
  },
  7432: {
    name: "Quad 2-in OR",
    pins: 14,
    sym: "∨",
    bg: "#001a1a",
    txt: "#60e0e0",
  },
  7486: {
    name: "Quad 2-in XOR",
    pins: 14,
    sym: "⊕",
    bg: "#1a001a",
    txt: "#e060e0",
  },
  7474: {
    name: "Dual D Flip-Flop",
    pins: 14,
    sym: "D",
    bg: "#001428",
    txt: "#60b0ff",
  },
  7476: {
    name: "Dual JK Flip-Flop",
    pins: 16,
    sym: "JK",
    bg: "#0a1a10",
    txt: "#60ffaa",
  },
  7483: {
    name: "4-bit Adder",
    pins: 16,
    sym: "+",
    bg: "#1a0a00",
    txt: "#ffb060",
  },
  7485: {
    name: "4-bit Comparator",
    pins: 16,
    sym: "=?",
    bg: "#0a0a1a",
    txt: "#a0a0ff",
  },
  74138: {
    name: "3-to-8 Decoder",
    pins: 16,
    sym: "1:8",
    bg: "#1a1a0a",
    txt: "#ffff80",
  },
  74151: {
    name: "8-to-1 MUX",
    pins: 16,
    sym: "MX",
    bg: "#14001a",
    txt: "#ff80ff",
  },
  7447: {
    name: "BCD→7Seg Driver",
    pins: 16,
    sym: "7s",
    bg: "#001a0a",
    txt: "#80ffbb",
  },
  74193: {
    name: "4-bit Up/Dn Ctr",
    pins: 16,
    sym: "↑↓",
    bg: "#1a0505",
    txt: "#ffaaaa",
  },
  7495: {
    name: "4-bit Shift Reg",
    pins: 14,
    sym: ">>",
    bg: "#001818",
    txt: "#80ffff",
  },
};

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

// ── LED dot ───────────────────────────────────────────────────────
const LEDCOL = { R: "#ff1100", G: "#00ee44", Y: "#ffcc00", B: "#0099ff" };
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

// ── Breadboard constants ──────────────────────────────────────────
const COLS = 30;
const ROWS_A = ["a", "b", "c", "d", "e"];
const ROWS_B = ["f", "g", "h", "i", "j"];
const HOLE_PX = 12; // hole spacing px — increased for visibility
const GAP_AFTER = new Set([4, 9, 14, 19, 24]);

// ── Breadboard SVG ────────────────────────────────────────────────
// FIX: bbRef is attached to the SVG container div directly here.
// Wire coordinates are stored as SVG-local coords (not page coords).
function Breadboard({ wireStart, wires, placedICs, onHoleClick }) {
  const W = 36 + COLS * (HOLE_PX + 2) + 5 * 6 + HOLE_PX + 16;
  const ROW_H = 14;
  const TOP_RAIL_Y = 6;
  const TOP_VCC_Y = TOP_RAIL_Y + 4;
  const TOP_GND_Y = TOP_RAIL_Y + 18;
  const BODY_Y = TOP_RAIL_Y + 36;
  const TOP_ROWS_H = 5 * ROW_H;
  const CENTER_Y = BODY_Y + TOP_ROWS_H + 2;
  const CENTER_H = 18;
  const BOT_START = CENTER_Y + CENTER_H;
  const BOT_ROWS_H = 5 * ROW_H;
  const BOT_RAIL_Y = BOT_START + BOT_ROWS_H + 6;
  const BOT_VCC_Y = BOT_RAIL_Y + 4;
  const BOT_GND_Y = BOT_RAIL_Y + 18;
  const H = BOT_GND_Y + 16;

  const colX = (c) => {
    const extra = [...GAP_AFTER].filter((g) => g < c).length * 6;
    return 36 + c * (HOLE_PX + 2) + extra + HOLE_PX / 2;
  };

  const wiredSet = new Set(wires.flatMap((w) => [w.from, w.to]));

  // FIX: Holes now have a visible background square to mimic real breadboard holes,
  // plus a larger hit area (transparent rect) for easy clicking.
  const Hole = ({ id, cx, cy, type }) => {
    const isStart = wireStart && wireStart.id === id;
    const isWired = wiredSet.has(id);

    // Outer ring color
    let outerFill = "#c8bfa0",
      holeFill = "#1a1208",
      holeStroke = "#0a0804";
    if (type === "vcc") {
      outerFill = "#cc4444";
      holeFill = "#3a0000";
      holeStroke = "#ff4444";
    } else if (type === "gnd") {
      outerFill = "#4444cc";
      holeFill = "#00003a";
      holeStroke = "#4444ff";
    }
    if (isStart) {
      outerFill = "#ffffff";
      holeFill = "#88ffcc";
      holeStroke = "#00ffaa";
    } else if (isWired) {
      outerFill = "#bb6600";
      holeFill = "#3a1800";
      holeStroke = "#ff8800";
    }

    return (
      <g
        style={{ cursor: "crosshair" }}
        onMouseDown={(e) => {
          e.stopPropagation();
          onHoleClick(id, cx, cy);
        }}
      >
        {/* Transparent hit area — larger for easy clicking */}
        <rect x={cx - 7} y={cy - 7} width={14} height={14} fill="transparent" />
        {/* Outer rim (like a real BB socket) */}
        <rect
          x={cx - 4}
          y={cy - 4}
          width={8}
          height={8}
          rx={1.5}
          fill={outerFill}
        />
        {/* Inner hole */}
        <rect
          x={cx - 2.5}
          y={cy - 2.5}
          width={5}
          height={5}
          rx={1}
          fill={holeFill}
          stroke={holeStroke}
          strokeWidth={0.7}
        />
        {/* Shiny specular dot */}
        <circle
          cx={cx - 1.2}
          cy={cy - 1.2}
          r={0.8}
          fill="rgba(255,255,255,0.25)"
        />
      </g>
    );
  };

  const railHoles = (yBase, prefix, type) =>
    Array.from({ length: COLS }, (_, c) => (
      <Hole
        key={c}
        id={`rail_${prefix}_${c}`}
        cx={colX(c)}
        cy={yBase}
        type={type}
      />
    ));

  const bodyHoles = (rows, yBase) =>
    rows.flatMap((row, r) =>
      Array.from({ length: COLS }, (_, c) => (
        <Hole
          key={`${row}${c}`}
          id={`bb_${c}_${row}`}
          cx={colX(c)}
          cy={yBase + r * ROW_H + 7}
          type="body"
        />
      )),
    );

  return (
    <svg width={W} height={H} style={{ display: "block", userSelect: "none" }}>
      {/* Board body — classic beige breadboard color */}
      <rect
        x={0}
        y={0}
        width={W}
        height={H}
        rx={6}
        fill="#d2c89a"
        stroke="#b8a870"
        strokeWidth={1.5}
      />

      {/* Subtle texture stripes */}
      {Array.from({ length: Math.floor(H / 4) }, (_, i) => (
        <line
          key={i}
          x1={0}
          y1={i * 4}
          x2={W}
          y2={i * 4}
          stroke="rgba(0,0,0,0.03)"
          strokeWidth={1}
        />
      ))}

      {/* Rail backgrounds */}
      <rect
        x={30}
        y={TOP_RAIL_Y}
        width={W - 36}
        height={14}
        rx={3}
        fill="#ffcccc"
        opacity={0.5}
      />
      <rect
        x={30}
        y={TOP_RAIL_Y + 14}
        width={W - 36}
        height={14}
        rx={3}
        fill="#ccccff"
        opacity={0.5}
      />
      <rect
        x={30}
        y={BOT_RAIL_Y}
        width={W - 36}
        height={14}
        rx={3}
        fill="#ffcccc"
        opacity={0.5}
      />
      <rect
        x={30}
        y={BOT_RAIL_Y + 14}
        width={W - 36}
        height={14}
        rx={3}
        fill="#ccccff"
        opacity={0.5}
      />

      {/* Rail red/blue lines */}
      {[
        [TOP_VCC_Y + 3, "#cc2200"],
        [TOP_GND_Y + 3, "#2200cc"],
        [BOT_VCC_Y + 3, "#cc2200"],
        [BOT_GND_Y + 3, "#2200cc"],
      ].map(([y, col], i) => (
        <line
          key={i}
          x1={34}
          y1={y}
          x2={W - 6}
          y2={y}
          stroke={col}
          strokeWidth={1.2}
          opacity={0.8}
        />
      ))}

      {/* Rail labels (+/-) */}
      {[
        ["+", [TOP_VCC_Y, BOT_VCC_Y], "#cc2200"],
        ["-", [TOP_GND_Y, BOT_GND_Y], "#2200cc"],
      ].flatMap(([sym, ys, col]) =>
        ys.map((y, i) => (
          <text
            key={`${sym}${i}`}
            x={16}
            y={y + 9}
            textAnchor="middle"
            fontSize={12}
            fontWeight="bold"
            fill={col}
            fontFamily="monospace"
          >
            {sym}
          </text>
        )),
      )}

      {/* Row labels a-e */}
      {"abcde".split("").map((r, i) => (
        <text
          key={r}
          x={26}
          y={BODY_Y + i * ROW_H + 11}
          textAnchor="end"
          fontSize={8}
          fill="#7a6a4a"
          fontFamily="monospace"
        >
          {r}
        </text>
      ))}
      {"fghij".split("").map((r, i) => (
        <text
          key={r}
          x={26}
          y={BOT_START + i * ROW_H + 11}
          textAnchor="end"
          fontSize={8}
          fill="#7a6a4a"
          fontFamily="monospace"
        >
          {r}
        </text>
      ))}

      {/* Column numbers every 5 */}
      {Array.from(
        { length: COLS },
        (_, c) =>
          c % 5 === 0 && (
            <text
              key={c}
              x={colX(c)}
              y={BODY_Y - 6}
              textAnchor="middle"
              fontSize={7}
              fill="#8a7a5a"
              fontFamily="monospace"
            >
              {c + 1}
            </text>
          ),
      )}

      {/* Center DIP gap */}
      <rect
        x={30}
        y={CENTER_Y}
        width={W - 36}
        height={CENTER_H}
        rx={2}
        fill="#b8a870"
        opacity={0.5}
      />
      <text
        x={W / 2}
        y={CENTER_Y + CENTER_H / 2 + 3}
        textAnchor="middle"
        fontSize={6}
        fill="#7a6040"
        fontFamily="monospace"
        letterSpacing={3}
      >
        IC DIP SLOT
      </text>

      {/* 5-group separator dots */}
      {[...GAP_AFTER].map((c) => {
        const x = colX(c) + HOLE_PX / 2 + 3;
        return (
          <line
            key={c}
            x1={x}
            y1={BODY_Y - 2}
            x2={x}
            y2={BOT_START + BOT_ROWS_H + 2}
            stroke="#9a8860"
            strokeWidth={0.6}
            opacity={0.6}
          />
        );
      })}

      {/* ── HOLES ── */}
      {railHoles(TOP_VCC_Y + 5, "tvcc", "vcc")}
      {railHoles(TOP_GND_Y + 5, "tgnd", "gnd")}
      {bodyHoles(ROWS_A, BODY_Y)}
      {bodyHoles(ROWS_B, BOT_START)}
      {railHoles(BOT_VCC_Y + 5, "bvcc", "vcc")}
      {railHoles(BOT_GND_Y + 5, "bgnd", "gnd")}

      {/* Placed ICs as SVG foreignObject */}
      {placedICs.map((p) => {
        const ic = ICS[p.ic];
        if (!ic) return null;
        const cols = Math.ceil(ic.pins / 2);
        const icW = cols * 13 + 8;
        const icH = 36;
        return (
          <g
            key={p.id}
            transform={`translate(${p.x},${p.y})`}
            style={{ pointerEvents: "none" }}
          >
            {/* Bottom pins (south side) */}
            {Array.from({ length: Math.ceil(ic.pins / 2) }, (_, i) => (
              <rect
                key={`bp${i}`}
                x={4 + i * 13}
                y={icH}
                width={3}
                height={7}
                rx={0.5}
                fill="#b0b0b0"
              />
            ))}
            {/* Top pins (north side) */}
            {Array.from({ length: Math.floor(ic.pins / 2) }, (_, i) => (
              <rect
                key={`tp${i}`}
                x={4 + i * 13}
                y={-7}
                width={3}
                height={7}
                rx={0.5}
                fill="#b0b0b0"
              />
            ))}
            {/* IC body */}
            <rect
              x={0}
              y={0}
              width={icW}
              height={icH}
              rx={3}
              fill={ic.bg}
              stroke="#666"
              strokeWidth={1}
            />
            {/* Notch */}
            <path
              d={`M${icW / 2 - 6},0 Q${icW / 2},8 ${icW / 2 + 6},0`}
              fill="#050508"
              stroke="#444"
              strokeWidth={0.5}
            />
            {/* Label */}
            <text
              x={icW / 2}
              y={14}
              textAnchor="middle"
              fontSize={9}
              fontWeight="bold"
              fill={ic.txt}
              fontFamily="monospace"
            >
              {p.ic}
            </text>
            <text
              x={icW / 2}
              y={26}
              textAnchor="middle"
              fontSize={11}
              fill={ic.txt}
              fontFamily="monospace"
              opacity={0.8}
            >
              {ic.sym}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Wire overlay — FIX: uses SVG-local coords, rendered inside same SVG container ──
// We render wires as an absolute SVG overlay positioned exactly over the breadboard SVG
function WireOverlay({ wires, preview, width, height }) {
  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 20,
      }}
      width={width}
      height={height}
    >
      {wires.map((w) => {
        const mx = (w.ax + w.bx) / 2;
        const dy = Math.abs(w.bx - w.ax) * 0.25 + 10;
        const my = Math.min(w.ay, w.by) - dy;
        return (
          <g key={w.id}>
            {/* Wire shadow */}
            <path
              d={`M${w.ax},${w.ay} Q${mx},${my} ${w.bx},${w.by}`}
              stroke="rgba(0,0,0,0.5)"
              strokeWidth={3.5}
              fill="none"
              strokeLinecap="round"
            />
            {/* Wire */}
            <path
              d={`M${w.ax},${w.ay} Q${mx},${my} ${w.bx},${w.by}`}
              stroke={w.color}
              strokeWidth={2.5}
              fill="none"
              strokeLinecap="round"
              opacity={0.95}
            />
            {/* End dots */}
            <circle cx={w.ax} cy={w.ay} r={3} fill={w.color} />
            <circle cx={w.bx} cy={w.by} r={3} fill={w.color} />
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

// ── IC Tray item ──────────────────────────────────────────────────
function TrayIC({ icKey, onMouseDown }) {
  const ic = ICS[icKey];
  return (
    <div
      onMouseDown={(e) => onMouseDown(e, icKey)}
      title={`${icKey} — ${ic.name} (${ic.pins}-pin)\nDrag onto breadboard`}
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

// ── Breadboard dimensions (must match Breadboard component) ───────
function getBBDimensions() {
  const ROW_H = 14,
    TOP_RAIL_Y = 6;
  const BODY_Y = TOP_RAIL_Y + 36;
  const TOP_ROWS_H = 5 * ROW_H;
  const CENTER_Y = BODY_Y + TOP_ROWS_H + 2;
  const BOT_START = CENTER_Y + 18;
  const BOT_ROWS_H = 5 * ROW_H;
  const BOT_RAIL_Y = BOT_START + BOT_ROWS_H + 6;
  const BOT_GND_Y = BOT_RAIL_Y + 18;
  const H = BOT_GND_Y + 16;
  const W = 36 + COLS * (HOLE_PX + 2) + 5 * 6 + HOLE_PX + 16;
  return { W, H };
}

// ═══════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════
export default function IT300() {
  const [switches, setSwitches] = useState(Array(8).fill(0));
  const [clkHz, setClkHz] = useState(1);
  const [clkOn, setClkOn] = useState(true);
  const [clk, setClk] = useState(0);
  const [pushBtns, setPush] = useState([0, 0]);
  const [wires, setWires] = useState([]);
  const [wireStart, setWireStart] = useState(null); // {id, ax, ay} — SVG-local coords
  const [preview, setPreview] = useState(null);
  const [wireCol, setWireCol] = useState("#e63946");
  const [colIdx, setColIdx] = useState(0);
  const [mode, setMode] = useState("wire");
  const [placedICs, setPlacedICs] = useState([]);
  const [dragging, setDragging] = useState(null);

  // FIX: single ref attached to the wrapper div that contains the BB SVG
  const bbWrapRef = useRef(null);
  const clkRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });

  const { W: bbW, H: bbH } = getBBDimensions();

  const COLORS = useMemo(() => [
    "#e63946",
    "#2196f3",
    "#4caf50",
    "#ff9800",
    "#9c27b0",
    "#00bcd4",
    "#ffeb3b",
    "#ff5722",
    "#f48fb1",
    "#80cbc4",
  ], []);

  // Clock
  useEffect(() => {
    clearInterval(clkRef.current);
    if (!clkOn) {
      setClk(0);
      return;
    }
    clkRef.current = setInterval(() => setClk((c) => c ^ 1), 500 / clkHz);
    return () => clearInterval(clkRef.current);
  }, [clkHz, clkOn]);

  // Global mouse tracking
  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (dragging)
        setDragging((d) =>
          d ? { ...d, ghostX: e.clientX - 40, ghostY: e.clientY - 25 } : null,
        );

      // FIX: preview uses SVG-local coords — convert mouse to SVG space
      if (wireStart && bbWrapRef.current) {
        const rect = bbWrapRef.current.getBoundingClientRect();
        setPreview({
          ax: wireStart.ax,
          ay: wireStart.ay,
          bx: e.clientX - rect.left,
          by: e.clientY - rect.top,
          color: wireCol,
        });
      }
    };
    const onUp = (e) => {
      if (!dragging) return;
      if (bbWrapRef.current) {
        const rect = bbWrapRef.current.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          const x = e.clientX - rect.left - 35;
          const y = e.clientY - rect.top - 28;
          setPlacedICs((p) => [
            ...p,
            { id: Date.now(), ic: dragging.icKey, x, y },
          ]);
        }
      }
      setDragging(null);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, wireStart, wireCol]);

  const dec = switches.reduce((a, b, i) => a + b * (1 << i), 0);

  // FIX: onHoleClick receives SVG-local coords (cx,cy from the SVG).
  // We store them as-is — no page-coord conversion needed.
  const onHoleClick = useCallback(
    (id, svgX, svgY) => {
      if (mode === "delete") {
        setWires((p) => p.filter((w) => w.from !== id && w.to !== id));
        return;
      }
      if (mode !== "wire") return;

      if (!wireStart) {
        setWireStart({ id, ax: svgX, ay: svgY });
      } else {
        if (wireStart.id !== id) {
          setWires((p) => [
            ...p,
            {
              id: Date.now(),
              from: wireStart.id,
              to: id,
              ax: wireStart.ax,
              ay: wireStart.ay,
              bx: svgX,
              by: svgY,
              color: wireCol,
            },
          ]);
          const ni = (colIdx + 1) % COLORS.length;
          setColIdx(ni);
          setWireCol(COLORS[ni]);
        }
        setWireStart(null);
        setPreview(null);
      }
    },
    [mode, wireStart, wireCol, colIdx, COLORS],
  );

  const startTrayDrag = (e, icKey) => {
    e.preventDefault();
    setDragging({ icKey, ghostX: e.clientX - 40, ghostY: e.clientY - 25 });
  };

  const F = "monospace";
  const Sec = ({ title, children, style: st }) => (
    <div
      style={{
        background: "linear-gradient(135deg,#0c1e0c,#162416)",
        border: "1px solid rgba(212,168,67,.22)",
        borderRadius: 5,
        padding: 7,
        marginBottom: 6,
        ...st,
      }}
    >
      <div
        style={{
          fontFamily: F,
          fontSize: 7,
          color: "#d4a843",
          letterSpacing: 2,
          textTransform: "uppercase",
          borderBottom: "1px solid rgba(212,168,67,.18)",
          paddingBottom: 3,
          marginBottom: 5,
          textAlign: "center",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#1a1a1a;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.35}}
        .clk-blink{animation:blink .5s infinite;}
      `}</style>

      <div
        style={{
          fontFamily: F,
          background: "radial-gradient(ellipse at 40% 40%,#3a3a3a,#141414)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: 18,
          userSelect: "none",
        }}
        onMouseLeave={() => {
          setWireStart(null);
          setPreview(null);
        }}
      >
        {/* ── OUTER CHASSIS ── */}
        <div
          style={{
            position: "relative",
            borderRadius: "18px 18px 8px 8px",
            background:
              "linear-gradient(160deg,#e8e8e8,#c0c0c0 40%,#a8a8a8 70%,#909090)",
            padding: "16px 16px 0",
            boxShadow:
              "0 50px 90px rgba(0,0,0,.9),0 10px 20px rgba(0,0,0,.5),inset 0 3px 6px rgba(255,255,255,.5)",
            maxWidth: 1280,
            width: "100%",
          }}
        >
          {/* Right wall */}
          <div
            style={{
              position: "absolute",
              top: 16,
              bottom: 0,
              right: -15,
              width: 15,
              background: "linear-gradient(90deg,#aaa,#666)",
              borderRadius: "0 8px 8px 0",
            }}
          />
          {/* Bottom */}
          <div
            style={{
              position: "absolute",
              bottom: -24,
              left: 8,
              right: 8,
              height: 24,
              background: "linear-gradient(180deg,#888,#505050)",
              borderRadius: "0 0 12px 12px",
              boxShadow: "0 8px 20px rgba(0,0,0,.8)",
            }}
          />

          {/* ── PCB ── */}
          <div
            style={{
              borderRadius: 8,
              padding: 10,
              position: "relative",
              overflow: "hidden",
              background: "#0e2412",
              backgroundImage:
                "radial-gradient(ellipse 55% 35% at 20% 20%,#1b5430,transparent),radial-gradient(ellipse 55% 35% at 80% 80%,#17422a,transparent)",
            }}
          >
            {/* PCB grid */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                backgroundImage:
                  "repeating-linear-gradient(0deg,transparent,transparent 19px,rgba(210,165,60,.04) 20px),repeating-linear-gradient(90deg,transparent,transparent 19px,rgba(210,165,60,.04) 20px)",
              }}
            />

            {/* ════ HEADER ════ */}
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

            {/* ════ TOOLBAR ════ */}
            <div
              style={{
                display: "flex",
                gap: 5,
                marginBottom: 7,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {[
                ["wire", "⚡ WIRE"],
                ["delete", "✂ DELETE"],
              ].map(([m, lbl]) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  style={{
                    background: mode === m ? "#0e2436" : "#050d14",
                    color: mode === m ? "#4fc3f7" : "#3a5566",
                    border: `1px solid ${mode === m ? "#4fc3f7" : "#1e3344"}`,
                    borderRadius: 3,
                    padding: "3px 10px",
                    cursor: "pointer",
                    fontSize: 9,
                    fontFamily: F,
                    letterSpacing: 1,
                  }}
                >
                  {lbl}
                </button>
              ))}
              {mode === "wire" && (
                <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                  <span style={{ fontSize: 7, color: "#446" }}>wire:</span>
                  {COLORS.map((c, i) => (
                    <div
                      key={c}
                      onClick={() => {
                        setWireCol(c);
                        setColIdx(i);
                      }}
                      style={{
                        width: 13,
                        height: 13,
                        borderRadius: "50%",
                        background: c,
                        cursor: "pointer",
                        border:
                          wireCol === c
                            ? "2px solid #fff"
                            : "2px solid transparent",
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </div>
              )}
              {wireStart && (
                <div style={{ fontSize: 8, color: "#4fc3f7", fontFamily: F }}>
                  ● from <b style={{ color: "#fff" }}>{wireStart.id}</b> → click
                  dest hole &nbsp;
                  <span
                    style={{ cursor: "pointer", color: "#f66" }}
                    onClick={() => {
                      setWireStart(null);
                      setPreview(null);
                    }}
                  >
                    ✕
                  </span>
                </div>
              )}
              <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                <button
                  onClick={() => {
                    setWires([]);
                    setWireStart(null);
                    setPreview(null);
                  }}
                  style={{
                    background: "#1e0808",
                    color: "#f44",
                    border: "1px solid #f44",
                    borderRadius: 3,
                    padding: "3px 9px",
                    cursor: "pointer",
                    fontSize: 9,
                    fontFamily: F,
                  }}
                >
                  🗑 Wires
                </button>
                <button
                  onClick={() => setPlacedICs([])}
                  style={{
                    background: "#16081e",
                    color: "#b44fff",
                    border: "1px solid #b44fff",
                    borderRadius: 3,
                    padding: "3px 9px",
                    cursor: "pointer",
                    fontSize: 9,
                    fontFamily: F,
                  }}
                >
                  ✕ ICs
                </button>
              </div>
            </div>

            {/* ════ MAIN 3-COLUMN LAYOUT ════ */}
            {/* FIX: correct column order — left panel | center breadboard | right panel */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "160px 1fr 160px",
                gap: 8,
              }}
            >
              {/* ── LEFT PANEL ── */}
              <div>
                {/* 4-digit 7-seg */}
                <Sec title="7-Segment Display">
                  <div
                    style={{
                      display: "flex",
                      gap: 3,
                      justifyContent: "center",
                      background: "#050200",
                      padding: 7,
                      borderRadius: 5,
                      border: "1px solid #1a0a00",
                    }}
                  >
                    {[
                      Math.floor(dec / 1000) % 10,
                      Math.floor(dec / 100) % 10,
                      Math.floor(dec / 10) % 10,
                      dec % 10,
                    ].map((v, i) => (
                      <Seg7 key={i} val={v} h={44} />
                    ))}
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: 7,
                      color: "#666",
                      marginTop: 4,
                      fontFamily: F,
                    }}
                  >
                    {String(dec).padStart(4, "0")} · 0x
                    {dec.toString(16).toUpperCase().padStart(2, "0")} ·{" "}
                    {dec.toString(2).padStart(8, "0")}b
                  </div>
                </Sec>

                {/* Clock */}
                <Sec title="Clock Generator">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 5,
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        background: "#000",
                        border: "1px solid #181818",
                        borderRadius: 3,
                        padding: "3px 8px",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          color: clkOn && clk ? "#ff8800" : "#332",
                          fontFamily: F,
                        }}
                      >
                        {clkHz}Hz
                      </span>
                      <div
                        className={clkOn && clk ? "clk-blink" : ""}
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          marginLeft: "auto",
                          background: clkOn && clk ? "#ff8800" : "#1a1a1a",
                          boxShadow: clkOn && clk ? "0 0 8px #ff8800" : "none",
                          border: "1px solid #333",
                        }}
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={64}
                    value={clkHz}
                    onChange={(e) => setClkHz(+e.target.value)}
                    style={{
                      width: "100%",
                      accentColor: "#ff8800",
                      marginBottom: 5,
                      cursor: "pointer",
                    }}
                  />
                  <div style={{ display: "flex", gap: 3, marginBottom: 4 }}>
                    {[1, 4, 16, 64].map((hz) => (
                      <button
                        key={hz}
                        onClick={() => setClkHz(hz)}
                        style={{
                          flex: 1,
                          background: clkHz === hz ? "#2a1800" : "#0a0a0a",
                          color: clkHz === hz ? "#ff8800" : "#443322",
                          border: `1px solid ${clkHz === hz ? "#ff8800" : "#221100"}`,
                          borderRadius: 3,
                          padding: "2px 0",
                          fontSize: 7,
                          fontFamily: F,
                          cursor: "pointer",
                        }}
                      >
                        {hz}Hz
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setClkOn((v) => !v)}
                    style={{
                      width: "100%",
                      background: clkOn ? "#0f300f" : "#300f0f",
                      color: clkOn ? "#00ee44" : "#ff4444",
                      border: `1px solid ${clkOn ? "#00ee44" : "#ff4444"}`,
                      borderRadius: 4,
                      padding: "5px 0",
                      fontSize: 9,
                      fontFamily: F,
                      cursor: "pointer",
                    }}
                  >
                    {clkOn ? "● CLK ON" : "○ CLK OFF"}
                  </button>
                </Sec>

                {/* Push switches */}
                <Sec title="Push Switches">
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      justifyContent: "center",
                    }}
                  >
                    {[0, 1].map((i) => (
                      <div key={i} style={{ textAlign: "center" }}>
                        <button
                          onMouseDown={() =>
                            setPush((p) => {
                              const n = [...p];
                              n[i] = 1;
                              return n;
                            })
                          }
                          onMouseUp={() =>
                            setPush((p) => {
                              const n = [...p];
                              n[i] = 0;
                              return n;
                            })
                          }
                          onMouseLeave={() =>
                            setPush((p) => {
                              const n = [...p];
                              n[i] = 0;
                              return n;
                            })
                          }
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: pushBtns[i] ? "#bb3300" : "#2a1000",
                            border: "3px solid #886644",
                            cursor: "pointer",
                            boxShadow: pushBtns[i]
                              ? "inset 0 2px 4px rgba(0,0,0,.5)"
                              : "0 4px 0 #000",
                            transform: pushBtns[i] ? "translateY(3px)" : "none",
                            transition: "transform .07s,box-shadow .07s",
                            color: "#ffaa44",
                            fontSize: 9,
                            fontFamily: F,
                          }}
                        >
                          S{i + 1}
                        </button>
                        <div
                          style={{
                            display: "flex",
                            gap: 4,
                            justifyContent: "center",
                            marginTop: 4,
                          }}
                        >
                          <LED on={!!pushBtns[i]} c="Y" />
                          <span
                            style={{
                              fontSize: 6,
                              color: "#777",
                              fontFamily: F,
                            }}
                          >
                            Q
                          </span>
                          <LED on={!pushBtns[i]} c="G" />
                          <span
                            style={{
                              fontSize: 6,
                              color: "#777",
                              fontFamily: F,
                            }}
                          >
                            Q̄
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Sec>

                {/* Logic Probe */}
                <Sec title="Logic Probe">
                  {[
                    ["HI", clk === 1, "G"],
                    ["LO", clk === 0, "R"],
                    ["PULSE", clkOn, "Y"],
                    ["HI-Z", false, "B"],
                  ].map(([lbl, on, c]) => (
                    <div
                      key={lbl}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 5,
                      }}
                    >
                      <LED on={on} c={c} size={11} />
                      <span
                        style={{ fontSize: 8, color: "#aaa", fontFamily: F }}
                      >
                        {lbl}
                      </span>
                    </div>
                  ))}
                </Sec>

                {/* Potentiometers */}
                <Sec title="Potentiometers">
                  <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    {[
                      ["1K", 110],
                      ["10K", 200],
                    ].map(([lbl, angle]) => (
                      <div key={lbl} style={{ textAlign: "center" }}>
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            margin: "0 auto 4px",
                            background:
                              "radial-gradient(circle at 36% 34%,#999,#2a2a2a)",
                            border: "2px solid #555",
                            position: "relative",
                            cursor: "pointer",
                            boxShadow: "0 4px 10px rgba(0,0,0,.8)",
                            transform: `rotate(${angle}deg)`,
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: 3,
                              left: "50%",
                              transform: "translateX(-50%)",
                              width: 3,
                              height: 11,
                              background: "#e0e0e0",
                              borderRadius: 2,
                            }}
                          />
                        </div>
                        <div
                          style={{
                            fontSize: 7,
                            color: "#d4a843",
                            fontFamily: F,
                          }}
                        >
                          {lbl}
                        </div>
                      </div>
                    ))}
                  </div>
                </Sec>
              </div>

              {/* ── CENTER (BREADBOARD) ── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Sec title="Solderless Breadboard — 2×30 columns × 10 rows + 4 power rails">
                  {/* FIX: bbWrapRef attached here — this is the coordinate origin for all wires */}
                  <div
                    ref={bbWrapRef}
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <Breadboard
                      wireStart={wireStart}
                      wires={wires}
                      placedICs={placedICs}
                      onHoleClick={onHoleClick}
                    />
                    {/* FIX: WireOverlay uses SVG-local coords — rendered over the SVG */}
                    <WireOverlay
                      wires={wires}
                      preview={preview}
                      width={bbW}
                      height={bbH}
                    />
                  </div>
                </Sec>

                {/* 8-bit switches */}
                <Sec title="Logic Input Switches  A – H  (8-bit)">
                  <div
                    style={{
                      display: "flex",
                      gap: 5,
                      justifyContent: "center",
                    }}
                  >
                    {switches.map((v, i) => (
                      <ToggleSW
                        key={i}
                        label={String.fromCharCode(65 + i)}
                        val={v}
                        onToggle={() =>
                          setSwitches((p) => {
                            const n = [...p];
                            n[i] ^= 1;
                            return n;
                          })
                        }
                      />
                    ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 5,
                      justifyContent: "center",
                      marginTop: 5,
                    }}
                  >
                    {switches.map((v, i) => (
                      <LED key={i} on={!!v} c="G" />
                    ))}
                  </div>
                  <div
                    style={{
                      fontFamily: F,
                      fontSize: 16,
                      color: "#00ee44",
                      background: "#000",
                      padding: "5px 10px",
                      borderRadius: 3,
                      textAlign: "center",
                      letterSpacing: 4,
                      border: "1px solid #0a1a0a",
                      marginTop: 5,
                    }}
                  >
                    {switches.slice().reverse().join("")}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      marginTop: 4,
                      fontSize: 9,
                      color: "#5a7a5a",
                      fontFamily: F,
                    }}
                  >
                    <span>DEC: {dec}</span>
                    <span>
                      HEX: 0x{dec.toString(16).toUpperCase().padStart(2, "0")}
                    </span>
                    <span>OCT: {dec.toString(8).padStart(3, "0")}</span>
                  </div>
                </Sec>

                {/* IC Tray */}
                <Sec title="IC Component Tray — drag onto breadboard">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {Object.keys(ICS).map((k) => (
                      <TrayIC key={k} icKey={k} onMouseDown={startTrayDrag} />
                    ))}
                  </div>
                  <div
                    style={{
                      fontSize: 7,
                      color: "#334",
                      fontFamily: F,
                      marginTop: 5,
                      textAlign: "center",
                    }}
                  >
                    Hold + drag IC chip → release over breadboard to place
                  </div>
                </Sec>
              </div>

              {/* ── RIGHT PANEL ── */}
              <div>
                {/* State monitors */}
                <Sec title="State Monitors (8)">
                  <div
                    style={{
                      fontSize: 6,
                      color: "#f44",
                      marginBottom: 3,
                      letterSpacing: 1,
                      fontFamily: F,
                    }}
                  >
                    DATA BUS D0–D7
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4,1fr)",
                      gap: 4,
                      marginBottom: 7,
                    }}
                  >
                    {switches.map((v, i) => (
                      <div key={i} style={{ textAlign: "center" }}>
                        <LED on={!!v} c="R" size={11} />
                        <div
                          style={{
                            fontSize: 6,
                            color: "#888",
                            fontFamily: F,
                            marginTop: 1,
                          }}
                        >
                          D{i}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      fontSize: 6,
                      color: "#4e4",
                      marginBottom: 3,
                      letterSpacing: 1,
                      fontFamily: F,
                    }}
                  >
                    LOGIC OUT Y0–Y7
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4,1fr)",
                      gap: 4,
                      marginBottom: 7,
                    }}
                  >
                    {switches.map((v, i) => (
                      <div key={i} style={{ textAlign: "center" }}>
                        <LED on={!!v} c="G" size={11} />
                        <div
                          style={{
                            fontSize: 6,
                            color: "#888",
                            fontFamily: F,
                            marginTop: 1,
                          }}
                        >
                          Y{i}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      fontSize: 6,
                      color: "#fc0",
                      marginBottom: 3,
                      letterSpacing: 1,
                      fontFamily: F,
                    }}
                  >
                    FLAGS
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4,1fr)",
                      gap: 4,
                    }}
                  >
                    {[
                      clk,
                      pushBtns[0],
                      pushBtns[1],
                      0,
                      0,
                      0,
                      0,
                      dec > 127 ? 1 : 0,
                    ].map((v, i) => (
                      <div key={i} style={{ textAlign: "center" }}>
                        <LED on={!!v} c="Y" size={11} />
                        <div
                          style={{
                            fontSize: 5,
                            color: "#888",
                            fontFamily: F,
                            marginTop: 1,
                          }}
                        >
                          {["CK", "P1", "P2", "—", "—", "—", "—", "OV"][i]}
                        </div>
                      </div>
                    ))}
                  </div>
                </Sec>

                {/* Complement outputs */}
                <Sec title="Q / Q̄ Outputs">
                  {switches.slice(0, 4).map((v, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginBottom: 5,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 8,
                          color: "#d4a843",
                          fontFamily: F,
                          width: 14,
                        }}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <LED on={!!v} c="G" />
                      <span
                        style={{ fontSize: 6, color: "#666", fontFamily: F }}
                      >
                        Q
                      </span>
                      <div style={{ flex: 1 }} />
                      <LED on={!v} c="R" />
                      <span
                        style={{ fontSize: 6, color: "#666", fontFamily: F }}
                      >
                        Q̄
                      </span>
                    </div>
                  ))}
                </Sec>

                {/* I/O Terminals */}
                <Sec title="I/O Terminals">
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 4,
                    }}
                  >
                    {[
                      "VCC",
                      "GND",
                      "+5V",
                      "-5V",
                      "+15V",
                      "-15V",
                      "CLK",
                      "CLK̄",
                    ].map((lbl) => (
                      <div
                        key={lbl}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <div
                          style={{
                            width: 14,
                            height: 14,
                            borderRadius: 2,
                            flexShrink: 0,
                            background: "linear-gradient(135deg,#aaa,#555)",
                            border: "1px solid #333",
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%,-50%)",
                              width: 7,
                              height: 1.5,
                              background: "#222",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%,-50%)",
                              width: 1.5,
                              height: 7,
                              background: "#222",
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: 6.5,
                            color: "#999",
                            fontFamily: F,
                          }}
                        >
                          {lbl}
                        </span>
                      </div>
                    ))}
                  </div>
                </Sec>

                {/* Board info */}
                <Sec title="Board Info">
                  <div
                    style={{
                      fontSize: 7,
                      color: "#446",
                      lineHeight: 2,
                      fontFamily: F,
                    }}
                  >
                    <div>
                      Wires:{" "}
                      <span style={{ color: "#6699ff" }}>{wires.length}</span>
                    </div>
                    <div>
                      ICs on board:{" "}
                      <span style={{ color: "#bb44ff" }}>
                        {placedICs.length}
                      </span>
                    </div>
                    <div>
                      Rail +: <span style={{ color: "#f44" }}>+5V DC</span>
                    </div>
                    <div>
                      Rail −: <span style={{ color: "#66f" }}>GND</span>
                    </div>
                    <div>
                      Clock:{" "}
                      <span style={{ color: "#ff8800" }}>
                        {clkOn ? `${clkHz}Hz` : "OFF"}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 6,
                      color: "#2a3a2a",
                      lineHeight: 1.8,
                      fontFamily: F,
                    }}
                  >
                    1. Click WIRE mode
                    <br />
                    2. Click hole → click hole
                    <br />
                    3. Drag IC from tray below
                    <br />
                    4. Release over breadboard
                  </div>
                </Sec>
              </div>
            </div>

            {/* ════ STATUS BAR ════ */}
            <div
              style={{
                marginTop: 8,
                padding: "5px 12px",
                background: "linear-gradient(90deg,#030b18,#060e22,#030b18)",
                border: "1px solid #0c1c36",
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 8,
                color: "#2a5a7a",
                fontFamily: F,
              }}
            >
              <span style={{ color: "#ff8800" }}>
                CLK {clkOn ? `${clkHz}Hz` : "OFF"}{" "}
                {clkOn ? (clk ? "▐█" : "░░") : ""}
              </span>
              <span style={{ color: "#334" }}>|</span>
              <span>
                SW:{" "}
                <span style={{ color: "#00ee44" }}>
                  {switches.slice().reverse().join("")}b
                </span>{" "}
                ={dec}
              </span>
              <span style={{ color: "#334" }}>|</span>
              <span>
                WIRES:<span style={{ color: "#6699ff" }}> {wires.length}</span>
              </span>
              <span style={{ color: "#334" }}>|</span>
              <span>
                ICs:
                <span style={{ color: "#bb44ff" }}> {placedICs.length}</span>
              </span>
              <span style={{ color: "#334" }}>|</span>
              <span>
                MODE:
                <span style={{ color: "#88bbdd" }}> {mode.toUpperCase()}</span>
              </span>
              <span style={{ marginLeft: "auto", color: "#14243a" }}>
                ∞ INFINIT TECHNOLOGIES · IT-300 DIGITAL LOGIC TRAINING SYSTEM
              </span>
            </div>
          </div>
        </div>

        {/* ── DRAG GHOST ── */}
        {dragging && (
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
                background: `linear-gradient(160deg,${ICS[dragging.icKey].bg},#080808)`,
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
                  color: ICS[dragging.icKey].txt,
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
                  color: ICS[dragging.icKey].txt,
                  textAlign: "center",
                }}
              >
                {ICS[dragging.icKey].sym}
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
                {ICS[dragging.icKey].name}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
