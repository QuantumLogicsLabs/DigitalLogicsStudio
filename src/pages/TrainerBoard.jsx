import { useState, useEffect, useCallback, useRef } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const COLS = 63;
const ROWS = 10;
const CELL = 14;
const GAP = 2;
const PITCH = CELL + GAP;

// IC definitions: { name, pins (left top-to-bottom, right bottom-to-top like real DIP) }
const IC_DEFS = {
  7408: {
    name: "74HC08 AND×4",
    cols: 7,
    pins: 14,
    color: "#1a1a2e",
    logic: (inputs) => ({
      3: inputs[0] & inputs[1],
      6: inputs[3] & inputs[4],
      8: inputs[6] & inputs[7],
      11: inputs[9] & inputs[10],
    }),
    pinNames: [
      "A1",
      "B1",
      "Y1",
      "A2",
      "B2",
      "Y2",
      "GND",
      "Y3",
      "A3",
      "B3",
      "Y4",
      "A4",
      "B4",
      "VCC",
    ],
  },
  7432: {
    name: "74HC32 OR×4",
    cols: 7,
    pins: 14,
    color: "#1a2e1a",
    logic: (inputs) => ({
      3: inputs[0] | inputs[1],
      6: inputs[3] | inputs[4],
      8: inputs[6] | inputs[7],
      11: inputs[9] | inputs[10],
    }),
    pinNames: [
      "A1",
      "B1",
      "Y1",
      "A2",
      "B2",
      "Y2",
      "GND",
      "Y3",
      "A3",
      "B3",
      "Y4",
      "A4",
      "B4",
      "VCC",
    ],
  },
  7404: {
    name: "74HC04 NOT×6",
    cols: 7,
    pins: 14,
    color: "#2e1a1a",
    logic: (inputs) => ({
      2: inputs[0] ^ 1,
      4: inputs[2] ^ 1,
      6: inputs[4] ^ 1,
      8: inputs[6] ^ 1,
      10: inputs[8] ^ 1,
      12: inputs[10] ^ 1,
    }),
    pinNames: [
      "A1",
      "Y1",
      "A2",
      "Y2",
      "A3",
      "Y3",
      "GND",
      "Y4",
      "A4",
      "Y5",
      "A5",
      "Y6",
      "A6",
      "VCC",
    ],
  },
  7486: {
    name: "74HC86 XOR×4",
    cols: 7,
    pins: 14,
    color: "#2e2e1a",
    logic: (inputs) => ({
      3: inputs[0] ^ inputs[1],
      6: inputs[3] ^ inputs[4],
      8: inputs[6] ^ inputs[7],
      11: inputs[9] ^ inputs[10],
    }),
    pinNames: [
      "A1",
      "B1",
      "Y1",
      "A2",
      "B2",
      "Y2",
      "GND",
      "Y3",
      "A3",
      "B3",
      "Y4",
      "A4",
      "B4",
      "VCC",
    ],
  },
};

const COLORS = [
  "#e63946",
  "#2196f3",
  "#4caf50",
  "#ff9800",
  "#9c27b0",
  "#00bcd4",
  "#f06292",
  "#8bc34a",
  "#ffc107",
  "#03a9f4",
];

// ─── Utility ─────────────────────────────────────────────────────────────────
function pinToHole(col, row) {
  // col: 0-based breadboard column, row: 0-based row
  return { col, row };
}

function holePos(col, row) {
  // Returns SVG x,y center of a breadboard hole
  // Layout: top power rail (rows 0-1), main grid rows 2-6, gap, main grid rows 7-11 (rows 7-11 mapped to 5-9 visually), bottom power rail (rows 12-13)
  const LEFT_MARGIN = 36;
  const TOP_MARGIN = 48;
  const RAIL_H = PITCH * 2;
  const MAIN_H = PITCH * 5;
  const GAP_H = PITCH;

  let x = LEFT_MARGIN + col * PITCH + PITCH / 2;
  let y;

  if (row < 2) {
    // Top power rail
    y = TOP_MARGIN + row * PITCH + PITCH / 2;
  } else if (row < 7) {
    // Top main grid (a-e)
    y = TOP_MARGIN + RAIL_H + 8 + (row - 2) * PITCH + PITCH / 2;
  } else if (row < 12) {
    // Bottom main grid (f-j)
    y =
      TOP_MARGIN + RAIL_H + 8 + MAIN_H + GAP_H + (row - 7) * PITCH + PITCH / 2;
  } else {
    // Bottom power rail
    y =
      TOP_MARGIN +
      RAIL_H +
      8 +
      MAIN_H +
      GAP_H +
      MAIN_H +
      8 +
      (row - 12) * PITCH +
      PITCH / 2;
  }
  return { x, y };
}

// ─── Breadboard SVG dims
const BB_LEFT = 36;
const BB_TOP = 48;
const RAIL_H = PITCH * 2;
const MAIN_H = PITCH * 5;
const GAP_H = PITCH;
const BB_W = COLS * PITCH + 12;
const BB_H = RAIL_H * 2 + MAIN_H * 2 + GAP_H + 16 + 16;

// ─── Components ──────────────────────────────────────────────────────────────

function Hole({ col, row, netVal, onMouseDown, onMouseEnter, isHighlighted }) {
  const { x, y } = holePos(col, row);
  const filled = netVal !== undefined && netVal !== null;
  const color = filled ? (netVal === 1 ? "#ff6b35" : "#334") : "#1a1a2a";
  const border = isHighlighted ? "#fff" : filled ? "#ff6b35" : "#2a2a3a";

  return (
    <circle
      cx={x}
      cy={y}
      r={4.5}
      fill={color}
      stroke={border}
      strokeWidth={isHighlighted ? 2 : 1}
      style={{ cursor: "crosshair" }}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown(col, row);
      }}
      onMouseEnter={() => onMouseEnter(col, row)}
    />
  );
}

function Wire({ wire, nets }) {
  const p1 = holePos(wire.c1, wire.r1);
  const p2 = holePos(wire.c2, wire.r2);
  const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 - 18 };
  const val = nets[wire.net];
  const active = val === 1;
  const baseColor = wire.color;

  return (
    <g>
      <path
        d={`M${p1.x},${p1.y} Q${mid.x},${mid.y} ${p2.x},${p2.y}`}
        fill="none"
        stroke={active ? "#ff6b35" : baseColor}
        strokeWidth={active ? 4 : 3}
        strokeLinecap="round"
        opacity={0.9}
      />
      <circle cx={p1.x} cy={p1.y} r={5} fill={active ? "#ff6b35" : baseColor} />
      <circle cx={p2.x} cy={p2.y} r={5} fill={active ? "#ff6b35" : baseColor} />
    </g>
  );
}

function ICChip({ ic, nets, onPinClick }) {
  const def = IC_DEFS[ic.type];
  if (!def) return null;
  const halfPins = def.pins / 2;
  const chipW = def.cols * PITCH;
  const chipH = 2 * PITCH;

  // IC sits across the middle gap between row 6 and row 7 (indices)
  // Pin 1 top-left, goes down left side then up right side
  const pinPositions = [];
  for (let i = 0; i < halfPins; i++) {
    const col = ic.col + i;
    pinPositions.push({ pin: i + 1, col, row: 6, side: "top" }); // connects to row 6 (e row)
  }
  for (let i = 0; i < halfPins; i++) {
    const col = ic.col + def.cols - 1 - i;
    pinPositions.push({ pin: halfPins + i + 1, col, row: 7, side: "bottom" }); // connects to row 7 (f row)
  }

  // Top-left corner of chip body
  const tl = holePos(ic.col, 6);
  const br = holePos(ic.col + def.cols - 1, 7);
  const cx = (tl.x - PITCH / 2 + br.x + PITCH / 2) / 2;
  const cy = (tl.y + br.y) / 2;
  const bw = br.x - tl.x + PITCH;
  const bh = br.y - tl.y + PITCH / 2;

  return (
    <g>
      {/* Chip body */}
      <rect
        x={tl.x - PITCH / 2}
        y={tl.y - 4}
        width={bw}
        height={bh}
        rx={4}
        fill={def.color}
        stroke="#444"
        strokeWidth={1.5}
      />
      {/* Notch */}
      <ellipse
        cx={cx}
        cy={tl.y - 4}
        rx={6}
        ry={4}
        fill={def.color}
        stroke="#444"
        strokeWidth={1}
      />
      {/* Label */}
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#eee"
        fontSize={9}
        fontFamily="monospace"
        fontWeight="bold"
      >
        {ic.type}
      </text>
      {/* Pins */}
      {pinPositions.map(({ pin, col, row, side }) => {
        const hp = holePos(col, row);
        const pinY = side === "top" ? hp.y + 6 : hp.y - 6;
        const netKey = `ic_${ic.id}_${pin}`;
        const val = nets[netKey];
        return (
          <g key={pin}>
            <line
              x1={hp.x}
              y1={hp.y}
              x2={hp.x}
              y2={pinY}
              stroke="#aaa"
              strokeWidth={1.5}
            />
            <circle
              cx={hp.x}
              cy={hp.y}
              r={3.5}
              fill={val === 1 ? "#ff6b35" : "#222"}
              stroke="#999"
              strokeWidth={1}
              style={{ cursor: "pointer" }}
              onClick={() => onPinClick && onPinClick(ic, pin, col, row)}
            />
            <text
              x={hp.x}
              y={side === "top" ? hp.y - 8 : hp.y + 12}
              textAnchor="middle"
              fill="#888"
              fontSize={7}
              fontFamily="monospace"
            >
              {pin}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function LED({ x, y, val, label, color }) {
  const on = val === 1;
  return (
    <g>
      {/* Base */}
      <rect
        x={x - 10}
        y={y - 6}
        width={20}
        height={28}
        rx={3}
        fill="#222"
        stroke="#444"
        strokeWidth={1}
      />
      {/* LED lens */}
      <ellipse
        cx={x}
        cy={y + 6}
        rx={8}
        ry={9}
        fill={on ? color : "#333"}
        stroke={on ? color : "#555"}
        strokeWidth={on ? 2 : 1}
        opacity={on ? 1 : 0.5}
      />
      {on && (
        <ellipse
          cx={x - 2}
          cy={y + 3}
          rx={2.5}
          ry={3}
          fill="rgba(255,255,255,0.4)"
        />
      )}
      {/* Leads */}
      <line
        x1={x - 3}
        y1={y + 15}
        x2={x - 3}
        y2={y + 22}
        stroke="#aaa"
        strokeWidth={1.5}
      />
      <line
        x1={x + 3}
        y1={y + 15}
        x2={x + 3}
        y2={y + 22}
        stroke="#aaa"
        strokeWidth={1.5}
      />
      <text
        x={x}
        y={y - 10}
        textAnchor="middle"
        fill="#aaa"
        fontSize={9}
        fontFamily="monospace"
      >
        {label}
      </text>
    </g>
  );
}

function SevenSegDisplay({ x, y, value }) {
  const digits = [
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
  const segs = value >= 0 && value <= 9 ? digits[value] : [0, 0, 0, 0, 0, 0, 0];
  const on = "#ff4500";
  const off = "#1a0a00";
  const sw = 4;
  const sl = 22;

  const segPath = (s) => {
    switch (s) {
      case 0:
        return `M${x + 4},${y + 2} h${sl - 8}`; // top
      case 1:
        return `M${x + sl - 2},${y + 4} v${sl - 8}`; // top-right
      case 2:
        return `M${x + sl - 2},${y + sl - 2} v${sl - 8}`; // bot-right
      case 3:
        return `M${x + 4},${y + sl * 2 - 2} h${sl - 8}`; // bottom
      case 4:
        return `M${x + 2},${y + sl - 2} v${sl - 8}`; // bot-left
      case 5:
        return `M${x + 2},${y + 4} v${sl - 8}`; // top-left
      case 6:
        return `M${x + 4},${y + sl - 1} h${sl - 8}`; // middle
      default:
        return "";
    }
  };

  return (
    <g>
      <rect
        x={x - 4}
        y={y - 4}
        width={sl + 8}
        height={sl * 2 + 8}
        rx={3}
        fill="#0d0d0d"
        stroke="#333"
        strokeWidth={1}
      />
      {[0, 1, 2, 3, 4, 5, 6].map((s) => (
        <path
          key={s}
          d={segPath(s)}
          stroke={segs[s] ? on : off}
          strokeWidth={sw}
          strokeLinecap="round"
          fill="none"
        />
      ))}
    </g>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DLDTrainerBoard() {
  // Board state
  const [switches, setSwitches] = useState(Array(8).fill(0));
  const [wires, setWires] = useState([]);
  const [ics, setIcs] = useState([]);
  const [nets, setNets] = useState({});
  const [clock, setClock] = useState(0);
  const [clockHz, setClockHz] = useState(2);
  const [clockEnabled, setClockEnabled] = useState(true);
  const [wireStart, setWireStart] = useState(null);
  const [wireColor, setWireColor] = useState(COLORS[0]);
  const [hoveredHole, setHoveredHole] = useState(null);
  const [mode, setMode] = useState("wire"); // wire | ic | delete
  const [selectedIC, setSelectedIC] = useState("7408");
  const [colorIdx, setColorIdx] = useState(0);
  const [sevenSegVal, setSevenSegVal] = useState(0);
  const clockRef = useRef();

  // Clock ticker
  useEffect(() => {
    if (!clockEnabled) {
      setClock(0);
      return;
    }
    clockRef.current = setInterval(
      () => setClock((c) => c ^ 1),
      1000 / (clockHz * 2),
    );
    return () => clearInterval(clockRef.current);
  }, [clockHz, clockEnabled]);

  // Net solver: propagate signals through wires and ICs
  const solveNets = useCallback(() => {
    // Build adjacency: hole key -> net signal
    const holeKey = (c, r) => `${c}_${r}`;
    const signals = {};

    // Power rails: top rail row0 = VCC(1), row1 = GND(0), bottom row12=VCC, row13=GND
    for (let c = 0; c < COLS; c++) {
      signals[holeKey(c, 0)] = 1;
      signals[holeKey(c, 1)] = 0;
      signals[holeKey(c, 12)] = 1;
      signals[holeKey(c, 13)] = 0;
    }

    // Switches drive rows: switch i drives col=i*2, row=2..6 (top half) with value
    switches.forEach((val, i) => {
      const col = 4 + i * 4;
      for (let r = 2; r <= 6; r++) signals[holeKey(col, r)] = val;
    });

    // Clock on col 0, rows 2-6
    for (let r = 2; r <= 6; r++) signals[holeKey(0, r)] = clock;

    // Wire connections: union-find style propagation
    const unionFind = {};
    const find = (k) => {
      if (!unionFind[k]) unionFind[k] = k;
      return unionFind[k] === k ? k : (unionFind[k] = find(unionFind[k]));
    };
    const unite = (a, b) => {
      unionFind[find(a)] = find(b);
    };

    // Breadboard internal connections: all holes in same column, same half (rows 2-6 or 7-11) are connected
    for (let c = 0; c < COLS; c++) {
      const keys2_6 = [2, 3, 4, 5, 6].map((r) => holeKey(c, r));
      const keys7_11 = [7, 8, 9, 10, 11].map((r) => holeKey(c, r));
      for (let i = 1; i < keys2_6.length; i++) unite(keys2_6[0], keys2_6[i]);
      for (let i = 1; i < keys7_11.length; i++) unite(keys7_11[0], keys7_11[i]);
      // Power rails: rows 0,1 internal connection per group of 5
      const pg = Math.floor(c / 5);
      if (c % 5 !== 0) {
        unite(holeKey(c, 0), holeKey(c - 1, 0));
        unite(holeKey(c, 1), holeKey(c - 1, 1));
        unite(holeKey(c, 12), holeKey(c - 1, 12));
        unite(holeKey(c, 13), holeKey(c - 1, 13));
      }
    }

    // Wire connections
    wires.forEach((w) => unite(holeKey(w.c1, w.r1), holeKey(w.c2, w.r2)));

    // Propagate known signals through union-find
    const netSignals = {};
    Object.entries(signals).forEach(([k, v]) => {
      const root = find(k);
      if (netSignals[root] === undefined) netSignals[root] = v;
      else if (netSignals[root] !== v) netSignals[root] = 1; // conflict: default 1
    });

    // IC logic
    ics.forEach((ic) => {
      const def = IC_DEFS[ic.type];
      if (!def) return;
      const halfPins = def.pins / 2;
      // Get pin hole keys
      const getPinHole = (pin) => {
        if (pin <= halfPins) {
          return holeKey(ic.col + pin - 1, 6);
        } else {
          const idx = pin - halfPins - 1;
          return holeKey(ic.col + halfPins - 1 - idx, 7);
        }
      };
      const inputs = [];
      for (let p = 1; p <= def.pins; p++) {
        const k = getPinHole(p);
        const root = find(k);
        inputs.push(netSignals[root] ?? 0);
      }
      const outputs = def.logic(inputs);
      Object.entries(outputs).forEach(([pin, val]) => {
        const k = getPinHole(parseInt(pin));
        const root = find(k);
        netSignals[root] = val;
        // Propagate back
        for (let r = 2; r <= 11; r++) {
          const hk = holeKey(
            parseInt(pin) <= halfPins
              ? ic.col + parseInt(pin) - 1
              : ic.col + halfPins - 1 - (parseInt(pin) - halfPins - 1),
            r,
          );
          const hr = find(hk);
          netSignals[hr] = val;
        }
      });
    });

    // Resolve all holes
    const resolved = {};
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < 14; r++) {
        const k = holeKey(c, r);
        const root = find(k);
        resolved[k] = netSignals[root] ?? 0;
      }
    }

    // LED outputs: last 8 columns top section, row 5
    const ledVals = [];
    for (let i = 0; i < 8; i++) {
      const col = COLS - 2 - i * 3;
      ledVals.push(resolved[holeKey(col, 5)] ?? 0);
    }

    // 7-seg: read 4 bits from cols 50-53, row 9
    const bits = [
      resolved[holeKey(50, 9)],
      resolved[holeKey(51, 9)],
      resolved[holeKey(52, 9)],
      resolved[holeKey(53, 9)],
    ];
    const seg =
      (bits[3] ?? 0) * 8 +
      (bits[2] ?? 0) * 4 +
      (bits[1] ?? 0) * 2 +
      (bits[0] ?? 0);
    setSevenSegVal(seg > 9 ? -1 : seg);

    setNets({ ...resolved, ledVals });
  }, [switches, wires, ics, clock]);

  useEffect(() => {
    solveNets();
  }, [solveNets]);

  // Wire drawing
  const handleHoleDown = (col, row) => {
    if (mode === "wire") {
      if (!wireStart) {
        setWireStart({ col, row });
      } else {
        if (wireStart.col !== col || wireStart.row !== row) {
          setWires((w) => [
            ...w,
            {
              id: Date.now(),
              c1: wireStart.col,
              r1: wireStart.row,
              c2: col,
              r2: row,
              color: wireColor,
              net: `wire_${Date.now()}`,
            },
          ]);
        }
        setWireStart(null);
        setColorIdx((i) => (i + 1) % COLORS.length);
        setWireColor(COLORS[(colorIdx + 1) % COLORS.length]);
      }
    } else if (mode === "delete") {
      // Remove wires near this hole
      setWires((w) =>
        w.filter(
          (wire) =>
            !(wire.c1 === col && wire.r1 === row) &&
            !(wire.c2 === col && wire.r2 === row),
        ),
      );
    }
  };

  const handlePlaceIC = (col) => {
    const def = IC_DEFS[selectedIC];
    if (!def) return;
    if (col + def.cols > COLS) return;
    setIcs((prev) => [...prev, { id: Date.now(), type: selectedIC, col }]);
  };

  const handleRemoveIC = (id) => {
    setIcs((prev) => prev.filter((ic) => ic.id !== id));
  };

  // Render holes
  const holes = [];
  for (let r = 0; r < 14; r++) {
    for (let c = 0; c < COLS; c++) {
      const key = `${c}_${r}`;
      holes.push(
        <Hole
          key={key}
          col={c}
          row={r}
          netVal={nets[key]}
          onMouseDown={handleHoleDown}
          onMouseEnter={setHoveredHole}
          isHighlighted={
            wireStart &&
            hoveredHole &&
            hoveredHole.col === c &&
            hoveredHole.row === r
          }
        />,
      );
    }
  }

  const svgH = BB_TOP + BB_H + 20;
  const svgW = BB_LEFT + BB_W + 24;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0a0a0f 0%, #0f1020 100%)",
        minHeight: "100vh",
        fontFamily: "'Courier New', monospace",
        color: "#e0e0e0",
        padding: "16px",
        userSelect: "none",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "12px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            background: "#1a1a2e",
            border: "1px solid #333",
            borderRadius: "8px",
            padding: "6px 16px",
          }}
        >
          <span
            style={{ fontSize: "11px", color: "#888", letterSpacing: "2px" }}
          >
            DLD TRAINER BOARD
          </span>
          <div
            style={{ fontSize: "16px", fontWeight: "bold", color: "#4fc3f7" }}
          >
            Digital Logic Designer
          </div>
        </div>

        {/* Clock */}
        <div
          style={{
            background: "#0d1117",
            border: "1px solid #30363d",
            borderRadius: "8px",
            padding: "8px 14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              background: clockEnabled && clock ? "#ff6b35" : "#333",
              boxShadow: clockEnabled && clock ? "0 0 8px #ff6b35" : "none",
              transition: "all 0.1s",
            }}
          />
          <span style={{ fontSize: "11px", color: "#888" }}>CLK</span>
          <input
            type="range"
            min="1"
            max="10"
            value={clockHz}
            onChange={(e) => setClockHz(+e.target.value)}
            style={{ width: "70px", accentColor: "#ff6b35" }}
          />
          <span
            style={{ fontSize: "11px", color: "#ff6b35", minWidth: "30px" }}
          >
            {clockHz}Hz
          </span>
          <button
            onClick={() => setClockEnabled((e) => !e)}
            style={{
              background: clockEnabled ? "#1a3a1a" : "#3a1a1a",
              color: clockEnabled ? "#4caf50" : "#f44336",
              border: `1px solid ${clockEnabled ? "#4caf50" : "#f44336"}`,
              borderRadius: "4px",
              padding: "2px 8px",
              cursor: "pointer",
              fontSize: "11px",
            }}
          >
            {clockEnabled ? "ON" : "OFF"}
          </button>
        </div>

        {/* Mode */}
        <div style={{ display: "flex", gap: "6px" }}>
          {["wire", "ic", "delete"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                background: mode === m ? "#1a2a3a" : "#111",
                color: mode === m ? "#4fc3f7" : "#666",
                border: `1px solid ${mode === m ? "#4fc3f7" : "#333"}`,
                borderRadius: "6px",
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              {m === "wire" ? "🔌 Wire" : m === "ic" ? "🔲 IC" : "✂️ Delete"}
            </button>
          ))}
        </div>

        {mode === "wire" && (
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <span style={{ fontSize: "11px", color: "#666" }}>Color:</span>
            {COLORS.map((c, i) => (
              <div
                key={c}
                onClick={() => setWireColor(c)}
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: c,
                  border:
                    wireColor === c
                      ? "2px solid #fff"
                      : "2px solid transparent",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        )}

        {mode === "ic" && (
          <select
            value={selectedIC}
            onChange={(e) => setSelectedIC(e.target.value)}
            style={{
              background: "#1a1a2e",
              color: "#4fc3f7",
              border: "1px solid #333",
              borderRadius: "6px",
              padding: "6px 10px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            {Object.entries(IC_DEFS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.name}
              </option>
            ))}
          </select>
        )}

        {/* Clear */}
        <button
          onClick={() => {
            setWires([]);
            setIcs([]);
          }}
          style={{
            background: "#2a1a1a",
            color: "#f44336",
            border: "1px solid #f44336",
            borderRadius: "6px",
            padding: "6px 12px",
            cursor: "pointer",
            fontSize: "12px",
            marginLeft: "auto",
          }}
        >
          🗑 Clear All
        </button>
      </div>

      {/* Instructions */}
      <div
        style={{
          fontSize: "11px",
          color: "#555",
          marginBottom: "8px",
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <span>▸ Wire mode: click start hole, click end hole to connect</span>
        <span>
          ▸ IC mode: click any column to place chip spanning the center gap
        </span>
        <span>▸ Delete mode: click a hole to remove connected wires</span>
        <span>▸ Switch a-h: toggle logic inputs | LEDs: monitor outputs</span>
      </div>

      {/* Board */}
      <div style={{ overflowX: "auto", overflowY: "hidden" }}>
        <svg
          width={svgW + 200}
          height={svgH + 120}
          style={{ display: "block", background: "transparent" }}
          onMouseLeave={() => {
            if (mode === "wire" && wireStart) setWireStart(null);
          }}
        >
          {/* Board PCB background */}
          <rect
            x={10}
            y={10}
            width={svgW + 4}
            height={svgH + 10}
            rx={10}
            fill="#0b1a0b"
            stroke="#1a3a1a"
            strokeWidth={2}
          />
          <rect
            x={14}
            y={14}
            width={svgW - 4}
            height={svgH + 2}
            rx={8}
            fill="#0d1f0d"
            stroke="#224422"
            strokeWidth={1}
          />

          {/* Breadboard body */}
          <rect
            x={BB_LEFT - 8}
            y={BB_TOP - 8}
            width={BB_W + 16}
            height={BB_H + 16}
            rx={6}
            fill="#e8dcc8"
            stroke="#c8b898"
            strokeWidth={2}
          />

          {/* Power rail areas */}
          <rect
            x={BB_LEFT - 4}
            y={BB_TOP - 4}
            width={BB_W + 8}
            height={RAIL_H + 8}
            rx={4}
            fill="#d4c8b0"
            stroke="#b8a888"
            strokeWidth={1}
          />
          <rect
            x={BB_LEFT - 4}
            y={BB_TOP + RAIL_H + 8 + MAIN_H + GAP_H - 4}
            width={BB_W + 8}
            height={RAIL_H + 8}
            rx={4}
            fill="#d4c8b0"
            stroke="#b8a888"
            strokeWidth={1}
          />

          {/* Row labels */}
          {["a", "b", "c", "d", "e"].map((label, i) => (
            <text
              key={label}
              x={BB_LEFT - 18}
              y={BB_TOP + RAIL_H + 8 + i * PITCH + PITCH / 2 + 4}
              fill="#888"
              fontSize={10}
              fontFamily="monospace"
              textAnchor="middle"
            >
              {label}
            </text>
          ))}
          {["f", "g", "h", "i", "j"].map((label, i) => (
            <text
              key={label}
              x={BB_LEFT - 18}
              y={
                BB_TOP + RAIL_H + 8 + MAIN_H + GAP_H + i * PITCH + PITCH / 2 + 4
              }
              fill="#888"
              fontSize={10}
              fontFamily="monospace"
              textAnchor="middle"
            >
              {label}
            </text>
          ))}

          {/* Column numbers every 5 */}
          {Array.from({ length: Math.floor(COLS / 5) }, (_, i) => (
            <text
              key={i}
              x={BB_LEFT + (i * 5 + 2) * PITCH + PITCH / 2}
              y={BB_TOP + RAIL_H + 2}
              fill="#999"
              fontSize={9}
              fontFamily="monospace"
              textAnchor="middle"
            >
              {i * 5 + 1}
            </text>
          ))}

          {/* VCC/GND labels */}
          <text
            x={BB_LEFT - 18}
            y={BB_TOP + PITCH / 2 + 4}
            fill="#f55"
            fontSize={9}
            fontFamily="monospace"
            textAnchor="middle"
          >
            +
          </text>
          <text
            x={BB_LEFT - 18}
            y={BB_TOP + PITCH + PITCH / 2 + 4}
            fill="#55f"
            fontSize={9}
            fontFamily="monospace"
            textAnchor="middle"
          >
            −
          </text>

          {/* Center divider */}
          <rect
            x={BB_LEFT - 4}
            y={BB_TOP + RAIL_H + 8 + MAIN_H}
            width={BB_W + 8}
            height={GAP_H}
            rx={2}
            fill="#c8b898"
          />

          {/* Holes */}
          {holes}

          {/* IC placement zones (highlight on hover when in IC mode) */}
          {mode === "ic" &&
            hoveredHole &&
            hoveredHole.row >= 2 &&
            hoveredHole.row <= 11 &&
            (() => {
              const def = IC_DEFS[selectedIC];
              if (!def) return null;
              const startCol = Math.max(
                0,
                Math.min(hoveredHole.col, COLS - def.cols),
              );
              const tl = holePos(startCol, 6);
              const br = holePos(startCol + def.cols - 1, 7);
              return (
                <rect
                  x={tl.x - PITCH / 2 - 2}
                  y={tl.y - 6}
                  width={br.x - tl.x + PITCH + 4}
                  height={br.y - tl.y + PITCH / 2 + 4}
                  rx={4}
                  fill="rgba(79,195,247,0.15)"
                  stroke="#4fc3f7"
                  strokeWidth={1}
                  strokeDasharray="4,2"
                  style={{ pointerEvents: "none" }}
                  onClick={() => handlePlaceIC(startCol)}
                />
              );
            })()}

          {/* Placed ICs */}
          {ics.map((ic) => (
            <g key={ic.id}>
              <ICChip ic={ic} nets={nets} />
              <circle
                cx={holePos(ic.col, 6).x - 8}
                cy={holePos(ic.col, 6).y - 16}
                r={6}
                fill="#f44336"
                stroke="#ff8a80"
                strokeWidth={1}
                style={{ cursor: "pointer" }}
                onClick={() => handleRemoveIC(ic.id)}
              />
              <text
                x={holePos(ic.col, 6).x - 8}
                y={holePos(ic.col, 6).y - 12}
                textAnchor="middle"
                fill="#fff"
                fontSize={9}
                style={{ pointerEvents: "none" }}
              >
                ×
              </text>
            </g>
          ))}

          {/* Wires */}
          {wires.map((w) => (
            <Wire key={w.id} wire={w} nets={nets} />
          ))}

          {/* Active wire preview */}
          {wireStart && hoveredHole && (
            <line
              x1={holePos(wireStart.col, wireStart.row).x}
              y1={holePos(wireStart.col, wireStart.row).y}
              x2={holePos(hoveredHole.col, hoveredHole.row).x}
              y2={holePos(hoveredHole.col, hoveredHole.row).y}
              stroke={wireColor}
              strokeWidth={2}
              strokeDasharray="6,3"
              opacity={0.7}
              style={{ pointerEvents: "none" }}
            />
          )}

          {/* ── Components panel ── */}
          {/* Switches */}
          <g transform={`translate(${BB_LEFT}, ${BB_TOP + BB_H + 20})`}>
            <text x={0} y={0} fill="#888" fontSize={11} fontFamily="monospace">
              SWITCHES
            </text>
            {switches.map((val, i) => {
              const sx = i * 40 + 10;
              return (
                <g
                  key={i}
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setSwitches((s) => s.map((v, j) => (j === i ? v ^ 1 : v)))
                  }
                >
                  {/* Switch body */}
                  <rect
                    x={sx - 12}
                    y={8}
                    width={24}
                    height={44}
                    rx={5}
                    fill="#1a1a2e"
                    stroke="#333"
                    strokeWidth={1.5}
                  />
                  {/* Toggle */}
                  <rect
                    x={sx - 8}
                    y={val ? 10 : 32}
                    width={16}
                    height={16}
                    rx={3}
                    fill={val ? "#4caf50" : "#555"}
                  />
                  {/* Label */}
                  <text
                    x={sx}
                    y={62}
                    textAnchor="middle"
                    fill={val ? "#4caf50" : "#666"}
                    fontSize={9}
                    fontFamily="monospace"
                  >
                    {String.fromCharCode(65 + i)}
                  </text>
                  <text
                    x={sx}
                    y={72}
                    textAnchor="middle"
                    fill={val ? "#4caf50" : "#444"}
                    fontSize={8}
                    fontFamily="monospace"
                  >
                    {val}
                  </text>
                  {/* Wire to col */}
                  <line
                    x1={sx}
                    y1={8}
                    x2={sx}
                    y2={0}
                    stroke={val ? "#4caf50" : "#333"}
                    strokeWidth={1.5}
                    strokeDasharray={val ? "none" : "3,2"}
                  />
                </g>
              );
            })}
          </g>

          {/* LEDs */}
          <g transform={`translate(${BB_LEFT + 380}, ${BB_TOP + BB_H + 16})`}>
            <text x={0} y={2} fill="#888" fontSize={11} fontFamily="monospace">
              OUTPUT LEDs
            </text>
            {Array.from({ length: 8 }, (_, i) => {
              const ledColors = [
                "#ff4444",
                "#ff8800",
                "#ffff00",
                "#44ff44",
                "#44ffff",
                "#4488ff",
                "#aa44ff",
                "#ff44aa",
              ];
              const val = nets.ledVals ? nets.ledVals[i] : 0;
              return (
                <LED
                  key={i}
                  x={i * 28 + 18}
                  y={10}
                  val={val}
                  label={`L${i + 1}`}
                  color={ledColors[i]}
                />
              );
            })}
          </g>

          {/* 7-Segment */}
          <g transform={`translate(${BB_LEFT + 620}, ${BB_TOP + BB_H + 14})`}>
            <text x={16} y={2} fill="#888" fontSize={11} fontFamily="monospace">
              7-SEG
            </text>
            <SevenSegDisplay x={0} y={8} value={sevenSegVal} />
            <text
              x={16}
              y={70}
              fill="#555"
              fontSize={9}
              fontFamily="monospace"
              textAnchor="middle"
            >
              {sevenSegVal >= 0 ? sevenSegVal : "-"}
            </text>
          </g>

          {/* Clock output indicator */}
          <g transform={`translate(${BB_LEFT + 720}, ${BB_TOP + BB_H + 20})`}>
            <text x={0} y={0} fill="#888" fontSize={11} fontFamily="monospace">
              CLK OUT
            </text>
            <rect
              x={0}
              y={8}
              width={44}
              height={30}
              rx={4}
              fill="#0d1117"
              stroke="#333"
              strokeWidth={1}
            />
            {/* Square wave viz */}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <line
                key={i}
                x1={3 + i * 6}
                y1={i % 2 === 0 ? 12 : 30}
                x2={3 + i * 6 + 6}
                y2={i % 2 === 0 ? 12 : 30}
                stroke="#ff6b35"
                strokeWidth={1.5}
              />
            ))}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line
                key={i}
                x1={3 + i * 6 + 6}
                y1={i % 2 === 0 ? 12 : 30}
                x2={3 + i * 6 + 6}
                y2={i % 2 === 0 ? 30 : 12}
                stroke="#ff6b35"
                strokeWidth={1.5}
              />
            ))}
            <circle
              cx={40}
              cy={clock ? 16 : 28}
              r={4}
              fill={clock ? "#ff6b35" : "#333"}
              style={{ transition: "all 0.1s" }}
            />
          </g>

          {/* Board label */}
          <text
            x={svgW - 20}
            y={30}
            fill="#1a4a1a"
            fontSize={11}
            fontFamily="monospace"
            textAnchor="end"
            fontWeight="bold"
          >
            DLD TRAINER v2.0
          </text>
        </svg>
      </div>

      {/* IC Legend */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginTop: "8px",
        }}
      >
        {Object.entries(IC_DEFS).map(([k, v]) => (
          <div
            key={k}
            style={{
              background: v.color,
              border: "1px solid #444",
              borderRadius: "6px",
              padding: "4px 10px",
              fontSize: "11px",
              color: "#ccc",
            }}
          >
            <span style={{ color: "#4fc3f7", fontWeight: "bold" }}>{k}</span> —{" "}
            {v.name}
          </div>
        ))}
        <div
          style={{
            background: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: "6px",
            padding: "4px 10px",
            fontSize: "11px",
            color: "#666",
          }}
        >
          Rows 0(+)/1(−) = VCC/GND | CLK on col 1 | Switches on cols 5,9,13... |
          LEDs monitor last cols
        </div>
      </div>
    </div>
  );
}
