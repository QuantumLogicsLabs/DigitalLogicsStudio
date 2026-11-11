// Every page here ends with a quiz. `assessment: true` tells the learning
// shell not to tick the page on scroll or via "Mark as Read" — the page's
// Quiz ticks it instead, once the learner passes (see QUIZ_PASS_PERCENT).
export const combinationalPages = [
  {
    path: "/encoder",
    label: "Encoder",
    description: "Compress active input lines into compact binary output codes.",
    assessment: true,
  },
  {
    path: "/decoder",
    label: "Decoder",
    description: "Expand binary inputs into one-hot outputs and minterm logic.",
    assessment: true,
  },
  {
    path: "/mux",
    label: "Multiplexer",
    description: "Route one of many inputs onto a single controlled output line.",
    assessment: true,
  },
  {
    path: "/demux",
    label: "Demultiplexer",
    description: "Distribute one input signal across a selected output channel.",
    assessment: true,
  },
];

// Minimum share of correct quiz answers needed to complete a topic.
export const QUIZ_PASS_PERCENT = 70;

// Number of correct answers needed to pass a quiz of `total` questions.
// Integer maths on purpose: 0.7 * n can land just above a whole number.
export const getQuizPassMark = (total) =>
  Math.ceil((total * QUIZ_PASS_PERCENT) / 100);

export const COMBINATIONAL_PATH_TO_SUBTOPIC_ID = {
  "/encoder": "encoder",
  "/decoder": "decoder",
  "/mux": "mux",
  "/demux": "demux",
};

export const COMBINATIONAL_TOPIC = {
  id: "combinational-circuits",
  title: "COMBINATIONAL CIRCUITS",
  links: Object.values(COMBINATIONAL_PATH_TO_SUBTOPIC_ID).map((id) => ({ id })),
};
