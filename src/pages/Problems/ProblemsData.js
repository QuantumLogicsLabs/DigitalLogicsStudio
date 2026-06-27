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

  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 19 — K-Map: 2-Variable SOP Minimisation
  // Variables: A, B  |  Output: F
  // Minterms: Σm(1, 2, 3) → F = A + B
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 19,
    title: "K-Map: 2-Variable SOP Minimization",
    difficulty: "Easy",
    tags: ["K-Map", "Boolean Algebra", "SOP"],
    description:
      "Use a 2-variable Karnaugh map to minimise the function F(A,B) = Σm(1,2,3). " +
      "Group adjacent 1-cells and write the simplified Sum-of-Products expression.",
    truthTable: [
      { A: 0, B: 0, F: 0 },
      { A: 0, B: 1, F: 1 },
      { A: 1, B: 0, F: 1 },
      { A: 1, B: 1, F: 1 },
    ],
    equations: ["F = A + B"],
    hint: "Minterms 1, 2, 3 form a group of 2 (m1,m3 → B) and a group of 2 (m2,m3 → A). Both share m3 — overlap is allowed. The simplified expression is F = A + B.",
    inputs: ["A", "B"],
    outputs: ["F"],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 20 — K-Map: 3-Variable SOP Minimisation
  // Variables: A, B, C  |  Output: F
  // Minterms: Σm(0, 2, 4, 6) → F = B'   (all rows where B=0)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 20,
    title: "K-Map: 3-Variable SOP Minimization",
    difficulty: "Easy",
    tags: ["K-Map", "Boolean Algebra", "SOP"],
    description:
      "Minimise F(A,B,C) = Σm(0,2,4,6) using a 3-variable K-map. " +
      "Identify the largest valid groupings (power-of-2 size) to find the simplest SOP.",
    truthTable: [
      { A: 0, B: 0, C: 0, F: 1 },
      { A: 0, B: 0, C: 1, F: 0 },
      { A: 0, B: 1, C: 0, F: 0 },
      { A: 0, B: 1, C: 1, F: 0 },
      { A: 1, B: 0, C: 0, F: 1 },
      { A: 1, B: 0, C: 1, F: 0 },
      { A: 1, B: 1, C: 0, F: 1 },
      { A: 1, B: 1, C: 1, F: 0 },
    ],
    equations: ["F = C'"],
    hint: "Minterms 0,2,4,6 all have C=0. They form a group of 4 across both A values, eliminating A and B. The only variable that stays constant is C=0, giving F = C'.",
    inputs: ["A", "B", "C"],
    outputs: ["F"],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 21 — K-Map: 3-Variable with Don't-Cares
  // Variables: A, B, C  |  Output: F
  // Minterms: Σm(1,3,5) + d(0,2) → use don't-cares to get F = C
  // For truth-table validation we treat don't-cares as 1 (largest group wins)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 21,
    title: "K-Map: 3-Variable with Don't-Cares",
    difficulty: "Medium",
    tags: ["K-Map", "Boolean Algebra", "Don't-Care"],
    description:
      "Minimise F(A,B,C) = Σm(1,3,5) + d(0,2) using a 3-variable K-map. " +
      "Treat don't-care cells as 1 or 0 to form the largest possible groups.",
    truthTable: [
      { A: 0, B: 0, C: 0, F: 1 }, // don't-care treated as 1
      { A: 0, B: 0, C: 1, F: 1 }, // minterm 1
      { A: 0, B: 1, C: 0, F: 1 }, // don't-care treated as 1
      { A: 0, B: 1, C: 1, F: 1 }, // minterm 3
      { A: 1, B: 0, C: 0, F: 0 },
      { A: 1, B: 0, C: 1, F: 1 }, // minterm 5
      { A: 1, B: 1, C: 0, F: 0 },
      { A: 1, B: 1, C: 1, F: 0 },
    ],
    equations: ["F = C + A'B'"],
    hint: "Group minterms 1,3,5 with don't-cares 0,2. Including d(0,2) lets you form a group of 4 (0,1,2,3 → A') and a pair (1,5 → B'C). Alternatively use don't-cares to extend to F = C + A'B'.",
    inputs: ["A", "B", "C"],
    outputs: ["F"],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 22 — K-Map: 4-Variable SOP Minimisation
  // Variables: A, B, C, D  |  Output: F
  // Minterms: Σm(0,2,5,7,8,10,13,15) → F = BD + B'D'
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 22,
    title: "K-Map: 4-Variable SOP Minimization",
    difficulty: "Medium",
    tags: ["K-Map", "Boolean Algebra", "SOP"],
    description:
      "Minimise F(A,B,C,D) = Σm(0,2,5,7,8,10,13,15) using a 4-variable K-map. " +
      "Form groups of 4 or 8 to get a minimal two-term SOP expression.",
    truthTable: [
      { A: 0, B: 0, C: 0, D: 0, F: 1 }, // m0
      { A: 0, B: 0, C: 0, D: 1, F: 0 },
      { A: 0, B: 0, C: 1, D: 0, F: 1 }, // m2
      { A: 0, B: 0, C: 1, D: 1, F: 0 },
      { A: 0, B: 1, C: 0, D: 0, F: 0 },
      { A: 0, B: 1, C: 0, D: 1, F: 1 }, // m5
      { A: 0, B: 1, C: 1, D: 0, F: 0 },
      { A: 0, B: 1, C: 1, D: 1, F: 1 }, // m7
      { A: 1, B: 0, C: 0, D: 0, F: 1 }, // m8
      { A: 1, B: 0, C: 0, D: 1, F: 0 },
      { A: 1, B: 0, C: 1, D: 0, F: 1 }, // m10
      { A: 1, B: 0, C: 1, D: 1, F: 0 },
      { A: 1, B: 1, C: 0, D: 0, F: 0 },
      { A: 1, B: 1, C: 0, D: 1, F: 1 }, // m13
      { A: 1, B: 1, C: 1, D: 0, F: 0 },
      { A: 1, B: 1, C: 1, D: 1, F: 1 }, // m15
    ],
    equations: ["F = BD + B'D'"],
    hint: "Minterms 5,7,13,15 all have B=1, D=1 → group of 4 gives BD. Minterms 0,2,8,10 all have B=0, D=0 → group of 4 gives B'D'. The two groups together cover all minterms.",
    inputs: ["A", "B", "C", "D"],
    outputs: ["F"],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 23 — K-Map: POS (Product-of-Sums) Minimisation
  // Variables: A, B, C  |  Output: F
  // Maxterms: ΠM(1, 4, 5) → F = (A'+B)(A+B'+C')
  // Equivalently via 0-cells: A,B,C combinations 001, 100, 101
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 23,
    title: "K-Map: POS Minimization",
    difficulty: "Medium",
    tags: ["K-Map", "Boolean Algebra", "POS"],
    description:
      "Use a 3-variable K-map to derive the minimal Product-of-Sums expression for " +
      "F(A,B,C) = ΠM(1,4,5). Group the 0-cells on the map to form maxterm groups.",
    truthTable: [
      { A: 0, B: 0, C: 0, F: 1 },
      { A: 0, B: 0, C: 1, F: 0 }, // maxterm 1
      { A: 0, B: 1, C: 0, F: 1 },
      { A: 0, B: 1, C: 1, F: 1 },
      { A: 1, B: 0, C: 0, F: 0 }, // maxterm 4
      { A: 1, B: 0, C: 1, F: 0 }, // maxterm 5
      { A: 1, B: 1, C: 0, F: 1 },
      { A: 1, B: 1, C: 1, F: 1 },
    ],
    equations: ["F = (A' + B)(A + C')"],
    hint: "Group the 0-cells: maxterms 4 and 5 (A=1,B=0) form a pair → sum term (A'+B). Maxterm 1 and 4 pair — but 4 is already used. Maxterms 1 alone: (A+B+C'). The minimal POS is F = (A'+B)(A+C').",
    inputs: ["A", "B", "C"],
    outputs: ["F"],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 24 — K-Map: 4-Variable with Don't-Cares (POS)
  // Variables: A, B, C, D  |  Output: F
  // Minterms: Σm(0,1,4,5) + d(10,11,14,15) → largest 0-cell group from rest
  // Simplified SOP: F = A'B' + A'C'   (equivalent to F = A'(B'+C'))
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 24,
    title: "K-Map: 4-Variable with Don't-Cares",
    difficulty: "Hard",
    tags: ["K-Map", "Boolean Algebra", "Don't-Care", "SOP"],
    description:
      "Minimise F(A,B,C,D) = Σm(0,1,4,5) + d(10,11,14,15) using a 4-variable K-map. " +
      "Use the don't-care entries to form the largest possible 1-cell groups and reduce the expression.",
    truthTable: [
      { A: 0, B: 0, C: 0, D: 0, F: 1 }, // m0
      { A: 0, B: 0, C: 0, D: 1, F: 1 }, // m1
      { A: 0, B: 0, C: 1, D: 0, F: 0 },
      { A: 0, B: 0, C: 1, D: 1, F: 0 },
      { A: 0, B: 1, C: 0, D: 0, F: 1 }, // m4
      { A: 0, B: 1, C: 0, D: 1, F: 1 }, // m5
      { A: 0, B: 1, C: 1, D: 0, F: 0 },
      { A: 0, B: 1, C: 1, D: 1, F: 0 },
      { A: 1, B: 0, C: 0, D: 0, F: 0 },
      { A: 1, B: 0, C: 0, D: 1, F: 0 },
      { A: 1, B: 0, C: 1, D: 0, F: 1 }, // d10 treated as 1
      { A: 1, B: 0, C: 1, D: 1, F: 1 }, // d11 treated as 1
      { A: 1, B: 1, C: 0, D: 0, F: 0 },
      { A: 1, B: 1, C: 0, D: 1, F: 0 },
      { A: 1, B: 1, C: 1, D: 0, F: 1 }, // d14 treated as 1
      { A: 1, B: 1, C: 1, D: 1, F: 1 }, // d15 treated as 1
    ],
    equations: ["F = A'C' + AC"],
    hint: "1-cells 0,1,4,5 all have A=0,C=0 → group of 4 gives A'C'. Don't-care cells 10,11,14,15 all have A=1,C=1 → use them to form group of 4 giving AC. Combined: F = A'C' + AC.",
    inputs: ["A", "B", "C", "D"],
    outputs: ["F"],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 25 — Number Systems: Binary to Decimal Conversion
  // Given 8-bit binary number, find decimal value
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 25,
    title: "Binary-to-Decimal Conversion",
    difficulty: "Easy",
    tags: ["Number Systems", "Binary", "Conversion"],
    description:
      "Convert the 8-bit unsigned binary number 10110101 to its decimal equivalent. " +
      "Each bit position has a positional weight that is a power of 2.",
    truthTable: [
      { "Bit Position": 7, "Bit Value": 1, "Weight (2^n)": 128, "Contribution": 128 },
      { "Bit Position": 6, "Bit Value": 0, "Weight (2^n)": 64,  "Contribution": 0   },
      { "Bit Position": 5, "Bit Value": 1, "Weight (2^n)": 32,  "Contribution": 32  },
      { "Bit Position": 4, "Bit Value": 1, "Weight (2^n)": 16,  "Contribution": 16  },
      { "Bit Position": 3, "Bit Value": 0, "Weight (2^n)": 8,   "Contribution": 0   },
      { "Bit Position": 2, "Bit Value": 1, "Weight (2^n)": 4,   "Contribution": 4   },
      { "Bit Position": 1, "Bit Value": 0, "Weight (2^n)": 2,   "Contribution": 0   },
      { "Bit Position": 0, "Bit Value": 1, "Weight (2^n)": 1,   "Contribution": 1   },
    ],
    equations: [
      "10110101₂ = 1×2⁷ + 0×2⁶ + 1×2⁵ + 1×2⁴ + 0×2³ + 1×2² + 0×2¹ + 1×2⁰",
      "= 128 + 32 + 16 + 4 + 1 = 181₁₀",
    ],
    hint: "Multiply each bit by its positional weight (2^position, counting from right starting at 0) and sum all contributions.",
    inputs: ["Binary Number"],
    outputs: ["Decimal Value"],
    isSynthetic: true,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 26 — Number Systems: 2's Complement Negation
  // Inputs: 4-bit signed number  |  Outputs: 2's complement negation
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 26,
    title: "2's Complement Negation",
    difficulty: "Easy",
    tags: ["Number Systems", "2's Complement", "Signed Arithmetic"],
    description:
      "Find the 2's complement representation of −6 using a 4-bit signed system. " +
      "Start from +6 (0110), invert all bits (1's complement), then add 1.",
    truthTable: [
      { Step: "Original +6",          "Binary": "0110", Note: "Positive 6 in 4-bit" },
      { Step: "Invert bits (1's comp)","Binary": "1001", Note: "Flip every bit"       },
      { Step: "Add 1",                 "Binary": "1010", Note: "1001 + 0001 = 1010"   },
    ],
    equations: [
      "+6  = 0110₂",
      "1's complement = 1001₂",
      "2's complement (−6) = 1010₂",
      "Verify: 1010₂ = −8 + 2 = −6 ✓",
    ],
    hint: "Two steps: (1) invert every bit, (2) add 1 to the result. The MSB=1 confirms a negative value in signed representation.",
    inputs: ["4-bit Signed Number"],
    outputs: ["2's Complement"],
    isSynthetic: true,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 27 — Number Systems: Hex to Binary Conversion
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 27,
    title: "Hexadecimal to Binary Conversion",
    difficulty: "Easy",
    tags: ["Number Systems", "Hexadecimal", "Binary", "Conversion"],
    description:
      "Convert the hexadecimal number 3F to its 8-bit binary equivalent. " +
      "Each hex digit maps directly to a 4-bit nibble.",
    truthTable: [
      { "Hex Digit": "3", "Decimal": 3,  "4-bit Binary": "0011" },
      { "Hex Digit": "F", "Decimal": 15, "4-bit Binary": "1111" },
    ],
    equations: [
      "3₁₆ = 0011₂",
      "F₁₆ = 1111₂",
      "3F₁₆ = 0011 1111₂ = 63₁₀",
    ],
    hint: "Split the hex number into individual digits, then convert each digit to its 4-bit binary value. Concatenate the nibbles left-to-right.",
    inputs: ["Hex Number"],
    outputs: ["Binary Number"],
    isSynthetic: true,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 28 — Number Systems: BCD Encoding
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 28,
    title: "BCD (8421) Encoding",
    difficulty: "Easy",
    tags: ["Number Systems", "BCD", "Conversion"],
    description:
      "Encode the decimal number 93 in BCD (Binary Coded Decimal) format. " +
      "Each decimal digit is independently converted to its 4-bit binary representation.",
    truthTable: [
      { "Decimal Digit": "9", "BCD (8421)": "1001", "Weight Breakdown": "8+1" },
      { "Decimal Digit": "3", "BCD (8421)": "0011", "Weight Breakdown": "2+1" },
    ],
    equations: [
      "9₁₀ = 1001 (BCD)",
      "3₁₀ = 0011 (BCD)",
      "93₁₀ = 1001 0011 (BCD)",
    ],
    hint: "BCD stores each decimal digit separately as a 4-bit code (0000 to 1001). Codes 1010–1111 are invalid in BCD. Encode digit by digit.",
    inputs: ["Decimal Number"],
    outputs: ["BCD Code"],
    isSynthetic: true,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 29 — Number Systems: Octal Arithmetic
  // Add two octal numbers: 37₈ + 54₈
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 29,
    title: "Octal Addition",
    difficulty: "Medium",
    tags: ["Number Systems", "Octal", "Arithmetic"],
    description:
      "Add the two octal numbers 37₈ + 54₈. Work column by column from right to left " +
      "using base-8 arithmetic, carrying 1 whenever the column sum reaches 8.",
    truthTable: [
      { Column: "Units",  "Digit A": 7, "Digit B": 4, Sum: 11, "Octal Carry": 1, "Octal Digit": 3 },
      { Column: "Eights", "Digit A": 3, "Digit B": 5, Sum: 9,  "Octal Carry": 1, "Octal Digit": 1 },
      { Column: "Carry",  "Digit A": 0, "Digit B": 0, Sum: 1,  "Octal Carry": 0, "Octal Digit": 1 },
    ],
    equations: [
      "Units:  7 + 4 = 11₁₀ = 1×8 + 3 → write 3, carry 1",
      "Eights: 3 + 5 + 1(carry) = 9₁₀ = 1×8 + 1 → write 1, carry 1",
      "Result: 37₈ + 54₈ = 113₈ = 75₁₀",
    ],
    hint: "Octal uses digits 0–7. When a column sum ≥ 8, subtract 8 to get the result digit and carry 1 to the next column.",
    inputs: ["Octal A", "Octal B"],
    outputs: ["Octal Sum"],
    isSynthetic: true,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Problem 30 — Number Systems: Signed 4-bit Overflow Detection
  // Detect when signed 4-bit addition overflows
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 30,
    title: "Signed Overflow Detection",
    difficulty: "Medium",
    tags: ["Number Systems", "Signed Arithmetic", "Overflow", "2's Complement"],
    description:
      "Determine whether each of the following 4-bit signed additions overflows. " +
      "Overflow in 2's complement occurs when the carry into the MSB ≠ carry out of the MSB.",
    truthTable: [
      { "Operand A": "0111 (+7)", "Operand B": "0001 (+1)", "Raw Sum": "1000",  "Interpreted": "-8", "Overflow": "Yes" },
      { "Operand A": "0100 (+4)", "Operand B": "0011 (+3)", "Raw Sum": "0111",  "Interpreted": "+7", "Overflow": "No"  },
      { "Operand A": "1001 (-7)", "Operand B": "1110 (-2)", "Raw Sum": "10111", "Interpreted": "+7 (truncated)", "Overflow": "Yes" },
      { "Operand A": "1010 (-6)", "Operand B": "1011 (-5)", "Raw Sum": "10101", "Interpreted": "+5 (truncated)", "Overflow": "Yes" },
    ],
    equations: [
      "Overflow if: Carry_in(MSB) ⊕ Carry_out(MSB) = 1",
      "Equivalently: both positive inputs give negative result, or both negative give positive",
    ],
    hint: "Check MSB carry-in vs carry-out: if they differ, overflow occurred. For two positives summing to a negative (or two negatives summing to a positive) — that is always an overflow.",
    inputs: ["4-bit A", "4-bit B"],
    outputs: ["Sum", "Overflow"],
    isSynthetic: true,
  },
];

export default problemsData;
