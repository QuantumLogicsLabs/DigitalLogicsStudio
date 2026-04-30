import React, { useState } from "react";
import SeqLayout from "./SeqLayout";
import SeqTable from "./components/SeqTable";

const srData = {
  headers: ['S', 'R', 'Q⁺', 'Operation'],
  rows: [
    { 'S': '0', 'R': '0', 'Q⁺': 'Q', 'Operation': 'No change' },
    { 'S': '0', 'R': '1', 'Q⁺': '0', 'Operation': 'Reset' },
    { 'S': '1', 'R': '0', 'Q⁺': '1', 'Operation': 'Set' },
    { 'S': '1', 'R': '1', 'Q⁺': '?', 'Operation': '⚠ Undefined' }
  ]
};

const jkData = {
  headers: ['J', 'K', 'Q⁺', 'Operation'],
  rows: [
    { 'J': '0', 'K': '0', 'Q⁺': 'Q', 'Operation': 'No change' },
    { 'J': '0', 'K': '1', 'Q⁺': '0', 'Operation': 'Reset' },
    { 'J': '1', 'K': '0', 'Q⁺': '1', 'Operation': 'Set' },
    { 'J': '1', 'K': '1', 'Q⁺': 'Q̄', 'Operation': 'Toggle' }
  ]
};

const dData = {
  headers: ['D', 'Q⁺', 'Operation'],
  rows: [
    { 'D': '0', 'Q⁺': '0', 'Operation': 'Reset' },
    { 'D': '1', 'Q⁺': '1', 'Operation': 'Set' }
  ]
};

const tData = {
  headers: ['T', 'Q⁺', 'Operation'],
  rows: [
    { 'T': '0', 'Q⁺': 'Q', 'Operation': 'Hold' },
    { 'T': '1', 'Q⁺': 'Q̄', 'Operation': 'Toggle' }
  ]
};

const comparisonData = {
  headers: ['Type', 'Inputs', 'Char. Equation', 'Key Property', 'Best Use'],
  rows: [
    { 'Type': '<strong>SR</strong>', 'Inputs': 'S, R', 'Char. Equation': 'S + R̄Q', 'Key Property': 'Forbidden SR=11', 'Best Use': 'Direct set/reset' },
    { 'Type': '<strong>JK</strong>', 'Inputs': 'J, K', 'Char. Equation': 'JQ̄ + K̄Q', 'Key Property': 'Toggle JK=11; universal', 'Best Use': 'Versatile design' },
    { 'Type': '<strong>D</strong>', 'Inputs': 'D', 'Char. Equation': 'D', 'Key Property': 'No forbidden state', 'Best Use': 'VLSI / all modern design' },
    { 'Type': '<strong>T</strong>', 'Inputs': 'T', 'Char. Equation': 'T ⊕ Q', 'Key Property': 'Toggles on T=1', 'Best Use': 'Counters' }
  ]
};

const conversionsData = {
  headers: ['Have → Want', 'Connect inputs as:'],
  rows: [
    { 'Have → Want': 'JK → D', 'Connect inputs as:': 'J = D, K = D̄' },
    { 'Have → Want': 'JK → T', 'Connect inputs as:': 'J = T, K = T' },
    { 'Have → Want': 'D → JK', 'Connect inputs as:': 'D = JQ̄ + K̄Q' },
    { 'Have → Want': 'D → T', 'Connect inputs as:': 'D = T ⊕ Q' },
    { 'Have → Want': 'D → SR', 'Connect inputs as:': 'D = S + R̄Q (ensure SR=0)' }
  ]
};

const DFFSim = () => {
  const [D, setD] = useState(0);
  const [Q, setQ] = useState(0);
  return (
    <div className="seq-sim-mini">
      <p className="seq-sim-title">⚡ D Flip-Flop Simulator</p>
      <div className="seq-sim-inputs">
        <label className="seq-sim-label">
          D {" "}
          <button
            className={`seq-sim-toggle ${D ? "on" : "off"}`}
            onClick={() => setD((d) => 1 - d)}
          >
            {D}
          </button>
        </label>
        <button className="seq-clk-btn" onClick={() => setQ(D)}>
          {" "} ↑ Clock Edge
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
    </div>
  );
};

const JKFFSim = () => {
  const [J, setJ] = useState(0);
  const [K, setK] = useState(0);
  const [Q, setQ] = useState(0);
  const trigger = () => {
    if (!J && !K) {
      /* hold */
    } else if (!J && K) {
      setQ(0);
    } else if (J && !K) {
      setQ(1);
    } else {
      setQ((q) => 1 - q);
    }
  };
  const actions = ["Hold", "Reset", "Set", "Toggle"];
  const idx = J * 2 + K;
  return (
    <div className="seq-sim-mini">
      <p className="seq-sim-title">⚡ JK Flip-Flop Simulator</p>
      <div className="seq-sim-inputs">
        <label className="seq-sim-label">
          J {" "}
          <button
            className={`seq-sim-toggle ${J ? "on" : "off"}`}
            onClick={() => setJ((j) => 1 - j)}
          >
            {J}
          </button>
        </label>
        <label className="seq-sim-label">
          {" "} K {" "}
          <button
            className={`seq-sim-toggle ${K ? "on" : "off"}`}
            onClick={() => setK((k) => 1 - k)}
          >
            {K}
          </button>
        </label>
        <button className="seq-clk-btn" onClick={trigger}>
          {" "} ↑ Clock Edge
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
          {actions[idx]} — Q⁺ = {["Q", "0", "1", "Q̄"][idx]}
        </div>
      </div>
    </div>
  );
};

const SeqFlipFlopTypes = () => (
  <SeqLayout
    title="Types of Flip-Flops"
    subtitle="SR, JK, D, and T — their characteristic tables, equations, excitation requirements, and trade-offs."
  >
    <div className="seq-content-body seq-flipflop-types">
      <p>
        Four flip-flop types are fundamental to digital design. Each is defined
        by its
        <strong> characteristic table</strong> (Q⁺ as a function of inputs and
        Q) and its
        <strong> characteristic equation</strong>.
      </p>

      {/* SR */}
      <h2>1. SR Flip-Flop</h2>
      <p>
        The clocked version of the SR latch. Two inputs <strong>S</strong> and{" "}
        <strong>R</strong>, state changes only on the clock edge. The S=R=1
        condition remains undefined.
      </p>
      <SeqTable data={srData} className="seq-table" />
      <div className="seq-box">
        <span className="seq-box-title">Characteristic Equation : {" "}</span>
        <code className="seq-equation">
          Q⁺ = S + R̄·Q &nbsp;&nbsp; (constraint: S·R = 0)
        </code>
      </div>

      {/* JK */}
      <h2>2. JK Flip-Flop</h2>
      <p>
        Improves on SR by making J=K=1 a valid input — it causes the output to
        <strong> toggle</strong>. This is the most versatile flip-flop and can
        emulate all others.
      </p>
      <SeqTable data={jkData} className="seq-table" />
      <div className="seq-box">
        <span className="seq-box-title">Characteristic Equation : {" "}</span>
        <code className="seq-equation">Q⁺ = J·Q̄ + K̄·Q</code>
      </div>
      <JKFFSim />

      {/* D */}
      <h2>3. D Flip-Flop (Data / Delay)</h2>
      <p>
        The simplest and most widely used. A single data input{" "}
        <strong>D</strong> is copied to Q on each clock edge. No forbidden
        states. The dominant element in VLSI synthesis.
      </p>
      <SeqTable data={dData} className="seq-table" />
      <div className="seq-box">
        <span className="seq-box-title">Characteristic Equation : {" "}</span>
        <code className="seq-equation">Q⁺ = D</code>
      </div>
      <DFFSim />

      {/* T */}
      <h2>4. T Flip-Flop (Toggle)</h2>
      <p>
        Single input <strong>T</strong>: T=1 toggles the output each clock edge;
        T=0 holds. The natural element for building binary counters.
      </p>
      <SeqTable data={tData} className="seq-table" />
      <div className="seq-box">
        <span className="seq-box-title">Characteristic Equation : {" "}</span>
        <code className="seq-equation">Q⁺ = T ⊕ Q</code>
      </div>

      <h2>Comparison Summary</h2>
      <SeqTable data={comparisonData} className="seq-table" />

      <h2>Flip-Flop Conversions</h2>
      <SeqTable data={conversionsData} className="seq-table" />

      <div className="seq-box info">
        <span className="seq-box-title">Industry Practice</span>
        <p>
          Modern FPGA and ASIC tools synthesize all sequential logic as{" "}
          <strong>D flip-flops</strong>. JK and T flip-flops are rarely
          implemented directly in silicon — they're emulated using D flip-flops
          with extra combinational logic. Study them to understand theory; use D
          in practice.
        </p>
      </div>
    </div>
  </SeqLayout>
);

export default SeqFlipFlopTypes;
