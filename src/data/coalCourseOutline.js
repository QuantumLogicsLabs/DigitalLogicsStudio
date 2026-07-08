/**
 * COAL — Computer Organization & Assembly Language
 * Complete course outline (beginner → advanced).
 *
 * Sources aligned with:
 * - FAST-style COAL course outlines (2018–2024)
 * - Academic-Time-Machine COAL repo (assignments, mids, finals)
 * - COAL textbook in Dls-AI-Chatbot/data/
 *
 * Use `slug` values for routes, mentor topics, and content linking later.
 */

const COAL_LEVELS = ["beginner", "intermediate", "advanced"];

const coalCourseMeta = {
  id: "coal",
  title: "Computer Organization & Assembly Language",
  shortTitle: "COAL",
  eyebrow: "Full Stack Track",
  description:
    "A structured path from computer fundamentals and number systems through registers, memory, x86 assembly, I/O, and modern processor architecture.",
  accent: "#8b5cf6",
  estimatedWeeks: 14,
  prerequisite: "Basic digital logic awareness (DLD foundation recommended)",
  dataSources: [
    {
      label: "COAL textbook",
      location: "Dls-AI-Chatbot/data/",
      type: "book",
    },
    {
      label: "Academic-Time-Machine COAL",
      url: "https://github.com/saleha-muzammil/Academic-Time-Machine/tree/main/COAL",
      type: "repo",
    },
  ],
};

const coalCourseParts = [
  {
    id: "part-1",
    part: 1,
    title: "Foundations",
    level: "beginner",
    duration: "2 weeks",
    summary:
      "Build the vocabulary of computer organization, data representation, and the bridge from digital logic to machine-level thinking.",
    modules: [
      {
        id: "intro-co",
        slug: "intro-computer-organization",
        title: "Introduction to Computer Organization",
        duration: "3 days",
        outcomes: [
          "Explain organization vs architecture vs ISA",
          "Describe the Von Neumann stored-program model",
          "Identify CPU, memory, I/O, and bus roles",
        ],
        lessons: [
          "What is COAL and why assembly matters",
          "Computer vs calculator: stored programs",
          "Hardware–software interface overview",
          "Course roadmap and study strategy",
        ],
        practice: { quizzes: true, assignments: [] },
      },
      {
        id: "number-systems",
        slug: "number-systems-representation",
        title: "Number Systems & Data Representation",
        duration: "4 days",
        outcomes: [
          "Convert between binary, decimal, octal, and hexadecimal",
          "Apply 1's and 2's complement for signed integers",
          "Represent floating-point numbers at a conceptual level",
        ],
        lessons: [
          "Positional number systems",
          "Binary arithmetic and overflow",
          "Signed vs unsigned representation",
          "BCD, ASCII, and character encoding basics",
          "Floating-point (IEEE-754 overview)",
        ],
        practice: { quizzes: true, assignments: ["Assignment 1 — number conversion"] },
        dldLink: "/number-systems/calculator",
      },
      {
        id: "logic-bridge",
        slug: "digital-logic-bridge",
        title: "Digital Logic Bridge (for CO)",
        duration: "3 days",
        outcomes: [
          "Relate gates and combinational blocks to ALU design",
          "Understand how flip-flops enable sequential machines",
          "Connect DLD concepts to register and memory behavior",
        ],
        lessons: [
          "Logic gates and truth tables (review)",
          "Adders, multiplexers, decoders in CPU context",
          "Latches, flip-flops, and clocked storage",
          "From logic circuits to register files",
        ],
        practice: { quizzes: true, assignments: [] },
        dldLink: "/boolean/overview",
      },
    ],
  },
  {
    id: "part-2",
    part: 2,
    title: "Machine Model & Instruction Cycle",
    level: "beginner",
    duration: "1.5 weeks",
    summary:
      "Understand how a processor fetches, decodes, and executes instructions, and how memory is organized at the system level.",
    modules: [
      {
        id: "cpu-components",
        slug: "cpu-components",
        title: "CPU Components & Register Model",
        duration: "3 days",
        outcomes: [
          "Name ALU, control unit, PC, IR, and general-purpose registers",
          "Explain register vs memory trade-offs",
          "Trace a simple value through the datapath",
        ],
        lessons: [
          "ALU and control unit responsibilities",
          "Program counter and instruction register",
          "General-purpose vs special-purpose registers",
          "Register file concept and temporary storage",
        ],
        practice: { quizzes: true, mids: ["Mid 1 — CPU basics"] },
      },
      {
        id: "instruction-cycle",
        slug: "instruction-cycle",
        title: "Instruction Cycle & Execution Flow",
        duration: "3 days",
        outcomes: [
          "Describe fetch–decode–execute–writeback",
          "Explain how PC advances through a program",
          "Relate machine steps to assembly line-by-line execution",
        ],
        lessons: [
          "Classic instruction cycle stages",
          "Micro-operations inside each stage",
          "Clock cycles and throughput intuition",
          "Tracing a short program by hand",
        ],
        practice: { quizzes: true, demos: ["Fetch → Decode → Execute visual"] },
      },
      {
        id: "memory-hierarchy",
        slug: "memory-hierarchy",
        title: "Memory Organization & Hierarchy",
        duration: "4 days",
        outcomes: [
          "Compare registers, cache, RAM, and secondary storage",
          "Explain addressable memory and byte/word addressing",
          "Introduce stack and heap at a high level",
        ],
        lessons: [
          "Main memory layout and address spaces",
          "Cache basics and locality",
          "Stack growth and procedure frames (preview)",
          "Endianness and alignment (intro)",
        ],
        practice: { assignments: ["Assignment 1 — memory addressing"] },
      },
    ],
  },
  {
    id: "part-3",
    part: 3,
    title: "ISA & Addressing",
    level: "intermediate",
    duration: "2 weeks",
    summary:
      "Learn the instruction set contract, addressing modes, and how operands are specified before writing full programs.",
    modules: [
      {
        id: "isa-overview",
        slug: "instruction-set-architecture",
        title: "Instruction Set Architecture (ISA)",
        duration: "3 days",
        outcomes: [
          "Classify instructions: data transfer, arithmetic, logic, control",
          "Read assembly syntax: operands, labels, comments",
          "Compare assembly mnemonics to machine-level intent",
        ],
        lessons: [
          "What an ISA defines",
          "Instruction formats and operand fields",
          "Assembly language vs machine language",
          "First program structure: .data, .code, main",
        ],
        practice: { quizzes: true, assignments: ["Assignment 1 — syntax basics"] },
      },
      {
        id: "addressing-modes",
        slug: "addressing-modes",
        title: "Addressing Modes",
        duration: "4 days",
        outcomes: [
          "Use immediate, register, direct, and indirect addressing",
          "Apply indexed and base-indexed modes",
          "Choose the correct mode for arrays and structures",
        ],
        lessons: [
          "Immediate and register addressing",
          "Direct and indirect memory addressing",
          "Indexed, base-indexed, and scaled indexing",
          "Effective address calculation examples",
        ],
        practice: { mids: ["Mid 1 — addressing modes"], assignments: ["Assignment 2"] },
      },
      {
        id: "flags-register",
        slug: "flags-and-status",
        title: "Flags Register & Comparisons",
        duration: "3 days",
        outcomes: [
          "Explain ZF, CF, OF, SF after arithmetic and logic",
          "Use CMP and TEST to set flags for decisions",
          "Predict branch outcomes from flag states",
        ],
        lessons: [
          "Status flags and condition codes",
          "CMP vs SUB for comparisons",
          "Signed vs unsigned branch conditions",
          "Flag-setting worked examples",
        ],
        practice: { quizzes: true },
      },
    ],
  },
  {
    id: "part-4",
    part: 4,
    title: "Assembly Programming",
    level: "intermediate",
    duration: "3 weeks",
    summary:
      "Write real assembly programs: data movement, arithmetic, control flow, procedures, arrays, and strings.",
    modules: [
      {
        id: "data-movement",
        slug: "coal-syntax",
        title: "Data Movement & Basic Instructions",
        duration: "4 days",
        outcomes: [
          "Use MOV, LEA, XCHG for data transfer",
          "Apply arithmetic: ADD, SUB, INC, DEC, MUL, DIV",
          "Apply logic: AND, OR, XOR, NOT",
        ],
        lessons: [
          "COAL / MASM syntax conventions",
          "Labels, comments, and readable layout",
          "MOV and memory operand rules",
          "Arithmetic and logic instruction set",
          "Shift and rotate instructions",
        ],
        practice: {
          assignments: ["Assignment 1 (A/D)", "Assignment 2"],
          demoCode: "MOV AX, 5\nMOV BX, 10\nADD AX, BX",
        },
      },
      {
        id: "control-flow",
        slug: "control-flow",
        title: "Control Flow: Branches & Loops",
        duration: "4 days",
        outcomes: [
          "Implement if-else with conditional jumps",
          "Build counted and sentinel loops",
          "Use LOOP and compare-and-branch patterns",
        ],
        lessons: [
          "Unconditional jumps (JMP)",
          "Conditional jumps (JE, JNE, JG, JL, …)",
          "If-else and loop translation patterns",
          "Switch/case via jump tables (intro)",
        ],
        practice: {
          mids: ["Mid 2 — control flow"],
          demoCode: "CMP AX, BX\nJE equal_label\nJNE continue",
        },
      },
      {
        id: "registers-memory",
        slug: "registers-memory",
        title: "Registers, Memory & Operand Rules",
        duration: "3 days",
        outcomes: [
          "Map x86 16/32-bit register sets (AX–DX, EAX–EDX, etc.)",
          "Load and store with correct operand sizes",
          "Avoid invalid operand combinations",
        ],
        lessons: [
          "16-bit vs 32-bit register views",
          "BYTE, WORD, DWORD operand sizing",
          "Memory indirect access [BX], [EBP+n]",
          "Common operand restriction pitfalls",
        ],
        practice: { demoCode: "MOV EAX, [EBX]\nADD EAX, 4" },
      },
      {
        id: "procedures-stack",
        slug: "procedures-stack",
        title: "Procedures, Stack & Subroutines",
        duration: "5 days",
        outcomes: [
          "Use PUSH, POP, CALL, RET correctly",
          "Pass parameters on the stack",
          "Implement recursion with stack frames",
        ],
        lessons: [
          "Runtime stack model",
          "CALL/RET and return addresses",
          "Local variables and frame pointers",
          "Recursion trace examples",
          "PROC / ENDP and procedure conventions",
        ],
        practice: {
          assignments: ["Assignment 3"],
          mids: ["Mid 2 — procedures"],
          demoCode: "CALL compute\nRET",
        },
      },
      {
        id: "arrays-strings",
        slug: "arrays-strings",
        title: "Arrays, Strings & Advanced Instructions",
        duration: "4 days",
        outcomes: [
          "Traverse arrays with indexed addressing",
          "Use string instructions (MOVS, CMPS, SCAS, LODS, STOS)",
          "Write sorting and search routines in assembly",
        ],
        lessons: [
          "Array indexing and stride",
          "Null-terminated strings",
          "String instruction family and direction flag",
          "Bubble sort / linear search in COAL",
          "Number conversion routines (bin ↔ hex)",
        ],
        practice: { assignments: ["Assignment 3 (A/D)"], finals: true },
      },
    ],
  },
  {
    id: "part-5",
    part: 5,
    title: "x86 Architecture & Program Structure",
    level: "advanced",
    duration: "2 weeks",
    summary:
      "Go deeper into Intel IA-32: modes, segmentation, directives, macros, and how assemblers build executables.",
    modules: [
      {
        id: "ia32-architecture",
        slug: "ia32-architecture",
        title: "Intel IA-32 Architecture",
        duration: "5 days",
        outcomes: [
          "Describe GPRs, segment registers, and EIP/ESP/EBP roles",
          "Contrast real, protected, and virtual-8086 modes",
          "Explain segmentation and paging at an introductory level",
        ],
        lessons: [
          "IA-32 register set and execution environment",
          "Real mode vs protected mode",
          "Segmentation: segment, offset, descriptor basics",
          "Paging and privilege rings (overview)",
          "Instruction encoding: opcode, ModR/M, SIB, displacement",
        ],
        practice: { mids: ["Mid 2 — IA-32"], finals: true },
      },
      {
        id: "directives-macros",
        slug: "directives-macros",
        title: "Directives, Macros & Program Layout",
        duration: "4 days",
        outcomes: [
          "Organize programs with .DATA, .CODE, .STACK",
          "Define constants, variables, and procedures",
          "Write reusable macros with parameters",
        ],
        lessons: [
          "Assembler directives vs instructions",
          "DB, DW, DD, EQU, OFFSET, PTR",
          "Macro definition and expansion",
          "Conditional assembly (intro)",
          "Build pipeline: assemble → link → execute",
        ],
        practice: {
          assignments: ["Assignment 2 — macros"],
          demoCode: ".data\nvalue DB 10\n.code\nmain PROC",
        },
      },
      {
        id: "hw-sw-interface",
        slug: "hw-sw-interface",
        title: "Hardware–Software Interface",
        duration: "3 days",
        outcomes: [
          "Trace high-level code to assembly to machine code",
          "Relate variables to memory and functions to stack frames",
          "Understand compiler, assembler, linker, loader roles",
        ],
        lessons: [
          "Translation chain: HLL → ASM → object → executable",
          "How control structures become branches",
          "Calling conventions and ABI basics",
          "Why hardware constraints shape software",
        ],
        practice: { projects: true },
      },
    ],
  },
  {
    id: "part-6",
    part: 6,
    title: "I/O, Interrupts & System Design",
    level: "advanced",
    duration: "1.5 weeks",
    summary:
      "Connect the CPU to the outside world through I/O techniques, interrupts, buses, and storage interfaces.",
    modules: [
      {
        id: "io-interrupts",
        slug: "io-interrupts",
        title: "I/O Methods & Interrupts",
        duration: "4 days",
        outcomes: [
          "Compare programmed I/O, interrupt-driven I/O, and DMA",
          "Explain interrupt vectors and ISRs",
          "Handle simple device polling and keyboard input patterns",
        ],
        lessons: [
          "I/O mapped vs memory-mapped I/O",
          "Hardware and software interrupts",
          "IVT / IDT and interrupt service routines",
          "Interrupt priority and nesting (intro)",
        ],
        practice: {
          demoCode: "IN AL, 60h\nCMP AL, 0x01\nJE handle_key",
          finals: true,
        },
      },
      {
        id: "buses-storage",
        slug: "buses-storage",
        title: "Buses, Storage & RAID (Overview)",
        duration: "2 days",
        outcomes: [
          "Describe data, address, and control buses",
          "Compare HDD vs SSD at organization level",
          "Explain RAID levels conceptually",
        ],
        lessons: [
          "System bus structure",
          "Secondary storage organization",
          "RAID 0, 1, 5 trade-offs",
        ],
        practice: { quizzes: true },
      },
    ],
  },
  {
    id: "part-7",
    part: 7,
    title: "Architecture Comparison & Performance",
    level: "advanced",
    duration: "2 weeks",
    summary:
      "Compare processor families, study pipelining and hazards, and build intuition for modern performance techniques.",
    modules: [
      {
        id: "processor-families",
        slug: "processor-families",
        title: "Processor Families & ISA Comparison",
        duration: "4 days",
        outcomes: [
          "Contrast CISC (x86) and RISC (ARM, MIPS, RISC-V)",
          "Summarize x86 evolution: 16 → 32 → 64-bit",
          "Explain why ARM dominates embedded/mobile ecosystems",
        ],
        lessons: [
          "CISC vs RISC design philosophies",
          "x86 / AMD64 lineage",
          "ARM, MIPS, PowerPC, RISC-V snapshots",
          "Licensing and ecosystem considerations",
        ],
        practice: { finals: true, projects: true },
      },
      {
        id: "pipelining",
        slug: "pipelining",
        title: "Pipelining & Computer Architecture",
        duration: "5 days",
        outcomes: [
          "Model a 5-stage pipeline (IF, ID, EX, MEM, WB)",
          "Identify structural, data, and control hazards",
          "Describe forwarding, stalls, and branch prediction (intro)",
        ],
        lessons: [
          "Why pipelining improves throughput",
          "Classic five-stage pipeline walkthrough",
          "Hazard types and mitigation strategies",
          "Superscalar and out-of-order execution (overview)",
          "CPI, MIPS, and performance metrics",
        ],
        practice: {
          finals: true,
          demoCode: "IF ID EX MEM WB\n; overlapping instruction stages",
        },
      },
      {
        id: "computer-organization",
        slug: "computer-organization",
        title: "Capstone: Organization in Practice",
        duration: "3 days",
        outcomes: [
          "Integrate ISA, assembly, memory, I/O, and pipeline concepts",
          "Analyze a complete program end-to-end",
          "Prepare for finals and practical projects",
        ],
        lessons: [
          "End-to-end trace: source → execution → I/O",
          "Exam-style mixed topic revision",
          "Project ideation: assembler helper, interrupt demo, sort routine",
        ],
        practice: {
          finals: true,
          projects: true,
          repoRefs: ["Finals", "Projects", "Quizzes"],
        },
      },
    ],
  },
];

/** Flat list for mentor topic dropdowns and RAG metadata */
const coalTopicSlugs = coalCourseParts.flatMap((part) =>
  part.modules.map((m) => ({
    value: m.slug,
    label: m.title,
    part: part.part,
    level: part.level,
    summary: m.outcomes?.[0] || part.summary,
  })),
);

/** Exam / practice alignment from Academic-Time-Machine */
const coalAssessmentMap = {
  assignments: [
    { id: 1, focus: "Number systems, syntax, basic MOV/ADD", modules: ["number-systems", "isa-overview", "data-movement"] },
    { id: 2, focus: "Addressing modes, macros, control flow", modules: ["addressing-modes", "control-flow", "directives-macros"] },
    { id: 3, focus: "Procedures, arrays, strings, advanced routines", modules: ["procedures-stack", "arrays-strings"] },
  ],
  mid1: {
    focus: "Organization basics, number systems, registers, introductory assembly",
    modules: ["intro-co", "number-systems", "cpu-components", "instruction-cycle", "isa-overview", "addressing-modes"],
  },
  mid2: {
    focus: "Control flow, procedures, IA-32, directives, I/O intro",
    modules: ["control-flow", "procedures-stack", "ia32-architecture", "directives-macros", "io-interrupts"],
  },
  final: {
    focus: "Full course integration including pipelining and architecture comparison",
    modules: coalCourseParts.flatMap((p) => p.modules.map((m) => m.id)),
  },
};

/** Suggested weekly study plan */
const coalStudyPlan = [
  { week: 1, parts: [1], focus: "Organization intro + number systems" },
  { week: 2, parts: [1, 2], focus: "Logic bridge + CPU / instruction cycle" },
  { week: 3, parts: [2, 3], focus: "Memory hierarchy + ISA & addressing" },
  { week: 4, parts: [3], focus: "Flags + Assignment 1" },
  { week: 5, parts: [4], focus: "Data movement + arithmetic" },
  { week: 6, parts: [4], focus: "Control flow + Mid 1 revision" },
  { week: 7, parts: [4], focus: "Registers/memory rules + procedures" },
  { week: 8, parts: [4], focus: "Arrays/strings + Assignment 3" },
  { week: 9, parts: [5], focus: "IA-32 architecture" },
  { week: 10, parts: [5], focus: "Directives, macros, HW/SW interface" },
  { week: 11, parts: [6], focus: "I/O and interrupts + Mid 2 revision" },
  { week: 12, parts: [7], focus: "Processor families" },
  { week: 13, parts: [7], focus: "Pipelining and hazards" },
  { week: 14, parts: [7], focus: "Capstone review + finals prep" },
];

export {
  COAL_LEVELS,
  coalCourseMeta,
  coalCourseParts,
  coalTopicSlugs,
  coalAssessmentMap,
  coalStudyPlan,
};

export default coalCourseParts;
