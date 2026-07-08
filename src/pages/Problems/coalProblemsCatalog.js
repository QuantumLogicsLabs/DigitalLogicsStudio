import rawProblems from "./coalProblemsData";

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const inferTopic = (problem) => {
  const tagText = (problem.tags || []).join(" ").toLowerCase();

  if (tagText.includes("foundations") || tagText.includes("architecture")) {
    return {
      topic: "Foundations",
      primaryTopicId: "intro-computer-organization",
      filterGroup: "Foundations",
    };
  }
  if (tagText.includes("number systems") || tagText.includes("representation")) {
    return {
      topic: "Number Systems",
      primaryTopicId: "number-systems-representation",
      filterGroup: "Number Systems",
    };
  }
  if (
    tagText.includes("addressing") ||
    tagText.includes("registers") ||
    tagText.includes("ia-32") ||
    tagText.includes("endianness")
  ) {
    return {
      topic: "ISA & Registers",
      primaryTopicId: "addressing-modes",
      filterGroup: "ISA & Registers",
    };
  }
  if (tagText.includes("cache") || tagText.includes("memory")) {
    return {
      topic: "Cache & Memory",
      primaryTopicId: "memory-hierarchy",
      filterGroup: "Cache & Memory",
    };
  }
  if (tagText.includes("interrupts") || tagText.includes("i/o")) {
    return {
      topic: "I/O & Interrupts",
      primaryTopicId: "io-interrupts",
      filterGroup: "I/O & Interrupts",
    };
  }
  if (
    tagText.includes("pipelining") ||
    tagText.includes("hazards") ||
    tagText.includes("families")
  ) {
    return {
      topic: "Pipelining & RISC",
      primaryTopicId: "pipelining",
      filterGroup: "Pipelining & RISC",
    };
  }
  return {
    topic: "Assembly Programming",
    primaryTopicId: "coal-syntax",
    filterGroup: "Assembly Programming",
  };
};

const computeAcceptance = (problem) => {
  const baseByDifficulty = {
    Easy: 81,
    Medium: 61,
    Hard: 40,
  };

  const base = baseByDifficulty[problem.difficulty] || 60;
  const variation = ((problem.id * 13) % 17) - 5;
  return Number(Math.max(30, Math.min(95, base + variation)).toFixed(1));
};

const enrichProblem = (problem) => {
  const inferred = inferTopic(problem);
  const normalizedTags = Array.from(
    new Set([...(problem.tags || []), inferred.filterGroup, "COAL"]),
  );

  return {
    ...problem,
    isSynthetic: true, // COAL problems are always conceptual solvers
    slug: slugify(problem.title),
    numericId: problem.id,
    listId: `COAL-${problem.id}`,
    acceptanceRate: computeAcceptance(problem),
    premium: problem.id % 5 === 0,
    topic: inferred.topic,
    primaryTopicId: inferred.primaryTopicId,
    filterGroup: inferred.filterGroup,
    tags: normalizedTags,
  };
};

export const problemsCatalog = rawProblems.map(enrichProblem);

export const problemFilterGroups = [
  "All Topics",
  "Foundations",
  "Number Systems",
  "ISA & Registers",
  "Assembly Programming",
  "Cache & Memory",
  "I/O & Interrupts",
  "Pipelining & RISC",
];

export const problemBannerCards = [
  {
    title: "Assembly Arena",
    description: "Practice register operations, loops, procedure calls, and stack manipulation",
    eyebrow: "x86 Code Drills",
    gradient: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
    filterGroup: "Assembly Programming",
    path: "/resources/coal/practical/instruction-trace-lab",
  },
  {
    title: "CPU & Pipelining",
    description: "Analyze instruction pipeline stages, hazards, and forwarding techniques",
    eyebrow: "Pipelining & RISC",
    gradient: "linear-gradient(135deg, #ea580c, #f43f5e)",
    filterGroup: "Pipelining & RISC",
    path: "/coal/pipelining",
  },
  {
    title: "Memory Hierarchy",
    description: "Model direct-mapped, associative caches and RAM address decoding space",
    eyebrow: "Cache & Memory",
    gradient: "linear-gradient(135deg, #059669, #10b981)",
    filterGroup: "Cache & Memory",
    path: "/coal/memory-hierarchy",
  },
  {
    title: "Number Representation",
    description: "Convert bases, calculate overflow, and trace signed 2's complement bounds",
    eyebrow: "Number Systems",
    gradient: "linear-gradient(135deg, #374151, #4b5563)",
    filterGroup: "Number Systems",
    path: "/number-systems/calculator",
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
