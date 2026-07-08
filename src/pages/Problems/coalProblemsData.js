/**
 * COAL course-specific problem data.
 * Covers Foundations, Number Systems, IA-32 registers, assembly, stack operations, caches, and pipelining.
 * Marked with isSynthetic: true since these are conceptual rather than logic-gate circuit designs.
 */

const rawProblems = [
  {
    id: 3001,
    title: "The Stored-Program Concept",
    difficulty: "Easy",
    tags: ["Architecture", "Foundations", "Von Neumann"],
    description: "In a Von Neumann architecture, both instructions and data reside in the same physical memory. During which phase of the instruction cycle is the instruction pointed to by the Program Counter (PC) copied into the Instruction Register (IR)?",
    hint: "The Program Counter holds the address of the next instruction. The CPU retrieves it from memory to analyze it.",
    inputs: ["PC"],
    outputs: ["IR"],
    type: "mcq",
    options: [
      "Decode phase",
      "Fetch phase",
      "Execute phase",
      "Writeback phase"
    ],
    correctAnswer: "Fetch phase"
  },
  {
    id: 3002,
    title: "Signed Byte Boundaries",
    difficulty: "Easy",
    tags: ["Number Systems", "Representation"],
    description: "What is the decimal value range that can be represented by a signed 8-bit byte using 2's complement notation?",
    hint: "For n bits, the range of signed integers is -2^(n-1) to 2^(n-1) - 1.",
    inputs: ["8 bits"],
    outputs: ["Range"],
    type: "mcq",
    options: [
      "-127 to +127",
      "0 to 255",
      "-128 to +127",
      "-256 to +255"
    ],
    correctAnswer: "-128 to +127"
  },
  {
    id: 3003,
    title: "Hex Address Offset",
    difficulty: "Medium",
    tags: ["Number Systems", "Memory"],
    description: "An array of 32-bit doublewords (DWORDs) starts at memory address 0x1000. What is the hexadecimal address of the 5th element (index 4) of this array? Enter the full address starting with 0x.",
    hint: "Each DWORD occupies 4 bytes. Element 4 is at byte offset 4 * 4 = 16 bytes. Convert 16 to hex and add it to 0x1000.",
    inputs: ["Base (0x1000)", "Index (4)"],
    outputs: ["Hex Address"],
    type: "fill_in",
    correctAnswer: "0x1010"
  },
  {
    id: 3004,
    title: "Intel Little Endian Layout",
    difficulty: "Medium",
    tags: ["IA-32", "Endianness"],
    description: "The 32-bit doubleword value 0x789ABCDE is stored in memory starting at address 0x2000 on a Little Endian system. What is the byte value stored at address 0x2002? Enter your answer as a 2-digit hex value (e.g. 9A).",
    hint: "In Little Endian, the least significant byte is stored at the lowest address. Address 0x2000 stores DE, 0x2001 stores BC, 0x2002 stores 9A, and 0x2003 stores 78.",
    inputs: ["Value (0x789ABCDE)", "Address (0x2000)"],
    outputs: ["Byte at 0x2002"],
    type: "fill_in",
    correctAnswer: "9A"
  },
  {
    id: 3005,
    title: "Sub-register Value Trace",
    difficulty: "Easy",
    tags: ["IA-32", "Registers"],
    description: "We load the value 0x12345678 into the register EAX. Then, we execute the instruction: 'MOV AX, 0x9ABC'. What is the final hexadecimal value of EAX? Enter your answer as an 8-digit hexadecimal number (e.g. 12349ABC).",
    hint: "AX is the lower 16 bits of EAX. Modifying AX does not affect the upper 16 bits of EAX (which are 0x1234).",
    inputs: ["EAX (0x12345678)"],
    outputs: ["EAX (final)"],
    type: "fill_in",
    correctAnswer: "12349ABC"
  },
  {
    id: 3006,
    title: "Signed Overflow Flag",
    difficulty: "Medium",
    tags: ["Flags", "ALU"],
    description: "An 8-bit AL register contains the signed value 0x7F (+127). The instruction 'ADD AL, 1' is executed. Which of the following flag settings is correct?",
    hint: "Adding 1 to +127 gives +128, which exceeds the signed 8-bit range, setting the Overflow Flag (OF = 1). Since there is no unsigned carry out of the MSB, CF = 0. The result is -128, which is not zero, so ZF = 0.",
    inputs: ["AL (0x7F)"],
    outputs: ["Flags"],
    type: "mcq",
    options: [
      "CF = 1, OF = 0, ZF = 0",
      "CF = 0, OF = 1, ZF = 0",
      "CF = 1, OF = 1, ZF = 1",
      "CF = 0, OF = 0, ZF = 1"
    ],
    correctAnswer: "CF = 0, OF = 1, ZF = 0"
  },
  {
    id: 3007,
    title: "Instruction Execution: XCHG",
    difficulty: "Easy",
    tags: ["Basic Instructions", "Data Transfer"],
    description: "Prior to execution, EAX contains 0x00001111 and EBX contains 0x00002222. The CPU executes:\n\nXCHG EAX, EBX\nADD EAX, EBX\n\nWhat is the decimal value of EBX after execution?",
    hint: "XCHG swaps EAX and EBX. EAX becomes 0x2222, EBX becomes 0x1111. ADD EAX, EBX adds 0x1111 to EAX, so EAX becomes 0x3333. EBX remains unchanged after the swap. Convert EBX (0x1111) to decimal.",
    inputs: ["EAX (0x1111)", "EBX (0x2222)"],
    outputs: ["EBX (decimal)"],
    type: "fill_in",
    correctAnswer: "4369"
  },
  {
    id: 3008,
    title: "Base-Indexed-Scale Addressing",
    difficulty: "Medium",
    tags: ["Addressing Modes", "Effective Address"],
    description: "Which addressing mode is used in the instruction: 'MOV EAX, [EBX + ESI * 4 + 12]'?",
    hint: "EBX is the base register, ESI is the index register, 4 is the scale factor, and 12 is the displacement.",
    inputs: ["Operand [EBX + ESI*4 + 12]"],
    outputs: ["Addressing Mode Name"],
    type: "mcq",
    options: [
      "Direct Addressing",
      "Register Indirect",
      "Base-Indexed-Displacement with Scale",
      "Immediate Addressing"
    ],
    correctAnswer: "Base-Indexed-Displacement with Scale"
  },
  {
    id: 3009,
    title: "Stack Pointer Alignment",
    difficulty: "Medium",
    tags: ["Procedures", "Stack"],
    description: "On a 32-bit x86 processor (where ESP points to top-of-stack and each stack element is 4 bytes), ESP is initially 0x00A0. We execute: \n\nPUSH EAX\nPUSH EBX\nPOP ECX\n\nWhat is the hexadecimal value of ESP after these operations? Enter your answer in the form 0x... (e.g. 0x009C).",
    hint: "Each PUSH decrements ESP by 4. Each POP increments ESP by 4. Two PUSHes and one POP result in a net change of -4 to ESP. 0x00A0 - 4 = 0x009C.",
    inputs: ["ESP (0x00A0)"],
    outputs: ["ESP (final)"],
    type: "fill_in",
    correctAnswer: "0x009C"
  },
  {
    id: 3010,
    title: "Signed vs Unsigned Jumps",
    difficulty: "Medium",
    tags: ["Control Flow", "Jumps"],
    description: "AL contains 0x80 (interpreted as signed -128) and BL contains 0x7F (interpreted as signed +127). The following instructions run:\n\nCMP AL, BL\nJG target_label\n\nDoes the jump to target_label occur, and why?",
    hint: "JG (Jump if Greater) is for signed comparison. AL (-128) is smaller than BL (+127), so the jump is not taken.",
    inputs: ["AL (0x80)", "BL (0x7F)"],
    outputs: ["Jump Taken?"],
    type: "mcq",
    options: [
      "Yes, because 0x80 is numerically greater than 0x7F as unsigned values.",
      "No, because JG is a signed comparison and -128 is less than +127.",
      "Yes, because JG is a signed comparison and +127 is less than -128.",
      "No, because AL and BL are equal in size."
    ],
    correctAnswer: "No, because JG is a signed comparison and -128 is less than +127."
  },
  {
    id: 3011,
    title: "Cache Mapping & Hits",
    difficulty: "Hard",
    tags: ["Memory Hierarchy", "Cache"],
    description: "A direct-mapped cache has 8 blocks of 16 bytes each. Memory is byte-addressable. The CPU performs reads in order from the following byte addresses: 0x10, 0x18, 0x14, 0x90. How many cache HITS occur?",
    hint: "Block size = 16 bytes. Address 0x10, 0x18, and 0x14 map to block index 1 (address / 16 = 1). The first read 0x10 is a miss (block 1 is loaded). The second read (0x18) is a hit. The third read (0x14) is also a hit. Address 0x90 maps to block index 1 (0x90 / 16 = 9. 9 mod 8 = 1), causing a conflict/miss. Hits = 2.",
    inputs: ["Reads: 0x10, 0x18, 0x14, 0x90"],
    outputs: ["Total Hits"],
    type: "fill_in",
    correctAnswer: "2"
  },
  {
    id: 3012,
    title: "Instruction Set Philosophy",
    difficulty: "Easy",
    tags: ["Processor Families", "Architecture"],
    description: "Which of the following is a key characteristic of a RISC (Reduced Instruction Set Computer) design?",
    hint: "RISC prioritizes simple, uniform-length instructions that execute in one clock cycle, only allowing explicit load/store instructions to touch memory.",
    inputs: ["Design Principles"],
    outputs: ["Key Feature"],
    type: "mcq",
    options: [
      "Variable-length instructions to conserve RAM",
      "Direct memory-to-memory operations for arithmetic",
      "Large instructions set with complex specialized tasks",
      "Single-cycle execution for most instructions using a Load-Store model"
    ],
    correctAnswer: "Single-cycle execution for most instructions using a Load-Store model"
  },
  {
    id: 3013,
    title: "Data Hazards in Pipelining",
    difficulty: "Hard",
    tags: ["Pipelining", "Hazards"],
    description: "Consider the pipeline execution sequence:\n\n1. ADD R1, R2, R3 (Writes to R1)\n2. SUB R4, R1, R5 (Reads from R1)\n\nWhat type of hazard exists between these two instructions?",
    hint: "Instruction 2 attempts to read R1 before Instruction 1 has written the updated value to R1. This is a classic RAW hazard.",
    inputs: ["Instructions (ADD, SUB)"],
    outputs: ["Hazard Type"],
    type: "mcq",
    options: [
      "Structural Hazard",
      "Control Hazard",
      "RAW (Read After Write) Data Hazard",
      "WAW (Write After Write) Data Hazard"
    ],
    correctAnswer: "RAW (Read After Write) Data Hazard"
  },
  {
    id: 3014,
    title: "Interrupt Vector Address",
    difficulty: "Medium",
    tags: ["Interrupts", "I/O"],
    description: "In real-mode x86, the Interrupt Vector Table (IVT) starts at address 0x00000000. Each vector is 4 bytes long (2 bytes for segment, 2 bytes for offset). What is the starting hexadecimal memory address of the vector for Interrupt 8 (INT 8)? Enter in 0x... format (e.g. 0x0020).",
    hint: "Vector address = Interrupt Number * 4 bytes. For INT 8, starting address is 8 * 4 = 32. 32 in hex is 20 (0x0020).",
    inputs: ["INT 8"],
    outputs: ["Address Offset"],
    type: "fill_in",
    correctAnswer: "0x0020"
  },
  {
    id: 3015,
    title: "Loop Execution Counts",
    difficulty: "Medium",
    tags: ["Control Flow", "Loops"],
    description: "Consider the following assembly block:\n\nMOV ECX, 5\nouter:\n  PUSH ECX\n  MOV ECX, 3\ninner:\n  DEC ECX\n  JNZ inner\n  POP ECX\n  LOOP outer\n\nHow many total times does the 'DEC ECX' instruction execute?",
    hint: "The outer loop runs 5 times (controlled by ECX which is pushed/popped). Each time, the inner loop runs 3 times (ECX decreases from 3 to 0). Total executes = 5 * 3 = 15.",
    inputs: ["ECX (5, 3)"],
    outputs: ["Executions count"],
    type: "fill_in",
    correctAnswer: "15"
  }
];

export default rawProblems;
