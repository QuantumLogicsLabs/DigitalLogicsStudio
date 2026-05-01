import React, { useMemo, useState } from "react";
import ControlGroup from "../../components/ControlGroup";
import ControlPanel from "../../components/ControlPanel";
import AFHDLLayout from "./components/AFHDLLayout";
import AFHDLActionRow from "./components/AFHDLActionRow";
import AFHDLCardGroup from "./components/AFHDLCardGroup";
import AFHDLInfoPanel from "./components/AFHDLInfoPanel";
import AFHDLSection from "./components/AFHDLSection";
import AFHDLStepList from "./components/AFHDLStepList";
import AFHDLDivider from "./components/AFHDLDivider";
import { afhdlTheme as S } from "./utils/afhdlTheme";
import { fromTwosComplement } from "./utils/bitOperations";
import { binToHex } from "./utils/valueFormatter";
import {
  binaryAdd,
  binaryMultiply,
  binarySubtract,
  cleanBin,
  uSignedValue,
} from "../../utils/arithmeticHelpers";

const QUIZ = [
  {
    q: "What is the decimal value of 4-bit pattern 1100 in unsigned interpretation?",
    opts: ["−4", "12", "−3", "8"],
    ans: 1,
    explain: "Unsigned means all bits contribute positively: 1×8 + 1×4 + 0×2 + 0×1 = 12. No sign bit — just plain place values.",
  },
  {
    q: "What is the decimal value of 4-bit pattern 1100 in signed (2's complement) interpretation?",
    opts: ["12", "−3", "−4", "−12"],
    ans: 2,
    explain: "In 2's complement the MSB is the sign bit. 1100 has MSB=1 (negative). Invert+1: 1100→0011+1=0100=4. So 1100 = −4.",
  },
  {
    q: "What is the unsigned range for a 4-bit number?",
    opts: ["−8 to 7", "0 to 15", "−7 to 7", "0 to 16"],
    ans: 1,
    explain: "Unsigned n-bit range is 0 to 2ⁿ−1. For n=4: 0 to 2⁴−1 = 0 to 15. All 16 combinations represent non-negative values.",
  },
  {
    q: "When two 4-bit unsigned numbers are added and the result exceeds 15, what has occurred?",
    opts: ["Underflow", "Overflow", "Carry cancel", "Sign flip"],
    ans: 1,
    explain: "Overflow occurs when the result exceeds the maximum representable value. For 4-bit unsigned that maximum is 15 (1111). A result > 15 sets the carry-out flag.",
  },
];

const PRESETS = [
  { label: "A=0101 B=0011", a: "0101", b: "0011" },
  { label: "A=1100 B=0011", a: "1100", b: "0011" },
  { label: "A=1000 B=1000", a: "1000", b: "1000" },
  { label: "A=0111 B=0001", a: "0111", b: "0001" },
];

const SignedUnsignedArithmetic = () => {
  const [a, setA] = useState("0101");
  const [b, setB] = useState("0011");
  const [signed, setSigned] = useState(false);
  const [op, setOp] = useState("add");
  const [showInfo, setShowInfo] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const cleanA = cleanBin(a) || "0";
  const cleanB = cleanBin(b) || "0";
  const padLen = Math.max(cleanA.length, cleanB.length, 4);
  const paddedA = cleanA.padStart(padLen, "0");
  const paddedB = cleanB.padStart(padLen, "0");

  const aVal = uSignedValue(a, signed);
  const bVal = uSignedValue(b, signed);

  const computed = useMemo(() => {
    switch (op) {
      case "add": return binaryAdd(a, b).sum;
      case "subtract": return binarySubtract(a, b).diff;
      case "multiply": return binaryMultiply(a, b);
      case "divide": return bVal === 0 ? "÷0 undefined" : String(Math.floor(aVal / bVal));
      default: return "";
    }
  }, [a, b, op, aVal, bVal]);

  const interpretations = useMemo(() => {
    const bits = paddedA;
    const n = bits.length;
    const unsignedVal = parseInt(bits, 2);
    const signedVal = fromTwosComplement(bits);
    const maxUnsigned = Math.pow(2, n) - 1;
    const maxSigned = Math.pow(2, n - 1) - 1;
    const minSigned = -Math.pow(2, n - 1);
    const overflowUnsigned = unsignedVal > maxUnsigned;
    return { n, unsignedVal, signedVal, maxUnsigned, maxSigned, minSigned, overflowUnsigned };
  }, [paddedA]);

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
      title="Signed and Unsigned Arithmetic"
      subtitle="The same bits mean different numbers depending on how you read them."
      intro="A bit pattern alone is not enough — you need the interpretation rule too. This page lets you compare unsigned and two's-complement signed views side by side so the difference becomes concrete."
      highlights={[
        {
          title: "Key insight",
          text: "The bits don't change. The meaning changes. 1100 is 12 unsigned but −4 in signed 4-bit arithmetic.",
        },
        {
          title: "What to watch for",
          text: "Overflow means the result can't fit in the available bits. Its definition changes between unsigned and signed modes.",
        },
      ]}
    >
      {/* ── Teacher intro ──────────────────────────────────── */}
      <div style={S.teacherBubble}>
        <span style={S.teacherAvatar}>👩‍🏫</span>
        <div style={S.teacherText}>
          <strong>Think of it like a thermometer scale.</strong> The mercury level is the same physical thing, but whether it reads "20 degrees" or "-4 degrees" depends on whether you're reading Celsius or Fahrenheit. The bits are the mercury — the interpretation rule is the scale printed on the glass.
        </div>
      </div>

      {/* ── Concept section ────────────────────────────────── */}
      <AFHDLSection
        kicker="Concept"
        title="Two interpretations of the same bits"
        description="Both systems use the same binary digits but assign different meanings to the most significant bit."
      >
        <div className="afhdl-grid-2" style={{ marginTop: "0.6rem" }}>
          <div style={S.note("#60a5fa")}>
            <strong style={{ color: "#60a5fa" }}>Unsigned</strong>
            <br />All bits contribute positively.
            <br />Range (n bits): 0 to 2ⁿ−1
            <br /><span style={{ fontSize: "0.82rem", color: "var(--afhdl-muted)" }}>No negative values. MSB is just a large weight (2ⁿ⁻¹).</span>
          </div>
          <div style={S.note("#c084fc")}>
            <strong style={{ color: "#c084fc" }}>Signed (2's complement)</strong>
            <br />MSB acts as sign bit (−2ⁿ⁻¹).
            <br />Range (n bits): −2ⁿ⁻¹ to 2ⁿ⁻¹−1
            <br /><span style={{ fontSize: "0.82rem", color: "var(--afhdl-muted)" }}>MSB=1 means negative. Half the range is below zero.</span>
          </div>
        </div>
      </AFHDLSection>

      {/* ── Interactive controls ───────────────────────────── */}
      <ControlPanel>
        <ControlGroup label="A (binary)">
          <input
            className="tool-input"
            value={a}
            onChange={(event) => setA(cleanBin(event.target.value))}
            placeholder="e.g. 0101"
          />
        </ControlGroup>
        <ControlGroup label="B (binary)">
          <input
            className="tool-input"
            value={b}
            onChange={(event) => setB(cleanBin(event.target.value))}
            placeholder="e.g. 0011"
          />
        </ControlGroup>
        <ControlGroup label="Mode">
          <select
            value={signed ? "signed" : "unsigned"}
            onChange={(event) => setSigned(event.target.value === "signed")}
          >
            <option value="unsigned">Unsigned</option>
            <option value="signed">Signed (2's complement)</option>
          </select>
        </ControlGroup>
        <ControlGroup label="Operation">
          <select value={op} onChange={(event) => setOp(event.target.value)}>
            <option value="add">Addition</option>
            <option value="subtract">Subtraction</option>
            <option value="multiply">Multiplication</option>
            <option value="divide">Division</option>
          </select>
        </ControlGroup>
      </ControlPanel>

      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", margin: "0.1rem 0 0.3rem" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--afhdl-muted)", alignSelf: "center" }}>Try:</span>
        {PRESETS.map((ex) => (
          <button key={ex.label} className="kmap-btn kmap-btn-secondary"
            onClick={() => { setA(ex.a); setB(ex.b); }}>
            {ex.label}
          </button>
        ))}
      </div>

      <AFHDLCardGroup>
        <AFHDLInfoPanel title={`A = ${paddedA}`} content={`${aVal} (${signed ? "signed" : "unsigned"})`} />
        <AFHDLInfoPanel title={`B = ${paddedB}`} content={`${bVal} (${signed ? "signed" : "unsigned"})`} />
        <AFHDLInfoPanel title="Result (binary)" content={computed} />
      </AFHDLCardGroup>

      {/* ── Side-by-side interpretation table ─────────────── */}
      <AFHDLSection
        kicker="Comparison"
        title="Same bits, two different readings"
        description="Hover each row to see how unsigned and signed differ for the current A value."
      >
        <div style={{ display: "grid", gap: "4px", marginTop: "0.5rem" }}>
          <div style={{ ...S.tableHeader, gridTemplateColumns: "1fr 1fr 1fr" }}>
            <span>Property</span>
            <span style={{ color: "#60a5fa" }}>Unsigned</span>
            <span style={{ color: "#c084fc" }}>Signed 2's comp</span>
          </div>
          {[
            ["Bits", paddedA, paddedA],
            ["Decimal value", String(parseInt(paddedA, 2)), String(fromTwosComplement(paddedA))],
            ["Hex", "0x" + binToHex(paddedA), "0x" + binToHex(paddedA)],
            [`Range (${paddedA.length}-bit)`, `0 to ${interpretations.maxUnsigned}`, `${interpretations.minSigned} to ${interpretations.maxSigned}`],
            ["MSB meaning", `+${Math.pow(2, interpretations.n - 1)}`, `−${Math.pow(2, interpretations.n - 1)}`],
          ].map(([prop, unsig, sig], i) => (
            <div key={i} style={{
              ...S.tableRow, gridTemplateColumns: "1fr 1fr 1fr",
              borderRadius: "5px", padding: "0.3rem 0.5rem",
            }}>
              <span style={{ color: "var(--afhdl-muted)", fontSize: "0.78rem" }}>{prop}</span>
              <span style={{ color: "#60a5fa", fontFamily: "monospace", fontSize: "0.82rem" }}>{unsig}</span>
              <span style={{ color: "#c084fc", fontFamily: "monospace", fontSize: "0.82rem" }}>{sig}</span>
            </div>
          ))}
        </div>
      </AFHDLSection>

      {/* ── Overflow indicator ─────────────────────────────── */}
      <AFHDLSection
        kicker="Overflow"
        title="Can the result fit?"
        description="Overflow happens when the true mathematical result is outside the representable range."
      >
        {(() => {
          const resultDec = signed ? fromTwosComplement(computed) : parseInt(computed, 2);
          const inRange = signed
            ? resultDec >= interpretations.minSigned && resultDec <= interpretations.maxSigned
            : resultDec >= 0 && resultDec <= interpretations.maxUnsigned;
          return (
            <div style={S.note(inRange ? "#4ade80" : "#f87171")}>
              {inRange
                ? `✅ No overflow — result ${resultDec} fits within the ${interpretations.n}-bit ${signed ? "signed" : "unsigned"} range.`
                : `⚠️ Overflow! Result ${resultDec} is outside the ${interpretations.n}-bit ${signed ? `signed range [${interpretations.minSigned}, ${interpretations.maxSigned}]` : `unsigned range [0, ${interpretations.maxUnsigned}]`}.`}
            </div>
          );
        })()}
      </AFHDLSection>

      {/* ── Step guide ─────────────────────────────────────── */}
      <AFHDLSection
        kicker="Method"
        title="How to interpret a result correctly"
        description="Ask these questions every time you read a binary arithmetic result."
      >
        <AFHDLActionRow>
          <button
            className="kmap-btn kmap-btn-secondary"
            onClick={() => setShowInfo((v) => !v)}
          >
            {showInfo ? "Hide" : "Show"} interpretation guide
          </button>
        </AFHDLActionRow>

        {showInfo && (
          <>
            <AFHDLStepList
              steps={[
                "Decide first: is the system treating these bits as signed or unsigned?",
                "In unsigned mode, read all bits as positive place-value weights.",
                "In signed mode, the MSB contributes −2ⁿ⁻¹ instead of +2ⁿ⁻¹.",
                "Check if the result fits in the bit-width — overflow is silent in hardware!",
                "When in doubt, compare both interpretations side by side (as shown above).",
              ]}
            />
            <div style={S.note("#f59e0b")}>
              🔑 <strong>Worked example for current A:</strong> bits = <strong>{paddedA}</strong>
              <br />Unsigned = {parseInt(paddedA, 2)} | Signed = {fromTwosComplement(paddedA)}
              <br />Same bits — entirely different numbers depending on the interpretation rule.
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
            <div style={S.teacherText}>Four questions on signed vs unsigned representation. Ready?</div>
          </div>
          <button className="kmap-btn" style={{ marginTop: "0.6rem", width: "100%" }}
            onClick={() => { setQuizMode(true); resetQuiz(); }}>
            Start Quiz ({QUIZ.length} questions) →
          </button>
        </div>
      ) : quizDone ? (
        <div style={S.card}>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#4ade80", marginBottom: "0.4rem" }}>
            {quizScore >= 3 ? "🎉 Well done!" : "📚 Keep practicing!"}
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

export default SignedUnsignedArithmetic;
