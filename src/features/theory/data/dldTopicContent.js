// ── DLD Topic Content ────────────────────────────────────────────
// Keyed by module slug (see dldCourseOutline.js). Rendered generically
// by TheoryTopicContent.jsx — the same renderer COAL uses.
//
// STATUS: Memory Systems (7/7 topics) is fully migrated below. The
// other 6 parts are not yet converted — their topics keep rendering
// through their original hand-written page components (see App.js),
// so nothing regresses. dldCourseOutline.js already lists every part/
// topic so navigation is unified regardless of which topics are
// data-driven yet vs still on a legacy component.
const dldTopicContent = {
  // ══════════════════════════ MEMORY SYSTEMS ══════════════════════
  "basics": {
    preview: { summary: "Volatile vs non-volatile, bits, bytes, and address spaces — the foundational vocabulary for every memory system that follows." },
    sections: [
      {
        id: "concept",
        kicker: "Memory Systems",
        title: "Memory Basics",
        body: [
          "Volatile vs non-volatile, bits, bytes, and address spaces.",
          {
            type: "cards",
            items: [
              { icon: "🧱", title: "Bit / Byte", text: "A bit is 0 or 1; a byte is 8 bits — the smallest addressable unit in most memory systems." },
              { icon: "📍", title: "Address Space", text: "The range of unique addresses a memory system can reference, determined by the number of address lines." },
              { icon: "⚡", title: "Volatile vs Non-Volatile", text: "Volatile memory (RAM) loses data without power; non-volatile memory (ROM, Flash) retains it." },
            ],
          },
        ],
      },
    ],
    keyTakeaways: [
      "Memory capacity is words × bits-per-word; address lines determine how many words are addressable (2ⁿ).",
      "Volatile memory needs continuous power to retain data; non-volatile memory does not.",
    ],
  },

  "read-only-memories": {
    preview: { summary: "ROM is non-volatile memory that permanently stores data or programs. Content is fixed at manufacturing time or programmed once, retained without power indefinitely." },
    sections: [
      {
        id: "concept",
        kicker: "Concept",
        title: "What is ROM?",
        body: [
          "ROM stores binary information permanently. It is used for firmware, boot programs, and lookup tables that must survive power loss.",
          {
            type: "cards",
            items: [
              { icon: "🔋", title: "Non-Volatile", text: "Data retained even when power is off" },
              { icon: "📖", title: "Read Access", text: "CPU reads ROM, cannot write normally" },
              { icon: "💿", title: "Common Use", text: "BIOS, firmware, character generators" },
            ],
          },
        ],
      },
      {
        id: "structure",
        kicker: "Structure",
        title: "ROM as a Combinational Circuit",
        body: [
          "A ROM with n address inputs and m data outputs implements m Boolean functions of n variables. The address is the input; the stored word is the output.",
        ],
        table: {
          caption: "ROM Truth Table (2-input, 4-output example)",
          headers: ["A1", "A0", "D3", "D2", "D1", "D0"],
          rows: [
            ["0", "0", "0", "0", "1", "1"],
            ["0", "1", "0", "1", "0", "1"],
            ["1", "0", "1", "0", "1", "0"],
            ["1", "1", "1", "1", "0", "0"],
          ],
          colColors: ["#38bdf8", "#38bdf8", "#34d399", "#34d399", "#34d399", "#34d399"],
        },
      },
      {
        id: "capacity",
        title: "ROM Capacity Formula",
        body: [
          {
            type: "code",
            lines: [
              { text: "ROM capacity = 2ⁿ words × m bits" },
              { text: "" },
              { text: "Example: 2-input, 4-output ROM", color: "#818cf8" },
              { text: "  → 2² = 4 words, 4 bits each", color: "#38bdf8" },
              { text: "  → 4 × 4 = 16 bits total", color: "#34d399" },
            ],
          },
        ],
      },
      {
        id: "types",
        kicker: "Types",
        title: "ROM Varieties",
        body: ["Different ROM types offer different trade-offs between cost, flexibility, and reprogrammability."],
        table: {
          headers: ["Type", "Programmed By", "Erasable?", "Use Case"],
          rows: [
            ["Mask ROM", "Manufacturer", "No", "Mass-produced firmware"],
            ["PROM", "User (once)", "No (fuses blown)", "One-time field programming"],
            ["EPROM", "User", "UV light", "Development, prototyping"],
            ["EEPROM", "User (in-circuit)", "Electrically", "Microcontroller config"],
            ["Flash", "User (in-circuit)", "Electrically (block)", "USB drives, SSDs, embedded"],
          ],
          colColors: [null, "#38bdf8", "#fb923c", "#818cf8"],
        },
      },
      {
        id: "breakdown",
        kicker: "Details",
        title: "ROM Type Breakdown",
        body: [
          {
            type: "steps",
            items: [
              "Mask ROM — Programmed at manufacturing. Lowest cost in large quantities. Cannot be changed after fabrication.",
              "PROM (Programmable ROM) — One-time user programmable via a special PROM programmer tool. Fuses blown permanently.",
              "EPROM (Erasable PROM) — Erased with UV light through a quartz window. Can be reprogrammed multiple times.",
              "EEPROM (Electrically Erasable PROM) — Erased electrically, byte by byte. In-circuit programmable. Used in microcontrollers.",
              "Flash Memory — Block-level erasure, high density, fast. Used in USB drives, SSDs, smartphones, and embedded systems.",
            ],
          },
        ],
        quiz: {
          questions: [
            { q: "What does ROM stand for?", opts: ["Random Output Memory", "Read-Only Memory", "Read-Once Memory", "Removable Output Module"], ans: 1, explain: "ROM stands for Read-Only Memory — it can be read but not easily written." },
            { q: "Which ROM type can be erased with ultraviolet light?", opts: ["PROM", "EPROM", "EEPROM", "Mask ROM"], ans: 1, explain: "EPROM (Erasable Programmable ROM) is erased by exposing it to UV light through a quartz window." },
            { q: "What is a Mask ROM?", opts: ["Programmed by the user", "Programmed during manufacturing", "Erased with electricity", "Erased with UV light"], ans: 1, explain: "Mask ROM is programmed during the chip manufacturing process using a photomask." },
            { q: "Which ROM type can be electrically erased byte-by-byte?", opts: ["PROM", "EPROM", "Mask ROM", "EEPROM"], ans: 3, explain: "EEPROM (Electrically Erasable PROM) can be erased and rewritten electrically, byte by byte." },
          ],
        },
      },
    ],
  },

  "programmable-logic-array": {
    preview: { summary: "PLAs are programmable chips that implement combinational logic using a programmable AND-OR structure. They offer flexibility between full custom ICs and fixed-function logic gates." },
    sections: [
      {
        id: "concept",
        kicker: "Concept",
        title: "What is a PLA?",
        body: [
          "A PLA implements Boolean functions in Sum-of-Products (SOP) form using two programmable planes: an AND plane and an OR plane.",
          {
            type: "cards",
            items: [
              { icon: "∩", title: "AND Plane", text: "Programmable — generates product terms (minterms)" },
              { icon: "∪", title: "OR Plane", text: "Programmable — sums selected product terms" },
              { icon: "✅", title: "Advantage", text: "Fewer product terms than a full ROM decoder" },
            ],
          },
        ],
      },
      {
        id: "architecture",
        kicker: "Architecture",
        title: "PLA Structure",
        body: [
          "A PLA with n inputs, k product terms, and m outputs can implement m Boolean functions using at most k product terms. Only required minterms are programmed — not all 2ⁿ.",
          {
            type: "code",
            lines: [
              { text: "── AND Plane (product terms) ──────────────", color: "#38bdf8" },
              { text: "P1 = A · B'· C" },
              { text: "P2 = A'· B · C" },
              { text: "P3 = A · B · C'" },
              { text: "P4 = A · B · C" },
              { text: "" },
              { text: "── OR Plane (sum of products) ─────────────", color: "#818cf8" },
              { text: "F1 = P1 + P2 + P4   →  output 1", color: "#34d399" },
              { text: "F2 = P2 + P3 + P4   →  output 2", color: "#34d399" },
            ],
          },
        ],
      },
      {
        id: "comparison",
        kicker: "Comparison",
        title: "PLA vs PAL vs ROM",
        body: ["Each programmable logic device has different trade-offs between flexibility and simplicity."],
        table: {
          headers: ["Device", "AND Plane", "OR Plane", "Flexibility", "Complexity"],
          rows: [
            ["ROM", "Fixed (full decoder)", "Programmable", "Low", "Simple"],
            ["PAL", "Programmable", "Fixed", "Medium", "Medium"],
            ["PLA", "Programmable", "Programmable", "High", "High"],
            ["GAL", "Programmable", "Fixed (EE)", "Medium", "Reusable"],
            ["FPGA", "LUTs", "LUTs", "Highest", "Modern"],
          ],
          colColors: [null, "#38bdf8", "#818cf8", "#34d399", "#fb923c"],
        },
      },
      {
        id: "breakdown",
        kicker: "Details",
        title: "Device Breakdown",
        body: [
          {
            type: "steps",
            items: [
              "ROM — Fixed AND plane (full decoder for all minterms), programmable OR plane. Implements any function but uses all minterms.",
              "PLA — Both AND and OR planes are programmable. Most flexible but requires complex programming and has propagation delays.",
              "PAL — Programmable AND plane, fixed OR plane. Simpler than PLA, widely used in older designs.",
              "GAL (Generic Array Logic) — Electrically erasable PAL variant; reusable and reprogrammable in-circuit.",
              "FPGA — Modern replacement with lookup tables (LUTs), flip-flops, and routing fabric; reconfigurable after deployment.",
            ],
          },
        ],
        quiz: {
          questions: [
            { q: "What are the two planes in a PLA?", opts: ["AND plane and OR plane", "NOR plane and NAND plane", "XOR plane and XNOR plane", "Input plane and Output plane"], ans: 0, explain: "A PLA has a programmable AND plane (product terms) and a programmable OR plane (sum of products)." },
            { q: "What does PLA stand for?", opts: ["Programmable Logic Array", "Parallel Logic Architecture", "Programmable Lookup Array", "Parallel Lookup Architecture"], ans: 0, explain: "PLA stands for Programmable Logic Array." },
            { q: "How does a PAL differ from a PLA?", opts: ["PAL has a programmable AND plane and fixed OR plane", "PAL has a fixed AND plane and programmable OR plane", "PAL has no OR plane", "PAL is not programmable"], ans: 0, explain: "A PAL (Programmable Array Logic) has a programmable AND plane but a fixed OR plane, making it simpler than a PLA." },
            { q: "What technology replaced simple PLAs in modern design?", opts: ["Vacuum tubes", "FPGAs", "Relays", "Analog circuits"], ans: 1, explain: "FPGAs (Field-Programmable Gate Arrays) have largely replaced simple PLAs for complex programmable logic." },
          ],
        },
      },
    ],
  },

  "random-access-memory": {
    preview: { summary: "RAM is volatile read-write memory used for temporary storage of data and programs currently in use. Any memory location can be accessed in equal time — that's the 'random' in RAM." },
    sections: [
      {
        id: "concept",
        kicker: "Concept",
        title: "RAM Characteristics",
        body: [
          "RAM allows both read and write operations. It is volatile, meaning data is lost when power is removed. The 'random access' property means access time is independent of address.",
          {
            type: "cards",
            items: [
              { icon: "⚡", title: "Volatile", text: "Data is lost when power is removed" },
              { icon: "✏️", title: "Read/Write", text: "Supports both read and write operations" },
              { icon: "⏱️", title: "Equal Access Time", text: "Any address accessed in the same amount of time" },
            ],
          },
        ],
      },
      {
        id: "interface",
        kicker: "Interface",
        title: "RAM Pin Signals",
        body: [
          "A typical RAM chip has address lines, bidirectional data lines, and control signals for chip selection and operation direction.",
          { type: "chip", label: "RAM IC", pins: ["A[n-1:0]  Address", "CS         Chip Sel", "WE         Write En", "OE         Output En"], dataPins: ["D[m-1:0]  Data I/O"] },
        ],
        table: {
          headers: ["Signal", "Direction", "Description"],
          rows: [
            ["A[n-1:0]", "→ Input", "Address lines — select memory location"],
            ["D[m-1:0]", "↔ Bidir", "Data lines — input (write) or output (read)"],
            ["CS̄ (Chip Select)", "→ Input", "Active-low: enables the chip when asserted"],
            ["WE̅ (Write Enable)", "→ Input", "High = Read mode, Low = Write mode"],
            ["OE̅ (Output Enable)", "→ Input", "Enables data output buffer during read"],
          ],
          colColors: ["#34d399", "#38bdf8", null],
        },
      },
      {
        id: "operations",
        kicker: "Operations",
        title: "Read and Write Cycles",
        body: [
          "RAM performs two fundamental operations. Timing is critical — signals must be stable for the required access and cycle times.",
          {
            type: "cards",
            items: [
              { title: "Read Cycle Sequence", text: "1. Assert CS̄  2. Set address A[n-1:0]  3. WE̅ = HIGH (read)  4. Assert OE̅  5. Wait tACC  6. Valid data on D[m-1:0]" },
              { title: "Write Cycle Sequence", text: "1. Assert CS̄  2. Set address A[n-1:0]  3. Place data on D[m-1:0]  4. WE̅ = LOW (write)  5. Hold for tWP  6. Deassert WE̅ → data latched" },
            ],
          },
        ],
      },
      {
        id: "timing",
        kicker: "Timing",
        title: "Key Timing Parameters",
        body: [
          {
            type: "steps",
            items: [
              "Access Time (tACC) — Delay from address presented to valid data output. A key RAM performance metric (e.g., 10 ns for SRAM).",
              "Cycle Time (tRC/tWC) — Minimum time between two consecutive read or write operations. Always ≥ access time.",
              "Setup Time — How long data/address must be stable before the write strobe edge.",
              "Hold Time — How long data/address must remain stable after the write strobe edge.",
              "Output Enable Time (tOE) — Delay from OE̅ assertion to valid data appearing on the data bus.",
            ],
          },
        ],
        quiz: {
          questions: [
            { q: "What makes RAM 'random access'?", opts: ["It stores random data", "Any location can be accessed in the same time regardless of address", "It randomly selects memory locations", "It can only be read randomly"], ans: 1, explain: "Random access means any memory location can be accessed in equal time, unlike sequential access (e.g., tape)." },
            { q: "Which signal controls whether RAM performs a read or write?", opts: ["Address line", "Data line", "Read/Write (R/W) line", "Chip Select line"], ans: 2, explain: "The Read/Write (R/W) control line determines the operation: R/W=1 for read, R/W=0 for write (typically)." },
            { q: "What is the purpose of the Chip Select (CS) signal?", opts: ["To select which data bit to read", "To enable or disable the RAM chip", "To set the clock speed", "To reset the memory"], ans: 1, explain: "Chip Select enables the RAM chip. When CS is inactive, the chip ignores all inputs and outputs are tri-stated." },
            { q: "A RAM chip has 10 address lines and 8 data lines. What is its capacity?", opts: ["10 bytes", "1024 bits", "8192 bits (1K × 8 = 8 Kbits)", "80 bits"], ans: 2, explain: "10 address lines → 2¹⁰ = 1024 locations. 8 data lines → 8 bits each. Total = 1024 × 8 = 8192 bits = 8 Kbits." },
          ],
        },
      },
    ],
  },

  "static-dynamic-ram": {
    preview: { summary: "RAM comes in two major forms: SRAM uses flip-flops for fast, stable storage while DRAM uses capacitors for dense, low-cost storage that requires periodic refresh cycles." },
    sections: [
      {
        id: "sram",
        kicker: "SRAM",
        title: "Static RAM — The Fast One",
        body: [
          "SRAM stores each bit using a flip-flop (typically 6 transistors). Data is held as long as power is present — no refresh needed. Faster but less dense.",
          {
            type: "cards",
            items: [
              { icon: "🔄", title: "Cell", text: "6-transistor cross-coupled inverter pair" },
              { icon: "⚡", title: "Speed", text: "Very fast: 1–10 ns access time" },
              { icon: "🧠", title: "Use", text: "CPU L1/L2/L3 cache memory" },
            ],
          },
          {
            type: "code",
            lines: [
              { text: "Store 1:  Q = HIGH,  Q̄ = LOW   (M1,M2 cross-coupled)", color: "#38bdf8" },
              { text: "Store 0:  Q = LOW,   Q̄ = HIGH  (stable in either state)", color: "#38bdf8" },
              { text: "" },
              { text: "Read:    Assert wordline → bitlines carry Q and Q̄", color: "#34d399" },
              { text: "Write:   Drive bitlines → stronger signal overrides cell", color: "#34d399" },
              { text: "No refresh needed — state held by cross-coupling ✓" },
            ],
          },
        ],
      },
      {
        id: "dram",
        kicker: "DRAM",
        title: "Dynamic RAM — The Dense One",
        body: [
          "DRAM stores each bit as charge on a tiny capacitor (1 transistor + 1 capacitor per cell). Charge leaks, so memory must be refreshed periodically. Denser and cheaper.",
          {
            type: "cards",
            items: [
              { icon: "⚡", title: "Cell", text: "1 transistor + 1 capacitor (1T1C)" },
              { icon: "🔃", title: "Refresh", text: "Required every 4–64 ms to prevent data loss" },
              { icon: "💾", title: "Use", text: "Main memory (RAM DIMMs in your PC)" },
            ],
          },
        ],
      },
      {
        id: "comparison",
        kicker: "Comparison",
        title: "SRAM vs DRAM — Side by Side",
        body: ["Key differences that determine which type of RAM is chosen for a given application."],
        table: {
          headers: ["Property", "SRAM", "DRAM"],
          rows: [
            ["Storage element", "Flip-flop (6T)", "Capacitor (1T1C)"],
            ["Refresh needed", "No", "Yes (~4–64 ms)"],
            ["Speed", "Fast (1–10 ns)", "Slower (50–70 ns)"],
            ["Cell density", "Lower (large cell)", "Higher (tiny cell)"],
            ["Power", "Higher (active static)", "Lower (standby)"],
            ["Cost per bit", "Higher", "Lower"],
            ["Typical use", "CPU Cache (L1/L2/L3)", "Main memory (DIMMs)"],
          ],
          colColors: [null, "#38bdf8", "#818cf8"],
        },
      },
      {
        id: "refresh",
        kicker: "DRAM Refresh",
        title: "How DRAM Refresh Works",
        body: [
          "The memory controller must continuously refresh DRAM rows to prevent data loss due to capacitor leakage.",
          {
            type: "steps",
            items: [
              "Memory controller maintains a refresh counter pointing to the current row to refresh.",
              "Every ~15.6 µs, the controller issues a RAS-only cycle (CAS-before-RAS or auto-refresh command).",
              "The selected row's capacitors are read and rewritten with their full charge level.",
              "After all rows are refreshed, the counter wraps around and the cycle repeats continuously.",
              "During refresh cycles, normal read/write requests are stalled — this is the refresh overhead (~1–5% of bandwidth).",
              "Modern DRAM modules (DDR4/DDR5) use auto-refresh commands managed by the memory controller automatically.",
            ],
          },
        ],
        quiz: {
          questions: [
            { q: "What storage element does SRAM use?", opts: ["Capacitor", "Flip-flop", "Resistor", "Inductor"], ans: 1, explain: "SRAM uses flip-flops (bistable latches) to store each bit, which hold state as long as power is applied." },
            { q: "Why does DRAM need periodic refreshing?", opts: ["To increase speed", "Because capacitors leak charge over time", "To reduce power", "Because flip-flops reset automatically"], ans: 1, explain: "DRAM stores bits as charge on capacitors. Capacitors leak, so data must be refreshed every few milliseconds." },
            { q: "Which is faster — SRAM or DRAM?", opts: ["DRAM", "SRAM", "They are the same speed", "Depends on the address"], ans: 1, explain: "SRAM is faster because flip-flops respond immediately; DRAM requires refresh cycles and has slower access." },
            { q: "Which type of RAM is typically used for CPU cache?", opts: ["DRAM", "SRAM", "Flash RAM", "Virtual RAM"], ans: 1, explain: "SRAM is used for CPU cache because of its speed, despite being more expensive and less dense than DRAM." },
          ],
        },
      },
    ],
  },

  "array-of-ram-ics": {
    preview: { summary: "Large memory systems are built by combining multiple RAM chips in arrays. Two expansion techniques — word length and address capacity — let you build any memory size from standard chips." },
    sections: [
      {
        id: "why",
        kicker: "Why Combine?",
        title: "Building Larger Memories",
        body: [
          "Individual RAM ICs have fixed word lengths and capacities. Arrays of chips allow designers to build memory systems of any required size from standard off-the-shelf parts.",
          {
            type: "cards",
            items: [
              { icon: "↔️", title: "Word Length Expansion", text: "Increase data width (e.g., 4-bit → 8-bit)" },
              { icon: "↕️", title: "Address Expansion", text: "Increase number of locations (e.g., 1K → 4K)" },
              { icon: "🔀", title: "Combined Expansion", text: "Expand both dimensions simultaneously" },
            ],
          },
        ],
      },
      {
        id: "word-expansion",
        kicker: "Technique 1",
        title: "Word Length (Bit) Expansion",
        body: [
          "To increase word width, place chips in parallel — all chips share the same address and control lines, but each chip contributes a different set of data bits to the output word.",
          {
            type: "chip",
            label: "Example: Two 1K×4 chips → 1K×8 memory",
            pins: ["Chip 1 (1K×4): A[9:0] shared, CS shared, WE shared"],
            dataPins: ["Chip 1 drives D[3:0]", "Chip 2 drives D[7:4]"],
          },
          {
            type: "code",
            lines: [
              { text: "Shared:  Address A[9:0], CS, WE  → both chips" },
              { text: "Chip 1 drives → D[3:0]  (lower nibble)", color: "#38bdf8" },
              { text: "Chip 2 drives → D[7:4]  (upper nibble)", color: "#818cf8" },
              { text: "Result:  1K × 8 = 8 Kbits total  ✓", color: "#34d399" },
            ],
          },
        ],
      },
      {
        id: "addr-expansion",
        kicker: "Technique 2",
        title: "Address (Word Count) Expansion",
        body: [
          "To increase the number of addressable locations, use a decoder to select different chips for different address ranges. Only one chip is active at a time.",
          {
            type: "code",
            lines: [
              { text: "High bits A[11:10] → 2-to-4 Decoder" },
              { text: "" },
              { text: "Y0 → CS Chip 0  (addresses 0x000 – 0x3FF)", color: "#38bdf8" },
              { text: "Y1 → CS Chip 1  (addresses 0x400 – 0x7FF)", color: "#38bdf8" },
              { text: "Y2 → CS Chip 2  (addresses 0x800 – 0xBFF)", color: "#38bdf8" },
              { text: "Y3 → CS Chip 3  (addresses 0xC00 – 0xFFF)", color: "#38bdf8" },
              { text: "" },
              { text: "Low bits A[9:0] → all 4 chips (internal row select)", color: "#34d399" },
              { text: "Only the decoded chip is enabled at any time  ✓", color: "#34d399" },
              { text: "Result:  4K × 8 memory  ✓", color: "#fb923c" },
            ],
          },
        ],
      },
      {
        id: "summary",
        kicker: "Quick Reference",
        title: "Expansion Summary Table",
        table: {
          headers: ["Expansion Type", "How?", "Address Lines?", "Decoder?", "Data Bus?"],
          rows: [
            ["Word Length (Bit)", "Chips in parallel", "Shared — same", "No", "Wider (more bits)"],
            ["Address (Word Count)", "Decoder selects chip", "Split — high/low", "Yes", "Same width"],
            ["Both", "Combine both techniques", "Split — high/low", "Yes", "Wider"],
          ],
          colColors: [null, "#38bdf8", "#818cf8", "#fb923c", "#34d399"],
        },
      },
      {
        id: "design-steps",
        kicker: "Design Steps",
        title: "How to Design a RAM Array",
        body: [
          {
            type: "steps",
            items: [
              "Determine required total capacity: total locations × word size (e.g., 8K × 16).",
              "Choose available RAM chip size (e.g., 2K × 8).",
              "Calculate chips needed for word length expansion: required bits ÷ chip data bits (16 ÷ 8 = 2).",
              "Calculate chips needed for address expansion: required locations ÷ chip locations (8K ÷ 2K = 4 banks).",
              "Total chips = word expansion × address expansion (2 × 4 = 8 chips).",
              "Design a decoder with log₂(address expansion banks) inputs to drive the CS lines.",
              "Connect low-order address bits to all chips; feed high-order bits to the decoder.",
            ],
          },
        ],
        quiz: {
          questions: [
            { q: "To expand word length (bit width), how do you connect RAM chips?", opts: ["In series (cascade address lines)", "In parallel (chips side-by-side sharing address lines)", "Use a decoder on data lines", "Increase the clock frequency"], ans: 1, explain: "Word length expansion connects chips in parallel with shared address/control lines, each contributing additional data bits." },
            { q: "To expand the number of addressable words (capacity), what is used?", opts: ["More data lines", "A decoder to drive different chip enable signals", "Larger capacitors", "Fewer address lines"], ans: 1, explain: "Address capacity expansion uses a decoder to activate different chip select (CS) lines for different address ranges." },
            { q: "Four 1K×8 RAM chips combined give a total capacity of:", opts: ["1K×8", "4K×8", "1K×32", "4K×32"], ans: 1, explain: "4 chips of 1K×8 in word-count expansion (using 2 address bits as chip select) gives 4K×8." },
            { q: "What signal is typically used to select which chip in an array is active?", opts: ["WE (Write Enable)", "OE (Output Enable)", "CS (Chip Select)", "VCC (Power)"], ans: 2, explain: "The Chip Select (CS) signal activates a specific RAM chip in an array, driven by the decoder output." },
          ],
        },
      },
    ],
  },

  "memory-construction-ram": {
    preview: { summary: "Real memory systems are designed by systematically arranging RAM ICs to meet a required capacity and word width. This brings together chip arrays, decoders, and shared buses." },
    sections: [
      {
        id: "overview",
        kicker: "Overview",
        title: "System Memory Design Process",
        body: [
          "Constructing a memory system from RAM ICs requires deciding on the number of chips, their arrangement into banks, and how addressing and control signals are distributed.",
          {
            type: "cards",
            items: [
              { icon: "📐", title: "Step 1", text: "Determine total capacity (words × bits)" },
              { icon: "🔢", title: "Step 2", text: "Choose chip size, calculate chips per bank" },
              { icon: "🎛️", title: "Step 3", text: "Design address decoder for bank selection" },
              { icon: "🔌", title: "Step 4", text: "Wire address, data, and control buses" },
            ],
          },
        ],
      },
      {
        id: "worked-example",
        kicker: "Worked Example",
        title: "Design a 16K×8 Memory from 4K×4 Chips",
        body: [
          "Step-by-step construction of a complete 16K×8 memory system.",
          {
            type: "code",
            lines: [
              { text: "Required capacity:  16K × 8", color: "#38bdf8" },
              { text: "Chip size:          4K  × 4", color: "#818cf8" },
              { text: "" },
              { text: "Word (bit) expansion:   8 ÷ 4   =  2 chips per bank", color: "#34d399" },
              { text: "Address expansion:   16K ÷ 4K  =  4 banks", color: "#34d399" },
              { text: "Total chips:           2 × 4   =  8 chips  ✓", color: "#fb923c" },
              { text: "" },
              { text: "Decoder:  2-to-4  (inputs: A[13:12])" },
              { text: "Row addr: A[11:0] → all chips in active bank" },
            ],
          },
        ],
        table: {
          caption: "Bank Layout",
          headers: ["Bank", "Address Range", "CS Signal", "Chips"],
          rows: [
            ["Bank 0", "0x0000 – 0x0FFF", "Y0", "Chip0A (D[3:0]) + Chip0B (D[7:4])"],
            ["Bank 1", "0x1000 – 0x1FFF", "Y1", "Chip1A (D[3:0]) + Chip1B (D[7:4])"],
            ["Bank 2", "0x2000 – 0x2FFF", "Y2", "Chip2A (D[3:0]) + Chip2B (D[7:4])"],
            ["Bank 3", "0x3000 – 0x3FFF", "Y3", "Chip3A (D[3:0]) + Chip3B (D[7:4])"],
          ],
          colColors: ["#38bdf8", null, "#818cf8", "#34d399"],
        },
      },
      {
        id: "bus",
        kicker: "Bus Architecture",
        title: "Shared Bus Connections",
        body: [
          "All chips in a memory system share common buses for address, data, and control signals. Careful bus design prevents contention.",
          {
            type: "code",
            lines: [
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
            ],
          },
        ],
      },
      {
        id: "safety",
        kicker: "Safety",
        title: "Preventing Bus Contention",
        body: [
          "Bus contention occurs when two chips simultaneously try to drive the data bus. It can damage chips and corrupt data.",
          {
            type: "steps",
            items: [
              "Only one CS̄ output from the decoder can be active at any given time — guaranteed by decoder design.",
              "Inactive chips' data outputs float to high-impedance (tri-state) when CS̄ is deasserted.",
              "Tri-state buffers on each chip's data output allow safe sharing of the common data bus.",
              "The decoder must assert new CS̄ only after previous CS̄ is deasserted (no overlapping enables).",
              "Bus contention prevention: use open-collector or tri-state drivers, never totem-pole on shared lines.",
            ],
          },
        ],
      },
      {
        id: "formula",
        kicker: "Practice",
        title: "General Design Formula",
        body: [
          {
            type: "code",
            lines: [
              { text: "Given:  Required = W_total × B_total" },
              { text: "        Chip     = W_chip   × B_chip" },
              { text: "" },
              { text: "Chips per bank  = B_total / B_chip   (bit expansion)", color: "#38bdf8" },
              { text: "Banks needed    = W_total / W_chip   (address expansion)", color: "#818cf8" },
              { text: "Total chips     = (B_total/B_chip) × (W_total/W_chip)", color: "#34d399" },
              { text: "Decoder size    = log₂(Banks needed)-to-Banks needed", color: "#fb923c" },
            ],
          },
        ],
        quiz: {
          questions: [
            { q: "A system needs 8K×16 memory. You have 2K×8 chips. How many chips are needed?", opts: ["4", "8", "16", "2"], ans: 2, explain: "Word expansion: 16÷8 = 2 chips per bank. Address expansion: 8K÷2K = 4 banks. Total = 2×4 = 16 chips." },
            { q: "In memory system design, what does 'bank' refer to?", opts: ["A financial institution storing memory", "A group of chips sharing the same address range (same CS)", "A single memory chip", "The address decoder"], ans: 1, explain: "A memory bank is a group of chips that are accessed simultaneously, all selected by the same chip select signal." },
            { q: "What is the role of the address decoder in a memory system?", opts: ["To decode binary data into decimal", "To select which bank is active based on high-order address bits", "To convert addresses to ASCII", "To increase the clock speed"], ans: 1, explain: "The address decoder takes high-order address bits and asserts the CS signal for the appropriate memory bank." },
            { q: "Bus contention occurs when:", opts: ["Too many address lines are used", "Two chips drive the data bus simultaneously", "The clock is too fast", "The decoder has too many outputs"], ans: 1, explain: "Bus contention happens when two chips try to drive the shared data bus simultaneously. Only one CS should be active at a time, keeping other chips in tri-state (high-Z)." },
          ],
        },
      },
    ],
  },
};

export function getDldTopicContent(slug) {
  return dldTopicContent[slug];
}

export default dldTopicContent;
