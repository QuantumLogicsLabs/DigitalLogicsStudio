import React, { useState } from "react";
import SeqLayout from "./SeqLayout";
import SeqTable from "./components/SeqTable";

/* ─────────────────────────────────────────────
   DATA TABLES
───────────────────────────────────────────── */
const srData = {
  headers: ["S", "R", "Q⁺", "Operation", "Plain English"],
  rows: [
    {
      S: "0",
      R: "0",
      "Q⁺": "Q",
      Operation: "No change",
      "Plain English": "Flip-flop remembers its current value",
    },
    {
      S: "0",
      R: "1",
      "Q⁺": "0",
      Operation: "Reset",
      "Plain English": "Force output to 0",
    },
    {
      S: "1",
      R: "0",
      "Q⁺": "1",
      Operation: "Set",
      "Plain English": "Force output to 1",
    },
    {
      S: "1",
      R: "1",
      "Q⁺": "?",
      Operation: "⚠ Undefined",
      "Plain English": "NEVER do this — unpredictable result",
    },
  ],
};

const jkData = {
  headers: ["J", "K", "Q⁺", "Operation", "Plain English"],
  rows: [
    {
      J: "0",
      K: "0",
      "Q⁺": "Q",
      Operation: "No change",
      "Plain English": "Hold current value",
    },
    {
      J: "0",
      K: "1",
      "Q⁺": "0",
      Operation: "Reset",
      "Plain English": "Force output to 0",
    },
    {
      J: "1",
      K: "0",
      "Q⁺": "1",
      Operation: "Set",
      "Plain English": "Force output to 1",
    },
    {
      J: "1",
      K: "1",
      "Q⁺": "Q̄",
      Operation: "Toggle",
      "Plain English": "Flip! If Q=0 → Q=1, if Q=1 → Q=0",
    },
  ],
};

const dData = {
  headers: ["D", "Q⁺", "Operation", "Plain English"],
  rows: [
    {
      D: "0",
      "Q⁺": "0",
      Operation: "Reset",
      "Plain English": "Output becomes 0",
    },
    {
      D: "1",
      "Q⁺": "1",
      Operation: "Set",
      "Plain English": "Output becomes 1",
    },
  ],
};

const tData = {
  headers: ["T", "Q⁺", "Operation", "Plain English"],
  rows: [
    {
      T: "0",
      "Q⁺": "Q",
      Operation: "Hold",
      "Plain English": "Nothing happens — Q stays the same",
    },
    {
      T: "1",
      "Q⁺": "Q̄",
      Operation: "Toggle",
      "Plain English": "Q flips every clock edge",
    },
  ],
};

const comparisonData = {
  headers: ["Type", "Inputs", "Equation", "Key Feature", "Best Used For"],
  rows: [
    {
      Type: "<strong>SR</strong>",
      Inputs: "S, R",
      Equation: "S + R̄Q",
      "Key Feature": "Forbidden state (S=R=1)",
      "Best Used For": "Direct set/reset control",
    },
    {
      Type: "<strong>JK</strong>",
      Inputs: "J, K",
      Equation: "JQ̄ + K̄Q",
      "Key Feature": "Toggle on J=K=1 — no forbidden state",
      "Best Used For": "Versatile / universal FF",
    },
    {
      Type: "<strong>D</strong>",
      Inputs: "D only",
      Equation: "D",
      "Key Feature": "Simplest — always safe",
      "Best Used For": "Registers, VLSI, all modern design",
    },
    {
      Type: "<strong>T</strong>",
      Inputs: "T only",
      Equation: "T ⊕ Q",
      "Key Feature": "Divides clock by 2 when T=1",
      "Best Used For": "Binary counters",
    },
  ],
};

const excitationData = {
  headers: ["Q → Q⁺", "SR (S R)", "JK (J K)", "D", "T"],
  rows: [
    { "Q → Q⁺": "0 → 0", "SR (S R)": "0 ×", "JK (J K)": "0 ×", D: "0", T: "0" },
    { "Q → Q⁺": "0 → 1", "SR (S R)": "1 0", "JK (J K)": "1 ×", D: "1", T: "1" },
    { "Q → Q⁺": "1 → 0", "SR (S R)": "0 1", "JK (J K)": "× 1", D: "0", T: "1" },
    { "Q → Q⁺": "1 → 1", "SR (S R)": "× 0", "JK (J K)": "× 0", D: "1", T: "0" },
  ],
};

const conversionsData = {
  headers: ["Have → Want", "Connect inputs as:", "Why it works"],
  rows: [
    {
      "Have → Want": "JK → D",
      "Connect inputs as:": "J = D, K = D̄",
      "Why it works": "J=1,K=0 sets; J=0,K=1 resets — same as D",
    },
    {
      "Have → Want": "JK → T",
      "Connect inputs as:": "J = T, K = T",
      "Why it works": "J=K=1 toggles; J=K=0 holds — same as T",
    },
    {
      "Have → Want": "D → T",
      "Connect inputs as:": "D = T ⊕ Q",
      "Why it works": "XOR with Q flips only when T=1",
    },
    {
      "Have → Want": "D → JK",
      "Connect inputs as:": "D = JQ̄ + K̄Q",
      "Why it works": "Implements the JK characteristic equation",
    },
    {
      "Have → Want": "D → SR",
      "Connect inputs as:": "D = S + R̄Q  (keep S·R = 0)",
      "Why it works": "SR equation evaluated in combinational logic before D",
    },
  ],
};

/* ─────────────────────────────────────────────
   TYPE OVERVIEW CARDS (visual selector)
───────────────────────────────────────────── */
const FF_TYPES = [
  {
    id: "sr",
    label: "SR",
    full: "SR Flip-Flop",
    icon: "🎛",
    color: "#f59e0b",
    tag: "Set / Reset",
    tagColor: "seq-tag-yellow",
    summary:
      "Two inputs: S sets Q=1, R resets Q=0. The grandfather of flip-flops — straightforward but has a forbidden state when both inputs are 1.",
  },
  {
    id: "jk",
    label: "JK",
    full: "JK Flip-Flop",
    icon: "🔄",
    color: "#6366f1",
    tag: "Universal",
    tagColor: "seq-tag-purple",
    summary:
      "The universal flip-flop. Fixes SR's forbidden state by turning J=K=1 into a toggle. Can emulate any other flip-flop type.",
  },
  {
    id: "d",
    label: "D",
    full: "D Flip-Flop",
    icon: "📸",
    color: "#10b981",
    tag: "Data / Delay",
    tagColor: "seq-tag-green",
    summary:
      "The simplest and most widely used. Q copies D at each clock edge — no forbidden states, no complexity. The default choice in VLSI and FPGA design.",
  },
  {
    id: "t",
    label: "T",
    full: "T Flip-Flop",
    icon: "🔁",
    color: "#3b82f6",
    tag: "Toggle",
    tagColor: "seq-tag-blue",
    summary:
      "One input: T=1 causes Q to flip every clock cycle, T=0 holds. Naturally divides the clock by 2 — the building block of binary counters.",
  },
];

/* ─────────────────────────────────────────────
   SIMULATORS
───────────────────────────────────────────── */

// Shared log hook
const useLog = (init) => {
  const [log, setLog] = useState([init]);
  const push = (msg, type = "info") =>
    setLog((l) => [...l.slice(-3), { msg, type }]);
  return [log, push];
};

const SimLog = ({ log }) => {
  const colors = {
    info: "#94a3b8",
    warn: "#f59e0b",
    success: "#10b981",
    error: "#ef4444",
  };
  return (
    <div className="seq-sim-log-mini">
      {log.map((l, i) => (
        <div
          key={i}
          style={{
            color: colors[l.type] || colors.info,
            fontSize: "12px",
            lineHeight: 1.4,
          }}
        >
          {l.msg}
        </div>
      ))}
    </div>
  );
};

const SRFFSim = () => {
  const [S, setS] = useState(0);
  const [R, setR] = useState(0);
  const [Q, setQ] = useState(0);
  const [log, push] = useLog({
    msg: "Set S=1 to set Q, R=1 to reset Q, then click Clock Edge.",
    type: "info",
  });

  const trigger = () => {
    if (S && R) {
      push(
        "⚠️ S=R=1 is FORBIDDEN! Output is undefined — this is a design error.",
        "error",
      );
      return;
    }
    if (S && !R) {
      setQ(1);
      push("↑ Edge — S=1, R=0 → Q set to 1.", "success");
    } else if (!S && R) {
      setQ(0);
      push("↑ Edge — S=0, R=1 → Q reset to 0.", "success");
    } else push(`↑ Edge — S=0, R=0 → Q holds at ${Q} (no change).`, "info");
  };

  return (
    <div className="seq-sim-mini seq-sim-sr">
      <p className="seq-sim-title">🎛 SR Flip-Flop Simulator</p>
      <div className="seq-sim-inputs">
        <label className="seq-sim-label">
          S
          <button
            className={`seq-sim-toggle ${S ? "on" : "off"}`}
            onClick={() => setS((s) => 1 - s)}
          >
            {S}
          </button>
        </label>
        <label className="seq-sim-label">
          R
          <button
            className={`seq-sim-toggle ${R ? "on" : "off"}`}
            onClick={() => setR((r) => 1 - r)}
          >
            {R}
          </button>
        </label>
        <button className="seq-clk-btn" onClick={trigger}>
          ↑ Clock Edge
        </button>
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
        {S && R && (
          <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
            ⚠️ Forbidden state! Don't do this.
          </div>
        )}
      </div>
      <SimLog log={log} />
    </div>
  );
};

const JKFFSim = () => {
  const [J, setJ] = useState(0);
  const [K, setK] = useState(0);
  const [Q, setQ] = useState(0);
  const [log, push] = useLog({
    msg: "Try J=K=1 to see the toggle — SR's forbidden state, now fixed!",
    type: "info",
  });

  const ops = ["Hold", "Reset", "Set", "Toggle"];
  const eqs = ["Q (hold)", "0", "1", "Q̄ (toggle)"];

  const trigger = () => {
    const idx = J * 2 + K;
    const prev = Q;
    let next = Q;
    if (!J && K) next = 0;
    else if (J && !K) next = 1;
    else if (J && K) next = 1 - Q;
    setQ(next);
    push(
      `↑ Edge — J=${J}, K=${K} → ${ops[idx]}. Q: ${prev} → ${next}`,
      next !== prev ? "success" : "info",
    );
  };

  const idx = J * 2 + K;
  return (
    <div className="seq-sim-mini seq-sim-jk">
      <p className="seq-sim-title">🔄 JK Flip-Flop Simulator</p>
      <div className="seq-sim-inputs">
        <label className="seq-sim-label">
          J
          <button
            className={`seq-sim-toggle ${J ? "on" : "off"}`}
            onClick={() => setJ((j) => 1 - j)}
          >
            {J}
          </button>
        </label>
        <label className="seq-sim-label">
          K
          <button
            className={`seq-sim-toggle ${K ? "on" : "off"}`}
            onClick={() => setK((k) => 1 - k)}
          >
            {K}
          </button>
        </label>
        <button className="seq-clk-btn" onClick={trigger}>
          ↑ Clock Edge
        </button>
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
        <div className="seq-sim-state">
          Mode: <strong>{ops[idx]}</strong> — Q⁺ = {eqs[idx]}
        </div>
      </div>
      <SimLog log={log} />
    </div>
  );
};

const DFFSim = () => {
  const [D, setD] = useState(0);
  const [Q, setQ] = useState(0);
  const [log, push] = useLog({
    msg: "The simplest FF — Q just copies D at each clock edge.",
    type: "info",
  });

  const trigger = () => {
    const prev = Q;
    setQ(D);
    push(
      `↑ Edge — D=${D} → Q: ${prev} → ${D}${prev === D ? " (no change)" : ""}`,
      prev !== D ? "success" : "info",
    );
  };

  return (
    <div className="seq-sim-mini seq-sim-d">
      <p className="seq-sim-title">📸 D Flip-Flop Simulator</p>
      <div className="seq-sim-inputs">
        <label className="seq-sim-label">
          D
          <button
            className={`seq-sim-toggle ${D ? "on" : "off"}`}
            onClick={() => setD((d) => 1 - d)}
          >
            {D}
          </button>
        </label>
        <button className="seq-clk-btn" onClick={trigger}>
          ↑ Clock Edge
        </button>
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
        <div className="seq-sim-state">
          Q⁺ = D &nbsp;—&nbsp;{" "}
          {Q === D ? "Q already matches D" : "Click clock to capture D"}
        </div>
      </div>
      <SimLog log={log} />
    </div>
  );
};

const TFFSim = () => {
  const [T, setT] = useState(1);
  const [Q, setQ] = useState(0);
  const [count, setCount] = useState(0);
  const [log, push] = useLog({
    msg: "Try T=1 and click clock repeatedly — watch Q toggle (and count) every time!",
    type: "info",
  });

  const trigger = () => {
    const prev = Q;
    const next = T ? 1 - Q : Q;
    setQ(next);
    if (T) {
      setCount((c) => c + 1);
      push(
        `↑ Edge — T=1 → Toggle! Q: ${prev} → ${next}. Clocks so far: ${count + 1}`,
        "success",
      );
    } else {
      push(`↑ Edge — T=0 → Hold. Q stays at ${Q}.`, "info");
    }
  };

  return (
    <div className="seq-sim-mini seq-sim-t">
      <p className="seq-sim-title">🔁 T Flip-Flop Simulator</p>
      <div className="seq-sim-inputs">
        <label className="seq-sim-label">
          T
          <button
            className={`seq-sim-toggle ${T ? "on" : "off"}`}
            onClick={() => setT((t) => 1 - t)}
          >
            {T}
          </button>
        </label>
        <button className="seq-clk-btn" onClick={trigger}>
          ↑ Clock Edge
        </button>
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
        <div className="seq-out-row">
          <span className="seq-out-label">Clock count</span>
          <span className="seq-out-val" style={{ fontSize: "13px" }}>
            {count}
          </span>
        </div>
        <div className="seq-sim-state">
          {T ? "T=1: Q flips on every ↑ edge — try it!" : "T=0: Q is frozen"}
        </div>
      </div>
      <SimLog log={log} />
    </div>
  );
};

/* ─────────────────────────────────────────────
   2-BIT COUNTER VISUAL (T FF demo)
───────────────────────────────────────────── */
const TwobitCounter = () => {
  const [count, setCount] = useState(0);
  const q = [(count >> 1) & 1, count & 1];
  const step = () => setCount((c) => (c + 1) % 4);
  const reset = () => setCount(0);

  return (
    <div className="seq-counter-demo">
      <div className="seq-counter-title">
        2-bit binary counter using T flip-flops (T=1 always)
      </div>
      <div className="seq-counter-ffs">
        {["Q₁ (MSB)", "Q₀ (LSB)"].map((lbl, i) => (
          <div key={i} className="seq-counter-ff">
            <div className="seq-counter-ff-label">T-FF {lbl}</div>
            <div
              className={`seq-counter-ff-q ${q[i] ? "seq-q-high" : "seq-q-low"}`}
            >
              {q[i]}
            </div>
          </div>
        ))}
        <div className="seq-counter-decimal">= {count}</div>
      </div>
      <div className="seq-counter-sequence">
        {[0, 1, 2, 3].map((v) => (
          <div
            key={v}
            className={`seq-count-step ${v === count ? "seq-count-current" : ""}`}
          >
            {v}
          </div>
        ))}
      </div>
      <div className="seq-counter-btns">
        <button className="seq-clk-btn" onClick={step}>
          ↑ Clock Edge
        </button>
        <button
          className="seq-step-btn"
          onClick={reset}
          style={{ marginLeft: "8px" }}
        >
          Reset
        </button>
      </div>
      <div style={{ fontSize: "11px", color: "#64748b", marginTop: "8px" }}>
        Q₀ toggles every edge. Q₁ toggles every 2 edges — it sees Q₀ as its
        clock.
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   EXCITATION TABLE EXPLAINER
───────────────────────────────────────────── */
const ExcitationExplainer = () => (
  <div className="seq-box info" style={{ marginBottom: "1.2rem" }}>
    <span className="seq-box-title">What is an Excitation Table?</span>
    <p>
      A characteristic table answers: <em>"Given inputs, what is Q⁺?"</em> —
      useful for simulation. An <strong>excitation table</strong> answers the
      reverse: <em>"I want Q to go from X to Y — what inputs do I need?"</em>
      This is exactly what you need when <strong>designing</strong> a sequential
      circuit, because you know the desired state transitions and need to figure
      out what to connect to the flip-flop inputs. The × symbol means "don't
      care" — either 0 or 1 works.
    </p>
  </div>
);

/* ─────────────────────────────────────────────
   FULL PAGE
───────────────────────────────────────────── */
const SeqFlipFlopTypes = () => {
  const [activeType, setActiveType] = useState("sr");

  return (
    <SeqLayout
      title="Types of Flip-Flops"
      subtitle="SR, JK, D, and T — their characteristic tables, equations, simulators, and when to use each."
    >
      <div className="seq-content-body seq-flipflop-types">
        <p>
          Four fundamental flip-flop types exist in digital design. Each is
          characterised by its <strong>characteristic table</strong> (what Q⁺
          becomes given inputs and current Q) and{" "}
          <strong>characteristic equation</strong> (the boolean formula for Q⁺).
          They are all edge-triggered — they only change at the clock edge.
        </p>

        {/* Overview selector */}
        <div className="seq-ff-type-bar">
          {FF_TYPES.map((t) => (
            <button
              key={t.id}
              className={`seq-ff-type-btn ${activeType === t.id ? "seq-ff-type-active" : ""}`}
              style={{ "--ff-color": t.color }}
              onClick={() => setActiveType(t.id)}
            >
              <span className="seq-ff-type-icon">{t.icon}</span>
              <span className="seq-ff-type-label">{t.label}</span>
            </button>
          ))}
        </div>
        {/* Active type summary */}
        {FF_TYPES.filter((t) => t.id === activeType).map((t) => (
          <div
            key={t.id}
            className="seq-ff-summary"
            style={{ borderLeft: `3px solid ${t.color}` }}
          >
            <strong>{t.full}</strong> — {t.summary}
            <span
              className={`seq-analogy-tag ${t.tagColor}`}
              style={{ marginLeft: "8px" }}
            >
              {t.tag}
            </span>
          </div>
        ))}

        {/* ── SR ── */}
        <h2>1. SR Flip-Flop — Set / Reset</h2>
        <p>
          The clocked SR flip-flop has two inputs: <strong>S (Set)</strong> and{" "}
          <strong>R (Reset)</strong>. State changes happen only at the clock
          edge. It is the conceptual ancestor of all flip-flops, but the S=R=1
          forbidden state means it requires careful external logic to guarantee
          it is never applied.
        </p>
        <SeqTable data={srData} className="seq-table" />
        <div className="seq-box">
          <span className="seq-box-title">Characteristic equation</span>
          <code className="seq-equation">
            Q⁺ = S + R̄·Q &nbsp;&nbsp; (constraint: S·R = 0)
          </code>
          <p style={{ marginTop: "0.5rem", fontSize: "13px" }}>
            Read as: "Q next is 1 if S is 1, OR if Q is already 1 and R is 0."
            The constraint says S and R must never both be 1 simultaneously.
          </p>
        </div>
        <SRFFSim />

        {/* ── JK ── */}
        <h2>2. JK Flip-Flop — The Universal Flip-Flop</h2>
        <p>
          The JK flip-flop fixes the SR's fundamental weakness. Where SR=11 was
          forbidden, <strong>J=K=1 is perfectly valid</strong> in a JK — it
          causes the output to <strong>toggle</strong> (flip to its complement).
          This makes JK the most versatile flip-flop type.
        </p>
        <div className="seq-box info" style={{ marginBottom: "1rem" }}>
          <span className="seq-box-title">Why J and K?</span>
          <p>
            Named after Jack Kilby, inventor of the integrated circuit. The JK
            flip-flop was first described in the early 1960s and became the
            workhorse of TTL-era sequential design. It can emulate an SR (never
            apply J=K=1), a D (connect K = J̄), or a T (connect K = J = T).
          </p>
        </div>
        <SeqTable data={jkData} className="seq-table" />
        <div className="seq-box">
          <span className="seq-box-title">Characteristic equation</span>
          <code className="seq-equation">Q⁺ = J·Q̄ + K̄·Q</code>
          <p style={{ marginTop: "0.5rem", fontSize: "13px" }}>
            "Q next is 1 if J=1 and Q was 0 (Set), OR if K=0 and Q was already 1
            (Hold)."
          </p>
        </div>
        <JKFFSim />

        {/* ── D ── */}
        <h2>3. D Flip-Flop — Data / Delay</h2>
        <p>
          The simplest and most widely used flip-flop. A single input{" "}
          <strong>D</strong> is transferred to Q at each rising clock edge — no
          forbidden states, no complex equations. The "D" stands for{" "}
          <strong>Data</strong> (it stores one bit) or <strong>Delay</strong>{" "}
          (it delays D by exactly one clock cycle).
        </p>
        <p style={{ marginTop: "0.5rem" }}>
          All modern FPGAs and ASIC synthesis tools implement registers as D
          flip-flops. When you write <code>always @(posedge clk)</code> in
          Verilog or a process in VHDL, the synthesis tool creates a D
          flip-flop.
        </p>
        <SeqTable data={dData} className="seq-table" />
        <div className="seq-box">
          <span className="seq-box-title">Characteristic equation</span>
          <code className="seq-equation">Q⁺ = D</code>
          <p style={{ marginTop: "0.5rem", fontSize: "13px" }}>
            The simplest possible equation — output directly follows input
            (delayed by one clock cycle).
          </p>
        </div>
        <DFFSim />

        {/* ── T ── */}
        <h2>4. T Flip-Flop — Toggle</h2>
        <p>
          The T (Toggle) flip-flop has a single input: <strong>T=1</strong>{" "}
          causes Q to flip at every clock edge, while <strong>T=0</strong> holds
          Q steady. When T is tied permanently to 1, Q toggles every cycle —
          this divides the clock frequency by 2, making T flip-flops the natural
          building block for <strong>binary counters</strong>.
        </p>
        <SeqTable data={tData} className="seq-table" />
        <div className="seq-box">
          <span className="seq-box-title">Characteristic equation</span>
          <code className="seq-equation">Q⁺ = T ⊕ Q</code>
          <p style={{ marginTop: "0.5rem", fontSize: "13px" }}>
            XOR (⊕): output is 1 when inputs differ. So Q⁺ = Q (hold) when T=0,
            and Q⁺ = Q̄ (toggle) when T=1.
          </p>
        </div>
        <TFFSim />

        <h3 style={{ marginTop: "1.4rem", marginBottom: "0.6rem" }}>
          2-Bit Counter Built From T Flip-Flops
        </h3>
        <p>
          Chain two T flip-flops with T=1 always. Q₀ toggles every clock edge.
          Q₁ uses Q₀ as its clock — so it toggles every two master-clock edges.
          Together they count 00 → 01 → 10 → 11 → 00 …
        </p>
        <TwobitCounter />

        {/* ── Comparison ── */}
        <h2>Comparison Summary</h2>
        <SeqTable data={comparisonData} className="seq-table" />

        {/* ── Excitation tables ── */}
        <h2>Excitation Tables</h2>
        <ExcitationExplainer />
        <SeqTable data={excitationData} className="seq-table" />
        <div
          style={{ fontSize: "12px", color: "#64748b", marginTop: "0.4rem" }}
        >
          × = don't care (either 0 or 1 gives the same result for Q⁺)
        </div>

        {/* ── Conversions ── */}
        <h2>Flip-Flop Conversions</h2>
        <p>
          You can build any flip-flop type from any other by adding
          combinational logic in front of the inputs. The table below shows the
          conversion formulas — each derived from the excitation table of the
          desired type.
        </p>
        <SeqTable data={conversionsData} className="seq-table" />

        {/* ── Industry note ── */}
        <div className="seq-box info">
          <span className="seq-box-title">Industry Practice — Why Only D?</span>
          <p>
            Modern FPGA and ASIC tools synthesize all sequential logic as{" "}
            <strong>D flip-flops</strong>. JK and T flip-flops are rarely
            implemented directly in silicon — the synthesis tool emulates them
            using D flip-flops with extra combinational logic.
            <br />
            <br />
            <strong>Study SR and JK</strong> to understand state machine theory,
            excitation tables, and flip-flop conversions (common exam topics).
            <strong> Use D in every real project.</strong> The T flip-flop
            intuition (divide-by-2) is useful when reasoning about counter
            designs.
          </p>
        </div>
      </div>
    </SeqLayout>
  );
};

export default SeqFlipFlopTypes;
