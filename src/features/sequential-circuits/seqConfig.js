export const seqPages = [
  {
    path: "/sequential/intro",
    label: "Introduction",
    description: "Core sequential-circuit ideas, memory, and timing behavior.",
  },
  {
    path: "/sequential/latches",
    label: "Latches",
    description: "SR and gated latches as the first state-holding building blocks.",
  },
  {
    path: "/sequential/flip-flops",
    label: "Flip-Flops",
    description: "Edge-triggered memory elements and their timing semantics.",
  },
  {
    path: "/sequential/flip-flop-types",
    label: "Flip-Flop Types",
    description: "Compare SR, JK, D, and T flip-flops with design tradeoffs.",
  },
  {
    path: "/sequential/analysis",
    label: "Analysis",
    description: "Derive state behavior from equations, excitation, and transitions.",
  },
  {
    path: "/sequential/design-procedures",
    label: "Design Procedures",
    description: "Structured workflows for building sequential systems correctly.",
  },
  {
    path: "/sequential/state-diagram",
    label: "State Diagrams",
    description: "Translate between states, transitions, tables, and behavior.",
  },
  {
    path: "/sequential/state-reduction",
    label: "State Reduction",
    description: "Minimize states and compute efficient excitation requirements.",
  },
];

export const SEQ_PATH_TO_SUBTOPIC_ID = Object.fromEntries(
  seqPages.map((page) => [page.path, page.path.replace("/sequential/", "")]),
);

export const SEQ_TOPIC = {
  id: "sequential-circuits",
  title: "SEQUENTIAL CIRCUITS",
  links: Object.values(SEQ_PATH_TO_SUBTOPIC_ID).map((id) => ({ id })),
};
