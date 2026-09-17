import React, { useState, useRef, useEffect } from "react";
import { parseExpressionToCircuit } from "../../shared/utils/expressionParser";
import RelatedSeoLinks from "../../shared/seo/RelatedSeoLinks";
import Navbar from "../../shared/components/navbar";
import { useTheme } from "../../shared/context/ThemeContext";
import "./Boolforge.css";
import {
  Sidebar,
  RenameModal,
  CircuitCanvas,
  ToolbarRibbon,
  CreateComponentDialog,
} from "./components";
import { useToast } from "../../shared/context/ToastContext";

import {
  useKeyboardShortcuts,
  useSheets,
  useCanvasInteractions,
  useSimulation,
  useAI,
  useCustomComponents,
} from "./hooks";

const Boolforge = ({
  simplifiedExpression = null,
  variables = [],
  onCircuitChange,
  portNames = null,
  embedded = false,
  initialGates = null,
  initialWires = null,
}) => {
  const { theme, toggle: toggleTheme } = useTheme();

  // ── UI shell state ──────────────────────────────────────────────────────
  const [fullScreen, setFullScreen] = useState(false);
  const [showSimulate, setShowSimulate] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [showGridOverlay, setShowGridOverlay] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Comments ────────────────────────────────────────────────────────────
  const [commentMode, setCommentMode] = useState(false);

  // ── Refs shared across hooks ─────────────────────────────────────────────
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const hasAutoBuilt = useRef(false);
  const lastSyncKeyRef = useRef(null);

  // ── Custom components ────────────────────────────────────────────────────
  const {
    components: customComponents,
    createComponent,
    deleteComponent,
  } = useCustomComponents();

  // ── Sheets + circuit state ───────────────────────────────────────────────
  const circuit = useSheets({
    portNames,
    containerRef,
    customComponents,
    snapEnabled,
  });

  const {
    sheets,
    activeSheetId,
    setActiveSheetId,
    addSheet,
    renameSheet,
    deleteSheet,
    loadSheets,

    gates,
    setGates,
    wires,
    setWires,

    setGateIdCounter,
    wireIdCounter,
    setWireIdCounter,

    setInputCounter,
    setOutputCounter,

    selectedGate,
    setSelectedGate,
    selectedGateIds,
    setSelectedGateIds,
    selectedWireIds,
    setSelectedWireIds,

    renamingGate,
    renameValue,
    setRenameValue,

    history,
    setHistory,
    historyIndex,
    setHistoryIndex,

    gateMap,
    inputGates,
    outputGates,

    saveToHistory,
    undo,
    redo,

    snapToGrid,

    deleteGate,
    addGate,
    addInputSlot,
    removeInputSlot,

    startRename,
    commitRename,
    cancelRename,

    toggleInput,

    mergeInputGates,
    deleteWire,

    copySelectedGates,
    pasteGates,
    duplicateSelectedGates,

    clearCircuit,

    customIcMeta,

    // Comments
    comments,
    addComment,
    updateComment,
    deleteComment,
  } = circuit;

  // ── Simulation ───────────────────────────────────────────────────────────
  const {
    evaluateGate,
    truthTable,
  } = useSimulation({
    gates,
    wires,
    gateMap,
    customIcMeta,
  });

  // ── Canvas interactions ──────────────────────────────────────────────────
  const canvas = useCanvasInteractions({
    gates,
    setGates,
    wires,
    setWires,
    gateMap,
    wireIdCounter,
    setWireIdCounter,
    saveToHistory,
    snapToGrid,
    snapEnabled,
    selectedGateIds,
    setSelectedGateIds,
    selectedGate,
    setSelectedGate,
    selectedWireIds,
    setSelectedWireIds,
    mergeInputGates,
    deleteWire,
    containerRef,
    canvasRef,
    customIcMeta,
  });

  const {
    zoom,
    setZoom,
    panOffset,
    setPanOffset,
    isPanning,
    spacePressed,
    selectionToolActive,
    setSelectionToolActive,
    isSelecting,
    selectionStart,
    selectionEnd,
    connectingFrom,
    setConnectingFrom,
    connectCursor,
    setConnectCursor,
    clientToWorld,
    startDrag,
    onDrag,
    stopDrag,
    handleOutputPortClick,
    handleCanvasContextMenu,
    handleCanvasMouseDown,
    handleMouseMove,
    handleMouseUp,
    completeConnection,
    stopPortEvent,
    fitToView,
    setIsPanning,
    setPanStart,
  } = canvas;

  // ── AI ───────────────────────────────────────────────────────────────────
  const {
    aiPrompt,
    setAiPrompt,
    hint,
    setHint,
    hintLoading,
    hintError,
    setHintError,
    isGenLoading,
    handleGenerateCircuit,
    handleRequestHint,
  } = useAI({
    gates,
    wires,
    inputGates,
    outputGates,
    setGates,
    setWires,
    setGateIdCounter,
    setWireIdCounter,
    setInputCounter,
    setOutputCounter,
    saveToHistory,
  });

  // ── Custom component dialog ──────────────────────────────────────────────
  const toast = useToast();
  const [showCreateComponent, setShowCreateComponent] = useState(false);

  const selectionPortCounts = {
    inputs: gates.filter(
      (g) =>
        selectedGateIds.includes(g.id) &&
        g.type === "INPUT"
    ).length,

    outputs: gates.filter(
      (g) =>
        selectedGateIds.includes(g.id) &&
        g.type === "OUTPUT"
    ).length,
  };

  const canCreateComponent =
    selectionPortCounts.inputs > 0 &&
    selectionPortCounts.outputs > 0;

  const handleCreateComponent = async (name) => {
    const selected = gates.filter((g) =>
      selectedGateIds.includes(g.id)
    );

    const innerInputs = selected.filter(
      (g) => g.type === "INPUT"
    );

    const innerOutputs = selected.filter(
      (g) => g.type === "OUTPUT"
    );

    const innerWires = wires.filter(
      (w) =>
        selectedGateIds.includes(w.fromId) &&
        selectedGateIds.includes(w.toId)
    );

    await createComponent({
      name,
      inputs: innerInputs.map((g) => ({
        label: g.label,
      })),
      outputs: innerOutputs.map((g) => ({
        label: g.label,
      })),
      gates: selected,
      wires: innerWires,
    });
  };

  const handleDeleteComponent = async (id, name) => {
    await deleteComponent(id);
    toast.success(`Deleted "${name}".`);
  };

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  useKeyboardShortcuts({
    undo,
    redo,
    gates,
    selectedGateIds,
    setSelectedGateIds,
    selectedWireIds,
    setSelectedWireIds,
    deleteGate,
    setWires,
    saveToHistory,
    copySelectedGates,
    pasteGates,
    duplicateSelectedGates,
    setConnectingFrom,
    setConnectCursor,
  });

  // ── Build circuit from expression ────────────────────────────────────────
  useEffect(() => {
    if (
      simplifiedExpression &&
      variables.length > 0 &&
      !hasAutoBuilt.current
    ) {
      const circuitFromExpr =
        parseExpressionToCircuit(
          simplifiedExpression,
          variables
        );

      if (
        circuitFromExpr.gates &&
        circuitFromExpr.gates.length > 0
      ) {
        setGates(circuitFromExpr.gates);
        setWires(circuitFromExpr.wires);

        setGateIdCounter(
          circuitFromExpr.gateIdCounter ||
            circuitFromExpr.gates.length
        );

        setWireIdCounter(
          circuitFromExpr.wireIdCounter ||
            circuitFromExpr.wires.length
        );

        const inputCount =
          circuitFromExpr.gates.filter(
            (g) => g.type === "INPUT"
          ).length;

        const outputCount =
          circuitFromExpr.gates.filter(
            (g) => g.type === "OUTPUT"
          ).length;

        setInputCounter(inputCount);
        setOutputCounter(outputCount);

        hasAutoBuilt.current = true;

        setTimeout(() => {
          setHistory([
            {
              gates: circuitFromExpr.gates,
              wires: circuitFromExpr.wires,
              gateIdCounter:
                circuitFromExpr.gateIdCounter ||
                circuitFromExpr.gates.length,
              wireIdCounter:
                circuitFromExpr.wireIdCounter ||
                circuitFromExpr.wires.length,
              inputCounter: inputCount,
              outputCounter: outputCount,
            },
          ]);

          setHistoryIndex(0);
        }, 100);
      }
    }
  }, [
    simplifiedExpression,
    variables,
    setGates,
    setWires,
    setGateIdCounter,
    setWireIdCounter,
    setInputCounter,
    setOutputCounter,
    setHistory,
    setHistoryIndex,
  ]);

  // ── Initial circuit sync ─────────────────────────────────────────────────
  useEffect(() => {
    if (
      Array.isArray(initialGates) &&
      initialGates.length > 0
    ) {
      const key = JSON.stringify({
        g: initialGates,
        w: initialWires || [],
      });

      if (lastSyncKeyRef.current === key) {
        return;
      }

      lastSyncKeyRef.current = key;

      setGates(initialGates);
      setWires(
        Array.isArray(initialWires)
          ? initialWires
          : []
      );

      const maxGateId =
        Math.max(
          ...initialGates.map(
            (g) => Number(g.id) || 0
          ),
          0
        ) + 1;

      const maxWireId =
        Math.max(
          ...(initialWires || []).map(
            (w) => Number(w.id) || 0
          ),
          0
        ) + 1;

      setGateIdCounter(maxGateId);
      setWireIdCounter(maxWireId);
    }
  }, [
    initialGates,
    initialWires,
    setGates,
    setWires,
    setGateIdCounter,
    setWireIdCounter,
  ]);

  // ── Notify parent when circuit changes ───────────────────────────────────
  useEffect(() => {
    if (typeof onCircuitChange === "function") {
      lastSyncKeyRef.current =
        JSON.stringify({
          g: gates,
          w: wires,
        });

      onCircuitChange(gates, wires);
    }
  }, [
    gates,
    wires,
    onCircuitChange,
  ]);

  // ── Resize canvas ────────────────────────────────────────────────────────
  useEffect(() => {
    const canvasEl = canvasRef.current;
    const container = containerRef.current;

    if (!canvasEl || !container) {
      return;
    }

    const resizeCanvas = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;

      if (w > 0 && h > 0) {
        canvasEl.width = w;
        canvasEl.height = h;

        const ctx = canvasEl.getContext("2d");

        if (ctx) {
          ctx.clearRect(
            0,
            0,
            w,
            h
          );
        }
      }
    };

    resizeCanvas();

    window.addEventListener(
      "resize",
      resizeCanvas
    );

    let ro;

    if (
      typeof ResizeObserver !==
      "undefined"
    ) {
      ro = new ResizeObserver(
        resizeCanvas
      );

      ro.observe(container);
    }

    return () => {
      window.removeEventListener(
        "resize",
        resizeCanvas
      );

      if (ro) {
        ro.disconnect();
      }
    };
  }, []);

  // ── Mobile sidebar resize ────────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  // ── Circuit tool ─────────────────────────────────────────────────────────
  const circuitTool = (
    <div
      className="container circuit-maker"
      onMouseMove={(e) => {
        if (connectingFrom) {
          setConnectCursor(
            clientToWorld(
              e.clientX,
              e.clientY
            )
          );
        }

        if (
          isPanning ||
          isSelecting
        ) {
          handleMouseMove(e);
        } else {
          onDrag(e);
        }
      }}
      onMouseUp={() => {
        stopDrag();
        handleMouseUp();
      }}
      onTouchMove={(e) => {
        if (e.touches.length === 1) {
          const t = e.touches[0];

          if (isPanning) {
            handleMouseMove(t);
          } else {
            onDrag(t);
          }
        }
      }}
      onTouchEnd={() => {
        stopDrag();
        handleMouseUp();
      }}
    >
      <ToolbarRibbon
        embedded={embedded}
        containerRef={containerRef}
        aiPrompt={aiPrompt}
        setAiPrompt={setAiPrompt}
        handleRequestHint={handleRequestHint}
        hintLoading={hintLoading}
        handleGenerateCircuit={handleGenerateCircuit}
        isGenLoading={isGenLoading}
        hint={hint}
        hintError={hintError}
        setHint={setHint}
        setHintError={setHintError}
        inputGates={inputGates}
        outputGates={outputGates}
        canCreateComponent={canCreateComponent}
        onOpenCreateComponent={() =>
          setShowCreateComponent(true)
        }
        customComponents={customComponents}
        addGate={addGate}
        onDeleteComponent={
          handleDeleteComponent
        }
        wires={wires}
        toggleInput={toggleInput}
        evaluateGate={evaluateGate}
        truthTable={truthTable}
        undo={undo}
        redo={redo}
        historyIndex={historyIndex}
        history={history}
        gates={gates}
        setGates={setGates}
        sheets={sheets}
        loadSheets={loadSheets}
        saveToHistory={saveToHistory}
        clearCircuit={clearCircuit}
        selectionToolActive={
          selectionToolActive
        }
        setSelectionToolActive={
          setSelectionToolActive
        }
        theme={theme}
        toggleTheme={toggleTheme}
        onToggleFullScreen={() =>
          setFullScreen(
            !fullScreen
          )
        }
        showSimulate={
          showSimulate
        }
        onToggleSimulate={() =>
          setShowSimulate(
            (v) => !v
          )
        }
        showAI={showAIPanel}
        onToggleAI={() =>
          setShowAIPanel(
            (v) => !v
          )
        }
        snapEnabled={snapEnabled}
        setSnapEnabled={
          setSnapEnabled
        }
        showGridOverlay={
          showGridOverlay
        }
        setShowGridOverlay={
          setShowGridOverlay
        }
        onToggleSidebar={() =>
          setSidebarOpen(
            (v) => !v
          )
        }
        comments={comments}
        commentMode={commentMode}
        setCommentMode={
          setCommentMode
        }
      />

      <div className="circuit-workspace">
        {sidebarOpen && (
          <div
            className="sidebar-drawer-overlay"
            onClick={() =>
              setSidebarOpen(false)
            }
            aria-hidden="true"
          />
        )}

        <Sidebar
          selectionToolActive={
            selectionToolActive
          }
          setSelectionToolActive={
            setSelectionToolActive
          }
          simplifiedExpression={
            simplifiedExpression
          }
          addGate={addGate}
          isOpen={sidebarOpen}
          onClose={() =>
            setSidebarOpen(false)
          }
        />

        <CircuitCanvas
          gates={gates}
          wires={wires}
          gateMap={gateMap}
          selectedGateIds={
            selectedGateIds
          }
          selectedWireIds={
            selectedWireIds
          }
          setSelectedGateIds={
            setSelectedGateIds
          }
          setSelectedWireIds={
            setSelectedWireIds
          }
          setSelectedGate={
            setSelectedGate
          }
          evaluateGate={
            evaluateGate
          }
          zoom={zoom}
          panOffset={panOffset}
          isPanning={isPanning}
          spacePressed={
            spacePressed
          }
          selectionToolActive={
            selectionToolActive
          }
          setSelectionToolActive={
            setSelectionToolActive
          }
          isSelecting={isSelecting}
          selectionStart={
            selectionStart
          }
          selectionEnd={
            selectionEnd
          }
          connectingFrom={
            connectingFrom
          }
          setConnectCursor={
            setConnectCursor
          }
          connectCursor={
            connectCursor
          }
          clientToWorld={
            clientToWorld
          }
          startDrag={startDrag}
          onDrag={onDrag}
          stopDrag={stopDrag}
          setIsPanning={
            setIsPanning
          }
          setPanStart={
            setPanStart
          }
          handleOutputPortClick={
            handleOutputPortClick
          }
          handleCanvasContextMenu={
            handleCanvasContextMenu
          }
          handleCanvasMouseDown={
            handleCanvasMouseDown
          }
          handleMouseMove={
            handleMouseMove
          }
          handleMouseUp={
            handleMouseUp
          }
          stopPortEvent={
            stopPortEvent
          }
          fitToView={fitToView}
          setZoom={setZoom}
          addInputSlot={
            addInputSlot
          }
          removeInputSlot={
            removeInputSlot
          }
          startRename={
            startRename
          }
          deleteGate={
            deleteGate
          }
          deleteWire={
            deleteWire
          }
          completeConnection={
            completeConnection
          }
          containerRef={
            containerRef
          }
          canvasRef={canvasRef}
          sheets={sheets}
          activeSheetId={
            activeSheetId
          }
          onSwitchSheet={
            setActiveSheetId
          }
          onAddSheet={addSheet}
          onRenameSheet={
            renameSheet
          }
          onDeleteSheet={
            deleteSheet
          }
          embedded={embedded}
          snapEnabled={
            snapEnabled
          }
          setPanOffset={
            setPanOffset
          }
          inputGates={
            inputGates
          }
          outputGates={
            outputGates
          }
          toggleInput={
            toggleInput
          }
          truthTable={
            truthTable
          }
          showSimulate={
            showSimulate
          }
          onCloseSimulate={() =>
            setShowSimulate(
              false
            )
          }
          showAIPanel={
            showAIPanel
          }
          onCloseAIPanel={() =>
            setShowAIPanel(
              false
            )
          }
          aiPrompt={aiPrompt}
          setAiPrompt={
            setAiPrompt
          }
          handleRequestHint={
            handleRequestHint
          }
          hintLoading={
            hintLoading
          }
          handleGenerateCircuit={
            handleGenerateCircuit
          }
          isGenLoading={
            isGenLoading
          }
          hint={hint}
          hintError={
            hintError
          }
          setHint={setHint}
          setHintError={
            setHintError
          }
          showGridOverlay={
            showGridOverlay
          }
          customIcMeta={
            customIcMeta
          }

          // ── Comments ───────────────────────────────────────────────────
          comments={comments}
          commentMode={
            commentMode
          }
          setCommentMode={
            setCommentMode
          }
          onAddComment={
            addComment
          }
          onUpdateComment={
            updateComment
          }
          onDeleteComment={
            deleteComment
          }

          /*
           * Comment movement:
           *
           * Canvas comments store x/y directly.
           *
           * Component comments store an offset from their
           * target gate.
           */
          onMoveComment={(
            id,
            position
          ) => {
            const comment =
              comments.find(
                (c) =>
                  c.id === id
              );

            if (!comment) {
              return;
            }

            if (
              comment.type ===
              "canvas"
            ) {
              updateComment(
                id,
                {
                  x: position.x,
                  y: position.y,
                }
              );

              return;
            }

            if (
              comment.type ===
              "component"
            ) {
              const targetGate =
                gateMap.get(
                  comment.targetId
                );

              if (!targetGate) {
                return;
              }

              updateComment(
                id,
                {
                  offsetX:
                    position.x -
                    targetGate.x,
                  offsetY:
                    position.y -
                    targetGate.y,
                }
              );
            }
          }}
        />
      </div>

      <CreateComponentDialog
        open={
          showCreateComponent
        }
        onClose={() =>
          setShowCreateComponent(
            false
          )
        }
        onCreate={
          handleCreateComponent
        }
        portCount={
          selectionPortCounts
        }
      />

      <RenameModal
        renamingGate={
          renamingGate
        }
        renameValue={
          renameValue
        }
        setRenameValue={
          setRenameValue
        }
        commitRename={
          commitRename
        }
        cancelRename={
          cancelRename
        }
      />

      <RelatedSeoLinks />
    </div>
  );

  if (embedded) {
    return circuitTool;
  }

  return (
    <div
      className={`boolforge-page theme-${theme}`}
    >
      <div className="grid-background" />

      <Navbar
        toggleTheme={
          toggleTheme
        }
        theme={theme}
        isVisible={!fullScreen}
      />

      <main
        className={`boolforge-main${
          !fullScreen
            ? ""
            : " boolforge-main--fullscreen"
        }`}
      >
        {circuitTool}
      </main>
    </div>
  );
};

export default Boolforge;