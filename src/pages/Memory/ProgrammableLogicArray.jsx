import React from "react";
import MemoryLayout from "./MemoryLayout";
import {
  MemSection, MemCard, MemCardGroup, MemInfoPanel,
  MemStepList, MemCode, MemDivider, MemQuiz, MemTable,
} from "./components/MemComponents";

const QUIZ = [
  {
    q: "What are the two planes in a PLA?",
    opts: [
      "AND plane and OR plane",
      "NOR plane and NAND plane",
      "XOR plane and XNOR plane",
      "Input plane and Output plane",
    ],
    ans: 0,
    explain: "A PLA has a programmable AND plane (product terms) and a programmable OR plane (sum of products).",
  },
  {
    q: "What does PLA stand for?",
    opts: [
      "Programmable Logic Array",
      "Parallel Logic Architecture",
      "Programmable Lookup Array",
      "Parallel Lookup Architecture",
    ],
    ans: 0,
    explain: "PLA stands for Programmable Logic Array.",
  },
  {
    q: "How does a PAL differ from a PLA?",
    opts: [
      "PAL has a programmable AND plane and fixed OR plane",
      "PAL has a fixed AND plane and programmable OR plane",
      "PAL has no OR plane",
      "PAL is not programmable",
    ],
    ans: 0,
    explain: "A PAL (Programmable Array Logic) has a programmable AND plane but a fixed OR plane, making it simpler than a PLA.",
  },
  {
    q: "What technology replaced simple PLAs in modern design?",
    opts: ["Vacuum tubes", "FPGAs", "Relays", "Analog circuits"],
    ans: 1,
    explain: "FPGAs (Field-Programmable Gate Arrays) have largely replaced simple PLAs for complex programmable logic.",
  },
];

const ProgrammableLogicArray = () => (
  <MemoryLayout
    kicker="Memory Systems"
    title="Programmable Logic Array (PLA)"
    description="PLAs are programmable chips that implement combinational logic using a programmable AND-OR structure. They offer flexibility between full custom ICs and fixed-function logic gates."
  >
    <MemSection
      kicker="Concept"
      title="What is a PLA?"
      description="A PLA implements Boolean functions in Sum-of-Products (SOP) form using two programmable planes: an AND plane and an OR plane."
      delay={0}
    >
      <MemCardGroup>
        <MemInfoPanel icon="∩" title="AND Plane"  content="Programmable — generates product terms (minterms)" color="#38bdf8" />
        <MemInfoPanel icon="∪" title="OR Plane"   content="Programmable — sums selected product terms"       color="#818cf8" />
        <MemInfoPanel icon="✅" title="Advantage" content="Fewer product terms than a full ROM decoder"       color="#34d399" />
      </MemCardGroup>
    </MemSection>

    <MemSection
      kicker="Architecture"
      title="PLA Structure"
      description="A PLA with n inputs, k product terms, and m outputs can implement m Boolean functions using at most k product terms. Only required minterms are programmed — not all 2ⁿ."
      delay={100}
    >
      <MemCard title="PLA Example: 3 inputs, 4 product terms, 2 outputs">
        <MemCode lines={[
          { text: "── AND Plane (product terms) ──────────────", color: "#38bdf8" },
          { text: "P1 = A · B'· C", color: "var(--mem-text)" },
          { text: "P2 = A'· B · C", color: "var(--mem-text)" },
          { text: "P3 = A · B · C'", color: "var(--mem-text)" },
          { text: "P4 = A · B · C", color: "var(--mem-text)" },
          { text: "" },
          { text: "── OR Plane (sum of products) ─────────────", color: "#818cf8" },
          { text: "F1 = P1 + P2 + P4   →  output 1", color: "#34d399" },
          { text: "F2 = P2 + P3 + P4   →  output 2", color: "#34d399" },
        ]} />
      </MemCard>
    </MemSection>

    <MemSection
      kicker="Comparison"
      title="PLA vs PAL vs ROM"
      description="Each programmable logic device has different trade-offs between flexibility and simplicity."
      delay={150}
    >
      <MemTable
        headers={["Device", "AND Plane", "OR Plane", "Flexibility", "Complexity"]}
        rows={[
          ["ROM", "Fixed (full decoder)", "Programmable", "Low",    "Simple"],
          ["PAL", "Programmable",         "Fixed",         "Medium", "Medium"],
          ["PLA", "Programmable",         "Programmable",  "High",   "High"],
          ["GAL", "Programmable",         "Fixed (EE)",    "Medium", "Reusable"],
          ["FPGA","LUTs",                 "LUTs",          "Highest","Modern"],
        ]}
        colColors={[null, "#38bdf8", "#818cf8", "#34d399", "#fb923c"]}
      />
    </MemSection>

    <MemSection
      kicker="Details"
      title="Device Breakdown"
      delay={200}
    >
      <MemStepList
        steps={[
          "ROM — Fixed AND plane (full decoder for all minterms), programmable OR plane. Implements any function but uses all minterms.",
          "PLA — Both AND and OR planes are programmable. Most flexible but requires complex programming and has propagation delays.",
          "PAL — Programmable AND plane, fixed OR plane. Simpler than PLA, widely used in older designs.",
          "GAL (Generic Array Logic) — Electrically erasable PAL variant; reusable and reprogrammable in-circuit.",
          "FPGA — Modern replacement with lookup tables (LUTs), flip-flops, and routing fabric; reconfigurable after deployment.",
        ]}
      />
    </MemSection>

    <MemDivider />

    <MemQuiz questions={QUIZ} />
  </MemoryLayout>
);

export default ProgrammableLogicArray;
