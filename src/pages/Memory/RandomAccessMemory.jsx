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
    q: "What makes RAM 'random access'?",
    opts: [
      "It stores random data",
      "Any location can be accessed in the same time regardless of address",
      "It randomly selects memory locations",
      "It can only be read randomly",
    ],
    ans: 1,
    explain:
      "Random access means any memory location can be accessed in equal time, unlike sequential access (e.g., tape).",
  },
  {
    q: "Which signal controls whether RAM performs a read or write?",
    opts: [
      "Address line",
      "Data line",
      "Read/Write (R/W) line",
      "Chip Select line",
    ],
    ans: 2,
    explain:
      "The Read/Write (R/W) control line determines the operation: R/W=1 for read, R/W=0 for write (typically).",
  },
  {
    q: "What is the purpose of the Chip Select (CS) signal?",
    opts: [
      "To select which data bit to read",
      "To enable or disable the RAM chip",
      "To set the clock speed",
      "To reset the memory",
    ],
    ans: 1,
    explain:
      "Chip Select enables the RAM chip. When CS is inactive, the chip ignores address and data inputs.",
  },
  {
    q: "A RAM chip has 10 address lines and 8 data lines. What is its capacity?",
    opts: ["10 bytes", "1024 bits", "8192 bits (1K × 8 = 8Kbits)", "80 bits"],
    ans: 2,
    explain:
      "10 address lines → 2¹⁰ = 1024 locations. 8 data lines → 8 bits per location. Total = 1024 × 8 = 8192 bits.",
  },
];

const RandomAccessMemory = () => {
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
      title="Random Access Memory (RAM)"
      description="RAM is volatile read-write memory used for temporary storage of data and programs currently in use. Any memory location can be accessed in equal time."
    >
      <AFHDLSection
        kicker="Concept"
        title="RAM Characteristics"
        description="RAM allows both read and write operations. It is volatile, meaning data is lost when power is removed."
      >
        <AFHDLCardGroup>
          <AFHDLInfoPanel
            title="Volatile"
            content="Data is lost when power is removed"
          />
          <AFHDLInfoPanel
            title="Read/Write"
            content="Supports both read and write operations"
          />
          <AFHDLInfoPanel
            title="Equal Access Time"
            content="Any address is accessed in the same amount of time"
          />
        </AFHDLCardGroup>
      </AFHDLSection>

      <AFHDLSection
        kicker="Interface"
        title="RAM Signals"
        description="A typical RAM chip has address lines, data lines, and control signals."
      >
        <AFHDLCard title="RAM Pin Description">
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "0.82rem",
              background: "var(--afhdl-table-row-bg)",
              borderRadius: "8px",
              padding: "0.75rem",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: "4px",
                fontWeight: 700,
                marginBottom: "6px",
              }}
            >
              <span style={{ color: "#60a5fa" }}>Signal</span>
              <span style={{ color: "#60a5fa" }}>Description</span>
            </div>
            {[
              ["A[n-1:0]", "Address lines — select memory location"],
              ["D[m-1:0]", "Data lines — input (write) or output (read)"],
              ["CS (Chip Select)", "Enables the chip when asserted"],
              ["WE (Write Enable)", "High = Read, Low = Write"],
              ["OE (Output Enable)", "Enables data output during read"],
            ].map(([sig, desc], i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: "4px",
                  padding: "3px 0",
                  borderTop: "1px solid var(--afhdl-border)",
                }}
              >
                <span style={{ color: "#4ade80" }}>{sig}</span>
                <span style={{ color: "var(--afhdl-muted)" }}>{desc}</span>
              </div>
            ))}
          </div>
        </AFHDLCard>
      </AFHDLSection>

      <AFHDLSection
        kicker="Operations"
        title="Read and Write Cycles"
        description="RAM performs two fundamental operations: reading stored data and writing new data."
      >
        <AFHDLStepList
          steps={[
            "Read Cycle: Assert CS, set address, set WE=1 (read), wait for access time, data appears on data lines.",
            "Write Cycle: Assert CS, set address, put data on data lines, assert WE=0 (write), deassert WE to latch data.",
            "Access Time: The delay from address presented to valid data output — a key RAM performance metric.",
            "Cycle Time: Minimum time between two consecutive operations (always ≥ access time).",
          ]}
        />
      </AFHDLSection>

      <AFHDLDivider />
      <div style={S.sectionTitle}>🧠 Quiz — Test Your Understanding</div>

      {!quizMode ? (
        <div style={S.card}>
          <div style={{ color: "var(--afhdl-muted)", marginBottom: "0.5rem" }}>
            Four questions on RAM. Ready?
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

export default RandomAccessMemory;
