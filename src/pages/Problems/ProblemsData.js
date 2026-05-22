// Digital Logic Design Problems - LeetCode style

const problemsData = [
  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 1 — Half Adder
  // Inputs: A, B  |  Outputs: S, C
  // S = A⊕B,  C = A·B
  // 2^2 = 4 rows — was already complete ✓
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 1,
    title: "Half Adder",
    difficulty: "Easy",
    tags: ["Combinational", "Arithmetic"],
    description:
      "Design a Half Adder circuit that takes two 1-bit inputs A and B, and produces a Sum (S) and Carry (C) output.",
    truthTable: [
      { A: 0, B: 0, S: 0, C: 0 },
      { A: 0, B: 1, S: 1, C: 0 },
      { A: 1, B: 0, S: 1, C: 0 },
      { A: 1, B: 1, S: 0, C: 1 },
    ],
    equations: ["S = A ⊕ B", "C = A · B"],
    hint: "Sum uses XOR, Carry uses AND.",
    inputs: ["A", "B"],
    outputs: ["S", "C"],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 2 — Full Adder
  // Inputs: A, B, Cin  |  Outputs: S, Cout
  // 2^3 = 8 rows — was already complete ✓
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 2,
    title: "Full Adder",
    difficulty: "Easy",
    tags: ["Combinational", "Arithmetic"],
    description:
      "Design a Full Adder with inputs A, B, and Carry-In (Cin), producing Sum (S) and Carry-Out (Cout).",
    truthTable: [
      { A: 0, B: 0, Cin: 0, S: 0, Cout: 0 },
      { A: 0, B: 0, Cin: 1, S: 1, Cout: 0 },
      { A: 0, B: 1, Cin: 0, S: 1, Cout: 0 },
      { A: 0, B: 1, Cin: 1, S: 0, Cout: 1 },
      { A: 1, B: 0, Cin: 0, S: 1, Cout: 0 },
      { A: 1, B: 0, Cin: 1, S: 0, Cout: 1 },
      { A: 1, B: 1, Cin: 0, S: 0, Cout: 1 },
      { A: 1, B: 1, Cin: 1, S: 1, Cout: 1 },
    ],
    equations: ["S = A ⊕ B ⊕ Cin", "Cout = AB + BCin + ACin"],
    hint: "Combine two Half Adders with an OR gate for Carry-Out.",
    inputs: ["A", "B", "Cin"],
    outputs: ["S", "Cout"],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 17 — Half Subtractor
  // Inputs: A, B  |  Outputs: D, Bout
  // D = A⊕B,  Bout = A'·B
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 17,
    title: "Half Subtractor",
    difficulty: "Easy",
    tags: ["Combinational", "Arithmetic", "Subtractor"],
    description:
      "Design a Half Subtractor circuit that subtracts one 1-bit input B from A, producing Difference (D) and Borrow-Out (Bout).",
    truthTable: [
      { A: 0, B: 0, D: 0, Bout: 0 },
      { A: 0, B: 1, D: 1, Bout: 1 },
      { A: 1, B: 0, D: 1, Bout: 0 },
      { A: 1, B: 1, D: 0, Bout: 0 },
    ],
    equations: ["D = A ⊕ B", "Bout = A' · B"],
    hint: "Difference uses XOR. Borrow happens only when A=0 and B=1, so use NOT A AND B.",
    inputs: ["A", "B"],
    outputs: ["D", "Bout"],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 18 — Full Subtractor
  // Inputs: A, B, Bin  |  Outputs: D, Bout
  // D = A⊕B⊕Bin,  Bout = A'B + A'Bin + BBin
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 18,
    title: "Full Subtractor",
    difficulty: "Medium",
    tags: ["Combinational", "Arithmetic", "Subtractor"],
    description:
      "Design a Full Subtractor with inputs A, B, and Borrow-In (Bin), producing Difference (D) and Borrow-Out (Bout).",
    truthTable: [
      { A: 0, B: 0, Bin: 0, D: 0, Bout: 0 },
      { A: 0, B: 0, Bin: 1, D: 1, Bout: 1 },
      { A: 0, B: 1, Bin: 0, D: 1, Bout: 1 },
      { A: 0, B: 1, Bin: 1, D: 0, Bout: 1 },
      { A: 1, B: 0, Bin: 0, D: 1, Bout: 0 },
      { A: 1, B: 0, Bin: 1, D: 0, Bout: 0 },
      { A: 1, B: 1, Bin: 0, D: 0, Bout: 0 },
      { A: 1, B: 1, Bin: 1, D: 1, Bout: 1 },
    ],
    equations: ["D = A ⊕ B ⊕ Bin", "Bout = A'B + A'Bin + B·Bin"],
    hint: "Use XOR for Difference. Borrow-Out is 1 when B + Bin is greater than A.",
    inputs: ["A", "B", "Bin"],
    outputs: ["D", "Bout"],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 3 — 2-to-1 Multiplexer
  // Inputs: S, I0, I1  |  Output: Y
  // Y = S'·I0 + S·I1
  // BUG FIX: was only 4 rows — 2^3 = 8 rows needed.
  // Missing rows caused expectedColumn() to return 0 for unmatched combos,
  // making every correct circuit appear wrong.
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 3,
    title: "2-to-1 Multiplexer",
    difficulty: "Easy",
    tags: ["Combinational", "MUX"],
    description:
      "Build a 2-to-1 MUX with inputs I0, I1 and select line S. Output Y = I0 when S=0, Y = I1 when S=1.",
    truthTable: [
      // S=0 → Y follows I0
      { S: 0, I0: 0, I1: 0, Y: 0 },
      { S: 0, I0: 0, I1: 1, Y: 0 }, // ← was missing
      { S: 0, I0: 1, I1: 0, Y: 1 },
      { S: 0, I0: 1, I1: 1, Y: 1 }, // ← was missing
      // S=1 → Y follows I1
      { S: 1, I0: 0, I1: 0, Y: 0 },
      { S: 1, I0: 0, I1: 1, Y: 1 },
      { S: 1, I0: 1, I1: 0, Y: 0 }, // ← was missing
      { S: 1, I0: 1, I1: 1, Y: 1 }, // ← was missing
    ],
    equations: ["Y = S'·I0 + S·I1"],
    hint: "Use two AND gates, one NOT gate, and one OR gate.",
    inputs: ["S", "I0", "I1"],
    outputs: ["Y"],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 4 — 4-to-1 Multiplexer
  // Inputs: S1, S0, I0, I1, I2, I3  |  Output: Y
  // Y = S1'S0'·I0 + S1'S0·I1 + S1S0'·I2 + S1S0·I3
  // BUG FIX: truth table had symbolic strings "I0","I1","I2","I3" as Y values.
  // Number("I0") = NaN so every expected value was 0, rejecting all circuits.
  // Fixed: full explicit 2^6 = 64 row truth table with concrete 0/1 values.
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 4,
    title: "4-to-1 Multiplexer",
    difficulty: "Medium",
    tags: ["Combinational", "MUX"],
    description:
      "Design a 4-to-1 MUX with 4 data inputs (I0–I3), 2 select lines (S1, S0), and one output Y.",
    truthTable: [
      // S1=0, S0=0 → Y = I0
      { S1: 0, S0: 0, I0: 0, I1: 0, I2: 0, I3: 0, Y: 0 },
      { S1: 0, S0: 0, I0: 0, I1: 0, I2: 0, I3: 1, Y: 0 },
      { S1: 0, S0: 0, I0: 0, I1: 0, I2: 1, I3: 0, Y: 0 },
      { S1: 0, S0: 0, I0: 0, I1: 0, I2: 1, I3: 1, Y: 0 },
      { S1: 0, S0: 0, I0: 0, I1: 1, I2: 0, I3: 0, Y: 0 },
      { S1: 0, S0: 0, I0: 0, I1: 1, I2: 0, I3: 1, Y: 0 },
      { S1: 0, S0: 0, I0: 0, I1: 1, I2: 1, I3: 0, Y: 0 },
      { S1: 0, S0: 0, I0: 0, I1: 1, I2: 1, I3: 1, Y: 0 },
      { S1: 0, S0: 0, I0: 1, I1: 0, I2: 0, I3: 0, Y: 1 },
      { S1: 0, S0: 0, I0: 1, I1: 0, I2: 0, I3: 1, Y: 1 },
      { S1: 0, S0: 0, I0: 1, I1: 0, I2: 1, I3: 0, Y: 1 },
      { S1: 0, S0: 0, I0: 1, I1: 0, I2: 1, I3: 1, Y: 1 },
      { S1: 0, S0: 0, I0: 1, I1: 1, I2: 0, I3: 0, Y: 1 },
      { S1: 0, S0: 0, I0: 1, I1: 1, I2: 0, I3: 1, Y: 1 },
      { S1: 0, S0: 0, I0: 1, I1: 1, I2: 1, I3: 0, Y: 1 },
      { S1: 0, S0: 0, I0: 1, I1: 1, I2: 1, I3: 1, Y: 1 },
      // S1=0, S0=1 → Y = I1
      { S1: 0, S0: 1, I0: 0, I1: 0, I2: 0, I3: 0, Y: 0 },
      { S1: 0, S0: 1, I0: 0, I1: 0, I2: 0, I3: 1, Y: 0 },
      { S1: 0, S0: 1, I0: 0, I1: 0, I2: 1, I3: 0, Y: 0 },
      { S1: 0, S0: 1, I0: 0, I1: 0, I2: 1, I3: 1, Y: 0 },
      { S1: 0, S0: 1, I0: 0, I1: 1, I2: 0, I3: 0, Y: 1 },
      { S1: 0, S0: 1, I0: 0, I1: 1, I2: 0, I3: 1, Y: 1 },
      { S1: 0, S0: 1, I0: 0, I1: 1, I2: 1, I3: 0, Y: 1 },
      { S1: 0, S0: 1, I0: 0, I1: 1, I2: 1, I3: 1, Y: 1 },
      { S1: 0, S0: 1, I0: 1, I1: 0, I2: 0, I3: 0, Y: 0 },
      { S1: 0, S0: 1, I0: 1, I1: 0, I2: 0, I3: 1, Y: 0 },
      { S1: 0, S0: 1, I0: 1, I1: 0, I2: 1, I3: 0, Y: 0 },
      { S1: 0, S0: 1, I0: 1, I1: 0, I2: 1, I3: 1, Y: 0 },
      { S1: 0, S0: 1, I0: 1, I1: 1, I2: 0, I3: 0, Y: 1 },
      { S1: 0, S0: 1, I0: 1, I1: 1, I2: 0, I3: 1, Y: 1 },
      { S1: 0, S0: 1, I0: 1, I1: 1, I2: 1, I3: 0, Y: 1 },
      { S1: 0, S0: 1, I0: 1, I1: 1, I2: 1, I3: 1, Y: 1 },
      // S1=1, S0=0 → Y = I2
      { S1: 1, S0: 0, I0: 0, I1: 0, I2: 0, I3: 0, Y: 0 },
      { S1: 1, S0: 0, I0: 0, I1: 0, I2: 0, I3: 1, Y: 0 },
      { S1: 1, S0: 0, I0: 0, I1: 0, I2: 1, I3: 0, Y: 1 },
      { S1: 1, S0: 0, I0: 0, I1: 0, I2: 1, I3: 1, Y: 1 },
      { S1: 1, S0: 0, I0: 0, I1: 1, I2: 0, I3: 0, Y: 0 },
      { S1: 1, S0: 0, I0: 0, I1: 1, I2: 0, I3: 1, Y: 0 },
      { S1: 1, S0: 0, I0: 0, I1: 1, I2: 1, I3: 0, Y: 1 },
      { S1: 1, S0: 0, I0: 0, I1: 1, I2: 1, I3: 1, Y: 1 },
      { S1: 1, S0: 0, I0: 1, I1: 0, I2: 0, I3: 0, Y: 0 },
      { S1: 1, S0: 0, I0: 1, I1: 0, I2: 0, I3: 1, Y: 0 },
      { S1: 1, S0: 0, I0: 1, I1: 0, I2: 1, I3: 0, Y: 1 },
      { S1: 1, S0: 0, I0: 1, I1: 0, I2: 1, I3: 1, Y: 1 },
      { S1: 1, S0: 0, I0: 1, I1: 1, I2: 0, I3: 0, Y: 0 },
      { S1: 1, S0: 0, I0: 1, I1: 1, I2: 0, I3: 1, Y: 0 },
      { S1: 1, S0: 0, I0: 1, I1: 1, I2: 1, I3: 0, Y: 1 },
      { S1: 1, S0: 0, I0: 1, I1: 1, I2: 1, I3: 1, Y: 1 },
      // S1=1, S0=1 → Y = I3
      { S1: 1, S0: 1, I0: 0, I1: 0, I2: 0, I3: 0, Y: 0 },
      { S1: 1, S0: 1, I0: 0, I1: 0, I2: 0, I3: 1, Y: 1 },
      { S1: 1, S0: 1, I0: 0, I1: 0, I2: 1, I3: 0, Y: 0 },
      { S1: 1, S0: 1, I0: 0, I1: 0, I2: 1, I3: 1, Y: 1 },
      { S1: 1, S0: 1, I0: 0, I1: 1, I2: 0, I3: 0, Y: 0 },
      { S1: 1, S0: 1, I0: 0, I1: 1, I2: 0, I3: 1, Y: 1 },
      { S1: 1, S0: 1, I0: 0, I1: 1, I2: 1, I3: 0, Y: 0 },
      { S1: 1, S0: 1, I0: 0, I1: 1, I2: 1, I3: 1, Y: 1 },
      { S1: 1, S0: 1, I0: 1, I1: 0, I2: 0, I3: 0, Y: 0 },
      { S1: 1, S0: 1, I0: 1, I1: 0, I2: 0, I3: 1, Y: 1 },
      { S1: 1, S0: 1, I0: 1, I1: 0, I2: 1, I3: 0, Y: 0 },
      { S1: 1, S0: 1, I0: 1, I1: 0, I2: 1, I3: 1, Y: 1 },
      { S1: 1, S0: 1, I0: 1, I1: 1, I2: 0, I3: 0, Y: 0 },
      { S1: 1, S0: 1, I0: 1, I1: 1, I2: 0, I3: 1, Y: 1 },
      { S1: 1, S0: 1, I0: 1, I1: 1, I2: 1, I3: 0, Y: 0 },
      { S1: 1, S0: 1, I0: 1, I1: 1, I2: 1, I3: 1, Y: 1 },
    ],
    equations: ["Y = S1'S0'·I0 + S1'S0·I1 + S1S0'·I2 + S1S0·I3"],
    // Compact display table: one representative row per select combination
    // Full 64-row truth table is kept above for circuit validation
    displayTruthTable: [
      { S1: 0, S0: 0, "Selected Input": "I0", Y: "I0" },
      { S1: 0, S0: 1, "Selected Input": "I1", Y: "I1" },
      { S1: 1, S0: 0, "Selected Input": "I2", Y: "I2" },
      { S1: 1, S0: 1, "Selected Input": "I3", Y: "I3" },
    ],
    hint: "Use four AND gates (3-input each), one OR gate (4-input), and NOT gates for S1 and S0.",
    inputs: ["S1", "S0", "I0", "I1", "I2", "I3"],
    outputs: ["Y"],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 4b — 8-to-1 Multiplexer
  // Inputs: S2, S1, S0, I0–I7  |  Output: Y
  // Y = the data input selected by the 3-bit address S2S1S0
  // Truth table: 2^3 = 8 rows (one per address — Y just follows the selected I)
  // Using compact form: for each address combo, show Y = that Ix value.
  // Full explicit table with 2^11 = 2048 rows is impractical; instead we use
  // the 8-row "address → selected input" format that the validator understands
  // when we parameterise each row so only the selected I bit matters.
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 9,
    title: "8-to-1 Multiplexer",
    difficulty: "Hard",
    tags: ["Combinational", "MUX"],
    description:
      "Design an 8-to-1 MUX with 8 data inputs (I0–I7), 3 select lines (S2, S1, S0), and one output Y. Y equals the data input addressed by the 3-bit select value.",
    // Each row: selects are fixed, the addressed Ix is set to 1 and all others 0 → Y=1.
    // Then the complement row (addressed Ix = 0, others X) → Y=0.
    // We use the minimal 16-row form: for each of the 8 addresses, one row where
    // the addressed input is 1 (Y=1) and one where it is 0 (Y=0).
    truthTable: [
      // address 0 (S2=0,S1=0,S0=0) → Y = I0
      {
        S2: 0,
        S1: 0,
        S0: 0,
        I0: 0,
        I1: 0,
        I2: 0,
        I3: 0,
        I4: 0,
        I5: 0,
        I6: 0,
        I7: 0,
        Y: 0,
      },
      {
        S2: 0,
        S1: 0,
        S0: 0,
        I0: 1,
        I1: 0,
        I2: 0,
        I3: 0,
        I4: 0,
        I5: 0,
        I6: 0,
        I7: 0,
        Y: 1,
      },
      // address 1 (S2=0,S1=0,S0=1) → Y = I1
      {
        S2: 0,
        S1: 0,
        S0: 1,
        I0: 0,
        I1: 0,
        I2: 0,
        I3: 0,
        I4: 0,
        I5: 0,
        I6: 0,
        I7: 0,
        Y: 0,
      },
      {
        S2: 0,
        S1: 0,
        S0: 1,
        I0: 0,
        I1: 1,
        I2: 0,
        I3: 0,
        I4: 0,
        I5: 0,
        I6: 0,
        I7: 0,
        Y: 1,
      },
      // address 2 (S2=0,S1=1,S0=0) → Y = I2
      {
        S2: 0,
        S1: 1,
        S0: 0,
        I0: 0,
        I1: 0,
        I2: 0,
        I3: 0,
        I4: 0,
        I5: 0,
        I6: 0,
        I7: 0,
        Y: 0,
      },
      {
        S2: 0,
        S1: 1,
        S0: 0,
        I0: 0,
        I1: 0,
        I2: 1,
        I3: 0,
        I4: 0,
        I5: 0,
        I6: 0,
        I7: 0,
        Y: 1,
      },
      // address 3 (S2=0,S1=1,S0=1) → Y = I3
      {
        S2: 0,
        S1: 1,
        S0: 1,
        I0: 0,
        I1: 0,
        I2: 0,
        I3: 0,
        I4: 0,
        I5: 0,
        I6: 0,
        I7: 0,
        Y: 0,
      },
      {
        S2: 0,
        S1: 1,
        S0: 1,
        I0: 0,
        I1: 0,
        I2: 0,
        I3: 1,
        I4: 0,
        I5: 0,
        I6: 0,
        I7: 0,
        Y: 1,
      },
      // address 4 (S2=1,S1=0,S0=0) → Y = I4
      {
        S2: 1,
        S1: 0,
        S0: 0,
        I0: 0,
        I1: 0,
        I2: 0,
        I3: 0,
        I4: 0,
        I5: 0,
        I6: 0,
        I7: 0,
        Y: 0,
      },
      {
        S2: 1,
        S1: 0,
        S0: 0,
        I0: 0,
        I1: 0,
        I2: 0,
        I3: 0,
        I4: 1,
        I5: 0,
        I6: 0,
        I7: 0,
        Y: 1,
      },
      // address 5 (S2=1,S1=0,S0=1) → Y = I5
      {
        S2: 1,
        S1: 0,
        S0: 1,
        I0: 0,
        I1: 0,
        I2: 0,
        I3: 0,
        I4: 0,
        I5: 0,
        I6: 0,
        I7: 0,
        Y: 0,
      },
      {
        S2: 1,
        S1: 0,
        S0: 1,
        I0: 0,
        I1: 0,
        I2: 0,
        I3: 0,
        I4: 0,
        I5: 1,
        I6: 0,
        I7: 0,
        Y: 1,
      },
      // address 6 (S2=1,S1=1,S0=0) → Y = I6
      {
        S2: 1,
        S1: 1,
        S0: 0,
        I0: 0,
        I1: 0,
        I2: 0,
        I3: 0,
        I4: 0,
        I5: 0,
        I6: 0,
        I7: 0,
        Y: 0,
      },
      {
        S2: 1,
        S1: 1,
        S0: 0,
        I0: 0,
        I1: 0,
        I2: 0,
        I3: 0,
        I4: 0,
        I5: 0,
        I6: 1,
        I7: 0,
        Y: 1,
      },
      // address 7 (S2=1,S1=1,S0=1) → Y = I7
      {
        S2: 1,
        S1: 1,
        S0: 1,
        I0: 0,
        I1: 0,
        I2: 0,
        I3: 0,
        I4: 0,
        I5: 0,
        I6: 0,
        I7: 0,
        Y: 0,
      },
      {
        S2: 1,
        S1: 1,
        S0: 1,
        I0: 0,
        I1: 0,
        I2: 0,
        I3: 0,
        I4: 0,
        I5: 0,
        I6: 0,
        I7: 1,
        Y: 1,
      },
    ],
    equations: [
      "Y = S2'S1'S0'·I0 + S2'S1'S0·I1 + S2'S1S0'·I2 + S2'S1S0·I3",
      "  + S2S1'S0'·I4 + S2S1'S0·I5  + S2S1S0'·I6  + S2S1S0·I7",
    ],
    // Compact display: one row per select address showing which input routes to Y
    // Full 16-row validation table is kept above
    displayTruthTable: [
      { S2: 0, S1: 0, S0: 0, "Routes to Y": "I0" },
      { S2: 0, S1: 0, S0: 1, "Routes to Y": "I1" },
      { S2: 0, S1: 1, S0: 0, "Routes to Y": "I2" },
      { S2: 0, S1: 1, S0: 1, "Routes to Y": "I3" },
      { S2: 1, S1: 0, S0: 0, "Routes to Y": "I4" },
      { S2: 1, S1: 0, S0: 1, "Routes to Y": "I5" },
      { S2: 1, S1: 1, S0: 0, "Routes to Y": "I6" },
      { S2: 1, S1: 1, S0: 1, "Routes to Y": "I7" },
    ],
    hint: "Use eight 4-input AND gates (one per data input, gated with 3 select lines and the data bit), then OR all eight together. Add NOT gates for S2, S1, S0 complements.",
    inputs: ["S2", "S1", "S0", "I0", "I1", "I2", "I3", "I4", "I5", "I6", "I7"],
    outputs: ["Y"],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 5 — 1-to-2 Demultiplexer
  // Inputs: D, S  |  Outputs: Y0, Y1
  // Y0 = D·S',  Y1 = D·S
  // 2^2 = 4 rows — was already complete ✓
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 5,
    title: "1-to-2 Demultiplexer",
    difficulty: "Easy",
    tags: ["Combinational", "DEMUX"],
    description:
      "Build a 1-to-2 DEMUX. Route a single input D to one of two outputs (Y0, Y1) based on select S.",
    truthTable: [
      { D: 0, S: 0, Y0: 0, Y1: 0 },
      { D: 0, S: 1, Y0: 0, Y1: 0 },
      { D: 1, S: 0, Y0: 1, Y1: 0 },
      { D: 1, S: 1, Y0: 0, Y1: 1 },
    ],
    equations: ["Y0 = D·S'", "Y1 = D·S"],
    hint: "Two AND gates with NOT gate on S for Y0.",
    inputs: ["D", "S"],
    outputs: ["Y0", "Y1"],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 6 — 2-to-4 Decoder
  // Inputs: E, A1, A0  |  Outputs: D0, D1, D2, D3
  // BUG FIX 1: had one wildcard row { E:0, A1:"X", A0:"X" } which only matched
  //            ONE combination — the other 3 E=0 combos returned 0 by accident
  //            (coincidentally correct), but it made expectedColumn() fragile.
  //            Expanded to 4 explicit E=0 rows.
  // BUG FIX 2: last row had D2:1 AND D3:1 — should be D2:0, D3:1 (E=1,A1=1,A0=1
  //            selects only D3).
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 6,
    title: "2-to-4 Decoder",
    difficulty: "Medium",
    tags: ["Combinational", "Decoder"],
    description:
      "Design a 2-to-4 decoder with inputs A1, A0 and an active-high enable E. Outputs D0–D3.",
    truthTable: [
      // E=0 → all outputs disabled regardless of address
      { E: 0, A1: 0, A0: 0, D0: 0, D1: 0, D2: 0, D3: 0 },
      { E: 0, A1: 0, A0: 1, D0: 0, D1: 0, D2: 0, D3: 0 },
      { E: 0, A1: 1, A0: 0, D0: 0, D1: 0, D2: 0, D3: 0 },
      { E: 0, A1: 1, A0: 1, D0: 0, D1: 0, D2: 0, D3: 0 },
      // E=1 → active-high decode
      { E: 1, A1: 0, A0: 0, D0: 1, D1: 0, D2: 0, D3: 0 },
      { E: 1, A1: 0, A0: 1, D0: 0, D1: 1, D2: 0, D3: 0 },
      { E: 1, A1: 1, A0: 0, D0: 0, D1: 0, D2: 1, D3: 0 },
      { E: 1, A1: 1, A0: 1, D0: 0, D1: 0, D2: 0, D3: 1 }, // ← was D2:1,D3:1 (wrong)
    ],
    equations: [
      "D0 = E·A1'·A0'",
      "D1 = E·A1'·A0",
      "D2 = E·A1·A0'",
      "D3 = E·A1·A0",
    ],
    hint: "Each output is a minterm AND-ed with the enable signal.",
    inputs: ["E", "A1", "A0"],
    outputs: ["D0", "D1", "D2", "D3"],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 7 — SR Latch (NOR-based)
  // Inputs: S, R  |  Outputs: Q, Q'
  // BUG FIX: had symbolic strings "Q_prev"/"Q'_prev" and "?"/"?" as output values.
  // Number("Q_prev") = NaN → expected column was always 0 → every circuit wrong.
  // An SR latch is fundamentally sequential (feedback-dependent) so it can't be
  // validated purely by combinational simulation.
  // Fix: validate only the 2 deterministic states (Set and Reset).
  // The hold (S=0,R=0) and forbidden (S=1,R=1) states are excluded from scoring.
  // Achieved by marking indeterminate outputs as -1 (skipped in validation).
  // Since the validator uses 0/1 comparison, we represent "don't validate this row"
  // by duplicating both deterministic outcomes for those input combos so the
  // validator can still pass circuits that implement the deterministic cases.
  //
  // Practical approach: drop the latch from auto-validation entirely and mark it
  // as "manual check" by setting a validationMode flag. But to keep backward
  // compatibility with the existing validator, we expand to only the 2 rows the
  // validator CAN check and remove the ambiguous rows.
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 7,
    title: "SR Latch (NOR-based)",
    difficulty: "Medium",
    tags: ["Sequential", "Latch"],
    description:
      "Build a basic SR Latch using two cross-coupled NOR gates. S=Set, R=Reset, Q and Q' are outputs. Note: S=R=0 holds previous state; S=R=1 is forbidden.",
    // Only include the two deterministic, simulatable rows.
    // Hold (0,0) and forbidden (1,1) require feedback memory the static
    // simulator cannot model, so they are intentionally omitted.
    truthTable: [
      { S: 0, R: 1, Q: 0, "Q'": 1 }, // Reset
      { S: 1, R: 0, Q: 1, "Q'": 0 }, // Set
    ],
    equations: ["Q = (R + Q')'", "Q' = (S + Q)'"],
    hint: "Two NOR gates cross-coupled: output of each feeds back into the other's input. Only the Set and Reset states are auto-validated.",
    inputs: ["S", "R"],
    outputs: ["Q", "Q'"],
    // Flag so the UI can show an explanatory note about the hold/forbidden states
    hasIndeterminateRows: true,
    indeterminateNote:
      "S=R=0 (hold) and S=R=1 (forbidden) require sequential feedback and are not auto-validated.",
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 8 — Odd Parity Generator (3-bit)
  // Inputs: A, B, C  |  Output: P
  // P = (A ⊕ B ⊕ C)'
  // 2^3 = 8 rows — was already complete ✓
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 8,
    title: "Odd Parity Generator (3-bit)",
    difficulty: "Medium",
    tags: ["Combinational", "Parity"],
    description:
      "Design a 3-bit odd parity generator. Given inputs A, B, C — output P such that the total number of 1s (A, B, C, P) is always odd.",
    truthTable: [
      { A: 0, B: 0, C: 0, P: 1 },
      { A: 0, B: 0, C: 1, P: 0 },
      { A: 0, B: 1, C: 0, P: 0 },
      { A: 0, B: 1, C: 1, P: 1 },
      { A: 1, B: 0, C: 0, P: 0 },
      { A: 1, B: 0, C: 1, P: 1 },
      { A: 1, B: 1, C: 0, P: 1 },
      { A: 1, B: 1, C: 1, P: 0 },
    ],
    equations: ["P = A ⊕ B ⊕ C ⊕ 1", "P = (A ⊕ B ⊕ C)'"],
    hint: "XOR all inputs together, then invert the result for odd parity.",
    inputs: ["A", "B", "C"],
    outputs: ["P"],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 9 — 1-to-4 Demultiplexer
  // Inputs: D, S1, S0  |  Outputs: Y0, Y1, Y2, Y3
  // Yi = D when (S1,S0) == i, else 0
  // 2^3 = 8 rows — complete ✓
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 11,
    title: "1-to-4 Demultiplexer",
    difficulty: "Medium",
    tags: ["Combinational", "Decoder"],
    description:
      "Build a 1-to-4 DEMUX. Route a single data input D to one of four outputs (Y0–Y3) determined by the 2-bit select lines S1 and S0.",
    truthTable: [
      // D=0 → all outputs 0 regardless of select
      { D: 0, S1: 0, S0: 0, Y0: 0, Y1: 0, Y2: 0, Y3: 0 },
      { D: 0, S1: 0, S0: 1, Y0: 0, Y1: 0, Y2: 0, Y3: 0 },
      { D: 0, S1: 1, S0: 0, Y0: 0, Y1: 0, Y2: 0, Y3: 0 },
      { D: 0, S1: 1, S0: 1, Y0: 0, Y1: 0, Y2: 0, Y3: 0 },
      // D=1 → selected output = 1, rest = 0
      { D: 1, S1: 0, S0: 0, Y0: 1, Y1: 0, Y2: 0, Y3: 0 }, // S1S0=00 → Y0
      { D: 1, S1: 0, S0: 1, Y0: 0, Y1: 1, Y2: 0, Y3: 0 }, // S1S0=01 → Y1
      { D: 1, S1: 1, S0: 0, Y0: 0, Y1: 0, Y2: 1, Y3: 0 }, // S1S0=10 → Y2
      { D: 1, S1: 1, S0: 1, Y0: 0, Y1: 0, Y2: 0, Y3: 1 }, // S1S0=11 → Y3
    ],
    equations: [
      "Y0 = D · S1' · S0'",
      "Y1 = D · S1' · S0",
      "Y2 = D · S1  · S0'",
      "Y3 = D · S1  · S0",
    ],
    hint: "Each output is a 3-input AND gate: the data line D, the required polarity of S1, and the required polarity of S0. Add NOT gates for the complemented select lines.",
    inputs: ["D", "S1", "S0"],
    outputs: ["Y0", "Y1", "Y2", "Y3"],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 10 — 1-to-8 Demultiplexer
  // Inputs: D, S2, S1, S0  |  Outputs: Y0–Y7
  // Yi = D when (S2,S1,S0) == i, else 0
  // 2^4 = 16 rows — complete ✓
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 12,
    title: "1-to-8 Demultiplexer",
    difficulty: "Hard",
    tags: ["Combinational", "Decoder"],
    description:
      "Build a 1-to-8 DEMUX. Route a single data input D to one of eight outputs (Y0–Y7) based on the 3-bit select address formed by S2, S1, and S0.",
    truthTable: [
      // D=0 → all outputs 0
      {
        D: 0,
        S2: 0,
        S1: 0,
        S0: 0,
        Y0: 0,
        Y1: 0,
        Y2: 0,
        Y3: 0,
        Y4: 0,
        Y5: 0,
        Y6: 0,
        Y7: 0,
      },
      {
        D: 0,
        S2: 0,
        S1: 0,
        S0: 1,
        Y0: 0,
        Y1: 0,
        Y2: 0,
        Y3: 0,
        Y4: 0,
        Y5: 0,
        Y6: 0,
        Y7: 0,
      },
      {
        D: 0,
        S2: 0,
        S1: 1,
        S0: 0,
        Y0: 0,
        Y1: 0,
        Y2: 0,
        Y3: 0,
        Y4: 0,
        Y5: 0,
        Y6: 0,
        Y7: 0,
      },
      {
        D: 0,
        S2: 0,
        S1: 1,
        S0: 1,
        Y0: 0,
        Y1: 0,
        Y2: 0,
        Y3: 0,
        Y4: 0,
        Y5: 0,
        Y6: 0,
        Y7: 0,
      },
      {
        D: 0,
        S2: 1,
        S1: 0,
        S0: 0,
        Y0: 0,
        Y1: 0,
        Y2: 0,
        Y3: 0,
        Y4: 0,
        Y5: 0,
        Y6: 0,
        Y7: 0,
      },
      {
        D: 0,
        S2: 1,
        S1: 0,
        S0: 1,
        Y0: 0,
        Y1: 0,
        Y2: 0,
        Y3: 0,
        Y4: 0,
        Y5: 0,
        Y6: 0,
        Y7: 0,
      },
      {
        D: 0,
        S2: 1,
        S1: 1,
        S0: 0,
        Y0: 0,
        Y1: 0,
        Y2: 0,
        Y3: 0,
        Y4: 0,
        Y5: 0,
        Y6: 0,
        Y7: 0,
      },
      {
        D: 0,
        S2: 1,
        S1: 1,
        S0: 1,
        Y0: 0,
        Y1: 0,
        Y2: 0,
        Y3: 0,
        Y4: 0,
        Y5: 0,
        Y6: 0,
        Y7: 0,
      },
      // D=1 → selected output = 1, rest = 0
      {
        D: 1,
        S2: 0,
        S1: 0,
        S0: 0,
        Y0: 1,
        Y1: 0,
        Y2: 0,
        Y3: 0,
        Y4: 0,
        Y5: 0,
        Y6: 0,
        Y7: 0,
      }, // 000 → Y0
      {
        D: 1,
        S2: 0,
        S1: 0,
        S0: 1,
        Y0: 0,
        Y1: 1,
        Y2: 0,
        Y3: 0,
        Y4: 0,
        Y5: 0,
        Y6: 0,
        Y7: 0,
      }, // 001 → Y1
      {
        D: 1,
        S2: 0,
        S1: 1,
        S0: 0,
        Y0: 0,
        Y1: 0,
        Y2: 1,
        Y3: 0,
        Y4: 0,
        Y5: 0,
        Y6: 0,
        Y7: 0,
      }, // 010 → Y2
      {
        D: 1,
        S2: 0,
        S1: 1,
        S0: 1,
        Y0: 0,
        Y1: 0,
        Y2: 0,
        Y3: 1,
        Y4: 0,
        Y5: 0,
        Y6: 0,
        Y7: 0,
      }, // 011 → Y3
      {
        D: 1,
        S2: 1,
        S1: 0,
        S0: 0,
        Y0: 0,
        Y1: 0,
        Y2: 0,
        Y3: 0,
        Y4: 1,
        Y5: 0,
        Y6: 0,
        Y7: 0,
      }, // 100 → Y4
      {
        D: 1,
        S2: 1,
        S1: 0,
        S0: 1,
        Y0: 0,
        Y1: 0,
        Y2: 0,
        Y3: 0,
        Y4: 0,
        Y5: 1,
        Y6: 0,
        Y7: 0,
      }, // 101 → Y5
      {
        D: 1,
        S2: 1,
        S1: 1,
        S0: 0,
        Y0: 0,
        Y1: 0,
        Y2: 0,
        Y3: 0,
        Y4: 0,
        Y5: 0,
        Y6: 1,
        Y7: 0,
      }, // 110 → Y6
      {
        D: 1,
        S2: 1,
        S1: 1,
        S0: 1,
        Y0: 0,
        Y1: 0,
        Y2: 0,
        Y3: 0,
        Y4: 0,
        Y5: 0,
        Y6: 0,
        Y7: 1,
      }, // 111 → Y7
    ],
    equations: [
      "Y0 = D · S2' · S1' · S0'",
      "Y1 = D · S2' · S1' · S0",
      "Y2 = D · S2' · S1  · S0'",
      "Y3 = D · S2' · S1  · S0",
      "Y4 = D · S2  · S1' · S0'",
      "Y5 = D · S2  · S1' · S0",
      "Y6 = D · S2  · S1  · S0'",
      "Y7 = D · S2  · S1  · S0",
    ],
    hint: "Eight 4-input AND gates — one per output. Each AND gate takes D, and the correct polarity of S2, S1, S0 for that output index. Add NOT gates for all three select complements.",
    inputs: ["D", "S2", "S1", "S0"],
    outputs: ["Y0", "Y1", "Y2", "Y3", "Y4", "Y5", "Y6", "Y7"],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 13 — SR NOR Latch (Basic SR Latch)
  // Inputs: S, R  |  Outputs: Q, Qb
  // Built from two cross-coupled NOR gates.
  // Forbidden state: S=1, R=1 (excluded from truth table).
  // Truth table covers: Reset (S=0,R=1), Set (S=1,R=0), and Hold (S=0,R=0)
  // with both initial Q states where relevant.
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 13,
    title: "SR NOR Latch",
    difficulty: "Medium",
    tags: ["Sequential", "Latch"],
    description:
      "Design a basic SR latch using two cross-coupled NOR gates. " +
      "Input S (Set) drives Q high; input R (Reset) drives Q low. " +
      "When both S and R are 0 the latch holds its previous state. " +
      "The input combination S=1, R=1 is forbidden and is not tested.",
    // Truth table: only the valid, non-forbidden rows.
    // For the Hold state (S=0, R=0) we test both Q=0→0 and Q=1→1.
    truthTable: [
      // Reset: R=1, S=0 → Q=0, Qb=1 (regardless of previous Q)
      { S: 0, R: 1, Q: 0, Qb: 1 },
      // Set:   S=1, R=0 → Q=1, Qb=0 (regardless of previous Q)
      { S: 1, R: 0, Q: 1, Qb: 0 },
      // Hold (after Reset): S=0, R=0 → Q stays 0
      { S: 0, R: 0, Q: 0, Qb: 1 },
      // Hold (after Set):   S=0, R=0 → Q stays 1
      { S: 0, R: 0, Q: 1, Qb: 0 },
    ],
    equations: ["Q  = (R + Qb)'   [upper NOR]", "Qb = (S + Q)'    [lower NOR]"],
    hint: "Place two NOR gates. Feed R and Qb into the top NOR to get Q; feed S and Q into the bottom NOR to get Qb. The cross-coupling (Q → lower NOR, Qb → upper NOR) creates the memory.",
    inputs: ["S", "R"],
    outputs: ["Q", "Qb"],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 14 — SR NAND Latch (Active-Low SR Latch)
  // Inputs: S_n (S̄), R_n (R̄)  |  Outputs: Q, Qb
  // Built from two cross-coupled NAND gates.
  // Inputs are active-low: assert by pulling to 0.
  // Forbidden state: S_n=0, R_n=0 (excluded from truth table).
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 14,
    title: "SR NAND Latch",
    difficulty: "Medium",
    tags: ["Sequential", "Latch"],
    description:
      "Build an SR latch using two cross-coupled NAND gates. " +
      "The inputs are active-low: S_n=0 sets Q=1; R_n=0 resets Q=0. " +
      "When both inputs are 1 the latch holds its state. " +
      "The combination S_n=0 and R_n=0 is forbidden and is not tested.",
    truthTable: [
      // Set: S_n=0, R_n=1 → Q=1, Qb=0
      { S_n: 0, R_n: 1, Q: 1, Qb: 0 },
      // Reset: S_n=1, R_n=0 → Q=0, Qb=1
      { S_n: 1, R_n: 0, Q: 0, Qb: 1 },
      // Hold (Q=1): S_n=1, R_n=1 → Q stays 1
      { S_n: 1, R_n: 1, Q: 1, Qb: 0 },
      // Hold (Q=0): S_n=1, R_n=1 → Q stays 0
      { S_n: 1, R_n: 1, Q: 0, Qb: 1 },
    ],
    equations: [
      "Q  = (S_n · Qb)'  [upper NAND]",
      "Qb = (R_n · Q)'   [lower NAND]",
    ],
    hint: "Place two NAND gates. The top NAND receives S_n and Qb and produces Q; the bottom NAND receives R_n and Q and produces Qb. Because NAND is used the inputs are active-low — a 0 asserts the action.",
    inputs: ["S_n", "R_n"],
    outputs: ["Q", "Qb"],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 15 — Gated SR Latch (SR Latch with Enable)
  // Inputs: S, R, En  |  Outputs: Q, Qb
  // The SR NOR latch is gated by an Enable (clock) signal.
  // When En=0 the latch holds regardless of S and R.
  // When En=1 it behaves as a normal SR latch (S=R=1 still forbidden).
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 15,
    title: "Gated SR Latch",
    difficulty: "Medium",
    tags: ["Sequential", "Latch"],
    description:
      "Extend the basic SR latch with an Enable (En) control input. " +
      "When En=0 the latch ignores S and R and holds its current state. " +
      "When En=1 it behaves as a normal SR NOR latch: S sets Q, R resets Q, " +
      "and S=R=0 holds. The combination En=1, S=1, R=1 is forbidden.",
    truthTable: [
      // En=0 → Hold regardless of S, R (show one representative Q=0 and Q=1)
      { En: 0, S: 0, R: 0, Q: 0, Qb: 1 },
      { En: 0, S: 0, R: 0, Q: 1, Qb: 0 },
      { En: 0, S: 1, R: 0, Q: 0, Qb: 1 },
      { En: 0, S: 1, R: 0, Q: 1, Qb: 0 },
      { En: 0, S: 0, R: 1, Q: 0, Qb: 1 },
      { En: 0, S: 0, R: 1, Q: 1, Qb: 0 },
      // En=1, S=0, R=0 → Hold
      { En: 1, S: 0, R: 0, Q: 0, Qb: 1 },
      { En: 1, S: 0, R: 0, Q: 1, Qb: 0 },
      // En=1, S=1, R=0 → Set  (Q=1)
      { En: 1, S: 1, R: 0, Q: 1, Qb: 0 },
      // En=1, S=0, R=1 → Reset (Q=0)
      { En: 1, S: 0, R: 1, Q: 0, Qb: 1 },
    ],
    equations: [
      "S_int = S · En",
      "R_int = R · En",
      "Q  = (R_int + Qb)'",
      "Qb = (S_int + Q)'",
    ],
    hint: "Add two AND gates before the NOR latch: one gates S through En (S_int = S·En), the other gates R through En (R_int = R·En). Feed S_int and R_int into the standard SR NOR latch.",
    inputs: ["En", "S", "R"],
    outputs: ["Q", "Qb"],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 16 — D Latch (Transparent Latch)
  // Inputs: D, En  |  Outputs: Q, Qb
  // Eliminates the forbidden state of the SR latch by forcing R = D'.
  // When En=1 (transparent): Q follows D immediately.
  // When En=0 (hold):        Q retains its last value.
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 16,
    title: "D Latch",
    difficulty: "Easy",
    tags: ["Sequential", "Latch"],
    description:
      "Design a D (Data / Transparent) latch. " +
      "When Enable (En) is 1 the output Q transparently follows the data input D. " +
      "When En goes to 0 the latch freezes and Q holds its last value. " +
      "There is no forbidden input combination.",
    truthTable: [
      // En=1 (transparent): Q = D
      { En: 1, D: 0, Q: 0, Qb: 1 },
      { En: 1, D: 1, Q: 1, Qb: 0 },
      // En=0 (hold): Q keeps previous value
      { En: 0, D: 0, Q: 0, Qb: 1 }, // previous Q was 0
      { En: 0, D: 0, Q: 1, Qb: 0 }, // previous Q was 1
      { En: 0, D: 1, Q: 0, Qb: 1 }, // previous Q was 0
      { En: 0, D: 1, Q: 1, Qb: 0 }, // previous Q was 1
    ],
    equations: ["S = D · En", "R = D' · En", "Q  = (R + Qb)'", "Qb = (S + Q)'"],
    hint: "Use a NOT gate to create D'. Then AND D with En to get S, and AND D' with En to get R. Wire S and R into a standard SR NOR latch. Because R is always D' the forbidden state (S=R=1) can never occur.",
    inputs: ["En", "D"],
    outputs: ["Q", "Qb"],
  },
];

export default problemsData;
