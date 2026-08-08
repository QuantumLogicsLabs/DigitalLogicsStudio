import React from "react";

// Map search keywords to lazy-loaded route components. These paths mirror the lazy imports used in App.js.
// The map isn't exhaustive of every possible keyword; it uses a set of common keywords per route.
// Add or edit entries as needed for better matching.

export const SEARCH_PREVIEW_MAP = [
  {
    keywords: ["boolean algebra", "boolean overview", "boolean"],
    title: "Boolean Algebra Overview",
    route: "/boolean/overview",
    Component: React.lazy(() => import("../../features/boolean-algebra/BooleanAlgebraOverview")),
  },
  {
    keywords: ["boolean identities", "identities"],
    title: "Boolean Identities",
    route: "/boolean/identities",
    Component: React.lazy(() => import("../../features/boolean-algebra/BooleanIdentities")),
  },
  {
    keywords: ["boolean laws", "laws"],
    title: "Boolean Laws",
    route: "/boolean/laws",
    Component: React.lazy(() => import("../../features/boolean-algebra/BooleanLaws")),
  },
  {
    keywords: ["complement", "boolean complement"],
    title: "Complement",
    route: "/boolean/complement",
    Component: React.lazy(() => import("../../features/boolean-algebra/ComplementPage")),
  },
  {
    keywords: ["duality", "duality principle"],
    title: "Duality Principle",
    route: "/boolean/duality",
    Component: React.lazy(() => import("../../features/boolean-algebra/DualityPrinciple")),
  },
  {
    keywords: ["consensus", "consensus theorem"],
    title: "Consensus Theorem",
    route: "/boolean/consensus",
    Component: React.lazy(() => import("../../features/boolean-algebra/ConsensusTheorem")),
  },
  {
    keywords: ["minterms", "minterms page"],
    title: "Minterms",
    route: "/boolean/minterms",
    Component: React.lazy(() => import("../../features/boolean-algebra/MintermsPage")),
  },
  {
    keywords: ["maxterms", "maxterms page"],
    title: "Maxterms",
    route: "/boolean/maxterms",
    Component: React.lazy(() => import("../../features/boolean-algebra/MaxtermsPage")),
  },
  {
    keywords: ["standard forms", "standard-forms"],
    title: "Standard Forms",
    route: "/standard-forms",
    Component: React.lazy(() => import("../../features/boolean-algebra/StandardForms")),
  },
  {
    keywords: ["circuit cost", "cost"],
    title: "Circuit Cost",
    route: "/circuit-cost",
    Component: React.lazy(() => import("../../features/boolean-algebra/CircuitCost")),
  },
  {
    keywords: ["universal gates", "universal"],
    title: "Universal Gates",
    route: "/universal-gates",
    Component: React.lazy(() => import("../../features/logic-gates/UniversalGates")),
  },
  {
    keywords: ["gates", "logic gates"],
    title: "Logic Gates",
    route: "/gates",
    Component: React.lazy(() => import("../../features/logic-gates/GateExplanation")),
  },
  {
    keywords: ["timing diagrams", "timing"],
    title: "Timing Diagrams",
    route: "/timing-diagrams",
    Component: React.lazy(() => import("../../features/TimeDiagrams/TimeDiagrams")),
  },
  {
    keywords: ["binary representation", "number systems", "number system"],
    title: "Binary Representation",
    route: "/number-systems/binary-representation",
    Component: React.lazy(() => import("../../features/number-systems/BinaryRepresentation")),
  },
  {
    keywords: ["number conversion", "number converter", "number conversion"],
    title: "Number Conversion",
    route: "/number-systems/number-conversion",
    Component: React.lazy(() => import("../../features/number-systems/NumberConversation")),
  },
  {
    keywords: ["kmap", "k-map", "k map"],
    title: "Karnaugh Map Generator",
    route: "/kmapgenerator",
    Component: React.lazy(() => import("../../features/kmap/KmapGenerator")),
  },
  {
    keywords: ["parity", "parity bit"],
    title: "Parity Bit Calculator",
    route: "/paritybitcalculator",
    Component: React.lazy(() => import("../../features/arithmetic-hdl/ParityBitCalculator")),
  },
  {
    keywords: ["encoder", "decoder"],
    title: "Encoder / Decoder",
    route: "/encoder",
    Component: React.lazy(() => import("../../features/combinational-circuits/encoder-decoder/encoder/EncoderPage")),
  },
  {
    keywords: ["mux", "demux", "multiplexer", "demultiplexer"],
    title: "Mux / Demux",
    route: "/mux",
    Component: React.lazy(() => import("../../features/combinational-circuits/mux-demux/mux/MuxPage")),
  },
  {
    keywords: ["sequential", "sequential circuits", "state diagram"],
    title: "Sequential Circuits Intro",
    route: "/sequential/intro",
    Component: React.lazy(() => import("../../features/sequential-circuits/SeqIntro")),
  },
  {
    keywords: ["flip-flops", "flip flop", "ff"],
    title: "Flip-Flops",
    route: "/sequential/flip-flops",
    Component: React.lazy(() => import("../../features/sequential-circuits/SeqFlipFlops")),
  },
  {
    keywords: ["registers", "counters", "shift register"],
    title: "Registers & Transfers",
    route: "/registers/intro",
    Component: React.lazy(() => import("../../features/registers-transfers/RegIntro")),
  },
  {
    keywords: ["memory", "ram", "rom"],
    title: "Memory Basics",
    route: "/memory/basics",
    Component: React.lazy(() => import("../../shared/layouts/AdvancedLogicLayout")),
  },
  {
    keywords: ["coal", "resources coal"],
    title: "COAL Resources",
    route: "/resources/coal",
    Component: React.lazy(() => import("../../features/coal/CoalHomeRoute")),
  },
  {
    keywords: ["boolforge", "boolforge tool"],
    title: "Boolforge",
    route: "/boolforge",
    Component: React.lazy(() => import("../../features/boolforge/Boolforge")),
  },
  // Add more entries as needed; this list follows the routes defined in App.js
];

export default SEARCH_PREVIEW_MAP;
