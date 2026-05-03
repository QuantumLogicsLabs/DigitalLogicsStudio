const homeData = [
  {
    title: "🔧 Circuit Forge",
    description:
      "Drag-and-drop logic gates, connect wires, and instantly see truth tables and outputs.",
    section: "featured",
    sortOrder: 1,
    links: [
      {
        text: "Open Circuit Forge →",
        to: "/boolforge",
        primary: true,
      },
    ],
    featured: true,
  },
  {
    title: "🗺️ K-Map Generator",
    description:
      "Generate and simplify boolean expressions visually using interactive Karnaugh maps with SOP/POS optimization.",
    section: "featured",
    sortOrder: 2,
    links: [
      {
        text: "Go to K-Maps →",
        to: "/kmapgenerator",
        primary: true,
      },
    ],
    featured: true,
  },
  {
    title: "📐 Boolean Algebra",
    description:
      "Master the foundations of digital logic with interactive tools for identities, laws, and expressions.",
    section: "topics",
    topicGroup: "algebra",
    topicOrder: 1,
    links: [
      { text: "Overview", to: "/boolean-algebra" },
      { text: "Identities", to: "/boolean-identities" },
      { text: "Laws", to: "/boolean-laws" },
      { text: "Duality", to: "/duality-principle" },
      { text: "Significant Digits", to: "/significant-digits" },
      { text: "Consensus", to: "/consensus-theorem" },
      { text: "Complement", to: "/complement" },
      { text: "SOP & POS", to: "/standard-forms" },
      { text: "Minterms", to: "/minterms" },
      { text: "Maxterms", to: "/maxterms" },
      { text: "Relation", to: "/minterms-maxterms" },
    ],
  },
  {
    title: "⚡ Advanced Logic",
    description:
      "Explore circuit optimization, universal gates, and special functions for deeper understanding.",
    section: "topics",
    topicGroup: "advanced",
    topicOrder: 1,
    links: [
      { text: "Circuit Cost", to: "/circuit-cost" },
      { text: "Universal Gates", to: "/universal-gates" },
      { text: "Odd Function", to: "/odd-function" },
      { text: "Gate Explanations", to: "/gates" },
    ],
  },
  {
    title: "🔀 Combinational Circuits",
    description:
      "Explore encoders and decoders — the core combinational building blocks used in memory systems.",
    section: "topics",
    topicGroup: "circuits",
    topicOrder: 1,
    links: [
      { text: "Encoder", to: "/encoder" },
      { text: "Decoder", to: "/decoder" },
    ],
  },
  {
    title: "🔁 Sequential Circuits",
    description:
      "Dive into memory elements, state machines, and time-dependent circuits.",
    section: "topics",
    topicGroup: "circuits",
    topicOrder: 2,
    className: "sequential-card",
    links: [
      { text: "Introduction", to: "/sequential/intro" },
      { text: "Latches", to: "/sequential/latches" },
      { text: "Flip-Flops", to: "/sequential/flip-flops" },
      { text: "Types of Flip-Flops", to: "/sequential/flip-flop-types" },
      { text: "Analysis", to: "/sequential/analysis" },
      { text: "Design Procedures", to: "/sequential/design-procedures" },
      { text: "State Diagrams & Tables", to: "/sequential/state-diagram" },
      {
        text: "State Reduction & Excitation",
        to: "/sequential/state-reduction",
      },
    ],
  },
  {
    title: "⇌ Registers & Register Transfers",
    description:
      "Explore how digital systems store and move data — from basic flip-flop registers to shift registers, counters, and synchronous binary counting circuits.",
    section: "topics",
    topicGroup: "circuits",
    topicOrder: 3,
    links: [
      { text: "Registers", to: "/registers/intro" },
      { text: "Counters", to: "/registers/counters" },
      { text: "Sync / Async", to: "/registers/sync-async" },
      { text: "Shift Registers", to: "/registers/shift-registers" },
      { text: "Serial Shift Registers", to: "/registers/serial-shift" },
      { text: "Loading Registers", to: "/registers/loading" },
      { text: "Parallel Registers", to: "/registers/parallel" },
      { text: "Ripple Counters", to: "/registers/ripple-counters" },
      { text: "Sync Binary Counters", to: "/registers/sync-binary-counters" },
    ],
  },
  {
    title: "🧠 Memory Systems",
    description:
      "Explore how digital systems store data permanently and temporarily — from ROM and PLA devices to RAM construction using real IC chips.",
    section: "topics",
    topicGroup: "circuits",
    topicOrder: 4,
    links: [
      { text: "Memory Basics", to: "/memory/basics" },
      { text: "Read-Only Memories", to: "/memory/read-only-memories" },
      {
        text: "Programmable Logic Array",
        to: "/memory/programmable-logic-array",
      },
      { text: "Random Access Memory", to: "/memory/random-access-memory" },
      { text: "Static & Dynamic RAM", to: "/memory/static-dynamic-ram" },
      { text: "Array of RAM ICs", to: "/memory/array-of-ram-ics" },
      {
        text: "Memory Construction (RAM)",
        to: "/memory/memory-construction-ram",
      },
    ],
  },
  {
    title: "🔢 Number Systems",
    description:
      "Convert between bases and run detailed step-by-step operations.",
    section: "topics",
    topicGroup: "algebra",
    topicOrder: 2,
    links: [
      { text: "System Calculator", to: "/numbersystemcalculator" },
      { text: "Base Converter", to: "/numberconversation" },
      { text: "Binary Visualizer", to: "/binaryrepresentation" },
      { text: "BCD Notation", to: "/bcd-notation" },
      { text: "ASCII Codes", to: "/ascii-notation" },
      { text: "Bit Converter", to: "/bitconvertor" },
      { text: "Bit Extension", to: "/bit-extension" },
    ],
  },
  {
    title: "➕ ARITHMETIC FUNCTIONS AND HDLs",
    description: "Dedicated interactive modules for arithmetic logic design.",
    section: "topics",
    topicGroup: "algebra",
    topicOrder: 3,
    links: [
      { text: "Binary Adders", to: "/arithmetic/binary-adders" },
      { text: "Binary Subtractor", to: "/arithmetic/binary-subtractor" },
      { text: "Adder/Subtractor", to: "/arithmetic/binary-add-subtractor" },
      { text: "Binary Multipliers", to: "/arithmetic/binary-multipliers" },
      { text: "Code Conversion", to: "/arithmetic/code-conversion" },
      { text: "Magnitude Comparator", to: "/arithmetic/magnitude-comparator" },
      { text: "Parity Generators", to: "/arithmetic/parity-generators" },
      { text: "Design Applications", to: "/arithmetic/design-applications" },
      { text: "1's and 2's Complements", to: "/arithmetic/complements" },
      { text: "Signed/Unsigned Arithmetic", to: "/arithmetic/signed-unsigned" },
    ],
  },
  {
    title: "📚 Learning Resources",
    description: "Access curated problems and additional tools.",
    section: "resources",
    sortOrder: 1,
    links: [
      { text: "Book Ch1 Problems", to: "/book" },
      { text: "Book Ch2 Problems", to: "/book/ch2" },
      { text: "Timing Diagrams", to: "/timing-diagrams" },
    ],
  },
];

export default homeData;
