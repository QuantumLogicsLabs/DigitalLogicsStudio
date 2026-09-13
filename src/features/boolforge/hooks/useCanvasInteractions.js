import { useState, useRef, useCallback, useEffect } from "react";
import { GATE_WIDTH, getICHeight, getOutputY, hitWireAt } from "../utils";
import { IC_TYPES } from "../../../shared/data/gates";

// Owns all canvas-level interaction: pan/zoom, box selection, gate & comment
// dragging (mouse + touch), and wire creation/completion. Talks to the
// circuit state via the setters/helpers passed in.
export function useCanvasInteractions({
  gates,
  setGates,
  wires,
  setWires,
  comments = [],
  setComments,
  gateMap,
  wireIdCounter,
  setWireIdCounter,
  saveToHistory,
  snapToGrid,
  selectedGateIds,
  setSelectedGateIds,
  selectedGate,
  setSelectedGate,
  selectedWireIds,
  setSelectedWireIds,
  selectedCommentIds = [],
  setSelectedCommentIds,
  mergeInputGates,
  deleteWire,
  containerRef,
  canvasRef,
  snapEnabled = false,
  customIcMeta = {},
}) {
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [spacePressed, setSpacePressed] = useState(false);
  const [selectionToolActive, setSelectionToolActive] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [selectionEnd, setSelectionEnd] = useState({ x: 0, y: 0 });
  const [selectionStartIds, setSelectionStartIds] = useState([]);

  const [dragging, setDragging] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [connectCursor, setConnectCursor] = useState(null);
  const [dragStartPositions, setDragStartPositions] = useState({});
  const [dragStartMouse, setDragStartMouse] = useState({ x: 0, y: 0 });

  const hasMovedRef = useRef(false);
  const wasCtrlClickRef = useRef(false);
  const touchStateRef = useRef({ type: null, id: null, startX: 0, startY: 0 });
  const dragTypeRef = useRef(null); // Tracks if we are dragging a 'gate' or 'comment'

  const clientToWorld = useCallback(
    (clientX, clientY) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return {
        x: (clientX - rect.left - panOffset.x) / zoom,
        y: (clientY - rect.top - panOffset.y) / zoom,
      };
    },
    [containerRef, panOffset, zoom]
  );

  // ── Drag (single & group) ─────────────────────────────────────────────
  const startDrag = useCallback(
    (e, gate) => {
      if (e.button !== 0) return;
      e.stopPropagation();
      setSelectedWireIds([]);
      if (setSelectedCommentIds) setSelectedCommentIds([]);
      setIsPanning(false);

      const isCtrl = e.ctrlKey || e.metaKey;
      let nextSelection = [...selectedGateIds];
      if (isCtrl) {
        if (selectedGateIds.includes(gate.id))
          nextSelection = nextSelection.filter((id) => id !== gate.id);
        else nextSelection.push(gate.id);
      } else {
        if (!selectedGateIds.includes(gate.id)) nextSelection = [gate.id];
      }
      setSelectedGateIds(nextSelection);
      setSelectedGate(gate);
      wasCtrlClickRef.current = isCtrl;
      hasMovedRef.current = false;
      dragTypeRef.current = "gate";

      const startPositions = {};
      gates.forEach((g) => {
        if (nextSelection.includes(g.id)) startPositions[g.id] = { x: g.x, y: g.y };
      });
      setDragStartPositions(startPositions);

      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - panOffset.x) / zoom;
      const mouseY = (e.clientY - rect.top - panOffset.y) / zoom;
      setDragStartMouse({ x: mouseX, y: mouseY });
      setDragging(true);
    },
    [gates, selectedGateIds, containerRef, panOffset, zoom, setSelectedWireIds, setSelectedGateIds, setSelectedGate, setSelectedCommentIds]
  );

  const startDragComment = useCallback(
    (e, comment) => {
      if (e.button !== 0) return;
      e.stopPropagation();
      setSelectedWireIds([]);
      setSelectedGateIds([]);
      setSelectedGate(null);
      setIsPanning(false);

      const isCtrl = e.ctrlKey || e.metaKey;
      let nextSelection = [...selectedCommentIds];
      if (isCtrl) {
        if (selectedCommentIds.includes(comment.id))
          nextSelection = nextSelection.filter((id) => id !== comment.id);
        else nextSelection.push(comment.id);
      } else {
        if (!selectedCommentIds.includes(comment.id)) nextSelection = [comment.id];
      }
      if (setSelectedCommentIds) setSelectedCommentIds(nextSelection);
      wasCtrlClickRef.current = isCtrl;
      hasMovedRef.current = false;
      dragTypeRef.current = "comment";

      const startPositions = {};
      comments.forEach((c) => {
        if (nextSelection.includes(c.id)) startPositions[c.id] = { x: c.x, y: c.y };
      });
      setDragStartPositions(startPositions);

      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - panOffset.x) / zoom;
      const mouseY = (e.clientY - rect.top - panOffset.y) / zoom;
      setDragStartMouse({ x: mouseX, y: mouseY });
      setDragging(true);
    },
    [comments, selectedCommentIds, containerRef, panOffset, zoom, setSelectedWireIds, setSelectedGateIds, setSelectedGate, setSelectedCommentIds]
  );

  const onDrag = useCallback(
    (e) => {
      if (!dragging || isPanning) return;
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - panOffset.x) / zoom;
      const mouseY = (e.clientY - rect.top - panOffset.y) / zoom;
      const dx = mouseX - dragStartMouse.x;
      const dy = mouseY - dragStartMouse.y;

      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) hasMovedRef.current = true;

      if (dragTypeRef.current === "gate" && selectedGateIds.length > 0) {
        setGates((prev) =>
          prev.map((g) => {
            if (selectedGateIds.includes(g.id)) {
              const startPos = dragStartPositions[g.id];
              if (startPos) {
                return {
                  ...g,
                  x: snapToGrid(startPos.x + dx),
                  y: snapToGrid(startPos.y + dy),
                };
              }
            }
            return g;
          })
        );
      } else if (dragTypeRef.current === "comment" && selectedCommentIds.length > 0) {
        setComments?.((prev) =>
          prev.map((c) => {
            if (selectedCommentIds.includes(c.id)) {
              const startPos = dragStartPositions[c.id];
              if (startPos) {
                return {
                  ...c,
                  x: snapToGrid(startPos.x + dx),
                  y: snapToGrid(startPos.y + dy),
                };
              }
            }
            return c;
          })
        );
      }
    },
    [dragging, isPanning, dragTypeRef, selectedGateIds, selectedCommentIds, containerRef, panOffset, zoom, dragStartMouse, dragStartPositions, snapToGrid, setGates, setComments]
  );

  const stopDrag = useCallback(() => {
    if (dragging) {
      setDragging(false);
      if (!hasMovedRef.current && !wasCtrlClickRef.current) {
        if (dragTypeRef.current === "gate" && selectedGate) {
          setSelectedGateIds([selectedGate.id]);
        }
      }
      dragTypeRef.current = null;
      saveToHistory();
    }
  }, [dragging, selectedGate, saveToHistory, setSelectedGateIds]);

  // ── Wire connections ──────────────────────────────────────────────────
  const startConnection = useCallback((gate, outputIndex = 0) => {
  if (!gate.hasOutput) return;
  setConnectingFrom({ gateId: gate.id, outputIndex });
  setConnectCursor({
    x: gate.x + GATE_WIDTH,
    y: getOutputY(gate, outputIndex, customIcMeta),
  });
}, [customIcMeta]);

  const endWiring = useCallback(() => {
    setConnectingFrom(null);
    setConnectCursor(null);
  }, []);

  const completeConnection = useCallback(
    (toGate, toIndex) => {
      const fromGateId = connectingFrom?.gateId ?? connectingFrom?.gate?.id;
      if (!connectingFrom || fromGateId == null || fromGateId === toGate.id) {
        endWiring();
        return;
      }

      const fromGate = gateMap.get(fromGateId);
      if (fromGate?.type === "INPUT" && toGate.type === "INPUT") {
        mergeInputGates(fromGateId, toGate.id);
        return;
      }

      const fromOutputIndex = connectingFrom.outputIndex ?? 0;
      const filteredWires = wires.filter((w) => !(w.toId === toGate.id && w.toIndex === toIndex));
      const finalWires =
        toGate.type === "OUTPUT" || toGate.type === "INPUT"
          ? filteredWires.filter((w) => w.toId !== toGate.id)
          : filteredWires;
      const newWire = {
        id: wireIdCounter,
        fromId: fromGateId,
        fromOutputIndex,
        toId: toGate.id,
        toIndex,
      };
      setWires([...finalWires, newWire]);
      setWireIdCounter((prev) => prev + 1);
      endWiring();
      saveToHistory();
    },
    [
      connectingFrom, 
      gateMap, 
      mergeInputGates, 
      wires, 
      wireIdCounter, 
      setWires, 
      setWireIdCounter, 
      endWiring, 
      saveToHistory
    ]
  );

  const handleOutputPortClick = useCallback(
    (gate, outputIndex = 0) => {
      const fromGateId = connectingFrom?.gateId ?? connectingFrom?.gate?.id;
      if (connectingFrom && fromGateId !== gate.id && gate.type === "INPUT") {
        completeConnection(gate, 0);
        return;
      }
      startConnection(gate, outputIndex);
    },
    [connectingFrom, completeConnection, startConnection]
  );

  const handleCanvasContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      const { x, y } = clientToWorld(e.clientX, e.clientY);
      const hit = hitWireAt(x, y, wires, gateMap, 12, snapEnabled, customIcMeta);
      if (hit) deleteWire(hit.id);
    },
    [clientToWorld, wires, gateMap, deleteWire, snapEnabled,customIcMeta]
  );

  const stopPortEvent = useCallback((e) => {
    e.stopPropagation();
  }, []);

  // ── Canvas events (pan, select, zoom) ──────────────────────────────────
  const handleCanvasMouseDown = useCallback(
    (e) => {
      if (e.target === canvasRef.current) {
        e.preventDefault();
        if (connectingFrom) {
          setConnectingFrom(null);
          setConnectCursor(null);
          return;
        }
        const { x: startX, y: startY } = clientToWorld(e.clientX, e.clientY);
        if (e.button === 0) {
          const hit = hitWireAt(startX, startY, wires, gateMap, 12, snapEnabled, customIcMeta);
          if (hit) {
            setSelectedWireIds([hit.id]);
            setSelectedGateIds([]);
            if (setSelectedCommentIds) setSelectedCommentIds([]);
            setSelectedGate(null);
            return;
          }
          setSelectedWireIds([]);
        }
        const isCtrl = e.ctrlKey || e.metaKey;
        const isMiddleClick = e.button === 1;

        if (spacePressed || isMiddleClick) {
          setIsPanning(true);
          setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
        } else if (e.button === 0) {
          if (!selectionToolActive && !e.shiftKey) {
            setIsPanning(true);
            setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
            setSelectedGateIds([]);
            if (setSelectedCommentIds) setSelectedCommentIds([]);
            setSelectedGate(null);
          } else {
            setIsSelecting(true);
            setSelectionStart({ x: startX, y: startY });
            setSelectionEnd({ x: startX, y: startY });
            setSelectionStartIds(isCtrl ? selectedGateIds : []);
            if (!isCtrl) {
              setSelectedGateIds([]);
              if (setSelectedCommentIds) setSelectedCommentIds([]);
              setSelectedGate(null);
            }
          }
        }
      }
    },
    [
      canvasRef, 
      connectingFrom, 
      clientToWorld, 
      wires, 
      gateMap, 
      spacePressed, 
      panOffset, 
      selectionToolActive, 
      selectedGateIds, 
      setSelectedWireIds, 
      setSelectedGateIds, 
      setSelectedGate, 
      setSelectedCommentIds,
      snapEnabled,
      customIcMeta
    ]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (isPanning) {
        setPanOffset({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      } else if (isSelecting) {
        const rect = containerRef.current.getBoundingClientRect();
        const currentX = (e.clientX - rect.left - panOffset.x) / zoom;
        const currentY = (e.clientY - rect.top - panOffset.y) / zoom;
        setSelectionEnd({ x: currentX, y: currentY });

        const left = Math.min(selectionStart.x, currentX);
        const top = Math.min(selectionStart.y, currentY);
        const width = Math.abs(selectionStart.x - currentX);
        const height = Math.abs(selectionStart.y - currentY);
        const box = { x1: left, y1: top, x2: left + width, y2: top + height };

        const intersectingIds = gates
          .filter((g) => {
           const isCustomGate = g.type?.startsWith("CUSTOM_");
           const gH = isCustomGate && customIcMeta[g.type]
             ? Math.max(100, Math.max(customIcMeta[g.type].inputs, customIcMeta[g.type].outputs) * 22 + 20)
             : IC_TYPES.has(g.type) ? getICHeight(g.type) : 100;
            const gateBox = { x1: g.x, y1: g.y, x2: g.x + GATE_WIDTH, y2: g.y + gH };
            return (
              gateBox.x1 < box.x2 &&
              gateBox.x2 > box.x1 &&
              gateBox.y1 < box.y2 &&
              gateBox.y2 > box.y1
            );
          })
          .map((g) => g.id);

        if (e.ctrlKey || e.metaKey) {
          setSelectedGateIds(Array.from(new Set([...selectionStartIds, ...intersectingIds])));
        } else {
          setSelectedGateIds(intersectingIds);
        }
      }
    },
    [isPanning, isSelecting, panStart, containerRef, panOffset, zoom, selectionStart, selectionStartIds, gates, setSelectedGateIds, customIcMeta]
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setIsSelecting(false);
  }, []);

  // ── Touch support ──────────────────────────────────────────────────────
  const handleTouchStart = useCallback(
    (e) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      const canvas = canvasRef.current;
      const gateEl = touch.target.closest?.(".gate");
      if (gateEl) {
        const gateId = parseInt(gateEl.dataset.gateId, 10);
        const gate = gates.find((g) => g.id === gateId);
        if (gate) {
          e.preventDefault();
          let nextSelection = [...selectedGateIds];
          if (!selectedGateIds.includes(gate.id)) nextSelection = [gate.id];
          setSelectedGateIds(nextSelection);
          setSelectedGate(gate);

          const startPositions = {};
          gates.forEach((g) => {
            if (nextSelection.includes(g.id)) startPositions[g.id] = { x: g.x, y: g.y };
          });
          setDragStartPositions(startPositions);

          const rect = containerRef.current.getBoundingClientRect();
          const mouseX = (touch.clientX - rect.left - panOffset.x) / zoom;
          const mouseY = (touch.clientY - rect.top - panOffset.y) / zoom;
          setDragStartMouse({ x: mouseX, y: mouseY });

          touchStateRef.current = { type: "drag", id: gateId, startX: touch.clientX, startY: touch.clientY };
          dragTypeRef.current = "gate";
          setDragging(true);
          return;
        }
      }
      if (touch.target === canvas || touch.target.classList.contains("gates-container")) {
        e.preventDefault();
        touchStateRef.current = { type: "pan", id: null, startX: 0, startY: 0 };
        setIsPanning(true);
        setPanStart({ x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y });
      }
    },
    [gates, zoom, panOffset, selectedGateIds, canvasRef, containerRef, setSelectedGateIds, setSelectedGate]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      const state = touchStateRef.current;
      if (state.type === "pan") {
        e.preventDefault();
        setPanOffset({ x: touch.clientX - panStart.x, y: touch.clientY - panStart.y });
      } else if (state.type === "drag" && dragTypeRef.current === "gate") {
        e.preventDefault();
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = (touch.clientX - rect.left - panOffset.x) / zoom;
        const mouseY = (touch.clientY - rect.top - panOffset.y) / zoom;
        const dx = mouseX - dragStartMouse.x;
        const dy = mouseY - dragStartMouse.y;
        setGates((prev) =>
          prev.map((g) => {
            if (selectedGateIds.includes(g.id)) {
              const startPos = dragStartPositions[g.id];
              if (startPos) {
                return {
                  ...g,
                  x: snapToGrid(startPos.x + dx),
                  y: snapToGrid(startPos.y + dy),
                };
              }
            }
            return g;
          })
        );
      }
    },
    [panStart, zoom, panOffset, snapToGrid, selectedGateIds, dragStartMouse, dragStartPositions, containerRef, setGates]
  );

  const handleTouchEnd = useCallback(() => {
    if (touchStateRef.current.type === "drag" && dragging) {
      setDragging(false);
      dragTypeRef.current = null;
      saveToHistory();
    }
    if (touchStateRef.current.type === "pan") setIsPanning(false);
    touchStateRef.current = { type: null, id: null, startX: 0, startY: 0 };
  }, [dragging, saveToHistory]);

  // ── Fit to view ────────────────────────────────────────────────────────
  const fitToView = useCallback(() => {
    const container = containerRef.current;
    if (!container || gates.length === 0) return;
    const GATE_W = 130, GATE_H = 100, PADDING = 40;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    gates.forEach((g) => {
      minX = Math.min(minX, g.x);
      minY = Math.min(minY, g.y);
      maxX = Math.max(maxX, g.x + GATE_W);
      maxY = Math.max(maxY, g.y + GATE_H);
    });
    const contentW = maxX - minX + PADDING * 2;
    const contentH = maxY - minY + PADDING * 2;
    const containerW = container.clientWidth;
    const containerH = container.clientHeight;
    const scaleX = containerW / contentW;
    const scaleY = containerH / contentH;
    const newZoom = Math.min(scaleX, scaleY, 1.5);
    setZoom(newZoom);
    setPanOffset({
      x: PADDING * newZoom - minX * newZoom,
      y: PADDING * newZoom - minY * newZoom,
    });
  }, [gates, containerRef]);

  // ── Effects: space key, wheel zoom, touch listeners ────────────────────
  useEffect(() => {
    const down = (e) => {
      if (e.key === " " && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") setSpacePressed(true);
    };
    const up = (e) => { if (e.key === " ") setSpacePressed(false); };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const wheelHandler = (e) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left, mouseY = e.clientY - rect.top;
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(3, zoom * delta));
      const ratio = newZoom / zoom;
      setZoom(newZoom);
      setPanOffset({ x: mouseX - (mouseX - panOffset.x) * ratio, y: mouseY - (mouseY - panOffset.y) * ratio });
    };
    container.addEventListener("wheel", wheelHandler, { passive: false });
    return () => container.removeEventListener("wheel", wheelHandler);
  }, [containerRef, zoom, panOffset]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: false });
    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [containerRef, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    zoom, setZoom,
    panOffset, setPanOffset,
    isPanning, setIsPanning,
    panStart, setPanStart,
    spacePressed,
    selectionToolActive, setSelectionToolActive,
    isSelecting, selectionStart, selectionEnd,
    dragging,
    connectingFrom, setConnectingFrom,
    connectCursor, setConnectCursor,
    clientToWorld,
    startDrag, startDragComment, onDrag, stopDrag,
    startConnection, endWiring, completeConnection, handleOutputPortClick,
    handleCanvasContextMenu, stopPortEvent,
    handleCanvasMouseDown, handleMouseMove, handleMouseUp,
    handleTouchStart, handleTouchMove, handleTouchEnd,
    fitToView,
  };
}