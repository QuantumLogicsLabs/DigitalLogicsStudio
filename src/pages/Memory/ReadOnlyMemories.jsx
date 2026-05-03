import React from "react";
import MemoryLayout from "./MemoryLayout";
import {
  MemSection, MemCard, MemCardGroup, MemInfoPanel,
  MemStepList, MemCode, MemDivider, MemQuiz, MemTable,
} from "./components/MemComponents";

const QUIZ = [
  {
    q: "What does ROM stand for?",
    opts: ["Random Output Memory", "Read-Only Memory", "Read-Once Memory", "Removable Output Module"],
    ans: 1,
    explain: "ROM stands for Read-Only Memory — it can be read but not easily written.",
  },
  {
    q: "Which ROM type can be erased with ultraviolet light?",
    opts: ["PROM", "EPROM", "EEPROM", "Mask ROM"],
    ans: 1,
    explain: "EPROM (Erasable Programmable ROM) is erased by exposing it to UV light through a quartz window.",
  },
  {
    q: "What is a Mask ROM?",
    opts: [
      "Programmed by the user",
      "Programmed during manufacturing",
      "Erased with electricity",
      "Erased with UV light",
    ],
    ans: 1,
    explain: "Mask ROM is programmed during the chip manufacturing process using a photomask.",
  },
  {
    q: "Which ROM type can be electrically erased byte-by-byte?",
    opts: ["PROM", "EPROM", "Mask ROM", "EEPROM"],
    ans: 3,
    explain: "EEPROM (Electrically Erasable PROM) can be erased and rewritten electrically, byte by byte.",
  },
];

const ReadOnlyMemories = () => (
  <MemoryLayout
    kicker="Memory Systems"
    title="Read-Only Memories (ROM)"
    description="ROM is non-volatile memory that permanently stores data or programs. Content is fixed at manufacturing time or programmed once, retained without power indefinitely."
  >
    <MemSection
      kicker="Concept"
      title="What is ROM?"
      description="ROM stores binary information permanently. It is used for firmware, boot programs, and lookup tables that must survive power loss."
      delay={0}
    >
      <MemCardGroup>
        <MemInfoPanel icon="🔋" title="Non-Volatile"  content="Data retained even when power is off" color="#34d399" />
        <MemInfoPanel icon="📖" title="Read Access"   content="CPU reads ROM, cannot write normally"  color="#38bdf8" />
        <MemInfoPanel icon="💿" title="Common Use"    content="BIOS, firmware, character generators"   color="#818cf8" />
      </MemCardGroup>
    </MemSection>

    <MemSection
      kicker="Structure"
      title="ROM as a Combinational Circuit"
      description="A ROM with n address inputs and m data outputs implements m Boolean functions of n variables. The address is the input; the stored word is the output."
      delay={100}
    >
      <MemCard title="ROM Truth Table (2-input, 4-output example)">
        <MemTable
          headers={["A1", "A0", "D3", "D2", "D1", "D0"]}
          rows={[
            ["0","0","0","0","1","1"],
            ["0","1","0","1","0","1"],
            ["1","0","1","0","1","0"],
            ["1","1","1","1","0","0"],
          ]}
          colColors={["#38bdf8","#38bdf8","#34d399","#34d399","#34d399","#34d399"]}
        />
      </MemCard>

      <div style={{ height: "0.75rem" }} />

      <MemCard title="ROM Capacity Formula">
        <MemCode lines={[
          { text: "ROM capacity = 2ⁿ words × m bits", color: "var(--mem-muted)" },
          { text: "" },
          { text: "Example: 2-input, 4-output ROM", color: "#818cf8" },
          { text: "  → 2² = 4 words, 4 bits each", color: "#38bdf8" },
          { text: "  → 4 × 4 = 16 bits total", color: "#34d399" },
        ]} />
      </MemCard>
    </MemSection>

    <MemSection
      kicker="Types"
      title="ROM Varieties"
      description="Different ROM types offer different trade-offs between cost, flexibility, and reprogrammability."
      delay={150}
    >
      <MemTable
        headers={["Type", "Programmed By", "Erasable?", "Use Case"]}
        rows={[
          ["Mask ROM",  "Manufacturer",   "No",               "Mass-produced firmware"],
          ["PROM",      "User (once)",     "No (fuses blown)", "One-time field programming"],
          ["EPROM",     "User",            "UV light",         "Development, prototyping"],
          ["EEPROM",    "User (in-circuit)","Electrically",    "Microcontroller config"],
          ["Flash",     "User (in-circuit)","Electrically (block)","USB drives, SSDs, embedded"],
        ]}
        colColors={[null, "#38bdf8", "#fb923c", "#818cf8"]}
      />
    </MemSection>

    <MemSection
      kicker="Details"
      title="ROM Type Breakdown"
      delay={200}
    >
      <MemStepList
        steps={[
          "Mask ROM — Programmed at manufacturing. Lowest cost in large quantities. Cannot be changed after fabrication.",
          "PROM (Programmable ROM) — One-time user programmable via a special PROM programmer tool. Fuses blown permanently.",
          "EPROM (Erasable PROM) — Erased with UV light through a quartz window. Can be reprogrammed multiple times.",
          "EEPROM (Electrically Erasable PROM) — Erased electrically, byte by byte. In-circuit programmable. Used in microcontrollers.",
          "Flash Memory — Block-level erasure, high density, fast. Used in USB drives, SSDs, smartphones, and embedded systems.",
        ]}
      />
    </MemSection>

    <MemDivider />

    <MemQuiz questions={QUIZ} />
  </MemoryLayout>
);

export default ReadOnlyMemories;
