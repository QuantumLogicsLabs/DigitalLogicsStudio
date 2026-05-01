import React, { useState, useRef, useEffect } from "react";
import SeqLayout from "./SeqLayout";
import SeqTable from "./components/SeqTable";

/* ─────────────────────────────────────────────
   DATA TABLES
───────────────────────────────────────────── */
const asyncOverrideData = {
  headers: ["PRĒ", "CLR̄", "Q", "Q̄", "Effect"],
  rows: [
    { PRĒ: "0", CLR̄: "1", Q: "1", Q̄: "0", Effect: "Force Set (async)" },
    { PRĒ: "1", CLR̄: "0", Q: "0", Q̄: "1", Effect: "Force Clear (async)" },
    {
      PRĒ: "1",
      CLR̄: "1",
      Q: "Normal",
      Q̄: "Normal",
      Effect: "Clock controls Q",
    },
    { PRĒ: "0", CLR̄: "0", Q: "?", Q̄: "?", Effect: "Forbidden" },
  ],
};

const timingParamsData = {
  headers: ["Parameter", "Symbol", "Meaning"],
  rows: [
    {
      Parameter: "Setup time",
      Symbol: "t<sub>su</sub>",
      Meaning: "Input must be stable before clock edge",
    },
    {
      Parameter: "Hold time",
      Symbol: "t<sub>h</sub>",
      Meaning: "Input must remain stable after clock edge",
    },
    {
      Parameter: "CLK → Q delay",
      Symbol: "t<sub>p</sub>",
      Meaning: "Delay from clock edge to valid Q output",
    },
    {
      Parameter: "Minimum period",
      Symbol: "T<sub>min</sub>",
      Meaning: "t<sub>p</sub> + t<sub>su</sub> + routing",
    },
    {
      Parameter: "Max frequency",
      Symbol: "f<sub>max</sub>",
      Meaning: "1 / T<sub>min</sub>",
    },
  ],
};

/* ─────────────────────────────────────────────
   ANALOGY CARD
───────────────────────────────────────────── */
const AnalogyCard = () => (
  <div className="seq-analogy-grid">
    <div className="seq-analogy-item seq-analogy-latch">
      <div className="seq-analogy-icon">🚪</div>
      <div className="seq-analogy-label">Latch</div>
      <div className="seq-analogy-desc">
        Like an open door — data flows through <em>the whole time</em> the
        Enable pin is HIGH. Any noise on the input leaks straight to output.
      </div>
      <div className="seq-analogy-tag seq-tag-yellow">Level-sensitive</div>
    </div>
    <div className="seq-analogy-arrow">→</div>
    <div className="seq-analogy-item seq-analogy-ff">
      <div className="seq-analogy-icon">📸</div>
      <div className="seq-analogy-label">Flip-Flop</div>
      <div className="seq-analogy-desc">
        Like a camera shutter — it takes a <em>snapshot</em> of D at the exact
        instant of the clock edge, then holds that value until the next shot.
      </div>
      <div className="seq-analogy-tag seq-tag-green">Edge-triggered</div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   MASTER-SLAVE INTERACTIVE WALKTHROUGH
───────────────────────────────────────────── */
const msSteps = [
  {
    phase: "CLK = 0  (Low Phase)",
    color: "#f59e0b",
    masterOpen: true,
    slaveOpen: false,
    desc: "The Master latch is transparent — it watches D continuously and updates its internal value Q_m. The Slave latch is frozen; it holds whatever Q was last time and doesn't change.",
    note: "Think of Master as a sponge absorbing D, while Slave is a locked box.",
  },
  {
    phase: "CLK rising ↑  (The Critical Moment)",
    color: "#6366f1",
    masterOpen: false,
    slaveOpen: false,
    desc: "Right at the rising edge, Master freezes instantly — it stops watching D and locks in whatever Q_m it had. This is the exact value that will become Q. Nothing moves yet.",
    note: "The shutter has clicked. D is captured. Q hasn't changed yet.",
  },
  {
    phase: "CLK = 1  (High Phase)",
    color: "#10b981",
    masterOpen: false,
    slaveOpen: true,
    desc: "Now the Slave latch opens — it reads Q_m from the frozen Master and passes it to Q. Master stays locked (ignores D), so D can safely change without corrupting Q.",
    note: "The photo is now printed. Q shows what D was at the rising edge.",
  },
];

const MasterSlaveWalkthrough = () => {
  const [step, setStep] = useState(0);
  const s = msSteps[step];

  return (
    <div className="seq-ms-walkthrough">
      {/* Diagram */}
      <div className="seq-ms-diagram">
        <svg viewBox="0 0 580 210" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <marker
              id="aMS"
              markerWidth="7"
              markerHeight="7"
              refX="6"
              refY="2.5"
              orient="auto"
            >
              <path d="M0,0 L0,5 L7,2.5z" fill="#6366f1" />
            </marker>
            <marker
              id="aMSg"
              markerWidth="7"
              markerHeight="7"
              refX="6"
              refY="2.5"
              orient="auto"
            >
              <path d="M0,0 L0,5 L7,2.5z" fill="#10b981" />
            </marker>
          </defs>

          {/* D input wire */}
          <line
            x1="10"
            y1="95"
            x2="78"
            y2="95"
            stroke="#6366f1"
            strokeWidth="2"
            markerEnd="url(#aMS)"
          />
          <text x="4" y="90" fontSize="13" fill="#a5b4fc" fontWeight="700">
            D
          </text>

          {/* MASTER box */}
          <rect
            x="80"
            y="55"
            width="160"
            height="80"
            rx="10"
            fill={s.masterOpen ? "rgba(245,158,11,0.12)" : "rgba(30,27,75,0.7)"}
            stroke={s.masterOpen ? "#f59e0b" : "#475569"}
            strokeWidth={s.masterOpen ? "2.5" : "1.5"}
            style={{ transition: "all 0.4s" }}
          />
          <text
            x="160"
            y="88"
            fontSize="13"
            fill={s.masterOpen ? "#fbbf24" : "#64748b"}
            textAnchor="middle"
            fontWeight="700"
            style={{ transition: "all 0.4s" }}
          >
            MASTER
          </text>
          <text
            x="160"
            y="107"
            fontSize="10"
            fill={s.masterOpen ? "#f59e0b" : "#475569"}
            textAnchor="middle"
            style={{ transition: "all 0.4s" }}
          >
            {s.masterOpen ? "OPEN — tracking D" : "FROZEN"}
          </text>
          {/* CLK bubble (invert) */}
          <circle
            cx="160"
            cy="143"
            r="7"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.5"
            opacity="0.7"
          />
          <line
            x1="160"
            y1="150"
            x2="160"
            y2="175"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />

          {/* Q_m wire */}
          <line
            x1="240"
            y1="95"
            x2="308"
            y2="95"
            stroke={s.masterOpen ? "#f59e0b" : "#6366f1"}
            strokeWidth="1.8"
            strokeDasharray="5 3"
            markerEnd="url(#aMS)"
            style={{ transition: "stroke 0.4s" }}
          />
          <text x="264" y="88" fontSize="9" fill="#94a3b8">
            Q_m
          </text>

          {/* SLAVE box */}
          <rect
            x="310"
            y="55"
            width="160"
            height="80"
            rx="10"
            fill={s.slaveOpen ? "rgba(16,185,129,0.12)" : "rgba(30,27,75,0.7)"}
            stroke={s.slaveOpen ? "#10b981" : "#475569"}
            strokeWidth={s.slaveOpen ? "2.5" : "1.5"}
            style={{ transition: "all 0.4s" }}
          />
          <text
            x="390"
            y="88"
            fontSize="13"
            fill={s.slaveOpen ? "#34d399" : "#64748b"}
            textAnchor="middle"
            fontWeight="700"
            style={{ transition: "all 0.4s" }}
          >
            SLAVE
          </text>
          <text
            x="390"
            y="107"
            fontSize="10"
            fill={s.slaveOpen ? "#10b981" : "#475569"}
            textAnchor="middle"
            style={{ transition: "all 0.4s" }}
          >
            {s.slaveOpen ? "OPEN — passing to Q" : "FROZEN"}
          </text>
          <line
            x1="390"
            y1="135"
            x2="390"
            y2="175"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />

          {/* CLK rail */}
          <line
            x1="120"
            y1="175"
            x2="430"
            y2="175"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
          <text
            x="270"
            y="192"
            fontSize="11"
            fill="#94a3b8"
            textAnchor="middle"
            fontWeight="600"
          >
            CLK
          </text>

          {/* Q output */}
          <line
            x1="470"
            y1="95"
            x2="545"
            y2="95"
            stroke={s.slaveOpen ? "#10b981" : "#475569"}
            strokeWidth="2.5"
            markerEnd={s.slaveOpen ? "url(#aMSg)" : "url(#aMS)"}
            style={{ transition: "stroke 0.4s" }}
          />
          <text
            x="550"
            y="100"
            fontSize="13"
            fill={s.slaveOpen ? "#10b981" : "#94a3b8"}
            fontWeight="700"
            style={{ transition: "fill 0.4s" }}
          >
            Q
          </text>

          {/* Phase label */}
          <rect
            x="80"
            y="10"
            width="400"
            height="26"
            rx="6"
            fill="rgba(99,102,241,0.1)"
            stroke="#6366f1"
            strokeWidth="0.5"
          />
          <text
            x="280"
            y="27"
            fontSize="11"
            fill={s.color}
            textAnchor="middle"
            fontWeight="700"
            style={{ transition: "fill 0.4s" }}
          >
            {s.phase}
          </text>
        </svg>
      </div>

      {/* Explanation */}
      <div className="seq-ms-explanation">
        <p className="seq-ms-desc">{s.desc}</p>
        <div className="seq-ms-note">💡 {s.note}</div>
      </div>

      {/* Step controls */}
      <div className="seq-ms-controls">
        <button
          className="seq-step-btn"
          onClick={() => setStep((p) => Math.max(0, p - 1))}
          disabled={step === 0}
        >
          ← Previous
        </button>
        <div className="seq-step-dots">
          {msSteps.map((_, i) => (
            <button
              key={i}
              className={`seq-dot ${i === step ? "seq-dot-active" : ""}`}
              onClick={() => setStep(i)}
            />
          ))}
        </div>
        <button
          className="seq-step-btn"
          onClick={() => setStep((p) => Math.min(msSteps.length - 1, p + 1))}
          disabled={step === msSteps.length - 1}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   D FLIP-FLOP SIMULATOR
───────────────────────────────────────────── */
const WAVE_LEN = 10;

const DFFSimulator = () => {
  const [D, setD] = useState(0);
  const [Q, setQ] = useState(0);
  const [history, setHistory] = useState({ d: [], clk: [], q: [] });
  const [log, setLog] = useState([
    { msg: "Ready. Set D and click ↑ Clock Edge.", type: "info" },
  ]);
  const logRef = useRef(null);

  const pushLog = (msg, type = "info") =>
    setLog((l) => [...l.slice(-4), { msg, type }]);

  const addTick = (dVal, clkHigh, qVal) => {
    setHistory((h) => ({
      d: [...h.d.slice(-(WAVE_LEN - 1)), dVal],
      clk: [...h.clk.slice(-(WAVE_LEN - 1)), clkHigh],
      q: [...h.q.slice(-(WAVE_LEN - 1)), qVal],
    }));
  };

  const toggleD = () => {
    const nd = 1 - D;
    setD(nd);
    addTick(nd, 0, Q);
    pushLog(
      `D changed to ${nd}. Q is still ${Q} — waiting for clock edge.`,
      "warn",
    );
  };

  const clockEdge = () => {
    setQ(D);
    addTick(D, 1, D);
    if (D === Q)
      pushLog(`↑ Clock edge — D=${D}, Q stays ${D} (no change).`, "info");
    else
      pushLog(
        `↑ Clock edge — Q captured D=${D}. Q changed from ${Q} → ${D}!`,
        "success",
      );
  };

  const reset = () => {
    setD(0);
    setQ(0);
    setHistory({ d: [], clk: [], q: [] });
    setLog([{ msg: "Reset. Set D and click ↑ Clock Edge.", type: "info" }]);
  };

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  // Draw waveform
  const WaveCanvas = ({ signal, color, label }) => {
    const canvasRef = useRef(null);
    useEffect(() => {
      const c = canvasRef.current;
      if (!c) return;
      const ctx = c.getContext("2d");
      const w = c.width,
        h = c.height;
      const lo = h - 6,
        hi = 6;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const seg = w / Math.max(signal.length, 1);
      signal.forEach((v, i) => {
        const x = i * seg;
        const y = v ? hi : lo;
        const ny = i + 1 < signal.length ? (signal[i + 1] ? hi : lo) : y;
        if (i === 0) ctx.moveTo(0, y);
        ctx.lineTo(x + seg, y);
        if (ny !== y) ctx.lineTo(x + seg, ny);
      });
      ctx.stroke();
    }, [signal, color]);
    return (
      <div className="seq-wave-row">
        <span className="seq-wave-label">{label}</span>
        <canvas
          ref={canvasRef}
          width={300}
          height={36}
          className="seq-wave-canvas"
        />
        <span className="seq-wave-cur" style={{ color }}>
          {signal[signal.length - 1] ?? "–"}
        </span>
      </div>
    );
  };

  const logColors = { info: "#94a3b8", warn: "#f59e0b", success: "#10b981" };

  return (
    <div className="seq-sim-full">
      <div className="seq-sim-header">
        <span className="seq-sim-title">⚡ D Flip-Flop Simulator</span>
        <button className="seq-sim-reset" onClick={reset}>
          Reset
        </button>
      </div>

      <div className="seq-sim-body">
        {/* Controls */}
        <div className="seq-sim-controls">
          <div className="seq-sim-signal-row">
            <span className="seq-sim-sig-label">D input</span>
            <button
              className={`seq-bit-btn ${D ? "seq-bit-high" : "seq-bit-low"}`}
              onClick={toggleD}
            >
              {D} <span className="seq-bit-hint">click to toggle</span>
            </button>
          </div>
          <button className="seq-clk-edge-btn" onClick={clockEdge}>
            ↑ Clock Edge
          </button>
          <div className="seq-sim-outputs">
            <div className="seq-out-box">
              <span className="seq-out-lbl">Q</span>
              <span
                className={`seq-out-val ${Q ? "seq-val-high" : "seq-val-low"}`}
              >
                {Q}
              </span>
            </div>
            <div className="seq-out-box">
              <span className="seq-out-lbl">Q̄</span>
              <span
                className={`seq-out-val ${!Q ? "seq-val-high" : "seq-val-low"}`}
              >
                {1 - Q}
              </span>
            </div>
          </div>
        </div>

        {/* Waveforms */}
        <div className="seq-waveform-panel">
          <div className="seq-wave-title">Waveform history</div>
          <WaveCanvas signal={history.d} color="#818cf8" label="D" />
          <WaveCanvas signal={history.clk} color="#f59e0b" label="CLK" />
          <WaveCanvas signal={history.q} color="#10b981" label="Q" />
        </div>
      </div>

      {/* Log */}
      <div className="seq-sim-log" ref={logRef}>
        {log.map((l, i) => (
          <div
            key={i}
            className="seq-log-entry"
            style={{ color: logColors[l.type] }}
          >
            {l.msg}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   TIMING DIAGRAM (SVG, annotated)
───────────────────────────────────────────── */
const TimingDiagram = () => (
  <div className="seq-diagram">
    <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg">
      {/* Signal labels */}
      <text
        x="40"
        y="38"
        fontSize="11"
        fill="#94a3b8"
        textAnchor="end"
        fontWeight="600"
      >
        CLK
      </text>
      <text
        x="40"
        y="100"
        fontSize="11"
        fill="#94a3b8"
        textAnchor="end"
        fontWeight="600"
      >
        D
      </text>
      <text
        x="40"
        y="165"
        fontSize="11"
        fill="#94a3b8"
        textAnchor="end"
        fontWeight="600"
      >
        Q
      </text>

      {/* CLK */}
      <polyline
        points="45,50 45,20 125,20 125,50 205,50 205,20 285,20 285,50 365,50 365,20 445,20 445,50 525,50"
        fill="none"
        stroke="#818cf8"
        strokeWidth="2"
      />

      {/* D — changes mid-cycle */}
      <polyline
        points="45,110 155,110 155,80 255,80 255,110 370,110 370,80 525,80"
        fill="none"
        stroke="#60a5fa"
        strokeWidth="2"
      />

      {/* Q — updates only at rising edges */}
      <polyline
        points="45,175 125,175 125,175 205,175 205,145 285,145 285,145 365,145 365,175 445,175 445,175 525,175"
        fill="none"
        stroke="#10b981"
        strokeWidth="2.5"
      />

      {/* Rising edge dashed markers */}
      {[125, 285, 445].map((x) => (
        <line
          key={x}
          x1={x}
          y1="10"
          x2={x}
          y2="185"
          stroke="#818cf8"
          strokeWidth="1"
          strokeDasharray="4 3"
          opacity="0.5"
        />
      ))}

      {/* Edge arrows */}
      {[125, 285, 445].map((x) => (
        <text
          key={x}
          x={x}
          y="8"
          fontSize="10"
          fill="#818cf8"
          textAnchor="middle"
        >
          ↑
        </text>
      ))}

      {/* Setup/Hold annotation around 2nd edge */}
      <rect
        x="260"
        y="60"
        width="50"
        height="56"
        rx="4"
        fill="#6366f1"
        fillOpacity="0.08"
        stroke="#6366f1"
        strokeWidth="0.5"
        strokeDasharray="3 2"
      />
      <text x="285" y="76" fontSize="8" fill="#818cf8" textAnchor="middle">
        t_su
      </text>
      <rect
        x="285"
        y="60"
        width="30"
        height="56"
        rx="0"
        fill="#6366f1"
        fillOpacity="0.06"
      />
      <text x="300" y="76" fontSize="8" fill="#818cf8" textAnchor="middle">
        t_h
      </text>

      {/* tP arrow */}
      <line
        x1="285"
        y1="195"
        x2="365"
        y2="195"
        stroke="#10b981"
        strokeWidth="1"
        markerEnd="url(#tpArr)"
      />
      <defs>
        <marker
          id="tpArr"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L6,3z" fill="#10b981" />
        </marker>
      </defs>
      <text x="325" y="208" fontSize="9" fill="#10b981" textAnchor="middle">
        t_p (CLK→Q delay)
      </text>

      {/* Capture annotations */}
      <text x="130" y="198" fontSize="8" fill="#f59e0b">
        Q←0
      </text>
      <text x="290" y="198" fontSize="8" fill="#f59e0b">
        Q←1
      </text>
      <text x="450" y="198" fontSize="8" fill="#f59e0b">
        Q←0
      </text>

      {/* Legend */}
      <line
        x1="46"
        y1="225"
        x2="66"
        y2="225"
        stroke="#818cf8"
        strokeWidth="2"
      />
      <text x="70" y="229" fontSize="9" fill="#818cf8">
        CLK
      </text>
      <line
        x1="110"
        y1="225"
        x2="130"
        y2="225"
        stroke="#60a5fa"
        strokeWidth="2"
      />
      <text x="134" y="229" fontSize="9" fill="#60a5fa">
        D
      </text>
      <line
        x1="165"
        y1="225"
        x2="185"
        y2="225"
        stroke="#10b981"
        strokeWidth="2"
      />
      <text x="189" y="229" fontSize="9" fill="#10b981">
        Q
      </text>
    </svg>
    <p className="seq-diagram-caption">
      Figure — Annotated timing diagram. Q updates only at ↑ edges, delayed by
      t_p. D must be stable during the setup/hold window.
    </p>
  </div>
);

/* ─────────────────────────────────────────────
   METASTABILITY VISUAL
───────────────────────────────────────────── */
const MetastabilityVisual = () => (
  <div className="seq-meta-visual">
    <div className="seq-meta-item seq-meta-ok">
      <div className="seq-meta-title">✅ Normal capture</div>
      <svg viewBox="0 0 200 60" width="200">
        <line
          x1="20"
          y1="30"
          x2="80"
          y2="30"
          stroke="#10b981"
          strokeWidth="2"
        />
        <line
          x1="80"
          y1="30"
          x2="80"
          y2="10"
          stroke="#10b981"
          strokeWidth="2"
        />
        <line
          x1="80"
          y1="10"
          x2="180"
          y2="10"
          stroke="#10b981"
          strokeWidth="2"
        />
        <text x="100" y="48" fontSize="9" fill="#64748b" textAnchor="middle">
          Clean 0→1 transition
        </text>
      </svg>
    </div>
    <div className="seq-meta-item seq-meta-bad">
      <div className="seq-meta-title">⚠️ Metastable (setup violated)</div>
      <svg viewBox="0 0 200 60" width="200">
        <line
          x1="20"
          y1="30"
          x2="60"
          y2="30"
          stroke="#ef4444"
          strokeWidth="2"
        />
        <path
          d="M60,30 Q80,10 90,25 Q100,38 110,18 Q120,8 140,10"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
        />
        <line
          x1="140"
          y1="10"
          x2="180"
          y2="10"
          stroke="#ef4444"
          strokeWidth="2"
        />
        <text x="100" y="48" fontSize="9" fill="#ef4444" textAnchor="middle">
          Bouncing — resolves randomly
        </text>
      </svg>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const SeqFlipFlops = () => (
  <SeqLayout
    title="Introduction to Flip-Flops"
    subtitle="Edge-triggered bistable elements — the fundamental building blocks of every synchronous digital system."
  >
    <div className="seq-content-body">
      {/* ── What is a flip-flop ── */}
      <div className="seq-box">
        <span className="seq-box-title">What is a Flip-Flop?</span>
        <p>
          A <strong>flip-flop</strong> is a 1-bit memory element that can only
          change its output at a specific edge of the clock signal. It stores a
          single binary value (0 or 1) and holds it steady until the next clock
          edge tells it to update.
        </p>
        <p style={{ marginTop: "0.6rem" }}>
          Think of it as a <strong>controlled snapshot</strong>: you can wave
          your hand (change D) as much as you like, but the flip-flop only looks
          at the exact moment the camera shutter fires (↑ clock edge).
        </p>
      </div>

      {/* ── Analogy ── */}
      <h2>Latch vs Flip-Flop — The Key Difference</h2>
      <p>
        Before flip-flops existed, engineers used <strong>latches</strong>. The
        problem: a latch is transparent while its enable pin is high, meaning
        any glitch on the input immediately corrupts the output. Flip-flops
        solve this by only sampling at a single instant.
      </p>
      <AnalogyCard />

      {/* ── Edge triggering ── */}
      <h2>Rising vs Falling Edge</h2>
      <p>
        A clock signal alternates between 0 and 1. A flip-flop can be designed
        to sample on either transition:
      </p>
      <div className="seq-grid-2">
        <div className="seq-feature-card">
          <span className="seq-feature-icon">⬆️</span>
          <p className="seq-feature-title">Positive-edge triggered</p>
          <p className="seq-feature-desc">
            Captures D at the moment CLK goes 0→1 (rising edge). The most common
            type in modern design. Schematic symbol: triangle at CLK pin.
          </p>
        </div>
        <div className="seq-feature-card">
          <span className="seq-feature-icon">⬇️</span>
          <p className="seq-feature-title">Negative-edge triggered</p>
          <p className="seq-feature-desc">
            Captures D at the moment CLK goes 1→0 (falling edge). Schematic
            symbol: triangle with bubble (inversion circle) at CLK pin.
          </p>
        </div>
      </div>

      {/* ── Master-Slave ── */}
      <h2>How It Works — Master-Slave Construction</h2>
      <p>
        A flip-flop is built by chaining two D latches. The first is called the{" "}
        <strong>Master</strong> (enabled when CLK is LOW) and the second the{" "}
        <strong>Slave</strong> (enabled when CLK is HIGH). Step through the
        three phases below to see exactly what each latch does during a clock
        cycle.
      </p>
      <MasterSlaveWalkthrough />

      {/* ── Simulator ── */}
      <h2>Try It — Live D Flip-Flop Simulator</h2>
      <p>
        Change D as many times as you like — notice Q doesn't budge. Then click{" "}
        <strong>↑ Clock Edge</strong> and watch Q capture D. The waveform
        history records every action so you can see the behaviour over time.
      </p>
      <DFFSimulator />

      {/* ── Timing diagram ── */}
      <h2>Reading a Timing Diagram</h2>
      <p>
        Datasheets describe flip-flop behaviour using timing diagrams. The
        critical rules are: Q only changes <em>after</em> a rising edge (delayed
        by t_p), and D must be stable during the narrow setup/hold window
        surrounding that edge.
      </p>
      <TimingDiagram />

      {/* ── Async overrides ── */}
      <h2>Asynchronous Override Inputs — PRĒ and CLR̄</h2>
      <p>
        Most flip-flops have two extra pins that bypass the clock entirely. They
        are <strong>active-low</strong> — they activate when the signal is 0
        (not 1). Use them to force a known state at power-up or during a reset
        sequence.
      </p>
      <div className="seq-box info" style={{ marginBottom: "1rem" }}>
        <span className="seq-box-title">Active-Low Explained</span>
        <p>
          The bar over PRĒ and CLR̄ means they are active when driven LOW (0),
          not HIGH. So PRĒ = 0 means "Preset is active right now." This is a
          common convention in TTL/CMOS logic families.
        </p>
      </div>
      <SeqTable data={asyncOverrideData} className="seq-flip-table" />

      {/* ── Timing params ── */}
      <h2>Key Timing Parameters</h2>
      <p>
        Every flip-flop datasheet lists these numbers. They determine the
        maximum safe clock speed of your circuit.
      </p>
      <SeqTable data={timingParamsData} className="seq-flip-table" />

      {/* ── Summary box ── */}
      <div className="seq-box info">
        <span className="seq-box-title">
          Flip-Flop vs Latch — Quick Reference
        </span>
        <p>
          <strong>Latch:</strong> Level-sensitive · Asynchronous · Transparent
          while EN=1 · Prone to glitches
          <br />
          <strong>Flip-Flop:</strong> Edge-triggered · Synchronous · Only
          changes on clock edge · Glitch-immune
          <br />
          <br />
          Flip-flops are the universal building block of synchronous design.
          Every register, counter, state machine, and pipeline stage is made of
          them. Modern synthesis tools map all sequential logic to D flip-flops.
        </p>
      </div>

      {/* ── Metastability ── */}
      <div className="seq-box warning">
        <span className="seq-box-title">
          ⚠️ Metastability — What Happens When You Violate Timing
        </span>
        <p>
          If D changes during the setup or hold window, the flip-flop is forced
          to decide between 0 and 1 with insufficient time. It enters a{" "}
          <strong>metastable</strong> state — an indeterminate voltage somewhere
          between logic 0 and logic 1 — and can take an unpredictable amount of
          time to resolve. This causes random, unreproducible bugs that are
          extremely hard to debug.
        </p>
        <MetastabilityVisual />
        <p style={{ marginTop: "0.8rem" }}>
          <strong>Solution:</strong> Synchronizer circuits (two cascaded
          flip-flops) give the signal two clock periods to resolve before it
          reaches the rest of the design. Used in every clock-domain crossing.
        </p>
      </div>
    </div>
  </SeqLayout>
);

export default SeqFlipFlops;
