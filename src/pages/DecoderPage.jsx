import React, { useState, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════════
   DECODER PAGE — Upgraded with:
   • Animated Minterm Explorer (click any output row to highlight)
   • Live 7-Segment Display with BCD input
   • Step-by-step "How to write D equation" builder
   • Enable pin visual explanation
   • Decoder as Function Generator interactive demo
   • Expanded quiz with hints & streaks
   • Floating tips panel
   • Cascading decoder concept explainer
   ═══════════════════════════════════════════════════════════════════ */

// ─── Decoder Logic ─────────────────────────────────────────────────────────────
const DECODER_TYPES = {
  "1to2": {
    label: "1-to-2 Decoder",
    codeInputs: ["A"],
    enableInput: true,
    outputs: ["D0", "D1"],
    description: "1-bit input + Enable → 2 output lines",
    analogy: "Like a light switch that routes power to one of two lamps",
    decode: (code, en) => {
      if (!en) return { D0: 0, D1: 0, active: -1 };
      const i = code[0];
      return { D0: i === 0 ? 1 : 0, D1: i === 1 ? 1 : 0, active: i };
    },
    booleanEqs: [
      {
        out: "D0",
        eq: "D0 = E · A'",
        color: "#34d399",
        explanation:
          "D0 fires when Enable=1 AND A=0. Since D0 is address 0 (binary 0), we complement A to get A'=1 when A=0. Rule: complement any bit that is 0 in the target address.",
        trick:
          "Address 0 = '0' in binary → complement A to make it a 1 condition.",
      },
      {
        out: "D1",
        eq: "D1 = E · A",
        color: "#60a5fa",
        explanation:
          "D1 fires when Enable=1 AND A=1. Since address 1 has bit A=1, we use A directly (no complement). Rule: keep any bit that is 1 in the target address.",
        trick:
          "Address 1 = '1' in binary → use A directly, it's already 1 when we need it.",
      },
    ],
    truthRows: [
      ["0", "x", "0", "0"],
      ["1", "0", "1", "0"],
      ["1", "1", "0", "1"],
    ],
    truthHeaders: ["E", "A", "D0", "D1"],
    minterms: [
      { idx: 0, binary: "0", desc: "m0: A'" },
      { idx: 1, binary: "1", desc: "m1: A" },
    ],
  },
  "2to4": {
    label: "2-to-4 Decoder",
    codeInputs: ["A1", "A0"],
    enableInput: true,
    outputs: ["D0", "D1", "D2", "D3"],
    description: "2-bit binary code + Enable → 4 output lines",
    analogy:
      "Like a building directory that routes a visitor to one of 4 floors",
    decode: (code, en) => {
      if (!en) return { D0: 0, D1: 0, D2: 0, D3: 0, active: -1 };
      const i = (code[0] << 1) | code[1];
      return {
        D0: i === 0 ? 1 : 0,
        D1: i === 1 ? 1 : 0,
        D2: i === 2 ? 1 : 0,
        D3: i === 3 ? 1 : 0,
        active: i,
      };
    },
    booleanEqs: [
      {
        out: "D0",
        eq: "D0 = E · A1' · A0'",
        color: "#34d399",
        explanation:
          "Address 00 → both bits are 0 → complement both. D0 fires ONLY when A1=0 AND A0=0. The equation is the minterm m0.",
        trick: "Address 00: both 0s → both complemented. A1'·A0'",
      },
      {
        out: "D1",
        eq: "D1 = E · A1' · A0",
        color: "#60a5fa",
        explanation:
          "Address 01 → A1=0 (complement it), A0=1 (keep it). D1 fires when A1=0 AND A0=1. Minterm m1.",
        trick: "Address 01: first bit 0 → A1', second bit 1 → A0. A1'·A0",
      },
      {
        out: "D2",
        eq: "D2 = E · A1 · A0'",
        color: "#a78bfa",
        explanation:
          "Address 10 → A1=1 (keep it), A0=0 (complement it). D2 fires when A1=1 AND A0=0. Minterm m2.",
        trick: "Address 10: first bit 1 → A1, second bit 0 → A0'. A1·A0'",
      },
      {
        out: "D3",
        eq: "D3 = E · A1 · A0",
        color: "#fbbf24",
        explanation:
          "Address 11 → both bits are 1 → keep both direct. D3 fires when A1=1 AND A0=1. Minterm m3.",
        trick:
          "Address 11: both 1s → both direct. No complements needed! A1·A0",
      },
    ],
    truthRows: [
      ["0", "x", "x", "0", "0", "0", "0"],
      ["1", "0", "0", "1", "0", "0", "0"],
      ["1", "0", "1", "0", "1", "0", "0"],
      ["1", "1", "0", "0", "0", "1", "0"],
      ["1", "1", "1", "0", "0", "0", "1"],
    ],
    truthHeaders: ["E", "A1", "A0", "D0", "D1", "D2", "D3"],
    minterms: [
      { idx: 0, binary: "00", desc: "m0: A1'A0'" },
      { idx: 1, binary: "01", desc: "m1: A1'A0" },
      { idx: 2, binary: "10", desc: "m2: A1A0'" },
      { idx: 3, binary: "11", desc: "m3: A1A0" },
    ],
  },
  "3to8": {
    label: "3-to-8 Decoder",
    codeInputs: ["A2", "A1", "A0"],
    enableInput: true,
    outputs: ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7"],
    description: "3-bit binary code + Enable → 8 output lines",
    analogy:
      "Like a memory chip select: each output enables exactly one memory chip",
    decode: (code, en) => {
      if (!en) {
        const o = {};
        for (let i = 0; i < 8; i++) o[`D${i}`] = 0;
        o.active = -1;
        return o;
      }
      const idx = (code[0] << 2) | (code[1] << 1) | code[2];
      const out = {};
      for (let i = 0; i < 8; i++) out[`D${i}`] = i === idx ? 1 : 0;
      out.active = idx;
      return out;
    },
    booleanEqs: [
      {
        out: "D0",
        eq: "D0 = E·A2'·A1'·A0'",
        color: "#34d399",
        explanation:
          "000 → all 0 → all complemented. Minterm m0. Three inputs, all complemented.",
        trick: "All zeros → all complemented. The easiest to remember!",
      },
      {
        out: "D1",
        eq: "D1 = E·A2'·A1'·A0",
        color: "#4ade80",
        explanation: "001 → A0=1 direct, A2 & A1 complemented. Minterm m1.",
        trick: "Only the last bit is 1 → only A0 is direct.",
      },
      {
        out: "D2",
        eq: "D2 = E·A2'·A1·A0'",
        color: "#60a5fa",
        explanation: "010 → A1=1 direct, A2 & A0 complemented. Minterm m2.",
        trick: "Middle bit is 1 → A1 is direct, others complemented.",
      },
      {
        out: "D3",
        eq: "D3 = E·A2'·A1·A0",
        color: "#93c5fd",
        explanation: "011 → A1 & A0 direct, only A2 complemented. Minterm m3.",
        trick: "Two last bits are 1 → A1 and A0 direct, A2' still complements.",
      },
      {
        out: "D4",
        eq: "D4 = E·A2·A1'·A0'",
        color: "#fbbf24",
        explanation: "100 → A2=1 direct, A1 & A0 complemented. Minterm m4.",
        trick: "First bit is 1 → A2 direct, others complemented.",
      },
      {
        out: "D5",
        eq: "D5 = E·A2·A1'·A0",
        color: "#f97316",
        explanation: "101 → A2 & A0 direct, A1 complemented. Minterm m5.",
        trick: "Bits 2 and 0 are 1 → A2 and A0 direct.",
      },
      {
        out: "D6",
        eq: "D6 = E·A2·A1·A0'",
        color: "#a78bfa",
        explanation: "110 → A2 & A1 direct, A0 complemented. Minterm m6.",
        trick: "First two bits are 1 → A2·A1 direct, A0' complement.",
      },
      {
        out: "D7",
        eq: "D7 = E·A2·A1·A0",
        color: "#f472b6",
        explanation:
          "111 → all 1 → all direct. No complements at all! Minterm m7.",
        trick: "All ones → no complements. The other easy one!",
      },
    ],
    truthRows: Array.from({ length: 8 }, (_, i) => {
      const a2 = (i >> 2) & 1,
        a1 = (i >> 1) & 1,
        a0 = i & 1;
      const row = ["1", String(a2), String(a1), String(a0)];
      for (let j = 0; j < 8; j++) row.push(j === i ? "1" : "0");
      return row;
    }),
    truthHeaders: [
      "E",
      "A2",
      "A1",
      "A0",
      "D0",
      "D1",
      "D2",
      "D3",
      "D4",
      "D5",
      "D6",
      "D7",
    ],
    minterms: Array.from({ length: 8 }, (_, i) => ({
      idx: i,
      binary: i.toString(2).padStart(3, "0"),
      desc: `m${i}`,
    })),
  },
  BCD7seg: {
    label: "BCD-to-7-Segment",
    codeInputs: ["A", "B", "C", "D"],
    enableInput: false,
    outputs: ["a", "b", "c", "d", "e", "f", "g"],
    description: "4-bit BCD → 7 segment display signals",
    analogy:
      "Like translating a number to a specific set of lit-up bars on a display",
    decode: (code) => {
      const table = [
        [1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 0, 0, 0, 0],
        [1, 1, 0, 1, 1, 0, 1],
        [1, 1, 1, 1, 0, 0, 1],
        [0, 1, 1, 0, 0, 1, 1],
        [1, 0, 1, 1, 0, 1, 1],
        [1, 0, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 0, 1, 1],
      ];
      const idx = (code[0] << 3) | (code[1] << 2) | (code[2] << 1) | code[3];
      if (idx > 9)
        return { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, active: -1 };
      const s = table[idx];
      return {
        a: s[0],
        b: s[1],
        c: s[2],
        d: s[3],
        e: s[4],
        f: s[5],
        g: s[6],
        active: idx,
      };
    },
    booleanEqs: [
      {
        out: "a — top bar",
        eq: "a = A + C + B'D' + BD",
        color: "#f97316",
        explanation:
          "Segment a (top bar) is OFF only for digits 1 and 4. The complex OR expression covers all remaining 8 digits.",
        trick: "OFF for 1,4. All other digits need the top bar.",
      },
      {
        out: "b — top-right",
        eq: "b = B' + CD + C'D'",
        color: "#fbbf24",
        explanation:
          "Segment b (top-right) is OFF only for digits 5 and 6. Note how B' alone covers half the cases.",
        trick: "OFF for 5,6. B'=1 handles digits 0,1,2,3 at once.",
      },
      {
        out: "c — bottom-right",
        eq: "c = B + C' + D",
        color: "#34d399",
        explanation:
          "Segment c (bottom-right) is OFF ONLY for digit 2. Simplest 7-seg equation with just 3 terms!",
        trick: "OFF only for digit 2 — simplest equation in the whole decoder!",
      },
      {
        out: "d — bottom bar",
        eq: "d = A + B'C' + C'D' + BC'D + CD'",
        color: "#60a5fa",
        explanation:
          "Segment d (bottom bar) is the most complex — ON for 0,2,3,5,6,8. Four product terms needed.",
        trick: "d is the hardest. ON for many digits, needs 4 AND terms.",
      },
      {
        out: "e — bottom-left",
        eq: "e = B'D' + CD'",
        color: "#a78bfa",
        explanation:
          "Segment e (bottom-left) is ON only for 0,2,6,8. Just two product terms cover it.",
        trick: "D'=0 means the digit is even AND needs the left side.",
      },
      {
        out: "f — top-left",
        eq: "f = A + BC' + BD' + C'D'",
        color: "#f472b6",
        explanation:
          "Segment f (top-left) is ON for 0,4,5,6,7,8,9 — OFF only for 1,2,3.",
        trick: "ON for most digits. OFF for 1,2,3 — the 'plain' numbers.",
      },
      {
        out: "g — middle bar",
        eq: "g = A + BC' + BC + C'D",
        color: "#c084fc",
        explanation:
          "Segment g (middle bar) is OFF only for 0 and 1. ON for all other digits (2–9).",
        trick:
          "g is the middle bar. OFF only for 0 (no middle) and 1 (just sticks).",
      },
    ],
    truthRows: [
      ["0", "0", "0", "0", "1", "1", "1", "1", "1", "1", "0"],
      ["0", "0", "0", "1", "0", "1", "1", "0", "0", "0", "0"],
      ["0", "0", "1", "0", "1", "1", "0", "1", "1", "0", "1"],
      ["0", "0", "1", "1", "1", "1", "1", "1", "0", "0", "1"],
      ["0", "1", "0", "0", "0", "1", "1", "0", "0", "1", "1"],
      ["0", "1", "0", "1", "1", "0", "1", "1", "0", "1", "1"],
      ["0", "1", "1", "0", "1", "0", "1", "1", "1", "1", "1"],
      ["0", "1", "1", "1", "1", "1", "1", "0", "0", "0", "0"],
      ["1", "0", "0", "0", "1", "1", "1", "1", "1", "1", "1"],
      ["1", "0", "0", "1", "1", "1", "1", "1", "0", "1", "1"],
    ],
    truthHeaders: ["A", "B", "C", "D", "a", "b", "c", "d", "e", "f", "g"],
    minterms: [],
  },
};

// ─── Tips ──────────────────────────────────────────────────────────────────────
const TIPS = [
  {
    icon: "📐",
    title: "The Minterm Rule",
    text: "Each decoder output Dᵢ is exactly minterm mᵢ. Write the binary for i, then: bit=1 → use input directly, bit=0 → complement it. AND them all.",
  },
  {
    icon: "🔌",
    title: "Enable Pin is Power",
    text: "E=0 kills ALL outputs. E=1 lets them work. In memory systems, this is how chips are selected — only one chip has E=1 at a time.",
  },
  {
    icon: "🧩",
    title: "Decoder as Function Generator",
    text: "Any Boolean function can be built from a decoder! Just OR the outputs for rows where your function = 1. No AND gates needed!",
  },
  {
    icon: "📦",
    title: "Cascading Decoders",
    text: "A 2×4 decoder with cascading can become 4×16! Connect your high address bits to a 2×4 decoder, each output enables one of four 2×4 decoders.",
  },
  {
    icon: "🔢",
    title: "Count the Gates",
    text: "An n-to-2ⁿ decoder needs exactly 2ⁿ AND gates (one per output), n NOT gates (one per input), and 1 enable connection per AND gate.",
  },
  {
    icon: "⚡",
    title: "Output Is Exclusive",
    text: "Exactly ONE decoder output is HIGH at any time (when E=1). This is called 'one-hot encoding' — guaranteed mutual exclusion.",
  },
  {
    icon: "🏥",
    title: "Real World: Memory Chips",
    text: "A 20-bit CPU address uses bits [19:18] → 2-to-4 decoder → 4 chip-select lines. Each selects a different 256KB memory region.",
  },
  {
    icon: "🎯",
    title: "Exam Trick",
    text: "To find which output is active: convert address to decimal. D(decimal) is HIGH. Example: A1=1,A0=1 → 11₂ = 3 → D3 is HIGH.",
  },
];

// ─── Quiz ──────────────────────────────────────────────────────────────────────
const QUIZ = [
  {
    q: "2-to-4 decoder: A1=1, A0=0, E=1. Which output is HIGH?",
    opts: ["D0", "D1", "D2", "D3"],
    ans: 2,
    exp: "Binary 10 = decimal 2 → D2 HIGH. Just convert A1A0 from binary to decimal to find which D is active!",
    hint: "Convert the binary number A1A0 = 10 to decimal.",
  },
  {
    q: "3-to-8 decoder. Boolean equation for D5?",
    opts: ["E·A2'·A1·A0", "E·A2·A1'·A0", "E·A2·A1·A0'", "E·A2'·A1·A0'"],
    ans: 1,
    exp: "5 = 101₂ → A2=1 (direct), A1=0 (complement→A1'), A0=1 (direct). Match each bit: 1=direct, 0=complemented.",
    hint: "Write 5 in binary: 101. Then: bit=1 means direct, bit=0 means complemented.",
  },
  {
    q: "How many AND gates in a 3-to-8 decoder?",
    opts: ["3", "6", "8", "16"],
    ans: 2,
    exp: "2³ = 8 outputs → 8 AND gates. One AND gate per decoder output. Formula: always 2ⁿ AND gates.",
    hint: "Formula: 2^(number of input bits). Here n=3.",
  },
  {
    q: "Enable E=0. What happens to ALL outputs?",
    opts: [
      "All go HIGH",
      "Selected output HIGH",
      "All go LOW",
      "Output is undefined",
    ],
    ans: 2,
    exp: "E=0 disables the entire decoder chip. All outputs go LOW regardless of address inputs. E acts as a master chip-select or on/off switch.",
    hint: "E=0 means the chip is disabled. Think of it as cutting power.",
  },
  {
    q: "You want to implement F = A'B' + AB using a decoder. You use:",
    opts: [
      "8 AND gates",
      "A 2-to-4 decoder + OR gate",
      "Only NOT gates",
      "A 4-to-1 MUX",
    ],
    ans: 1,
    exp: "Decoder outputs ARE minterms! F = m0 + m3 (where inputs are 00 and 11). Just OR D0 and D3. No extra AND gates needed at all!",
    hint: "Which minterms (rows) make F=1? Those are rows 00 and 11.",
  },
  {
    q: "BCD input 1001 to 7-segment decoder. Which segment is OFF?",
    opts: ["a (top)", "b (top-right)", "e (bottom-left)", "g (middle)"],
    ans: 2,
    exp: "1001₂ = digit 9. Digit 9 shows a,b,c,d,f,g ON. Segment e (bottom-left) is OFF for 9.",
    hint: "1001₂ = 9 in decimal. Look up digit 9 in your memory — which bars does it NOT light?",
  },
];

// ─── 7-Segment Display SVG ─────────────────────────────────────────────────────
const SevenSeg = ({ segs, digit }) => {
  const on = "#00ff88",
    off = "rgba(0,255,136,0.06)";
  const s = (n) => (segs[n] ? on : off);
  const segNames = ["a", "b", "c", "d", "e", "f", "g"];
  const activeSegs = segNames.filter((k) => segs[k]);
  return (
    <div style={{ textAlign: "center" }}>
      <svg
        viewBox="0 0 70 120"
        width="90"
        height="130"
        style={{ filter: "drop-shadow(0 0 10px rgba(0,255,136,0.25))" }}
      >
        {/* a - top */}
        <rect x="10" y="4" width="50" height="9" rx="4" fill={s("a")} />
        {/* b - top-right */}
        <rect x="58" y="8" width="9" height="48" rx="4" fill={s("b")} />
        {/* c - bottom-right */}
        <rect x="58" y="62" width="9" height="48" rx="4" fill={s("c")} />
        {/* d - bottom */}
        <rect x="10" y="107" width="50" height="9" rx="4" fill={s("d")} />
        {/* e - bottom-left */}
        <rect x="3" y="62" width="9" height="48" rx="4" fill={s("e")} />
        {/* f - top-left */}
        <rect x="3" y="8" width="9" height="48" rx="4" fill={s("f")} />
        {/* g - middle */}
        <rect x="10" y="54" width="50" height="9" rx="4" fill={s("g")} />
      </svg>
      {digit >= 0 && (
        <div
          style={{
            color: "#00ff88",
            fontFamily: "monospace",
            fontWeight: "700",
            fontSize: "1.3rem",
            marginTop: "4px",
          }}
        >
          {digit}
        </div>
      )}
      <div
        style={{
          color: "#4b5563",
          fontFamily: "monospace",
          fontSize: "0.68rem",
          marginTop: "4px",
        }}
      >
        {activeSegs.length > 0 ? activeSegs.join("") : "—"}
      </div>
    </div>
  );
};

// ─── Minterm Visual Builder ────────────────────────────────────────────────────
const MintermBuilder = () => {
  const [numBits, setNumBits] = useState(2);
  const [selectedMinterm, setSelectedMinterm] = useState(0);
  const numOutputs = Math.pow(2, numBits);
  const inputs = Array.from(
    { length: numBits },
    (_, i) => `A${numBits - 1 - i}`,
  );
  const binary = selectedMinterm.toString(2).padStart(numBits, "0");

  const equation =
    "E · " +
    inputs
      .map((inp, i) => {
        const bit = (selectedMinterm >> (numBits - 1 - i)) & 1;
        return bit ? inp : inp + "'";
      })
      .join(" · ");

  return (
    <div
      style={{
        background: "rgba(8,14,30,0.9)",
        borderRadius: "14px",
        padding: "22px",
        border: "1px solid rgba(99,102,241,0.3)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "20px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div>
          <label
            style={{
              color: "#9ca3af",
              fontSize: "0.8rem",
              display: "block",
              marginBottom: "6px",
            }}
          >
            Number of Input Bits
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => {
                  setNumBits(n);
                  setSelectedMinterm(0);
                }}
                style={{
                  padding: "7px 14px",
                  borderRadius: "8px",
                  border: `1.5px solid ${numBits === n ? "#6366f1" : "rgba(99,102,241,0.25)"}`,
                  background:
                    numBits === n ? "rgba(99,102,241,0.25)" : "transparent",
                  color: numBits === n ? "#a5b4fc" : "#6b7280",
                  cursor: "pointer",
                  fontFamily: "monospace",
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "18px" }}>
        <label
          style={{
            color: "#9ca3af",
            fontSize: "0.8rem",
            display: "block",
            marginBottom: "10px",
          }}
        >
          Select Output (click to select which minterm to build):
        </label>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {Array.from({ length: numOutputs }, (_, i) => (
            <button
              key={i}
              onClick={() => setSelectedMinterm(i)}
              style={{
                padding: "9px 14px",
                borderRadius: "9px",
                border: `2px solid ${selectedMinterm === i ? "#fbbf24" : "rgba(99,102,241,0.2)"}`,
                background:
                  selectedMinterm === i
                    ? "rgba(251,191,36,0.15)"
                    : "rgba(12,18,35,0.6)",
                color: selectedMinterm === i ? "#fbbf24" : "#6b7280",
                cursor: "pointer",
                fontFamily: "monospace",
                fontWeight: selectedMinterm === i ? "700" : "400",
                transition: "all 0.2s",
              }}
            >
              D{i}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "14px",
          marginBottom: "18px",
        }}
      >
        <div
          style={{
            padding: "16px",
            background: "rgba(12,18,35,0.8)",
            borderRadius: "10px",
            border: "1px solid rgba(99,102,241,0.2)",
          }}
        >
          <div
            style={{
              color: "#9ca3af",
              fontSize: "0.75rem",
              marginBottom: "8px",
            }}
          >
            ADDRESS IN BINARY
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "1.3rem",
              color: "#60a5fa",
              fontWeight: "700",
              letterSpacing: "6px",
            }}
          >
            {binary}₂
          </div>
          <div
            style={{ color: "#4b5563", fontSize: "0.78rem", marginTop: "4px" }}
          >
            = {selectedMinterm}₁₀
          </div>
        </div>
        <div
          style={{
            padding: "16px",
            background: "rgba(12,18,35,0.8)",
            borderRadius: "10px",
            border: "1px solid rgba(251,191,36,0.3)",
          }}
        >
          <div
            style={{
              color: "#9ca3af",
              fontSize: "0.75rem",
              marginBottom: "8px",
            }}
          >
            RULE
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {inputs.map((inp, i) => {
              const bit = (selectedMinterm >> (numBits - 1 - i)) & 1;
              return (
                <div
                  key={inp}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "0.85rem",
                      color: bit ? "#4ade80" : "#f87171",
                    }}
                  >
                    {bit === 1 ? inp : inp + "'"}
                  </span>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      color: bit ? "#4ade80" : "#f87171",
                    }}
                  >
                    {bit === 1 ? "DIRECT" : "COMPLEMENT"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        style={{
          background: "rgba(251,191,36,0.07)",
          border: "1px solid rgba(251,191,36,0.3)",
          borderRadius: "10px",
          padding: "16px",
        }}
      >
        <div
          style={{ color: "#9ca3af", fontSize: "0.75rem", marginBottom: "6px" }}
        >
          RESULTING BOOLEAN EQUATION
        </div>
        <code
          style={{ color: "#fbbf24", fontSize: "1.05rem", fontWeight: "700" }}
        >
          D{selectedMinterm} = {equation}
        </code>
        <p
          style={{
            color: "#9ca3af",
            fontSize: "0.82rem",
            marginTop: "10px",
            lineHeight: "1.6",
            marginBottom: 0,
          }}
        >
          🔑 <strong style={{ color: "#e2e8f0" }}>Pattern:</strong> Bit=1 in
          address → use input directly. Bit=0 → complement it. AND everything
          together with E.
        </p>
      </div>
    </div>
  );
};

// ─── Function Generator Demo ───────────────────────────────────────────────────
const FunctionGeneratorDemo = () => {
  const [funcRows, setFuncRows] = useState([false, false, false, false]);
  const toggleRow = (i) =>
    setFuncRows((prev) => {
      const n = [...prev];
      n[i] = !n[i];
      return n;
    });
  const selected = funcRows.map((on, i) => (on ? i : -1)).filter((i) => i >= 0);
  const equation =
    selected.length === 0
      ? "F = 0"
      : "F = " + selected.map((i) => `D${i}`).join(" + ");
  const mintermEq =
    selected.length === 0
      ? "F = 0"
      : "F = " +
        selected
          .map((i) => {
            const a1 = (i >> 1) & 1,
              a0 = i & 1;
            return `(${a1 ? "A1" : "A1'"}·${a0 ? "A0" : "A0'"})`;
          })
          .join(" + ");

  return (
    <div
      style={{
        background: "rgba(8,14,30,0.9)",
        borderRadius: "14px",
        padding: "22px",
        border: "1px solid rgba(0,255,136,0.25)",
      }}
    >
      <h4
        style={{ color: "#86efac", marginBottom: "8px", fontSize: "0.95rem" }}
      >
        🧩 Decoder as Function Generator
      </h4>
      <p
        style={{
          color: "#9ca3af",
          fontSize: "0.83rem",
          lineHeight: "1.6",
          marginBottom: "18px",
        }}
      >
        Check the rows where your Boolean function = 1. The decoder + OR gate
        implements ANY function of A1,A0 instantly — no K-mapping needed!
      </p>
      <div style={{ overflowX: "auto", marginBottom: "18px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "monospace",
            fontSize: "0.85rem",
          }}
        >
          <thead>
            <tr>
              {["Row", "A1", "A0", "Decoder Output", "F = ?"].map((h, i) => (
                <th
                  key={i}
                  style={{
                    padding: "9px 14px",
                    background: "rgba(15,23,42,0.9)",
                    color: i < 3 ? "#60a5fa" : i === 3 ? "#fbbf24" : "#00ff88",
                    textAlign: "center",
                    borderBottom: "1px solid rgba(99,102,241,0.3)",
                    fontSize: "0.8rem",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2, 3].map((i) => {
              const a1 = (i >> 1) & 1,
                a0 = i & 1;
              return (
                <tr
                  key={i}
                  style={{
                    background: funcRows[i]
                      ? "rgba(0,255,136,0.07)"
                      : "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleRow(i)}
                >
                  <td
                    style={{
                      padding: "9px 14px",
                      textAlign: "center",
                      color: "#9ca3af",
                      borderBottom: "1px solid rgba(30,40,60,0.4)",
                    }}
                  >
                    {i}
                  </td>
                  <td
                    style={{
                      padding: "9px 14px",
                      textAlign: "center",
                      color: a1 ? "#60a5fa" : "#374151",
                      borderBottom: "1px solid rgba(30,40,60,0.4)",
                    }}
                  >
                    {a1}
                  </td>
                  <td
                    style={{
                      padding: "9px 14px",
                      textAlign: "center",
                      color: a0 ? "#60a5fa" : "#374151",
                      borderBottom: "1px solid rgba(30,40,60,0.4)",
                    }}
                  >
                    {a0}
                  </td>
                  <td
                    style={{
                      padding: "9px 14px",
                      textAlign: "center",
                      color: "#fbbf24",
                      borderBottom: "1px solid rgba(30,40,60,0.4)",
                      fontWeight: "600",
                    }}
                  >
                    D{i}
                  </td>
                  <td
                    style={{
                      padding: "9px 14px",
                      textAlign: "center",
                      borderBottom: "1px solid rgba(30,40,60,0.4)",
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRow(i);
                      }}
                      style={{
                        width: "32px",
                        height: "20px",
                        borderRadius: "5px",
                        background: funcRows[i]
                          ? "#00ff88"
                          : "rgba(99,102,241,0.15)",
                        border: `1.5px solid ${funcRows[i] ? "#00ff88" : "rgba(99,102,241,0.3)"}`,
                        color: funcRows[i] ? "#0a0f1a" : "#4b5563",
                        cursor: "pointer",
                        fontFamily: "monospace",
                        fontWeight: "800",
                        fontSize: "0.8rem",
                      }}
                    >
                      {funcRows[i] ? "1" : "0"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}
      >
        <div
          style={{
            padding: "14px",
            background: "rgba(0,255,136,0.06)",
            border: "1px solid rgba(0,255,136,0.25)",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              color: "#86efac",
              fontSize: "0.75rem",
              fontWeight: "700",
              marginBottom: "6px",
            }}
          >
            USING DECODER OUTPUTS
          </div>
          <code style={{ color: "#00ff88", fontSize: "0.9rem" }}>
            {equation}
          </code>
        </div>
        <div
          style={{
            padding: "14px",
            background: "rgba(99,102,241,0.06)",
            border: "1px solid rgba(99,102,241,0.25)",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              color: "#a5b4fc",
              fontSize: "0.75rem",
              fontWeight: "700",
              marginBottom: "6px",
            }}
          >
            EQUIVALENT MINTERM SOP
          </div>
          <code
            style={{ color: "#a5b4fc", fontSize: "0.85rem", lineHeight: "1.5" }}
          >
            {mintermEq}
          </code>
        </div>
      </div>
      {selected.length > 0 && (
        <div
          style={{
            marginTop: "12px",
            padding: "10px 14px",
            background: "rgba(251,191,36,0.06)",
            borderRadius: "8px",
            color: "#fbbf24",
            fontSize: "0.82rem",
          }}
        >
          ✨ OR gate connects D{selected.join(", D")} outputs → implements your
          function without any AND gates!
        </div>
      )}
    </div>
  );
};

// ─── Floating Tips ─────────────────────────────────────────────────────────────
const TipsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tipIdx, setTipIdx] = useState(0);
  const tip = TIPS[tipIdx];
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: isOpen ? "rgba(251,191,36,0.3)" : "rgba(99,102,241,0.85)",
          border: `2px solid ${isOpen ? "#fbbf24" : "#6366f1"}`,
          color: isOpen ? "#fbbf24" : "#e2e8f0",
          fontSize: "1.4rem",
          cursor: "pointer",
          zIndex: 999,
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          transition: "all 0.2s",
        }}
      >
        {isOpen ? "✕" : "💡"}
      </button>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "88px",
            right: "24px",
            width: "320px",
            background: "rgba(8,14,30,0.97)",
            border: "1px solid rgba(99,102,241,0.4)",
            borderRadius: "16px",
            padding: "20px",
            zIndex: 998,
            boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              color: "#a5b4fc",
              fontSize: "0.75rem",
              fontWeight: "700",
              marginBottom: "14px",
              letterSpacing: "0.08em",
            }}
          >
            💡 TIPS & TRICKS
          </div>
          <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
            {tip.icon}
          </div>
          <div
            style={{
              color: "#fbbf24",
              fontWeight: "700",
              marginBottom: "8px",
              fontSize: "0.9rem",
            }}
          >
            {tip.title}
          </div>
          <p
            style={{
              color: "#9ca3af",
              fontSize: "0.83rem",
              lineHeight: "1.65",
              margin: "0 0 16px",
            }}
          >
            {tip.text}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#4b5563", fontSize: "0.75rem" }}>
              {tipIdx + 1}/{TIPS.length}
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() =>
                  setTipIdx((tipIdx - 1 + TIPS.length) % TIPS.length)
                }
                style={{
                  padding: "5px 12px",
                  borderRadius: "6px",
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  color: "#a5b4fc",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                ←
              </button>
              <button
                onClick={() => setTipIdx((tipIdx + 1) % TIPS.length)}
                style={{
                  padding: "5px 12px",
                  borderRadius: "6px",
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  color: "#a5b4fc",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ─── Quiz ──────────────────────────────────────────────────────────────────────
const Quiz = () => {
  const [qi, setQi] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const q = QUIZ[qi];
  const choose = (i) => {
    if (sel !== null) return;
    setSel(i);
    if (i === q.ans) {
      const ns = streak + 1;
      setScore((s) => s + 1);
      setStreak(ns);
      if (ns > bestStreak) setBestStreak(ns);
    } else setStreak(0);
  };
  const next = () => {
    if (qi + 1 >= QUIZ.length) {
      setDone(true);
      return;
    }
    setQi(qi + 1);
    setSel(null);
    setShowHint(false);
  };
  const restart = () => {
    setQi(0);
    setSel(null);
    setScore(0);
    setDone(false);
    setStreak(0);
    setShowHint(false);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "12px" }}>
          {score >= 5 ? "🏆" : score >= 3 ? "🎯" : "📚"}
        </div>
        <h3 style={{ color: "#fbbf24", marginBottom: "8px" }}>
          Quiz Complete!
        </h3>
        <p style={{ color: "#9ca3af", marginBottom: "4px" }}>
          Score:{" "}
          <strong style={{ color: "#00ff88", fontSize: "1.2rem" }}>
            {score}/{QUIZ.length}
          </strong>
        </p>
        <p style={{ color: "#9ca3af", marginBottom: "4px" }}>
          Best Streak:{" "}
          <strong style={{ color: "#f97316" }}>🔥 {bestStreak}</strong>
        </p>
        <p
          style={{ color: "#9ca3af", marginBottom: "24px", fontSize: "0.9rem" }}
        >
          {score >= 5
            ? "Excellent! You understand minterm logic and enable pins cold."
            : score >= 3
              ? "Good — practice the binary→decimal conversion for fast output identification."
              : "Review the minterm rule: binary 0 → complement, binary 1 → direct."}
        </p>
        <button
          onClick={restart}
          style={{
            padding: "12px 28px",
            borderRadius: "10px",
            background: "rgba(99,102,241,0.25)",
            border: "1.5px solid rgba(99,102,241,0.6)",
            color: "#a5b4fc",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          ↺ Try Again
        </button>
      </div>
    );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: "4px" }}>
          {QUIZ.map((_, i) => (
            <div
              key={i}
              style={{
                width: "28px",
                height: "5px",
                borderRadius: "3px",
                background:
                  i < qi
                    ? "#00ff88"
                    : i === qi
                      ? "#6366f1"
                      : "rgba(99,102,241,0.2)",
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          {streak >= 2 && (
            <span style={{ color: "#f97316", fontSize: "0.82rem" }}>
              🔥 {streak} streak!
            </span>
          )}
          <span style={{ color: "#00ff88", fontSize: "0.85rem" }}>
            Score: {score}
          </span>
        </div>
      </div>
      <p
        style={{
          color: "#e2e8f0",
          fontWeight: "600",
          marginBottom: "18px",
          lineHeight: "1.65",
        }}
      >
        {q.q}
      </p>
      {!showHint && sel === null && (
        <button
          onClick={() => setShowHint(true)}
          style={{
            marginBottom: "12px",
            padding: "6px 14px",
            borderRadius: "7px",
            background: "rgba(251,191,36,0.1)",
            border: "1px solid rgba(251,191,36,0.3)",
            color: "#fbbf24",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          💡 Show Hint
        </button>
      )}
      {showHint && (
        <div
          style={{
            marginBottom: "14px",
            padding: "10px 14px",
            background: "rgba(251,191,36,0.07)",
            border: "1px solid rgba(251,191,36,0.3)",
            borderRadius: "8px",
            color: "#fbbf24",
            fontSize: "0.83rem",
          }}
        >
          🔍 {q.hint}
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "9px",
          marginBottom: "16px",
        }}
      >
        {q.opts.map((opt, i) => {
          let border = "rgba(148,163,184,0.2)",
            bg = "rgba(15,23,42,0.6)",
            color = "#9ca3af";
          if (sel !== null) {
            if (i === q.ans) {
              bg = "rgba(0,255,136,0.1)";
              border = "#00ff88";
              color = "#00ff88";
            } else if (i === sel) {
              bg = "rgba(239,68,68,0.1)";
              border = "#ef4444";
              color = "#ef4444";
            }
          }
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              style={{
                padding: "11px 16px",
                borderRadius: "9px",
                border: `1.5px solid ${border}`,
                background: bg,
                color,
                fontFamily: "monospace",
                cursor: sel !== null ? "default" : "pointer",
                textAlign: "left",
                transition: "all 0.2s",
                fontSize: "0.9rem",
              }}
            >
              <span style={{ marginRight: "10px", opacity: 0.7 }}>
                {String.fromCharCode(65 + i)}.
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      {sel !== null && (
        <div
          style={{
            padding: "14px",
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: "10px",
            marginBottom: "16px",
          }}
        >
          <p
            style={{
              color: "#c4b5fd",
              margin: 0,
              fontSize: "0.88rem",
              lineHeight: "1.65",
            }}
          >
            {sel === q.ans ? "✅ " : "❌ "}
            {q.exp}
          </p>
        </div>
      )}
      {sel !== null && (
        <button
          onClick={next}
          style={{
            padding: "11px 24px",
            borderRadius: "9px",
            background: "rgba(99,102,241,0.25)",
            border: "1.5px solid rgba(99,102,241,0.6)",
            color: "#a5b4fc",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          {qi + 1 < QUIZ.length ? "Next Question →" : "See Results"}
        </button>
      )}
    </div>
  );
};

// ─── Main Simulator ────────────────────────────────────────────────────────────
const DecoderSimulator = ({ selectedType, inputVals, setInputVals }) => {
  const config = DECODER_TYPES[selectedType];
  const [expandedEq, setExpandedEq] = useState(null);
  const [enable, setEnable] = useState(true);

  const toggleCode = (idx) => {
    const n = [...inputVals];
    n[idx] = n[idx] ? 0 : 1;
    setInputVals(n);
  };
  const reset = () => {
    setInputVals(Array(4).fill(0));
  };

  const codeVals = config.codeInputs.map((_, i) => inputVals[i] ?? 0);
  const result = useMemo(
    () => config.decode(codeVals, enable),
    [config, codeVals, enable],
  );

  const is7seg = selectedType === "BCD7seg";
  const outputKeys = config.outputs;
  const outputEntries = outputKeys.map((name) => ({
    name,
    val: result[name] ?? 0,
  }));

  const binaryValue = codeVals.reduce(
    (acc, bit, i) => acc + (bit << (config.codeInputs.length - 1 - i)),
    0,
  );

  return (
    <div>
      {/* Input section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <h4 style={{ color: "#60a5fa", margin: 0, fontSize: "0.9rem" }}>
              📥 Address Inputs
            </h4>
            <button
              onClick={reset}
              style={{
                padding: "5px 12px",
                borderRadius: "7px",
                border: "1px solid rgba(148,163,184,0.2)",
                background: "transparent",
                color: "#6b7280",
                cursor: "pointer",
                fontSize: "0.78rem",
              }}
            >
              Reset
            </button>
          </div>

          {config.enableInput && (
            <button
              onClick={() => setEnable(!enable)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "9px",
                border: `2px solid ${enable ? "#fbbf24" : "rgba(239,68,68,0.5)"}`,
                background: enable
                  ? "rgba(251,191,36,0.1)"
                  : "rgba(239,68,68,0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                marginBottom: "10px",
                transition: "all 0.2s",
              }}
            >
              <span
                style={{
                  color: enable ? "#fbbf24" : "#f87171",
                  fontFamily: "monospace",
                  fontWeight: "700",
                }}
              >
                E (Enable)
              </span>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                {!enable && (
                  <span style={{ color: "#f87171", fontSize: "0.72rem" }}>
                    ⚠ DISABLED
                  </span>
                )}
                <span
                  style={{
                    width: "28px",
                    height: "16px",
                    borderRadius: "4px",
                    background: enable ? "#fbbf24" : "rgba(239,68,68,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "monospace",
                    fontSize: "0.78rem",
                    color: enable ? "#0a0f1a" : "#9ca3af",
                    fontWeight: "800",
                  }}
                >
                  {enable ? "1" : "0"}
                </span>
              </div>
            </button>
          )}

          {config.codeInputs.map((name, idx) => (
            <button
              key={name}
              onClick={() => toggleCode(idx)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "9px",
                border: `2px solid ${codeVals[idx] ? "#60a5fa" : "rgba(99,102,241,0.2)"}`,
                background: codeVals[idx]
                  ? "rgba(96,165,250,0.1)"
                  : "rgba(12,18,35,0.7)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                marginBottom: "8px",
                transition: "all 0.2s",
              }}
            >
              <span
                style={{
                  color: codeVals[idx] ? "#60a5fa" : "#6b7280",
                  fontFamily: "monospace",
                  fontWeight: "700",
                }}
              >
                {name}
              </span>
              <span
                style={{
                  width: "28px",
                  height: "16px",
                  borderRadius: "4px",
                  background: codeVals[idx]
                    ? "#60a5fa"
                    : "rgba(99,102,241,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "monospace",
                  fontSize: "0.78rem",
                  color: codeVals[idx] ? "#0a0f1a" : "#4b5563",
                  fontWeight: "800",
                  transition: "all 0.2s",
                }}
              >
                {codeVals[idx]}
              </span>
            </button>
          ))}

          <div
            style={{
              padding: "12px 14px",
              background: "rgba(8,14,30,0.8)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "9px",
              marginTop: "8px",
            }}
          >
            {enable && result.active >= 0 ? (
              <>
                <div
                  style={{
                    color: "#86efac",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    marginBottom: "4px",
                  }}
                >
                  DECODING
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    color: "#00ff88",
                    fontSize: "1.05rem",
                    fontWeight: "700",
                  }}
                >
                  {codeVals.join("")}₂ = {binaryValue}₁₀ →{" "}
                  {is7seg ? `digit ${binaryValue}` : `D${result.active}`}
                </div>
              </>
            ) : !enable ? (
              <div style={{ color: "#f87171", fontSize: "0.85rem" }}>
                ⚠️ Chip disabled (E=0) — all outputs LOW
              </div>
            ) : (
              <div
                style={{
                  color: "#4b5563",
                  fontSize: "0.85rem",
                  fontStyle: "italic",
                }}
              >
                {is7seg ? "BCD > 9 = invalid input" : "No input selected"}
              </div>
            )}
          </div>
        </div>

        <div>
          <h4
            style={{
              color: "#fbbf24",
              marginBottom: "12px",
              fontSize: "0.9rem",
            }}
          >
            📤 Outputs {is7seg ? "— 7 Segment" : ""}
          </h4>
          {is7seg ? (
            <div
              style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}
            >
              <SevenSeg segs={result} digit={enable ? result.active : -1} />
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                {outputEntries.map(({ name, val }) => (
                  <div
                    key={name}
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        color: "#4b5563",
                        fontFamily: "monospace",
                        fontSize: "0.8rem",
                        width: "16px",
                      }}
                    >
                      {name}
                    </span>
                    <div
                      style={{
                        width: "20px",
                        height: "12px",
                        borderRadius: "3px",
                        background: val ? "#00ff88" : "rgba(99,102,241,0.15)",
                        border: `1px solid ${val ? "#00ff88" : "rgba(99,102,241,0.2)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "monospace",
                        fontSize: "0.7rem",
                        color: val ? "#0a0f1a" : "#374151",
                        fontWeight: "800",
                      }}
                    >
                      {val}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "7px" }}
            >
              {outputEntries.map(({ name, val }) => (
                <div
                  key={name}
                  style={{
                    padding: "9px 14px",
                    borderRadius: "9px",
                    border: `2px solid ${val ? "#00ff88" : "rgba(148,163,184,0.12)"}`,
                    background: val
                      ? "rgba(0,255,136,0.08)"
                      : "rgba(12,18,35,0.7)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.2s",
                    boxShadow: val ? "0 0 8px rgba(0,255,136,0.2)" : "none",
                  }}
                >
                  <span
                    style={{
                      color: val ? "#00ff88" : "#6b7280",
                      fontFamily: "monospace",
                      fontWeight: "700",
                    }}
                  >
                    {name}
                  </span>
                  <span
                    style={{
                      width: "28px",
                      height: "16px",
                      borderRadius: "4px",
                      background: val ? "#00ff88" : "rgba(99,102,241,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "monospace",
                      fontSize: "0.78rem",
                      color: val ? "#0a0f1a" : "#4b5563",
                      fontWeight: "800",
                      transition: "all 0.2s",
                    }}
                  >
                    {val}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Truth Table */}
      <div style={{ marginBottom: "20px" }}>
        <h4
          style={{ color: "#93c5fd", marginBottom: "12px", fontSize: "0.9rem" }}
        >
          📊 Truth Table
        </h4>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "monospace",
              fontSize: "0.8rem",
            }}
          >
            <thead>
              <tr>
                {config.truthHeaders.map((h, i) => (
                  <th
                    key={i}
                    style={{
                      padding: "8px 10px",
                      background: "rgba(15,23,42,0.9)",
                      color:
                        h === "E"
                          ? "#fbbf24"
                          : config.codeInputs.includes(h)
                            ? "#60a5fa"
                            : "#34d399",
                      textAlign: "center",
                      borderBottom: "1px solid rgba(99,102,241,0.3)",
                      fontSize: "0.78rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {config.truthRows.map((row, ri) => {
                const isActive =
                  enable && result.active === ri - (config.enableInput ? 1 : 0);
                return (
                  <tr
                    key={ri}
                    style={{
                      background: isActive
                        ? "rgba(0,255,136,0.07)"
                        : "transparent",
                    }}
                  >
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        style={{
                          padding: "6px 10px",
                          textAlign: "center",
                          color:
                            cell === "1"
                              ? config.codeInputs.length +
                                  (config.enableInput ? 1 : 0) >
                                ci
                                ? "#60a5fa"
                                : "#00ff88"
                              : cell === "0"
                                ? "#374151"
                                : "#4b5563",
                          borderBottom: "1px solid rgba(30,40,60,0.4)",
                          fontWeight: isActive && cell === "1" ? "700" : "400",
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Equations */}
      <div>
        <h4
          style={{ color: "#a5b4fc", marginBottom: "14px", fontSize: "0.9rem" }}
        >
          📐 Boolean Equations — Click to Expand
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
          {config.booleanEqs.map((eq, i) => (
            <div
              key={i}
              onClick={() => setExpandedEq(expandedEq === i ? null : i)}
              style={{
                background: "rgba(12,18,35,0.8)",
                border: `1.5px solid ${expandedEq === i ? eq.color + "55" : "rgba(99,102,241,0.18)"}`,
                borderRadius: "10px",
                padding: "13px 16px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <code
                  style={{
                    color: eq.color,
                    fontFamily: "monospace",
                    fontSize: "0.92rem",
                    fontWeight: "700",
                  }}
                >
                  {eq.eq}
                </code>
                <span style={{ color: "#6b7280", fontSize: "0.73rem" }}>
                  {expandedEq === i ? "▲ less" : "▼ explain"}
                </span>
              </div>
              {expandedEq === i && (
                <div
                  style={{
                    marginTop: "12px",
                    borderTop: "1px solid rgba(99,102,241,0.12)",
                    paddingTop: "12px",
                  }}
                >
                  <p
                    style={{
                      color: "#9ca3af",
                      fontSize: "0.86rem",
                      lineHeight: "1.7",
                      margin: "0 0 12px",
                    }}
                  >
                    {eq.explanation}
                  </p>
                  <div
                    style={{
                      padding: "10px 14px",
                      background: `${eq.color}12`,
                      border: `1px solid ${eq.color}35`,
                      borderRadius: "8px",
                    }}
                  >
                    <span
                      style={{
                        color: eq.color,
                        fontSize: "0.78rem",
                        fontWeight: "700",
                      }}
                    >
                      🎯 MEMORY TRICK:{" "}
                    </span>
                    <span style={{ color: "#e2e8f0", fontSize: "0.82rem" }}>
                      {eq.trick}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* PRO TOOLS SECTION */}
      <div style={{ marginTop: "40px", borderTop: "1px solid rgba(99,102,241,0.2)", paddingTop: "32px" }}>
        <h4 style={{ color: "#60a5fa", marginBottom: "20px", fontSize: "1rem", fontWeight: "800", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          🚀 Pro Engineering Tools
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "20px" }}>
          <LogicAnalyzer 
            inputs={[...(config.enableInput ? [enable ? 1 : 0] : []), ...codeVals]} 
            outputs={outputEntries.map(e => e.val)} 
            labels={[...(config.enableInput ? ["E"] : []), ...config.codeInputs, ...config.outputs]} 
          />
          <VirtualBreadboard 
            inputs={codeVals} 
            outputs={outputEntries.map(e => e.val)} 
            config={config} 
          />
        </div>
      </div>
    </div>
  );
};

// ─── Visual Cascading Demo (Decoder) ──────────────────────────────────────────
const VisualCascadingDemo = () => {
  const [chipSelect, setChipSelect] = useState(0); // A2 chooses which chip
  const [innerAddr, setInnerAddr] = useState(0);   // A1, A0 choose output within chip
  
  const chips = ["Chip U1 (Outputs 0-3)", "Chip U2 (Outputs 4-7)"];
  const activeGlobal = chipSelect * 4 + innerAddr;

  return (
    <div style={{ background: "rgba(15,23,42,0.4)", borderRadius: "14px", padding: "24px", border: "1px solid rgba(251,191,36,0.2)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "30px", alignItems: "center" }}>
        <div>
          <div style={{ marginBottom: "20px" }}>
            <h5 style={{ color: "#fbbf24", fontSize: "0.85rem", marginBottom: "10px" }}>Step 1: Top-Level Address (A2)</h5>
            <div style={{ display: "flex", gap: "10px" }}>
              {[0, 1].map(v => (
                <button key={v} onClick={() => setChipSelect(v)} style={{ padding: "8px 16px", borderRadius: "8px", border: `2px solid ${chipSelect === v ? "#fbbf24" : "rgba(148,163,184,0.1)"}`, background: chipSelect === v ? "rgba(251,191,36,0.15)" : "transparent", color: chipSelect === v ? "#fbbf24" : "#64748b", cursor: "pointer", fontFamily: "monospace" }}>A2 = {v}</button>
              ))}
            </div>
            <p style={{ color: "#6b7280", fontSize: "0.75rem", marginTop: "6px" }}>{chipSelect === 0 ? "A2=0 → Enable U1, Disable U2" : "A2=1 → Disable U1, Enable U2"}</p>
          </div>

          <div>
            <h5 style={{ color: "#00ff88", fontSize: "0.85rem", marginBottom: "10px" }}>Step 2: Shared Inner Address (A1, A0)</h5>
            <div style={{ display: "flex", gap: "8px" }}>
              {[0, 1, 2, 3].map(v => (
                <button key={v} onClick={() => setInnerAddr(v)} style={{ padding: "8px 12px", borderRadius: "8px", border: `2px solid ${innerAddr === v ? "#00ff88" : "rgba(148,163,184,0.1)"}`, background: innerAddr === v ? "rgba(0,255,136,0.1)" : "transparent", color: innerAddr === v ? "#00ff88" : "#64748b", cursor: "pointer", fontFamily: "monospace" }}>{v.toString(2).padStart(2, '0')}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position: "relative", height: "220px", background: "rgba(0,0,0,0.2)", borderRadius: "12px", border: "1px dashed rgba(251,191,36,0.3)", padding: "15px" }}>
           <div style={{ position: "absolute", left: "20px", top: chipSelect === 0 ? "30px" : "130px", width: "10px", height: "10px", borderRadius: "50%", background: "#fbbf24", boxShadow: "0 0 10px #fbbf24", transition: "all 0.3s" }} />
           <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {chips.map((name, i) => (
                <div key={i} style={{ padding: "15px", borderRadius: "8px", border: `1px solid ${chipSelect === i ? "#fbbf24" : "rgba(148,163,184,0.1)"}`, background: chipSelect === i ? "rgba(251,191,36,0.05)" : "rgba(12,18,35,0.6)", opacity: chipSelect === i ? 1 : 0.4, transition: "all 0.3s" }}>
                  <div style={{ fontSize: "0.7rem", color: chipSelect === i ? "#fbbf24" : "#4b5563", fontWeight: "700" }}>{name}</div>
                  <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
                    {[0,1,2,3].map(bit => (
                      <div key={bit} style={{ width: "12px", height: "12px", borderRadius: "2px", background: (chipSelect === i && innerAddr === bit) ? "#00ff88" : "#1e293b", boxShadow: (chipSelect === i && innerAddr === bit) ? "0 0 5px #00ff88" : "none" }} />
                    ))}
                  </div>
                </div>
              ))}
           </div>
           <div style={{ marginTop: "15px", textAlign: "center", color: "#00ff88", fontFamily: "monospace", fontSize: "0.9rem", fontWeight: "700" }}>
              Global Output: D{activeGlobal}
           </div>
        </div>
      </div>
    </div>
  );
};

// ─── Type Selector ─────────────────────────────────────────────────────────────
const TypeSelector = ({ selectedType, onChange }) => (
  <div
    style={{
      display: "flex",
      gap: "10px",
      marginBottom: "22px",
      flexWrap: "wrap",
    }}
  >
    {Object.entries(DECODER_TYPES).map(([key, val]) => (
      <button
        key={key}
        onClick={() => onChange(key)}
        style={{
          padding: "10px 18px",
          borderRadius: "10px",
          border: `2px solid ${selectedType === key ? "#6366f1" : "rgba(99,102,241,0.2)"}`,
          background:
            selectedType === key
              ? "rgba(99,102,241,0.2)"
              : "rgba(12,18,35,0.7)",
          color: selectedType === key ? "#a5b4fc" : "#6b7280",
          cursor: "pointer",
          fontWeight: selectedType === key ? "700" : "400",
          transition: "all 0.2s",
          fontSize: "0.87rem",
        }}
      >
        {val.label}
      </button>
    ))}
  </div>
);

// ─── Section Block ─────────────────────────────────────────────────────────────
const Section = ({ title, children, accent = "#6366f1" }) => (
  <div
    style={{
      marginBottom: "32px",
      background: "rgba(10,16,32,0.85)",
      border: `1px solid ${accent}30`,
      borderRadius: "16px",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        padding: "16px 22px",
        borderBottom: `1px solid ${accent}25`,
        background: `${accent}0a`,
      }}
    >
      <h3
        style={{
          color: "#e2e8f0",
          margin: 0,
          fontSize: "1.05rem",
          fontWeight: "700",
        }}
      >
        {title}
      </h3>
    </div>
    <div style={{ padding: "22px" }}>{children}</div>
  </div>
);

// ─── Cascading Decoder Explainer ───────────────────────────────────────────────
const CascadingExplainer = () => {
  const [chipSelect, setChipSelect] = useState(0);
  const chips = [
    "Chip A (0–3)",
    "Chip B (4–7)",
    "Chip C (8–11)",
    "Chip D (12–15)",
  ];
  const [innerAddr, setInnerAddr] = useState(0);

  return (
    <div
      style={{
        background: "rgba(8,14,30,0.9)",
        borderRadius: "14px",
        padding: "22px",
        border: "1px solid rgba(251,191,36,0.25)",
      }}
    >
      <h4
        style={{ color: "#fbbf24", marginBottom: "8px", fontSize: "0.95rem" }}
      >
        🔗 Cascading — Building a 4-to-16 from 2-to-4 Decoders
      </h4>
      <p
        style={{
          color: "#9ca3af",
          fontSize: "0.83rem",
          lineHeight: "1.6",
          marginBottom: "18px",
        }}
      >
        Connect high address bits to a top-level decoder. Each output enables
        one of four child decoders, each handling 4 outputs.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "16px",
          alignItems: "start",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              color: "#9ca3af",
              fontSize: "0.75rem",
              marginBottom: "8px",
            }}
          >
            Top-level select (A3,A2)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {chips.map((c, i) => (
              <button
                key={i}
                onClick={() => setChipSelect(i)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: `1.5px solid ${chipSelect === i ? "#fbbf24" : "rgba(99,102,241,0.2)"}`,
                  background:
                    chipSelect === i
                      ? "rgba(251,191,36,0.15)"
                      : "rgba(12,18,35,0.7)",
                  color: chipSelect === i ? "#fbbf24" : "#6b7280",
                  cursor: "pointer",
                  fontFamily: "monospace",
                  fontSize: "0.82rem",
                  textAlign: "left",
                }}
              >
                {i.toString(2).padStart(2, "0")}₂ → {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div
            style={{
              color: "#9ca3af",
              fontSize: "0.75rem",
              marginBottom: "8px",
            }}
          >
            Inner address (A1,A0) — select within {chips[chipSelect]}
          </div>
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                onClick={() => setInnerAddr(i)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: `1.5px solid ${innerAddr === i ? "#00ff88" : "rgba(99,102,241,0.2)"}`,
                  background:
                    innerAddr === i
                      ? "rgba(0,255,136,0.12)"
                      : "rgba(12,18,35,0.7)",
                  color: innerAddr === i ? "#00ff88" : "#6b7280",
                  cursor: "pointer",
                  fontFamily: "monospace",
                  fontSize: "0.85rem",
                }}
              >
                {i.toString(2).padStart(2, "0")}₂
              </button>
            ))}
          </div>
          <div
            style={{
              padding: "14px",
              background: "rgba(0,255,136,0.06)",
              border: "1px solid rgba(0,255,136,0.3)",
              borderRadius: "10px",
            }}
          >
            <div
              style={{
                color: "#86efac",
                fontSize: "0.75rem",
                fontWeight: "700",
                marginBottom: "6px",
              }}
            >
              ACTIVE OUTPUT
            </div>
            <div
              style={{
                fontFamily: "monospace",
                color: "#00ff88",
                fontSize: "1.1rem",
                fontWeight: "700",
              }}
            >
              D{chipSelect * 4 + innerAddr} = output #
              {chipSelect * 4 + innerAddr}
            </div>
            <div
              style={{
                color: "#9ca3af",
                fontSize: "0.78rem",
                marginTop: "4px",
              }}
            >
              4-bit address:{" "}
              {(chipSelect * 4 + innerAddr).toString(2).padStart(4, "0")}₂ ={" "}
              {chipSelect * 4 + innerAddr}₁₀
            </div>
            <div
              style={{
                color: "#60a5fa",
                fontSize: "0.78rem",
                marginTop: "4px",
              }}
            >
              Top decoder selects {chips[chipSelect]} → inner decoder selects
              output {innerAddr}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── BCD Digit Pad ─────────────────────────────────────────────────────────────
const BCDDigitPad = () => {
  const [digit, setDigit] = useState(0);
  const bcd = digit.toString(2).padStart(4, "0");
  const bits = bcd.split("").map(Number);
  const result = DECODER_TYPES["BCD7seg"].decode(bits);

  return (
    <div
      style={{
        background: "rgba(8,14,30,0.9)",
        borderRadius: "14px",
        padding: "22px",
        border: "1px solid rgba(0,255,136,0.25)",
      }}
    >
      <h4
        style={{ color: "#86efac", marginBottom: "14px", fontSize: "0.95rem" }}
      >
        🔢 BCD Digit Pad — Type a Number, See the Segments
      </h4>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "8px",
          marginBottom: "20px",
        }}
      >
        {[7, 8, 9, 4, 5, 6, 1, 2, 3, null, 0, null].map((n, i) =>
          n !== null ? (
            <button
              key={i}
              onClick={() => setDigit(n)}
              style={{
                padding: "14px",
                borderRadius: "10px",
                border: `2px solid ${digit === n ? "#00ff88" : "rgba(99,102,241,0.2)"}`,
                background:
                  digit === n ? "rgba(0,255,136,0.12)" : "rgba(12,18,35,0.7)",
                color: digit === n ? "#00ff88" : "#9ca3af",
                cursor: "pointer",
                fontFamily: "monospace",
                fontWeight: "700",
                fontSize: "1.1rem",
                transition: "all 0.2s",
              }}
            >
              {n}
            </button>
          ) : (
            <div key={i} />
          ),
        )}
      </div>
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <SevenSeg segs={result} digit={digit} />
        <div>
          <div
            style={{
              color: "#9ca3af",
              fontSize: "0.8rem",
              marginBottom: "8px",
            }}
          >
            BCD Code:{" "}
            <span
              style={{
                color: "#60a5fa",
                fontFamily: "monospace",
                fontWeight: "700",
              }}
            >
              {bcd}₂
            </span>
          </div>
          <div
            style={{
              color: "#9ca3af",
              fontSize: "0.8rem",
              marginBottom: "8px",
            }}
          >
            A B C D ={" "}
            <span style={{ fontFamily: "monospace", color: "#fbbf24" }}>
              {bits.join(" ")}
            </span>
          </div>
          <div style={{ color: "#9ca3af", fontSize: "0.8rem" }}>
            Active segments:{" "}
            <span style={{ fontFamily: "monospace", color: "#00ff88" }}>
              {["a", "b", "c", "d", "e", "f", "g"]
                .filter((k) => result[k])
                .join(", ")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── HDL Code Generator ────────────────────────────────────────────────────────
const HDLCodeGenerator = ({ type }) => {
  const [lang, setLang] = useState("Verilog");
  const config = DECODER_TYPES[type];
  const numInputs = config.codeInputs.length;
  const numOutputs = config.outputs.length;

  const generateCode = () => {
    if (lang === "Verilog") {
      return `module decoder_${type}(
    input [${numInputs - 1}:0] A,
    input E,
    output [${numOutputs - 1}:0] D
);
    assign D = E ? (1 << A) : ${numOutputs}'b0;
endmodule`;
    } else {
      return `library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity decoder_${type} is
    Port ( A : in  STD_LOGIC_VECTOR (${numInputs - 1} downto 0);
           E : in  STD_LOGIC;
           D : out STD_LOGIC_VECTOR (${numOutputs - 1} downto 0));
end decoder_${type};

architecture Behavioral of decoder_${type} is
begin
    process(A, E)
    begin
        D <= (others => '0');
        if E = '1' then
            D(to_integer(unsigned(A))) <= '1';
        end if;
    end process;
end Behavioral;`;
    }
  };

  return (
    <div style={{ background: "rgba(15,23,42,0.6)", borderRadius: "12px", border: "1px solid rgba(99,102,241,0.2)", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h4 style={{ color: "#a78bfa", margin: 0, fontSize: "0.9rem" }}>💻 Hardware Description (HDL) Export</h4>
        <div style={{ display: "flex", gap: "8px" }}>
          {["Verilog", "VHDL"].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ padding: "4px 10px", borderRadius: "6px", border: `1px solid ${lang === l ? "#a78bfa" : "rgba(148,163,184,0.2)"}`, background: lang === l ? "rgba(167,139,250,0.15)" : "transparent", color: lang === l ? "#c084fc" : "#6b7280", cursor: "pointer", fontSize: "0.75rem" }}>{l}</button>
          ))}
        </div>
      </div>
      <pre style={{ margin: 0, padding: "16px", background: "#020617", borderRadius: "8px", color: "#86efac", fontSize: "0.82rem", overflowX: "auto", fontFamily: "monospace", border: "1px solid rgba(167,139,250,0.1)" }}>
        {generateCode()}
      </pre>
    </div>
  );
};

// ─── 7-Segment Scroller ────────────────────────────────────────────────────────
const SevenSegScroller = () => {
  const [text, setText] = useState("HELLO");
  const [idx, setIdx] = useState(0);
  
  const charMap = {
    'H': [0, 1, 1, 0, 1, 1, 1], 'E': [1, 0, 0, 1, 1, 1, 1], 'L': [0, 0, 0, 1, 1, 1, 0], 'O': [1, 1, 1, 1, 1, 1, 0],
    'P': [1, 1, 0, 0, 1, 1, 1], 'A': [1, 1, 1, 0, 1, 1, 1], 'C': [1, 0, 0, 1, 1, 1, 0], 'U': [0, 1, 1, 1, 1, 1, 0],
    'F': [1, 0, 0, 0, 1, 1, 1], 'S': [1, 0, 1, 1, 0, 1, 1], 'b': [0, 0, 1, 1, 1, 1, 1], 'd': [0, 1, 1, 1, 1, 0, 1],
    ' ': [0, 0, 0, 0, 0, 0, 0]
  };

  const currentChar = text[idx]?.toUpperCase() || ' ';
  const segsArray = charMap[currentChar] || charMap[' '];
  const segsObj = { a: segsArray[0], b: segsArray[1], c: segsArray[2], d: segsArray[3], e: segsArray[4], f: segsArray[5], g: segsArray[6] };

  return (
    <div style={{ background: "rgba(8,14,30,0.9)", borderRadius: "14px", padding: "22px", border: "1px solid rgba(0,255,136,0.25)" }}>
      <h4 style={{ color: "#86efac", marginBottom: "14px", fontSize: "0.95rem" }}>🔡 Message Scroller — 7-Seg Translation</h4>
      <div style={{ display: "flex", gap: "15px", alignItems: "center", marginBottom: "20px" }}>
        <input 
          type="text" 
          value={text} 
          onChange={(e) => setText(e.target.value.slice(0, 10))} 
          placeholder="Type a word..."
          style={{ flex: 1, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: "8px", padding: "10px", color: "#e2e8f0", fontFamily: "monospace" }}
        />
        <div style={{ display: "flex", gap: "5px" }}>
          {text.split('').map((char, i) => (
            <button key={i} onClick={() => setIdx(i)} style={{ width: "24px", height: "24px", borderRadius: "4px", border: `1px solid ${idx === i ? "#00ff88" : "#1e293b"}`, background: idx === i ? "rgba(0,255,136,0.2)" : "transparent", color: idx === i ? "#00ff88" : "#4b5563", fontSize: "0.7rem", cursor: "pointer" }}>{char.toUpperCase()}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "40px" }}>
        <SevenSeg segs={segsObj} digit={currentChar} />
        <div style={{ padding: "15px", background: "rgba(0,255,136,0.05)", borderRadius: "10px", border: "1px solid rgba(0,255,136,0.15)" }}>
          <div style={{ color: "#9ca3af", fontSize: "0.75rem", marginBottom: "8px" }}>Current Binary Map:</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
            {["a","b","c","d","e","f","g"].map((s, i) => (
              <div key={s} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.65rem", color: "#4b5563" }}>{s}</div>
                <div style={{ color: segsObj[s] ? "#00ff88" : "#1e293b", fontWeight: "700" }}>{segsObj[s]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Logic Error Debugger ──────────────────────────────────────────────────────
const LogicErrorDebugger = () => {
  const [level, setLevel] = useState(0);
  const [userGuess, setUserGuess] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const faults = [
    { type: "Stuck-at-0", line: "Enable (E)", effect: "All outputs are LOW regardless of address", answer: "E" },
    { type: "Stuck-at-1", line: "Input A1", effect: "Decoder thinks addresses are 10 or 11 only", answer: "A1" },
    { type: "Short-Circuit", line: "D0 and D1", effect: "D0 and D1 both go HIGH for address 00 or 01", answer: "D0" }
  ];

  const check = (ans) => {
    setUserGuess(ans);
    setShowResult(true);
  };

  const next = () => {
    setLevel((level + 1) % faults.length);
    setShowResult(false);
    setUserGuess(null);
  };

  return (
    <div style={{ background: "rgba(8,14,30,0.9)", borderRadius: "14px", padding: "22px", border: "1px solid rgba(239,68,68,0.25)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
        <h4 style={{ color: "#f87171", margin: 0, fontSize: "0.95rem" }}>🕵️ Logic Fault Debugger — Level {level + 1}</h4>
        <div style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", padding: "4px 10px", borderRadius: "12px", fontSize: "0.7rem", fontWeight: "700" }}>ERROR DETECTED</div>
      </div>
      <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "15px" }}><strong>Symptom:</strong> {faults[level].effect}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
        {["E", "A1", "A0", "D0"].map(opt => (
          <button key={opt} onClick={() => check(opt)} disabled={showResult} style={{ padding: "10px", borderRadius: "8px", border: `1.5px solid ${userGuess === opt ? (opt === faults[level].answer ? "#34d399" : "#f87171") : "rgba(239,68,68,0.2)"}`, background: userGuess === opt ? (opt === faults[level].answer ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)") : "rgba(12,18,35,0.7)", color: userGuess === opt ? (opt === faults[level].answer ? "#34d399" : "#f87171") : "#9ca3af", cursor: "pointer" }}>Line {opt} Fault</button>
        ))}
      </div>
      {showResult && (
        <div style={{ padding: "12px", borderRadius: "8px", background: userGuess === faults[level].answer ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)", border: `1px solid ${userGuess === faults[level].answer ? "#34d399" : "#f87171"}`, marginBottom: "15px" }}>
          <div style={{ color: userGuess === faults[level].answer ? "#34d399" : "#f87171", fontSize: "0.85rem", fontWeight: "700" }}>{userGuess === faults[level].answer ? "✅ Correct! " : "❌ Try again! "}</div>
          <div style={{ color: "#9ca3af", fontSize: "0.75rem", marginTop: "4px" }}>The fault is <strong>{faults[level].type}</strong> on line <strong>{faults[level].answer}</strong>.</div>
          <button onClick={next} style={{ marginTop: "10px", padding: "5px 12px", borderRadius: "6px", background: "#f87171", border: "none", color: "white", cursor: "pointer", fontSize: "0.75rem" }}>Next Level</button>
        </div>
      )}
    </div>
  );
};

// ─── Virtual Breadboard Guide ────────────────────────────────────────────────
const VirtualBreadboard = ({ inputs, outputs, config }) => {
  const isActive = (idx) => inputs[idx] === 1;
  
  return (
    <div style={{ background: "rgba(15,23,42,0.6)", borderRadius: "14px", padding: "24px", border: "1px solid rgba(148,163,184,0.2)", textAlign: "center" }}>
      <h4 style={{ color: "#94a3b8", marginBottom: "20px", fontSize: "0.9rem" }}>🔌 Virtual Breadboard — 74LS Series Wiring Guide</h4>
      <div style={{ position: "relative", display: "inline-block", background: "#d1d5db", padding: "10px", borderRadius: "4px", boxShadow: "inset 0 0 10px rgba(0,0,0,0.2)" }}>
        {/* Breadboard Holes */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(20, 10px)", gap: "5px" }}>
          {Array(100).fill(0).map((_, i) => (
            <div key={i} style={{ width: "8px", height: "8px", borderRadius: "1px", background: "#9ca3af", border: "1px solid rgba(0,0,0,0.1)" }} />
          ))}
        </div>
        
        {/* IC Chip */}
        <div style={{ position: "absolute", top: "25%", left: "25%", width: "50%", height: "50%", background: "#1f2937", borderRadius: "3px", border: "1px solid #111827", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#111827", position: "absolute", top: "5px", left: "-5px" }} />
          <div style={{ color: "#4b5563", fontSize: "10px", fontWeight: "800", transform: "rotate(-90deg)" }}>74LS138</div>
          
          {/* Pins */}
          {[0,1,2,3,4,5,6,7].map(i => (
            <div key={i} style={{ position: "absolute", left: "-12px", top: `${15 + i * 10}%`, width: "12px", height: "4px", background: "#9ca3af" }} />
          ))}
          {[0,1,2,3,4,5,6,7].map(i => (
            <div key={i} style={{ position: "absolute", right: "-12px", top: `${15 + i * 10}%`, width: "12px", height: "4px", background: "#9ca3af" }} />
          ))}
        </div>

        {/* Dynamic Wires */}
        {inputs.map((val, i) => (
          val === 1 && (
            <svg key={i} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
              <path d={`M 10,${40 + i*20} Q 40,${40 + i*20} 60,70`} fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="4" style={{ filter: "drop-shadow(0 0 3px #60a5fa)" }} />
            </svg>
          )
        ))}
      </div>
      <div style={{ marginTop: "15px", fontSize: "0.75rem", color: "#6b7280" }}>
        Interactive wires glow when signals are <strong>HIGH (1)</strong>.
      </div>
    </div>
  );
};

// ─── Logic Analyzer (Timing Diagram) ──────────────────────────────────────────
const LogicAnalyzer = ({ inputs, outputs, labels }) => {
  const [history, setHistory] = useState([]);
  const maxPoints = 40;

  React.useEffect(() => {
    const timer = setInterval(() => {
      setHistory(prev => {
        const newState = [...inputs, ...outputs];
        const updated = [...prev, newState];
        return updated.slice(-maxPoints);
      });
    }, 200);
    return () => clearInterval(timer);
  }, [inputs, outputs]);

  const height = 30;
  const gap = 15;
  const totalHeight = (inputs.length + outputs.length) * (height + gap);

  return (
    <div style={{ background: "#020617", borderRadius: "12px", padding: "20px", border: "1px solid rgba(96,165,250,0.2)", overflow: "hidden" }}>
      <h4 style={{ color: "#60a5fa", marginTop: 0, marginBottom: "15px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 8px #ef4444" }} />
        LIVE LOGIC ANALYZER — TIMING DIAGRAM
      </h4>
      <div style={{ overflowX: "auto" }}>
        <svg width="100%" height={totalHeight} style={{ minWidth: "600px" }}>
          {(labels || []).map((label, i) => {
            const yBase = i * (height + gap);
            return (
              <g key={label}>
                <text x="0" y={yBase + 20} fill="#4b5563" fontSize="10" fontFamily="monospace">{label}</text>
                <line x1="45" y1={yBase + height} x2="100%" y2={yBase + height} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <polyline
                  points={history.map((state, idx) => {
                    const x = 50 + (idx * (600 / maxPoints));
                    const y = yBase + (state[i] ? 5 : height - 5);
                    return `${x},${y}`;
                  }).join(" ")}
                  fill="none"
                  stroke={i < inputs.length ? "#60a5fa" : "#00ff88"}
                  strokeWidth="2"
                  strokeLinejoin="step-after"
                  style={{ transition: "all 0.1s linear" }}
                />
              </g>
            );
          })}
        </svg>
      </div>
      <div style={{ marginTop: "10px", color: "#4b5563", fontSize: "0.7rem", textAlign: "right" }}>
        Scan Rate: 5Hz • Resolution: 8-bit
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const DecoderPage = () => {
  const [selectedType, setSelectedType] = useState("2to4");
  const [inputVals, setInputVals] = useState(Array(4).fill(0));
  const handleTypeChange = (type) => {
    setSelectedType(type);
    setInputVals(Array(4).fill(0));
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        background: "#080e1e",
        minHeight: "100vh",
        color: "#e2e8f0",
        padding: "28px 20px 80px",
      }}
    >
      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { width: 6px; height: 6px; } ::-webkit-scrollbar-track { background: rgba(15,23,42,0.3); } ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 3px; } button:hover { filter: brightness(1.12); }`}</style>

      {/* Header */}
      <div style={{ maxWidth: "900px", margin: "0 auto 32px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "6px 14px",
            borderRadius: "20px",
            background: "rgba(0,255,136,0.1)",
            border: "1px solid rgba(0,255,136,0.3)",
            marginBottom: "16px",
          }}
        >
          <span
            style={{
              color: "#86efac",
              fontSize: "0.78rem",
              fontWeight: "700",
              letterSpacing: "0.1em",
            }}
          >
            DIGITAL LOGIC
          </span>
        </div>
        <h1
          style={{
            fontSize: "2.2rem",
            fontWeight: "800",
            background: "linear-gradient(135deg, #86efac, #60a5fa, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0 0 12px",
            lineHeight: 1.2,
          }}
        >
          Decoders — Complete Guide
        </h1>
        <p
          style={{
            color: "#64748b",
            fontSize: "1rem",
            lineHeight: "1.6",
            margin: 0,
          }}
        >
          Interactive simulator • Minterm equation builder • 7-segment live demo
          • Cascading decoder • Function generator • Quiz with hints
        </p>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* SECTION 1: Concept */}
        <Section title="📖 What is a Decoder? — Core Concept" accent="#00ff88">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <div>
              <p
                style={{
                  color: "#9ca3af",
                  lineHeight: "1.7",
                  fontSize: "0.92rem",
                  margin: "0 0 16px",
                }}
              >
                A <strong style={{ color: "#e2e8f0" }}>decoder</strong> is a
                combinational circuit that converts a binary code into one
                active output line. Given an n-bit code, it activates exactly
                one of 2ⁿ outputs.
              </p>
              <p
                style={{
                  color: "#9ca3af",
                  lineHeight: "1.7",
                  fontSize: "0.92rem",
                  margin: 0,
                }}
              >
                Think of it as a{" "}
                <strong style={{ color: "#fbbf24" }}>building directory</strong>{" "}
                — given a floor number (binary code), it rings the bell on
                exactly that one floor.
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {[
                {
                  icon: "🎯",
                  label: "One-Hot Output",
                  desc: "Exactly ONE output is HIGH at any time",
                  color: "#00ff88",
                },
                {
                  icon: "🔌",
                  label: "Enable Pin",
                  desc: "E=0 disables ALL outputs (chip-select)",
                  color: "#fbbf24",
                },
                {
                  icon: "🧩",
                  label: "Minterm Machine",
                  desc: "Each output = one AND gate minterm",
                  color: "#60a5fa",
                },
                {
                  icon: "📡",
                  label: "Expansion",
                  desc: "n bits → 2ⁿ output lines",
                  color: "#a78bfa",
                },
              ].map(({ icon, label, desc, color }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    padding: "10px 14px",
                    background: "rgba(12,18,35,0.6)",
                    borderRadius: "9px",
                    border: `1px solid ${color}20`,
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>{icon}</span>
                  <div>
                    <div
                      style={{ color, fontWeight: "700", fontSize: "0.82rem" }}
                    >
                      {label}
                    </div>
                    <div style={{ color: "#6b7280", fontSize: "0.78rem" }}>
                      {desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: "18px",
              background: "rgba(0,255,136,0.05)",
              border: "1px solid rgba(0,255,136,0.25)",
              borderRadius: "12px",
              marginBottom: "16px",
            }}
          >
            <h4
              style={{
                color: "#86efac",
                marginBottom: "12px",
                fontSize: "0.9rem",
              }}
            >
              🎯 The Minterm Rule — Write Any Decoder Equation Instantly
            </h4>
            <ol
              style={{
                color: "#9ca3af",
                paddingLeft: "18px",
                margin: 0,
                lineHeight: "1.8",
                fontSize: "0.88rem",
              }}
            >
              <li>
                Write the output index in binary (e.g., D5 → 5 ={" "}
                <strong style={{ color: "#fbbf24" }}>101</strong>₂)
              </li>
              <li>
                For each bit:{" "}
                <strong style={{ color: "#00ff88" }}>
                  bit=1 → use input directly
                </strong>
                ,{" "}
                <strong style={{ color: "#f87171" }}>
                  bit=0 → complement it
                </strong>
              </li>
              <li>AND all terms together, including Enable (E)</li>
            </ol>
            <div
              style={{
                marginTop: "14px",
                padding: "12px",
                background: "rgba(0,0,0,0.3)",
                borderRadius: "8px",
                fontFamily: "monospace",
                fontSize: "0.87rem",
              }}
            >
              <span style={{ color: "#fbbf24" }}>
                Example — D5 in 3-to-8 decoder:
              </span>
              <br />
              <span style={{ color: "#9ca3af" }}>5 = </span>
              <span style={{ color: "#f97316" }}>1</span>
              <span style={{ color: "#f87171" }}>0</span>
              <span style={{ color: "#f97316" }}>1</span>
              <span style={{ color: "#9ca3af" }}>
                ₂ → A2=1 (keep) · A1=0 (complement) · A0=1 (keep)
              </span>
              <br />
              <span style={{ color: "#00ff88", fontWeight: "700" }}>
                ∴ D5 = E · A2 · A1' · A0 ✅
              </span>
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              background: "rgba(99,102,241,0.05)",
              border: "1px solid rgba(99,102,241,0.25)",
              borderRadius: "12px",
            }}
          >
            <h4
              style={{
                color: "#a5b4fc",
                marginBottom: "8px",
                fontSize: "0.88rem",
              }}
            >
              🔌 The Enable Pin — Chip Select Superpower
            </h4>
            <p
              style={{
                color: "#9ca3af",
                margin: 0,
                fontSize: "0.87rem",
                lineHeight: "1.65",
              }}
            >
              <strong style={{ color: "#fbbf24" }}>E=1:</strong> Decoder works
              normally. One output goes HIGH.
              <br />
              <strong style={{ color: "#f87171" }}>E=0:</strong> ALL outputs go
              LOW, regardless of address. The chip is "asleep."
              <br />
              In memory systems, each chip has its own decoder-driven enable.
              Only one chip is "awake" at any time — safe, no bus conflicts.
            </p>
          </div>
        </Section>

        {/* SECTION 2: Minterm Builder */}
        <Section
          title="🔬 Interactive Minterm Equation Builder"
          accent="#6366f1"
        >
          <p
            style={{
              color: "#9ca3af",
              fontSize: "0.88rem",
              lineHeight: "1.6",
              marginBottom: "18px",
            }}
          >
            Select any output and see its equation built step-by-step. Watch how
            each bit in the binary address determines whether the input appears
            direct or complemented.
          </p>
          <MintermBuilder />
        </Section>

        {/* SECTION 3: Simulator */}
        <Section title="🎮 Interactive Decoder Simulator" accent="#60a5fa">
          <TypeSelector
            selectedType={selectedType}
            onChange={handleTypeChange}
          />
          <div
            style={{
              color: "#6b7280",
              fontSize: "0.8rem",
              marginBottom: "14px",
              padding: "8px 12px",
              background: "rgba(251,191,36,0.05)",
              border: "1px solid rgba(251,191,36,0.15)",
              borderRadius: "8px",
            }}
          >
            💡 <em>Analogy: {DECODER_TYPES[selectedType].analogy}</em>
          </div>
          <DecoderSimulator
            key={selectedType}
            selectedType={selectedType}
            inputVals={inputVals}
            setInputVals={setInputVals}
          />
          <div style={{ marginTop: "24px" }}>
            <HDLCodeGenerator type={selectedType} />
          </div>
        </Section>

        {/* SECTION 4: 7-Seg Demo */}
        <Section title="🔢 7-Segment Display — Live BCD Demo" accent="#00ff88">
          <p
            style={{
              color: "#9ca3af",
              fontSize: "0.88rem",
              lineHeight: "1.6",
              marginBottom: "18px",
            }}
          >
            A BCD-to-7-segment decoder converts a 4-bit BCD number to 7 segment
            control signals. Click any digit below to see which segments light
            up, or use the <strong>Message Scroller</strong> to translate text!
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
            <BCDDigitPad />
            <SevenSegScroller />
          </div>
          <div
            style={{
              marginTop: "18px",
              padding: "14px",
              background: "rgba(251,191,36,0.06)",
              border: "1px solid rgba(251,191,36,0.25)",
              borderRadius: "10px",
            }}
          >
            <h4
              style={{
                color: "#fbbf24",
                marginBottom: "10px",
                fontSize: "0.88rem",
              }}
            >
              💡 7-Segment Label Reference
            </h4>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {[
                ["a", "top horizontal bar"],
                ["b", "top-right vertical"],
                ["c", "bottom-right vertical"],
                ["d", "bottom horizontal bar"],
                ["e", "bottom-left vertical"],
                ["f", "top-left vertical"],
                ["g", "middle horizontal bar"],
              ].map(([seg, name]) => (
                <div
                  key={seg}
                  style={{ display: "flex", gap: "6px", alignItems: "center" }}
                >
                  <span
                    style={{
                      fontFamily: "monospace",
                      color: "#00ff88",
                      fontWeight: "700",
                      width: "14px",
                    }}
                  >
                    {seg}
                  </span>
                  <span style={{ color: "#6b7280", fontSize: "0.78rem" }}>
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* NEW SECTION: Troubleshooting */}
        <Section title="🛠️ Troubleshooting — Find the Logic Fault" accent="#f87171">
          <p
            style={{
              color: "#9ca3af",
              fontSize: "0.88rem",
              lineHeight: "1.6",
              marginBottom: "18px",
            }}
          >
            Real-world circuits aren't always perfect. Use your knowledge of
            decoder truth tables to identify which internal line has a fault.
          </p>
          <LogicErrorDebugger />
        </Section>

        {/* SECTION 5: Function Generator */}
        <Section
          title="🧩 Decoder as Function Generator — Zero Extra Gates!"
          accent="#a78bfa"
        >
          <p
            style={{
              color: "#9ca3af",
              fontSize: "0.88rem",
              lineHeight: "1.6",
              marginBottom: "18px",
            }}
          >
            This is one of the most powerful uses of decoders. Since each output
            = one minterm, you can implement ANY Boolean function using a
            decoder + a single OR gate. No K-map simplification needed for
            implementation!
          </p>
          <FunctionGeneratorDemo />
        </Section>

        {/* SECTION 6: Cascading */}
        <Section
          title="🔗 Cascading Decoders — Building Larger Decoders"
          accent="#fbbf24"
        >
          <p
            style={{
              color: "#9ca3af",
              fontSize: "0.88rem",
              lineHeight: "1.6",
              marginBottom: "18px",
            }}
          >
            Need 16 outputs but only have 2-to-4 decoders? Cascade them! One
            top-level decoder selects which of four child decoders is active
            using the high address bits.
          </p>
          <VisualCascadingDemo />
        </Section>

        {/* SECTION 7: Real World */}
        <Section title="🌍 Real-World Applications" accent="#34d399">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "14px",
            }}
          >
            {[
              {
                icon: "🧠",
                color: "#60a5fa",
                title: "Memory Address Decoding",
                items: [
                  "CPU n-bit address → decoder inputs",
                  "Each output selects one memory chip",
                  "Only active chip drives the bus",
                  "74LS138 is the classic chip",
                ],
              },
              {
                icon: "📟",
                color: "#00ff88",
                title: "7-Segment Display (74LS47)",
                items: [
                  "BCD from counter register",
                  "Decoder drives each LED segment",
                  "Used in clocks, meters, scoreboards",
                  "Handles all 10 decimal digits",
                ],
              },
              {
                icon: "🔀",
                color: "#a78bfa",
                title: "DEMUX (Demultiplexer)",
                items: [
                  "Enable pin = data input line",
                  "Address selects destination output",
                  "Reconstructs TDM multiplexed signals",
                  "Same IC as decoder!",
                ],
              },
              {
                icon: "⚙️",
                color: "#f97316",
                title: "CPU Instruction Decoder",
                items: [
                  "Opcode bits → decoder inputs",
                  "Each output activates one micro-op",
                  "Drives ALU and register controls",
                  "Core of hardwired control units",
                ],
              },
            ].map(({ icon, color, title, items }) => (
              <div
                key={title}
                style={{
                  background: "rgba(12,18,35,0.7)",
                  border: `1px solid ${color}25`,
                  borderRadius: "12px",
                  padding: "18px",
                }}
              >
                <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>
                  {icon}
                </div>
                <h5
                  style={{
                    color,
                    marginBottom: "12px",
                    fontSize: "0.88rem",
                    fontWeight: "700",
                  }}
                >
                  {title}
                </h5>
                <ul
                  style={{
                    color: "#6b7280",
                    paddingLeft: "18px",
                    margin: 0,
                    lineHeight: "1.7",
                    fontSize: "0.83rem",
                  }}
                >
                  {items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* SECTION 8: Quiz */}
        <Section
          title="🧪 Test Yourself — Quiz with Hints & Streaks"
          accent="#6366f1"
        >
          <Quiz />
        </Section>
      </div>

      <TipsPanel />
    </div>
  );
};

export default DecoderPage;
