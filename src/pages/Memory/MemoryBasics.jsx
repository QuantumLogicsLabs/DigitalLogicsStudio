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
    q: "What is the basic unit of memory storage?",
    opts: ["Byte", "Bit", "Word", "Nibble"],
    ans: 1,
    explain:
      "A bit (binary digit) is the smallest unit of memory, holding either 0 or 1.",
  },
  {
    q: "Which type of memory loses data when power is removed?",
    opts: ["ROM", "Flash", "RAM", "EPROM"],
    ans: 2,
    explain:
      "RAM (Random Access Memory) is volatile — it loses its contents without power.",
  },
  {
    q: "How many bits are in one byte?",
    opts: ["4", "16", "8", "32"],
    ans: 2,
    explain:
      "One byte = 8 bits. This is the standard grouping used in modern computing.",
  },
  {
    q: "What does 'address' mean in the context of memory?",
    opts: [
      "The speed of memory",
      "A unique location identifier",
      "The type of data stored",
      "The size of memory",
    ],
    ans: 1,
    explain:
      "An address is a unique number that identifies a specific memory location.",
  },
];

const MemoryBasics = () => {
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
      title="Memory Basics"
      description="Memory is the component that stores data and instructions in a digital system. Understanding how memory is organized, addressed, and classified is fundamental to digital design."
    >
      <AFHDLSection
        kicker="Overview"
        title="What is Memory?"
        description="Memory in digital systems refers to devices that can store binary information (0s and 1s). The stored information can be retrieved later for computation or display."
      >
        <AFHDLCardGroup>
          <AFHDLInfoPanel
            title="Volatile Memory"
            content="Loses data when power is off. Example: RAM"
          />
          <AFHDLInfoPanel
            title="Non-Volatile Memory"
            content="Retains data without power. Example: ROM, Flash"
          />
          <AFHDLInfoPanel
            title="Storage Unit"
            content="Bit → Nibble (4-bit) → Byte (8-bit) → Word"
          />
        </AFHDLCardGroup>
      </AFHDLSection>

      <AFHDLSection
        kicker="Structure"
        title="Memory Organization"
        description="Memory is organized as an array of storage locations, each uniquely identified by an address."
      >
        <AFHDLCard title="Address and Data">
          <p
            style={{
              color: "var(--afhdl-muted)",
              fontSize: "0.88rem",
              lineHeight: 1.6,
            }}
          >
            Every memory chip has <strong>address lines</strong> (to select a
            location) and <strong>data lines</strong> (to read or write data). A
            memory with <em>n</em> address lines can access <strong>2ⁿ</strong>{" "}
            unique locations.
          </p>
          <div
            style={{
              marginTop: "0.75rem",
              fontFamily: "monospace",
              fontSize: "0.82rem",
              background: "var(--afhdl-table-row-bg)",
              borderRadius: "8px",
              padding: "0.75rem",
            }}
          >
            <div>Address lines: n = 10 → Locations: 2¹⁰ = 1024 = 1K</div>
            <div>Address lines: n = 16 → Locations: 2¹⁶ = 65536 = 64K</div>
            <div>Address lines: n = 20 → Locations: 2²⁰ = 1048576 = 1M</div>
          </div>
        </AFHDLCard>
      </AFHDLSection>

      <AFHDLSection
        kicker="Classification"
        title="Types of Memory"
        description="Memory is broadly classified based on how it is accessed and whether it retains data without power."
      >
        <AFHDLStepList
          steps={[
            "RAM (Random Access Memory) — Read and write; volatile; used for temporary storage.",
            "ROM (Read-Only Memory) — Read only; non-volatile; used to store permanent programs.",
            "Cache Memory — Very fast, small memory between CPU and RAM.",
            "Secondary Storage — Non-volatile, large capacity (HDD, SSD, Flash drives).",
          ]}
        />
      </AFHDLSection>

      <AFHDLDivider />
      <div style={S.sectionTitle}>🧠 Quiz — Test Your Understanding</div>

      {!quizMode ? (
        <div style={S.card}>
          <div style={{ color: "var(--afhdl-muted)", marginBottom: "0.5rem" }}>
            Four questions on memory basics. Ready?
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

export default MemoryBasics;
