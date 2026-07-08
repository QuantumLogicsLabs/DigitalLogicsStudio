import React from "react";

export function VonNeumannDiagram() {
  return (
    <figure className="coal-diagram" aria-label="Von Neumann architecture diagram">
      <svg viewBox="0 0 520 220" role="img" className="coal-diagram__svg">
        <rect x="200" y="20" width="120" height="56" rx="8" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="260" y="52" textAnchor="middle" className="coal-diagram__label">CPU</text>
        <text x="260" y="68" textAnchor="middle" className="coal-diagram__sublabel">Control + ALU</text>

        <rect x="200" y="140" width="120" height="56" rx="8" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="260" y="172" textAnchor="middle" className="coal-diagram__label">Memory</text>
        <text x="260" y="188" textAnchor="middle" className="coal-diagram__sublabel">Program + Data</text>

        <rect x="20" y="80" width="100" height="48" rx="8" className="coal-diagram__box coal-diagram__box--io" />
        <text x="70" y="110" textAnchor="middle" className="coal-diagram__label">Input</text>

        <rect x="400" y="80" width="100" height="48" rx="8" className="coal-diagram__box coal-diagram__box--io" />
        <text x="450" y="110" textAnchor="middle" className="coal-diagram__label">Output</text>

        <line x1="260" y1="76" x2="260" y2="140" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <line x1="200" y1="48" x2="120" y2="104" className="coal-diagram__line" />
        <line x1="320" y1="48" x2="400" y2="104" className="coal-diagram__line" />
        <line x1="120" y1="104" x2="200" y2="168" className="coal-diagram__line" />
        <line x1="400" y1="104" x2="320" y2="168" className="coal-diagram__line" />

        <text x="260" y="128" textAnchor="middle" className="coal-diagram__bus-label">Address / Data / Control Bus</text>

        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="coal-diagram__arrowhead" />
          </marker>
        </defs>
      </svg>
      <figcaption>Stored-program model: CPU and memory exchange instructions and data over a shared bus.</figcaption>
    </figure>
  );
}

export function SystemBusDiagram() {
  return (
    <figure className="coal-diagram" aria-label="System bus diagram">
      <svg viewBox="0 0 480 160" role="img" className="coal-diagram__svg">
        <rect x="180" y="56" width="120" height="48" rx="8" className="coal-diagram__box coal-diagram__box--bus" />
        <text x="240" y="86" textAnchor="middle" className="coal-diagram__label">System Bus</text>

        <rect x="20" y="20" width="90" height="40" rx="6" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="65" y="46" textAnchor="middle" className="coal-diagram__label">CPU</text>

        <rect x="20" y="100" width="90" height="40" rx="6" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="65" y="126" textAnchor="middle" className="coal-diagram__label">RAM</text>

        <rect x="370" y="20" width="90" height="40" rx="6" className="coal-diagram__box coal-diagram__box--io" />
        <text x="415" y="46" textAnchor="middle" className="coal-diagram__label">Disk</text>

        <rect x="370" y="100" width="90" height="40" rx="6" className="coal-diagram__box coal-diagram__box--io" />
        <text x="415" y="126" textAnchor="middle" className="coal-diagram__label">I/O</text>

        <line x1="110" y1="40" x2="180" y2="72" className="coal-diagram__line" />
        <line x1="110" y1="120" x2="180" y2="88" className="coal-diagram__line" />
        <line x1="300" y1="72" x2="370" y2="40" className="coal-diagram__line" />
        <line x1="300" y1="88" x2="370" y2="120" className="coal-diagram__line" />
      </svg>
      <figcaption>One bus connects all major components — like a shared highway for bits.</figcaption>
    </figure>
  );
}

export function BinaryByteDiagram() {
  return (
    <figure className="coal-diagram" aria-label="Byte as 8 bits">
      <div className="coal-bit-row">
        {["1", "0", "1", "0", "1", "1", "0", "1"].map((bit, i) => (
          <div key={i} className={`coal-bit ${bit === "1" ? "coal-bit--on" : "coal-bit--off"}`}>
            <span className="coal-bit__value">{bit}</span>
            <span className="coal-bit__weight">{`2^${7 - i}`}</span>
          </div>
        ))}
      </div>
      <figcaption>One byte = 8 bits. Value shown: 10101101₂ = 173₁₀ = AD₁₆</figcaption>
    </figure>
  );
}

export function DecToBinDiagram() {
  return (
    <figure className="coal-diagram coal-diagram--steps" aria-label="Decimal to binary conversion">
      <ol className="coal-steps">
        <li>Start with decimal <strong>13</strong></li>
        <li>13 ÷ 2 = 6 remainder <strong>1</strong></li>
        <li>6 ÷ 2 = 3 remainder <strong>0</strong></li>
        <li>3 ÷ 2 = 1 remainder <strong>1</strong></li>
        <li>1 ÷ 2 = 0 remainder <strong>1</strong></li>
        <li>Read remainders upward → <strong>1101</strong>₂</li>
      </ol>
    </figure>
  );
}

export function IsaOverviewDiagram() {
  return (
    <figure className="coal-diagram coal-diagram--cards" aria-label="Instruction set categories">
      <div className="coal-isa-grid">
        {[
          { title: "Data Transfer", text: "Moves values between registers, memory, and I/O", accent: "transfer" },
          { title: "Arithmetic", text: "Adds, subtracts, multiplies, and divides operands", accent: "arithmetic" },
          { title: "Logic", text: "Applies bitwise operations such as AND and OR", accent: "logic" },
          { title: "Control", text: "Changes program flow with jumps and branches", accent: "control" },
        ].map((card) => (
          <div key={card.title} className={`coal-isa-card coal-isa-card--${card.accent}`}>
            <strong>{card.title}</strong>
            <span>{card.text}</span>
          </div>
        ))}
      </div>
      <figcaption>ISA instructions are grouped by purpose so the CPU has a clear vocabulary for each job.</figcaption>
    </figure>
  );
}

export function AddressingModesDiagram() {
  return (
    <figure className="coal-diagram coal-diagram--cards" aria-label="Addressing modes overview">
      <div className="coal-address-grid">
        {[
          { title: "Immediate", text: "Uses the literal value inside the instruction", code: "MOV AX, 5" },
          { title: "Register", text: "Uses an internal register as the source or target", code: "MOV AX, BX" },
          { title: "Direct", text: "Uses the exact memory address written in the instruction", code: "MOV AX, [1000]" },
          { title: "Indirect", text: "Uses a register that holds the memory address", code: "MOV AX, [BX]" },
        ].map((card) => (
          <div key={card.title} className="coal-address-card">
            <strong>{card.title}</strong>
            <span>{card.text}</span>
            <code className="coal-address-card__code">{card.code}</code>
          </div>
        ))}
      </div>
      <figcaption>Each mode answers a different question: where is the operand, and how does the CPU find it?</figcaption>
    </figure>
  );
}

export function FlagsRegisterDiagram() {
  return (
    <figure className="coal-diagram coal-diagram--cards" aria-label="Flags register diagram">
      <div className="coal-flag-grid">
        {[
          { label: "ZF", text: "Zero Flag" },
          { label: "CF", text: "Carry Flag" },
          { label: "SF", text: "Sign Flag" },
          { label: "OF", text: "Overflow Flag" },
        ].map((flag, index) => (
          <div key={flag.label} className={`coal-flag-card ${index === 0 ? "coal-flag-card--active" : ""}`}>
            <strong>{flag.label}</strong>
            <span>{flag.text}</span>
          </div>
        ))}
      </div>
      <figcaption>Flags are status bits that report what happened after arithmetic or logic instructions run.</figcaption>
    </figure>
  );
}

export function TranslationPipelineDiagram() {
  return (
    <figure className="coal-diagram" aria-label="Translation pipeline">
      <svg viewBox="0 0 600 200" role="img" className="coal-diagram__svg">
        <rect x="20" y="40" width="100" height="40" rx="6" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="70" y="65" textAnchor="middle" className="coal-diagram__label">C Source</text>

        <rect x="160" y="40" width="100" height="40" rx="6" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="210" y="65" textAnchor="middle" className="coal-diagram__label">Compiler</text>

        <rect x="300" y="40" width="100" height="40" rx="6" className="coal-diagram__box coal-diagram__box--bus" />
        <text x="350" y="65" textAnchor="middle" className="coal-diagram__label">Assembler</text>

        <rect x="440" y="40" width="100" height="40" rx="6" className="coal-diagram__box coal-diagram__box--io" />
        <text x="490" y="65" textAnchor="middle" className="coal-diagram__label">Linker/Loader</text>

        {/* Arrows connecting them */}
        <line x1="120" y1="60" x2="155" y2="60" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <line x1="260" y1="60" x2="295" y2="60" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <line x1="400" y1="60" x2="435" y2="60" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
      </svg>
      <figcaption>C → Compiler → Assembler → Linker → Loader: the full translation chain.</figcaption>
    </figure>
  );
}

export function IA32GPRLayoutDiagram() {
  return (
    <figure className="coal-diagram" aria-label="EAX register split into AX, AH, AL">
      <svg viewBox="0 0 360 200" role="img" className="coal-diagram__svg">
        {/* EAX (32‑bit) */}
        <rect x="60" y="10" width="240" height="36" rx="6" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="180" y="32" textAnchor="middle" className="coal-diagram__label">EAX (32‑bit)</text>

        {/* AX (16‑bit) */}
        <rect x="100" y="70" width="160" height="36" rx="6" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="180" y="92" textAnchor="middle" className="coal-diagram__label">AX (16‑bit)</text>

        {/* AH / AL */}
        <rect x="100" y="130" width="76" height="36" rx="6" className="coal-diagram__box coal-diagram__box--io" />
        <text x="138" y="152" textAnchor="middle" className="coal-diagram__label">AH</text>

        <rect x="184" y="130" width="76" height="36" rx="6" className="coal-diagram__box coal-diagram__box--io" />
        <text x="222" y="152" textAnchor="middle" className="coal-diagram__label">AL</text>

        {/* Connecting lines */}
        <line x1="180" y1="46" x2="180" y2="68" className="coal-diagram__line" />
        <line x1="138" y1="106" x2="138" y2="128" className="coal-diagram__line" />
        <line x1="222" y1="106" x2="222" y2="128" className="coal-diagram__line" />
      </svg>
      <figcaption>General‑Purpose Register EAX can be accessed as AX, AH, or AL.</figcaption>
    </figure>
  );
}

export function IA32StackFrameDiagram() {
  return (
    <figure className="coal-diagram" aria-label="Stack frame layout">
      <svg viewBox="0 0 400 300" role="img" className="coal-diagram__svg">
        {/* High memory label */}
        <text x="200" y="20" textAnchor="middle" className="coal-diagram__sublabel">High Memory</text>

        {/* Parameter 2 */}
        <rect x="120" y="30" width="160" height="28" rx="4" className="coal-diagram__box coal-diagram__box--io" />
        <text x="200" y="49" textAnchor="middle" className="coal-diagram__label">Parameter 2 [EBP+12]</text>

        {/* Parameter 1 */}
        <rect x="120" y="64" width="160" height="28" rx="4" className="coal-diagram__box coal-diagram__box--io" />
        <text x="200" y="83" textAnchor="middle" className="coal-diagram__label">Parameter 1 [EBP+8]</text>

        {/* Return address */}
        <rect x="120" y="98" width="160" height="28" rx="4" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="200" y="117" textAnchor="middle" className="coal-diagram__label">Return Address [EBP+4]</text>

        {/* Saved EBP */}
        <rect x="120" y="132" width="160" height="28" rx="4" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="200" y="151" textAnchor="middle" className="coal-diagram__label">Saved EBP [EBP]</text>

        {/* EBP label */}
        <line x1="280" y1="146" x2="320" y2="146" className="coal-diagram__line" />
        <text x="330" y="152" className="coal-diagram__sublabel">← EBP</text>

        {/* Local variable 1 */}
        <rect x="120" y="186" width="160" height="28" rx="4" className="coal-diagram__box coal-diagram__box--bus" />
        <text x="200" y="205" textAnchor="middle" className="coal-diagram__label">Local Var 1 [EBP-4]</text>

        {/* Local variable 2 */}
        <rect x="120" y="220" width="160" height="28" rx="4" className="coal-diagram__box coal-diagram__box--bus" />
        <text x="200" y="239" textAnchor="middle" className="coal-diagram__label">Local Var 2 [EBP-8]</text>

        {/* ESP label */}
        <line x1="280" y1="234" x2="320" y2="234" className="coal-diagram__line" />
        <text x="330" y="240" className="coal-diagram__sublabel">← ESP</text>

        {/* Low memory label */}
        <text x="200" y="280" textAnchor="middle" className="coal-diagram__sublabel">Low Memory</text>
      </svg>
      <figcaption>Stack frame: parameters at positive offsets, locals at negative offsets from EBP.</figcaption>
    </figure>
  );
}

export function IA32ModeTransitionsDiagram() {
  return (
    <figure className="coal-diagram" aria-label="IA-32 operating modes">
      <svg viewBox="0 0 480 280" role="img" className="coal-diagram__svg">
        {/* Power‑On */}
        <rect x="180" y="20" width="120" height="36" rx="6" className="coal-diagram__box coal-diagram__box--io" />
        <text x="240" y="43" textAnchor="middle" className="coal-diagram__label">Power‑On / Reset</text>

        {/* Arrow down to Real Mode */}
        <line x1="240" y1="56" x2="240" y2="80" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />

        {/* Real Mode */}
        <rect x="30" y="100" width="120" height="36" rx="6" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="90" y="123" textAnchor="middle" className="coal-diagram__label">Real Mode</text>

        {/* Arrow from Real to Protected (Set CR0.PE) */}
        <line x1="150" y1="118" x2="240" y2="118" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <text x="195" y="112" textAnchor="middle" className="coal-diagram__sublabel">Set CR0.PE</text>

        {/* Protected Mode */}
        <rect x="240" y="100" width="120" height="36" rx="6" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="300" y="123" textAnchor="middle" className="coal-diagram__label">Protected Mode</text>

        {/* Arrow back from Protected to Real (Clear CR0.PE) */}
        <line x1="240" y1="136" x2="150" y2="136" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <text x="195" y="152" textAnchor="middle" className="coal-diagram__sublabel">Clear CR0.PE</text>

        {/* Arrow down from Protected to Virtual‑8086 (Set EFLAGS.VM) */}
        <line x1="300" y1="136" x2="300" y2="170" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <text x="320" y="156" className="coal-diagram__sublabel">Set EFLAGS.VM</text>

        {/* Virtual‑8086 */}
        <rect x="330" y="195" width="120" height="36" rx="6" className="coal-diagram__box coal-diagram__box--bus" />
        <text x="390" y="218" textAnchor="middle" className="coal-diagram__label">Virtual‑8086</text>

        {/* Arrow back from Virtual‑8086 to Protected (Clear EFLAGS.VM) */}
        <line x1="390" y1="195" x2="390" y2="140" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <text x="410" y="170" className="coal-diagram__sublabel">Clear EFLAGS.VM</text>

        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="coal-diagram__arrowhead" />
          </marker>
        </defs>
      </svg>
      <figcaption>IA‑32 modes: Real → Protected, and Virtual‑8086 as a submode of Protected Mode.</figcaption>
    </figure>
  );
}
export function IA32SegmentSelectorDiagram() {
  return (
    <figure className="coal-diagram" aria-label="Segment selector layout">
      <svg viewBox="0 0 480 120" role="img" className="coal-diagram__svg">
        {/* Selector bar */}
        <rect x="20" y="40" width="440" height="36" rx="4" fill="#e0e0e0" stroke="#333" strokeWidth="1.5" />

        {/* Index (13 bits) */}
        <rect x="20" y="40" width="340" height="36" fill="#90caf9" />
        <text x="190" y="63" textAnchor="middle" className="coal-diagram__label">Index (13 bits)</text>

        {/* TI (1 bit) */}
        <rect x="360" y="40" width="40" height="36" fill="#ffcc80" />
        <text x="380" y="63" textAnchor="middle" className="coal-diagram__sublabel">TI</text>

        {/* RPL (2 bits) */}
        <rect x="400" y="40" width="60" height="36" fill="#a5d6a7" />
        <text x="430" y="63" textAnchor="middle" className="coal-diagram__sublabel">RPL</text>

        {/* Bit numbers */}
        <text x="360" y="30" textAnchor="middle" className="coal-diagram__sublabel">Bit 2</text>
        <text x="430" y="30" textAnchor="middle" className="coal-diagram__sublabel">Bits 1‑0</text>
        <text x="190" y="30" textAnchor="middle" className="coal-diagram__sublabel">Bits 15‑3</text>
      </svg>
      <figcaption>A segment selector is 16 bits: Index (13), TI (1), RPL (2).</figcaption>
    </figure>
  );
}

export function IA32LinearAddressBreakdownDiagram() {
  return (
    <figure className="coal-diagram" aria-label="Linear address breakdown">
      <svg viewBox="0 0 500 120" role="img" className="coal-diagram__svg">
        {/* Address bar */}
        <rect x="20" y="40" width="460" height="36" rx="4" fill="#e0e0e0" stroke="#333" strokeWidth="1.5" />

        {/* Directory (10 bits) */}
        <rect x="20" y="40" width="150" height="36" fill="#90caf9" />
        <text x="95" y="63" textAnchor="middle" className="coal-diagram__label">Directory (10b)</text>

        {/* Table (10 bits) */}
        <rect x="170" y="40" width="150" height="36" fill="#ffcc80" />
        <text x="245" y="63" textAnchor="middle" className="coal-diagram__label">Table (10b)</text>

        {/* Offset (12 bits) */}
        <rect x="320" y="40" width="160" height="36" fill="#a5d6a7" />
        <text x="400" y="63" textAnchor="middle" className="coal-diagram__label">Offset (12b)</text>

        {/* Bit range labels */}
        <text x="95" y="30" textAnchor="middle" className="coal-diagram__sublabel">31‑22</text>
        <text x="245" y="30" textAnchor="middle" className="coal-diagram__sublabel">21‑12</text>
        <text x="400" y="30" textAnchor="middle" className="coal-diagram__sublabel">11‑0</text>
      </svg>
      <figcaption>A 32‑bit linear address split for two‑level paging.</figcaption>
    </figure>
  );
}

export function IA32AddressLifecycleDiagram() {
  return (
    <figure className="coal-diagram" aria-label="Address lifecycle">
      <svg viewBox="0 0 600 250" role="img" className="coal-diagram__svg">
        {/* Instruction */}
        <rect x="220" y="10" width="160" height="30" rx="4" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="300" y="30" textAnchor="middle" className="coal-diagram__label">MOV EAX, [EBX]</text>

        {/* Arrow to Logical */}
        <line x1="300" y1="40" x2="300" y2="60" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />

        {/* Logical Address */}
        <rect x="200" y="65" width="200" height="30" rx="4" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="300" y="85" textAnchor="middle" className="coal-diagram__label">Logical Address (DS:Offset)</text>

        {/* Arrow to Segmentation */}
        <line x1="300" y1="95" x2="300" y2="115" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <text x="340" y="108" className="coal-diagram__sublabel">Segmentation (GDT)</text>

        {/* Linear Address */}
        <rect x="200" y="120" width="200" height="30" rx="4" className="coal-diagram__box coal-diagram__box--bus" />
        <text x="300" y="140" textAnchor="middle" className="coal-diagram__label">Linear Address (32‑bit)</text>

        {/* Arrow to Paging */}
        <line x1="300" y1="150" x2="300" y2="170" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <text x="340" y="163" className="coal-diagram__sublabel">Paging (CR3 → Page Tables)</text>

        {/* Physical Address */}
        <rect x="180" y="175" width="240" height="30" rx="4" className="coal-diagram__box coal-diagram__box--io" />
        <text x="300" y="195" textAnchor="middle" className="coal-diagram__label">Physical Address (RAM Bus)</text>

        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="coal-diagram__arrowhead" />
          </marker>
        </defs>
      </svg>
      <figcaption>From instruction to physical memory: segmentation, then paging.</figcaption>
    </figure>
  );
}

export function SegmentLayoutDiagram() {
  return (
    <figure className="coal-diagram" aria-label="Standard segment layout">
      <svg viewBox="0 0 300 200" role="img" className="coal-diagram__svg">
        <rect x="60" y="10" width="180" height="36" rx="6" className="coal-diagram__box coal-diagram__box--io" />
        <text x="150" y="33" textAnchor="middle" className="coal-diagram__label">.STACK</text>

        <rect x="60" y="60" width="180" height="36" rx="6" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="150" y="83" textAnchor="middle" className="coal-diagram__label">.DATA</text>

        <rect x="60" y="110" width="180" height="36" rx="6" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="150" y="133" textAnchor="middle" className="coal-diagram__label">.CODE</text>

        <text x="150" y="170" textAnchor="middle" className="coal-diagram__sublabel">Classic three‑segment program layout</text>
      </svg>
      <figcaption>Memory segments: stack for temporaries, data for variables, code for instructions.</figcaption>
    </figure>
  );
}

export function ProcCallFlowDiagram() {
  return (
    <figure className="coal-diagram" aria-label="Procedure call flow">
      <svg viewBox="0 0 440 200" role="img" className="coal-diagram__svg">
        {/* CALL side */}
        <rect x="20" y="40" width="160" height="40" rx="6" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="100" y="60" textAnchor="middle" className="coal-diagram__label">CALL Proc</text>
        <text x="100" y="75" textAnchor="middle" className="coal-diagram__sublabel">PUSH EIP → Stack</text>

        {/* Arrow */}
        <line x1="180" y1="60" x2="240" y2="60" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />

        {/* Procedure box */}
        <rect x="240" y="40" width="160" height="40" rx="6" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="320" y="60" textAnchor="middle" className="coal-diagram__label">Procedure Code</text>
        <text x="320" y="75" textAnchor="middle" className="coal-diagram__sublabel">… executes …</text>

        {/* RET arrow */}
        <line x1="320" y1="80" x2="320" y2="110" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />

        {/* Return box */}
        <rect x="240" y="115" width="160" height="40" rx="6" className="coal-diagram__box coal-diagram__box--bus" />
        <text x="320" y="135" textAnchor="middle" className="coal-diagram__label">RET</text>
        <text x="320" y="150" textAnchor="middle" className="coal-diagram__sublabel">POP → EIP</text>

        {/* Back to caller */}
        <line x1="240" y1="135" x2="180" y2="135" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />

        <rect x="20" y="115" width="160" height="40" rx="6" className="coal-diagram__box coal-diagram__box--io" />
        <text x="100" y="135" textAnchor="middle" className="coal-diagram__label">Next Instruction</text>

        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="coal-diagram__arrowhead" />
          </marker>
        </defs>
      </svg>
      <figcaption>CALL pushes the return address, RET pops it back to EIP.</figcaption>
    </figure>
  );
}

export function BuildPipelineDiagram() {
  return (
    <figure className="coal-diagram" aria-label="Build pipeline">
      <svg viewBox="0 0 620 120" role="img" className="coal-diagram__svg">
        <rect x="10" y="40" width="100" height="36" rx="6" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="60" y="63" textAnchor="middle" className="coal-diagram__label">.ASM file</text>

        <line x1="110" y1="58" x2="140" y2="58" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />

        <rect x="145" y="40" width="100" height="36" rx="6" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="195" y="63" textAnchor="middle" className="coal-diagram__label">Assembler</text>

        <line x1="245" y1="58" x2="275" y2="58" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />

        <rect x="280" y="40" width="100" height="36" rx="6" className="coal-diagram__box coal-diagram__box--bus" />
        <text x="330" y="63" textAnchor="middle" className="coal-diagram__label">.OBJ file</text>

        <line x1="380" y1="58" x2="410" y2="58" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />

        <rect x="415" y="40" width="100" height="36" rx="6" className="coal-diagram__box coal-diagram__box--io" />
        <text x="465" y="63" textAnchor="middle" className="coal-diagram__label">Linker</text>

        <line x1="515" y1="58" x2="545" y2="58" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />

        <rect x="550" y="40" width="60" height="36" rx="6" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="580" y="63" textAnchor="middle" className="coal-diagram__label">.EXE</text>

        <text x="310" y="25" textAnchor="middle" className="coal-diagram__sublabel">Assembly Stage</text>
        <text x="465" y="25" textAnchor="middle" className="coal-diagram__sublabel">Link Stage</text>

        <line x1="580" y1="76" x2="580" y2="90" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />

        <rect x="540" y="95" width="80" height="20" rx="4" className="coal-diagram__box coal-diagram__box--io" />
        <text x="580" y="109" textAnchor="middle" className="coal-diagram__sublabel">RAM</text>

        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="coal-diagram__arrowhead" />
          </marker>
        </defs>
      </svg>
      <figcaption>The build chain: .ASM → Assembler → .OBJ → Linker → .EXE → Loader → RAM.</figcaption>
    </figure>
  );
}

export function DemoProgramTemplateDiagram() {
  return (
    <figure className="coal-diagram" aria-label="Demo assembly program template">
      <svg viewBox="0 0 600 220" role="img" className="coal-diagram__svg">
        <foreignObject x="10" y="10" width="580" height="200">
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.5' }}>
            <pre style={{ margin: 0 }}>
{`.386
.MODEL FLAT, STDCALL
.STACK 4096

.DATA
value    DB  10
myArray  DW  5 DUP(0)

.CODE
main PROC
    MOV EAX, 0
    MOV EBX, OFFSET value
    MOV BYTE PTR [EBX], 20
    CALL ResetAccumulator
    INVOKE ExitProcess, 0
main ENDP

ResetAccumulator PROC
    XOR EAX, EAX
    RET
ResetAccumulator ENDP
END main`}
            </pre>
          </div>
        </foreignObject>
      </svg>
      <figcaption>A minimal but complete IA‑32 program with all the essential segments.</figcaption>
    </figure>
  );
}

export function StackFrameLayoutDiagram() {
  return (
    <figure className="coal-diagram" aria-label="Stack frame layout">
      <svg viewBox="0 0 400 300" role="img" className="coal-diagram__svg">
        <text x="200" y="20" textAnchor="middle" className="coal-diagram__sublabel">High Addresses</text>

        <rect x="100" y="30" width="200" height="28" rx="4" className="coal-diagram__box coal-diagram__box--io" />
        <text x="200" y="49" textAnchor="middle" className="coal-diagram__label">Parameters [EBP+8, +12…]</text>

        <rect x="100" y="64" width="200" height="28" rx="4" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="200" y="83" textAnchor="middle" className="coal-diagram__label">Return Address [EBP+4]</text>

        <rect x="100" y="98" width="200" height="28" rx="4" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="200" y="117" textAnchor="middle" className="coal-diagram__label">Old EBP [EBP]</text>

        <rect x="100" y="152" width="200" height="28" rx="4" className="coal-diagram__box coal-diagram__box--bus" />
        <text x="200" y="171" textAnchor="middle" className="coal-diagram__label">Local Variables [EBP‑4, ‑8…]</text>

        <text x="200" y="210" textAnchor="middle" className="coal-diagram__sublabel">Low Addresses (ESP)</text>
      </svg>
      <figcaption>Stack frame: parameters above EBP, locals below.</figcaption>
    </figure>
  );
}

export function IOMappingComparisonDiagram() {
  return (
    <figure className="coal-diagram" aria-label="I/O mapping: Memory-Mapped vs Isolated I/O">
      <svg viewBox="0 0 540 240" role="img" className="coal-diagram__svg">
        {/* Left Side: Memory-Mapped I/O */}
        <text x="135" y="25" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "14px" }}>Memory-Mapped I/O</text>
        
        <rect x="25" y="45" width="80" height="40" rx="6" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="65" y="70" textAnchor="middle" className="coal-diagram__label">CPU</text>

        {/* Single Memory Bar */}
        <rect x="150" y="45" width="90" height="150" rx="6" className="coal-diagram__box coal-diagram__box--mem" />
        {/* Memory Space partitions */}
        <line x1="150" y1="135" x2="240" y2="135" stroke="rgba(52, 211, 153, 0.4)" strokeWidth="1.5" strokeDasharray="3 3" />
        
        <text x="195" y="90" textAnchor="middle" className="coal-diagram__label">RAM Area</text>
        <text x="195" y="105" textAnchor="middle" className="coal-diagram__sublabel">0x0000 - 0x7FFF</text>

        <text x="195" y="160" textAnchor="middle" className="coal-diagram__label" style={{ fill: "#fbbf24" }}>I/O Ports</text>
        <text x="195" y="175" textAnchor="middle" className="coal-diagram__sublabel" style={{ fill: "#fbbf24" }}>0x8000 - 0xFFFF</text>

        {/* Unified Bus Arrow */}
        <line x1="105" y1="65" x2="142" y2="65" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <line x1="105" y1="65" x2="125" y2="155" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        
        <text x="125" y="125" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "9px" }}>Shared Bus</text>

        <text x="135" y="215" textAnchor="middle" className="coal-diagram__sublabel">Unified Address Space. Uses normal MOV instruction.</text>

        {/* Divider */}
        <line x1="270" y1="15" x2="270" y2="225" stroke="rgba(167, 139, 250, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" />

        {/* Right Side: Isolated I/O */}
        <text x="405" y="25" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "14px" }}>Isolated (Port-Mapped) I/O</text>
        
        <rect x="295" y="45" width="80" height="40" rx="6" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="335" y="70" textAnchor="middle" className="coal-diagram__label">CPU</text>

        {/* Memory Box */}
        <rect x="420" y="45" width="90" height="65" rx="6" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="465" y="80" textAnchor="middle" className="coal-diagram__label">RAM Space</text>
        <text x="465" y="95" textAnchor="middle" className="coal-diagram__sublabel">0x0000 - 0xFFFF</text>

        {/* I/O Box */}
        <rect x="420" y="130" width="90" height="65" rx="6" className="coal-diagram__box coal-diagram__box--io" />
        <text x="465" y="165" textAnchor="middle" className="coal-diagram__label">I/O Ports</text>
        <text x="465" y="180" textAnchor="middle" className="coal-diagram__sublabel">Port 0 - 65535</text>

        {/* Separate Bus Arrows */}
        <line x1="375" y1="60" x2="412" y2="60" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <line x1="375" y1="70" x2="412" y2="155" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />

        <text x="395" y="52" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "8px" }}>Memory Bus</text>
        <text x="395" y="135" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "8px", fill: "#fbbf24" }}>I/O Bus</text>

        <text x="405" y="215" textAnchor="middle" className="coal-diagram__sublabel">Separate Address Space. Uses IN/OUT instructions.</text>

        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="coal-diagram__arrowhead" />
          </marker>
        </defs>
      </svg>
      <figcaption>Memory-Mapped I/O shares the same address lines with RAM, while Isolated I/O uses dedicated hardware address buses and special assembly instructions.</figcaption>
    </figure>
  );
}

export function InterruptLifecycleDiagram() {
  return (
    <figure className="coal-diagram" aria-label="Interrupt lifecycle flow">
      <svg viewBox="0 0 540 240" role="img" className="coal-diagram__svg">
        {/* Main execution timeline */}
        <line x1="20" y1="60" x2="520" y2="60" stroke="rgba(167, 139, 250, 0.4)" strokeWidth="3" />
        
        {/* Normal flow */}
        <rect x="25" y="20" width="110" height="28" rx="4" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="80" y="38" textAnchor="middle" className="coal-diagram__label">Main Program</text>

        {/* Interrupt occurs point */}
        <circle cx="160" cy="60" r="6" fill="#ef4444" />
        <line x1="160" y1="120" x2="160" y2="66" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" style={{ stroke: "#ef4444" }} />
        <text x="160" y="135" textAnchor="middle" className="coal-diagram__sublabel" style={{ fill: "#f87171", fontWeight: "bold" }}>1. Hardware Interrupt</text>

        {/* State Saved (Stack) */}
        <line x1="160" y1="60" x2="210" y2="105" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <rect x="210" y="90" width="110" height="32" rx="4" className="coal-diagram__box coal-diagram__box--io" />
        <text x="265" y="110" textAnchor="middle" className="coal-diagram__label">2. Push State</text>
        <text x="265" y="138" textAnchor="middle" className="coal-diagram__sublabel">Flags, CS, EIP → Stack</text>

        {/* ISR lookup & execute */}
        <line x1="320" y1="106" x2="350" y2="106" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <rect x="350" y="90" width="120" height="32" rx="4" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="410" y="110" textAnchor="middle" className="coal-diagram__label">3. Run ISR</text>
        <text x="410" y="138" textAnchor="middle" className="coal-diagram__sublabel">Interrupt Vector / IDT</text>

        {/* IRET return */}
        <line x1="470" y1="106" x2="495" y2="66" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <text x="480" y="110" textAnchor="middle" className="coal-diagram__sublabel">4. IRET</text>

        {/* Resumed flow */}
        <rect x="390" y="20" width="120" height="28" rx="4" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="450" y="38" textAnchor="middle" className="coal-diagram__label">Program Resumes</text>

        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="coal-diagram__arrowhead" />
          </marker>
        </defs>
      </svg>
      <figcaption>When an interrupt is triggered, the CPU completes its current instruction, pushes its state to the stack, jumps to the ISR address using the vector table, and restores state via IRET to resume execution.</figcaption>
    </figure>
  );
}

export function SystemBusSplitDiagram() {
  return (
    <figure className="coal-diagram" aria-label="System Bus: Address, Data, and Control buses">
      <svg viewBox="0 0 520 220" role="img" className="coal-diagram__svg">
        {/* CPU */}
        <rect x="20" y="55" width="80" height="110" rx="8" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="60" y="110" textAnchor="middle" className="coal-diagram__label">CPU</text>
        <text x="60" y="125" textAnchor="middle" className="coal-diagram__sublabel">Controller</text>

        {/* Buses */}
        {/* Address Bus (Unidirectional) */}
        <rect x="140" y="45" width="240" height="24" rx="4" fill="rgba(59, 130, 246, 0.15)" stroke="rgba(96, 165, 250, 0.6)" strokeWidth="1.5" />
        <text x="260" y="61" textAnchor="middle" className="coal-diagram__label" style={{ fill: "#60a5fa", fontSize: "11px" }}>ADDRESS BUS (Unidirectional)</text>

        {/* Data Bus (Bidirectional) */}
        <rect x="140" y="98" width="240" height="24" rx="4" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(52, 211, 153, 0.6)" strokeWidth="1.5" />
        <text x="260" y="114" textAnchor="middle" className="coal-diagram__label" style={{ fill: "#34d399", fontSize: "11px" }}>DATA BUS (Bidirectional)</text>

        {/* Control Bus (Bidirectional/Control) */}
        <rect x="140" y="151" width="240" height="24" rx="4" fill="rgba(251, 191, 36, 0.15)" stroke="rgba(251, 191, 36, 0.6)" strokeWidth="1.5" />
        <text x="260" y="167" textAnchor="middle" className="coal-diagram__label" style={{ fill: "#fbbf24", fontSize: "11px" }}>CONTROL BUS (System Signals)</text>

        {/* RAM */}
        <rect x="420" y="30" width="80" height="65" rx="6" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="460" y="62" textAnchor="middle" className="coal-diagram__label">RAM</text>
        <text x="460" y="77" textAnchor="middle" className="coal-diagram__sublabel">Memory</text>

        {/* I/O Controller */}
        <rect x="420" y="125" width="80" height="65" rx="6" className="coal-diagram__box coal-diagram__box--io" />
        <text x="460" y="157" textAnchor="middle" className="coal-diagram__label">I/O Device</text>
        <text x="460" y="172" textAnchor="middle" className="coal-diagram__sublabel">Keyboard/Disk</text>

        {/* Connections from CPU */}
        <line x1="100" y1="57" x2="140" y2="57" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <line x1="100" y1="110" x2="140" y2="110" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <line x1="100" y1="163" x2="140" y2="163" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />

        {/* Connections to RAM */}
        <line x1="380" y1="50" x2="420" y2="50" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <line x1="380" y1="105" x2="420" y2="75" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <line x1="380" y1="155" x2="420" y2="85" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />

        {/* Connections to I/O */}
        <line x1="380" y1="62" x2="420" y2="135" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <line x1="380" y1="115" x2="420" y2="145" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <line x1="380" y1="170" x2="420" y2="170" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />

        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="coal-diagram__arrowhead" />
          </marker>
        </defs>
      </svg>
      <figcaption>The System Bus is divided into three functional lines: Address Bus (selecting the destination), Data Bus (carrying information), and Control Bus (transmitting synchronization signals).</figcaption>
    </figure>
  );
}

export function RaidComparisonDiagram() {
  return (
    <figure className="coal-diagram" aria-label="RAID levels 0, 1, and 5 comparison">
      <svg viewBox="0 0 540 260" role="img" className="coal-diagram__svg">
        {/* RAID 0 (Striping) */}
        <text x="90" y="25" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "13px" }}>RAID 0 (Striping)</text>
        {/* Disk 0 */}
        <rect x="25" y="45" width="60" height="150" rx="4" fill="rgba(15, 23, 42, 0.4)" stroke="rgba(167, 139, 250, 0.3)" />
        <text x="55" y="180" textAnchor="middle" className="coal-diagram__sublabel">Disk 1</text>
        <rect x="30" y="55" width="50" height="25" rx="2" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="55" y="72" textAnchor="middle" className="coal-diagram__label">Block 1</text>
        <rect x="30" y="85" width="50" height="25" rx="2" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="55" y="102" textAnchor="middle" className="coal-diagram__label">Block 3</text>
        <rect x="30" y="115" width="50" height="25" rx="2" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="55" y="132" textAnchor="middle" className="coal-diagram__label">Block 5</text>
        
        {/* Disk 1 */}
        <rect x="95" y="45" width="60" height="150" rx="4" fill="rgba(15, 23, 42, 0.4)" stroke="rgba(167, 139, 250, 0.3)" />
        <text x="125" y="180" textAnchor="middle" className="coal-diagram__sublabel">Disk 2</text>
        <rect x="100" y="55" width="50" height="25" rx="2" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="125" y="72" textAnchor="middle" className="coal-diagram__label">Block 2</text>
        <rect x="100" y="85" width="50" height="25" rx="2" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="125" y="102" textAnchor="middle" className="coal-diagram__label">Block 4</text>
        <rect x="100" y="115" width="50" height="25" rx="2" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="125" y="132" textAnchor="middle" className="coal-diagram__label">Block 6</text>

        <text x="90" y="215" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "9px" }}>Fast speed. No redundancy.</text>

        {/* RAID 1 (Mirroring) */}
        <text x="270" y="25" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "13px" }}>RAID 1 (Mirroring)</text>
        {/* Disk 0 */}
        <rect x="205" y="45" width="60" height="150" rx="4" fill="rgba(15, 23, 42, 0.4)" stroke="rgba(167, 139, 250, 0.3)" />
        <text x="235" y="180" textAnchor="middle" className="coal-diagram__sublabel">Disk 1</text>
        <rect x="210" y="55" width="50" height="25" rx="2" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="235" y="72" textAnchor="middle" className="coal-diagram__label">Block 1</text>
        <rect x="210" y="85" width="50" height="25" rx="2" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="235" y="102" textAnchor="middle" className="coal-diagram__label">Block 2</text>
        <rect x="210" y="115" width="50" height="25" rx="2" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="235" y="132" textAnchor="middle" className="coal-diagram__label">Block 3</text>
        
        {/* Disk 1 */}
        <rect x="275" y="45" width="60" height="150" rx="4" fill="rgba(15, 23, 42, 0.4)" stroke="rgba(167, 139, 250, 0.3)" />
        <text x="305" y="180" textAnchor="middle" className="coal-diagram__sublabel">Disk 2</text>
        <rect x="280" y="55" width="50" height="25" rx="2" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="305" y="72" textAnchor="middle" className="coal-diagram__label">Block 1</text>
        <rect x="280" y="85" width="50" height="25" rx="2" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="305" y="102" textAnchor="middle" className="coal-diagram__label">Block 2</text>
        <rect x="280" y="115" width="50" height="25" rx="2" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="305" y="132" textAnchor="middle" className="coal-diagram__label">Block 3</text>

        <text x="270" y="215" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "9px" }}>Full backup. Half capacity.</text>

        {/* RAID 5 (Parity) */}
        <text x="450" y="25" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "13px" }}>RAID 5 (Distributed Parity)</text>
        {/* Disk 0 */}
        <rect x="385" y="45" width="40" height="150" rx="4" fill="rgba(15, 23, 42, 0.4)" stroke="rgba(167, 139, 250, 0.3)" />
        <text x="405" y="180" textAnchor="middle" className="coal-diagram__sublabel">Disk 1</text>
        <rect x="390" y="55" width="30" height="25" rx="2" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="405" y="72" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "10px" }}>Block 1</text>
        <rect x="390" y="85" width="30" height="25" rx="2" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="405" y="102" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "10px" }}>Block 3</text>
        <rect x="390" y="115" width="30" height="25" rx="2" className="coal-diagram__box coal-diagram__box--io" />
        <text x="405" y="132" textAnchor="middle" className="coal-diagram__label" style={{ fill: "#fbbf24", fontSize: "10px" }}>P (5-6)</text>
        
        {/* Disk 1 */}
        <rect x="430" y="45" width="40" height="150" rx="4" fill="rgba(15, 23, 42, 0.4)" stroke="rgba(167, 139, 250, 0.3)" />
        <text x="450" y="180" textAnchor="middle" className="coal-diagram__sublabel">Disk 2</text>
        <rect x="435" y="55" width="30" height="25" rx="2" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="450" y="72" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "10px" }}>Block 2</text>
        <rect x="435" y="85" width="30" height="25" rx="2" className="coal-diagram__box coal-diagram__box--io" />
        <text x="450" y="102" textAnchor="middle" className="coal-diagram__label" style={{ fill: "#fbbf24", fontSize: "10px" }}>P (3-4)</text>
        <rect x="435" y="115" width="30" height="25" rx="2" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="450" y="132" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "10px" }}>Block 5</text>

        {/* Disk 2 */}
        <rect x="475" y="45" width="40" height="150" rx="4" fill="rgba(15, 23, 42, 0.4)" stroke="rgba(167, 139, 250, 0.3)" />
        <text x="495" y="180" textAnchor="middle" className="coal-diagram__sublabel">Disk 3</text>
        <rect x="480" y="55" width="30" height="25" rx="2" className="coal-diagram__box coal-diagram__box--io" />
        <text x="495" y="72" textAnchor="middle" className="coal-diagram__label" style={{ fill: "#fbbf24", fontSize: "10px" }}>P (1-2)</text>
        <rect x="480" y="85" width="30" height="25" rx="2" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="495" y="102" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "10px" }}>Block 4</text>
        <rect x="480" y="115" width="30" height="25" rx="2" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="495" y="132" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "10px" }}>Block 6</text>

        <text x="450" y="215" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "9px" }}>Survives 1 failure. Balances speed & size.</text>
      </svg>
      <figcaption>RAID 0 stripes data for maximum speed. RAID 1 mirrors data on two disks for simple redundancy. RAID 5 distributes data and parity blocks across three or more disks to balance speed, capacity, and failure recovery.</figcaption>
    </figure>
  );
}

export function CiscRiscComparisonDiagram() {
  return (
    <figure className="coal-diagram" aria-label="CISC vs RISC design comparison">
      <svg viewBox="0 0 540 240" role="img" className="coal-diagram__svg">
        {/* CISC Column */}
        <text x="135" y="25" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "14px" }}>CISC (e.g. x86)</text>
        
        <rect x="25" y="45" width="220" height="42" rx="4" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="135" y="62" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "11px" }}>ADD [MemA], EBX</text>
        <text x="135" y="78" textAnchor="middle" className="coal-diagram__sublabel">Single complex instruction (variable length)</text>

        {/* Micro-operations inside CISC */}
        <rect x="25" y="105" width="60" height="35" rx="3" className="coal-diagram__box" />
        <text x="55" y="122" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "9px" }}>1. Load MemA</text>

        <rect x="105" y="105" width="60" height="35" rx="3" className="coal-diagram__box" />
        <text x="135" y="122" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "9px" }}>2. Add EBX</text>

        <rect x="185" y="105" width="60" height="35" rx="3" className="coal-diagram__box" />
        <text x="215" y="122" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "9px" }}>3. Store MemA</text>

        <path d="M 55 87 L 55 105" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <path d="M 135 87 L 135 105" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <path d="M 215 87 L 215 105" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />

        <text x="135" y="170" textAnchor="middle" className="coal-diagram__sublabel">Hardware decodes into multiple micro-operations.</text>
        <text x="135" y="185" textAnchor="middle" className="coal-diagram__sublabel">Saves memory, but CPU decoder is complex.</text>

        {/* Divider */}
        <line x1="270" y1="15" x2="270" y2="215" stroke="rgba(167, 139, 250, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" />

        {/* RISC Column */}
        <text x="405" y="25" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "14px" }}>RISC (e.g. ARM, RISC-V)</text>

        <rect x="295" y="45" width="220" height="110" rx="6" fill="rgba(15, 23, 42, 0.4)" stroke="rgba(167, 139, 250, 0.3)" />
        
        <rect x="305" y="55" width="200" height="22" rx="3" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="405" y="70" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "10px" }}>LDR R1, [MemA]   ; Load value</text>
        
        <rect x="305" y="85" width="200" height="22" rx="3" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="405" y="100" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "10px" }}>ADD R1, R1, R2   ; Add registers</text>

        <rect x="305" y="115" width="200" height="22" rx="3" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="405" y="130" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "10px" }}>STR R1, [MemA]   ; Store result</text>

        <text x="405" y="170" textAnchor="middle" className="coal-diagram__sublabel">Simple, fixed-length (4 bytes) instructions.</text>
        <text x="405" y="185" textAnchor="middle" className="coal-diagram__sublabel">Compiler works harder. Fast single-cycle execution.</text>

        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="coal-diagram__arrowhead" />
          </marker>
        </defs>
      </svg>
      <figcaption>CISC relies on a powerful processor that decodes complex instructions into micro-ops. RISC relies on a simple processor executing uniform instructions quickly, shifting translation complexity to the compiler.</figcaption>
    </figure>
  );
}

export function FiveStagePipelineDiagram() {
  const stages = ["IF", "ID", "EX", "MEM", "WB"];
  const colors = [
    "rgba(59, 130, 246, 0.22)", // Blue for IF
    "rgba(139, 92, 246, 0.22)", // Purple for ID
    "rgba(239, 68, 68, 0.22)",  // Red for EX
    "rgba(251, 191, 36, 0.22)", // Yellow for MEM
    "rgba(16, 185, 129, 0.22)"  // Green for WB
  ];
  const borderColors = [
    "rgba(59, 130, 246, 0.6)",
    "rgba(139, 92, 246, 0.6)",
    "rgba(239, 68, 68, 0.6)",
    "rgba(251, 191, 36, 0.6)",
    "rgba(16, 185, 129, 0.6)"
  ];

  return (
    <figure className="coal-diagram" aria-label="Classic 5-stage CPU pipeline">
      <svg viewBox="0 0 540 220" role="img" className="coal-diagram__svg">
        {/* Cycles headers */}
        <text x="140" y="25" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "11px" }}>CC 1</text>
        <text x="195" y="25" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "11px" }}>CC 2</text>
        <text x="250" y="25" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "11px" }}>CC 3</text>
        <text x="305" y="25" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "11px" }}>CC 4</text>
        <text x="360" y="25" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "11px" }}>CC 5</text>
        <text x="415" y="25" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "11px" }}>CC 6</text>
        <text x="470" y="25" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "11px" }}>CC 7</text>

        {/* Instruction 1 */}
        <text x="20" y="60" className="coal-diagram__label" style={{ fontSize: "11px" }}>Instr 1</text>
        {stages.map((stage, i) => (
          <g key={`i1-${stage}`}>
            <rect x={115 + i * 55} y="45" width="50" height="24" rx="3" fill={colors[i]} stroke={borderColors[i]} strokeWidth="1.5" />
            <text x={140 + i * 55} y="61" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "10px" }}>{stage}</text>
          </g>
        ))}

        {/* Instruction 2 */}
        <text x="20" y="95" className="coal-diagram__label" style={{ fontSize: "11px" }}>Instr 2</text>
        {stages.map((stage, i) => (
          <g key={`i2-${stage}`}>
            <rect x={170 + i * 55} y="80" width="50" height="24" rx="3" fill={colors[i]} stroke={borderColors[i]} strokeWidth="1.5" />
            <text x={195 + i * 55} y="96" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "10px" }}>{stage}</text>
          </g>
        ))}

        {/* Instruction 3 */}
        <text x="20" y="130" className="coal-diagram__label" style={{ fontSize: "11px" }}>Instr 3</text>
        {stages.map((stage, i) => (
          <g key={`i3-${stage}`}>
            <rect x={225 + i * 55} y="115" width="50" height="24" rx="3" fill={colors[i]} stroke={borderColors[i]} strokeWidth="1.5" />
            <text x={250 + i * 55} y="131" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "10px" }}>{stage}</text>
          </g>
        ))}

        {/* Instruction 4 */}
        <text x="20" y="165" className="coal-diagram__label" style={{ fontSize: "11px" }}>Instr 4</text>
        {stages.map((stage, i) => (
          <g key={`i4-${stage}`}>
            <rect x={280 + i * 55} y="150" width="50" height="24" rx="3" fill={colors[i]} stroke={borderColors[i]} strokeWidth="1.5" />
            <text x={305 + i * 55} y="166" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "10px" }}>{stage}</text>
          </g>
        ))}

        {/* Legend */}
        <text x="20" y="200" className="coal-diagram__sublabel" style={{ fontSize: "9px" }}>IF: Fetch | ID: Decode | EX: Execute | MEM: Memory | WB: Write Back</text>
      </svg>
      <figcaption>Instruction pipelining increases CPU instruction throughput by overlapping different stages of execution. On Clock Cycle 5, all 5 stages of the CPU are working on 5 different instructions simultaneously.</figcaption>
    </figure>
  );
}

export function PipelineHazardsDiagram() {
  return (
    <figure className="coal-diagram" aria-label="Pipeline data hazard and mitigation">
      <svg viewBox="0 0 540 240" role="img" className="coal-diagram__svg">
        {/* Left Side: Stall (Bubble) */}
        <text x="135" y="25" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "13px" }}>Data Hazard with Stalling</text>

        <text x="20" y="55" className="coal-diagram__sublabel" style={{ fontSize: "9px" }}>ADD R1, R2, R3 (Writes in WB)</text>
        <rect x="25" y="65" width="30" height="18" rx="2" fill="rgba(59, 130, 246, 0.2)" stroke="rgba(59, 130, 246, 0.5)" />
        <text x="40" y="77" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "8px" }}>IF</text>
        <rect x="60" y="65" width="30" height="18" rx="2" fill="rgba(139, 92, 246, 0.2)" stroke="rgba(139, 92, 246, 0.5)" />
        <text x="75" y="77" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "8px" }}>ID</text>
        <rect x="95" y="65" width="30" height="18" rx="2" fill="rgba(239, 68, 68, 0.2)" stroke="rgba(239, 68, 68, 0.5)" />
        <text x="110" y="77" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "8px" }}>EX</text>
        <rect x="130" y="65" width="30" height="18" rx="2" fill="rgba(251, 191, 36, 0.2)" stroke="rgba(251, 191, 36, 0.5)" />
        <text x="145" y="77" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "8px" }}>MEM</text>
        <rect x="165" y="65" width="30" height="18" rx="2" fill="rgba(16, 185, 129, 0.4)" stroke="rgba(16, 185, 129, 0.7)" />
        <text x="180" y="77" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "8px", fontWeight: "bold" }}>WB</text>

        <text x="20" y="105" className="coal-diagram__sublabel" style={{ fontSize: "9px" }}>SUB R4, R1, R5 (Reads R1 in ID)</text>
        <rect x="60" y="115" width="30" height="18" rx="2" fill="rgba(59, 130, 246, 0.2)" stroke="rgba(59, 130, 246, 0.5)" />
        <text x="75" y="127" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "8px" }}>IF</text>
        
        {/* Stall bubbles */}
        <rect x="95" y="115" width="30" height="18" rx="2" fill="rgba(239, 68, 68, 0.1)" stroke="rgba(239, 68, 68, 0.4)" strokeDasharray="2 2" />
        <text x="110" y="127" textAnchor="middle" className="coal-diagram__sublabel" style={{ fill: "#f87171", fontSize: "7px" }}>STALL</text>
        <rect x="130" y="115" width="30" height="18" rx="2" fill="rgba(239, 68, 68, 0.1)" stroke="rgba(239, 68, 68, 0.4)" strokeDasharray="2 2" />
        <text x="145" y="127" textAnchor="middle" className="coal-diagram__sublabel" style={{ fill: "#f87171", fontSize: "7px" }}>STALL</text>

        <rect x="165" y="115" width="30" height="18" rx="2" fill="rgba(139, 92, 246, 0.4)" stroke="rgba(139, 92, 246, 0.7)" />
        <text x="180" y="127" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "8px", fontWeight: "bold" }}>ID</text>
        <rect x="200" y="115" width="30" height="18" rx="2" fill="rgba(239, 68, 68, 0.2)" stroke="rgba(239, 68, 68, 0.5)" />
        <text x="215" y="127" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "8px" }}>EX</text>

        <text x="135" y="175" textAnchor="middle" className="coal-diagram__sublabel">Bubble inserts wait states. Delays execution.</text>

        {/* Divider */}
        <line x1="270" y1="15" x2="270" y2="215" stroke="rgba(167, 139, 250, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" />

        {/* Right Side: Forwarding */}
        <text x="405" y="25" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "13px" }}>Forwarding (Bypassing)</text>

        <text x="290" y="55" className="coal-diagram__sublabel" style={{ fontSize: "9px" }}>ADD R1, R2, R3</text>
        <rect x="295" y="65" width="30" height="18" rx="2" fill="rgba(59, 130, 246, 0.2)" stroke="rgba(59, 130, 246, 0.5)" />
        <text x="310" y="77" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "8px" }}>IF</text>
        <rect x="330" y="65" width="30" height="18" rx="2" fill="rgba(139, 92, 246, 0.2)" stroke="rgba(139, 92, 246, 0.5)" />
        <text x="345" y="77" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "8px" }}>ID</text>
        
        {/* EX stage */}
        <rect x="365" y="65" width="30" height="18" rx="2" fill="rgba(239, 68, 68, 0.4)" stroke="rgba(239, 68, 68, 0.7)" id="ex-stage-i1" />
        <text x="380" y="77" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "8px", fontWeight: "bold" }}>EX</text>
        
        <rect x="400" y="65" width="30" height="18" rx="2" fill="rgba(251, 191, 36, 0.2)" stroke="rgba(251, 191, 36, 0.5)" />
        <text x="415" y="77" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "8px" }}>MEM</text>
        <rect x="435" y="65" width="30" height="18" rx="2" fill="rgba(16, 185, 129, 0.2)" stroke="rgba(16, 185, 129, 0.5)" />
        <text x="450" y="77" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "8px" }}>WB</text>

        <text x="290" y="105" className="coal-diagram__sublabel" style={{ fontSize: "9px" }}>SUB R4, R1, R5</text>
        <rect x="330" y="115" width="30" height="18" rx="2" fill="rgba(59, 130, 246, 0.2)" stroke="rgba(59, 130, 246, 0.5)" />
        <text x="345" y="127" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "8px" }}>IF</text>
        <rect x="365" y="115" width="30" height="18" rx="2" fill="rgba(139, 92, 246, 0.2)" stroke="rgba(139, 92, 246, 0.5)" />
        <text x="380" y="127" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "8px" }}>ID</text>
        
        {/* EX stage for instruction 2 */}
        <rect x="400" y="115" width="30" height="18" rx="2" fill="rgba(239, 68, 68, 0.4)" stroke="rgba(239, 68, 68, 0.7)" />
        <text x="415" y="127" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "8px", fontWeight: "bold" }}>EX</text>
        
        <rect x="435" y="115" width="30" height="18" rx="2" fill="rgba(251, 191, 36, 0.2)" stroke="rgba(251, 191, 36, 0.5)" />
        <text x="450" y="127" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "8px" }}>MEM</text>

        {/* Forwarding wire arrow */}
        <path d="M 380 83 C 380 98, 415 98, 415 113" fill="none" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#arrowhead-green)" />
        <text x="402" y="98" textAnchor="middle" className="coal-diagram__sublabel" style={{ fill: "#34d399", fontSize: "8px", fontWeight: "bold" }}>Forward</text>

        <text x="405" y="175" textAnchor="middle" className="coal-diagram__sublabel">Data passed immediately. Stalls are avoided!</text>

        <defs>
          <marker id="arrowhead-green" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#10b981" />
          </marker>
        </defs>
      </svg>
      <figcaption>When an instruction depends on a previous instruction's result, a Data Hazard occurs. A stall (bubble) halts the pipeline for 2 clock cycles. Forwarding pathways bypass this by routing arithmetic output directly back into the ALU.</figcaption>
    </figure>
  );
}

export function ComputerAssemblyFlowDiagram() {
  return (
    <figure className="coal-diagram" aria-label="From source code to hardware execution">
      <svg viewBox="0 0 540 240" role="img" className="coal-diagram__svg">
        {/* Source level */}
        <rect x="20" y="30" width="100" height="35" rx="4" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="70" y="52" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "11px" }}>High-Level Code</text>
        <text x="70" y="80" textAnchor="middle" className="coal-diagram__sublabel">a = b + c;</text>

        {/* Arrow 1 */}
        <line x1="120" y1="47" x2="160" y2="47" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <text x="140" y="40" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "8px" }}>Compiler</text>

        {/* Assembly level */}
        <rect x="160" y="30" width="105" height="55" rx="4" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="212" y="50" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "11px" }}>Assembly (COAL)</text>
        <text x="212" y="68" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "8px", fontFamily: "monospace" }}>MOV EAX, [b]</text>
        <text x="212" y="78" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "8px", fontFamily: "monospace" }}>ADD EAX, [c]</text>

        {/* Arrow 2 */}
        <line x1="265" y1="47" x2="305" y2="47" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <text x="285" y="40" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "8px" }}>Assembler</text>

        {/* Machine code level */}
        <rect x="305" y="30" width="100" height="55" rx="4" className="coal-diagram__box coal-diagram__box--io" />
        <text x="355" y="50" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "11px" }}>Machine Code</text>
        <text x="355" y="68" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "8px", fontFamily: "monospace" }}>8B 05 04 30 40</text>
        <text x="355" y="78" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "8px", fontFamily: "monospace" }}>03 05 08 30 40</text>

        {/* Arrow 3 */}
        <line x1="405" y1="47" x2="435" y2="47" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <text x="420" y="40" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "8px" }}>Loader</text>

        {/* CPU hardware execution */}
        <rect x="435" y="30" width="85" height="150" rx="4" fill="rgba(139, 92, 246, 0.15)" stroke="rgba(167, 139, 250, 0.55)" strokeWidth="1.5" />
        <text x="477" y="50" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "10px" }}>CPU Datapath</text>
        
        <rect x="445" y="65" width="65" height="20" rx="2" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="477" y="78" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "8px", fontWeight: "bold" }}>EAX Register</text>

        <rect x="445" y="95" width="65" height="30" rx="2" className="coal-diagram__box" style={{ fill: "rgba(239, 68, 68, 0.12)", stroke: "rgba(239, 68, 68, 0.45)" }} />
        <text x="477" y="113" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "9px" }}>ALU (ADD)</text>

        {/* RAM block at bottom */}
        <rect x="160" y="130" width="245" height="50" rx="4" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="282" y="150" textAnchor="middle" className="coal-diagram__label" style={{ fontSize: "11px" }}>RAM Address Space</text>
        <text x="282" y="168" textAnchor="middle" className="coal-diagram__sublabel" style={{ fontSize: "9px" }}>Address 0x403004 [b] | Address 0x403008 [c]</text>

        {/* Flow arrows linking CPU and RAM */}
        <path d="M 282 130 C 282 105, 440 105, 440 80" fill="none" stroke="rgba(167, 139, 250, 0.4)" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d="M 445 110 L 405 140" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="coal-diagram__arrowhead" />
          </marker>
        </defs>
      </svg>
      <figcaption>High-level variables are compiled into assembly instruction offsets, assembled into binary opcodes (machine code) stored in RAM, and fetched by the CPU to load values into registers and process them through the ALU.</figcaption>
    </figure>
  );
}


const DIAGRAM_MAP = {
  "von-neumann": VonNeumannDiagram,
  "system-bus": SystemBusDiagram,
  "binary-byte": BinaryByteDiagram,
  "dec-to-bin": DecToBinDiagram,
  "isa-overview": IsaOverviewDiagram,
  "addressing-modes": AddressingModesDiagram,
  "flags-register": FlagsRegisterDiagram,
  "translation-pipeline": TranslationPipelineDiagram,
  "ia32-gpr-layout": IA32GPRLayoutDiagram,
  "ia32-stack-frame": IA32StackFrameDiagram,
  "ia32-mode-transitions": IA32ModeTransitionsDiagram,
  "ia32-segment-selector": IA32SegmentSelectorDiagram,
  "ia32-linear-address-breakdown": IA32LinearAddressBreakdownDiagram,
  "ia32-address-lifecycle": IA32AddressLifecycleDiagram,
  "segment-layout": SegmentLayoutDiagram,
  "proc-call-flow": ProcCallFlowDiagram,
  "build-pipeline": BuildPipelineDiagram,
  "demo-program-template": DemoProgramTemplateDiagram,
  "stack-frame-layout": StackFrameLayoutDiagram,
  "io-mapping-comparison": IOMappingComparisonDiagram,
  "interrupt-lifecycle": InterruptLifecycleDiagram,
  "system-bus-split": SystemBusSplitDiagram,
  "raid-comparison": RaidComparisonDiagram,
  "cisc-risc-comparison": CiscRiscComparisonDiagram,
  "five-stage-pipeline": FiveStagePipelineDiagram,
  "pipeline-hazards": PipelineHazardsDiagram,
  "computer-assembly-flow": ComputerAssemblyFlowDiagram,
};

export function CoalDiagram({ type }) {
  const Component = DIAGRAM_MAP[type];
  if (!Component) return null;
  return <Component />;
}


