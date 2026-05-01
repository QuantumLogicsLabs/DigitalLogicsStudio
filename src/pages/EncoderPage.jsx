import React, { useState, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════════
   ENCODER PAGE — Upgraded with:
   • Animated step-by-step signal flow visualization
   • "Aha!" moment cards with memorable mnemonics
   • Binary-index trick interactive explorer
   • Priority conflict resolver (drag simulation)
   • Expanded quiz with hints & streaks
   • Floating tips panel
   • Comparison table: plain vs priority encoders
   ═══════════════════════════════════════════════════════════════════ */

// ─── Encoder Data ─────────────────────────────────────────────────────────────
const ENCODER_TYPES = {
  "4to2": {
    label: "4-to-2 Priority Encoder",
    inputs: ["I0", "I1", "I2", "I3"],
    outputs: ["A1", "A0", "V"],
    description: "4 data inputs → 2-bit binary code + Valid flag",
    analogy: "Like a 4-button elevator that shows the highest requested floor",
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
        color: "#f97316",
        explanation:
          "A1 is the MSB (Most Significant Bit). It equals 1 for inputs 2 and 3, because both 2 (10₂) and 3 (11₂) have their bit-1 = 1. The rule: just OR the inputs whose binary index has that bit set.",
        trick: "Binary indices 2=10, 3=11 → both have bit-1 ON → A1 = I2 OR I3",
      },
      {
        out: "A0",
        eq: "A0 = I3 + I1·I2'",
        color: "#a78bfa",
        explanation:
          "A0 is the LSB. Inputs 1 (01₂) and 3 (11₂) have bit-0=1. But I3 has higher priority than I1, so we use I3 directly. For I1, we must ensure I2 is NOT active (priority masking): I1·I2'.",
        trick:
          "For priority: I3 always wins. I1 only fires when I2 is quiet (I2').",
      },
      {
        out: "V",
        eq: "V = I0 + I1 + I2 + I3",
        color: "#34d399",
        explanation:
          "Valid flag V = 1 whenever ANY input is HIGH. This tells downstream circuits 'a valid code is present'. V = 0 means all inputs are LOW — nothing to encode.",
        trick:
          "V is simply OR of ALL inputs. If anything is happening, V says so.",
      },
    ],
    truthRows: [
      ["none", "—", "—", "0"],
      ["I0 only", "0", "0", "1"],
      ["I1 only", "0", "1", "1"],
      ["I2 only", "1", "0", "1"],
      ["I3 only", "1", "1", "1"],
      ["I2+I3 (conflict)", "1", "1", "1"],
      ["I1+I2 (conflict)", "1", "0", "1"],
    ],
    truthHeaders: ["Active", "A1", "A0", "V"],
  },
  "8to3": {
    label: "8-to-3 Priority Encoder",
    inputs: ["I0", "I1", "I2", "I3", "I4", "I5", "I6", "I7"],
    outputs: ["A2", "A1", "A0", "V"],
    description: "8 data inputs → 3-bit binary code + Valid flag",
    analogy:
      "Like a hospital triage system — highest priority patient gets encoded first",
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
        color: "#f97316",
        explanation:
          "A2 is bit-2. Which binary indices (0–7) have bit-2 = 1? Those are 4=100, 5=101, 6=110, 7=111. So just OR I4, I5, I6, I7.",
        trick:
          "Indices 4–7 all ≥ 4, so they all have bit-2 ON. Think: top half of 0–7.",
      },
      {
        out: "A1",
        eq: "A1 = I2 + I3 + I6 + I7",
        color: "#a78bfa",
        explanation:
          "A1 is bit-1. Indices with bit-1=1: 2=010, 3=011, 6=110, 7=111. OR those four inputs.",
        trick:
          "Pattern: pairs of 2 ON, 2 OFF, repeating. 0,1 OFF → 2,3 ON → 4,5 OFF → 6,7 ON.",
      },
      {
        out: "A0",
        eq: "A0 = I1 + I3 + I5 + I7",
        color: "#34d399",
        explanation:
          "A0 is bit-0. Bit-0 = 1 for all ODD indices: 1=001, 3=011, 5=101, 7=111. Just OR all the odd-indexed inputs.",
        trick:
          "All ODD numbers have LSB=1. So A0 = OR of all odd-index inputs. Simple!",
      },
      {
        out: "V",
        eq: "V = I0+I1+I2+I3+I4+I5+I6+I7",
        color: "#60a5fa",
        explanation: "Valid: any input active → V=1. Big OR of all 8 inputs.",
        trick: "V is always just the OR of everything. No exceptions.",
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
    truthHeaders: ["Active Input", "A2", "A1", "A0", "V"],
  },
  BCD: {
    label: "Decimal-to-BCD Encoder",
    inputs: ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9"],
    outputs: ["A(8)", "B(4)", "C(2)", "D(1)"],
    description: "Decimal digit key (0–9) → 4-bit BCD code",
    analogy:
      "Like a calculator keypad converting your key-press to binary for the CPU",
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
        out: "A — 8s place",
        eq: "A = D8 + D9",
        color: "#f97316",
        explanation:
          "A is the 8s bit. Only digits 8 (1000₂) and 9 (1001₂) have this bit set. OR D8 and D9.",
        trick:
          "Only the TWO largest decimal digits need the 8s bit. Easy to remember!",
      },
      {
        out: "B — 4s place",
        eq: "B = D4 + D5 + D6 + D7",
        color: "#a78bfa",
        explanation:
          "B is the 4s bit. Digits 4–7 all have this bit set. OR those four inputs.",
        trick:
          "Middle four: 4,5,6,7 all have 4s bit ON. Think: the second quarter.",
      },
      {
        out: "C — 2s place",
        eq: "C = D2 + D3 + D6 + D7",
        color: "#34d399",
        explanation:
          "C is the 2s bit. Digits 2,3,6,7 have it set. OR those four inputs.",
        trick:
          "Alternating pairs: 2,3 ON → 4,5 OFF → 6,7 ON. Same alternating pattern as binary bit-1!",
      },
      {
        out: "D — 1s place",
        eq: "D = D1 + D3 + D5 + D7 + D9",
        color: "#60a5fa",
        explanation:
          "D is the 1s bit. All ODD digits have this bit set. OR D1, D3, D5, D7, D9.",
        trick:
          "All ODD numbers end in 1 in binary. D1 is the OR of all 5 odd digit keys.",
      },
    ],
    truthRows: [
      ["D0 (0)", "0", "0", "0", "0"],
      ["D1 (1)", "0", "0", "0", "1"],
      ["D2 (2)", "0", "0", "1", "0"],
      ["D3 (3)", "0", "0", "1", "1"],
      ["D4 (4)", "0", "1", "0", "0"],
      ["D5 (5)", "0", "1", "0", "1"],
      ["D6 (6)", "0", "1", "1", "0"],
      ["D7 (7)", "0", "1", "1", "1"],
      ["D8 (8)", "1", "0", "0", "0"],
      ["D9 (9)", "1", "0", "0", "1"],
    ],
    truthHeaders: ["Key Pressed", "A(8)", "B(4)", "C(2)", "D(1)"],
  },
};

// ─── Tips Data ────────────────────────────────────────────────────────────────
const TIPS = [
  {
    icon: "🧠",
    title: "The Binary-Index Trick",
    text: "For any output bit Aₖ: find all input indices where bit k = 1 in binary, then OR those inputs. This works for ANY encoder!",
  },
  {
    icon: "⚡",
    title: "Priority Rule",
    text: "If multiple inputs are HIGH, the HIGHEST-numbered input wins. The others are ignored. Always check from top to bottom.",
  },
  {
    icon: "✅",
    title: "Valid Flag Purpose",
    text: "V=0 means 'nothing is happening'. This prevents the system from acting on a garbage code when all inputs are LOW.",
  },
  {
    icon: "🔄",
    title: "Encoder vs Decoder",
    text: "Encoder compresses (many→few), Decoder expands (few→many). They are mathematical inverses of each other.",
  },
  {
    icon: "🔧",
    title: "OR Gates Only!",
    text: "A basic (non-priority) encoder uses ONLY OR gates. No NOT, no AND needed. This makes it one of the simplest circuits.",
  },
  {
    icon: "📐",
    title: "Size Formula",
    text: "An encoder with 2ⁿ inputs produces n output bits. So 4→2, 8→3, 16→4, 256→8 etc. The pattern: outputs = log₂(inputs).",
  },
  {
    icon: "🏥",
    title: "Real World: Keyboard",
    text: "Your keyboard has an encoder! When you press 'A', it encodes key 65 into binary and sends it to the CPU. That's an encoder in action.",
  },
  {
    icon: "🎯",
    title: "Exam Tip",
    text: "To write encoder equations fast: write all indices in binary, circle bit-k column, OR the corresponding input lines. Takes 30 seconds!",
  },
];

// ─── Quiz Data ────────────────────────────────────────────────────────────────
const QUIZ = [
  {
    q: "4-to-2 encoder: only I2 is HIGH. What is the output code (A1 A0)?",
    opts: ["00", "01", "10", "11"],
    ans: 2,
    exp: "I2 = index 2 = 10₂. So A1=1, A0=0 → '10'. The output IS the binary version of the active input's index!",
    hint: "Convert the index number 2 to binary.",
  },
  {
    q: "8-to-3 encoder: both I3 and I5 are HIGH simultaneously. Which output code appears?",
    opts: ["011 (I3)", "101 (I5)", "000 (undefined)", "111 (error)"],
    ans: 1,
    exp: "Priority encoder: highest-numbered input wins. I5 > I3. Output = 5 = 101₂. A2=1, A1=0, A0=1.",
    hint: "Priority means HIGHEST wins. Which is bigger, 3 or 5?",
  },
  {
    q: "What does V=0 (Valid=LOW) mean in a priority encoder?",
    opts: [
      "The code is 000",
      "All inputs are LOW — nothing to encode",
      "An error occurred",
      "The highest input is I0",
    ],
    ans: 1,
    exp: "V=0 means ALL inputs are LOW. The output code is meaningless (garbage). V=1 means a real, valid code is present.",
    hint: "V stands for 'Valid'. When nothing is active...",
  },
  {
    q: "Decimal-to-BCD encoder: key D7 pressed. What is the BCD output (A B C D)?",
    opts: ["0111", "1000", "0110", "1001"],
    ans: 0,
    exp: "7 in BCD = 0111₂. A(8s)=0, B(4s)=1, C(2s)=1, D(1s)=1. Just convert 7 to 4-bit binary!",
    hint: "What is 7 in 4-bit binary? 8+4+2+1...",
  },
  {
    q: "In 8-to-3 encoder, why is A0 = I1 + I3 + I5 + I7?",
    opts: [
      "These are the highest inputs",
      "These are all ODD-indexed inputs",
      "These have A2=1",
      "These have A1=0",
    ],
    ans: 1,
    exp: "A0 is the LSB. In binary, all odd numbers have their LSB=1 (e.g., 1=001, 3=011, 5=101, 7=111). So A0 = OR of all odd-indexed inputs.",
    hint: "Which numbers always have their last binary bit = 1?",
  },
  {
    q: "What kind of gates does a BASIC (non-priority) encoder use?",
    opts: ["AND gates only", "NOT and AND gates", "OR gates only", "XOR gates"],
    ans: 2,
    exp: "A basic binary encoder uses ONLY OR gates! Each output bit = OR of inputs whose index has that bit=1. No NOT or AND needed.",
    hint: "Each output is a logical sum of several inputs...",
  },
];

// ─── Binary Index Explorer ─────────────────────────────────────────────────────
const BinaryIndexExplorer = () => {
  const [numInputs, setNumInputs] = useState(8);
  const [selectedBit, setSelectedBit] = useState(0);
  const numBits = Math.log2(numInputs);
  const indices = Array.from({ length: numInputs }, (_, i) => i);
  const highlighted = indices.filter((i) => (i >> selectedBit) & 1);
  const eq =
    highlighted.length > 0
      ? `A${selectedBit} = ${highlighted.map((i) => `I${i}`).join(" + ")}`
      : `A${selectedBit} = 0`;

  return (
    <div
      style={{
        background: "rgba(8,14,30,0.9)",
        borderRadius: "14px",
        padding: "22px",
        border: "1px solid rgba(99,102,241,0.3)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <label
            style={{
              color: "#9ca3af",
              fontSize: "0.8rem",
              display: "block",
              marginBottom: "6px",
            }}
          >
            Number of Inputs
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            {[4, 8, 16].map((n) => (
              <button
                key={n}
                onClick={() => {
                  setNumInputs(n);
                  setSelectedBit(0);
                }}
                style={{
                  padding: "7px 16px",
                  borderRadius: "8px",
                  border: `1.5px solid ${numInputs === n ? "#6366f1" : "rgba(99,102,241,0.25)"}`,
                  background:
                    numInputs === n ? "rgba(99,102,241,0.25)" : "transparent",
                  color: numInputs === n ? "#a5b4fc" : "#6b7280",
                  cursor: "pointer",
                  fontFamily: "monospace",
                  fontSize: "0.9rem",
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label
            style={{
              color: "#9ca3af",
              fontSize: "0.8rem",
              display: "block",
              marginBottom: "6px",
            }}
          >
            Select Output Bit Aₖ
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            {Array.from({ length: numBits }, (_, k) => (
              <button
                key={k}
                onClick={() => setSelectedBit(k)}
                style={{
                  padding: "7px 16px",
                  borderRadius: "8px",
                  border: `1.5px solid ${selectedBit === k ? "#fbbf24" : "rgba(251,191,36,0.2)"}`,
                  background:
                    selectedBit === k ? "rgba(251,191,36,0.15)" : "transparent",
                  color: selectedBit === k ? "#fbbf24" : "#6b7280",
                  cursor: "pointer",
                  fontFamily: "monospace",
                }}
              >
                A{k}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ overflowX: "auto", marginBottom: "18px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "monospace",
            fontSize: "0.82rem",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  padding: "8px 12px",
                  color: "#60a5fa",
                  textAlign: "center",
                  borderBottom: "1px solid rgba(99,102,241,0.3)",
                  background: "rgba(15,23,42,0.8)",
                }}
              >
                Index
              </th>
              {Array.from({ length: numBits }, (_, k) => (
                <th
                  key={k}
                  style={{
                    padding: "8px 12px",
                    color: k === selectedBit ? "#fbbf24" : "#9ca3af",
                    textAlign: "center",
                    borderBottom: "1px solid rgba(99,102,241,0.3)",
                    background:
                      k === selectedBit
                        ? "rgba(251,191,36,0.1)"
                        : "rgba(15,23,42,0.8)",
                    fontWeight: k === selectedBit ? "800" : "600",
                  }}
                >
                  bit-{k} {k === selectedBit ? "← selected" : ""}
                </th>
              ))}
              <th
                style={{
                  padding: "8px 12px",
                  color: "#9ca3af",
                  textAlign: "center",
                  borderBottom: "1px solid rgba(99,102,241,0.3)",
                  background: "rgba(15,23,42,0.8)",
                }}
              >
                Include in A{selectedBit}?
              </th>
            </tr>
          </thead>
          <tbody>
            {indices.map((i) => {
              const isHighlighted = (i >> selectedBit) & 1;
              return (
                <tr
                  key={i}
                  style={{
                    background: isHighlighted
                      ? "rgba(251,191,36,0.07)"
                      : "transparent",
                  }}
                >
                  <td
                    style={{
                      padding: "7px 12px",
                      textAlign: "center",
                      color: "#e2e8f0",
                      borderBottom: "1px solid rgba(30,40,60,0.5)",
                    }}
                  >
                    I{i}
                  </td>
                  {Array.from({ length: numBits }, (_, k) => {
                    const bit = (i >> k) & 1;
                    return (
                      <td
                        key={k}
                        style={{
                          padding: "7px 12px",
                          textAlign: "center",
                          color:
                            k === selectedBit
                              ? bit
                                ? "#fbbf24"
                                : "#374151"
                              : bit
                                ? "#60a5fa"
                                : "#374151",
                          fontWeight: k === selectedBit && bit ? "800" : "400",
                          borderBottom: "1px solid rgba(30,40,60,0.5)",
                          background:
                            k === selectedBit
                              ? "rgba(251,191,36,0.05)"
                              : "transparent",
                        }}
                      >
                        {bit}
                      </td>
                    );
                  })}
                  <td
                    style={{
                      padding: "7px 12px",
                      textAlign: "center",
                      borderBottom: "1px solid rgba(30,40,60,0.5)",
                    }}
                  >
                    {isHighlighted ? (
                      <span style={{ color: "#00ff88", fontWeight: "700" }}>
                        ✓ YES
                      </span>
                    ) : (
                      <span style={{ color: "#374151" }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div
        style={{
          background: "rgba(251,191,36,0.08)",
          border: "1px solid rgba(251,191,36,0.35)",
          borderRadius: "10px",
          padding: "16px",
        }}
      >
        <div
          style={{ color: "#9ca3af", fontSize: "0.8rem", marginBottom: "4px" }}
        >
          Generated Equation:
        </div>
        <code
          style={{ color: "#fbbf24", fontSize: "1.05rem", fontWeight: "700" }}
        >
          {eq}
        </code>
        <p
          style={{
            color: "#9ca3af",
            fontSize: "0.82rem",
            margin: "10px 0 0",
            lineHeight: "1.6",
          }}
        >
          ✨ <strong style={{ color: "#e2e8f0" }}>The trick:</strong> Look at
          the column for bit-{selectedBit}. Every row with a 1 in that column
          contributes its input to A{selectedBit}. Just OR them all!
        </p>
      </div>
    </div>
  );
};

// ─── Signal Flow Diagram ──────────────────────────────────────────────────────
const SignalFlowDiagram = ({ config, inputVals, result }) => {
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const activeIdx = result.active;

  const steps = [
    {
      label: "Inputs Ready",
      desc: "All input lines are stable. We're waiting for one (or more) to go HIGH.",
      color: "#60a5fa",
    },
    {
      label: "Priority Check",
      desc:
        activeIdx >= 0
          ? `Input I${activeIdx} is the highest active input. It wins priority.`
          : "No inputs are active. Nothing to encode.",
      color: "#fbbf24",
    },
    {
      label: "OR Gate Layer",
      desc: "Each output bit OR-gates the relevant inputs. Active inputs drive the OR gates.",
      color: "#a78bfa",
    },
    {
      label: "Output Ready",
      desc:
        activeIdx >= 0
          ? `Output code = ${activeIdx} in binary. Valid flag V=1.`
          : "All outputs = 0. Valid flag V=0.",
      color: "#00ff88",
    },
  ];

  const runAnimation = () => {
    setAnimating(true);
    setStep(0);
    let s = 0;
    const interval = setInterval(() => {
      s++;
      setStep(s);
      if (s >= steps.length - 1) {
        clearInterval(interval);
        setAnimating(false);
      }
    }, 900);
  };

  return (
    <div
      style={{
        background: "rgba(8,14,30,0.9)",
        borderRadius: "14px",
        padding: "22px",
        border: "1px solid rgba(99,102,241,0.25)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "18px",
        }}
      >
        <h4 style={{ color: "#e2e8f0", margin: 0, fontSize: "0.95rem" }}>
          ⚡ Signal Flow Animation
        </h4>
        <button
          onClick={runAnimation}
          disabled={animating}
          style={{
            padding: "8px 18px",
            borderRadius: "8px",
            background: animating
              ? "rgba(99,102,241,0.1)"
              : "rgba(99,102,241,0.25)",
            border: "1.5px solid rgba(99,102,241,0.5)",
            color: animating ? "#6b7280" : "#a5b4fc",
            cursor: animating ? "default" : "pointer",
            fontSize: "0.85rem",
          }}
        >
          {animating ? "⏳ Playing..." : "▶ Play Animation"}
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "0",
          overflowX: "auto",
          paddingBottom: "8px",
        }}
      >
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <div
              style={{
                flex: "1",
                minWidth: "120px",
                textAlign: "center",
                opacity: step >= i ? 1 : 0.3,
                transition: "all 0.5s ease",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: step >= i ? `${s.color}22` : "rgba(20,30,50,0.5)",
                  border: `2px solid ${step >= i ? s.color : "rgba(99,102,241,0.2)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 10px",
                  fontSize: "1.2rem",
                  boxShadow: step >= i ? `0 0 12px ${s.color}55` : "none",
                  transition: "all 0.5s ease",
                }}
              >
                {["📥", "⚖️", "🔧", "📤"][i]}
              </div>
              <div
                style={{
                  color: step >= i ? s.color : "#4b5563",
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  marginBottom: "6px",
                  transition: "all 0.5s",
                }}
              >
                {s.label}
              </div>
              {step === i && (
                <div
                  style={{
                    color: "#9ca3af",
                    fontSize: "0.72rem",
                    lineHeight: "1.5",
                    padding: "8px",
                    background: "rgba(0,0,0,0.3)",
                    borderRadius: "8px",
                    animation: "fadeInUp 0.4s ease",
                  }}
                >
                  {s.desc}
                </div>
              )}
            </div>
            {i < steps.length - 1 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  paddingTop: "22px",
                  color: step > i ? "#6366f1" : "#1e293b",
                  transition: "all 0.5s",
                  fontSize: "1.1rem",
                }}
              >
                →
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <style>{`@keyframes fadeInUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
};

// ─── Priority Conflict Simulator ──────────────────────────────────────────────
const PriorityConflictSim = () => {
  const [active, setActive] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const toggle = (i) =>
    setActive((prev) => {
      const n = [...prev];
      n[i] = !n[i];
      return n;
    });
  const clear = () => setActive(Array(8).fill(false));

  let winner = -1;
  for (let i = 7; i >= 0; i--) {
    if (active[i]) {
      winner = i;
      break;
    }
  }
  const activeList = active.map((a, i) => (a ? i : -1)).filter((i) => i >= 0);

  return (
    <div
      style={{
        background: "rgba(8,14,30,0.9)",
        borderRadius: "14px",
        padding: "22px",
        border: "1px solid rgba(99,102,241,0.25)",
      }}
    >
      <h4
        style={{ color: "#e2e8f0", marginBottom: "6px", fontSize: "0.95rem" }}
      >
        ⚔️ Priority Conflict Simulator
      </h4>
      <p
        style={{
          color: "#9ca3af",
          fontSize: "0.82rem",
          marginBottom: "18px",
          lineHeight: "1.5",
        }}
      >
        Toggle multiple inputs ON at once to see how priority resolution works.
        The highest-numbered active input always wins.
      </p>

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {Array.from({ length: 8 }, (_, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "10px",
              border: `2px solid ${active[i] ? (i === winner ? "#00ff88" : "#f97316") : "rgba(99,102,241,0.25)"}`,
              background: active[i]
                ? i === winner
                  ? "rgba(0,255,136,0.15)"
                  : "rgba(249,115,22,0.15)"
                : "rgba(15,23,42,0.6)",
              color: active[i]
                ? i === winner
                  ? "#00ff88"
                  : "#f97316"
                : "#4b5563",
              fontFamily: "monospace",
              fontWeight: "700",
              fontSize: "0.9rem",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow:
                active[i] && i === winner
                  ? "0 0 12px rgba(0,255,136,0.4)"
                  : "none",
            }}
          >
            I{i}
          </button>
        ))}
        <button
          onClick={clear}
          style={{
            padding: "0 16px",
            borderRadius: "10px",
            border: "1px solid rgba(148,163,184,0.2)",
            background: "transparent",
            color: "#6b7280",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          Clear
        </button>
      </div>

      {activeList.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            color: "#4b5563",
            fontStyle: "italic",
          }}
        >
          No inputs active. Toggle some above.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px",
          }}
        >
          <div
            style={{
              background: "rgba(249,115,22,0.08)",
              border: "1px solid rgba(249,115,22,0.3)",
              borderRadius: "10px",
              padding: "14px",
            }}
          >
            <div
              style={{
                color: "#fb923c",
                fontSize: "0.75rem",
                fontWeight: "700",
                marginBottom: "8px",
              }}
            >
              COMPETING INPUTS
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {activeList.map((i) => (
                <span
                  key={i}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "6px",
                    background:
                      i === winner
                        ? "rgba(0,255,136,0.15)"
                        : "rgba(249,115,22,0.1)",
                    border: `1px solid ${i === winner ? "#00ff88" : "rgba(249,115,22,0.4)"}`,
                    color: i === winner ? "#00ff88" : "#f97316",
                    fontFamily: "monospace",
                    fontSize: "0.85rem",
                  }}
                >
                  I{i} {i === winner ? "👑" : ""}
                </span>
              ))}
            </div>
          </div>
          <div
            style={{
              background: "rgba(0,255,136,0.06)",
              border: "1px solid rgba(0,255,136,0.3)",
              borderRadius: "10px",
              padding: "14px",
            }}
          >
            <div
              style={{
                color: "#86efac",
                fontSize: "0.75rem",
                fontWeight: "700",
                marginBottom: "8px",
              }}
            >
              ENCODED OUTPUT
            </div>
            {winner >= 0 ? (
              <>
                <div
                  style={{
                    fontFamily: "monospace",
                    color: "#00ff88",
                    fontSize: "1.1rem",
                    fontWeight: "700",
                  }}
                >
                  {winner.toString(2).padStart(3, "0")}₂
                </div>
                <div
                  style={{
                    color: "#9ca3af",
                    fontSize: "0.8rem",
                    marginTop: "4px",
                  }}
                >
                  I{winner} wins — index {winner} in binary
                </div>
                <div
                  style={{
                    color: "#4ade80",
                    fontSize: "0.78rem",
                    marginTop: "4px",
                  }}
                >
                  V = 1 (valid)
                </div>
              </>
            ) : (
              <div style={{ color: "#4b5563", fontStyle: "italic" }}>
                No output
              </div>
            )}
          </div>
        </div>
      )}
      <div
        style={{
          marginTop: "14px",
          padding: "12px",
          background: "rgba(99,102,241,0.08)",
          borderRadius: "8px",
          color: "#9ca3af",
          fontSize: "0.8rem",
          lineHeight: "1.6",
        }}
      >
        💡 <strong style={{ color: "#e2e8f0" }}>Why priority matters:</strong>{" "}
        In real systems, multiple interrupt signals can fire simultaneously. The
        CPU needs ONE clear winner to service. Priority encoders guarantee
        exactly that — always one clean output.
      </div>
    </div>
  );
};

// ─── Floating Tips Panel ──────────────────────────────────────────────────────
const TipsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tipIdx, setTipIdx] = useState(0);
  const tip = TIPS[tipIdx];
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: isOpen ? "rgba(251,191,36,0.3)" : "rgba(99,102,241,0.85)",
          border: `2px solid ${isOpen ? "#fbbf24" : "#6366f1"}`,
          color: isOpen ? "#fbbf24" : "#e2e8f0",
          fontSize: "1.4rem",
          cursor: "pointer",
          zIndex: 999,
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          transition: "all 0.2s",
        }}
      >
        {isOpen ? "✕" : "💡"}
      </button>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "88px",
            right: "24px",
            width: "320px",
            background: "rgba(8,14,30,0.97)",
            border: "1px solid rgba(99,102,241,0.4)",
            borderRadius: "16px",
            padding: "20px",
            zIndex: 998,
            boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              color: "#a5b4fc",
              fontSize: "0.75rem",
              fontWeight: "700",
              marginBottom: "14px",
              letterSpacing: "0.08em",
            }}
          >
            💡 TIPS & TRICKS
          </div>
          <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
            {tip.icon}
          </div>
          <div
            style={{
              color: "#fbbf24",
              fontWeight: "700",
              marginBottom: "8px",
              fontSize: "0.9rem",
            }}
          >
            {tip.title}
          </div>
          <p
            style={{
              color: "#9ca3af",
              fontSize: "0.83rem",
              lineHeight: "1.65",
              margin: "0 0 16px",
            }}
          >
            {tip.text}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#4b5563", fontSize: "0.75rem" }}>
              {tipIdx + 1} / {TIPS.length}
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() =>
                  setTipIdx((tipIdx - 1 + TIPS.length) % TIPS.length)
                }
                style={{
                  padding: "5px 12px",
                  borderRadius: "6px",
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  color: "#a5b4fc",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                ←
              </button>
              <button
                onClick={() => setTipIdx((tipIdx + 1) % TIPS.length)}
                style={{
                  padding: "5px 12px",
                  borderRadius: "6px",
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  color: "#a5b4fc",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ─── Quiz Component ───────────────────────────────────────────────────────────
const Quiz = () => {
  const [qi, setQi] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const q = QUIZ[qi];

  const choose = (i) => {
    if (sel !== null) return;
    setSel(i);
    if (i === q.ans) {
      setScore((s) => s + 1);
      const ns = streak + 1;
      setStreak(ns);
      if (ns > bestStreak) setBestStreak(ns);
    } else {
      setStreak(0);
    }
  };
  const next = () => {
    if (qi + 1 >= QUIZ.length) {
      setDone(true);
      return;
    }
    setQi(qi + 1);
    setSel(null);
    setShowHint(false);
  };
  const restart = () => {
    setQi(0);
    setSel(null);
    setScore(0);
    setDone(false);
    setStreak(0);
    setShowHint(false);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "12px" }}>
          {score >= 5 ? "🏆" : score >= 3 ? "🎯" : "📚"}
        </div>
        <h3
          style={{ color: "#fbbf24", marginBottom: "8px", fontSize: "1.3rem" }}
        >
          Quiz Complete!
        </h3>
        <p style={{ color: "#9ca3af", marginBottom: "4px" }}>
          Score:{" "}
          <strong style={{ color: "#00ff88", fontSize: "1.2rem" }}>
            {score}/{QUIZ.length}
          </strong>
        </p>
        <p style={{ color: "#9ca3af", marginBottom: "4px" }}>
          Best Streak:{" "}
          <strong style={{ color: "#f97316" }}>🔥 {bestStreak}</strong>
        </p>
        <p
          style={{ color: "#9ca3af", marginBottom: "24px", fontSize: "0.9rem" }}
        >
          {score >= 5
            ? "Excellent encoder mastery! You understand priority logic cold."
            : score >= 3
              ? "Good — review the binary-index trick for faster equation writing."
              : "Keep going — the index-to-binary pattern will click with practice!"}
        </p>
        <button
          onClick={restart}
          style={{
            padding: "12px 28px",
            borderRadius: "10px",
            background: "rgba(99,102,241,0.25)",
            border: "1.5px solid rgba(99,102,241,0.6)",
            color: "#a5b4fc",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "0.95rem",
          }}
        >
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
          marginBottom: "16px",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: "4px" }}>
          {QUIZ.map((_, i) => (
            <div
              key={i}
              style={{
                width: "28px",
                height: "5px",
                borderRadius: "3px",
                background:
                  i < qi
                    ? "#00ff88"
                    : i === qi
                      ? "#6366f1"
                      : "rgba(99,102,241,0.2)",
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          {streak >= 2 && (
            <span style={{ color: "#f97316", fontSize: "0.82rem" }}>
              🔥 {streak} streak!
            </span>
          )}
          <span style={{ color: "#00ff88", fontSize: "0.85rem" }}>
            Score: {score}
          </span>
        </div>
      </div>

      <p
        style={{
          color: "#e2e8f0",
          fontWeight: "600",
          marginBottom: "18px",
          lineHeight: "1.65",
          fontSize: "0.95rem",
        }}
      >
        {q.q}
      </p>

      {!showHint && sel === null && (
        <button
          onClick={() => setShowHint(true)}
          style={{
            marginBottom: "12px",
            padding: "6px 14px",
            borderRadius: "7px",
            background: "rgba(251,191,36,0.1)",
            border: "1px solid rgba(251,191,36,0.3)",
            color: "#fbbf24",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          💡 Show Hint
        </button>
      )}
      {showHint && (
        <div
          style={{
            marginBottom: "14px",
            padding: "10px 14px",
            background: "rgba(251,191,36,0.07)",
            border: "1px solid rgba(251,191,36,0.3)",
            borderRadius: "8px",
            color: "#fbbf24",
            fontSize: "0.83rem",
          }}
        >
          🔍 Hint: {q.hint}
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "9px",
          marginBottom: "16px",
        }}
      >
        {q.opts.map((opt, i) => {
          let border = "rgba(148,163,184,0.2)",
            bg = "rgba(15,23,42,0.6)",
            color = "#9ca3af";
          if (sel !== null) {
            if (i === q.ans) {
              bg = "rgba(0,255,136,0.1)";
              border = "#00ff88";
              color = "#00ff88";
            } else if (i === sel) {
              bg = "rgba(239,68,68,0.1)";
              border = "#ef4444";
              color = "#ef4444";
            }
          }
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              style={{
                padding: "11px 16px",
                borderRadius: "9px",
                border: `1.5px solid ${border}`,
                background: bg,
                color,
                fontFamily: "monospace",
                cursor: sel !== null ? "default" : "pointer",
                textAlign: "left",
                transition: "all 0.2s",
                fontSize: "0.9rem",
                lineHeight: "1.5",
              }}
            >
              <span style={{ marginRight: "10px", opacity: 0.7 }}>
                {String.fromCharCode(65 + i)}.
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {sel !== null && (
        <div
          style={{
            padding: "14px",
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: "10px",
            marginBottom: "16px",
          }}
        >
          <p
            style={{
              color: "#c4b5fd",
              margin: 0,
              fontSize: "0.88rem",
              lineHeight: "1.65",
            }}
          >
            {sel === q.ans ? "✅ " : "❌ "}
            {q.exp}
          </p>
        </div>
      )}
      {sel !== null && (
        <button
          onClick={next}
          style={{
            padding: "11px 24px",
            borderRadius: "9px",
            background: "rgba(99,102,241,0.25)",
            border: "1.5px solid rgba(99,102,241,0.6)",
            color: "#a5b4fc",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "0.9rem",
          }}
        >
          {qi + 1 < QUIZ.length ? "Next Question →" : "See Results"}
        </button>
      )}
    </div>
  );
};

// ─── Comparison Table ─────────────────────────────────────────────────────────
const ComparisonTable = () => (
  <div style={{ overflowX: "auto" }}>
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontFamily: "system-ui",
        fontSize: "0.87rem",
      }}
    >
      <thead>
        <tr>
          {["Feature", "Basic Binary Encoder", "Priority Encoder"].map(
            (h, i) => (
              <th
                key={i}
                style={{
                  padding: "12px 16px",
                  background: "rgba(15,23,42,0.9)",
                  color: i === 0 ? "#9ca3af" : i === 1 ? "#60a5fa" : "#fbbf24",
                  textAlign: "left",
                  borderBottom: "2px solid rgba(99,102,241,0.3)",
                  fontWeight: "700",
                  fontSize: "0.82rem",
                  letterSpacing: "0.04em",
                }}
              >
                {h}
              </th>
            ),
          )}
        </tr>
      </thead>
      <tbody>
        {[
          [
            "Multiple inputs HIGH?",
            "❌ Undefined / garbage output",
            "✅ Highest-indexed input wins",
          ],
          [
            "Valid flag V",
            "Usually absent",
            "✅ Present — V=1 if any input active",
          ],
          [
            "Circuit complexity",
            "Simpler — OR gates only",
            "Slightly more complex — adds masking",
          ],
          [
            "Use case",
            "Keyboards (1 key at a time)",
            "Interrupt controllers (concurrent events)",
          ],
          [
            "Equations",
            "Direct OR of relevant inputs",
            "Masking terms added for conflicts",
          ],
          ["Real IC example", "74HC148 (basic)", "74LS148 (priority)"],
        ].map(([feat, plain, prio], ri) => (
          <tr
            key={ri}
            style={{
              background: ri % 2 === 0 ? "rgba(15,23,42,0.4)" : "transparent",
            }}
          >
            <td
              style={{
                padding: "11px 16px",
                color: "#e2e8f0",
                fontWeight: "600",
                borderBottom: "1px solid rgba(30,40,60,0.5)",
              }}
            >
              {feat}
            </td>
            <td
              style={{
                padding: "11px 16px",
                color: "#60a5fa",
                borderBottom: "1px solid rgba(30,40,60,0.5)",
                lineHeight: "1.5",
              }}
            >
              {plain}
            </td>
            <td
              style={{
                padding: "11px 16px",
                color: "#fbbf24",
                borderBottom: "1px solid rgba(30,40,60,0.5)",
                lineHeight: "1.5",
              }}
            >
              {prio}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── Main Interactive Simulator ────────────────────────────────────────────────
const EncoderSimulator = () => {
  const [selectedType, setSelectedType] = useState("4to2");
  const [inputVals, setInputVals] = useState(Array(10).fill(0));
  const [expandedEq, setExpandedEq] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [lastChanged, setLastChanged] = useState(null);

  const config = ENCODER_TYPES[selectedType];
  const toggleInput = (idx) => {
    const n = [...inputVals];
    n[idx] = n[idx] ? 0 : 1;
    setInputVals(n);
    setLastChanged(idx);
  };
  const resetInputs = () => {
    setInputVals(Array(10).fill(0));
    setLastChanged(null);
  };
  const activeVals = inputVals.slice(0, config.inputs.length);
  const result = useMemo(() => config.encode(activeVals), [config, activeVals]);

  const outputEntries = Object.keys(config.outputs).map((name) => ({
    name,
    val: result[name] ?? 0,
  }));

  // eslint-disable-next-line no-unused-vars
  const handleTypeChange = (type) => {
    setSelectedType(type);
    setInputVals(Array(10).fill(0));
    setExpandedEq(null);
  };

  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
    >
      {/* Inputs */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "14px",
            alignItems: "center",
          }}
        >
          <h4 style={{ color: "#60a5fa", margin: 0, fontSize: "0.9rem" }}>
            📥 Inputs
          </h4>
          <button
            onClick={resetInputs}
            style={{
              padding: "5px 12px",
              borderRadius: "7px",
              border: "1px solid rgba(148,163,184,0.2)",
              background: "transparent",
              color: "#6b7280",
              cursor: "pointer",
              fontSize: "0.78rem",
            }}
          >
            Reset
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
          {config.inputs.map((name, idx) => {
            const isActive = activeVals[idx] === 1;
            const isWinner = result.active === idx;
            return (
              <button
                key={name}
                onClick={() => toggleInput(idx)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "9px",
                  border: `2px solid ${isActive ? (isWinner ? "#00ff88" : "#f97316") : "rgba(99,102,241,0.2)"}`,
                  background: isActive
                    ? isWinner
                      ? "rgba(0,255,136,0.1)"
                      : "rgba(249,115,22,0.1)"
                    : "rgba(12,18,35,0.7)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: isWinner ? "0 0 10px rgba(0,255,136,0.3)" : "none",
                }}
              >
                <span
                  style={{
                    color: isActive
                      ? isWinner
                        ? "#00ff88"
                        : "#f97316"
                      : "#6b7280",
                    fontFamily: "monospace",
                    fontWeight: "700",
                    fontSize: "0.95rem",
                  }}
                >
                  {name}
                </span>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  {isWinner && (
                    <span style={{ color: "#00ff88", fontSize: "0.72rem" }}>
                      👑 WINNER
                    </span>
                  )}
                  {isActive && !isWinner && (
                    <span style={{ color: "#f97316", fontSize: "0.72rem" }}>
                      overridden
                    </span>
                  )}
                  <span
                    style={{
                      width: "28px",
                      height: "16px",
                      borderRadius: "4px",
                      background: isActive
                        ? isWinner
                          ? "#00ff88"
                          : "#f97316"
                        : "rgba(99,102,241,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "monospace",
                      fontSize: "0.78rem",
                      color: isActive ? "#0a0f1a" : "#4b5563",
                      fontWeight: "800",
                      transition: "all 0.2s",
                    }}
                  >
                    {isActive ? "1" : "0"}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Outputs */}
      <div>
        <h4
          style={{ color: "#fbbf24", marginBottom: "14px", fontSize: "0.9rem" }}
        >
          📤 Outputs
        </h4>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "7px",
            marginBottom: "20px",
          }}
        >
          {outputEntries.map(({ name, val }) => (
            <div
              key={name}
              style={{
                padding: "10px 14px",
                borderRadius: "9px",
                border: `2px solid ${val ? "#fbbf24" : "rgba(148,163,184,0.12)"}`,
                background: val ? "rgba(251,191,36,0.1)" : "rgba(12,18,35,0.7)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "all 0.2s",
                boxShadow: val ? "0 0 8px rgba(251,191,36,0.2)" : "none",
              }}
            >
              <span
                style={{
                  color: val ? "#fbbf24" : "#9ca3af",
                  fontFamily: "monospace",
                  fontWeight: "700",
                }}
              >
                {name}
              </span>
              <span
                style={{
                  width: "28px",
                  height: "16px",
                  borderRadius: "4px",
                  background: val ? "#fbbf24" : "rgba(99,102,241,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "monospace",
                  fontSize: "0.78rem",
                  color: val ? "#0a0f1a" : "#4b5563",
                  fontWeight: "800",
                  transition: "all 0.2s",
                }}
              >
                {val}
              </span>
            </div>
          ))}
        </div>

        {/* Summary box */}
        <div
          style={{
            padding: "14px",
            background: "rgba(8,14,30,0.8)",
            border: "1px solid rgba(99,102,241,0.25)",
            borderRadius: "10px",
          }}
        >
          {result.active >= 0 ? (
            <>
              <div
                style={{
                  color: "#86efac",
                  fontSize: "0.78rem",
                  fontWeight: "700",
                  marginBottom: "6px",
                }}
              >
                ENCODING RESULT
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  color: "#00ff88",
                  fontSize: "1.15rem",
                  fontWeight: "700",
                }}
              >
                I{result.active} →{" "}
                {result.active
                  .toString(2)
                  .padStart(
                    config.outputs.filter((o) => o !== "V").length,
                    "0",
                  )}
                ₂
              </div>
              <div
                style={{
                  color: "#9ca3af",
                  fontSize: "0.78rem",
                  marginTop: "4px",
                }}
              >
                Input {result.active} encoded as binary {result.active}
              </div>
            </>
          ) : (
            <div
              style={{
                color: "#4b5563",
                fontSize: "0.85rem",
                fontStyle: "italic",
              }}
            >
              No inputs active. Output = 0, V = 0.
            </div>
          )}
        </div>
      </div>

      {/* Truth Table */}
      <div style={{ gridColumn: "1 / -1" }}>
        <h4
          style={{ color: "#93c5fd", marginBottom: "12px", fontSize: "0.9rem" }}
        >
          📊 Truth Table
        </h4>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "monospace",
              fontSize: "0.82rem",
            }}
          >
            <thead>
              <tr>
                {config.truthHeaders.map((h, i) => (
                  <th
                    key={i}
                    style={{
                      padding: "8px 12px",
                      background: "rgba(15,23,42,0.9)",
                      color: i === 0 ? "#60a5fa" : "#fbbf24",
                      textAlign: "center",
                      borderBottom: "1px solid rgba(99,102,241,0.3)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {config.truthRows.map((row, ri) => {
                const isHighlighted =
                  result.active ===
                  ri - (config.truthRows[0][0] === "none" ? 0 : 0);
                return (
                  <tr
                    key={ri}
                    style={{
                      background: isHighlighted
                        ? "rgba(0,255,136,0.07)"
                        : "transparent",
                      transition: "background 0.3s",
                    }}
                  >
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        style={{
                          padding: "7px 12px",
                          textAlign: "center",
                          color:
                            cell === "1"
                              ? "#00ff88"
                              : cell === "0"
                                ? "#374151"
                                : cell === "—"
                                  ? "#6b7280"
                                  : "#e2e8f0",
                          borderBottom: "1px solid rgba(30,40,60,0.4)",
                          fontWeight: ci === 0 ? "600" : "400",
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
      </div>

      {/* Boolean Equations */}
      <div style={{ gridColumn: "1 / -1" }}>
        <h4
          style={{ color: "#a5b4fc", marginBottom: "14px", fontSize: "0.9rem" }}
        >
          📐 Boolean Equations — Click to Expand
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {config.booleanEqs.map((eq, i) => (
            <div
              key={i}
              onClick={() => setExpandedEq(expandedEq === i ? null : i)}
              style={{
                background: "rgba(12,18,35,0.8)",
                border: `1.5px solid ${expandedEq === i ? eq.color + "60" : "rgba(99,102,241,0.18)"}`,
                borderRadius: "10px",
                padding: "14px 16px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
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
                    color: eq.color,
                    fontFamily: "monospace",
                    fontSize: "0.95rem",
                    fontWeight: "700",
                  }}
                >
                  {eq.eq}
                </code>
                <span style={{ color: "#6b7280", fontSize: "0.75rem" }}>
                  {expandedEq === i ? "▲ less" : "▼ explain"}
                </span>
              </div>
              {expandedEq === i && (
                <div
                  style={{
                    marginTop: "14px",
                    borderTop: "1px solid rgba(99,102,241,0.15)",
                    paddingTop: "14px",
                  }}
                >
                  <p
                    style={{
                      color: "#9ca3af",
                      fontSize: "0.87rem",
                      lineHeight: "1.7",
                      margin: "0 0 12px",
                    }}
                  >
                    {eq.explanation}
                  </p>
                  <div
                    style={{
                      padding: "10px 14px",
                      background: `${eq.color}12`,
                      border: `1px solid ${eq.color}40`,
                      borderRadius: "8px",
                    }}
                  >
                    <span
                      style={{
                        color: eq.color,
                        fontSize: "0.78rem",
                        fontWeight: "700",
                      }}
                    >
                      🎯 MEMORY TRICK:{" "}
                    </span>
                    <span style={{ color: "#e2e8f0", fontSize: "0.82rem" }}>
                      {eq.trick}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* PRO TOOLS SECTION */}
      <div style={{ gridColumn: "1 / -1", marginTop: "40px", borderTop: "1px solid rgba(249,115,22,0.2)", paddingTop: "32px" }}>
        <h4 style={{ color: "#f97316", marginBottom: "20px", fontSize: "1rem", fontWeight: "800", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          🚀 Pro Engineering Tools
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "20px" }}>
          <LogicAnalyzer 
            inputs={activeVals} 
            outputs={outputEntries.map(e => e.val)} 
            labels={[...config.inputs, ...outputEntries.map(e => e.name)]} 
          />
          <VirtualBreadboard 
            inputs={activeVals} 
            outputs={outputEntries.map(e => e.val)} 
            config={config} 
          />
        </div>
      </div>
    </div>
  );
};

// ─── Section Block ─────────────────────────────────────────────────────────────
const Section = ({ title, children, accent = "#6366f1" }) => (
  <div
    style={{
      marginBottom: "32px",
      background: "rgba(10,16,32,0.85)",
      border: `1px solid ${accent}30`,
      borderRadius: "16px",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        padding: "16px 22px",
        borderBottom: `1px solid ${accent}25`,
        background: `${accent}0a`,
      }}
    >
      <h3
        style={{
          color: "#e2e8f0",
          margin: 0,
          fontSize: "1.05rem",
          fontWeight: "700",
        }}
      >
        {title}
      </h3>
    </div>
    <div style={{ padding: "22px" }}>{children}</div>
  </div>
);

// ─── Real World Card ───────────────────────────────────────────────────────────
const RealWorldCard = ({ icon, title, items, color }) => (
  <div
    style={{
      background: "rgba(12,18,35,0.7)",
      border: `1px solid ${color}25`,
      borderRadius: "12px",
      padding: "18px",
    }}
  >
    <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>{icon}</div>
    <h5
      style={{
        color,
        marginBottom: "12px",
        fontSize: "0.88rem",
        fontWeight: "700",
      }}
    >
      {title}
    </h5>
    <ul
      style={{
        color: "#6b7280",
        paddingLeft: "18px",
        margin: 0,
        lineHeight: "1.7",
        fontSize: "0.83rem",
      }}
    >
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  </div>
);

// ─── Type Selector ─────────────────────────────────────────────────────────────
const TypeSelector = ({ selectedType, onChange }) => (
  <div
    style={{
      display: "flex",
      gap: "10px",
      marginBottom: "24px",
      flexWrap: "wrap",
    }}
  >
    {Object.entries(ENCODER_TYPES).map(([key, val]) => (
      <button
        key={key}
        onClick={() => onChange(key)}
        style={{
          padding: "10px 20px",
          borderRadius: "10px",
          border: `2px solid ${selectedType === key ? "#6366f1" : "rgba(99,102,241,0.2)"}`,
          background:
            selectedType === key
              ? "rgba(99,102,241,0.2)"
              : "rgba(12,18,35,0.7)",
          color: selectedType === key ? "#a5b4fc" : "#6b7280",
          cursor: "pointer",
          fontWeight: selectedType === key ? "700" : "400",
          transition: "all 0.2s",
          fontSize: "0.88rem",
        }}
      >
        {val.label}
      </button>
    ))}
  </div>
);

// ─── Encoder HDL Generator ───────────────────────────────────────────────────
const EncoderHDLGenerator = ({ type }) => {
  const [lang, setLang] = useState("Verilog");
  const config = ENCODER_TYPES[type];
  const numInputs = config.inputs.length;
  const numOutputs = config.outputs.length;

  const generateCode = () => {
    if (lang === "Verilog") {
      return `module encoder_${type}(
    input [${numInputs - 1}:0] I,
    output reg [${numOutputs - 1}:0] A,
    output GS, // Group Select (Any input high)
    output EO  // Enable Out
);
    always @(*) begin
        A = ${numOutputs}'b0;
        GS = |I;
        if (I[${numInputs - 1}]) A = ${numInputs - 1};
        ${config.label.includes("Priority") ? "// Priority Logic" : "// Basic Logic"}
        // ... (priority hierarchy)
    end
endmodule`;
    } else {
      return `library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity encoder_${type} is
    Port ( I  : in  STD_LOGIC_VECTOR (${numInputs - 1} downto 0);
           A  : out STD_LOGIC_VECTOR (${numOutputs - 1} downto 0);
           GS : out STD_LOGIC);
end encoder_${type};

architecture Behavioral of encoder_${type} is
begin
    process(I)
    begin
        A <= (others => '0');
        GS <= '0';
        for i in ${numInputs - 1} downto 0 loop
            if I(i) = '1' then
                A <= std_logic_vector(to_unsigned(i, ${numOutputs}));
                GS <= '1';
                exit;
            end if;
        end loop;
    end process;
end Behavioral;`;
    }
  };

  return (
    <div style={{ background: "rgba(15,23,42,0.6)", borderRadius: "12px", border: "1px solid rgba(99,102,241,0.2)", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h4 style={{ color: "#fbbf24", margin: 0, fontSize: "0.9rem" }}>💻 Hardware Description (HDL) Export</h4>
        <div style={{ display: "flex", gap: "8px" }}>
          {["Verilog", "VHDL"].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ padding: "4px 10px", borderRadius: "6px", border: `1px solid ${lang === l ? "#fbbf24" : "rgba(148,163,184,0.2)"}`, background: lang === l ? "rgba(251,191,36,0.15)" : "transparent", color: lang === l ? "#fbbf24" : "#6b7280", cursor: "pointer", fontSize: "0.75rem" }}>{l}</button>
          ))}
        </div>
      </div>
      <pre style={{ margin: 0, padding: "16px", background: "#020617", borderRadius: "8px", color: "#60a5fa", fontSize: "0.82rem", overflowX: "auto", fontFamily: "monospace", border: "1px solid rgba(251,191,36,0.1)" }}>
        {generateCode()}
      </pre>
    </div>
  );
};

// ─── Encoder Fault Debugger ───────────────────────────────────────────────────
const EncoderFaultDebugger = () => {
  const [level, setLevel] = useState(0);
  const [userGuess, setUserGuess] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const faults = [
    { type: "Priority Leak", effect: "I1 stays active even when I3 is HIGH", answer: "Priority Gate" },
    { type: "Stuck-at-1", effect: "Output A0 is always HIGH even if only I0 is active", answer: "A0 Line" },
    { type: "Floating Input", effect: "I2 doesn't trigger any output when pressed", answer: "I2 Line" }
  ];

  const check = (ans) => {
    setUserGuess(ans);
    setShowResult(true);
  };

  return (
    <div style={{ background: "rgba(8,14,30,0.9)", borderRadius: "14px", padding: "22px", border: "1px solid rgba(249,115,22,0.25)" }}>
      <h4 style={{ color: "#f97316", marginBottom: "14px", fontSize: "0.95rem" }}>🕵️ Encoder Fault Debugger — Level {level + 1}</h4>
      <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "15px" }}><strong>Symptom:</strong> {faults[level].effect}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
        {["Priority Gate", "A0 Line", "I2 Line", "OR Gate 1"].map(opt => (
          <button key={opt} onClick={() => check(opt)} disabled={showResult} style={{ padding: "10px", borderRadius: "8px", border: `1.5px solid ${userGuess === opt ? (opt === faults[level].answer ? "#34d399" : "#f87171") : "rgba(249,115,22,0.2)"}`, background: userGuess === opt ? (opt === faults[level].answer ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)") : "rgba(12,18,35,0.7)", color: userGuess === opt ? (opt === faults[level].answer ? "#34d399" : "#f87171") : "#9ca3af", cursor: "pointer" }}>{opt} Fault</button>
        ))}
      </div>
      {showResult && (
        <div style={{ padding: "12px", borderRadius: "8px", background: userGuess === faults[level].answer ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)", border: `1px solid ${userGuess === faults[level].answer ? "#34d399" : "#f87171"}` }}>
          <div style={{ color: userGuess === faults[level].answer ? "#34d399" : "#f87171", fontSize: "0.85rem", fontWeight: "700" }}>{userGuess === faults[level].answer ? "✅ Fixed! " : "❌ System Failure! "}</div>
          <button onClick={() => { setLevel((level+1)%faults.length); setShowResult(false); setUserGuess(null); }} style={{ marginTop: "10px", padding: "5px 12px", borderRadius: "6px", background: "#f97316", border: "none", color: "white", cursor: "pointer", fontSize: "0.75rem" }}>Next Challenge</button>
        </div>
      )}
    </div>
  );
};

// ─── Logic Analyzer (Timing Diagram) ──────────────────────────────────────────
const LogicAnalyzer = ({ inputs, outputs, labels }) => {
  const [history, setHistory] = useState([]);
  const maxPoints = 40;

  React.useEffect(() => {
    const timer = setInterval(() => {
      setHistory(prev => {
        const newState = [...inputs, ...outputs];
        const updated = [...prev, newState];
        return updated.slice(-maxPoints);
      });
    }, 200);
    return () => clearInterval(timer);
  }, [inputs, outputs]);

  const height = 30;
  const gap = 15;
  const totalHeight = (inputs.length + outputs.length) * (height + gap);

  return (
    <div style={{ background: "#020617", borderRadius: "12px", padding: "20px", border: "1px solid rgba(249,115,22,0.2)", overflow: "hidden" }}>
      <h4 style={{ color: "#f97316", marginTop: 0, marginBottom: "15px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 8px #ef4444" }} />
        LIVE LOGIC ANALYZER — ENCODER SIGNALS
      </h4>
      <div style={{ overflowX: "auto" }}>
        <svg width="100%" height={totalHeight} style={{ minWidth: "600px" }}>
          {(labels || []).map((label, i) => {
            const yBase = i * (height + gap);
            return (
              <g key={label}>
                <text x="0" y={yBase + 20} fill="#4b5563" fontSize="10" fontFamily="monospace">{label}</text>
                <line x1="45" y1={yBase + height} x2="100%" y2={yBase + height} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <polyline
                  points={history.map((state, idx) => {
                    const x = 50 + (idx * (600 / maxPoints));
                    const y = yBase + (state[i] ? 5 : height - 5);
                    return `${x},${y}`;
                  }).join(" ")}
                  fill="none"
                  stroke={i < inputs.length ? "#fbbf24" : "#60a5fa"}
                  strokeWidth="2"
                  strokeLinejoin="step-after"
                  style={{ transition: "all 0.1s linear" }}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

// ─── Virtual Breadboard Guide ────────────────────────────────────────────────
const VirtualBreadboard = ({ inputs, outputs, config }) => {
  return (
    <div style={{ background: "rgba(15,23,42,0.6)", borderRadius: "14px", padding: "24px", border: "1px solid rgba(249,115,22,0.2)", textAlign: "center" }}>
      <h4 style={{ color: "#94a3b8", marginBottom: "20px", fontSize: "0.9rem" }}>🔌 Virtual Breadboard — Encoder Chipset (74LS148)</h4>
      <div style={{ position: "relative", display: "inline-block", background: "#d1d5db", padding: "10px", borderRadius: "4px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(20, 10px)", gap: "5px" }}>
          {Array(100).fill(0).map((_, i) => (
            <div key={i} style={{ width: "8px", height: "8px", borderRadius: "1px", background: "#9ca3af" }} />
          ))}
        </div>
        <div style={{ position: "absolute", top: "25%", left: "25%", width: "50%", height: "50%", background: "#1f2937", borderRadius: "3px" }}>
          <div style={{ color: "#4b5563", fontSize: "10px", fontWeight: "800", transform: "rotate(-90deg)", marginTop: "25px" }}>74LS148</div>
        </div>
      </div>
      <div style={{ marginTop: "15px", fontSize: "0.75rem", color: "#6b7280" }}>
        IC 74LS148 handles 8 inputs and outputs a 3-bit binary code.
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const EncoderPage = () => {
  const [selectedType, setSelectedType] = useState("4to2");
  const [inputVals, setInputVals] = useState(Array(10).fill(0));
  const config = ENCODER_TYPES[selectedType];
  const activeVals = inputVals.slice(0, config.inputs.length);
  const result = useMemo(() => config.encode(activeVals), [config, activeVals]);

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setInputVals(Array(10).fill(0));
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        background: "#080e1e",
        minHeight: "100vh",
        color: "#e2e8f0",
        padding: "28px 20px 80px",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: rgba(15,23,42,0.3); }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 3px; }
        button:hover { filter: brightness(1.1); }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: "900px", margin: "0 auto 32px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "6px 14px",
            borderRadius: "20px",
            background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.3)",
            marginBottom: "16px",
          }}
        >
          <span
            style={{
              color: "#a5b4fc",
              fontSize: "0.78rem",
              fontWeight: "700",
              letterSpacing: "0.1em",
            }}
          >
            DIGITAL LOGIC
          </span>
        </div>
        <h1
          style={{
            fontSize: "2.2rem",
            fontWeight: "800",
            background: "linear-gradient(135deg, #a5b4fc, #38bdf8, #34d399)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0 0 12px",
            lineHeight: 1.2,
          }}
        >
          Encoders — Complete Guide
        </h1>
        <p
          style={{
            color: "#64748b",
            fontSize: "1rem",
            lineHeight: "1.6",
            margin: 0,
          }}
        >
          Interactive simulator • Signal flow animations • Priority conflict
          resolver • Binary-index explorer • Quiz with hints
        </p>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* SECTION 1: Concept */}
        <Section title="📖 What is an Encoder? — Core Concept" accent="#6366f1">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <div>
              <p
                style={{
                  color: "#9ca3af",
                  lineHeight: "1.7",
                  fontSize: "0.92rem",
                  margin: "0 0 16px",
                }}
              >
                An <strong style={{ color: "#e2e8f0" }}>encoder</strong> is a
                combinational circuit that converts an active input signal into
                a compact binary code. It is the <em>opposite of a decoder</em>:
                given up to 2ⁿ input lines, it outputs n bits.
              </p>
              <p
                style={{
                  color: "#9ca3af",
                  lineHeight: "1.7",
                  fontSize: "0.92rem",
                  margin: 0,
                }}
              >
                Think of it as a{" "}
                <strong style={{ color: "#fbbf24" }}>
                  barcode scanner for signals
                </strong>{" "}
                — you present one active line, and it outputs the binary "label"
                of that line.
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {[
                {
                  icon: "📉",
                  label: "Compression",
                  desc: "2ⁿ inputs → n output bits",
                  color: "#34d399",
                },
                {
                  icon: "⭐",
                  label: "Priority",
                  desc: "Highest active input wins",
                  color: "#fbbf24",
                },
                {
                  icon: "✅",
                  label: "Valid Flag",
                  desc: "V=1 means output is meaningful",
                  color: "#60a5fa",
                },
                {
                  icon: "⚡",
                  label: "Combinational",
                  desc: "No memory — instant output",
                  color: "#a78bfa",
                },
              ].map(({ icon, label, desc, color }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    padding: "10px 14px",
                    background: "rgba(12,18,35,0.6)",
                    borderRadius: "9px",
                    border: `1px solid ${color}20`,
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>{icon}</span>
                  <div>
                    <div
                      style={{ color, fontWeight: "700", fontSize: "0.82rem" }}
                    >
                      {label}
                    </div>
                    <div style={{ color: "#6b7280", fontSize: "0.78rem" }}>
                      {desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: "18px",
              background: "rgba(251,191,36,0.06)",
              border: "1px solid rgba(251,191,36,0.3)",
              borderRadius: "12px",
              marginBottom: "16px",
            }}
          >
            <h4
              style={{
                color: "#fbbf24",
                marginBottom: "12px",
                fontSize: "0.9rem",
              }}
            >
              🎯 The Binary-Index Trick — Write Any Encoder Equation in 30
              Seconds
            </h4>
            <ol
              style={{
                color: "#9ca3af",
                paddingLeft: "18px",
                margin: 0,
                lineHeight: "1.8",
                fontSize: "0.88rem",
              }}
            >
              <li>List all input indices from 0 to 2ⁿ−1</li>
              <li>
                For output bit Aₖ, find every index where{" "}
                <strong style={{ color: "#fbbf24" }}>bit k = 1</strong> in
                binary
              </li>
              <li>OR those input lines together — that's your equation!</li>
            </ol>
            <div
              style={{
                marginTop: "14px",
                padding: "12px",
                background: "rgba(0,0,0,0.3)",
                borderRadius: "8px",
                fontFamily: "monospace",
                fontSize: "0.87rem",
              }}
            >
              <span style={{ color: "#fbbf24" }}>
                Example — A0 in 8-to-3 encoder:
              </span>
              <br />
              <span style={{ color: "#9ca3af" }}>
                Indices 0–7 in binary:
              </span>{" "}
              <span style={{ color: "#4b5563" }}>
                000 001 010 011 100 101 110 111
              </span>
              <br />
              <span style={{ color: "#9ca3af" }}>Bit-0 = 1 for:</span>{" "}
              <span style={{ color: "#a78bfa" }}>1, 3, 5, 7 (odd indices)</span>
              <br />
              <span style={{ color: "#00ff88", fontWeight: "700" }}>
                ∴ A0 = I1 + I3 + I5 + I7 ✅
              </span>
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              background: "rgba(0,255,136,0.05)",
              border: "1px solid rgba(0,255,136,0.25)",
              borderRadius: "12px",
            }}
          >
            <h4
              style={{
                color: "#86efac",
                marginBottom: "8px",
                fontSize: "0.88rem",
              }}
            >
              🔄 Encoder vs Decoder — Two Sides of the Same Coin
            </h4>
            <p
              style={{
                color: "#9ca3af",
                margin: 0,
                fontSize: "0.87rem",
                lineHeight: "1.6",
              }}
            >
              <strong style={{ color: "#60a5fa" }}>Decoder:</strong> n-bit code
              → one of 2ⁿ output lines HIGH (expand → like a tree branching out)
              <br />
              <strong style={{ color: "#fbbf24" }}>Encoder:</strong> one of 2ⁿ
              inputs HIGH → n-bit code (compress → like a funnel)
              <br />
              They are{" "}
              <strong style={{ color: "#00ff88" }}>
                mathematical inverses
              </strong>
              . Decoder followed by Encoder = original code back.
            </p>
          </div>
        </Section>

        {/* SECTION 2: Binary Index Explorer */}
        <Section
          title="🔬 Interactive Binary-Index Explorer — See the Trick in Action"
          accent="#a78bfa"
        >
          <p
            style={{
              color: "#9ca3af",
              fontSize: "0.88rem",
              lineHeight: "1.6",
              marginBottom: "18px",
            }}
          >
            Select how many inputs and which output bit to examine. The table
            will highlight exactly which inputs contribute to that output, and
            show you the resulting equation automatically.
          </p>
          <BinaryIndexExplorer />
        </Section>

        {/* SECTION 3: Signal Flow */}
        <Section
          title="⚡ Signal Flow — How Data Moves Through the Circuit"
          accent="#60a5fa"
        >
          <p
            style={{
              color: "#9ca3af",
              fontSize: "0.88rem",
              lineHeight: "1.6",
              marginBottom: "18px",
            }}
          >
            Use the simulator below, then watch the animated signal flow to
            understand what happens inside the encoder step by step.
          </p>
          <TypeSelector
            selectedType={selectedType}
            onChange={handleTypeChange}
          />
          <div
            style={{
              color: "#6b7280",
              fontSize: "0.8rem",
              marginBottom: "12px",
              padding: "8px 12px",
              background: "rgba(251,191,36,0.05)",
              border: "1px solid rgba(251,191,36,0.15)",
              borderRadius: "8px",
            }}
          >
            💡 <em>Analogy: {config.analogy}</em>
          </div>
          <SignalFlowDiagram
            config={config}
            inputVals={inputVals.slice(0, config.inputs.length)}
            result={result}
          />
        </Section>

        {/* SECTION 4: Full Simulator */}
        <Section title="🎮 Interactive Encoder Simulator" accent="#34d399">
          <TypeSelector
            selectedType={selectedType}
            onChange={handleTypeChange}
          />
          <EncoderSimulator key={selectedType} />
          <div style={{ marginTop: "24px" }}>
            <EncoderHDLGenerator type={selectedType} />
          </div>
        </Section>

        {/* NEW SECTION: Troubleshooting */}
        <Section title="🛠️ Troubleshooting — Find the Encoder Fault" accent="#f97316">
          <p
            style={{
              color: "#9ca3af",
              fontSize: "0.88rem",
              lineHeight: "1.6",
              marginBottom: "18px",
            }}
          >
            Encoders are susceptible to stuck lines and priority gate failures.
            Put your debugging skills to the test!
          </p>
          <EncoderFaultDebugger />
        </Section>

        {/* SECTION 5: Priority Conflict */}
        <Section
          title="⚔️ Priority Conflict Resolution — What Happens with Multiple Inputs?"
          accent="#f97316"
        >
          <p
            style={{
              color: "#9ca3af",
              fontSize: "0.88rem",
              lineHeight: "1.6",
              marginBottom: "18px",
            }}
          >
            Basic encoders break when two inputs are HIGH simultaneously.
            Priority encoders solve this by always picking the highest-numbered
            input. Try it yourself:
          </p>
          <PriorityConflictSim />
          <div style={{ marginTop: "20px" }}>
            <ComparisonTable />
          </div>
        </Section>

        {/* SECTION 6: Real World */}
        <Section title="🌍 Real-World Applications" accent="#fbbf24">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "14px",
            }}
          >
            <RealWorldCard
              icon="⌨️"
              color="#60a5fa"
              title="Computer Keyboard"
              items={[
                "74 key presses → 7-bit ASCII encoder",
                "One keypress = one active input",
                "Output sent to CPU via serial",
                "Priority handles stuck-key scenarios",
              ]}
            />
            <RealWorldCard
              icon="🚨"
              color="#f97316"
              title="CPU Interrupt Controller"
              items={[
                "Multiple devices request CPU attention",
                "Priority encoder picks highest-priority",
                "8259A PIC chip encodes 8 IRQs → 3 bits",
                "OS interrupt table indexed by output",
              ]}
            />
            <RealWorldCard
              icon="📡"
              color="#34d399"
              title="ADC (Analog-to-Digital)"
              items={[
                "Flash ADC uses 2ⁿ comparators",
                "Each comparator = one input line",
                "Encoder converts thermometer code → binary",
                "Fastest ADC architecture",
              ]}
            />
            <RealWorldCard
              icon="🔀"
              color="#a78bfa"
              title="Multiplexer Control"
              items={[
                "Select lines for MUX/DEMUX",
                "Encoder generates select bits",
                "Reduces control wires",
                "Used in memory address logic",
              ]}
            />
          </div>
        </Section>

        {/* SECTION 7: Quiz */}
        <Section
          title="🧪 Test Yourself — Quiz with Hints & Streaks"
          accent="#6366f1"
        >
          <Quiz />
        </Section>
      </div>

      <TipsPanel />
    </div>
  );
};

export default EncoderPage;
