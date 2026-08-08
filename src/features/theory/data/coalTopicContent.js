/**
 * Rich lesson content for COAL course modules.
 * Preview = short summary when accordion opens.
 * sections = full content revealed via "Explore full topic" button.
 */

const coalTopicContent = {
  "intro-computer-organization": {
    slug: "intro-computer-organization",
    level: "Beginner",
    duration: "3 days",
    preview: {
      summary:
        "Before writing assembly, you need a mental picture of how a computer is built and how software talks to hardware. This module introduces that picture in plain language.",
      highlights: [
        "Organization vs architecture vs ISA — three layers students often mix up",
        "The Von Neumann idea: program and data live in the same memory",
        "CPU, memory, I/O, and buses — what each part does in real machines",
      ],
    },
    sections: [
      {
        id: "what-is-coal",
        title: "What is COAL?",
        body: [
          "COAL stands for Computer Organization and Assembly Language. It sits between digital logic (gates and circuits) and high-level programming (Python, Java, C++).",
          "Organization explains how hardware is arranged. Assembly language is the human-readable form of machine instructions the CPU understands.",
        ],
        realLife: {
          title: "Real-life connection",
          text: "When you tap Like on a social app, your phone runs millions of machine instructions. COAL teaches you to read and write those instructions at the lowest practical level — like understanding how a car engine works before only driving automatic.",
        },
      },
      {
        id: "three-layers",
        title: "Organization vs Architecture vs ISA",
        body: [
          "These three terms appear in every COAL textbook. Think of them as zoom levels on the same machine.",
        ],
        table: {
          caption: "Three layers of a computer (simple view)",
          headers: ["Term", "What it means", "Everyday analogy"],
          rows: [
            [
              "Computer Organization",
              "How components are built and connected (ALU, buses, memory chips)",
              "How rooms and wiring are laid out in a house",
            ],
            [
              "Computer Architecture",
              "What the machine exposes to software (registers, instruction types)",
              "The floor plan a resident actually uses",
            ],
            [
              "ISA (Instruction Set)",
              "The exact vocabulary of instructions (MOV, ADD, JMP…)",
              "The language manual for that house's appliances",
            ],
          ],
        },
      },
      {
        id: "von-neumann",
        title: "The Von Neumann Model",
        body: [
          "Most computers today follow the Von Neumann stored-program model: both instructions and data are stored in memory. The CPU fetches instructions one after another and executes them.",
        ],
        diagram: "von-neumann",
        realLife: {
          title: "Real-life connection",
          text: "A recipe app stores recipes (data) and the steps to display them (instructions) in the same phone memory. The CPU reads each step, performs it, then moves to the next — exactly like executing a program.",
        },
      },
      {
        id: "main-components",
        title: "Main Hardware Components",
        body: ["Every desktop, laptop, and microcontroller contains the same core building blocks."],
        table: {
          caption: "Core components and their jobs",
          headers: ["Component", "Job", "Real-world example"],
          rows: [
            ["CPU", "Executes instructions, performs arithmetic and logic", "The chef in a kitchen"],
            ["Memory (RAM)", "Stores programs and data while power is on", "The countertop workspace"],
            ["I/O devices", "Keyboard, screen, disk, network — talk to the outside world", "Waiters bringing orders in and plates out"],
            ["System bus", "Shared wires moving addresses, data, and control signals", "The hallway connecting kitchen, pantry, and dining room"],
          ],
        },
        diagram: "system-bus",
      },
      {
        id: "why-assembly",
        title: "Why Learn Assembly?",
        body: [
          "High-level languages hide hardware details. Assembly removes that hiding — useful for debugging, embedded systems, security research, and understanding performance.",
        ],
        table: {
          caption: "Where COAL knowledge helps",
          headers: ["Field", "Why assembly matters"],
          rows: [
            ["Embedded / IoT", "Microcontrollers often have no Python runtime — you write assembly or C close to metal"],
            ["Cybersecurity", "Exploits target memory layout, stack, and CPU flags"],
            ["Game / graphics engines", "Hot loops are tuned knowing cache and registers"],
            ["Compilers", "Understanding how `if` and `for` become jumps and compares"],
          ],
        },
      },
    ],
    keyTakeaways: [
      "Organization = hardware structure; Architecture = programmer's view; ISA = instruction vocabulary.",
      "Von Neumann machines store programs and data in the same memory.",
      "CPU + memory + I/O + bus is the mental model for every module that follows.",
    ],
  },

  "instruction-set-architecture": {
    slug: "instruction-set-architecture",
    level: "Beginner",
    duration: "3 days",
    preview: {
      summary:
        "The ISA is the CPU's instruction vocabulary. This topic shows how instructions are grouped, why they matter, and how software talks to hardware through clear command patterns.",
      highlights: [
        "Instruction categories: data transfer, arithmetic, logic, and control",
        "How ISA acts as the hardware-software contract",
        "Why assembly instructions are more than just syntax",
      ],
    },
    sections: [
      {
        id: "isa-definition",
        title: "Instruction Set Architecture (ISA)",
        body: [
          "Think of the ISA as the vocabulary or contract between hardware and software. It defines exactly what commands the processor can understand and execute.",
          { type: "subheading", text: "Instruction categories" },
          {
            type: "list",
            items: [
              "Data Transfer: moves data from one place to another without changing the value itself.",
              "Arithmetic: performs operations such as ADD, SUB, MUL, and DIV.",
              "Logic: performs bitwise operations such as AND, OR, XOR, and NOT.",
              "Control: changes the flow of execution using jumps and branches.",
            ],
          },
          "A simple example is MOV AX, BX, which copies data from one register to another. The instruction itself tells the CPU both the operation and the operands.",
        ],
        diagram: "isa-overview",
        realLife: {
          title: "Real-life connection",
          text: "An ISA is like the language rules of a kitchen. If the cook knows the allowed commands, the kitchen can follow a recipe precisely. Without that shared vocabulary, software and hardware cannot cooperate.",
        },
      },
      {
        id: "isa-importance",
        title: "Why this matters in COAL",
        body: [
          "Assembly is not just memorizing mnemonics. It is learning how the CPU interprets instructions at the machine level, one command at a time.",
          "When you understand the ISA, you can read a small program and predict what the processor will do before you even run it.",
        ],
        table: {
          caption: "Instruction categories at a glance",
          headers: ["Category", "Goal", "Example"],
          rows: [
            ["Data transfer", "Move data between registers, memory, and I/O", "MOV AX, BX"],
            ["Arithmetic", "Perform math", "ADD AX, 5"],
            ["Logic", "Manipulate bits", "AND AX, 0x0F"],
            ["Control", "Change program flow", "JE target"],
          ],
        },
      },
    ],
    keyTakeaways: [
      "The ISA is the CPU's instruction vocabulary.",
      "Instructions are grouped by purpose: data movement, arithmetic, logic, and control.",
      "Learning the ISA helps you read and reason about assembly programs more clearly.",
    ],
  },

  "addressing-modes": {
    slug: "addressing-modes",
    level: "Beginner",
    duration: "4 days",
    preview: {
      summary:
        "Addressing modes tell the CPU where to find the operands for an instruction. This topic explains the four foundational modes and shows how they change the way a processor accesses data.",
      highlights: [
        "Immediate, register, direct, and indirect modes",
        "How the operand location changes execution behavior",
        "Why memory access depends on the addressing mode",
      ],
    },
    sections: [
      {
        id: "addressing-overview",
        title: "Addressing Modes",
        body: [
          "If an instruction tells the CPU what to do, the addressing mode tells the CPU where the data is located. In other words, the mode defines how the operand is found.",
          { type: "subheading", text: "The four fundamental modes" },
          {
            type: "list",
            items: [
              "Immediate addressing: the data is written directly into the instruction.",
              "Register addressing: the data already lives in a register.",
              "Direct addressing: the instruction contains the exact memory address.",
              "Indirect addressing: a register holds the address, and the CPU follows it.",
            ],
          },
        ],
        diagram: "addressing-modes",
        realLife: {
          title: "Real-life connection",
          text: "A delivery driver can pick up a package either by reading a label directly, using a known address, or following a note that points to another location. Addressing modes work the same way for the CPU.",
        },
      },
      {
        id: "addressing-examples",
        title: "How each mode looks in assembly",
        body: [
          "Immediate addressing is fast to read because the value is embedded in the instruction itself.",
          "Register addressing is usually the fastest because the CPU works with its own internal storage.",
          "Direct and indirect addressing are more memory-focused because the processor must go to RAM to fetch the operand.",
        ],
        table: {
          caption: "Common addressing modes and examples",
          headers: ["Mode", "Meaning", "Example"],
          rows: [
            ["Immediate", "Use the literal value in the instruction", "MOV AX, 5"],
            ["Register", "Use a register as the source or destination", "MOV AX, BX"],
            ["Direct", "Use the memory address written in the instruction", "MOV AX, [1000]"],
            ["Indirect", "Use the address stored in a register", "MOV AX, [BX]"],
          ],
        },
      },
    ],
    keyTakeaways: [
      "Addressing modes describe where operands are found.",
      "Immediate and register modes are direct; direct and indirect modes involve memory.",
      "Choosing the correct mode is essential for reading and writing efficient assembly code.",
    ],
  },

  "flags-and-status": {
    slug: "flags-and-status",
    level: "Beginner",
    duration: "3 days",
    preview: {
      summary:
        "The flags register is a compact status dashboard for the CPU. After arithmetic and logic instructions, it reports whether the result was zero, negative, carried, or overflowed.",
      highlights: [
        "ZF, CF, SF, and OF explain the result of an operation",
        "Flags are used for comparisons and conditional branches",
        "The flags register is one of the most important ideas in assembly logic",
      ],
    },
    sections: [
      {
        id: "flags-intro",
        title: "Flags Register & Comparisons",
        body: [
          "When the CPU performs an arithmetic or logic operation, it needs a way to report the status of the result. It does this using the flags register, which is basically a dashboard of bits.",
          "Each flag turns on or off depending on what happened in the last operation.",
          { type: "subheading", text: "Common flags" },
          {
            type: "list",
            items: [
              "ZF (Zero Flag): set when the result is exactly zero.",
              "CF (Carry Flag): set when an unsigned carry or borrow occurs.",
              "SF (Sign Flag): set when the result is negative.",
              "OF (Overflow Flag): set when signed overflow occurs.",
            ],
          },
        ],
        diagram: "flags-register",
        component: "alu-flags-simulator",
        realLife: {
          title: "Real-life connection",
          text: "A dashboard in a car does not show every detail of the engine, but it shows the important signals: fuel level, temperature, and warnings. The flags register does the same job for the CPU.",
        },
      },
      {
        id: "flags-usage",
        title: "Why flags matter for branches",
        body: [
          "Flags are especially important in comparisons. After a compare or subtraction, the CPU can decide whether to jump, stop, or continue based on the flag values.",
          { type: "code", code: "CMP AX, BX\nJE equal_label\nJNE continue" },
          "This pattern is one of the most common ways assembly programs make decisions.",
        ],
        table: {
          caption: "What each flag tells you",
          headers: ["Flag", "Meaning", "Typical use"],
          rows: [
            ["ZF", "Result was zero", "Check equality"],
            ["CF", "Carry or borrow happened", "Unsigned arithmetic checks"],
            ["SF", "Result is negative", "Signed comparisons"],
            ["OF", "Signed overflow occurred", "Detect overflow in signed math"],
          ],
        },
      },
    ],
    keyTakeaways: [
      "The flags register reports status after arithmetic and logic operations.",
      "ZF, CF, SF, and OF are the most common condition flags.",
      "Flags are the bridge between computation and conditional branching in assembly.",
    ],
  },

  "procedures-stack": {
    slug: "procedures-stack",
    level: "Intermediate",
    duration: "3 days",
    preview: {
      summary:
        "Moving from the theoretical concepts of Part 3 into Part 4 means you are finally writing the core logic of your programs. This lesson connects the ideas of registers, memory, and the runtime stack to the way assembly programs actually execute functions and data movement.",
      highlights: [
        "Registers and memory are the CPU's working containers",
        "MOV, PUSH, and POP show how data moves through the machine",
        "The stack is a LIFO structure that supports procedures and temporary storage",
      ],
    },
    sections: [
      {
        id: "assembly-programming-intro",
        title: "Assembly Programming: From Concepts to Core Logic",
        body: [
          "Moving from the theoretical concepts of Part 3 into Part 4 means you are finally writing the core logic of your programs. Since you are already used to building out functions and logic flow in modern environments like JavaScript and Node.js, thinking of Assembly in those terms can make it much easier to digest.",
          "In higher-level languages, the compiler handles memory mapping and call stacks for you. In Assembly, you are the compiler. Here is the beginner-friendly breakdown of how these concepts map to the hardware.",
          { type: "subheading", text: "1. Registers, Memory & Operand Rules" },
          "Before moving data, you need to know what containers you have. Registers are the CPU's ultra-fast internal variables. In the x86 architecture, registers are sliceable, meaning you can access parts of a 32-bit register if you only need 16 or 8 bits of data.",
          {
            type: "list",
            items: [
              "32-bit registers (Extended): EAX, EBX, ECX, EDX.",
              "16-bit registers (Base): AX, BX, CX, DX (These are just the lower halves of the 'E' registers).",
              "8-bit registers (High/Low): AX is split into AH and AL.",
            ],
          },
          { type: "subheading", text: "2. Data Movement & Basic Instructions" },
          "This is how you assign values to your hardware variables.",
          {
            type: "list",
            items: [
              "MOV (Move): The assignment operator. MOV AX, 5 puts 5 into AX.",
              "LEA (Load Effective Address): Gets the address of a memory location rather than the value stored there.",
              "XCHG (Exchange): Swaps the values of two registers instantly.",
            ],
          },
          { type: "subheading", text: "3. Control Flow: Branches & Loops" },
          "Assembly does not have if, else, or while blocks. Instead, you compare two values and then jump to a different memory address based on the result.",
          {
            type: "list",
            items: [
              "CMP (Compare): Subtracts the second operand from the first to set status flags.",
              "Conditional jumps: JE, JNE, JG route execution to a label in your code.",
              "LOOP: Automatically decrements CX and jumps while CX is not zero.",
            ],
          },
          { type: "subheading", text: "4. Procedures, Stack & Subroutines" },
          "When you write a function, the CPU needs to remember where it was before jumping into that function and store temporary local values. It uses the stack, a LIFO memory structure.",
          {
            type: "list",
            items: [
              "PUSH: Places a value onto the top of the stack.",
              "POP: Removes the top value and places it into a register.",
              "CALL: Pushes the return address and jumps to a procedure.",
              "RET: Pops the return address and resumes the caller.",
            ],
          },
          { type: "subheading", text: "5. Arrays, Strings & Advanced Instructions" },
          "Arrays in assembly are contiguous blocks of memory. To traverse them, you use indexed addressing, where the base address is combined with an index to find each element.",
        ],
        component: "assembly-stack-simulator",
        realLife: {
          title: "Real-life connection",
          text: "Think of the stack like a tray stack in a kitchen: the last plate placed on top is the first one taken off. The CPU uses the same idea to manage temporary work and function calls.",
        },
      },
    ],
    keyTakeaways: [
      "Assembly programs combine registers, memory, and branch logic to express real computation.",
      "MOV, PUSH, and POP are simple but powerful building blocks for understanding execution flow.",
      "The stack is a core concept for procedures, recursion, and temporary state.",
    ],
  },

  "coal-syntax": {
    slug: "coal-syntax",
    level: "Intermediate",
    duration: "3 days",
    preview: {
      summary:
        "Assembly programs begin with data movement and the basic arithmetic and logic instructions that make every computation possible. This lesson shows how MOV, ADD, SUB, and related instructions translate the ideas of variables and operations into processor actions.",
      highlights: [
        "MOV copies values between registers and memory",
        "Arithmetic and logic instructions operate directly on CPU registers",
        "Instruction syntax becomes easier when you think in terms of data flow",
      ],
    },
    sections: [
      {
        id: "basic-instructions",
        title: "Data Movement & Basic Instructions",
        body: [
          "At the beginning of an assembly program, you are usually moving data into the right place and preparing it for computation. This is why instructions such as MOV, LEA, and XCHG are foundational.",
          "A MOV instruction is the closest thing to assignment in a high-level language. It copies a value from one operand to another, while LEA gives you the address of a location instead of its contents. XCHG lets you swap values without a temporary variable.",
          { type: "subheading", text: "Core instruction families" },
          {
            type: "list",
            items: [
              "MOV: copy data from one location to another",
              "LEA: load an effective address for pointer-like work",
              "XCHG: swap two values directly",
              "ADD, SUB, INC, DEC: perform arithmetic on registers or memory",
              "AND, OR, XOR, NOT: apply bitwise logic",
            ],
          },
          "In practice, an assembly programmer thinks about the CPU as a set of working containers. The instruction tells the hardware which container should receive which value.",
        ],
        code: {
          code: "MOV AX, 5\nMOV BX, 10\nADD AX, BX",
        },
        table: {
          caption: "Common basic instructions",
          headers: ["Instruction", "Purpose", "Typical use"],
          rows: [
            ["MOV", "Copy data", "Assign a value to a register"],
            ["ADD", "Add numbers", "Accumulate totals"],
            ["SUB", "Subtract", "Compute differences"],
            ["AND", "Bitwise AND", "Mask bits"],
            ["OR", "Bitwise OR", "Set bits"],
          ],
        },
      },
    ],
    keyTakeaways: [
      "Basic instructions define how data enters, leaves, and changes inside the CPU.",
      "MOV is the assembly equivalent of assignment.",
      "Arithmetic and logic instructions turn stored values into meaningful results.",
    ],
  },

  "control-flow": {
    slug: "control-flow",
    level: "Intermediate",
    duration: "3 days",
    preview: {
      summary:
        "Once you can move and compute values, the next step is deciding what should happen next. Assembly uses comparisons and jumps to implement decisions, branches, and loops in a very explicit way.",
      highlights: [
        "CMP sets the condition flags for decisions",
        "Conditional jumps route execution to labels",
        "Loops are built with counters and repeated jumps",
      ],
    },
    sections: [
      {
        id: "branches-and-loops",
        title: "Control Flow: Branches & Loops",
        body: [
          "High-level languages provide if, else, while, and for blocks. Assembly provides a lower-level mechanism: compare values, inspect the flags, and jump to a target instruction.",
          "The compare instruction is crucial because it does not store a result in the same way as ADD or SUB. Instead, it updates the flags so the CPU can make a branch decision.",
          { type: "subheading", text: "Jumping with intent" },
          {
            type: "list",
            items: [
              "JE / JNE: jump when values are equal or not equal",
              "JG / JL: jump based on signed greater-than or less-than comparisons",
              "JMP: unconditionally branch to a new label",
              "LOOP: decrement CX and repeat while it is not zero",
            ],
          },
          "This style of programming is more explicit than modern languages, but it is also very powerful because it teaches you how control structures are implemented at the machine level.",
        ],
        code: {
          code: "CMP AX, BX\nJE equal_label\nJNE continue",
        },
        table: {
          caption: "Common branch patterns",
          headers: ["Instruction", "Meaning", "Typical use"],
          rows: [
            ["JMP", "Unconditional jump", "Skip to another block"],
            ["JE", "Jump if equal", "Check equality"],
            ["JNE", "Jump if not equal", "Handle mismatch"],
            ["JG", "Jump if greater", "Signed greater-than logic"],
          ],
        },
      },
    ],
    keyTakeaways: [
      "Assembly control flow is built from comparisons and jumps.",
      "Branches are explicit, predictable, and closely tied to the flags register.",
      "Loops are implemented with counters and conditional jumps.",
    ],
  },

  "registers-memory": {
    slug: "registers-memory",
    level: "Intermediate",
    duration: "3 days",
    preview: {
      summary:
        "Registers and memory are the two main places where assembly programs store and manipulate data. Understanding the difference between them is essential for writing correct code and choosing the right operands.",
      highlights: [
        "x86 registers come in 8-bit, 16-bit, and 32-bit views",
        "Operand sizes matter for correctness",
        "Memory addressing requires careful interpretation of effective addresses",
      ],
    },
    sections: [
      {
        id: "registers-and-memory",
        title: "Registers, Memory & Operand Rules",
        body: [
          "Assembly is strict about operand sizes. A register may be viewed as AX, EAX, or AL depending on the context, and the instruction must match the size of the data you expect to move or compute.",
          "The CPU has a small set of ultra-fast internal registers for active work, while memory holds larger amounts of data and instructions. When an instruction uses memory, it needs an address, and that address can be immediate, register-based, or computed with an index.",
          { type: "subheading", text: "Register views and sizing" },
          {
            type: "list",
            items: [
              "AX, BX, CX, DX are the 16-bit base registers",
              "EAX, EBX, ECX, EDX are the 32-bit extended versions",
              "AH, AL, BH, BL are the high and low 8-bit parts of the 16-bit registers",
              "BYTE, WORD, and DWORD tell the assembler how to interpret the operand size",
            ],
          },
          "Incorrect operand sizes are one of the most common beginner mistakes in assembly, because the CPU cannot silently reinterpret data in a way that would make the instruction meaningful.",
        ],
        code: {
          code: "MOV EAX, [EBX]\nADD EAX, 4",
        },
        table: {
          caption: "Register size views",
          headers: ["Register", "16-bit view", "32-bit view", "8-bit parts"],
          rows: [
            ["Accumulator", "AX", "EAX", "AH / AL"],
            ["Base", "BX", "EBX", "BH / BL"],
            ["Counter", "CX", "ECX", "CH / CL"],
          ],
        },
      },
    ],
    keyTakeaways: [
      "Registers are fast working space; memory is larger but slower storage.",
      "Operand size must be consistent with the instruction and data type.",
      "Addressing modes determine how the CPU finds the right memory location.",
    ],
  },

  "arrays-strings": {
    slug: "arrays-strings",
    level: "Intermediate",
    duration: "3 days",
    preview: {
      summary:
        "Real programs often work with collections of values and character data. Assembly handles these through indexed addressing, memory layout, and string-oriented instructions that operate on contiguous blocks of data.",
      highlights: [
        "Arrays are contiguous memory blocks",
        "Indexed addressing walks through elements efficiently",
        "String instructions move and compare character data directly",
      ],
    },
    sections: [
      {
        id: "arrays-and-strings",
        title: "Arrays, Strings & Advanced Instructions",
        body: [
          "An array in assembly is simply a sequence of values stored in adjacent memory locations. If you know the starting address and the size of each element, you can calculate the location of any item using an index.",
          "This is why indexed addressing is so important in assembly. It lets the CPU traverse arrays and structures without having to write out every address manually.",
          { type: "subheading", text: "Working with strings" },
          {
            type: "list",
            items: [
              "String instructions process character sequences in memory",
              "MOVS copies bytes or words from one location to another",
              "CMPS compares two strings element by element",
              "SCAS searches for a character or value",
            ],
          },
          "Once you understand arrays and strings in assembly, many higher-level data structures become easier to understand because you can see the memory pattern behind them.",
        ],
        code: {
          code: "MOV BX, OFFSET array\nMOV SI, 2\nMOV AX, [BX + SI]",
        },
        table: {
          caption: "Arrays and strings in assembly",
          headers: ["Concept", "Assembly idea", "Why it matters"],
          rows: [
            ["Array", "Contiguous memory block", "Stores many values together"],
            ["Index", "Offset from base address", "Locates individual elements"],
            ["String", "Sequential bytes in memory", "Supports text processing"],
          ],
        },
      },
    ],
    keyTakeaways: [
      "Arrays are memory blocks with predictable offsets.",
      "Indexed addressing makes traversal explicit and efficient.",
      "String instructions show how character data is handled at the machine level.",
    ],
  },

  "number-systems-representation": {
    slug: "number-systems-representation",
    level: "Beginner",
    duration: "4 days",
    preview: {
      summary:
        "Computers only understand 0 and 1. Every number, character, and pixel you see is stored as bit patterns. This module shows how to read and convert those patterns.",
      highlights: [
        "Binary, decimal, octal, and hexadecimal — when to use each",
        "Signed integers with 1's and 2's complement",
        "How letters and symbols become ASCII codes",
      ],
    },
    sections: [
      {
        id: "why-binary",
        title: "Why Binary?",
        body: [
          "Electronic circuits are reliable at two stable states: on (1) and off (0). Binary is base-2 — each digit is a bit (binary digit).",
          "A byte is 8 bits and can represent 256 different values (0–255 unsigned).",
        ],
        realLife: {
          title: "Real-life connection",
          text: "A light switch has two positions — not five. Engineers chose binary because transistors behave like billions of tiny switches. Your Wi-Fi password, file size, and CPU register values are all bit patterns underneath.",
        },
        diagram: "binary-byte",
      },
      {
        id: "positional-bases",
        title: "Positional Number Systems",
        body: [
          "In any base B, each digit position has a weight Bⁿ. COAL uses decimal (everyday), binary (machine), octal (legacy), and hexadecimal (compact binary shorthand).",
        ],
        table: {
          caption: "Same value (13₁₀) in different bases",
          headers: ["Base", "Name", "Representation", "Common use in COAL"],
          rows: [
            ["10", "Decimal", "13", "Human-readable numbers in comments and debugging"],
            ["2", "Binary", "1101", "True form inside registers and memory"],
            ["8", "Octal", "15", "Older Unix file permissions (e.g. chmod 755)"],
            ["16", "Hexadecimal", "D", "Memory dumps, addresses, color codes (#FF5733)"],
          ],
        },
        realLife: {
          title: "Real-life connection",
          text: "Web designers use hex for colors: #FF0000 is pure red — FF = 255 red, 00 green, 00 blue. Each pair is one byte in hex, easier to read than 111111110000000000000000.",
        },
      },
      {
        id: "conversion-quick",
        title: "Quick Conversion Reference",
        body: [
          "Decimal → binary: repeated division by 2, collect remainders bottom-up. Binary → hex: group bits in fours from the right.",
        ],
        table: {
          caption: "Handy conversion cheat sheet",
          headers: ["Decimal", "Binary", "Hex"],
          rows: [
            ["0", "0000", "0"],
            ["5", "0101", "5"],
            ["10", "1010", "A"],
            ["15", "1111", "F"],
            ["16", "1 0000", "10"],
            ["255", "1111 1111", "FF"],
          ],
        },
        diagram: "dec-to-bin",
      },
      {
        id: "signed-numbers",
        title: "Signed Numbers: 1's and 2's Complement",
        body: [
          "Unsigned bytes store 0–255. Signed bytes store roughly −128 to +127 using 2's complement — the standard for integer math in assembly.",
          "To get 2's complement: invert bits, then add 1. The leftmost bit indicates sign (0 = positive, 1 = negative).",
        ],
        table: {
          caption: "8-bit signed examples (2's complement)",
          headers: ["Decimal", "Binary", "Note"],
          rows: [
            ["+5", "0000 0101", "Positive — sign bit 0"],
            ["−1", "1111 1111", "All ones pattern"],
            ["−5", "1111 1011", "Invert +5, add 1"],
            ["−128", "1000 0000", "Smallest signed 8-bit value"],
          ],
        },
        realLife: {
          title: "Real-life connection",
          text: "Banking apps use signed integers for balances. If an program treats a negative balance as a huge positive number (unsigned mistake), you get overflow bugs — a classic COAL exam and interview topic.",
        },
      },
      {
        id: "ascii-bcd",
        title: "Characters: ASCII & BCD",
        body: [
          "ASCII maps characters to numbers. 'A' = 65, 'a' = 97, '0' = 48. BCD (Binary Coded Decimal) stores each decimal digit in 4 bits — used in calculators and legacy financial systems.",
        ],
        table: {
          caption: "Common ASCII codes (subset)",
          headers: ["Character", "Decimal", "Hex"],
          rows: [
            ["'0'", "48", "30"],
            ["'9'", "57", "39"],
            ["'A'", "65", "41"],
            ["'Z'", "90", "5A"],
            ["Space", "32", "20"],
            ["Newline", "10", "0A"],
          ],
        },
        realLife: {
          title: "Real-life connection",
          text: "When you press 'A' on a keyboard, the OS receives ASCII 65. Assembly string routines compare and move these numeric codes — not the letter shapes you see on screen.",
        },
      },
      {
        id: "floating-intro",
        title: "Floating-Point (Overview)",
        body: [
          "Real numbers (3.14, −0.5) use IEEE-754 format: sign bit + exponent + fraction. You will meet this in advanced COAL when handling scientific calculations.",
          "For now, remember: integers and characters have exact bit patterns; floats are approximations.",
        ],
        table: {
          caption: "Integer vs float storage (conceptual)",
          headers: ["Type", "Bits (typical)", "Example use"],
          rows: [
            ["8-bit unsigned", "8", "Pixel brightness 0–255"],
            ["32-bit signed int", "32", "Loop counters, array indexes"],
            ["32-bit float", "32", "Sensor readings, game physics"],
          ],
        },
      },
    ],
    keyTakeaways: [
      "Binary is the native language of hardware; hex is the shorthand engineers use daily.",
      "2's complement is how signed integers are stored and added in x86 assembly.",
      "Characters are just numbers (ASCII) — assembly works with those numbers directly.",
    ],
    relatedTool: {
      label: "Practice conversions interactively",
      to: "/number-systems/calculator",
    },
  },

  "digital-logic-bridge": {
    slug: "digital-logic-bridge",
    level: "Beginner",
    duration: "3 days",
    preview: {
      summary:
        "Before you study the CPU in depth, you need to see how tiny logic circuits become adders, storage, and the building blocks of a processor. This module bridges Digital Logic Design (DLD) to Computer Organization.",
      highlights: [
        "Logic gates are the atoms of every ALU and control circuit",
        "Adders and multiplexers route data inside the datapath",
        "Flip-flops turn combinational logic into registers and memory",
      ],
    },
    sections: [
      {
        id: "why-bridge",
        title: "Why Connect DLD to COAL?",
        body: [
          "In Digital Logic Design you drew gates on paper. In COAL you meet the same ideas inside a real CPU — just scaled to billions of transistors on one chip.",
          "Understanding gates, adders, and flip-flops answers questions like: How does ADD AX, BX actually work? Where does the result sit before it reaches a register?",
        ],
        realLife: {
          title: "Real-life connection",
          text: "A calculator's '+' button triggers the same half-adder logic you study in DLD. Your laptop's CPU runs the same pattern millions of times per second — just hidden inside the ALU.",
        },
      },
      {
        id: "logic-gates-review",
        title: "Logic Gates — Quick Review",
        body: [
          "A gate takes one or more binary inputs and produces an output according to a truth table. CPUs are built entirely from these primitives.",
          { type: "subheading", text: "Gates you must know" },
          {
            type: "list",
            items: [
              "AND — output 1 only when all inputs are 1 (used to mask/select bits).",
              "OR — output 1 when any input is 1 (combines enable lines).",
              "NOT — inverts a bit (turns 0 into 1 and vice versa).",
              "XOR — output 1 when inputs differ (core of addition and parity).",
            ],
          },
        ],
        diagram: "logic-gates-co",
        table: {
          caption: "Gate truth tables (2-input)",
          headers: ["A", "B", "AND", "OR", "XOR"],
          rows: [
            ["0", "0", "0", "0", "0"],
            ["0", "1", "0", "1", "1"],
            ["1", "0", "0", "1", "1"],
            ["1", "1", "1", "1", "0"],
          ],
        },
        realLife: {
          title: "Real-life connection",
          text: "When you AND a byte with 0x0F (00001111), you keep only the lower 4 bits — the same masking trick used in graphics, networking, and assembly bit tricks.",
        },
      },
      {
        id: "combinational-blocks",
        title: "Combinational Blocks in the CPU",
        body: [
          "Combinational circuits have no memory — output depends only on current inputs. The CPU uses them to compute results and route data.",
          { type: "subheading", text: "Key building blocks" },
          {
            type: "list",
            items: [
              "Half adder / full adder — adds binary digits and propagates carry (heart of the ALU).",
              "Multiplexer (MUX) — selects one of several inputs (picks which register feeds the ALU).",
              "Decoder — activates exactly one output line (used in memory addressing and control).",
            ],
          },
        ],
        diagram: "half-adder",
        table: {
          caption: "Combinational blocks and CPU roles",
          headers: ["Block", "What it does", "CPU role"],
          rows: [
            ["Half adder", "Adds 2 bits → sum + carry", "Lowest level of integer addition"],
            ["Full adder", "Adds 3 bits (includes carry-in)", "Chains into multi-bit adders"],
            ["Multiplexer", "Selects one input from many", "Routes register operands to ALU"],
            ["Decoder", "One-hot output from binary code", "Instruction decode, memory chip select"],
          ],
        },
        realLife: {
          title: "Real-life connection",
          text: "A traffic light controller uses decoders to turn one binary code into exactly one green/yellow/red output — the same one-hot idea used when the control unit activates one ALU operation.",
        },
      },
      {
        id: "sequential-storage",
        title: "Sequential Logic: Latches & Flip-Flops",
        body: [
          "Combinational logic alone cannot remember values. Sequential circuits add storage using a clock signal — the heartbeat of the CPU.",
          "A latch is level-sensitive (transparent while enabled). A flip-flop is edge-triggered (captures data only on a clock edge) — more reliable for synchronous design.",
          "One D flip-flop stores one bit. Eight flip-flops make one byte of register storage. Thousands of them form a register file.",
        ],
        diagram: "flip-flop",
        realLife: {
          title: "Real-life connection",
          text: "Think of a flip-flop like a camera shutter: the data (D) is only captured at the moment the clock (CLK) clicks — not continuously. That is how a 3 GHz CPU stays synchronized.",
        },
      },
      {
        id: "register-file",
        title: "From Circuits to Register Files",
        body: [
          "A register file is a small, ultra-fast bank of storage inside the CPU. General-purpose registers (AX, BX, CX, DX in x86) are implemented as arrays of flip-flops with MUX/DEMUX routing.",
          "Registers are orders of magnitude faster than RAM because they sit directly on the chip next to the ALU — no bus trip to external memory.",
        ],
        diagram: "register-file",
        table: {
          caption: "Storage speed comparison (typical desktop CPU)",
          headers: ["Storage", "Access time (order of)", "Capacity"],
          rows: [
            ["Register", "~1 CPU cycle (< 1 ns)", "Bytes to KB"],
            ["L1 cache", "~4 cycles", "32–64 KB per core"],
            ["RAM", "~100+ cycles", "GB"],
          ],
        },
        realLife: {
          title: "Real-life connection",
          text: "When a game loop runs hot, compilers keep loop counters in registers (ECX) instead of RAM — because hitting main memory every iteration would slow the game noticeably.",
        },
      },
      {
        id: "dld-to-coal",
        title: "Putting It Together: DLD → CPU",
        body: [
          "The path from DLD to COAL is direct: gates → adders → ALU; flip-flops → registers; decoders + MUX → control unit and datapath routing.",
          "Every assembly instruction you will write ultimately toggles these hardware blocks. MOV copies bits between flip-flop banks. ADD sends two register values through the adder chain.",
        ],
        diagram: "cpu-datapath",
        code: {
          code: "; Conceptual view — ADD AX, BX\n; 1. Control unit decodes ADD\n; 2. MUX routes AX and BX to ALU inputs\n; 3. Adder chain computes sum + flags\n; 4. Result written back to AX flip-flops",
        },
      },
    ],
    keyTakeaways: [
      "Logic gates (AND, OR, NOT, XOR) are the building blocks of every ALU and control circuit.",
      "Adders and multiplexers are combinational — they compute and route without memory.",
      "Flip-flops provide storage; register files are banks of flip-flops inside the CPU.",
      "DLD concepts directly explain how assembly instructions manipulate hardware.",
    ],
    relatedTool: {
      label: "Explore Boolean logic interactively",
      to: "/boolean/overview",
    },
  },

  "cpu-components": {
    slug: "cpu-components",
    level: "Beginner",
    duration: "3 days",
    preview: {
      summary:
        "The CPU is more than a single chip label — it contains an ALU, control unit, special registers, and a register file working together. This module names every major piece and shows how data moves through them.",
      highlights: [
        "ALU performs arithmetic and logic; control unit directs everything",
        "PC points to the next instruction; IR holds the current one",
        "Registers are fast on-chip storage — very different from RAM",
      ],
    },
    sections: [
      {
        id: "cpu-overview",
        title: "What Is Inside the CPU?",
        body: [
          "The Central Processing Unit (CPU) is the brain of the computer. It does not store your files long-term — it executes instructions, one after another, at incredible speed.",
          "Modern CPUs contain multiple cores (each a full processor), but the mental model starts with one core: ALU + control unit + registers + cache interfaces.",
        ],
        diagram: "cpu-datapath",
        realLife: {
          title: "Real-life connection",
          text: "When you open a browser tab, the OS schedules thousands of instructions per millisecond across CPU cores — each instruction passes through the same internal components you study here.",
        },
      },
      {
        id: "alu",
        title: "Arithmetic Logic Unit (ALU)",
        body: [
          "The ALU is the calculator inside the CPU. It performs integer addition, subtraction, bitwise AND/OR/XOR, comparisons, and shift operations.",
          "The ALU also sets status flags (Zero, Carry, Overflow, Sign) after operations — assembly branches read these flags to make decisions.",
        ],
        table: {
          caption: "ALU operations and assembly examples",
          headers: ["ALU operation", "Assembly mnemonic", "Example"],
          rows: [
            ["Add", "ADD", "ADD AX, 5"],
            ["Subtract", "SUB", "SUB BX, CX"],
            ["Bitwise AND", "AND", "AND AX, 0xFF"],
            ["Compare (subtract, keep flags)", "CMP", "CMP AX, BX"],
            ["Shift left", "SHL", "SHL AX, 1"],
          ],
        },
        realLife: {
          title: "Real-life connection",
          text: "Your phone's camera app applies filters by running millions of AND/SHL operations on pixel values — each one executed by the ALU in a fraction of a microsecond.",
        },
      },
      {
        id: "control-unit",
        title: "Control Unit",
        body: [
          "The control unit is the conductor of the orchestra. It reads the instruction in the IR, decodes the opcode, and sends control signals to the ALU, registers, and bus.",
          "It decides: which registers to read, which ALU operation to perform, whether to write a result back, and whether to jump to a new address.",
        ],
        table: {
          caption: "Control unit decisions per instruction type",
          headers: ["Instruction", "Control unit action"],
          rows: [
            ["MOV AX, BX", "Enable register file write; route BX → AX"],
            ["ADD AX, 5", "Route AX and immediate to ALU; ADD; write result to AX; update flags"],
            ["JMP label", "Load new address into PC instead of PC+size"],
            ["MOV AX, [BX]", "Put BX on address bus; read memory; write to AX"],
          ],
        },
        realLife: {
          title: "Real-life connection",
          text: "A factory assembly line robot follows a recipe (instruction). The control unit is the supervisor deciding which machine (ALU, memory, register) activates at each step.",
        },
      },
      {
        id: "pc-ir",
        title: "Program Counter & Instruction Register",
        body: [
          "The Program Counter (PC), called EIP in x86, holds the memory address of the next instruction to fetch. After each instruction, PC usually advances by the instruction's size.",
          "The Instruction Register (IR) holds the instruction currently being decoded and executed. Fetch loads IR; decode reads IR; execute acts on IR's opcode and operands.",
        ],
        table: {
          caption: "PC and IR during a 3-instruction program",
          headers: ["Step", "PC points to", "IR contains"],
          rows: [
            ["Start", "Address 1000", "(empty)"],
            ["After fetch #1", "1000", "MOV AX, 5"],
            ["After execute #1", "1003", "MOV AX, 5"],
            ["After fetch #2", "1003", "ADD AX, 3"],
          ],
        },
        realLife: {
          title: "Real-life connection",
          text: "PC is like a bookmark in a recipe book — it always shows which step comes next. A jump instruction is like skipping to a different page number.",
        },
      },
      {
        id: "registers",
        title: "General-Purpose vs Special-Purpose Registers",
        body: [
          "General-purpose registers (GPRs) hold data and addresses during computation — AX, BX, CX, DX in 16-bit x86; EAX, EBX, etc. in 32-bit.",
          "Special-purpose registers have fixed roles: PC/EIP (next instruction), IR (internal), stack pointer ESP, flags register (condition codes).",
        ],
        diagram: "register-file",
        table: {
          caption: "x86 registers and typical uses",
          headers: ["Register", "Type", "Common use"],
          rows: [
            ["EAX / AX", "General", "Accumulator, function return value, arithmetic"],
            ["EBX / BX", "General", "Base pointer for arrays and data blocks"],
            ["ECX / CX", "General", "Loop counter (LOOP instruction)"],
            ["EDX / DX", "General", "I/O ports, multiply/divide high bits"],
            ["EIP", "Special", "Instruction pointer — address of next instruction"],
            ["ESP", "Special", "Stack pointer — top of runtime stack"],
            ["EFLAGS", "Special", "Zero, Carry, Sign, Overflow flags"],
          ],
        },
        realLife: {
          title: "Real-life connection",
          text: "Registers are like the chef's hands — always within reach. RAM is the pantry across the room. Good programs keep working data in registers as long as possible.",
        },
      },
      {
        id: "datapath-trace",
        title: "Tracing a Value Through the Datapath",
        body: [
          "Follow ADD AX, BX step by step to see every component in action:",
          {
            type: "list",
            items: [
              "1. PC sends address to memory; instruction ADD AX, BX loaded into IR.",
              "2. Control unit decodes: operation = ADD, dest = AX, source = BX.",
              "3. Register file outputs current AX and BX values to ALU inputs.",
              "4. ALU adds them, sets flags (ZF if result is zero, etc.).",
              "5. Result written back to AX; PC advances to next instruction.",
            ],
          },
        ],
        code: {
          code: "; Before: AX = 10, BX = 25\nADD AX, BX\n; After:  AX = 35, CF = 0, ZF = 0\n; PC advanced by instruction length",
        },
        realLife: {
          title: "Real-life connection",
          text: "Debuggers show register values after each step because this trace is real — every breakpoint stops the CPU between these exact stages.",
        },
      },
    ],
    keyTakeaways: [
      "ALU computes; control unit coordinates; registers hold working data.",
      "PC (EIP) = next instruction address; IR = current instruction being executed.",
      "GPRs are flexible storage; special registers (ESP, EFLAGS) have fixed roles.",
      "Every assembly instruction is a sequence of control signals across these components.",
    ],
  },

  "instruction-cycle": {
    slug: "instruction-cycle",
    level: "Beginner",
    duration: "3 days",
    preview: {
      summary:
        "A program is not magic — the CPU repeats the same four-step loop for every single instruction: fetch, decode, execute, store. Understanding this loop is the key to reading assembly and predicting program behavior.",
      highlights: [
        "Fetch loads the instruction from memory into the IR",
        "Decode turns opcode bits into control signals",
        "Execute runs the ALU or data transfer; PC updates for the next round",
      ],
    },
    sections: [
      {
        id: "cycle-overview",
        title: "The Instruction Cycle",
        body: [
          "Also called the fetch–decode–execute cycle (sometimes with a separate writeback/store stage), this loop runs continuously while the CPU has power and a program to run.",
          "One full cycle usually takes multiple clock ticks. A 3 GHz CPU can complete billions of cycles per second.",
        ],
        diagram: "instruction-cycle",
        realLife: {
          title: "Real-life connection",
          text: "A washing machine repeats: fill → wash → rinse → spin. The CPU repeats: fetch → decode → execute → store. Both are fixed cycles driven by a clock.",
        },
      },
      {
        id: "fetch-stage",
        title: "Stage 1: Fetch",
        body: [
          "The CPU places the address in PC onto the address bus and reads the instruction bytes from memory.",
          "The fetched instruction is loaded into the Instruction Register (IR). PC is prepared to advance (actual update may happen at end of cycle).",
          { type: "subheading", text: "Micro-operations during fetch" },
          {
            type: "list",
            items: [
              "MAR ← PC (memory address register gets PC value)",
              "MDR ← Memory[MAR] (memory data register gets instruction bytes)",
              "IR ← MDR",
              "PC ← PC + instruction_size",
            ],
          },
        ],
        table: {
          caption: "Fetch example — 3-byte instruction at address 0x1000",
          headers: ["Micro-op", "Value after step"],
          rows: [
            ["MAR ← PC", "0x1000"],
            ["MDR ← Mem[0x1000]", "B8 05 00 (MOV AX, 5 in machine code)"],
            ["IR ← MDR", "Instruction stored in IR"],
            ["PC ← PC + 3", "0x1003 (ready for next fetch)"],
          ],
        },
      },
      {
        id: "decode-stage",
        title: "Stage 2: Decode",
        body: [
          "The control unit examines the opcode field in the IR and generates control signals: which ALU operation, which registers to read/write, whether memory is accessed.",
          "Operand fields tell the control unit where data lives — register number, immediate value, or memory address.",
        ],
        realLife: {
          title: "Real-life connection",
          text: "Decode is like reading a recipe step: 'Add two cups of flour' — you identify the action (add), the ingredients (registers), and the tools (ALU) before doing anything.",
        },
      },
      {
        id: "execute-stage",
        title: "Stage 3: Execute",
        body: [
          "The actual work happens: ALU computes, data moves between registers, memory is read or written, or PC is overwritten for a jump.",
          "For ADD AX, BX: ALU adds register values. For MOV AX, [BX]: memory at address BX is read into AX. For JMP target: PC is loaded with target address.",
        ],
        table: {
          caption: "Execute actions by instruction type",
          headers: ["Instruction", "Execute action"],
          rows: [
            ["ADD AX, BX", "ALU: AX + BX → AX; update flags"],
            ["MOV AX, 5", "Load immediate 5 into AX (no ALU)"],
            ["MOV AX, [BX]", "Memory read at address BX → AX"],
            ["JMP label", "PC ← address of label (skip normal advance)"],
            ["CMP AX, BX", "ALU subtracts for flags only; AX unchanged"],
          ],
        },
      },
      {
        id: "store-stage",
        title: "Stage 4: Store / Writeback",
        body: [
          "If the instruction produces a result, it is written to the destination register or memory location. Flags register is updated if applicable.",
          "For most instructions, PC was already incremented during fetch. Jump instructions overwrite PC during execute instead.",
        ],
        realLife: {
          title: "Real-life connection",
          text: "After a calculator shows '35', the result is stored in the display register. After ADD AX, BX, the sum is stored in AX — same idea, different hardware.",
        },
      },
      {
        id: "hand-trace",
        title: "Hand Trace: A Short Program",
        body: [
          "Trace this program by hand to cement the cycle. Assume all values start at 0.",
        ],
        code: {
          code: "; Address  Instruction      ; Effect after full cycle\n; 1000     MOV AX, 10       ; AX=10, PC→1003\n; 1003     MOV BX, 5        ; BX=5,  PC→1006\n; 1006     ADD AX, BX       ; AX=15, PC→1009\n; 1009     CMP AX, 15       ; ZF=1,  PC→100C\n; 100C     JE  1012         ; jump if equal → PC=1012",
        },
        table: {
          caption: "Register state after each instruction completes",
          headers: ["After instruction", "AX", "BX", "PC", "ZF"],
          rows: [
            ["MOV AX, 10", "10", "0", "1003", "—"],
            ["MOV BX, 5", "10", "5", "1006", "—"],
            ["ADD AX, BX", "15", "5", "1009", "0"],
            ["CMP AX, 15", "15", "5", "100C", "1"],
            ["JE (taken)", "15", "5", "1012", "1"],
          ],
        },
        realLife: {
          title: "Real-life connection",
          text: "COAL exams often ask you to trace 5–10 instructions by hand. This skill proves you understand the machine, not just syntax.",
        },
      },
      {
        id: "clock-throughput",
        title: "Clock Cycles & Throughput",
        body: [
          "Each stage may take one or more clock cycles. Simple instructions might complete in 1–4 cycles; complex ones (memory access, multiply) take more.",
          "Throughput = instructions per second ≈ clock speed / average cycles per instruction. Pipelining (covered later) overlaps stages to improve throughput.",
        ],
        table: {
          caption: "Cycle intuition",
          headers: ["CPU clock", "Cycles per instruction (avg)", "Approx. instructions/sec"],
          rows: [
            ["1 GHz", "4", "250 million"],
            ["3 GHz", "4", "750 million"],
            ["3 GHz (pipelined, 1/cycle)", "1", "3 billion"],
          ],
        },
      },
    ],
    keyTakeaways: [
      "Every instruction goes through fetch → decode → execute → store (writeback).",
      "PC tracks the next instruction; IR holds the current one during decode/execute.",
      "Hand-tracing short programs is the best way to build machine-level intuition.",
      "Clock speed and cycles-per-instruction determine how fast code runs.",
    ],
  },

  "memory-hierarchy": {
    slug: "memory-hierarchy",
    level: "Beginner",
    duration: "4 days",
    preview: {
      summary:
        "Not all memory is equal. Registers, cache, RAM, and disk form a hierarchy of speed, size, and cost. Understanding this pyramid explains why data placement matters in assembly and high-performance programming.",
      highlights: [
        "Registers and cache are fast but tiny; RAM is larger but slower",
        "Every byte in memory has an address — programs use addresses, not names",
        "Stack and heap are regions of RAM with different growth patterns",
      ],
    },
    sections: [
      {
        id: "hierarchy-pyramid",
        title: "The Memory Hierarchy",
        body: [
          "Computer architects organize storage in levels. The CPU tries to keep frequently used data in the fastest levels (registers, cache) and uses slower levels (RAM, SSD) for bulk storage.",
          "This is driven by cost and physics: faster memory is more expensive per byte and harder to scale in size.",
        ],
        diagram: "memory-hierarchy",
        table: {
          caption: "Memory hierarchy at a glance",
          headers: ["Level", "Typical size", "Typical access time", "Managed by"],
          rows: [
            ["Registers", "Bytes–KB", "< 1 ns", "Compiler / programmer"],
            ["L1 cache", "32–64 KB", "~1 ns", "Hardware (CPU)"],
            ["L2/L3 cache", "256 KB – 32 MB", "~10–40 ns", "Hardware (CPU)"],
            ["Main memory (RAM)", "8–64 GB", "~100 ns", "OS + hardware"],
            ["SSD / HDD", "256 GB – 4 TB", "µs – ms", "OS"],
          ],
        },
        realLife: {
          title: "Real-life connection",
          text: "Your desk (registers) holds what you are working on now. The bookshelf (RAM) holds today's books. The warehouse (disk) holds everything else. You slow down if you walk to the warehouse for every page.",
        },
      },
      {
        id: "addressable-memory",
        title: "Addressable Memory & Byte Addressing",
        body: [
          "Main memory is a linear array of bytes, each with a unique address starting from 0. A 32-bit system can address up to 4 GB (2³² bytes); 64-bit systems can address vastly more.",
          "Instructions refer to memory by address: MOV AX, [1000h] reads the word at address 0x1000. The address bus carries these addresses; the data bus carries the bytes.",
        ],
        table: {
          caption: "Addressing and operand sizes",
          headers: ["Operand size", "Bytes accessed", "Example"],
          rows: [
            ["BYTE", "1", "MOV AL, [BX]"],
            ["WORD", "2", "MOV AX, [BX]"],
            ["DWORD", "4", "MOV EAX, [BX]"],
          ],
        },
        realLife: {
          title: "Real-life connection",
          text: "A street address pinpoints one house. A memory address pinpoints one byte. Arrays are consecutive addresses — index 5 of a byte array is at base + 5.",
        },
      },
      {
        id: "locality-cache",
        title: "Locality & Cache Basics",
        body: [
          "Programs tend to reuse data and instructions they recently accessed — this is called locality. Temporal locality: use again soon. Spatial locality: use nearby addresses next.",
          "Cache is small, fast memory that holds copies of recently used RAM blocks. On a cache hit, access is nearly as fast as a register. On a miss, the CPU waits for RAM.",
          { type: "subheading", text: "Why this matters in COAL" },
          "Looping over an array sequentially is cache-friendly. Jumping randomly through memory causes cache misses and slows execution.",
        ],
        realLife: {
          title: "Real-life connection",
          text: "Re-reading the same textbook chapter (temporal locality) and reading the next page (spatial locality) is faster than fetching a new book from the library each sentence.",
        },
      },
      {
        id: "stack-heap",
        title: "Stack, Heap & Program Layout",
        body: [
          "A running program's memory is divided into regions. Code holds instructions. Data holds global variables. The stack grows downward for function calls, local variables, and return addresses. The heap grows upward for dynamic allocation.",
          "ESP (stack pointer) tracks the top of the stack. EBP (base pointer) anchors a function's stack frame. You will use both heavily when studying procedures.",
        ],
        diagram: "memory-layout",
        table: {
          caption: "Memory regions and contents",
          headers: ["Region", "Grows", "Typical contents"],
          rows: [
            ["Stack", "Down (high → low addresses)", "Return addresses, local variables, parameters"],
            ["Heap", "Up (low → high addresses)", "Dynamic allocations (malloc, new)"],
            ["Data segment", "Fixed size at load", "Global and static variables"],
            ["Code segment", "Fixed size at load", "Machine instructions (read-only)"],
          ],
        },
        realLife: {
          title: "Real-life connection",
          text: "Each phone call (function call) pushes a return address on the stack — like leaving a bookmark so you know where to resume. Too many nested calls without returning causes a stack overflow.",
        },
      },
      {
        id: "endianness",
        title: "Endianness & Alignment (Intro)",
        body: [
          "Endianness defines byte order in multi-byte values. Little-endian (x86): least significant byte at lowest address. Big-endian: most significant byte first.",
          "Example: 32-bit value 0x12345678 stored at address 1000 in little-endian: [1000]=78, [1001]=56, [1002]=34, [1003]=12.",
          "Alignment means placing data at addresses divisible by their size (e.g., DWORD at address divisible by 4). Unaligned access can be slower or illegal on some CPUs.",
        ],
        table: {
          caption: "Little-endian storage of 0x12345678 at address 1000",
          headers: ["Address", "Byte stored"],
          rows: [
            ["1000", "0x78"],
            ["1001", "0x56"],
            ["1002", "0x34"],
            ["1003", "0x12"],
          ],
        },
        realLife: {
          title: "Real-life connection",
          text: "Network protocols often use big-endian (network byte order). x86 uses little-endian. Bugs appear when programs send raw memory bytes over the network without converting.",
        },
      },
      {
        id: "registers-vs-ram",
        title: "Registers vs Memory Trade-offs",
        body: [
          "Registers are scarce (roughly 8–16 GPRs in x86) but instant. RAM is abundant but slow. Good assembly and compiler output minimize memory traffic.",
          "Rule of thumb: keep loop counters, pointers, and frequently reused values in registers. Spill to stack or RAM only when you run out.",
        ],
        code: {
          code: "; Slow: memory-heavy loop\n    MOV CX, 1000\nloop1:\n    MOV AX, [BX]    ; read from RAM every iteration\n    INC AX\n    MOV [BX], AX\n    INC BX\n    LOOP loop1\n\n; Faster: keep accumulator in register\n    MOV CX, 1000\nloop2:\n    MOV AX, [BX]\n    INC AX\n    MOV [BX], AX    ; still need store, but AX stays hot in register",
        },
        realLife: {
          title: "Real-life connection",
          text: "Game engines profile cache misses because moving data between RAM levels costs more than ALU math. The hierarchy is not academic — it determines real-world performance.",
        },
      },
    ],
    keyTakeaways: [
      "Memory forms a hierarchy: registers → cache → RAM → disk, each slower and larger.",
      "Every byte has an address; instructions access memory with addresses, not variable names.",
      "Stack grows down for calls/locals; heap grows up for dynamic data.",
      "x86 is little-endian; alignment and locality affect performance.",
    ],
  },

  "ia32-architecture": {
    slug: "ia32-architecture",
    level: "Intermediate",
    duration: "5 days",
    preview: {
      summary:
        "A deep dive into the Intel IA-32 processor – registers, operating modes, memory segmentation, paging, and a complete address‑translation trace.",
      highlights: [
        "General‑purpose registers and stack‑frame pointers",
        "Real Mode → Protected Mode → Virtual‑8086 transitions",
        "How segmentation and paging turn logical addresses into physical RAM",
      ],
    },
    sections: [
      // ──────────── Day 1 ────────────
      {
        id: "registers",
        title: "Register Infrastructure and Foundations",
        body: [
          "The IA‑32 architecture contains eight 32‑bit General‑Purpose Registers. Their lower 16 bits can be accessed independently, and four of them further split into 8‑bit high/low halves.",
        ],
        diagram: "ia32-gpr-layout",          // EAX/AX/AH/AL diagram
        table: {
          caption: "General‑Purpose Registers – roles",
          headers: ["Register", "Special function"],
          rows: [
            ["EAX (Accumulator)", "Arithmetic, MUL/DIV, I/O, function return values"],
            ["EBX (Base)", "Base pointer for memory arrays / data blocks"],
            ["ECX (Count)", "Loop counter for LOOP, REP instructions"],
            ["EDX (Data)", "Overflow storage for 64‑bit operations, I/O port addresses"],
            ["ESI (Source Index)", "Source pointer for string / block operations"],
            ["EDI (Destination Index)", "Destination pointer for string / block operations"],
            ["ESP (Stack Pointer)", "Top‑of‑stack management (see the pointer section)"],
            ["EBP (Base Pointer)", "Fixed frame reference (see the pointer section)"],
          ],
        },
        realLife: {
          title: "Real‑life connection",
          text: "When a function returns a value in C, it’s stored in EAX. Understanding which register does what helps you debug crashes down to the assembly instruction.",
        },
      },
      {
        id: "pointers",
        title: "Execution Control & Stack Management Pointers",
        body: [
          "EIP (Instruction Pointer) holds the address of the next instruction. You cannot write directly to EIP – jumps, calls, and returns modify it implicitly.",
          "ESP (Stack Pointer) tracks the top of the runtime stack. In IA‑32 the stack grows downward: PUSH decreases ESP by 4, POP increases it by 4.",
          "EBP (Base Pointer) provides a stable anchor inside a function. Because ESP fluctuates, local variables and parameters are referenced via fixed EBP offsets: [EBP-4] for locals, [EBP+8] for arguments.",
        ],
        diagram: "ia32-stack-frame",         // Stack frame with EBP/ESP
        realLife: {
          title: "Real‑life connection",
          text: "Every time a function is called, the compiler creates a stack frame using EBP. This is how debuggers show you local variables – they simply look at [EBP‑x].",
        },
      },
      {
        id: "segments",
        title: "Segment Registers",
        body: [
          "Six 16‑bit segment registers isolate code, data, and stack. Their meaning changes completely between Real Mode and Protected Mode.",
        ],
        table: {
          caption: "Segment registers",
          headers: ["Register", "Purpose"],
          rows: [
            ["CS", "Code Segment – executable code"],
            ["DS", "Data Segment – global / static variables"],
            ["SS", "Stack Segment – runtime stack"],
            ["ES, FS, GS", "Extra segments – often used by OS for thread management"],
          ],
        },
      },

      // ──────────── Day 2 ────────────
      {
        id: "modes",
        title: "Microprocessor Operating Modes",
        body: [
          "IA‑32 can operate in several distinct modes that change how the CPU addresses memory and enforces protection.",
        ],
        diagram: "ia32-mode-transitions",    // the flowchart: Power‑on → Real → Protected ↔ V86
        realLife: {
          title: "Real‑life connection",
          text: "When your PC boots, it starts in Real Mode (like a 1980s PC). The OS then switches to Protected Mode to enable 4 GB of RAM and process isolation.",
        },
      },
      {
        id: "real-mode",
        title: "Real Mode",
        body: [
          "The CPU enters Real Mode on reset. It behaves like an 8086: 20‑bit address bus, 1 MB maximum addressable memory, no memory protection. Any program can crash the system.",
        ],
      },
      {
        id: "protected-mode",
        title: "Protected Mode",
        body: [
          "The native state of modern 32‑bit OSes. Full 32‑bit address bus → 4 GB addressable. Hardware‑enforced privilege rings (Ring 0 = kernel, Ring 3 = user) provide isolation.",
          "If a user‑mode program attempts an illegal operation, a General Protection Fault occurs and only that program is terminated.",
        ],
      },
      {
        id: "v86",
        title: "Virtual‑8086 Mode",
        body: [
          "A sub‑mode of Protected Mode that creates safe 16‑bit sandboxes. Legacy DOS programs think they own 1 MB of memory, but I/O and memory violations are trapped and handled by the OS.",
        ],
      },

      // ──────────── Day 3 ────────────
      {
        id: "segmentation",
        title: "Memory Segmentation",
        body: [
          "Segmentation converts a logical address (segment:offset) into a linear address. The mechanics differ dramatically between Real and Protected Mode.",
        ],
        realLife: {
          title: "Real‑life connection",
          text: "Segmentation is why old DOS programs could only access 64 KB at a time. Understanding this helps when working with legacy embedded systems.",
        },
      },
      {
        id: "real-mode-seg",
        title: "Real Mode Segmentation",
        body: [
          "Segment registers hold a 16‑bit base value. The CPU shifts it left by 4 bits (×16) and adds a 16‑bit offset to form a 20‑bit linear address.",
        ],
        table: {
          caption: "Real Mode address example",
          headers: ["Component", "Value", "Operation"],
          rows: [
            ["CS (segment)", "0x2000", "Shift left 4 → 0x20000"],
            ["EIP (offset)", "0x0150", "Add offset → 0x20150"],
            ["Linear address", "0x20150", "Physical address = linear address (no paging in Real Mode)"],
          ],
        },
      },
      {
        id: "protected-mode-seg",
        title: "Protected Mode Segmentation",
        body: [
          "Segment registers become selectors that index into the Global Descriptor Table (GDT). Each GDT entry provides a base address, limit, and access rights.",
          "Modern OSes set all base addresses to 0 and limits to 4 GB, effectively flattening memory so linear address = offset.",
        ],
        diagram: "ia32-segment-selector",    // bit layout of the selector
        table: {
          caption: "Segment Selector fields",
          headers: ["Field", "Bits", "Meaning"],
          rows: [
            ["Index", "15–3", "Row in GDT"],
            ["TI (Table Indicator)", "2", "0=GDT, 1=LDT"],
            ["RPL (Privilege)", "1–0", "00=Ring0, 11=Ring3"],
          ],
        },
      },

      // ──────────── Day 4 ────────────
      {
        id: "paging",
        title: "Architectural Memory Management – Paging",
        body: [
          "Paging maps a linear address (already translated by segmentation) to a physical RAM location. It uses a two‑level table: Page Directory and Page Tables.",
        ],
        diagram: "ia32-linear-address-breakdown",  // 32‑bit linear address split
        realLife: {
          title: "Real‑life connection",
          text: "Paging is why your computer can run multiple programs without them seeing each other’s memory – and why it can use more memory than physically installed (swap).",
        },
      },
      {
        id: "paging-steps",
        title: "Two‑Tier Translation Mechanism",
        body: [
          "CR3 register → Page Directory (10 bits) → Page Table (10 bits) → 4 KB physical frame + offset (12 bits).",
          "Each 4 KB block is called a page (virtual) / frame (physical).",
        ],
        table: {
          caption: "Address translation steps",
          headers: ["Step", "Bits used", "What it finds"],
          rows: [
            ["1. CR3", "–", "Physical address of Page Directory"],
            ["2. Directory index", "31–22", "Page Directory Entry → Page Table base"],
            ["3. Table index", "21–12", "Page Table Entry → 4 KB frame base"],
            ["4. Offset", "11–0", "Exact byte inside the 4 KB frame"],
          ],
        },
      },
      {
        id: "benefits",
        title: "Virtualization & Demand Paging Benefits",
        body: [
          "Paging eliminates external fragmentation and supports demand paging (swap): inactive pages are moved to disk and reloaded on a page fault.",
        ],
      },

      // ──────────── Day 5 ────────────
      {
        id: "comparison",
        title: "Segmentation vs Paging Comparison",
        body: [
          "Both mechanisms work together, but they serve different purposes.",
        ],
        table: {
          caption: "Segmentation vs Paging",
          headers: ["Parameter", "Segmentation", "Paging"],
          rows: [
            ["Primary driver", "Logical structure (programmer)", "Physical optimization (OS/RAM)"],
            ["Block size", "Variable (1 B – 4 GB)", "Fixed 4 KB"],
            ["Visibility", "Visible to compiler/assembler", "Hidden from applications"],
            ["Fragmentation", "External (gaps between segments)", "Internal (wasted space inside page)"],
          ],
        },
      },
      {
        id: "lifecycle",
        title: "Complete Address Lifecycle Trace",
        body: [
          "MOV EAX, [EBX+0x20] → Logical address (DS:offset) → Segmentation (GDT) → Linear address → Paging (CR3) → Physical address on RAM bus.",
        ],
        diagram: "ia32-address-lifecycle",
        realLife: {
          title: "Real life connection",
          text: "Every memory access your program makes passes through this full pipeline. Hardware debuggers and hypervisors hook into exactly these translation steps.",
        },
      },
    ],
    keyTakeaways: [
      "EAX, EBX, ECX, EDX, ESI, EDI, ESP, EBP are the 8 GPRs – each with a specific role.",
      "EIP cannot be written directly; control flow changes it.",
      "Real Mode = 1 MB, no protection. Protected Mode = 4 GB, rings, isolation.",
      "Segmentation: Real Mode = segment×16+offset; Protected Mode = GDT descriptor + offset.",
      "Paging uses a 2‑level table (directory + table) to map 4 KB virtual pages to physical frames.",
      "Modern OSes use a flat memory model (segments base=0) and rely on paging for protection.",
    ],
  },

  "directives-macros": {
    slug: "directives-macros",
    level: "Intermediate",
    duration: "4 days",
    preview: {
      summary:
        "Learn to structure a clean assembly program with .DATA, .CODE and .STACK, define constants and variables, write reusable macros, and understand the complete build pipeline from .ASM to running in RAM.",
      highlights: [
        "Instructions vs assembler directives – what the CPU sees vs what the assembler sees",
        "Data allocation with DB, DW, DD and operators like EQU, OFFSET, PTR",
        "Macros vs procedures – compile‑time expansion vs runtime call/return",
        "The three‑step build: Assembler → Linker → Loader",
      ],
    },
    sections: [
      // ──────────── Day 1 ────────────
      {
        id: "contrast",
        title: "Assembler Directives vs. Instructions",
        body: [
          "Assembly source files contain two completely different kinds of statements: instructions that become actual machine code, and directives that only guide the assembler.",
        ],
        table: {
          caption: "Instructions vs Directives – a side‑by‑side view",
          headers: ["Property", "Assembly Instructions", "Assembler Directives"],
          rows: [
            ["What they do", "Real CPU operations (MOV, ADD, JMP …)", "Commands for the assembler (.DATA, .CODE, EQU …)"],
            ["Translate to machine code?", "Yes – every instruction becomes bytes", "No – they never appear in the final binary"],
            ["Who executes them?", "The physical CPU at runtime", "The assembler at compile time"],
            ["Affect registers/flags?", "Yes", "No"],
          ],
        },
        realLife: {
          title: "Real‑life connection",
          text: "Think of directives as stage directions for a play – they tell the crew where to place the furniture, but the audience (the CPU) never sees them.",
        },
      },
      {
        id: "segment-layout",
        title: "Standard Three‑Segment Program Layout",
        body: [
          "A classic IA‑32 program is split into three segments. Each serves a distinct purpose, and modern OSes enforce different permissions on each.",
        ],
        diagram: "segment-layout", // the block diagram: .STACK, .DATA, .CODE
        table: {
          caption: "The three segment shortcuts",
          headers: ["Segment", "Typical usage", "Permissions"],
          rows: [
            [".STACK", "LIFO memory for calls, returns, locals", "Read/Write"],
            [".DATA", "Static variables, strings, arrays", "Read/Write (not executable)"],
            [".CODE", "Executable instructions", "Read/Execute (not writable)"],
          ],
        },
        realLife: {
          title: "Real‑life connection",
          text: "The separation of code and data is why most buffer‑overflow exploits try to inject code into the stack or data sections and then trick the CPU into executing it.",
        },
      },

      // ──────────── Day 2 ────────────
      {
        id: "allocation",
        title: "Data Allocation – DB, DW, DD",
        body: [
          "You tell the assembler exactly how many bytes to reserve and what to put in them using DB, DW, and DD. The `?` token leaves memory uninitialised.",
        ],
        table: {
          caption: "Allocation directives at a glance",
          headers: ["Directive", "Allocates", "Example"],
          rows: [
            ["DB (Define Byte)", "1 byte (8 bits)", "age DB 25"],
            ["DW (Define Word)", "2 bytes (16 bits)", "matrix DW ?"],
            ["DD (Define Doubleword)", "4 bytes (32 bits)", "big DD 12345678h"],
            ["DUP operator", "Multiple copies", "buffer DB 50 DUP(0)"],
          ],
        },
        realLife: {
          title: "Real‑life connection",
          text: "When you declare a string in any language, the compiler reserves a block of DBs behind the scenes – one byte per character.",
        },
      },
      {
        id: "operators",
        title: "Assembly Operators: EQU, OFFSET, PTR",
        body: [
          "These operators don’t generate code; they control how the assembler interprets numbers and addresses.",
        ],
        table: {
          caption: "Three essential operators",
          headers: ["Operator", "Meaning", "Example"],
          rows: [
            ["EQU", "Text‑replacement constant (no memory used)", "BUFFER_SIZE EQU 1024"],
            ["OFFSET", "Returns the 32‑bit address of a variable", "MOV ESI, OFFSET myWord"],
            ["PTR", "Overrides the default size of a memory operand", "MOV BYTE PTR [ESI], 55h"],
          ],
        },
        realLife: {
          title: "Real‑life connection",
          text: "OFFSET is like getting the street address of a house; without it, you’d be talking about whatever is inside the house.",
        },
      },
      {
        id: "procedures",
        title: "Procedures (PROC and ENDP)",
        body: [
          "PROC and ENDP mark reusable blocks of code. You call them with CALL, which pushes the return address onto the stack, and RET, which pops it back into EIP.",
        ],
        diagram: "proc-call-flow", // simplified call/return sequence
        realLife: {
          title: "Real‑life connection",
          text: "Every function in C compiles to a PROC block. The CALL/RET pair is exactly how your program jumps into a function and returns to the caller.",
        },
      },

      // ──────────── Day 3 ────────────
      {
        id: "macro-def",
        title: "Macro Architecture",
        body: [
          "A macro is a named block of code (MACRO … ENDM) that the assembler **copies and pastes** at every call site before generating machine code. It uses positional parameters for flexibility.",
        ],
        table: {
          caption: "Example macro definition",
          headers: ["Macro line", "Explanation"],
          rows: [
            ["mCopyData MACRO src, dest", "Define macro with two parameters"],
            ["PUSH EAX", "Save original EAX value"],
            ["MOV EAX, src", "Move source into accumulator"],
            ["MOV dest, EAX", "Write accumulator to destination"],
            ["POP EAX", "Restore EAX"],
            ["ENDM", "End of macro definition"],
          ],
        },
      },
      {
        id: "macro-vs-proc",
        title: "Macros vs Procedures – A Side‑by‑Side Comparison",
        body: [
          "Both let you reuse code, but they work at completely different times and have different trade‑offs.",
        ],
        table: {
          caption: "Macro vs Procedure",
          headers: ["Aspect", "Macro", "Procedure"],
          rows: [
            ["Processing time", "Compile time (assembler)", "Runtime (CPU)"],
            ["Binary size", "Increases with every call (code duplication)", "Code exists once, calls add minimal overhead"],
            ["Execution speed", "No call/return overhead", "CALL/RET consume a few cycles"],
            ["Parameter passing", "Literal text replacement", "Registers, stack, or memory pointers"],
          ],
        },
      },
      {
        id: "conditional",
        title: "Conditional Assembly",
        body: [
          "Directives like IF, ELSE, ENDIF, IFDEF let you include or exclude blocks of code based on compile‑time flags. This is perfect for debug builds or platform‑specific sections.",
        ],
        table: {
          caption: "Conditional assembly example",
          headers: ["Directive", "What happens"],
          rows: [
            ["DEBUG_MODE EQU 1", "Define a flag"],
            ["IF DEBUG_MODE", "Only assemble the following lines if the flag is true"],
            ["CALL LogSystemDiagnostics", "This call disappears from the final binary when DEBUG_MODE=0"],
            ["ENDIF", "End of conditional block"],
          ],
        },
        realLife: {
          title: "Real‑life connection",
          text: "Game developers use conditional assembly to include performance counters in debug builds that are completely absent in the shipped product – zero runtime cost.",
        },
      },

      // ──────────── Day 4 ────────────
      {
        id: "build-pipeline",
        title: "The Build Pipeline",
        body: [
          "Turning a plain‑text .ASM file into a running program involves three distinct stages. Understanding them helps you diagnose ‘undefined symbol’ and ‘unresolved external’ errors.",
        ],
        diagram: "build-pipeline", // flowchart: .ASM → Assembler → .OBJ → Linker → .EXE → Loader → RAM
        table: {
          caption: "Stages of the build",
          headers: ["Stage", "Tool", "What it does"],
          rows: [
            ["1. Assembly", "MASM / NASM", "Checks syntax, converts mnemonics to opcodes, produces .OBJ"],
            ["2. Linking", "LINK.EXE / ld", "Resolves symbols, merges segments, produces .EXE"],
            ["3. Loading", "OS Loader", "Maps .CODE, .DATA, .STACK into memory, sets CS:EIP and SS:ESP"],
          ],
        },
      },
      {
        id: "demo-template",
        title: "Practical Demonstration Template",
        body: [
          "Below is a minimal but complete IA‑32 program that uses all the concepts covered. Study it as a reference for your own experiments.",
        ],
        diagram: "demo-program-template", // the full code template as a styled diagram/SVG
        realLife: {
          title: "Real‑life connection",
          text: "This template is the ‘Hello World’ of assembly programming. Once you understand every line, you’re ready to write real low‑level code for drivers, emulators, and embedded systems.",
        },
      },
    ],
    keyTakeaways: [
      "Directives guide the assembler; instructions run on the CPU.",
      ".STACK, .DATA, .CODE segment your program into logical, protected regions.",
      "DB, DW, DD control memory allocation; EQU, OFFSET, PTR control symbols and addressing.",
      "Procedures use CALL/RET and a single copy of code; macros duplicate code inline at compile time.",
      "The build chain is Assembler → Linker → Loader – each stage converts your source closer to raw bytes in RAM.",
    ],
  },

  "hw-sw-interface": {
    slug: "hw-sw-interface",
    level: "Intermediate",
    duration: "3 days",
    preview: {
      summary:
        "Trace a line of C code all the way down to raw binary bytes in RAM. Understand how the compiler, assembler, linker, and loader cooperate, and how high‑level structures (if, functions, variables) map to assembly and stack frames.",
      highlights: [
        "The full translation chain: C → Assembly → Object file → Executable → Running memory",
        "How `if` statements and local variables turn into CMP, JMP, and stack offsets",
        "Calling conventions (__cdecl vs __stdcall) and why they matter for crashes",
        "Why the memory wall and word size shape software design",
      ],
    },
    sections: [
  
      {
        id: "translation-chain",
        title: "The Translation Chain & Compilation Pipeline",
        body: [
          "A high‑level language statement like `x = a + b;` goes through four distinct stages before it becomes electrical signals on the CPU.",
        ],
        diagram: "translation-pipeline", 
        table: {
          caption: "The four stages of translation",
          headers: ["Stage", "Tool", "What it produces"],
          rows: [
            ["Compiler", "GCC / Clang / MSVC", "Assembly language text"],
            ["Assembler", "MASM / NASM", "Object file (.OBJ) – machine code with unresolved symbols"],
            ["Linker", "LINK / ld", "Executable (.EXE) – all addresses resolved"],
            ["Loader", "OS (PE/ELF loader)", "Program in physical RAM with EIP pointed to entry"],
          ],
        },
        realLife: {
          title: "Real‑life connection",
          text: "When you hit ‘Build’ in an IDE, you’re running the compiler and assembler. When you launch the app, the loader maps it into memory. Crashes at launch are often loader errors – missing DLLs, wrong bitness.",
        },
      },

      {
        id: "control-structures",
        title: "Mapping Control Structures to Assembly",
        body: [
          "CPUs have no `if`, `for`, or `while`. The compiler translates them into comparisons (CMP) and conditional jumps (JE, JNE, JG, JL).",
        ],
        table: {
          caption: "if else in C → Assembly mapping",
          headers: ["C code", "Assembly translation"],
          rows: [
            ["if (status == 5)", "CMP EAX, 5 ; JNE L_Else"],
            ["count = 10;", "MOV DWORD PTR [count], 10"],
            ["else count = 0;", "L_Else: MOV DWORD PTR [count], 0"],
          ],
        },
        realLife: {
          title: "Real life connection",
          text: "Debuggers show you the assembly behind your C code. That JNE instruction is why a single `=` vs `==` bug can set a flag incorrectly and send execution down the wrong branch.",
        },
      },
      {
        id: "stack-frame",
        title: "Variables and the Stack Frame",
        body: [
          "Every function call creates a stack frame bounded by EBP (base) and ESP (top). Parameters are at positive offsets from EBP; local variables at negative offsets.",
        ],
        diagram: "stack-frame-layout", // the classic EBP/ESP drawing
        table: {
          caption: "Accessing data in a stack frame",
          headers: ["Item", "Typical offset", "How it’s used"],
          rows: [
            ["Parameter 1", "[EBP + 8]", "Input to the function"],
            ["Return address", "[EBP + 4]", "Pushed by CALL"],
            ["Saved old EBP", "[EBP]", "Links to caller’s frame"],
            ["Local variable 1", "[EBP - 4]", "Temporary storage within function"],
            ["Local variable 2", "[EBP - 8]", "Further temporaries"],
          ],
        },
        realLife: {
          title: "Real life connection",
          text: "When a function returns, ESP and EBP must be restored exactly. A mistake here – like a buffer overflow into [EBP] – corrupts the whole call chain and is the root of many security exploits.",
        },
      },

      {
        id: "calling-conventions",
        title: "Calling Conventions & ABI",
        body: [
          "The ABI (Application Binary Interface) is a contract between functions: who pushes parameters, in what order, and who cleans the stack.",
        ],
        table: {
          caption: "__cdecl vs __stdcall",
          headers: ["Aspect", "__cdecl (C default)", "__stdcall (Win32 API)"],
          rows: [
            ["Parameter order", "Right‑to‑left on stack", "Right‑to‑left on stack"],
            ["Stack cleanup", "Caller (ADD ESP, x after call)", "Callee (RET x inside function)"],
            ["Variable arguments?", "Yes (e.g., printf)", "No"],
            ["Binary size impact", "Larger code at each call site", "Smaller overall code"],
          ],
        },
        realLife: {
          title: "Real‑life connection",
          text: "If you mix conventions (e.g., calling a __stdcall function as __cdecl), the stack pointer ends up in the wrong place. The program may run for a while, then crash mysteriously or corrupt data.",
        },
      },
      {
        id: "hardware-constraints",
        title: "Hardware Constraints That Shape Software",
        body: [
          "Software isn’t free – physical limits like cache size and register width directly affect performance and even programming language design.",
        ],
        table: {
          caption: "Two critical hardware realities",
          headers: ["Constraint", "Effect on software"],
          rows: [
            ["Memory wall (cache miss)", "Random memory access patterns can be 100× slower than sequential. Cache‑friendly data layouts are essential."],
            ["32‑bit word size", "Operations on 64‑bit types require multiple instructions (EDX:EAX pairs), increasing code size and execution time."],
          ],
        },
      },

      // ──────────── Capstone Lab ────────────
      {
        id: "capstone-lab",
        title: "Capstone Lab: Translation Tracer",
        body: [
          "Here is a tiny C function and its complete IA‑32 translation, including the raw machine code bytes that the CPU actually fetches.",
        ],
        table: {
          caption: "ComputeSquare function – annotated assembly trace",
          headers: ["Assembly instruction", "Purpose", "Machine code (hex)"],
          rows: [
            ["PUSH EBP", "Save old base pointer", "55"],
            ["MOV EBP, ESP", "Set new frame base", "8B EC"],
            ["SUB ESP, 4", "Reserve space for local 'result'", "83 EC 04"],
            ["MOV EAX, [EBP+8]", "Fetch 'base' parameter", "8B 45 08"],
            ["IMUL EAX, EAX", "EAX = base × base", "0F AF C0"],
            ["MOV [EBP-4], EAX", "Store into local variable", "89 45 FC"],
            ["MOV EAX, [EBP-4]", "Load return value into EAX", "8B 45 FC"],
            ["MOV ESP, EBP", "Collapse stack frame", "8B E5"],
            ["POP EBP", "Restore caller’s base pointer", "5D"],
            ["RET", "Return to caller", "C3"],
          ],
        },
      },

      // ──────────── Practice Assessment ────────────
      {
        id: "practice-questions",
        title: "Practice Verification Questions",
        body: [
          "Test your understanding with these diagnostic scenarios drawn from real debugging situations.",
        ],
        table: {
          caption: "Question & detailed answer",
          headers: ["Question", "Answer"],
          rows: [
            [
              "Q1: A function crashes because the caller omitted `ADD ESP, x` under __cdecl. What happens to the stack?",
              "ESP remains stuck at a lower address. Subsequent PUSH/CALL operations write over other memory, corrupting variables and return addresses.",
            ],
            [
              "Q2: After changing one string literal in a 20,000‑line C project, which tools must run from scratch?",
              "Only the compiler for that single file must regenerate its .OBJ. The linker, however, must run completely anew to re‑resolve all addresses and string tables across the whole executable.",
            ],
          ],
        },
      },
    ],
    keyTakeaways: [
      "Compiler → Assembler → Linker → Loader: each step transforms your code closer to physical RAM execution.",
      "`if` becomes CMP + conditional jump; loops become CMP + JMP back.",
      "Local variables live at negative EBP offsets; function parameters at positive ones.",
      "Calling conventions define who cleans the stack – mismatches cause stack corruption.",
      "Hardware constraints (cache misses, 32‑bit word size) directly impact software performance.",
    ],
  },

  "io-interrupts": {
    slug: "io-interrupts",
    level: "Advanced",
    duration: "4 days",
    preview: {
      summary:
        "External devices like keyboards, mice, and hard drives work at their own pace. This module shows how the CPU communicates with them via polling, interrupts, and direct memory access (DMA), ensuring the CPU doesn't waste precious cycles waiting for slow hardware.",
      highlights: [
        "Memory-Mapped vs Isolated I/O address organization",
        "Programmed I/O (Polling) vs Interrupt-driven I/O vs DMA",
        "Mechanics of interrupts: ISR execution, IVT/IDT vectors, and IRET",
      ],
    },
    sections: [
      {
        id: "io-mapping",
        title: "How the CPU Finds I/O Devices",
        body: [
          "Before a CPU can read keys from a keyboard or write blocks to a disk, it needs a way to address those devices. There are two main ways computer systems map device registers: Memory-Mapped I/O and Isolated I/O.",
          "In Memory-Mapped I/O, the hardware makes the device registers look exactly like regular RAM addresses. A write to address 0x8000 might update a screen pixel rather than store a variable in memory. This means the CPU can use normal instructions like `MOV` to talk to devices, but it reduces the address space available for actual RAM.",
          "In Isolated I/O (or Port-Mapped I/O), devices live in a separate, isolated address space (usually called ports). The CPU uses dedicated hardware control lines and special instructions — specifically `IN` and `OUT` in x86 — to read and write to these ports. This keeps memory address space clean but requires special assembly instructions.",
        ],
        diagram: "io-mapping-comparison",
        realLife: {
          title: "Real-life connection",
          text: "Think of Memory-Mapped I/O like having mail slots inside your house (everything goes to the same wall). Isolated I/O is like having a separate PO Box downtown. You need a different key (a special instruction) to check the PO Box.",
        },
        table: {
          caption: "I/O Mapping Methods Comparison",
          headers: ["Feature", "Memory-Mapped I/O", "Isolated (Port-Mapped) I/O"],
          rows: [
            ["Address Space", "Shared (I/O registers occupy RAM addresses)", "Separate (Ports are distinct from RAM addresses)"],
            ["Instructions", "Regular memory instructions (MOV, ADD, etc.)", "Special instructions (IN, OUT in x86)"],
            ["Hardware Complexity", "Simpler CPU design, but requires device address decoding", "Separate address lines and control signals needed"],
            ["Address Space Cost", "Reduces available RAM space", "Does not affect RAM space"],
          ],
        },
      },
      {
        id: "io-techniques",
        title: "Three Ways to Transfer Data",
        body: [
          "Once the mapping is established, how does the actual data move between the CPU and the device? There are three standard techniques, each solving a specific efficiency problem.",
          { type: "subheading", text: "1. Programmed I/O (Polling)" },
          "The CPU executes a loop, repeatedly checking a device's status register until the device is ready to send or receive data. While simple to implement, polling wastes almost 100% of the CPU's time on waiting.",
          { type: "subheading", text: "2. Interrupt-Driven I/O" },
          "Instead of checking constantly, the CPU goes about its normal work. When a device becomes ready, it sends an electrical signal (an Interrupt Request, or IRQ) to the CPU. The CPU pauses its current program, handles the device, and then returns to what it was doing.",
          { type: "subheading", text: "3. Direct Memory Access (DMA)" },
          "For massive data transfers (like loading a file from disk to RAM), interrupts still waste CPU time because the CPU has to move every single byte. Under DMA, a specialized hardware chip called the DMA Controller takes over. The CPU tells the DMA controller the source, destination, and size of the transfer, and goes to sleep or does other work. The DMA controller transfers the data directly between RAM and the device, interrupting the CPU only once when the entire transfer is complete.",
        ],
        realLife: {
          title: "Real-life connection",
          text: "Imagine ordering pizza. Polling is standing by the door and opening it every 30 seconds to check if the delivery person is there. Interrupt-driven is watching TV until the doorbell rings. DMA is telling a butler to get the pizza, pay for it, set the table, and only tap your shoulder when the food is ready to eat.",
        },
        table: {
          caption: "Data Transfer Techniques Summary",
          headers: ["Technique", "CPU Overhead", "Ideal Use Case"],
          rows: [
            ["Programmed I/O (Polling)", "Maximum (CPU busy-waits in a loop)", "Very simple systems, low-cost microcontrollers"],
            ["Interrupt-Driven I/O", "Medium (CPU handles each byte via ISR)", "Keyboard keystrokes, mouse movement, network packets"],
            ["Direct Memory Access (DMA)", "Minimum (CPU only coordinates start/end)", "Disk read/writes, GPU framebuffers, audio streaming"],
          ],
        },
      },
      {
        id: "interrupt-mechanics",
        title: "How Interrupts Work Under the Hood",
        body: [
          "Interrupts are the backbone of modern operating systems. They let a computer multi-task. Let's trace exactly what happens when you press a key on your keyboard:",
          { type: "list", items: [
            "1. Hardware Signal: The keyboard controller raises an Interrupt Request (IRQ) on the system control bus.",
            "2. Complete Instruction: The CPU finishes executing its current assembly instruction so it doesn't leave registers in a half-computed state.",
            "3. Save State: The CPU automatically pushes the Flags register, the Code Segment (CS), and the Instruction Pointer (EIP) onto the stack. This preserves the exact spot where the main program was paused.",
            "4. Vector Lookup: The CPU reads the interrupt number (e.g., Interrupt 9 for keyboard). It uses this number as an index to look up the address of the handler in the Interrupt Vector Table (IVT, in real mode) or the Interrupt Descriptor Table (IDT, in protected mode).",
            "5. Execute ISR: The CPU jumps to that address and runs the Interrupt Service Routine (ISR) — the function that reads the key code and saves it to a buffer.",
            "6. IRET: The ISR concludes with a special instruction called IRET (Interrupt Return). This pops the saved EIP, CS, and Flags back off the stack, and the CPU seamlessly resumes the main program.",
          ]},
        ],
        diagram: "interrupt-lifecycle",
        realLife: {
          title: "Real-life connection",
          text: "It is exactly like reading a book. When the phone rings (Interrupt), you don't throw the book away. You place a bookmark (Save EIP/CS/Flags on Stack), answer the phone (Run ISR), hang up (IRET), open the book to the bookmark, and continue reading from the exact word you left off.",
        },
      },
      {
        id: "assembly-io-example",
        title: "Assembly I/O: Polling Keyboard Port",
        body: [
          "In assembly, you interface with hardware ports directly using `IN` and `OUT`. Below is a standard routine showing how a CPU polls a keyboard status port (port 64h) and reads the key data (port 60h) once it's ready. If the key is the Escape key (scan code 0x01), it jumps to exit.",
        ],
        code: {
          code: "; Poll the keyboard controller status port until data is available\nPollKeyboard:\n    IN AL, 64h          ; Read status register from port 64h\n    TEST AL, 01h        ; Bit 0 is 'Output Buffer Full' (data ready)\n    JZ PollKeyboard     ; If 0, no data yet, loop back\n\n; Data is ready, read the scan code\n    IN AL, 60h          ; Read scan code from data port 60h\n    CMP AL, 01h         ; 01h is the scan code for the ESC key\n    JE ExitProgram      ; If equal, jump to exit handler\n    RET",
        },
      },
    ],
    keyTakeaways: [
      "Memory-Mapped I/O treats device registers as memory locations; Isolated I/O treats them as separate ports using IN/OUT instructions.",
      "Polling wastes CPU cycles. Interrupt-driven I/O allows asynchronous device alerts. DMA enables high-speed block transfers bypassing the CPU.",
      "An interrupt saves the Flags and Instruction Pointer on the stack, jumps to the ISR address found in the IVT/IDT, and returns using the IRET instruction.",
    ],
  },
  "buses-storage": {
    slug: "buses-storage",
    level: "Advanced",
    duration: "2 days",
    preview: {
      summary:
        "Bits need physical paths to travel across the motherboard. This module covers the System Bus structure (Address, Data, and Control lines), the differences between secondary storage systems (HDDs vs SSDs), and how RAID arrays protect critical data from physical disk failures.",
      highlights: [
        "How Address, Data, and Control buses split responsibilities",
        "Mechanical magnetic HDDs vs electrical Flash-based SSDs",
        "RAID levels 0, 1, and 5 safety and performance trade-offs",
      ],
    },
    sections: [
      {
        id: "system-buses",
        title: "The Motherboard Highways: System Buses",
        body: [
          "A computer is not just a CPU; it is a collaborative ecosystem. The physical wires on the motherboard that transport bits between the CPU, RAM, and I/O devices are called the System Bus. To prevent chaos, this bus is divided into three distinct sets of lines:",
          { type: "subheading", text: "1. Address Bus" },
          "Carries the memory address or I/O port address that the CPU wants to access. It is unidirectional (CPU-to-device). The width of the address bus determines the maximum memory the CPU can address. For example, a 32-bit address bus can address 2^32 bytes (4 Gigabytes) of RAM.",
          { type: "subheading", text: "2. Data Bus" },
          "Carries the actual data bytes being read from or written to memory/devices. It is bidirectional (data flows in and out of the CPU). Its width determines the system's word size and directly impacts memory throughput.",
          { type: "subheading", text: "3. Control Bus" },
          "Carries signals that coordinate and synchronize the system. Examples include read/write command signals (MEMRD, MEMWR), system clock signals, interrupt lines, and bus request/grant signals.",
        ],
        diagram: "system-bus-split",
        realLife: {
          title: "Real-life connection",
          text: "Think of a shipping company. The Address Bus is the GPS coordinate of the warehouse. The Data Bus is the truck carrying the actual cargo boxes. The Control Bus is the traffic lights and dispatch signals telling the driver whether to pick up (Read) or drop off (Write) the cargo.",
        },
        table: {
          caption: "System Bus Types & Properties",
          headers: ["Bus Type", "Direction", "Determines", "Example Signal"],
          rows: [
            ["Address Bus", "Unidirectional (CPU out)", "Maximum addressable memory capacity", "Target memory index (e.g. 0x00FF4B20)"],
            ["Data Bus", "Bidirectional", "Word size and parallel data throughput", "Value of variable or instruction bytes (e.g. 0x55)"],
            ["Control Bus", "Both directions / Multi-line", "System timing and command synchronization", "Read/Write strobe, Clock ticks, Interrupt Requests"],
          ],
        },
      },
      {
        id: "secondary-storage",
        title: "Secondary Storage: HDD vs SSD",
        body: [
          "RAM is volatile — it forgets everything when the computer is turned off. To store files, operating systems, and assembly programs permanently, we need non-volatile secondary storage. The two dominant technologies are Hard Disk Drives (HDDs) and Solid State Drives (SSDs).",
          "HDDs are mechanical devices. They store data magnetically on spinning platters. A mechanical read/write arm moves back and forth to find data. Because of physical limits, HDDs suffer from seek latency (waiting for the arm to move) and rotational latency (waiting for the disk to spin to the right spot). They are also sensitive to drop shocks.",
          "SSDs have no moving parts. They store data electrically using NAND Flash memory chips. Because there is no physical arm to move, SSDs have near-zero seek latency, offering vastly faster random read/write speeds, silent operation, and high durability.",
        ],
        realLife: {
          title: "Real-life connection",
          text: "Searching for a song on an HDD is like looking for a track on a vinyl record by moving the physical needle arm. An SSD is like selecting a track instantly on a digital MP3 player. That is why replacing an old HDD with an SSD is the single best upgrade to speed up a slow computer.",
        },
        table: {
          caption: "HDD vs SSD Comparison",
          headers: ["Specification", "Hard Disk Drive (HDD)", "Solid State Drive (SSD)"],
          rows: [
            ["Mechanism", "Spinning magnetic platters & moving arm", "NAND Flash memory chips"],
            ["Random Access Time", "Slow (5 - 15 milliseconds mechanical seek)", "Near-instant (0.1 milliseconds electrical lookup)"],
            ["Durability", "Fragile (mechanical parts can break if dropped)", "Highly durable (solid-state electronics)"],
            ["Typical Read Speed", "80 - 160 MB/s", "500 - 7000+ MB/s (NVMe/PCIe)"],
            ["Cost per GB", "Very low (great for mass archival storage)", "Medium to High"],
          ],
        },
      },
      {
        id: "raid-storage",
        title: "Data Protection: RAID Arrays",
        body: [
          "In enterprise servers and databases, a single drive failure could destroy critical company data. RAID (Redundant Array of Independent Disks) solves this by combining multiple physical hard drives into a single logical volume to improve speed, reliability, or both. Let's look at the three most common RAID levels:",
          { type: "subheading", text: "RAID 0 (Stripping)" },
          "Data is sliced into blocks and written alternately across two or more disks. This doubles the read/write speed because both disks read/write in parallel. However, there is zero safety: if one disk fails, all data on all disks is permanently lost.",
          { type: "subheading", text: "RAID 1 (Mirroring)" },
          "Data written to Disk 1 is simultaneously copied identically to Disk 2. This offers excellent safety: if one disk dies, the system keeps running on the other. The downside is that you pay for two disks but only get the storage capacity of one.",
          { type: "subheading", text: "RAID 5 (Distributed Parity)" },
          "Requires at least three disks. Data is striped across disks, but a mathematically calculated safety check block (called parity) is also written and distributed across the drives. If any single drive fails, the system can use the parity blocks on the remaining drives to reconstruct the missing data in real time. This offers a great balance of speed, protection, and capacity cost.",
        ],
        diagram: "raid-comparison",
        realLife: {
          title: "Real-life connection",
          text: "Imagine writing a long school report. RAID 0 is writing odd chapters in one notebook and even chapters in another (faster writing, but lose one notebook and the whole report is ruined). RAID 1 is copying the whole report onto a backup notebook (very safe, but requires twice the work and paper). RAID 5 is using three notebooks and writing code keys in the margins so you can rebuild any lost page by comparing the other two.",
        },
      },
    ],
    keyTakeaways: [
      "The System Bus splits into the Address Bus (location selection), Data Bus (value transport), and Control Bus (timing/operation commands).",
      "SSDs are much faster than HDDs because they eliminate mechanical seek latency by accessing NAND Flash memory electrically.",
      "RAID 0 offers raw speed with no backup, RAID 1 offers full mirroring backup at 50% capacity, and RAID 5 offers parity recovery across 3+ disks.",
    ],
  },

  "processor-families": {
    slug: "processor-families",
    level: "Advanced",
    duration: "4 days",
    preview: {
      summary:
        "Contrast CISC (x86) and RISC (ARM, RISC-V, MIPS) architectures, trace the development of Intel x86 from 16-bit real mode up to modern 64-bit multi-core configurations, and understand why RISC processors dominate the embedded and mobile ecosystems.",
      highlights: [
        "CISC (Complex Instruction Set Computer) vs RISC design principles",
        "Evolution of the x86 instruction set architecture family",
        "Ecosystem and energy-efficiency advantages of ARM & RISC-V",
      ],
    },
    sections: [
      {
        id: "cisc-risc",
        title: "CISC vs. RISC Philosophies",
        body: [
          "In computer architecture, there are two primary schools of thought for designing an Instruction Set Architecture (ISA): CISC and RISC.",
          "CISC (Complex Instruction Set Computer) focuses on hardware richness. It provides a massive set of instructions, including highly complex ones that perform multiple sub-tasks (like reading from memory, adding, and writing back) within a single instruction. This keeps assembly programs small and conserves memory, but requires complex, power-hungry decode logic in the CPU.",
          "RISC (Reduced Instruction Set Computer) focuses on simplicity. It restricts instructions to a small number of basic, uniform-length tasks that execute in a single clock cycle. Memory access is isolated to dedicated load and store instructions (`LDR`/`STR`), and all arithmetic is performed register-to-register. This design requires more lines of assembly to do the same task but allows the CPU decoder to be simple, fast, and highly energy-efficient.",
        ],
        diagram: "cisc-risc-comparison",
        realLife: {
          title: "Real-life connection",
          text: "Think of CISC like a Swiss Army Knife containing specialized fold-out tools (corkscrew, scissors). Think of RISC like a set of high-quality individual screwdrivers. The Swiss Army knife can do everything in one tool but is bulky and harder to use, whereas the individual screwdrivers do one thing perfectly and are faster to swap.",
        },
        table: {
          caption: "CISC vs RISC Architectural Differences",
          headers: ["Feature", "CISC (e.g., Intel x86)", "RISC (e.g., ARM, RISC-V)"],
          rows: [
            ["Instruction Length", "Variable (1 to 15 bytes in x86)", "Fixed (usually 4 bytes / 32 bits)"],
            ["Memory Operations", "Any instruction can reference memory", "Only dedicated LOAD and STORE instructions"],
            ["Registers", "Fewer general-purpose registers (8 in IA-32)", "Many general-purpose registers (typically 32)"],
            ["Execution Time", "Variable number of clock cycles per instruction", "Single-cycle execution per instruction"],
            ["Decoder Complexity", "High (complex hardware control unit)", "Low (simple, hardwired control logic)"],
          ],
        },
      },
      {
        id: "x86-evolution",
        title: "The x86 Family Lineage",
        body: [
          "The Intel x86 architecture is the most famous example of a CISC processor, dominating the desktop and server markets for decades. It has evolved through major generations while maintaining backwards compatibility:",
          { type: "subheading", text: "1. 16-Bit Real Mode (8086)" },
          "Released in 1978. It had a 20-bit address bus (could access 1 Megabyte of RAM) and used segment registers (CS, DS, SS) multiplied by 16 to offset addresses. There was no memory protection; any program could overwrite operating system RAM.",
          { type: "subheading", text: "2. 32-Bit Protected Mode (80386 / IA-32)" },
          "Introduced in 1985. Registers expanded to 32 bits (EAX, EBX, EIP). The address bus grew to 32 bits, allowing 4 Gigabytes of addressable memory. It introduced hardware-level memory protection (privilege rings 0-3) and segment descriptors linked to the GDT, ensuring programs couldn't corrupt each other.",
          { type: "subheading", text: "3. 64-Bit Mode (x86-64 / AMD64)" },
          "Designed by AMD in 2003. Registers expanded to 64 bits (RAX, RBX, RIP), and the number of general-purpose registers doubled from 8 to 16 (adding R8-R15). This enabled direct addressing of massive datasets far exceeding 4 GB.",
        ],
        realLife: {
          title: "Real-life connection",
          text: "Backwards compatibility is why your modern 64-bit Intel Core i9 processor can still run 16-bit DOS games from 1985 without emulation. The processor starts up in 16-bit Real Mode when powered on, and the operating system must explicitly switch it into Protected and then Long Mode.",
        },
      },
      {
        id: "mobile-ecosystems",
        title: "Why RISC Rules Mobile and Embedded Systems",
        body: [
          "If x86 is so powerful, why doesn't your smartphone run on Intel? The answer is power consumption.",
          "Because RISC architectures like ARM have simple control units with minimal transistors, they consume a fraction of the electricity of x86 chips. Less power consumption means longer battery life and less heat dissipation, eliminating the need for cooling fans. This makes RISC the ideal choice for smartphones, tablets, IoT microcontrollers, and now even modern thin-and-light laptops (like Apple Silicon M-series).",
        ],
        table: {
          caption: "Processor Family Snapshots",
          headers: ["Architecture", "ISA Type", "Primary Domain", "Business Model"],
          rows: [
            ["Intel/AMD x86", "CISC", "Desktops, Laptops, High-Performance Servers", "Proprietary (Intel/AMD manufacture directly)"],
            ["ARM", "RISC", "Smartphones, Embedded devices, Single-board PCs", "IP Licensing (ARM designs the core; Apple/Samsung license it)"],
            ["RISC-V", "RISC", "IoT, Academic research, Custom accelerators", "Open-Source (Free royalty-free specification)"],
          ],
        },
      },
    ],
    keyTakeaways: [
      "CISC features complex, variable-length instructions decoded by hardware. RISC uses simple, fixed-length instructions, shifting complexity to the compiler.",
      "The x86 architecture evolved from 16-bit Real Mode (1 MB RAM, no protection) to 32-bit Protected Mode (4 GB RAM, rings) and 64-bit Long Mode.",
      "RISC processors (ARM, RISC-V) dominate mobile and embedded devices because their simpler logic uses much less power.",
    ],
  },
  "pipelining": {
    slug: "pipelining",
    level: "Advanced",
    duration: "5 days",
    preview: {
      summary:
        "Discover how pipelining lets a CPU overlap instruction execution stages to boost throughput. Study the classic 5-stage CPU pipeline (IF, ID, EX, MEM, WB) and analyze the architectural hazards (structural, data, control) that can stall execution.",
      highlights: [
        "The classic five-stage instruction execution pipeline stages",
        "Structural, Data, and Control hazards and their impacts",
        "Hazard mitigations: Stalling (bubbles), Forwarding, and Branch Prediction",
      ],
    },
    sections: [
      {
        id: "pipelining-basics",
        title: "Pipelining and Throughput",
        body: [
          "Without pipelining, a CPU executes instructions sequentially: it fetches an instruction, decodes it, executes it, accesses memory, and writes the result back before starting the next instruction. This means parts of the CPU sit idle during execution.",
          "Pipelining changes this by executing instructions like an assembly line. While Instruction 1 is being executed in the ALU, Instruction 2 is being decoded, and Instruction 3 is being fetched from memory. Although a single instruction still takes the same amount of time to complete (latency), the processor can complete one instruction every clock cycle (throughput).",
        ],
        diagram: "five-stage-pipeline",
        realLife: {
          title: "Real-life connection",
          text: "Think of doing laundry. If you wash, dry, fold, and put away one load of clothes before starting the next, your dryer sits empty while washing. In a pipelined laundry, as soon as the first load goes into the dryer, you put the second load in the washer, and the third load on the folding table.",
        },
      },
      {
        id: "pipeline-stages",
        title: "The Classic 5-Stage Pipeline",
        body: [
          "Most standard RISC processors divide the instruction lifecycle into five distinct stages, each controlled by separate hardware circuits:",
          { type: "subheading", text: "1. Instruction Fetch (IF)" },
          "The CPU reads the next instruction bytes from memory addresses indicated by the Program Counter (PC) and loads them into the Instruction Register.",
          { type: "subheading", text: "2. Instruction Decode (ID)" },
          "The control unit decodes the instruction opcode to see what operation to perform. It also reads operand values from the Register File.",
          { type: "subheading", text: "3. Execute (EX)" },
          "The Arithmetic Logic Unit (ALU) performs the actual calculation (e.g., adding two register values or calculating an effective memory address).",
          { type: "subheading", text: "4. Memory Access (MEM)" },
          "If the instruction is a load or store (like `LDR` or `STR`), the CPU reads from or writes to the cache/RAM address computed in the EX stage. Non-memory instructions skip this step.",
          { type: "subheading", text: "5. Write Back (WB)" },
          "The final calculated result or loaded memory value is written back into the target register inside the register file.",
        ],
        table: {
          caption: "5-Stage CPU Pipeline Stages Summary",
          headers: ["Stage", "Abbreviation", "Hardware Active", "Action"],
          rows: [
            ["Instruction Fetch", "IF", "Program Counter, Cache memory", "Read instruction from memory"],
            ["Instruction Decode", "ID", "Control Unit, Registers", "Determine instruction type and read register operands"],
            ["Execute", "EX", "Arithmetic Logic Unit (ALU)", "Perform operation or address calculation"],
            ["Memory Access", "MEM", "Data RAM / L1 Cache", "Read or write data if memory instruction"],
            ["Write Back", "WB", "Register File", "Save final result back to destination register"],
          ],
        },
      },
      {
        id: "pipeline-hazards",
        title: "Pipeline Hazards: What Breaks the Line?",
        body: [
          "Pipelining works perfectly until something disrupts the flow. These disruptions are called hazards, and they fall into three categories:",
          { type: "subheading", text: "1. Structural Hazards" },
          "Two instructions need the same hardware resource at the same time. For example, if a CPU has a single shared memory cache for both instructions and data, it cannot fetch a new instruction (IF) while another instruction is reading data from memory (MEM). This is solved by using separate instruction and data caches (Harvard architecture).",
          { type: "subheading", text: "2. Data Hazards" },
          "An instruction depends on the result of a previous instruction that is still moving through the pipeline. For example, if you write `ADD R1, R2, R3` followed by `SUB R4, R1, R5`, the subtraction needs `R1` during its Decode (ID) stage, but the addition won't write the updated `R1` until its Write-Back (WB) stage. To fix this, we can insert idle cycles (stalls or bubbles) or use forwarding (routing the ALU output directly back into the ALU input).",
          { type: "subheading", text: "3. Control Hazards" },
          "Caused by conditional branch instructions (like jumps). The CPU doesn't know which instruction to fetch next until the branch condition is evaluated in the EX stage. If the branch is taken, all instructions fetched in the meantime are wrong and must be discarded (flushed). Modern CPUs mitigate this using advanced branch prediction units that guess the outcome.",
        ],
        diagram: "pipeline-hazards",
      },
    ],
    keyTakeaways: [
      "Pipelining improves CPU instruction throughput by executing multiple instructions in parallel across different execution stages.",
      "The classic pipeline consists of five stages: Instruction Fetch (IF), Instruction Decode (ID), Execute (EX), Memory Access (MEM), and Write Back (WB).",
      "Hazards disrupt pipelining. Structural hazards require duplicate hardware; data hazards are resolved by stalling or forwarding; control hazards are handled via branch prediction and pipeline flushes.",
    ],
  },
  "computer-organization": {
    slug: "computer-organization",
    level: "Advanced",
    duration: "3 days",
    preview: {
      summary:
        "Synthesize all concepts from ISA, assembly language, memory layout, I/O ports, interrupts, and pipelining. Trace the end-to-end execution of a complete program down to the physical silicon.",
      highlights: [
        "Tracing a program from high-level variables down to CPU registers",
        "Coordinating memory hierarchy, caching, bus activity, and I/O devices",
        "Preparing for academic examinations and hands-on assembly projects",
      ],
    },
    sections: [
      {
        id: "capstone-integration",
        title: "From Code to Silicon: End-to-End System Integration",
        body: [
          "In this final capstone module, we trace how all elements of computer organization interact in a single system. Let's look at the flow:",
          "First, the programmer writes code in a high-level language like C++ or Rust. The compiler converts high-level loops and variables into assembly mnemonics, which the assembler turns into binary machine code (opcodes and operands) stored on disk as an executable.",
          "When the program is run, the OS loader maps this executable into RAM, setting the CPU's stack pointer (`ESP`) and program counter (`EIP`).",
          "The CPU begins the instruction cycle: fetching opcodes over the System Bus, decoding them, executing calculations in the ALU, and updating local variables inside the stack frame. If the program requests keyboard input, the CPU uses I/O instructions or awaits hardware interrupts. If multiple instructions execute simultaneously, the CPU pipeline coordinates dependencies, stalls, and forwarding paths automatically.",
        ],
        diagram: "computer-assembly-flow",
        realLife: {
          title: "Real-life connection",
          text: "When you play a video game, write a script, or load a webpage, this entire chain of events happens billions of times per second. Every layer — from the software variables to the physical transistors — must align perfectly for the system to function.",
        },
      },
      {
        id: "final-review",
        title: "Synthesis & Exam Review",
        body: [
          "To prepare for exams or practical projects, review these core design questions:",
        ],
        table: {
          caption: "Core Synthesis Review Scenarios",
          headers: ["Concept", "Key Question", "Architectural Solution"],
          rows: [
            ["Addressing vs Memory", "How does a CPU handle array traversal in memory?", "Using indexed and base-indexed addressing modes (`MOV EAX, [EBX + ESI*4]`) to scale offsets by element size."],
            ["Interrupts vs Polling", "When should you use interrupts instead of polling?", "Use interrupts for asynchronous events (keyboard, mouse) to free the CPU; use polling for high-speed transfers on single-task systems."],
            ["CISC vs RISC", "How does CPU design impact compiler difficulty?", "RISC requires compilers to schedule instructions and manage registers, while CISC compilers can call powerful multi-task instructions directly."],
          ],
        },
      },
    ],
    keyTakeaways: [
      "Computer Organization is the intersection of software and hardware. Program variables become CPU register values; branches become jumps.",
      "The System Bus, CPU Registers, ALU, Memory hierarchy, and Pipelining operate together to execute instructions at scale.",
      "Low-level programming enforces hardware awareness, making you a better engineer regardless of what language you use.",
    ],
  },
};

function getCoalTopicContent(slug) {
  return coalTopicContent[slug] || null;
}

function getCoalTopicsWithContent() {
  return Object.keys(coalTopicContent);
}

export { coalTopicContent, getCoalTopicContent, getCoalTopicsWithContent };
export default coalTopicContent;
