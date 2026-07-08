import React, { useMemo, useState } from "react";
import "./AddressingModePlayground.css";

/* ── Data: all 8 addressing modes ── */
const MODES = [
  {
    id: "immediate",
    name: "Immediate",
    syntax: "MOV AX, 5",
    desc: "The operand value is embedded directly in the instruction. No memory access needed — the CPU reads the constant straight from the instruction stream.",
    speed: "Fastest",
    memAccess: "None",
    example: "MOV AX, 42",
    useCases: [
      "Loading constants into registers",
      "Initialising loop counters",
      "Setting flag values directly",
    ],
    ea: null,
    eaDisplay: "No EA — operand is literal data",
  },
  {
    id: "register",
    name: "Register",
    syntax: "MOV AX, BX",
    desc: "Both source and destination are CPU registers. Operates entirely inside the CPU — the fastest addressing for data movement or arithmetic.",
    speed: "Fastest",
    memAccess: "None",
    example: "ADD AX, CX",
    useCases: [
      "Arithmetic between register pairs",
      "Moving data between registers",
      "Temporary result storage",
    ],
    ea: null,
    eaDisplay: "No EA — register-to-register",
  },
  {
    id: "direct",
    name: "Direct",
    syntax: "MOV AX, [2000H]",
    desc: "The effective address is given as a constant offset in the instruction. The CPU accesses memory at exactly that fixed address.",
    speed: "Moderate",
    memAccess: "One read/write",
    example: "MOV AX, [2000H]",
    useCases: [
      "Accessing known global variables",
      "Fixed I/O port addresses",
      "Static data segment access",
    ],
    ea: (regs) => regs.OFFSET,
    eaDisplay: "EA = OFFSET (constant in instruction)",
  },
  {
    id: "register-indirect",
    name: "Register Indirect",
    syntax: "MOV AX, [BX]",
    desc: "A register holds the effective address. The CPU dereferences the register to get the memory operand — a one-level pointer.",
    speed: "Moderate",
    memAccess: "One read/write",
    example: "MOV AX, [BX]",
    useCases: [
      "Pointer-based data access",
      "Dynamic address computation",
      "Passing arrays by reference",
    ],
    ea: (regs) => regs.BX,
    eaDisplay: "EA = BX",
  },
  {
    id: "based",
    name: "Based (Register + Displacement)",
    syntax: "MOV AX, [BX+10H]",
    desc: "Adds a constant displacement to a base register. Ideal for accessing fields of a struct at a known offset from a base pointer.",
    speed: "Moderate",
    memAccess: "One read/write",
    example: "MOV AX, [BX+10H]",
    useCases: [
      "Struct / record field access",
      "Local variables in stack frames",
      "Look-up tables with a fixed header",
    ],
    ea: (regs) => regs.BX + regs.DISP,
    eaDisplay: "EA = BX + displacement",
  },
  {
    id: "indexed",
    name: "Indexed",
    syntax: "MOV AX, [SI+10H]",
    desc: "An index register is combined with a displacement. The index register is incremented in a loop to walk through an array element by element.",
    speed: "Moderate",
    memAccess: "One read/write",
    example: "MOV AX, [SI+10H]",
    useCases: [
      "Iterating over array elements",
      "String processing with SI/DI",
      "Offset-based table look-ups",
    ],
    ea: (regs) => regs.SI + regs.DISP,
    eaDisplay: "EA = SI + displacement",
  },
  {
    id: "based-indexed",
    name: "Based + Indexed",
    syntax: "MOV AX, [BX+SI]",
    desc: "Combines a base register and an index register. Used to navigate two-dimensional data structures — the base selects a row, the index selects a column.",
    speed: "Slower",
    memAccess: "One read/write",
    example: "MOV AX, [BX+SI]",
    useCases: [
      "2-D array access",
      "Matrix operations",
      "Segment+index table navigation",
    ],
    ea: (regs) => regs.BX + regs.SI,
    eaDisplay: "EA = BX + SI",
  },
  {
    id: "based-indexed-relative",
    name: "Based + Indexed + Displacement",
    syntax: "MOV AX, [BX+SI+5]",
    desc: "The most flexible mode: base register + index register + constant displacement. Lets you address elements inside a 2-D table that starts at a fixed offset.",
    speed: "Slowest",
    memAccess: "One read/write",
    example: "MOV AX, [BX+SI+5]",
    useCases: [
      "Nested data structures",
      "2-D arrays with header offsets",
      "Complex parameter addressing",
    ],
    ea: (regs) => regs.BX + regs.SI + regs.DISP,
    eaDisplay: "EA = BX + SI + displacement",
  },
  {
    id: "implied",
    name: "Implied",
    syntax: "CLC / STC / NOP",
    desc: "The operand is implied by the opcode itself. No address or value needs to be specified — the instruction targets a fixed register or flag.",
    speed: "Fastest",
    memAccess: "None",
    example: "CLC  ; clears Carry Flag",
    useCases: [
      "Flag manipulation (CLC, STC, CMC)",
      "No-operation padding (NOP)",
      "XLAT — AL implied as operand",
    ],
    ea: null,
    eaDisplay: "No EA — operand implied by opcode",
  },
];

const MNEMONICS = ["MOV", "ADD", "SUB", "AND", "OR", "XOR", "CMP", "LEA"];
const DEST_REGS = ["AX", "BX", "CX", "DX", "SI", "DI"];
const SRC_REGS  = ["AX", "BX", "CX", "DX", "SI", "DI"];

const QUIZ_BANK = [
  { instr: "MOV AX, 42",        mode: "Immediate",         ea: "No EA (literal 42)", answer: "Immediate" },
  { instr: "MOV AX, BX",        mode: "Register",          ea: "No EA (register)", answer: "Register" },
  { instr: "MOV AX, [2000H]",   mode: "Direct",            ea: "2000H", answer: "Direct" },
  { instr: "MOV AX, [BX]",      mode: "Register Indirect", ea: "BX", answer: "Register Indirect" },
  { instr: "MOV AX, [BX+10H]",  mode: "Based",             ea: "BX + 10H", answer: "Based" },
  { instr: "MOV AX, [SI+10H]",  mode: "Indexed",           ea: "SI + 10H", answer: "Indexed" },
  { instr: "MOV AX, [BX+SI]",   mode: "Based + Indexed",   ea: "BX + SI", answer: "Based + Indexed" },
  { instr: "MOV AX, [BX+SI+5]", mode: "Based + Indexed + Displacement", ea: "BX + SI + 5", answer: "Based + Indexed + Displacement" },
  { instr: "NOP",                mode: "Implied",           ea: "No EA (implied)", answer: "Implied" },
  { instr: "CLC",                mode: "Implied",           ea: "No EA (implied)", answer: "Implied" },
  { instr: "ADD CX, 100",        mode: "Immediate",         ea: "No EA (literal 100)", answer: "Immediate" },
  { instr: "SUB DX, CX",        mode: "Register",          ea: "No EA (register)", answer: "Register" },
  { instr: "LEA BX, [3000H]",   mode: "Direct",            ea: "3000H", answer: "Direct" },
  { instr: "ADD AX, [DI]",      mode: "Register Indirect", ea: "DI", answer: "Register Indirect" },
  { instr: "MOV DX, [BX+5]",    mode: "Based",             ea: "BX + 5", answer: "Based" },
];

const COMPARE_PAIRS = [
  {
    a: MODES.find((m) => m.id === "direct"),
    b: MODES.find((m) => m.id === "register-indirect"),
  },
  {
    a: MODES.find((m) => m.id === "based"),
    b: MODES.find((m) => m.id === "indexed"),
  },
  {
    a: MODES.find((m) => m.id === "immediate"),
    b: MODES.find((m) => m.id === "register"),
  },
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffled(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function genQuizQuestion() {
  const q = randomFrom(QUIZ_BANK);
  const wrongPool = MODES.map((m) => m.name).filter((n) => n !== q.answer);
  const distractors = shuffled(wrongPool).slice(0, 3);
  const options = shuffled([q.answer, ...distractors]);
  return { ...q, options };
}

/* ── Tab labels ── */
const TABS = [
  { id: "builder",    label: "Instruction Builder" },
  { id: "calculator", label: "Address Calculator" },
  { id: "memory",     label: "Memory Simulation" },
  { id: "compare",    label: "Comparison Mode" },
  { id: "quiz",       label: "Quiz" },
];

/* ══════════════════════════════════════════════════════════════
   Instruction Builder tab
   ══════════════════════════════════════════════════════════════ */
function InstructionBuilder({ selectedMode, setSelectedMode }) {
  const [mnemonic, setMnemonic] = useState("MOV");
  const [dest, setDest] = useState("AX");
  const [src, setSrc] = useState("BX");
  const [disp, setDisp] = useState("10H");
  const [immVal, setImmVal] = useState("42");

  const mode = MODES.find((m) => m.id === selectedMode) || MODES[0];

  const generated = useMemo(() => {
    switch (selectedMode) {
      case "immediate":         return `${mnemonic} ${dest}, ${immVal}`;
      case "register":          return `${mnemonic} ${dest}, ${src}`;
      case "direct":            return `${mnemonic} ${dest}, [2000H]`;
      case "register-indirect": return `${mnemonic} ${dest}, [${src}]`;
      case "based":             return `${mnemonic} ${dest}, [BX+${disp}]`;
      case "indexed":           return `${mnemonic} ${dest}, [SI+${disp}]`;
      case "based-indexed":     return `${mnemonic} ${dest}, [BX+${src}]`;
      case "based-indexed-relative": return `${mnemonic} ${dest}, [BX+${src}+${disp}]`;
      case "implied":           return `NOP   ; or CLC / STC`;
      default:                  return "";
    }
  }, [selectedMode, mnemonic, dest, src, disp, immVal]);

  return (
    <div className="amp-layout">
      <div className="amp-panel">
        <p className="amp-panel-title">
          <span className="amp-panel-title-bar" />
          Build Your Instruction
        </p>

        {/* Addressing mode selector */}
        <div style={{ marginBottom: "0.85rem" }}>
          <label className="amp-label">Addressing Mode</label>
          <select
            className="amp-select"
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
          >
            {MODES.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div className="amp-ib-row">
          <div>
            <label className="amp-label">Mnemonic</label>
            <select className="amp-select" value={mnemonic} onChange={(e) => setMnemonic(e.target.value)}>
              {MNEMONICS.map((mn) => <option key={mn}>{mn}</option>)}
            </select>
          </div>
          <div>
            <label className="amp-label">Destination</label>
            <select className="amp-select" value={dest} onChange={(e) => setDest(e.target.value)}>
              {DEST_REGS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>

        {/* Conditional source fields */}
        {selectedMode === "immediate" && (
          <div style={{ marginBottom: "0.85rem" }}>
            <label className="amp-label">Immediate Value</label>
            <input className="amp-input" value={immVal} onChange={(e) => setImmVal(e.target.value)} placeholder="e.g. 42" />
          </div>
        )}
        {["register", "register-indirect", "based-indexed", "based-indexed-relative"].includes(selectedMode) && (
          <div style={{ marginBottom: "0.85rem" }}>
            <label className="amp-label">Source Register</label>
            <select className="amp-select" value={src} onChange={(e) => setSrc(e.target.value)}>
              {SRC_REGS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
        )}
        {["based", "indexed", "based-indexed-relative"].includes(selectedMode) && (
          <div style={{ marginBottom: "0.85rem" }}>
            <label className="amp-label">Displacement</label>
            <input className="amp-input" value={disp} onChange={(e) => setDisp(e.target.value)} placeholder="e.g. 10H" />
          </div>
        )}

        <div className="amp-generated">
          <p className="amp-generated-label">Generated Instruction</p>
          <code className="amp-generated-code">{generated}</code>
        </div>
      </div>

      {/* Right info panel */}
      <ModeInfoPanel mode={mode} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Address Calculator tab
   ══════════════════════════════════════════════════════════════ */
function AddressCalculator({ selectedMode, setSelectedMode }) {
  const [regs, setRegs] = useState({ BX: 2000, SI: 5, DI: 3, DISP: 10, OFFSET: 1500 });

  const mode = MODES.find((m) => m.id === selectedMode) || MODES[0];
  const ea = mode.ea ? mode.ea(regs) : null;

  const setReg = (key, val) => {
    const num = parseInt(val, 10);
    setRegs((prev) => ({ ...prev, [key]: isNaN(num) ? 0 : num }));
  };

  return (
    <div className="amp-layout">
      <div className="amp-panel">
        <p className="amp-panel-title"><span className="amp-panel-title-bar" />Address Calculator</p>

        <div style={{ marginBottom: "0.85rem" }}>
          <label className="amp-label">Addressing Mode</label>
          <select className="amp-select" value={selectedMode} onChange={(e) => setSelectedMode(e.target.value)}>
            {MODES.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>

        <div className="amp-calc-grid">
          {["BX", "SI", "DI", "DISP", "OFFSET"].map((key) => (
            <div key={key}>
              <label className="amp-label">{key === "DISP" ? "Displacement" : key === "OFFSET" ? "Constant Offset" : `Register ${key}`}</label>
              <input
                className="amp-input"
                type="number"
                value={regs[key]}
                onChange={(e) => setReg(key, e.target.value)}
              />
              <p className="amp-input-hex-hint">= 0x{regs[key].toString(16).toUpperCase().padStart(4, "0")}</p>
            </div>
          ))}
        </div>

        <div className="amp-calc-result">
          <span className="amp-calc-result-arrow">↓</span>
          <div>
            <p className="amp-calc-result-label">{mode.eaDisplay}</p>
            {ea !== null ? (
              <p className="amp-calc-result-value">
                {ea} &nbsp;(0x{ea.toString(16).toUpperCase().padStart(4, "0")})
              </p>
            ) : (
              <p className="amp-calc-result-value" style={{ color: "#64748b", fontSize: "0.9rem" }}>
                Not applicable — no memory access
              </p>
            )}
          </div>
        </div>
      </div>

      <ModeInfoPanel mode={mode} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Memory Simulation tab
   ══════════════════════════════════════════════════════════════ */
const MEM_BASE = 0x1000;
const MEM_SIZE = 16; // cells to show

function buildMemory() {
  return Array.from({ length: MEM_SIZE }, (_, i) => ({
    addr: MEM_BASE + i * 2,
    val:  Math.floor(Math.random() * 256),
  }));
}

function MemorySimulation({ selectedMode, setSelectedMode }) {
  const [regs] = useState({ BX: 0x1004, SI: 4, DISP: 6, OFFSET: 0x1008 });
  const [memory] = useState(() => buildMemory());

  const mode = MODES.find((m) => m.id === selectedMode) || MODES[0];
  const ea = mode.ea ? mode.ea(regs) : null;

  const activeAddr = ea !== null ? ea : null;

  return (
    <div className="amp-layout">
      <div className="amp-panel">
        <p className="amp-panel-title"><span className="amp-panel-title-bar" />Memory Access Simulation</p>

        <div style={{ marginBottom: "0.85rem" }}>
          <label className="amp-label">Addressing Mode</label>
          <select className="amp-select" value={selectedMode} onChange={(e) => setSelectedMode(e.target.value)}>
            {MODES.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>

        {/* CPU → EA → Memory flow */}
        <div className="amp-cpu-flow">
          <div className="amp-cpu-row">
            <div className="amp-cpu-box">
              <p className="amp-cpu-box-label">CPU Instruction</p>
              <p className="amp-cpu-box-value">{mode.example}</p>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <span className="amp-cpu-arrow">↓</span>
          </div>
          <div className="amp-cpu-row">
            <div className="amp-cpu-box" style={{ borderColor: "rgba(52,211,153,0.4)", background: "rgba(6,78,59,0.15)" }}>
              <p className="amp-cpu-box-label" style={{ color: "#34d399" }}>Effective Address</p>
              <p className="amp-cpu-box-value" style={{ color: "#6ee7b7" }}>
                {ea !== null
                  ? `0x${ea.toString(16).toUpperCase().padStart(4, "0")}`
                  : "N/A — no memory access"}
              </p>
            </div>
          </div>
          {ea !== null && (
            <>
              <div style={{ textAlign: "center" }}>
                <span className="amp-cpu-arrow">↓</span>
              </div>
              <div className="amp-cpu-row">
                <div className="amp-cpu-box" style={{ borderColor: "rgba(251,191,36,0.4)", background: "rgba(120,53,15,0.15)" }}>
                  <p className="amp-cpu-box-label" style={{ color: "#fbbf24" }}>Memory</p>
                  <p className="amp-cpu-box-value" style={{ color: "#fcd34d" }}>
                    {(() => {
                      const cell = memory.find((c) => c.addr === activeAddr);
                      return cell ? `0x${cell.val.toString(16).toUpperCase().padStart(2, "0")} (dec ${cell.val})` : "address outside shown range";
                    })()}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <span className="amp-cpu-arrow">↓</span>
              </div>
              <div className="amp-cpu-row">
                <div className="amp-cpu-box" style={{ borderColor: "rgba(99,102,241,0.4)", background: "rgba(49,46,129,0.15)" }}>
                  <p className="amp-cpu-box-label" style={{ color: "#818cf8" }}>Register (AX)</p>
                  <p className="amp-cpu-box-value" style={{ color: "#a5b4fc" }}>← value loaded here</p>
                </div>
              </div>
            </>
          )}
        </div>

        <p className="amp-label" style={{ marginTop: "1rem" }}>Memory Map (shown range)</p>
        <div className="amp-memory-grid">
          {memory.map((cell) => (
            <div
              key={cell.addr}
              className={`amp-mem-cell${cell.addr === activeAddr ? " active" : ""}`}
            >
              <span className="amp-mem-cell-addr">0x{cell.addr.toString(16).toUpperCase()}</span>
              <span className="amp-mem-cell-val">0x{cell.val.toString(16).toUpperCase().padStart(2, "0")}</span>
            </div>
          ))}
        </div>
      </div>

      <ModeInfoPanel mode={mode} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Comparison Mode tab
   ══════════════════════════════════════════════════════════════ */
const CMP_ROWS = [
  { key: "syntax",     label: "Syntax" },
  { key: "ea",         label: "Effective Address" },
  { key: "memAccess",  label: "Memory Access" },
  { key: "speed",      label: "Speed" },
  { key: "useCases",   label: "Use Cases" },
];

function ComparisonMode() {
  const [pairIdx, setPairIdx] = useState(0);
  const pair = COMPARE_PAIRS[pairIdx];

  const cellValue = (mode, key) => {
    if (key === "ea") return mode.eaDisplay;
    if (key === "useCases") return mode.useCases.join(" · ");
    if (key === "syntax") return mode.example;
    return mode[key];
  };

  return (
    <div className="amp-layout">
      <div className="amp-panel" style={{ gridColumn: "1 / -1" }}>
        <p className="amp-panel-title"><span className="amp-panel-title-bar" style={{ background: "#fbbf24" }} />Compare Two Modes</p>

        <div className="amp-cmp-toggle">
          {COMPARE_PAIRS.map((p, i) => (
            <button
              key={i}
              className={`amp-cmp-btn${pairIdx === i ? " active" : ""}`}
              onClick={() => setPairIdx(i)}
            >
              {p.a.name} vs {p.b.name}
            </button>
          ))}
        </div>

        <table className="amp-cmp-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>{pair.a.name}</th>
              <th>{pair.b.name}</th>
            </tr>
          </thead>
          <tbody>
            {CMP_ROWS.map((row) => (
              <tr key={row.key}>
                <td>{row.label}</td>
                <td>{cellValue(pair.a, row.key)}</td>
                <td>{cellValue(pair.b, row.key)}</td>
              </tr>
            ))}
            <tr>
              <td>Advantage</td>
              <td className="amp-good">✓ {pair.a.speed === "Fastest" ? "No memory overhead" : pair.a.speed === "Fastest" ? "Register speed" : "Flexible addressing"}</td>
              <td className="amp-good">✓ {pair.b.speed === "Fastest" ? "No memory overhead" : pair.b.speed === "Fastest" ? "Register speed" : "Flexible addressing"}</td>
            </tr>
          </tbody>
        </table>

        {/* Full description comparison */}
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr", marginTop: "1.25rem" }}>
          {[pair.a, pair.b].map((mode) => (
            <div key={mode.id} style={{ borderRadius: "0.75rem", border: "1px solid rgba(71,85,105,0.4)", padding: "0.9rem" }}>
              <p style={{ fontWeight: 700, color: "#e2e8f0", marginBottom: "0.4rem" }}>{mode.name}</p>
              <p style={{ fontSize: "0.83rem", color: "#94a3b8", lineHeight: "1.55" }}>{mode.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Quiz tab
   ══════════════════════════════════════════════════════════════ */
function QuizMode() {
  const [question, setQuestion] = useState(() => genQuizQuestion());
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const answered = selected !== null;
  const isCorrect = selected === question.answer;

  const handleAnswer = (opt) => {
    if (answered) return;
    setSelected(opt);
    setScore((prev) => ({
      correct: prev.correct + (opt === question.answer ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const nextQuestion = () => {
    setQuestion(genQuizQuestion());
    setSelected(null);
  };

  const resetQuiz = () => {
    setQuestion(genQuizQuestion());
    setSelected(null);
    setScore({ correct: 0, total: 0 });
  };

  return (
    <div className="amp-layout">
      <div className="amp-panel" style={{ gridColumn: "1 / -1" }}>
        <div className="amp-quiz-header">
          <p className="amp-panel-title" style={{ margin: 0 }}>
            <span className="amp-panel-title-bar" style={{ background: "#a78bfa" }} />
            Quiz Generator
          </p>
          <p className="amp-quiz-score">
            Score: <span>{score.correct}</span> / {score.total}
          </p>
        </div>

        <div className="amp-quiz-q">
          <p className="amp-quiz-q-label">Identify the addressing mode</p>
          <p className="amp-quiz-instruction">{question.instr}</p>
          <p className="amp-quiz-meta">What addressing mode does this instruction use?</p>
        </div>

        <div className="amp-quiz-options">
          {question.options.map((opt) => {
            let cls = "amp-quiz-opt";
            if (answered) {
              if (opt === question.answer) cls += " correct";
              else if (opt === selected) cls += " wrong";
            }
            return (
              <button
                key={opt}
                className={cls}
                onClick={() => handleAnswer(opt)}
                disabled={answered}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className={`amp-quiz-feedback${isCorrect ? " correct" : " wrong"}`}>
            {isCorrect
              ? `✓ Correct! "${question.instr}" uses ${question.answer} addressing. EA: ${question.ea}`
              : `✗ Not quite. The correct answer is "${question.answer}". EA: ${question.ea}`}
          </div>
        )}

        <div className="amp-quiz-actions">
          {answered && (
            <button className="amp-btn amp-btn-primary" onClick={nextQuestion}>
              Next Question →
            </button>
          )}
          <button className="amp-btn amp-btn-secondary" onClick={resetQuiz}>
            Reset Score
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Shared: Mode Info Panel (right column)
   ══════════════════════════════════════════════════════════════ */
function ModeInfoPanel({ mode }) {
  const speedColor = {
    Fastest:  "#34d399",
    Moderate: "#fbbf24",
    Slower:   "#f97316",
    Slowest:  "#f87171",
  }[mode.speed] || "#94a3b8";

  return (
    <div className="amp-info-panel">
      <div>
        <p className="amp-mode-tag">Selected Mode</p>
        <p className="amp-mode-name">{mode.name}</p>
        <code className="amp-mode-syntax">{mode.syntax}</code>
      </div>

      <p className="amp-mode-desc">{mode.desc}</p>

      <div className="amp-mode-stats">
        <div className="amp-stat-card">
          <p className="amp-stat-label">Speed</p>
          <p className="amp-stat-value" style={{ color: speedColor }}>{mode.speed}</p>
        </div>
        <div className="amp-stat-card">
          <p className="amp-stat-label">Memory Access</p>
          <p className="amp-stat-value">{mode.memAccess}</p>
        </div>
        <div className="amp-stat-card" style={{ gridColumn: "span 2" }}>
          <p className="amp-stat-label">Effective Address</p>
          <p className="amp-stat-value" style={{ fontFamily: "monospace", fontSize: "0.82rem" }}>
            {mode.eaDisplay}
          </p>
        </div>
      </div>

      <div>
        <p className="amp-stat-label" style={{ marginBottom: "0.5rem" }}>Common Use Cases</p>
        <div className="amp-use-cases">
          {mode.useCases.map((uc) => (
            <div key={uc} className="amp-use-case-row">
              <span className="amp-use-case-dot" />
              {uc}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Supported Modes browser (shown in Builder tab as bottom row)
   ══════════════════════════════════════════════════════════════ */
function SupportedModes({ selectedMode, onSelect }) {
  return (
    <div style={{ marginTop: "1.75rem" }}>
      <p className="amp-panel-title">
        <span className="amp-panel-title-bar" style={{ background: "#34d399" }} />
        All Supported Modes — click to select
      </p>
      <div className="amp-modes-grid">
        {MODES.map((m) => (
          <div
            key={m.id}
            className={`amp-mode-card${selectedMode === m.id ? " selected" : ""}`}
            onClick={() => onSelect(m.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onSelect(m.id)}
            aria-pressed={selectedMode === m.id}
          >
            <p className="amp-mode-card-name">{m.name}</p>
            <p className="amp-mode-card-syntax">{m.syntax}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Root component
   ══════════════════════════════════════════════════════════════ */
function AddressingModePlayground() {
  const [activeTab, setActiveTab] = useState("builder");
  const [selectedMode, setSelectedMode] = useState("immediate");

  return (
    <div className="amp-root">
      {/* Header */}
      <div className="amp-header">
        <div className="amp-header-badge">
          <span className="amp-header-badge-dot" />
          Interactive Playground
        </div>
        <h3 className="amp-header-title">Addressing Mode Playground</h3>
        <p className="amp-header-desc">
          Build instructions, calculate effective addresses, simulate memory access, compare modes side-by-side, and test yourself with the quiz.
          Select a tab below to get started.
        </p>
      </div>

      {/* Tabs */}
      <div className="amp-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={activeTab === t.id}
            className={`amp-tab${activeTab === t.id ? " active" : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "builder" && (
        <>
          <InstructionBuilder selectedMode={selectedMode} setSelectedMode={setSelectedMode} />
          <SupportedModes selectedMode={selectedMode} onSelect={setSelectedMode} />
        </>
      )}
      {activeTab === "calculator" && (
        <AddressCalculator selectedMode={selectedMode} setSelectedMode={setSelectedMode} />
      )}
      {activeTab === "memory" && (
        <MemorySimulation selectedMode={selectedMode} setSelectedMode={setSelectedMode} />
      )}
      {activeTab === "compare" && <ComparisonMode />}
      {activeTab === "quiz"    && <QuizMode />}
    </div>
  );
}

export default AddressingModePlayground;
