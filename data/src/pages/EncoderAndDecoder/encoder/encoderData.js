/**
 * encoderData.js — All static data for the Encoder page
 *
 * Structure per encoder type:
 *   label       — human-readable name
 *   inputs      — input pin names  (e.g. ["I0".."I7"])
 *   outputs     — output pin names (e.g. ["A2","A1","A0","V"])
 *   description — one-line summary
 *   analogy     — real-world comparison for students
 *   encode()    — pure function (vals[]) → { [outName]: 0|1, active: number }
 *   booleanEqs  — array of { out, eq, color, explanation, trick }
 *   truthHeaders— column headers for the truth table
 *   truthRows   — string[][] data rows
 */

export const ENCODER_TYPES = {
  // ── 4-to-2 Priority Encoder ─────────────────────────────────────────────────
  "4to2": {
    label: "4-to-2 Priority Encoder",
    inputs: ["I0","I1","I2","I3"],
    outputs: ["A1","A0","V"],
    description: "4 data inputs → 2-bit binary code + Valid flag",
    analogy: "Like a 4-button elevator that shows the highest requested floor",
    encode: (vals) => {
      const [i0, i1, i2, i3] = vals;
      if (i3) return { A1:1, A0:1, V:1, active:3 };
      if (i2) return { A1:1, A0:0, V:1, active:2 };
      if (i1) return { A1:0, A0:1, V:1, active:1 };
      if (i0) return { A1:0, A0:0, V:1, active:0 };
      return { A1:0, A0:0, V:0, active:-1 };
    },
    booleanEqs: [
      { out:"A1", eq:"A1 = I2 + I3",       color:"#f97316", explanation:"A1 is the MSB. It equals 1 for inputs 2 and 3, because both 2 (10₂) and 3 (11₂) have their bit-1 = 1. The rule: just OR the inputs whose binary index has that bit set.", trick:"Binary indices 2=10, 3=11 → both have bit-1 ON → A1 = I2 OR I3" },
      { out:"A0", eq:"A0 = I3 + I1·I2'",   color:"#a78bfa", explanation:"A0 is the LSB. Inputs 1 (01₂) and 3 (11₂) have bit-0=1. But I3 has higher priority than I1, so we use I3 directly. For I1, we must ensure I2 is NOT active (priority masking): I1·I2'.", trick:"For priority: I3 always wins. I1 only fires when I2 is quiet (I2')." },
      { out:"V",  eq:"V = I0 + I1 + I2 + I3", color:"#34d399", explanation:"Valid flag V = 1 whenever ANY input is HIGH. V = 0 means all inputs are LOW — nothing to encode.", trick:"V is simply OR of ALL inputs. If anything is happening, V says so." },
    ],
    truthHeaders: ["Active", "A1", "A0", "V"],
    truthRows: [
      ["none",           "—","—","0"],
      ["I0 only",        "0","0","1"],
      ["I1 only",        "0","1","1"],
      ["I2 only",        "1","0","1"],
      ["I3 only",        "1","1","1"],
      ["I2+I3 (conflict)","1","1","1"],
      ["I1+I2 (conflict)","1","0","1"],
    ],
  },

  // ── 8-to-3 Priority Encoder ─────────────────────────────────────────────────
  "8to3": {
    label: "8-to-3 Priority Encoder",
    inputs: ["I0","I1","I2","I3","I4","I5","I6","I7"],
    outputs: ["A2","A1","A0","V"],
    description: "8 data inputs → 3-bit binary code + Valid flag",
    analogy: "Like a hospital triage system — highest priority patient gets encoded first",
    encode: (vals) => {
      for (let i = 7; i >= 0; i--) {
        if (vals[i]) return { A2:(i>>2)&1, A1:(i>>1)&1, A0:i&1, V:1, active:i };
      }
      return { A2:0, A1:0, A0:0, V:0, active:-1 };
    },
    booleanEqs: [
      { out:"A2", eq:"A2 = I4 + I5 + I6 + I7",       color:"#f97316", explanation:"A2 is bit-2. Indices 4–7 all have bit-2=1. OR those four inputs.", trick:"Indices 4–7 all ≥ 4, so they all have bit-2 ON. Think: top half of 0–7." },
      { out:"A1", eq:"A1 = I2 + I3 + I6 + I7",       color:"#a78bfa", explanation:"A1 is bit-1. Indices with bit-1=1: 2,3,6,7. OR those four.", trick:"Pattern: pairs of 2 ON, 2 OFF, repeating. 0,1 OFF → 2,3 ON → 4,5 OFF → 6,7 ON." },
      { out:"A0", eq:"A0 = I1 + I3 + I5 + I7",       color:"#34d399", explanation:"A0 is bit-0 = 1 for all ODD indices. OR all odd-indexed inputs.", trick:"All ODD numbers have LSB=1. So A0 = OR of all odd-index inputs. Simple!" },
      { out:"V",  eq:"V = I0+I1+I2+I3+I4+I5+I6+I7", color:"#60a5fa", explanation:"Valid: any input active → V=1. Big OR of all 8 inputs.", trick:"V is always just the OR of everything. No exceptions." },
    ],
    truthHeaders: ["Active Input","A2","A1","A0","V"],
    truthRows: [
      ["I0 (0)","0","0","0","1"],["I1 (1)","0","0","1","1"],
      ["I2 (2)","0","1","0","1"],["I3 (3)","0","1","1","1"],
      ["I4 (4)","1","0","0","1"],["I5 (5)","1","0","1","1"],
      ["I6 (6)","1","1","0","1"],["I7 (7)","1","1","1","1"],
    ],
  },

  // ── Decimal-to-BCD ──────────────────────────────────────────────────────────
  BCD: {
    label: "Decimal-to-BCD Encoder",
    inputs: ["D0","D1","D2","D3","D4","D5","D6","D7","D8","D9"],
    outputs: ["A(8)","B(4)","C(2)","D(1)"],
    description: "Decimal digit key (0–9) → 4-bit BCD code",
    analogy: "Like a calculator keypad converting your key-press to binary for the CPU",
    encode: (vals) => {
      for (let i = 9; i >= 0; i--) {
        if (vals[i]) return { "A(8)":(i>>3)&1, "B(4)":(i>>2)&1, "C(2)":(i>>1)&1, "D(1)":i&1, active:i };
      }
      return { "A(8)":0, "B(4)":0, "C(2)":0, "D(1)":0, active:-1 };
    },
    booleanEqs: [
      { out:"A — 8s place", eq:"A = D8 + D9",                    color:"#f97316", explanation:"A is the 8s bit. Only digits 8 and 9 have this bit set.",           trick:"Only the TWO largest decimal digits need the 8s bit." },
      { out:"B — 4s place", eq:"B = D4 + D5 + D6 + D7",         color:"#a78bfa", explanation:"B is the 4s bit. Digits 4–7 all have this bit set.",               trick:"Middle four: 4,5,6,7 all have 4s bit ON. Think: the second quarter." },
      { out:"C — 2s place", eq:"C = D2 + D3 + D6 + D7",         color:"#34d399", explanation:"C is the 2s bit. Digits 2,3,6,7 have it set.",                     trick:"Alternating pairs: 2,3 ON → 4,5 OFF → 6,7 ON. Same pattern as binary bit-1!" },
      { out:"D — 1s place", eq:"D = D1 + D3 + D5 + D7 + D9",   color:"#60a5fa", explanation:"D is the 1s bit. All ODD digits have this bit set.",               trick:"All ODD numbers end in 1 in binary. OR all 5 odd digit keys." },
    ],
    truthHeaders: ["Key Pressed","A(8)","B(4)","C(2)","D(1)"],
    truthRows: [
      ["D0 (0)","0","0","0","0"],["D1 (1)","0","0","0","1"],
      ["D2 (2)","0","0","1","0"],["D3 (3)","0","0","1","1"],
      ["D4 (4)","0","1","0","0"],["D5 (5)","0","1","0","1"],
      ["D6 (6)","0","1","1","0"],["D7 (7)","0","1","1","1"],
      ["D8 (8)","1","0","0","0"],["D9 (9)","1","0","0","1"],
    ],
  },
};

// ─── Tips content ───────────────────────────────────────────────────────────────
export const ENCODER_TIPS = [
  { icon:"🧠", title:"The Binary-Index Trick",  text:"For any output bit Aₖ: find all input indices where bit k = 1 in binary, then OR those inputs. This works for ANY encoder!" },
  { icon:"⚡", title:"Priority Rule",            text:"If multiple inputs are HIGH, the HIGHEST-numbered input wins. The others are ignored. Always check from top to bottom." },
  { icon:"✅", title:"Valid Flag Purpose",        text:"V=0 means 'nothing is happening'. This prevents the system from acting on a garbage code when all inputs are LOW." },
  { icon:"🔄", title:"Encoder vs Decoder",       text:"Encoder compresses (many→few), Decoder expands (few→many). They are mathematical inverses of each other." },
  { icon:"🔧", title:"OR Gates Only!",           text:"A basic (non-priority) encoder uses ONLY OR gates. No NOT, no AND needed. This makes it one of the simplest circuits." },
  { icon:"📐", title:"Size Formula",             text:"An encoder with 2ⁿ inputs produces n output bits. So 4→2, 8→3, 16→4, 256→8. The pattern: outputs = log₂(inputs)." },
  { icon:"🏥", title:"Real World: Keyboard",     text:"Your keyboard has an encoder! When you press 'A', it encodes key 65 into binary and sends it to the CPU. That's an encoder in action." },
  { icon:"🎯", title:"Exam Tip",                 text:"To write encoder equations fast: write all indices in binary, circle bit-k column, OR the corresponding input lines. Takes 30 seconds!" },
];

// ─── Quiz questions ─────────────────────────────────────────────────────────────
export const ENCODER_QUIZ = [
  { q:"4-to-2 encoder: only I2 is HIGH. What is the output code (A1 A0)?", opts:["00","01","10","11"], ans:2, exp:"I2 = index 2 = 10₂. So A1=1, A0=0 → '10'. The output IS the binary version of the active input's index!", hint:"Convert the index number 2 to binary." },
  { q:"8-to-3 encoder: both I3 and I5 are HIGH simultaneously. Which output code appears?", opts:["011 (I3)","101 (I5)","000 (undefined)","111 (error)"], ans:1, exp:"Priority encoder: highest-numbered input wins. I5 > I3. Output = 5 = 101₂. A2=1, A1=0, A0=1.", hint:"Priority means HIGHEST wins. Which is bigger, 3 or 5?" },
  { q:"What does V=0 (Valid=LOW) mean in a priority encoder?", opts:["The code is 000","All inputs are LOW — nothing to encode","An error occurred","The highest input is I0"], ans:1, exp:"V=0 means ALL inputs are LOW. The output code is meaningless (garbage). V=1 means a real, valid code is present.", hint:"V stands for 'Valid'. When nothing is active..." },
  { q:"Decimal-to-BCD encoder: key D7 pressed. What is the BCD output (A B C D)?", opts:["0111","1000","0110","1001"], ans:0, exp:"7 in BCD = 0111₂. A(8s)=0, B(4s)=1, C(2s)=1, D(1s)=1. Just convert 7 to 4-bit binary!", hint:"What is 7 in 4-bit binary? 8+4+2+1..." },
  { q:"In 8-to-3 encoder, why is A0 = I1 + I3 + I5 + I7?", opts:["These are the highest inputs","These are all ODD-indexed inputs","These have A2=1","These have A1=0"], ans:1, exp:"A0 is the LSB. In binary, all odd numbers have their LSB=1 (e.g., 1=001, 3=011, 5=101, 7=111). So A0 = OR of all odd-indexed inputs.", hint:"Which numbers always have their last binary bit = 1?" },
  { q:"What kind of gates does a BASIC (non-priority) encoder use?", opts:["AND gates only","NOT and AND gates","OR gates only","XOR gates"], ans:2, exp:"A basic binary encoder uses ONLY OR gates! Each output bit = OR of inputs whose index has that bit=1. No NOT or AND needed.", hint:"Each output is a logical sum of several inputs..." },
];

export const encoderQuizFeedback = (score, total) => {
  if (score >= total - 1) return "Excellent encoder mastery! You understand priority logic cold.";
  if (score >= Math.floor(total / 2)) return "Good — review the binary-index trick for faster equation writing.";
  return "Keep going — the index-to-binary pattern will click with practice!";
};
