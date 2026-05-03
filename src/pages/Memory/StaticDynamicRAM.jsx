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
    q: "What storage element does SRAM use?",
    opts: ["Capacitor", "Flip-flop", "Resistor", "Inductor"],
    ans: 1,
    explain:
      "SRAM uses flip-flops (bistable latches) to store each bit, which hold state as long as power is applied.",
  },
  {
    q: "Why does DRAM need periodic refreshing?",
    opts: [
      "To increase speed",
      "Because capacitors leak charge over time",
      "To reduce power",
      "Because flip-flops reset automatically",
    ],
    ans: 1,
    explain:
      "DRAM stores bits as charge on capacitors. Capacitors leak, so data must be refreshed every few milliseconds.",
  },
  {
    q: "Which is faster — SRAM or DRAM?",
    opts: ["DRAM", "SRAM", "They are the same speed", "Depends on the address"],
    ans: 1,
    explain:
      "SRAM is faster because flip-flops respond immediately; DRAM requires refresh cycles and has slower access.",
  },
  {
    q: "Which type of RAM is typically used for CPU cache?",
    opts: ["DRAM", "SRAM", "Flash RAM", "Virtual RAM"],
    ans: 1,
    explain:
      "SRAM is used for CPU cache because of its speed, despite being more expensive and less dense than DRAM.",
  },
];

const StaticDynamicRAM = () => {
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

  const compare = [
    [
      "Storage element",
      "Flip-flop (6 transistors)",
      "Capacitor (1 transistor)",
    ],
    ["Refresh needed", "No", "Yes (~every 4–64 ms)"],
    ["Speed", "Faster (1–10 ns)", "Slower (50–70 ns)"],
    ["Density", "Lower (larger cell)", "Higher (smaller cell)"],
    ["Power", "Higher (active)", "Lower (standby)"],
    ["Cost per bit", "Higher", "Lower"],
    ["Typical use", "CPU Cache (L1, L2, L3)", "Main memory (RAM DIMMs)"],
  ];

  return (
    <MemoryLayout
      kicker="Memory Systems"
      title="Static and Dynamic RAM"
      description="RAM comes in two major forms: SRAM uses flip-flops for fast, stable storage while DRAM uses capacitors for dense, low-cost storage that requires periodic refresh."
    >
      <AFHDLSection
        kicker="SRAM"
        title="Static RAM"
        description="SRAM stores each bit using a flip-flop (typically 6 transistors). Data is held as long as power is present — no refresh needed."
      >
        <AFHDLCardGroup>
          <AFHDLInfoPanel
            title="Cell"
            content="6-transistor cross-coupled inverter pair"
          />
          <AFHDLInfoPanel
            title="Speed"
            content="Very fast (1–10 ns access time)"
          />
          <AFHDLInfoPanel title="Use" content="CPU L1/L2/L3 cache memory" />
        </AFHDLCardGroup>
      </AFHDLSection>

      <AFHDLSection
        kicker="DRAM"
        title="Dynamic RAM"
        description="DRAM stores each bit as charge on a tiny capacitor (1 transistor + 1 capacitor per cell). Charge leaks, so the memory must be refreshed periodically."
      >
        <AFHDLCardGroup>
          <AFHDLInfoPanel title="Cell" content="1 transistor + 1 capacitor" />
          <AFHDLInfoPanel
            title="Refresh"
            content="Required every 4–64 ms to prevent data loss"
          />
          <AFHDLInfoPanel
            title="Use"
            content="Main memory (RAM modules / DIMMs)"
          />
        </AFHDLCardGroup>
      </AFHDLSection>

      <AFHDLSection
        kicker="Comparison"
        title="SRAM vs DRAM Side-by-Side"
        description="Key differences that guide which type of RAM is chosen for a given application."
      >
        <AFHDLCard>
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
                gridTemplateColumns: "1.2fr 1fr 1fr",
                gap: "4px",
                fontWeight: 700,
                marginBottom: "6px",
              }}
            >
              <span style={{ color: "var(--afhdl-muted)" }}>Property</span>
              <span style={{ color: "#60a5fa" }}>SRAM</span>
              <span style={{ color: "#c084fc" }}>DRAM</span>
            </div>
            {compare.map(([prop, sram, dram], i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1fr 1fr",
                  gap: "4px",
                  padding: "3px 0",
                  borderTop: "1px solid var(--afhdl-border)",
                }}
              >
                <span
                  style={{ color: "var(--afhdl-muted)", fontSize: "0.78rem" }}
                >
                  {prop}
                </span>
                <span style={{ color: "#60a5fa", fontSize: "0.8rem" }}>
                  {sram}
                </span>
                <span style={{ color: "#c084fc", fontSize: "0.8rem" }}>
                  {dram}
                </span>
              </div>
            ))}
          </div>
        </AFHDLCard>
      </AFHDLSection>

      <AFHDLSection
        kicker="DRAM Refresh"
        title="How DRAM Refresh Works"
        description=""
      >
        <AFHDLStepList
          steps={[
            "The memory controller tracks a refresh counter pointing to the current row.",
            "Periodically (every ~15 µs), the controller issues a RAS-only cycle to refresh a row.",
            "All capacitors in the selected row are recharged to their proper voltage levels.",
            "After all rows are refreshed, the cycle repeats — ensuring data integrity.",
            "During refresh, the memory cannot serve normal read/write requests (refresh overhead).",
          ]}
        />
      </AFHDLSection>

      <AFHDLDivider />
      <div style={S.sectionTitle}>🧠 Quiz — Test Your Understanding</div>

      {!quizMode ? (
        <div style={S.card}>
          <div style={{ color: "var(--afhdl-muted)", marginBottom: "0.5rem" }}>
            Four questions on SRAM vs DRAM. Ready?
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

export default StaticDynamicRAM;
