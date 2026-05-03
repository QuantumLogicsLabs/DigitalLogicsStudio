import React from "react";
import MemoryLayout from "./MemoryLayout";
import {
  MemSection, MemCard, MemCardGroup, MemInfoPanel,
  MemStepList, MemCode, MemDivider, MemQuiz, MemTable, MemChip,
} from "./components/MemComponents";

const QUIZ = [
  {
    q: "To expand word length (bit width), how do you connect RAM chips?",
    opts: [
      "In series (cascade address lines)",
      "In parallel (chips side-by-side sharing address lines)",
      "Use a decoder on data lines",
      "Increase the clock frequency",
    ],
    ans: 1,
    explain: "Word length expansion connects chips in parallel with shared address/control lines, each contributing additional data bits.",
  },
  {
    q: "To expand the number of addressable words (capacity), what is used?",
    opts: [
      "More data lines",
      "A decoder to drive different chip enable signals",
      "Larger capacitors",
      "Fewer address lines",
    ],
    ans: 1,
    explain: "Address capacity expansion uses a decoder to activate different chip select (CS) lines for different address ranges.",
  },
  {
    q: "Four 1K×8 RAM chips combined give a total capacity of:",
    opts: ["1K×8", "4K×8", "1K×32", "4K×32"],
    ans: 1,
    explain: "4 chips of 1K×8 in word-count expansion (using 2 address bits as chip select) gives 4K×8.",
  },
  {
    q: "What signal is typically used to select which chip in an array is active?",
    opts: [
      "WE (Write Enable)",
      "OE (Output Enable)",
      "CS (Chip Select)",
      "VCC (Power)",
    ],
    ans: 2,
    explain: "The Chip Select (CS) signal activates a specific RAM chip in an array, driven by the decoder output.",
  },
];

const ArrayOfRAMICs = () => (
  <MemoryLayout
    kicker="Memory Systems"
    title="Array of RAM ICs"
    description="Large memory systems are built by combining multiple RAM chips in arrays. Two expansion techniques — word length and address capacity — let you build any memory size from standard chips."
  >
    <MemSection
      kicker="Why Combine?"
      title="Building Larger Memories"
      description="Individual RAM ICs have fixed word lengths and capacities. Arrays of chips allow designers to build memory systems of any required size from standard off-the-shelf parts."
      delay={0}
    >
      <MemCardGroup>
        <MemInfoPanel icon="↔️" title="Word Length Expansion"  content="Increase data width (e.g., 4-bit → 8-bit)"        color="#38bdf8" />
        <MemInfoPanel icon="↕️" title="Address Expansion"       content="Increase number of locations (e.g., 1K → 4K)"      color="#818cf8" />
        <MemInfoPanel icon="🔀" title="Combined Expansion"      content="Expand both dimensions simultaneously"              color="#34d399" />
      </MemCardGroup>
    </MemSection>

    <MemSection
      kicker="Technique 1"
      title="Word Length (Bit) Expansion"
      description="To increase word width, place chips in parallel — all chips share the same address and control lines, but each chip contributes a different set of data bits to the output word."
      delay={100}
    >
      <MemCard title="Example: Two 1K×4 chips → 1K×8 memory">
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <MemChip
            label="Chip 1 (1K×4)"
            pins={["A[9:0] shared", "CS shared", "WE shared"]}
            dataPins={["D[3:0] → bits 3:0"]}
          />
          <MemChip
            label="Chip 2 (1K×4)"
            pins={["A[9:0] shared", "CS shared", "WE shared"]}
            dataPins={["D[7:4] → bits 7:4"]}
          />
        </div>

        <MemCode lines={[
          { text: "Shared:  Address A[9:0], CS, WE  → both chips", color: "var(--mem-muted)" },
          { text: "Chip 1 drives → D[3:0]  (lower nibble)", color: "#38bdf8" },
          { text: "Chip 2 drives → D[7:4]  (upper nibble)", color: "#818cf8" },
          { text: "Result:  1K × 8 = 8 Kbits total  ✓", color: "#34d399" },
        ]} />
      </MemCard>
    </MemSection>

    <MemSection
      kicker="Technique 2"
      title="Address (Word Count) Expansion"
      description="To increase the number of addressable locations, use a decoder to select different chips for different address ranges. Only one chip is active at a time."
      delay={150}
    >
      <MemCard title="Example: Four 1K×8 chips + 2-to-4 decoder → 4K×8 memory">
        <MemCode lines={[
          { text: "High bits A[11:10] → 2-to-4 Decoder", color: "var(--mem-muted)" },
          { text: "" },
          { text: "Y0 → CS Chip 0  (addresses 0x000 – 0x3FF)", color: "#38bdf8" },
          { text: "Y1 → CS Chip 1  (addresses 0x400 – 0x7FF)", color: "#38bdf8" },
          { text: "Y2 → CS Chip 2  (addresses 0x800 – 0xBFF)", color: "#38bdf8" },
          { text: "Y3 → CS Chip 3  (addresses 0xC00 – 0xFFF)", color: "#38bdf8" },
          { text: "" },
          { text: "Low bits A[9:0] → all 4 chips (internal row select)", color: "#34d399" },
          { text: "Only the decoded chip is enabled at any time  ✓", color: "#34d399" },
          { text: "Result:  4K × 8 memory  ✓", color: "#fb923c" },
        ]} />
      </MemCard>
    </MemSection>

    <MemSection
      kicker="Quick Reference"
      title="Expansion Summary Table"
      delay={200}
    >
      <MemTable
        headers={["Expansion Type", "How?", "Address Lines?", "Decoder?", "Data Bus?"]}
        rows={[
          ["Word Length (Bit)", "Chips in parallel",           "Shared — same",      "No",  "Wider (more bits)"],
          ["Address (Word Count)", "Decoder selects chip",    "Split — high/low",   "Yes", "Same width"],
          ["Both",              "Combine both techniques",    "Split — high/low",   "Yes", "Wider"],
        ]}
        colColors={[null, "#38bdf8", "#818cf8", "#fb923c", "#34d399"]}
      />
    </MemSection>

    <MemSection
      kicker="Design Steps"
      title="How to Design a RAM Array"
      delay={250}
    >
      <MemStepList
        steps={[
          "Determine required total capacity: total locations × word size (e.g., 8K × 16).",
          "Choose available RAM chip size (e.g., 2K × 8).",
          "Calculate chips needed for word length expansion: required bits ÷ chip data bits (16 ÷ 8 = 2).",
          "Calculate chips needed for address expansion: required locations ÷ chip locations (8K ÷ 2K = 4 banks).",
          "Total chips = word expansion × address expansion (2 × 4 = 8 chips).",
          "Design a decoder with log₂(address expansion banks) inputs to drive the CS lines.",
          "Connect low-order address bits to all chips; feed high-order bits to the decoder.",
        ]}
      />
    </MemSection>

    <MemDivider />

    <MemQuiz questions={QUIZ} />
  </MemoryLayout>
);

export default ArrayOfRAMICs;
