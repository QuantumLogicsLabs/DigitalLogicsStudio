import React, { useMemo, useState } from "react";
import ControlGroup from "../../components/ControlGroup";
import ControlPanel from "../../components/ControlPanel";
import { cleanBin, parity } from "../../utils/arithmeticHelpers";
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
    q: "What is the even parity bit for the data word 1011?",
    opts: ["0", "1", "Cannot be determined", "2"],
    ans: 1,
    explain: "Count the 1s: 1+0+1+1 = 3 (odd). To make the total even we add a parity bit of 1. Now total 1s = 4 (even) ✓",
  },
  {
    q: "What does a parity checker do?",
    opts: ["Corrects errors", "Detects single-bit errors", "Adds redundancy codes", "Encrypts data"],
    ans: 1,
    explain: "Parity only DETECTS errors — it cannot identify which bit is wrong or fix it. More powerful codes like Hamming are needed for correction.",
  },
  {
    q: "After transmission, a received word has even parity but an even parity system was used. What does this mean?",
    opts: ["One bit flipped", "Two bits may have flipped", "No errors occurred", "The word was corrupted"],
    ans: 1,
    explain: "Parity is fooled by an even number of bit flips! If exactly 2 bits flip, the parity count stays the same. This is a known weakness of single parity.",
  },
  {
    q: "Which logic gate implements a parity generator?",
    opts: ["AND gate", "OR gate", "XOR gate", "NAND gate"],
    ans: 2,
    explain: "XOR is the parity gate. XOR of all bits produces 1 when the count of 1s is odd, 0 when even — exactly the even parity bit!",
  },
];

const EXAMPLES = [
  { label: "3 ones (odd)", bits: "10110", hint: "Even parity bit = 1" },
  { label: "4 ones (even)", bits: "11110", hint: "Even parity bit = 0" },
  { label: "All zeros", bits: "0000", hint: "Both parity bits = 0" },
  { label: "All ones", bits: "1111", hint: "Even parity = 0, Odd = 1" },
];

const ParityGenerators = () => {
  const [bits, setBits] = useState("101001");
  const [showHelp, setShowHelp] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const cleanBits = cleanBin(bits) || "0";
  const even = parity(bits, "even");
  const odd = parity(bits, "odd");

  const onesCount = useMemo(
    () => cleanBits.split("").filter((bit) => bit === "1").length,
    [cleanBits]
  );

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
      title="Parity Generators and Checkers"
      subtitle="Use one extra bit to catch simple transmission and storage errors."
      intro="Parity is a lightweight way to verify data integrity. It cannot correct an error, but it quickly flags when the received bit pattern no longer matches the expected count of 1s."
      highlights={[
        {
          title: "Beginner shortcut",
          text: "Even parity makes the total count of 1s even. Odd parity makes it odd. That's the whole idea!",
        },
        {
          title: "Real use case",
          text: "Parity bits appear in RAM memory, serial communication (UART), and simple storage checksums.",
        },
      ]}
    >
      {/* ── Teacher intro ──────────────────────────────────── */}
      <div style={S.teacherBubble}>
        <span style={S.teacherAvatar}>👩‍🏫</span>
        <div style={S.teacherText}>
          <strong>Think of parity like a checkout counter.</strong> You count your items before and after bagging. If the count changes, something went wrong. Parity does the same thing with bits — it counts 1s so the receiver can verify nothing changed in transit.
        </div>
      </div>

      {/* ── Concept section ────────────────────────────────── */}
      <AFHDLSection
        kicker="Concept"
        title="What parity is checking"
        description="Count the number of 1s. If the count matches the parity rule, the word is valid."
      >
        <p>
          A <strong>parity generator</strong> adds one extra bit to the data so that the total number of 1s is either always even or always odd. A <strong>parity checker</strong> on the receiving end counts the 1s again — any change means an error occurred.
        </p>
        <div className="afhdl-grid-2-sm" style={{ marginTop: "0.6rem" }}>
          <div style={S.note("#60a5fa")}>
            <strong style={{ color: "#60a5fa" }}>🔵 Even Parity</strong>
            <br />Total 1s must be <strong>even</strong>.
            <br /><span style={{ fontSize: "0.82rem", color: "var(--afhdl-muted)" }}>Add parity bit = 1 if count is odd, 0 if count is even.</span>
          </div>
          <div style={S.note("#c084fc")}>
            <strong style={{ color: "#c084fc" }}>🟣 Odd Parity</strong>
            <br />Total 1s must be <strong>odd</strong>.
            <br /><span style={{ fontSize: "0.82rem", color: "var(--afhdl-muted)" }}>Add parity bit = 1 if count is even, 0 if count is odd.</span>
          </div>
        </div>
      </AFHDLSection>

      {/* ── Interactive input ──────────────────────────────── */}
      <ControlPanel>
        <ControlGroup label="Bit string">
          <input
            className="tool-input"
            value={bits}
            onChange={(event) => setBits(cleanBin(event.target.value))}
            placeholder="e.g. 101001"
          />
        </ControlGroup>
      </ControlPanel>

      {/* Preset examples */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", margin: "0.1rem 0 0.3rem" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--afhdl-muted)", alignSelf: "center" }}>Try:</span>
        {EXAMPLES.map((ex) => (
          <button key={ex.label} className="kmap-btn kmap-btn-secondary"
            onClick={() => setBits(ex.bits)} title={ex.hint}>
            {ex.label}
          </button>
        ))}
      </div>

      <AFHDLCardGroup>
        <AFHDLInfoPanel
          title={`Count of 1s in ${cleanBits}`}
          content={`${onesCount} one${onesCount !== 1 ? "s" : ""} (${onesCount % 2 === 0 ? "even" : "odd"})`}
        />
        <AFHDLInfoPanel title="Even parity bit" content={String(even)} />
        <AFHDLInfoPanel title="Odd parity bit" content={String(odd)} />
      </AFHDLCardGroup>

      {/* ── Live visualization ─────────────────────────────── */}
      <AFHDLSection
        kicker="Visualization"
        title="Bit-by-bit parity count"
        description="Watch the running XOR as each bit is processed."
      >
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", alignItems: "center", margin: "0.5rem 0" }}>
          {cleanBits.split("").map((bit, i) => {
            const runningXOR = cleanBits.slice(0, i + 1).split("").reduce((acc, b) => acc ^ parseInt(b), 0);
            return (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "8px",
                  border: `2px solid ${bit === "1" ? "#60a5fa" : "var(--afhdl-border)"}`,
                  background: bit === "1" ? "rgba(96,165,250,0.15)" : "var(--afhdl-surface-soft)",
                  color: bit === "1" ? "#60a5fa" : "var(--afhdl-muted)",
                  fontWeight: 700, fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {bit}
                </div>
                <div style={{ fontSize: "0.6rem", color: "var(--afhdl-muted)", marginTop: "2px" }}>
                  XOR={runningXOR}
                </div>
              </div>
            );
          })}
          <div style={{ textAlign: "center", marginLeft: "4px" }}>
            <div style={{
              width: "44px", height: "40px", borderRadius: "8px",
              border: `2px solid ${even ? "#4ade80" : "var(--afhdl-border-strong)"}`,
              background: even ? "rgba(74,222,128,0.15)" : "var(--afhdl-accent-soft)",
              color: even ? "#4ade80" : "var(--afhdl-accent)",
              fontWeight: 800, fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              P={even}
            </div>
            <div style={{ fontSize: "0.6rem", color: "var(--afhdl-muted)", marginTop: "2px" }}>even parity</div>
          </div>
        </div>
        <p style={{ ...S.body, marginTop: "0.25rem" }}>
          The parity bit <strong>P = {even}</strong> is appended to make the total 1s count{" "}
          <strong>{onesCount % 2 === 0 ? "stay even" : "become even"}</strong>. Final count: {onesCount + even} (even ✓).
        </p>
      </AFHDLSection>

      {/* ── Step guide ─────────────────────────────────────── */}
      <AFHDLSection
        kicker="Method"
        title="How to reason about the result"
        description="A consistent checklist for parity problems."
      >
        <AFHDLActionRow>
          <button
            className="kmap-btn kmap-btn-secondary"
            onClick={() => setShowHelp((value) => !value)}
          >
            {showHelp ? "Hide" : "Show"} worked explanation
          </button>
        </AFHDLActionRow>

        {showHelp ? (
          <>
            <AFHDLStepList
              steps={[
                `Count the 1s in "${cleanBits}" → ${onesCount} one${onesCount !== 1 ? "s" : ""}.`,
                `For even parity: ${onesCount} is ${onesCount % 2 === 0 ? "already even" : "odd"}, so parity bit = ${even}.`,
                `For odd parity: parity bit = ${odd} to make total count odd.`,
                "The transmitter appends the parity bit. The receiver recomputes and compares.",
                "If the counts don't match, at least one bit changed during transmission.",
              ]}
            />
            <div style={S.note("#f59e0b")}>
              ⚠️ <strong>Limitation:</strong> Parity only detects an odd number of bit errors. If exactly 2 bits flip, the parity stays valid and the error is invisible. Use CRC or Hamming codes when stronger protection is needed.
            </div>
          </>
        ) : null}
      </AFHDLSection>

      {/* ── Quiz ───────────────────────────────────────────── */}
      <AFHDLDivider />
      <div style={S.sectionTitle}>🧠 Quiz — Test What You Learned</div>

      {!quizMode ? (
        <div style={S.card}>
          <div style={S.teacherBubble}>
            <span style={S.teacherAvatar}>👩‍🏫</span>
            <div style={S.teacherText}>Four questions on parity — give it a try!</div>
          </div>
          <button className="kmap-btn" style={{ marginTop: "0.6rem", width: "100%" }}
            onClick={() => { setQuizMode(true); resetQuiz(); }}>
            Start Quiz ({QUIZ.length} questions) →
          </button>
        </div>
      ) : quizDone ? (
        <div style={S.card}>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#4ade80", marginBottom: "0.4rem" }}>
            {quizScore >= 3 ? "🎉 Well done!" : "📚 Keep reviewing!"}
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

export default ParityGenerators;
