import React, { useState, useMemo, useEffect, useCallback } from "react";
import AFHDLDivider from "./components/AFHDLDivider";
import AFHDLCopyButton from "./components/AFHDLCopyButton";
import AFHDLLayout from "./components/AFHDLLayout";
import { afhdlTheme as S } from "./utils/afhdlTheme";
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

/* ── Teacher callout messages ──────────────────────────── */
const TEACHER_NOTES = {
  intro: [
    "👋 Hey! Don't worry — binary math sounds scary, but it's actually simpler than normal addition once you get the hang of it. Let's take it step by step!",
    "💡 Think of binary like a light switch — every bit is either OFF (0) or ON (1). That's it! No 2s, no 3s, just 0 and 1.",
    "🍎 Imagine you only have two fingers to count with. You'd run out fast, right? That's exactly why computers 'carry' to the next column — just like we do with normal addition!",
  ],
  halfAdder: [
    "🤔 What does 'Half Adder' mean? Think of it as a tiny calculator that can only add two single digits (0 or 1). It's 'half' because it can't handle a carry coming IN — it can only send one OUT.",
    "✏️ Real-life example: What's 1 + 1? In binary, the answer is NOT 2 (there's no 2!). Instead, you write 0 and carry 1 to the next column. That carry is what the 'Carry output' below shows!",
    "⚠️ Why is this called 'half'? Because it's only HALF the story. To add multi-digit binary numbers, we need a Full Adder that can also receive a carry from the previous step.",
  ],
  fullAdder: [
    "🌟 Great job getting here! A Full Adder is like a Half Adder's big sibling. It does the same thing, but it also takes in a Carry-In (Cin) from the previous column.",
    "🧮 Imagine adding the tens column: you have your two digits PLUS whatever was carried from the ones column. That's exactly what a Full Adder does!",
    "💪 The Full Adder is the workhorse of all multi-bit addition. Every time your computer adds two numbers, it uses a chain of Full Adders!",
  ],
  ripple: [
    "🌊 'Ripple Carry' is just a fancy name for chaining Full Adders together — like a row of dominoes. Each one waits for the carry from the one before it.",
    "🐢 Here's a fun fact: Ripple Carry is called that because the carry 'ripples' from the rightmost bit all the way to the left — just like a wave in water! It works, but it's a bit slow.",
    "👀 Watch the animation below! Each column lights up one by one as the carry travels left. That delay is why engineers invented faster designs like CLA.",
  ],
  cla: [
    "🚀 CLA stands for Carry Look-Ahead. Forget waiting for the carry to travel — CLA predicts ALL carries at the same time before the addition even starts!",
    "🔮 It's like a fortune teller for carries: instead of waiting to see what happens in column 1 before starting column 2, CLA figures out EVERYTHING in advance.",
    "📚 Don't worry if the G and P formulas look weird. Just remember: G = 'I WILL generate a carry no matter what' and P = 'I will pass a carry through IF one arrives'.",
  ],
};

const QUIZ_QUESTIONS = [
  {
    q: "What does a Half Adder produce as outputs?",
    hint: "Think: what are the two things that can happen when you add two bits?",
    opts: ["Sum + Carry", "Sum only", "Carry only", "Sum + Borrow"],
    ans: 0,
    explain:
      "A Half Adder always produces TWO outputs: the Sum bit (was the result 0 or 1?) and the Carry bit (did we overflow into the next column?).",
  },
  {
    q: "What is the formula for Full Adder Sum?",
    hint: "XOR means 'different = 1, same = 0'. Try: 1 XOR 0 = 1, but 1 XOR 1 = 0.",
    opts: ["A AND B AND Cin", "A XOR B XOR Cin", "A OR B OR Cin", "A NAND B"],
    ans: 1,
    explain:
      "XOR (⊕) is like 'odd number of 1s wins'. With 3 inputs, if the count of 1s is odd the Sum is 1, if even the Sum is 0. Try it: 1⊕1⊕1 = 1, but 1⊕1⊕0 = 0.",
  },
  {
    q: "What is Carry-Out in a Full Adder?",
    hint: "A carry is generated when the total is 2 or 3. Think about when A AND B are both 1...",
    opts: [
      "A XOR B",
      "A AND B",
      "(A AND B) OR (Cin AND (A XOR B))",
      "NOT A AND B",
    ],
    ans: 2,
    explain:
      "Carry-Out is 1 when: BOTH A and B are 1 (they generate a carry), OR when exactly one of them is 1 AND Cin is also 1 (the carry gets passed through).",
  },
  {
    q: "In Ripple Carry, what feeds into each stage's Cin?",
    hint: "Think of dominoes — what does one domino do to the next one?",
    opts: [
      "Always 0",
      "Always 1",
      "Carry-Out of previous stage",
      "Sum of previous stage",
    ],
    ans: 2,
    explain:
      "Each Full Adder passes its Carry-Out to the next one's Carry-In. This is the 'ripple' effect — the carry travels from the rightmost bit leftward, one step at a time.",
  },
  {
    q: "What does G (Generate) mean in CLA?",
    hint: "The word 'generate' means to create something from nothing...",
    opts: [
      "A carry will pass through",
      "A carry will be created here",
      "No carry at all",
      "A borrow occurs",
    ],
    ans: 1,
    explain:
      "G=1 means 'this bit GUARANTEES a carry output, no matter what the carry-in is'. This happens when A=1 AND B=1, because 1+1=2, which always overflows.",
  },
  {
    q: "What does P (Propagate) mean in CLA?",
    hint: "The word 'propagate' means to pass something along...",
    opts: [
      "A carry is generated",
      "An incoming carry passes through",
      "No carry output",
      "Carry is blocked",
    ],
    ans: 1,
    explain:
      "P=1 means 'IF a carry arrives at my input, I will forward it to my output'. This happens when exactly one of A or B is 1. You're not creating a carry — you're passing one along.",
  },
  {
    q: "What is 1010 + 0101 in binary?",
    hint: "Try converting to decimal first: 1010₂ = 10, 0101₂ = 5. What's 10 + 5?",
    opts: ["1110", "1111", "0101", "10000"],
    ans: 1,
    explain:
      "10 + 5 = 15 in decimal. Now convert 15 to binary: 15 = 8+4+2+1 = 1111₂. So the answer is 1111!",
  },
  {
    q: "What is 1 + 1 in binary (single bit only)?",
    hint: "In binary, there is no digit '2'. So what do we do when we overflow?",
    opts: ["10", "11", "00", "01"],
    ans: 0,
    explain:
      "1 + 1 = 2 in decimal, but binary has no '2'! So we write 0 in the current column and carry 1 to the next — giving us '10' in binary, which means 2.",
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
  const [teacherNoteIdx, setTeacherNoteIdx] = useState(0);
  const [showHint, setShowHint] = useState(false);

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
    { label: "🟢 Simple", a: "1010", b: "0101", cin: "0" },
    { label: "🌊 Carry chain", a: "1111", b: "0001", cin: "0" },
    { label: "➕ With Cin=1", a: "1101", b: "1011", cin: "1" },
    { label: "⬜ All zeros", a: "0000", b: "0000", cin: "0" },
    { label: "🔴 Max bits", a: "1111", b: "1111", cin: "1" },
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
    const t = setTimeout(() => setAnimStep((s) => s + 1), 800);
    return () => clearTimeout(t);
  }, [isAnimating, animStep, trace.length]);

  const tabNoteKey = {
    half: "halfAdder",
    full: "fullAdder",
    ripple: "ripple",
    cla: "cla",
  };

  const handleQuizAnswer = (i) => {
    setQuizAnswer(i);
    setShowHint(false);
    if (i === QUIZ_QUESTIONS[quizIdx].ans) setQuizScore((s) => s + 1);
  };
  const nextQ = () => {
    if (quizIdx + 1 >= QUIZ_QUESTIONS.length) setQuizDone(true);
    else {
      setQuizIdx((i) => i + 1);
      setQuizAnswer(null);
      setShowHint(false);
    }
  };
  const resetQuiz = () => {
    setQuizIdx(0);
    setQuizAnswer(null);
    setQuizScore(0);
    setQuizDone(false);
    setShowHint(false);
  };

  const tabMap = {
    "Half Adder": "half",
    "Full Adder": "full",
    "Ripple Carry": "ripple",
    "CLA (Fast)": "cla",
  };

  const currentNotes =
    TEACHER_NOTES[tabNoteKey[activeTab]] || TEACHER_NOTES.intro;
  const currentNote = currentNotes[teacherNoteIdx % currentNotes.length];

  return (
    <AFHDLLayout
      title="Binary Adders"
      subtitle="Learn step by step — Half · Full · Ripple Carry · CLA"
      intro="This lesson starts with the smallest possible addition problem and gradually scales it into the multi-bit adder structures used inside real digital systems."
      highlights={[
        {
          title: "Beginner path",
          text: "Understand one-bit addition first, then reuse the same idea with carry to build larger adders.",
        },
        {
          title: "Why adders matter",
          text: "Adders sit inside ALUs, counters, address generators, and many control/data-path circuits.",
        },
      ]}
    >
      {/* ══ WELCOME BANNER ══════════════════════════════════ */}
      <div style={S.welcomeBanner}>
        <div style={S.welcomeHeader}>
          <span style={{ fontSize: "1.6rem" }}>🎓</span>
          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: "1.05rem",
                color: "#f8fafc",
                marginBottom: "0.2rem",
              }}
            >
              Welcome! You are learning Binary Adders
            </div>
            <div
              style={{ fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.5 }}
            >
              No experience needed. We'll go step by step, like a patient
              teacher would.
            </div>
          </div>
        </div>
      </div>

      {/* ══ WHAT IS BINARY? ══════════════════════════════════ */}
      <div style={S.sectionTitle}>📖 First — What Even Is Binary?</div>

      <div style={S.teacherBubble}>
        <span style={S.teacherAvatar}>👩‍🏫</span>
        <div style={S.teacherText}>
          <strong>Think of it this way:</strong> In everyday life, we count with
          10 digits (0–9). Binary only uses{" "}
          <strong style={{ color: "#60a5fa" }}>2 digits: 0 and 1</strong>.
          That's it! Computers love binary because a wire can either have
          electricity (1) or not (0). Simple as a light switch!
        </div>
      </div>

      <div className="afhdl-grid-3">
        {[
          { dec: "0", bin: "0000", label: "Zero", color: "#475569" },
          { dec: "5", bin: "0101", label: "Five", color: "#60a5fa" },
          { dec: "10", bin: "1010", label: "Ten", color: "#c084fc" },
        ].map(({ dec, bin, label, color }) => (
          <div key={dec} style={S.analogyCard(color)}>
            <div
              style={{
                fontSize: "0.7rem",
                color: "#64748b",
                marginBottom: "0.2rem",
              }}
            >
              {label}
            </div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color }}>
              {dec}₁₀
            </div>
            <div
              style={{
                fontSize: "0.8rem",
                color: "#94a3b8",
                marginTop: "0.1rem",
                fontFamily: "monospace",
              }}
            >
              = {bin}₂
            </div>
          </div>
        ))}
      </div>

      <div style={S.analogyBox}>
        <div
          style={{ fontWeight: 700, color: "#fbbf24", marginBottom: "0.4rem" }}
        >
          🍟 Real-world analogy
        </div>
        <div style={{ color: "#cbd5e1", fontSize: "0.88rem", lineHeight: 1.7 }}>
          Imagine you're counting french fries, but you only have{" "}
          <strong>2 buckets</strong>. When the first bucket gets more than 1,
          you empty it and put 1 in the second bucket. That "overflow" is
          exactly what a <strong>carry bit</strong> is!
        </div>
      </div>

      {/* ══ CONCEPT CARDS ════════════════════════════════════ */}
      <div style={S.sectionTitle}>🗺️ The 4 Types of Binary Adders</div>
      <p style={{ ...S.body, marginBottom: "0.6rem" }}>
        Think of these as <strong>4 levels</strong> — from simplest to most
        advanced. Click any card to explore it in detail below!
      </p>

      <div className="afhdl-grid-2">
        {[
          {
            color: "#3b82f6",
            emoji: "🔵",
            title: "Half Adder",
            level: "Level 1 — Beginner",
            desc: "Adds just 2 single bits. Cannot handle a carry coming in.",
            formula: "Sum = A ⊕ B  |  Carry = A · B",
          },
          {
            color: "#8b5cf6",
            emoji: "🟣",
            title: "Full Adder",
            level: "Level 2 — Core Concept",
            desc: "Adds 3 bits: A, B, and a Carry-In from the previous column.",
            formula: "Sum = A ⊕ B ⊕ Cin  |  Cout = majority",
          },
          {
            color: "#10b981",
            emoji: "🟢",
            title: "Ripple Carry",
            level: "Level 3 — Multi-Bit",
            desc: "Chains Full Adders together. Simple, but the carry travels slowly.",
            formula: "Cout[i] → Cin[i+1]",
          },
          {
            color: "#f59e0b",
            emoji: "🟡",
            title: "CLA (Fast)",
            level: "Level 4 — Advanced",
            desc: "Pre-calculates ALL carries at once. Much faster than Ripple Carry.",
            formula: "G = A · B  |  P = A ⊕ B",
          },
        ].map(({ color, emoji, title, level, desc, formula }) => (
          <div
            key={title}
            onClick={() => {
              setActiveTab(tabMap[title]);
              setTeacherNoteIdx(0);
            }}
            style={{
              ...S.conceptCard(color),
              transform:
                activeTab === tabMap[title] ? "scale(1.03)" : "scale(1)",
              boxShadow:
                activeTab === tabMap[title]
                  ? `0 0 0 2px ${color}, 0 4px 20px ${color}30`
                  : "none",
            }}
          >
            <div
              style={{
                fontSize: "0.65rem",
                color,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.3rem",
              }}
            >
              {level}
            </div>
            <div
              style={{
                fontWeight: 800,
                marginBottom: "0.3rem",
                fontSize: "0.95rem",
              }}
            >
              {emoji} {title}
            </div>
            <div
              style={{
                fontSize: "0.8rem",
                color: "#cbd5e1",
                marginBottom: "0.4rem",
                lineHeight: 1.5,
              }}
            >
              {desc}
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "0.7rem",
                color,
                background: `${color}12`,
                borderRadius: "5px",
                padding: "0.3rem 0.5rem",
              }}
            >
              {formula}
            </div>
            {activeTab === tabMap[title] && (
              <div style={{ marginTop: "0.4rem", fontSize: "0.7rem", color }}>
                ▶ Currently viewing
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ══ INTERACTIVE BIT INPUTS ══════════════════════════ */}
      <div style={S.sectionTitle}>🎛️ Enter Your Binary Numbers</div>

      <div style={S.teacherBubble}>
        <span style={S.teacherAvatar}>👩‍🏫</span>
        <div style={S.teacherText}>
          Type a binary number in the box below,{" "}
          <strong>OR click the big 0/1 buttons to flip each bit</strong>. Watch
          how all the results update instantly! Try the example presets to see
          interesting cases.
        </div>
      </div>

      <div style={{ display: "grid", gap: "0.75rem", margin: "0.75rem 0" }}>
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
          <div key={label} style={S.inputGroup}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                marginBottom: "0.4rem",
              }}
            >
              <span style={{ fontWeight: 800, color, fontSize: "1.1rem" }}>
                {label}
              </span>
              <span style={{ fontFamily: "monospace", color, fontWeight: 700 }}>
                {padded}
              </span>
              <span style={{ color: "#475569", fontSize: "0.82rem" }}>
                = {parseInt(padded, 2)} in decimal
              </span>
            </div>
            <div
              style={{
                display: "flex",
                gap: "5px",
                flexWrap: "wrap",
                marginBottom: "0.4rem",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.72rem",
                  color: "#475569",
                  marginRight: "0.2rem",
                }}
              >
                ← click to flip:
              </span>
              {padded.split("").map((bit, i) => (
                <button
                  key={i}
                  onClick={() => setRaw(toggleBit(padded, i))}
                  style={S.bitBtn(bit, color)}
                  title={`Click to flip this bit (currently ${bit})`}
                >
                  {bit}
                </button>
              ))}
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span style={{ fontSize: "0.75rem", color: "#475569" }}>
                Or type:
              </span>
              <input
                className="tool-input"
                style={{ flex: 1 }}
                value={raw}
                onChange={(e) => setRaw(cleanBin(e.target.value) || "0")}
                placeholder={`Type ${label} in binary (only 0s and 1s)`}
              />
            </div>
          </div>
        ))}

        <div style={S.inputGroup}>
          <div
            style={{
              fontSize: "0.85rem",
              color: "#94a3b8",
              marginBottom: "0.3rem",
              fontWeight: 600,
            }}
          >
            Carry-In (Cin) — the carry arriving from a previous stage
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "#64748b",
              marginBottom: "0.5rem",
            }}
          >
            💡 For the very first bit, Cin is always 0. Only change this when
            chaining adders.
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["0", "1"].map((v) => (
              <button
                key={v}
                onClick={() => setCin(v)}
                style={S.cinBtn(cin === v)}
              >
                Cin = {v} {v === "0" ? "(no carry in)" : "(carry in!)"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Example presets */}
      <div style={{ margin: "0.3rem 0 0.8rem" }}>
        <div
          style={{
            fontSize: "0.75rem",
            color: "#64748b",
            marginBottom: "0.4rem",
          }}
        >
          🎲 Try a preset example:
        </div>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
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
      </div>

      {/* ══ LIVE RESULT ══════════════════════════════════════ */}
      <div style={S.resultBanner}>
        <div
          style={{
            fontSize: "0.7rem",
            color: "#64748b",
            marginBottom: "0.3rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          ✅ Live Result
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "1rem",
          }}
        >
          <strong style={{ color: "#60a5fa", fontFamily: "monospace" }}>
            {paddedA}
          </strong>
          <span style={{ color: "#475569", fontSize: "0.82rem" }}>
            ({aDecimal})
          </span>
          <span style={{ color: "#64748b" }}>+</span>
          <strong style={{ color: "#c084fc", fontFamily: "monospace" }}>
            {paddedB}
          </strong>
          <span style={{ color: "#475569", fontSize: "0.82rem" }}>
            ({bDecimal})
          </span>
          {parseInt(cin) ? (
            <span style={{ color: "#fbbf24" }}>+ Cin=1</span>
          ) : null}
          <span style={{ color: "#64748b" }}>=</span>
          <strong
            style={{
              color: "#4ade80",
              fontSize: "1.2rem",
              fontFamily: "monospace",
            }}
          >
            {ripple.carry ? "1" : ""}
            {ripple.sum}
          </strong>
          <span style={{ color: "#475569", fontSize: "0.82rem" }}>
            = {correctSum} in decimal
          </span>
          {(ripple.carry === "1" || ripple.carry === 1) && (
            <span style={S.overflowBadge}>⚠ Overflow!</span>
          )}
        </div>
        <div
          style={{ fontSize: "0.75rem", color: "#475569", marginTop: "0.4rem" }}
        >
          💡 <strong>Overflow</strong> means the result is too big to fit in the
          same number of bits — the carry went past the last column!
        </div>
      </div>

      {/* ══ TABBED DEEP DIVE ══════════════════════════════════ */}
      <div style={S.sectionTitle}>🔬 Deep Dive — Choose a Topic</div>
      <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
        {[
          { id: "half", label: "🔵 Half Adder", color: "#3b82f6" },
          { id: "full", label: "🟣 Full Adder", color: "#8b5cf6" },
          { id: "ripple", label: "🟢 Ripple Carry", color: "#10b981" },
          { id: "cla", label: "🟡 CLA", color: "#f59e0b" },
        ].map(({ id, label, color }) => (
          <button
            key={id}
            onClick={() => {
              setActiveTab(id);
              setTeacherNoteIdx(0);
            }}
            style={S.tabBtn(activeTab === id, color)}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={S.tabPanel}>
        {/* ── TEACHER CALLOUT BOX ── */}
        <div style={S.teacherCallout}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div style={{ display: "flex", gap: "0.6rem" }}>
              <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>👩‍🏫</span>
              <div
                style={{
                  color: "#e2e8f0",
                  fontSize: "0.87rem",
                  lineHeight: 1.65,
                }}
              >
                {currentNote}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.6rem" }}>
            <button
              onClick={() =>
                setTeacherNoteIdx((i) => (i + 1) % currentNotes.length)
              }
              style={S.nextTipBtn}
            >
              💡 Next tip ({teacherNoteIdx + 1}/{currentNotes.length})
            </button>
          </div>
        </div>

        {/* HALF ADDER */}
        {activeTab === "half" && (
          <div>
            <div style={S.tabSectionTitle("#60a5fa")}>
              🔵 Half Adder — Adding 2 Single Bits
            </div>

            <div style={S.stepBox}>
              <div style={S.stepNumber}>Step 1</div>
              <div style={S.stepContent}>
                <strong>
                  Look at only the LAST (rightmost) bit of A and B.
                </strong>
                <br />
                <span style={{ color: "#94a3b8" }}>
                  A's last bit:{" "}
                  <strong style={{ color: "#60a5fa" }}>
                    {paddedA.slice(-1)}
                  </strong>
                  &nbsp;&nbsp;B's last bit:{" "}
                  <strong style={{ color: "#c084fc" }}>
                    {paddedB.slice(-1)}
                  </strong>
                </span>
              </div>
            </div>

            <div style={S.stepBox}>
              <div style={S.stepNumber}>Step 2</div>
              <div style={S.stepContent}>
                <strong>Apply XOR to get the Sum bit.</strong>
                <br />
                <span style={{ color: "#94a3b8" }}>
                  XOR means:{" "}
                  <em>
                    "if the bits are DIFFERENT, result is 1; if SAME, result is
                    0"
                  </em>
                </span>
                <br />
                <span style={{ color: "#94a3b8" }}>
                  {paddedA.slice(-1)} XOR {paddedB.slice(-1)} ={" "}
                  <strong style={{ color: "#4ade80", fontSize: "1.1rem" }}>
                    {h.sum}
                  </strong>
                </span>
              </div>
            </div>

            <div style={S.stepBox}>
              <div style={S.stepNumber}>Step 3</div>
              <div style={S.stepContent}>
                <strong>Apply AND to get the Carry bit.</strong>
                <br />
                <span style={{ color: "#94a3b8" }}>
                  AND means: <em>"only 1 if BOTH inputs are 1"</em>
                </span>
                <br />
                <span style={{ color: "#94a3b8" }}>
                  {paddedA.slice(-1)} AND {paddedB.slice(-1)} ={" "}
                  <strong style={{ color: "#fbbf24", fontSize: "1.1rem" }}>
                    {h.carry}
                  </strong>
                </span>
              </div>
            </div>

            <div style={S.formula}>
              {"Sum  = A ⊕ B  =  "}
              {paddedA.slice(-1)}
              {" ⊕ "}
              {paddedB.slice(-1)}
              {" = "}
              <strong style={{ color: "#4ade80" }}>{h.sum}</strong>
              {"\nCarry = A · B  =  "}
              {paddedA.slice(-1)}
              {" · "}
              {paddedB.slice(-1)}
              {" = "}
              <strong style={{ color: "#fbbf24" }}>{h.carry}</strong>
            </div>

            <div className="afhdl-grid-2-sm">
              {[
                {
                  label: "Input A (last bit)",
                  val: paddedA.slice(-1),
                  color: "#60a5fa",
                  desc: "From number A",
                },
                {
                  label: "Input B (last bit)",
                  val: paddedB.slice(-1),
                  color: "#c084fc",
                  desc: "From number B",
                },
                {
                  label: "Sum output",
                  val: h.sum,
                  color: "#4ade80",
                  desc: "The answer bit",
                },
                {
                  label: "Carry output",
                  val: h.carry,
                  color:
                    h.carry === "1" || h.carry === 1 ? "#f87171" : "#475569",
                  desc:
                    h.carry === "1" || h.carry === 1
                      ? "Overflow! Goes to next column"
                      : "No overflow",
                },
              ].map(({ label, val, color, desc }) => (
                <div key={label} style={S.signalBox(color)}>
                  <div
                    style={{
                      fontSize: "0.68rem",
                      color: "#64748b",
                      marginBottom: "0.1rem",
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: 900,
                      color,
                      lineHeight: 1,
                    }}
                  >
                    {val}
                  </div>
                  <div
                    style={{
                      fontSize: "0.68rem",
                      color: "#475569",
                      marginTop: "0.2rem",
                    }}
                  >
                    {desc}
                  </div>
                </div>
              ))}
            </div>

            <div style={S.note("#f87171")}>
              ⚠️ <strong>Important limitation:</strong> A Half Adder can only
              add <strong>2 bits</strong>. If you need to add longer numbers
              (like 1010 + 0101), you need Full Adders that can also receive a
              carry from the previous column. Half Adders are only used for the
              very first (rightmost) bit!
            </div>
          </div>
        )}

        {/* FULL ADDER */}
        {activeTab === "full" && (
          <div>
            <div style={S.tabSectionTitle("#c084fc")}>
              🟣 Full Adder — Handles 3 Inputs
            </div>

            <div style={S.note("#8b5cf6")}>
              🆚 <strong>Half Adder vs Full Adder:</strong> A Half Adder adds 2
              bits (A + B). A Full Adder adds{" "}
              <strong>3 bits: A + B + Carry-In</strong>. That Carry-In is what
              comes in from the previous column!
            </div>

            <div style={S.stepBox}>
              <div style={S.stepNumber}>Step 1</div>
              <div style={S.stepContent}>
                <strong>Gather all 3 inputs.</strong>
                <br />
                <span style={{ color: "#94a3b8" }}>
                  A ={" "}
                  <strong style={{ color: "#60a5fa" }}>
                    {paddedA.slice(-1)}
                  </strong>
                  &nbsp;&nbsp; B ={" "}
                  <strong style={{ color: "#c084fc" }}>
                    {paddedB.slice(-1)}
                  </strong>
                  &nbsp;&nbsp; Cin ={" "}
                  <strong style={{ color: "#fbbf24" }}>{cin}</strong>
                  &nbsp;&nbsp; Total ={" "}
                  <strong style={{ color: "#e2e8f0" }}>
                    {parseInt(paddedA.slice(-1)) +
                      parseInt(paddedB.slice(-1)) +
                      parseInt(cin)}
                  </strong>
                </span>
              </div>
            </div>

            <div style={S.stepBox}>
              <div style={S.stepNumber}>Step 2</div>
              <div style={S.stepContent}>
                <strong>XOR all 3 inputs to get Sum.</strong>
                <br />
                <span style={{ color: "#94a3b8" }}>
                  Think: "Is the count of 1s odd?" → Yes = Sum is 1, No = Sum is
                  0
                </span>
                <br />
                <span style={{ color: "#94a3b8" }}>
                  {paddedA.slice(-1)} ⊕ {paddedB.slice(-1)} ⊕ {cin} ={" "}
                  <strong style={{ color: "#4ade80", fontSize: "1.1rem" }}>
                    {f.sum}
                  </strong>
                </span>
              </div>
            </div>

            <div style={S.stepBox}>
              <div style={S.stepNumber}>Step 3</div>
              <div style={S.stepContent}>
                <strong>Calculate Carry-Out using majority vote.</strong>
                <br />
                <span style={{ color: "#94a3b8" }}>
                  Carry-Out = 1 when 2 or more inputs are 1 (majority wins!)
                </span>
                <br />
                <span style={{ color: "#94a3b8" }}>
                  (A AND B) OR (Cin AND (A XOR B)) ={" "}
                  <strong style={{ color: "#fbbf24", fontSize: "1.1rem" }}>
                    {f.carry}
                  </strong>
                </span>
              </div>
            </div>

            <div style={S.formula}>
              {"Sum  = A ⊕ B ⊕ Cin  =  "}
              {paddedA.slice(-1)}
              {" ⊕ "}
              {paddedB.slice(-1)}
              {" ⊕ "}
              {cin}
              {" = "}
              <strong style={{ color: "#4ade80" }}>{f.sum}</strong>
              {"\nCout = (A·B) + (Cin·(A⊕B))  = "}
              <strong style={{ color: "#fbbf24" }}>{f.carry}</strong>
            </div>

            <div className="afhdl-grid-3-sm">
              {[
                {
                  label: "A (last bit)",
                  val: paddedA.slice(-1),
                  color: "#60a5fa",
                  desc: "Input A",
                },
                {
                  label: "B (last bit)",
                  val: paddedB.slice(-1),
                  color: "#c084fc",
                  desc: "Input B",
                },
                {
                  label: "Carry-In",
                  val: cin,
                  color: "#fbbf24",
                  desc: "From previous column",
                },
                {
                  label: "Sum out",
                  val: f.sum,
                  color: "#4ade80",
                  desc: "The answer bit",
                },
                {
                  label: "Carry out",
                  val: f.carry,
                  color:
                    f.carry === "1" || f.carry === 1 ? "#f87171" : "#475569",
                  desc: "Goes to next column",
                },
                {
                  label: "Total (decimal)",
                  val:
                    parseInt(paddedA.slice(-1)) +
                    parseInt(paddedB.slice(-1)) +
                    parseInt(cin),
                  color: "#e2e8f0",
                  desc: "Sum before binary",
                },
              ].map(({ label, val, color, desc }) => (
                <div key={label} style={S.signalBox(color)}>
                  <div style={{ fontSize: "0.68rem", color: "#64748b" }}>
                    {label}
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color }}>
                    {val}
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "#475569" }}>
                    {desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RIPPLE CARRY */}
        {activeTab === "ripple" && (
          <div>
            <div style={S.tabSectionTitle("#4ade80")}>
              🟢 Ripple Carry Adder — A Chain of Full Adders
            </div>

            <div style={S.note("#10b981")}>
              🧩 <strong>How it works:</strong> We line up {paddedA.length} Full
              Adder(s) side by side — one for each bit column. The{" "}
              <strong>
                Carry-Out of each adder becomes the Carry-In of the next one
              </strong>
              . The carry "ripples" from right to left, like knocking over a row
              of dominoes!
            </div>

            <div style={{ margin: "0.6rem 0" }}>
              <button
                className="kmap-btn"
                onClick={startAnimation}
                disabled={isAnimating}
                style={{ marginRight: "0.5rem" }}
              >
                {isAnimating
                  ? "⏳ Watch the carry ripple…"
                  : "▶ Animate the Carry Flow!"}
              </button>
              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                Watch each column light up in order →
              </span>
            </div>

            <div
              style={{
                fontSize: "0.75rem",
                color: "#64748b",
                marginBottom: "0.4rem",
              }}
            >
              Column order: <strong>rightmost first</strong> (smallest bit →
              biggest bit). Click any column for details.
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "5px",
                flexWrap: "wrap",
                margin: "0.5rem 0",
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
                        ? "rgba(16,185,129,0.3)"
                        : highlightedRow === i
                          ? "rgba(99,102,241,0.25)"
                          : "rgba(30,41,59,0.7)",
                      border: `2px solid ${isActive ? "#10b981" : highlightedRow === i ? "#6366f1" : "rgba(148,163,184,0.18)"}`,
                      borderRadius: "10px",
                      padding: "0.5rem 0.5rem",
                      minWidth: "56px",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      opacity: isAnimating && !revealed ? 0.2 : 1,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.58rem",
                        color: "#475569",
                        marginBottom: "1px",
                      }}
                    >
                      col {row.pos}
                    </div>
                    <div
                      style={{
                        color: "#60a5fa",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                      }}
                    >
                      {row.ai}
                    </div>
                    <div
                      style={{
                        color: "#c084fc",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                      }}
                    >
                      {row.bi}
                    </div>
                    <div
                      style={{
                        borderTop: "1px solid rgba(148,163,184,0.15)",
                        marginTop: "3px",
                        paddingTop: "3px",
                      }}
                    >
                      <div style={{ fontSize: "0.62rem", color: "#fbbf24" }}>
                        Cin:{row.cin}
                      </div>
                      <div
                        style={{
                          color: "#4ade80",
                          fontWeight: 900,
                          fontSize: "1rem",
                        }}
                      >
                        {row.sum}
                      </div>
                      <div
                        style={{
                          fontSize: "0.62rem",
                          color: row.cout ? "#f87171" : "#475569",
                        }}
                      >
                        Cout:{row.cout}
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
                  border: `2px solid ${finalCarry ? "#f87171" : "rgba(148,163,184,0.12)"}`,
                  borderRadius: "10px",
                  padding: "0.5rem 0.5rem",
                  minWidth: "56px",
                  textAlign: "center",
                  opacity: isAnimating && animStep < trace.length ? 0.2 : 1,
                  transition: "opacity 0.3s",
                }}
              >
                <div style={{ fontSize: "0.58rem", color: "#475569" }}>
                  final
                </div>
                <div style={{ fontSize: "0.62rem", color: "#475569" }}>
                  carry
                </div>
                <div
                  style={{
                    fontWeight: 900,
                    color: finalCarry ? "#f87171" : "#475569",
                    fontSize: "1rem",
                  }}
                >
                  {finalCarry}
                </div>
              </div>
            </div>

            <p
              style={{
                fontSize: "0.72rem",
                color: "#475569",
                marginBottom: "0.4rem",
              }}
            >
              👆 Click any column card to see a detailed breakdown
            </p>

            {highlightedRow !== null && trace[highlightedRow] && (
              <div style={{ ...S.note("#10b981"), margin: "0.4rem 0" }}>
                <strong>
                  📊 Column {trace[highlightedRow].pos} breakdown:
                </strong>
                <br />
                A={trace[highlightedRow].ai} + B={trace[highlightedRow].bi} +
                Cin={trace[highlightedRow].cin}={" "}
                {trace[highlightedRow].ai +
                  trace[highlightedRow].bi +
                  trace[highlightedRow].cin}{" "}
                in decimal
                <br />→ <strong>Sum = {trace[highlightedRow].sum}</strong> (the
                result bit for this column) &nbsp;{" "}
                <strong>Cout = {trace[highlightedRow].cout}</strong> (
                {trace[highlightedRow].cout
                  ? "carry goes to next column!"
                  : "no carry needed"}
                )
              </div>
            )}

            <div style={S.formula}>
              {"Full result: "}
              {finalCarry ? "1" : ""}
              {ripple.sum}
              {"₂  =  "}
              {correctSum}
              {"₁₀"}
              {finalCarry ? "\n⚠ The final carry-out means overflow!" : ""}
            </div>

            <div style={S.note("#64748b")}>
              🐢 <strong>Why is Ripple Carry slow?</strong> Column 2 can't start
              until Column 1 finishes (because it needs Column 1's carry).
              Column 3 waits for Column 2. And so on. For 64-bit numbers, that's
              64 steps in a row! That's why engineers invented{" "}
              <strong>CLA (Carry Look-Ahead)</strong> — see the next tab!
            </div>
          </div>
        )}

        {/* CLA */}
        {activeTab === "cla" && (
          <div>
            <div style={S.tabSectionTitle("#fbbf24")}>
              🟡 Carry Look-Ahead (CLA) — Predicting Carries
            </div>

            <div style={S.note("#f59e0b")}>
              🚀 <strong>The big idea:</strong> Instead of waiting for each
              carry to arrive one by one, CLA{" "}
              <strong>predicts ALL carries in advance</strong> using two
              signals: G (Generate) and P (Propagate). It's like knowing the
              answer before doing the work!
            </div>

            <div className="afhdl-grid-2-sm">
              <div style={S.note("#f87171")}>
                <strong style={{ color: "#f87171" }}>🔴 G = Generate</strong>
                <br />
                <strong>Formula: G = A AND B</strong>
                <br />
                <br />
                Means: "This bit position will <em>create</em> a carry ALL BY
                ITSELF, no matter what comes in."
                <br />
                <br />
                <em style={{ color: "#94a3b8" }}>
                  Example: A=1, B=1 → 1+1=2 → always overflows → G=1
                </em>
              </div>
              <div style={S.note("#60a5fa")}>
                <strong style={{ color: "#60a5fa" }}>🔵 P = Propagate</strong>
                <br />
                <strong>Formula: P = A XOR B</strong>
                <br />
                <br />
                Means: "If a carry arrives at my input, I will{" "}
                <em>pass it along</em> to the output."
                <br />
                <br />
                <em style={{ color: "#94a3b8" }}>
                  Example: A=1, B=0 → 1+0+1(carry)=2 → passes the carry through
                  → P=1
                </em>
              </div>
            </div>

            <div style={S.formula}>
              {
                "C[i+1] = G[i]  +  P[i] · C[i]\n\nRead as: 'Next carry = (I generate one) OR (I propagate one that arrived)'"
              }
            </div>

            <div
              style={{
                fontSize: "0.82rem",
                color: "#94a3b8",
                margin: "0.5rem 0 0.3rem",
                fontWeight: 600,
              }}
            >
              G and P values for your current inputs:
            </div>
            <div style={{ display: "grid", gap: "2px", marginTop: "0.5rem" }}>
              <div
                style={{
                  ...S.tableHeader,
                  gridTemplateColumns: "1fr 1fr 1fr 1.5fr 1.5fr 2fr",
                }}
              >
                <span>Column</span>
                <span>A</span>
                <span>B</span>
                <span style={{ color: "#f87171" }}>G (creates?)</span>
                <span style={{ color: "#60a5fa" }}>P (passes?)</span>
                <span>What it means</span>
              </div>
              {claTrace.map((row) => (
                <div
                  key={row.pos}
                  style={{
                    ...S.tableRow,
                    gridTemplateColumns: "1fr 1fr 1fr 1.5fr 1.5fr 2fr",
                  }}
                >
                  <span style={{ color: "#475569" }}>
                    col {claTrace.length - 1 - row.pos}
                  </span>
                  <span style={{ color: "#60a5fa" }}>{row.ai}</span>
                  <span style={{ color: "#c084fc" }}>{row.bi}</span>
                  <span
                    style={{
                      color: row.G ? "#f87171" : "var(--afhdl-muted)",
                      fontWeight: row.G ? 700 : 400,
                    }}
                  >
                    {row.G}
                  </span>
                  <span
                    style={{
                      color: row.P ? "#60a5fa" : "var(--afhdl-muted)",
                      fontWeight: row.P ? 700 : 400,
                    }}
                  >
                    {row.P}
                  </span>
                  <span style={{ fontSize: "0.7rem", color: "var(--afhdl-muted)" }}>
                    {row.G
                      ? "🔴 creates carry"
                      : row.P
                        ? "🔵 passes carry"
                        : "⬜ blocks carry"}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ ...S.note("#f59e0b"), marginTop: "0.8rem" }}>
              ⚡ <strong>Speed comparison:</strong> Ripple Carry processes
              carries one-by-one (slow). CLA calculates ALL carries at the same
              time (fast). For 8-bit numbers, CLA can be 3–4× faster. For 64-bit
              numbers used in modern CPUs, the difference is enormous!
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
        {showTruthTable ? "▲ Hide" : "▼ Show"} Full Adder Truth Table (all 8
        possible input combinations)
      </button>
      {showTruthTable && (
        <div style={S.card}>
          <div style={S.teacherBubble}>
            <span style={S.teacherAvatar}>👩‍🏫</span>
            <div style={S.teacherText}>
              A truth table shows{" "}
              <strong>every possible combination of inputs</strong> and their
              outputs. The{" "}
              <strong style={{ color: "#6366f1" }}>highlighted row</strong> is
              your current input! Notice how Sum and Cout change as you scroll
              through different inputs.
            </div>
          </div>
          <div style={{ display: "grid", gap: "3px", marginTop: "0.6rem" }}>
            <div
              style={{
                ...S.tableHeader,
                gridTemplateColumns: "repeat(6,1fr)",
              }}
            >
              <span>A</span>
              <span>B</span>
              <span>Cin</span>
              <span style={{ color: "#4ade80" }}>Sum</span>
              <span style={{ color: "#fbbf24" }}>Cout</span>
              <span>A+B+Cin</span>
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
                      ? "var(--afhdl-table-header-bg)"
                      : "var(--afhdl-table-row-bg)",
                    border: match
                      ? "1px solid #6366f1"
                      : "1px solid transparent",
                    borderRadius: "4px",
                    padding: "0.3rem 0.5rem",
                    fontSize: "0.82rem",
                    textAlign: "center",
                    color: "var(--afhdl-text)",
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
              marginTop: "0.5rem",
            }}
          >
            🟣 The highlighted row matches your current inputs above. Change
            your inputs to see it move!
          </p>
        </div>
      )}

      {/* ══ HDL CODE ════════════════════════════════════════ */}
      <button
        className="kmap-btn kmap-btn-secondary"
        style={{ width: "100%", margin: "0.3rem 0" }}
        onClick={() => setShowHDL((v) => !v)}
      >
        {showHDL ? "▲ Hide" : "▼ Show"} Hardware Code (VHDL + Verilog) — for
        advanced learners
      </button>
      {showHDL && (
        <div style={S.card}>
          <div style={S.teacherBubble}>
            <span style={S.teacherAvatar}>👩‍🏫</span>
            <div style={S.teacherText}>
              This is what a Full Adder looks like when written as actual
              hardware code! VHDL and Verilog are languages used to design real
              chips. Notice how the formulas match exactly what we learned above
              — Sum uses XOR (^), Carry uses AND (&amp;) and OR (|).
            </div>
          </div>
          <div style={{ ...S.codeBlock, marginTop: "0.6rem" }}>
            <AFHDLCopyButton
              text={`-- VHDL Full Adder\nentity full_adder is\n  port(A, B, Cin : in  std_logic;\n       Sum, Cout : out std_logic);\nend full_adder;\narchitecture rtl of full_adder is\nbegin\n  Sum  <= A xor B xor Cin;\n  Cout <= (A and B) or (Cin and (A xor B));\nend rtl;\n\n// Verilog Full Adder\nmodule full_adder(input A, B, Cin, output Sum, Cout);\n  assign Sum  = A ^ B ^ Cin;\n  assign Cout = (A & B) | (Cin & (A ^ B));\nendmodule`}
            />
            <pre
              style={{
                margin: 0,
                color: "#e2e8f0",
                fontSize: "0.75rem",
                lineHeight: 1.75,
              }}
            >{`-- VHDL Full Adder
entity full_adder is
  port(A, B, Cin : in  std_logic;
       Sum, Cout : out std_logic);
end full_adder;
architecture rtl of full_adder is
begin
  Sum  <= A xor B xor Cin;        -- XOR for sum
  Cout <= (A and B) or (Cin and (A xor B)); -- carry logic
end rtl;

// Verilog Full Adder
module full_adder(input A, B, Cin, output Sum, Cout);
  assign Sum  = A ^ B ^ Cin;              // ^ means XOR
  assign Cout = (A & B) | (Cin & (A ^ B)); // & is AND, | is OR
endmodule`}</pre>
          </div>
        </div>
      )}

      {/* ══ QUIZ ════════════════════════════════════════════ */}
      <AFHDLDivider />
      <div style={S.sectionTitle}>🧠 Quiz — Test What You Learned!</div>

      {!quizMode ? (
        <div style={S.card}>
          <div style={S.teacherBubble}>
            <span style={S.teacherAvatar}>👩‍🏫</span>
            <div style={S.teacherText}>
              Ready to see how much you've learned? Don't worry — each question
              has a<strong> 💡 Hint</strong> button if you get stuck, and I'll
              explain the answer after each one!
            </div>
          </div>
          <button
            className="kmap-btn"
            style={{ marginTop: "0.6rem", width: "100%" }}
            onClick={() => {
              setQuizMode(true);
              resetQuiz();
            }}
          >
            Start Quiz ({QUIZ_QUESTIONS.length} questions) →
          </button>
        </div>
      ) : quizDone ? (
        <div style={S.card}>
          <div
            style={{
              fontSize: "1.4rem",
              fontWeight: 800,
              color: "#4ade80",
              marginBottom: "0.5rem",
            }}
          >
            {quizScore >= 6
              ? "🎉 Excellent! You really got it!"
              : quizScore >= 4
                ? "👍 Good job! Keep it up!"
                : "📚 Good start! Review and try again!"}
          </div>
          <p style={{ color: "#cbd5e1", fontSize: "0.9rem" }}>
            You scored{" "}
            <strong style={{ color: "#4ade80", fontSize: "1.1rem" }}>
              {quizScore}
            </strong>{" "}
            out of <strong>{QUIZ_QUESTIONS.length}</strong>.
          </p>
          {quizScore < 6 && (
            <p
              style={{
                color: "#94a3b8",
                fontSize: "0.82rem",
                marginTop: "0.3rem",
              }}
            >
              💡 Tip: Go back and re-read the tab sections for any topics that
              felt tricky, then try again!
            </p>
          )}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
            <button className="kmap-btn" onClick={resetQuiz}>
              🔄 Try Again
            </button>
            <button
              className="kmap-btn kmap-btn-secondary"
              onClick={() => setQuizMode(false)}
            >
              ← Back
            </button>
          </div>
        </div>
      ) : (
        <div style={S.card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.4rem",
            }}
          >
            <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
              Question {quizIdx + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <span style={{ color: "#4ade80", fontSize: "0.8rem" }}>
              Score: {quizScore} ✓
            </span>
          </div>

          {/* Progress bar */}
          <div
            style={{
              height: "5px",
              background: "rgba(148,163,184,0.12)",
              borderRadius: "3px",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(quizIdx / QUIZ_QUESTIONS.length) * 100}%`,
                background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                borderRadius: "3px",
                transition: "width 0.3s",
              }}
            />
          </div>

          <div
            style={{
              color: "#f8fafc",
              fontWeight: 700,
              fontSize: "0.95rem",
              marginBottom: "0.8rem",
              lineHeight: 1.5,
            }}
          >
            {QUIZ_QUESTIONS[quizIdx].q}
          </div>

          {/* Hint button */}
          {quizAnswer === null && (
            <button
              onClick={() => setShowHint((v) => !v)}
              style={{
                background: "transparent",
                border: "1px dashed #f59e0b",
                borderRadius: "6px",
                color: "#fbbf24",
                padding: "0.3rem 0.8rem",
                cursor: "pointer",
                fontSize: "0.78rem",
                marginBottom: "0.6rem",
              }}
            >
              {showHint ? "🙈 Hide hint" : "💡 Show me a hint"}
            </button>
          )}
          {showHint && quizAnswer === null && (
            <div
              style={{
                ...S.note("#f59e0b"),
                marginBottom: "0.6rem",
                fontSize: "0.82rem",
              }}
            >
              💡 {QUIZ_QUESTIONS[quizIdx].hint}
            </div>
          )}

          <div style={{ display: "grid", gap: "0.45rem" }}>
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
                    borderRadius: "8px",
                    padding: "0.6rem 0.9rem",
                    color: "#e2e8f0",
                    textAlign: "left",
                    cursor: quizAnswer !== null ? "default" : "pointer",
                    fontSize: "0.87rem",
                    transition: "all 0.2s",
                    lineHeight: 1.4,
                  }}
                >
                  {quizAnswer !== null &&
                    (isCorrect ? "✅ " : selected ? "❌ " : "")}
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Post-answer teacher explanation */}
          {quizAnswer !== null && (
            <div
              style={{
                ...S.note(
                  quizAnswer === QUIZ_QUESTIONS[quizIdx].ans
                    ? "#4ade80"
                    : "#f87171",
                ),
                marginTop: "0.7rem",
              }}
            >
              <strong>
                {quizAnswer === QUIZ_QUESTIONS[quizIdx].ans
                  ? "✅ Correct!"
                  : "❌ Not quite!"}
              </strong>
              <br />
              <span style={{ fontSize: "0.83rem" }}>
                👩‍🏫 {QUIZ_QUESTIONS[quizIdx].explain}
              </span>
            </div>
          )}

          {quizAnswer !== null && (
            <button
              className="kmap-btn"
              style={{ marginTop: "0.75rem", width: "100%" }}
              onClick={nextQ}
            >
              {quizIdx + 1 >= QUIZ_QUESTIONS.length
                ? "See My Results →"
                : "Next Question →"}
            </button>
          )}
        </div>
      )}
    </AFHDLLayout>
  );
};

export default BinaryAdders;
