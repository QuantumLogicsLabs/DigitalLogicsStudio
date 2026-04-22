import React from "react";
import SeqLayout from "./SeqLayout";

const SeqAnalysis = () => (
  <SeqLayout
    title="Analysis of Sequential Circuits"
    subtitle="Given a circuit schematic, systematically determine its state table, state diagram, and timing behavior."
  >
    <div className="seq-content-body">
      <div className="seq-box">
        <span className="seq-box-title">Goal of Analysis</span>
        <p>
          <strong>Analysis</strong> means: given a circuit schematic, determine
          what it
          <em> does</em> — how its state evolves over time for all input
          sequences. The results are expressed as a <strong>state table</strong>{" "}
          and <strong>state diagram</strong>.
        </p>
      </div>

      <h2>Step-by-Step Procedure</h2>

      <div className="seq-grid-2">
        <div className="seq-feature-card">
          <span className="seq-feature-icon">1️⃣</span>
          <p className="seq-feature-title">Identify State Variables</p>
          <p className="seq-feature-desc">
            Label each flip-flop output Q₁, Q₂, … Number of states = 2ⁿ for n
            flip-flops.
          </p>
        </div>
        <div className="seq-feature-card">
          <span className="seq-feature-icon">2️⃣</span>
          <p className="seq-feature-title">Write FF Input Equations</p>
          <p className="seq-feature-desc">
            Express each flip-flop's input (D, J/K, T) as a Boolean function of
            state and external inputs.
          </p>
        </div>
        <div className="seq-feature-card">
          <span className="seq-feature-icon">3️⃣</span>
          <p className="seq-feature-title">Write Output Equations</p>
          <p className="seq-feature-desc">
            Express each output as f(state) for Moore, or f(state, input) for
            Mealy.
          </p>
        </div>
        <div className="seq-feature-card">
          <span className="seq-feature-icon">4️⃣</span>
          <p className="seq-feature-title">Find Next State</p>
          <p className="seq-feature-desc">
            Use the FF's characteristic equation to compute Q⁺ for every
            state-input combination.
          </p>
        </div>
        <div className="seq-feature-card">
          <span className="seq-feature-icon">5️⃣</span>
          <p className="seq-feature-title">Construct State Table</p>
          <p className="seq-feature-desc">
            Tabulate: present state | input | next state | output for every
            combination.
          </p>
        </div>
        <div className="seq-feature-card">
          <span className="seq-feature-icon">6️⃣</span>
          <p className="seq-feature-title">Draw State Diagram</p>
          <p className="seq-feature-desc">
            Convert the table into a directed graph with labeled transitions.
          </p>
        </div>
      </div>

      <h2>Worked Example — 2-Bit Counter</h2>
      <p>
        Two D flip-flops (Q₁ = MSB, Q₀ = LSB), no external inputs. Flip-flop
        input equations:
      </p>

      <div className="seq-box info">
        <span className="seq-box-title">Input Equations</span>
        <code className="seq-equation">D₁ = Q₁ ⊕ Q₀</code>
        <code className="seq-equation">D₀ = Q̄₀</code>
      </div>

      <p>Using Q⁺ = D for each flip-flop:</p>

      <div className="seq-table-wrap">
        <table className="seq-table">
          <thead>
            <tr>
              <th>Present State Q₁Q₀</th>
              <th>D₁ = Q₁⊕Q₀</th>
              <th>D₀ = Q̄₀</th>
              <th>Next State Q₁⁺Q₀⁺</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>00</td>
              <td>
                0⊕0 = <strong>0</strong>
              </td>
              <td>
                <strong>1</strong>
              </td>
              <td>01</td>
            </tr>
            <tr>
              <td>01</td>
              <td>
                0⊕1 = <strong>1</strong>
              </td>
              <td>
                <strong>0</strong>
              </td>
              <td>10</td>
            </tr>
            <tr>
              <td>10</td>
              <td>
                1⊕0 = <strong>1</strong>
              </td>
              <td>
                <strong>1</strong>
              </td>
              <td>11</td>
            </tr>
            <tr>
              <td>11</td>
              <td>
                1⊕1 = <strong>0</strong>
              </td>
              <td>
                <strong>0</strong>
              </td>
              <td>00</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Sequence: <strong>00 → 01 → 10 → 11 → 00 → …</strong> — a 2-bit binary
        up-counter.
      </p>

      <div className="seq-diagram">
        <svg
          viewBox="0 0 480 220"
          xmlns="http://www.w3.org/2000/svg"
          style={{ fontFamily: "'JetBrains Mono',monospace" }}
        >
          <defs>
            <marker
              id="aSA"
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
            [100, 100, "00", "S₀"],
            [240, 50, "01", "S₁"],
            [380, 100, "10", "S₂"],
            [240, 165, "11", "S₃"],
          ].map(([cx, cy, lbl, sub]) => (
            <g key={lbl}>
              <circle
                cx={cx}
                cy={cy}
                r="38"
                fill="rgba(30,27,75,.9)"
                stroke="#6366f1"
                strokeWidth="2"
              />
              <circle
                cx={cx}
                cy={cy}
                r="38"
                fill="none"
                stroke="#818cf8"
                strokeWidth="1"
                opacity="0.4"
              />
              <text
                x={cx}
                y={cy - 4}
                fontSize="15"
                fill="#c7d2fe"
                textAnchor="middle"
                fontWeight="800"
              >
                {lbl}
              </text>
              <text
                x={cx}
                y={cy + 14}
                fontSize="9"
                fill="#475569"
                textAnchor="middle"
              >
                {sub}
              </text>
            </g>
          ))}
          {/* Arrows */}
          <line
            x1="136"
            y1="83"
            x2="204"
            y2="62"
            stroke="#10b981"
            strokeWidth="2.5"
            markerEnd="url(#aSA)"
          />
          <line
            x1="276"
            y1="62"
            x2="344"
            y2="83"
            stroke="#10b981"
            strokeWidth="2.5"
            markerEnd="url(#aSA)"
          />
          <line
            x1="362"
            y1="136"
            x2="276"
            y2="152"
            stroke="#10b981"
            strokeWidth="2.5"
            markerEnd="url(#aSA)"
          />
          <line
            x1="204"
            y1="152"
            x2="136"
            y2="120"
            stroke="#10b981"
            strokeWidth="2.5"
            markerEnd="url(#aSA)"
          />
          {/* Center label */}
          <text
            x="240"
            y="108"
            fontSize="11"
            fill="#374151"
            textAnchor="middle"
          >
            2-bit
          </text>
          <text
            x="240"
            y="122"
            fontSize="11"
            fill="#374151"
            textAnchor="middle"
          >
            counter
          </text>
        </svg>
        <p className="seq-diagram-caption">
          Figure 1 — State diagram of a 2-bit binary up-counter
        </p>
      </div>

      <h2>Moore vs Mealy Machines</h2>
      <div className="seq-table-wrap">
        <table className="seq-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Moore Machine</th>
              <th>Mealy Machine</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Output depends on</td>
              <td>Present state only</td>
              <td>Present state + inputs</td>
            </tr>
            <tr>
              <td>Output changes</td>
              <td>Only with clock edge</td>
              <td>Immediately with inputs</td>
            </tr>
            <tr>
              <td>States needed</td>
              <td>More (typically)</td>
              <td>Fewer (typically)</td>
            </tr>
            <tr>
              <td>Glitch risk</td>
              <td>Lower</td>
              <td>Higher (input-sensitive)</td>
            </tr>
            <tr>
              <td>Output labeling</td>
              <td>Inside state circle</td>
              <td>On transition arrow</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Timing Diagram Analysis</h2>
      <p>
        A timing diagram shows CLK, inputs, state bits, and outputs all plotted
        against time. To read it: at each active clock edge, sample the input →
        look up next state in the table → the new state appears after
        propagation delay t<sub>p</sub>.
      </p>

      <div className="seq-diagram">
        <svg
          viewBox="0 0 540 220"
          xmlns="http://www.w3.org/2000/svg"
          style={{ fontFamily: "'JetBrains Mono',monospace" }}
        >
          {/* CLK */}
          <text x="10" y="42" fontSize="11" fill="#94a3b8" fontWeight="600">
            CLK
          </text>
          <polyline
            points="55,56 55,24 135,24 135,56 215,56 215,24 295,24 295,56 375,56 375,24 455,24 455,56"
            fill="none"
            stroke="#6366f1"
            strokeWidth="2.5"
          />
          {/* Q0 */}
          <text x="10" y="105" fontSize="11" fill="#94a3b8" fontWeight="600">
            Q₀
          </text>
          <polyline
            points="55,112 135,112 135,92 215,92 215,112 295,112 295,92 375,92 375,112 455,112"
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
          />
          {/* Q1 */}
          <text x="10" y="165" fontSize="11" fill="#94a3b8" fontWeight="600">
            Q₁
          </text>
          <polyline
            points="55,175 215,175 215,155 295,155 295,175 375,175 375,155 455,155 455,175"
            fill="none"
            stroke="#818cf8"
            strokeWidth="2.5"
          />
          {/* Edge markers */}
          {[135, 215, 295, 375].map((x) => (
            <line
              key={x}
              x1={x}
              y1="18"
              x2={x}
              y2="182"
              stroke="rgba(99,102,241,.25)"
              strokeWidth="1"
              strokeDasharray="4"
            />
          ))}
          {/* State labels */}
          {[
            ["00", 55],
            ["01", 155],
            ["10", 235],
            ["11", 315],
            ["00", 395],
          ].map(([s, x]) => (
            <text
              key={x}
              x={x + 27}
              y="205"
              fontSize="10"
              fill="#475569"
              textAnchor="middle"
            >
              {s}
            </text>
          ))}
          <text
            x="240"
            y="218"
            fontSize="9"
            fill="#374151"
            textAnchor="middle"
            letterSpacing="0.1em"
          >
            COUNTER STATE
          </text>
        </svg>
        <p className="seq-diagram-caption">
          Figure 2 — Timing diagram for the 2-bit up-counter
        </p>
      </div>

      <h2>Characteristic Equations Reference</h2>
      <div className="seq-table-wrap">
        <table className="seq-table">
          <thead>
            <tr>
              <th>Flip-Flop</th>
              <th>Characteristic Equation</th>
              <th>Use in Analysis</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>D</td>
              <td>Q⁺ = D</td>
              <td>Simplest — Q⁺ directly equals the D input</td>
            </tr>
            <tr>
              <td>JK</td>
              <td>Q⁺ = JQ̄ + K̄Q</td>
              <td>Evaluate J and K, then apply equation</td>
            </tr>
            <tr>
              <td>T</td>
              <td>Q⁺ = T ⊕ Q</td>
              <td>XOR T with current Q</td>
            </tr>
            <tr>
              <td>SR</td>
              <td>Q⁺ = S + R̄Q</td>
              <td>Verify SR=0 constraint first</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="seq-box warning">
        <span className="seq-box-title">Common Mistakes</span>
        <p>
          • Always use the state <em>before</em> the clock edge as "present
          state".
          <br />• For Mealy machines, use input values just <em>before</em> the
          edge for output.
          <br />• Don't confuse flip-flop <em>inputs</em> (D, J, K…) with{" "}
          <em>state outputs</em> (Q).
        </p>
      </div>
    </div>
  </SeqLayout>
);

export default SeqAnalysis;
