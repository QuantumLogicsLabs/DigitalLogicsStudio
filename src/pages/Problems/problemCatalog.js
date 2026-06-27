import rawProblems from "./ProblemsData";

const syntheticProblems = [
  {
    id: 2001,
    title: "Canonical SOP Builder",
    difficulty: "Easy",
    tags: ["Boolean Algebra", "Minterms"],
    description:
      "Given a truth-table output column, derive the canonical SOP expression and identify the corresponding minterm set.",
    equations: ["F(A,B,C) = Σm(...)"],
    truthTable: [
      { A: 0, B: 0, C: 0, F: 0 },
      { A: 0, B: 0, C: 1, F: 1 },
      { A: 0, B: 1, C: 0, F: 0 },
      { A: 0, B: 1, C: 1, F: 1 },
      { A: 1, B: 0, C: 0, F: 0 },
      { A: 1, B: 0, C: 1, F: 1 },
      { A: 1, B: 1, C: 0, F: 1 },
      { A: 1, B: 1, C: 1, F: 0 },
    ],
    hint: "Collect the rows where F = 1, then map each row to a minterm.",
    inputs: ["A", "B", "C"],
    outputs: ["F"],
  },
  {
    id: 2002,
    title: "Boolean Law Simplifier",
    difficulty: "Medium",
    tags: ["Boolean Algebra", "Identities"],
    description:
      "Simplify a chained Boolean expression by applying absorption, consensus, and complement laws in the correct order.",
    equations: ["X + XY = X", "X + X'Y = X + Y"],
    truthTable: [
      { X: 0, Y: 0, Z: 0, F: 1 },
      { X: 0, Y: 0, Z: 1, F: 1 },
      { X: 0, Y: 1, Z: 0, F: 1 },
      { X: 0, Y: 1, Z: 1, F: 1 },
      { X: 1, Y: 0, Z: 0, F: 0 },
      { X: 1, Y: 0, Z: 1, F: 0 },
      { X: 1, Y: 1, Z: 0, F: 1 },
      { X: 1, Y: 1, Z: 1, F: 1 },
    ],
    hint: "Look for absorption opportunities before you expand the terms.",
    inputs: ["X", "Y", "Z"],
    outputs: ["F"],
  },
  {
    id: 2003,
    title: "Binary Overflow Detector",
    difficulty: "Medium",
    tags: ["Number Systems", "Arithmetic"],
    description:
      "Determine when signed binary addition overflows and identify the final carry and interpreted decimal result.",
    equations: ["Overflow = Cn xor Cn-1"],
    truthTable: [
      { A3: 0, A2: 0, A1: 1, A0: 1, B3: 0, B2: 0, B1: 1, B0: 0, S3: 0, S2: 1, S1: 0, S0: 1, Overflow: 0 },
      { A3: 0, A2: 1, A1: 1, A0: 1, B3: 0, B2: 0, B1: 0, B0: 1, S3: 1, S2: 0, S1: 0, S0: 0, Overflow: 1 },
      { A3: 1, A2: 0, A1: 0, A0: 0, B3: 1, B2: 1, B1: 1, B0: 1, S3: 0, S2: 1, S1: 1, S0: 1, Overflow: 1 },
      { A3: 1, A2: 0, A1: 1, A0: 1, B3: 1, B2: 1, B1: 1, B0: 0, S3: 1, S2: 0, S1: 0, S0: 1, Overflow: 0 },
    ],
    hint: "Signed overflow depends on carry into and carry out of the MSB.",
    inputs: ["A3..A0", "B3..B0"],
    outputs: ["S3..S0", "Overflow"],
  },
  {
    id: 2004,
    title: "Sequence Detector FSM",
    difficulty: "Hard",
    tags: ["Sequential Circuits", "State Machine"],
    description:
      "Design a Moore machine that detects the input sequence 1011 with overlap and derive the state table.",
    equations: ["Q(next) = f(Q, X)"],
    truthTable: [
      { State: "S0 (Init)", X: 0, NextState: "S0", Z: 0 },
      { State: "S0 (Init)", X: 1, NextState: "S1 (1)", Z: 0 },
      { State: "S1 (1)", X: 0, NextState: "S2 (10)", Z: 0 },
      { State: "S1 (1)", X: 1, NextState: "S1 (1)", Z: 0 },
      { State: "S2 (10)", X: 0, NextState: "S0", Z: 0 },
      { State: "S2 (10)", X: 1, NextState: "S3 (101)", Z: 0 },
      { State: "S3 (101)", X: 0, NextState: "S2 (10)", Z: 0 },
      { State: "S3 (101)", X: 1, NextState: "S4 (1011)", Z: 1 },
    ],
    hint: "Name states by the longest matched prefix so overlap is easy to preserve.",
    inputs: ["X", "CLK"],
    outputs: ["Z"],
  },
  {
    id: 2005,
    title: "Register Transfer Scheduling",
    difficulty: "Medium",
    tags: ["Registers", "RTL"],
    description:
      "Schedule conditional register transfers for a micro-operation sequence and identify which control signals must be asserted.",
    equations: ["P: R2 <- R1", "Q: R3 <- R2 + 1"],
    truthTable: [
      { P: 0, Q: 0, "R2 (next)": "R2 (hold)", "R3 (next)": "R3 (hold)" },
      { P: 1, Q: 0, "R2 (next)": "R1", "R3 (next)": "R3 (hold)" },
      { P: 0, Q: 1, "R2 (next)": "R2 (hold)", "R3 (next)": "R2 + 1" },
      { P: 1, Q: 1, "R2 (next)": "R1", "R3 (next)": "R2 + 1" },
    ],
    hint: "Translate each condition into a gated transfer and check data dependencies.",
    inputs: ["P", "Q", "CLK"],
    outputs: ["R2", "R3"],
  },
  {
    id: 2006,
    title: "RAM Address Decoder Map",
    difficulty: "Easy",
    tags: ["Memory Systems", "Decoder"],
    description:
      "Map a binary address space to word lines and identify which decoder outputs activate each memory row.",
    equations: ["Word_i = Decoder(A)"],
    truthTable: [
      { A2: 0, A1: 0, A0: 0, ActiveWordLine: "W0" },
      { A2: 0, A1: 0, A0: 1, ActiveWordLine: "W1" },
      { A2: 0, A1: 1, A0: 0, ActiveWordLine: "W2" },
      { A2: 0, A1: 1, A0: 1, ActiveWordLine: "W3" },
      { A2: 1, A1: 0, A0: 0, ActiveWordLine: "W4" },
      { A2: 1, A1: 0, A0: 1, ActiveWordLine: "W5" },
      { A2: 1, A1: 1, A0: 0, ActiveWordLine: "W6" },
      { A2: 1, A1: 1, A0: 1, ActiveWordLine: "W7" },
    ],
    hint: "Each address activates exactly one word line in a basic RAM array.",
    inputs: ["A2", "A1", "A0"],
    outputs: ["W0..W7"],
  },
  {
    id: 2007,
    title: "PLA Programming Table",
    difficulty: "Hard",
    tags: ["Memory Systems", "PLA"],
    description:
      "Populate the AND/OR plane programming table needed to implement a given set of Boolean functions in a PLA.",
    equations: ["F1 = A'B + AC", "F2 = AB + BC'"],
    truthTable: [
      { A: 0, B: 0, C: 0, F1: 0, F2: 0 },
      { A: 0, B: 0, C: 1, F1: 0, F2: 0 },
      { A: 0, B: 1, C: 0, F1: 1, F2: 1 },
      { A: 0, B: 1, C: 1, F1: 1, F2: 0 },
      { A: 1, B: 0, C: 0, F1: 0, F2: 0 },
      { A: 1, B: 0, C: 1, F1: 1, F2: 0 },
      { A: 1, B: 1, C: 0, F1: 0, F2: 1 },
      { A: 1, B: 1, C: 1, F1: 1, F2: 1 },
    ],
    hint: "Share product terms across functions before finalizing the OR plane.",
    inputs: ["A", "B", "C"],
    outputs: ["F1", "F2"],
  },
];

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const inferTopic = (problem) => {
  const tagText = (problem.tags || []).join(" ").toLowerCase();
  const titleText = problem.title.toLowerCase();

  // K-Map must be checked before general Boolean Algebra
  if (
    tagText.includes("k-map") ||
    tagText.includes("karnaugh") ||
    titleText.includes("k-map") ||
    titleText.includes("karnaugh")
  ) {
    return {
      topic: "K-Map & Boolean Simplification",
      primaryTopicId: "boolean-algebra",
      filterGroup: "K-Map",
    };
  }

  if (
    tagText.includes("boolean algebra") ||
    tagText.includes("minterm") ||
    tagText.includes("identit") ||
    tagText.includes("sop") ||
    tagText.includes("pos")
  ) {
    return {
      topic: "Boolean Algebra",
      primaryTopicId: "boolean-algebra",
      filterGroup: "Boolean Algebra",
    };
  }

  if (tagText.includes("memory") || tagText.includes("pla")) {
    return {
      topic: "Memory Systems",
      primaryTopicId: "memory-systems",
      filterGroup: "Memory Systems",
    };
  }

  if (tagText.includes("register") || tagText.includes("rtl")) {
    return {
      topic: "Registers & Transfers",
      primaryTopicId: "registers-and-register-transfers",
      filterGroup: "Registers & Transfers",
    };
  }

  if (
    tagText.includes("sequential") ||
    tagText.includes("state machine") ||
    titleText.includes("latch") ||
    titleText.includes("flip")
  ) {
    return {
      topic: "Sequential Circuits",
      primaryTopicId: "sequential-circuits",
      filterGroup: "Sequential Circuits",
    };
  }

  if (
    tagText.includes("arithmetic") ||
    tagText.includes("parity") ||
    titleText.includes("adder") ||
    titleText.includes("subtractor") ||
    titleText.includes("overflow")
  ) {
    return {
      topic: "Arithmetic Functions",
      primaryTopicId: "arithmetic-functions-and-hdls",
      filterGroup: "Arithmetic Functions",
    };
  }

  if (
    tagText.includes("mux") ||
    tagText.includes("decoder") ||
    titleText.includes("multiplexer") ||
    titleText.includes("demultiplexer") ||
    titleText.includes("decoder")
  ) {
    return {
      topic: "Combinational Circuits",
      primaryTopicId: "combinational-circuits",
      filterGroup: "Combinational Circuits",
    };
  }

  if (tagText.includes("number systems")) {
    return {
      topic: "Number Systems",
      primaryTopicId: "number-systems",
      filterGroup: "Number Systems",
    };
  }

  return {
    topic: "Digital Logic",
    primaryTopicId: "advanced-logic",
    filterGroup: "Digital Logic",
  };
};

const computeAcceptance = (problem) => {
  const baseByDifficulty = {
    Easy: 78,
    Medium: 58,
    Hard: 36,
  };

  const base = baseByDifficulty[problem.difficulty] || 62;
  const variation = ((problem.id * 17) % 19) - 6;
  return Number(Math.max(28, Math.min(94, base + variation)).toFixed(1));
};

const enrichProblem = (problem) => {
  const inferred = inferTopic(problem);
  const normalizedTags = Array.from(
    new Set([...(problem.tags || []), inferred.filterGroup, "Digital Logic"]),
  );

  return {
    ...problem,
    isSynthetic: problem.isSynthetic === true || problem.id >= 2000,
    slug: slugify(problem.title),
    numericId: problem.id,
    listId: String(problem.id).padStart(4, "0"),
    acceptanceRate: computeAcceptance(problem),
    premium: problem.id % 5 === 0,
    topic: inferred.topic,
    primaryTopicId: inferred.primaryTopicId,
    filterGroup: inferred.filterGroup,
    tags: normalizedTags,
  };
};

const baseCatalog = [...rawProblems, ...syntheticProblems].map(enrichProblem);

const uniqueByTitle = [];
const seenTitles = new Set();
baseCatalog.forEach((problem) => {
  if (!seenTitles.has(problem.title)) {
    uniqueByTitle.push(problem);
    seenTitles.add(problem.title);
  }
});

export const problemsCatalog = uniqueByTitle.sort((left, right) => left.numericId - right.numericId);

export const problemFilterGroups = [
  "All Topics",
  "Digital Logic",
  "Boolean Algebra",
  "K-Map",
  "Number Systems",
  "Arithmetic Functions",
  "Combinational Circuits",
  "Sequential Circuits",
  "Registers & Transfers",
  "Memory Systems",
];

export const problemBannerCards = [
  {
    title: "Circuit Design Drills",
    description: "Design combinational & sequential circuits in Circuit Forge",
    eyebrow: "Circuit Forge",
    gradient: "linear-gradient(135deg, #7c3aed, #a78bfa)",
    filterGroup: "Combinational Circuits",
  },
  {
    title: "K-Map Simplification",
    description: "Minimize Boolean functions with Karnaugh maps — SOP, POS, don't-cares",
    eyebrow: "K-Map Arena",
    gradient: "linear-gradient(135deg, #2563eb, #60a5fa)",
    filterGroup: "K-Map",
  },
  {
    title: "Algebraic Identities",
    description: "Practice consensus, SOP/POS, and Boolean algebra reduction",
    eyebrow: "Boolean Algebra",
    gradient: "linear-gradient(135deg, #f97316, #fb7185)",
    filterGroup: "Boolean Algebra",
  },
  {
    title: "FSM & Flip-Flops",
    description: "Build state machines, sequential counters, and register scheduling",
    eyebrow: "Sequential Design",
    gradient: "linear-gradient(135deg, #0f766e, #14b8a6)",
    filterGroup: "Sequential Circuits",
  },
  {
    title: "Binary Representations",
    description: "Explore signed numbers, BCD, hex, 2's complement conversions",
    eyebrow: "Number Systems",
    gradient: "linear-gradient(135deg, #334155, #64748b)",
    filterGroup: "Number Systems",
  },
  {
    title: "Memory Array Maps",
    description: "Build address decoders and program PLA tables",
    eyebrow: "Memory Systems",
    gradient: "linear-gradient(135deg, #111827, #1d4ed8)",
    filterGroup: "Memory Systems",
  },
];

export const problemDifficultyOptions = ["All Difficulties", "Easy", "Medium", "Hard"];
export const problemStatusOptions = ["All Status", "Solved", "Attempted", "Unsolved"];
export const problemSortOptions = [
  "Recommended",
  "Acceptance",
  "Difficulty",
  "Title",
];

export default problemsCatalog;
