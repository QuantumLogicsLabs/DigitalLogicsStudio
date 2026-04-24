import React, { useState, useMemo, useEffect, useCallback } from "react";
import ToolLayout from "../../components/ToolLayout";
import AFHDLDivider from "./components/AFHDLDivider";
import { cleanBin, binarySubtract } from "../../utils/arithmeticHelpers";

/* ── HELPERS ──────────────────────────────────────────────── */
const pad = (a, b) => {
  const len = Math.max(a.length, b.length, 1);
  return [a.padStart(len, "0"), b.padStart(len, "0")];
};

const buildBorrowTrace = (rawA, rawB) => {
  const [a, b] = pad(rawA || "0", rawB || "0");
  let borrow = 0;
  const trace = [];
  for (let i = a.length - 1; i >= 0; i--) {
    const ai = parseInt(a[i], 10);
    const bi = parseInt(b[i], 10);
    let diff = ai - bi - borrow;
    let nextBorrow = 0;
    if (diff < 0) {
      diff += 2;
      nextBorrow = 1;
    }
    trace.unshift({ pos: a.length - 1 - i, ai, bi, borrow, diff, nextBorrow });
    borrow = nextBorrow;
  }
  return { trace, finalBorrow: borrow };
};

const flipBits = (bin) =>
  bin
    .split("")
    .map((b) => (b === "1" ? "0" : "1"))
    .join("");
const twosComp = (bin) => {
  const inv = flipBits(bin);
  return (parseInt(inv, 2) + 1).toString(2).padStart(bin.length, "0");
};
const toggleBit = (bin, idx) => {
  const arr = bin.split("");
  arr[idx] = arr[idx] === "0" ? "1" : "0";
  return arr.join("");
};

const QUIZ = [
  {
    q: "What happens when A[i] < B[i] in binary subtraction?",
    opts: [
      "We skip that bit",
      "We borrow from the next column",
      "We set the result to 0",
      "We overflow",
    ],
    ans: 1,
  },
  {
    q: "What is the 2's complement of 0011?",
    opts: ["1100", "1101", "0011", "1111"],
    ans: 1,
  },
  {
    q: "How does 2's complement help with subtraction?",
    opts: [
      "It adds extra bits",
      "It turns A-B into A + (-B)",
      "It removes the carry",
      "It doubles the number",
    ],
    ans: 1,
  },
  {
    q: "A - B where A < B gives a borrow-out of:",
    opts: [
      "0 (no issue)",
      "1 (negative result)",
      "2 (overflow)",
      "depends on hardware",
    ],
    ans: 1,
  },
  {
    q: "1's complement of 1010 is:",
    opts: ["0101", "1011", "0110", "1001"],
    ans: 0,
  },
  {
    q: "In a Full Subtractor, Borrow-Out formula is:",
    opts: [
      "(NOT A) AND B",
      "(NOT A AND B) OR (Borrow AND (A XNOR B))",
      "(A AND B)",
      "A XOR B",
    ],
    ans: 1,
  },
];

/* ── COMPONENT ────────────────────────────────────────────── */
const BinarySubtractor = () => {
  const [a, setA] = useState("1100");
  const [b, setB] = useState("0011");
  const [showTruthTable, setShowTruthTable] = useState(false);
  const [showHDL, setShowHDL] = useState(false);
  const [animStep, setAnimStep] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [quizMode, setQuizMode] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [twosStep, setTwosStep] = useState(0);

  const cleanA = cleanBin(a) || "0";
  const cleanB = cleanBin(b) || "0";
  const [paddedA, paddedB] = pad(cleanA, cleanB);

  const result = binarySubtract(cleanA, cleanB);
  const { trace, finalBorrow } = useMemo(
    () => buildBorrowTrace(cleanA, cleanB),
    [cleanA, cleanB],
  );
  const aDecimal = parseInt(paddedA, 2);
  const bDecimal = parseInt(paddedB, 2);
  const trueResult = aDecimal - bDecimal;
  const isNeg = trueResult < 0;

  const onesB = flipBits(paddedB);
  const twosB = twosComp(paddedB);
  const rawTwosSum = (parseInt(paddedA, 2) + parseInt(twosB, 2)).toString(2);
  const twosResult =
    rawTwosSum.length > paddedA.length
      ? rawTwosSum.slice(-paddedA.length)
      : rawTwosSum.padStart(paddedA.length, "0");
  const hasOverflowBit = rawTwosSum.length > paddedA.length;

  const TWOS_STEPS = [
    {
      label: "Step 1: Original numbers",
      detail: `A = ${paddedA}  (decimal ${aDecimal})\nB = ${paddedB}  (decimal ${bDecimal})`,
      color: "#60a5fa",
    },
    {
      label: "Step 2: Flip all bits of B (1's complement)",
      detail: `B = ${paddedB}\nNOT B = ${onesB}  ← every bit flipped`,
      color: "#c084fc",
    },
    {
      label: "Step 3: Add 1 to get 2's complement",
      detail: `NOT B = ${onesB}\n+          1\n= ${twosB}  ← this is -B in binary`,
      color: "#f59e0b",
    },
    {
      label: "Step 4: Add A + 2's complement(B)",
      detail: `  ${paddedA}  (A)\n+ ${twosB}  (-B)\n= ${rawTwosSum}  (raw sum)`,
      color: "#10b981",
    },
    {
      label: hasOverflowBit
        ? "Step 5: Discard overflow bit → result"
        : "Step 5: Result (no overflow bit)",
      detail: hasOverflowBit
        ? `${rawTwosSum} → drop leading 1 → ${twosResult}\n= ${parseInt(twosResult, 2)}₁₀  ✓`
        : `${twosResult} = ${parseInt(twosResult, 2)}₁₀  ✓`,
      color: "#4ade80",
    },
  ];

  const examples = [
    { label: "A > B", a: "1100", b: "0011" },
    { label: "A = B (zero)", a: "1010", b: "1010" },
    { label: "A < B (neg)", a: "0011", b: "1100" },
    { label: "One bit", a: "1", b: "1" },
    { label: "8-bit", a: "11110000", b: "01010101" },
  ];

  const startAnim = useCallback(() => {
    setAnimStep(-1);
    setIsAnimating(true);
  }, []);
  useEffect(() => {
    if (!isAnimating) return;
    if (animStep >= trace.length) {
      setIsAnimating(false);
      return;
    }
    const t = setTimeout(() => setAnimStep((s) => s + 1), 650);
    return () => clearTimeout(t);
  }, [isAnimating, animStep, trace.length]);

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

  return (
    <ToolLayout
      title="Binary Subtractor"
      subtitle="Borrow Method · Two's Complement · Interactive Visualizer"
    >
      {/* ══ WHAT IS SUBTRACTION ══════════════════════════════ */}
      <div style={S.sectionTitle}>📖 What is Binary Subtraction?</div>
      <p style={S.body}>
        Binary subtraction computes <strong>A − B</strong>. There are two
        methods:
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.6rem",
          margin: "0.6rem 0",
        }}
      >
        <div style={S.conceptCard("#ef4444")}>
          <div style={{ fontWeight: 700, marginBottom: "0.2rem" }}>
            🔴 Borrow Method
          </div>
          <div style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>
            Subtract bit by bit, borrow from the next column when needed. Just
            like decimal subtraction.
          </div>
        </div>
        <div style={S.conceptCard("#8b5cf6")}>
          <div style={{ fontWeight: 700, marginBottom: "0.2rem" }}>
            🟣 Two's Complement
          </div>
          <div style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>
            Convert B to −B (flip bits + add 1), then simply add A + (−B). This
            is how real CPUs work.
          </div>
        </div>
      </div>
      <div style={{ ...S.note("#6366f1"), marginBottom: "0.4rem" }}>
        💡 <strong>Key insight:</strong> A − B = A + (−B). Two's complement IS
        the binary representation of a negative number. So subtraction becomes
        addition!
      </div>

      {/* ══ CLICKABLE BIT INPUTS ═════════════════════════════ */}
      <div style={S.sectionTitle}>🎛️ Enter Your Numbers</div>
      <p style={S.body}>
        Type or <strong>click any bit to flip it</strong>.
      </p>

      <div style={{ display: "grid", gap: "0.7rem", margin: "0.5rem 0" }}>
        {[
          {
            label: "A (subtract FROM)",
            padded: paddedA,
            raw: a,
            setRaw: setA,
            color: "#60a5fa",
          },
          {
            label: "B (number to subtract)",
            padded: paddedB,
            raw: b,
            setRaw: setB,
            color: "#f87171",
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
              placeholder={`Type ${label.split(" ")[0]} in binary`}
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
          borderColor: isNeg ? "rgba(248,113,113,0.4)" : "rgba(74,222,128,0.4)",
          background: isNeg
            ? "rgba(248,113,113,0.07)"
            : "rgba(74,222,128,0.07)",
        }}
      >
        <div
          style={{
            fontSize: "0.75rem",
            color: "#94a3b8",
            marginBottom: "0.2rem",
          }}
        >
          LIVE RESULT — Borrow Method
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "0.35rem",
            fontSize: "1rem",
          }}
        >
          <strong style={{ color: "#60a5fa" }}>{paddedA}</strong>
          <span style={{ color: "#475569" }}>₂ ({aDecimal}₁₀)</span>
          <span style={{ color: "#475569" }}>−</span>
          <strong style={{ color: "#f87171" }}>{paddedB}</strong>
          <span style={{ color: "#475569" }}>₂ ({bDecimal}₁₀)</span>
          <span style={{ color: "#475569" }}>=</span>
          <strong
            style={{
              color: isNeg ? "#f87171" : "#4ade80",
              fontSize: "1.15rem",
            }}
          >
            {trueResult}₁₀ = {result.diff}₂
          </strong>
          {isNeg && (
            <span
              style={{
                background: "#f8717122",
                border: "1px solid #f87171",
                borderRadius: "4px",
                padding: "1px 7px",
                fontSize: "0.75rem",
                color: "#f87171",
              }}
            >
              ⚠ A &lt; B → Borrow!
            </span>
          )}
        </div>
        <div
          style={{ marginTop: "0.3rem", fontSize: "0.82rem", color: "#94a3b8" }}
        >
          Difference ={" "}
          <strong style={{ color: "#4ade80" }}>{result.diff}</strong>{" "}
          &nbsp;&nbsp; Borrow Out ={" "}
          <strong
            style={{
              color:
                result.borrow === "1" || result.borrow === 1
                  ? "#f87171"
                  : "#475569",
            }}
          >
            {result.borrow}
          </strong>
        </div>
      </div>

      {/* ══ ANIMATED BORROW TRACE ════════════════════════════ */}
      <div style={S.sectionTitle}>🎬 Animated Borrow Flow</div>
      <p style={S.body}>
        Watch how borrows travel from right to left, column by column:
      </p>

      <button
        className="kmap-btn"
        onClick={startAnim}
        disabled={isAnimating}
        style={{ margin: "0.3rem 0 0.6rem" }}
      >
        {isAnimating ? "⏳ Animating…" : "▶ Animate Borrow"}
      </button>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "5px",
          flexWrap: "wrap",
        }}
      >
        {trace.map((row, i) => {
          const revealed = animStep >= i || animStep === -1;
          const isActive = animStep === i;
          return (
            <div
              key={row.pos}
              onClick={() => setHighlightedRow(highlightedRow === i ? null : i)}
              style={{
                background: isActive
                  ? "rgba(239,68,68,0.25)"
                  : highlightedRow === i
                    ? "rgba(99,102,241,0.2)"
                    : "rgba(30,41,59,0.65)",
                border: `1px solid ${isActive ? "#ef4444" : highlightedRow === i ? "#6366f1" : "rgba(148,163,184,0.18)"}`,
                borderRadius: "8px",
                padding: "0.45rem 0.5rem",
                minWidth: "52px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s",
                opacity: isAnimating && !revealed ? 0.2 : 1,
              }}
            >
              <div style={{ fontSize: "0.6rem", color: "#475569" }}>
                bit {row.pos}
              </div>
              <div style={{ color: "#60a5fa", fontWeight: 700 }}>{row.ai}</div>
              <div style={{ color: "#f87171", fontWeight: 700 }}>{row.bi}</div>
              <div
                style={{
                  borderTop: "1px solid rgba(148,163,184,0.15)",
                  marginTop: "2px",
                  paddingTop: "2px",
                }}
              >
                <div
                  style={{
                    fontSize: "0.62rem",
                    color: row.borrow ? "#f87171" : "#475569",
                  }}
                >
                  B↓{row.borrow}
                </div>
                <div
                  style={{
                    color: "#4ade80",
                    fontWeight: 800,
                    fontSize: "0.95rem",
                  }}
                >
                  {row.diff}
                </div>
                <div
                  style={{
                    fontSize: "0.62rem",
                    color: row.nextBorrow ? "#f87171" : "#475569",
                  }}
                >
                  B→{row.nextBorrow}
                </div>
              </div>
            </div>
          );
        })}
        <div
          style={{
            background: finalBorrow
              ? "rgba(248,113,113,0.15)"
              : "rgba(30,41,59,0.4)",
            border: `1px solid ${finalBorrow ? "#f87171" : "rgba(148,163,184,0.12)"}`,
            borderRadius: "8px",
            padding: "0.45rem 0.5rem",
            minWidth: "52px",
            textAlign: "center",
            opacity: isAnimating && animStep < trace.length ? 0.2 : 1,
            transition: "opacity 0.3s",
          }}
        >
          <div style={{ fontSize: "0.6rem", color: "#475569" }}>borrow</div>
          <div
            style={{
              fontWeight: 800,
              color: finalBorrow ? "#f87171" : "#475569",
            }}
          >
            {finalBorrow}
          </div>
        </div>
      </div>
      <p style={{ fontSize: "0.75rem", color: "#475569", marginTop: "0.3rem" }}>
        👆 Click any column for details. B↓ = borrow-in, B→ = borrow-out.
      </p>

      {highlightedRow !== null && trace[highlightedRow] && (
        <div style={{ ...S.note("#10b981"), margin: "0.4rem 0" }}>
          <strong>Bit {trace[highlightedRow].pos} detail:</strong> &nbsp; A[
          {trace[highlightedRow].pos}]={trace[highlightedRow].ai}, B[
          {trace[highlightedRow].pos}]={trace[highlightedRow].bi}, Borrow-In=
          {trace[highlightedRow].borrow}
          <br />
          {trace[highlightedRow].ai} − {trace[highlightedRow].bi} −{" "}
          {trace[highlightedRow].borrow} ={" "}
          {trace[highlightedRow].ai -
            trace[highlightedRow].bi -
            trace[highlightedRow].borrow}
          {trace[highlightedRow].nextBorrow
            ? " → borrow! add 2 → diff = " + trace[highlightedRow].diff
            : " = " + trace[highlightedRow].diff}
          <br />
          Borrow-Out = <strong>{trace[highlightedRow].nextBorrow}</strong>
        </div>
      )}

      {/* ══ TWO'S COMPLEMENT STEP THROUGH ════════════════════ */}
      <AFHDLDivider />
      <div style={S.sectionTitle}>
        🔮 Two's Complement Method — Step Through
      </div>
      <p style={S.body}>
        This is how every real CPU does subtraction. Click through each step:
      </p>

      {/* Step indicators */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          flexWrap: "wrap",
          margin: "0.5rem 0",
        }}
      >
        {TWOS_STEPS.map((step, i) => (
          <button
            key={i}
            onClick={() => setTwosStep(i)}
            style={{
              padding: "0.3rem 0.6rem",
              borderRadius: "5px",
              border: `1px solid ${twosStep === i ? step.color : "rgba(148,163,184,0.2)"}`,
              background:
                twosStep === i ? `${step.color}20` : "rgba(30,41,59,0.5)",
              color: twosStep === i ? step.color : "#64748b",
              fontSize: "0.75rem",
              fontWeight: twosStep === i ? 700 : 400,
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
          border: `1px solid ${TWOS_STEPS[twosStep].color}40`,
        }}
      >
        <div
          style={{
            color: TWOS_STEPS[twosStep].color,
            fontWeight: 700,
            marginBottom: "0.5rem",
          }}
        >
          {TWOS_STEPS[twosStep].label}
        </div>
        <div
          style={{
            ...S.formula,
            borderColor: `${TWOS_STEPS[twosStep].color}30`,
          }}
        >
          {TWOS_STEPS[twosStep].detail}
        </div>
        {twosStep === 2 && (
          <div style={S.note("#f59e0b")}>
            💡 Two's complement of B = flip all bits, then add 1. This
            represents −B in binary!
          </div>
        )}
        {twosStep === 4 && (
          <div style={S.note("#4ade80")}>
            ✅ Final answer: {aDecimal} − {bDecimal} = {trueResult}
            {isNeg ? " (negative! MSB of result is 1 in two's complement)" : ""}
          </div>
        )}
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.6rem" }}>
          <button
            className="kmap-btn kmap-btn-secondary"
            disabled={twosStep === 0}
            onClick={() => setTwosStep((s) => s - 1)}
          >
            ← Back
          </button>
          <button
            className="kmap-btn"
            disabled={twosStep === TWOS_STEPS.length - 1}
            onClick={() => setTwosStep((s) => s + 1)}
          >
            Next →
          </button>
        </div>
      </div>

      {/* ══ TRUTH TABLES ══════════════════════════════════════ */}
      <AFHDLDivider />
      <button
        className="kmap-btn kmap-btn-secondary"
        style={{ width: "100%", margin: "0.3rem 0" }}
        onClick={() => setShowTruthTable((v) => !v)}
      >
        {showTruthTable ? "▲ Hide" : "▼ Show"} Half & Full Subtractor Truth
        Tables
      </button>
      {showTruthTable && (
        <div>
          <div style={S.card}>
            <div
              style={{
                fontWeight: 700,
                color: "#ef4444",
                marginBottom: "0.4rem",
              }}
            >
              Half Subtractor (no borrow-in)
            </div>
            <p style={S.body}>
              D = A XOR B &nbsp;&nbsp; Borrow = (NOT A) AND B
            </p>
            <div style={{ display: "grid", gap: "2px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  background: "rgba(99,102,241,0.2)",
                  borderRadius: "4px",
                  padding: "0.3rem 0.5rem",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  color: "#a5b4fc",
                  textAlign: "center",
                }}
              >
                <span>A</span>
                <span>B</span>
                <span style={{ color: "#4ade80" }}>Diff</span>
                <span style={{ color: "#f87171" }}>Borrow</span>
              </div>
              {[
                [0, 0, 0, 0],
                [0, 1, 1, 1],
                [1, 0, 1, 0],
                [1, 1, 0, 0],
              ].map(([ai, bi, d, bo]) => {
                const match =
                  ai === parseInt(paddedA.slice(-1)) &&
                  bi === parseInt(paddedB.slice(-1));
                return (
                  <div
                    key={`${ai}${bi}`}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr 1fr",
                      background: match
                        ? "rgba(99,102,241,0.25)"
                        : "rgba(30,41,59,0.5)",
                      border: match
                        ? "1px solid #6366f1"
                        : "1px solid transparent",
                      borderRadius: "3px",
                      padding: "0.28rem 0.5rem",
                      fontSize: "0.85rem",
                      textAlign: "center",
                      color: "#e2e8f0",
                    }}
                  >
                    <span style={{ color: "#60a5fa" }}>{ai}</span>
                    <span style={{ color: "#f87171" }}>{bi}</span>
                    <span style={{ color: "#4ade80", fontWeight: 700 }}>
                      {d}
                    </span>
                    <span
                      style={{
                        color: bo ? "#f87171" : "#334155",
                        fontWeight: 700,
                      }}
                    >
                      {bo}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ ...S.card, marginTop: "0.5rem" }}>
            <div
              style={{
                fontWeight: 700,
                color: "#8b5cf6",
                marginBottom: "0.4rem",
              }}
            >
              Full Subtractor (with Borrow-In)
            </div>
            <div style={{ display: "grid", gap: "2px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5,1fr)",
                  background: "rgba(99,102,241,0.2)",
                  borderRadius: "4px",
                  padding: "0.3rem 0.5rem",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  color: "#a5b4fc",
                  textAlign: "center",
                }}
              >
                <span>A</span>
                <span>B</span>
                <span style={{ color: "#fbbf24" }}>Bin</span>
                <span style={{ color: "#4ade80" }}>Diff</span>
                <span style={{ color: "#f87171" }}>Bout</span>
              </div>
              {[
                [0, 0, 0, 0, 0],
                [0, 0, 1, 1, 1],
                [0, 1, 0, 1, 1],
                [0, 1, 1, 0, 1],
                [1, 0, 0, 1, 0],
                [1, 0, 1, 0, 0],
                [1, 1, 0, 0, 0],
                [1, 1, 1, 1, 1],
              ].map(([ai, bi, bin, d, bo]) => (
                <div
                  key={`${ai}${bi}${bin}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5,1fr)",
                    background: "rgba(30,41,59,0.5)",
                    borderRadius: "3px",
                    padding: "0.28rem 0.5rem",
                    fontSize: "0.82rem",
                    textAlign: "center",
                    color: "#e2e8f0",
                  }}
                >
                  <span style={{ color: "#60a5fa" }}>{ai}</span>
                  <span style={{ color: "#f87171" }}>{bi}</span>
                  <span style={{ color: "#fbbf24" }}>{bin}</span>
                  <span style={{ color: "#4ade80", fontWeight: 700 }}>{d}</span>
                  <span
                    style={{
                      color: bo ? "#f87171" : "#334155",
                      fontWeight: 700,
                    }}
                  >
                    {bo}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ HDL ══════════════════════════════════════════════ */}
      <button
        className="kmap-btn kmap-btn-secondary"
        style={{ width: "100%", margin: "0.3rem 0" }}
        onClick={() => setShowHDL((v) => !v)}
      >
        {showHDL ? "▲ Hide" : "▼ Show"} Hardware Code (Verilog)
      </button>
      {showHDL && (
        <div style={S.card}>
          <div style={S.codeBlock}>
            <AFHDLCopyButton text={`// Verilog 4-bit Subtractor using 2's complement
module subtractor_4bit (
  input  [3:0] A, B,
  output [3:0] Diff,
  output       Borrow
);
  wire [4:0] result;
  // A + (~B) + 1  =  A - B
  assign result = A + (~B) + 1'b1;
  assign Diff   = result[3:0];
  assign Borrow = ~result[4]; // no carry-out = borrow
endmodule`} />
          <pre
              style={{
                margin: 0,
                color: "#e2e8f0",
                fontSize: "0.75rem",
                lineHeight: 1.65,
              }}
            >{`// Verilog 4-bit Subtractor using 2's complement
module subtractor_4bit (
  input  [3:0] A, B,
  output [3:0] Diff,
  output       Borrow
);
  wire [4:0] result;
  // A + (~B) + 1  =  A - B
  assign result = A + (~B) + 1'b1;
  assign Diff   = result[3:0];
  assign Borrow = ~result[4]; // no carry-out = borrow
endmodule`}</pre>
          </div>
          <p style={{ ...S.body, marginTop: "0.5rem" }}>
            Notice:{" "}
            <code
              style={{
                background: "rgba(99,102,241,0.2)",
                padding: "1px 4px",
                borderRadius: "3px",
              }}
            >
              ~B
            </code>{" "}
            flips all bits of B, then adding 1 gives two's complement. No
            separate subtractor logic — just an adder!
          </p>
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
                background: "#ef4444",
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
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#f8fafc",
    margin: "1.5rem 0 0.5rem",
    letterSpacing: "-0.01em",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  },
  body: {
    color: "#94a3b8",
    fontSize: "0.95rem",
    lineHeight: 1.7,
    margin: "0.4rem 0"
  },
  card: {
    background: "rgba(30, 41, 59, 0.4)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(148, 163, 184, 0.1)",
    borderRadius: "16px",
    padding: "1.25rem",
    marginTop: "0.75rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  formula: {
    background: "rgba(15, 23, 42, 0.6)",
    border: "1px solid rgba(99, 102, 241, 0.2)",
    borderRadius: "12px",
    padding: "1rem",
    fontFamily: "'Fira Code', monospace",
    fontSize: "0.85rem",
    color: "#818cf8",
    margin: "0.75rem 0",
    lineHeight: 1.6,
    boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
    whiteSpace: "pre-wrap",
    wordBreak: "break-all"
  },
  codeBlock: {
    background: "#0f172a",
    border: "1px solid rgba(148, 163, 184, 0.1)",
    borderRadius: "12px",
    padding: "1rem",
    overflowX: "auto",
    position: "relative",
  },
  resultBanner: {
    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))",
    border: "1px solid rgba(99, 102, 241, 0.2)",
    borderRadius: "16px",
    padding: "1rem 1.5rem",
    margin: "1rem 0",
    backdropFilter: "blur(8px)",
  },
  tabPanel: {
    background: "rgba(30, 41, 59, 0.3)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(148, 163, 184, 0.1)",
    borderRadius: "0 16px 16px 16px",
    padding: "1.5rem",
    minHeight: "200px",
  },
  note: (c) => ({
    background: `${c}08`,
    borderLeft: `4px solid ${c}`,
    borderRadius: "8px",
    padding: "1rem",
    fontSize: "0.85rem",
    color: "#e2e8f0",
    lineHeight: 1.6,
    margin: "0.75rem 0",
  }),
  signalBox: (c) => ({
    background: `${c}05`,
    border: `1px solid ${c}20`,
    borderRadius: "12px",
    padding: "0.75rem",
    textAlign: "center",
    transition: "transform 0.2s ease",
  }),
  conceptCard: (c) => ({
    background: "rgba(30, 41, 59, 0.4)",
    border: "1px solid rgba(148, 163, 184, 0.1)",
    borderTop: `4px solid ${c}`,
    borderRadius: "12px",
    padding: "1rem",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  }),
  bitBtn: (bit, c) => ({
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    border: `2px solid ${bit === "1" ? c : "rgba(148, 163, 184, 0.1)"}`,
    background: bit === "1" ? `${c}15` : "rgba(15, 23, 42, 0.4)",
    color: bit === "1" ? c : "#64748b",
    fontWeight: 700,
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
  tabBtn: (active, c) => ({
    padding: "0.6rem 1.25rem",
    borderRadius: "10px 10px 0 0",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.875rem",
    background: active ? c : "transparent",
    color: active ? "#ffffff" : "#94a3b8",
    transition: "all 0.2s ease",
    borderBottom: active ? "none" : "1px solid rgba(148, 163, 184, 0.1)",
  }),
};

export default BinarySubtractor;
