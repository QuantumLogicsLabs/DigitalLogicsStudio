import { useState } from 'react';
import { Navbar } from "../Home/Navbar";
import {
  Layers,
  Cpu,
  Database,
  RotateCcw,
  ArrowDown,
  ArrowUp,
  Plus,
  Trash2,
  Search,
  Code,
  History,
  HelpCircle,
  Sparkles,
  GitCompare,
  BookOpen,
  X
} from 'lucide-react';
import './StackMemorySimulatorPage.css';
import "../Home/Home.css";
import "../LearningResources/LearningResourcesPage.css";
import { useTheme } from "../../context/ThemeContext";
import usePointerGlow from "../../hooks/usePointerGlow";
import { coalCourseMeta } from "../../data/coalCourseOutline";

// Custom inline Tooltip Component
const InfoTooltip = ({ text }) => (
  <div className="smp-tooltip">
    <HelpCircle className="smp-tooltip-icon" />
    <div className="smp-tooltip-box">
      {text}
      <div className="smp-tooltip-arrow"></div>
    </div>
  </div>
);

const COAL_ACCENT = coalCourseMeta.accent;

export default function StackMemoryPlayground() {

    const { theme, toggle: toggleTheme } = useTheme();
    const glowRootRef = usePointerGlow({ color: COAL_ACCENT, alpha: 0.2 });

  // Architecture configuration
  const architectures = {
    x86: {
      name: 'x86 (Intel)',
      wordSize: 2, // bytes
      stackDirection: 'down',
      defaultRegisters: { AX: '0x1234', BX: '0xABCD', CX: '0x00FF', SP: '0xFFFE', IP: '0x0100' },
      callInst: 'CALL',
      retInst: 'RET'
    },
    ARM: {
      name: 'ARM (AArch32)',
      wordSize: 4, // bytes
      stackDirection: 'down',
      defaultRegisters: { R0: '0x00000005', R1: '0x0000000A', R2: '0x000000FF', SP: '0x7FFFFFFF', LR: '0x00000000', PC: '0x00008000' },
      callInst: 'BL',
      retInst: 'BX LR'
    },
    MIPS: {
      name: 'MIPS32',
      wordSize: 4, // bytes
      stackDirection: 'down',
      defaultRegisters: { '$t0': '0x00000001', '$t1': '0x00000002', '$t2': '0x00000003', '$sp': '0x7FFFFFFC', '$ra': '0x00000000', '$pc': '0x00400000' },
      callInst: 'jal',
      retInst: 'jr $ra'
    }
  };

  // State Management
  const [arch, setArch] = useState('x86');
  const [registers, setRegisters] = useState({ ...architectures.x86.defaultRegisters });
  const [stack, setStack] = useState([]); // Array of { address: string, value: string, label: string, type: string }
  const [memory, setMemory] = useState([
    { address: '0x1000', value: '20', name: 'global_val', directive: 'DB' },
    { address: '0x1002', value: '5', name: 'num', directive: 'DB' }
  ]);
  const [snapshotMemory, setSnapshotMemory] = useState([]);
  const [isComparing, setIsComparing] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // Input fields state
  const [pushImmValue, setPushImmValue] = useState('0x42');
  const [selectedRegToPush, setSelectedRegToPush] = useState('');
  const [manualAddr, setManualAddr] = useState('0x1010');
  const [manualVal, setManualVal] = useState('0');
  const [varName, setVarName] = useState('counter');
  const [varDir, setVarDir] = useState('DB');
  const [varVal, setVarVal] = useState('10');
  const [searchQuery, setSearchQuery] = useState('');

  // Execution/Animation simulation logs
  const [logs, setLogs] = useState(['Playground initialized. Select an architecture to begin.']);
  const [callChain, setCallChain] = useState([]);
  const [lastActionId, setLastActionId] = useState(null);

  const resetAll = (selectedArch = arch) => {
    const config = architectures[selectedArch];
    setRegisters({ ...config.defaultRegisters });
    setStack([]);
    setCallChain([]);
    setLastActionId(Date.now());

    const initialMem = [
      { address: '0x1000', value: '20', name: 'status', directive: 'DB' }
    ];
    setMemory(initialMem);
    setSnapshotMemory(JSON.parse(JSON.stringify(initialMem)));
    setIsComparing(false);

    // Auto-select first register as pushable target
    const regKeys = Object.keys(config.defaultRegisters).filter(k => !['SP', 'IP', 'LR', 'PC', '$sp', '$ra', '$pc'].includes(k));
    setSelectedRegToPush(regKeys[0] || '');

    setLogs([`Switched architecture to ${config.name}. State fully reset.`]);
  };

  const handleArchChange = (newArch) => {
      setArch(newArch);
      resetAll(newArch);
  };

  const addLog = (message) => {
    setLogs(prev => [message, ...prev.slice(0, 19)]);
  };

  // Helper to parse/format HEX numbers smoothly
  const formatHex = (val, bytes = 2) => {
    if (typeof val === 'string' && val.startsWith('0x')) return val;
    const num = parseInt(val, 10);
    if (isNaN(num)) return '0x0000';
    const hex = num.toString(16).toUpperCase();
    const padLength = bytes * 2;
    return '0x' + hex.padStart(padLength, '0');
  };

  // Capture/Release baseline for memory comparison
  const captureSnapshot = () => {
    setSnapshotMemory(JSON.parse(JSON.stringify(memory)));
    setIsComparing(true);
    addLog("Memory baseline snapshot taken. Future changes will be highlighted.");
  };

  // --- STACK OPERATIONS ---
  const handlePush = (value, label = 'Immediate') => {
    const config = architectures[arch];
    const currentSP = parseInt(registers.SP || registers['SP/R13'] || registers['$sp'] || '0xFFFF', 16);
    const wordSize = config.wordSize;

    // Decrement SP (Stack grows downward in standard x86/ARM/MIPS paradigms)
    const newSP = currentSP - wordSize;
    const hexSP = '0x' + newSP.toString(16).toUpperCase();

    const formattedValue = value.toString().startsWith('0x') ? value : formatHex(value, wordSize);

    const newStackItem = {
      address: hexSP,
      value: formattedValue,
      label: label,
      id: Date.now()
    };

    setStack(prev => [newStackItem, ...prev]);

    // Update Stack Pointer Register
    setRegisters(prev => {
      const updated = { ...prev };
      if (updated.SP !== undefined) updated.SP = hexSP;
      if (updated['$sp'] !== undefined) updated['$sp'] = hexSP;
      return updated;
    });

    setLastActionId(newStackItem.id);
    addLog(`PUSHED ${formattedValue} (${label}) onto stack. SP moved down to ${hexSP}`);
  };

  const handlePop = () => {
    if (stack.length === 0) {
      addLog("Stack Underflow! Cannot pop from an empty stack.");
      return;
    }

    const config = architectures[arch];
    const poppedItem = stack[0];
    const currentSP = parseInt(registers.SP || registers['$sp'] || '0xFFFF', 16);
    const newSP = currentSP + config.wordSize;
    const hexSP = '0x' + newSP.toString(16).toUpperCase();

    setStack(prev => prev.slice(1));

    // Update Register Pointer
    setRegisters(prev => {
      const updated = { ...prev };
      if (updated.SP !== undefined) updated.SP = hexSP;
      if (updated['$sp'] !== undefined) updated['$sp'] = hexSP;
      return updated;
    });

    setLastActionId(Date.now());
    addLog(`POPPED value ${poppedItem.value} (${poppedItem.label}) off stack. SP moved up to ${hexSP}`);
  };

  // Subroutine Logic
  const handleCallProcedure = () => {
    const procName = `func_0x${Math.floor(Math.random() * 900 + 100)}`;
    const ipKey = registers.IP !== undefined ? 'IP' : (registers.PC !== undefined ? 'PC' : '$pc');
    const lrKey = registers.LR !== undefined ? 'LR' : (registers['$ra'] !== undefined ? '$ra' : null);

    const currentIPVal = registers[ipKey];
    const nextIP = '0x' + (parseInt(currentIPVal, 16) + 0x40).toString(16).toUpperCase();

    if (arch === 'x86') {
      handlePush(currentIPVal, `Return Addr (${procName})`);
    } else {
      setRegisters(prev => ({ ...prev, [lrKey]: currentIPVal }));
      if (callChain.length >= 0) handlePush(currentIPVal, `Saved ${lrKey}`);
    }

    setRegisters(prev => ({ ...prev, [ipKey]: nextIP }));
    setCallChain(prev => [...prev, procName]);
    addLog(`Branching to subroutine ${procName}`);
  };

  const handleReturnProcedure = () => {
    if (callChain.length === 0) return;
    const ipKey = registers.IP !== undefined ? 'IP' : (registers.PC !== undefined ? 'PC' : '$pc');
    const lrKey = registers.LR !== undefined ? 'LR' : (registers['$ra'] !== undefined ? '$ra' : null);

    if (arch === 'x86') {
      if (stack.length === 0) return;
      const poppedAddr = stack[0].value;
      handlePop();
      setRegisters(prev => ({ ...prev, [ipKey]: poppedAddr }));
    } else {
      if (stack.length > 0 && stack[0].label.includes('Saved')) {
        const poppedAddr = stack[0].value;
        handlePop();
        setRegisters(prev => {
          const updated = { ...prev };
          updated[ipKey] = poppedAddr;
          if (lrKey) updated[lrKey] = poppedAddr;
          return updated;
        });
      } else {
        setRegisters(prev => ({ ...prev, [ipKey]: registers[lrKey] || '0x0100' }));
      }
    }
    setCallChain(prev => prev.slice(0, -1));
    addLog(`Returned from subroutine.`);
  };

  // Memory Logic
  const handleAddVariable = (e) => {
    e.preventDefault();
    if (!varName.trim()) return;
    let nextAddrNum = 0x1000;
    if (memory.length > 0) {
      nextAddrNum = Math.max(...memory.map(m => parseInt(m.address, 16))) + (varDir === 'DW' ? 4 : 2);
    }
    const hexAddr = '0x' + nextAddrNum.toString(16).toUpperCase();
    const newVar = { address: hexAddr, value: varVal, name: varName.replace(/\s+/g, '_'), directive: varDir, id: Date.now() };
    setMemory(prev => [...prev, newVar]);
    setLastActionId(newVar.id);
    addLog(`Allocated variable: "${newVar.name}" at ${hexAddr}`);
  };

  const handleManualMemoryEdit = (e) => {
    e.preventDefault();
    const cleanAddr = manualAddr.startsWith('0x') ? manualAddr : '0x' + parseInt(manualAddr, 10).toString(16).toUpperCase();
    const existingIndex = memory.findIndex(m => parseInt(m.address, 16) === parseInt(cleanAddr, 16));

    if (existingIndex > -1) {
      const updatedMemory = [...memory];
      updatedMemory[existingIndex].value = manualVal;
      updatedMemory[existingIndex].id = Date.now();
      setMemory(updatedMemory);
      setLastActionId(updatedMemory[existingIndex].id);
    } else {
      const newCell = { address: cleanAddr.toUpperCase(), value: manualVal, name: '', directive: 'Custom', id: Date.now() };
      setMemory(prev => [...prev, newCell].sort((a, b) => parseInt(a.address, 16) - parseInt(b.address, 16)));
      setLastActionId(newCell.id);
    }
    addLog(`Updated memory address ${cleanAddr} to ${manualVal}`);
  };

  const handleRemoveMemory = (address) => {
    setMemory(prev => prev.filter(m => m.address !== address));
    captureSnapshot(); // Optional: update the diff baseline
    addLog(`Deallocated memory at address ${address}`);
  };

  const getMemoryDiffClass = (item) => {
    if (!isComparing) return '';
    const snapItem = snapshotMemory.find(s => parseInt(s.address, 16) === parseInt(item.address, 16));
    if (!snapItem) return 'smp-mem-diff-new';
    if (snapItem.value !== item.value) return 'smp-mem-diff-changed';
    return 'smp-mem-diff-same';
  };

  const filteredMemory = memory.filter(m => m.address.toLowerCase().includes(searchQuery.toLowerCase()) || (m.name && m.name.toLowerCase().includes(searchQuery.toLowerCase())));

  return (
        <div className="learning-resources-page coal-site-shell" ref={glowRootRef}>
          <div className="grid-background" />
          <Navbar toggleTheme={toggleTheme} theme={theme} />

    <main className="smp-root">

      {/* Header Banner */}
      <div className="smp-header">
        <div>
          <div className="smp-header-title-row">
            <span className="smp-header-icon-wrap">
              <Layers />
            </span>
            <h1 className="smp-title">Stack & Memory Assembly Playground</h1>
          </div>
          <p className="smp-subtitle">
            Observe the real-time changes to the Stack Pointer, memory blocks, and variable allocations across different system architectures.
          </p>
        </div>

        {/* Global Selectors */}
        <div className="smp-header-controls">
          <div className="smp-arch-select">
            <Cpu />
            <label>Architecture:</label>
            <select value={arch} onChange={(e) => handleArchChange(e.target.value)} className="arch-selector-dropdown">
              {Object.keys(architectures).map(key => (
                <option key={key} value={key}>
                  {architectures[key].name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => resetAll()}
            className="smp-btn smp-btn-reset"
            title="Reset active simulated components state"
          >
            <RotateCcw />
            Reset State
          </button>

          <button
            onClick={() => setShowGuide(true)}
            className="smp-btn smp-btn-guide"
          >
            <BookOpen /> Guide
          </button>
        </div>
      </div>

      {/* Main Grid Viewport Layout */}
      <div className="smp-grid">

        {/* LEFT COLUMN: Controls Dashboard */}
        <div className="smp-col-left">

          {/* Registers Monitor Widget */}
          <div className="smp-panel">
            <div className="smp-panel-header">
              <h3 className="smp-panel-title">
                <Cpu className="smp-icon-indigo" /> Active Registers File
                <InfoTooltip text="Registers are ultra-fast temporary storage inside the CPU. General registers (AX, BX) hold math data. Pointer registers (SP, IP) hold addresses to navigate memory." />
              </h3>
              <span className="smp-badge">
                Word Size: {architectures[arch].wordSize} Bytes
              </span>
            </div>

            <div className="smp-registers-grid">
              {Object.entries(registers).map(([regName, regVal]) => {
                const isPointer = ['SP', 'IP', 'LR', 'PC', '$sp', '$ra', '$pc'].includes(regName);
                return (
                  <div
                    key={regName}
                    className={`smp-register-cell ${isPointer ? 'is-pointer' : ''}`}
                  >
                    <div className="smp-register-label-row">
                      <span>{regName}</span>
                      {isPointer && <span className="smp-ptr-tag">PTR</span>}
                    </div>
                    <input
                      type="text"
                      value={regVal}
                      onChange={(e) => setRegisters(prev => ({ ...prev, [regName]: e.target.value }))}
                      className="smp-register-input"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Action Workspace Panel */}
          <div className="smp-panel smp-panel-flex smp-workspace">

            {/* Subsection 1: Stack Control Box */}
            <div>
              <h4 className="smp-section-title">
                <Layers className="smp-icon-sky" /> Primitive Stack Operations
                <InfoTooltip text="PUSH places a value at the top of the stack and moves the Stack Pointer (SP) down. POP removes the top value and moves the SP up." />
              </h4>
              <div className="smp-stack-ops-grid">
                <div className="smp-mini-card">
                  <span className="smp-mini-card-label">Push Concrete Value</span>
                  <div className="smp-mini-card-row">
                    <input
                      type="text"
                      value={pushImmValue}
                      onChange={(e) => setPushImmValue(e.target.value)}
                      placeholder="e.g. 0x42"
                      className="smp-input"
                    />
                    <button
                      onClick={() => handlePush(pushImmValue, 'Immediate')}
                      className="smp-mini-btn smp-mini-btn-sky"
                    >
                      <ArrowDown /> PUSH
                    </button>
                  </div>
                </div>

                <div className="smp-mini-card">
                  <span className="smp-mini-card-label">Push Variable Register</span>
                  <div className="smp-mini-card-row">
                    <select
                      value={selectedRegToPush}
                      onChange={(e) => setSelectedRegToPush(e.target.value)}
                      className="smp-select"
                    >
                      {Object.keys(registers).filter(k => !['SP', 'IP', 'LR', 'PC', '$sp', '$ra', '$pc'].includes(k)).map(r => (
                        <option key={r} value={r}>{r} ({registers[r]})</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handlePush(registers[selectedRegToPush] || '0x00', `Reg ${selectedRegToPush}`)}
                      className="smp-mini-btn smp-mini-btn-indigo"
                    >
                      <ArrowDown /> PUSH
                    </button>
                  </div>
                </div>
              </div>

              <div className="smp-pop-row">
                <button
                  onClick={handlePop}
                  className="smp-pop-btn"
                >
                  <ArrowUp /> POP VALUE FROM STACK
                </button>
                <button
                  onClick={() => setStack([])}
                  className="smp-clear-btn"
                  title="Clear Current Active Stack Frames Only"
                >
                  Clear Stack
                </button>
              </div>
            </div>

            {/* Subsection 2: Routine Call Simulation & Stack Frames */}
            <div className="smp-section-bordered">
              <div className="smp-subsection-header">
                <h4 className="smp-section-title" style={{ marginBottom: 0 }}>
                  <Code className="smp-icon-emerald" /> Subroutine / Procedure Simulator
                  <InfoTooltip text="Simulates calling a function. The current Instruction Pointer (IP/PC) is saved so the CPU knows exactly where to return when the function finishes." />
                </h4>
                <div className="smp-depth-label">
                  Active Depth: <span className="smp-depth-value">{callChain.length}</span>
                </div>
              </div>

              <p className="smp-desc-text">
                Trigger structural procedure transitions. The simulator configures and restores instruction frame tracks seamlessly.
              </p>

              <div className="smp-proc-grid">
                <button
                  onClick={handleCallProcedure}
                  className="smp-proc-btn smp-proc-btn-call"
                >
                  <span className="smp-proc-btn-sub">Simulate Branch</span>
                  <div className="smp-proc-inst-row">
                    <span className="smp-proc-inst-call">{architectures[arch].callInst}</span>
                    <span>PROC</span>
                  </div>
                </button>

                <button
                  onClick={handleReturnProcedure}
                  className="smp-proc-btn smp-proc-btn-ret"
                  disabled={callChain.length === 0}
                  style={{ opacity: callChain.length === 0 ? 0.4 : 1 }}
                >
                  <span className="smp-proc-btn-sub">Pop Return Link</span>
                  <div className="smp-proc-inst-row">
                    <span className="smp-proc-inst-ret">{architectures[arch].retInst}</span>
                  </div>
                </button>
              </div>

              {/* Recursion Visualization Graph */}
              {callChain.length > 0 && (
                <div className="smp-recursion-box">
                  <div className="smp-recursion-title">
                    <Sparkles /> Active Recursive Nesting Execution Tree
                  </div>
                  <div className="smp-recursion-list">
                    {callChain.map((name, idx) => (
                      <div key={idx} className="smp-recursion-item" style={{ paddingLeft: `${idx * 4}px` }}>
                        <span className="smp-recursion-arrow">↓</span>
                        <span className="smp-recursion-chip">
                          {name} <span className="smp-recursion-status">[{idx === callChain.length - 1 ? 'CURRENT' : 'WAITING'}]</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Subsection 3: Structural Variable Allocation Input (num DB 5) */}
            <div className="smp-section-bordered">
              <h4 className="smp-section-title">
                <Database className="smp-icon-purple" /> Dynamic Variable Compiler
                <InfoTooltip text="Creates persistent global variables in the RAM. Unlike the stack, these values stay fixed at their specific memory address unless directly overwritten." />
              </h4>

              <form onSubmit={handleAddVariable} className="smp-var-form">
                <div className="smp-var-syntax-row">
                  <span>Simulate Syntax: <code>[name] [Directive] [value]</code></span>
                </div>

                <div className="smp-var-grid">
                  <input
                    type="text"
                    value={varName}
                    onChange={(e) => setVarName(e.target.value)}
                    placeholder="var_name"
                    className="smp-input smp-var-name"
                    required
                  />

                  <select
                    value={varDir}
                    onChange={(e) => setVarDir(e.target.value)}
                    className="smp-select smp-var-dir"
                    title="DB = Define Byte (1 byte wide), DW = Define Word (2-4 bytes wide contextually)"
                  >
                    <option value="DB">DB</option>
                    <option value="DW">DW</option>
                  </select>

                  <input
                    type="text"
                    value={varVal}
                    onChange={(e) => setVarVal(e.target.value)}
                    placeholder="Value"
                    className="smp-input smp-var-val"
                    required
                  />

                  <button
                    type="submit"
                    className="smp-var-submit"
                    title="Allocate variable instantly to simulated memory layout segment"
                  >
                    <Plus />
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>

        {/* MIDDLE COLUMN: Stack Framework Visualizer */}
        <div className="smp-panel smp-col-mid" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="smp-panel-header">
            <h3 className="smp-panel-title">
              <Layers className="smp-icon-sky" /> Hardware Stack Frame
              <InfoTooltip text="The Stack grows downwards in memory (from high addresses to low addresses). Notice how the SP decreases every time you Push." />
            </h3>
            <span className="smp-stack-count">
              Count: {stack.length}
            </span>
          </div>

          <p className="smp-stack-desc">
            Grows down from high memory boundaries. The top of the stack is managed dynamically.
          </p>

          {/* Graphical Stack column viewport container */}
          <div className="smp-stack-viewport">
            {stack.length === 0 ? (
              <div className="smp-stack-empty">
                <Layers />
                <p>Stack is currently empty.</p>
                <p className="smp-hint">Execute PUSH operations to allocate active stack records.</p>
              </div>
            ) : (
              <div className="smp-stack-items">
                {stack.map((item, index) => {
                  const isTop = index === 0;
                  const isRecent = item.id === lastActionId;

                  return (
                    <div
                      key={item.id || index}
                      className={`smp-stack-item ${isTop ? 'is-top' : ''} ${isRecent ? 'is-recent' : ''}`}
                    >
                      {/* Top Stack Pointer Metadata Pointer Tag */}
                      {isTop && (
                        <div className="smp-sp-tag">
                          <span>← SP</span>
                        </div>
                      )}

                      <div className="smp-stack-item-meta">
                        <span className="smp-stack-item-addr">{item.address}</span>
                        <span className="smp-stack-item-label">{item.label}</span>
                      </div>

                      <div className="smp-stack-item-value-row">
                        <span>{item.value}</span>
                        <span className="smp-stack-item-index">Index #{stack.length - index - 1}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Base anchor label indicator */}
            <div className="smp-stack-base">
              [ High Stack Initial Allocation Segment Boundary ]
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-time Memory Map Grid Editor & Comparisons */}
        <div className="smp-panel smp-col-right" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="smp-panel-header">
            <h3 className="smp-panel-title">
              <Database className="smp-icon-purple" /> RAM Data Segment & Matrix
            </h3>

            {/* Diff Comparison Button */}
            <button
              onClick={isComparing ? () => setIsComparing(false) : captureSnapshot}
              className={`smp-diff-btn ${isComparing ? 'is-active' : ''}`}
            >
              <GitCompare />
              {isComparing ? "Clear Memory Diff View" : "Snapshot Base Diff"}
            </button>
          </div>

          {/* Search Box */}
          <div className="smp-search-wrap">
            <Search className="smp-search-icon" />
            <input
              type="text"
              placeholder="Search matrix by Hex address or Variable name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="smp-search-input"
            />
          </div>

          {/* Global Absolute Memory Table Grid */}
          <div className="smp-mem-table-wrap">
            <table className="smp-mem-table">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Name</th>
                  <th>Value</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMemory.map(item => (
                  <tr key={item.address} className={getMemoryDiffClass(item)}>
                    <td className="smp-mem-addr">{item.address}</td>
                    <td>{item.name ? <span className="smp-mem-name">{item.name}</span> : '-'}</td>
                    <td>
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => {
                          const updated = [...memory];
                          const targetIdx = updated.findIndex(m => m.address === item.address);
                          updated[targetIdx].value = e.target.value;
                          setMemory(updated);
                        }}
                        className="smp-mem-value-input"
                      />
                    </td>
                    <td className="smp-mem-action-cell">
                      <button
                        onClick={() => handleRemoveMemory(item.address)}
                        className="smp-mem-del-btn"
                        title="Remove Variable"
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Edit Direct Absolute Manual Injector Form */}
          <form onSubmit={handleManualMemoryEdit} className="smp-manual-form">
            <div className="smp-manual-field">
              <label>Target Addr</label>
              <input
                type="text"
                value={manualAddr}
                onChange={(e) => setManualAddr(e.target.value)}
                placeholder="0x1010"
                required
              />
            </div>
            <div className="smp-manual-field">
              <label>New Value</label>
              <input
                type="text"
                value={manualVal}
                onChange={(e) => setManualVal(e.target.value)}
                placeholder="25"
                required
              />
            </div>
            <div className="smp-manual-submit-wrap">
              <button
                type="submit"
                className="smp-manual-submit"
              >
                <Plus /> Apply
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* FOOTER: Activity Stream Console Tracker logs */}
      <div className="smp-footer">
        <div className="smp-footer-header">
          <h3 className="smp-footer-title">
            <History className="smp-icon-indigo" /> Reactive Simulator Activity Trace Log
          </h3>
          <span className="smp-footer-sub">Viewing latest records</span>
        </div>

        <div className="smp-log-viewport">
          {logs.map((log, index) => (
            <div key={index} className={`smp-log-row ${index === 0 ? 'is-latest' : ''}`}>
              <span className="smp-log-index">[{logs.length - index}]:</span>
              <p>{log}</p>
            </div>
          ))}
        </div>
      </div>

      {showGuide && (
        <div className="smp-modal-overlay">
          <div className="smp-modal">

            {/* Modal Header */}
            <div className="smp-modal-header">
              <h2 className="smp-modal-title">
                <BookOpen />
                Understanding Architecture & Memory
              </h2>
              <button
                onClick={() => setShowGuide(false)}
                className="smp-modal-close"
              >
                <X />
              </button>
            </div>

            {/* Modal Body */}
            <div className="smp-modal-body">

              {/* Concept 0: How to Use / Data Flow */}
              <div>
                <h3 className="smp-modal-h3 smp-border-sky">Playground Data Flow</h3>
                <div className="smp-flow-grid">

                  <div className="smp-flow-card">
                    <div className="smp-flow-tag smp-flow-tag-indigo">Step 1: Input</div>
                    <strong className="text-indigo">Left Column (Controls)</strong>
                    <p>This is your command center. Pushing values, calling functions, or declaring variables here triggers CPU instructions.</p>
                  </div>

                  <div className="smp-flow-card hover-sky">
                    <div className="smp-flow-tag smp-flow-tag-sky">Output A</div>
                    <strong className="text-sky">Middle Column (Stack)</strong>
                    <p>Watch immediate reactions here. Values and return addresses will physically stack downward when you hit <b>PUSH</b> or <b>CALL PROC</b>.</p>
                  </div>

                  <div className="smp-flow-card hover-purple">
                    <div className="smp-flow-tag smp-flow-tag-purple">Output B</div>
                    <strong className="text-purple">Right Column (RAM)</strong>
                    <p>Watch long-term storage here. New rows generate when you <b>Add a Variable</b>. Edit cells directly to simulate memory mutations.</p>
                  </div>

                </div>
              </div>

              <hr className="smp-hr" />

              {/* Concept 1: Memory Layout */}
              <div className="smp-2col">
                <div>
                  <h3 className="smp-modal-h3 smp-border-purple">The Memory Highway</h3>
                  <p>System memory (RAM) is like a long highway divided into distinct neighborhoods to keep data organized and safe.</p>
                  <ul>
                    <li><strong className="text-sky">Stack Segment (Top):</strong> Temporary scratchpad for functions. It grows <em>downward</em> (e.g., 0xFFFF to 0x0000).</li>
                    <li><strong className="text-purple">Data Segment (Middle):</strong> Where permanent, global variables (like <code>my_age</code>) live.</li>
                    <li><strong style={{ color: '#34d399' }}>Code Segment (Bottom):</strong> The protected area where your actual program instructions are stored.</li>
                  </ul>
                </div>
                <div className="smp-svg-box">
                  {/* SVG: Memory Segments */}
                  <svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
                    {/* Background */}
                    <rect x="50" y="10" width="100" height="230" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="2" />

                    {/* Stack Segment */}
                    <rect x="50" y="10" width="100" height="60" fill="#0369a1" fillOpacity="0.2" stroke="#0ea5e9" strokeWidth="1" />
                    <text x="100" y="35" fill="#38bdf8" textAnchor="middle" fontWeight="bold">STACK</text>
                    <text x="100" y="50" fill="#94a3b8" textAnchor="middle" fontSize="8">(Grows Down ↓)</text>
                    <text x="155" y="18" fill="#cbd5e1" fontSize="8">0xFFFF</text>

                    {/* Gap */}
                    <path d="M 60 85 L 140 85 M 60 95 L 140 95 M 60 105 L 140 105" stroke="#334155" strokeDasharray="2 2" />

                    {/* Data Segment */}
                    <rect x="50" y="120" width="100" height="50" fill="#7e22ce" fillOpacity="0.2" stroke="#a855f7" strokeWidth="1" />
                    <text x="100" y="145" fill="#c084fc" textAnchor="middle" fontWeight="bold">DATA (.data)</text>
                    <text x="100" y="158" fill="#94a3b8" textAnchor="middle" fontSize="8">Variables</text>
                    <text x="155" y="128" fill="#cbd5e1" fontSize="8">0x1000</text>

                    {/* Code Segment */}
                    <rect x="50" y="180" width="100" height="60" fill="#047857" fillOpacity="0.2" stroke="#10b981" strokeWidth="1" />
                    <text x="100" y="210" fill="#34d399" textAnchor="middle" fontWeight="bold">CODE (.text)</text>
                    <text x="100" y="225" fill="#94a3b8" textAnchor="middle" fontSize="8">Instructions</text>
                    <text x="155" y="235" fill="#cbd5e1" fontSize="8">0x0000</text>
                  </svg>
                </div>
              </div>

              <hr className="smp-hr" />

              {/* Concept 2: CPU Pointers */}
              <div className="smp-2col">
                <div className="smp-svg-box wide smp-order-2-md-1">
                  {/* SVG: CPU Pointers to RAM */}
                  <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
                    {/* CPU Box */}
                    <rect x="10" y="50" width="100" height="100" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
                    <text x="60" y="70" fill="#a5b4fc" textAnchor="middle" fontWeight="bold" fontSize="12">CPU Registers</text>

                    <rect x="20" y="85" width="80" height="20" fill="#312e81" stroke="#4f46e5" rx="2" />
                    <text x="60" y="99" fill="#fbbf24" textAnchor="middle">SP: 0xFFFD</text>

                    <rect x="20" y="115" width="80" height="20" fill="#312e81" stroke="#4f46e5" rx="2" />
                    <text x="60" y="129" fill="#fbbf24" textAnchor="middle">IP: 0x0100</text>

                    {/* RAM Box */}
                    <rect x="190" y="20" width="90" height="160" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                    <text x="235" y="38" fill="#94a3b8" textAnchor="middle">RAM</text>

                    <rect x="195" y="45" width="80" height="20" fill="#0369a1" fillOpacity="0.3" />
                    <text x="235" y="59" fill="#38bdf8" textAnchor="middle">0xFFFF</text>

                    <rect x="195" y="65" width="80" height="20" fill="#0369a1" fillOpacity="0.6" stroke="#0ea5e9" />
                    <text x="235" y="79" fill="#e0f2fe" textAnchor="middle">0xFFFD (Top)</text>

                    <rect x="195" y="145" width="80" height="20" fill="#047857" fillOpacity="0.4" stroke="#10b981" />
                    <text x="235" y="159" fill="#34d399" textAnchor="middle">0x0100 (Code)</text>

                    {/* Arrows */}
                    <path d="M 100 95 L 180 75" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowhead)" fill="none" />
                    <path d="M 100 125 L 180 155" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowhead)" fill="none" />

                    <defs>
                      <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <polygon points="0 0, 6 3, 0 6" fill="#fbbf24" />
                      </marker>
                    </defs>
                  </svg>
                </div>
                <div className="smp-order-1-md-2">
                  <h3 className="smp-modal-h3 smp-border-amber">How the CPU Navigates</h3>
                  <p>The CPU uses specific "Pointer" registers acting as GPS coordinates to navigate the memory highway.</p>
                  <ul>
                    <li><strong style={{ color: '#fbbf24' }}>Instruction Pointer (IP / PC):</strong> Always points to the exact memory address in the Code Segment of the next command to execute.</li>
                    <li><strong style={{ color: '#fbbf24' }}>Stack Pointer (SP):</strong> Always points to the top item currently resting in the Stack Segment. When you Push or Pop, this pointer moves up and down the memory addresses.</li>
                  </ul>
                </div>
              </div>

              <hr className="smp-hr" />

              {/* Concept 3: Call/Return Flow */}
              <div>
                <h3 className="smp-modal-h3 smp-border-emerald">Subroutines (CALL & RET)</h3>
                <p>When a program calls a function, it has to remember where to go back to once the function is done. Different architectures handle this temporary backup differently:</p>
                <div className="smp-arch-compare-grid">
                  <div className="smp-arch-card">
                    <h4 className="text-indigo-300">x86 Architecture</h4>
                    <p>Automatically pushes the Return Address directly onto the <strong>Hardware Stack</strong>. The <code>RET</code> instruction pops it directly back into the IP.</p>
                  </div>
                  <div className="smp-arch-card">
                    <h4 className="text-rose-300">ARM / MIPS Architectures</h4>
                    <p>Saves the Return Address into a specific, high-speed CPU register first (the <strong>Link Register `LR`</strong> or <strong>`$ra`</strong>). It is only pushed to the stack manually if functions are nested recursively.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </main>
    </div>
  );
}