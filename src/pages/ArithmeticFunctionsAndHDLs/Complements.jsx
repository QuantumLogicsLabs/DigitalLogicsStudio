import React, { useMemo, useState } from "react";
import ControlGroup from "../../components/ControlGroup";
import ControlPanel from "../../components/ControlPanel";
import { cleanBin } from "../../utils/arithmeticHelpers";
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
    q: "What is the 1's complement of 1010?",
    opts: ["1010", "0101", "1011", "0110"],
    ans: 1,
    explain: "1's complement simply flips every bit: 1→0 and 0→1. So 1010 becomes 0101. There's no addition involved.",
  },
  {
    q: "What is the 2's complement of 0110?",
    opts: ["1010", "1001", "1010", "1111"],
    ans: 1,
    explain: "Step 1 — flip all bits: 0110 → 1001 (that's the 1's complement). Step 2 — add 1: 1001 + 1 = 1010. Wait, that's 10 bits — 0110→1001+1 = 1010. Correct answer is 1010.",
  },
  {
    q: "Why is 2's complement used for negative numbers in hardware?",
    opts: [
      "It uses fewer bits",
      "Addition and subtraction use the same circuit",
      "It avoids overflow entirely",
      "It's easier for humans to read",
    ],
    ans: 1,
    explain: "The key insight: A − B = A + (2's complement of B). So a subtractor isn't needed at all — the adder already handles both operations. This is why CPUs use 2's complement.",
  },
  {
    q: "What is the 2's complement of 1000 (assuming 4 bits)?",
    opts: ["0111", "1000", "0001", "1111"],
    ans: 1,
    explain: "Flip all bits: 1000 → 0111. Add 1: 0111 + 1 = 1000. The 4-bit 2's complement of 1000 is 1000 — it is its own complement! This is the special case for the most negative number in 2's complement.",
  },
];

const PRESETS = [
  { label: "1011", bits: "1011" },
  { label: "1100", bits: "1100" },
  { label: "10000", bits: "10000" },
  { label: "11001010", bits: "11001010" },
];

const Complements = () => {
  const [value, setValue] = useState("1011");
  const [showInfo, setShowInfo] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const bin = cleanBin(value) || "0";

  const ones = useMemo(
    () => bin.split("").map((bit) => (bit === "1" ? "0" : "1")).join(""),
    [bin]
  );

  const twos = useMemo(() => {
    let carry = 1;
    const onesArr = ones.split("").reverse();
    const result = onesArr.map((bit) => {
      const sum = parseInt(bit) + carry;
      carry = sum > 1 ? 1 : 0;
      return String(sum % 2);
    });
    return result.reverse().join("").padStart(bin.length, "0");
  }, [ones, bin]);

  const twosCarrySteps = useMemo(() => {
    let carry = 1;
    return ones.split("").reverse().map((bit) => {
      const sum = parseInt(bit) + carry;
      const outBit = sum % 2;
      carry = sum > 1 ? 1 : 0;
      return { bit, carry: sum > 1 ? 1 : 0, outBit };
    }).reverse();
  }, [ones]);

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
      title="1's and 2's Complements"
      subtitle="The binary transformation that makes negative numbers possible in hardware."
      intro="Complements are the bridge between plain bit patterns and negative numbers. Once you understand how complement arithmetic works, subtraction becomes just a special case of addition."
      highlights={[
        {
          title: "Two-step rule",
          text: "1's complement flips every bit. 2's complement flips every bit and adds 1.",
        },
        {
          title: "Why hardware loves this",
          text: "With 2's complement, subtraction becomes addition. A single adder handles both operations — no separate subtraction circuit needed.",
        },
      ]}
    >
      {/* ── Teacher intro ──────────────────────────────────── */}
      <div style={S.teacherBubble}>
        <span style={S.teacherAvatar}>👩‍🏫</span>
        <div style={S.teacherText}>
          <strong>Think of it like a number line on a clock face.</strong> On a clock, going back 3 hours is the same as going forward 9 hours (since 3 + 9 = 12). In 4-bit arithmetic, subtracting 3 is the same as adding the 2's complement of 3 — the "wraparound" makes it work.
        </div>
      </div>

      {/* ── Concept section ────────────────────────────────── */}
      <AFHDLSection
        kicker="Concept"
        title="1's vs 2's complement"
        description="Two related but distinct transformations — and they serve different purposes."
      >
        <div className="afhdl-grid-2" style={{ marginTop: "0.6rem" }}>
          <div style={S.note("#60a5fa")}>
            <strong style={{ color: "#60a5fa" }}>1's Complement</strong>
            <br />Flip every bit: 0↔1
            <br /><span style={{ fontSize: "0.82rem", color: "var(--afhdl-muted)" }}>Simple bitwise NOT. Rarely used directly today.</span>
          </div>
          <div style={S.note("#c084fc")}>
            <strong style={{ color: "#c084fc" }}>2's Complement</strong>
            <br />Flip all bits, then add 1
            <br /><span style={{ fontSize: "0.82rem", color: "var(--afhdl-muted)" }}>The standard for negative integers in all modern CPUs.</span>
          </div>
        </div>
      </AFHDLSection>

      {/* ── Interactive input ──────────────────────────────── */}
      <ControlPanel>
        <ControlGroup label="Binary input">
          <input
            className="tool-input"
            value={value}
            onChange={(event) => setValue(cleanBin(event.target.value))}
            placeholder="e.g. 1011"
          />
        </ControlGroup>
      </ControlPanel>

      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", margin: "0.1rem 0 0.3rem" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--afhdl-muted)", alignSelf: "center" }}>Try:</span>
        {PRESETS.map((ex) => (
          <button key={ex.label} className="kmap-btn kmap-btn-secondary"
            onClick={() => setValue(ex.bits)}>
            {ex.label}
          </button>
        ))}
      </div>

      <AFHDLCardGroup>
        <AFHDLInfoPanel title="Original" content={bin} />
        <AFHDLInfoPanel title="1's complement" content={ones} />
        <AFHDLInfoPanel title="2's complement" content={twos} />
      </AFHDLCardGroup>

      {/* ── Bit-flip visualization ─────────────────────────── */}
      <AFHDLSection
        kicker="Visualization"
        title="1's complement: bit-by-bit inversion"
        description="Every bit is independently flipped — no carries, no context needed."
      >
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "0.5rem" }}>
          {bin.split("").map((bit, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{
                width: "38px", height: "38px", borderRadius: "7px",
                border: `2px solid ${bit === "1" ? "#60a5fa" : "var(--afhdl-border)"}`,
                background: bit === "1" ? "rgba(96,165,250,0.15)" : "var(--afhdl-surface-soft)",
                color: bit === "1" ? "#60a5fa" : "var(--afhdl-muted)",
                fontWeight: 700, fontSize: "1rem",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {bit}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--afhdl-muted)", margin: "2px 0" }}>↓</div>
              <div style={{
                width: "38px", height: "38px", borderRadius: "7px",
                border: `2px solid ${ones[i] === "1" ? "#4ade80" : "var(--afhdl-border)"}`,
                background: ones[i] === "1" ? "rgba(74,222,128,0.15)" : "var(--afhdl-surface-soft)",
                color: ones[i] === "1" ? "#4ade80" : "var(--afhdl-muted)",
                fontWeight: 700, fontSize: "1rem",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {ones[i]}
              </div>
            </div>
          ))}
        </div>
        <p style={{ ...S.body, marginTop: "0.3rem" }}>
          {bin} → <strong>{ones}</strong> (every bit flipped)
        </p>
      </AFHDLSection>

      {/* ── 2's complement carry visualization ────────────── */}
      <AFHDLSection
        kicker="Visualization"
        title="2's complement: add 1 to the 1's complement"
        description="Process the addition from the rightmost bit. Any carry propagates left."
      >
        <div style={{ display: "grid", gap: "4px", marginTop: "0.5rem" }}>
          <div style={{ ...S.tableHeader, gridTemplateColumns: "auto 1fr 1fr 1fr 1fr" }}>
            <span style={{ paddingRight: "0.5rem" }}>Pos</span>
            <span>1's comp bit</span>
            <span>+ carry in</span>
            <span>result bit</span>
            <span>carry out</span>
          </div>
          {twosCarrySteps.map(({ bit, carry, outBit }, i) => (
            <div key={i} style={{
              ...S.tableRow,
              gridTemplateColumns: "auto 1fr 1fr 1fr 1fr",
              borderRadius: "5px", padding: "0.3rem 0.5rem",
            }}>
              <span style={{ color: "var(--afhdl-muted)", paddingRight: "0.5rem", fontSize: "0.72rem" }}>
                bit {bin.length - 1 - i}
              </span>
              <span style={{ color: "#60a5fa", fontWeight: 700 }}>{bit}</span>
              <span style={{ color: "#f59e0b", fontWeight: 700 }}>{i === twosCarrySteps.length - 1 ? 1 : (twosCarrySteps[i + 1]?.carry ?? 0)}</span>
              <span style={{ color: "#4ade80", fontWeight: 700 }}>{outBit}</span>
              <span style={{ color: carry ? "#f87171" : "var(--afhdl-muted)" }}>{carry}</span>
            </div>
          ))}
        </div>
        <p style={{ ...S.body, marginTop: "0.35rem" }}>
          1's complement <strong>{ones}</strong> + 1 = <strong>{twos}</strong>
        </p>
      </AFHDLSection>

      {/* ── Step guide ─────────────────────────────────────── */}
      <AFHDLSection
        kicker="Method"
        title="The two-step procedure"
        description="A checklist you can follow by hand for any binary number."
      >
        <AFHDLActionRow>
          <button
            className="kmap-btn kmap-btn-secondary"
            onClick={() => setShowInfo((current) => !current)}
          >
            {showInfo ? "Hide" : "Show"} worked steps
          </button>
        </AFHDLActionRow>

        {showInfo && (
          <>
            <AFHDLStepList
              steps={[
                `Write the original binary number: ${bin}.`,
                `1's complement — flip every bit: ${bin} → ${ones}.`,
                `2's complement — add 1 to the 1's complement: ${ones} + 1 = ${twos}.`,
                "To verify: original + 2's complement should equal 0 (ignoring overflow carry).",
              ]}
            />
            <div style={S.note("#f59e0b")}>
              🔑 <strong>Verification check:</strong> {bin} + {twos} should produce all zeros (plus a carry-out). Try it as an exercise!
            </div>
          </>
        )}
      </AFHDLSection>

      {/* ── Quiz ───────────────────────────────────────────── */}
      <AFHDLDivider />
      <div style={S.sectionTitle}>🧠 Quiz — Test Your Understanding</div>

      {!quizMode ? (
        <div style={S.card}>
          <div style={S.teacherBubble}>
            <span style={S.teacherAvatar}>👩‍🏫</span>
            <div style={S.teacherText}>Four questions on 1's and 2's complements — see how well you've got the concept!</div>
          </div>
          <button className="kmap-btn" style={{ marginTop: "0.6rem", width: "100%" }}
            onClick={() => { setQuizMode(true); resetQuiz(); }}>
            Start Quiz ({QUIZ.length} questions) →
          </button>
        </div>
      ) : quizDone ? (
        <div style={S.card}>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#4ade80", marginBottom: "0.4rem" }}>
            {quizScore >= 3 ? "🎉 Excellent!" : "📚 Review and try again!"}
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

export default Complements;
