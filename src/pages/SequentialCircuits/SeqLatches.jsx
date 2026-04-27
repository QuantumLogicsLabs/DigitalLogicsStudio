import React, { useState } from "react";
import { Lock, Unlock, Code2 } from "lucide-react";
import SeqLayout from "./SeqLayout";
import SeqTable from "./components/SeqTable";
import SeqTableData from "./data/SeqTableData";

// ─── SR Latch Simulator ───────────────────────────────────────────────────────
// Simulates a NOR-based SR latch. Tracks Q across state changes so that the
// "Hold" (S=0, R=0) row correctly remembers the last stored value.
const SRLatchSim = () => {
  const [S, setS] = useState(0);
  const [R, setR] = useState(0);
  // storedQ remembers the last definite Q value (0 or 1) so Hold can show it.
  const [storedQ, setStoredQ] = useState(0);

  const isInvalid = S === 1 && R === 1;
  const isHold = S === 0 && R === 0;

  // Derive current Q display value from inputs
  let Q, Qbar, state, stateClass;
  if (isHold) {
    Q = storedQ;
    Qbar = 1 - storedQ;
    state = "Hold — latch remembers its last stored value";
    stateClass = "hold";
  } else if (S && !R) {
    Q = 1;
    Qbar = 0;
    state = "SET — Q forced to 1";
    stateClass = "set";
  } else if (!S && R) {
    Q = 0;
    Qbar = 1;
    state = "RESET — Q forced to 0";
    stateClass = "reset";
  } else {
    Q = "?";
    Qbar = "?";
    state = "⚠ FORBIDDEN — both NOR outputs fight each other. Avoid this!";
    stateClass = "invalid";
  }

  const handleS = () => {
    const newS = 1 - S;
    setS(newS);
    // Capture Q before switching to Hold
    if (newS === 1 && R === 0) setStoredQ(1);
    if (newS === 0 && R === 1) setStoredQ(0);
  };

  const handleR = () => {
    const newR = 1 - R;
    setR(newR);
    if (S === 1 && newR === 0) setStoredQ(1);
    if (S === 0 && newR === 1) setStoredQ(0);
  };

  // Which truth-table row is active?
  const activeRow = isInvalid ? "11" : isHold ? "00" : S ? "10" : "01";

  return (
    <div className="seq-sim">
      <p className="seq-sim-title">⚡ SR Latch Simulator</p>

      {/* ── Explanation of what each input does ── */}
      <p className="seq-sim-hint">
        <strong>S (Set)</strong> forces Q to 1. &nbsp;
        <strong>R (Reset)</strong> forces Q to 0. &nbsp; Both LOW → latch holds
        its value. &nbsp; Both HIGH → forbidden.
      </p>

      <div className="seq-sim-inputs">
        <label className="seq-sim-label">
          S — Set
          <button
            className={`seq-sim-toggle ${S ? "on" : "off"}`}
            onClick={handleS}
          >
            {S}
          </button>
        </label>
        <label className="seq-sim-label">
          R — Reset
          <button
            className={`seq-sim-toggle ${R ? "on" : "off"}`}
            onClick={handleR}
          >
            {R}
          </button>
        </label>
      </div>

      <div className={`seq-sim-output${isInvalid ? " invalid" : ""}`}>
        <div className="seq-out-row">
          <span className="seq-out-label">Q =</span>
          <span className="seq-out-val">{Q}</span>
        </div>
        <div className="seq-out-row">
          <span className="seq-out-label">Q̄ =</span>
          <span className="seq-out-val">{Qbar}</span>
        </div>
        <div className={`seq-sim-state seq-sim-state--${stateClass}`}>
          {state}
        </div>
      </div>

      {/* Live truth-table that highlights the active row */}
      <div className="seq-sim-truth">
        <p className="seq-sim-truth-label">Active row highlighted ↓</p>
        <table className="seq-table seq-table--compact">
          <thead>
            <tr>
              <th>S</th>
              <th>R</th>
              <th>Q next</th>
              <th>Q̄ next</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                key: "00",
                s: 0,
                r: 0,
                q: "Q",
                qb: "Q̄",
                action: "Hold (memory)",
              },
              { key: "10", s: 1, r: 0, q: "1", qb: "0", action: "SET" },
              { key: "01", s: 0, r: 1, q: "0", qb: "1", action: "RESET" },
              {
                key: "11",
                s: 1,
                r: 1,
                q: "?",
                qb: "?",
                action: "⚠ Forbidden",
                warn: true,
              },
            ].map((row) => (
              <tr
                key={row.key}
                className={
                  activeRow === row.key
                    ? row.warn
                      ? "seq-row-active seq-row-warn"
                      : "seq-row-active"
                    : row.warn
                      ? "seq-row-warn"
                      : ""
                }
              >
                <td>{row.s}</td>
                <td>{row.r}</td>
                <td>{row.q}</td>
                <td>{row.qb}</td>
                <td>{row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Gated SR Latch Simulator ─────────────────────────────────────────────────
// Adds an Enable gate in front of the classic SR latch.
// When EN=0 the S and R inputs are masked — the latch is locked.
const GatedSRSim = () => {
  const [S, setS] = useState(0);
  const [R, setR] = useState(0);
  const [EN, setEN] = useState(0);
  const [storedQ, setStoredQ] = useState(0);

  // Effective inputs after the AND gates
  const effS = EN ? S : 0;
  const effR = EN ? R : 0;

  let Q, Qbar, state, stateClass;
  if (!EN) {
    Q = storedQ;
    Qbar = 1 - storedQ;
    state = "EN = 0 → latch is locked. S and R are ignored completely.";
    stateClass = "hold";
  } else if (effS && effR) {
    Q = "?";
    Qbar = "?";
    state = "⚠ FORBIDDEN — EN=1 but S=R=1";
    stateClass = "invalid";
  } else if (effS) {
    Q = 1;
    Qbar = 0;
    state = "EN = 1, S = 1 → SET — Q becomes 1";
    stateClass = "set";
  } else if (effR) {
    Q = 0;
    Qbar = 1;
    state = "EN = 1, R = 1 → RESET — Q becomes 0";
    stateClass = "reset";
  } else {
    Q = storedQ;
    Qbar = 1 - storedQ;
    state = "EN = 1, S = 0, R = 0 → Hold";
    stateClass = "hold";
  }

  const handleEN = () => {
    const next = 1 - EN;
    if (next === 1) {
      if (S && !R) setStoredQ(1);
      else if (!S && R) setStoredQ(0);
    }
    setEN(next);
  };

  return (
    <div className="seq-sim-mini">
      <p className="seq-sim-title">⚡ Gated SR Latch Simulator</p>
      <p className="seq-sim-hint">
        EN acts like a gate: when EN=0 the latch is completely deaf to S and R.
      </p>
      <div className="seq-sim-inputs">
        <label className="seq-sim-label">
          EN (enable)
          <button
            className={`seq-sim-toggle ${EN ? "on" : "off"}`}
            onClick={handleEN}
          >
            {EN}
          </button>
        </label>
        <label className="seq-sim-label">
          S
          <button
            className={`seq-sim-toggle ${S ? "on" : "off"}`}
            onClick={() => {
              setS((v) => 1 - v);
              if (EN && !R) setStoredQ(1 - S ? 1 : storedQ);
            }}
          >
            {S}
          </button>
        </label>
        <label className="seq-sim-label">
          R
          <button
            className={`seq-sim-toggle ${R ? "on" : "off"}`}
            onClick={() => {
              setR((v) => 1 - v);
              if (EN && !S) setStoredQ(1 - R ? 0 : storedQ);
            }}
          >
            {R}
          </button>
        </label>
      </div>
      <div
        className={`seq-sim-output${stateClass === "invalid" ? " invalid" : ""}`}
      >
        <div className="seq-out-row">
          <span className="seq-out-label">Q =</span>
          <span className="seq-out-val">{Q}</span>
        </div>
        <div className="seq-out-row">
          <span className="seq-out-label">Q̄ =</span>
          <span className="seq-out-val">{Qbar}</span>
        </div>
        <div className={`seq-sim-state seq-sim-state--${stateClass}`}>
          {state}
        </div>
      </div>
    </div>
  );
};

// ─── D Latch Simulator ────────────────────────────────────────────────────────
// The D latch fixes the forbidden state by forcing R = D̄ internally.
// When EN=1 it is "transparent" — Q follows D in real time.
// When EN=0 it is "opaque" — Q is frozen regardless of D.
const DLatchSim = () => {
  const [D, setD] = useState(0);
  const [EN, setEN] = useState(0);
  const [Q, setQ] = useState(0);

  const handleEN = (val) => {
    setEN(val);
    if (val === 1) setQ(D); // become transparent immediately
  };

  const handleD = (val) => {
    setD(val);
    if (EN === 1) setQ(val); // only track D while transparent
  };

  const activeRow = !EN ? "en0" : D ? "en1d1" : "en1d0";

  return (
    <div className="seq-sim-mini">
      <p className="seq-sim-title">⚡ D Latch Simulator</p>
      <p className="seq-sim-hint">
        <strong>EN=1 (transparent):</strong> Q copies D instantly — like a
        window that's open. &nbsp;
        <strong>EN=0 (opaque):</strong> Q is frozen — like a photo of the last D
        value.
      </p>
      <div className="seq-sim-inputs">
        <label className="seq-sim-label">
          D (data)
          <button
            className={`seq-sim-toggle ${D ? "on" : "off"}`}
            onClick={() => handleD(1 - D)}
          >
            {D}
          </button>
        </label>
        <label className="seq-sim-label">
          EN (enable)
          <button
            className={`seq-sim-toggle ${EN ? "on" : "off"}`}
            onClick={() => handleEN(1 - EN)}
          >
            {EN}
          </button>
        </label>
      </div>
      <div className="seq-sim-output">
        <div className="seq-out-row">
          <span className="seq-out-label">Q =</span>
          <span className="seq-out-val">{Q}</span>
        </div>
        <div className="seq-out-row">
          <span className="seq-out-label">Q̄ =</span>
          <span className="seq-out-val">{1 - Q}</span>
        </div>
        <div className={`seq-sim-state seq-sim-state--${EN ? "set" : "hold"}`}>
          {EN
            ? `Transparent — Q is tracking D = ${D} right now`
            : `Opaque — Q is frozen at ${Q}, ignoring D = ${D}`}
        </div>
      </div>

      {/* Live truth table */}
      <div className="seq-sim-truth">
        <p className="seq-sim-truth-label">Active row highlighted ↓</p>
        <table className="seq-table seq-table--compact">
          <thead>
            <tr>
              <th>EN</th>
              <th>D</th>
              <th>Q next</th>
              <th>Mode</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                key: "en0",
                en: 0,
                d: "X",
                q: "Q (no change)",
                mode: "Opaque / Hold",
              },
              { key: "en1d1", en: 1, d: 1, q: "1", mode: "Transparent → SET" },
              {
                key: "en1d0",
                en: 1,
                d: 0,
                q: "0",
                mode: "Transparent → RESET",
              },
            ].map((row) => (
              <tr
                key={row.key}
                className={activeRow === row.key ? "seq-row-active" : ""}
              >
                <td>{row.en}</td>
                <td>{row.d}</td>
                <td>{row.q}</td>
                <td>{row.mode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const SeqLatches = () => (
  <SeqLayout
    title="Latches"
    subtitle="The simplest 1-bit memory elements — they remember a value without needing a clock."
  >
    <div className="seq-content-body">
      {/* ── What is a latch? ── */}
      <div className="seq-box">
        <span className="seq-box-title">What is a latch?</span>
        <p>
          A <strong>latch</strong> is a circuit that stores{" "}
          <strong>one bit</strong> (a 0 or a 1) and holds that value until it is
          explicitly changed. It is the simplest form of memory in digital
          electronics.
        </p>
        <p>
          Unlike a combinational gate whose output only depends on the current
          inputs, a latch has <strong>feedback</strong> — its output is routed
          back to its own input, which is what lets it "remember".
        </p>
        <p>
          Latches are <strong>level-sensitive</strong>: they respond to input
          levels at any time, not just on a clock edge. That makes them
          asynchronous by nature.
        </p>
      </div>

      {/* ── SR Latch (NOR) ── */}
      <h2>SR Latch — NOR Implementation</h2>
      <p>
        The SR latch is the foundation of all latch types. It is built from{" "}
        <strong>
          two NOR gates whose outputs feed back into each other's inputs
        </strong>
        . This cross-coupling is what creates the memory effect.
      </p>
      <p>
        It has two inputs and two outputs that are always complementary
        (opposites):
      </p>
      <ul>
        <li>
          <strong>S (Set)</strong> — drive Q to 1
        </li>
        <li>
          <strong>R (Reset)</strong> — drive Q to 0
        </li>
        <li>
          <strong>Q</strong> — the stored bit (the "main" output)
        </li>
        <li>
          <strong>Q̄</strong> — always the opposite of Q
        </li>
      </ul>

      <SeqTable data={SeqTableData.SRLatch} />

      <div className="seq-box info">
        <span className="seq-box-title">Why is S=1, R=1 forbidden?</span>
        <p>
          When both S and R are HIGH at the same time, both NOR gates are forced
          to output 0, meaning Q = Q̄ = 0 — which is a contradiction (they must
          always be opposites). When S and R return to 0 from this state, the
          latch races unpredictably to either 0 or 1. The outcome depends on
          tiny differences in transistor switching speed and is effectively
          random. This is why S=R=1 is called <strong>forbidden</strong>.
        </p>
      </div>

      <SRLatchSim />

      {/* NOR gate diagram */}
      <div className="seq-diagram">
        <svg
          viewBox="0 0 480 220"
          xmlns="http://www.w3.org/2000/svg"
          style={{ fontFamily: "'JetBrains Mono',monospace" }}
        >
          <defs>
            <marker
              id="aL"
              markerWidth="7"
              markerHeight="7"
              refX="5"
              refY="2.5"
              orient="auto"
            >
              <path d="M0,0 L0,5 L7,2.5z" fill="#6366f1" />
            </marker>
          </defs>

          {/* NOR gate 1 */}
          <rect
            x="110"
            y="25"
            width="120"
            height="60"
            rx="8"
            fill="rgba(30,27,75,.9)"
            stroke="#818cf8"
            strokeWidth="2"
          />
          <rect
            x="110"
            y="25"
            width="120"
            height="3"
            rx="2"
            fill="#818cf8"
            opacity="0.7"
          />
          <text
            x="170"
            y="51"
            fontSize="12"
            fill="#a5b4fc"
            textAnchor="middle"
            fontWeight="700"
          >
            NOR gate 1
          </text>
          <text x="170" y="68" fontSize="10" fill="#64748b" textAnchor="middle">
            S input side
          </text>

          {/* NOR gate 2 */}
          <rect
            x="110"
            y="130"
            width="120"
            height="60"
            rx="8"
            fill="rgba(30,27,75,.9)"
            stroke="#818cf8"
            strokeWidth="2"
          />
          <rect
            x="110"
            y="130"
            width="120"
            height="3"
            rx="2"
            fill="#818cf8"
            opacity="0.7"
          />
          <text
            x="170"
            y="156"
            fontSize="12"
            fill="#a5b4fc"
            textAnchor="middle"
            fontWeight="700"
          >
            NOR gate 2
          </text>
          <text
            x="170"
            y="173"
            fontSize="10"
            fill="#64748b"
            textAnchor="middle"
          >
            R input side
          </text>

          {/* S input */}
          <line
            x1="20"
            y1="47"
            x2="110"
            y2="47"
            stroke="#6366f1"
            strokeWidth="2"
            markerEnd="url(#aL)"
          />
          <text x="8" y="42" fontSize="13" fill="#c7d2fe" fontWeight="700">
            S
          </text>

          {/* R input */}
          <line
            x1="20"
            y1="152"
            x2="110"
            y2="152"
            stroke="#6366f1"
            strokeWidth="2"
            markerEnd="url(#aL)"
          />
          <text x="8" y="147" fontSize="13" fill="#c7d2fe" fontWeight="700">
            R
          </text>

          {/* Q output line */}
          <line
            x1="230"
            y1="55"
            x2="400"
            y2="55"
            stroke="#10b981"
            strokeWidth="2.5"
          />
          <text x="406" y="60" fontSize="13" fill="#10b981" fontWeight="700">
            Q
          </text>

          {/* Q-bar output line */}
          <line
            x1="230"
            y1="160"
            x2="400"
            y2="160"
            stroke="#10b981"
            strokeWidth="2.5"
          />
          <text x="406" y="165" fontSize="13" fill="#10b981" fontWeight="700">
            Q̄
          </text>

          {/* Feedback: Q → NOR2 */}
          <line
            x1="340"
            y1="55"
            x2="340"
            y2="100"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="5"
          />
          <line
            x1="340"
            y1="100"
            x2="110"
            y2="140"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="5"
            markerEnd="url(#aL)"
          />

          {/* Feedback: Q̄ → NOR1 */}
          <line
            x1="340"
            y1="160"
            x2="340"
            y2="115"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="5"
          />
          <line
            x1="340"
            y1="115"
            x2="110"
            y2="72"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="5"
            markerEnd="url(#aL)"
          />

          <text
            x="350"
            y="110"
            fontSize="9"
            fill="#f59e0b"
            letterSpacing="0.08em"
          >
            feedback
          </text>
        </svg>
        <p className="seq-diagram-caption">
          Figure 1 — SR Latch (NOR implementation). The dashed yellow lines are
          the cross-coupled feedback paths that create memory.
        </p>
      </div>

      {/* ── SR Latch (NAND) ── */}
      <h2>SR Latch — NAND Implementation</h2>
      <p>
        The NAND version works on the same principle but with{" "}
        <strong>active-low inputs</strong>. The inputs are written S̄ and R̄ to
        indicate that a logic 0 (not 1) triggers the action. The idle
        (no-change) condition is S̄=1, R̄=1, which is the opposite of the NOR
        version.
      </p>
      <p>
        This is the version you encounter in older TTL chips (e.g. the 74LS00
        quad NAND). It behaves identically to the NOR latch — just with inverted
        input polarity.
      </p>

      <SeqTable data={SeqTableData.SRLatchNAND} />

      <div className="seq-box warning">
        <span className="seq-box-title">NOR vs NAND — key difference</span>
        <p>
          <strong>NOR latch:</strong> inputs are active-HIGH. Idle state = S=0,
          R=0. Forbidden = S=1, R=1.
          <br />
          <strong>NAND latch:</strong> inputs are active-LOW. Idle state = S̄=1,
          R̄=1. Forbidden = S̄=0, R̄=0.
          <br />
          The outputs behave the same way — only the input polarity is flipped.
        </p>
      </div>

      {/* ── Gated SR Latch ── */}
      <h2>Gated SR Latch</h2>
      <p>
        The basic SR latch responds to its inputs at any time, which makes it
        difficult to control. The <strong>gated SR latch</strong> adds an{" "}
        <strong>Enable (EN)</strong> input — essentially AND gates that sit in
        front of S and R. Now the latch only listens when EN=1.
      </p>

      <div className="seq-grid-2">
        <div className="seq-feature-card">
          <Lock className="seq-feature-icon" size={32} />
          <p className="seq-feature-title">EN = 0 — Locked</p>
          <p className="seq-feature-desc">
            The AND gates block S and R, sending 0s into the NOR gates
            regardless of what S and R are doing. Q is completely frozen. This
            is the "hold" state — the latch is remembering but not listening.
          </p>
        </div>
        <div className="seq-feature-card">
          <Unlock className="seq-feature-icon" size={32} />
          <p className="seq-feature-title">EN = 1 — Transparent</p>
          <p className="seq-feature-desc">
            The AND gates pass S and R through to the NOR gates. The latch now
            behaves exactly like a plain SR latch — it responds immediately to
            any S or R change. The forbidden S=R=1 condition still applies.
          </p>
        </div>
      </div>

      <GatedSRSim />

      {/* ── D Latch ── */}
      <h2>D Latch (Data / Transparent Latch)</h2>
      <p>
        The D latch solves the SR latch's biggest problem — the forbidden state
        — by making it physically impossible to apply S=R=1. It does this by{" "}
        <strong>connecting R to the complement of S through an inverter</strong>
        , then renaming S to D (data). Now there is only one data input.
      </p>
      <p>
        The consequence: R always equals D̄, so S and R can never both be 1. The
        forbidden state is eliminated by construction.
      </p>

      <div className="seq-box">
        <span className="seq-box-title">How D and EN work together</span>
        <p>
          Think of the D latch like a{" "}
          <strong>transparent window with a shutter</strong>:
        </p>
        <p>
          When <strong>EN=1</strong> the shutter is open — you can see through
          (Q follows D in real time, continuously). This is called the
          "transparent" mode.
        </p>
        <p>
          When <strong>EN=0</strong> the shutter closes — the window freezes and
          shows the last image it saw (Q holds the value D had when EN went
          low). This is called the "opaque" or "hold" mode.
        </p>
      </div>

      <SeqTable data={SeqTableData.DLatch} />

      <DLatchSim />

      {/* ── Characteristic equation ── */}
      <h2>Characteristic Equation</h2>
      <p>
        The characteristic equation mathematically describes what Q will become
        (Q⁺ = "Q next") based on the current inputs and current Q.
      </p>
      <div className="seq-grid-2">
        <div className="seq-feature-card">
          <Code2 className="seq-feature-icon" size={32} />
          <p className="seq-feature-title">SR Latch</p>
          <p className="seq-feature-desc">
            <code>Q⁺ = S + R̄·Q</code>
            <br />
            <br />
            Read: "Q next equals S OR (NOT-R AND current Q)." The constraint S·R
            = 0 must always hold.
          </p>
        </div>
        <div className="seq-feature-card">
          <Code2 className="seq-feature-icon" size={32} />
          <p className="seq-feature-title">D Latch</p>
          <p className="seq-feature-desc">
            <code>Q⁺ = EN·D + EN̄·Q</code>
            <br />
            <br />
            Read: "Q next is D when enabled, otherwise it stays as Q." No
            forbidden states — always valid.
          </p>
        </div>
      </div>

      {/* ── Latch vs Flip-Flop ── */}
      <div className="seq-box info">
        <span className="seq-box-title">
          Latch vs Flip-Flop — what's the difference?
        </span>
        <p>
          A <strong>latch</strong> is <em>level-sensitive</em>: it can change
          state at any moment while EN is HIGH. This means a noisy input can
          cause unwanted state changes — called <strong>glitches</strong>.
        </p>
        <p>
          A <strong>flip-flop</strong> is <em>edge-triggered</em>: it only
          captures its input at the exact instant of a rising (or falling) clock
          edge and ignores everything in between. This makes synchronous design
          safe and predictable.
        </p>
        <p>
          In practice: use latches when you need simple, fast, clock-free
          storage (e.g. inside an FPGA cell or a register file). Use flip-flops
          for everything in a clocked digital system.
        </p>
      </div>

      {/* ── Timing Constraints ── */}
      <h2>Timing Constraints</h2>
      <p>
        Even though latches have no clock, they still have timing requirements.
        Violating them puts the latch into an unpredictable state.
      </p>

      <SeqTable data={SeqTableData.LatchTiming} />

      <div className="seq-box warning">
        <span className="seq-box-title">Metastability</span>
        <p>
          If D changes too close to when EN falls (violating t<sub>su</sub> or t
          <sub>h</sub>), the latch's internal feedback loop has insufficient
          time to settle. It enters a <strong>metastable state</strong> — an
          intermediate voltage that is neither a valid 0 nor a valid 1. The
          circuit eventually resolves to one or the other, but the time it takes
          is statistically unbounded and can cause downstream logic errors.
          Always satisfy timing constraints in real hardware.
        </p>
      </div>
    </div>
  </SeqLayout>
);

export default SeqLatches;
