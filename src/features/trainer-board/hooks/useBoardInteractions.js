import { useCallback, useEffect, useRef, useState } from "react";
import { ICS } from "../utils/icCatalog";
import { snapICPosition } from "../utils/breadboardLayout";
import { WIRE_COLORS } from "../utils/constants";

// Owns the *behavior* of interacting with the breadboard: dragging IC
// chips from the tray (and repositioning ones already placed), drawing
// wires hole-to-hole, and the datasheet popup's open/close behavior.
//
// wireStart/preview/wireCol/colIdx/dragging/draggingPlaced are passed in
// (owned by the parent, alongside wires/placedICs) rather than owned
// here, so the undo stack can snapshot them the same way it snapshots
// wires/placedICs — keeps "what can be undone" in one place.
export default function useBoardInteractions({
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
}) {
  const [datasheet, setDatasheet] = useState(null); // {icKey, x, y} | null
  const [wireWarning, setWireWarning] = useState(""); // transient "pin already used" message

  const mouseRef = useRef({ x: 0, y: 0 });
  const wireColRef = useRef(wireCol);
  const colIdxRef = useRef(0);

  // Keep the ref mirror in sync if wireCol changes from outside (e.g. undo).
  useEffect(() => { wireColRef.current = wireCol; }, [wireCol]);

  // Auto-clear the "pin already wired" warning after a moment.
  useEffect(() => {
    if (!wireWarning) return;
    const t = setTimeout(() => setWireWarning(""), 1800);
    return () => clearTimeout(t);
  }, [wireWarning]);

  // Close datasheet popup on outside click, Escape, or scroll.
  useEffect(() => {
    if (!datasheet) return;
    const closeIt = () => setDatasheet(null);
    const onEsc = (e) => { if (e.key === "Escape") closeIt(); };
    window.addEventListener("mousedown", closeIt);
    window.addEventListener("keydown", onEsc);
    window.addEventListener("scroll", closeIt, true);
    return () => {
      window.removeEventListener("mousedown", closeIt);
      window.removeEventListener("keydown", onEsc);
      window.removeEventListener("scroll", closeIt, true);
    };
  }, [datasheet]);

  // Global mouse tracking — drives the drag ghost, IC repositioning, and
  // the in-progress wire preview line.
  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (dragging)
        setDragging((d) =>
          d ? { ...d, ghostX: e.clientX - 40, ghostY: e.clientY - 25 } : null,
        );

      if (draggingPlaced && bbWrapRef.current) {
        const svg = bbWrapRef.current.querySelector('svg');
        if (svg) {
          const rect = svg.getBoundingClientRect();
          const x = e.clientX - rect.left - draggingPlaced.offsetX;
          const y = e.clientY - rect.top - draggingPlaced.offsetY;
          setPlacedICs((p) =>
            p.map((ic) => (ic.id === draggingPlaced.id ? { ...ic, x, y } : ic))
          );
        }
      }
      // Preview uses SVG-local coords — convert mouse to SVG space.
      if (wireStart && bbWrapRef.current) {
        const rect = bbWrapRef.current.getBoundingClientRect();
        setPreview({
          ax: wireStart.ax,
          ay: wireStart.ay,
          bx: e.clientX - rect.left,
          by: e.clientY - rect.top,
          color: wireCol,
        });
      }
    };
    const onUp = (e) => {
      if (!dragging && !draggingPlaced) return;

      if (dragging) {
        const svg = bbWrapRef.current?.querySelector('svg');
        if (svg) {
          const svgRect = svg.getBoundingClientRect();
          const dropX = e.clientX - svgRect.left;
          const dropY = e.clientY - svgRect.top;
          const pinCount = ICS[dragging.icKey].pins;
          const snapped = snapICPosition(dropX, dropY, pinCount, placedICs);
          if (snapped) {
            setPlacedICs((p) => [
              ...p,
              { id: `ic${Date.now()}`, ic: dragging.icKey, x: snapped.x, y: snapped.y, col: snapped.col },
            ]);
          }
          // if snapped is null, no free slot was found — IC is not placed
          // if drop is outside the breadboard rect entirely, IC is simply discarded (not placed)
        }
      }

      if (draggingPlaced) {
        const svg = bbWrapRef.current?.querySelector('svg');
        if (svg) {
          setPlacedICs((p) =>
            p.map((ic) => {
              if (ic.id !== draggingPlaced.id) return ic;
              const pinCount = ICS[draggingPlaced.icKey].pins;
              const snapped = snapICPosition(ic.x, ic.y, pinCount, p, ic.id);
              return snapped ? { ...ic, x: snapped.x, y: snapped.y, col: snapped.col } : ic;
            })
          );
        }
        setDraggingPlaced(null);
      }
      setDragging(null);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, wireStart, wireCol, draggingPlaced, placedICs, bbWrapRef, setPlacedICs, setDragging, setDraggingPlaced, setPreview]);

  // Single-pin restriction — a hole that isn't a generic breadboard body
  // strip hole (IC pins, rail terminals, external monitor terminals) may
  // only carry ONE wire, matching how a real leg/terminal only fits one
  // wire end. Regular `bb_${col}_${row}` body holes are exempt since
  // several holes in the same 5-hole strip are already electrically the
  // same node and real breadboards allow multiple wires per strip.
  const isSingleWireHole = useCallback((id) => true, []);
  const isHoleOccupied = useCallback(
    (id) => isSingleWireHole(id) && wires.some((w) => w.from === id || w.to === id),
    [wires, isSingleWireHole],
  );

  const onHoleClick = useCallback(
    (id, svgX, svgY) => {
      if (mode === "delete") {
        recordUndo();
        setWires((p) => p.filter((w) => w.from !== id && w.to !== id));
        return;
      }
      if (mode !== "wire") return;

      if (!wireStart) {
        if (isHoleOccupied(id)) {
          setWireWarning(`Pin already wired: ${id}`);
          return;
        }
        setWireStart({ id, ax: svgX, ay: svgY });
      } else {
        if (wireStart.id !== id) {
          if (isHoleOccupied(id)) {
            setWireWarning(`Pin already wired: ${id}`);
            setWireStart(null);
            setPreview(null);
            return;
          }
          recordUndo();
          const currentCol = wireColRef.current;
          setWires((p) => [
            ...p,
            {
              id: Date.now(),
              from: wireStart.id,
              to: id,
              ax: wireStart.ax,
              ay: wireStart.ay,
              bx: svgX,
              by: svgY,
              color: currentCol,
            },
          ]);
          const ni = (colIdxRef.current + 1) % WIRE_COLORS.length;
          colIdxRef.current = ni;
          wireColRef.current = WIRE_COLORS[ni];
          setColIdx(ni);
          setWireCol(WIRE_COLORS[ni]);
        }
        setWireStart(null);
        setPreview(null);
      }
    },
    [mode, wireStart, recordUndo, isHoleOccupied, setWires, setWireStart, setPreview, setColIdx, setWireCol],
  );

  const startTrayDrag = useCallback((e, icKey) => {
    if (e.button !== 0) return; // ignore right-click here too — only left-click starts drag

    e.preventDefault();
    setDragging({ icKey, ghostX: e.clientX - 40, ghostY: e.clientY - 25 });
  }, [setDragging]);

  // DELETE mode: clicking an IC just removes it.
  const handleICDelete = useCallback((id) => {
    recordUndo();
    setPlacedICs((p) => p.filter((ic) => ic.id !== id));
  }, [recordUndo, setPlacedICs]);

  const handleICMouseDown = useCallback((id, icKey, clientX, clientY) => {
    const ic = placedICs.find((p) => p.id === id);
    if (!ic || !bbWrapRef.current) return;
    recordUndo();
    const rect = bbWrapRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left - ic.x;
    const offsetY = clientY - rect.top - ic.y;
    setDraggingPlaced({ id, icKey, offsetX, offsetY });
  }, [placedICs, bbWrapRef, recordUndo, setDraggingPlaced]);

  const handleExternalPinDown = useCallback((id, e) => {
    e.stopPropagation();
    if (!bbWrapRef.current) return;
    const rect = bbWrapRef.current.getBoundingClientRect();
    onHoleClick(id, e.clientX - rect.left, e.clientY - rect.top);
  }, [bbWrapRef, onHoleClick]);

  // Right-click on a placed IC (breadboard) opens its datasheet popup.
  const handleICContextMenu = useCallback((icKey, clientX, clientY) => {
    setDatasheet({ icKey, x: clientX, y: clientY });
  }, []);

  // Right-click on a tray IC (not yet placed) opens its datasheet popup too.
  const handleTrayContextMenu = useCallback((clientX, clientY, icKey) => {
    setDatasheet({ icKey, x: clientX, y: clientY });
  }, []);

  const cancelWire = useCallback(() => {
    setWireStart(null);
    setPreview(null);
  }, [setWireStart, setPreview]);

  const pickWireColor = useCallback((c, i) => {
    setWireCol(c);
    setColIdx(i);
    wireColRef.current = c;
    colIdxRef.current = i;
  }, [setWireCol, setColIdx]);

  return {
    datasheet, setDatasheet, wireWarning,
    onHoleClick, startTrayDrag, handleICDelete, handleICMouseDown,
    handleExternalPinDown, handleICContextMenu, handleTrayContextMenu,
    cancelWire, pickWireColor,
  };
}
