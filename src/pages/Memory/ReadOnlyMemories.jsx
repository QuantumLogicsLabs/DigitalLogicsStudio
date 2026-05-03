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
    q: "What does ROM stand for?",
    opts: [
      "Random Output Memory",
      "Read-Only Memory",
      "Read-Once Memory",
      "Removable Output Module",
    ],
    ans: 1,
    explain:
      "ROM stands for Read-Only Memory — it can be read but not easily written.",
  },
  {
    q: "Which ROM type can be erased with ultraviolet light?",
    opts: ["PROM", "EPROM", "EEPROM", "Mask ROM"],
    ans: 1,
    explain:
      "EPROM (Erasable Programmable ROM) is erased by exposing it to UV light.",
  },
  {
    q: "What is a Mask ROM?",
    opts: [
      "Programmed by the user",
      "Programmed during manufacturing",
      "Erased with electricity",
      "Erased with UV light",
    ],
    ans: 1,
    explain:
      "Mask ROM is programmed during the chip manufacturing process using a photomask.",
  },
  {
    q: "Which ROM type can be electrically erased byte-by-byte?",
    opts: ["PROM", "EPROM", "Mask ROM", "EEPROM"],
    ans: 3,
    explain:
      "EEPROM (Electrically Erasable PROM) can be erased and rewritten electrically.",
  },
];

const ReadOnlyMemories = () => {
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
      title="Read-Only Memories (ROM)"
      description="ROM is non-volatile memory that permanently stores data or programs. The content is fixed at manufacturing time or programmed once and retained without power."
    >
      <AFHDLSection
        kicker="Concept"
        title="What is ROM?"
        description="ROM stores binary information permanently. It is used for firmware, boot programs, and lookup tables that must survive power loss."
      >
        <AFHDLCardGroup>
          <AFHDLInfoPanel
            title="Non-Volatile"
            content="Data is retained even when power is off"
          />
          <AFHDLInfoPanel
            title="Read Access"
            content="CPU can read ROM but cannot write to it normally"
          />
          <AFHDLInfoPanel
            title="Common Use"
            content="BIOS, firmware, character generators, lookup tables"
          />
        </AFHDLCardGroup>
      </AFHDLSection>

      <AFHDLSection
        kicker="Structure"
        title="ROM as a Combinational Circuit"
        description="A ROM with n address inputs and m data outputs implements m Boolean functions of n variables."
      >
        <AFHDLCard title="ROM Truth Table Example (2-input, 4-output)">
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
                gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
                gap: "4px",
                fontWeight: 700,
                marginBottom: "4px",
              }}
            >
              <span>A1</span>
              <span>A0</span>
              <span>D3</span>
              <span>D2</span>
              <span>D1</span>
              <span>D0</span>
            </div>
            {[
              ["0", "0", "0", "0", "1", "1"],
              ["0", "1", "0", "1", "0", "1"],
              ["1", "0", "1", "0", "1", "0"],
              ["1", "1", "1", "1", "0", "0"],
            ].map((row, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
                  gap: "4px",
                  padding: "2px 0",
                  borderTop: "1px solid var(--afhdl-border)",
                }}
              >
                {row.map((v, j) => (
                  <span
                    key={j}
                    style={{ color: j < 2 ? "#60a5fa" : "#4ade80" }}
                  >
                    {v}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </AFHDLCard>
      </AFHDLSection>

      <AFHDLSection
        kicker="Types"
        title="ROM Varieties"
        description="Different ROM types offer different trade-offs between cost, flexibility, and reprogrammability."
      >
        <AFHDLStepList
          steps={[
            "Mask ROM — Programmed at manufacturing. Lowest cost in large quantities. Cannot be changed.",
            "PROM (Programmable ROM) — Programmed once by the user with a special programmer tool. Fuses blown permanently.",
            "EPROM (Erasable PROM) — Erased with UV light through a quartz window. Can be reprogrammed.",
            "EEPROM (Electrically Erasable PROM) — Erased electrically, byte by byte. Used in microcontrollers.",
            "Flash Memory — Block-level erasure, high density, used in USB drives, SSDs, and embedded systems.",
          ]}
        />
      </AFHDLSection>

      <AFHDLDivider />
      <div style={S.sectionTitle}>🧠 Quiz — Test Your Understanding</div>

      {!quizMode ? (
        <div style={S.card}>
          <div style={{ color: "var(--afhdl-muted)", marginBottom: "0.5rem" }}>
            Four questions on ROM types. Ready?
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

export default ReadOnlyMemories;
