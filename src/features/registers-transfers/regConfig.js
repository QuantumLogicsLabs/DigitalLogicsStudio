export const regPages = [
  {
    path: "/registers/intro",
    label: "Registers",
    description: "Register fundamentals, data storage roles, and system context.",
  },
  {
    path: "/registers/counters",
    label: "Counters",
    description: "Counting circuits, sequences, and binary progression behavior.",
  },
  {
    path: "/registers/sync-async",
    label: "Synchronous / Asynchronous",
    description: "Clocked coordination and the tradeoffs of async transitions.",
  },
  {
    path: "/registers/shift-registers",
    label: "Shift Registers",
    description: "Move data bit by bit through serial and parallel structures.",
  },
  {
    path: "/registers/serial-shift",
    label: "Serial Shift Registers",
    description: "Serial loading, shifting patterns, and timing of bit movement.",
  },
  {
    path: "/registers/loading",
    label: "Loading Registers",
    description: "Control how data enters registers cleanly and predictably.",
  },
  {
    path: "/registers/parallel",
    label: "Parallel Registers",
    description: "Parallel transfer techniques for wider, faster data movement.",
  },
  {
    path: "/registers/ripple-counters",
    label: "Ripple Counters",
    description: "Asynchronous counter propagation and cumulative delay effects.",
  },
  {
    path: "/registers/sync-binary-counters",
    label: "Synchronous Binary Counters",
    description: "Tighter clocked counter design with coordinated state changes.",
  },
];

export const REG_PATH_TO_SUBTOPIC_ID = Object.fromEntries(
  regPages.map((page) => [page.path, page.path.replace("/registers/", "")]),
);

export const REG_TOPIC = {
  id: "registers-and-register-transfers",
  title: "REGISTERS & REGISTER TRANSFERS",
  links: Object.values(REG_PATH_TO_SUBTOPIC_ID).map((id) => ({ id })),
};
