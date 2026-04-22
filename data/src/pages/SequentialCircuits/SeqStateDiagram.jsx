import React from "react";
import SeqLayout from "./SeqLayout";

const SeqStateDiagram = () => (
  <SeqLayout
    title="State Diagrams & State Tables"
    subtitle="The two primary representations for sequential circuit behavior — graphical and tabular forms."
  >
    <div className="seq-content-body">
      <div className="seq-box">
        <span className="seq-box-title">Why Both Representations?</span>
        <p>
          <strong>State diagrams</strong> give an intuitive visual picture of
          circuit behavior.
          <strong>State tables</strong> provide the complete, organized
          enumeration needed to derive flip-flop input equations. Mastering both
          is essential.
        </p>
      </div>

      <h2>State Diagrams — Elements</h2>

      <div className="seq-grid-2">
        <div className="seq-feature-card">
          <span className="seq-feature-icon">⭕</span>
          <p className="seq-feature-title">State (Node)</p>
          <p className="seq-feature-desc">
            Each circle represents a unique state. The initial state is marked
            with an entry arrow (→○).
          </p>
        </div>
        <div className="seq-feature-card">
          <span className="seq-feature-icon">➡️</span>
          <p className="seq-feature-title">Transition (Arc)</p>
          <p className="seq-feature-desc">
            Directed arrow from current to next state. Labeled with the input
            condition that causes it.
          </p>
        </div>
        <div className="seq-feature-card">
          <span className="seq-feature-icon">🟢</span>
          <p className="seq-feature-title">Moore Output</p>
          <p className="seq-feature-desc">
            Output labeled <em>inside</em> the state circle — only depends on
            the current state.
          </p>
        </div>
        <div className="seq-feature-card">
          <span className="seq-feature-icon">🔀</span>
          <p className="seq-feature-title">Mealy Output</p>
          <p className="seq-feature-desc">
            Output labeled <em>on the arc</em> as "input/output" — depends on
            state AND input.
          </p>
        </div>
      </div>

      <h2>Moore Machine — State Diagram</h2>

      <div className="seq-diagram">
        <svg
          viewBox="0 0 540 210"
          xmlns="http://www.w3.org/2000/svg"
          style={{ fontFamily: "'JetBrains Mono',monospace" }}
        >
          <defs>
            <marker
              id="aMo"
              markerWidth="7"
              markerHeight="7"
              refX="5"
              refY="2.5"
              orient="auto"
            >
              <path d="M0,0 L0,5 L7,2.5z" fill="#818cf8" />
            </marker>
          </defs>
          {/* Entry arrow */}
          <line
            x1="16"
            y1="105"
            x2="50"
            y2="105"
            stroke="#94a3b8"
            strokeWidth="1.5"
            markerEnd="url(#aMo)"
          />
          <text x="4" y="101" fontSize="8" fill="#64748b">
            start
          </text>
          {/* States: A, B, C, D */}
          {[
            [90, 105, "A", "Z=0", "#6366f1"],
            [230, 50, "B", "Z=0", "#6366f1"],
            [380, 105, "C", "Z=1", "#10b981"],
            [230, 160, "D", "Z=0", "#6366f1"],
          ].map(([cx, cy, s, z, col]) => (
            <g key={s}>
              <circle
                cx={cx}
                cy={cy}
                r="36"
                fill="rgba(10,15,40,.95)"
                stroke={col}
                strokeWidth="2.5"
              />
              <text
                x={cx}
                y={cy - 3}
                fontSize="15"
                fill={col === "#10b981" ? "#34d399" : "#c7d2fe"}
                textAnchor="middle"
                fontWeight="800"
              >
                {s}
              </text>
              <text
                x={cx}
                y={cy + 14}
                fontSize="10"
                fill={col === "#10b981" ? "#10b981" : "#475569"}
                textAnchor="middle"
              >
                {z}
              </text>
            </g>
          ))}
          {/* A→B (x=1) */}
          <path
            d="M122,88 Q170,48 194,57"
            fill="none"
            stroke="#818cf8"
            strokeWidth="2"
            markerEnd="url(#aMo)"
          />
          <text x="145" y="58" fontSize="10" fill="#fbbf24" fontWeight="700">
            x=1
          </text>
          {/* B→C (x=1) */}
          <path
            d="M264,64 Q316,72 344,90"
            fill="none"
            stroke="#818cf8"
            strokeWidth="2"
            markerEnd="url(#aMo)"
          />
          <text x="298" y="64" fontSize="10" fill="#fbbf24" fontWeight="700">
            x=1
          </text>
          {/* A→D (x=0) */}
          <path
            d="M116,128 Q162,162 194,156"
            fill="none"
            stroke="#818cf8"
            strokeWidth="2"
            markerEnd="url(#aMo)"
          />
          <text x="140" y="160" fontSize="10" fill="#fbbf24" fontWeight="700">
            x=0
          </text>
          {/* D→C (x=0) */}
          <path
            d="M262,148 Q316,138 344,120"
            fill="none"
            stroke="#818cf8"
            strokeWidth="2"
            markerEnd="url(#aMo)"
          />
          <text x="297" y="148" fontSize="10" fill="#fbbf24" fontWeight="700">
            x=0
          </text>
          {/* C→A (reset) */}
          <path
            d="M380,141 Q380,200 230,200 Q80,200 90,141"
            fill="none"
            stroke="#ef4444"
            strokeWidth="1.5"
            strokeDasharray="5"
            markerEnd="url(#aMo)"
          />
          <text x="230" y="210" fontSize="9" fill="#ef4444" textAnchor="middle">
            any → A
          </text>
          {/* B self on x=0 */}
          <path
            d="M198,38 Q165,8 230,14 Q265,8 260,40"
            fill="none"
            stroke="#475569"
            strokeWidth="1.2"
            strokeDasharray="3"
            markerEnd="url(#aMo)"
          />
          <text x="230" y="8" fontSize="9" fill="#475569" textAnchor="middle">
            x=0 → B
          </text>
        </svg>
        <p className="seq-diagram-caption">
          Figure 1 — Moore machine: output (Z) is labeled inside each state
          circle
        </p>
      </div>

      <h2>Moore Machine State Table</h2>
      <div className="seq-table-wrap">
        <table className="seq-table">
          <thead>
            <tr>
              <th rowSpan="2">Present State</th>
              <th colSpan="2">Next State</th>
              <th rowSpan="2">Output Z</th>
            </tr>
            <tr>
              <th>x = 0</th>
              <th>x = 1</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>A</td>
              <td>D</td>
              <td>B</td>
              <td>0</td>
            </tr>
            <tr>
              <td>B</td>
              <td>B</td>
              <td>C</td>
              <td>0</td>
            </tr>
            <tr>
              <td>C</td>
              <td>A</td>
              <td>A</td>
              <td>1</td>
            </tr>
            <tr>
              <td>D</td>
              <td>C</td>
              <td>C</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Mealy Machine — State Diagram</h2>

      <div className="seq-diagram">
        <svg
          viewBox="0 0 420 170"
          xmlns="http://www.w3.org/2000/svg"
          style={{ fontFamily: "'JetBrains Mono',monospace" }}
        >
          <defs>
            <marker
              id="aMe"
              markerWidth="7"
              markerHeight="7"
              refX="5"
              refY="2.5"
              orient="auto"
            >
              <path d="M0,0 L0,5 L7,2.5z" fill="#818cf8" />
            </marker>
          </defs>
          <line
            x1="14"
            y1="85"
            x2="46"
            y2="85"
            stroke="#94a3b8"
            strokeWidth="1.5"
            markerEnd="url(#aMe)"
          />
          {/* States */}
          {[
            [82, 85, "S0"],
            [220, 85, "S1"],
            [358, 85, "S2"],
          ].map(([cx, cy, s]) => (
            <g key={s}>
              <circle
                cx={cx}
                cy={cy}
                r="34"
                fill="rgba(10,15,40,.95)"
                stroke="#6366f1"
                strokeWidth="2.5"
              />
              <text
                x={cx}
                y={cy + 6}
                fontSize="15"
                fill="#c7d2fe"
                textAnchor="middle"
                fontWeight="800"
              >
                {s}
              </text>
            </g>
          ))}
          {/* S0→S1 (1/0) */}
          <path
            d="M114,70 Q164,35 188,68"
            fill="none"
            stroke="#818cf8"
            strokeWidth="2"
            markerEnd="url(#aMe)"
          />
          <text x="148" y="38" fontSize="10" fill="#fbbf24" fontWeight="700">
            1/0
          </text>
          {/* S1→S0 (0/0) */}
          <path
            d="M188,100 Q164,130 118,102"
            fill="none"
            stroke="#818cf8"
            strokeWidth="2"
            markerEnd="url(#aMe)"
          />
          <text x="148" y="132" fontSize="10" fill="#fbbf24" fontWeight="700">
            0/0
          </text>
          {/* S1→S2 (1/1) */}
          <path
            d="M252,70 Q298,35 326,68"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            markerEnd="url(#aMe)"
          />
          <text x="285" y="38" fontSize="10" fill="#10b981" fontWeight="700">
            1/1
          </text>
          {/* S2→S0 (0/0) */}
          <path
            d="M340,116 Q230,160 104,112"
            fill="none"
            stroke="#ef4444"
            strokeWidth="1.5"
            strokeDasharray="4"
            markerEnd="url(#aMe)"
          />
          <text x="230" y="165" fontSize="9" fill="#ef4444" textAnchor="middle">
            0/0 → S0
          </text>
          {/* S2 self (1/0) */}
          <path
            d="M380,58 Q418,25 390,52"
            fill="none"
            stroke="#475569"
            strokeWidth="1.2"
            strokeDasharray="3"
            markerEnd="url(#aMe)"
          />
          <text x="416" y="35" fontSize="9" fill="#475569">
            1/0
          </text>
          {/* Arc label info */}
          <text x="210" y="14" fontSize="9" fill="#475569" textAnchor="middle">
            Arc labels: input / output
          </text>
        </svg>
        <p className="seq-diagram-caption">
          Figure 2 — Mealy machine: output is labeled on arcs as "input/output"
        </p>
      </div>

      <h2>Mealy Machine State Table</h2>
      <div className="seq-table-wrap">
        <table className="seq-table">
          <thead>
            <tr>
              <th rowSpan="2">Present State</th>
              <th colSpan="2">Next State</th>
              <th colSpan="2">Output Z</th>
            </tr>
            <tr>
              <th>x=0</th>
              <th>x=1</th>
              <th>x=0</th>
              <th>x=1</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>S0</td>
              <td>S0</td>
              <td>S1</td>
              <td>0</td>
              <td>0</td>
            </tr>
            <tr>
              <td>S1</td>
              <td>S0</td>
              <td>S2</td>
              <td>0</td>
              <td>1</td>
            </tr>
            <tr>
              <td>S2</td>
              <td>S0</td>
              <td>S2</td>
              <td>0</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Converting Between Diagram and Table</h2>
      <div className="seq-grid-2">
        <div className="seq-feature-card">
          <span className="seq-feature-icon">🗺️→📊</span>
          <p className="seq-feature-title">Diagram → Table</p>
          <p className="seq-feature-desc">
            For each state, follow every outgoing arc. Record destination state,
            input, and output as a row in the table.
          </p>
        </div>
        <div className="seq-feature-card">
          <span className="seq-feature-icon">📊→🗺️</span>
          <p className="seq-feature-title">Table → Diagram</p>
          <p className="seq-feature-desc">
            For each row, draw the present state circle (if new), then draw an
            arc to the next state, labeled with input (and output for Mealy).
          </p>
        </div>
      </div>

      <h2>Incompletely Specified Machines</h2>
      <p>
        When some input combinations never occur in certain states, transitions
        can be left as
        <strong>"don't-care" (–)</strong> entries. These give flexibility during
        state reduction and logic minimization.
      </p>

      <div className="seq-box info">
        <span className="seq-box-title">Best Practices</span>
        <p>
          ✓ Every state must have transitions for all 2<sup>k</sup> input
          combinations (k inputs)
          <br />
          ✓ Use symbolic names (A, B, C…) in state tables — assign binary codes
          later
          <br />
          ✓ For Moore: output on the state; for Mealy: output on the arc
          <br />✓ Mark the initial state with an entry arrow on the diagram
        </p>
      </div>
    </div>
  </SeqLayout>
);

export default SeqStateDiagram;
