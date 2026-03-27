import React, { useState, useMemo } from "react";
import ToolLayout from "../components/ToolLayout";
import ExplanationBlock from "../components/ExplanationBlock";
import CircuitModal from "../components/CircuitModal";
import { Encoder4to2SVG } from "../components/Encoder4to2";
import { Encoder8to3SVG } from "../components/Encoder8to3";

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

// encode function for the 8-to-3 block diagram (always active, independent of selectedType)
const encode8to3 = ENCODER_TYPES["8to3"].encode;
const encode4to2 = ENCODER_TYPES["4to2"].encode;

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

  // ── FIX: Dedicated independent state for the Section-2 block diagrams ──────
  // These are always 8-to-3 and 4-to-2 block diagrams shown in "How it Works"
  // regardless of which encoder type is selected in the simulator below.
  const [diag4InputVals, setDiag4InputVals] = useState(Array(4).fill(0));
  const [diag8InputVals, setDiag8InputVals] = useState(Array(8).fill(0));

  const diag4Result = useMemo(
    () => encode4to2(diag4InputVals),
    [diag4InputVals],
  );
  const diag8Result = useMemo(
    () => encode8to3(diag8InputVals),
    [diag8InputVals],
  );

  const toggleDiag4Input = (idx) => {
    const n = [...diag4InputVals];
    n[idx] = n[idx] ? 0 : 1;
    setDiag4InputVals(n);
  };
  const resetDiag4Inputs = () => setDiag4InputVals(Array(4).fill(0));

  const toggleDiag8Input = (idx) => {
    const n = [...diag8InputVals];
    n[idx] = n[idx] ? 0 : 1;
    setDiag8InputVals(n);
  };
  const resetDiag8Inputs = () => setDiag8InputVals(Array(8).fill(0));
  // ─────────────────────────────────────────────────────────────────────────────

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
              Example — A0 in 8-to-3 encoder:
            </strong>
            <br />
            Indices with bit-0=1: 1(001), 3(011), 5(101), 7(111)
            <br />
            <strong style={{ color: "#00ff88" }}>
              ∴ A0 = I1 + I3 + I5 + I7 ✅
            </strong>
          </p>
        </div>
        <div className="key-insight">
          <h4>🔄 Encoder vs Decoder — Two Sides of the Same Coin</h4>
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

        {/* LIVE 4-to-2 encoder circuit — uses its own dedicated state */}
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
                onClick={() => toggleDiag4Input(i)}
                style={{
                  padding: "7px 14px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontFamily: "monospace",
                  fontWeight: "700",
                  fontSize: "0.9rem",
                  border: `2px solid ${diag4InputVals[i] ? "#00ff88" : "rgba(148,163,184,0.25)"}`,
                  background: diag4InputVals[i]
                    ? "rgba(0,255,136,0.18)"
                    : "rgba(20,30,50,0.6)",
                  color: diag4InputVals[i] ? "#00ff88" : "#6b7280",
                  transition: "all 0.2s",
                }}
              >
                {lbl}={diag4InputVals[i]}
              </button>
            ))}
            <button
              onClick={resetDiag4Inputs}
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
            <Encoder4to2SVG inputVals={diag4InputVals} result={diag4Result} />
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
            {diag4Result.active >= 0 ? (
              <>
                <span style={{ color: "#9ca3af" }}>Active: </span>
                <span style={{ color: "#00ff88", fontWeight: "600" }}>
                  I{diag4Result.active}
                </span>
                <span style={{ color: "#9ca3af" }}> → Code: </span>
                <span style={{ color: "#fbbf24", fontWeight: "600" }}>
                  A1={diag4Result.A1} A0={diag4Result.A0}
                </span>
                <span style={{ color: "#9ca3af" }}>
                  {" "}
                  ({diag4Result.active}₁₀ ={" "}
                  {diag4Result.active.toString(2).padStart(2, "0")}₂) &nbsp; V=1
                </span>
              </>
            ) : (
              <span style={{ color: "#6b7280" }}>
                No inputs active — V=0, outputs indeterminate
              </span>
            )}
          </div>
        </div>

        {/* LIVE 8-to-3 encoder block — uses its own dedicated state (FIX) */}
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
                onClick={() => toggleDiag8Input(i)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontFamily: "monospace",
                  fontWeight: "700",
                  fontSize: "0.85rem",
                  border: `2px solid ${diag8InputVals[i] ? "#00ff88" : "rgba(148,163,184,0.2)"}`,
                  background: diag8InputVals[i]
                    ? "rgba(0,255,136,0.18)"
                    : "rgba(20,30,50,0.6)",
                  color: diag8InputVals[i] ? "#00ff88" : "#6b7280",
                  transition: "all 0.2s",
                }}
              >
                {lbl}={diag8InputVals[i]}
              </button>
            ))}
            <button
              onClick={resetDiag8Inputs}
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
            {/* FIX: Always pass diag8InputVals and diag8Result — never zeroed-out defaults */}
            <Encoder8to3SVG inputVals={diag8InputVals} result={diag8Result} />
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
            {diag8Result.active >= 0 ? (
              <>
                <span style={{ color: "#9ca3af" }}>Active: </span>
                <span style={{ color: "#00ff88", fontWeight: "600" }}>
                  I{diag8Result.active}
                </span>
                <span style={{ color: "#9ca3af" }}> → Code: </span>
                <span style={{ color: "#fbbf24", fontWeight: "600" }}>
                  A2={diag8Result.A2} A1={diag8Result.A1} A0={diag8Result.A0}
                </span>
                <span style={{ color: "#9ca3af" }}>
                  {" "}
                  ({diag8Result.active}₁₀ ={" "}
                  {diag8Result.active.toString(2).padStart(3, "0")}₂) &nbsp; V=1
                </span>
              </>
            ) : (
              <span style={{ color: "#6b7280" }}>
                No inputs active — V=0, outputs indeterminate
              </span>
            )}
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
                    border: `2px solid ${val ? "#fbbf24" : "rgba(148,163,184,0.15)"}`,
                    background: val
                      ? "rgba(251,191,36,0.12)"
                      : "rgba(12,18,35,0.7)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: val ? "#fbbf24" : "#9ca3af",
                      fontFamily: "monospace",
                      fontWeight: "600",
                    }}
                  >
                    {name}
                  </span>
                  <span
                    style={{
                      color: val ? "#fbbf24" : "#4b5563",
                      fontFamily: "monospace",
                      fontWeight: "700",
                      fontSize: "1.1rem",
                    }}
                  >
                    {val}
                  </span>
                </div>
              ))}
            </div>
            {/* Truth Table */}
            <div style={{ marginTop: "20px" }}>
              <h4
                style={{
                  color: "#93c5fd",
                  marginBottom: "10px",
                  fontSize: "0.85rem",
                }}
              >
                Truth Table
              </h4>
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontFamily: "monospace",
                    fontSize: "0.8rem",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          padding: "6px 8px",
                          background: "rgba(30,40,60,0.8)",
                          color: "#60a5fa",
                          borderBottom: "1px solid rgba(99,102,241,0.3)",
                          textAlign: "center",
                        }}
                      >
                        Active Input
                      </th>
                      {config.outputs.map((o) => (
                        <th
                          key={o}
                          style={{
                            padding: "6px 8px",
                            background: "rgba(30,40,60,0.8)",
                            color: "#fbbf24",
                            borderBottom: "1px solid rgba(99,102,241,0.3)",
                            textAlign: "center",
                          }}
                        >
                          {o}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {config.truthRows.map((row, ri) => (
                      <tr
                        key={ri}
                        style={{
                          background:
                            highlightRow === ri
                              ? "rgba(0,255,136,0.08)"
                              : "transparent",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          setHighlightRow(highlightRow === ri ? null : ri)
                        }
                      >
                        {row.map((cell, ci) => (
                          <td
                            key={ci}
                            style={{
                              padding: "5px 8px",
                              textAlign: "center",
                              color:
                                cell === "1"
                                  ? "#00ff88"
                                  : cell === "0"
                                    ? "#4b5563"
                                    : "#9ca3af",
                              borderBottom: "1px solid rgba(99,102,241,0.1)",
                            }}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Boolean Equations */}
        <div style={{ marginTop: "24px" }}>
          <h4 style={{ color: "#a5b4fc", marginBottom: "14px" }}>
            Boolean Equations
          </h4>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {config.booleanEqs.map((eq, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(12,18,35,0.8)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  borderRadius: "8px",
                  padding: "14px",
                  cursor: "pointer",
                }}
                onClick={() => setExpandedEq(expandedEq === i ? null : i)}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <code
                    style={{
                      color: "#fbbf24",
                      fontFamily: "monospace",
                      fontSize: "0.95rem",
                    }}
                  >
                    {eq.eq}
                  </code>
                  <span style={{ color: "#6b7280", fontSize: "0.75rem" }}>
                    {expandedEq === i ? "▲" : "▼"} explain
                  </span>
                </div>
                {expandedEq === i && (
                  <p
                    style={{
                      color: "#9ca3af",
                      fontSize: "0.85rem",
                      marginTop: "10px",
                      lineHeight: "1.6",
                    }}
                  >
                    {eq.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Circuit Modal trigger */}
        {circuitConfigs[selectedType] && (
          <div style={{ marginTop: "20px" }}>
            <button
              className="kmap-btn kmap-btn-secondary"
              onClick={() => setOpenCircuit(selectedType)}
            >
              🔌 View Logic Gate Circuit
            </button>
          </div>
        )}
      </ExplanationBlock>

      {/* ═══════════════════ SECTION 4: QUIZ ═══════════════════ */}
      <ExplanationBlock title="Test Your Understanding">
        <EncoderQuiz />
      </ExplanationBlock>

      {openCircuit && circuitConfigs[openCircuit] && (
        <CircuitModal
          isOpen={!!openCircuit}
          onClose={() => setOpenCircuit(null)}
          {...circuitConfigs[openCircuit]}
        />
      )}
    </ToolLayout>
  );
};

export default EncoderPage;
