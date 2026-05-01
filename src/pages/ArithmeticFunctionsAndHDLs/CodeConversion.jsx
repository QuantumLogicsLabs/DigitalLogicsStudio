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
    q: "What is the decimal value of the binary number 1010?",
    opts: ["8", "10", "12", "6"],
    ans: 1,
    explain: "1×2³ + 0×2² + 1×2¹ + 0×2⁰ = 8 + 0 + 2 + 0 = 10. Always work from the rightmost bit (position 0) to the leftmost.",
  },
  {
    q: "How many binary bits does one hexadecimal digit represent?",
    opts: ["1 bit", "2 bits", "4 bits", "8 bits"],
    ans: 2,
    explain: "Each hex digit maps to exactly 4 bits (a nibble). Hex goes from 0–F (16 values), and 2⁴ = 16, so 4 bits per hex digit.",
  },
  {
    q: "What is the hexadecimal value of binary 11111111?",
    opts: ["EE", "FF", "77", "F0"],
    ans: 1,
    explain: "Split into two groups of 4: 1111 = F, 1111 = F. So 11111111₂ = FF₁₆. This is also 255 in decimal.",
  },
  {
    q: "Which base does hexadecimal use?",
    opts: ["Base 2", "Base 8", "Base 10", "Base 16"],
    ans: 3,
    explain: "Hexadecimal uses 16 as its base, using digits 0–9 and letters A–F to represent values 0–15. It's popular because 16 = 2⁴, making it a natural shorthand for binary.",
  },
];

const EXAMPLES = [
  { label: "8 = 0b1000", bits: "1000" },
  { label: "15 = 0b1111", bits: "1111" },
  { label: "42 = 0b101010", bits: "101010" },
  { label: "255 = 0xFF", bits: "11111111" },
];

const HEX_DIGITS = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];

const CodeConversion = () => {
  const [bin, setBin] = useState("101101");
  const [showExplain, setShowExplain] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const values = useMemo(() => {
    const value = cleanBin(bin) || "0";
    const decimal = parseInt(value, 2);
    return {
      bin: value,
      dec: String(decimal),
      hex: decimal.toString(16).toUpperCase(),
    };
  }, [bin]);

  const placeValues = useMemo(() => {
    const b = values.bin;
    const len = b.length;
    return b.split("").map((bit, i) => ({
      bit,
      power: len - 1 - i,
      weight: Math.pow(2, len - 1 - i),
      contribution: bit === "1" ? Math.pow(2, len - 1 - i) : 0,
    }));
  }, [values.bin]);

  const hexGroups = useMemo(() => {
    const b = values.bin;
    const padded = b.padStart(Math.ceil(b.length / 4) * 4, "0");
    const groups = [];
    for (let i = 0; i < padded.length; i += 4) {
      const nibble = padded.slice(i, i + 4);
      groups.push({ nibble, hex: parseInt(nibble, 2).toString(16).toUpperCase() });
    }
    return groups;
  }, [values.bin]);

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
      title="Code Conversion"
      subtitle="Convert one binary value into the number formats you'll encounter every day."
      intro="The same pattern of bits can be read in multiple number systems. This page teaches you to translate between binary, decimal, and hexadecimal — and more importantly, to understand why each step works."
      highlights={[
        {
          title: "Core skill",
          text: "Binary ↔ Decimal uses place values (powers of 2). Binary ↔ Hex uses 4-bit grouping.",
        },
        {
          title: "Why this matters",
          text: "Memory addresses, register values, and hardware registers are almost always shown in hex. Knowing binary helps you decode them.",
        },
      ]}
    >
      {/* ── Teacher intro ──────────────────────────────────── */}
      <div style={S.teacherBubble}>
        <span style={S.teacherAvatar}>👩‍🏫</span>
        <div style={S.teacherText}>
          <strong>Think of it like currency exchange.</strong> $45 USD is the same money whether you count it in dollars, euros, or pence — the amount doesn't change, only the notation does. Binary 101101 is the same number as decimal 45 and hex 2D. We're just switching the notation system.
        </div>
      </div>

      {/* ── Concept section ────────────────────────────────── */}
      <AFHDLSection
        kicker="Concept"
        title="Three notations, one value"
        description="Binary is how the circuit stores it. Decimal is how you think about it. Hexadecimal is the compact shorthand engineers use."
      >
        <div className="afhdl-grid-3-sm" style={{ marginTop: "0.6rem" }}>
          <div style={S.note("#60a5fa")}>
            <strong style={{ color: "#60a5fa" }}>🔵 Binary (Base 2)</strong>
            <br />Digits: 0, 1
            <br /><span style={{ fontSize: "0.82rem", color: "var(--afhdl-muted)" }}>Each digit is a power of 2.</span>
          </div>
          <div style={S.note("#4ade80")}>
            <strong style={{ color: "#4ade80" }}>🟢 Decimal (Base 10)</strong>
            <br />Digits: 0–9
            <br /><span style={{ fontSize: "0.82rem", color: "var(--afhdl-muted)" }}>The way humans normally count.</span>
          </div>
          <div style={S.note("#c084fc")}>
            <strong style={{ color: "#c084fc" }}>🟣 Hexadecimal (Base 16)</strong>
            <br />Digits: 0–9, A–F
            <br /><span style={{ fontSize: "0.82rem", color: "var(--afhdl-muted)" }}>4 bits = 1 hex digit.</span>
          </div>
        </div>
      </AFHDLSection>

      {/* ── Interactive input ──────────────────────────────── */}
      <ControlPanel>
        <ControlGroup label="Binary input">
          <input
            className="tool-input"
            value={bin}
            onChange={(event) => setBin(cleanBin(event.target.value))}
            placeholder="e.g. 101101"
          />
        </ControlGroup>
      </ControlPanel>

      {/* Preset examples */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", margin: "0.1rem 0 0.3rem" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--afhdl-muted)", alignSelf: "center" }}>Try:</span>
        {EXAMPLES.map((ex) => (
          <button key={ex.label} className="kmap-btn kmap-btn-secondary"
            onClick={() => setBin(ex.bits)}>
            {ex.label}
          </button>
        ))}
      </div>

      <AFHDLCardGroup>
        <AFHDLInfoPanel title="Binary" content={values.bin} />
        <AFHDLInfoPanel title="Decimal" content={values.dec} />
        <AFHDLInfoPanel title="Hexadecimal" content={"0x" + values.hex} />
      </AFHDLCardGroup>

      {/* ── Place-value visualization ──────────────────────── */}
      <AFHDLSection
        kicker="Visualization"
        title="Binary → Decimal: place values"
        description="Each bit position has a weight that is a power of 2. Add only the positions where the bit is 1."
      >
        <div style={{ overflowX: "auto", marginTop: "0.5rem" }}>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", alignItems: "flex-end" }}>
            {placeValues.map(({ bit, power, weight, contribution }, i) => (
              <div key={i} style={{ textAlign: "center", minWidth: "52px" }}>
                <div style={{
                  fontSize: "0.65rem", color: "var(--afhdl-muted)", marginBottom: "2px",
                }}>
                  2<sup>{power}</sup>={weight}
                </div>
                <div style={{
                  width: "48px", height: "44px", borderRadius: "8px",
                  border: `2px solid ${bit === "1" ? "#60a5fa" : "var(--afhdl-border)"}`,
                  background: bit === "1" ? "rgba(96,165,250,0.15)" : "var(--afhdl-surface-soft)",
                  color: bit === "1" ? "#60a5fa" : "var(--afhdl-muted)",
                  fontWeight: 700, fontSize: "1.15rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {bit}
                </div>
                <div style={{
                  fontSize: "0.65rem", marginTop: "2px",
                  color: bit === "1" ? "#4ade80" : "var(--afhdl-muted)",
                  fontWeight: bit === "1" ? 700 : 400,
                }}>
                  {bit === "1" ? `+${contribution}` : "+0"}
                </div>
              </div>
            ))}
            <div style={{ textAlign: "center", minWidth: "52px", paddingBottom: "2px" }}>
              <div style={{ fontSize: "0.65rem", color: "var(--afhdl-muted)", marginBottom: "2px" }}>total</div>
              <div style={{
                width: "52px", height: "44px", borderRadius: "8px",
                border: "2px solid #4ade80",
                background: "rgba(74,222,128,0.12)",
                color: "#4ade80", fontWeight: 800, fontSize: "1rem",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {values.dec}
              </div>
              <div style={{ fontSize: "0.65rem", marginTop: "2px", color: "var(--afhdl-muted)" }}>dec</div>
            </div>
          </div>
        </div>
        <p style={{ ...S.body, marginTop: "0.35rem" }}>
          Sum of active weights: {placeValues.filter(p => p.bit === "1").map(p => p.weight).join(" + ") || "0"} = <strong>{values.dec}</strong>
        </p>
      </AFHDLSection>

      {/* ── Hex grouping visualization ─────────────────────── */}
      <AFHDLSection
        kicker="Visualization"
        title="Binary → Hex: 4-bit grouping"
        description="Split the binary number into 4-bit groups from the right. Each group becomes one hex digit."
      >
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center", marginTop: "0.5rem" }}>
          {hexGroups.map((g, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ display: "flex", gap: "2px", marginBottom: "4px" }}>
                {g.nibble.split("").map((bit, j) => (
                  <div key={j} style={{
                    width: "26px", height: "28px", borderRadius: "5px",
                    border: `1.5px solid ${bit === "1" ? "#c084fc" : "var(--afhdl-border)"}`,
                    background: bit === "1" ? "rgba(192,132,252,0.15)" : "var(--afhdl-surface-soft)",
                    color: bit === "1" ? "#c084fc" : "var(--afhdl-muted)",
                    fontWeight: 700, fontSize: "0.85rem",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {bit}
                  </div>
                ))}
              </div>
              <div style={{
                width: "108px", height: "36px", borderRadius: "8px",
                border: "2px solid #c084fc",
                background: "rgba(192,132,252,0.12)",
                color: "#c084fc", fontWeight: 800, fontSize: "1.1rem",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto",
              }}>
                {g.hex}
              </div>
            </div>
          ))}
        </div>
        <p style={{ ...S.body, marginTop: "0.4rem" }}>
          {hexGroups.map(g => g.nibble).join(" | ")} → <strong>0x{values.hex}</strong>
        </p>
      </AFHDLSection>

      {/* ── Step guide ─────────────────────────────────────── */}
      <AFHDLSection
        kicker="Method"
        title="The conversion checklist"
        description="A consistent process that works for any binary number."
      >
        <AFHDLActionRow>
          <button
            className="kmap-btn kmap-btn-secondary"
            onClick={() => setShowExplain((v) => !v)}
          >
            {showExplain ? "Hide" : "Show"} worked steps
          </button>
        </AFHDLActionRow>

        {showExplain && (
          <>
            <AFHDLStepList
              steps={[
                `Write out "${values.bin}" with each bit position labeled from right (position 0).`,
                `For decimal: multiply each 1-bit by its weight (2^position) and sum them.`,
                `Weighted sum: ${placeValues.filter(p => p.bit === "1").map(p => `${p.weight}`).join(" + ") || "0"} = ${values.dec}.`,
                `For hex: pad to a multiple of 4 bits, then read each 4-bit group as a single hex digit.`,
                `Groups: ${hexGroups.map(g => `${g.nibble}→${g.hex}`).join(", ")} → 0x${values.hex}.`,
              ]}
            />
            <div style={S.note("#6366f1")}>
              💡 <strong>Quick trick:</strong> Memorize the 16 4-bit patterns (0000→0 through 1111→F). Once those are muscle memory, hex conversion becomes instant.
            </div>
          </>
        )}
      </AFHDLSection>

      {/* ── Hex digit reference ───────────────────────────── */}
      <AFHDLSection
        kicker="Reference"
        title="All 16 hex digits"
        description="Each hex digit maps to exactly one 4-bit binary pattern."
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "4px", marginTop: "0.4rem" }}>
          {HEX_DIGITS.map((hd, i) => {
            const nibble = i.toString(2).padStart(4, "0");
            const isCurrentGroup = hexGroups.some(g => g.hex === hd);
            return (
              <div key={hd} style={{
                ...S.tableRow,
                background: isCurrentGroup ? "var(--afhdl-table-header-bg)" : "var(--afhdl-table-row-bg)",
                border: isCurrentGroup ? "1px solid var(--afhdl-border-strong)" : "1px solid transparent",
                borderRadius: "6px", padding: "0.3rem",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "1px",
              }}>
                <span style={{ color: "#c084fc", fontWeight: 800, fontSize: "0.95rem" }}>{hd}</span>
                <span style={{ color: "var(--afhdl-muted)", fontSize: "0.65rem", fontFamily: "monospace" }}>{nibble}</span>
                <span style={{ color: "var(--afhdl-muted)", fontSize: "0.62rem" }}>{i}</span>
              </div>
            );
          })}
        </div>
        <p style={{ ...S.body, marginTop: "0.3rem", fontSize: "0.78rem" }}>
          Highlighted cells are the hex digits present in your current value 0x{values.hex}.
        </p>
      </AFHDLSection>

      {/* ── Quiz ───────────────────────────────────────────── */}
      <AFHDLDivider />
      <div style={S.sectionTitle}>🧠 Quiz — Test Your Understanding</div>

      {!quizMode ? (
        <div style={S.card}>
          <div style={S.teacherBubble}>
            <span style={S.teacherAvatar}>👩‍🏫</span>
            <div style={S.teacherText}>Four quick questions on binary, decimal, and hex conversion. Give it a try!</div>
          </div>
          <button className="kmap-btn" style={{ marginTop: "0.6rem", width: "100%" }}
            onClick={() => { setQuizMode(true); resetQuiz(); }}>
            Start Quiz ({QUIZ.length} questions) →
          </button>
        </div>
      ) : quizDone ? (
        <div style={S.card}>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#4ade80", marginBottom: "0.4rem" }}>
            {quizScore >= 3 ? "🎉 Nice work!" : "📚 Keep practicing!"}
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

export default CodeConversion;
