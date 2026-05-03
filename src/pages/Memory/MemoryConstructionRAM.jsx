import React from "react";
import MemoryLayout from "./MemoryLayout";
import {
  MemSection, MemCard, MemCardGroup, MemInfoPanel,
  MemStepList, MemCode, MemDivider, MemQuiz, MemTable,
} from "./components/MemComponents";

const QUIZ = [
  {
    q: "A system needs 8K×16 memory. You have 2K×8 chips. How many chips are needed?",
    opts: ["4", "8", "16", "2"],
    ans: 2,
    explain: "Word expansion: 16÷8 = 2 chips per bank. Address expansion: 8K÷2K = 4 banks. Total = 2×4 = 16 chips.",
  },
  {
    q: "In memory system design, what does 'bank' refer to?",
    opts: [
      "A financial institution storing memory",
      "A group of chips sharing the same address range (same CS)",
      "A single memory chip",
      "The address decoder",
    ],
    ans: 1,
    explain: "A memory bank is a group of chips that are accessed simultaneously, all selected by the same chip select signal.",
  },
  {
    q: "What is the role of the address decoder in a memory system?",
    opts: [
      "To decode binary data into decimal",
      "To select which bank is active based on high-order address bits",
      "To convert addresses to ASCII",
      "To increase the clock speed",
    ],
    ans: 1,
    explain: "The address decoder takes high-order address bits and asserts the CS signal for the appropriate memory bank.",
  },
  {
    q: "Bus contention occurs when:",
    opts: [
      "Too many address lines are used",
      "Two chips drive the data bus simultaneously",
      "The clock is too fast",
      "The decoder has too many outputs",
    ],
    ans: 1,
    explain: "Bus contention happens when two chips try to drive the shared data bus simultaneously. Only one CS should be active at a time, keeping other chips in tri-state (high-Z).",
  },
];

const MemoryConstructionRAM = () => (
  <MemoryLayout
    kicker="Memory Systems"
    title="Memory Construction using RAM ICs"
    description="Real memory systems are designed by systematically arranging RAM ICs to meet a required capacity and word width. This brings together chip arrays, decoders, and shared buses."
  >
    <MemSection
      kicker="Overview"
      title="System Memory Design Process"
      description="Constructing a memory system from RAM ICs requires deciding on the number of chips, their arrangement into banks, and how addressing and control signals are distributed."
      delay={0}
    >
      <MemCardGroup>
        <MemInfoPanel icon="📐" title="Step 1" content="Determine total capacity (words × bits)"           color="#38bdf8" />
        <MemInfoPanel icon="🔢" title="Step 2" content="Choose chip size, calculate chips per bank"         color="#818cf8" />
        <MemInfoPanel icon="🎛️" title="Step 3" content="Design address decoder for bank selection"          color="#34d399" />
        <MemInfoPanel icon="🔌" title="Step 4" content="Wire address, data, and control buses"              color="#fb923c" />
      </MemCardGroup>
    </MemSection>

    <MemSection
      kicker="Worked Example"
      title="Design a 16K×8 Memory from 4K×4 Chips"
      description="Step-by-step construction of a complete 16K×8 memory system."
      delay={100}
    >
      <MemCard title="Step 1 — Chip Count Calculation">
        <MemCode lines={[
          { text: "Required capacity:  16K × 8", color: "#38bdf8" },
          { text: "Chip size:          4K  × 4", color: "#818cf8" },
          { text: "" },
          { text: "Word (bit) expansion:   8 ÷ 4   =  2 chips per bank", color: "#34d399" },
          { text: "Address expansion:   16K ÷ 4K  =  4 banks", color: "#34d399" },
          { text: "Total chips:           2 × 4   =  8 chips  ✓", color: "#fb923c" },
          { text: "" },
          { text: "Decoder:  2-to-4  (inputs: A[13:12])", color: "var(--mem-muted)" },
          { text: "Row addr: A[11:0] → all chips in active bank", color: "var(--mem-muted)" },
        ]} />
      </MemCard>

      <div style={{ height: "0.75rem" }} />

      <MemCard title="Step 2 — Bank Layout">
        <MemTable
          headers={["Bank", "Address Range", "CS Signal", "Chips"]}
          rows={[
            ["Bank 0","0x0000 – 0x0FFF","Y0","Chip0A (D[3:0]) + Chip0B (D[7:4])"],
            ["Bank 1","0x1000 – 0x1FFF","Y1","Chip1A (D[3:0]) + Chip1B (D[7:4])"],
            ["Bank 2","0x2000 – 0x2FFF","Y2","Chip2A (D[3:0]) + Chip2B (D[7:4])"],
            ["Bank 3","0x3000 – 0x3FFF","Y3","Chip3A (D[3:0]) + Chip3B (D[7:4])"],
          ]}
          colColors={["#38bdf8", null, "#818cf8", "#34d399"]}
        />
      </MemCard>
    </MemSection>

    <MemSection
      kicker="Bus Architecture"
      title="Shared Bus Connections"
      description="All chips in a memory system share common buses for address, data, and control signals. Careful bus design prevents contention."
      delay={150}
    >
      <MemCard title="Bus Wiring Rules">
        <MemCode lines={[
          { text: "ADDRESS BUS ─────────────────────────────", color: "#38bdf8" },
          { text: "  Low bits  A[11:0]  → all chips (row/col select)", color: "#38bdf8" },
          { text: "  High bits A[13:12] → decoder input", color: "#38bdf8" },
          { text: "" },
          { text: "DATA BUS ────────────────────────────────", color: "#818cf8" },
          { text: "  Chip A (D[3:0]) → data bus bits 3:0", color: "#818cf8" },
          { text: "  Chip B (D[7:4]) → data bus bits 7:4", color: "#818cf8" },
          { text: "  Inactive chips: high-Z (tri-stated by CS̄ inactive)", color: "#818cf8" },
          { text: "" },
          { text: "CONTROL BUS ─────────────────────────────", color: "#34d399" },
          { text: "  WE̅, OE̅ → all chips (broadcast)", color: "#34d399" },
          { text: "  CS̄ bank → from decoder Yi (one active at a time)", color: "#34d399" },
        ]} />
      </MemCard>
    </MemSection>

    <MemSection
      kicker="Safety"
      title="Preventing Bus Contention"
      description="Bus contention occurs when two chips simultaneously try to drive the data bus. It can damage chips and corrupt data."
      delay={200}
    >
      <MemStepList
        steps={[
          "Only one CS̄ output from the decoder can be active at any given time — guaranteed by decoder design.",
          "Inactive chips' data outputs float to high-impedance (tri-state) when CS̄ is deasserted.",
          "Tri-state buffers on each chip's data output allow safe sharing of the common data bus.",
          "The decoder must assert new CS̄ only after previous CS̄ is deasserted (no overlapping enables).",
          "Bus contention prevention: use open-collector or tri-state drivers, never totem-pole on shared lines.",
        ]}
      />
    </MemSection>

    <MemSection
      kicker="Practice"
      title="General Design Formula"
      delay={250}
    >
      <MemCard title="Chip Count Formula">
        <MemCode lines={[
          { text: "Given:  Required = W_total × B_total", color: "var(--mem-muted)" },
          { text: "        Chip     = W_chip   × B_chip", color: "var(--mem-muted)" },
          { text: "" },
          { text: "Chips per bank  = B_total / B_chip   (bit expansion)", color: "#38bdf8" },
          { text: "Banks needed    = W_total / W_chip   (address expansion)", color: "#818cf8" },
          { text: "Total chips     = (B_total/B_chip) × (W_total/W_chip)", color: "#34d399" },
          { text: "Decoder size    = log₂(Banks needed)-to-Banks needed", color: "#fb923c" },
        ]} />
      </MemCard>
    </MemSection>

    <MemDivider />

    <MemQuiz questions={QUIZ} />
  </MemoryLayout>
);

export default MemoryConstructionRAM;
