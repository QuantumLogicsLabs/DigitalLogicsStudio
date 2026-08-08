import { memo } from "react";
import { ICS } from "../utils/icCatalog";
import { IC_LOGIC } from "../utils/simulationEngine";
import { COLS, ROWS_A, ROWS_B, HOLE_PX, GAP_AFTER, colXForBB } from "../utils/breadboardLayout";

// ── Breadboard SVG ────────────────────────────────────────────────
// bbRef (attached by the parent) is the coordinate origin for all wires —
// wire coordinates are stored as SVG-local coords (not page coords).
function Breadboard({ wireStart, wires, placedICs, onHoleClick, onICMouseDown, onICContextMenu, mode, onICDelete, poweredIds }) {
  const W = 36 + COLS * (HOLE_PX + 2) + 5 * 6 + HOLE_PX + 16;
  const ROW_H = 14;
  const IC_BODY_H = 24;
  const IC_PIN_H = 7;
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

  const colX = colXForBB;

  const wiredSet = new Set(wires.flatMap((w) => [w.from, w.to]));

  // Holes have a visible background square to mimic real breadboard holes,
  // plus a larger hit area (transparent rect) for easy clicking.
  const Hole = ({ id, cx, cy, type }) => {
    const isStart = wireStart && wireStart.id === id;
    const isWired = wiredSet.has(id);
    const isCoveredByIC = placedICs.some((p) => {
      const ic = ICS[p.ic];
      if (!ic) return false;
      const cols = Math.ceil(ic.pins / 2);
      const icW = cols * 13 + 8;
      return (
        cx >= p.x &&
        cx <= p.x + icW &&
        cy >= p.y - IC_PIN_H &&
        cy <= p.y + IC_BODY_H + IC_PIN_H
      );
    });

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
          if (isCoveredByIC) return;
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
        if (!ic || p.col === undefined) return null;
        const cols = Math.ceil(ic.pins / 2);
        // icW matches the actual hole-grid span (GAP_AFTER extra gaps
        // included) — a fixed cols*13+8 would drift once an IC crosses a
        // group boundary.
        const icW = colX(p.col + cols - 1) - colX(p.col) + 16;
        const icH = IC_BODY_H;
        // column-index i (0-based, left to right) pixel offset — centers
        // every pin exactly over its real breadboard hole.
        const pinX = (i) => colX(p.col + i) - p.x - 1.5; // 1.5 = half of 3px pin width
        return (
          <g
            key={p.id}
            transform={`translate(${p.x},${p.y})`}
            style={{ cursor: "grab" }}
            onMouseDown={(e) => {
              if (e.button !== 0) return; // ignore right/middle click — only left-click starts drag

              e.stopPropagation();
              if (mode === "delete") {
                onICDelete?.(p.id); // delete mode: click = remove IC
                return;
              }
              onICMouseDown(p.id, p.ic, e.clientX, e.clientY);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onICContextMenu?.(p.ic, e.clientX, e.clientY);
            }}
          >
            {/* Bottom pins (south side) */}
            {Array.from({ length: Math.ceil(ic.pins / 2) }, (_, i) => (
              <rect
                key={`bp${i}`}
                x={pinX(i)}
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
                x={pinX(i)}
                y={-IC_PIN_H}
                width={3}
                height={IC_PIN_H}
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
            {/* Unpowered warning — VCC/GND pin isn't wired to a rail */}
            {poweredIds && !poweredIds.has(p.id) && (
              <g>
                <circle cx={icW - 5} cy={5} r={4} fill="#ff2222" stroke="#500" strokeWidth={0.6} />
                <text x={icW - 5} y={7.5} textAnchor="middle" fontSize={6} fontWeight="bold" fill="#fff">!</text>
                <title>{`${p.ic}: not powered — wire pin ${IC_LOGIC[p.ic]?.vcc} to +rail and pin ${IC_LOGIC[p.ic]?.gnd} to -rail`}</title>
              </g>
            )}
            {/* Label */}
            <text
              x={icW / 2}
              y={12}
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
              y={20}
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

export default memo(Breadboard);
