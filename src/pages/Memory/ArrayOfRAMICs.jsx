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
    q: "To expand word length (bit width), how do you connect RAM chips?",
    opts: [
      "In series (cascade address lines)",
      "In parallel (connect chips side-by-side sharing address lines)",
      "Use a decoder on data lines",
      "Increase the clock frequency",
    ],
    ans: 1,
    explain:
      "Word length expansion connects chips in parallel with shared address/control lines, each chip providing additional data bits.",
  },
  {
    q: "To expand the number of addressable words (capacity), what is used?",
    opts: [
      "More data lines",
      "A decoder to select chip enable",
      "Larger capacitors",
      "Fewer address lines",
    ],
    ans: 1,
    explain:
      "Address capacity expansion uses a decoder to activate different chip select (CS) lines for different address ranges.",
  },
  {
    q: "Four 1K×8 RAM chips combined give a total capacity of:",
    opts: ["1K×8", "4K×8", "1K×32", "4K×32"],
    ans: 1,
    explain:
      "Combining 4 chips of 1K×8 in word-count expansion (using 2 address bits as chip select) gives 4K×8.",
  },
  {
    q: "What signal is typically used to select which chip in an array is active?",
    opts: [
      "WE (Write Enable)",
      "OE (Output Enable)",
      "CS (Chip Select)",
      "VCC (Power)",
    ],
    ans: 2,
    explain:
      "The Chip Select (CS) signal activates a specific RAM chip in an array, determined by the decoder output.",
  },
];

const ArrayOfRAMICs = () => {
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
      title="Array of RAM ICs"
      description="Large memory systems are built by combining multiple RAM chips in arrays. Two expansion techniques — word length expansion and address capacity expansion — allow any memory size to be constructed."
    >
      <AFHDLSection
        kicker="Concept"
        title="Why Combine RAM Chips?"
        description="Individual RAM ICs have fixed word lengths and capacities. Arrays of chips allow designers to build memory systems of any required size."
      >
        <AFHDLCardGroup>
          <AFHDLInfoPanel
            title="Word Length Expansion"
            content="Increase data width (e.g., 4-bit → 8-bit)"
          />
          <AFHDLInfoPanel
            title="Address Expansion"
            content="Increase number of locations (e.g., 1K → 4K)"
          />
          <AFHDLInfoPanel
            title="Combined"
            content="Expand both dimensions simultaneously"
          />
        </AFHDLCardGroup>
      </AFHDLSection>

      <AFHDLSection
        kicker="Technique 1"
        title="Word Length (Bit) Expansion"
        description="To increase word width, place chips in parallel — all chips share the same address and control lines, but each contributes different data bits."
      >
        <AFHDLCard title="Example: 1K×4 → 1K×8 using two chips">
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "0.82rem",
              background: "var(--afhdl-table-row-bg)",
              borderRadius: "8px",
              padding: "0.75rem",
              lineHeight: 1.9,
            }}
          >
            <div style={{ color: "#60a5fa" }}>
              Chip 1 (1K×4): provides D[3:0]
            </div>
            <div style={{ color: "#c084fc" }}>
              Chip 2 (1K×4): provides D[7:4]
            </div>
            <div style={{ color: "var(--afhdl-muted)", marginTop: "0.4rem" }}>
              Both chips share: Address A[9:0], CS, WE
            </div>
            <div style={{ color: "#4ade80", marginTop: "0.4rem" }}>
              Result: 1K × 8 bit memory
            </div>
          </div>
        </AFHDLCard>
      </AFHDLSection>

      <AFHDLSection
        kicker="Technique 2"
        title="Address (Word Count) Expansion"
        description="To increase the number of addressable locations, use a decoder to select different chips for different address ranges."
      >
        <AFHDLCard title="Example: 1K×8 → 4K×8 using four chips + 2-to-4 decoder">
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "0.82rem",
              background: "var(--afhdl-table-row-bg)",
              borderRadius: "8px",
              padding: "0.75rem",
              lineHeight: 1.9,
            }}
          >
            <div style={{ color: "var(--afhdl-muted)" }}>
              High address bits A[11:10] → 2-to-4 Decoder
            </div>
            <div style={{ color: "#60a5fa" }}>
              Decoder Y0 → CS of Chip 0 (addresses 0x000–0x3FF)
            </div>
            <div style={{ color: "#60a5fa" }}>
              Decoder Y1 → CS of Chip 1 (addresses 0x400–0x7FF)
            </div>
            <div style={{ color: "#60a5fa" }}>
              Decoder Y2 → CS of Chip 2 (addresses 0x800–0xBFF)
            </div>
            <div style={{ color: "#60a5fa" }}>
              Decoder Y3 → CS of Chip 3 (addresses 0xC00–0xFFF)
            </div>
            <div style={{ color: "#4ade80", marginTop: "0.4rem" }}>
              Low address bits A[9:0] go to all chips (select row within chip)
            </div>
            <div style={{ color: "#4ade80" }}>Result: 4K × 8 bit memory</div>
          </div>
        </AFHDLCard>
      </AFHDLSection>

      <AFHDLSection
        kicker="Summary"
        title="Design Steps for RAM Arrays"
        description=""
      >
        <AFHDLStepList
          steps={[
            "Determine required total capacity: total locations × word size.",
            "Choose available RAM chip size (e.g., 1K×8).",
            "Calculate chips needed for word length: required bits ÷ chip data bits.",
            "Calculate chips needed for address expansion: required locations ÷ chip locations.",
            "Total chips = (word expansion chips) × (address expansion chips).",
            "Use a decoder with (log₂ of address expansion) inputs to drive the CS lines.",
          ]}
        />
      </AFHDLSection>

      <AFHDLDivider />
      <div style={S.sectionTitle}>🧠 Quiz — Test Your Understanding</div>

      {!quizMode ? (
        <div style={S.card}>
          <div style={{ color: "var(--afhdl-muted)", marginBottom: "0.5rem" }}>
            Four questions on RAM arrays. Ready?
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

export default ArrayOfRAMICs;
