import React, { useState, useMemo, useEffect, useCallback } from "react";
import ToolLayout from "../../components/ToolLayout";
import AFHDLDivider from "./components/AFHDLDivider";
import {
  cleanBin,
  halfAdder,
  fullAdder,
  binaryAdd,
} from "../../utils/arithmeticHelpers";

/* ───────────────────────────────────────────────────────────
   HELPERS
─────────────────────────────────────────────────────────── */
const pad = (a, b) => {
  const len = Math.max(a.length, b.length, 1);
  return [a.padStart(len, "0"), b.padStart(len, "0")];
};

const buildRippleTrace = (rawA, rawB, cinStr) => {
  const [a, b] = pad(rawA || "0", rawB || "0");
  let cin = parseInt(cinStr, 10) || 0;
  const trace = [];
  for (let i = a.length - 1; i >= 0; i--) {
    const ai = parseInt(a[i], 10);
    const bi = parseInt(b[i], 10);
    const total = ai + bi + cin;
    const sum = total % 2;
    const cout = Math.floor(total / 2);
    trace.unshift({ pos: a.length - 1 - i, ai, bi, cin, sum, cout });
    cin = cout;
  }
  return { trace, finalCarry: cin };
};

const toggleBit = (bin, idx) => {
  const arr = bin.split("");
  arr[idx] = arr[idx] === "0" ? "1" : "0";
  return arr.join("");
};

const QUIZ_QUESTIONS = [
  {
    q: "What does a Half Adder produce?",
    opts: ["Sum + Carry", "Sum only", "Carry only", "Sum + Borrow"],
    ans: 0,
  },
  {
    q: "What is the formula for Full Adder Sum?",
    opts: ["A AND B AND Cin", "A XOR B XOR Cin", "A OR B OR Cin", "A NAND B"],
    ans: 1,
  },
  {
    q: "What is Carry-Out in a Full Adder?",
    opts: [
      "A XOR B",
      "A AND B",
      "(A AND B) OR (Cin AND (A XOR B))",
      "NOT A AND B",
    ],
    ans: 2,
  },
  {
    q: "In Ripple Carry, what feeds into each stage's Cin?",
    opts: [
      "Always 0",
      "Always 1",
      "Carry-Out of previous stage",
      "Sum of previous stage",
    ],
    ans: 2,
  },
  {
    q: "What does G (Generate) mean in CLA?",
    opts: [
      "A carry will pass through",
      "A carry will be created here",
      "No carry at all",
      "A borrow occurs",
    ],
    ans: 1,
  },
  {
    q: "What does P (Propagate) mean in CLA?",
    opts: [
      "A carry is generated",
      "An incoming carry passes through",
      "No carry output",
      "Carry is blocked",
    ],
    ans: 1,
  },
  {
    q: "1010 + 0101 in binary = ?",
    opts: ["1110", "1111", "0101", "10000"],
    ans: 1,
  },
  {
    q: "What is 1 + 1 in binary (single bit)?",
    opts: ["10", "11", "00", "01"],
    ans: 0,
  },
];

/* ───────────────────────────────────────────────────────────
   COMPONENT
─────────────────────────────────────────────────────────── */
const BinaryAdders = () => {
  const [a, setA] = useState("1010");
  const [b, setB] = useState("0101");
  const [cin, setCin] = useState("0");
  const [activeTab, setActiveTab] = useState("half");
  const [showTruthTable, setShowTruthTable] = useState(false);
  const [showHDL, setShowHDL] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [animStep, setAnimStep] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);

  const cleanA = cleanBin(a) || "0";
  const cleanB = cleanBin(b) || "0";
  const [paddedA, paddedB] = pad(cleanA, cleanB);

  const h = halfAdder(cleanA.slice(-1), cleanB.slice(-1));
  const f = fullAdder(cleanA.slice(-1), cleanB.slice(-1), cin);
  const ripple = binaryAdd(cleanA, cleanB, cin);

  const { trace, finalCarry } = useMemo(
    () => buildRippleTrace(cleanA, cleanB, cin),
    [cleanA, cleanB, cin],
  );

  const aDecimal = parseInt(paddedA, 2);
  const bDecimal = parseInt(paddedB, 2);
  const correctSum = aDecimal + bDecimal + parseInt(cin, 10);

  const claTrace = useMemo(() => {
    return [...paddedA].map((aBit, i) => {
      const ai = parseInt(aBit, 10);
      const bi = parseInt(paddedB[i], 10);
      return { pos: i, ai, bi, G: ai & bi, P: ai ^ bi };
    });
  }, [paddedA, paddedB]);

  const examples = [
    { label: "Simple", a: "1010", b: "0101", cin: "0" },
    { label: "Carry chain", a: "1111", b: "0001", cin: "0" },
    { label: "With Cin", a: "1101", b: "1011", cin: "1" },
    { label: "All zeros", a: "0000", b: "0000", cin: "0" },
    { label: "Max bits", a: "1111", b: "1111", cin: "1" },
  ];

  const startAnimation = useCallback(() => {
    setAnimStep(-1);
    setIsAnimating(true);
  }, []);

  useEffect(() => {
    if (!isAnimating) return;
    if (animStep >= trace.length) {
      setIsAnimating(false);
      return;
    }
    const t = setTimeout(() => setAnimStep((s) => s + 1), 700);
    return () => clearTimeout(t);
  }, [isAnimating, animStep, trace.length]);

  const handleQuizAnswer = (i) => {
    setQuizAnswer(i);
    if (i === QUIZ_QUESTIONS[quizIdx].ans) setQuizScore((s) => s + 1);
  };
  const nextQ = () => {
    if (quizIdx + 1 >= QUIZ_QUESTIONS.length) setQuizDone(true);
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

  const tabMap = {
    "Half Adder": "half",
    "Full Adder": "full",
    "Ripple Carry": "ripple",
    "CLA (Fast)": "cla",
  };

  return (
    <ToolLayout
      title="Binary Adders"
      subtitle="Half · Full · Ripple Carry · CLA — Interactive"
    >
      {/* ══ CONCEPT OVERVIEW ══════════════════════════════════ */}
      <div style={S.sectionTitle}>📖 What is a Binary Adder?</div>
      <p style={S.body}>
        A binary adder adds two binary numbers, just like you add decimals
        column by column — starting from the <strong>rightmost bit</strong>,
        passing any overflow as a <em>carry</em>.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.6rem",
          margin: "0.75rem 0",
        }}
      >
        {[
          {
            color: "#3b82f6",
            emoji: "🔵",
            title: "Half Adder",
            desc: "Adds 2 bits. No carry-in.",
            formula: "Sum=A⊕B  Carry=A·B",
          },
          {
            color: "#8b5cf6",
            emoji: "🟣",
            title: "Full Adder",
            desc: "Adds 3 bits (A, B, Cin).",
            formula: "Sum=A⊕B⊕Cin  Cout=majority",
          },
          {
            color: "#10b981",
            emoji: "🟢",
            title: "Ripple Carry",
            desc: "Chains full adders. Simple but slow.",
            formula: "Cout[i] → Cin[i+1]",
          },
          {
            color: "#f59e0b",
            emoji: "🟡",
            title: "CLA (Fast)",
            desc: "Pre-computes carries. Very fast.",
            formula: "G=A·B  P=A⊕B",
          },
        ].map(({ color, emoji, title, desc, formula }) => (
          <div
            key={title}
            onClick={() => setActiveTab(tabMap[title])}
            style={{
              ...S.conceptCard(color),
              transform:
                activeTab === tabMap[title] ? "scale(1.02)" : "scale(1)",
              boxShadow:
                activeTab === tabMap[title] ? `0 0 0 2px ${color}` : "none",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: "0.2rem" }}>
              {emoji} {title}
            </div>
            <div
              style={{
                fontSize: "0.8rem",
                color: "#cbd5e1",
                marginBottom: "0.3rem",
              }}
            >
              {desc}
            </div>
            <div
              style={{ fontFamily: "monospace", fontSize: "0.73rem", color }}
            >
              {formula}
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: "0.78rem", color: "#64748b" }}>
        👆 Click a card to jump to that section below.
      </p>

      {/* ══ INTERACTIVE BIT INPUTS ══════════════════════════ */}
      <div style={S.sectionTitle}>🎛️ Enter Your Numbers</div>
      <p style={S.body}>
        Type binary numbers <strong>or click any bit to flip it (0↔1)</strong>.
      </p>

      <div style={{ display: "grid", gap: "0.75rem", margin: "0.5rem 0" }}>
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
            color: "#c084fc",
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
                  title="Click to flip this bit"
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

        <div>
          <div
            style={{
              fontSize: "0.82rem",
              color: "#94a3b8",
              marginBottom: "0.2rem",
            }}
          >
            Carry-In (Cin)
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["0", "1"].map((v) => (
              <button
                key={v}
                onClick={() => setCin(v)}
                style={{
                  padding: "0.4rem 1.2rem",
                  borderRadius: "6px",
                  border: `2px solid ${cin === v ? "#fbbf24" : "rgba(251,191,36,0.2)"}`,
                  background:
                    cin === v ? "rgba(251,191,36,0.2)" : "rgba(30,41,59,0.5)",
                  color: cin === v ? "#fbbf24" : "#64748b",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Cin = {v}
              </button>
            ))}
          </div>
        </div>
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
              setCin(ex.cin);
            }}
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* ══ LIVE RESULT ══════════════════════════════════════ */}
      <div style={S.resultBanner}>
        <div
          style={{
            fontSize: "0.75rem",
            color: "#94a3b8",
            marginBottom: "0.2rem",
          }}
        >
          LIVE RESULT
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
          <span style={{ color: "#475569" }}>+</span>
          <strong style={{ color: "#c084fc" }}>{paddedB}</strong>
          <span style={{ color: "#475569" }}>₂ ({bDecimal}₁₀)</span>
          {parseInt(cin) ? (
            <span style={{ color: "#fbbf24" }}>+ Cin=1</span>
          ) : null}
          <span style={{ color: "#475569" }}>=</span>
          <strong style={{ color: "#4ade80", fontSize: "1.15rem" }}>
            {ripple.carry ? "1" : ""}
            {ripple.sum}₂ = {correctSum}₁₀
          </strong>
          {(ripple.carry === "1" || ripple.carry === 1) && (
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
              ⚠ Overflow!
            </span>
          )}
        </div>
      </div>

      {/* ══ TABBED DEEP DIVE ══════════════════════════════════ */}
      <div style={S.sectionTitle}>🔬 Deep Dive</div>
      <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
        {[
          { id: "half", label: "Half Adder", color: "#3b82f6" },
          { id: "full", label: "Full Adder", color: "#8b5cf6" },
          { id: "ripple", label: "Ripple Carry", color: "#10b981" },
          { id: "cla", label: "CLA", color: "#f59e0b" },
        ].map(({ id, label, color }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={S.tabBtn(activeTab === id, color)}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={S.tabPanel}>
        {/* HALF ADDER */}
        {activeTab === "half" && (
          <div>
            <div
              style={{
                fontWeight: 700,
                color: "#60a5fa",
                marginBottom: "0.5rem",
                fontSize: "0.95rem",
              }}
            >
              🔵 Half Adder — LSB only (no carry-in)
            </div>
            <p style={S.body}>
              Works on <strong>one bit pair only</strong> — the last (rightmost)
              bit of A and B. Cannot accept a carry from a previous stage.
            </p>
            <div style={S.formula}>
              Sum &nbsp;= A <span style={{ color: "#60a5fa" }}>XOR</span> B ={" "}
              {paddedA.slice(-1)} ⊕ {paddedB.slice(-1)} ={" "}
              <strong style={{ color: "#4ade80" }}>{h.sum}</strong>
              <br />
              Carry = A <span style={{ color: "#60a5fa" }}>AND</span> B ={" "}
              {paddedA.slice(-1)} · {paddedB.slice(-1)} ={" "}
              <strong style={{ color: "#fbbf24" }}>{h.carry}</strong>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.5rem",
                margin: "0.6rem 0",
              }}
            >
              {[
                {
                  label: "Input A (LSB)",
                  val: paddedA.slice(-1),
                  color: "#60a5fa",
                },
                {
                  label: "Input B (LSB)",
                  val: paddedB.slice(-1),
                  color: "#c084fc",
                },
                { label: "Sum output", val: h.sum, color: "#4ade80" },
                {
                  label: "Carry output",
                  val: h.carry,
                  color:
                    h.carry === "1" || h.carry === 1 ? "#f87171" : "#475569",
                },
              ].map(({ label, val, color }) => (
                <div key={label} style={S.signalBox(color)}>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "#64748b",
                      marginBottom: "0.15rem",
                    }}
                  >
                    {label}
                  </div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 800, color }}>
                    {val}
                  </div>
                </div>
              ))}
            </div>
            <div style={S.note("#f87171")}>
              ⚠ A half adder handles only 1 bit. For multi-bit numbers, you must
              use a <strong>Full Adder</strong> so carries from lower positions
              are counted.
            </div>
          </div>
        )}

        {/* FULL ADDER */}
        {activeTab === "full" && (
          <div>
            <div
              style={{
                fontWeight: 700,
                color: "#c084fc",
                marginBottom: "0.5rem",
                fontSize: "0.95rem",
              }}
            >
              🟣 Full Adder — handles carry-in from previous stage
            </div>
            <p style={S.body}>
              A full adder accepts <strong>3 inputs</strong>: A, B, and a
              Carry-In. It is the core building block of every multi-bit adder.
            </p>
            <div style={S.formula}>
              Sum &nbsp;= A ⊕ B ⊕ Cin = {paddedA.slice(-1)} ⊕{" "}
              {paddedB.slice(-1)} ⊕ {cin} ={" "}
              <strong style={{ color: "#4ade80" }}>{f.sum}</strong>
              <br />
              Cout = (A·B) + (Cin·(A⊕B)) ={" "}
              <strong style={{ color: "#fbbf24" }}>{f.carry}</strong>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: "0.45rem",
                margin: "0.6rem 0",
              }}
            >
              {[
                { label: "A (LSB)", val: paddedA.slice(-1), color: "#60a5fa" },
                { label: "B (LSB)", val: paddedB.slice(-1), color: "#c084fc" },
                { label: "Carry-In", val: cin, color: "#fbbf24" },
                { label: "Sum out", val: f.sum, color: "#4ade80" },
                {
                  label: "Carry out",
                  val: f.carry,
                  color:
                    f.carry === "1" || f.carry === 1 ? "#f87171" : "#475569",
                },
                {
                  label: "Total (dec)",
                  val:
                    parseInt(paddedA.slice(-1)) +
                    parseInt(paddedB.slice(-1)) +
                    parseInt(cin),
                  color: "#e2e8f0",
                },
              ].map(({ label, val, color }) => (
                <div key={label} style={S.signalBox(color)}>
                  <div style={{ fontSize: "0.68rem", color: "#64748b" }}>
                    {label}
                  </div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color }}>
                    {val}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RIPPLE CARRY */}
        {activeTab === "ripple" && (
          <div>
            <div
              style={{
                fontWeight: 700,
                color: "#4ade80",
                marginBottom: "0.5rem",
                fontSize: "0.95rem",
              }}
            >
              🟢 Ripple Carry Adder — animated carry flow
            </div>
            <p style={S.body}>
              Chains {paddedA.length} full adders. Each stage's Carry-Out feeds
              the next stage's Carry-In. Watch how the carry "ripples" from
              right to left:
            </p>

            <button
              className="kmap-btn"
              onClick={startAnimation}
              disabled={isAnimating}
              style={{ margin: "0.4rem 0 0.6rem" }}
            >
              {isAnimating ? "⏳ Animating…" : "▶ Animate Carry Flow"}
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
                    onClick={() =>
                      setHighlightedRow(highlightedRow === i ? null : i)
                    }
                    style={{
                      background: isActive
                        ? "rgba(16,185,129,0.25)"
                        : highlightedRow === i
                          ? "rgba(99,102,241,0.2)"
                          : "rgba(30,41,59,0.65)",
                      border: `1px solid ${isActive ? "#10b981" : highlightedRow === i ? "#6366f1" : "rgba(148,163,184,0.18)"}`,
                      borderRadius: "8px",
                      padding: "0.45rem 0.5rem",
                      minWidth: "52px",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      opacity: isAnimating && !revealed ? 0.25 : 1,
                    }}
                  >
                    <div style={{ fontSize: "0.6rem", color: "#475569" }}>
                      bit {row.pos}
                    </div>
                    <div style={{ color: "#60a5fa", fontWeight: 700 }}>
                      {row.ai}
                    </div>
                    <div style={{ color: "#c084fc", fontWeight: 700 }}>
                      {row.bi}
                    </div>
                    <div
                      style={{
                        borderTop: "1px solid rgba(148,163,184,0.15)",
                        marginTop: "2px",
                        paddingTop: "2px",
                      }}
                    >
                      <div style={{ fontSize: "0.65rem", color: "#fbbf24" }}>
                        C↓{row.cin}
                      </div>
                      <div
                        style={{
                          color: "#4ade80",
                          fontWeight: 800,
                          fontSize: "0.95rem",
                        }}
                      >
                        {row.sum}
                      </div>
                      <div
                        style={{
                          fontSize: "0.65rem",
                          color: row.cout ? "#f87171" : "#475569",
                        }}
                      >
                        C→{row.cout}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div
                style={{
                  background: finalCarry
                    ? "rgba(248,113,113,0.15)"
                    : "rgba(30,41,59,0.4)",
                  border: `1px solid ${finalCarry ? "#f87171" : "rgba(148,163,184,0.12)"}`,
                  borderRadius: "8px",
                  padding: "0.45rem 0.5rem",
                  minWidth: "52px",
                  textAlign: "center",
                  opacity: isAnimating && animStep < trace.length ? 0.25 : 1,
                  transition: "opacity 0.3s",
                }}
              >
                <div style={{ fontSize: "0.6rem", color: "#475569" }}>
                  carry
                </div>
                <div
                  style={{
                    fontWeight: 800,
                    color: finalCarry ? "#f87171" : "#475569",
                  }}
                >
                  {finalCarry}
                </div>
              </div>
            </div>
            <p
              style={{
                fontSize: "0.75rem",
                color: "#475569",
                marginTop: "0.3rem",
              }}
            >
              👆 Click any column for details
            </p>

            {highlightedRow !== null && trace[highlightedRow] && (
              <div style={{ ...S.note("#10b981"), margin: "0.4rem 0" }}>
                <strong>Bit {trace[highlightedRow].pos}:</strong> &nbsp; A=
                {trace[highlightedRow].ai} + B={trace[highlightedRow].bi} + Cin=
                {trace[highlightedRow].cin} ={" "}
                {trace[highlightedRow].ai +
                  trace[highlightedRow].bi +
                  trace[highlightedRow].cin}{" "}
                →&nbsp; Sum=<strong>{trace[highlightedRow].sum}</strong>, Cout=
                <strong>{trace[highlightedRow].cout}</strong>
              </div>
            )}
            <div style={S.formula}>
              Full result: {finalCarry ? "1" : ""}
              {ripple.sum}₂ = {correctSum}₁₀
              {finalCarry ? "  ← carry-out (overflow)!" : ""}
            </div>
          </div>
        )}

        {/* CLA */}
        {activeTab === "cla" && (
          <div>
            <div
              style={{
                fontWeight: 700,
                color: "#fbbf24",
                marginBottom: "0.5rem",
                fontSize: "0.95rem",
              }}
            >
              🟡 Carry Look-Ahead (CLA) — parallel, instant carries
            </div>
            <p style={S.body}>
              CLA eliminates ripple delay by pre-calculating all carries
              simultaneously using <strong>Generate (G)</strong> and{" "}
              <strong>Propagate (P)</strong> signals.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.5rem",
                margin: "0.5rem 0",
              }}
            >
              <div style={S.note("#f87171")}>
                <strong>🔴 Generate: G = A AND B</strong>
                <br />
                This bit <em>creates</em> a carry by itself. Example: 1+1 always
                carries.
              </div>
              <div style={S.note("#60a5fa")}>
                <strong>🔵 Propagate: P = A XOR B</strong>
                <br />
                This bit <em>passes</em> an incoming carry along. Example: 1+0
                passes it.
              </div>
            </div>
            <div style={S.formula}>C[i+1] = G[i] + P[i] · C[i]</div>
            <div style={{ display: "grid", gap: "2px", marginTop: "0.5rem" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1.5fr 1.5fr 2fr",
                  background: "rgba(99,102,241,0.2)",
                  borderRadius: "4px",
                  padding: "0.3rem 0.5rem",
                  fontSize: "0.73rem",
                  fontWeight: 700,
                  color: "#a5b4fc",
                  textAlign: "center",
                }}
              >
                <span>Bit</span>
                <span>A</span>
                <span>B</span>
                <span style={{ color: "#f87171" }}>G</span>
                <span style={{ color: "#60a5fa" }}>P</span>
                <span>Meaning</span>
              </div>
              {claTrace.map((row) => (
                <div
                  key={row.pos}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1.5fr 1.5fr 2fr",
                    background: "rgba(30,41,59,0.5)",
                    borderRadius: "3px",
                    padding: "0.28rem 0.5rem",
                    fontSize: "0.8rem",
                    textAlign: "center",
                    color: "#e2e8f0",
                  }}
                >
                  <span style={{ color: "#475569" }}>
                    bit {claTrace.length - 1 - row.pos}
                  </span>
                  <span style={{ color: "#60a5fa" }}>{row.ai}</span>
                  <span style={{ color: "#c084fc" }}>{row.bi}</span>
                  <span
                    style={{
                      color: row.G ? "#f87171" : "#334155",
                      fontWeight: row.G ? 700 : 400,
                    }}
                  >
                    {row.G}
                  </span>
                  <span
                    style={{
                      color: row.P ? "#60a5fa" : "#334155",
                      fontWeight: row.P ? 700 : 400,
                    }}
                  >
                    {row.P}
                  </span>
                  <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                    {row.G
                      ? "🔴 creates carry"
                      : row.P
                        ? "🔵 passes carry"
                        : "⬜ no carry"}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ ...S.note("#f59e0b"), marginTop: "0.6rem" }}>
              ⚡ CLA computes all carries <strong>at once</strong> — 3–4× faster
              than ripple carry for 8+ bit numbers.
            </div>
          </div>
        )}
      </div>

      {/* ══ INTERACTIVE TRUTH TABLE ══════════════════════════ */}
      <AFHDLDivider />
      <button
        className="kmap-btn kmap-btn-secondary"
        style={{ width: "100%", margin: "0.3rem 0" }}
        onClick={() => setShowTruthTable((v) => !v)}
      >
        {showTruthTable ? "▲ Hide" : "▼ Show"} Full Adder Truth Table — all 8
        input combinations
      </button>
      {showTruthTable && (
        <div style={S.card}>
          <p style={S.body}>
            The row matching your current LSB inputs is highlighted. Hover for
            details.
          </p>
          <div style={{ display: "grid", gap: "2px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6,1fr)",
                background: "rgba(99,102,241,0.25)",
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
              <span>Cin</span>
              <span style={{ color: "#4ade80" }}>Sum</span>
              <span style={{ color: "#fbbf24" }}>Cout</span>
              <span>A+B+C</span>
            </div>
            {[
              [0, 0, 0, 0, 0],
              [0, 0, 1, 1, 0],
              [0, 1, 0, 1, 0],
              [0, 1, 1, 0, 1],
              [1, 0, 0, 1, 0],
              [1, 0, 1, 0, 1],
              [1, 1, 0, 0, 1],
              [1, 1, 1, 1, 1],
            ].map(([ai, bi, ci, s, co]) => {
              const match =
                ai === parseInt(paddedA.slice(-1)) &&
                bi === parseInt(paddedB.slice(-1)) &&
                ci === parseInt(cin);
              return (
                <div
                  key={`${ai}${bi}${ci}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(6,1fr)",
                    background: match
                      ? "rgba(99,102,241,0.3)"
                      : "rgba(30,41,59,0.5)",
                    border: match
                      ? "1px solid #6366f1"
                      : "1px solid transparent",
                    borderRadius: "3px",
                    padding: "0.28rem 0.5rem",
                    fontSize: "0.82rem",
                    textAlign: "center",
                    color: "#e2e8f0",
                    transition: "background 0.15s",
                  }}
                >
                  <span style={{ color: "#60a5fa" }}>{ai}</span>
                  <span style={{ color: "#c084fc" }}>{bi}</span>
                  <span style={{ color: "#fbbf24" }}>{ci}</span>
                  <span style={{ color: "#4ade80", fontWeight: 700 }}>{s}</span>
                  <span
                    style={{
                      color: co ? "#f87171" : "#334155",
                      fontWeight: 700,
                    }}
                  >
                    {co}
                  </span>
                  <span style={{ color: "#475569" }}>{ai + bi + ci}</span>
                </div>
              );
            })}
          </div>
          <p
            style={{
              fontSize: "0.73rem",
              color: "#6366f1",
              marginTop: "0.4rem",
            }}
          >
            🟣 Highlighted row = your current LSB inputs
          </p>
        </div>
      )}

      {/* ══ HDL CODE ════════════════════════════════════════ */}
      <button
        className="kmap-btn kmap-btn-secondary"
        style={{ width: "100%", margin: "0.3rem 0" }}
        onClick={() => setShowHDL((v) => !v)}
      >
        {showHDL ? "▲ Hide" : "▼ Show"} Hardware Code (VHDL + Verilog)
      </button>
      {showHDL && (
        <div style={S.card}>
          <div style={S.codeBlock}>
            <AFHDLCopyButton text={`-- VHDL Full Adder
entity full_adder is
  port(A, B, Cin : in  std_logic;
       Sum, Cout : out std_logic);
end full_adder;
architecture rtl of full_adder is
begin
  Sum  <= A xor B xor Cin;
  Cout <= (A and B) or (Cin and (A xor B));
end rtl;

// Verilog Full Adder
module full_adder(input A, B, Cin, output Sum, Cout);
  assign Sum  = A ^ B ^ Cin;
  assign Cout = (A & B) | (Cin & (A ^ B));
endmodule`} />
          <pre
              style={{
                margin: 0,
                color: "#e2e8f0",
                fontSize: "0.75rem",
                lineHeight: 1.65,
              }}
            >{`-- VHDL Full Adder
entity full_adder is
  port(A, B, Cin : in  std_logic;
       Sum, Cout : out std_logic);
end full_adder;
architecture rtl of full_adder is
begin
  Sum  <= A xor B xor Cin;
  Cout <= (A and B) or (Cin and (A xor B));
end rtl;

// Verilog Full Adder
module full_adder(input A, B, Cin, output Sum, Cout);
  assign Sum  = A ^ B ^ Cin;
  assign Cout = (A & B) | (Cin & (A ^ B));
endmodule`}</pre>
          </div>
        </div>
      )}

      {/* ══ QUIZ ════════════════════════════════════════════ */}
      <AFHDLDivider />
      <div style={S.sectionTitle}>🧠 Quick Quiz — Test Your Knowledge</div>
      {!quizMode ? (
        <button
          className="kmap-btn"
          onClick={() => {
            setQuizMode(true);
            resetQuiz();
          }}
        >
          Start Quiz ({QUIZ_QUESTIONS.length} questions)
        </button>
      ) : quizDone ? (
        <div style={S.card}>
          <div
            style={{
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "#4ade80",
              marginBottom: "0.4rem",
            }}
          >
            {quizScore >= 6
              ? "🎉 Excellent!"
              : quizScore >= 4
                ? "👍 Good job!"
                : "📚 Keep practicing!"}
          </div>
          <p style={{ color: "#cbd5e1" }}>
            Score: <strong style={{ color: "#4ade80" }}>{quizScore}</strong> /{" "}
            {QUIZ_QUESTIONS.length}
          </p>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <button className="kmap-btn" onClick={resetQuiz}>
              Try Again
            </button>
            <button
              className="kmap-btn kmap-btn-secondary"
              onClick={() => setQuizMode(false)}
            >
              Exit Quiz
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
              Question {quizIdx + 1} / {QUIZ_QUESTIONS.length}
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
                width: `${(quizIdx / QUIZ_QUESTIONS.length) * 100}%`,
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
              fontSize: "0.92rem",
              marginBottom: "0.7rem",
            }}
          >
            {QUIZ_QUESTIONS[quizIdx].q}
          </div>
          <div style={{ display: "grid", gap: "0.4rem" }}>
            {QUIZ_QUESTIONS[quizIdx].opts.map((opt, i) => {
              const isCorrect = i === QUIZ_QUESTIONS[quizIdx].ans;
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
                  onClick={() => handleQuizAnswer(i)}
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
              {quizIdx + 1 >= QUIZ_QUESTIONS.length
                ? "See Results →"
                : "Next Question →"}
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

export default BinaryAdders;
