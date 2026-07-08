import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Play,
  SkipForward,
  RotateCcw,
  BookOpen,
  Info,
  History,
  FileCode,
  Download,
  Upload,
  Save,
  Trash2,
  CheckCircle,
  HelpCircle,
  Code
} from "lucide-react";
import { Navbar } from "../Home/Navbar";
import Footer from "../Home/Footer";
import { useTheme } from "../../context/ThemeContext";
import usePointerGlow from "../../hooks/usePointerGlow";
import { coalCourseMeta } from "../../data/coalCourseOutline";
import "./AssemblyDrillsPage.css";
import "../Home/Home.css";
import "../LearningResources/LearningResourcesPage.css";

const COAL_ACCENT = coalCourseMeta.accent;

// Preloaded templates matching student requirements
const TEMPLATES = {
  largest: {
    title: "Largest Number",
    description: "Finds the largest value in a 5-element array starting at 0x1000, and writes the result to 0x1010.",
    memory: [
      { addr: 0x1000, val: 12 },
      { addr: 0x1001, val: 45 },
      { addr: 0x1002, val: 8 },
      { addr: 0x1003, val: 23 },
      { addr: 0x1004, val: 5 }
    ],
    code: `; Find the largest number in a 5-element array
MOV SI, 0x1000  ; Point to the array start
MOV AL, [SI]    ; Load first element as initial max
MOV CX, 4       ; Loop counter for remaining 4 elements

find_max:
INC SI          ; Move to next memory address
MOV BL, [SI]    ; Load next element into BL
CMP BL, AL      ; Compare BL with current max (AL)
JLE skip_new_max ; If BL <= AL, skip updating max
MOV AL, BL      ; Update max to BL

skip_new_max:
LOOP find_max
MOV [0x1010], AL ; Store the largest value at 0x1010
`
  },
  smallest: {
    title: "Smallest Number",
    description: "Finds the smallest value in a 5-element array starting at 0x1000, and writes it to 0x1010.",
    memory: [
      { addr: 0x1000, val: 12 },
      { addr: 0x1001, val: 45 },
      { addr: 0x1002, val: 8 },
      { addr: 0x1003, val: 23 },
      { addr: 0x1004, val: 5 }
    ],
    code: `; Find the smallest number in a 5-element array
MOV SI, 0x1000  ; Point to the array start
MOV AL, [SI]    ; Load first element as initial min
MOV CX, 4       ; Loop counter for remaining 4 elements

find_min:
INC SI          ; Move to next address
MOV BL, [SI]    ; Load next element into BL
CMP BL, AL      ; Compare BL with current min (AL)
JGE skip_new_min ; If BL >= AL, skip updating min
MOV AL, BL      ; Update min to BL

skip_new_min:
LOOP find_min
MOV [0x1010], AL ; Store the smallest value at 0x1010
`
  },
  factorial: {
    title: "Factorial",
    description: "Calculates N! for the value loaded from memory address 0x1000. Result is written to 0x1010.",
    memory: [
      { addr: 0x1000, val: 5 } // 5! = 120
    ],
    code: `; Calculate factorial of value at 0x1000
MOV AL, [0x1000] ; Load N
MOV BL, AL       ; Copy N to BL
DEC BL           ; Start multiplier at N - 1

fact_loop:
CMP BL, 1        ; Check if multiplier is 1
JE done          ; If BL == 1, we are done
MUL BL           ; AL = AL * BL (Note: simple 8-bit mul)
DEC BL           ; Decrement multiplier
JMP fact_loop    ; Repeat loop

done:
MOV [0x1010], AL ; Store factorial result at 0x1010
`
  },
  fibonacci: {
    title: "Fibonacci Sequence",
    description: "Generates Fibonacci sequence up to N elements (from address 0x1000) and stores them in RAM starting at 0x1010.",
    memory: [
      { addr: 0x1000, val: 6 } // Generate 6 terms
    ],
    code: `; Generate Fibonacci sequence up to N elements
MOV CX, [0x1000] ; Load length N
MOV SI, 0x1010   ; Output memory address
MOV AL, 0        ; First term (0)
MOV [SI], AL
DEC CX
JZ done          ; Stop if N == 1

INC SI
MOV BL, 1        ; Second term (1)
MOV [SI], BL
DEC CX
JZ done          ; Stop if N == 2

fib_loop:
INC SI
MOV DL, AL       ; Temp copy of F(n-2)
ADD DL, BL       ; DL = F(n-2) + F(n-1)
MOV [SI], DL     ; Store F(n)
MOV AL, BL       ; Shift: F(n-2) = F(n-1)
MOV BL, DL       ; Shift: F(n-1) = F(n)
LOOP fib_loop    ; Repeat N-2 times

done:
`
  },
  reverse: {
    title: "String Reverse",
    description: "Reverses a 5-character string ('Hello' -> 'olleH') starting at address 0x1000, pushing it to stack and popping to 0x1010.",
    memory: [
      { addr: 0x1000, val: 72 }, // 'H'
      { addr: 0x1001, val: 101 }, // 'e'
      { addr: 0x1002, val: 108 }, // 'l'
      { addr: 0x1003, val: 108 }, // 'l'
      { addr: 0x1004, val: 111 }  // 'o'
    ],
    code: `; Reverse 5-character string from 0x1000 to 0x1010
MOV SI, 0x1000   ; Source string address
MOV DI, 0x1010   ; Destination address
MOV CX, 5        ; Loop counter

push_loop:
MOV AL, [SI]     ; Load character
PUSH AX          ; Push to stack (note: pushes 16-bit AX)
INC SI           ; Next character
LOOP push_loop   ; Repeat 5 times

MOV CX, 5        ; Reset loop counter
pop_loop:
POP AX           ; Pop reversed character
MOV [DI], AL     ; Save to destination
INC DI           ; Next index
LOOP pop_loop    ; Repeat 5 times
`
  },
  arraysum: {
    title: "Array Sum",
    description: "Calculates the sum of 5 elements starting at 0x1000 and writes the sum to 0x1010.",
    memory: [
      { addr: 0x1000, val: 5 },
      { addr: 0x1001, val: 10 },
      { addr: 0x1002, val: 15 },
      { addr: 0x1003, val: 20 },
      { addr: 0x1004, val: 25 }
    ],
    code: `; Sum elements of array
MOV SI, 0x1000   ; Point to array start
MOV AX, 0        ; Clear accumulator
MOV CX, 5        ; Array length

sum_loop:
MOV BL, [SI]     ; Load element into BL
ADD AX, BX       ; Add BL value to AX
INC SI           ; Point to next element
LOOP sum_loop    ; Repeat

MOV [0x1010], AX ; Write total sum to 0x1010
`
  },
  bubblesort: {
    title: "Bubble Sort",
    description: "Sorts a 5-element array starting at 0x1000 in ascending order using nested loops.",
    memory: [
      { addr: 0x1000, val: 40 },
      { addr: 0x1001, val: 10 },
      { addr: 0x1002, val: 50 },
      { addr: 0x1003, val: 20 },
      { addr: 0x1004, val: 30 }
    ],
    code: `; Bubble sort array of 5 elements starting at 0x1000
MOV CX, 4         ; Outer loop limit (N - 1)

outer_loop:
PUSH CX           ; Save outer loop counter
MOV SI, 0x1000    ; Reset pointer to start of array
MOV CX, 4         ; Inner loop count

inner_loop:
MOV AL, [SI]      ; Load current element
MOV BL, [SI+1]    ; Load next element
CMP AL, BL        ; Compare them
JLE no_swap       ; If AL <= BL, no swap needed
MOV [SI], BL      ; Swap elements in memory
MOV [SI+1], AL

no_swap:
INC SI            ; Move to next index
LOOP inner_loop   ; Repeat inner comparison

POP CX            ; Restore outer loop counter
LOOP outer_loop   ; Repeat passes
`
  }
};

const DEFAULT_REGISTERS = {
  EAX: 0,
  EBX: 0,
  ECX: 0,
  EDX: 0,
  ESI: 0x1000,
  EDI: 0x1010,
  ESP: 0x2000, // Top of Stack
  EBP: 0x2000,
  EIP: 0
};

const DEFAULT_FLAGS = {
  CF: 0, // Carry
  ZF: 0, // Zero
  OF: 0, // Overflow
  SF: 0, // Sign
  AF: 0, // Auxiliary
  PF: 0  // Parity
};

export default function AssemblyDrillsPage() {
  const { theme, toggle: toggleTheme } = useTheme();
  const glowRootRef = usePointerGlow({ color: COAL_ACCENT, alpha: 0.2 });

  // Workspace code state
  const [code, setCode] = useState(TEMPLATES.largest.code);
  const [selectedTemplate, setSelectedTemplate] = useState("largest");

  // Registers & Flags
  const [registers, setRegisters] = useState({ ...DEFAULT_REGISTERS });
  const [prevRegisters, setPrevRegisters] = useState({ ...DEFAULT_REGISTERS });
  const [flags, setFlags] = useState({ ...DEFAULT_FLAGS });
  const [prevFlags, setPrevFlags] = useState({ ...DEFAULT_FLAGS });
  const [stack, setStack] = useState([]); // Stack simulation memory array: [{ addr, val }]

  // 256-byte Simulated Memory (0x1000 to 0x10FF)
  const [memory, setMemory] = useState(() => {
    const mem = Array(256).fill(0);
    // Preload largest number defaults
    TEMPLATES.largest.memory.forEach(item => {
      mem[item.addr - 0x1000] = item.val;
    });
    return mem;
  });
  const [prevMemory, setPrevMemory] = useState(Array(256).fill(0));

  // Simulation Control States
  const [isRunning, setIsRunning] = useState(false);
  const [currentLine, setCurrentLine] = useState(null); // Highlight index
  const [logs, setLogs] = useState(["IDE initialized. Select a template or write code to begin."]);
  const [explanation, setExplanation] = useState("No instruction currently executing. Load a program or write assembly code, then click Step or Run.");
  
  // Execution variables
  const [parsedLines, setParsedLines] = useState([]);
  const [labelMap, setLabelMap] = useState({});
  const [lineMappings, setLineMappings] = useState([]); // Maps index in parsedLines to absolute editor line index
  
  // Local storage management
  const [savedPrograms, setSavedPrograms] = useState([]);
  const [saveName, setSaveName] = useState("");
  
  // Address jump input
  const [jumpAddrInput, setJumpAddrInput] = useState("0x1000");
  const [highlightedMemCell, setHighlightedMemCell] = useState(null);

  // File upload input ref
  const fileInputRef = useRef(null);

  // Scroll active log to bottom
  const logsEndRef = useRef(null);
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Load saved programs index on mount
  useEffect(() => {
    const list = localStorage.getItem("dls_asm_programs");
    if (list) {
      try {
        setSavedPrograms(JSON.parse(list));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Sync templates selection with code & preloaded memory
  const handleTemplateChange = (key) => {
    if (!TEMPLATES[key]) return;
    setSelectedTemplate(key);
    setCode(TEMPLATES[key].code);
    resetSimulation();
    
    // Clear and preload new memory mapping
    const newMem = Array(256).fill(0);
    if (TEMPLATES[key].memory) {
      TEMPLATES[key].memory.forEach(item => {
        newMem[item.addr - 0x1000] = item.val;
      });
    }
    setMemory(newMem);
    setPrevMemory(newMem);
    addLog(`Loaded template: "${TEMPLATES[key].title}" and initialized default memory space.`);
  };

  const addLog = (msg, type = "info") => {
    setLogs(prev => [...prev, `${type.toUpperCase()}: ${msg}`]);
  };

  // --- ASSEMBLY COMPILER / INTERPRETER ---
  const parseCode = () => {
    const lines = code.split("\n");
    const parsed = [];
    const labels = {};
    const mappings = [];

    let parsedIndex = 0;
    lines.forEach((originalLine, lineIndex) => {
      // Remove comments and trim
      const cleanLine = originalLine.split(";")[0].trim();
      if (!cleanLine) return; // skip empty lines

      // Check for labels (e.g. "label_name:")
      const labelMatch = cleanLine.match(/^([a-zA-Z0-9_\$]+)\s*:/);
      if (labelMatch) {
        const label = labelMatch[1].toLowerCase();
        labels[label] = parsedIndex;
        
        // Check if there is an instruction inline after label (e.g. "label: MOV AX, 5")
        const instructionPart = cleanLine.substring(labelMatch[0].length).trim();
        if (instructionPart) {
          parsed.push(parseInstructionLine(instructionPart));
          mappings.push(lineIndex);
          parsedIndex++;
        }
      } else {
        parsed.push(parseInstructionLine(cleanLine));
        mappings.push(lineIndex);
        parsedIndex++;
      }
    });

    setParsedLines(parsed);
    setLabelMap(labels);
    setLineMappings(mappings);
    return { parsed, labels, mappings };
  };

  const parseInstructionLine = (line) => {
    const parts = line.split(/\s+/);
    const opcode = parts[0].toUpperCase();
    const rest = line.substring(parts[0].length).trim();
    
    // Split arguments by comma
    const operands = rest ? rest.split(",").map(o => o.trim()) : [];
    return { opcode, operands, originalText: line };
  };

  // --- SUB-REGISTERS READ/WRITE HELPERS ---
  const getRegValue = (regName, regs) => {
    const name = regName.toUpperCase();
    if (name === "EAX") return regs.EAX;
    if (name === "EBX") return regs.EBX;
    if (name === "ECX") return regs.ECX;
    if (name === "EDX") return regs.EDX;
    if (name === "ESI") return regs.ESI;
    if (name === "EDI") return regs.EDI;
    if (name === "ESP") return regs.ESP;
    if (name === "EBP") return regs.EBP;
    if (name === "EIP") return regs.EIP;

    if (name === "AX") return regs.EAX & 0xFFFF;
    if (name === "BX") return regs.EBX & 0xFFFF;
    if (name === "CX") return regs.ECX & 0xFFFF;
    if (name === "DX") return regs.EDX & 0xFFFF;
    if (name === "SI") return regs.ESI & 0xFFFF;
    if (name === "DI") return regs.EDI & 0xFFFF;
    if (name === "SP") return regs.ESP & 0xFFFF;
    if (name === "BP") return regs.EBP & 0xFFFF;
    if (name === "IP") return regs.EIP & 0xFFFF;

    if (name === "AL") return regs.EAX & 0xFF;
    if (name === "BL") return regs.EBX & 0xFF;
    if (name === "CL") return regs.ECX & 0xFF;
    if (name === "DL") return regs.EDX & 0xFF;

    if (name === "AH") return (regs.EAX >> 8) & 0xFF;
    if (name === "BH") return (regs.EBX >> 8) & 0xFF;
    if (name === "CH") return (regs.ECX >> 8) & 0xFF;
    if (name === "DH") return (regs.EDX >> 8) & 0xFF;

    return 0;
  };

  const setRegValue = (regName, val, regs) => {
    const name = regName.toUpperCase();
    const updated = { ...regs };
    const num = Math.floor(Number(val)) & 0xFFFFFFFF; // 32-bit boundary clamp

    if (name === "EAX") updated.EAX = num;
    else if (name === "EBX") updated.EBX = num;
    else if (name === "ECX") updated.ECX = num;
    else if (name === "EDX") updated.EDX = num;
    else if (name === "ESI") updated.ESI = num;
    else if (name === "EDI") updated.EDI = num;
    else if (name === "ESP") updated.ESP = num;
    else if (name === "EBP") updated.EBP = num;
    else if (name === "EIP") updated.EIP = num;

    else if (name === "AX") updated.EAX = (updated.EAX & 0xFFFF0000) | (num & 0xFFFF);
    else if (name === "BX") updated.EBX = (updated.EBX & 0xFFFF0000) | (num & 0xFFFF);
    else if (name === "CX") updated.ECX = (updated.ECX & 0xFFFF0000) | (num & 0xFFFF);
    else if (name === "DX") updated.EDX = (updated.EDX & 0xFFFF0000) | (num & 0xFFFF);
    else if (name === "SI") updated.ESI = (updated.ESI & 0xFFFF0000) | (num & 0xFFFF);
    else if (name === "DI") updated.EDI = (updated.EDI & 0xFFFF0000) | (num & 0xFFFF);
    else if (name === "SP") updated.ESP = (updated.ESP & 0xFFFF0000) | (num & 0xFFFF);
    else if (name === "BP") updated.EBP = (updated.EBP & 0xFFFF0000) | (num & 0xFFFF);
    else if (name === "IP") updated.EIP = (updated.EIP & 0xFFFF0000) | (num & 0xFFFF);

    else if (name === "AL") updated.EAX = (updated.EAX & 0xFFFFFF00) | (num & 0xFF);
    else if (name === "BL") updated.EBX = (updated.EBX & 0xFFFFFF00) | (num & 0xFF);
    else if (name === "CL") updated.ECX = (updated.ECX & 0xFFFFFF00) | (num & 0xFF);
    else if (name === "DL") updated.EDX = (updated.EDX & 0xFFFFFF00) | (num & 0xFF);

    else if (name === "AH") updated.EAX = (updated.EAX & 0xFFFF00FF) | ((num & 0xFF) << 8);
    else if (name === "BH") updated.EBX = (updated.EBX & 0xFFFF00FF) | ((num & 0xFF) << 8);
    else if (name === "CH") updated.ECX = (updated.ECX & 0xFFFF00FF) | ((num & 0xFF) << 8);
    else if (name === "DH") updated.EDX = (updated.EDX & 0xFFFF00FF) | ((num & 0xFF) << 8);

    return updated;
  };

  // --- RESOLVE MEMORY ADDRESSES ---
  const resolveAddress = (addrExpr, regs) => {
    // Strips brackets and whitespace
    const cleanExpr = addrExpr.replace(/[\[\]\s]/g, "");

    // Reg + Offset, e.g. SI+1 or SI-2
    const dispMatch = cleanExpr.match(/^([a-zA-Z]+)([\+\-])(\d+|0x[0-9a-fA-F]+)$/);
    if (dispMatch) {
      const regName = dispMatch[1];
      const op = dispMatch[2];
      const offset = dispMatch[3].startsWith("0x") ? parseInt(dispMatch[3], 16) : parseInt(dispMatch[3], 10);
      const regVal = getRegValue(regName, regs);
      return op === "+" ? regVal + offset : regVal - offset;
    }

    // Direct Register, e.g. SI
    if (/^[a-zA-Z]+$/.test(cleanExpr)) {
      return getRegValue(cleanExpr, regs);
    }

    // Direct Address constant, e.g. 0x1000
    if (cleanExpr.startsWith("0x")) {
      return parseInt(cleanExpr, 16);
    }
    return parseInt(cleanExpr, 10);
  };

  // --- RESOLVE OPERAND VALUES ---
  const resolveOperand = (operand, regs, mem) => {
    if (!operand) return 0;
    
    // Memory pointer e.g. [SI] or [0x1000]
    if (operand.startsWith("[") && operand.endsWith("]")) {
      const addr = resolveAddress(operand, regs);
      const memOffset = addr - 0x1000;
      if (memOffset >= 0 && memOffset < 256) {
        return mem[memOffset];
      }
      addLog(`Segmentation Fault: Read from address ${operand} (0x${addr.toString(16).toUpperCase()}) failed.`, "error");
      return 0;
    }

    // Register Reference
    if (/^[a-zA-Z]+$/.test(operand)) {
      return getRegValue(operand, regs);
    }

    // Constants
    if (operand.startsWith("0x")) {
      return parseInt(operand, 16);
    }
    return parseInt(operand, 10) || 0;
  };

  // --- WRITE OPERAND VALUE ---
  const writeOperand = (operand, value, regs, mem, newStack) => {
    // Set Memory value
    if (operand.startsWith("[") && operand.endsWith("]")) {
      const addr = resolveAddress(operand, regs);
      const memOffset = addr - 0x1000;
      if (memOffset >= 0 && memOffset < 256) {
        const updatedMem = [...mem];
        updatedMem[memOffset] = value & 0xFF; // byte width write clamp
        setMemory(updatedMem);
        return { regs, mem: updatedMem, stack: newStack };
      }
      addLog(`Segmentation Fault: Write to address 0x${addr.toString(16).toUpperCase()} failed.`, "error");
      return { regs, mem, stack: newStack };
    }

    // Set Register value
    if (/^[a-zA-Z]+$/.test(operand)) {
      const updatedRegs = setRegValue(operand, value, regs);
      return { regs: updatedRegs, mem, stack: newStack };
    }

    addLog(`Runtime Error: Invalid target operand for write "${operand}"`, "error");
    return { regs, mem, stack: newStack };
  };

  // --- RUN SINGLE STEP INTERPRETATION ---
  const executeStep = () => {
    // Compile on the fly if starting
    let activeParsed = parsedLines;
    let activeLabels = labelMap;
    let activeMappings = lineMappings;

    if (activeParsed.length === 0) {
      const compilation = parseCode();
      activeParsed = compilation.parsed;
      activeLabels = compilation.labels;
      activeMappings = compilation.mappings;
    }

    if (activeParsed.length === 0) {
      addLog("No executable assembly instructions found.", "error");
      return false;
    }

    const ip = registers.EIP;
    if (ip < 0 || ip >= activeParsed.length) {
      addLog("Program execution completed.", "success");
      setCurrentLine(null);
      setIsRunning(false);
      return false;
    }

    // Save previous state to highlight changes
    setPrevRegisters({ ...registers });
    setPrevFlags({ ...flags });
    setPrevMemory([...memory]);

    const instr = activeParsed[ip];
    const originalLineIdx = activeMappings[ip];
    setCurrentLine(originalLineIdx);

    // Dynamic Learning Explanation Translator
    updateInstructionExplanation(instr);

    // Decode Opcode
    const opcode = instr.opcode;
    const ops = instr.operands;

    let nextIp = ip + 1;
    let updatedRegs = { ...registers };
    let updatedFlags = { ...flags };
    let updatedStack = [...stack];
    let updatedMem = [...memory];

    try {
      switch (opcode) {
        case "MOV": {
          if (ops.length !== 2) throw new Error("MOV requires exactly 2 operands.");
          const srcVal = resolveOperand(ops[1], updatedRegs, updatedMem);
          const result = writeOperand(ops[0], srcVal, updatedRegs, updatedMem, updatedStack);
          updatedRegs = result.regs;
          updatedMem = result.mem;
          break;
        }

        case "ADD": {
          if (ops.length !== 2) throw new Error("ADD requires exactly 2 operands.");
          const destVal = resolveOperand(ops[0], updatedRegs, updatedMem);
          const srcVal = resolveOperand(ops[1], updatedRegs, updatedMem);
          const sum = destVal + srcVal;
          
          // Flags Calculation
          updatedFlags.ZF = (sum & 0xFF) === 0 ? 1 : 0;
          updatedFlags.SF = (sum & 0x80) ? 1 : 0;
          updatedFlags.CF = sum > 0xFF ? 1 : 0;
          updatedFlags.OF = ((destVal & 0x80) === (srcVal & 0x80) && (sum & 0x80) !== (destVal & 0x80)) ? 1 : 0;
          
          const result = writeOperand(ops[0], sum, updatedRegs, updatedMem, updatedStack);
          updatedRegs = result.regs;
          updatedMem = result.mem;
          break;
        }

        case "SUB": {
          if (ops.length !== 2) throw new Error("SUB requires exactly 2 operands.");
          const destVal = resolveOperand(ops[0], updatedRegs, updatedMem);
          const srcVal = resolveOperand(ops[1], updatedRegs, updatedMem);
          const diff = destVal - srcVal;
          
          // Flags Calculation
          updatedFlags.ZF = (diff & 0xFF) === 0 ? 1 : 0;
          updatedFlags.SF = (diff & 0x80) ? 1 : 0;
          updatedFlags.CF = destVal < srcVal ? 1 : 0;
          updatedFlags.OF = ((destVal & 0x80) !== (srcVal & 0x80) && (diff & 0x80) !== (destVal & 0x80)) ? 1 : 0;
          
          const result = writeOperand(ops[0], diff, updatedRegs, updatedMem, updatedStack);
          updatedRegs = result.regs;
          updatedMem = result.mem;
          break;
        }

        case "INC": {
          if (ops.length !== 1) throw new Error("INC requires exactly 1 operand.");
          const val = resolveOperand(ops[0], updatedRegs, updatedMem);
          const sum = val + 1;
          
          updatedFlags.ZF = (sum & 0xFF) === 0 ? 1 : 0;
          updatedFlags.SF = (sum & 0x80) ? 1 : 0;
          // Note: INC does not modify Carry Flag CF
          
          const result = writeOperand(ops[0], sum, updatedRegs, updatedMem, updatedStack);
          updatedRegs = result.regs;
          updatedMem = result.mem;
          break;
        }

        case "DEC": {
          if (ops.length !== 1) throw new Error("DEC requires exactly 1 operand.");
          const val = resolveOperand(ops[0], updatedRegs, updatedMem);
          const diff = val - 1;
          
          updatedFlags.ZF = (diff & 0xFF) === 0 ? 1 : 0;
          updatedFlags.SF = (diff & 0x80) ? 1 : 0;
          
          const result = writeOperand(ops[0], diff, updatedRegs, updatedMem, updatedStack);
          updatedRegs = result.regs;
          updatedMem = result.mem;
          break;
        }

        case "MUL": {
          if (ops.length !== 1) throw new Error("MUL requires 1 multiplier operand (multiplies AL).");
          const alVal = getRegValue("AL", updatedRegs);
          const multiplier = resolveOperand(ops[0], updatedRegs, updatedMem);
          const prod = alVal * multiplier;
          
          updatedRegs = setRegValue("AX", prod, updatedRegs);
          updatedFlags.CF = prod > 0xFF ? 1 : 0;
          updatedFlags.OF = prod > 0xFF ? 1 : 0;
          updatedFlags.ZF = (prod & 0xFF) === 0 ? 1 : 0;
          break;
        }

        case "DIV": {
          if (ops.length !== 1) throw new Error("DIV requires 1 divisor operand.");
          const divisor = resolveOperand(ops[0], updatedRegs, updatedMem);
          if (divisor === 0) throw new Error("Division by Zero exception.");
          const axVal = getRegValue("AX", updatedRegs);
          const quotient = Math.floor(axVal / divisor) & 0xFF;
          const remainder = (axVal % divisor) & 0xFF;
          
          // AL stores Quotient, AH stores Remainder
          updatedRegs = setRegValue("AL", quotient, updatedRegs);
          updatedRegs = setRegValue("AH", remainder, updatedRegs);
          break;
        }

        case "CMP": {
          if (ops.length !== 2) throw new Error("CMP requires exactly 2 operands.");
          const destVal = resolveOperand(ops[0], updatedRegs, updatedMem);
          const srcVal = resolveOperand(ops[1], updatedRegs, updatedMem);
          const diff = destVal - srcVal;
          
          // Flags update only, register target unchanged
          updatedFlags.ZF = diff === 0 ? 1 : 0;
          updatedFlags.SF = diff < 0 ? 1 : 0;
          updatedFlags.CF = destVal < srcVal ? 1 : 0;
          updatedFlags.OF = (destVal < 0 !== srcVal < 0) && (diff < 0 !== destVal < 0) ? 1 : 0;
          break;
        }

        case "XCHG": {
          if (ops.length !== 2) throw new Error("XCHG requires exactly 2 operands.");
          const val1 = resolveOperand(ops[0], updatedRegs, updatedMem);
          const val2 = resolveOperand(ops[1], updatedRegs, updatedMem);
          
          const step1 = writeOperand(ops[0], val2, updatedRegs, updatedMem, updatedStack);
          const step2 = writeOperand(ops[1], val1, step1.regs, step1.mem, step1.stack);
          updatedRegs = step2.regs;
          updatedMem = step2.mem;
          break;
        }

        case "JMP": {
          if (ops.length !== 1) throw new Error("JMP requires a target label.");
          const target = ops[0].toLowerCase();
          if (activeLabels[target] === undefined) throw new Error(`Label "${target}" not found.`);
          nextIp = activeLabels[target];
          break;
        }

        case "JE":
        case "JZ": {
          if (ops.length !== 1) throw new Error("JE/JZ requires a target label.");
          if (updatedFlags.ZF === 1) {
            const target = ops[0].toLowerCase();
            if (activeLabels[target] === undefined) throw new Error(`Label "${target}" not found.`);
            nextIp = activeLabels[target];
          }
          break;
        }

        case "JNE":
        case "JNZ": {
          if (ops.length !== 1) throw new Error("JNE/JNZ requires a target label.");
          if (updatedFlags.ZF === 0) {
            const target = ops[0].toLowerCase();
            if (activeLabels[target] === undefined) throw new Error(`Label "${target}" not found.`);
            nextIp = activeLabels[target];
          }
          break;
        }

        case "JG": {
          if (ops.length !== 1) throw new Error("JG requires a target label.");
          if (updatedFlags.ZF === 0 && updatedFlags.SF === updatedFlags.OF) {
            const target = ops[0].toLowerCase();
            if (activeLabels[target] === undefined) throw new Error(`Label "${target}" not found.`);
            nextIp = activeLabels[target];
          }
          break;
        }

        case "JGE": {
          if (ops.length !== 1) throw new Error("JGE requires a target label.");
          if (updatedFlags.SF === updatedFlags.OF) {
            const target = ops[0].toLowerCase();
            if (activeLabels[target] === undefined) throw new Error(`Label "${target}" not found.`);
            nextIp = activeLabels[target];
          }
          break;
        }

        case "JL": {
          if (ops.length !== 1) throw new Error("JL requires a target label.");
          if (updatedFlags.SF !== updatedFlags.OF) {
            const target = ops[0].toLowerCase();
            if (activeLabels[target] === undefined) throw new Error(`Label "${target}" not found.`);
            nextIp = activeLabels[target];
          }
          break;
        }

        case "JLE": {
          if (ops.length !== 1) throw new Error("JLE requires a target label.");
          if (updatedFlags.ZF === 1 || updatedFlags.SF !== updatedFlags.OF) {
            const target = ops[0].toLowerCase();
            if (activeLabels[target] === undefined) throw new Error(`Label "${target}" not found.`);
            nextIp = activeLabels[target];
          }
          break;
        }

        case "LOOP": {
          if (ops.length !== 1) throw new Error("LOOP requires a target label.");
          let cxVal = getRegValue("CX", updatedRegs) - 1;
          updatedRegs = setRegValue("CX", cxVal, updatedRegs);
          if (cxVal > 0) {
            const target = ops[0].toLowerCase();
            if (activeLabels[target] === undefined) throw new Error(`Label "${target}" not found.`);
            nextIp = activeLabels[target];
          }
          break;
        }

        case "PUSH": {
          if (ops.length !== 1) throw new Error("PUSH requires 1 source operand.");
          const val = resolveOperand(ops[0], updatedRegs, updatedMem);
          let spVal = getRegValue("ESP", updatedRegs) - 2; // Word size 2 bytes push
          updatedRegs = setRegValue("ESP", spVal, updatedRegs);
          
          updatedStack.push({ addr: spVal, val });
          setStack(updatedStack);
          break;
        }

        case "POP": {
          if (ops.length !== 1) throw new Error("POP requires 1 destination operand.");
          if (updatedStack.length === 0) throw new Error("Stack Underflow! Stack is empty.");
          const popped = updatedStack.pop();
          setStack(updatedStack);

          let spVal = getRegValue("ESP", updatedRegs) + 2;
          updatedRegs = setRegValue("ESP", spVal, updatedRegs);
          const result = writeOperand(ops[0], popped.val, updatedRegs, updatedMem, updatedStack);
          updatedRegs = result.regs;
          updatedMem = result.mem;
          break;
        }

        case "AND": {
          if (ops.length !== 2) throw new Error("AND requires exactly 2 operands.");
          const destVal = resolveOperand(ops[0], updatedRegs, updatedMem);
          const srcVal = resolveOperand(ops[1], updatedRegs, updatedMem);
          const res = destVal & srcVal;
          updatedFlags.ZF = res === 0 ? 1 : 0;
          updatedFlags.SF = res & 0x80 ? 1 : 0;
          updatedFlags.CF = 0;
          updatedFlags.OF = 0;
          const result = writeOperand(ops[0], res, updatedRegs, updatedMem, updatedStack);
          updatedRegs = result.regs;
          break;
        }

        case "OR": {
          if (ops.length !== 2) throw new Error("OR requires exactly 2 operands.");
          const destVal = resolveOperand(ops[0], updatedRegs, updatedMem);
          const srcVal = resolveOperand(ops[1], updatedRegs, updatedMem);
          const res = destVal | srcVal;
          updatedFlags.ZF = res === 0 ? 1 : 0;
          updatedFlags.SF = res & 0x80 ? 1 : 0;
          updatedFlags.CF = 0;
          updatedFlags.OF = 0;
          const result = writeOperand(ops[0], res, updatedRegs, updatedMem, updatedStack);
          updatedRegs = result.regs;
          break;
        }

        case "XOR": {
          if (ops.length !== 2) throw new Error("XOR requires exactly 2 operands.");
          const destVal = resolveOperand(ops[0], updatedRegs, updatedMem);
          const srcVal = resolveOperand(ops[1], updatedRegs, updatedMem);
          const res = destVal ^ srcVal;
          updatedFlags.ZF = res === 0 ? 1 : 0;
          updatedFlags.SF = res & 0x80 ? 1 : 0;
          updatedFlags.CF = 0;
          updatedFlags.OF = 0;
          const result = writeOperand(ops[0], res, updatedRegs, updatedMem, updatedStack);
          updatedRegs = result.regs;
          break;
        }

        case "SHL": {
          if (ops.length !== 2) throw new Error("SHL requires destination and count.");
          const destVal = resolveOperand(ops[0], updatedRegs, updatedMem);
          const count = resolveOperand(ops[1], updatedRegs, updatedMem);
          const res = destVal << count;
          updatedFlags.ZF = (res & 0xFF) === 0 ? 1 : 0;
          const result = writeOperand(ops[0], res, updatedRegs, updatedMem, updatedStack);
          updatedRegs = result.regs;
          break;
        }

        case "SHR": {
          if (ops.length !== 2) throw new Error("SHR requires destination and count.");
          const destVal = resolveOperand(ops[0], updatedRegs, updatedMem);
          const count = resolveOperand(ops[1], updatedRegs, updatedMem);
          const res = destVal >> count;
          updatedFlags.ZF = (res & 0xFF) === 0 ? 1 : 0;
          const result = writeOperand(ops[0], res, updatedRegs, updatedMem, updatedStack);
          updatedRegs = result.regs;
          break;
        }

        default:
          throw new Error(`Invalid Instruction: Opcode "${opcode}" not supported.`);
      }

      // Commit update register EIP to next instruction
      updatedRegs.EIP = nextIp;
      
      // Update react state
      setRegisters(updatedRegs);
      setFlags(updatedFlags);

      addLog(`Executed: ${instr.originalText}`, "info");

      // Check if finished
      if (nextIp >= activeParsed.length) {
        addLog("Program execution completed successfully.", "success");
        setCurrentLine(null);
        setIsRunning(false);
        setExplanation("Execution ended: Last line reached.");
        return false;
      }
      return true;

    } catch (err) {
      addLog(`Runtime Error on line ${originalLineIdx + 1}: ${err.message}`, "error");
      setIsRunning(false);
      setCurrentLine(null);
      return false;
    }
  };

  // Explanation builder for "Learning Mode"
  const updateInstructionExplanation = (instr) => {
    const opcode = instr.opcode;
    const ops = instr.operands;
    
    let desc = "";
    switch (opcode) {
      case "MOV":
        desc = `MOV sets the destination operand '${ops[0]}' to the source value of '${ops[1]}'. The value is copied and stored. Registers AX, BX, etc. or target RAM cells are updated directly.`;
        break;
      case "ADD":
        desc = `ADD adds the value of '${ops[1]}' into '${ops[0]}'. The sum is calculated and stored in '${ops[0]}'. Flags ZF, SF, CF, and OF are updated depending on the result value.`;
        break;
      case "SUB":
        desc = `SUB subtracts the value of '${ops[1]}' from '${ops[0]}'. The difference is stored in '${ops[0]}'. If the subtraction results in exactly zero, the Zero Flag (ZF) is set to 1.`;
        break;
      case "INC":
        desc = `INC increments '${ops[0]}' by 1. The result is stored back into '${ops[0]}'. This is equivalent to ADD ${ops[0]}, 1 but does not modify the Carry Flag.`;
        break;
      case "DEC":
        desc = `DEC decrements '${ops[0]}' by 1. The result is stored back into '${ops[0]}'. Commonly used for loop counters and index registers.`;
        break;
      case "MUL":
        desc = `MUL performs unsigned multiplication. It multiplies the AL register by '${ops[0]}', and stores the 16-bit result inside AX. CF and OF are set if the upper half is non-zero.`;
        break;
      case "DIV":
        desc = `DIV performs unsigned division. It divides AX by '${ops[0]}'. The quotient is stored in AL, and the division remainder is stored in AH.`;
        break;
      case "CMP":
        desc = `CMP compares '${ops[0]}' and '${ops[1]}' by subtracting '${ops[1]}' from '${ops[0]}'. Operands are unaffected; only status flags (ZF, CF, SF, OF) are modified based on the comparison result.`;
        break;
      case "JMP":
        desc = `JMP performs an unconditional jump, changing the Instruction Pointer (EIP) directly to the address designated by label '${ops[0]}'.`;
        break;
      case "JE":
      case "JZ":
        desc = `JE/JZ (Jump if Equal / Jump if Zero) checks the Zero Flag (ZF). If ZF = 1 (last comparison resulted in equal values), EIP jumps to label '${ops[0]}'; otherwise it continues sequentially.`;
        break;
      case "JNE":
      case "JNZ":
        desc = `JNE/JNZ (Jump if Not Equal / Jump if Not Zero) checks the Zero Flag (ZF). If ZF = 0 (last comparison resulted in non-equal values), EIP jumps to label '${ops[0]}'.`;
        break;
      case "JG":
        desc = `JG (Jump if Greater) evaluates the status flags. If ZF = 0 and SF = OF, EIP jumps to label '${ops[0]}'. Used for signed comparisons.`;
        break;
      case "JL":
        desc = `JL (Jump if Less) checks status flags. If SF is not equal to OF (signed overflow did not match sign), EIP jumps to label '${ops[0]}'.`;
        break;
      case "LOOP":
        desc = `LOOP decrements the CX register by 1. If CX is still greater than 0, it jumps to label '${ops[0]}' to execute the loop block again.`;
        break;
      case "PUSH":
        desc = `PUSH decrements the Stack Pointer (ESP) by 2 and saves the 16-bit value of '${ops[0]}' onto the stack memory.`;
        break;
      case "POP":
        desc = `POP copies the top value of the stack into '${ops[0]}' and increments the Stack Pointer (ESP) by 2.`;
        break;
      case "XCHG":
        desc = `XCHG exchanges the content of '${ops[0]}' and '${ops[1]}'. Both targets exchange values simultaneously without utilizing temporary variables.`;
        break;
      case "XOR":
        desc = `XOR performs a bitwise exclusive OR on '${ops[0]}' and '${ops[1]}', storing the result in '${ops[0]}'. Often used with 'XOR AX, AX' to clear registers.`;
        break;
      default:
        desc = `${opcode} is executed with operands: ${ops.join(", ")}. CPU states, flags, or memory spaces are modified accordingly.`;
    }
    setExplanation(desc);
  };

  // --- CONTINUOUS AUTO RUN TIMER ---
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        const hasNext = executeStep();
        if (!hasNext) {
          setIsRunning(false);
        }
      }, 700);
    }
    return () => clearInterval(timer);
  }, [isRunning, registers, memory, flags, parsedLines, labelMap, lineMappings]);

  const runAll = () => {
    // Compile and run
    parseCode();
    setIsRunning(true);
    addLog("Automatic program execution started.");
  };

  const pauseAll = () => {
    setIsRunning(false);
    addLog("Program execution paused.");
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setRegisters({ ...DEFAULT_REGISTERS });
    setPrevRegisters({ ...DEFAULT_REGISTERS });
    setFlags({ ...DEFAULT_FLAGS });
    setPrevFlags({ ...DEFAULT_FLAGS });
    setStack([]);
    setCurrentLine(null);
    setParsedLines([]);
    setLabelMap({});
    setLineMappings([]);
    setExplanation("Simulator reset. Click step/run to execute program instructions.");
    addLog("Simulator, registers, stack frames, and flags reset.");
  };

  // --- SAVE / LOAD / EXPORT ACTIONS ---
  const saveProgram = (e) => {
    e.preventDefault();
    if (!saveName.trim()) return;

    const newSave = {
      id: Date.now(),
      name: saveName,
      code,
      memoryPreset: memory.slice(0, 16) // save first 16 memory addresses
    };

    const updated = [...savedPrograms, newSave];
    setSavedPrograms(updated);
    localStorage.setItem("dls_asm_programs", JSON.stringify(updated));
    setSaveName("");
    addLog(`Program "${newSave.name}" saved successfully to LocalStorage.`, "success");
  };

  const loadSavedProgram = (prog) => {
    setCode(prog.code);
    const updatedMem = [...memory];
    if (prog.memoryPreset) {
      prog.memoryPreset.forEach((val, idx) => {
        updatedMem[idx] = val;
      });
    }
    setMemory(updatedMem);
    resetSimulation();
    addLog(`Loaded saved program: "${prog.name}"`);
  };

  const deleteSavedProgram = (id, e) => {
    e.stopPropagation();
    const updated = savedPrograms.filter(p => p.id !== id);
    setSavedPrograms(updated);
    localStorage.setItem("dls_asm_programs", JSON.stringify(updated));
    addLog("Saved program deleted.");
  };

  const exportAsmFile = () => {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedTemplate || "program"}.asm`;
    link.click();
    URL.revokeObjectURL(url);
    addLog("Exported current assembly code to file.");
  };

  const importAsmFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCode(event.target.result);
      resetSimulation();
      addLog(`Imported assembly file: "${file.name}"`, "success");
    };
    reader.readAsText(file);
  };

  // --- INLINE DATA EDITS ---
  const handleMemoryEdit = (offset, value) => {
    const val = parseInt(value, 10);
    if (isNaN(val)) return;
    const updated = [...memory];
    updated[offset] = val & 0xFF;
    setMemory(updated);
  };

  const handleRegisterEdit = (reg, value) => {
    const val = parseInt(value, 16) || parseInt(value, 10) || 0;
    setRegisters(prev => setRegValue(reg, val, prev));
  };

  const jumpToAddress = (e) => {
    e.preventDefault();
    const addr = parseInt(jumpAddrInput, 16) || parseInt(jumpAddrInput, 10);
    if (!isNaN(addr) && addr >= 0x1000 && addr <= 0x10FF) {
      const offset = addr - 0x1000;
      setHighlightedMemCell(offset);
      addLog(`Jumped to memory location 0x${addr.toString(16).toUpperCase()}`);
      
      // Scroll to that cell inside memory list
      const cellEl = document.getElementById(`mem-cell-${offset}`);
      if (cellEl) {
        cellEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      addLog("Invalid Memory Jump Address. Specify address between 0x1000 and 0x10FF.", "error");
    }
  };

  // Utility logic to highlight changes
  const isRegChanged = (regName) => {
    return getRegValue(regName, registers) !== getRegValue(regName, prevRegisters);
  };

  const isFlagChanged = (flagName) => {
    return flags[flagName] !== prevFlags[flagName];
  };

  const isMemChanged = (offset) => {
    return memory[offset] !== prevMemory[offset];
  };

  return (
    <div className="learning-resources-page coal-site-shell" ref={glowRootRef}>
      <div className="grid-background" />
      <Navbar toggleTheme={toggleTheme} theme={theme} />

      <main className="asm-ide-root">
        {/* Header Section */}
        <section className="asm-header">
          <div>
            <div className="asm-header-title-row">
              <span className="asm-header-icon-wrap">
                <Code />
              </span>
              <div>
                <h1 className="asm-title">Interactive x86 Assembly IDE</h1>
                <p className="asm-subtitle">
                  Write, execute, debug, and trace registers/memory/flags in real time.
                </p>
              </div>
            </div>
          </div>

          <div className="asm-header-controls">
            {/* Template Selector */}
            <div className="asm-template-select">
              <FileCode />
              <label>Template:</label>
              <select value={selectedTemplate} onChange={(e) => handleTemplateChange(e.target.value)}>
                {Object.entries(TEMPLATES).map(([key, t]) => (
                  <option key={key} value={key}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Run Controls */}
            <button onClick={runAll} disabled={isRunning} className="asm-btn asm-btn-run" title="Run program continuously">
              <Play /> Run
            </button>
            <button onClick={executeStep} disabled={isRunning} className="asm-btn asm-btn-step" title="Step one instruction">
              <SkipForward /> Step
            </button>
            <button onClick={pauseAll} disabled={!isRunning} className="asm-btn asm-btn-pause" title="Pause execution">
              <Play /> Pause
            </button>
            <button onClick={resetSimulation} className="asm-btn asm-btn-reset" title="Reset simulator components">
              <RotateCcw /> Reset
            </button>
          </div>
        </section>

        {/* Responsive Grid Layout */}
        <div className="asm-grid">
          {/* LEFT COLUMN: Code Writing & Saved Programs */}
          <div className="asm-col-left">
            <div className="asm-panel">
              <div className="asm-panel-header">
                <h3 className="asm-panel-title">
                  <FileCode className="asm-icon-blue" /> Code Editor
                </h3>
                <div className="asm-panel-actions">
                  <button onClick={exportAsmFile} className="asm-btn" title="Export to .asm file">
                    <Download size={14} /> Export
                  </button>
                  <button onClick={() => fileInputRef.current.click()} className="asm-btn" title="Import .asm file">
                    <Upload size={14} /> Import
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={importAsmFile}
                    accept=".asm,.txt"
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              {/* Editor Component */}
              <div className="asm-editor-container">
                <div className="asm-editor-body">
                  <div className="asm-editor-gutter">
                    {code.split("\n").map((_, idx) => (
                      <div key={idx} className={`asm-editor-line-num ${currentLine === idx ? "is-current" : ""}`}>
                        {idx + 1}
                      </div>
                    ))}
                  </div>

                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="asm-editor-textarea"
                    placeholder="; Enter your assembly code here...&#10;MOV AX, 5&#10;ADD AX, 10"
                    spellCheck="false"
                  />

                  {/* Highlights execution overlay */}
                  {currentLine !== null && (
                    <div
                      className="asm-editor-line-highlight"
                      style={{
                        top: `${currentLine * 1.5 + 0.75}rem`,
                        height: "1.5rem"
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Saved Programs Panel */}
            <div className="asm-panel">
              <h3 className="asm-panel-title" style={{ marginBottom: "0.75rem" }}>
                <Save className="asm-icon-purple" /> Saved Programs
              </h3>

              <form onSubmit={saveProgram} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <input
                  type="text"
                  placeholder="Program Name..."
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  className="asm-memory-input"
                  style={{ flex: 1 }}
                  required
                />
                <button type="submit" className="asm-btn">
                  <Save size={14} /> Save Current
                </button>
              </form>

              {savedPrograms.length === 0 ? (
                <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>No saved programs found. Save your scripts locally.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", maxHeight: "120px", overflowY: "auto" }}>
                  {savedPrograms.map(p => (
                    <div
                      key={p.id}
                      onClick={() => loadSavedProgram(p)}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.375rem 0.5rem",
                        background: "#020617",
                        borderRadius: "0.375rem",
                        cursor: "pointer",
                        border: "1px solid #1e293b",
                        fontSize: "12px"
                      }}
                    >
                      <span style={{ fontWeight: 600, color: "#e2e8f0" }}>{p.name}</span>
                      <button onClick={(e) => deleteSavedProgram(p.id, e)} className="asm-mem-del-btn" style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Simulator Registers, Flags, RAM & Learning Mode */}
          <div className="asm-col-right">
            {/* Registers and Flags */}
            <div className="asm-panel">
              <h3 className="asm-panel-title" style={{ marginBottom: "0.75rem" }}>
                <Info className="asm-icon-green" /> Registers & Flag Monitor
              </h3>

              <div className="asm-registers-layout">
                {/* 9 General/Pointer Registers Grid */}
                <div className="asm-registers-grid">
                  {Object.entries(registers).map(([reg, val]) => (
                    <div key={reg} className={`asm-register-cell ${isRegChanged(reg) ? "is-changed" : ""}`}>
                      <div className="asm-register-label-row">
                        <span>{reg}</span>
                        <span style={{ fontSize: "9px", opacity: 0.6 }}>HEX</span>
                      </div>
                      <input
                        type="text"
                        value={`0x${val.toString(16).toUpperCase()}`}
                        onChange={(e) => handleRegisterEdit(reg, e.target.value)}
                        className="asm-register-input"
                      />
                    </div>
                  ))}
                </div>

                {/* Flags Monitor */}
                <div>
                  <h4 style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 0.5rem" }}>
                    Status Flags
                  </h4>
                  <div className="asm-flags-row">
                    {Object.entries(flags).map(([flag, val]) => (
                      <div
                        key={flag}
                        onClick={() => setFlags(prev => ({ ...prev, [flag]: prev[flag] === 1 ? 0 : 1 }))}
                        className={`asm-flag-badge ${val === 1 ? "is-active" : ""} ${isFlagChanged(flag) ? "is-changed" : ""}`}
                        title={`Click to toggle flag state`}
                      >
                        {flag} = {val}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RAM Memory Monitor */}
            <div className="asm-panel">
              <h3 className="asm-panel-title" style={{ marginBottom: "0.75rem" }}>
                <CheckCircle className="asm-icon-yellow" /> RAM Data Segment (0x1000 - 0x10FF)
              </h3>

              {/* Jump controls */}
              <div className="asm-memory-controls">
                <form onSubmit={jumpToAddress} style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
                  <input
                    type="text"
                    value={jumpAddrInput}
                    onChange={(e) => setJumpAddrInput(e.target.value)}
                    placeholder="Address, e.g. 0x1000"
                    className="asm-memory-input"
                    style={{ width: "140px" }}
                  />
                  <button type="submit" className="asm-btn">
                    Jump Address
                  </button>
                </form>
              </div>

              {/* Memory Grid */}
              <div className="asm-memory-grid-wrap">
                <table className="asm-memory-table">
                  <thead>
                    <tr>
                      <th style={{ width: "60px" }}>Row</th>
                      {Array.from({ length: 8 }).map((_, idx) => (
                        <th key={idx}>+{idx}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 32 }).map((_, rowIdx) => {
                      const rowAddrBase = 0x1000 + rowIdx * 8;
                      return (
                        <tr key={rowIdx}>
                          <td className="asm-memory-row-header">
                            0x{rowAddrBase.toString(16).toUpperCase()}
                          </td>
                          {Array.from({ length: 8 }).map((_, colIdx) => {
                            const offset = rowIdx * 8 + colIdx;
                            const cellValue = memory[offset];
                            const isCellChanged = isMemChanged(offset);
                            const isHighlighted = highlightedMemCell === offset;

                            return (
                              <td
                                key={colIdx}
                                id={`mem-cell-${offset}`}
                                className={`asm-memory-cell ${isCellChanged ? "is-changed" : ""} ${isHighlighted ? "is-highlighted" : ""}`}
                              >
                                <input
                                  type="text"
                                  value={cellValue}
                                  onChange={(e) => handleMemoryEdit(offset, e.target.value)}
                                  style={{
                                    width: "100%",
                                    background: "transparent",
                                    border: "none",
                                    color: "inherit",
                                    textAlign: "center",
                                    fontFamily: "inherit",
                                    fontWeight: isCellChanged ? 700 : 400
                                  }}
                                />
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Learning Explainer Mode */}
            <div className="asm-panel">
              <h3 className="asm-panel-title" style={{ marginBottom: "0.5rem" }}>
                <BookOpen className="asm-icon-blue" /> Learning Explainer Mode
              </h3>
              <div className="asm-learning-box">
                <div className="asm-learning-title-row">
                  <Info />
                  <span>Instruction Explanation</span>
                </div>
                <div className="asm-learning-body">
                  {explanation}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER Console Logs */}
        <section className="asm-panel asm-log-panel" style={{ marginTop: "1.5rem" }}>
          <div className="asm-panel-header" style={{ marginBottom: "0.5rem" }}>
            <h3 className="asm-panel-title">
              <History className="asm-icon-blue" /> Execution History Log
            </h3>
            <button onClick={() => setLogs([])} className="asm-btn" style={{ padding: "0.25rem 0.5rem" }}>
              Clear
            </button>
          </div>
          <div className="asm-log-viewport">
            {logs.map((log, index) => {
              const isErr = log.startsWith("ERROR:");
              const isSucc = log.startsWith("SUCCESS:");
              return (
                <div key={index} className={`asm-log-row ${isErr ? "is-error" : isSucc ? "is-success" : "is-info"}`}>
                  <span className="asm-log-index">[{index + 1}]:</span>
                  <span>{log}</span>
                </div>
              );
            })}
            <div ref={logsEndRef} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
