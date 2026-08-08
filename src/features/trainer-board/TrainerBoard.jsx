import { useCallback, useEffect, useRef, useState } from "react";
import { Navbar } from "../../shared/components/Navbar";
import Footer from "../../shared/components/Footer";
import { useTheme } from "../../shared/context/ThemeContext";
import { useAuth } from "../../auth/context/AuthContext";

import "./TrainerBoard.css";

import { 
  BoardHeader, 
  Toolbar, 
  LeftPanel, 
  CenterPanel, 
  RightPanel, 
  StatusBar, 
  DragGhost, 
  DatasheetPopup, 
  LoadCircuitModal, 
} from "./components";

import { 
  useUndoStack, 
  useBoardInteractions, 
  useCircuitSimulation, 
  useSavedCircuits, 
} from "./hooks";

import { 
  getBBDimensions,
  WIRE_COLORS,
} from "./utils";

// ════════════════════════════════════════════════════════════════════
// IT-300 — Digital Logic Trainer Board
//
// This file only owns the board's core data (switches, clock, wires,
// placed ICs, mode) and composes the pieces that live in ./components,
// ./hooks, and ./utils. See those folders for:
//   utils/      — pure logic: IC catalog, breadboard grid math, the
//                 pin-level simulation engine, shared constants
//   hooks/      — stateful behavior: undo stack, board interactions
//                 (drag/drop + wiring), live simulation, saved circuits
//   components/ — presentational pieces (panels, breadboard, popups...),
//                 memoized so unrelated state changes (e.g. typing a
//                 circuit name) don't re-render the whole board
// ════════════════════════════════════════════════════════════════════
export default function IT300() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { isAuthenticated, loading: authLoading } = useAuth();

  // ── Core board state ────────────────────────────────────────────
  const [switches, setSwitches] = useState(Array(8).fill(0));
  const [clkHz, setClkHz] = useState(1);
  const [clkOn, setClkOn] = useState(true);
  const [clk, setClk] = useState(0);
  const [pushBtns, setPush] = useState([0, 0]);
  const [wires, setWires] = useState([]);
  const [placedICs, setPlacedICs] = useState([]);
  const [mode, setMode] = useState("wire");

  // ── Interaction state (also snapshotted by undo) ───────────────
  const [dragging, setDragging] = useState(null);
  const [draggingPlaced, setDraggingPlaced] = useState(null);
  const [wireStart, setWireStart] = useState(null); // {id, ax, ay} — SVG-local coords
  const [preview, setPreview] = useState(null);
  const [wireCol, setWireCol] = useState(WIRE_COLORS[0]);
  const [colIdx, setColIdx] = useState(0);

  const bbWrapRef = useRef(null);
  const clkRef = useRef();

  const { W: bbW, H: bbH } = getBBDimensions();

  // ── Undo stack (Ctrl/Cmd+Z keyboard shortcut wired up inside the hook) ──
  const { recordUndo } = useUndoStack({
    switches, setSwitches,
    wires, setWires,
    placedICs, setPlacedICs,
    wireCol, setWireCol,
    colIdx, setColIdx,
    setWireStart, setPreview, setDragging, setDraggingPlaced,
  });

  // ── Drag/drop + wiring + datasheet popup behavior ──────────────
  const {
    datasheet, setDatasheet, wireWarning,
    onHoleClick, startTrayDrag, handleICDelete, handleICMouseDown,
    handleExternalPinDown, handleICContextMenu, handleTrayContextMenu,
    cancelWire, pickWireColor,
  } = useBoardInteractions({
    wires, setWires,
    placedICs, setPlacedICs,
    mode,
    recordUndo,
    bbWrapRef,
    dragging, setDragging,
    draggingPlaced, setDraggingPlaced,
    wireStart, setWireStart,
    preview, setPreview,
    wireCol, setWireCol,
    setColIdx,
  });

  // ── Live simulation ─────────────────────────────────────────────
  const { poweredIds, monitor, dec, hasShortCircuit, shortNodes } = useCircuitSimulation({
    wires, placedICs, switches, clk, pushBtns,
  });

  // ── Save / load ──────────────────────────────────────────────────
  const getBoardState = useCallback(
    () => ({ wires, placedICs, switches, clkHz, clkOn }),
    [wires, placedICs, switches, clkHz, clkOn],
  );
  const applyBoardState = useCallback((s) => {
    recordUndo();
    setWires(s.wires ?? []);
    setPlacedICs(s.placedICs ?? []);
    setSwitches(s.switches ?? Array(8).fill(0));
    setClkHz(s.clkHz ?? 1);
    setClkOn(s.clkOn ?? true);
    setWireStart(null);
    setPreview(null);
  }, [recordUndo]);

  const {
    circuitName, setCircuitName,
    loadedCircuitId,
    saveState,
    saveCircuit, saveAsNew,
    browser, openBrowser, closeBrowser,
    loadCircuit, loadingId,
    deleteCircuit,
    startNewCircuit,
  } = useSavedCircuits({ isAuthenticated, authLoading, getBoardState, applyBoardState });

  // ── Clock generator ─────────────────────────────────────────────
  useEffect(() => {
    clearInterval(clkRef.current);
    if (!clkOn) {
      setClk(0);
      return;
    }
    clkRef.current = setInterval(() => setClk((c) => c ^ 1), 500 / clkHz);
    return () => clearInterval(clkRef.current);
  }, [clkHz, clkOn]);

  const pulseClock = useCallback(() => {
    // Toggle the clock once, creating one 0→1 and one 1→0 edge.
    setClk((c) => c ^ 1);
    // Revert after 60ms — gives the simulation time to register the edge.
    const timer = setTimeout(() => setClk((c) => c ^ 1), 60);
    return () => clearTimeout(timer);
  }, []);

  const toggleSwitch = useCallback((i) => {
    recordUndo();
    setSwitches((p) => {
      const n = [...p];
      n[i] ^= 1;
      return n;
    });
  }, [recordUndo]);

  const clearWires = useCallback(() => {
    recordUndo();
    setWires([]);
  }, [recordUndo]);

  const clearICs = useCallback(() => {
    recordUndo();
    setPlacedICs([]);
  }, [recordUndo]);

  const onWireDelete = useCallback((wireId) => {
    recordUndo();
    setWires((p) => p.filter((w) => w.id !== wireId));
  }, [recordUndo]);

  return (
    <div className={`boolforge-page theme-${theme}`} style={{ background: "#1a1a1a" }}>
      <Navbar toggleTheme={toggleTheme} theme={theme} />

      <div className="trainer-page-container">
        <div className="trainer-outer-chassis">
          <div className="trainer-side-wall" />
          <div className="trainer-bottom-bar" />

          <div className="trainer-pcb">
            <div className="trainer-pcb-grid" />

            <BoardHeader />

            <Toolbar
              mode={mode} setMode={setMode}
              wireCol={wireCol} pickWireColor={pickWireColor}
              wireStart={wireStart} cancelWire={cancelWire}
              wireWarning={wireWarning}
              hasShortCircuit={hasShortCircuit} shortNodes={shortNodes}
              onClearWires={clearWires} onClearICs={clearICs}
              circuitName={circuitName} setCircuitName={setCircuitName}
              isAuthenticated={isAuthenticated}
              saveState={saveState}
              onSave={saveCircuit} onSaveAsNew={saveAsNew}
              onOpenBrowser={openBrowser} onNewCircuit={startNewCircuit}
              loadedCircuitId={loadedCircuitId}
            />

            <div className="trainer-grid">
              <LeftPanel
                dec={dec}
                clkHz={clkHz} setClkHz={setClkHz}
                clkOn={clkOn} setClkOn={setClkOn}
                clk={clk}
                pulseClock={pulseClock}
                pushBtns={pushBtns} setPush={setPush}
              />

              <CenterPanel
                bbWrapRef={bbWrapRef} bbW={bbW} bbH={bbH}
                wireStart={wireStart} wires={wires} placedICs={placedICs}
                onHoleClick={onHoleClick}
                handleICMouseDown={handleICMouseDown}
                handleICContextMenu={handleICContextMenu}
                mode={mode}
                handleICDelete={handleICDelete}
                poweredIds={poweredIds}
                preview={preview}
                onWireDelete={onWireDelete}
                switches={switches}
                onToggleSwitch={toggleSwitch}
                handleExternalPinDown={handleExternalPinDown}
                dec={dec}
                startTrayDrag={startTrayDrag}
                handleTrayContextMenu={handleTrayContextMenu}
              />

              <RightPanel
                switches={switches}
                monitor={monitor}
                handleExternalPinDown={handleExternalPinDown}
                dec={dec}
                wires={wires} placedICs={placedICs}
                clkOn={clkOn} clkHz={clkHz}
              />
            </div>

            <StatusBar
              clkOn={clkOn} clkHz={clkHz} clk={clk}
              switches={switches} dec={dec}
              wires={wires} placedICs={placedICs}
              mode={mode}
              hasShortCircuit={hasShortCircuit} shortNodes={shortNodes}
            />
          </div>
        </div>
      </div>

      <DragGhost dragging={dragging} />

      {datasheet && (
        <DatasheetPopup
          icKey={datasheet.icKey}
          x={datasheet.x}
          y={datasheet.y}
          onClose={() => setDatasheet(null)}
        />
      )}

      <LoadCircuitModal
        browser={browser}
        onClose={closeBrowser}
        onLoad={loadCircuit}
        onDelete={deleteCircuit}
        loadingId={loadingId}
        currentId={loadedCircuitId}
      />

      <Footer />
    </div>
  );
}
