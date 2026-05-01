import React, { useState } from "react";
import AFHDLLayout from "./components/AFHDLLayout";
import AFHDLActionRow from "./components/AFHDLActionRow";
import AFHDLSection from "./components/AFHDLSection";
import AFHDLStepList from "./components/AFHDLStepList";
import AFHDLDivider from "./components/AFHDLDivider";
import { afhdlTheme as S } from "./utils/afhdlTheme";

const QUIZ = [
  {
    q: "Which arithmetic block is at the core of an ALU's addition and subtraction operations?",
    opts: ["Parity generator", "Ripple-carry adder / full adder", "Magnitude comparator", "Hex converter"],
    ans: 1,
    explain: "The full adder (often chained as a ripple-carry or carry-lookahead adder) is the heart of ALU arithmetic. Subtraction is implemented by feeding the 2's complement of the subtrahend into the same adder.",
  },
  {
    q: "A RAM module uses parity bits for each stored byte. What failure mode does this NOT protect against?",
    opts: ["A single bit flip in one byte", "Two simultaneous bit flips in one byte", "Corruption in a single cell", "Any odd number of bit errors"],
    ans: 1,
    explain: "Simple parity detects only an odd number of bit errors. If exactly 2 bits flip in the same word, the parity count is unchanged and the corruption goes undetected. More advanced codes (ECC, Hamming) are needed for two-bit correction.",
  },
  {
    q: "In a branch instruction (if A > B, jump), which arithmetic block makes the decision?",
    opts: ["Adder", "Multiplier", "Magnitude comparator", "Parity checker"],
    ans: 2,
    explain: "A magnitude comparator evaluates A>B, A<B, and A=B, driving the branch condition flag. The CPU's branch unit reads that flag to decide whether to take the jump.",
  },
  {
    q: "A 7-segment display decoder receives 4-bit BCD. What conversion must happen before the display can show the digit?",
    opts: [
      "Binary to parity",
      "BCD to 7-segment (a code conversion step)",
      "Hex to signed binary",
      "Carry-lookahead expansion",
    ],
    ans: 1,
    explain: "The decoder performs a code conversion: each 4-bit BCD pattern is translated into the 7 segment-control signals (a–g) that light the correct segments. This is a classic combinational code conversion application.",
  },
];

const APPLICATIONS = [
  {
    icon: "🧮",
    title: "ALU Datapath",
    color: "#6366f1",
    blocks: ["Full adder / CLA", "Subtractor (2's complement trick)", "Magnitude comparator", "Shifters"],
    description: "The Arithmetic Logic Unit chains adders, a mode-select MUX (add vs subtract), and a comparator to evaluate every arithmetic instruction and branch condition a CPU executes.",
    example: "ADD R1, R2 → ripple-carry adder; CMP R1, R2 → comparator sets N, Z, C flags.",
  },
  {
    icon: "💾",
    title: "Memory & Storage",
    color: "#0ea5e9",
    blocks: ["Parity generator", "Parity checker", "ECC (Hamming)"],
    description: "Every DRAM chip uses at least parity on each data bus line. Servers use ECC (extended Hamming codes) that can detect 2-bit errors and correct 1-bit errors silently during operation.",
    example: "JEDEC DDR5 spec mandates on-die ECC; the parity generator runs on every write, the checker on every read.",
  },
  {
    icon: "🔌",
    title: "Serial Communication",
    color: "#10b981",
    blocks: ["Parity generator (UART)", "CRC generator", "Code conversion (NRZ ↔ binary)"],
    description: "UART serial ports have a configurable parity bit (none / even / odd) appended to each byte. The transmitter generates it; the receiver checks it and triggers an interrupt on failure.",
    example: "115200 baud, 8N1 = 8 data bits, No parity, 1 stop bit. Add 'E' and the parity generator activates.",
  },
  {
    icon: "🖥️",
    title: "Display Interfaces",
    color: "#f59e0b",
    blocks: ["BCD-to-7-segment decoder", "Binary-to-BCD converter", "Hex display driver"],
    description: "Embedded systems output numeric values to 7-segment or LCD displays. The internal value is binary; a code conversion block translates it to BCD or directly to segment-control signals.",
    example: "A temperature sensor outputs 8-bit binary → binary-to-BCD converter → two 7-segment decoders → display.",
  },
  {
    icon: "⚙️",
    title: "Control Logic",
    color: "#c084fc",
    blocks: ["Comparator (threshold detect)", "Counter + incrementer", "Signed arithmetic (PID controller)"],
    description: "PLCs and motor controllers constantly compare sensor readings against setpoints. A comparator circuit fires an interrupt when voltage, temperature, or speed exceeds a threshold.",
    example: "Fan speed > 3000 RPM? Comparator output → interrupt → CPU throttles power.",
  },
];

const DesignApplications = () => {
  const [activeApp, setActiveApp] = useState(null);
  const [showChecklist, setShowChecklist] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

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
      title="Design Applications"
      subtitle="See where every arithmetic block from this module is actually used in real systems."
      intro="Arithmetic building blocks rarely appear in isolation. They work together inside CPUs, memory modules, communication links, and display drivers. This page maps each block to a concrete job in a real system."
      highlights={[
        {
          title: "Think in subsystems",
          text: "Adders, comparators, parity logic, and converters are pieces of a larger puzzle. Knowing each piece makes the whole system easier to read.",
        },
        {
          title: "Learning goal",
          text: "After this page you should be able to look at any digital circuit block diagram and name the arithmetic module responsible for each operation.",
        },
      ]}
    >
      {/* ── Teacher intro ──────────────────────────────────── */}
      <div style={S.teacherBubble}>
        <span style={S.teacherAvatar}>👩‍🏫</span>
        <div style={S.teacherText}>
          <strong>Think of arithmetic blocks like kitchen tools.</strong> A knife, cutting board, measuring cup, and pan are all separate — but together they make a meal. A full adder, comparator, parity generator, and code converter are separate blocks — but together they make a computer. You've learned every tool; now let's see the recipes.
        </div>
      </div>

      {/* ── Application cards ──────────────────────────────── */}
      <AFHDLSection
        kicker="Applications"
        title="Five real-world use cases"
        description="Click any application to expand its detail, example, and the blocks involved."
      >
        <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.5rem" }}>
          {APPLICATIONS.map((app, i) => {
            const isOpen = activeApp === i;
            return (
              <div key={app.title} style={{
                background: isOpen ? `${app.color}10` : "var(--afhdl-surface-soft)",
                border: `1px solid ${isOpen ? app.color + "55" : "var(--afhdl-border)"}`,
                borderRadius: "12px",
                overflow: "hidden",
                transition: "all 0.2s ease",
              }}>
                <button
                  onClick={() => setActiveApp(isOpen ? null : i)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: "0.75rem",
                    padding: "0.85rem 1rem", background: "transparent", border: "none",
                    cursor: "pointer", textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{app.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: isOpen ? app.color : "var(--afhdl-text)", fontSize: "0.95rem" }}>
                      {app.title}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--afhdl-muted)", marginTop: "1px" }}>
                      {app.blocks.join(" · ")}
                    </div>
                  </div>
                  <span style={{ color: "var(--afhdl-muted)", fontSize: "0.8rem", flexShrink: 0 }}>
                    {isOpen ? "▲" : "▼"}
                  </span>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 1rem 1rem" }}>
                    <p style={{ ...S.body, marginTop: 0 }}>{app.description}</p>
                    <div style={S.note(app.color)}>
                      <strong>Real example:</strong> {app.example}
                    </div>
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                      {app.blocks.map((block) => (
                        <span key={block} style={{
                          background: `${app.color}18`,
                          border: `1px solid ${app.color}44`,
                          color: app.color, borderRadius: "20px",
                          padding: "0.2rem 0.65rem", fontSize: "0.75rem", fontWeight: 600,
                        }}>
                          {block}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </AFHDLSection>

      {/* ── Module map ─────────────────────────────────────── */}
      <AFHDLSection
        kicker="Summary"
        title="Which block solves which problem"
        description="A quick-reference map from problem type to arithmetic module."
      >
        <div style={{ display: "grid", gap: "4px", marginTop: "0.5rem" }}>
          <div style={{ ...S.tableHeader, gridTemplateColumns: "1fr 1fr 1fr" }}>
            <span>Problem</span>
            <span>Block</span>
            <span>Key concept</span>
          </div>
          {[
            ["Add two numbers", "Full adder / CLA", "Carry propagation"],
            ["Subtract A − B", "Adder + 2's complement", "Invert B, add 1, then add"],
            ["Is A larger than B?", "Magnitude comparator", "MSB-first comparison"],
            ["Detect bit errors", "Parity generator/checker", "XOR of all bits"],
            ["Represent negatives", "2's complement", "Flip bits + add 1"],
            ["Show on 7-segment", "Code converter", "Map binary to segments"],
            ["Compact binary display", "Binary → Hex", "Group 4 bits per digit"],
          ].map(([prob, block, key], i) => (
            <div key={i} style={{
              ...S.tableRow, gridTemplateColumns: "1fr 1fr 1fr",
              borderRadius: "5px", padding: "0.3rem 0.5rem",
            }}>
              <span style={{ color: "var(--afhdl-muted)", fontSize: "0.8rem" }}>{prob}</span>
              <span style={{ color: "#60a5fa", fontWeight: 600, fontSize: "0.8rem" }}>{block}</span>
              <span style={{ color: "var(--afhdl-muted)", fontSize: "0.75rem" }}>{key}</span>
            </div>
          ))}
        </div>
      </AFHDLSection>

      {/* ── Design process ─────────────────────────────────── */}
      <AFHDLSection
        kicker="Process"
        title="How to design an arithmetic subsystem"
        description="A repeatable four-step process for taking any arithmetic requirement from spec to circuit."
      >
        <AFHDLStepList
          steps={[
            "Define the operation: what numeric inputs does the system receive, and what output must it produce?",
            "Choose the arithmetic block that naturally matches (adder for sums, comparator for decisions, parity for error checking).",
            "Add supporting logic: mode control MUX, overflow detection, parity enable/disable, or code conversion on the output.",
            "Verify with edge cases: zero operands, maximum values, negative numbers, and cases that would trigger overflow.",
          ]}
        />

        <AFHDLActionRow>
          <button
            className="kmap-btn kmap-btn-secondary"
            onClick={() => setShowChecklist((v) => !v)}
          >
            {showChecklist ? "Hide" : "Show"} advanced integration patterns
          </button>
        </AFHDLActionRow>

        {showChecklist && (
          <div className="afhdl-grid-3-sm" style={{ marginTop: "0.5rem" }}>
            {[
              {
                title: "Mini ALU",
                color: "#6366f1",
                steps: [
                  "4-bit carry-lookahead adder core",
                  "Mode control: XOR B with carry-in for negate",
                  "Magnitude comparator on outputs",
                  "Overflow flag: carry-in XOR carry-out of MSB",
                ],
              },
              {
                title: "UART transmitter",
                color: "#10b981",
                steps: [
                  "Parallel-load shift register for data byte",
                  "XOR tree for parity generation",
                  "Parity mode control (even / odd / none)",
                  "Start/stop bit insertion state machine",
                ],
              },
              {
                title: "Digital thermometer",
                color: "#f59e0b",
                steps: [
                  "ADC output in binary",
                  "Binary-to-BCD converter",
                  "Two 7-segment decoders (tens, units)",
                  "Comparator for high-temp alarm",
                ],
              },
            ].map(({ title, color, steps }) => (
              <div key={title} style={{
                background: `${color}10`,
                border: `1px solid ${color}33`,
                borderRadius: "12px",
                padding: "0.85rem",
              }}>
                <div style={{ fontWeight: 700, color, marginBottom: "0.5rem", fontSize: "0.88rem" }}>{title}</div>
                {steps.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.4rem", alignItems: "flex-start", marginBottom: "0.3rem" }}>
                    <span style={{
                      background: `${color}22`, color,
                      borderRadius: "4px", padding: "0 5px",
                      fontSize: "0.65rem", fontWeight: 800, flexShrink: 0, marginTop: "1px",
                    }}>{i + 1}</span>
                    <span style={{ color: "var(--afhdl-muted-strong)", fontSize: "0.78rem", lineHeight: 1.5 }}>{s}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </AFHDLSection>

      {/* ── Quiz ───────────────────────────────────────────── */}
      <AFHDLDivider />
      <div style={S.sectionTitle}>🧠 Quiz — Applied Arithmetic</div>

      {!quizMode ? (
        <div style={S.card}>
          <div style={S.teacherBubble}>
            <span style={S.teacherAvatar}>👩‍🏫</span>
            <div style={S.teacherText}>
              Four questions on real-world application of arithmetic circuits. Can you identify which block is used where?
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
            {quizScore >= 3 ? "🎉 You're thinking like an engineer!" : "📚 Review the applications and try again!"}
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

export default DesignApplications;
