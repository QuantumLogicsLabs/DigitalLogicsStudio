import React, { useState } from "react";
import SeqLayout from "./SeqLayout";
import SeqBox from "./components/SeqBox";
import SeqBoxData from "./data/SeqBoxData";

const SRLatchSim = () => {
  const [S, setS] = useState(0);
  const [R, setR] = useState(0);
  const isInvalid = S === 1 && R === 1;
  let Q, Qbar, state;
  if (!S && !R) {
    Q = "Q";
    Qbar = "Q̄";
    state = "Memory — no change";
  } else if (S && !R) {
    Q = "1";
    Qbar = "0";
    state = "SET";
  } else if (!S && R) {
    Q = "0";
    Qbar = "1";
    state = "RESET";
  } else {
    Q = "?";
    Qbar = "?";
    state = "⚠ FORBIDDEN — invalid state";
  }

  return (
    <div className="seq-sim">
      <p className="seq-sim-title">⚡ Interactive SR Latch Simulator</p>
      <div className="seq-sim-inputs">
        <label className="seq-sim-label">
          S — Set
          <button
            className={`seq-sim-toggle ${S ? "on" : "off"}`}
            onClick={() => setS((s) => 1 - s)}
          >
            {S}
          </button>
        </label>
        <label className="seq-sim-label">
          R — Reset
          <button
            className={`seq-sim-toggle ${R ? "on" : "off"}`}
            onClick={() => setR((r) => 1 - r)}
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
        <div className="seq-sim-state">{state}</div>
      </div>
    </div>
  );
};

const DLatchSim = () => {
  const [D, setD] = useState(0);
  const [EN, setEN] = useState(0);
  const [Q, setQ] = useState(0);

  const handleEN = (val) => {
    setEN(val);
    if (val === 1) setQ(D);
  };
  const handleD = (val) => {
    setD(val);
    if (EN === 1) setQ(val);
  };

  return (
    <div className="seq-sim-mini">
      <p className="seq-sim-title">⚡ Interactive D Latch</p>
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
        <div className="seq-sim-state">
          {EN ? "Transparent — Q follows D" : "Hold — Q frozen"}
        </div>
      </div>
    </div>
  );
};

const SeqLatches = () => (
  <SeqLayout
    title="Introduction to Latches"
    subtitle="The simplest bistable memory elements — level-sensitive storage that responds directly to input levels."
  >
    <div className="seq-content-body">
      <SeqBox data={SeqBoxData.sequentialcircuit} />

      <h2>SR Latch — NOR Implementation</h2>
      <p>
        The classic SR latch is built from two cross-coupled NOR gates. It has
        two inputs,
        <strong>S (Set)</strong> and <strong>R (Reset)</strong>, and two
        complementary outputs
        <strong>Q</strong> and <strong>Q̄</strong>.
      </p>

      <div className="seq-table-wrap">
        <table className="seq-table">
          <thead>
            <tr>
              <th>S</th>
              <th>R</th>
              <th>Q (next)</th>
              <th>Q̄ (next)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0</td>
              <td>0</td>
              <td>Q</td>
              <td>Q̄</td>
              <td>No change (memory)</td>
            </tr>
            <tr>
              <td>1</td>
              <td>0</td>
              <td>1</td>
              <td>0</td>
              <td>Set</td>
            </tr>
            <tr>
              <td>0</td>
              <td>1</td>
              <td>0</td>
              <td>1</td>
              <td>Reset</td>
            </tr>
            <tr>
              <td>1</td>
              <td>1</td>
              <td>?</td>
              <td>?</td>
              <td>⚠ Forbidden</td>
            </tr>
          </tbody>
        </table>
      </div>

      <SRLatchSim />

      <div className="seq-diagram">
        <svg
          viewBox="0 0 480 200"
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
          {/* NOR 1 */}
          <rect
            x="110"
            y="30"
            width="110"
            height="55"
            rx="8"
            fill="rgba(30,27,75,.9)"
            stroke="#818cf8"
            strokeWidth="2"
          />
          <rect
            x="110"
            y="30"
            width="110"
            height="3"
            rx="2"
            fill="#818cf8"
            opacity="0.7"
          />
          <text
            x="165"
            y="62"
            fontSize="13"
            fill="#a5b4fc"
            textAnchor="middle"
            fontWeight="700"
          >
            NOR
          </text>
          {/* NOR 2 */}
          <rect
            x="110"
            y="120"
            width="110"
            height="55"
            rx="8"
            fill="rgba(30,27,75,.9)"
            stroke="#818cf8"
            strokeWidth="2"
          />
          <rect
            x="110"
            y="120"
            width="110"
            height="3"
            rx="2"
            fill="#818cf8"
            opacity="0.7"
          />
          <text
            x="165"
            y="152"
            fontSize="13"
            fill="#a5b4fc"
            textAnchor="middle"
            fontWeight="700"
          >
            NOR
          </text>
          {/* S input */}
          <line
            x1="20"
            y1="50"
            x2="110"
            y2="50"
            stroke="#6366f1"
            strokeWidth="2"
            markerEnd="url(#aL)"
          />
          <text x="8" y="45" fontSize="12" fill="#c7d2fe" fontWeight="700">
            S
          </text>
          {/* R input */}
          <line
            x1="20"
            y1="140"
            x2="110"
            y2="140"
            stroke="#6366f1"
            strokeWidth="2"
            markerEnd="url(#aL)"
          />
          <text x="8" y="135" fontSize="12" fill="#c7d2fe" fontWeight="700">
            R
          </text>
          {/* Q output */}
          <line
            x1="220"
            y1="57"
            x2="380"
            y2="57"
            stroke="#10b981"
            strokeWidth="2.5"
          />
          <text x="385" y="62" fontSize="13" fill="#10b981" fontWeight="700">
            Q
          </text>
          {/* Q-bar output */}
          <line
            x1="220"
            y1="147"
            x2="380"
            y2="147"
            stroke="#10b981"
            strokeWidth="2.5"
          />
          <text x="385" y="152" fontSize="13" fill="#10b981" fontWeight="700">
            Q̄
          </text>
          {/* Cross feedback */}
          <line
            x1="320"
            y1="57"
            x2="320"
            y2="92"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="5"
          />
          <line
            x1="320"
            y1="92"
            x2="110"
            y2="130"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="5"
          />
          <line
            x1="320"
            y1="147"
            x2="320"
            y2="112"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="5"
          />
          <line
            x1="320"
            y1="112"
            x2="110"
            y2="70"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="5"
          />
          <text
            x="330"
            y="102"
            fontSize="9"
            fill="#f59e0b"
            letterSpacing="0.1em"
          >
            feedback
          </text>
        </svg>
        <p className="seq-diagram-caption">
          Figure 1 — SR Latch using cross-coupled NOR gates (active-high inputs)
        </p>
      </div>

      <h2>SR Latch — NAND Implementation</h2>
      <p>
        The NAND-based SR latch has <strong>active-low inputs</strong> (S̄, R̄).
        The latch sets when S̄=0 and resets when R̄=0. The forbidden condition
        becomes S̄=0, R̄=0.
      </p>

      <div className="seq-table-wrap">
        <table className="seq-table">
          <thead>
            <tr>
              <th>S̄</th>
              <th>R̄</th>
              <th>Q (next)</th>
              <th>Q̄ (next)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>1</td>
              <td>Q</td>
              <td>Q̄</td>
              <td>No change</td>
            </tr>
            <tr>
              <td>0</td>
              <td>1</td>
              <td>1</td>
              <td>0</td>
              <td>Set</td>
            </tr>
            <tr>
              <td>1</td>
              <td>0</td>
              <td>0</td>
              <td>1</td>
              <td>Reset</td>
            </tr>
            <tr>
              <td>0</td>
              <td>0</td>
              <td>?</td>
              <td>?</td>
              <td>⚠ Forbidden</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Gated SR Latch</h2>
      <p>
        Adds an <strong>Enable (EN)</strong> input using AND gates before the
        NOR (or NAND) gates. The latch only responds to S and R changes when
        EN=1.
      </p>

      <div className="seq-grid-2">
        <div className="seq-feature-card">
          <span className="seq-feature-icon">🔴</span>
          <p className="seq-feature-title">EN = 0 (Disabled)</p>
          <p className="seq-feature-desc">
            Latch ignores S and R. Output Q is frozen at its last value.
          </p>
        </div>
        <div className="seq-feature-card">
          <span className="seq-feature-icon">🟢</span>
          <p className="seq-feature-title">EN = 1 (Enabled)</p>
          <p className="seq-feature-desc">
            Latch behaves as a standard SR latch, responding to S and R changes.
          </p>
        </div>
      </div>

      <h2>D Latch (Data / Transparent Latch)</h2>
      <p>
        The <strong>D latch</strong> eliminates the forbidden state completely
        by tying R = D̄. It has a single data input <strong>D</strong> and an{" "}
        <strong>Enable</strong> input.
      </p>

      <div className="seq-table-wrap">
        <table className="seq-table">
          <thead>
            <tr>
              <th>EN</th>
              <th>D</th>
              <th>Q (next)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0</td>
              <td>X</td>
              <td>Q</td>
              <td>Hold (memory)</td>
            </tr>
            <tr>
              <td>1</td>
              <td>0</td>
              <td>0</td>
              <td>Reset</td>
            </tr>
            <tr>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>Set</td>
            </tr>
          </tbody>
        </table>
      </div>

      <DLatchSim />

      <div className="seq-box info">
        <span className="seq-box-title">Latch vs Flip-Flop</span>
        <p>
          A <strong>latch</strong> is <em>level-sensitive</em> — changes any
          time EN is high. A <strong>flip-flop</strong> is{" "}
          <em>edge-triggered</em> — changes only on the active clock edge.
          Flip-flops are preferred in synchronous design because they eliminate
          glitches and make timing analysis straightforward.
        </p>
      </div>

      <h2>Timing Constraints</h2>
      <div className="seq-table-wrap">
        <table className="seq-table">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Symbol</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Propagation delay</td>
              <td>
                t<sub>pd</sub>
              </td>
              <td>Input change → stable output</td>
            </tr>
            <tr>
              <td>Setup time</td>
              <td>
                t<sub>su</sub>
              </td>
              <td>Input must be stable this long before EN goes low</td>
            </tr>
            <tr>
              <td>Hold time</td>
              <td>
                t<sub>h</sub>
              </td>
              <td>Input must remain stable after EN goes low</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="seq-box warning">
        <span className="seq-box-title">Metastability</span>
        <p>
          Violating setup or hold times forces the latch into a{" "}
          <strong>metastable state</strong>— an indeterminate output that may
          remain unstable for an unpredictable duration before resolving to a
          valid 0 or 1. Always satisfy timing constraints in real designs.
        </p>
      </div>
    </div>
  </SeqLayout>
);

export default SeqLatches;
