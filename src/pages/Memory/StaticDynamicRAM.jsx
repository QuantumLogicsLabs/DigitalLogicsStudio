import React from "react";
import MemoryLayout from "./MemoryLayout";
import {
  MemSection, MemCard, MemCardGroup, MemInfoPanel,
  MemStepList, MemCode, MemDivider, MemQuiz, MemTable,
} from "./components/MemComponents";

const QUIZ = [
  {
    q: "What storage element does SRAM use?",
    opts: ["Capacitor", "Flip-flop", "Resistor", "Inductor"],
    ans: 1,
    explain: "SRAM uses flip-flops (bistable latches) to store each bit, which hold state as long as power is applied.",
  },
  {
    q: "Why does DRAM need periodic refreshing?",
    opts: [
      "To increase speed",
      "Because capacitors leak charge over time",
      "To reduce power",
      "Because flip-flops reset automatically",
    ],
    ans: 1,
    explain: "DRAM stores bits as charge on capacitors. Capacitors leak, so data must be refreshed every few milliseconds.",
  },
  {
    q: "Which is faster — SRAM or DRAM?",
    opts: ["DRAM", "SRAM", "They are the same speed", "Depends on the address"],
    ans: 1,
    explain: "SRAM is faster because flip-flops respond immediately; DRAM requires refresh cycles and has slower access.",
  },
  {
    q: "Which type of RAM is typically used for CPU cache?",
    opts: ["DRAM", "SRAM", "Flash RAM", "Virtual RAM"],
    ans: 1,
    explain: "SRAM is used for CPU cache because of its speed, despite being more expensive and less dense than DRAM.",
  },
];

const StaticDynamicRAM = () => (
  <MemoryLayout
    kicker="Memory Systems"
    title="Static & Dynamic RAM"
    description="RAM comes in two major forms: SRAM uses flip-flops for fast, stable storage while DRAM uses capacitors for dense, low-cost storage that requires periodic refresh cycles."
  >
    <MemSection
      kicker="SRAM"
      title="Static RAM — The Fast One"
      description="SRAM stores each bit using a flip-flop (typically 6 transistors). Data is held as long as power is present — no refresh needed. Faster but less dense."
      delay={0}
    >
      <MemCardGroup>
        <MemInfoPanel icon="🔄" title="Cell"   content="6-transistor cross-coupled inverter pair" color="#38bdf8" />
        <MemInfoPanel icon="⚡" title="Speed"  content="Very fast: 1–10 ns access time"           color="#38bdf8" />
        <MemInfoPanel icon="🧠" title="Use"    content="CPU L1/L2/L3 cache memory"                 color="#38bdf8" />
      </MemCardGroup>

      <div style={{ height: "0.75rem" }} />

      <MemCard title="SRAM 6T Cell Operation">
        <MemCode lines={[
          { text: "Store 1:  Q = HIGH,  Q̄ = LOW   (M1,M2 cross-coupled)", color: "#38bdf8" },
          { text: "Store 0:  Q = LOW,   Q̄ = HIGH  (stable in either state)", color: "#38bdf8" },
          { text: "" },
          { text: "Read:    Assert wordline → bitlines carry Q and Q̄", color: "#34d399" },
          { text: "Write:   Drive bitlines → stronger signal overrides cell", color: "#34d399" },
          { text: "No refresh needed — state held by cross-coupling ✓", color: "var(--mem-muted)" },
        ]} />
      </MemCard>
    </MemSection>

    <MemSection
      kicker="DRAM"
      title="Dynamic RAM — The Dense One"
      description="DRAM stores each bit as charge on a tiny capacitor (1 transistor + 1 capacitor per cell). Charge leaks, so memory must be refreshed periodically. Denser and cheaper."
      delay={100}
    >
      <MemCardGroup>
        <MemInfoPanel icon="⚡" title="Cell"    content="1 transistor + 1 capacitor (1T1C)"           color="#818cf8" />
        <MemInfoPanel icon="🔃" title="Refresh" content="Required every 4–64 ms to prevent data loss"  color="#f87171" />
        <MemInfoPanel icon="💾" title="Use"     content="Main memory (RAM DIMMs in your PC)"           color="#818cf8" />
      </MemCardGroup>
    </MemSection>

    <MemSection
      kicker="Comparison"
      title="SRAM vs DRAM — Side by Side"
      description="Key differences that determine which type of RAM is chosen for a given application."
      delay={150}
    >
      <MemTable
        headers={["Property", "SRAM", "DRAM"]}
        rows={[
          ["Storage element",  "Flip-flop (6T)",          "Capacitor (1T1C)"],
          ["Refresh needed",   "No",                      "Yes (~4–64 ms)"],
          ["Speed",            "Fast (1–10 ns)",          "Slower (50–70 ns)"],
          ["Cell density",     "Lower (large cell)",      "Higher (tiny cell)"],
          ["Power",            "Higher (active static)",  "Lower (standby)"],
          ["Cost per bit",     "Higher",                  "Lower"],
          ["Typical use",      "CPU Cache (L1/L2/L3)",    "Main memory (DIMMs)"],
        ]}
        colColors={[null, "#38bdf8", "#818cf8"]}
      />
    </MemSection>

    <MemSection
      kicker="DRAM Refresh"
      title="How DRAM Refresh Works"
      description="The memory controller must continuously refresh DRAM rows to prevent data loss due to capacitor leakage."
      delay={200}
    >
      <MemStepList
        steps={[
          "Memory controller maintains a refresh counter pointing to the current row to refresh.",
          "Every ~15.6 µs, the controller issues a RAS-only cycle (CAS-before-RAS or auto-refresh command).",
          "The selected row's capacitors are read and rewritten with their full charge level.",
          "After all rows are refreshed, the counter wraps around and the cycle repeats continuously.",
          "During refresh cycles, normal read/write requests are stalled — this is the refresh overhead (~1–5% of bandwidth).",
          "Modern DRAM modules (DDR4/DDR5) use auto-refresh commands managed by the memory controller automatically.",
        ]}
      />
    </MemSection>

    <MemDivider />

    <MemQuiz questions={QUIZ} />
  </MemoryLayout>
);

export default StaticDynamicRAM;
