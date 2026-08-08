import { useCallback, useEffect, useRef } from "react";

// Keeps a bounded history of board-state snapshots so wiring/placement
// mistakes can be undone with Ctrl/Cmd+Z. `recordUndo` should be called
// right before any mutating action; `undoLast` restores the most recent
// snapshot.
export default function useUndoStack({
  switches, setSwitches,
  wires, setWires,
  placedICs, setPlacedICs,
  wireCol, setWireCol,
  colIdx, setColIdx,
  setWireStart,
  setPreview,
  setDragging,
  setDraggingPlaced,
}) {
  const undoStackRef = useRef([]);

  const recordUndo = useCallback(() => {
    undoStackRef.current.push(structuredClone({
      switches,
      wires,
      placedICs,
      wireCol,
      colIdx,
    }));
    if (undoStackRef.current.length > 50) {
      undoStackRef.current.shift();
    }
  }, [switches, wires, placedICs, wireCol, colIdx]);

  const undoLast = useCallback(() => {
    const prev = undoStackRef.current.pop();
    if (!prev) return;
    setSwitches(prev.switches);
    setWires(prev.wires);
    setPlacedICs(prev.placedICs);
    setWireCol(prev.wireCol);
    setColIdx(prev.colIdx);
    setWireStart(null);
    setPreview(null);
    setDragging(null);
    setDraggingPlaced(null);
  }, [setSwitches, setWires, setPlacedICs, setWireCol, setColIdx, setWireStart, setPreview, setDragging, setDraggingPlaced]);

  // Ctrl/Cmd+Z keyboard shortcut (ignored while typing in an input/textarea).
  useEffect(() => {
    const onKeyDown = (e) => {
      if (!(e.ctrlKey || e.metaKey) || e.shiftKey) return;
      if (String(e.key).toLowerCase() !== "z") return;
      const target = e.target;
      const tagName = target?.tagName;
      if (tagName === "INPUT" || tagName === "TEXTAREA" || target?.isContentEditable) {
        return;
      }
      e.preventDefault();
      undoLast();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undoLast]);

  return { recordUndo, undoLast };
}
