import React, { useState, useMemo } from "react";
import ToolLayout from "../components/ToolLayout";
import ExplanationBlock from "../components/ExplanationBlock";
import CircuitModal from "../components/CircuitModal";

// ─── Decoder Logic ───────────────────────────────────────────────────────────
const DECODER_TYPES = {
  "1to2": {
    label: "1-to-2 Decoder",
    codeInputs: ["A"],
    enableInput: true,
    outputs: ["D0", "D1"],
    description: "1-bit input + Enable → 2 output lines",
    decode: (code, en) => {
      if (!en) return { D0: 0, D1: 0, active: -1 };
      const i = code[0];
      return { D0: i === 0 ? 1 : 0, D1: i === 1 ? 1 : 0, active: i };
    },
    booleanEqs: [
      {
        out: "D0",
        eq: "D0 = E · A'",
        explanation:
          "Address 0 → binary '0'. A=0 means complement it → A'. Think: flip 0-bits.",
      },
      {
        out: "D1",
        eq: "D1 = E · A",
        explanation:
          "Address 1 → binary '1'. A=1 means use directly. Think: keep 1-bits as-is.",
      },
    ],
    truthRows: [
      ["0", "x", "0", "0"],
      ["1", "0", "1", "0"],
      ["1", "1", "0", "1"],
    ],
    truthHeaders: ["E", "A", "D0", "D1"],
  },
  "2to4": {
    label: "2-to-4 Decoder",
    codeInputs: ["A1", "A0"],
    enableInput: true,
    outputs: ["D0", "D1", "D2", "D3"],
    description: "2-bit binary code + Enable → 4 output lines",
    decode: (code, en) => {
      if (!en) return { D0: 0, D1: 0, D2: 0, D3: 0, active: -1 };
      const i = (code[0] << 1) | code[1];
      return {
        D0: i === 0 ? 1 : 0,
        D1: i === 1 ? 1 : 0,
        D2: i === 2 ? 1 : 0,
        D3: i === 3 ? 1 : 0,
        active: i,
      };
    },
    booleanEqs: [
      {
        out: "D0",
        eq: "D0 = E · A1' · A0'",
        explanation:
          "Address 00 → both bits are 0 → complement both. D0 fires ONLY when A1=0 AND A0=0.",
      },
      {
        out: "D1",
        eq: "D1 = E · A1' · A0",
        explanation:
          "Address 01 → A1=0 complement, A0=1 keep. D1 fires ONLY when A1=0 AND A0=1.",
      },
      {
        out: "D2",
        eq: "D2 = E · A1 · A0'",
        explanation:
          "Address 10 → A1=1 keep, A0=0 complement. D2 fires ONLY when A1=1 AND A0=0.",
      },
      {
        out: "D3",
        eq: "D3 = E · A1 · A0",
        explanation:
          "Address 11 → both bits are 1 → keep both direct. D3 fires ONLY when A1=1 AND A0=1.",
      },
    ],
    truthRows: [
      ["0", "x", "x", "0", "0", "0", "0"],
      ["1", "0", "0", "1", "0", "0", "0"],
      ["1", "0", "1", "0", "1", "0", "0"],
      ["1", "1", "0", "0", "0", "1", "0"],
      ["1", "1", "1", "0", "0", "0", "1"],
    ],
    truthHeaders: ["E", "A1", "A0", "D0", "D1", "D2", "D3"],
  },
  "3to8": {
    label: "3-to-8 Decoder",
    codeInputs: ["A2", "A1", "A0"],
    enableInput: true,
    outputs: ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7"],
    description: "3-bit binary code + Enable → 8 output lines",
    decode: (code, en) => {
      if (!en) {
        const o = {};
        for (let i = 0; i < 8; i++) o[`D${i}`] = 0;
        o.active = -1;
        return o;
      }
      const idx = (code[0] << 2) | (code[1] << 1) | code[2];
      const out = {};
      for (let i = 0; i < 8; i++) out[`D${i}`] = i === idx ? 1 : 0;
      out.active = idx;
      return out;
    },
    booleanEqs: [
      {
        out: "D0",
        eq: "D0 = E·A2'·A1'·A0'",
        explanation: "000 → all 0 → all complemented. Minterm m0.",
      },
      {
        out: "D1",
        eq: "D1 = E·A2'·A1'·A0",
        explanation: "001 → A0=1 direct, A2 & A1 complemented. Minterm m1.",
      },
      {
        out: "D2",
        eq: "D2 = E·A2'·A1·A0'",
        explanation: "010 → A1=1 direct, A2 & A0 complemented. Minterm m2.",
      },
      {
        out: "D3",
        eq: "D3 = E·A2'·A1·A0",
        explanation: "011 → A1 & A0 direct, only A2 complemented. Minterm m3.",
      },
      {
        out: "D4",
        eq: "D4 = E·A2·A1'·A0'",
        explanation: "100 → A2=1 direct, A1 & A0 complemented. Minterm m4.",
      },
      {
        out: "D5",
        eq: "D5 = E·A2·A1'·A0",
        explanation: "101 → A2 & A0 direct, A1 complemented. Minterm m5.",
      },
      {
        out: "D6",
        eq: "D6 = E·A2·A1·A0'",
        explanation: "110 → A2 & A1 direct, A0 complemented. Minterm m6.",
      },
      {
        out: "D7",
        eq: "D7 = E·A2·A1·A0",
        explanation:
          "111 → all 1 → all direct. No complements at all. Minterm m7.",
      },
    ],
    truthRows: Array.from({ length: 8 }, (_, i) => {
      const a2 = (i >> 2) & 1,
        a1 = (i >> 1) & 1,
        a0 = i & 1;
      const row = ["1", String(a2), String(a1), String(a0)];
      for (let j = 0; j < 8; j++) row.push(j === i ? "1" : "0");
      return row;
    }),
    truthHeaders: [
      "E",
      "A2",
      "A1",
      "A0",
      "D0",
      "D1",
      "D2",
      "D3",
      "D4",
      "D5",
      "D6",
      "D7",
    ],
  },
  BCD7seg: {
    label: "BCD-to-7-Segment",
    codeInputs: ["A", "B", "C", "D"],
    enableInput: false,
    outputs: ["a", "b", "c", "d", "e", "f", "g"],
    description: "4-bit BCD → 7 segment display signals",
    decode: (code) => {
      const table = [
        [1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 0, 0, 0, 0],
        [1, 1, 0, 1, 1, 0, 1],
        [1, 1, 1, 1, 0, 0, 1],
        [0, 1, 1, 0, 0, 1, 1],
        [1, 0, 1, 1, 0, 1, 1],
        [1, 0, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 0, 1, 1],
      ];
      const idx = (code[0] << 3) | (code[1] << 2) | (code[2] << 1) | code[3];
      if (idx > 9)
        return { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, active: -1 };
      const s = table[idx];
      return {
        a: s[0],
        b: s[1],
        c: s[2],
        d: s[3],
        e: s[4],
        f: s[5],
        g: s[6],
        active: idx,
      };
    },
    booleanEqs: [
      {
        out: "a",
        eq: "a = A + C + B'D' + BD",
        explanation:
          "Segment a (top bar) is OFF only for digits 1 and 4. Complex OR expression covers remaining 8 digits.",
      },
      {
        out: "b",
        eq: "b = B' + CD + C'D'",
        explanation:
          "Segment b (top-right) is OFF only for digits 5 and 6. Note how B' alone covers half the cases.",
      },
      {
        out: "c",
        eq: "c = B + C' + D",
        explanation:
          "Segment c (bottom-right) is OFF ONLY for digit 2. Simplest 7-seg equation!",
      },
      {
        out: "d",
        eq: "d = A + B'C' + C'D' + BC'D + CD'",
        explanation:
          "Segment d (bottom bar) is the most complex — ON for 0,2,3,5,6,8. Four product terms needed.",
      },
      {
        out: "e",
        eq: "e = B'D' + CD'",
        explanation:
          "Segment e (bottom-left) is ON only for 0,2,6,8. Just two product terms covers it.",
      },
      {
        out: "f",
        eq: "f = A + BC' + BD' + C'D'",
        explanation:
          "Segment f (top-left) is ON for 0,4,5,6,7,8,9 — OFF only for 1,2,3.",
      },
      {
        out: "g",
        eq: "g = A + BC' + BC + C'D",
        explanation:
          "Segment g (middle bar) is OFF only for 0 and 1. ON for all other digits (2–9).",
      },
    ],
    truthRows: [
      ["0", "0", "0", "0", "1", "1", "1", "1", "1", "1", "0"],
      ["0", "0", "0", "1", "0", "1", "1", "0", "0", "0", "0"],
      ["0", "0", "1", "0", "1", "1", "0", "1", "1", "0", "1"],
      ["0", "0", "1", "1", "1", "1", "1", "1", "0", "0", "1"],
      ["0", "1", "0", "0", "0", "1", "1", "0", "0", "1", "1"],
      ["0", "1", "0", "1", "1", "0", "1", "1", "0", "1", "1"],
      ["0", "1", "1", "0", "1", "0", "1", "1", "1", "1", "1"],
      ["0", "1", "1", "1", "1", "1", "1", "0", "0", "0", "0"],
      ["1", "0", "0", "0", "1", "1", "1", "1", "1", "1", "1"],
      ["1", "0", "0", "1", "1", "1", "1", "1", "0", "1", "1"],
    ],
    truthHeaders: ["A", "B", "C", "D", "a", "b", "c", "d", "e", "f", "g"],
  },
};

// ─── 7-Segment SVG ──────────────────────────────────────────────────────────
const SevenSegDisplay = ({ segs }) => {
  const on = "#00ff88",
    off = "rgba(0,255,136,0.07)";
  const s = (n) => (segs[n] ? on : off);
  return (
    <svg
      viewBox="0 0 60 100"
      width="90"
      height="150"
      style={{ filter: "drop-shadow(0 0 8px rgba(0,255,136,0.5))" }}
    >
      <rect x="8" y="4" width="44" height="8" rx="3" fill={s("a")} />
      <rect x="50" y="8" width="8" height="40" rx="3" fill={s("b")} />
      <rect x="50" y="52" width="8" height="40" rx="3" fill={s("c")} />
      <rect x="8" y="88" width="44" height="8" rx="3" fill={s("d")} />
      <rect x="2" y="52" width="8" height="40" rx="3" fill={s("e")} />
      <rect x="2" y="8" width="8" height="40" rx="3" fill={s("f")} />
      <rect x="8" y="46" width="44" height="8" rx="3" fill={s("g")} />
      <text
        x="30"
        y="108"
        textAnchor="middle"
        fill="#4b5563"
        fontSize="8"
        fontFamily="monospace"
      >
        {["a", "b", "c", "d", "e", "f", "g"].filter((k) => segs[k]).join("") ||
          "—"}
      </text>
    </svg>
  );
};

// ─── Live 2-to-4 SVG Circuit ─────────────────────────────────────────────────
const Decoder2to4SVG = ({ A1, A0, E, activeOut }) => {
  const w = (v) => (v ? "#00ff88" : "#1e3a2f");
  const glow = (v) => (v ? { filter: "drop-shadow(0 0 3px #00ff88)" } : {});
  const nA1 = E && !A1 ? 1 : 0,
    nA0 = E && !A0 ? 1 : 0;
  const dActive = (i) => (E && activeOut === i ? 1 : 0);

  // AND gate path helper
  const AndGate = ({ cx, cy, active }) => (
    <g style={glow(active)}>
      <path
        d={`M${cx - 18} ${cy - 16} L${cx} ${cy - 16} Q${cx + 18} ${cy - 16} ${cx + 18} ${cy} Q${cx + 18} ${cy + 16} ${cx} ${cy + 16} L${cx - 18} ${cy + 16} Z`}
        fill="rgba(20,30,50,0.95)"
        stroke={w(active)}
        strokeWidth={active ? 2 : 1.5}
      />
      <text
        x={cx}
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
        d={`M${cx - 14} ${cy - 10} L${cx - 14} ${cy + 10} L${cx + 8} ${cy} Z`}
        fill="rgba(20,30,50,0.9)"
        stroke={w(active)}
        strokeWidth="1.5"
      />
      <circle
        cx={cx + 11}
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
      viewBox="0 0 580 280"
      width="100%"
      style={{
        maxWidth: "580px",
        fontFamily: "monospace",
        fontSize: "11px",
        display: "block",
      }}
    >
      <rect
        width="580"
        height="280"
        rx="10"
        fill="rgba(8,12,22,0.97)"
        stroke="rgba(99,102,241,0.25)"
        strokeWidth="1.5"
      />

      {/* Input circles */}
      {[
        ["E", 40, 50, E, "#fbbf24"],
        ["A1", 40, 110, A1, "#00d4ff"],
        ["A0", 40, 170, A0, "#00d4ff"],
      ].map(([l, x, y, v, c]) => (
        <g key={l}>
          <circle
            cx={x}
            cy={y}
            r="16"
            fill={v ? `${c}22` : "rgba(30,40,60,0.8)"}
            stroke={v ? c : "#334155"}
            strokeWidth="1.5"
            style={glow(v)}
          />
          <text
            x={x}
            y={y + 4}
            textAnchor="middle"
            fill={v ? c : "#6b7280"}
            fontSize="11"
            fontWeight="bold"
          >
            {l}
          </text>
        </g>
      ))}

      {/* NOT gates */}
      <NotGate cx={128} cy={110} active={nA1} />
      <NotGate cx={128} cy={170} active={nA0} />

      {/* Wire: inputs → NOT gates */}
      <line x1="56" y1="110" x2="114" y2="110" stroke={w(A1)} strokeWidth="2" />
      <line x1="56" y1="170" x2="114" y2="170" stroke={w(A0)} strokeWidth="2" />

      {/* Distribution nodes on A1, A0 lines */}
      <circle cx="75" cy="110" r="3" fill={w(A1)} />
      <circle cx="75" cy="170" r="3" fill={w(A0)} />

      {/* AND gates at x=230, y=50,110,170,230 */}
      {[0, 1, 2, 3].map((i) => (
        <AndGate key={i} cx={240} cy={50 + i * 65} active={dActive(i)} />
      ))}

      {/* Output labels */}
      {["D0", "D1", "D2", "D3"].map((lbl, i) => {
        const cy = 50 + i * 65,
          act = dActive(i);
        return (
          <g key={lbl} style={glow(act)}>
            <rect
              x="275"
              y={cy - 14}
              width="52"
              height="28"
              rx="6"
              fill={act ? "rgba(0,255,136,0.15)" : "rgba(15,25,45,0.8)"}
              stroke={w(act)}
              strokeWidth={act ? 2 : 1}
            />
            <text
              x="301"
              y={cy + 4}
              textAnchor="middle"
              fill={act ? "#00ff88" : "#6b7280"}
              fontSize="11"
              fontWeight={act ? "bold" : "normal"}
            >
              {lbl}
            </text>
            <line
              x1="258"
              y1={cy}
              x2="275"
              y2={cy}
              stroke={w(act)}
              strokeWidth={act ? 2.5 : 1.5}
            />
            <text
              x="335"
              y={cy + 4}
              fill={act ? "#fbbf24" : "#374151"}
              fontSize="9"
            >
              =m{i}
            </text>
          </g>
        );
      })}

      {/* ── Wire routing ── */}
      {/* E → all AND gates (vertical bus at x=55) */}
      <line x1="55" y1="50" x2="55" y2="245" stroke={w(E)} strokeWidth="1.5" />
      {[0, 1, 2, 3].map((i) => {
        const cy = 50 + i * 65;
        return (
          <line
            key={i}
            x1="55"
            y1={cy}
            x2="222"
            y2={cy - 12}
            stroke={w(E)}
            strokeWidth="1.5"
          />
        );
      })}
      {/* D0: A1'·A0' */}
      <line
        x1="139"
        y1="110"
        x2="155"
        y2="110"
        stroke={w(nA1)}
        strokeWidth="1.5"
      />
      <line
        x1="155"
        y1="110"
        x2="155"
        y2="42"
        stroke={w(nA1)}
        strokeWidth="1.5"
      />
      <line
        x1="155"
        y1="42"
        x2="222"
        y2="42"
        stroke={w(nA1 ? nA0 : 0)}
        strokeWidth="1.5"
      />
      <line
        x1="139"
        y1="170"
        x2="160"
        y2="170"
        stroke={w(nA0)}
        strokeWidth="1.5"
      />
      <line
        x1="160"
        y1="170"
        x2="160"
        y2="56"
        stroke={w(nA0)}
        strokeWidth="1.5"
      />
      <line
        x1="160"
        y1="56"
        x2="222"
        y2="52"
        stroke={w(nA0)}
        strokeWidth="1.5"
      />
      {/* D1: A1'·A0 */}
      <line
        x1="150"
        y1="110"
        x2="150"
        y2="105"
        stroke={w(nA1)}
        strokeWidth="1.5"
      />
      <line
        x1="150"
        y1="105"
        x2="222"
        y2="105"
        stroke={w(nA1)}
        strokeWidth="1.5"
      />
      <line
        x1="75"
        y1="170"
        x2="75"
        y2="117"
        stroke={w(A0)}
        strokeWidth="1.5"
      />
      <line
        x1="75"
        y1="117"
        x2="222"
        y2="117"
        stroke={w(A0)}
        strokeWidth="1.5"
      />
      {/* D2: A1·A0' */}
      <line
        x1="75"
        y1="110"
        x2="75"
        y2="167"
        stroke={w(A1)}
        strokeWidth="1.5"
      />
      <line
        x1="75"
        y1="167"
        x2="222"
        y2="167"
        stroke={w(A1)}
        strokeWidth="1.5"
      />
      <line
        x1="158"
        y1="170"
        x2="158"
        y2="178"
        stroke={w(nA0)}
        strokeWidth="1.5"
      />
      <line
        x1="158"
        y1="178"
        x2="222"
        y2="178"
        stroke={w(nA0)}
        strokeWidth="1.5"
      />
      {/* D3: A1·A0 */}
      <line
        x1="72"
        y1="110"
        x2="72"
        y2="230"
        stroke={w(A1)}
        strokeWidth="1.5"
      />
      <line
        x1="72"
        y1="230"
        x2="222"
        y2="230"
        stroke={w(A1)}
        strokeWidth="1.5"
      />
      <line
        x1="70"
        y1="170"
        x2="70"
        y2="242"
        stroke={w(A0)}
        strokeWidth="1.5"
      />
      <line
        x1="70"
        y1="242"
        x2="222"
        y2="242"
        stroke={w(A0)}
        strokeWidth="1.5"
      />

      <text x="290" y="268" textAnchor="middle" fill="#374151" fontSize="9">
        2-to-4 Decoder — Live Gate-Level Circuit
      </text>
    </svg>
  );
};

// ─── 3-to-8 Block Diagram SVG ─────────────────────────────────────────────────
const Decoder3to8SVG = ({ A2, A1, A0, E, activeOut }) => {
  const glow = (v) => (v ? { filter: "drop-shadow(0 0 4px #00ff88)" } : {});

  return (
    <svg
      viewBox="0 0 560 360"
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
        height="360"
        rx="10"
        fill="rgba(8,12,22,0.97)"
        stroke="rgba(99,102,241,0.25)"
        strokeWidth="1.5"
      />

      {/* Decoder box */}
      <rect
        x="170"
        y="28"
        width="150"
        height="300"
        rx="8"
        fill="rgba(15,22,40,0.95)"
        stroke="rgba(99,102,241,0.5)"
        strokeWidth="2"
      />
      <text
        x="245"
        y="50"
        textAnchor="middle"
        fill="#60a5fa"
        fontSize="13"
        fontWeight="bold"
      >
        3-to-8
      </text>
      <text x="245" y="65" textAnchor="middle" fill="#60a5fa" fontSize="11">
        DECODER
      </text>
      <line
        x1="170"
        y1="74"
        x2="320"
        y2="74"
        stroke="rgba(99,102,241,0.3)"
        strokeWidth="1"
      />

      {/* Input buses */}
      {[
        ["E", 40, 95, E, "#fbbf24"],
        ["A2", 40, 145, A2, "#00d4ff"],
        ["A1", 40, 195, A1, "#00d4ff"],
        ["A0", 40, 245, A0, "#00d4ff"],
      ].map(([lbl, x, y, v, c]) => (
        <g key={lbl}>
          <circle
            cx={x}
            cy={y}
            r="16"
            fill={v ? `${c}20` : "rgba(20,30,50,0.8)"}
            stroke={v ? c : "#334155"}
            strokeWidth="1.5"
            style={{ filter: v ? `drop-shadow(0 0 4px ${c})` : "none" }}
          />
          <text
            x={x}
            y={y + 4}
            textAnchor="middle"
            fill={v ? c : "#6b7280"}
            fontWeight="bold"
            fontSize="11"
          >
            {lbl}
          </text>
          <line
            x1={x + 16}
            y1={y}
            x2="170"
            y2={y}
            stroke={v ? c : "#1e3a5f"}
            strokeWidth="2"
          />
          <text
            x="110"
            y={y - 5}
            textAnchor="middle"
            fill="#374151"
            fontSize="8"
          >
            {lbl}
          </text>
        </g>
      ))}

      {/* Output lines */}
      {Array.from({ length: 8 }, (_, i) => {
        const cy = 90 + i * 30;
        const act = E && activeOut === i;
        const binStr = i.toString(2).padStart(3, "0");
        return (
          <g key={i}>
            <text
              x="245"
              y={cy + 4}
              textAnchor="middle"
              fill={act ? "#00ff88" : "#374151"}
              fontSize="9"
              fontWeight={act ? "bold" : "normal"}
            >
              m{i}
            </text>
            <line
              x1="320"
              y1={cy}
              x2="390"
              y2={cy}
              stroke={act ? "#00ff88" : "#1a2840"}
              strokeWidth={act ? 3 : 1.5}
              style={glow(act)}
            />
            <rect
              x="390"
              y={cy - 13}
              width="54"
              height="26"
              rx="6"
              fill={act ? "rgba(0,255,136,0.2)" : "rgba(10,16,30,0.9)"}
              stroke={act ? "#00ff88" : "#1e3a5f"}
              strokeWidth={act ? 2 : 1}
            />
            <text
              x="417"
              y={cy + 4}
              textAnchor="middle"
              fill={act ? "#00ff88" : "#4b5563"}
              fontSize="11"
              fontWeight={act ? "bold" : "normal"}
            >
              D{i}
            </text>
            <text
              x="452"
              y={cy + 4}
              fill={act ? "#fbbf24" : "#2d3748"}
              fontSize="8"
            >
              ={binStr}
            </text>
            {act && (
              <circle
                cx="325"
                cy={cy}
                r="5"
                fill="#00ff88"
                style={{ filter: "drop-shadow(0 0 5px #00ff88)" }}
              />
            )}
          </g>
        );
      })}

      {/* Status bar */}
      <rect
        x="8"
        y="338"
        width="544"
        height="16"
        rx="4"
        fill="rgba(15,22,40,0.6)"
      />
      <text
        x="280"
        y="350"
        textAnchor="middle"
        fill={E ? "#9ca3af" : "#6b7280"}
        fontSize="9"
      >
        {E
          ? `Active: D${activeOut} | Code: ${[A2, A1, A0].join("")}₂ = ${activeOut}₁₀ | Minterm: ${["A2", "A1", "A0"].map((v, i) => ([A2, A1, A0][i] ? v : v + "'")).join("·")}`
          : "⚠ DISABLED — E=0, all outputs LOW"}
      </text>
    </svg>
  );
};

// ─── Quiz Component ───────────────────────────────────────────────────────────
const QUIZ = [
  {
    q: "2-to-4 decoder: A1=1, A0=0, E=1. Which output is HIGH?",
    opts: ["D0", "D1", "D2", "D3"],
    ans: 2,
    exp: "Binary 10 = decimal 2 → D2 HIGH. MSB = A1, LSB = A0. Always convert binary to decimal!",
  },
  {
    q: "3-to-8 decoder. Boolean equation for D5?",
    opts: ["E·A2'·A1·A0", "E·A2·A1'·A0", "E·A2·A1·A0'", "E·A2'·A1·A0'"],
    ans: 1,
    exp: "5 = 101₂ → A2=1(direct)·A1=0(complement→A1')·A0=1(direct). Match bits!",
  },
  {
    q: "How many AND gates in a 3-to-8 decoder?",
    opts: ["3", "6", "8", "16"],
    ans: 2,
    exp: "2³=8 outputs → 8 AND gates. One AND gate per decoder output. Always 2ⁿ.",
  },
  {
    q: "Enable E=0. What happens to ALL outputs?",
    opts: [
      "All go HIGH",
      "Selected output HIGH",
      "All go LOW",
      "Output is undefined",
    ],
    ans: 2,
    exp: "E=0 disables the entire chip. All outputs go LOW regardless of address inputs. E acts as a master chip-select.",
  },
  {
    q: "You want to implement F = A'B' + A'B + AB (any function of A,B). You use:",
    opts: [
      "Only AND gates",
      "A 2-to-4 decoder + OR gate",
      "Only NOT gates",
      "A multiplexer",
    ],
    ans: 1,
    exp: "Decoder outputs ARE minterms. Just OR the outputs for rows where F=1. No AND gates needed at all!",
  },
  {
    q: "BCD 1001 input to 7-seg decoder. Which segment is OFF?",
    opts: ["a (top)", "b (top-right)", "e (bottom-left)", "g (middle)"],
    ans: 2,
    exp: "Digit 9 has a,b,c,d,f,g ON. Segment e (bottom-left) is OFF. Check the truth table for digit 9 row!",
  },
];
const QuizBlock = () => {
  const [qi, setQi] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = QUIZ[qi];
  const choose = (i) => {
    if (sel !== null) return;
    setSel(i);
    if (i === q.ans) setScore((s) => s + 1);
  };
  const next = () => {
    if (qi + 1 >= QUIZ.length) {
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
        <h3 style={{ color: "#00ff88", marginBottom: "8px" }}>
          Quiz Complete!
        </h3>
        <p style={{ color: "#9ca3af", marginBottom: "4px" }}>
          Score:{" "}
          <strong style={{ color: "#fbbf24" }}>
            {score}/{QUIZ.length}
          </strong>
        </p>
        <p style={{ color: "#9ca3af", marginBottom: "20px" }}>
          {score >= 5
            ? "Outstanding mastery!"
            : score >= 3
              ? "Good — review missed ones."
              : "Keep at it — the pattern-trick will click!"}
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
          Question {qi + 1}/{QUIZ.length}
        </span>
        <span style={{ color: "#fbbf24", fontSize: "0.85rem" }}>
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
          {qi + 1 < QUIZ.length ? "Next →" : "See Results"}
        </button>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const DecoderPage = () => {
  const [selectedType, setSelectedType] = useState("2to4");
  const [codeVals, setCodeVals] = useState([0, 0, 0, 0]);
  const [enable, setEnable] = useState(1);
  const [openCircuit, setOpenCircuit] = useState(null);
  const [expandedEq, setExpandedEq] = useState(null);
  const [highlightRow, setHighlightRow] = useState(null);
  const [bcdAuto, setBcdAuto] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [bcdStep, setBcdStep] = useState(0);

  const config = DECODER_TYPES[selectedType];
  const toggleBit = (idx) => {
    const n = [...codeVals];
    n[idx] = n[idx] ? 0 : 1;
    setCodeVals(n);
  };
  const resetInputs = () => {
    setCodeVals([0, 0, 0, 0]);
    setEnable(1);
  };

  const activeCode = codeVals.slice(0, config.codeInputs.length);
  const result = useMemo(
    () =>
      selectedType === "BCD7seg"
        ? config.decode(activeCode)
        : config.decode(activeCode, enable),
    [config, activeCode, enable, selectedType],
  );
  const outputEntries = config.outputs.map((name) => ({
    name,
    val: result[name] ?? 0,
  }));
  const codeDecimal = activeCode.reduce(
    (a, b, i) => a | (b << (activeCode.length - 1 - i)),
    0,
  );

  React.useEffect(() => {
    if (!bcdAuto || selectedType !== "BCD7seg") return;
    const t = setInterval(() => {
      setBcdStep((s) => {
        const next = (s + 1) % 10;
        setCodeVals([3, 2, 1, 0].map((b) => (next >> b) & 1));
        return next;
      });
    }, 900);
    return () => clearInterval(t);
  }, [bcdAuto, selectedType]);

  // 2x4 live circuit state
  const liveA1 = codeVals[0],
    liveA0 = codeVals[1];
  const live2to4Active = enable ? (liveA1 << 1) | liveA0 : -1;
  const live3to8Active = enable
    ? (codeVals[0] << 2) | (codeVals[1] << 1) | codeVals[2]
    : -1;

  const circuitConfigs = {
    "2to4": {
      expression: "F = A'B'",
      variables: ["A", "B"],
      label: "2-to-4 Decoder (D0 minterm)",
    },
    "3to8": {
      expression: "F = A'B'C'",
      variables: ["A", "B", "C"],
      label: "3-to-8 Decoder (D0 minterm)",
    },
  };

  return (
    <ToolLayout
      title="Decoders"
      subtitle="Convert binary codes into exactly one activated output line"
    >
      {/* ═══════════════════ SECTION 1: CONCEPT ═══════════════════ */}
      <ExplanationBlock title="What is a Decoder?">
        <p className="explanation-intro">
          A <strong>decoder</strong> is a combinational logic circuit that
          converts an n-bit binary input code into exactly <em>one</em> of 2ⁿ
          output lines. Think of it as a <strong>postal sorting machine</strong>
          : the ZIP code (binary input) routes the letter (HIGH signal) to
          exactly one mailbox (one output line) while all others stay LOW.
        </p>
        <div className="info-card">
          <h4>The Three Golden Rules of Every Decoder</h4>
          <ul>
            <li>
              📌 <strong>One-Hot Output:</strong> Exactly ONE output is HIGH at
              a time (when enabled)
            </li>
            <li>
              🔑 <strong>Enable Pin (E):</strong> When E=0, ALL outputs go LOW —
              acts as a chip-select / master OFF switch
            </li>
            <li>
              🧮 <strong>Minterm Generator:</strong> Output Dᵢ equals minterm mᵢ
              of the input variables
            </li>
          </ul>
        </div>
        <div className="example-box">
          <h4>
            🎯 The Pattern-Matching Trick — Write Any Decoder Equation Instantly
          </h4>
          <p>
            For output Dᵢ, convert <strong>i to binary</strong>, then read each
            bit position:
          </p>
          <ul>
            <li>
              Bit = <strong>1</strong> → use the variable{" "}
              <strong>directly (no complement)</strong>
            </li>
            <li>
              Bit = <strong>0</strong> → use the variable{" "}
              <strong>complemented (add ')</strong>
            </li>
            <li>AND everything together with Enable E</li>
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
              Example — D5 in a 3-to-8 decoder:
            </strong>
            <br />5 in binary = <strong>101</strong>
            <br />
            A2=<strong style={{ color: "#00ff88" }}>1</strong> → A2 (direct)
            &nbsp;&nbsp; A1=<strong style={{ color: "#ef4444" }}>0</strong> →
            A1' (complement) &nbsp;&nbsp; A0=
            <strong style={{ color: "#00ff88" }}>1</strong> → A0 (direct)
            <br />
            <strong style={{ color: "#00ff88" }}>
              ∴ D5 = E · A2 · A1' · A0 ✅
            </strong>
          </p>
        </div>
        <div className="key-insight">
          <h4>🧠 Why Decoders Are Power Tools for Logic Design</h4>
          <p>
            Since D0=m0, D1=m1, …, D7=m7 — every output IS already a minterm.
            This means <strong>any Boolean function</strong> of n variables can
            be implemented by connecting a single n-to-2ⁿ decoder plus one OR
            gate per output function. No AND gates required. A 3-to-8 decoder +
            OR gates = <em>universal function generator for 3 variables</em>.
          </p>
        </div>
      </ExplanationBlock>

      {/* ═══════════════════ SECTION 2: INTERNAL CIRCUIT + LIVE SVG ═══════════════════ */}
      <ExplanationBlock title="How the Circuit Works — The Trick to Learn It Forever">
        <p className="explanation-intro">
          Every binary decoder is built from just{" "}
          <strong>two layers of logic</strong>. Once you understand these two
          layers, you can draw any decoder from memory.
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
              icon: "🔀",
              title: "NOT Layer",
              color: "#60a5fa",
              text: "Each input variable A, B, C… passes through a NOT gate. This gives both A and A' for every input. n inputs → 2n signals total available.",
            },
            {
              n: "2",
              icon: "🔧",
              title: "AND Layer",
              color: "#fbbf24",
              text: "One AND gate per output. Each AND gate picks the true OR complemented form of every variable based on the address bit pattern. Plus Enable.",
            },
            {
              n: "3",
              icon: "💡",
              title: "One-Hot Output",
              color: "#00ff88",
              text: "Since every AND gate has a unique bit-pattern, only one can fire at a time. The active one is guaranteed unique — that's the one-hot property.",
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

        {/* ── LIVE 2-to-4 Circuit ── */}
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
              🔬 2-to-4 Decoder — Live Gate-Level Circuit
            </h4>
            <span style={{ color: "#6b7280", fontSize: "0.8rem" }}>
              Toggle inputs to see signal flow
            </span>
          </div>
          <p
            style={{
              color: "#6b7280",
              fontSize: "0.82rem",
              marginBottom: "14px",
            }}
          >
            🟢 Green wire = HIGH (1) &nbsp;|&nbsp; 🔵 Dark wire = LOW (0)
            &nbsp;|&nbsp; Green AND gate = active output
          </p>
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "16px",
              flexWrap: "wrap",
            }}
          >
            {[
              ["E", enable, "#fbbf24", () => setEnable((e) => (e ? 0 : 1))],
              ["A1", codeVals[0], "#00d4ff", () => toggleBit(0)],
              ["A0", codeVals[1], "#00d4ff", () => toggleBit(1)],
            ].map(([lbl, v, c, fn]) => (
              <button
                key={lbl}
                onClick={fn}
                style={{
                  padding: "7px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontFamily: "monospace",
                  fontWeight: "700",
                  fontSize: "0.9rem",
                  border: `2px solid ${v ? c : "rgba(148,163,184,0.25)"}`,
                  background: v ? `${c}20` : "rgba(20,30,50,0.6)",
                  color: v ? c : "#6b7280",
                  transition: "all 0.2s",
                }}
              >
                {lbl}={v}
              </button>
            ))}
            <button
              onClick={() => {
                setCodeVals([0, 0, 0, 0]);
                setEnable(1);
              }}
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
            <Decoder2to4SVG
              A1={liveA1}
              A0={liveA0}
              E={enable}
              activeOut={live2to4Active}
            />
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
            <span style={{ color: "#9ca3af" }}>
              State: E={enable}, A1={liveA1}, A0={liveA0} →{" "}
            </span>
            <span
              style={{
                color: enable ? "#00ff88" : "#ef4444",
                fontWeight: "600",
              }}
            >
              {enable
                ? `D${live2to4Active} HIGH (address ${live2to4Active})  m${live2to4Active}=${[liveA1, liveA0].map((b, i) => (b ? ["A1", "A0"][i] : ["A1", "A0"][i] + "'")).join("·")}`
                : "ALL OUTPUTS LOW (E disabled)"}
            </span>
          </div>
        </div>

        {/* ── LIVE 3-to-8 Block ── */}
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
              🔬 3-to-8 Decoder — Block-Level Diagram
            </h4>
            <span style={{ color: "#6b7280", fontSize: "0.8rem" }}>
              8 internal AND gates shown as minterm labels
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
            {[
              ["E", enable, "#fbbf24", () => setEnable((e) => (e ? 0 : 1))],
              ["A2", codeVals[0], "#00d4ff", () => toggleBit(0)],
              ["A1", codeVals[1], "#00d4ff", () => toggleBit(1)],
              ["A0", codeVals[2], "#00d4ff", () => toggleBit(2)],
            ].map(([lbl, v, c, fn]) => (
              <button
                key={lbl}
                onClick={fn}
                style={{
                  padding: "7px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontFamily: "monospace",
                  fontWeight: "700",
                  fontSize: "0.9rem",
                  border: `2px solid ${v ? c : "rgba(148,163,184,0.25)"}`,
                  background: v ? `${c}20` : "rgba(20,30,50,0.6)",
                  color: v ? c : "#6b7280",
                  transition: "all 0.2s",
                }}
              >
                {lbl}={v}
              </button>
            ))}
            <button
              onClick={() => {
                setCodeVals([0, 0, 0, 0]);
                setEnable(1);
              }}
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
            <Decoder3to8SVG
              A2={codeVals[0]}
              A1={codeVals[1]}
              A0={codeVals[2]}
              E={enable}
              activeOut={live3to8Active}
            />
          </div>
        </div>

        {/* Cascading trick */}
        <div className="example-box" style={{ marginTop: "20px" }}>
          <h4>
            🔗 The Cascading Trick — Build a 3-to-8 from Two 2-to-4 Decoders
          </h4>
          <p>
            You don't need to buy an 8-output chip! Combine two 4-output chips:
          </p>
          <ul>
            <li>
              <strong>A2 (MSB)</strong> → Enable of Decoder #2 (active-high).
              Through a NOT gate → Enable of Decoder #1
            </li>
            <li>
              <strong>A2=0:</strong> Decoder #1 enabled → handles D0–D3 using
              A1, A0
            </li>
            <li>
              <strong>A2=1:</strong> Decoder #2 enabled → handles D4–D7 using
              A1, A0
            </li>
            <li>
              Scalable: four 2-to-4 can make one 4-to-16 using 2 MSBs as enable
              logic!
            </li>
          </ul>
        </div>
      </ExplanationBlock>

      {/* ═══════════════════ SECTION 3: FULL SIMULATOR ═══════════════════ */}
      <ExplanationBlock title="Interactive Decoder Simulator">
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          {Object.entries(DECODER_TYPES).map(([key, cfg]) => (
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
          <strong>{config.label}</strong> — {config.description}.
          {selectedType === "BCD7seg" && (
            <button
              className="kmap-btn kmap-btn-secondary"
              style={{
                marginLeft: "10px",
                padding: "4px 12px",
                fontSize: "0.8rem",
              }}
              onClick={() => setBcdAuto((a) => !a)}
            >
              {bcdAuto ? "⏸ Stop" : "▶ Auto-cycle 0–9"}
            </button>
          )}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
          }}
        >
          <div>
            <h4 style={{ color: "#93c5fd", marginBottom: "12px" }}>
              Code Inputs
              {selectedType !== "BCD7seg" && (
                <span
                  style={{
                    color: "#9ca3af",
                    fontSize: "0.8rem",
                    marginLeft: "6px",
                  }}
                >
                  (= decimal {codeDecimal})
                </span>
              )}
            </h4>
            {config.enableInput && (
              <button
                onClick={() => setEnable((e) => (e ? 0 : 1))}
                style={{
                  marginBottom: "10px",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  width: "100%",
                  cursor: "pointer",
                  border: `2px solid ${enable ? "#fbbf24" : "rgba(148,163,184,0.3)"}`,
                  background: enable
                    ? "rgba(251,191,36,0.15)"
                    : "rgba(15,23,42,0.6)",
                  color: enable ? "#fbbf24" : "#9ca3af",
                  fontFamily: "monospace",
                  fontWeight: "600",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Enable (E) — chip select</span>
                <span
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: enable ? "#fbbf24" : "#334155",
                    boxShadow: enable ? "0 0 8px #fbbf24" : "none",
                    display: "inline-block",
                  }}
                />
              </button>
            )}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {config.codeInputs.map((label, idx) => (
                <button
                  key={label}
                  onClick={() => toggleBit(idx)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    border: `2px solid ${codeVals[idx] ? "#00d4ff" : "rgba(148,163,184,0.3)"}`,
                    background: codeVals[idx]
                      ? "rgba(0,212,255,0.15)"
                      : "rgba(15,23,42,0.6)",
                    color: codeVals[idx] ? "#00d4ff" : "#9ca3af",
                    fontFamily: "monospace",
                    fontWeight: "600",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>
                    {label} &nbsp;
                    <span style={{ color: "#4b5563", fontSize: "0.8rem" }}>
                      2<sup>{config.codeInputs.length - 1 - idx}</sup> place
                    </span>
                  </span>
                  <span
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      background: codeVals[idx] ? "#00d4ff" : "#334155",
                      boxShadow: codeVals[idx] ? "0 0 8px #00d4ff" : "none",
                      display: "inline-block",
                    }}
                  />
                </button>
              ))}
            </div>
            <button
              className="kmap-btn kmap-btn-secondary"
              style={{ marginTop: "12px", width: "100%" }}
              onClick={resetInputs}
            >
              ↺ Reset All
            </button>
            <div
              style={{
                marginTop: "12px",
                padding: "12px",
                borderRadius: "8px",
                background: "rgba(0,212,255,0.05)",
                border: "1px solid rgba(0,212,255,0.2)",
                fontFamily: "monospace",
              }}
            >
              <p style={{ color: "#00d4ff", margin: 0, fontWeight: "600" }}>
                Code: <strong>{activeCode.join("")}</strong>₂
                {selectedType !== "BCD7seg" && (
                  <span style={{ color: "#9ca3af" }}> = {codeDecimal}₁₀</span>
                )}
              </p>
              {config.enableInput && (
                <p
                  style={{
                    color: enable ? "#fbbf24" : "#6b7280",
                    margin: "4px 0 0",
                    fontSize: "0.85rem",
                  }}
                >
                  Enable: {enable ? "✅ ON" : "❌ OFF — all outputs LOW"}
                </p>
              )}
            </div>
          </div>
          <div>
            <h4 style={{ color: "#fbbf24", marginBottom: "12px" }}>
              {selectedType === "BCD7seg"
                ? "Segment Outputs"
                : "Decoded Outputs"}
            </h4>
            {selectedType === "BCD7seg" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  marginBottom: "16px",
                  padding: "12px",
                  background: "rgba(10,16,30,0.6)",
                  borderRadius: "10px",
                  border: "1px solid rgba(0,255,136,0.15)",
                }}
              >
                <SevenSegDisplay segs={result} />
                <div>
                  {result.active >= 0 ? (
                    <>
                      <p
                        style={{
                          color: "#00ff88",
                          fontWeight: "700",
                          fontSize: "1.6rem",
                          margin: 0,
                          fontFamily: "monospace",
                          textShadow: "0 0 20px #00ff88",
                        }}
                      >
                        "{result.active}"
                      </p>
                      <p
                        style={{
                          color: "#9ca3af",
                          margin: "4px 0 0",
                          fontSize: "0.85rem",
                        }}
                      >
                        BCD: {activeCode.join("")}₂
                      </p>
                      <p
                        style={{
                          color: "#6b7280",
                          margin: "4px 0 0",
                          fontSize: "0.8rem",
                        }}
                      >
                        ON segments:{" "}
                        {["a", "b", "c", "d", "e", "f", "g"]
                          .filter((k) => result[k])
                          .join(" ") || "none"}
                      </p>
                    </>
                  ) : (
                    <p
                      style={{ color: "#ef4444", fontWeight: "600", margin: 0 }}
                    >
                      Invalid BCD (≥10)
                    </p>
                  )}
                </div>
              </div>
            )}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "5px" }}
            >
              {outputEntries.map(({ name, val }) => (
                <div
                  key={name}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "7px",
                    transition: "all 0.2s",
                    border: `2px solid ${val ? "#00ff88" : "rgba(148,163,184,0.12)"}`,
                    background: val
                      ? "rgba(0,255,136,0.09)"
                      : "rgba(10,16,30,0.5)",
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
                      fontSize: "0.9rem",
                    }}
                  >
                    {name}
                  </span>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "1.2rem",
                      fontWeight: "700",
                      color: val ? "#00ff88" : "#374151",
                      textShadow: val ? "0 0 10px #00ff88" : "none",
                    }}
                  >
                    {val}
                  </span>
                </div>
              ))}
            </div>
            {selectedType !== "BCD7seg" && result.active >= 0 && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "12px",
                  borderRadius: "8px",
                  background: "rgba(0,255,136,0.06)",
                  border: "1px solid rgba(0,255,136,0.3)",
                }}
              >
                <p style={{ color: "#00ff88", fontWeight: "600", margin: 0 }}>
                  ✅ D{result.active} = HIGH
                </p>
                <p
                  style={{
                    color: "#9ca3af",
                    margin: "4px 0 0",
                    fontFamily: "monospace",
                    fontSize: "0.82rem",
                  }}
                >
                  m{result.active} ={" "}
                  {activeCode
                    .map((b, i) =>
                      b ? config.codeInputs[i] : config.codeInputs[i] + "'",
                    )
                    .join("·")}
                </p>
              </div>
            )}
          </div>
        </div>
      </ExplanationBlock>

      {/* ═══════════════════ SECTION 4: BOOLEAN EQS (expandable) ═══════════════════ */}
      <ExplanationBlock title={`Boolean Equations — ${config.label}`}>
        <p className="explanation-intro">
          Click any equation to reveal <strong>why</strong> it is written that
          way using the bit-pattern trick.
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
                      ? "rgba(99,102,241,0.16)"
                      : "rgba(99,102,241,0.05)",
                  border: `1px solid ${expandedEq === i ? "rgba(99,102,241,0.55)" : "rgba(99,102,241,0.22)"}`,
                  borderRadius: expandedEq === i ? "8px 8px 0 0" : "8px",
                  fontFamily: "monospace",
                  fontSize: "0.93rem",
                  color: "#c4b5fd",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  <strong style={{ color: "#a5b4fc" }}>{out}:</strong> {eq}
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
                    background: "rgba(99,102,241,0.04)",
                    border: "1px solid rgba(99,102,241,0.15)",
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
      </ExplanationBlock>

      {/* ═══════════════════ SECTION 5: TRUTH TABLE ═══════════════════ */}
      <ExplanationBlock title={`Truth Table — ${config.label}`}>
        <p className="explanation-intro" style={{ marginBottom: "10px" }}>
          Hover any row to highlight. The currently decoded row lights up
          automatically.
        </p>
        <div className="binary-table-container">
          <table className="binary-table">
            <thead className="binary-table-header">
              <tr>
                {config.truthHeaders.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {config.truthRows.map((row, ri) => {
                const isActive =
                  selectedType !== "BCD7seg"
                    ? enable && result.active === ri
                    : result.active === ri;
                return (
                  <tr
                    key={ri}
                    className="binary-table-row"
                    onMouseEnter={() => setHighlightRow(ri)}
                    onMouseLeave={() => setHighlightRow(null)}
                    style={{
                      background: isActive
                        ? "rgba(0,255,136,0.07)"
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
                        style={{ fontWeight: isActive ? "700" : "normal" }}
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

      {/* ═══════════════════ SECTION 6: IMPLEMENTING FUNCTIONS ═══════════════════ */}
      <ExplanationBlock title="Implementing Boolean Functions with a Decoder">
        <p className="explanation-intro">
          Since every decoder output IS a minterm, OR the right outputs together
          to get any function.
        </p>
        <div className="example-box">
          <h4>
            Full Adder — 1 decoder + 2 OR gates (all logic functions at once!)
          </h4>
          <p>Inputs: A, B, Cin using a 3-to-8 decoder:</p>
          <ul>
            <li>
              <strong>Sum S</strong> = Σm(1,2,4,7) → D1 + D2 + D4 + D7
            </li>
            <li>
              <strong>Carry Cout</strong> = Σm(3,5,6,7) → D3 + D5 + D6 + D7
            </li>
            <li>
              Both functions simultaneously from one chip — ultra efficient!
            </li>
          </ul>
        </div>
        <div className="example-box">
          <h4>Common 2-variable functions from a 2-to-4 decoder</h4>
          <ul>
            <li>
              <strong>AND(A,B):</strong> F = D3
            </li>
            <li>
              <strong>OR(A,B):</strong> F = D1 + D2 + D3
            </li>
            <li>
              <strong>XOR(A,B):</strong> F = D1 + D2
            </li>
            <li>
              <strong>XNOR(A,B):</strong> F = D0 + D3
            </li>
            <li>
              <strong>NAND(A,B):</strong> F = D0 + D1 + D2
            </li>
          </ul>
        </div>
        <div className="key-insight">
          <h4>🧠 The Design Rule</h4>
          <p>
            Pick decoder size n = number of input variables. List minterms where
            F=1. OR those decoder outputs. Done — any function with minimal
            gates.
          </p>
        </div>
      </ExplanationBlock>

      {/* ═══════════════════ SECTION 7: QUIZ ═══════════════════ */}
      <ExplanationBlock title="🧪 Knowledge Check — Test Yourself">
        <p className="explanation-intro" style={{ marginBottom: "20px" }}>
          6 questions covering all key concepts. Each answer is explained.
        </p>
        <QuizBlock />
      </ExplanationBlock>

      {/* ═══════════════════ SECTION 8: APPLICATIONS ═══════════════════ */}
      <ExplanationBlock title="Real-World Applications">
        <div className="comparison-grid">
          {[
            {
              icon: "🧠",
              title: "Memory Address Decoding",
              items: [
                "CPU n-bit address → decoder inputs",
                "Each output selects one memory chip",
                "Only that chip drives the data bus",
                "Cascading covers huge address spaces",
              ],
            },
            {
              icon: "📟",
              title: "7-Segment Display (74LS47)",
              items: [
                "BCD from counter register",
                "Decoder drives each LED segment",
                "Used in clocks, meters, scoreboards",
                "Single IC implementation",
              ],
            },
            {
              icon: "🔀",
              title: "DEMUX (Demultiplexer)",
              items: [
                "Enable pin = data input line",
                "Address selects destination output",
                "Reconstructs TDM multiplexed signals",
                "Same physical IC as decoder!",
              ],
            },
            {
              icon: "⚙️",
              title: "CPU Instruction Decoder",
              items: [
                "Opcode bits → decoder inputs",
                "Each output activates one micro-op",
                "Drives ALU, register file controls",
                "Core of hardwired control units",
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

      {/* ═══════════════════ SECTION 9: CIRCUIT BUTTONS ═══════════════════ */}
      <ExplanationBlock title="Visualize in Circuit Forge">
        <p className="explanation-intro" style={{ marginBottom: "8px" }}>
          Open the Circuit Forge with the decoder's Boolean expression
          pre-loaded. Experiment with connecting outputs to OR gates to
          implement your own functions.
        </p>
        <div className="example-box" style={{ marginBottom: "20px" }}>
          <h4>ℹ️ What the Circuit Forge shows:</h4>
          <ul>
            <li>
              <strong>2×4 Decoder button:</strong> Shows the D0 output — a
              2-input AND gate computing A'B'. This is minterm m0.
            </li>
            <li>
              <strong>3×8 Decoder button:</strong> Shows the D0 output — a
              3-input AND gate computing A'B'C'. This is minterm m0.
            </li>
            <li>
              Each decoder output Dᵢ is exactly one AND gate with the complement
              pattern for minterm mᵢ. Duplicate the pattern with different
              complements for D1, D2, etc.
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
            onClick={() => setOpenCircuit("2to4")}
          >
            🔌 Visualize 2×4 Decoder (D0 = A'B')
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
            onClick={() => setOpenCircuit("3to8")}
          >
            🔌 Visualize 3×8 Decoder (D0 = A'B'C')
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
        .example-box p {
          color: #9ca3af;
          padding-left: 18px;
          margin: 4px 0 0;
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
          line-height: 1.6;
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
export default DecoderPage;
