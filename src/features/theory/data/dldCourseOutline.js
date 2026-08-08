// ── DLD Course Outline ──────────────────────────────────────────────
// Mirrors coalCourseOutline.js's shape (meta + parts[].modules[]) so
// both tracks can share the same generic layout/sidebar/home-page
// components (see ../tracks.js).
//
// Practical/interactive modules are intentionally excluded — this
// outline is theory-only. The dedicated tool feature folders
// (arithmetic-hdl, the number-systems calculators, combinational/
// sequential simulators where they exist, trainer-board, boolforge,
// kmap, etc.) are untouched and keep their own routes.
//
// Each module's `path` is the topic's REAL, EXISTING route — nothing
// here changes any URL. `slug` is only used as the content-data lookup
// key (see dldTopicContent.js). Where a part's original standalone
// Layout derived its saved-progress subtopic ID differently than
// `slug`, that's captured explicitly via `subtopicId` so returning
// users' progress isn't reset when a part gets migrated onto the
// shared shell.
export const dldCourseMeta = {
  id: "dld",
  title: "Digital Logic Design",
  shortTitle: "DLD",
  eyebrow: "Core Theory",
  description:
    "Boolean algebra, number systems, combinational and sequential circuits, registers, and memory — the theory foundation for every digital system.",
  accent: "#5b8cff",
  dataSources: ["Digital Design (Mano)", "Digital Logic & Computer Design (Mano)"],
};

export const dldCourseParts = [
  {
    id: "boolean-algebra",
    part: 1,
    title: "Boolean Algebra",
    summary: "The algebra that every digital circuit is built on — identities, laws, duality, and canonical forms.",
    modules: [
      { id: "ba-overview", slug: "boolean-overview", title: "Boolean Algebra", path: "/boolean/overview", description: "What Boolean algebra is and why it powers every digital circuit." },
      { id: "ba-identities", slug: "boolean-identities", title: "Boolean Identities", path: "/boolean/identities", description: "Idempotent, identity, domination, complementarity, and more." },
      { id: "ba-laws", slug: "boolean-laws", title: "Boolean Laws", path: "/boolean/laws", description: "Commutative, associative, distributive, absorption, De Morgan." },
      { id: "ba-complement", slug: "boolean-complement", title: "Complement", path: "/boolean/complement", description: "Complementing single variables and entire Boolean expressions." },
      { id: "ba-duality", slug: "boolean-duality", title: "Duality Principle", path: "/boolean/duality", description: "Swap operators and identity values — every identity has a dual." },
      { id: "ba-consensus", slug: "boolean-consensus", title: "Consensus Theorem", path: "/boolean/consensus", description: "Eliminate redundant terms using the consensus theorem." },
      { id: "ba-minterms", slug: "boolean-minterms", title: "Minterms", path: "/boolean/minterms", description: "Sum of products: every row of a truth table as a minterm." },
      { id: "ba-maxterms", slug: "boolean-maxterms", title: "Maxterms", path: "/boolean/maxterms", description: "Product of sums: the dual representation of minterms." },
      { id: "ba-min-max", slug: "boolean-minterms-maxterms", title: "Minterms & Maxterms", path: "/boolean/minterms-maxterms", description: "How minterms and maxterms relate and complement each other." },
      { id: "ba-sig-digits", slug: "boolean-significant-digits", title: "Significant Digits", path: "/boolean/significant-digits", description: "Count significant figures, MSD, and LSD for any number." },
    ],
  },
  {
    id: "number-systems",
    part: 2,
    title: "Number Systems",
    summary: "How digital systems represent integers, decimal digits, and characters as bits.",
    modules: [
      { id: "ns-binary-rep", slug: "binary-representation", title: "Binary Representation", path: "/number-systems/binary-representation", description: "How integers are stored as sequences of 0s and 1s." },
      { id: "ns-bit-extension", slug: "bit-extension", title: "Bit Extension", path: "/number-systems/bit-extension", description: "Sign-extend or zero-extend values to wider bit widths." },
      { id: "ns-bcd", slug: "bcd-notation", title: "BCD Notation", path: "/number-systems/bcd-notation", description: "Binary Coded Decimal: each digit encoded in 4 bits." },
      { id: "ns-ascii", slug: "ascii-notation", title: "ASCII Notation", path: "/number-systems/ascii-notation", description: "The 7-bit character encoding behind every text string." },
    ],
  },
  {
    id: "combinational-circuits",
    part: 3,
    title: "Combinational Circuits",
    summary: "Circuits whose outputs depend only on current inputs — encoders, decoders, multiplexers, demultiplexers.",
    modules: [
      { id: "comb-encoder", slug: "encoder", title: "Encoder", path: "/encoder", description: "Compress active input lines into compact binary output codes." },
      { id: "comb-decoder", slug: "decoder", title: "Decoder", path: "/decoder", description: "Expand binary inputs into one-hot outputs and minterm logic." },
      { id: "comb-mux", slug: "multiplexer", title: "Multiplexer", path: "/mux", description: "Route one of many inputs onto a single controlled output line." },
      { id: "comb-demux", slug: "demultiplexer", title: "Demultiplexer", path: "/demux", description: "Distribute one input signal across a selected output channel." },
    ],
  },
  {
    id: "sequential-circuits",
    part: 4,
    title: "Sequential Circuits",
    summary: "Circuits with memory — latches, flip-flops, and the analysis/design procedures built on them.",
    modules: [
      { id: "seq-intro", slug: "sequential-intro", title: "Introduction", path: "/sequential/intro", description: "Core sequential-circuit ideas, memory, and timing behavior." },
      { id: "seq-latches", slug: "sequential-latches", title: "Latches", path: "/sequential/latches", description: "SR and gated latches as the first state-holding building blocks." },
      { id: "seq-flip-flops", slug: "sequential-flip-flops", title: "Flip-Flops", path: "/sequential/flip-flops", description: "Edge-triggered memory elements and their timing semantics." },
      { id: "seq-ff-types", slug: "sequential-flip-flop-types", title: "Flip-Flop Types", path: "/sequential/flip-flop-types", description: "Compare SR, JK, D, and T flip-flops with design tradeoffs." },
      { id: "seq-analysis", slug: "sequential-analysis", title: "Analysis", path: "/sequential/analysis", description: "Derive state behavior from equations, excitation, and transitions." },
      { id: "seq-design", slug: "sequential-design-procedures", title: "Design Procedures", path: "/sequential/design-procedures", description: "Structured workflows for building sequential systems correctly." },
      { id: "seq-state-diagram", slug: "sequential-state-diagram", title: "State Diagrams", path: "/sequential/state-diagram", description: "Translate between states, transitions, tables, and behavior." },
      { id: "seq-state-reduction", slug: "sequential-state-reduction", title: "State Reduction", path: "/sequential/state-reduction", description: "Minimize states and compute efficient excitation requirements." },
    ],
  },
  {
    id: "registers-and-register-transfers",
    part: 5,
    title: "Registers & Register Transfers",
    summary: "Storage, shifting, loading, and counting — the building blocks that move and hold data between operations.",
    modules: [
      { id: "reg-intro", slug: "registers-intro", subtopicId: "registers", title: "Registers", path: "/registers/intro", description: "Register fundamentals, data storage roles, and system context." },
      { id: "reg-counters", slug: "registers-counters", title: "Counters", path: "/registers/counters", description: "Counting circuits, sequences, and binary progression behavior." },
      { id: "reg-sync-async", slug: "registers-sync-async", title: "Synchronous / Asynchronous", path: "/registers/sync-async", description: "Clocked coordination and the tradeoffs of async transitions." },
      { id: "reg-shift", slug: "registers-shift-registers", title: "Shift Registers", path: "/registers/shift-registers", description: "Move data bit by bit through serial and parallel structures." },
      { id: "reg-serial-shift", slug: "registers-serial-shift", title: "Serial Shift Registers", path: "/registers/serial-shift", description: "Serial loading, shifting patterns, and timing of bit movement." },
      { id: "reg-loading", slug: "registers-loading", title: "Loading Registers", path: "/registers/loading", description: "Control how data enters registers cleanly and predictably." },
      { id: "reg-parallel", slug: "registers-parallel", title: "Parallel Registers", path: "/registers/parallel", description: "Parallel transfer techniques for wider, faster data movement." },
      { id: "reg-ripple", slug: "registers-ripple-counters", title: "Ripple Counters", path: "/registers/ripple-counters", description: "Asynchronous counter propagation and cumulative delay effects." },
      { id: "reg-sync-binary", slug: "registers-sync-binary-counters", title: "Synchronous Binary Counters", path: "/registers/sync-binary-counters", description: "Tighter clocked counter design with coordinated state changes." },
    ],
  },
  {
    id: "memory-systems",
    part: 6,
    title: "Memory Systems",
    summary: "Storage architectures, ROM/RAM families, and how real memory systems are built from ICs.",
    modules: [
      { id: "mem-basics", slug: "basics", title: "Memory Basics", path: "/memory/basics", description: "Volatile vs non-volatile, bits, bytes, and address spaces." },
      { id: "mem-rom", slug: "read-only-memories", title: "Read-Only Memories", path: "/memory/read-only-memories", description: "Mask ROM, PROM, EPROM, EEPROM, and Flash memory types." },
      { id: "mem-pla", slug: "programmable-logic-array", title: "Programmable Logic Array", path: "/memory/programmable-logic-array", description: "AND-OR programmable planes for combinational logic." },
      { id: "mem-ram", slug: "random-access-memory", title: "Random Access Memory", path: "/memory/random-access-memory", description: "Read/write volatile memory, signals, and access cycles." },
      { id: "mem-static-dynamic", slug: "static-dynamic-ram", title: "Static & Dynamic RAM", path: "/memory/static-dynamic-ram", description: "Flip-flop vs capacitor storage, refresh, and trade-offs." },
      { id: "mem-array", slug: "array-of-ram-ics", title: "Array of RAM ICs", path: "/memory/array-of-ram-ics", description: "Word-length and address expansion using multiple chips." },
      { id: "mem-construction", slug: "memory-construction-ram", title: "Memory Construction", path: "/memory/memory-construction-ram", description: "Build any memory size from RAM ICs with decoders and buses." },
    ],
  },
  {
    id: "advanced-logic",
    part: 7,
    title: "Advanced Logic",
    summary: "Optimization, universal construction, parity, and deeper reasoning about gate-level circuits.",
    modules: [
      { id: "adv-circuit-cost", slug: "circuit-cost", title: "Circuit Cost", path: "/circuit-cost", description: "Measure literal and gate-input cost for implementation choices." },
      { id: "adv-universal-gates", slug: "universal-gates", title: "Universal Gates", path: "/universal-gates", description: "Build complete logic systems using only NAND or NOR gates." },
      { id: "adv-odd-function", slug: "odd-function", title: "Odd Function", path: "/odd-function", description: "Study 3-variable XOR and parity behavior as a design pattern." },
      { id: "adv-gates", slug: "gates", title: "Gate Explanations", path: "/gates", description: "Review symbols, behavior, and intuition for the full gate set." },
    ],
  },
];

export default dldCourseParts;
