import React, { useState, useMemo, useEffect, useCallback } from "react";
import AFHDLDivider from "./components/AFHDLDivider";
import AFHDLCopyButton from "./components/AFHDLCopyButton";
import AFHDLLayout from "./components/AFHDLLayout";
import { afhdlTheme as S } from "./utils/afhdlTheme";
import { cleanBin, binarySubtract } from "../../utils/arithmeticHelpers";

/* ── HELPERS ──────────────────────────────────────────────── */
const pad = (a, b) => {
  const len = Math.max(a.length, b.length, 1);
  return [a.padStart(len, "0"), b.padStart(len, "0")];
};

const buildBorrowTrace = (rawA, rawB) => {
  const [a, b] = pad(rawA || "0", rawB || "0");
  let borrow = 0;
  const trace = [];
  for (let i = a.length - 1; i >= 0; i--) {
    const ai = parseInt(a[i], 10);
    const bi = parseInt(b[i], 10);
    let diff = ai - bi - borrow;
    let nextBorrow = 0;
    if (diff < 0) {
      diff += 2;
      nextBorrow = 1;
    }
    trace.unshift({ pos: a.length - 1 - i, ai, bi, borrow, diff, nextBorrow });
    borrow = nextBorrow;
  }
  return { trace, finalBorrow: borrow };
};

const flipBits = (bin) =>
  bin
    .split("")
    .map((b) => (b === "1" ? "0" : "1"))
    .join("");

const twosComp = (bin) => {
  const inv = flipBits(bin);
  return (parseInt(inv, 2) + 1).toString(2).padStart(bin.length, "0");
};

const toggleBit = (bin, idx) => {
  const arr = bin.split("");
  arr[idx] = arr[idx] === "0" ? "1" : "0";
  return arr.join("");
};

/* ── QUIZ DATA ─────────────────────────────────────────────── */
const QUIZ = [
  {
    q: "What happens when A[i] < B[i] in binary subtraction?",
    opts: [
      "We skip that bit",
      "We borrow from the next column",
      "We set the result to 0",
      "We overflow",
    ],
    ans: 1,
    explain:
      "Just like borrowing 10 in decimal, in binary we borrow 2 from the next column to the left.",
  },
  {
    q: "What is the 2's complement of 0011?",
    opts: ["1100", "1101", "0011", "1111"],
    ans: 1,
    explain:
      "Flip 0011 → 1100, then add 1 → 1101. This is how we represent −3 in binary.",
  },
  {
    q: "How does 2's complement help with subtraction?",
    opts: [
      "It adds extra bits",
      "It turns A−B into A + (−B)",
      "It removes the carry",
      "It doubles the number",
    ],
    ans: 1,
    explain:
      "A − B = A + (−B). Since 2's complement IS how we write negative numbers, subtraction becomes addition!",
  },
  {
    q: "A − B where A < B gives a borrow-out of:",
    opts: [
      "0 (no issue)",
      "1 (negative result)",
      "2 (overflow)",
      "depends on hardware",
    ],
    ans: 1,
    explain:
      "A borrow-out of 1 means the result is negative — A wasn't big enough.",
  },
  {
    q: "1's complement of 1010 is:",
    opts: ["0101", "1011", "0110", "1001"],
    ans: 0,
    explain: "Flip every bit: 1→0 and 0→1. So 1010 → 0101.",
  },
  {
    q: "In a Full Subtractor, Borrow-Out formula is:",
    opts: [
      "(NOT A) AND B",
      "(NOT A AND B) OR (Borrow AND (A XNOR B))",
      "(A AND B)",
      "A XOR B",
    ],
    ans: 1,
    explain:
      "Borrow-out happens when A=0,B=1 OR when there's an incoming borrow and A=B (both cancel out).",
  },
];

/* ── CIRCUIT DIAGRAM COMPONENTS ───────────────────────────── */

// SVG Half Subtractor Circuit Diagram
const HalfSubtractorDiagram = () => (
  <svg
    viewBox="0 0 480 220"
    style={{
      width: "100%",
      maxWidth: "480px",
      display: "block",
      margin: "0 auto",
    }}
  >
    {/* Background */}
    <rect width="480" height="220" fill="rgba(15,23,42,0.0)" rx="12" />

    {/* Title */}
    <text
      x="240"
      y="18"
      textAnchor="middle"
      fill="#94a3b8"
      fontSize="11"
      fontFamily="monospace"
    >
      Half Subtractor — 1 bit only (no borrow-in)
    </text>

    {/* ─── Input Labels ─── */}
    <text
      x="20"
      y="72"
      fill="#60a5fa"
      fontSize="13"
      fontWeight="bold"
      fontFamily="monospace"
    >
      A
    </text>
    <text
      x="20"
      y="152"
      fill="#f87171"
      fontSize="13"
      fontWeight="bold"
      fontFamily="monospace"
    >
      B
    </text>

    {/* Input wires */}
    <line x1="32" y1="70" x2="80" y2="70" stroke="#60a5fa" strokeWidth="2" />
    <line x1="32" y1="150" x2="80" y2="150" stroke="#f87171" strokeWidth="2" />

    {/* ─── XOR Gate (for Difference) ─── */}
    {/* Extra arc for XOR */}
    <path
      d="M80,50 Q95,70 80,90"
      fill="none"
      stroke="#4ade80"
      strokeWidth="2"
    />
    {/* Gate body */}
    <path
      d="M88,50 Q120,70 88,90 Q104,70 88,50Z"
      fill="rgba(74,222,128,0.12)"
      stroke="#4ade80"
      strokeWidth="2"
    />
    {/* Top/Bottom input lines */}
    <line x1="80" y1="58" x2="92" y2="58" stroke="#60a5fa" strokeWidth="2" />
    <line x1="80" y1="82" x2="92" y2="82" stroke="#f87171" strokeWidth="2" />
    {/* Label */}
    <text
      x="97"
      y="74"
      fill="#4ade80"
      fontSize="9"
      fontFamily="monospace"
      fontWeight="bold"
    >
      XOR
    </text>
    {/* Output wire */}
    <line x1="120" y1="70" x2="200" y2="70" stroke="#4ade80" strokeWidth="2" />

    {/* ─── AND Gate (for Borrow) uses NOT A ─── */}
    {/* NOT bubble on A input */}
    <circle
      cx="150"
      cy="130"
      r="5"
      fill="none"
      stroke="#f59e0b"
      strokeWidth="1.5"
    />
    <line
      x1="32"
      y1="70"
      x2="32"
      y2="130"
      stroke="#60a5fa"
      strokeWidth="1.5"
      strokeDasharray="4,3"
    />
    <line
      x1="32"
      y1="130"
      x2="145"
      y2="130"
      stroke="#60a5fa"
      strokeWidth="1.5"
      strokeDasharray="4,3"
    />
    {/* NOT label */}
    <text x="60" y="125" fill="#f59e0b" fontSize="8" fontFamily="monospace">
      NOT A
    </text>

    {/* AND gate body */}
    <path
      d="M88,120 L88,160 Q130,160 130,140 Q130,120 88,120Z"
      fill="rgba(248,113,113,0.12)"
      stroke="#f87171"
      strokeWidth="2"
    />
    {/* input lines to AND */}
    <line x1="80" y1="128" x2="88" y2="128" stroke="#f59e0b" strokeWidth="2" />
    <line x1="80" y1="152" x2="88" y2="152" stroke="#f87171" strokeWidth="2" />
    {/* B wire down to AND */}
    <line x1="80" y1="150" x2="80" y2="152" stroke="#f87171" strokeWidth="2" />
    {/* Label */}
    <text
      x="94"
      y="144"
      fill="#f87171"
      fontSize="9"
      fontFamily="monospace"
      fontWeight="bold"
    >
      AND
    </text>
    {/* Output wire */}
    <line
      x1="130"
      y1="140"
      x2="200"
      y2="140"
      stroke="#f87171"
      strokeWidth="2"
    />

    {/* ─── Output Labels ─── */}
    <rect
      x="200"
      y="57"
      width="72"
      height="26"
      rx="6"
      fill="rgba(74,222,128,0.15)"
      stroke="#4ade80"
      strokeWidth="1.5"
    />
    <text
      x="236"
      y="74"
      textAnchor="middle"
      fill="#4ade80"
      fontSize="11"
      fontFamily="monospace"
      fontWeight="bold"
    >
      Diff (D)
    </text>

    <rect
      x="200"
      y="127"
      width="80"
      height="26"
      rx="6"
      fill="rgba(248,113,113,0.15)"
      stroke="#f87171"
      strokeWidth="1.5"
    />
    <text
      x="240"
      y="144"
      textAnchor="middle"
      fill="#f87171"
      fontSize="11"
      fontFamily="monospace"
      fontWeight="bold"
    >
      Borrow (B)
    </text>

    {/* ─── Formula Box ─── */}
    <rect
      x="290"
      y="45"
      width="175"
      height="130"
      rx="8"
      fill="rgba(30,41,59,0.7)"
      stroke="rgba(148,163,184,0.2)"
      strokeWidth="1"
    />
    <text
      x="378"
      y="65"
      textAnchor="middle"
      fill="#a5b4fc"
      fontSize="10"
      fontFamily="monospace"
      fontWeight="bold"
    >
      Logic Formulas
    </text>
    <line
      x1="300"
      y1="70"
      x2="456"
      y2="70"
      stroke="rgba(148,163,184,0.2)"
      strokeWidth="1"
    />
    <text x="300" y="90" fill="#94a3b8" fontSize="9" fontFamily="monospace">
      D = A XOR B
    </text>
    <text x="300" y="108" fill="#94a3b8" fontSize="9" fontFamily="monospace">
      {" "}
      = A ⊕ B
    </text>
    <line
      x1="300"
      y1="118"
      x2="456"
      y2="118"
      stroke="rgba(148,163,184,0.15)"
      strokeWidth="1"
    />
    <text x="300" y="136" fill="#94a3b8" fontSize="9" fontFamily="monospace">
      Borrow = (NOT A) AND B
    </text>
    <text x="300" y="152" fill="#94a3b8" fontSize="9" fontFamily="monospace">
      {" "}
      = A̅ · B
    </text>
    <line
      x1="300"
      y1="162"
      x2="456"
      y2="162"
      stroke="rgba(148,163,184,0.15)"
      strokeWidth="1"
    />
    <text x="300" y="177" fill="#64748b" fontSize="8" fontFamily="monospace">
      Only 1 bit, no borrow-in
    </text>
  </svg>
);

// SVG Full Subtractor Circuit Diagram
const FullSubtractorDiagram = () => (
  <svg
    viewBox="0 0 520 260"
    style={{
      width: "100%",
      maxWidth: "520px",
      display: "block",
      margin: "0 auto",
    }}
  >
    <rect width="520" height="260" fill="rgba(15,23,42,0.0)" rx="12" />

    {/* Title */}
    <text
      x="260"
      y="18"
      textAnchor="middle"
      fill="#94a3b8"
      fontSize="11"
      fontFamily="monospace"
    >
      Full Subtractor — handles borrow-in from previous bit
    </text>

    {/* ─── Input Labels ─── */}
    <text
      x="8"
      y="72"
      fill="#60a5fa"
      fontSize="12"
      fontWeight="bold"
      fontFamily="monospace"
    >
      A
    </text>
    <text
      x="8"
      y="132"
      fill="#f87171"
      fontSize="12"
      fontWeight="bold"
      fontFamily="monospace"
    >
      B
    </text>
    <text
      x="4"
      y="195"
      fill="#fbbf24"
      fontSize="11"
      fontWeight="bold"
      fontFamily="monospace"
    >
      Bin
    </text>

    {/* Input wires */}
    <line x1="22" y1="70" x2="65" y2="70" stroke="#60a5fa" strokeWidth="2" />
    <line x1="22" y1="130" x2="65" y2="130" stroke="#f87171" strokeWidth="2" />
    <line x1="22" y1="193" x2="65" y2="193" stroke="#fbbf24" strokeWidth="2" />

    {/* ─── First XOR gate (A XOR B) ─── */}
    <path
      d="M65,52 Q78,70 65,88"
      fill="none"
      stroke="#4ade80"
      strokeWidth="1.5"
    />
    <path
      d="M72,52 Q104,70 72,88 Q88,70 72,52Z"
      fill="rgba(74,222,128,0.1)"
      stroke="#4ade80"
      strokeWidth="1.5"
    />
    <line x1="65" y1="59" x2="75" y2="59" stroke="#60a5fa" strokeWidth="1.5" />
    <line x1="65" y1="81" x2="75" y2="81" stroke="#f87171" strokeWidth="1.5" />
    <text x="77" y="73" fill="#4ade80" fontSize="8" fontFamily="monospace">
      XOR1
    </text>
    <line
      x1="104"
      y1="70"
      x2="145"
      y2="70"
      stroke="#4ade80"
      strokeWidth="1.5"
    />

    {/* ─── Second XOR gate ((A XOR B) XOR Bin) → Diff ─── */}
    <path
      d="M145,52 Q158,70 145,88"
      fill="none"
      stroke="#4ade80"
      strokeWidth="1.5"
    />
    <path
      d="M152,52 Q184,70 152,88 Q168,70 152,52Z"
      fill="rgba(74,222,128,0.1)"
      stroke="#4ade80"
      strokeWidth="1.5"
    />
    <line
      x1="145"
      y1="59"
      x2="155"
      y2="59"
      stroke="#4ade80"
      strokeWidth="1.5"
    />
    <line
      x1="145"
      y1="81"
      x2="155"
      y2="81"
      stroke="#fbbf24"
      strokeWidth="1.5"
    />
    {/* Bin wire to XOR2 */}
    <line
      x1="65"
      y1="193"
      x2="65"
      y2="81"
      stroke="#fbbf24"
      strokeWidth="1.5"
      strokeDasharray="4,3"
    />
    <text x="78" y="185" fill="#fbbf24" fontSize="7" fontFamily="monospace">
      Bin →
    </text>
    <line
      x1="65"
      y1="81"
      x2="145"
      y2="81"
      stroke="#fbbf24"
      strokeWidth="1.5"
      strokeDasharray="4,3"
    />
    <text x="152" y="73" fill="#4ade80" fontSize="8" fontFamily="monospace">
      XOR2
    </text>
    <line x1="184" y1="70" x2="250" y2="70" stroke="#4ade80" strokeWidth="2" />

    {/* Diff output */}
    <rect
      x="250"
      y="57"
      width="72"
      height="26"
      rx="6"
      fill="rgba(74,222,128,0.15)"
      stroke="#4ade80"
      strokeWidth="1.5"
    />
    <text
      x="286"
      y="74"
      textAnchor="middle"
      fill="#4ade80"
      fontSize="11"
      fontFamily="monospace"
      fontWeight="bold"
    >
      Diff (D)
    </text>

    {/* ─── AND gate 1: NOT A AND B ─── */}
    {/* NOT A */}
    <circle
      cx="118"
      cy="130"
      r="4"
      fill="none"
      stroke="#f59e0b"
      strokeWidth="1.5"
    />
    <line
      x1="22"
      y1="70"
      x2="22"
      y2="130"
      stroke="#60a5fa"
      strokeWidth="1.5"
      strokeDasharray="3,3"
    />
    <line
      x1="22"
      y1="130"
      x2="114"
      y2="130"
      stroke="#60a5fa"
      strokeWidth="1.5"
      strokeDasharray="3,3"
    />
    <text x="40" y="124" fill="#f59e0b" fontSize="7" fontFamily="monospace">
      NOT A
    </text>

    {/* AND1 gate body */}
    <path
      d="M122,118 L122,142 Q148,142 148,130 Q148,118 122,118Z"
      fill="rgba(248,113,113,0.1)"
      stroke="#f87171"
      strokeWidth="1.5"
    />
    <line
      x1="114"
      y1="124"
      x2="122"
      y2="124"
      stroke="#f59e0b"
      strokeWidth="1.5"
    />
    <line
      x1="114"
      y1="136"
      x2="122"
      y2="136"
      stroke="#f87171"
      strokeWidth="1.5"
    />
    {/* B wire to AND1 */}
    <line
      x1="65"
      y1="130"
      x2="114"
      y2="130"
      stroke="#f87171"
      strokeWidth="1.5"
    />
    <line
      x1="114"
      y1="130"
      x2="114"
      y2="136"
      stroke="#f87171"
      strokeWidth="1.5"
    />
    <text x="124" y="133" fill="#f87171" fontSize="7" fontFamily="monospace">
      AND1
    </text>
    <line
      x1="148"
      y1="130"
      x2="200"
      y2="155"
      stroke="#f87171"
      strokeWidth="1.5"
    />

    {/* ─── AND gate 2: Bin AND NOT(A XOR B) ─── */}
    {/* Use (A XOR B) tapped before XOR2 */}
    <line
      x1="130"
      y1="70"
      x2="130"
      y2="165"
      stroke="#4ade80"
      strokeWidth="1.5"
      strokeDasharray="3,3"
    />
    {/* NOT (AXORB) bubble */}
    <circle
      cx="130"
      cy="165"
      r="4"
      fill="none"
      stroke="#f59e0b"
      strokeWidth="1.5"
    />
    <text x="105" y="178" fill="#f59e0b" fontSize="7" fontFamily="monospace">
      NOT(A⊕B)
    </text>

    {/* AND2 gate body */}
    <path
      d="M134,155 L134,180 Q160,180 160,167 Q160,155 134,155Z"
      fill="rgba(251,191,36,0.1)"
      stroke="#fbbf24"
      strokeWidth="1.5"
    />
    <line
      x1="134"
      y1="160"
      x2="134"
      y2="160"
      stroke="#f59e0b"
      strokeWidth="1.5"
    />
    <line
      x1="134"
      y1="175"
      x2="134"
      y2="175"
      stroke="#fbbf24"
      strokeWidth="1.5"
    />
    {/* Bin wire to AND2 */}
    <line x1="65" y1="193" x2="65" y2="175" stroke="#fbbf24" strokeWidth="1" />
    <line
      x1="65"
      y1="175"
      x2="134"
      y2="175"
      stroke="#fbbf24"
      strokeWidth="1.5"
    />
    <text x="136" y="170" fill="#fbbf24" fontSize="7" fontFamily="monospace">
      AND2
    </text>
    <line
      x1="160"
      y1="167"
      x2="200"
      y2="167"
      stroke="#fbbf24"
      strokeWidth="1.5"
    />

    {/* ─── OR gate: combines both borrows ─── */}
    <path
      d="M200,143 Q213,161 200,179"
      fill="none"
      stroke="#f87171"
      strokeWidth="1.5"
    />
    <path
      d="M207,143 Q236,161 207,179 Q220,161 207,143Z"
      fill="rgba(248,113,113,0.12)"
      stroke="#f87171"
      strokeWidth="2"
    />
    <line
      x1="200"
      y1="151"
      x2="208"
      y2="151"
      stroke="#f87171"
      strokeWidth="1.5"
    />
    <line
      x1="200"
      y1="171"
      x2="208"
      y2="171"
      stroke="#fbbf24"
      strokeWidth="1.5"
    />
    <text x="210" y="164" fill="#f87171" fontSize="8" fontFamily="monospace">
      OR
    </text>
    <line
      x1="236"
      y1="161"
      x2="280"
      y2="161"
      stroke="#f87171"
      strokeWidth="2"
    />

    {/* Bout output */}
    <rect
      x="280"
      y="148"
      width="72"
      height="26"
      rx="6"
      fill="rgba(248,113,113,0.15)"
      stroke="#f87171"
      strokeWidth="1.5"
    />
    <text
      x="316"
      y="165"
      textAnchor="middle"
      fill="#f87171"
      fontSize="11"
      fontFamily="monospace"
      fontWeight="bold"
    >
      Bout
    </text>

    {/* ─── Formula Box ─── */}
    <rect
      x="368"
      y="38"
      width="138"
      height="180"
      rx="8"
      fill="rgba(30,41,59,0.7)"
      stroke="rgba(148,163,184,0.2)"
      strokeWidth="1"
    />
    <text
      x="437"
      y="56"
      textAnchor="middle"
      fill="#a5b4fc"
      fontSize="10"
      fontFamily="monospace"
      fontWeight="bold"
    >
      Formulas
    </text>
    <line
      x1="375"
      y1="62"
      x2="498"
      y2="62"
      stroke="rgba(148,163,184,0.2)"
      strokeWidth="1"
    />
    <text x="375" y="79" fill="#94a3b8" fontSize="8.5" fontFamily="monospace">
      D = A ⊕ B ⊕ Bin
    </text>
    <line
      x1="375"
      y1="90"
      x2="498"
      y2="90"
      stroke="rgba(148,163,184,0.1)"
      strokeWidth="1"
    />
    <text x="375" y="107" fill="#94a3b8" fontSize="8" fontFamily="monospace">
      Bout =
    </text>
    <text x="375" y="121" fill="#94a3b8" fontSize="8" fontFamily="monospace">
      (A̅ · B)
    </text>
    <text x="375" y="135" fill="#64748b" fontSize="7.5" fontFamily="monospace">
      NOT A AND B
    </text>
    <text x="375" y="149" fill="#94a3b8" fontSize="8" fontFamily="monospace">
      OR
    </text>
    <text x="375" y="163" fill="#94a3b8" fontSize="8" fontFamily="monospace">
      (Bin · (A ⊙ B))
    </text>
    <text x="375" y="177" fill="#64748b" fontSize="7.5" fontFamily="monospace">
      Bin AND NOT(A⊕B)
    </text>
    <line
      x1="375"
      y1="187"
      x2="498"
      y2="187"
      stroke="rgba(148,163,184,0.1)"
      strokeWidth="1"
    />
    <text x="375" y="203" fill="#64748b" fontSize="7.5" fontFamily="monospace">
      2 XOR + 2 AND + 1 OR
    </text>
  </svg>
);

/* ── BEGINNER TOOLTIP COMPONENT ────────────────────────────── */
const Tooltip = ({ children, tip }) => {
  const [show, setShow] = useState(false);
  return (
    <span
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span
        style={{
          borderBottom: "1px dashed #6366f1",
          cursor: "help",
          color: "#a5b4fc",
        }}
      >
        {children}
      </span>
      {show && (
        <span
          style={{
            position: "absolute",
            bottom: "110%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1e293b",
            border: "1px solid rgba(99,102,241,0.4)",
            borderRadius: "8px",
            padding: "0.5rem 0.7rem",
            fontSize: "0.78rem",
            color: "#e2e8f0",
            whiteSpace: "nowrap",
            zIndex: 100,
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            lineHeight: 1.5,
            maxWidth: "220px",
          }}
        >
          {tip}
          <span
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid rgba(99,102,241,0.4)",
            }}
          />
        </span>
      )}
    </span>
  );
};

/* ── BEGINNER GLOSSARY ─────────────────────────────────────── */
const GLOSSARY = [
  {
    term: "Binary",
    icon: "🔢",
    color: "#60a5fa",
    def: "A number system with only 2 digits: 0 and 1. Every number can be written using just 0s and 1s.",
    example: "5 in decimal = 101 in binary",
  },
  {
    term: "Borrow",
    icon: "⬅️",
    color: "#f87171",
    def: "When a bit A is smaller than bit B, we 'borrow' from the next column to the left — just like borrowing 10 in decimal subtraction.",
    example:
      "In decimal: 12 − 7, borrow from tens. In binary: 10 − 1, borrow from the next bit.",
  },
  {
    term: "1's Complement",
    icon: "🔄",
    color: "#c084fc",
    def: "Flip every bit: change all 0s to 1s and all 1s to 0s. This is the first step to making a negative number in binary.",
    example: "1010 → 0101",
  },
  {
    term: "2's Complement",
    icon: "➕",
    color: "#fbbf24",
    def: "Flip all bits (1's complement), then add 1. This gives the binary representation of a negative number. Used by every modern CPU.",
    example: "0011 (3) → flip → 1100 → +1 → 1101 (which means −3)",
  },
  {
    term: "XOR Gate",
    icon: "⊕",
    color: "#4ade80",
    def: "A logic gate that outputs 1 only when the two inputs are DIFFERENT (one is 0 and one is 1). Used to compute the difference bit.",
    example: "0 XOR 1 = 1, 1 XOR 1 = 0",
  },
  {
    term: "Half Subtractor",
    icon: "½",
    color: "#ef4444",
    def: "A circuit that subtracts 2 single bits (A − B) and produces a Difference bit and a Borrow bit. Has no borrow-in input.",
    example: "Handles only the FIRST bit position",
  },
  {
    term: "Full Subtractor",
    icon: "🔲",
    color: "#8b5cf6",
    def: "Like a Half Subtractor but also accepts a borrow-in from the previous bit position. Needed for multi-bit subtraction.",
    example:
      "Chain many Full Subtractors together for 4-bit, 8-bit subtraction",
  },
];

/* ── MAIN COMPONENT ────────────────────────────────────────── */
const BinarySubtractor = () => {
  const [a, setA] = useState("1100");
  const [b, setB] = useState("0011");
  const [showTruthTable, setShowTruthTable] = useState(false);
  const [showHDL, setShowHDL] = useState(false);
  const [showCircuit, setShowCircuit] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [animStep, setAnimStep] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [quizMode, setQuizMode] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [twosStep, setTwosStep] = useState(0);
  const [activeTab, setActiveTab] = useState("borrow"); // "borrow" | "twos"

  const cleanA = cleanBin(a) || "0";
  const cleanB = cleanBin(b) || "0";
  const [paddedA, paddedB] = pad(cleanA, cleanB);

  const result = binarySubtract(cleanA, cleanB);
  const { trace, finalBorrow } = useMemo(
    () => buildBorrowTrace(cleanA, cleanB),
    [cleanA, cleanB],
  );
  const aDecimal = parseInt(paddedA, 2);
  const bDecimal = parseInt(paddedB, 2);
  const trueResult = aDecimal - bDecimal;
  const isNeg = trueResult < 0;

  const onesB = flipBits(paddedB);
  const twosB = twosComp(paddedB);
  const rawTwosSum = (parseInt(paddedA, 2) + parseInt(twosB, 2)).toString(2);
  const twosResult =
    rawTwosSum.length > paddedA.length
      ? rawTwosSum.slice(-paddedA.length)
      : rawTwosSum.padStart(paddedA.length, "0");
  const hasOverflowBit = rawTwosSum.length > paddedA.length;

  const TWOS_STEPS = [
    {
      label: "Step 1 — Write the original numbers",
      detail: `A = ${paddedA}  →  decimal ${aDecimal}\nB = ${paddedB}  →  decimal ${bDecimal}`,
      color: "#60a5fa",
      hint: "Start here! Write both numbers side by side. The padded zeros just line up the bits.",
    },
    {
      label: "Step 2 — Flip all bits of B (this is called 1's complement)",
      detail: `B =     ${paddedB}\nNOT B = ${onesB}  ← every 0 became 1 and every 1 became 0`,
      color: "#c084fc",
      hint: "Imagine a light switch — flip every bit. 0→1 and 1→0.",
    },
    {
      label: "Step 3 — Add 1 to get the 2's complement (this equals −B)",
      detail: `NOT B = ${onesB}\n+             1\n────────────────\n      = ${twosB}  ← this is −${bDecimal} in binary!`,
      color: "#f59e0b",
      hint: "Adding 1 to the flipped value gives us the negative version of B. Now we have −B in binary.",
    },
    {
      label: "Step 4 — Add A and 2's complement of B",
      detail: `  ${paddedA}   (this is A = ${aDecimal})\n+ ${twosB}   (this is −B = −${bDecimal})\n${"─".repeat(Math.max(paddedA.length, twosB.length) + 2)}\n= ${rawTwosSum}   (raw binary sum)`,
      color: "#10b981",
      hint: "A − B = A + (−B). Now it's just addition — no borrowing needed!",
    },
    {
      label: hasOverflowBit
        ? "Step 5 — Discard the extra leading bit (this is the final answer!)"
        : "Step 5 — Read the result (no extra bit to discard)",
      detail: hasOverflowBit
        ? `${rawTwosSum} → drop the leftmost 1 → ${twosResult}\n\nFinal: ${twosResult}₂  =  ${parseInt(twosResult, 2)}₁₀  ✓`
        : `${twosResult}₂  =  ${parseInt(twosResult, 2)}₁₀  ✓`,
      color: "#4ade80",
      hint: hasOverflowBit
        ? "The extra 1 bit 'falls off' the edge — that's how we know the result is positive and correct!"
        : "No overflow bit means the result fits exactly in the same number of bits.",
    },
  ];

  const examples = [
    { label: "A > B (positive)", a: "1100", b: "0011" },
    { label: "A = B (zero)", a: "1010", b: "1010" },
    { label: "A < B (negative)", a: "0011", b: "1100" },
    { label: "1 bit", a: "1", b: "1" },
    { label: "8-bit", a: "11110000", b: "01010101" },
  ];

  const startAnim = useCallback(() => {
    setAnimStep(-1);
    setIsAnimating(true);
  }, []);

  useEffect(() => {
    if (!isAnimating) return;
    if (animStep >= trace.length) {
      setIsAnimating(false);
      return;
    }
    const t = setTimeout(() => setAnimStep((s) => s + 1), 750);
    return () => clearTimeout(t);
  }, [isAnimating, animStep, trace.length]);

  const handleQ = (i) => {
    setQuizAnswer(i);
    if (i === QUIZ[quizIdx].ans) setQuizScore((s) => s + 1);
  };
  const nextQ = () => {
    if (quizIdx + 1 >= QUIZ.length) setQuizDone(true);
    else {
      setQuizIdx((i) => i + 1);
      setQuizAnswer(null);
    }
  };
  const resetQuiz = () => {
    setQuizIdx(0);
    setQuizAnswer(null);
    setQuizScore(0);
    setQuizDone(false);
  };

  return (
    <AFHDLLayout
      title="Binary Subtractor"
      subtitle="Borrow Method · Two's Complement · Circuit Diagrams · Interactive Visualizer"
      intro="This page teaches subtraction in the most direct way possible: first by borrowing column by column, then by connecting that idea to two's complement hardware."
      highlights={[
        {
          title: "First learning target",
          text: "Recognize when a subtraction column needs a borrow from the next higher bit.",
        },
        {
          title: "Second learning target",
          text: "See how two's complement lets real hardware reuse addition circuitry for subtraction.",
        },
      ]}
    >
      {/* ══ BEGINNER INTRO ══════════════════════════════════════ */}
      <div style={S.sectionTitle}>📖 What is Binary Subtraction?</div>

      {/* Plain English analogy */}
      <div style={{ ...S.note("#6366f1"), marginBottom: "0.5rem" }}>
        <strong>🌍 Think of it like normal subtraction — but in base 2!</strong>
        <br />
        In decimal (base 10) we use digits 0–9. In binary (base 2) we only have{" "}
        <strong>0</strong> and <strong>1</strong>. The rules of subtraction are
        the same — just with only two possible digits. When you run out (like
        trying to compute 0 − 1), you <em>borrow</em> from the next column,
        exactly like in decimal.
      </div>

      {/* Decimal vs Binary parallel */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.6rem",
          margin: "0.6rem 0",
        }}
      >
        <div style={{ ...S.card, borderTop: "3px solid #60a5fa" }}>
          <div
            style={{
              fontWeight: 700,
              color: "#60a5fa",
              marginBottom: "0.4rem",
            }}
          >
            🔟 Decimal (familiar)
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "0.9rem",
              color: "#e2e8f0",
              lineHeight: 2,
            }}
          >
            <div>&nbsp;&nbsp;12</div>
            <div>− &nbsp;7</div>
            <div style={{ borderTop: "1px solid #334155" }}>
              &nbsp;&nbsp;&nbsp;5
            </div>
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "#94a3b8",
              marginTop: "0.3rem",
            }}
          >
            2 &lt; 7, so borrow from tens column
          </div>
        </div>
        <div style={{ ...S.card, borderTop: "3px solid #4ade80" }}>
          <div
            style={{
              fontWeight: 700,
              color: "#4ade80",
              marginBottom: "0.4rem",
            }}
          >
            🔢 Binary (same idea!)
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "0.9rem",
              color: "#e2e8f0",
              lineHeight: 2,
            }}
          >
            <div>&nbsp;&nbsp;1100</div>
            <div>− 0011</div>
            <div style={{ borderTop: "1px solid #334155" }}>
              &nbsp;&nbsp;1001
            </div>
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "#94a3b8",
              marginTop: "0.3rem",
            }}
          >
            Same logic — just 0s and 1s
          </div>
        </div>
      </div>

      {/* Two methods overview */}
      <p style={S.body}>
        There are <strong>two ways</strong> computers subtract binary numbers:
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.6rem",
          margin: "0.5rem 0",
        }}
      >
        <div style={S.conceptCard("#ef4444")}>
          <div style={{ fontWeight: 700, marginBottom: "0.3rem" }}>
            🔴 Method 1: Borrow
          </div>
          <div
            style={{ fontSize: "0.8rem", color: "#cbd5e1", lineHeight: 1.6 }}
          >
            Go bit by bit, right to left. If A[i] &lt; B[i], borrow from the
            next column. Simple and intuitive — same as pencil-and-paper.
          </div>
        </div>
        <div style={S.conceptCard("#8b5cf6")}>
          <div style={{ fontWeight: 700, marginBottom: "0.3rem" }}>
            🟣 Method 2: Two's Complement
          </div>
          <div
            style={{ fontSize: "0.8rem", color: "#cbd5e1", lineHeight: 1.6 }}
          >
            Convert B to its negative form (−B), then just ADD. A − B = A +
            (−B). This is how <strong>every real CPU works</strong>!
          </div>
        </div>
      </div>

      {/* ══ GLOSSARY ════════════════════════════════════════════ */}
      <button
        className="kmap-btn kmap-btn-secondary"
        style={{ width: "100%", margin: "0.5rem 0 0.3rem" }}
        onClick={() => setShowGlossary((v) => !v)}
      >
        {showGlossary ? "▲ Hide" : "▼ Show"} 📚 Beginner Glossary (key terms
        explained)
      </button>
      {showGlossary && (
        <div style={{ display: "grid", gap: "0.5rem", marginBottom: "0.5rem" }}>
          {GLOSSARY.map((g) => (
            <div
              key={g.term}
              style={{ ...S.card, borderLeft: `4px solid ${g.color}` }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.3rem",
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{g.icon}</span>
                <strong style={{ color: g.color }}>{g.term}</strong>
              </div>
              <p style={{ ...S.body, margin: "0.2rem 0" }}>{g.def}</p>
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "#64748b",
                  fontFamily: "monospace",
                  marginTop: "0.3rem",
                }}
              >
                Example: {g.example}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══ CIRCUIT DIAGRAM ══════════════════════════════════════ */}
      <AFHDLDivider />
      <button
        className="kmap-btn kmap-btn-secondary"
        style={{ width: "100%", margin: "0.3rem 0" }}
        onClick={() => setShowCircuit((v) => !v)}
      >
        {showCircuit ? "▲ Hide" : "▼ Show"} 🔌 Circuit Diagrams (Half &amp; Full
        Subtractor)
      </button>

      {showCircuit && (
        <div>
          {/* What is a circuit */}
          <div style={{ ...S.note("#6366f1"), marginBottom: "0.5rem" }}>
            <strong>💡 What are these circuits?</strong>
            <br />A{" "}
            <Tooltip tip="A physical electronic circuit built from logic gates (AND, OR, XOR, NOT) that computes subtraction in hardware">
              subtractor circuit
            </Tooltip>{" "}
            is built from simple{" "}
            <Tooltip tip="Electronic components that perform basic logic operations on 0/1 signals">
              logic gates
            </Tooltip>
            . Each gate is just a few transistors. Chain them together and you
            can subtract any binary numbers!
          </div>

          {/* Half Subtractor */}
          <div style={{ ...S.card, marginBottom: "0.7rem" }}>
            <div
              style={{
                fontWeight: 700,
                color: "#ef4444",
                marginBottom: "0.3rem",
                fontSize: "1rem",
              }}
            >
              ½ Half Subtractor
            </div>
            <p style={{ ...S.body, marginBottom: "0.6rem" }}>
              Subtracts two <strong>single bits</strong> (A and B). Produces two
              outputs: the{" "}
              <span style={{ color: "#4ade80" }}>Difference (D)</span> and the{" "}
              <span style={{ color: "#f87171" }}>Borrow</span>.
              <br />
              <span style={{ color: "#64748b", fontSize: "0.8rem" }}>
                ⚠ Limitation: cannot accept a borrow from a previous bit — so it
                can only be used for the rightmost bit.
              </span>
            </p>
            <div
              style={{
                background: "rgba(15,23,42,0.4)",
                borderRadius: "10px",
                padding: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              <HalfSubtractorDiagram />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.5rem",
              }}
            >
              <div style={S.formulaBox("#4ade80")}>
                <div
                  style={{
                    color: "#4ade80",
                    fontWeight: 700,
                    marginBottom: "0.2rem",
                  }}
                >
                  Difference (D)
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.85rem",
                    color: "#e2e8f0",
                  }}
                >
                  D = A XOR B = A ⊕ B
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748b",
                    marginTop: "0.2rem",
                  }}
                >
                  Output 1 only when bits are different
                </div>
              </div>
              <div style={S.formulaBox("#f87171")}>
                <div
                  style={{
                    color: "#f87171",
                    fontWeight: 700,
                    marginBottom: "0.2rem",
                  }}
                >
                  Borrow (Bout)
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.85rem",
                    color: "#e2e8f0",
                  }}
                >
                  Bout = (NOT A) AND B
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748b",
                    marginTop: "0.2rem",
                  }}
                >
                  Output 1 only when A=0 and B=1
                </div>
              </div>
            </div>
          </div>

          {/* Full Subtractor */}
          <div style={S.card}>
            <div
              style={{
                fontWeight: 700,
                color: "#8b5cf6",
                marginBottom: "0.3rem",
                fontSize: "1rem",
              }}
            >
              🔲 Full Subtractor
            </div>
            <p style={{ ...S.body, marginBottom: "0.6rem" }}>
              Like the Half Subtractor, but adds a third input:{" "}
              <span style={{ color: "#fbbf24" }}>Borrow-In (Bin)</span> from the
              previous bit position. This lets us chain multiple Full
              Subtractors together for multi-bit numbers!
              <br />
              <span style={{ color: "#64748b", fontSize: "0.8rem" }}>
                🔗 4 Full Subtractors chained = 4-bit subtractor (can handle
                0–15). 8 = 8-bit (0–255), and so on.
              </span>
            </p>
            <div
              style={{
                background: "rgba(15,23,42,0.4)",
                borderRadius: "10px",
                padding: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              <FullSubtractorDiagram />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.5rem",
              }}
            >
              <div style={S.formulaBox("#4ade80")}>
                <div
                  style={{
                    color: "#4ade80",
                    fontWeight: 700,
                    marginBottom: "0.2rem",
                  }}
                >
                  Difference (D)
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.82rem",
                    color: "#e2e8f0",
                  }}
                >
                  D = A ⊕ B ⊕ Bin
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748b",
                    marginTop: "0.2rem",
                  }}
                >
                  XOR all three inputs
                </div>
              </div>
              <div style={S.formulaBox("#f87171")}>
                <div
                  style={{
                    color: "#f87171",
                    fontWeight: 700,
                    marginBottom: "0.2rem",
                  }}
                >
                  Borrow-Out (Bout)
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                    color: "#e2e8f0",
                    lineHeight: 1.5,
                  }}
                >
                  (A̅·B) OR (Bin · (A⊙B))
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748b",
                    marginTop: "0.2rem",
                  }}
                >
                  Combines two AND gates + one OR gate
                </div>
              </div>
            </div>

            {/* How chaining works */}
            <div style={{ ...S.note("#8b5cf6"), marginTop: "0.6rem" }}>
              <strong>🔗 How chaining works (4-bit example):</strong>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.8rem",
                  marginTop: "0.4rem",
                  lineHeight: 2,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "4px",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  {["Bit 3 (MSB)", "Bit 2", "Bit 1", "Bit 0 (LSB)"].map(
                    (label, i) => (
                      <React.Fragment key={i}>
                        <div
                          style={{
                            background: "rgba(139,92,246,0.2)",
                            border: "1px solid #8b5cf6",
                            borderRadius: "6px",
                            padding: "4px 8px",
                            fontSize: "0.72rem",
                            color: "#c4b5fd",
                            textAlign: "center",
                          }}
                        >
                          <div style={{ fontWeight: 700 }}>
                            {i === 3 ? "Half" : "Full"}
                          </div>
                          <div style={{ color: "#94a3b8" }}>{label}</div>
                          {i > 0 && (
                            <div
                              style={{ color: "#fbbf24", fontSize: "0.65rem" }}
                            >
                              Bin from left
                            </div>
                          )}
                        </div>
                        {i < 3 && <span style={{ color: "#475569" }}>←</span>}
                      </React.Fragment>
                    ),
                  )}
                </div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "#64748b",
                    marginTop: "0.4rem",
                  }}
                >
                  The Borrow-Out of each stage feeds into the Borrow-In of the
                  next stage to the left.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ CLICKABLE BIT INPUTS ═════════════════════════════════ */}
      <AFHDLDivider />
      <div style={S.sectionTitle}>🎛️ Try It Yourself — Enter Your Numbers</div>
      <p style={S.body}>
        Type a binary number in the box below, or{" "}
        <strong>click any bit to flip it</strong> between 0 and 1. The result
        updates instantly!
      </p>
      <div style={{ ...S.note("#60a5fa"), marginBottom: "0.5rem" }}>
        🔑 <strong>Remember:</strong> Only 0 and 1 are valid binary digits. Each
        position is called a{" "}
        <Tooltip tip="A single binary digit — either 0 or 1. Short for 'binary digit'">
          bit
        </Tooltip>
        . The rightmost bit is the{" "}
        <Tooltip tip="Least Significant Bit — the bit with the smallest value (represents 1)">
          LSB
        </Tooltip>{" "}
        and the leftmost is the{" "}
        <Tooltip tip="Most Significant Bit — the bit with the largest value">
          MSB
        </Tooltip>
        .
      </div>

      <div style={{ display: "grid", gap: "0.7rem", margin: "0.5rem 0" }}>
        {[
          {
            label: "A — the number you subtract FROM",
            padded: paddedA,
            raw: a,
            setRaw: setA,
            color: "#60a5fa",
          },
          {
            label: "B — the number to subtract",
            padded: paddedB,
            raw: b,
            setRaw: setB,
            color: "#f87171",
          },
        ].map(({ label, padded, raw, setRaw, color }) => (
          <div key={label}>
            <div
              style={{
                fontSize: "0.82rem",
                color: "#94a3b8",
                marginBottom: "0.3rem",
              }}
            >
              {label}: &nbsp;
              <strong style={{ color }}>{padded}</strong>
              <span style={{ color: "#475569" }}>
                {" "}
                = {parseInt(padded, 2)}₁₀ (decimal {parseInt(padded, 2)})
              </span>
            </div>
            <div
              style={{
                display: "flex",
                gap: "4px",
                flexWrap: "wrap",
                marginBottom: "0.3rem",
              }}
            >
              {padded.split("").map((bit, i) => (
                <button
                  key={i}
                  onClick={() => setRaw(toggleBit(padded, i))}
                  style={S.bitBtn(bit, color)}
                  title={`Click to flip this bit (currently ${bit})`}
                >
                  {bit}
                </button>
              ))}
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                color: "#475569",
                marginBottom: "0.3rem",
                fontFamily: "monospace",
              }}
            >
              {padded.split("").map((_, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    width: "40px",
                    textAlign: "center",
                  }}
                >
                  2^{padded.length - 1 - i}={Math.pow(2, padded.length - 1 - i)}
                </span>
              ))}
            </div>
            <input
              className="tool-input"
              value={raw}
              onChange={(e) => setRaw(cleanBin(e.target.value) || "0")}
              placeholder={`Type binary digits (0s and 1s only)`}
            />
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.4rem",
          flexWrap: "wrap",
          margin: "0.4rem 0",
        }}
      >
        <span
          style={{ fontSize: "0.78rem", color: "#64748b", alignSelf: "center" }}
        >
          Quick examples:
        </span>
        {examples.map((ex) => (
          <button
            key={ex.label}
            className="kmap-btn kmap-btn-secondary"
            onClick={() => {
              setA(ex.a);
              setB(ex.b);
              setAnimStep(-1);
              setIsAnimating(false);
            }}
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* ══ LIVE RESULT ══════════════════════════════════════════ */}
      <div
        style={{
          ...S.resultBanner,
          borderColor: isNeg ? "rgba(248,113,113,0.4)" : "rgba(74,222,128,0.4)",
          background: isNeg
            ? "rgba(248,113,113,0.07)"
            : "rgba(74,222,128,0.07)",
        }}
      >
        <div
          style={{
            fontSize: "0.72rem",
            color: "#64748b",
            marginBottom: "0.3rem",
            letterSpacing: "0.05em",
          }}
        >
          ⚡ LIVE RESULT
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "0.35rem",
            fontSize: "1rem",
          }}
        >
          <strong style={{ color: "#60a5fa" }}>{paddedA}</strong>
          <span style={{ color: "#475569" }}>₂ ({aDecimal}₁₀)</span>
          <span style={{ color: "#94a3b8", fontSize: "1.2rem" }}>−</span>
          <strong style={{ color: "#f87171" }}>{paddedB}</strong>
          <span style={{ color: "#475569" }}>₂ ({bDecimal}₁₀)</span>
          <span style={{ color: "#475569" }}>=</span>
          <strong
            style={{ color: isNeg ? "#f87171" : "#4ade80", fontSize: "1.2rem" }}
          >
            {trueResult}₁₀
          </strong>
          <span style={{ color: "#475569" }}>=</span>
          <strong style={{ color: isNeg ? "#f87171" : "#4ade80" }}>
            {result.diff}₂
          </strong>
          {isNeg && (
            <span
              style={{
                background: "#f8717122",
                border: "1px solid #f87171",
                borderRadius: "4px",
                padding: "1px 7px",
                fontSize: "0.75rem",
                color: "#f87171",
              }}
            >
              ⚠ A &lt; B → result is negative (borrow out = 1)
            </span>
          )}
        </div>
        <div
          style={{
            marginTop: "0.4rem",
            display: "flex",
            gap: "1rem",
            fontSize: "0.82rem",
            color: "#94a3b8",
          }}
        >
          <span>
            Difference ={" "}
            <strong style={{ color: "#4ade80" }}>{result.diff}</strong>
          </span>
          <span>
            Borrow Out ={" "}
            <strong
              style={{
                color:
                  result.borrow === "1" || result.borrow === 1
                    ? "#f87171"
                    : "#475569",
              }}
            >
              {result.borrow}
            </strong>
          </span>
        </div>
      </div>

      {/* ══ TABS: Borrow Method vs Two's Complement ═════════════ */}
      <div style={{ display: "flex", gap: "4px", marginTop: "1.5rem" }}>
        {[
          { id: "borrow", label: "🔴 Borrow Method" },
          { id: "twos", label: "🟣 Two's Complement" },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={S.tabBtn(
              activeTab === id,
              id === "borrow" ? "#ef4444" : "#8b5cf6",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={S.tabPanel}>
        {activeTab === "borrow" && (
          <>
            <div style={S.sectionTitle}>🎬 Animated Borrow Flow</div>
            <p style={S.body}>
              Watch how borrows travel from <strong>right to left</strong>,
              column by column. This mimics how you'd do it on paper — start
              from the rightmost bit and work left.
            </p>
            <div style={{ ...S.note("#ef4444"), marginBottom: "0.5rem" }}>
              <strong>📌 How to read the columns below:</strong>
              <br />
              Each column shows one bit position.{" "}
              <span style={{ color: "#60a5fa" }}>Blue = A bit</span>,{" "}
              <span style={{ color: "#f87171" }}>Red = B bit</span>,{" "}
              <span style={{ color: "#4ade80" }}>Green = result bit</span>.{" "}
              <strong>B↓</strong> = borrow coming IN, <strong>B→</strong> =
              borrow going OUT to next column. Click any column to see a
              detailed explanation!
            </div>

            <button
              className="kmap-btn"
              onClick={startAnim}
              disabled={isAnimating}
              style={{ margin: "0.3rem 0 0.6rem" }}
            >
              {isAnimating
                ? "⏳ Animating…"
                : "▶ Play Animation (right to left)"}
            </button>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "5px",
                flexWrap: "wrap",
              }}
            >
              {trace.map((row, i) => {
                const revealed = animStep >= i || animStep === -1;
                const isActive = animStep === i;
                return (
                  <div
                    key={row.pos}
                    onClick={() =>
                      setHighlightedRow(highlightedRow === i ? null : i)
                    }
                    style={{
                      background: isActive
                        ? "rgba(239,68,68,0.25)"
                        : highlightedRow === i
                          ? "rgba(99,102,241,0.2)"
                          : "rgba(30,41,59,0.65)",
                      border: `1px solid ${isActive ? "#ef4444" : highlightedRow === i ? "#6366f1" : "rgba(148,163,184,0.18)"}`,
                      borderRadius: "8px",
                      padding: "0.45rem 0.5rem",
                      minWidth: "52px",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      opacity: isAnimating && !revealed ? 0.2 : 1,
                    }}
                  >
                    <div style={{ fontSize: "0.6rem", color: "#475569" }}>
                      bit {row.pos}
                    </div>
                    <div style={{ color: "#60a5fa", fontWeight: 700 }}>
                      {row.ai}
                    </div>
                    <div style={{ color: "#f87171", fontWeight: 700 }}>
                      {row.bi}
                    </div>
                    <div
                      style={{
                        borderTop: "1px solid rgba(148,163,184,0.15)",
                        marginTop: "2px",
                        paddingTop: "2px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.62rem",
                          color: row.borrow ? "#f87171" : "#475569",
                        }}
                      >
                        B↓{row.borrow}
                      </div>
                      <div
                        style={{
                          color: "#4ade80",
                          fontWeight: 800,
                          fontSize: "0.95rem",
                        }}
                      >
                        {row.diff}
                      </div>
                      <div
                        style={{
                          fontSize: "0.62rem",
                          color: row.nextBorrow ? "#f87171" : "#475569",
                        }}
                      >
                        B→{row.nextBorrow}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div
                style={{
                  background: finalBorrow
                    ? "rgba(248,113,113,0.15)"
                    : "rgba(30,41,59,0.4)",
                  border: `1px solid ${finalBorrow ? "#f87171" : "rgba(148,163,184,0.12)"}`,
                  borderRadius: "8px",
                  padding: "0.45rem 0.5rem",
                  minWidth: "52px",
                  textAlign: "center",
                  opacity: isAnimating && animStep < trace.length ? 0.2 : 1,
                  transition: "opacity 0.3s",
                }}
              >
                <div style={{ fontSize: "0.6rem", color: "#475569" }}>
                  borrow
                </div>
                <div
                  style={{
                    fontWeight: 800,
                    color: finalBorrow ? "#f87171" : "#475569",
                  }}
                >
                  {finalBorrow}
                </div>
              </div>
            </div>

            <p
              style={{
                fontSize: "0.75rem",
                color: "#475569",
                marginTop: "0.3rem",
              }}
            >
              👆 Click any column for a plain-English explanation of that bit's
              calculation.
            </p>

            {/* Detailed bit explanation */}
            {highlightedRow !== null && trace[highlightedRow] && (
              <div style={{ ...S.note("#10b981"), margin: "0.4rem 0" }}>
                <strong>
                  📝 Bit {trace[highlightedRow].pos} — step by step:
                </strong>
                <br />
                <br />
                <strong>Inputs:</strong> A[{trace[highlightedRow].pos}] ={" "}
                <span style={{ color: "#60a5fa" }}>
                  {trace[highlightedRow].ai}
                </span>
                , B[{trace[highlightedRow].pos}] ={" "}
                <span style={{ color: "#f87171" }}>
                  {trace[highlightedRow].bi}
                </span>
                , Borrow-In ={" "}
                <span
                  style={{
                    color: trace[highlightedRow].borrow ? "#f87171" : "#94a3b8",
                  }}
                >
                  {trace[highlightedRow].borrow}
                </span>
                <br />
                <br />
                <strong>Calculation:</strong> {trace[highlightedRow].ai} −{" "}
                {trace[highlightedRow].bi} − {trace[highlightedRow].borrow} ={" "}
                {trace[highlightedRow].ai -
                  trace[highlightedRow].bi -
                  trace[highlightedRow].borrow}
                {trace[highlightedRow].nextBorrow ? (
                  <span style={{ color: "#f87171" }}>
                    {" "}
                    (negative! so we borrow — add 2 → diff ={" "}
                    <strong>{trace[highlightedRow].diff}</strong>, and send
                    borrow to next column)
                  </span>
                ) : (
                  <span style={{ color: "#4ade80" }}>
                    {" "}
                    → diff = <strong>{trace[highlightedRow].diff}</strong> (no
                    borrow needed)
                  </span>
                )}
                <br />
                <br />
                <strong>Borrow-Out:</strong>{" "}
                <span
                  style={{
                    color: trace[highlightedRow].nextBorrow
                      ? "#f87171"
                      : "#4ade80",
                  }}
                >
                  {trace[highlightedRow].nextBorrow}
                </span>
                {trace[highlightedRow].nextBorrow
                  ? " ← sent to the next column!"
                  : " ← no borrow needed"}
              </div>
            )}
          </>
        )}

        {activeTab === "twos" && (
          <>
            <div style={S.sectionTitle}>🔮 Two's Complement — Step by Step</div>
            <p style={S.body}>
              This is how <strong>every real CPU</strong> does subtraction.
              Instead of borrowing, we convert B to its negative form, then just
              add! Click the numbered steps or use the buttons to walk through.
            </p>

            <div
              style={{
                display: "flex",
                gap: "4px",
                flexWrap: "wrap",
                margin: "0.5rem 0",
              }}
            >
              {TWOS_STEPS.map((step, i) => (
                <button
                  key={i}
                  onClick={() => setTwosStep(i)}
                  style={{
                    padding: "0.3rem 0.6rem",
                    borderRadius: "5px",
                    border: `1px solid ${twosStep === i ? step.color : "rgba(148,163,184,0.2)"}`,
                    background:
                      twosStep === i ? `${step.color}20` : "rgba(30,41,59,0.5)",
                    color: twosStep === i ? step.color : "#64748b",
                    fontSize: "0.75rem",
                    fontWeight: twosStep === i ? 700 : 400,
                    cursor: "pointer",
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <div
              style={{
                ...S.card,
                border: `1px solid ${TWOS_STEPS[twosStep].color}40`,
              }}
            >
              <div
                style={{
                  color: TWOS_STEPS[twosStep].color,
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                }}
              >
                {TWOS_STEPS[twosStep].label}
              </div>
              <div
                style={{
                  ...S.formula,
                  borderColor: `${TWOS_STEPS[twosStep].color}30`,
                }}
              >
                {TWOS_STEPS[twosStep].detail}
              </div>
              <div style={{ ...S.note("#6366f1"), marginTop: "0.4rem" }}>
                💡 {TWOS_STEPS[twosStep].hint}
              </div>
              {twosStep === 4 && (
                <div style={{ ...S.note("#4ade80"), marginTop: "0.4rem" }}>
                  ✅ Final answer: {aDecimal} − {bDecimal} ={" "}
                  <strong>{trueResult}</strong>
                  {isNeg
                    ? " (negative — the leading bit is 1, indicating a negative number in two's complement)"
                    : " ✓"}
                </div>
              )}
              <div
                style={{ display: "flex", gap: "0.5rem", marginTop: "0.6rem" }}
              >
                <button
                  className="kmap-btn kmap-btn-secondary"
                  disabled={twosStep === 0}
                  onClick={() => setTwosStep((s) => s - 1)}
                >
                  ← Back
                </button>
                <button
                  className="kmap-btn"
                  disabled={twosStep === TWOS_STEPS.length - 1}
                  onClick={() => setTwosStep((s) => s + 1)}
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div
              style={{
                marginTop: "0.5rem",
                background: "rgba(148,163,184,0.1)",
                borderRadius: "4px",
                height: "4px",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${((twosStep + 1) / TWOS_STEPS.length) * 100}%`,
                  background: TWOS_STEPS[twosStep].color,
                  borderRadius: "4px",
                  transition: "width 0.3s",
                }}
              />
            </div>
            <p
              style={{
                fontSize: "0.72rem",
                color: "#475569",
                marginTop: "0.2rem",
              }}
            >
              Step {twosStep + 1} of {TWOS_STEPS.length}
            </p>
          </>
        )}
      </div>

      {/* ══ TRUTH TABLES ═════════════════════════════════════════ */}
      <AFHDLDivider />
      <button
        className="kmap-btn kmap-btn-secondary"
        style={{ width: "100%", margin: "0.3rem 0" }}
        onClick={() => setShowTruthTable((v) => !v)}
      >
        {showTruthTable ? "▲ Hide" : "▼ Show"} 📋 Truth Tables (all possible
        inputs and outputs)
      </button>
      {showTruthTable && (
        <div>
          <div style={{ ...S.note("#6366f1"), marginBottom: "0.5rem" }}>
            <strong>📌 What is a truth table?</strong> It lists every possible
            combination of inputs (0s and 1s) and shows what the output will be.
            It's like a complete recipe book for the circuit.
          </div>

          <div style={S.card}>
            <div
              style={{
                fontWeight: 700,
                color: "#ef4444",
                marginBottom: "0.3rem",
              }}
            >
              Half Subtractor Truth Table
            </div>
            <p
              style={{ ...S.body, marginBottom: "0.4rem", fontSize: "0.8rem" }}
            >
              2 inputs (A, B) → 4 rows (2² = 4 combinations). The highlighted
              row matches your current LSB inputs.
            </p>
            <div style={{ display: "grid", gap: "2px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  background: "rgba(99,102,241,0.2)",
                  borderRadius: "4px",
                  padding: "0.3rem 0.5rem",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  color: "#a5b4fc",
                  textAlign: "center",
                }}
              >
                <span>A</span>
                <span>B</span>
                <span style={{ color: "#4ade80" }}>Diff (D)</span>
                <span style={{ color: "#f87171" }}>Borrow</span>
              </div>
              {[
                [0, 0, 0, 0],
                [0, 1, 1, 1],
                [1, 0, 1, 0],
                [1, 1, 0, 0],
              ].map(([ai, bi, d, bo]) => {
                const match =
                  ai === parseInt(paddedA.slice(-1)) &&
                  bi === parseInt(paddedB.slice(-1));
                return (
                  <div
                    key={`${ai}${bi}`}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr 1fr",
                      background: match
                        ? "rgba(99,102,241,0.25)"
                        : "rgba(30,41,59,0.5)",
                      border: match
                        ? "1px solid #6366f1"
                        : "1px solid transparent",
                      borderRadius: "3px",
                      padding: "0.28rem 0.5rem",
                      fontSize: "0.85rem",
                      textAlign: "center",
                      color: "#e2e8f0",
                    }}
                  >
                    <span style={{ color: "#60a5fa" }}>{ai}</span>
                    <span style={{ color: "#f87171" }}>{bi}</span>
                    <span style={{ color: "#4ade80", fontWeight: 700 }}>
                      {d}
                    </span>
                    <span
                      style={{
                        color: bo ? "#f87171" : "#334155",
                        fontWeight: 700,
                      }}
                    >
                      {bo}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Quick explanation for each row */}
            <div style={{ marginTop: "0.5rem", display: "grid", gap: "2px" }}>
              {[
                { row: "A=0, B=0", explain: "0 − 0 = 0, no borrow" },
                {
                  row: "A=0, B=1",
                  explain: "0 − 1 = needs borrow! 10 − 1 = 1, borrow=1",
                },
                { row: "A=1, B=0", explain: "1 − 0 = 1, no borrow" },
                { row: "A=1, B=1", explain: "1 − 1 = 0, no borrow" },
              ].map((r) => (
                <div
                  key={r.row}
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748b",
                    fontFamily: "monospace",
                    padding: "2px 4px",
                  }}
                >
                  {r.row}: {r.explain}
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...S.card, marginTop: "0.5rem" }}>
            <div
              style={{
                fontWeight: 700,
                color: "#8b5cf6",
                marginBottom: "0.3rem",
              }}
            >
              Full Subtractor Truth Table
            </div>
            <p
              style={{ ...S.body, marginBottom: "0.4rem", fontSize: "0.8rem" }}
            >
              3 inputs (A, B, Borrow-In) → 8 rows (2³ = 8 combinations).
            </p>
            <div style={{ display: "grid", gap: "2px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5,1fr)",
                  background: "rgba(99,102,241,0.2)",
                  borderRadius: "4px",
                  padding: "0.3rem 0.5rem",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  color: "#a5b4fc",
                  textAlign: "center",
                }}
              >
                <span>A</span>
                <span>B</span>
                <span style={{ color: "#fbbf24" }}>Bin</span>
                <span style={{ color: "#4ade80" }}>Diff</span>
                <span style={{ color: "#f87171" }}>Bout</span>
              </div>
              {[
                [0, 0, 0, 0, 0],
                [0, 0, 1, 1, 1],
                [0, 1, 0, 1, 1],
                [0, 1, 1, 0, 1],
                [1, 0, 0, 1, 0],
                [1, 0, 1, 0, 0],
                [1, 1, 0, 0, 0],
                [1, 1, 1, 1, 1],
              ].map(([ai, bi, bin, d, bo]) => (
                <div
                  key={`${ai}${bi}${bin}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5,1fr)",
                    background: "rgba(30,41,59,0.5)",
                    borderRadius: "3px",
                    padding: "0.28rem 0.5rem",
                    fontSize: "0.82rem",
                    textAlign: "center",
                    color: "#e2e8f0",
                  }}
                >
                  <span style={{ color: "#60a5fa" }}>{ai}</span>
                  <span style={{ color: "#f87171" }}>{bi}</span>
                  <span style={{ color: "#fbbf24" }}>{bin}</span>
                  <span style={{ color: "#4ade80", fontWeight: 700 }}>{d}</span>
                  <span
                    style={{
                      color: bo ? "#f87171" : "#334155",
                      fontWeight: 700,
                    }}
                  >
                    {bo}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ HDL / VERILOG ════════════════════════════════════════ */}
      <button
        className="kmap-btn kmap-btn-secondary"
        style={{ width: "100%", margin: "0.3rem 0" }}
        onClick={() => setShowHDL((v) => !v)}
      >
        {showHDL ? "▲ Hide" : "▼ Show"} 💻 Hardware Code (Verilog)
      </button>
      {showHDL && (
        <div style={S.card}>
          <div style={{ ...S.note("#6366f1"), marginBottom: "0.6rem" }}>
            <strong>🤔 What is Verilog?</strong> It's a language used to{" "}
            <em>describe hardware circuits</em>. Instead of drawing gates,
            engineers write code to define how the circuit should behave, and
            tools automatically generate the actual chip layout.
          </div>
          <div style={S.codeBlock}>
            <AFHDLCopyButton
              text={`// Verilog — 4-bit Subtractor using 2's complement\n// This is how the circuit is actually implemented in hardware!\nmodule subtractor_4bit (\n  input  [3:0] A, B,  // 4-bit inputs\n  output [3:0] Diff,  // 4-bit difference result\n  output       Borrow // 1 if A < B (result is negative)\n);\n  wire [4:0] result;  // 5-bit wire to catch overflow\n\n  // A + (~B) + 1  is the SAME as  A - B\n  // ~B flips all bits (1's complement)\n  // Adding 1 converts it to 2's complement\n  assign result = A + (~B) + 1'b1;\n\n  assign Diff   = result[3:0];  // Lower 4 bits = the answer\n  assign Borrow = ~result[4];   // If no carry-out, we had a borrow\nendmodule`}
            />
            <pre
              style={{
                margin: 0,
                color: "#e2e8f0",
                fontSize: "0.75rem",
                lineHeight: 1.65,
              }}
            >
              {`// Verilog — 4-bit Subtractor using 2's complement
// This is how the circuit is actually implemented in hardware!
module subtractor_4bit (
  input  [3:0] A, B,  // 4-bit inputs
  output [3:0] Diff,  // 4-bit difference result
  output       Borrow // 1 if A < B (result is negative)
);
  wire [4:0] result;  // 5-bit wire to catch overflow

  // A + (~B) + 1  is the SAME as  A - B
  // ~B flips all bits (1's complement)
  // Adding 1 converts it to 2's complement
  assign result = A + (~B) + 1'b1;

  assign Diff   = result[3:0];  // Lower 4 bits = the answer
  assign Borrow = ~result[4];   // If no carry-out, we had a borrow
endmodule`}
            </pre>
          </div>
          <div style={{ ...S.note("#10b981"), marginTop: "0.5rem" }}>
            <strong>✨ The beautiful insight:</strong> Notice we only use an{" "}
            <em>adder</em> here! No subtraction circuit exists in hardware —{" "}
            <code
              style={{
                background: "rgba(99,102,241,0.2)",
                padding: "1px 4px",
                borderRadius: "3px",
              }}
            >
              ~B
            </code>{" "}
            flips all bits, then adding 1 gives the 2's complement.{" "}
            <strong>Subtraction IS addition with a transformed B.</strong>
          </div>
        </div>
      )}

      {/* ══ QUIZ ═════════════════════════════════════════════════ */}
      <AFHDLDivider />
      <div style={S.sectionTitle}>🧠 Test Your Understanding — Quick Quiz</div>
      <p style={S.body}>
        Try these questions to see how well you've understood the concepts!
      </p>

      {!quizMode ? (
        <button
          className="kmap-btn"
          onClick={() => {
            resetQuiz();
            setQuizMode(true);
          }}
        >
          Start Quiz ({QUIZ.length} questions)
        </button>
      ) : quizDone ? (
        <div style={S.card}>
          <div
            style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              color: "#4ade80",
              marginBottom: "0.3rem",
            }}
          >
            {quizScore >= 5
              ? "🎉 Excellent! You're a binary pro!"
              : quizScore >= 3
                ? "👍 Good work! Keep practicing."
                : "📚 Keep studying — you'll get it!"}
          </div>
          <p style={{ color: "#cbd5e1" }}>
            Score: <strong style={{ color: "#4ade80" }}>{quizScore}</strong> /{" "}
            {QUIZ.length}
          </p>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
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
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
              Q {quizIdx + 1}/{QUIZ.length}
            </span>
            <span style={{ color: "#4ade80", fontSize: "0.8rem" }}>
              Score: {quizScore}
            </span>
          </div>
          <div
            style={{
              height: "4px",
              background: "rgba(148,163,184,0.15)",
              borderRadius: "2px",
              marginBottom: "0.8rem",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(quizIdx / QUIZ.length) * 100}%`,
                background: "#ef4444",
                borderRadius: "2px",
                transition: "width 0.3s",
              }}
            />
          </div>
          <div
            style={{
              color: "#e2e8f0",
              fontWeight: 600,
              fontSize: "0.9rem",
              marginBottom: "0.7rem",
            }}
          >
            {QUIZ[quizIdx].q}
          </div>
          <div style={{ display: "grid", gap: "0.4rem" }}>
            {QUIZ[quizIdx].opts.map((opt, i) => {
              const isCorrect = i === QUIZ[quizIdx].ans;
              const selected = quizAnswer === i;
              let bg = "rgba(30,41,59,0.7)",
                border = "rgba(148,163,184,0.2)";
              if (quizAnswer !== null) {
                if (isCorrect) {
                  bg = "rgba(74,222,128,0.15)";
                  border = "#4ade80";
                } else if (selected) {
                  bg = "rgba(248,113,113,0.15)";
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
                    borderRadius: "6px",
                    padding: "0.5rem 0.8rem",
                    color: "#e2e8f0",
                    textAlign: "left",
                    cursor: quizAnswer !== null ? "default" : "pointer",
                    fontSize: "0.87rem",
                    transition: "all 0.2s",
                  }}
                >
                  {quizAnswer !== null &&
                    (isCorrect ? "✅ " : selected ? "❌ " : "")}
                  {opt}
                </button>
              );
            })}
          </div>
          {/* Show explanation after answering */}
          {quizAnswer !== null && (
            <div
              style={{
                ...S.note(
                  quizAnswer === QUIZ[quizIdx].ans ? "#4ade80" : "#f87171",
                ),
                marginTop: "0.5rem",
              }}
            >
              <strong>
                {quizAnswer === QUIZ[quizIdx].ans
                  ? "✅ Correct!"
                  : "❌ Not quite."}
              </strong>{" "}
              {QUIZ[quizIdx].explain}
            </div>
          )}
          {quizAnswer !== null && (
            <button
              className="kmap-btn"
              style={{ marginTop: "0.7rem", width: "100%" }}
              onClick={nextQ}
            >
              {quizIdx + 1 >= QUIZ.length ? "See Results →" : "Next Question →"}
            </button>
          )}
        </div>
      )}
    </AFHDLLayout>
  );
};

export default BinarySubtractor;
