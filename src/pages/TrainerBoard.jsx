import { useState, useEffect, useRef, useCallback } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap');

.dld-root *{box-sizing:border-box;}
.dld-root{
  font-family:'Share Tech Mono',monospace;
  background:radial-gradient(ellipse at center,#3a3a3a,#1a1a1a);
  min-height:100vh; display:flex; align-items:center; justify-content:center;
  padding:24px; user-select:none;
}

.dld-case{
  position:relative;
  border-radius:16px 16px 6px 6px;
  background:linear-gradient(160deg,#e0e0e0 0%,#c0c0c0 30%,#a0a0a0 70%,#909090 100%);
  padding:14px 14px 0 14px;
  box-shadow:
    0 40px 80px rgba(0,0,0,.85),
    0 12px 24px rgba(0,0,0,.5),
    inset 0 3px 6px rgba(255,255,255,.5),
    inset 0 -2px 4px rgba(0,0,0,.3);
}
.dld-case::before{
  content:''; position:absolute;
  bottom:-22px; left:8px; right:8px; height:22px;
  background:linear-gradient(180deg,#888,#555);
  border-radius:0 0 10px 10px;
  box-shadow:0 8px 16px rgba(0,0,0,.7);
}
.dld-case::after{
  content:''; position:absolute;
  top:14px; bottom:0; right:-14px; width:14px;
  background:linear-gradient(90deg,#aaa,#666);
  border-radius:0 8px 8px 0;
}

.dld-pcb{
  background:
    radial-gradient(ellipse 60% 40% at 25% 20%,#1e5c35,transparent),
    radial-gradient(ellipse 60% 40% at 75% 80%,#1a4a2e,transparent),
    #122a18;
  border-radius:8px;
  padding:10px;
  position:relative; overflow:hidden;
  box-shadow:inset 0 2px 8px rgba(0,0,0,.6), inset 0 0 0 1px rgba(212,168,67,.12);
}
.dld-pcb::before{
  content:''; position:absolute; inset:0; pointer-events:none;
  background-image:
    repeating-linear-gradient(0deg,transparent,transparent 19px,rgba(212,168,67,.05) 19px,rgba(212,168,67,.05) 20px),
    repeating-linear-gradient(90deg,transparent,transparent 19px,rgba(212,168,67,.05) 19px,rgba(212,168,67,.05) 20px);
}

.dld-header{
  display:flex; align-items:center; justify-content:space-between;
  background:linear-gradient(90deg,#061428,#0e2448,#061428);
  border:1px solid #1e3a78; border-radius:5px;
  padding:5px 12px; margin-bottom:8px;
}
.dld-brand{ display:flex; align-items:center; gap:8px; }
.dld-infinity{ font-size:26px; color:#3a8fff; filter:drop-shadow(0 0 6px #3a8fff); line-height:1; }
.dld-brand-text{ font-family:'Orbitron',monospace; }
.dld-brand-name{ font-size:14px; font-weight:900; color:#d0e8ff; letter-spacing:2px; }
.dld-brand-sub{ font-size:7px; color:#6080aa; letter-spacing:1px; }
.dld-board-title{ font-family:'Orbitron',monospace; font-size:10px; color:#ffcc44; letter-spacing:3px; text-align:center; }

.dld-main{ display:grid; grid-template-columns:150px 1fr 150px; gap:8px; }

.sec{
  background:linear-gradient(135deg,#0c1e0c,#162416);
  border:1px solid rgba(212,168,67,.25);
  border-radius:5px; padding:6px; margin-bottom:6px;
}
.sec-hdr{
  font-size:7px; color:#d4a843; letter-spacing:2px; text-transform:uppercase;
  border-bottom:1px solid rgba(212,168,67,.2); padding-bottom:3px; margin-bottom:5px;
  text-align:center;
}

.seg-wrap{ display:flex; gap:5px; align-items:center; justify-content:center; }
.seg-unit{ position:relative; }

.led-lamp{
  width:11px; height:11px; border-radius:50%;
  border:1px solid rgba(0,0,0,.5); cursor:pointer;
  transition:background .06s, box-shadow .06s; flex-shrink:0;
}
.led-off{ background:#1a1a1a; box-shadow:inset 0 1px 3px rgba(0,0,0,.7); }
.led-red{ background:#ff2200; box-shadow:0 0 5px #ff2200,0 0 12px #ff440066; }
.led-grn{ background:#00ff44; box-shadow:0 0 5px #00ff44,0 0 12px #00ff4466; }
.led-yel{ background:#ffcc00; box-shadow:0 0 5px #ffcc00,0 0 12px #ffcc0066; }
.led-blu{ background:#0088ff; box-shadow:0 0 5px #0088ff,0 0 12px #0088ff66; }
.led-matrix{ display:flex; flex-wrap:wrap; gap:3px; justify-content:center; }

.sw-wrap{ display:flex; flex-direction:column; align-items:center; gap:2px; cursor:pointer; }
.sw-body{
  width:18px; height:36px; border-radius:3px;
  background:linear-gradient(180deg,#2e2e2e,#1a1a1a);
  border:1px solid #555; position:relative;
  box-shadow:inset 0 1px 3px rgba(0,0,0,.6), 0 2px 4px rgba(0,0,0,.4);
}
.sw-lever{
  position:absolute; left:2px; right:2px; height:15px;
  background:linear-gradient(180deg,#ddd,#aaa);
  border-radius:2px; transition:top .12s;
  box-shadow:0 2px 4px rgba(0,0,0,.5);
}
.sw-lever.hi{ top:2px; }
.sw-lever.lo{ top:18px; }
.sw-lbl{ font-size:7px; color:#d4a843; }
.sw-val{ font-size:9px; font-weight:bold; }
.sw-val.on{ color:#00ff44; }
.sw-val.off{ color:#334; }

.pbtn{
  border:none; cursor:pointer; border-radius:4px;
  font-size:7px; color:#fff; font-family:'Share Tech Mono',monospace;
  display:flex; align-items:center; justify-content:center;
  transition:transform .08s, box-shadow .08s;
}
.pbtn:not(.pressed){ box-shadow:0 5px 0 rgba(0,0,0,.5), 0 3px 6px rgba(0,0,0,.4); }
.pbtn.pressed{ transform:translateY(4px); box-shadow:0 1px 0 rgba(0,0,0,.5); }

.pot-outer{
  width:34px; height:34px; border-radius:50%;
  background:radial-gradient(circle at 38% 35%,#999,#333);
  border:2px solid #555;
  box-shadow:0 4px 10px rgba(0,0,0,.7), inset 0 1px 3px rgba(255,255,255,.2);
  position:relative; cursor:pointer;
}
.pot-marker{
  position:absolute; top:4px; left:50%; transform:translateX(-50%);
  width:3px; height:11px; background:#ddd; border-radius:2px;
}
.pot-wrap{ display:flex; flex-direction:column; align-items:center; gap:2px; }
.pot-lbl{ font-size:7px; color:#d4a843; }

.bnc-con{
  width:22px; height:22px; border-radius:50%;
  background:radial-gradient(circle at 38% 35%,#aaa,#444);
  border:2px solid #666;
  box-shadow:0 3px 6px rgba(0,0,0,.6), inset 0 1px rgba(255,255,255,.2);
}

.screw{
  width:14px; height:14px; border-radius:2px;
  background:linear-gradient(135deg,#999,#555);
  border:1px solid #333;
  box-shadow:0 1px 3px rgba(0,0,0,.5);
  position:relative;
}
.screw::before,.screw::after{
  content:''; position:absolute;
  top:50%; left:50%; transform:translate(-50%,-50%);
  background:#222;
}
.screw::before{ width:8px; height:1.5px; }
.screw::after{ width:1.5px; height:8px; }

.ic-pkg{
  background:linear-gradient(180deg,#252525,#141414);
  border:1px solid #555; border-radius:2px;
  font-size:6px; color:#bbb; text-align:center;
  padding:3px 5px;
  box-shadow:0 2px 5px rgba(0,0,0,.6), inset 0 1px rgba(255,255,255,.04);
  position:relative;
  font-family:'Share Tech Mono',monospace;
}
.ic-pkg::before{
  content:''; position:absolute;
  top:3px; left:50%; transform:translateX(-50%);
  width:8px; height:8px; border-radius:50%;
  border:1px solid #444; background:#1a1a1a;
}

.bb-wrap{
  background:#e2d9c0;
  border-radius:6px; padding:8px 7px;
  box-shadow:inset 0 3px 8px rgba(0,0,0,.35), 0 2px 6px rgba(0,0,0,.5);
  display:inline-block; position:relative;
}
.bb-col-nums{ display:flex; gap:2px; margin-left:14px; margin-bottom:2px; }
.bb-col-num{ width:8px; font-size:5.5px; color:#999; text-align:center; flex-shrink:0; font-family:'Share Tech Mono',monospace; }
.bb-row-line{ display:flex; gap:2px; align-items:center; margin-bottom:2px; }
.bb-rl{ font-size:6.5px; color:#888; width:12px; text-align:right; margin-right:1px; font-family:'Share Tech Mono',monospace; }
.bb-h{
  width:8px; height:8px; border-radius:50%;
  background:#1a1a1a; border:1px solid #2e2e2e;
  cursor:crosshair; flex-shrink:0; transition:background .08s, box-shadow .08s;
}
.bb-h:hover{ background:#2a2a2a; }
.bb-h.h-active{ background:#ff6600; box-shadow:0 0 4px #ff660088; }
.bb-h.h-vcc{ background:#aa1100; box-shadow:0 0 3px #cc220055; }
.bb-h.h-gnd{ background:#00004a; }
.bb-h.h-sel{ background:#ffffff; box-shadow:0 0 8px #fff; }
.bb-grp-gap{ width:4px; flex-shrink:0; }
.bb-center-gap{
  height:12px; display:flex; align-items:center; justify-content:center;
  color:rgba(180,160,100,.3); font-size:6.5px; letter-spacing:3px;
  border-top:1px dashed rgba(180,160,100,.15);
  border-bottom:1px dashed rgba(180,160,100,.15);
  margin:3px 0;
}
.bb-rail{ display:flex; gap:2px; align-items:center; padding:2px 0; }
.bb-rail-sym{ font-size:8px; font-weight:bold; width:12px; text-align:center; }
.rail-vcc{ border-top:2px solid #cc2200; }
.rail-gnd{ border-top:2px solid #2200cc; }
.bb-spacer{ height:5px; }

.osc-wave{
  background:#000; border-radius:2px; height:16px;
  display:flex; align-items:center; overflow:hidden;
}

.clk-dot{
  width:9px; height:9px; border-radius:50%;
  display:inline-block; vertical-align:middle;
  transition:background .08s, box-shadow .08s;
}

.bin-readout{
  font-family:'Share Tech Mono',monospace;
  font-size:16px; color:#00ff44;
  background:#000; padding:4px 8px; border-radius:3px;
  text-align:center; letter-spacing:3px;
  border:1px solid #112211;
}

.dld-status{
  margin-top:8px; padding:4px 10px;
  background:linear-gradient(90deg,#040c1e,#081428,#040c1e);
  border:1px solid #0e2040; border-radius:4px;
  display:flex; align-items:center; gap:10px;
  font-size:8px; color:#3a6a88; font-family:'Share Tech Mono',monospace;
}

.wire-svg{
  position:fixed; top:0; left:0;
  pointer-events:none; z-index:200;
}

.dld-tip{
  position:fixed; background:#000; color:#0f0;
  font-size:9px; padding:2px 7px; border-radius:3px;
  border:1px solid #0f0; pointer-events:none; z-index:300;
  font-family:'Share Tech Mono',monospace; white-space:nowrap;
}

@keyframes pulse-glow{ 0%,100%{ box-shadow:0 0 5px #00ff44; } 50%{ box-shadow:0 0 14px #00ff44, 0 0 28px #00ff4466; } }
.led-grn{ animation:pulse-glow 1.2s infinite; }
`;

function SevenSeg({ value, h = 44 }) {
  const w = h * 0.58;
  const t = h * 0.09;
  const g = h * 0.035;
  const ON = "#ff4400";
  const OFF = "#1c0500";
  const D = [
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
  const s = value >= 0 && value <= 9 ? D[value] : [0, 0, 0, 0, 0, 0, 0];

  const hw = w - g * 2 - t;
  const hh = h / 2 - g - t;

  const seg = (i) => {
    const x0 = g + t;
    const x1 = g + t + hw;
    const x2 = w - g;
    const y0 = g;
    const y1 = g + t;
    const yM = h / 2;
    const yB0 = h - g - t;
    const yB1 = h - g;
    switch (i) {
      case 0:
        return `M${x0},${y0} h${hw} l${-t * 0.5},${t} H${x0 + t * 0.5} Z`;
      case 1:
        return `M${x2},${y1} v${hh} l${-t},${t * 0.3} V${y1 + t * 0.3} Z`;
      case 2:
        return `M${x2},${yM + t * 0.3} v${hh} l${-t},${-t * 0.3} V${yM + t * 0.6} Z`;
      case 3:
        return `M${x0},${yB1} h${hw} l${-t * 0.5},${-t} H${x0 + t * 0.5} Z`;
      case 4:
        return `M${g},${yM + t * 0.3} v${hh} l${t},${-t * 0.3} V${yM + t * 0.6} Z`;
      case 5:
        return `M${g},${y1} v${hh} l${t},${t * 0.3} V${y1 + t * 0.3} Z`;
      case 6:
        return `M${x0},${yM - t * 0.4} h${hw} l${t * 0.4},${t * 0.4} l${-t * 0.4},${t * 0.4} H${x0} l${-t * 0.4},${-t * 0.4} Z`;
      default:
        return "";
    }
  };

  return (
    <svg width={w + 4} height={h + 4} style={{ display: "block" }}>
      <rect width={w + 4} height={h + 4} rx={3} fill="#060200" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path
          key={i}
          d={seg(i)}
          fill={s[i] ? ON : OFF}
          transform="translate(2,2)"
        />
      ))}
    </svg>
  );
}

function OscWave({ clk }) {
  const pts =
    "0,13 8,13 8,3 16,3 16,13 24,13 24,3 32,3 32,13 40,13 40,3 48,3 48,13 56,13";
  return (
    <svg width={60} height={16} style={{ display: "block" }}>
      <rect width={60} height={16} fill="#000" rx={2} />
      <polyline
        points={pts}
        fill="none"
        stroke={clk ? "#ff6600" : "#441100"}
        strokeWidth={1.5}
        strokeLinejoin="miter"
      />
      <circle cx={clk ? 56 : 8} cy={clk ? 3 : 13} r={2} fill="#ff8800" />
    </svg>
  );
}

const BB_COLS = 30;
const ROWS_ALPHA = ["a", "b", "c", "d", "e"];
const ROWS_BETA = ["f", "g", "h", "i", "j"];

function Breadboard({ onHoleClick, onHoleEnter, wireStart, nets }) {
  const renderRail = (id, isVcc) => (
    <div className={`bb-rail ${isVcc ? "rail-vcc" : "rail-gnd"}`}>
      <span className="bb-rail-sym" style={{ color: isVcc ? "#f44" : "#44f" }}>
        {isVcc ? "+" : "\u2212"}
      </span>
      {Array.from({ length: BB_COLS }, (_, c) => {
        const hid = `${id}_${isVcc ? "v" : "g"}_${c}`;
        return (
          <div
            key={c}
            className={`bb-h ${isVcc ? "h-vcc" : "h-gnd"}`}
            data-hole={hid}
            onMouseDown={() => onHoleClick(hid)}
            onMouseEnter={() => onHoleEnter(hid)}
            style={{ marginRight: [4, 9, 14, 19, 24].includes(c) ? 4 : 0 }}
          />
        );
      })}
    </div>
  );

  const renderSection = (rows, prefix) =>
    rows.map((lbl) => (
      <div key={lbl} className="bb-row-line">
        <span className="bb-rl">{lbl}</span>
        {Array.from({ length: BB_COLS }, (_, c) => {
          const hid = `${prefix}_${c}_${rows.indexOf(lbl)}`;
          const val = nets[hid];
          let cls = "bb-h";
          if (wireStart && wireStart.id === hid) cls += " h-sel";
          else if (val === 1) cls += " h-active";
          return (
            <div
              key={c}
              className={cls}
              data-hole={hid}
              onMouseDown={() => onHoleClick(hid)}
              onMouseEnter={() => onHoleEnter(hid)}
              style={{ marginRight: [4, 9, 14, 19, 24].includes(c) ? 4 : 0 }}
            />
          );
        })}
      </div>
    ));

  return (
    <div className="bb-wrap">
      <div className="bb-col-nums">
        {Array.from({ length: BB_COLS }, (_, i) => (
          <span
            key={i}
            className="bb-col-num"
            style={{ marginRight: [4, 9, 14, 19, 24].includes(i) ? 4 : 0 }}
          >
            {i + 1}
          </span>
        ))}
      </div>

      {renderRail("top", true)}
      {renderRail("top", false)}
      <div className="bb-spacer" />
      {renderSection(ROWS_ALPHA, "top")}
      <div className="bb-center-gap">
        {"\u2500 \u2500 \u2500 IC SLOT \u2500 \u2500 \u2500"}
      </div>
      {renderSection(ROWS_BETA, "bot")}
      <div className="bb-spacer" />
      {renderRail("bot", true)}
      {renderRail("bot", false)}
    </div>
  );
}

function WireOverlay({ wires, preview }) {
  const [dims, setDims] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });

  useEffect(() => {
    const onResize = () =>
      setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <svg
      className="wire-svg"
      width={dims.w}
      height={dims.h}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 200,
      }}
    >
      {wires.map((w) => {
        const mx = (w.x1 + w.x2) / 2;
        const my = Math.min(w.y1, w.y2) - Math.abs(w.x2 - w.x1) * 0.3 - 20;
        return (
          <path
            key={w.id}
            d={`M${w.x1},${w.y1} Q${mx},${my} ${w.x2},${w.y2}`}
            stroke={w.color}
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            opacity={0.92}
          />
        );
      })}
      {preview && (
        <line
          x1={preview.x1}
          y1={preview.y1}
          x2={preview.x2}
          y2={preview.y2}
          stroke={preview.color}
          strokeWidth={2}
          strokeDasharray="6,4"
          opacity={0.7}
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export default function DLDTrainerBoard() {
  const [switches, setSwitches] = useState(Array(8).fill(0));
  const [clock, setClock] = useState(0);
  const [clockHz, setClockHz] = useState(2);
  const [clkOn, setClkOn] = useState(true);
  const [wires, setWires] = useState([]);
  const [wireStart, setWireStart] = useState(null);
  const [preview, setPreview] = useState(null);
  const [wireColor, setWireColor] = useState("#e63946");
  const [colorIdx, setColorIdx] = useState(0);
  const [nets, setNets] = useState({});
  const [mode, setMode] = useState("wire");
  const [selIC, setSelIC] = useState("7408");
  const [btns, setBtns] = useState([0, 0, 0, 0]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const clockRef = useRef();

  const WIRE_COLORS = [
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
  ];

  const IC_LIST = {
    7408: "74HC08 AND\xd74",
    7432: "74HC32 OR\xd74",
    7404: "74HC04 NOT\xd76",
    7486: "74HC86 XOR\xd74",
    7474: "74HC74 D-FF\xd72",
    74138: "74HC138 Decoder",
    74151: "74HC151 MUX",
    7483: "74HC83 Adder",
    7447: "74HC47 BCD-7Seg",
  };

  useEffect(() => {
    clearInterval(clockRef.current);
    if (!clkOn) {
      setClock(0);
      return;
    }
    clockRef.current = setInterval(() => setClock((c) => c ^ 1), 500 / clockHz);
    return () => clearInterval(clockRef.current);
  }, [clockHz, clkOn]);

  useEffect(() => {
    const n = {};
    for (let c = 0; c < BB_COLS; c++) {
      n[`top_v_${c}`] = 1;
      n[`top_g_${c}`] = 0;
      n[`bot_v_${c}`] = 1;
      n[`bot_g_${c}`] = 0;
    }
    setNets(n);
  }, [switches, clock, wires]);

  const decVal = switches.reduce((a, b, i) => a + b * (1 << i), 0);
  const segVal = decVal % 10;
  const seg2 = Math.floor(decVal / 10) % 10;

  useEffect(() => {
    const mv = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (wireStart) {
        setPreview({
          x1: wireStart.x,
          y1: wireStart.y,
          x2: e.clientX,
          y2: e.clientY,
          color: wireColor,
        });
      }
    };
    window.addEventListener("mousemove", mv);
    return () => window.removeEventListener("mousemove", mv);
  }, [wireStart, wireColor]);

  const handleHoleClick = useCallback(
    (hid) => {
      if (mode === "delete") {
        setWires((prev) => prev.filter((w) => w.from !== hid && w.to !== hid));
        return;
      }
      if (mode !== "wire") return;

      const el = document.querySelector(`[data-hole="${hid}"]`);
      const rect = el ? el.getBoundingClientRect() : null;
      const x = rect ? rect.left + rect.width / 2 : mousePos.x;
      const y = rect ? rect.top + rect.height / 2 : mousePos.y;

      if (!wireStart) {
        setWireStart({ id: hid, x, y });
      } else {
        if (wireStart.id !== hid) {
          setWires((prev) => [
            ...prev,
            {
              id: Date.now(),
              from: wireStart.id,
              to: hid,
              x1: wireStart.x,
              y1: wireStart.y,
              x2: x,
              y2: y,
              color: wireColor,
            },
          ]);
          const nci = (colorIdx + 1) % WIRE_COLORS.length;
          setColorIdx(nci);
          setWireColor(WIRE_COLORS[nci]);
        }
        setWireStart(null);
        setPreview(null);
      }
    },
    [mode, wireStart, wireColor, colorIdx, mousePos, WIRE_COLORS],
  );

  const handleHoleEnter = useCallback((_hid) => {}, []);

  const toggleSw = (i) =>
    setSwitches((p) => {
      const n = [...p];
      n[i] ^= 1;
      return n;
    });
  const pressBtn = (i, v) =>
    setBtns((p) => {
      const n = [...p];
      n[i] = v;
      return n;
    });

  const LED = ({ on, color = "red" }) => (
    <div
      className={`led-lamp ${on ? `led-${color.substring(0, 3)}` : "led-off"}`}
    />
  );

  const Pot = ({ label, angle = 120 }) => (
    <div className="pot-wrap">
      <div className="pot-outer" style={{ transform: `rotate(${angle}deg)` }}>
        <div className="pot-marker" />
      </div>
      <span className="pot-lbl">{label}</span>
    </div>
  );

  return (
    <>
      <style>{CSS}</style>
      <div
        className="dld-root"
        onMouseLeave={() => {
          setWireStart(null);
          setPreview(null);
        }}
      >
        <div className="dld-case">
          <div className="dld-pcb">
            {/* HEADER */}
            <div className="dld-header">
              <div className="dld-brand">
                <span className="dld-infinity">{"\u221e"}</span>
                <div className="dld-brand-text">
                  <div className="dld-brand-name">INFINIT</div>
                  <div className="dld-brand-sub">Technologies</div>
                  <div className="dld-brand-sub">Redefining the Technology</div>
                </div>
              </div>

              <div className="dld-board-title">
                DIGITAL LOGIC DESIGN TRAINER SYSTEM
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div>
                  <div
                    style={{ fontSize: 7, color: "#7090cc", marginBottom: 2 }}
                  >
                    CLOCK
                  </div>
                  <div
                    style={{
                      background: "#000",
                      border: "1px solid #222",
                      borderRadius: 3,
                      padding: "3px 8px",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color: clkOn && clock ? "#ff8800" : "#444",
                        fontFamily: "Share Tech Mono",
                      }}
                    >
                      {clockHz}Hz
                    </span>
                    <span
                      className="clk-dot"
                      style={{
                        background: clkOn && clock ? "#ff8800" : "#222",
                        boxShadow: clkOn && clock ? "0 0 6px #ff8800" : "none",
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 3 }}
                >
                  <button
                    className={`pbtn ${clkOn ? "" : "pressed"}`}
                    style={{
                      background: clkOn ? "#1a4a1a" : "#4a1a1a",
                      width: 44,
                      height: 18,
                      fontSize: 7,
                    }}
                    onClick={() => setClkOn((e) => !e)}
                  >
                    {clkOn ? "\u25cf ON" : "\u25cb OFF"}
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={clockHz}
                    onChange={(e) => setClockHz(+e.target.value)}
                    style={{ width: 60, accentColor: "#ff8800", height: 8 }}
                  />
                </div>
              </div>
            </div>

            {/* MODE BAR */}
            <div
              style={{
                display: "flex",
                gap: 5,
                marginBottom: 6,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {["wire", "ic", "delete"].map((m) => (
                <button
                  key={m}
                  style={{
                    background: mode === m ? "#102840" : "#071018",
                    color: mode === m ? "#4fc3f7" : "#445566",
                    border: `1px solid ${mode === m ? "#4fc3f7" : "#223344"}`,
                    borderRadius: 3,
                    padding: "3px 9px",
                    cursor: "pointer",
                    fontSize: 9,
                    fontFamily: "Share Tech Mono",
                    letterSpacing: 1,
                  }}
                  onClick={() => setMode(m)}
                >
                  {m === "wire"
                    ? "\u26a1 WIRE"
                    : m === "ic"
                      ? "\u25a3 IC"
                      : "\u2702 DEL"}
                </button>
              ))}

              {mode === "wire" && (
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <span style={{ fontSize: 8, color: "#556" }}>color:</span>
                  {WIRE_COLORS.map((c, i) => (
                    <div
                      key={c}
                      onClick={() => {
                        setWireColor(c);
                        setColorIdx(i);
                      }}
                      style={{
                        width: 13,
                        height: 13,
                        borderRadius: "50%",
                        background: c,
                        cursor: "pointer",
                        border:
                          wireColor === c
                            ? "2px solid #fff"
                            : "2px solid transparent",
                      }}
                    />
                  ))}
                </div>
              )}

              {mode === "ic" && (
                <select
                  value={selIC}
                  onChange={(e) => setSelIC(e.target.value)}
                  style={{
                    background: "#071018",
                    color: "#4fc3f7",
                    border: "1px solid #223344",
                    borderRadius: 3,
                    padding: "3px 7px",
                    fontSize: 9,
                    fontFamily: "Share Tech Mono",
                  }}
                >
                  {Object.entries(IC_LIST).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              )}

              <button
                onClick={() => {
                  setWires([]);
                  setWireStart(null);
                  setPreview(null);
                }}
                style={{
                  marginLeft: "auto",
                  background: "#200a0a",
                  color: "#f44336",
                  border: "1px solid #f44336",
                  borderRadius: 3,
                  padding: "3px 9px",
                  cursor: "pointer",
                  fontSize: 9,
                  fontFamily: "Share Tech Mono",
                }}
              >
                {"\u{1f5d1}"} CLEAR ALL
              </button>
            </div>

            {/* MAIN GRID */}
            <div className="dld-main">
              {/* LEFT PANEL */}
              <div>
                <div className="sec">
                  <div className="sec-hdr">7-Segment Display</div>
                  <div className="seg-wrap">
                    <SevenSeg value={0} h={40} />
                    <SevenSeg value={seg2} h={40} />
                    <SevenSeg value={segVal} h={40} />
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: 7,
                      color: "#888",
                      marginTop: 3,
                    }}
                  >
                    {String(decVal).padStart(3, "0")} &middot; 0x
                    {decVal.toString(16).toUpperCase().padStart(2, "0")}
                  </div>
                </div>

                <div className="sec">
                  <div className="sec-hdr">Potentiometers</div>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      justifyContent: "center",
                      padding: "4px 0",
                    }}
                  >
                    <Pot label="CLK" angle={clockHz * 9} />
                    <Pot label="DUTY" angle={140} />
                    <Pot label="VCC" angle={200} />
                  </div>
                </div>

                <div className="sec">
                  <div className="sec-hdr">Power Supply</div>
                  <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    {["+5V", "12V", "GND"].map((lbl, i) => (
                      <div key={lbl} style={{ textAlign: "center" }}>
                        <div
                          style={{
                            width: 10,
                            height: 18,
                            borderRadius: "5px 5px 3px 3px",
                            margin: "0 auto 2px",
                            background: ["#ff2200", "#00ff44", "#ffcc00"][i],
                            boxShadow: `0 0 8px ${["#ff2200", "#00ff44", "#ffcc00"][i]}`,
                          }}
                        />
                        <span
                          style={{
                            fontSize: 6,
                            color: ["#f44", "#4f4", "#fc0"][i],
                          }}
                        >
                          {lbl}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sec">
                  <div className="sec-hdr">Oscillator</div>
                  <div
                    style={{ display: "flex", gap: 5, alignItems: "center" }}
                  >
                    <div className="bnc-con" />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 7,
                          color: "#8888ff",
                          marginBottom: 2,
                        }}
                      >
                        {clockHz * 1000}Hz
                      </div>
                      <OscWave clk={clock} />
                    </div>
                  </div>
                </div>

                <div className="sec">
                  <div className="sec-hdr">Control Buttons</div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 5,
                    }}
                  >
                    {[
                      ["RST", "#cc2200"],
                      ["CLR", "#1a33cc"],
                      ["LD", "#228833"],
                      ["RUN", "#886600"],
                    ].map(([lbl, bg], i) => (
                      <button
                        key={i}
                        className={`pbtn ${btns[i] ? "pressed" : ""}`}
                        style={{ background: bg, width: "100%", height: 24 }}
                        onMouseDown={() => pressBtn(i, 1)}
                        onMouseUp={() => pressBtn(i, 0)}
                        onMouseLeave={() => pressBtn(i, 0)}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sec">
                  <div className="sec-hdr">BNC Connectors</div>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      justifyContent: "center",
                    }}
                  >
                    {["IN", "OUT", "CLK"].map((l) => (
                      <div key={l} style={{ textAlign: "center" }}>
                        <div
                          className="bnc-con"
                          style={{ margin: "0 auto 2px" }}
                        />
                        <span style={{ fontSize: 6, color: "#888" }}>{l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CENTER */}
              <div>
                <div style={{ textAlign: "center", marginBottom: 4 }}>
                  <Breadboard
                    onHoleClick={handleHoleClick}
                    onHoleEnter={handleHoleEnter}
                    wireStart={wireStart}
                    nets={nets}
                  />
                  {wireStart && (
                    <div
                      style={{ fontSize: 8, color: "#4fc3f7", marginTop: 3 }}
                    >
                      {"\u25cf"} Wire from <strong>{wireStart.id}</strong> —
                      click destination hole
                    </div>
                  )}
                </div>

                <div className="sec">
                  <div className="sec-hdr">IC Socket Bank</div>
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    {[
                      "7408",
                      "7432",
                      "7404",
                      "7486",
                      "7474",
                      "74138",
                      "74151",
                      "7483",
                      "7447",
                    ].map((ic) => (
                      <div
                        key={ic}
                        className="ic-pkg"
                        style={{ width: 44, paddingTop: 14 }}
                      >
                        {ic}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sec">
                  <div className="sec-hdr">Data Input Switches (A–H)</div>
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {switches.map((v, i) => (
                      <div
                        key={i}
                        className="sw-wrap"
                        onClick={() => toggleSw(i)}
                      >
                        <div className="sw-body">
                          <div className={`sw-lever ${v ? "hi" : "lo"}`} />
                        </div>
                        <span className="sw-lbl">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className={`sw-val ${v ? "on" : "off"}`}>
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      justifyContent: "center",
                      marginTop: 5,
                    }}
                  >
                    {switches.map((v, i) => (
                      <LED key={i} on={!!v} color="grn" />
                    ))}
                  </div>
                </div>

                <div className="sec">
                  <div className="sec-hdr">Binary / Decimal Readout</div>
                  <div className="bin-readout">
                    {switches.slice().reverse().join("")}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      marginTop: 4,
                      fontSize: 9,
                      color: "#6a8a6a",
                      fontFamily: "Share Tech Mono",
                    }}
                  >
                    <span>DEC: {decVal}</span>
                    <span>
                      HEX: 0x
                      {decVal.toString(16).toUpperCase().padStart(2, "0")}
                    </span>
                    <span>OCT: {decVal.toString(8).padStart(3, "0")}</span>
                  </div>
                </div>
              </div>

              {/* RIGHT PANEL */}
              <div>
                <div className="sec">
                  <div className="sec-hdr">Output LED Matrix</div>

                  <div
                    style={{
                      fontSize: 6,
                      color: "#f44",
                      marginBottom: 2,
                      letterSpacing: 1,
                    }}
                  >
                    DATA BUS D0–D7
                  </div>
                  <div className="led-matrix" style={{ marginBottom: 6 }}>
                    {switches.map((v, i) => (
                      <LED key={i} on={!!v} color="red" />
                    ))}
                  </div>

                  <div
                    style={{
                      fontSize: 6,
                      color: "#4f4",
                      marginBottom: 2,
                      letterSpacing: 1,
                    }}
                  >
                    LOGIC OUTPUT
                  </div>
                  <div className="led-matrix" style={{ marginBottom: 6 }}>
                    {switches.map((v, i) => (
                      <LED key={i} on={!!v} color="grn" />
                    ))}
                  </div>

                  <div
                    style={{
                      fontSize: 6,
                      color: "#fc0",
                      marginBottom: 2,
                      letterSpacing: 1,
                    }}
                  >
                    STATUS FLAGS
                  </div>
                  <div className="led-matrix" style={{ marginBottom: 6 }}>
                    {[clock, ...btns, ...Array(3).fill(0)].map((v, i) => (
                      <LED key={i} on={!!v} color="yel" />
                    ))}
                  </div>

                  <div
                    style={{
                      fontSize: 6,
                      color: "#4af",
                      marginBottom: 2,
                      letterSpacing: 1,
                    }}
                  >
                    CARRY / BORROW
                  </div>
                  <div className="led-matrix">
                    {Array(8)
                      .fill(0)
                      .map((_, i) => (
                        <LED key={i} on={i === 0 && decVal > 127} color="blu" />
                      ))}
                  </div>
                </div>

                <div className="sec">
                  <div className="sec-hdr">Logic Probe</div>
                  {[
                    ["HIGH", clock === 1, "grn"],
                    ["LOW", clock === 0, "red"],
                    ["PULSE", clkOn, "yel"],
                    ["HI-Z", false, "blu"],
                  ].map(([lbl, on, col]) => (
                    <div
                      key={lbl}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        marginBottom: 3,
                      }}
                    >
                      <LED on={on} color={col} />
                      <span style={{ fontSize: 7, color: "#aaa" }}>{lbl}</span>
                    </div>
                  ))}
                </div>

                <div className="sec">
                  <div className="sec-hdr">I/O Terminals</div>
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
                      "CLK",
                      "DIN",
                      "DOUT",
                      "A0",
                      "A1",
                    ].map((lbl) => (
                      <div
                        key={lbl}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        <div className="screw" />
                        <span style={{ fontSize: 6.5, color: "#aaa" }}>
                          {lbl}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sec">
                  <div className="sec-hdr">Wiring Info</div>
                  <div style={{ fontSize: 7, color: "#558", lineHeight: 1.6 }}>
                    <div>
                      Wires:{" "}
                      <span style={{ color: "#88aaff" }}>{wires.length}</span>
                    </div>
                    <div>
                      Rail +: <span style={{ color: "#f44" }}>5V DC</span>
                    </div>
                    <div>
                      Rail {"\u2212"}:{" "}
                      <span style={{ color: "#44f" }}>GND</span>
                    </div>
                    <div>
                      CLK col1:{" "}
                      <span style={{ color: "#ff8800" }}>
                        {clkOn ? `${clockHz}Hz` : "OFF"}
                      </span>
                    </div>
                    <div style={{ marginTop: 4, color: "#334", fontSize: 6 }}>
                      Click hole &rarr; click hole to connect wire.
                      <br />
                      Rows a–e top half, f–j bottom half.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STATUS BAR */}
            <div className="dld-status">
              <span style={{ color: "#ff8800" }}>
                CLK {clkOn ? `${clockHz}Hz` : "OFF"}
                {clkOn && (
                  <span style={{ marginLeft: 5 }}>
                    {clock ? "\u2590\u2588" : "\u2591\u2591"}
                  </span>
                )}
              </span>
              <span>|</span>
              <span>
                SW:{" "}
                <span style={{ color: "#00ff44" }}>
                  {switches.slice().reverse().join("")}b
                </span>{" "}
                = {decVal}
              </span>
              <span>|</span>
              <span>
                WIRES: <span style={{ color: "#4fc3f7" }}>{wires.length}</span>
              </span>
              <span>|</span>
              <span>
                MODE:{" "}
                <span style={{ color: "#a0c0ff" }}>{mode.toUpperCase()}</span>
              </span>
              <span style={{ marginLeft: "auto", color: "#1a3050" }}>
                {"\u221e"} INFINIT TECHNOLOGIES &middot; DTS-400 DIGITAL TRAINER
                SYSTEM
              </span>
            </div>
          </div>
        </div>

        <WireOverlay wires={wires} preview={preview} />
      </div>
    </>
  );
}
