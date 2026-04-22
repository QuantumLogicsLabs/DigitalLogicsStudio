/**
 * decoderData.js — All static data for the Decoder page
 *
 * Keeping data separate from UI means you can add new decoder types
 * (e.g. "4to16") without touching any component files.
 *
 * Structure per decoder type:
 *   label        — human-readable name
 *   codeInputs   — array of input pin names  (e.g. ["A1","A0"])
 *   enableInput  — whether the type has an Enable pin
 *   outputs      — array of output pin names (e.g. ["D0","D1","D2","D3"])
 *   description  — one-line summary
 *   analogy      — real-world comparison for students
 *   decode()     — pure function (codeVals[], enable) → { [outName]: 0|1, active: number }
 *   booleanEqs   — array of { out, eq, color, explanation, trick }
 *   truthHeaders — column headers for the truth table
 *   truthRows    — array of string[] rows
 *   minterms     — array of { idx, binary, desc }
 */

export const DECODER_TYPES = {
  // ── 1-to-2 ──────────────────────────────────────────────────────────────────
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
        out: "D0", eq: "D0 = E · A'", color: "#34d399",
        explanation: "D0 fires when Enable=1 AND A=0. Since D0 is address 0 (binary 0), we complement A to get A'=1 when A=0. Rule: complement any bit that is 0 in the target address.",
        trick: "Address 0 = '0' in binary → complement A to make it a 1 condition.",
      },
      {
        out: "D1", eq: "D1 = E · A", color: "#60a5fa",
        explanation: "D1 fires when Enable=1 AND A=1. Since address 1 has bit A=1, we use A directly (no complement). Rule: keep any bit that is 1 in the target address.",
        trick: "Address 1 = '1' in binary → use A directly, it's already 1 when we need it.",
      },
    ],
    truthHeaders: ["E", "A", "D0", "D1"],
    truthRows: [
      ["0", "x", "0", "0"],
      ["1", "0", "1", "0"],
      ["1", "1", "0", "1"],
    ],
    minterms: [
      { idx: 0, binary: "0", desc: "m0: A'" },
      { idx: 1, binary: "1", desc: "m1: A" },
    ],
  },

  // ── 2-to-4 ──────────────────────────────────────────────────────────────────
  "2to4": {
    label: "2-to-4 Decoder",
    codeInputs: ["A1", "A0"],
    enableInput: true,
    outputs: ["D0", "D1", "D2", "D3"],
    description: "2-bit binary code + Enable → 4 output lines",
    analogy: "Like a building directory that routes a visitor to one of 4 floors",
    decode: (code, en) => {
      if (!en) return { D0: 0, D1: 0, D2: 0, D3: 0, active: -1 };
      const i = (code[0] << 1) | code[1];
      return {
        D0: i === 0 ? 1 : 0, D1: i === 1 ? 1 : 0,
        D2: i === 2 ? 1 : 0, D3: i === 3 ? 1 : 0,
        active: i,
      };
    },
    booleanEqs: [
      { out: "D0", eq: "D0 = E · A1' · A0'", color: "#34d399", explanation: "Address 00 → both bits are 0 → complement both. D0 fires ONLY when A1=0 AND A0=0. The equation is the minterm m0.", trick: "Address 00: both 0s → both complemented. A1'·A0'" },
      { out: "D1", eq: "D1 = E · A1' · A0",  color: "#60a5fa", explanation: "Address 01 → A1=0 (complement it), A0=1 (keep it). D1 fires when A1=0 AND A0=1. Minterm m1.",          trick: "Address 01: first bit 0 → A1', second bit 1 → A0. A1'·A0" },
      { out: "D2", eq: "D2 = E · A1 · A0'",  color: "#a78bfa", explanation: "Address 10 → A1=1 (keep it), A0=0 (complement it). D2 fires when A1=1 AND A0=0. Minterm m2.",          trick: "Address 10: first bit 1 → A1, second bit 0 → A0'. A1·A0'" },
      { out: "D3", eq: "D3 = E · A1 · A0",   color: "#fbbf24", explanation: "Address 11 → both bits are 1 → keep both direct. D3 fires when A1=1 AND A0=1. Minterm m3.",           trick: "Address 11: both 1s → both direct. No complements needed! A1·A0" },
    ],
    truthHeaders: ["E", "A1", "A0", "D0", "D1", "D2", "D3"],
    truthRows: [
      ["0", "x", "x", "0", "0", "0", "0"],
      ["1", "0", "0", "1", "0", "0", "0"],
      ["1", "0", "1", "0", "1", "0", "0"],
      ["1", "1", "0", "0", "0", "1", "0"],
      ["1", "1", "1", "0", "0", "0", "1"],
    ],
    minterms: [
      { idx: 0, binary: "00", desc: "m0: A1'A0'" },
      { idx: 1, binary: "01", desc: "m1: A1'A0" },
      { idx: 2, binary: "10", desc: "m2: A1A0'" },
      { idx: 3, binary: "11", desc: "m3: A1A0" },
    ],
  },

  // ── 3-to-8 ──────────────────────────────────────────────────────────────────
  "3to8": {
    label: "3-to-8 Decoder",
    codeInputs: ["A2", "A1", "A0"],
    enableInput: true,
    outputs: ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7"],
    description: "3-bit binary code + Enable → 8 output lines",
    analogy: "Like a memory chip select: each output enables exactly one memory chip",
    decode: (code, en) => {
      const out = {};
      for (let i = 0; i < 8; i++) out[`D${i}`] = 0;
      if (!en) { out.active = -1; return out; }
      const idx = (code[0] << 2) | (code[1] << 1) | code[2];
      out[`D${idx}`] = 1;
      out.active = idx;
      return out;
    },
    booleanEqs: [
      { out: "D0", eq: "D0 = E·A2'·A1'·A0'", color: "#34d399", explanation: "000 → all 0 → all complemented. Minterm m0.", trick: "All zeros → all complemented. The easiest to remember!" },
      { out: "D1", eq: "D1 = E·A2'·A1'·A0",  color: "#4ade80", explanation: "001 → A0=1 direct, A2 & A1 complemented. Minterm m1.", trick: "Only the last bit is 1 → only A0 is direct." },
      { out: "D2", eq: "D2 = E·A2'·A1·A0'",  color: "#60a5fa", explanation: "010 → A1=1 direct, A2 & A0 complemented. Minterm m2.", trick: "Middle bit is 1 → A1 is direct, others complemented." },
      { out: "D3", eq: "D3 = E·A2'·A1·A0",   color: "#93c5fd", explanation: "011 → A1 & A0 direct, only A2 complemented. Minterm m3.", trick: "Two last bits are 1 → A1 and A0 direct, A2' still complements." },
      { out: "D4", eq: "D4 = E·A2·A1'·A0'",  color: "#fbbf24", explanation: "100 → A2=1 direct, A1 & A0 complemented. Minterm m4.", trick: "First bit is 1 → A2 direct, others complemented." },
      { out: "D5", eq: "D5 = E·A2·A1'·A0",   color: "#f97316", explanation: "101 → A2 & A0 direct, A1 complemented. Minterm m5.", trick: "Bits 2 and 0 are 1 → A2 and A0 direct." },
      { out: "D6", eq: "D6 = E·A2·A1·A0'",   color: "#a78bfa", explanation: "110 → A2 & A1 direct, A0 complemented. Minterm m6.", trick: "First two bits are 1 → A2·A1 direct, A0' complement." },
      { out: "D7", eq: "D7 = E·A2·A1·A0",    color: "#f472b6", explanation: "111 → all 1 → all direct. No complements at all! Minterm m7.", trick: "All ones → no complements. The other easy one!" },
    ],
    truthHeaders: ["E", "A2", "A1", "A0", "D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7"],
    truthRows: Array.from({ length: 8 }, (_, i) => {
      const a2 = (i >> 2) & 1, a1 = (i >> 1) & 1, a0 = i & 1;
      const row = ["1", String(a2), String(a1), String(a0)];
      for (let j = 0; j < 8; j++) row.push(j === i ? "1" : "0");
      return row;
    }),
    minterms: Array.from({ length: 8 }, (_, i) => ({
      idx: i, binary: i.toString(2).padStart(3, "0"), desc: `m${i}`,
    })),
  },

  // ── BCD-to-7-Segment ────────────────────────────────────────────────────────
  BCD7seg: {
    label: "BCD-to-7-Segment",
    codeInputs: ["A", "B", "C", "D"],
    enableInput: false,
    outputs: ["a", "b", "c", "d", "e", "f", "g"],
    description: "4-bit BCD → 7 segment display signals",
    analogy: "Like translating a number to a specific set of lit-up bars on a display",
    decode: (code) => {
      // Lookup table: each row = [a,b,c,d,e,f,g] for digits 0–9
      const table = [
        [1,1,1,1,1,1,0], // 0
        [0,1,1,0,0,0,0], // 1
        [1,1,0,1,1,0,1], // 2
        [1,1,1,1,0,0,1], // 3
        [0,1,1,0,0,1,1], // 4
        [1,0,1,1,0,1,1], // 5
        [1,0,1,1,1,1,1], // 6
        [1,1,1,0,0,0,0], // 7
        [1,1,1,1,1,1,1], // 8
        [1,1,1,1,0,1,1], // 9
      ];
      const idx = (code[0] << 3) | (code[1] << 2) | (code[2] << 1) | code[3];
      if (idx > 9) return { a:0, b:0, c:0, d:0, e:0, f:0, g:0, active: -1 };
      const s = table[idx];
      return { a:s[0], b:s[1], c:s[2], d:s[3], e:s[4], f:s[5], g:s[6], active: idx };
    },
    booleanEqs: [
      { out: "a — top bar",      eq: "a = A + C + B'D' + BD",       color: "#f97316", explanation: "Segment a (top bar) is OFF only for digits 1 and 4.",       trick: "OFF for 1,4. All other digits need the top bar." },
      { out: "b — top-right",   eq: "b = B' + CD + C'D'",           color: "#fbbf24", explanation: "Segment b is OFF only for digits 5 and 6.",                 trick: "OFF for 5,6. B'=1 handles digits 0,1,2,3 at once." },
      { out: "c — bottom-right", eq: "c = B + C' + D",              color: "#34d399", explanation: "Segment c is OFF ONLY for digit 2. Simplest 7-seg equation!", trick: "OFF only for digit 2 — simplest equation in the whole decoder!" },
      { out: "d — bottom bar",   eq: "d = A + B'C' + C'D' + BC'D + CD'", color: "#60a5fa", explanation: "Segment d is the most complex — ON for 0,2,3,5,6,8.", trick: "d is the hardest. ON for many digits, needs 4 AND terms." },
      { out: "e — bottom-left",  eq: "e = B'D' + CD'",              color: "#a78bfa", explanation: "Segment e is ON only for 0,2,6,8. Just two product terms.", trick: "D'=0 means the digit is even AND needs the left side." },
      { out: "f — top-left",     eq: "f = A + BC' + BD' + C'D'",   color: "#f472b6", explanation: "Segment f is ON for 0,4,5,6,7,8,9 — OFF only for 1,2,3.", trick: "ON for most digits. OFF for 1,2,3 — the 'plain' numbers." },
      { out: "g — middle bar",   eq: "g = A + BC' + BC + C'D",     color: "#c084fc", explanation: "Segment g is OFF only for 0 and 1.", trick: "g is OFF only for 0 (no middle) and 1 (just sticks)." },
    ],
    truthHeaders: ["A", "B", "C", "D", "a", "b", "c", "d", "e", "f", "g"],
    truthRows: [
      ["0","0","0","0","1","1","1","1","1","1","0"],
      ["0","0","0","1","0","1","1","0","0","0","0"],
      ["0","0","1","0","1","1","0","1","1","0","1"],
      ["0","0","1","1","1","1","1","1","0","0","1"],
      ["0","1","0","0","0","1","1","0","0","1","1"],
      ["0","1","0","1","1","0","1","1","0","1","1"],
      ["0","1","1","0","1","0","1","1","1","1","1"],
      ["0","1","1","1","1","1","1","0","0","0","0"],
      ["1","0","0","0","1","1","1","1","1","1","1"],
      ["1","0","0","1","1","1","1","1","0","1","1"],
    ],
    minterms: [],
  },
};

// ─── Tips content ───────────────────────────────────────────────────────────────
export const DECODER_TIPS = [
  { icon: "📐", title: "The Minterm Rule", text: "Each decoder output Dᵢ is exactly minterm mᵢ. Write the binary for i, then: bit=1 → use input directly, bit=0 → complement it. AND them all." },
  { icon: "🔌", title: "Enable Pin is Power", text: "E=0 kills ALL outputs. E=1 lets them work. In memory systems, this is how chips are selected — only one chip has E=1 at a time." },
  { icon: "🧩", title: "Decoder as Function Generator", text: "Any Boolean function can be built from a decoder! Just OR the outputs for rows where your function = 1. No AND gates needed!" },
  { icon: "📦", title: "Cascading Decoders", text: "A 2×4 decoder with cascading can become 4×16! Connect your high address bits to a 2×4 decoder, each output enables one of four 2×4 decoders." },
  { icon: "🔢", title: "Count the Gates", text: "An n-to-2ⁿ decoder needs exactly 2ⁿ AND gates (one per output), n NOT gates (one per input), and 1 enable connection per AND gate." },
  { icon: "⚡", title: "Output Is Exclusive", text: "Exactly ONE decoder output is HIGH at any time (when E=1). This is called 'one-hot encoding' — guaranteed mutual exclusion." },
  { icon: "🏥", title: "Real World: Memory Chips", text: "A 20-bit CPU address uses bits [19:18] → 2-to-4 decoder → 4 chip-select lines. Each selects a different 256KB memory region." },
  { icon: "🎯", title: "Exam Trick", text: "To find which output is active: convert address to decimal. D(decimal) is HIGH. Example: A1=1,A0=1 → 11₂ = 3 → D3 is HIGH." },
];

// ─── Quiz questions ─────────────────────────────────────────────────────────────
export const DECODER_QUIZ = [
  { q: "2-to-4 decoder: A1=1, A0=0, E=1. Which output is HIGH?", opts: ["D0","D1","D2","D3"], ans: 2, exp: "Binary 10 = decimal 2 → D2 HIGH. Just convert A1A0 from binary to decimal to find which D is active!", hint: "Convert the binary number A1A0 = 10 to decimal." },
  { q: "3-to-8 decoder. Boolean equation for D5?", opts: ["E·A2'·A1·A0","E·A2·A1'·A0","E·A2·A1·A0'","E·A2'·A1·A0'"], ans: 1, exp: "5 = 101₂ → A2=1 (direct), A1=0 (complement→A1'), A0=1 (direct). Match each bit: 1=direct, 0=complemented.", hint: "Write 5 in binary: 101. Then: bit=1 means direct, bit=0 means complemented." },
  { q: "How many AND gates in a 3-to-8 decoder?", opts: ["3","6","8","16"], ans: 2, exp: "2³ = 8 outputs → 8 AND gates. One AND gate per decoder output. Formula: always 2ⁿ AND gates.", hint: "Formula: 2^(number of input bits). Here n=3." },
  { q: "Enable E=0. What happens to ALL outputs?", opts: ["All go HIGH","Selected output HIGH","All go LOW","Output is undefined"], ans: 2, exp: "E=0 disables the entire decoder chip. All outputs go LOW regardless of address inputs. E acts as a master chip-select or on/off switch.", hint: "E=0 means the chip is disabled. Think of it as cutting power." },
  { q: "You want to implement F = A'B' + AB using a decoder. You use:", opts: ["8 AND gates","A 2-to-4 decoder + OR gate","Only NOT gates","A 4-to-1 MUX"], ans: 1, exp: "Decoder outputs ARE minterms! F = m0 + m3 (where inputs are 00 and 11). Just OR D0 and D3. No extra AND gates needed at all!", hint: "Which minterms (rows) make F=1? Those are rows 00 and 11." },
  { q: "BCD input 1001 to 7-segment decoder. Which segment is OFF?", opts: ["a (top)","b (top-right)","e (bottom-left)","g (middle)"], ans: 2, exp: "1001₂ = digit 9. Digit 9 shows a,b,c,d,f,g ON. Segment e (bottom-left) is OFF for 9.", hint: "1001₂ = 9 in decimal. Look up digit 9 in your memory — which bars does it NOT light?" },
];

// Feedback message at end of quiz based on score
export const decoderQuizFeedback = (score, total) => {
  if (score >= total - 1) return "Excellent! You understand minterm logic and enable pins cold.";
  if (score >= Math.floor(total / 2)) return "Good — practice the binary→decimal conversion for fast output identification.";
  return "Review the minterm rule: binary 0 → complement, binary 1 → direct.";
};
