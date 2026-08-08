export const combinationalPages = [
  {
    path: "/encoder",
    label: "Encoder",
    description: "Compress active input lines into compact binary output codes.",
  },
  {
    path: "/decoder",
    label: "Decoder",
    description: "Expand binary inputs into one-hot outputs and minterm logic.",
  },
  {
    path: "/mux",
    label: "Multiplexer",
    description: "Route one of many inputs onto a single controlled output line.",
  },
  {
    path: "/demux",
    label: "Demultiplexer",
    description: "Distribute one input signal across a selected output channel.",
  },
];

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
