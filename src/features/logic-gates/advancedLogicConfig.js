export const advancedLogicPages = [
  {
    path: "/circuit-cost",
    label: "Circuit Cost",
    description: "Measure literal and gate-input cost for implementation choices.",
  },
  {
    path: "/universal-gates",
    label: "Universal Gates",
    description: "Build complete logic systems using only NAND or NOR gates.",
  },
  {
    path: "/odd-function",
    label: "Odd Function",
    description: "Study 3-variable XOR and parity behavior as a design pattern.",
  },
  {
    path: "/gates",
    label: "Gate Explanations",
    description: "Review symbols, behavior, and intuition for the full gate set.",
  },
];

export const ADVANCED_LOGIC_PATH_TO_SUBTOPIC_ID = {
  "/circuit-cost": "circuit-cost",
  "/universal-gates": "universal-gates",
  "/odd-function": "odd-function",
  "/gates": "gates",
};

export const ADVANCED_LOGIC_TOPIC = {
  id: "advanced-logic",
  title: "ADVANCED LOGIC",
  links: Object.values(ADVANCED_LOGIC_PATH_TO_SUBTOPIC_ID).map((id) => ({ id })),
};
