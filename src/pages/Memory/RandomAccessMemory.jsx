import React from "react";
import MemoryLayout from "./MemoryLayout";
import {
  MemSection, MemCard, MemCardGroup, MemInfoPanel,
  MemStepList, MemCode, MemDivider, MemQuiz, MemTable, MemChip,
} from "./components/MemComponents";

const QUIZ = [
  {
    q: "What makes RAM 'random access'?",
    opts: [
      "It stores random data",
      "Any location can be accessed in the same time regardless of address",
      "It randomly selects memory locations",
      "It can only be read randomly",
    ],
    ans: 1,
    explain: "Random access means any memory location can be accessed in equal time, unlike sequential access (e.g., tape).",
  },
  {
    q: "Which signal controls whether RAM performs a read or write?",
    opts: ["Address line", "Data line", "Read/Write (R/W) line", "Chip Select line"],
    ans: 2,
    explain: "The Read/Write (R/W) control line determines the operation: R/W=1 for read, R/W=0 for write (typically).",
  },
  {
    q: "What is the purpose of the Chip Select (CS) signal?",
    opts: [
      "To select which data bit to read",
      "To enable or disable the RAM chip",
      "To set the clock speed",
      "To reset the memory",
    ],
    ans: 1,
    explain: "Chip Select enables the RAM chip. When CS is inactive, the chip ignores all inputs and outputs are tri-stated.",
  },
  {
    q: "A RAM chip has 10 address lines and 8 data lines. What is its capacity?",
    opts: ["10 bytes", "1024 bits", "8192 bits (1K × 8 = 8 Kbits)", "80 bits"],
    ans: 2,
    explain: "10 address lines → 2¹⁰ = 1024 locations. 8 data lines → 8 bits each. Total = 1024 × 8 = 8192 bits = 8 Kbits.",
  },
];

const RandomAccessMemory = () => (
  <MemoryLayout
    kicker="Memory Systems"
    title="Random Access Memory (RAM)"
    description="RAM is volatile read-write memory used for temporary storage of data and programs currently in use. Any memory location can be accessed in equal time — that's the 'random' in RAM."
  >
    <MemSection
      kicker="Concept"
      title="RAM Characteristics"
      description="RAM allows both read and write operations. It is volatile, meaning data is lost when power is removed. The 'random access' property means access time is independent of address."
      delay={0}
    >
      <MemCardGroup>
        <MemInfoPanel icon="⚡" title="Volatile"         content="Data is lost when power is removed"               color="#f87171" />
        <MemInfoPanel icon="✏️" title="Read/Write"       content="Supports both read and write operations"           color="#34d399" />
        <MemInfoPanel icon="⏱️" title="Equal Access Time" content="Any address accessed in the same amount of time"  color="#38bdf8" />
      </MemCardGroup>
    </MemSection>

    <MemSection
      kicker="Interface"
      title="RAM Pin Signals"
      description="A typical RAM chip has address lines, bidirectional data lines, and control signals for chip selection and operation direction."
      delay={100}
    >
      <MemCard title="RAM Chip Pinout">
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start", marginBottom: "1rem" }}>
          <MemChip
            label="RAM IC"
            pins={["A[n-1:0]  Address", "CS         Chip Sel", "WE         Write En", "OE         Output En"]}
            dataPins={["D[m-1:0]  Data I/O"]}
          />
        </div>

        <MemTable
          headers={["Signal", "Direction", "Description"]}
          rows={[
            ["A[n-1:0]",        "→ Input",      "Address lines — select memory location"],
            ["D[m-1:0]",        "↔ Bidir",      "Data lines — input (write) or output (read)"],
            ["CS̄ (Chip Select)", "→ Input",      "Active-low: enables the chip when asserted"],
            ["WE̅ (Write Enable)","→ Input",      "High = Read mode, Low = Write mode"],
            ["OE̅ (Output Enable)","→ Input",     "Enables data output buffer during read"],
          ]}
          colColors={["#34d399", "#38bdf8", null]}
        />
      </MemCard>
    </MemSection>

    <MemSection
      kicker="Operations"
      title="Read and Write Cycles"
      description="RAM performs two fundamental operations. Timing is critical — signals must be stable for the required access and cycle times."
      delay={150}
    >
      <MemCard title="Read Cycle Sequence">
        <MemCode lines={[
          { text: "1.  Assert CS̄  (enable chip)", color: "#38bdf8" },
          { text: "2.  Set address lines A[n-1:0]", color: "#38bdf8" },
          { text: "3.  Set WE̅ = HIGH  (read mode)", color: "#34d399" },
          { text: "4.  Assert OE̅  (enable output driver)", color: "#34d399" },
          { text: "5.  Wait for access time (tACC)", color: "var(--mem-muted)" },
          { text: "6.  Valid data appears on D[m-1:0]  ✓", color: "#fb923c" },
        ]} />
      </MemCard>

      <div style={{ height: "0.75rem" }} />

      <MemCard title="Write Cycle Sequence">
        <MemCode lines={[
          { text: "1.  Assert CS̄  (enable chip)", color: "#38bdf8" },
          { text: "2.  Set address lines A[n-1:0]", color: "#38bdf8" },
          { text: "3.  Place data on D[m-1:0]", color: "#818cf8" },
          { text: "4.  Assert WE̅ = LOW  (write mode)", color: "#818cf8" },
          { text: "5.  Hold signals stable for tWP (write pulse width)", color: "var(--mem-muted)" },
          { text: "6.  Deassert WE̅  →  data latched  ✓", color: "#fb923c" },
        ]} />
      </MemCard>
    </MemSection>

    <MemSection
      kicker="Timing"
      title="Key Timing Parameters"
      delay={200}
    >
      <MemStepList
        steps={[
          "Access Time (tACC) — Delay from address presented to valid data output. A key RAM performance metric (e.g., 10 ns for SRAM).",
          "Cycle Time (tRC/tWC) — Minimum time between two consecutive read or write operations. Always ≥ access time.",
          "Setup Time — How long data/address must be stable before the write strobe edge.",
          "Hold Time — How long data/address must remain stable after the write strobe edge.",
          "Output Enable Time (tOE) — Delay from OE̅ assertion to valid data appearing on the data bus.",
        ]}
      />
    </MemSection>

    <MemDivider />

    <MemQuiz questions={QUIZ} />
  </MemoryLayout>
);

export default RandomAccessMemory;
