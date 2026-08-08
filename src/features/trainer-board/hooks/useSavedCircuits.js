import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import trainerBoardService from "../trainerBoardService";

// Pulls whatever id the backend used for a saved-circuit document,
// regardless of whether it comes back as Mongo's `_id`, a plain `id`,
// or nested inside `{ circuit: {...} }`.
function extractId(payload) {
  return payload?._id || payload?.id || payload?.circuit?._id || payload?.circuit?.id || null;
}

function extractCircuit(payload) {
  return payload?.circuit || payload;
}

function extractList(payload) {
  if (Array.isArray(payload)) return payload;
  return payload?.circuits || payload?.data || [];
}

// Owns the full save/load lifecycle for the trainer board:
//  - saveCircuit: create-or-update depending on whether a circuit is
//    currently loaded
//  - saveAsNew: always creates a fresh saved circuit (keeps the original
//    untouched)
//  - openBrowser/loadCircuit/deleteCircuit: the "My Circuits" list, and
//    pulling a saved circuit's full state back onto the board
//  - startNewCircuit: clears the board back to a blank slate
//
// `getBoardState` should return { wires, placedICs, switches, clkHz, clkOn }
// for the CURRENT board (called fresh on every save).
// `applyBoardState` should apply a { wires, placedICs, switches, clkHz,
// clkOn } snapshot back onto the board's state setters.
export default function useSavedCircuits({ isAuthenticated, authLoading, getBoardState, applyBoardState }) {
  const navigate = useNavigate();
  const [circuitName, setCircuitName] = useState("Untitled Circuit");
  const [loadedCircuitId, setLoadedCircuitId] = useState(null);
  const [saveState, setSaveState] = useState({ status: "idle", message: "" }); // idle|saving|saved|error
  const [browser, setBrowser] = useState({ open: false, loading: false, error: "", circuits: [] });
  const [loadingId, setLoadingId] = useState(null);

  const flashSaved = useCallback((message) => {
    setSaveState({ status: "saved", message });
    setTimeout(() => setSaveState((s) => (s.status === "saved" ? { status: "idle", message: "" } : s)), 2500);
  }, []);

  // Not logged in -> send them to /login instead of silently failing or
  // saving nowhere, matching how the Save button is gated behind
  // isAuthenticated.
  const requireAuth = useCallback(() => {
    if (authLoading) return false;
    if (!isAuthenticated) {
      setSaveState({ status: "error", message: "Please log in to save your circuit." });
      navigate("/login", { state: { from: "/trainer-board" } });
      return false;
    }
    return true;
  }, [authLoading, isAuthenticated, navigate]);

  // Persist the full board state (wires, placed ICs, switches, clock
  // settings) to the backend under the user's account. Overwrites the
  // currently-loaded circuit if there is one; otherwise creates a new one.
  const saveCircuit = useCallback(async () => {
    if (!requireAuth()) return;
    setSaveState({ status: "saving", message: "Saving…" });
    try {
      const payload = { name: circuitName || "Untitled Circuit", ...getBoardState() };
      if (loadedCircuitId) {
        await trainerBoardService.updateCircuit(loadedCircuitId, payload);
        flashSaved("Updated ✓");
      } else {
        const saved = await trainerBoardService.saveCircuit(payload);
        const newId = extractId(saved);
        if (newId) setLoadedCircuitId(newId);
        flashSaved("Saved ✓");
      }
    } catch (err) {
      setSaveState({ status: "error", message: err?.message || "Save failed. Try again." });
    }
  }, [circuitName, loadedCircuitId, getBoardState, requireAuth, flashSaved]);

  // Always creates a brand-new saved circuit, leaving whatever was
  // loaded (if anything) untouched on the server.
  const saveAsNew = useCallback(async () => {
    if (!requireAuth()) return;
    setSaveState({ status: "saving", message: "Saving a copy…" });
    try {
      const payload = { name: circuitName || "Untitled Circuit", ...getBoardState() };
      const saved = await trainerBoardService.saveCircuit(payload);
      const newId = extractId(saved);
      if (newId) setLoadedCircuitId(newId);
      flashSaved("Saved as new ✓");
    } catch (err) {
      setSaveState({ status: "error", message: err?.message || "Save failed. Try again." });
    }
  }, [circuitName, getBoardState, requireAuth, flashSaved]);

  // Opens the "My Circuits" browser and fetches the list.
  const openBrowser = useCallback(async () => {
    if (!requireAuth()) return;
    setBrowser({ open: true, loading: true, error: "", circuits: [] });
    try {
      const data = await trainerBoardService.listCircuits();
      setBrowser({ open: true, loading: false, error: "", circuits: extractList(data) });
    } catch (err) {
      setBrowser({ open: true, loading: false, error: err?.message || "Couldn't load your circuits.", circuits: [] });
    }
  }, [requireAuth]);

  const closeBrowser = useCallback(() => setBrowser((b) => ({ ...b, open: false })), []);

  // Fetches one saved circuit and pushes its full state back onto the
  // board — this is the "extract/fetch it back" half that was missing.
  const loadCircuit = useCallback(async (id) => {
    setLoadingId(id);
    try {
      const data = await trainerBoardService.getCircuit(id);
      const circuit = extractCircuit(data);
      applyBoardState({
        wires: circuit.wires || [],
        placedICs: circuit.placedICs || [],
        switches: circuit.switches || Array(8).fill(0),
        clkHz: circuit.clkHz ?? 1,
        clkOn: circuit.clkOn ?? true,
      });
      setCircuitName(circuit.name || "Untitled Circuit");
      setLoadedCircuitId(circuit._id || circuit.id || id);
      flashSaved("Loaded ✓");
      closeBrowser();
    } catch (err) {
      setSaveState({ status: "error", message: err?.message || "Couldn't load that circuit." });
    } finally {
      setLoadingId(null);
    }
  }, [applyBoardState, closeBrowser, flashSaved]);

  const deleteCircuit = useCallback(async (id) => {
    setBrowser((b) => ({ ...b, loading: true }));
    try {
      await trainerBoardService.deleteCircuit(id);
      setBrowser((b) => ({
        ...b,
        loading: false,
        circuits: b.circuits.filter((c) => (c._id || c.id) !== id),
      }));
      if (loadedCircuitId === id) setLoadedCircuitId(null);
    } catch (err) {
      setBrowser((b) => ({ ...b, loading: false, error: err?.message || "Couldn't delete that circuit." }));
    }
  }, [loadedCircuitId]);

  // Clears the board back to a blank slate for starting a fresh design.
  const startNewCircuit = useCallback(() => {
    applyBoardState({ wires: [], placedICs: [], switches: Array(8).fill(0), clkHz: 1, clkOn: true });
    setCircuitName("Untitled Circuit");
    setLoadedCircuitId(null);
    setSaveState({ status: "idle", message: "" });
  }, [applyBoardState]);

  return {
    circuitName, setCircuitName,
    loadedCircuitId,
    saveState,
    saveCircuit, saveAsNew,
    browser, openBrowser, closeBrowser,
    loadCircuit, loadingId,
    deleteCircuit,
    startNewCircuit,
  };
}
