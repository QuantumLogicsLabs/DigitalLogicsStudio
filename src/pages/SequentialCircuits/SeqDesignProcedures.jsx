import React from "react";
import SeqLayout from "./SeqLayout";

const SeqDesignProcedures = () => (
  <SeqLayout
    title="Design Procedures"
    subtitle="A systematic methodology for designing synchronous sequential circuits — from word problem to working schematic."
  >
    <div className="seq-content-body">
      <div className="seq-box">
        <span className="seq-box-title">Design vs Analysis</span>
        <p>
          <strong>Analysis</strong> starts with a circuit and finds its
          behavior.
          <strong>Design</strong> starts with a behavior specification and
          derives the circuit. The process is systematic and reversible.
        </p>
      </div>

      <h2>Complete 9-Step Design Flow</h2>

      <div className="seq-grid-2">
        <div className="seq-feature-card">
          <span className="seq-feature-icon">📋</span>
          <p className="seq-feature-title">1. Understand the Spec</p>
          <p className="seq-feature-desc">
            Identify inputs, outputs, and what must be remembered between clock
            cycles.
          </p>
        </div>
        <div className="seq-feature-card">
          <span className="seq-feature-icon">🗺️</span>
          <p className="seq-feature-title">2. Draw State Diagram</p>
          <p className="seq-feature-desc">
            Sketch a directed graph of all states and transitions for all
            inputs.
          </p>
        </div>
        <div className="seq-feature-card">
          <span className="seq-feature-icon">📊</span>
          <p className="seq-feature-title">3. Build State Table</p>
          <p className="seq-feature-desc">
            Convert the diagram into a tabular form with all present state /
            input / next state / output entries.
          </p>
        </div>
        <div className="seq-feature-card">
          <span className="seq-feature-icon">✂️</span>
          <p className="seq-feature-title">4. Reduce States</p>
          <p className="seq-feature-desc">
            Merge equivalent states to minimize hardware. Fewer states = fewer
            flip-flops.
          </p>
        </div>
        <div className="seq-feature-card">
          <span className="seq-feature-icon">🔢</span>
          <p className="seq-feature-title">5. State Assignment</p>
          <p className="seq-feature-desc">
            Assign unique binary codes to each state. Need ⌈log₂(n)⌉ flip-flops
            for n states.
          </p>
        </div>
        <div className="seq-feature-card">
          <span className="seq-feature-icon">🔁</span>
          <p className="seq-feature-title">6. Choose FF Type</p>
          <p className="seq-feature-desc">
            Select D, JK, T, or SR based on which gives simpler input logic for
            your state transitions.
          </p>
        </div>
        <div className="seq-feature-card">
          <span className="seq-feature-icon">📐</span>
          <p className="seq-feature-title">7. Derive FF Inputs</p>
          <p className="seq-feature-desc">
            Use excitation tables + K-maps to find minimal Boolean equations for
            each FF input.
          </p>
        </div>
        <div className="seq-feature-card">
          <span className="seq-feature-icon">📤</span>
          <p className="seq-feature-title">8. Derive Outputs</p>
          <p className="seq-feature-desc">
            Use K-maps to find output equations — f(state) for Moore,
            f(state,input) for Mealy.
          </p>
        </div>
        <div className="seq-feature-card">
          <span className="seq-feature-icon">🔌</span>
          <p className="seq-feature-title">9. Draw the Circuit</p>
          <p className="seq-feature-desc">
            Implement all equations as gates feeding the flip-flops, with state
            feedback.
          </p>
        </div>
      </div>

      <h2>Step 1 — Problem Specification</h2>
      <p>Carefully identify:</p>
      <ul>
        <li>
          <strong>Inputs</strong> — what triggers state changes
        </li>
        <li>
          <strong>Outputs</strong> — what the circuit must produce
        </li>
        <li>
          <strong>Memory</strong> — what must be remembered between clocks
        </li>
        <li>
          <strong>Machine type</strong> — Moore (output on state) or Mealy
          (output on transition)
        </li>
      </ul>

      <h2>Step 5 — State Assignment Strategies</h2>
      <div className="seq-table-wrap">
        <table className="seq-table">
          <thead>
            <tr>
              <th>Strategy</th>
              <th>Description</th>
              <th>Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Binary sequential</td>
              <td>00, 01, 10, 11 …</td>
              <td>Simple, easy to analyze</td>
            </tr>
            <tr>
              <td>Gray code</td>
              <td>00, 01, 11, 10 …</td>
              <td>Minimizes transitions → simpler logic</td>
            </tr>
            <tr>
              <td>One-hot</td>
              <td>0001, 0010, 0100 …</td>
              <td>FPGAs with abundant flip-flops</td>
            </tr>
            <tr>
              <td>Output-based</td>
              <td>State code = output value</td>
              <td>Simplifies output logic</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Step 6 — Choosing Flip-Flop Type</h2>
      <div className="seq-table-wrap">
        <table className="seq-table">
          <thead>
            <tr>
              <th>Flip-Flop</th>
              <th>Input Logic Complexity</th>
              <th>Don't-Cares in Excitation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>D</td>
              <td>Simplest (D = Q⁺)</td>
              <td>None</td>
            </tr>
            <tr>
              <td>JK</td>
              <td>Moderate, but more X's help K-maps</td>
              <td>Most (2 per row)</td>
            </tr>
            <tr>
              <td>T</td>
              <td>Simple for counters</td>
              <td>None</td>
            </tr>
            <tr>
              <td>SR</td>
              <td>Moderate, has forbidden state</td>
              <td>Some</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Design Example — "101" Sequence Detector</h2>
      <p>
        Design a <strong>Moore machine</strong> that outputs Z=1 when the last
        three bits of the serial input x form the pattern <strong>"101"</strong>{" "}
        (overlapping detection allowed).
      </p>

      <div className="seq-box info">
        <span className="seq-box-title">State Plan</span>
        <p>
          <strong>S0</strong> — No progress (initial / reset state), Z=0
          <br />
          <strong>S1</strong> — Received "1", Z=0
          <br />
          <strong>S2</strong> — Received "10", Z=0
          <br />
          <strong>S3</strong> — Received "101" ✓, Z=1
        </p>
      </div>

      <div className="seq-diagram">
        <svg
          viewBox="0 0 560 250"
          xmlns="http://www.w3.org/2000/svg"
          style={{ fontFamily: "'JetBrains Mono',monospace" }}
        >
          <defs>
            <marker
              id="aDp"
              markerWidth="7"
              markerHeight="7"
              refX="5"
              refY="2.5"
              orient="auto"
            >
              <path d="M0,0 L0,5 L7,2.5z" fill="#10b981" />
            </marker>
          </defs>
          {/* States */}
          {[
            [80, 125, "S0", "Z=0"],
            [220, 60, "S1", "Z=0"],
            [360, 60, "S2", "Z=0"],
            [460, 125, "S3", "Z=1"],
          ].map(([cx, cy, s, z]) => (
            <g key={s}>
              <circle
                cx={cx}
                cy={cy}
                r="36"
                fill="rgba(30,27,75,.9)"
                stroke={s === "S3" ? "#10b981" : "#6366f1"}
                strokeWidth="2.5"
              />
              <text
                x={cx}
                y={cy - 4}
                fontSize="13"
                fill={s === "S3" ? "#34d399" : "#c7d2fe"}
                textAnchor="middle"
                fontWeight="700"
              >
                {s}
              </text>
              <text
                x={cx}
                y={cy + 13}
                fontSize="9"
                fill={s === "S3" ? "#10b981" : "#475569"}
                textAnchor="middle"
              >
                {z}
              </text>
            </g>
          ))}
          {/* S0 → S1 (x=1) */}
          <path
            d="M113,108 Q160,65 184,70"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            markerEnd="url(#aDp)"
          />
          <text x="140" y="72" fontSize="10" fill="#fbbf24" fontWeight="700">
            x=1
          </text>
          {/* S1 → S2 (x=0) */}
          <line
            x1="256"
            y1="60"
            x2="324"
            y2="60"
            stroke="#10b981"
            strokeWidth="2"
            markerEnd="url(#aDp)"
          />
          <text x="285" y="52" fontSize="10" fill="#fbbf24" fontWeight="700">
            x=0
          </text>
          {/* S2 → S3 (x=1) */}
          <path
            d="M393,78 Q420,95 428,105"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            markerEnd="url(#aDp)"
          />
          <text x="420" y="85" fontSize="10" fill="#fbbf24" fontWeight="700">
            x=1
          </text>
          {/* S0 self-loop (x=0) */}
          <path
            d="M58,100 Q20,70 58,90"
            fill="none"
            stroke="#6366f1"
            strokeWidth="1.5"
            markerEnd="url(#aDp)"
            strokeDasharray="4"
          />
          <text x="12" y="82" fontSize="9" fill="#6366f1">
            x=0
          </text>
          {/* S1 → S0 (x=1) */}
          <path
            d="M220,96 Q150,145 108,140"
            fill="none"
            stroke="#ef4444"
            strokeWidth="1.5"
            markerEnd="url(#aDp)"
            strokeDasharray="4"
          />
          <text x="154" y="145" fontSize="9" fill="#ef4444">
            x=1 → S1
          </text>
          {/* S1 self back to S0 x=0 already done, S1 on x=1 → S1 self */}
          {/* S2 → S0 (x=0) */}
          <path
            d="M340,88 Q240,195 108,155"
            fill="none"
            stroke="#ef4444"
            strokeWidth="1.5"
            markerEnd="url(#aDp)"
            strokeDasharray="4"
          />
          <text x="225" y="205" fontSize="9" fill="#ef4444">
            x=0 → S0
          </text>
          {/* S3 → S1 (x=1, overlap) */}
          <path
            d="M460,161 Q460,220 220,96"
            fill="none"
            stroke="#818cf8"
            strokeWidth="1.5"
            markerEnd="url(#aDp)"
            strokeDasharray="4"
          />
          <text x="360" y="235" fontSize="9" fill="#818cf8">
            x=1 → S1 (overlap)
          </text>
          {/* S3 → S0 (x=0) */}
          <path
            d="M428,152 Q350,200 112,155"
            fill="none"
            stroke="#818cf8"
            strokeWidth="1.2"
            markerEnd="url(#aDp)"
            strokeDasharray="3"
          />
          {/* Initial arrow */}
          <line
            x1="20"
            y1="125"
            x2="44"
            y2="125"
            stroke="#94a3b8"
            strokeWidth="1.5"
            markerEnd="url(#aDp)"
          />
          <text x="4" y="122" fontSize="8" fill="#64748b">
            start
          </text>
        </svg>
        <p className="seq-diagram-caption">
          Figure 1 — Moore FSM for "101" overlapping sequence detector
        </p>
      </div>

      <h2>State Table (after assignment: S0=00, S1=01, S2=10, S3=11)</h2>
      <div className="seq-table-wrap">
        <table className="seq-table">
          <thead>
            <tr>
              <th>Present Q₁Q₀</th>
              <th>x=0 → Next</th>
              <th>x=1 → Next</th>
              <th>Output Z</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>00 (S0)</td>
              <td>00</td>
              <td>01</td>
              <td>0</td>
            </tr>
            <tr>
              <td>01 (S1)</td>
              <td>10</td>
              <td>01</td>
              <td>0</td>
            </tr>
            <tr>
              <td>10 (S2)</td>
              <td>00</td>
              <td>11</td>
              <td>0</td>
            </tr>
            <tr>
              <td>11 (S3)</td>
              <td>00</td>
              <td>01</td>
              <td>1</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="seq-box success">
        <span className="seq-box-title">Design Checklist</span>
        <p>
          ✓ All states reachable from the initial state
          <br />
          ✓ Every state handles all possible inputs
          <br />
          ✓ Initial/reset state clearly defined
          <br />
          ✓ Output correct in every state / transition
          <br />✓ Don't-care states used where appropriate
        </p>
      </div>
    </div>
  </SeqLayout>
);

export default SeqDesignProcedures;
