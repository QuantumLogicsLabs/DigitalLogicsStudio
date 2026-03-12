import React, { useState, useMemo } from "react";
import ToolLayout from "../components/ToolLayout";
import ExplanationBlock from "../components/ExplanationBlock";
import CircuitModal from "../components/CircuitModal";

// ─── Encoder Data ─────────────────────────────────────────────────────────────
const ENCODER_TYPES = {
  "4to2": {
    label: "4-to-2 Priority Encoder",
    inputs: ["I0", "I1", "I2", "I3"],
    outputs: ["A1", "A0", "V"],
    description: "4 data inputs → 2-bit binary code + Valid flag",
    encode: (vals) => {
      const [i0, i1, i2, i3] = vals;
      if (i3) return { A1: 1, A0: 1, V: 1, active: 3 };
      if (i2) return { A1: 1, A0: 0, V: 1, active: 2 };
      if (i1) return { A1: 0, A0: 1, V: 1, active: 1 };
      if (i0) return { A1: 0, A0: 0, V: 1, active: 0 };
      return { A1: 0, A0: 0, V: 0, active: -1 };
    },
    booleanEqs: [
      {
        out: "A1",
        eq: "A1 = I2 + I3",
        explanation:
          "A1 is the MSB. It is 1 when address is 2 (10₂) or 3 (11₂). Both have bit-1 = 1, so just OR I2 and I3.",
      },
      {
        out: "A0",
        eq: "A0 = I3 + I1·I2'",
        explanation:
          "A0 is the LSB. It is 1 for address 1 (01₂) and 3 (11₂). I3 handles address 3. I1·I2' handles address 1 ONLY when I2 is not active (priority mask).",
      },
      {
        out: "V",
        eq: "V = I0 + I1 + I2 + I3",
        explanation:
          "Valid flag: ANY input being high means a valid code is present. Simple OR of all inputs.",
      },
    ],
    truthRows: [
      ["0", "0", "0", "0", "—", "—", "0"],
      ["1", "0", "0", "0", "0", "0", "1"],
      ["0", "1", "0", "0", "0", "1", "1"],
      ["0", "0", "1", "0", "1", "0", "1"],
      ["0", "0", "0", "1", "1", "1", "1"],
    ],
  },
  "8to3": {
    label: "8-to-3 Priority Encoder",
    inputs: ["I0", "I1", "I2", "I3", "I4", "I5", "I6", "I7"],
    outputs: ["A2", "A1", "A0", "V"],
    description: "8 data inputs → 3-bit binary code + Valid flag",
    encode: (vals) => {
      for (let i = 7; i >= 0; i--) {
        if (vals[i])
          return {
            A2: (i >> 2) & 1,
            A1: (i >> 1) & 1,
            A0: i & 1,
            V: 1,
            active: i,
          };
      }
      return { A2: 0, A1: 0, A0: 0, V: 0, active: -1 };
    },
    booleanEqs: [
      {
        out: "A2",
        eq: "A2 = I4 + I5 + I6 + I7",
        explanation:
          "A2 is 1 for addresses 4–7. All have bit-2=1. Simply OR I4,I5,I6,I7.",
      },
      {
        out: "A1",
        eq: "A1 = I2 + I3 + I6 + I7",
        explanation:
          "A1 is 1 for addresses 2,3,6,7. All have bit-1=1. Simply OR those input lines.",
      },
      {
        out: "A0",
        eq: "A0 = I1 + I3 + I5 + I7",
        explanation:
          "A0 is 1 for odd addresses (1,3,5,7). All have bit-0=1. Simply OR all odd input lines.",
      },
      {
        out: "V",
        eq: "V = I0 + I1 + I2 + I3 + I4 + I5 + I6 + I7",
        explanation: "Valid: any input active → V=1. Big OR of all 8 inputs.",
      },
    ],
    truthRows: [
      ["I0 (0)", "0", "0", "0", "1"],
      ["I1 (1)", "0", "0", "1", "1"],
      ["I2 (2)", "0", "1", "0", "1"],
      ["I3 (3)", "0", "1", "1", "1"],
      ["I4 (4)", "1", "0", "0", "1"],
      ["I5 (5)", "1", "0", "1", "1"],
      ["I6 (6)", "1", "1", "0", "1"],
      ["I7 (7)", "1", "1", "1", "1"],
    ],
  },
  BCD: {
    label: "Decimal-to-BCD Encoder",
    inputs: ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9"],
    outputs: ["A(8)", "B(4)", "C(2)", "D(1)"],
    description: "Decimal digit key (0–9) → 4-bit BCD code",
    encode: (vals) => {
      for (let i = 9; i >= 0; i--) {
        if (vals[i])
          return {
            "A(8)": (i >> 3) & 1,
            "B(4)": (i >> 2) & 1,
            "C(2)": (i >> 1) & 1,
            "D(1)": i & 1,
            active: i,
          };
      }
      return { "A(8)": 0, "B(4)": 0, "C(2)": 0, "D(1)": 0, active: -1 };
    },
    booleanEqs: [
      {
        out: "A (8s bit)",
        eq: "A = D8 + D9",
        explanation:
          "A is the 8s place. Only digits 8 (1000) and 9 (1001) have this bit set. Just OR D8 and D9.",
      },
      {
        out: "B (4s bit)",
        eq: "B = D4 + D5 + D6 + D7",
        explanation:
          "B is the 4s place. Digits 4–7 all have this bit set. OR those four inputs.",
      },
      {
        out: "C (2s bit)",
        eq: "C = D2 + D3 + D6 + D7",
        explanation:
          "C is the 2s place. Digits 2,3,6,7 have it set. OR those four inputs.",
      },
      {
        out: "D (1s bit)",
        eq: "D = D1 + D3 + D5 + D7 + D9",
        explanation:
          "D is the 1s place. All ODD digits have this bit set. OR D1,D3,D5,D7,D9.",
      },
    ],
    truthRows: [
      ["D0", "0", "0", "0", "0"],
      ["D1", "0", "0", "0", "1"],
      ["D2", "0", "0", "1", "0"],
      ["D3", "0", "0", "1", "1"],
      ["D4", "0", "1", "0", "0"],
      ["D5", "0", "1", "0", "1"],
      ["D6", "0", "1", "1", "0"],
      ["D7", "0", "1", "1", "1"],
      ["D8", "1", "0", "0", "0"],
      ["D9", "1", "0", "0", "1"],
    ],
  },
};

// ─── SVG: 4-to-2 Encoder Internal Circuit ────────────────────────────────────
const Encoder4to2SVG = ({ inputVals, result }) => {
  const w = (v) => (v ? "#00ff88" : "#1e3a2f");
  const wA = (v) => (v ? "#fbbf24" : "#3a2e0a");
  const glow = (v) => (v ? { filter: "drop-shadow(0 0 4px #00ff88)" } : {});
  const [i0, i1, i2, i3] = inputVals.slice(0, 4);
  const A1 = result.A1 ?? 0;
  const A0 = result.A0 ?? 0;
  const V = result.V ?? 0;

  // OR gate path
  const OrGate = ({ cx, cy, active, label }) => (
    <g style={glow(active)}>
      <path
        d={`M${cx - 20} ${cy - 16} Q${cx - 8} ${cy - 16} ${cx + 16} ${cy} Q${cx - 8} ${cy + 16} ${cx - 20} ${cy + 16} Q${cx - 8} ${cy} ${cx - 20} ${cy - 16} Z`}
        fill="rgba(20,30,50,0.95)"
        stroke={w(active)}
        strokeWidth={active ? 2 : 1.5}
      />
      <text
        x={cx - 2}
        y={cy + 4}
        textAnchor="middle"
        fill={active ? "#00ff88" : "#4b5563"}
        fontSize="8"
        fontFamily="monospace"
      >
        OR
      </text>
    </g>
  );
  const AndGate = ({ cx, cy, active }) => (
    <g style={glow(active)}>
      <path
        d={`M${cx - 16} ${cy - 14} L${cx} ${cy - 14} Q${cx + 14} ${cy - 14} ${cx + 14} ${cy} Q${cx + 14} ${cy + 14} ${cx} ${cy + 14} L${cx - 16} ${cy + 14} Z`}
        fill="rgba(20,30,50,0.95)"
        stroke={w(active)}
        strokeWidth={active ? 2 : 1.5}
      />
      <text
        x={cx - 1}
        y={cy + 4}
        textAnchor="middle"
        fill={active ? "#00ff88" : "#4b5563"}
        fontSize="8"
        fontFamily="monospace"
      >
        AND
      </text>
    </g>
  );
  const NotGate = ({ cx, cy, active }) => (
    <g>
      <path
        d={`M${cx - 12} ${cy - 9} L${cx - 12} ${cy + 9} L${cx + 6} ${cy} Z`}
        fill="rgba(20,30,50,0.9)"
        stroke={w(active)}
        strokeWidth="1.5"
      />
      <circle
        cx={cx + 9}
        cy={cy}
        r="3"
        fill="none"
        stroke={w(active)}
        strokeWidth="1.5"
      />
    </g>
  );

  return (
    <svg
      viewBox="0 0 560 260"
      width="100%"
      style={{
        maxWidth: "560px",
        fontFamily: "monospace",
        fontSize: "11px",
        display: "block",
      }}
    >
      <rect
        width="560"
        height="260"
        rx="10"
        fill="rgba(8,12,22,0.97)"
        stroke="rgba(99,102,241,0.25)"
        strokeWidth="1.5"
      />

      {/* Input circles */}
      {[
        ["I0", 40, 55, i0],
        ["I1", 40, 100, i1],
        ["I2", 40, 145, i2],
        ["I3", 40, 190, i3],
      ].map(([lbl, x, y, v]) => (
        <g key={lbl}>
          <circle
            cx={x}
            cy={y}
            r="14"
            fill={v ? "rgba(0,255,136,0.18)" : "rgba(20,30,50,0.8)"}
            stroke={w(v)}
            strokeWidth="1.5"
            style={glow(v)}
          />
          <text
            x={x}
            y={y + 4}
            textAnchor="middle"
            fill={v ? "#00ff88" : "#6b7280"}
            fontWeight="bold"
            fontSize="11"
          >
            {lbl}
          </text>
          <line
            x1={x + 14}
            y1={y}
            x2={x + 30}
            y2={y}
            stroke={w(v)}
            strokeWidth="2"
          />
          <circle cx={x + 30} cy={y} r="3" fill={w(v)} />
        </g>
      ))}

      {/* Distribution lines */}
      <line x1="70" y1="55" x2="70" y2="230" stroke={w(i0)} strokeWidth="1" />
      <line x1="85" y1="100" x2="85" y2="230" stroke={w(i1)} strokeWidth="1" />
      <line
        x1="100"
        y1="145"
        x2="100"
        y2="230"
        stroke={w(i2)}
        strokeWidth="1"
      />
      <line
        x1="115"
        y1="190"
        x2="115"
        y2="230"
        stroke={w(i3)}
        strokeWidth="1"
      />

      {/* A1 = OR(I2, I3) */}
      <OrGate cx={230} cy={90} active={A1} />
      <line
        x1="100"
        y1="145"
        x2="145"
        y2="145"
        stroke={w(i2)}
        strokeWidth="1.5"
      />
      <line
        x1="145"
        y1="145"
        x2="145"
        y2="83"
        stroke={w(i2)}
        strokeWidth="1.5"
      />
      <line
        x1="145"
        y1="83"
        x2="210"
        y2="83"
        stroke={w(i2)}
        strokeWidth="1.5"
      />
      <line
        x1="115"
        y1="190"
        x2="150"
        y2="190"
        stroke={w(i3)}
        strokeWidth="1.5"
      />
      <line
        x1="150"
        y1="190"
        x2="150"
        y2="97"
        stroke={w(i3)}
        strokeWidth="1.5"
      />
      <line
        x1="150"
        y1="97"
        x2="210"
        y2="97"
        stroke={w(i3)}
        strokeWidth="1.5"
      />
      <line x1="246" y1="90" x2="310" y2="90" stroke={wA(A1)} strokeWidth="2" />

      {/* NOT I2 for A0 priority */}
      <NotGate cx={170} cy={145} active={!i2 ? 1 : 0} />
      <line
        x1="100"
        y1="145"
        x2="158"
        y2="145"
        stroke={w(i2)}
        strokeWidth="1.5"
      />
      {/* AND(I1, NOT I2) for A0 lower path */}
      <AndGate cx={230} cy={155} active={i1 && !i2 ? 1 : 0} />
      <line
        x1="182"
        y1="145"
        x2="195"
        y2="145"
        stroke={w(!i2 ? 1 : 0)}
        strokeWidth="1.5"
      />
      <line
        x1="195"
        y1="145"
        x2="195"
        y2="149"
        stroke={w(!i2 ? 1 : 0)}
        strokeWidth="1.5"
      />
      <line
        x1="195"
        y1="149"
        x2="214"
        y2="149"
        stroke={w(!i2 ? 1 : 0)}
        strokeWidth="1.5"
      />
      <line
        x1="85"
        y1="100"
        x2="140"
        y2="100"
        stroke={w(i1)}
        strokeWidth="1.5"
      />
      <line
        x1="140"
        y1="100"
        x2="140"
        y2="161"
        stroke={w(i1)}
        strokeWidth="1.5"
      />
      <line
        x1="140"
        y1="161"
        x2="214"
        y2="161"
        stroke={w(i1)}
        strokeWidth="1.5"
      />

      {/* A0 = OR(I3, AND(I1,I2')) */}
      <OrGate cx={295} cy={150} active={A0} />
      <line
        x1="244"
        y1="155"
        x2="275"
        y2="155"
        stroke={w(i1 && !i2 ? 1 : 0)}
        strokeWidth="1.5"
      />
      <line
        x1="115"
        y1="190"
        x2="155"
        y2="190"
        stroke={w(i3)}
        strokeWidth="1.5"
      />
      <line
        x1="155"
        y1="190"
        x2="155"
        y2="170"
        stroke={w(i3)}
        strokeWidth="1.5"
      />
      <line
        x1="155"
        y1="170"
        x2="275"
        y2="145"
        stroke={w(i3)}
        strokeWidth="1.5"
      />
      <line
        x1="311"
        y1="150"
        x2="340"
        y2="150"
        stroke={wA(A0)}
        strokeWidth="2"
      />

      {/* V = OR all */}
      <OrGate cx={230} cy={215} active={V} />
      <line x1="70" y1="55" x2="70" y2="208" stroke={w(i0)} strokeWidth="1" />
      <line
        x1="70"
        y1="208"
        x2="210"
        y2="208"
        stroke={w(i0)}
        strokeWidth="1.5"
      />
      <line x1="85" y1="100" x2="85" y2="213" stroke={w(i1)} strokeWidth="1" />
      <line
        x1="85"
        y1="213"
        x2="210"
        y2="213"
        stroke={w(i1)}
        strokeWidth="1.5"
      />
      <line
        x1="100"
        y1="145"
        x2="100"
        y2="218"
        stroke={w(i2)}
        strokeWidth="1"
      />
      <line
        x1="100"
        y1="218"
        x2="210"
        y2="218"
        stroke={w(i2)}
        strokeWidth="1.5"
      />
      <line
        x1="115"
        y1="190"
        x2="115"
        y2="222"
        stroke={w(i3)}
        strokeWidth="1"
      />
      <line
        x1="115"
        y1="222"
        x2="210"
        y2="222"
        stroke={w(i3)}
        strokeWidth="1.5"
      />
      <line
        x1="246"
        y1="215"
        x2="310"
        y2="215"
        stroke={wA(V)}
        strokeWidth="2"
      />

      {/* Output labels */}
      {[
        ["A1", 310, 90, A1],
        ["A0", 340, 150, A0],
        ["V", 310, 215, V],
      ].map(([lbl, x, y, v]) => (
        <g key={lbl} style={glow(v)}>
          <rect
            x={x}
            y={y - 13}
            width="46"
            height="26"
            rx="6"
            fill={v ? "rgba(251,191,36,0.15)" : "rgba(15,25,45,0.8)"}
            stroke={wA(v)}
            strokeWidth={v ? 2 : 1}
          />
          <text
            x={x + 23}
            y={y + 4}
            textAnchor="middle"
            fill={v ? "#fbbf24" : "#6b7280"}
            fontSize="11"
            fontWeight={v ? "bold" : "normal"}
          >
            {lbl}={v}
          </text>
        </g>
      ))}

      <text x="280" y="250" textAnchor="middle" fill="#374151" fontSize="9">
        4-to-2 Priority Encoder — Live Gate-Level Circuit
      </text>
    </svg>
  );
};

// ─── SVG: 8-to-3 Encoder Block Diagram ───────────────────────────────────────
const Encoder8to3SVG = ({ inputVals, result }) => {
  const w = (v) => (v ? "#00ff88" : "#1e3a2f");
  const wA = (v) => (v ? "#fbbf24" : "#3a2e0a");
  const glow = (v) => (v ? { filter: `drop-shadow(0 0 4px #00ff88)` } : {});

  return (
    <svg
      viewBox="0 0 520 340"
      width="100%"
      style={{
        maxWidth: "520px",
        fontFamily: "monospace",
        fontSize: "11px",
        display: "block",
      }}
    >
      <rect
        width="520"
        height="340"
        rx="10"
        fill="rgba(8,12,22,0.97)"
        stroke="rgba(99,102,241,0.25)"
        strokeWidth="1.5"
      />

      {/* Encoder box */}
      <rect
        x="180"
        y="25"
        width="130"
        height="280"
        rx="8"
        fill="rgba(15,22,40,0.95)"
        stroke="rgba(99,102,241,0.5)"
        strokeWidth="2"
      />
      <text
        x="245"
        y="48"
        textAnchor="middle"
        fill="#60a5fa"
        fontSize="13"
        fontWeight="bold"
      >
        8-to-3
      </text>
      <text x="245" y="62" textAnchor="middle" fill="#60a5fa" fontSize="11">
        ENCODER
      </text>
      <line
        x1="180"
        y1="70"
        x2="310"
        y2="70"
        stroke="rgba(99,102,241,0.3)"
        strokeWidth="1"
      />

      {/* Input lines */}
      {Array.from({ length: 8 }, (_, i) => {
        const y = 80 + i * 28;
        const v = inputVals[i] || 0;
        return (
          <g key={i}>
            <circle
              cx="40"
              cy={y}
              r="14"
              fill={v ? "rgba(0,255,136,0.18)" : "rgba(20,30,50,0.8)"}
              stroke={w(v)}
              strokeWidth="1.5"
              style={glow(v)}
            />
            <text
              x="40"
              y={y + 4}
              textAnchor="middle"
              fill={v ? "#00ff88" : "#6b7280"}
              fontWeight="bold"
              fontSize="9"
            >
              I{i}
            </text>
            <line
              x1="54"
              y1={y}
              x2="180"
              y2={y}
              stroke={v ? "#00ff88" : "#1e3a2f"}
              strokeWidth={v ? 2 : 1.5}
            />
            {v && (
              <circle
                cx="58"
                cy={y}
                r="4"
                fill="#00ff88"
                style={{ filter: "drop-shadow(0 0 4px #00ff88)" }}
              />
            )}
            <text
              x="116"
              y={y - 4}
              fill="#374151"
              fontSize="8"
              textAnchor="middle"
            >
              I{i} ({i})
            </text>
          </g>
        );
      })}

      {/* Output lines */}
      {[
        ["A2", result.A2 || 0, 85],
        ["A1", result.A1 || 0, 150],
        ["A0", result.A0 || 0, 215],
        ["V", result.V || 0, 280],
      ].map(([lbl, v, y]) => (
        <g key={lbl}>
          <line
            x1="310"
            y1={y}
            x2="380"
            y2={y}
            stroke={wA(v)}
            strokeWidth={v ? 3 : 1.5}
            style={v ? { filter: "drop-shadow(0 0 3px #fbbf24)" } : {}}
          />
          <rect
            x="380"
            y={y - 14}
            width="60"
            height="28"
            rx="6"
            fill={v ? "rgba(251,191,36,0.2)" : "rgba(10,16,30,0.9)"}
            stroke={wA(v)}
            strokeWidth={v ? 2 : 1}
          />
          <text
            x="410"
            y={y + 4}
            textAnchor="middle"
            fill={v ? "#fbbf24" : "#4b5563"}
            fontSize="11"
            fontWeight={v ? "bold" : "normal"}
          >
            {lbl}={v}
          </text>
          {v && (
            <circle
              cx="315"
              cy={y}
              r="5"
              fill="#fbbf24"
              style={{ filter: "drop-shadow(0 0 5px #fbbf24)" }}
            />
          )}
        </g>
      ))}

      {/* Active annotation */}
      {result.active >= 0 && (
        <g>
          <rect
            x="6"
            y="292"
            width="160"
            height="38"
            rx="6"
            fill="rgba(0,255,136,0.08)"
            stroke="rgba(0,255,136,0.3)"
            strokeWidth="1"
          />
          <text
            x="86"
            y="308"
            textAnchor="middle"
            fill="#00ff88"
            fontSize="9"
            fontWeight="bold"
          >
            Active: I{result.active} →{" "}
            {[result.A2 || 0, result.A1 || 0, result.A0 || 0].join("")}₂
          </text>
          <text x="86" y="322" textAnchor="middle" fill="#9ca3af" fontSize="8">
            Priority: highest active input wins
          </text>
        </g>
      )}

      <text x="260" y="325" textAnchor="middle" fill="#374151" fontSize="9">
        8-to-3 Priority Encoder — Block Diagram
      </text>
    </svg>
  );
};

// ─── Quiz ─────────────────────────────────────────────────────────────────────
const ENCODER_QUIZ = [
  {
    q: "4-to-2 encoder: only I2 is HIGH. What is the output code (A1 A0)?",
    opts: ["00", "01", "10", "11"],
    ans: 2,
    exp: "I2 is input index 2 = binary 10₂. So A1=1, A0=0 → output '10'. The output IS the binary representation of the active input index!",
  },
  {
    q: "8-to-3 encoder: both I3 and I5 are HIGH simultaneously. Which output code appears?",
    opts: ["011 (I3)", "101 (I5)", "000 (undefined)", "111 (error)"],
    ans: 1,
    exp: "Priority encoder: highest-numbered input wins. I5 > I3. Output = 5 in binary = 101₂. A2=1,A1=0,A0=1.",
  },
  {
    q: "What is the V (Valid) output in a priority encoder?",
    opts: [
      "The binary code value",
      "HIGH when any input is active",
      "HIGH only for the highest input",
      "The input index in decimal",
    ],
    ans: 1,
    exp: "V=1 whenever ANY input is HIGH, telling the system a valid encoding exists. V=0 means all inputs are LOW — nothing to encode.",
  },
  {
    q: "Decimal-to-BCD encoder: D7 key pressed. What is the BCD output (A B C D)?",
    opts: ["0111", "1000", "0110", "1001"],
    ans: 0,
    exp: "7 in BCD = 0111₂. A(8s)=0, B(4s)=1, C(2s)=1, D(1s)=1. Simply convert 7 to 4-bit binary!",
  },
  {
    q: "How does a plain binary encoder differ from a PRIORITY encoder?",
    opts: [
      "Different gate types",
      "Plain encoder needs only one input HIGH at a time",
      "Priority encoder has no outputs",
      "They are identical",
    ],
    ans: 1,
    exp: "A plain binary encoder produces garbage output if multiple inputs are simultaneously HIGH. A priority encoder always resolves to the highest-indexed active input — safe in real systems!",
  },
  {
    q: "In 8-to-3 encoder: A0 = I1 + I3 + I5 + I7. Why these inputs?",
    opts: [
      "They are the highest inputs",
      "They are all odd-indexed inputs",
      "They have A2=1",
      "They have A1=0",
    ],
    ans: 1,
    exp: "A0 is the LSB. In binary, odd numbers (1,3,5,7) always have their LSB=1. So A0 is simply the OR of all odd-indexed inputs. Pattern: look at which input indices have that bit set!",
  },
];
const EncoderQuiz = () => {
  const [qi, setQi] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = ENCODER_QUIZ[qi];
  const choose = (i) => {
    if (sel !== null) return;
    setSel(i);
    if (i === q.ans) setScore((s) => s + 1);
  };
  const next = () => {
    if (qi + 1 >= ENCODER_QUIZ.length) {
      setDone(true);
      return;
    }
    setQi(qi + 1);
    setSel(null);
  };
  const restart = () => {
    setQi(0);
    setSel(null);
    setScore(0);
    setDone(false);
  };
  if (done)
    return (
      <div style={{ textAlign: "center", padding: "30px" }}>
        <div style={{ fontSize: "3rem", marginBottom: "12px" }}>
          {score >= 5 ? "🏆" : score >= 3 ? "🎯" : "📚"}
        </div>
        <h3 style={{ color: "#fbbf24", marginBottom: "8px" }}>
          Quiz Complete!
        </h3>
        <p style={{ color: "#9ca3af", marginBottom: "4px" }}>
          Score:{" "}
          <strong style={{ color: "#00ff88" }}>
            {score}/{ENCODER_QUIZ.length}
          </strong>
        </p>
        <p style={{ color: "#9ca3af", marginBottom: "20px" }}>
          {score >= 5
            ? "Excellent encoder mastery!"
            : score >= 3
              ? "Good — review the priority logic trick."
              : "Keep going — the binary-index trick will click!"}
        </p>
        <button className="kmap-btn kmap-btn-primary" onClick={restart}>
          ↺ Try Again
        </button>
      </div>
    );
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "14px",
        }}
      >
        <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
          Question {qi + 1}/{ENCODER_QUIZ.length}
        </span>
        <span style={{ color: "#00ff88", fontSize: "0.85rem" }}>
          Score: {score}
        </span>
      </div>
      <p
        style={{
          color: "#e2e8f0",
          fontWeight: "600",
          marginBottom: "14px",
          lineHeight: "1.6",
        }}
      >
        {q.q}
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginBottom: "14px",
        }}
      >
        {q.opts.map((opt, i) => {
          let bg = "rgba(15,23,42,0.6)",
            border = "rgba(148,163,184,0.2)",
            color = "#9ca3af";
          if (sel !== null) {
            if (i === q.ans) {
              bg = "rgba(0,255,136,0.12)";
              border = "#00ff88";
              color = "#00ff88";
            } else if (i === sel && sel !== q.ans) {
              bg = "rgba(239,68,68,0.12)";
              border = "#ef4444";
              color = "#ef4444";
            }
          }
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                border: `1.5px solid ${border}`,
                background: bg,
                color,
                fontFamily: "monospace",
                cursor: sel !== null ? "default" : "pointer",
                textAlign: "left",
                transition: "all 0.2s",
              }}
            >
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          );
        })}
      </div>
      {sel !== null && (
        <div
          style={{
            padding: "12px",
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: "8px",
            marginBottom: "14px",
          }}
        >
          <p style={{ color: "#c4b5fd", margin: 0, fontSize: "0.9rem" }}>
            💡 {q.exp}
          </p>
        </div>
      )}
      {sel !== null && (
        <button className="kmap-btn kmap-btn-primary" onClick={next}>
          {qi + 1 < ENCODER_QUIZ.length ? "Next →" : "See Results"}
        </button>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const EncoderPage = () => {
  const [selectedType, setSelectedType] = useState("4to2");
  const [inputVals, setInputVals] = useState(Array(10).fill(0));
  const [openCircuit, setOpenCircuit] = useState(null);
  const [expandedEq, setExpandedEq] = useState(null);
  const [highlightRow, setHighlightRow] = useState(null);

  const config = ENCODER_TYPES[selectedType];
  const toggleInput = (idx) => {
    const n = [...inputVals];
    n[idx] = n[idx] ? 0 : 1;
    setInputVals(n);
  };
  const resetInputs = () => setInputVals(Array(10).fill(0));
  const activeVals = inputVals.slice(0, config.inputs.length);
  const result = useMemo(() => config.encode(activeVals), [config, activeVals]);
  const outputEntries = config.outputs.map((name) => ({
    name,
    val: result[name] ?? 0,
  }));

  const circuitConfigs = {
    "4to2": {
      expression: "F = C + D",
      variables: ["A", "B", "C", "D"],
      label: "4-to-2 Encoder (A1 = I2 + I3)",
    },
    "8to3": {
      expression: "F = E + F + G + H",
      variables: ["A", "B", "C", "D", "E", "F", "G", "H"],
      label: "8-to-3 Encoder (A2 = I4+I5+I6+I7)",
    },
  };

  return (
    <ToolLayout
      title="Encoders"
      subtitle="Compress active input lines into compact binary codes"
    >
      {/* ═══════════════════ SECTION 1: CONCEPT ═══════════════════ */}
      <ExplanationBlock title="What is an Encoder?">
        <p className="explanation-intro">
          An <strong>encoder</strong> is a combinational circuit that converts
          an active input signal into a compressed binary code. It is the{" "}
          <em>inverse of a decoder</em>: given 2ⁿ (or fewer) input lines, it
          produces an n-bit binary code identifying which input is active. Think
          of it as a <strong>barcode scanner</strong> — you press one key (one
          input HIGH) and it outputs the binary "barcode" (the address) of that
          key.
        </p>
        <div className="info-card">
          <h4>Core Properties of Every Encoder</h4>
          <ul>
            <li>
              📉 <strong>Compression:</strong> Reduces many input lines to fewer
              output bits (2ⁿ → n bits)
            </li>
            <li>
              ✅ <strong>Valid Flag (V):</strong> Priority encoders output V=1
              when ANY input is active, V=0 when idle
            </li>
            <li>
              ⭐ <strong>Priority:</strong> If multiple inputs are HIGH, the
              highest-numbered wins
            </li>
            <li>
              ⚡ <strong>Combinational:</strong> Output depends only on current
              inputs — no memory
            </li>
          </ul>
        </div>
        <div className="example-box">
          <h4>
            🎯 The Binary-Index Trick — Write Any Encoder Equation Instantly
          </h4>
          <p>For output bit Aₖ (e.g., A1 or A0):</p>
          <ul>
            <li>Look at all input indices from 0 to 2ⁿ-1</li>
            <li>
              Find every index where <strong>bit k is 1</strong> in its binary
              representation
            </li>
            <li>OR those input lines together</li>
          </ul>
          <p
            style={{
              marginTop: "12px",
              padding: "10px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: "6px",
              fontFamily: "monospace",
            }}
          >
            <strong style={{ color: "#fbbf24" }}>
              Example — A0 in an 8-to-3 encoder:
            </strong>
            <br />
            Which indices 0–7 have bit-0 = 1? → 1,3,5,7 (the odd ones)
            <br />
            <strong style={{ color: "#00ff88" }}>
              ∴ A0 = I1 + I3 + I5 + I7 ✅
            </strong>
            <br />
            <br />
            <strong style={{ color: "#fbbf24" }}>
              And A2 in an 8-to-3 encoder:
            </strong>
            <br />
            Which indices have bit-2 = 1? → 4,5,6,7
            <br />
            <strong style={{ color: "#00ff88" }}>
              ∴ A2 = I4 + I5 + I6 + I7 ✅
            </strong>
          </p>
        </div>
        <div className="key-insight">
          <h4>🧠 Encoder vs Decoder — The Inverse Relationship</h4>
          <p>
            Decoder: n-bit code → one of 2ⁿ output lines HIGH (expand).
            <br />
            Encoder: one of 2ⁿ input lines HIGH → n-bit code (compress).
            <br />
            They are <strong>mathematical inverses</strong>. Together, they form
            the compression/expansion foundation of all digital communication
            and addressing systems.
          </p>
        </div>
      </ExplanationBlock>

      {/* ═══════════════════ SECTION 2: HOW IT WORKS + LIVE SVG ═══════════════════ */}
      <ExplanationBlock title="How the Circuit Works — The Trick to Learn It Forever">
        <p className="explanation-intro">
          An encoder's internal circuit is one of the simplest in digital logic
          — almost entirely just <strong>OR gates</strong>. Two layers, and
          you're done.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "12px",
            margin: "18px 0",
          }}
        >
          {[
            {
              n: "1",
              icon: "📥",
              title: "Active Input",
              color: "#00ff88",
              text: 'Exactly one input line (or the highest in priority mode) is asserted HIGH. All others are LOW. This active line carries the "which one" information.',
            },
            {
              n: "2",
              icon: "🔧",
              title: "OR Layer",
              color: "#fbbf24",
              text: "Each output bit is formed by ORing all input lines that have that bit = 1 in their address. For a plain binary encoder, only OR gates are needed — no NOT or AND gates!",
            },
            {
              n: "3",
              icon: "📤",
              title: "Binary Code Out",
              color: "#60a5fa",
              text: "The n output bits form the binary representation of the active input's index. This is the compressed code. Priority encoders add masking AND gates to handle conflicts.",
            },
          ].map(({ n, icon, title, color, text }) => (
            <div
              key={n}
              style={{
                background: "rgba(12,18,35,0.8)",
                border: `1px solid ${color}30`,
                borderRadius: "10px",
                padding: "16px",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "6px" }}>
                {icon}
              </div>
              <div
                style={{
                  color,
                  fontWeight: "700",
                  fontSize: "0.75rem",
                  marginBottom: "3px",
                }}
              >
                STEP {n}
              </div>
              <div
                style={{
                  color: "#e2e8f0",
                  fontWeight: "600",
                  marginBottom: "8px",
                  fontSize: "0.9rem",
                }}
              >
                {title}
              </div>
              <div
                style={{
                  color: "#9ca3af",
                  fontSize: "0.82rem",
                  lineHeight: "1.6",
                }}
              >
                {text}
              </div>
            </div>
          ))}
        </div>

        {/* LIVE 4-to-2 encoder circuit */}
        <div
          style={{
            background: "rgba(8,14,28,0.9)",
            border: "1px solid rgba(99,102,241,0.35)",
            borderRadius: "12px",
            padding: "20px",
            marginTop: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <h4 style={{ color: "#a5b4fc", margin: 0 }}>
              🔬 4-to-2 Priority Encoder — Live Gate-Level Circuit
            </h4>
            <span style={{ color: "#6b7280", fontSize: "0.8rem" }}>
              Click inputs to toggle. Green = HIGH.
            </span>
          </div>
          <p
            style={{
              color: "#6b7280",
              fontSize: "0.82rem",
              marginBottom: "14px",
            }}
          >
            🟢 Green wire = HIGH &nbsp;|&nbsp; ⚫ Dark wire = LOW &nbsp;|&nbsp;
            Yellow outputs = encoded values
          </p>
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "16px",
              flexWrap: "wrap",
            }}
          >
            {["I0", "I1", "I2", "I3"].map((lbl, i) => (
              <button
                key={lbl}
                onClick={() => toggleInput(i)}
                style={{
                  padding: "7px 14px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontFamily: "monospace",
                  fontWeight: "700",
                  fontSize: "0.9rem",
                  border: `2px solid ${inputVals[i] ? "#00ff88" : "rgba(148,163,184,0.25)"}`,
                  background: inputVals[i]
                    ? "rgba(0,255,136,0.18)"
                    : "rgba(20,30,50,0.6)",
                  color: inputVals[i] ? "#00ff88" : "#6b7280",
                  transition: "all 0.2s",
                }}
              >
                {lbl}={inputVals[i]}
              </button>
            ))}
            <button
              onClick={resetInputs}
              style={{
                padding: "7px 14px",
                borderRadius: "6px",
                cursor: "pointer",
                fontFamily: "monospace",
                fontSize: "0.8rem",
                background: "rgba(30,40,60,0.5)",
                border: "1px solid rgba(148,163,184,0.15)",
                color: "#6b7280",
              }}
            >
              ↺ Reset
            </button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <Encoder4to2SVG inputVals={inputVals} result={result} />
          </div>
          <div
            style={{
              marginTop: "12px",
              padding: "10px 14px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: "8px",
              fontFamily: "monospace",
              fontSize: "0.85rem",
            }}
          >
            {result.active >= 0 ? (
              <>
                <span style={{ color: "#9ca3af" }}>Active: </span>
                <span style={{ color: "#00ff88", fontWeight: "600" }}>
                  I{result.active}
                </span>
                <span style={{ color: "#9ca3af" }}> → Code: </span>
                <span style={{ color: "#fbbf24", fontWeight: "600" }}>
                  A1={result.A1} A0={result.A0}
                </span>
                <span style={{ color: "#9ca3af" }}>
                  {" "}
                  ({result.active}₁₀ ={" "}
                  {result.active.toString(2).padStart(2, "0")}₂) &nbsp; V=1
                </span>
              </>
            ) : (
              <span style={{ color: "#6b7280" }}>
                No inputs active — V=0, outputs indeterminate
              </span>
            )}
          </div>
        </div>

        {/* LIVE 8-to-3 encoder block */}
        <div
          style={{
            background: "rgba(8,14,28,0.9)",
            border: "1px solid rgba(99,102,241,0.35)",
            borderRadius: "12px",
            padding: "20px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <h4 style={{ color: "#a5b4fc", margin: 0 }}>
              🔬 8-to-3 Priority Encoder — Block Diagram
            </h4>
            <span style={{ color: "#6b7280", fontSize: "0.8rem" }}>
              Toggle any input to encode it
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "16px",
              flexWrap: "wrap",
            }}
          >
            {["I0", "I1", "I2", "I3", "I4", "I5", "I6", "I7"].map((lbl, i) => (
              <button
                key={lbl}
                onClick={() => toggleInput(i)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontFamily: "monospace",
                  fontWeight: "700",
                  fontSize: "0.85rem",
                  border: `2px solid ${inputVals[i] ? "#00ff88" : "rgba(148,163,184,0.2)"}`,
                  background: inputVals[i]
                    ? "rgba(0,255,136,0.18)"
                    : "rgba(20,30,50,0.6)",
                  color: inputVals[i] ? "#00ff88" : "#6b7280",
                  transition: "all 0.2s",
                }}
              >
                {lbl}
              </button>
            ))}
            <button
              onClick={resetInputs}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                fontFamily: "monospace",
                fontSize: "0.8rem",
                background: "rgba(30,40,60,0.5)",
                border: "1px solid rgba(148,163,184,0.15)",
                color: "#6b7280",
              }}
            >
              ↺
            </button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <Encoder8to3SVG
              inputVals={inputVals}
              result={
                result.active !== undefined && selectedType === "8to3"
                  ? result
                  : { A2: 0, A1: 0, A0: 0, V: 0, active: -1 }
              }
            />
          </div>
        </div>

        {/* Priority explanation */}
        <div className="example-box" style={{ marginTop: "20px" }}>
          <h4>⭐ The Priority Logic Trick — How Masking Works</h4>
          <p>
            For A0 in a 4-to-2 priority encoder: plain <code>A0 = I1 + I3</code>{" "}
            would be wrong if I2 is also HIGH (I2=10₂ but then I1 would
            incorrectly affect A0). The fix:
          </p>
          <ul>
            <li>
              <strong>A0 = I3 + I1·I2'</strong> — I1 is masked by I2' (I2
              complement)
            </li>
            <li>
              If I2=1, then I2'=0, so I1·I2'=0 → I1 is silenced (I2 takes
              priority over I1)
            </li>
            <li>If I2=0, then I1 can contribute normally</li>
            <li>
              I3 always wins (highest priority) — no masking needed for the top
              input
            </li>
          </ul>
          <p>
            This cascading masking is the secret sauce of all priority encoders!
          </p>
        </div>
      </ExplanationBlock>

      {/* ═══════════════════ SECTION 3: FULL SIMULATOR ═══════════════════ */}
      <ExplanationBlock title="Interactive Encoder Simulator">
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          {Object.entries(ENCODER_TYPES).map(([key, cfg]) => (
            <button
              key={key}
              className={`kmap-btn ${selectedType === key ? "kmap-btn-primary" : "kmap-btn-secondary"}`}
              onClick={() => {
                setSelectedType(key);
                resetInputs();
              }}
            >
              {cfg.label}
            </button>
          ))}
        </div>
        <p className="explanation-intro" style={{ marginBottom: "16px" }}>
          <strong>{config.label}</strong> — {config.description}. Click input
          buttons to activate them.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
          }}
        >
          <div>
            <h4 style={{ color: "#93c5fd", marginBottom: "12px" }}>Inputs</h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "7px" }}
            >
              {config.inputs.map((label, idx) => (
                <button
                  key={label}
                  onClick={() => toggleInput(idx)}
                  style={{
                    padding: "9px 14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    border: `2px solid ${inputVals[idx] ? "#00ff88" : "rgba(148,163,184,0.25)"}`,
                    background: inputVals[idx]
                      ? "rgba(0,255,136,0.15)"
                      : "rgba(12,18,35,0.7)",
                    color: inputVals[idx] ? "#00ff88" : "#9ca3af",
                    fontFamily: "monospace",
                    fontWeight: "600",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>
                    {label} &nbsp;
                    <span style={{ color: "#374151", fontSize: "0.8rem" }}>
                      index {idx} ={" "}
                      {idx.toString(2).padStart(config.outputs.length - 1, "0")}
                      ₂
                    </span>
                  </span>
                  <span
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: inputVals[idx] ? "#00ff88" : "#334155",
                      boxShadow: inputVals[idx] ? "0 0 8px #00ff88" : "none",
                      display: "inline-block",
                    }}
                  />
                </button>
              ))}
            </div>
            <button
              className="kmap-btn kmap-btn-secondary"
              style={{ marginTop: "10px", width: "100%" }}
              onClick={resetInputs}
            >
              ↺ Reset All
            </button>
            {result.active >= 0 && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "12px",
                  borderRadius: "8px",
                  background: "rgba(0,255,136,0.05)",
                  border: "1px solid rgba(0,255,136,0.2)",
                  fontFamily: "monospace",
                  fontSize: "0.85rem",
                }}
              >
                <p style={{ color: "#00ff88", margin: 0, fontWeight: "600" }}>
                  Active: {config.inputs[result.active]} (index {result.active})
                </p>
                <p style={{ color: "#9ca3af", margin: "4px 0 0" }}>
                  = {result.active}₁₀ ={" "}
                  {result.active
                    .toString(2)
                    .padStart(
                      config.outputs.filter((o) => o !== "V").length,
                      "0",
                    )}
                  ₂
                </p>
              </div>
            )}
          </div>
          <div>
            <h4 style={{ color: "#fbbf24", marginBottom: "12px" }}>Outputs</h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "7px" }}
            >
              {outputEntries.map(({ name, val }) => (
                <div
                  key={name}
                  style={{
                    padding: "9px 14px",
                    borderRadius: "8px",
                    transition: "all 0.2s",
                    border: `2px solid ${val ? "#fbbf24" : "rgba(148,163,184,0.12)"}`,
                    background: val
                      ? "rgba(251,191,36,0.12)"
                      : "rgba(10,16,30,0.6)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontWeight: "600",
                      color: "#e2e8f0",
                    }}
                  >
                    {name}
                  </span>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "1.2rem",
                      fontWeight: "700",
                      color: val ? "#fbbf24" : "#374151",
                      textShadow: val ? "0 0 10px #fbbf24" : "none",
                    }}
                  >
                    {val}
                  </span>
                </div>
              ))}
            </div>
            {result.active >= 0 && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "12px",
                  borderRadius: "8px",
                  background: "rgba(251,191,36,0.06)",
                  border: "1px solid rgba(251,191,36,0.3)",
                }}
              >
                <p style={{ color: "#fbbf24", fontWeight: "600", margin: 0 }}>
                  ✅ Code:{" "}
                  {config.outputs
                    .filter((o) => o !== "V")
                    .map((o) => result[o] ?? 0)
                    .join("")}
                </p>
                <p
                  style={{
                    color: "#9ca3af",
                    margin: "4px 0 0",
                    fontSize: "0.82rem",
                  }}
                >
                  = decimal {result.active} &nbsp;|&nbsp; V=1 (valid)
                </p>
              </div>
            )}
            {result.active < 0 && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "12px",
                  borderRadius: "8px",
                  background: "rgba(107,114,128,0.06)",
                  border: "1px solid rgba(107,114,128,0.2)",
                }}
              >
                <p
                  style={{
                    color: "#6b7280",
                    margin: 0,
                    fontFamily: "monospace",
                  }}
                >
                  No inputs active — V=0
                </p>
              </div>
            )}
          </div>
        </div>
      </ExplanationBlock>

      {/* ═══════════════════ SECTION 4: BOOLEAN EQS ═══════════════════ */}
      <ExplanationBlock title={`Boolean Equations — ${config.label}`}>
        <p className="explanation-intro">
          Click any equation to understand the logic behind it.
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginTop: "12px",
          }}
        >
          {config.booleanEqs.map(({ out, eq, explanation }, i) => (
            <div key={out}>
              <button
                onClick={() => setExpandedEq(expandedEq === i ? null : i)}
                style={{
                  width: "100%",
                  padding: "11px 16px",
                  background:
                    expandedEq === i
                      ? "rgba(251,191,36,0.1)"
                      : "rgba(251,191,36,0.04)",
                  border: `1px solid ${expandedEq === i ? "rgba(251,191,36,0.5)" : "rgba(251,191,36,0.2)"}`,
                  borderRadius: expandedEq === i ? "8px 8px 0 0" : "8px",
                  fontFamily: "monospace",
                  fontSize: "0.92rem",
                  color: "#fde68a",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  <strong style={{ color: "#fbbf24" }}>{out}:</strong> {eq}
                </span>
                <span
                  style={{
                    color: "#6b7280",
                    fontSize: "0.8rem",
                    marginLeft: "8px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {expandedEq === i ? "▲" : "▼ explain"}
                </span>
              </button>
              {expandedEq === i && (
                <div
                  style={{
                    padding: "12px 16px",
                    background: "rgba(251,191,36,0.03)",
                    border: "1px solid rgba(251,191,36,0.15)",
                    borderTop: "none",
                    borderRadius: "0 0 8px 8px",
                  }}
                >
                  <p
                    style={{
                      color: "#9ca3af",
                      margin: 0,
                      fontSize: "0.88rem",
                      lineHeight: "1.6",
                    }}
                  >
                    💡 {explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="key-insight" style={{ marginTop: "16px" }}>
          <h4>Why Encoders Only Need OR Gates (plain binary encoder)</h4>
          <p>
            Each output bit Aₖ is simply the OR of all inputs whose index has
            bit k = 1. No AND, no NOT — just OR gates. This makes plain binary
            encoders one of the cheapest circuits to implement. Priority
            encoders add some AND gates for the masking logic, but the structure
            remains very simple.
          </p>
        </div>
      </ExplanationBlock>

      {/* ═══════════════════ SECTION 5: TRUTH TABLE ═══════════════════ */}
      <ExplanationBlock title={`Truth Table — ${config.label}`}>
        <p className="explanation-intro" style={{ marginBottom: "10px" }}>
          Hover any row to highlight. Active encoding is highlighted
          automatically.
        </p>
        <div className="binary-table-container">
          <table className="binary-table">
            <thead className="binary-table-header">
              <tr>
                {selectedType === "4to2" ? (
                  <>
                    {config.inputs.map((i) => (
                      <th key={i}>{i}</th>
                    ))}
                    {config.outputs.map((o) => (
                      <th key={o}>{o}</th>
                    ))}
                  </>
                ) : (
                  <>
                    <th>Active Input</th>
                    {config.outputs.map((o) => (
                      <th key={o}>{o}</th>
                    ))}
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {config.truthRows.map((row, ri) => {
                const isActive = result.active === ri;
                return (
                  <tr
                    key={ri}
                    className="binary-table-row"
                    onMouseEnter={() => setHighlightRow(ri)}
                    onMouseLeave={() => setHighlightRow(null)}
                    style={{
                      background: isActive
                        ? "rgba(251,191,36,0.07)"
                        : highlightRow === ri
                          ? "rgba(99,102,241,0.07)"
                          : "transparent",
                      cursor: "default",
                      transition: "background 0.15s",
                    }}
                  >
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className={`binary-table-cell ${cell === "1" ? "binary-table-cell-primary" : ""}`}
                        style={{
                          fontWeight: isActive ? "700" : "normal",
                          color:
                            isActive && cell === "1" ? "#fbbf24" : undefined,
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ExplanationBlock>

      {/* ═══════════════════ SECTION 6: APPLICATIONS ═══════════════════ */}
      <ExplanationBlock title="Types of Encoders &amp; Real-World Applications">
        <div className="comparison-grid">
          {[
            {
              icon: "⚡",
              title: "Flash ADC",
              items: [
                "2ⁿ comparators → one encoder",
                "Fastest ADC topology possible",
                "Converts thermometer code to binary",
                "Used in high-speed oscilloscopes, radar",
              ],
            },
            {
              icon: "⌨️",
              title: "Keyboard Encoder",
              items: [
                "Each key = one input line",
                "Priority handles simultaneous keys",
                "Encoder outputs scan code / ASCII",
                "Debouncing circuit precedes encoder",
              ],
            },
            {
              icon: "🚨",
              title: "Interrupt Controller (8259A)",
              items: [
                "8 interrupt request lines → 3-bit vector",
                "Highest priority interrupt encoded first",
                "CPU reads vector to find ISR address",
                "Foundation of x86 interrupt handling",
              ],
            },
            {
              icon: "🖥️",
              title: "Display Multiplexer",
              items: [
                "Multiple display positions compete",
                "Encoder picks which digit to refresh",
                "Feeds 7-segment decoder for display",
                "Rapid cycling creates persistence illusion",
              ],
            },
          ].map(({ icon, title, items }) => (
            <div key={title} className="comparison-card">
              <h5>
                {icon} {title}
              </h5>
              <ul>
                {items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ExplanationBlock>

      {/* ═══════════════════ SECTION 7: QUIZ ═══════════════════ */}
      <ExplanationBlock title="🧪 Knowledge Check — Test Yourself">
        <p className="explanation-intro" style={{ marginBottom: "20px" }}>
          6 questions on encoders, priority logic, and Boolean equations.
        </p>
        <EncoderQuiz />
      </ExplanationBlock>

      {/* ═══════════════════ SECTION 8: CIRCUIT BUTTONS ═══════════════════ */}
      <ExplanationBlock title="Visualize in Circuit Forge">
        <p className="explanation-intro" style={{ marginBottom: "8px" }}>
          Open Circuit Forge with the encoder's Boolean expression pre-loaded.
          Experiment with connecting OR gates to build the full encoder logic.
        </p>
        <div className="example-box" style={{ marginBottom: "20px" }}>
          <h4>ℹ️ Variable mapping in Circuit Forge:</h4>
          <ul>
            <li>
              <strong>4×2 Encoder:</strong> Loads A1 = C + D (C = I2, D = I3).
              Wire C and D to an OR gate.
            </li>
            <li>
              <strong>8×3 Encoder:</strong> Loads A2 = E + F + G + H (E=I4,
              F=I5, G=I6, H=I7). Wire all four to a single OR gate.
            </li>
            <li>
              A, B (and A–D for 8×3) are shown as inputs but not wired — these
              represent the lower-index inputs not used by this output bit.
            </li>
          </ul>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "14px",
          }}
        >
          <button
            className="kmap-btn kmap-btn-primary"
            style={{
              padding: "16px 18px",
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onClick={() => setOpenCircuit("4to2")}
          >
            🔌 Visualize 4×2 Encoder (A1 = I2 + I3)
          </button>
          <button
            className="kmap-btn kmap-btn-primary"
            style={{
              padding: "16px 18px",
              fontSize: "0.95rem",
              background: "linear-gradient(135deg,#6366f1,#4f46e5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onClick={() => setOpenCircuit("8to3")}
          >
            🔌 Visualize 8×3 Encoder (A2 = I4+I5+I6+I7)
          </button>
        </div>
      </ExplanationBlock>

      {openCircuit && circuitConfigs[openCircuit] && (
        <CircuitModal
          open={true}
          onClose={() => setOpenCircuit(null)}
          expression={circuitConfigs[openCircuit].expression}
          variables={circuitConfigs[openCircuit].variables}
        />
      )}

      <style jsx>{`
        .comparison-card h5 {
          color: #93c5fd;
          margin-bottom: 10px;
          font-size: 0.95rem;
        }
        .comparison-card ul {
          color: #9ca3af;
          padding-left: 18px;
          margin: 0;
        }
        .comparison-card li {
          margin-bottom: 6px;
          line-height: 1.5;
        }
        .info-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(148, 163, 184, 0.25);
          border-radius: 12px;
          padding: 20px;
          margin-top: 16px;
        }
        .info-card h4 {
          color: #93c5fd;
          margin-bottom: 10px;
        }
        .info-card ul,
        .info-card p {
          color: #9ca3af;
          padding-left: 18px;
          margin: 0;
        }
        .info-card li {
          margin-bottom: 6px;
          line-height: 1.5;
        }
        .example-box {
          background: rgba(251, 191, 36, 0.07);
          border: 1px solid rgba(251, 191, 36, 0.3);
          border-radius: 12px;
          padding: 20px;
          margin-top: 16px;
        }
        .example-box h4 {
          color: #fbbf24;
          margin-bottom: 10px;
        }
        .example-box ul,
        .example-box p,
        .example-box code {
          color: #9ca3af;
          padding-left: 18px;
          margin: 4px 0 0;
        }
        .example-box code {
          background: rgba(0, 0, 0, 0.3);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          color: #c4b5fd;
        }
        .example-box li {
          margin-bottom: 6px;
          line-height: 1.5;
        }
        .key-insight {
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 12px;
          padding: 20px;
          margin-top: 16px;
        }
        .key-insight h4 {
          color: #86efac;
          margin-bottom: 10px;
        }
        .key-insight p {
          color: #9ca3af;
          margin: 0;
          line-height: 1.7;
        }
        .comparison-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-top: 16px;
        }
        .comparison-card {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 10px;
          padding: 16px;
        }
        .binary-table-container {
          overflow-x: auto;
          margin-top: 12px;
        }
        .binary-table {
          width: 100%;
          border-collapse: collapse;
        }
        .binary-table-header th {
          background: rgba(99, 102, 241, 0.2);
          color: #93c5fd;
          padding: 9px 12px;
          text-align: center;
          border: 1px solid rgba(148, 163, 184, 0.2);
          font-family: monospace;
        }
        .binary-table-row td {
          padding: 7px 12px;
          text-align: center;
          border: 1px solid rgba(148, 163, 184, 0.1);
          color: #e2e8f0;
          font-family: monospace;
        }
        .binary-table-cell-primary {
          color: #00ff88 !important;
          font-weight: 700;
        }
      `}</style>
    </ToolLayout>
  );
};
export default EncoderPage;
