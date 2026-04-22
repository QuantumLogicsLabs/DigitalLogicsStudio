import React, { useState } from "react";
import SeqLayout from "./SeqLayout";

const DFFSim = () => {
  const [D, setD] = useState(0);
  const [Q, setQ] = useState(0);
  return (
    <div className="seq-sim-mini">
      <p className="seq-sim-title">⚡ D Flip-Flop Simulator</p>
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
        <button className="seq-clk-btn" onClick={() => setQ(D)}>
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
    <div className="seq-content-body">
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
      <div className="seq-table-wrap">
        <table className="seq-table">
          <thead>
            <tr>
              <th>S</th>
              <th>R</th>
              <th>Q⁺</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0</td>
              <td>0</td>
              <td>Q</td>
              <td>No change</td>
            </tr>
            <tr>
              <td>0</td>
              <td>1</td>
              <td>0</td>
              <td>Reset</td>
            </tr>
            <tr>
              <td>1</td>
              <td>0</td>
              <td>1</td>
              <td>Set</td>
            </tr>
            <tr>
              <td>1</td>
              <td>1</td>
              <td>?</td>
              <td>⚠ Undefined</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="seq-box">
        <span className="seq-box-title">Characteristic Equation</span>
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
      <div className="seq-table-wrap">
        <table className="seq-table">
          <thead>
            <tr>
              <th>J</th>
              <th>K</th>
              <th>Q⁺</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0</td>
              <td>0</td>
              <td>Q</td>
              <td>No change</td>
            </tr>
            <tr>
              <td>0</td>
              <td>1</td>
              <td>0</td>
              <td>Reset</td>
            </tr>
            <tr>
              <td>1</td>
              <td>0</td>
              <td>1</td>
              <td>Set</td>
            </tr>
            <tr>
              <td>1</td>
              <td>1</td>
              <td>Q̄</td>
              <td>Toggle</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="seq-box">
        <span className="seq-box-title">Characteristic Equation</span>
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
      <div className="seq-table-wrap">
        <table className="seq-table">
          <thead>
            <tr>
              <th>D</th>
              <th>Q⁺</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0</td>
              <td>0</td>
              <td>Reset</td>
            </tr>
            <tr>
              <td>1</td>
              <td>1</td>
              <td>Set</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="seq-box">
        <span className="seq-box-title">Characteristic Equation</span>
        <code className="seq-equation">Q⁺ = D</code>
      </div>
      <DFFSim />

      {/* T */}
      <h2>4. T Flip-Flop (Toggle)</h2>
      <p>
        Single input <strong>T</strong>: T=1 toggles the output each clock edge;
        T=0 holds. The natural element for building binary counters.
      </p>
      <div className="seq-table-wrap">
        <table className="seq-table">
          <thead>
            <tr>
              <th>T</th>
              <th>Q⁺</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0</td>
              <td>Q</td>
              <td>Hold</td>
            </tr>
            <tr>
              <td>1</td>
              <td>Q̄</td>
              <td>Toggle</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="seq-box">
        <span className="seq-box-title">Characteristic Equation</span>
        <code className="seq-equation">Q⁺ = T ⊕ Q</code>
      </div>

      <h2>Comparison Summary</h2>
      <div className="seq-table-wrap">
        <table className="seq-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Inputs</th>
              <th>Char. Equation</th>
              <th>Key Property</th>
              <th>Best Use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>SR</strong>
              </td>
              <td>S, R</td>
              <td>S + R̄Q</td>
              <td>Forbidden SR=11</td>
              <td>Direct set/reset</td>
            </tr>
            <tr>
              <td>
                <strong>JK</strong>
              </td>
              <td>J, K</td>
              <td>JQ̄ + K̄Q</td>
              <td>Toggle JK=11; universal</td>
              <td>Versatile design</td>
            </tr>
            <tr>
              <td>
                <strong>D</strong>
              </td>
              <td>D</td>
              <td>D</td>
              <td>No forbidden state</td>
              <td>VLSI / all modern design</td>
            </tr>
            <tr>
              <td>
                <strong>T</strong>
              </td>
              <td>T</td>
              <td>T ⊕ Q</td>
              <td>Toggles on T=1</td>
              <td>Counters</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Flip-Flop Conversions</h2>
      <div className="seq-table-wrap">
        <table className="seq-table">
          <thead>
            <tr>
              <th>Have → Want</th>
              <th>Connect inputs as:</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>JK → D</td>
              <td>J = D, K = D̄</td>
            </tr>
            <tr>
              <td>JK → T</td>
              <td>J = T, K = T</td>
            </tr>
            <tr>
              <td>D → JK</td>
              <td>D = JQ̄ + K̄Q</td>
            </tr>
            <tr>
              <td>D → T</td>
              <td>D = T ⊕ Q</td>
            </tr>
            <tr>
              <td>D → SR</td>
              <td>D = S + R̄Q (ensure SR=0)</td>
            </tr>
          </tbody>
        </table>
      </div>

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
