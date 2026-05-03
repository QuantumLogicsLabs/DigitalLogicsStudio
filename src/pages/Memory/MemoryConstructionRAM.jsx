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
    q: "A system needs 8K×16 memory. You have 2K×8 chips. How many chips are needed?",
    opts: ["4", "8", "16", "2"],
    ans: 2,
    explain:
      "Word expansion: 16÷8 = 2 chips per bank. Address expansion: 8K÷2K = 4 banks. Total = 2×4 = 16 chips.",
  },
  {
    q: "In memory system design, what does 'bank' refer to?",
    opts: [
      "A financial institution storing memory",
      "A group of chips sharing the same address range",
      "A single memory chip",
      "The address decoder",
    ],
    ans: 1,
    explain:
      "A memory bank is a group of chips that are accessed simultaneously, selected by the same chip select signal.",
  },
  {
    q: "What is the role of the address decoder in a memory system?",
    opts: [
      "To decode binary data into decimal",
      "To select which bank of chips is active based on high-order address bits",
      "To convert addresses to ASCII",
      "To increase the clock speed",
    ],
    ans: 1,
    explain:
      "The address decoder takes high-order address bits and asserts the CS signal for the appropriate memory bank.",
  },
  {
    q: "Bus contention occurs when:",
    opts: [
      "Too many address lines are used",
      "Two chips drive the data bus simultaneously",
      "The clock is too fast",
      "The decoder has too many outputs",
    ],
    ans: 1,
    explain:
      "Bus contention (or conflict) happens when two chips try to drive the shared data bus at the same time. Only one CS should be active at a time.",
  },
];

const MemoryConstructionRAM = () => {
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
      title="Memory Construction using RAM ICs"
      description="Real memory systems are designed by carefully arranging RAM ICs to meet a required capacity and word width. This involves systematic use of chip arrays, decoders, and bus connections."
    >
      <AFHDLSection
        kicker="Overview"
        title="System Memory Design"
        description="Constructing a memory system from IC chips requires decisions about the number of chips, their arrangement, and how addressing and control signals are distributed."
      >
        <AFHDLCardGroup>
          <AFHDLInfoPanel
            title="Step 1"
            content="Determine total capacity (words × bits)"
          />
          <AFHDLInfoPanel
            title="Step 2"
            content="Choose chip size and calculate chips needed"
          />
          <AFHDLInfoPanel
            title="Step 3"
            content="Design address decoder for chip selection"
          />
        </AFHDLCardGroup>
      </AFHDLSection>

      <AFHDLSection
        kicker="Worked Example"
        title="Design a 16K×8 Memory from 4K×4 Chips"
        description="Step-by-step construction of a 16K×8 memory system."
      >
        <AFHDLCard title="Calculation">
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
            <div style={{ color: "#60a5fa" }}>Required: 16K × 8</div>
            <div style={{ color: "#c084fc" }}>Chip size: 4K × 4</div>
            <div
              style={{
                borderTop: "1px solid var(--afhdl-border)",
                paddingTop: "6px",
                color: "var(--afhdl-muted)",
              }}
            >
              Word (bit) expansion: 8 ÷ 4 ={" "}
              <span style={{ color: "#4ade80" }}>2 chips per bank</span>
            </div>
            <div style={{ color: "var(--afhdl-muted)" }}>
              Address expansion: 16K ÷ 4K ={" "}
              <span style={{ color: "#4ade80" }}>4 banks</span>
            </div>
            <div style={{ color: "var(--afhdl-muted)" }}>
              Total chips: 2 × 4 ={" "}
              <span style={{ color: "#4ade80" }}>8 chips</span>
            </div>
            <div style={{ color: "var(--afhdl-muted)" }}>
              Decoder needed: 2-to-4 (uses A[13:12])
            </div>
            <div style={{ color: "var(--afhdl-muted)" }}>
              Row address bits: A[11:0] → all chips in selected bank
            </div>
          </div>
        </AFHDLCard>

        <AFHDLCard title="Bank Layout">
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
            {[
              ["Bank 0", "0x0000–0x0FFF", "Y0", "Chip0A(D3:0) + Chip0B(D7:4)"],
              ["Bank 1", "0x1000–0x1FFF", "Y1", "Chip1A(D3:0) + Chip1B(D7:4)"],
              ["Bank 2", "0x2000–0x2FFF", "Y2", "Chip2A(D3:0) + Chip2B(D7:4)"],
              ["Bank 3", "0x3000–0x3FFF", "Y3", "Chip3A(D3:0) + Chip3B(D7:4)"],
            ].map(([bank, range, cs, chips], i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "0.5fr 1fr 0.5fr 1.5fr",
                  gap: "6px",
                  borderTop: i > 0 ? "1px solid var(--afhdl-border)" : "none",
                }}
              >
                <span style={{ color: "#60a5fa" }}>{bank}</span>
                <span style={{ color: "var(--afhdl-muted)" }}>{range}</span>
                <span style={{ color: "#c084fc" }}>{cs}</span>
                <span style={{ color: "#4ade80" }}>{chips}</span>
              </div>
            ))}
          </div>
        </AFHDLCard>
      </AFHDLSection>

      <AFHDLSection
        kicker="Bus"
        title="Shared Bus Connections"
        description="All chips in a memory system share common buses for address, data, and control."
      >
        <AFHDLStepList
          steps={[
            "Address Bus: Low-order bits connect to all chips (select internal row/column). High-order bits feed the decoder.",
            "Data Bus: Each chip's data pins connect to corresponding bits of the shared data bus. Only the active chip drives the bus.",
            "Control Bus: WE and OE connect to all chips. CS from decoder activates only one bank at a time.",
            "Bus Contention Prevention: Only the selected chip (CS active) drives the data bus — others are in high-impedance (tri-state) mode.",
          ]}
        />
      </AFHDLSection>

      <AFHDLDivider />
      <div style={S.sectionTitle}>🧠 Quiz — Test Your Understanding</div>

      {!quizMode ? (
        <div style={S.card}>
          <div style={{ color: "var(--afhdl-muted)", marginBottom: "0.5rem" }}>
            Four questions on memory construction. Ready?
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

export default MemoryConstructionRAM;
