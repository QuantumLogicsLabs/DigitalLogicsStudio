import React, { useMemo, useState } from "react";
import ControlGroup from "../../components/ControlGroup";
import ControlPanel from "../../components/ControlPanel";
import { cleanBin, compareMagnitude } from "../../utils/arithmeticHelpers";
import AFHDLLayout from "./components/AFHDLLayout";
import AFHDLActionRow from "./components/AFHDLActionRow";
import AFHDLCardGroup from "./components/AFHDLCardGroup";
import AFHDLInfoPanel from "./components/AFHDLInfoPanel";
import AFHDLSection from "./components/AFHDLSection";
import AFHDLStepList from "./components/AFHDLStepList";
import AFHDLDivider from "./components/AFHDLDivider";
import { afhdlTheme as S } from "./utils/afhdlTheme";

const QUIZ = [
  {
    q: "Which bit do you check FIRST when comparing A = 1011 and B = 1001?",
    opts: ["Rightmost bit (bit 0)", "Middle bits", "Leftmost bit (MSB)", "Carry bit"],
    ans: 2,
    explain: "Always start from the MSB (Most Significant Bit — the leftmost). The first bit position where A and B differ decides the winner immediately.",
  },
  {
    q: "A = 1100, B = 1100. What is the comparator output?",
    opts: ["A > B", "A < B", "A = B", "Cannot determine"],
    ans: 2,
    explain: "All bits are identical, so A equals B. The comparator checks every bit and finds no difference.",
  },
  {
    q: "A = 0110 (6), B = 1001 (9). What is the output?",
    opts: ["A > B", "A < B", "A = B", "Overflow"],
    ans: 1,
    explain: "Start at the MSB: A's MSB is 0, B's MSB is 1. Since 1 > 0, B wins immediately — A < B. You don't need to check the remaining bits.",
  },
  {
    q: "What gate is typically used for the equality check of each bit pair?",
    opts: ["AND gate", "OR gate", "XNOR gate (equality)", "NOR gate"],
    ans: 2,
    explain: "XNOR (equivalence gate) outputs 1 when both inputs are EQUAL and 0 when they differ. A[i] XNOR B[i] = 1 only when both bits match.",
  },
];

const MagnitudeComparator = () => {
  const [a, setA] = useState("1100");
  const [b, setB] = useState("1010");
  const [showDetail, setShowDetail] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const cleanA = cleanBin(a) || "0";
  const cleanB = cleanBin(b) || "0";
  const padLen = Math.max(cleanA.length, cleanB.length, 4);
  const paddedA = cleanA.padStart(padLen, "0");
  const paddedB = cleanB.padStart(padLen, "0");
  const status = compareMagnitude(a, b);

  const decimalValues = useMemo(
    () => ({
      a: parseInt(cleanA, 2),
      b: parseInt(cleanB, 2),
    }),
    [cleanA, cleanB]
  );

  const firstDiff = useMemo(() => {
    for (let i = 0; i < paddedA.length; i++) {
      if (paddedA[i] !== paddedB[i]) return i;
    }
    return -1;
  }, [paddedA, paddedB]);

  const handleQ = (i) => {
    setQuizAnswer(i);
    if (i === QUIZ[quizIdx].ans) setQuizScore((s) => s + 1);
  };
  const nextQ = () => {
    if (quizIdx + 1 >= QUIZ.length) setQuizDone(true);
    else { setQuizIdx((i) => i + 1); setQuizAnswer(null); }
  };
  const resetQuiz = () => { setQuizIdx(0); setQuizAnswer(null); setQuizScore(0); setQuizDone(false); };

  return (
    <AFHDLLayout
      title="Magnitude Comparator"
      subtitle="Compare two binary values and explain exactly why one is larger."
      intro="Comparators make decisions. They tell a digital system whether two values are equal, or whether A should be treated as larger or smaller than B — starting from the most important bit."
      highlights={[
        {
          title: "Key rule to learn",
          text: "Always start from the MSB (leftmost bit). The first bit where A and B differ decides the winner immediately.",
        },
        {
          title: "Where you will see this",
          text: "Comparators appear in branch logic, sorting circuits, threshold detectors, and processor status flags.",
        },
      ]}
    >
      {/* ── Teacher intro ──────────────────────────────────── */}
      <div style={S.teacherBubble}>
        <span style={S.teacherAvatar}>👩‍🏫</span>
        <div style={S.teacherText}>
          <strong>Think of it like a spelling contest.</strong> You compare two words letter by letter from the left — the first letter that differs decides which word comes first. Binary comparison works exactly the same way, bit by bit from the MSB.
        </div>
      </div>

      {/* ── Concept overview ───────────────────────────────── */}
      <AFHDLSection
        kicker="Concept"
        title="How a comparator thinks"
        description="The comparator checks bit pairs from left to right and stops as soon as it finds a difference."
      >
        <p>
          The comparator checks whether the highest-order bits are equal. If they are, it moves to the next bit. The first position where the two inputs differ determines whether <strong>A &gt; B</strong> or <strong>A &lt; B</strong>.
        </p>
        <div style={S.note("#6366f1")}>
          💡 <strong>Three outputs:</strong> A &gt; B, A &lt; B, and A = B. Only one of them will be 1 at any time — they are mutually exclusive.
        </div>
      </AFHDLSection>

      {/* ── Interactive inputs ─────────────────────────────── */}
      <ControlPanel>
        <ControlGroup label="A (binary)">
          <input
            className="tool-input"
            value={a}
            onChange={(event) => setA(cleanBin(event.target.value))}
            placeholder="e.g. 1100"
          />
        </ControlGroup>
        <ControlGroup label="B (binary)">
          <input
            className="tool-input"
            value={b}
            onChange={(event) => setB(cleanBin(event.target.value))}
            placeholder="e.g. 1010"
          />
        </ControlGroup>
      </ControlPanel>

      <AFHDLCardGroup>
        <AFHDLInfoPanel
          title="Comparator output"
          content={status}
        />
        <AFHDLInfoPanel title={`A = ${paddedA}`} content={`${decimalValues.a} in decimal`} />
        <AFHDLInfoPanel title={`B = ${paddedB}`} content={`${decimalValues.b} in decimal`} />
      </AFHDLCardGroup>

      {/* ── Bit-by-bit visual walkthrough ──────────────────── */}
      <AFHDLSection
        kicker="Walkthrough"
        title="Bit-by-bit comparison"
        description="Watch each bit pair be checked from the leftmost position."
      >
        <div style={{ display: "grid", gap: "4px", marginTop: "0.5rem" }}>
          <div style={{ ...S.tableHeader, gridTemplateColumns: "auto 1fr 1fr 1fr" }}>
            <span style={{ paddingRight: "0.5rem" }}>Bit</span>
            <span>A</span>
            <span>B</span>
            <span>Decision</span>
          </div>
          {paddedA.split("").map((aBit, i) => {
            const bBit = paddedB[i];
            const isDeciding = i === firstDiff;
            const isEqual = aBit === bBit;
            return (
              <div
                key={i}
                style={{
                  ...S.tableRow,
                  gridTemplateColumns: "auto 1fr 1fr 1fr",
                  background: isDeciding ? "var(--afhdl-table-header-bg)" : "var(--afhdl-table-row-bg)",
                  border: isDeciding ? "1px solid var(--afhdl-border-strong)" : "1px solid transparent",
                  borderRadius: "6px",
                  padding: "0.35rem 0.5rem",
                }}
              >
                <span style={{ color: "var(--afhdl-muted)", paddingRight: "0.5rem", fontSize: "0.72rem" }}>
                  bit {paddedA.length - 1 - i}
                </span>
                <span style={{ color: "#60a5fa", fontWeight: 700 }}>{aBit}</span>
                <span style={{ color: "#c084fc", fontWeight: 700 }}>{bBit}</span>
                <span style={{ fontSize: "0.75rem", color: isDeciding ? (aBit > bBit ? "#4ade80" : "#f87171") : "#4ade80" }}>
                  {isEqual ? "equal — continue" : (isDeciding ? (aBit > bBit ? "A wins here!" : "B wins here!") : "—")}
                </span>
              </div>
            );
          })}
        </div>
        {firstDiff === -1 && (
          <div style={{ ...S.note("#4ade80"), marginTop: "0.5rem" }}>
            ✅ Every bit is equal → A = B
          </div>
        )}
      </AFHDLSection>

      {/* ── Step-by-step reasoning ─────────────────────────── */}
      <AFHDLSection
        kicker="Method"
        title="Read the result step by step"
        description="Use this procedure every time until the habit becomes automatic."
      >
        <AFHDLActionRow>
          <button
            className="kmap-btn kmap-btn-secondary"
            onClick={() => setShowDetail((value) => !value)}
          >
            {showDetail ? "Hide" : "Show"} detailed reasoning
          </button>
        </AFHDLActionRow>

        {showDetail ? (
          <>
            <AFHDLStepList
              steps={[
                "Align both numbers so they have the same number of bits (pad with leading zeros if needed).",
                "Start at the leftmost bit (MSB). Check if A[MSB] and B[MSB] are the same.",
                "If equal, move one position to the right and compare again.",
                "At the first mismatch, the number with a 1 at that position is larger.",
                "If no mismatch is found through all bits, A = B.",
              ]}
            />
            <div style={{ ...S.note("#f59e0b"), marginTop: "0.75rem" }}>
              🔑 <strong>Worked example:</strong> A = {paddedA} ({decimalValues.a}), B = {paddedB} ({decimalValues.b}).{" "}
              {firstDiff === -1
                ? "All bits match → A = B."
                : `First difference at bit ${paddedA.length - 1 - firstDiff}: A has ${paddedA[firstDiff]}, B has ${paddedB[firstDiff]}. Since ${paddedA[firstDiff] > paddedB[firstDiff] ? "A has 1 and B has 0, A > B" : "B has 1 and A has 0, A < B"}.`}
            </div>
          </>
        ) : null}
      </AFHDLSection>

      {/* ── Quiz ───────────────────────────────────────────── */}
      <AFHDLDivider />
      <div style={S.sectionTitle}>🧠 Quiz — Test Your Understanding</div>

      {!quizMode ? (
        <div style={S.card}>
          <div style={S.teacherBubble}>
            <span style={S.teacherAvatar}>👩‍🏫</span>
            <div style={S.teacherText}>
              Ready to check what you learned? Four quick questions on comparing binary numbers.
            </div>
          </div>
          <button className="kmap-btn" style={{ marginTop: "0.6rem", width: "100%" }}
            onClick={() => { setQuizMode(true); resetQuiz(); }}>
            Start Quiz ({QUIZ.length} questions) →
          </button>
        </div>
      ) : quizDone ? (
        <div style={S.card}>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#4ade80", marginBottom: "0.4rem" }}>
            {quizScore >= 3 ? "🎉 Great job!" : "📚 Keep practicing!"}
          </div>
          <p style={{ color: "var(--afhdl-muted)" }}>Score: <strong style={{ color: "#4ade80" }}>{quizScore}</strong> / {QUIZ.length}</p>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.6rem" }}>
            <button className="kmap-btn" onClick={resetQuiz}>Try Again</button>
            <button className="kmap-btn kmap-btn-secondary" onClick={() => setQuizMode(false)}>Exit</button>
          </div>
        </div>
      ) : (
        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
            <span style={{ color: "var(--afhdl-muted)", fontSize: "0.8rem" }}>Q {quizIdx + 1}/{QUIZ.length}</span>
            <span style={{ color: "#4ade80", fontSize: "0.8rem" }}>Score: {quizScore}</span>
          </div>
          <div style={{ height: "4px", background: "var(--afhdl-border)", borderRadius: "2px", marginBottom: "0.8rem" }}>
            <div style={{ height: "100%", width: `${(quizIdx / QUIZ.length) * 100}%`, background: "#6366f1", borderRadius: "2px", transition: "width 0.3s" }} />
          </div>
          <div style={{ color: "var(--afhdl-text)", fontWeight: 600, fontSize: "0.92rem", marginBottom: "0.7rem", lineHeight: 1.5 }}>
            {QUIZ[quizIdx].q}
          </div>
          <div style={{ display: "grid", gap: "0.4rem" }}>
            {QUIZ[quizIdx].opts.map((opt, i) => {
              const isCorrect = i === QUIZ[quizIdx].ans;
              const selected = quizAnswer === i;
              let bg = "var(--afhdl-table-row-bg)", border = "var(--afhdl-border)";
              if (quizAnswer !== null) {
                if (isCorrect) { bg = "rgba(74,222,128,0.12)"; border = "#4ade80"; }
                else if (selected) { bg = "rgba(248,113,113,0.12)"; border = "#f87171"; }
              }
              return (
                <button key={i} disabled={quizAnswer !== null} onClick={() => handleQ(i)}
                  style={{ background: bg, border: `1px solid ${border}`, borderRadius: "8px", padding: "0.55rem 0.85rem", color: "var(--afhdl-text)", textAlign: "left", cursor: quizAnswer !== null ? "default" : "pointer", fontSize: "0.87rem", transition: "all 0.18s" }}>
                  {quizAnswer !== null && (isCorrect ? "✅ " : selected ? "❌ " : "")}{opt}
                </button>
              );
            })}
          </div>
          {quizAnswer !== null && (
            <div style={{ ...S.note(quizAnswer === QUIZ[quizIdx].ans ? "#4ade80" : "#f87171"), marginTop: "0.65rem" }}>
              <strong>{quizAnswer === QUIZ[quizIdx].ans ? "✅ Correct!" : "❌ Not quite."}</strong>
              <br /><span style={{ fontSize: "0.83rem" }}>👩‍🏫 {QUIZ[quizIdx].explain}</span>
            </div>
          )}
          {quizAnswer !== null && (
            <button className="kmap-btn" style={{ marginTop: "0.65rem", width: "100%" }} onClick={nextQ}>
              {quizIdx + 1 >= QUIZ.length ? "See My Results →" : "Next Question →"}
            </button>
          )}
        </div>
      )}
    </AFHDLLayout>
  );
};

export default MagnitudeComparator;
