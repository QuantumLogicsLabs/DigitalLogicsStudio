import React from "react";
import SeqLayout from "./SeqLayout";

const SeqFlipFlops = () => (
  <SeqLayout
    title="Introduction to Flip-Flops"
    subtitle="Edge-triggered bistable elements — the fundamental building blocks of every synchronous digital system."
  >
    <div className="seq-content-body">
      <div className="seq-box">
        <span className="seq-box-title">What is a Flip-Flop?</span>
        <p>
          A <strong>flip-flop</strong> is an edge-triggered bistable memory
          element. Unlike a latch (level-sensitive), a flip-flop captures its
          input and changes state <em>only</em> on a specific edge of the clock
          — the <strong>rising edge</strong> (0→1) or the
          <strong>falling edge</strong> (1→0).
        </p>
      </div>

      <h2>Master-Slave Construction</h2>
      <p>
        A flip-flop is built by cascading two D latches — a{" "}
        <strong>master</strong> (clocked by CLK̄) and a <strong>slave</strong>{" "}
        (clocked by CLK). This dual-latch arrangement guarantees the output only
        changes at the active clock edge.
      </p>

      <div className="seq-grid-2">
        <div className="seq-feature-card">
          <span className="seq-feature-icon">🟡</span>
          <p className="seq-feature-title">CLK = 0 (Low Phase)</p>
          <p className="seq-feature-desc">
            Master latch is transparent (captures D). Slave latch is disabled
            and holds the previous Q.
          </p>
        </div>
        <div className="seq-feature-card">
          <span className="seq-feature-icon">🟢</span>
          <p className="seq-feature-title">CLK = 1 (Rising Edge)</p>
          <p className="seq-feature-desc">
            Master latch freezes. Slave latch becomes transparent and passes the
            master's value to Q.
          </p>
        </div>
      </div>

      <div className="seq-diagram">
        <svg
          viewBox="0 0 580 200"
          xmlns="http://www.w3.org/2000/svg"
          style={{ fontFamily: "'JetBrains Mono',monospace" }}
        >
          <defs>
            <marker
              id="aFF"
              markerWidth="7"
              markerHeight="7"
              refX="5"
              refY="2.5"
              orient="auto"
            >
              <path d="M0,0 L0,5 L7,2.5z" fill="#6366f1" />
            </marker>
          </defs>
          {/* D input */}
          <line
            x1="20"
            y1="100"
            x2="80"
            y2="100"
            stroke="#6366f1"
            strokeWidth="2"
            markerEnd="url(#aFF)"
          />
          <text x="8" y="95" fontSize="12" fill="#c7d2fe" fontWeight="700">
            D
          </text>
          {/* Master */}
          <rect
            x="80"
            y="60"
            width="150"
            height="80"
            rx="10"
            fill="rgba(30,27,75,.9)"
            stroke="#f59e0b"
            strokeWidth="2"
          />
          <rect
            x="80"
            y="60"
            width="150"
            height="4"
            rx="2"
            fill="#f59e0b"
            opacity="0.7"
          />
          <text
            x="155"
            y="97"
            fontSize="13"
            fill="#fbbf24"
            textAnchor="middle"
            fontWeight="700"
          >
            MASTER
          </text>
          <text
            x="155"
            y="115"
            fontSize="10"
            fill="#64748b"
            textAnchor="middle"
          >
            D Latch (EN = CLK̄)
          </text>
          {/* CLK bubble for master */}
          <circle
            cx="155"
            cy="148"
            r="6"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
          />
          <line
            x1="155"
            y1="154"
            x2="155"
            y2="180"
            stroke="#10b981"
            strokeWidth="2"
          />
          {/* Intermediate wire */}
          <line
            x1="230"
            y1="100"
            x2="300"
            y2="100"
            stroke="#6366f1"
            strokeWidth="1.5"
            strokeDasharray="6"
          />
          <text x="258" y="93" fontSize="9" fill="#475569">
            Q_m
          </text>
          {/* Slave */}
          <rect
            x="300"
            y="60"
            width="150"
            height="80"
            rx="10"
            fill="rgba(30,27,75,.9)"
            stroke="#818cf8"
            strokeWidth="2"
          />
          <rect
            x="300"
            y="60"
            width="150"
            height="4"
            rx="2"
            fill="#818cf8"
            opacity="0.7"
          />
          <text
            x="375"
            y="97"
            fontSize="13"
            fill="#a5b4fc"
            textAnchor="middle"
            fontWeight="700"
          >
            SLAVE
          </text>
          <text
            x="375"
            y="115"
            fontSize="10"
            fill="#64748b"
            textAnchor="middle"
          >
            D Latch (EN = CLK)
          </text>
          {/* CLK to slave */}
          <line
            x1="375"
            y1="140"
            x2="375"
            y2="180"
            stroke="#10b981"
            strokeWidth="2"
          />
          {/* CLK rail */}
          <line
            x1="155"
            y1="180"
            x2="375"
            y2="180"
            stroke="#10b981"
            strokeWidth="2"
          />
          <text
            x="258"
            y="196"
            fontSize="11"
            fill="#10b981"
            textAnchor="middle"
            fontWeight="700"
          >
            CLK
          </text>
          {/* Q output */}
          <line
            x1="450"
            y1="100"
            x2="540"
            y2="100"
            stroke="#10b981"
            strokeWidth="2.5"
            markerEnd="url(#aFF)"
          />
          <text x="545" y="105" fontSize="13" fill="#10b981" fontWeight="700">
            Q
          </text>
          {/* CLK label */}
          <text x="120" y="168" fontSize="8" fill="#f59e0b">
            inverted CLK
          </text>
        </svg>
        <p className="seq-diagram-caption">
          Figure 1 — Positive-edge triggered D Flip-Flop (master-slave
          construction)
        </p>
      </div>

      <h2>Edge Triggering Types</h2>

      <div className="seq-diagram">
        <svg
          viewBox="0 0 520 160"
          xmlns="http://www.w3.org/2000/svg"
          style={{ fontFamily: "'JetBrains Mono',monospace" }}
        >
          <text x="10" y="35" fontSize="11" fill="#94a3b8" fontWeight="600">
            CLK
          </text>
          <polyline
            points="50,80 50,40 130,40 130,80 210,80 210,40 290,40 290,80 370,80 370,40 450,40 450,80"
            fill="none"
            stroke="#6366f1"
            strokeWidth="2.5"
          />
          {/* Rising edges (green) */}
          <line
            x1="130"
            y1="25"
            x2="130"
            y2="90"
            stroke="#10b981"
            strokeWidth="2"
            strokeDasharray="4"
          />
          <line
            x1="290"
            y1="25"
            x2="290"
            y2="90"
            stroke="#10b981"
            strokeWidth="2"
            strokeDasharray="4"
          />
          <text x="112" y="20" fontSize="9" fill="#10b981" fontWeight="700">
            ↑ Rise
          </text>
          <text x="272" y="20" fontSize="9" fill="#10b981" fontWeight="700">
            ↑ Rise
          </text>
          {/* Falling edges (orange) */}
          <line
            x1="210"
            y1="25"
            x2="210"
            y2="90"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="4"
          />
          <line
            x1="370"
            y1="25"
            x2="370"
            y2="90"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="4"
          />
          <text x="192" y="20" fontSize="9" fill="#f59e0b" fontWeight="700">
            ↓ Fall
          </text>
          <text x="352" y="20" fontSize="9" fill="#f59e0b" fontWeight="700">
            ↓ Fall
          </text>
          {/* Legend */}
          <rect x="10" y="110" width="12" height="3" rx="1" fill="#10b981" />
          <text x="28" y="121" fontSize="10" fill="#10b981">
            ▷ Positive-edge: captures D on ↑ (rising)
          </text>
          <rect x="10" y="135" width="12" height="3" rx="1" fill="#f59e0b" />
          <text x="28" y="147" fontSize="10" fill="#f59e0b">
            ○▷ Negative-edge: captures D on ↓ (falling)
          </text>
        </svg>
        <p className="seq-diagram-caption">
          Figure 2 — Clock edge triggering reference
        </p>
      </div>

      <h2>Asynchronous Override Inputs</h2>
      <p>
        Most flip-flops include <strong>Preset (PRE)</strong> and{" "}
        <strong>Clear (CLR)</strong>
        inputs that act independently of the clock. They are typically{" "}
        <strong>active-low</strong>.
      </p>

      <div className="seq-table-wrap">
        <table className="seq-table">
          <thead>
            <tr>
              <th>PRĒ</th>
              <th>CLR̄</th>
              <th>Q</th>
              <th>Q̄</th>
              <th>Effect</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0</td>
              <td>1</td>
              <td>1</td>
              <td>0</td>
              <td>Force Set (async)</td>
            </tr>
            <tr>
              <td>1</td>
              <td>0</td>
              <td>0</td>
              <td>1</td>
              <td>Force Clear (async)</td>
            </tr>
            <tr>
              <td>1</td>
              <td>1</td>
              <td colspan="2">Normal</td>
              <td>Clock controls Q</td>
            </tr>
            <tr>
              <td>0</td>
              <td>0</td>
              <td>?</td>
              <td>?</td>
              <td>Forbidden</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Key Timing Parameters</h2>
      <div className="seq-table-wrap">
        <table className="seq-table">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Symbol</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Setup time</td>
              <td>
                t<sub>su</sub>
              </td>
              <td>Input must be stable before clock edge</td>
            </tr>
            <tr>
              <td>Hold time</td>
              <td>
                t<sub>h</sub>
              </td>
              <td>Input must remain stable after clock edge</td>
            </tr>
            <tr>
              <td>CLK → Q delay</td>
              <td>
                t<sub>p</sub>
              </td>
              <td>Delay from clock edge to valid Q output</td>
            </tr>
            <tr>
              <td>Minimum period</td>
              <td>
                T<sub>min</sub>
              </td>
              <td>
                t<sub>p</sub> + t<sub>su</sub> + routing
              </td>
            </tr>
            <tr>
              <td>Max frequency</td>
              <td>
                f<sub>max</sub>
              </td>
              <td>
                1 / T<sub>min</sub>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="seq-box info">
        <span className="seq-box-title">Flip-Flop vs Latch — Summary</span>
        <p>
          <strong>Latch:</strong> Level-sensitive · Asynchronous · Transparent
          while EN=1
          <br />
          <strong>Flip-Flop:</strong> Edge-triggered · Synchronous · Only
          changes on clock edge
          <br />
          <br />
          Flip-flops are the universal choice in synchronous design. They
          eliminate glitches, simplify timing analysis, and are supported by all
          synthesis tools.
        </p>
      </div>

      <div className="seq-box warning">
        <span className="seq-box-title">Metastability Risk</span>
        <p>
          Violating t<sub>su</sub> or t<sub>h</sub> puts the flip-flop into a
          <strong>metastable</strong> state — an indeterminate voltage that may
          persist for a random duration. Synchronizer circuits mitigate this in
          clock-domain crossing designs.
        </p>
      </div>
    </div>
  </SeqLayout>
);

export default SeqFlipFlops;
