import React, { useState } from "react";
import AFHDLSection from "../ArithmeticFunctionsAndHDLs/components/AFHDLSection";
import AFHDLCard from "../ArithmeticFunctionsAndHDLs/components/AFHDLCard";
import AFHDLCardGroup from "../ArithmeticFunctionsAndHDLs/components/AFHDLCardGroup";
import AFHDLInfoPanel from "../ArithmeticFunctionsAndHDLs/components/AFHDLInfoPanel";
import AFHDLDivider from "../ArithmeticFunctionsAndHDLs/components/AFHDLDivider";
import AFHDLStepList from "../ArithmeticFunctionsAndHDLs/components/AFHDLStepList";
import MemoryLayout from "./MemoryLayout";

const QUIZ = [
  {
    q: "What are the two planes in a PLA?",
    opts: [
      "AND plane and OR plane",
      "NOR plane and NAND plane",
      "XOR plane and XNOR plane",
      "Input plane and Output plane",
    ],
    ans: 0,
    explain:
      "A PLA has a programmable AND plane (for product terms) and a programmable OR plane (for sum of products).",
  },
  {
    q: "What does PLA stand for?",
    opts: [
      "Programmable Logic Array",
      "Parallel Logic Architecture",
      "Programmable Lookup Array",
      "Parallel Lookup Architecture",
    ],
    ans: 0,
    explain: "PLA stands for Programmable Logic Array.",
  },
  {
    q: "How does a PAL differ from a PLA?",
    opts: [
      "PAL has a programmable AND plane and fixed OR plane",
      "PAL has a fixed AND plane and programmable OR plane",
      "PAL has no OR plane",
      "PAL is not programmable",
    ],
    ans: 0,
    explain:
      "A PAL (Programmable Array Logic) has a programmable AND plane but a fixed OR plane, making it simpler than a PLA.",
  },
  {
    q: "What technology replaced simple PLAs in modern design?",
    opts: ["Vacuum tubes", "FPGAs", "Relays", "Analog circuits"],
    ans: 1,
    explain:
      "FPGAs (Field-Programmable Gate Arrays) have largely replaced simple PLAs for complex programmable logic.",
  },
];

const ProgrammableLogicArray = () => {
  const [quizMode, setQuizMode] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const resetQuiz = () => {
    setQuizIdx(0);
    setQuizAnswer(null);
    setQuizScore(0);
    setQuizDone(false);
  };
  const handleQ = (i) => {
    if (quizAnswer !== null) return;
    setQuizAnswer(i);
    if (i === QUIZ[quizIdx].ans) setQuizScore((s) => s + 1);
  };
  const nextQ = () => {
    if (quizIdx + 1 >= QUIZ.length) {
      setQuizDone(true);
      return;
    }
    setQuizIdx((i) => i + 1);
    setQuizAnswer(null);
  };

  const S = {
    card: {
      background: "var(--afhdl-card-bg)",
      border: "1px solid var(--afhdl-border)",
      borderRadius: "10px",
      padding: "1rem",
      marginBottom: "0.75rem",
    },
    note: (c) => ({
      background: `${c}18`,
      border: `1px solid ${c}55`,
      borderRadius: "8px",
      padding: "0.6rem 0.85rem",
      fontSize: "0.85rem",
      color: "var(--afhdl-text)",
      marginTop: "0.5rem",
    }),
    sectionTitle: {
      fontSize: "1rem",
      fontWeight: 700,
      color: "var(--afhdl-text)",
      margin: "1rem 0 0.5rem",
    },
  };

  return (
    <MemoryLayout
      kicker="Memory Systems"
      title="Programmable Logic Array (PLA) Devices"
      description="PLAs are programmable chips that implement combinational logic using a programmable AND-OR structure. They offer flexibility between full custom ICs and fixed-function logic gates."
    >
      <AFHDLSection
        kicker="Concept"
        title="What is a PLA?"
        description="A PLA implements Boolean functions in Sum-of-Products (SOP) form using two programmable planes: an AND plane and an OR plane."
      >
        <AFHDLCardGroup>
          <AFHDLInfoPanel
            title="AND Plane"
            content="Programmable — generates product terms (minterms)"
          />
          <AFHDLInfoPanel
            title="OR Plane"
            content="Programmable — sums selected product terms"
          />
          <AFHDLInfoPanel
            title="Advantage"
            content="Fewer product terms needed than a full ROM"
          />
        </AFHDLCardGroup>
      </AFHDLSection>

      <AFHDLSection
        kicker="Structure"
        title="PLA Architecture"
        description="A PLA with n inputs, k product terms, and m outputs can implement m functions of n variables using at most k product terms."
      >
        <AFHDLCard title="PLA Example: 3 inputs, 4 product terms, 2 outputs">
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "0.82rem",
              background: "var(--afhdl-table-row-bg)",
              borderRadius: "8px",
              padding: "0.75rem",
              lineHeight: 2,
            }}
          >
            <div style={{ color: "#60a5fa" }}>Product Terms (AND plane):</div>
            <div>P1 = A · B'· C</div>
            <div>P2 = A'· B · C</div>
            <div>P3 = A · B · C'</div>
            <div>P4 = A · B · C</div>
            <div style={{ color: "#4ade80", marginTop: "0.5rem" }}>
              Outputs (OR plane):
            </div>
            <div>F1 = P1 + P2 + P4</div>
            <div>F2 = P2 + P3 + P4</div>
          </div>
        </AFHDLCard>
      </AFHDLSection>

      <AFHDLSection
        kicker="Comparison"
        title="PLA vs PAL vs ROM"
        description="Each programmable logic device has different trade-offs between flexibility and simplicity."
      >
        <AFHDLStepList
          steps={[
            "ROM — Fixed AND plane (full decoder), programmable OR plane. Implements all minterms.",
            "PLA — Both AND and OR planes are programmable. Most flexible but most complex.",
            "PAL — Programmable AND plane, fixed OR plane. Simpler than PLA, widely used.",
            "GAL (Generic Array Logic) — Electrically erasable PAL variant, reusable.",
            "FPGA — Modern replacement with lookup tables (LUTs) instead of AND-OR planes.",
          ]}
        />
      </AFHDLSection>

      <AFHDLDivider />
      <div style={S.sectionTitle}>🧠 Quiz — Test Your Understanding</div>

      {!quizMode ? (
        <div style={S.card}>
          <div style={{ color: "var(--afhdl-muted)", marginBottom: "0.5rem" }}>
            Four questions on PLA devices. Ready?
          </div>
          <button
            className="kmap-btn"
            style={{ width: "100%" }}
            onClick={() => {
              setQuizMode(true);
              resetQuiz();
            }}
          >
            Start Quiz ({QUIZ.length} questions) →
          </button>
        </div>
      ) : quizDone ? (
        <div style={S.card}>
          <div
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#4ade80",
              marginBottom: "0.4rem",
            }}
          >
            {quizScore >= 3 ? "🎉 Well done!" : "📚 Keep practicing!"}
          </div>
          <p style={{ color: "var(--afhdl-muted)" }}>
            Score: <strong style={{ color: "#4ade80" }}>{quizScore}</strong> /{" "}
            {QUIZ.length}
          </p>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.6rem" }}>
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
              marginBottom: "0.4rem",
            }}
          >
            <span style={{ color: "var(--afhdl-muted)", fontSize: "0.8rem" }}>
              Q {quizIdx + 1}/{QUIZ.length}
            </span>
            <span style={{ color: "#4ade80", fontSize: "0.8rem" }}>
              Score: {quizScore}
            </span>
          </div>
          <div
            style={{
              height: "4px",
              background: "var(--afhdl-border)",
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
              color: "var(--afhdl-text)",
              fontWeight: 600,
              fontSize: "0.92rem",
              marginBottom: "0.7rem",
              lineHeight: 1.5,
            }}
          >
            {QUIZ[quizIdx].q}
          </div>
          <div style={{ display: "grid", gap: "0.4rem" }}>
            {QUIZ[quizIdx].opts.map((opt, i) => {
              const isCorrect = i === QUIZ[quizIdx].ans;
              const selected = quizAnswer === i;
              let bg = "var(--afhdl-table-row-bg)",
                border = "var(--afhdl-border)";
              if (quizAnswer !== null) {
                if (isCorrect) {
                  bg = "rgba(74,222,128,0.12)";
                  border = "#4ade80";
                } else if (selected) {
                  bg = "rgba(248,113,113,0.12)";
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
                    borderRadius: "8px",
                    padding: "0.55rem 0.85rem",
                    color: "var(--afhdl-text)",
                    textAlign: "left",
                    cursor: quizAnswer !== null ? "default" : "pointer",
                    fontSize: "0.87rem",
                    transition: "all 0.18s",
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
            <div
              style={{
                ...S.note(
                  quizAnswer === QUIZ[quizIdx].ans ? "#4ade80" : "#f87171",
                ),
                marginTop: "0.65rem",
              }}
            >
              <strong>
                {quizAnswer === QUIZ[quizIdx].ans
                  ? "✅ Correct!"
                  : "❌ Not quite."}
              </strong>
              <br />
              <span style={{ fontSize: "0.83rem" }}>
                👩‍🏫 {QUIZ[quizIdx].explain}
              </span>
            </div>
          )}
          {quizAnswer !== null && (
            <button
              className="kmap-btn"
              style={{ marginTop: "0.65rem", width: "100%" }}
              onClick={nextQ}
            >
              {quizIdx + 1 >= QUIZ.length
                ? "See My Results →"
                : "Next Question →"}
            </button>
          )}
        </div>
      )}
    </MemoryLayout>
  );
};

export default ProgrammableLogicArray;
