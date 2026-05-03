import React from "react";
import MemoryLayout from "./MemoryLayout";
import {
  MemSection, MemCard, MemCardGroup, MemInfoPanel,
  MemStepList, MemCode, MemDivider, MemQuiz, MemTable,
} from "./components/MemComponents";

const QUIZ = [
  {
    q: "What is the basic unit of memory storage?",
    opts: ["Byte", "Bit", "Word", "Nibble"],
    ans: 1,
    explain: "A bit (binary digit) is the smallest unit of memory, holding either 0 or 1.",
  },
  {
    q: "Which type of memory loses data when power is removed?",
    opts: ["ROM", "Flash", "RAM", "EPROM"],
    ans: 2,
    explain: "RAM (Random Access Memory) is volatile — it loses its contents without power.",
  },
  {
    q: "How many bits are in one byte?",
    opts: ["4", "16", "8", "32"],
    ans: 2,
    explain: "One byte = 8 bits. This is the standard grouping used in modern computing.",
  },
  {
    q: "What does 'address' mean in the context of memory?",
    opts: [
      "The speed of memory",
      "A unique location identifier",
      "The type of data stored",
      "The size of memory",
    ],
    ans: 1,
    explain: "An address is a unique number that identifies a specific memory location.",
  },
];

const MemoryBasics = () => (
  <MemoryLayout
    kicker="Memory Systems"
    title="Memory Basics"
    description="Memory stores data and instructions in a digital system. Understanding how memory is organized, addressed, and classified is fundamental to digital design."
  >
    <MemSection
      kicker="Overview"
      title="What is Memory?"
      description="Memory in digital systems refers to devices that can store binary information (0s and 1s). The stored information can be retrieved later for computation or display."
      delay={0}
    >
      <MemCardGroup>
        <MemInfoPanel
          icon="⚡"
          title="Volatile Memory"
          content="Loses data when power is off. Example: SRAM, DRAM"
          color="#f87171"
        />
        <MemInfoPanel
          icon="🔒"
          title="Non-Volatile"
          content="Retains data without power. Example: ROM, Flash"
          color="#34d399"
        />
        <MemInfoPanel
          icon="📦"
          title="Storage Unit"
          content="Bit → Nibble (4b) → Byte (8b) → Word (16–64b)"
          color="#38bdf8"
        />
      </MemCardGroup>
    </MemSection>

    <MemSection
      kicker="Structure"
      title="Memory Organization"
      description="Memory is organized as an array of storage locations, each uniquely identified by an address. The number of address lines determines how many locations exist."
      delay={100}
    >
      <MemCard title="Address → Location Count Formula">
        <MemCode lines={[
          { text: "n address lines  →  2ⁿ unique locations", color: "var(--mem-muted)" },
          { text: "" },
          { text: "n = 10  →  2¹⁰  = 1,024    = 1K locations", color: "#38bdf8" },
          { text: "n = 16  →  2¹⁶  = 65,536   = 64K locations", color: "#818cf8" },
          { text: "n = 20  →  2²⁰  = 1,048,576 = 1M locations", color: "#34d399" },
          { text: "n = 32  →  2³²  ≈ 4 billion  = 4G locations", color: "#fb923c" },
        ]} />
      </MemCard>
    </MemSection>

    <MemSection
      kicker="Capacity"
      title="Reading Memory Specs"
      description="A memory chip is described as (locations × bits per location). For example, a 1K×8 chip has 1024 locations, each storing 8 bits."
      delay={150}
    >
      <MemTable
        headers={["Spec", "Locations", "Bits/Location", "Total Bits"]}
        rows={[
          ["256 × 4",  "256",  "4",  "1,024 b (1 Kb)"],
          ["1K × 8",   "1024", "8",  "8,192 b (8 Kb)"],
          ["4K × 8",   "4096", "8",  "32,768 b (32 Kb)"],
          ["64K × 16", "65536","16", "1,048,576 b (1 Mb)"],
        ]}
        colColors={[null, "#38bdf8", "#818cf8", "#34d399"]}
      />
    </MemSection>

    <MemSection
      kicker="Classification"
      title="Types of Memory"
      description="Memory is broadly classified based on how it is accessed and whether it retains data without power."
      delay={200}
    >
      <MemStepList
        steps={[
          "RAM (Random Access Memory) — Read and write, volatile, used for temporary storage of running programs.",
          "ROM (Read-Only Memory) — Read only, non-volatile, used to store permanent firmware and bootloaders.",
          "Cache Memory — Very fast, small SRAM between CPU and main RAM, reduces access latency.",
          "Secondary Storage — Non-volatile, large capacity (HDD, SSD, Flash); not directly addressable by CPU.",
        ]}
      />
    </MemSection>

    <MemDivider />

    <MemQuiz questions={QUIZ} />
  </MemoryLayout>
);

export default MemoryBasics;
