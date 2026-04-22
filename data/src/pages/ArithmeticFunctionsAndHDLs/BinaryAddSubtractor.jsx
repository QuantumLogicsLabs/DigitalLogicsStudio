import React, { useState } from "react";
import ToolLayout from "../../components/ToolLayout";
import AFHDLDivider from "./components/AFHDLDivider";
import {
  cleanBin,
  binaryAdd,
  binarySubtract,
} from "../../utils/arithmeticHelpers";

/* ── HELPERS ──────────────────────────────────────────────── */
const pad = (a, b) => {
  const len = Math.max(a.length, b.length, 1);
  return [a.padStart(len, "0"), b.padStart(len, "0")];
};
const xorWithMode = (bin, mode) =>
  bin
    .split("")
    .map((bit) => (parseInt(bit) ^ parseInt(mode)).toString())
    .join("");
const twosComp = (bin) => {
  const inv = bin
    .split("")
    .map((b) => (b === "1" ? "0" : "1"))
    .join("");
  return (parseInt(inv, 2) + 1).toString(2).padStart(bin.length, "0");
};
const toggleBit = (bin, idx) => {
  const arr = bin.split("");
  arr[idx] = arr[idx] === "0" ? "1" : "0";
  return arr.join("");
};

const QUIZ = [
  {
    q: "What does Mode=0 do in a combined adder/subtractor?",
    opts: [
      "Subtracts B from A",
      "Adds A and B",
      "Clears all bits",
      "Inverts A",
    ],
    ans: 1,
  },
  {
    q: "What does Mode=1 do?",
    opts: [
      "Adds A and B",
      "Multiplies A and B",
      "Subtracts B from A using 2's complement",
      "Does nothing",
    ],
    ans: 2,
  },
  {
    q: "In subtract mode, B is XOR'd with Mode (1). What does this do?",
    opts: [
      "Adds 1 to B",
      "Flips all bits of B (1's complement)",
      "Doubles B",
      "Clears B",
    ],
    ans: 1,
  },
  {
    q: "Why is Mode also used as the Carry-In?",
    opts: [
      "To reset the adder",
      "Adding 1 after bit-flip gives 2's complement = -B",
      "It speeds up the circuit",
      "It detects overflow",
    ],
    ans: 1,
  },
  {
    q: "How many XOR gates are needed for a 4-bit adder/subtractor?",
    opts: ["1", "2", "4", "8"],
    ans: 2,
  },
  {
    q: "A + (~B) + 1 is the same as:",
    opts: ["A + B", "A - B", "A * B", "A / B"],
    ans: 1,
  },
];

/* ── COMPONENT ────────────────────────────────────────────── */
const BinaryAddSubtractor = () => {
  const [a, setA] = useState("1011");
  const [b, setB] = useState("0101");
  const [mode, setMode] = useState("add");
  const [showXOR, setShowXOR] = useState(false);
  const [showHardware, setShowHardware] = useState(false);
  const [showSideBySide, setShowSideBySide] = useState(false);
  const [showHDL, setShowHDL] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [showOverflow, setShowOverflow] = useState(false);

  const cleanA = cleanBin(a) || "0";
  const cleanB = cleanBin(b) || "0";
  const [paddedA, paddedB] = pad(cleanA, cleanB);
  const modeBit = mode === "add" ? "0" : "1";
  const bXored = xorWithMode(paddedB, modeBit);
  const internalAdd = binaryAdd(paddedA, bXored, modeBit);
  const addR = binaryAdd(paddedA, paddedB);
  const subR = binarySubtract(paddedA, paddedB);
  const aDecimal = parseInt(paddedA, 2);
  const bDecimal = parseInt(paddedB, 2);
  const addDec = aDecimal + bDecimal;
  const subDec = aDecimal - bDecimal;
  const isSubNeg = subDec < 0;
  const activeResult =
    mode === "add"
      ? { val: addR.sum, extra: addR.carry, dec: addDec, isNeg: false }
      : { val: subR.diff, extra: subR.borrow, dec: subDec, isNeg: isSubNeg };

  const examples = [
    { label: "Simple add", a: "0101", b: "0011", mode: "add" },
    { label: "Simple sub", a: "1010", b: "0011", mode: "subtract" },
    { label: "Carry out", a: "1111", b: "0001", mode: "add" },
    { label: "Borrow out", a: "0100", b: "0111", mode: "subtract" },
    { label: "A = B", a: "1010", b: "1010", mode: "subtract" },
  ];

  const handleQ = (i) => {
    setQuizAnswer(i);
    if (i === QUIZ[quizIdx].ans) setQuizScore((s) => s + 1);
  };
  const nextQ = () => {
    if (quizIdx + 1 >= QUIZ.length) setQuizDone(true);
    else {
      setQuizIdx((i) => i + 1);
      setQuizAnswer(null);
    }
  };
  const resetQuiz = () => {
    setQuizIdx(0);
    setQuizAnswer(null);
    setQuizScore(0);
    setQuizDone(false);
  };

  const EXPLAIN_STEPS = [
    {
      title: "You have A and B",
      body: `A = ${paddedA} (${aDecimal}₁₀)\nB = ${paddedB} (${bDecimal}₁₀)`,
      color: "#60a5fa",
    },
    {
      title: "Mode bit decides what to do",
      body: `Mode = ${modeBit}  →  ${mode === "add" ? "Addition (A + B)" : "Subtraction (A - B)"}`,
      color: "#6366f1",
    },
    {
      title: `B is XOR'd with Mode (${modeBit})`,
      body:
        mode === "add"
          ? `B XOR 0 = B  (unchanged)\n${paddedB} XOR 0…0 = ${bXored}`
          : `B XOR 1 = NOT B  (all bits flipped)\n${paddedB} XOR 1…1 = ${bXored}`,
      color: "#c084fc",
    },
    {
      title: "Adder computes A + B̃ + Cin (=Mode)",
      body: `  ${paddedA}\n+ ${bXored}  (B̃)\n+ ${modeBit}  (Cin = Mode)\n= ${internalAdd.sum}  carry=${internalAdd.carry}`,
      color: "#f59e0b",
    },
    {
      title: "Final answer",
      body: `${paddedA} ${mode === "add" ? "+" : "−"} ${paddedB} = ${activeResult.val}₂ = ${activeResult.dec}₁₀`,
      color: "#4ade80",
    },
  ];
  const [explainStep, setExplainStep] = useState(0);

  const modeColor = mode === "add" ? "#22c55e" : "#f87171";

  return (
    <ToolLayout
      title="Binary Adder / Subtractor"
      subtitle="One circuit, two operations — controlled by a single Mode bit"
    >
      {/* ══ THE BIG IDEA ══════════════════════════════════════ */}
      <div style={S.sectionTitle}>💡 The Big Idea</div>
      <div style={{ ...S.conceptBox("#6366f1") }}>
        <strong>One circuit that does both Add AND Subtract!</strong>
        <p style={{ ...S.body, marginTop: "0.4rem" }}>
          Instead of building separate hardware for addition and subtraction, we
          can reuse the same adder for both operations. The trick:{" "}
          <strong>A − B = A + (−B)</strong>, and we can get −B in binary using
          two's complement (flip bits + add 1).
        </p>
        <div style={S.formula}>
          ADD: A + B + 0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→
          Mode = 0, B̃ = B (unchanged), Cin = 0{"\n"}
          SUBTRACT: A + (NOT B) + 1 → Mode = 1, B̃ = NOT B (flipped), Cin = 1
        </div>
        <p style={{ ...S.body }}>
          Both operations use the <strong>same adder</strong>. Just XOR B with
          the Mode bit, and feed Mode as the Carry-In. 🎉
        </p>
      </div>

      {/* ══ MODE TOGGLE (big visual) ══════════════════════════ */}
      <div style={S.sectionTitle}>⚙️ Choose Mode</div>
      <div
        style={{
          display: "flex",
          gap: "0.7rem",
          margin: "0.5rem 0",
          flexWrap: "wrap",
        }}
      >
        {[
          {
            m: "add",
            label: "➕  ADD",
            sub: "Mode = 0  •  B unchanged",
            color: "#22c55e",
          },
          {
            m: "subtract",
            label: "➖  SUBTRACT",
            sub: "Mode = 1  •  B bits flipped",
            color: "#f87171",
          },
        ].map(({ m, label, sub, color }) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              flex: 1,
              padding: "0.65rem 1rem",
              borderRadius: "10px",
              border: `2px solid ${mode === m ? color : "rgba(148,163,184,0.2)"}`,
              background: mode === m ? `${color}18` : "rgba(30,41,59,0.5)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: "1rem",
                color: mode === m ? color : "#94a3b8",
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#64748b",
                marginTop: "0.15rem",
              }}
            >
              {sub}
            </div>
          </button>
        ))}
      </div>

      {/* ══ CLICKABLE BIT INPUTS ═════════════════════════════ */}
      <div style={S.sectionTitle}>🎛️ Enter Your Numbers</div>
      <div style={{ display: "grid", gap: "0.7rem", margin: "0.5rem 0" }}>
        {[
          {
            label: "A",
            padded: paddedA,
            raw: a,
            setRaw: setA,
            color: "#60a5fa",
          },
          {
            label: "B",
            padded: paddedB,
            raw: b,
            setRaw: setB,
            color: mode === "add" ? "#c084fc" : "#f87171",
          },
        ].map(({ label, padded, raw, setRaw, color }) => (
          <div key={label}>
            <div
              style={{
                fontSize: "0.82rem",
                color: "#94a3b8",
                marginBottom: "0.2rem",
              }}
            >
              {label}: &nbsp;<strong style={{ color }}>{padded}</strong>
              <span style={{ color: "#475569" }}>
                {" "}
                = {parseInt(padded, 2)}₁₀
              </span>
              {label === "B" && mode === "subtract" && (
                <span
                  style={{
                    color: "#f59e0b",
                    marginLeft: "0.5rem",
                    fontSize: "0.75rem",
                  }}
                >
                  → flipped: {bXored}
                </span>
              )}
            </div>
            <div
              style={{
                display: "flex",
                gap: "4px",
                flexWrap: "wrap",
                marginBottom: "0.3rem",
              }}
            >
              {padded.split("").map((bit, i) => (
                <button
                  key={i}
                  onClick={() => setRaw(toggleBit(padded, i))}
                  style={S.bitBtn(bit, color)}
                  title="Click to flip"
                >
                  {bit}
                </button>
              ))}
            </div>
            <input
              className="tool-input"
              value={raw}
              onChange={(e) => setRaw(cleanBin(e.target.value) || "0")}
              placeholder={`Type ${label} in binary`}
            />
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.4rem",
          flexWrap: "wrap",
          margin: "0.4rem 0",
        }}
      >
        {examples.map((ex) => (
          <button
            key={ex.label}
            className="kmap-btn kmap-btn-secondary"
            onClick={() => {
              setA(ex.a);
              setB(ex.b);
              setMode(ex.mode);
            }}
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* ══ LIVE RESULT ══════════════════════════════════════ */}
      <div
        style={{
          ...S.resultBanner,
          borderColor: `${modeColor}50`,
          background: `${modeColor}08`,
        }}
      >
        <div
          style={{
            fontSize: "0.75rem",
            color: "#94a3b8",
            marginBottom: "0.2rem",
          }}
        >
          LIVE RESULT — {mode === "add" ? "ADDITION MODE" : "SUBTRACTION MODE"}{" "}
          (Mode={modeBit})
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "1.05rem",
          }}
        >
          <strong style={{ color: "#60a5fa" }}>{paddedA}</strong>
          <span style={{ color: "#475569" }}>₂ ({aDecimal}₁₀)</span>
          <span style={{ color: modeColor, fontWeight: 700 }}>
            {mode === "add" ? "+" : "−"}
          </span>
          <strong style={{ color: mode === "add" ? "#c084fc" : "#f87171" }}>
            {paddedB}
          </strong>
          <span style={{ color: "#475569" }}>₂ ({bDecimal}₁₀)</span>
          <span style={{ color: "#475569" }}>=</span>
          <strong
            style={{
              color: activeResult.isNeg ? "#f87171" : "#4ade80",
              fontSize: "1.2rem",
            }}
          >
            {activeResult.dec}₁₀ = {activeResult.val}₂
          </strong>
          {(activeResult.extra === "1" || activeResult.extra === 1) && (
            <span
              style={{
                background: "#fbbf2422",
                border: "1px solid #fbbf24",
                borderRadius: "4px",
                padding: "1px 7px",
                fontSize: "0.75rem",
                color: "#fbbf24",
              }}
            >
              {mode === "add" ? "⚠ Carry!" : "⚠ Borrow!"}
            </span>
          )}
        </div>
      </div>

      {/* ══ INTERNAL SIGNALS ══════════════════════════════════ */}
      <div style={S.sectionTitle}>🔬 What's Inside the Circuit?</div>
      <div style={{ display: "grid", gap: "0.4rem" }}>
        {[
          { label: "A input", val: paddedA, color: "#60a5fa", note: "" },
          {
            label: "B input",
            val: paddedB,
            color: mode === "add" ? "#c084fc" : "#f87171",
            note: "",
          },
          {
            label: "Mode bit",
            val: modeBit,
            color: "#6366f1",
            note: mode === "add" ? "(0 = Add)" : "(1 = Subtract)",
          },
          {
            label: `B̃ = B XOR Mode`,
            val: bXored,
            color: "#f59e0b",
            note: mode === "subtract" ? "← bits flipped!" : "← unchanged",
          },
          {
            label: "Carry-In (= Mode)",
            val: modeBit,
            color: "#fbbf24",
            note: "",
          },
          {
            label: "Adder output: A + B̃ + Cin",
            val: `${internalAdd.sum} (carry=${internalAdd.carry})`,
            color: "#4ade80",
            note: "",
          },
        ].map(({ label, val, color, note }) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "rgba(30,41,59,0.5)",
              borderRadius: "6px",
              padding: "0.4rem 0.7rem",
              border: "1px solid rgba(148,163,184,0.12)",
            }}
          >
            <span style={{ color: "#94a3b8", fontSize: "0.82rem" }}>
              {label}
            </span>
            <span
              style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <strong style={{ color, fontFamily: "monospace" }}>{val}</strong>
              {note && (
                <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                  {note}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* ══ STEP-BY-STEP EXPLAINER ════════════════════════════ */}
      <AFHDLDivider />
      <div style={S.sectionTitle}>📚 Step-by-Step: How Does It Work?</div>
      <div
        style={{
          display: "flex",
          gap: "4px",
          flexWrap: "wrap",
          margin: "0.4rem 0",
        }}
      >
        {EXPLAIN_STEPS.map((step, i) => (
          <button
            key={i}
            onClick={() => setExplainStep(i)}
            style={{
              padding: "0.3rem 0.55rem",
              borderRadius: "5px",
              border: `1px solid ${explainStep === i ? step.color : "rgba(148,163,184,0.2)"}`,
              background:
                explainStep === i ? `${step.color}18` : "rgba(30,41,59,0.5)",
              color: explainStep === i ? step.color : "#64748b",
              fontSize: "0.75rem",
              fontWeight: explainStep === i ? 700 : 400,
              cursor: "pointer",
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div
        style={{
          ...S.card,
          border: `1px solid ${EXPLAIN_STEPS[explainStep].color}35`,
        }}
      >
        <div
          style={{
            color: EXPLAIN_STEPS[explainStep].color,
            fontWeight: 700,
            marginBottom: "0.4rem",
          }}
        >
          {EXPLAIN_STEPS[explainStep].title}
        </div>
        <div
          style={{
            ...S.formula,
            borderColor: `${EXPLAIN_STEPS[explainStep].color}25`,
            whiteSpace: "pre",
          }}
        >
          {EXPLAIN_STEPS[explainStep].body}
        </div>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
          <button
            className="kmap-btn kmap-btn-secondary"
            disabled={explainStep === 0}
            onClick={() => setExplainStep((s) => s - 1)}
          >
            ← Back
          </button>
          <button
            className="kmap-btn"
            disabled={explainStep === EXPLAIN_STEPS.length - 1}
            onClick={() => setExplainStep((s) => s + 1)}
          >
            Next →
          </button>
        </div>
      </div>

      {/* ══ XOR BIT-BY-BIT ════════════════════════════════════ */}
      <button
        className="kmap-btn kmap-btn-secondary"
        style={{ width: "100%", margin: "0.3rem 0" }}
        onClick={() => setShowXOR((v) => !v)}
      >
        {showXOR ? "▲ Hide" : "▼ Show"} XOR Walkthrough — why B changes in
        subtract mode
      </button>
      {showXOR && (
        <div style={S.card}>
          <p style={S.body}>
            Each bit of B is XOR'd with the Mode bit. In{" "}
            <strong>add mode</strong>, Mode=0 so B stays the same. In{" "}
            <strong>subtract mode</strong>, Mode=1 so every bit of B is flipped.
          </p>
          <div style={{ display: "grid", gap: "2px", marginTop: "0.5rem" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr 2fr",
                background: "rgba(99,102,241,0.2)",
                borderRadius: "4px",
                padding: "0.3rem 0.5rem",
                fontSize: "0.73rem",
                fontWeight: 700,
                color: "#a5b4fc",
                textAlign: "center",
              }}
            >
              <span>Bit #</span>
              <span>B[i]</span>
              <span>Mode</span>
              <span>B̃[i]</span>
              <span>Effect</span>
            </div>
            {paddedB.split("").map((bit, i) => {
              const xored = (parseInt(bit) ^ parseInt(modeBit)).toString();
              const flipped = xored !== bit;
              return (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr 2fr",
                    background: "rgba(30,41,59,0.5)",
                    borderRadius: "3px",
                    padding: "0.28rem 0.5rem",
                    fontSize: "0.82rem",
                    textAlign: "center",
                    color: "#e2e8f0",
                  }}
                >
                  <span style={{ color: "#475569" }}>bit {i}</span>
                  <span
                    style={{ color: mode === "add" ? "#c084fc" : "#f87171" }}
                  >
                    {bit}
                  </span>
                  <span style={{ color: "#fbbf24" }}>{modeBit}</span>
                  <span
                    style={{
                      color: flipped ? "#f59e0b" : "#4ade80",
                      fontWeight: flipped ? 700 : 400,
                    }}
                  >
                    {xored}
                  </span>
                  <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
                    {flipped ? `${bit}→${xored} flipped` : "unchanged"}
                  </span>
                </div>
              );
            })}
          </div>
          {mode === "subtract" && (
            <div style={{ ...S.note("#f59e0b"), marginTop: "0.5rem" }}>
              After XOR: B̃ = {bXored} (1's complement of B)
              <br />
              Add Cin=1: {bXored} + 1 = {twosComp(paddedB)} (2's complement = −B
              in binary)
              <br />
              So A + B̃ + 1 = A + (−B) = A − B ✓
            </div>
          )}
        </div>
      )}

      {/* ══ SIDE BY SIDE ══════════════════════════════════════ */}
      <button
        className="kmap-btn kmap-btn-secondary"
        style={{ width: "100%", margin: "0.3rem 0" }}
        onClick={() => setShowSideBySide((v) => !v)}
      >
        {showSideBySide ? "▲ Hide" : "▼ Show"} Compare: Both Results Side by
        Side
      </button>
      {showSideBySide && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.6rem",
          }}
        >
          <div style={{ ...S.card, border: "1px solid rgba(34,197,94,0.3)" }}>
            <div
              style={{
                fontWeight: 700,
                color: "#22c55e",
                marginBottom: "0.4rem",
              }}
            >
              ➕ Addition (Mode=0)
            </div>
            <div style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
              {paddedA} + {paddedB}
            </div>
            <div
              style={{
                fontSize: "1.2rem",
                fontWeight: 800,
                color: "#4ade80",
                margin: "0.3rem 0",
              }}
            >
              {addR.sum}
            </div>
            <div style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
              = {addDec}₁₀
            </div>
            {(addR.carry === "1" || addR.carry === 1) && (
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#fbbf24",
                  marginTop: "0.2rem",
                }}
              >
                ⚠ Carry Out = 1
              </div>
            )}
          </div>
          <div style={{ ...S.card, border: "1px solid rgba(248,113,113,0.3)" }}>
            <div
              style={{
                fontWeight: 700,
                color: "#f87171",
                marginBottom: "0.4rem",
              }}
            >
              ➖ Subtraction (Mode=1)
            </div>
            <div style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
              {paddedA} − {paddedB}
            </div>
            <div
              style={{
                fontSize: "1.2rem",
                fontWeight: 800,
                color: isSubNeg ? "#f87171" : "#4ade80",
                margin: "0.3rem 0",
              }}
            >
              {subR.diff}
            </div>
            <div style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
              = {subDec}₁₀{isSubNeg ? " (negative)" : ""}
            </div>
            {(subR.borrow === "1" || subR.borrow === 1) && (
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#f87171",
                  marginTop: "0.2rem",
                }}
              >
                ⚠ Borrow Out = 1
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ HARDWARE ARCHITECTURE ═════════════════════════════ */}
      <button
        className="kmap-btn kmap-btn-secondary"
        style={{ width: "100%", margin: "0.3rem 0" }}
        onClick={() => setShowHardware((v) => !v)}
      >
        {showHardware ? "▲ Hide" : "▼ Show"} Hardware Architecture — how the
        circuit is built
      </button>
      {showHardware && (
        <div style={S.card}>
          <p style={S.body}>
            The circuit needs only <strong>N XOR gates</strong> (one per bit of
            B) plus a standard adder:
          </p>
          <div style={{ display: "grid", gap: "0.4rem", marginTop: "0.5rem" }}>
            {[
              {
                step: "1",
                color: "#6366f1",
                text: "Mode wire (0 or 1) is your on/off switch for subtract.",
              },
              {
                step: "2",
                color: "#c084fc",
                text: `For each bit of B: XOR gate with Mode. B̃[i] = B[i] XOR Mode. In add mode: B̃ = B. In subtract mode: B̃ = NOT B.`,
              },
              {
                step: "3",
                color: "#f59e0b",
                text: "The Mode wire also connects directly to the Carry-In of the adder (Cin = Mode).",
              },
              {
                step: "4",
                color: "#10b981",
                text: "Adder receives A, B̃, and Cin=Mode and produces A + B̃ + Mode.",
              },
              {
                step: "5",
                color: "#4ade80",
                text: "Add mode: A + B + 0 = A + B ✓  |  Subtract mode: A + (NOT B) + 1 = A − B ✓",
              },
            ].map(({ step, color, text }) => (
              <div
                key={step}
                style={{
                  display: "flex",
                  gap: "0.6rem",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    minWidth: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: `${color}30`,
                    border: `1px solid ${color}60`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color,
                    fontWeight: 700,
                    fontSize: "0.75rem",
                  }}
                >
                  {step}
                </div>
                <div style={{ ...S.body, margin: 0, paddingTop: "2px" }}>
                  {text}
                </div>
              </div>
            ))}
          </div>
          <div style={{ ...S.note("#6366f1"), marginTop: "0.6rem" }}>
            💡 This design saves ~50% chip area vs. building separate add and
            subtract circuits. It is used in virtually every ALU (Arithmetic
            Logic Unit) ever designed.
          </div>
        </div>
      )}

      {/* ══ HDL ══════════════════════════════════════════════ */}
      <button
        className="kmap-btn kmap-btn-secondary"
        style={{ width: "100%", margin: "0.3rem 0" }}
        onClick={() => setShowHDL((v) => !v)}
      >
        {showHDL ? "▲ Hide" : "▼ Show"} Verilog Code
      </button>
      {showHDL && (
        <div style={S.card}>
          <div style={S.codeBlock}>
            <pre
              style={{
                margin: 0,
                color: "#e2e8f0",
                fontSize: "0.75rem",
                lineHeight: 1.65,
              }}
            >{`// 4-bit Adder/Subtractor in Verilog
// Mode=0 → A + B
// Mode=1 → A - B  (using 2's complement of B)

module adder_subtractor (
  input  [3:0] A, B,
  input        Mode,
  output [3:0] Result,
  output       Carry_Borrow
);
  wire [3:0] B_modified;
  wire [4:0] sum;

  // XOR every bit of B with Mode
  // {4{Mode}} = repeat Mode 4 times = 0000 or 1111
  assign B_modified = B ^ {4{Mode}};

  // Add A + B_modified + Mode (Mode is carry-in too)
  assign sum         = A + B_modified + Mode;
  assign Result      = sum[3:0];
  assign Carry_Borrow = sum[4];
endmodule`}</pre>
          </div>
        </div>
      )}

      {/* ══ OVERFLOW GUIDE ════════════════════════════════════ */}
      <button
        className="kmap-btn kmap-btn-secondary"
        style={{ width: "100%", margin: "0.3rem 0" }}
        onClick={() => setShowOverflow((v) => !v)}
      >
        {showOverflow ? "▲ Hide" : "▼ Show"} Overflow & Borrow — when results
        don't fit
      </button>
      {showOverflow && (
        <div style={S.card}>
          <div style={{ display: "grid", gap: "2px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 2fr 2fr",
                background: "rgba(99,102,241,0.2)",
                borderRadius: "4px",
                padding: "0.3rem 0.5rem",
                fontSize: "0.73rem",
                fontWeight: 700,
                color: "#a5b4fc",
                textAlign: "center",
              }}
            >
              <span>Situation</span>
              <span>Mode</span>
              <span>Signal</span>
              <span>Meaning</span>
            </div>
            {[
              [
                "A + B too large",
                "0 (Add)",
                "Carry=1 ⚠",
                "Result overflows n bits",
              ],
              ["A + B fits", "0 (Add)", "Carry=0 ✓", "Result fits fine"],
              ["A < B", "1 (Sub)", "Borrow=1 ⚠", "Result is negative"],
              ["A ≥ B", "1 (Sub)", "Borrow=0 ✓", "Result is zero or positive"],
            ].map(([sit, m, sig, mean]) => (
              <div
                key={sit}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 2fr 2fr",
                  background: "rgba(30,41,59,0.5)",
                  borderRadius: "3px",
                  padding: "0.3rem 0.5rem",
                  fontSize: "0.8rem",
                  textAlign: "center",
                  color: "#e2e8f0",
                }}
              >
                <span style={{ textAlign: "left" }}>{sit}</span>
                <span style={{ color: "#fbbf24" }}>{m}</span>
                <span
                  style={{ color: sig.includes("⚠") ? "#f87171" : "#4ade80" }}
                >
                  {sig}
                </span>
                <span style={{ color: "#94a3b8", fontSize: "0.72rem" }}>
                  {mean}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ QUIZ ══════════════════════════════════════════════ */}
      <AFHDLDivider />
      <div style={S.sectionTitle}>🧠 Quick Quiz</div>
      {!quizMode ? (
        <button
          className="kmap-btn"
          onClick={() => {
            setQuizMode(true);
            resetQuiz();
          }}
        >
          Start Quiz ({QUIZ.length} questions)
        </button>
      ) : quizDone ? (
        <div style={S.card}>
          <div
            style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              color: "#4ade80",
              marginBottom: "0.3rem",
            }}
          >
            {quizScore >= 5
              ? "🎉 Excellent!"
              : quizScore >= 3
                ? "👍 Good!"
                : "📚 Keep going!"}
          </div>
          <p style={{ color: "#cbd5e1" }}>
            Score: <strong style={{ color: "#4ade80" }}>{quizScore}</strong> /{" "}
            {QUIZ.length}
          </p>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <button className="kmap-btn" onClick={resetQuiz}>
              Try Again
            </button>
            <button
              className="kmap-btn kmap-btn-secondary"
              onClick={() => setQuizMode(false)}
            >
              Exit
            </button>
          </div>
        </div>
      ) : (
        <div style={S.card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
              Q {quizIdx + 1}/{QUIZ.length}
            </span>
            <span style={{ color: "#4ade80", fontSize: "0.8rem" }}>
              Score: {quizScore}
            </span>
          </div>
          <div
            style={{
              height: "4px",
              background: "rgba(148,163,184,0.15)",
              borderRadius: "2px",
              marginBottom: "0.8rem",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(quizIdx / QUIZ.length) * 100}%`,
                background: "#6366f1",
                borderRadius: "2px",
                transition: "width 0.3s",
              }}
            />
          </div>
          <div
            style={{
              color: "#e2e8f0",
              fontWeight: 600,
              fontSize: "0.9rem",
              marginBottom: "0.7rem",
            }}
          >
            {QUIZ[quizIdx].q}
          </div>
          <div style={{ display: "grid", gap: "0.4rem" }}>
            {QUIZ[quizIdx].opts.map((opt, i) => {
              const isCorrect = i === QUIZ[quizIdx].ans;
              const selected = quizAnswer === i;
              let bg = "rgba(30,41,59,0.7)",
                border = "rgba(148,163,184,0.2)";
              if (quizAnswer !== null) {
                if (isCorrect) {
                  bg = "rgba(74,222,128,0.15)";
                  border = "#4ade80";
                } else if (selected) {
                  bg = "rgba(248,113,113,0.15)";
                  border = "#f87171";
                }
              }
              return (
                <button
                  key={i}
                  disabled={quizAnswer !== null}
                  onClick={() => handleQ(i)}
                  style={{
                    background: bg,
                    border: `1px solid ${border}`,
                    borderRadius: "6px",
                    padding: "0.5rem 0.8rem",
                    color: "#e2e8f0",
                    textAlign: "left",
                    cursor: quizAnswer !== null ? "default" : "pointer",
                    fontSize: "0.87rem",
                    transition: "all 0.2s",
                  }}
                >
                  {quizAnswer !== null &&
                    (isCorrect ? "✅ " : selected ? "❌ " : "")}
                  {opt}
                </button>
              );
            })}
          </div>
          {quizAnswer !== null && (
            <button
              className="kmap-btn"
              style={{ marginTop: "0.7rem", width: "100%" }}
              onClick={nextQ}
            >
              {quizIdx + 1 >= QUIZ.length ? "See Results →" : "Next →"}
            </button>
          )}
        </div>
      )}
    </ToolLayout>
  );
};

/* ── STYLES ──────────────────────────────────────────────── */
const S = {
  sectionTitle: {
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "#e2e8f0",
    margin: "1rem 0 0.3rem",
  },
  body: {
    color: "#cbd5e1",
    fontSize: "0.88rem",
    lineHeight: 1.65,
    margin: "0.2rem 0",
  },
  card: {
    background: "rgba(30,41,59,0.7)",
    border: "1px solid rgba(148,163,184,0.15)",
    borderRadius: "10px",
    padding: "0.9rem 1rem",
    marginTop: "0.4rem",
  },
  formula: {
    background: "rgba(15,23,42,0.75)",
    border: "1px solid rgba(148,163,184,0.18)",
    borderRadius: "6px",
    padding: "0.5rem 0.8rem",
    fontFamily: "monospace",
    fontSize: "0.82rem",
    color: "#a5b4fc",
    margin: "0.5rem 0",
    lineHeight: 1.8,
  },
  codeBlock: {
    background: "rgba(15,23,42,0.85)",
    border: "1px solid rgba(148,163,184,0.12)",
    borderRadius: "6px",
    padding: "0.7rem 1rem",
    overflowX: "auto",
  },
  resultBanner: {
    borderRadius: "10px",
    padding: "0.65rem 1rem",
    margin: "0.6rem 0",
  },
  note: (c) => ({
    background: `${c}12`,
    border: `1px solid ${c}35`,
    borderRadius: "6px",
    padding: "0.5rem 0.75rem",
    fontSize: "0.82rem",
    color: "#e2e8f0",
    lineHeight: 1.55,
  }),
  conceptBox: (c) => ({
    background: `${c}12`,
    border: `1px solid ${c}40`,
    borderLeft: `3px solid ${c}`,
    borderRadius: "8px",
    padding: "0.75rem 0.9rem",
  }),
  bitBtn: (bit, c) => ({
    width: "32px",
    height: "32px",
    borderRadius: "5px",
    border: `2px solid ${bit === "1" ? c : "rgba(148,163,184,0.2)"}`,
    background: bit === "1" ? `${c}20` : "rgba(30,41,59,0.6)",
    color: bit === "1" ? c : "#475569",
    fontWeight: 800,
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 0.1s",
  }),
};

export default BinaryAddSubtractor;
