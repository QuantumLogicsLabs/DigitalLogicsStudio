const homeData = [
  {
    title: "🔧 Circuit Forge",
    description:
      "Drag-and-drop logic gates, connect wires, and instantly see truth tables and outputs.",
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
    links: [
      { text: "Overview", to: "/boolean-algebra" },
      { text: "Identities", to: "/boolean-identities" },
      { text: "Laws", to: "/boolean-laws" },
      { text: "Duality", to: "/duality-principle" },
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
    links: [
      { text: "Encoder", to: "/encoder" },
      { text: "Decoder", to: "/decoder" },
    ],
  },
  {
    title: "🔁 Sequential Circuits",
    description:
      "Dive into memory elements, state machines, and time-dependent circuits.",
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
    title: "🔢 Number Systems",
    description:
      "Convert between bases and run detailed step-by-step operations.",
    links: [
      { text: "System Calculator", to: "/numbersystemcalculator" },
      { text: "Base Converter", to: "/numberconversation" },
      { text: "Binary Visualizer", to: "/binaryrepresentation" },
      { text: "BCD Notation", to: "/bcd-notation" },
      { text: "ASCII Codes", to: "/ascii-notation" },
    ],
  },
  {
    title: "➕ ARITHMETIC FUNCTIONS AND HDLs",
    description: "Dedicated interactive modules for arithmetic logic design.",
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
    links: [
      { text: "Book Ch1 Problems", to: "/book" },
      { text: "Book Ch2 Problems", to: "/book/ch2" },
      { text: "Timing Diagrams", to: "/timing-diagrams" },
    ],
  },
];

export default homeData;
