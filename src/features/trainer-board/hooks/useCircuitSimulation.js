import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IC_LOGIC, buildNetlist, evaluateCircuit, advanceSequential, readNode } from "../utils/simulationEngine";

// Owns the live simulation: builds the netlist from wires + placed ICs,
// resolves every node's boolean value, applies clocked (edge-triggered)
// updates to flip-flops/counter/shift-register state, and exposes a
// `monitor(ref)` reader for any pin/terminal on the board.
export default function useCircuitSimulation({ wires, placedICs, switches, clk, pushBtns }) {
  const [icRegs, setIcRegs] = useState({});
  const prevClkRef = useRef(new Map());

  // Live netlist (rebuilt whenever wiring/placement changes).
  const netlist = useMemo(() => buildNetlist(wires, placedICs), [wires, placedICs]);

  // Which placed ICs actually have their VCC pin wired to +rail and GND
  // pin wired to -rail — Breadboard shows a red badge on the rest.
  const poweredIds = useMemo(() => {
    const s = new Set();
    placedICs.forEach((p) => {
      const logic = IC_LOGIC[p.ic];
      if (!logic) return;
      const pin = (n) => `${p.id}_p${n}`;
      const ok = netlist.find(pin(logic.vcc)) === netlist.find("NET_VCC")
        && netlist.find(pin(logic.gnd)) === netlist.find("NET_GND");
      if (ok) s.add(p.id);
    });
    return s;
  }, [netlist, placedICs]);

  // External source pins that actively drive a value into the netlist —
  // everything else on the board is a passive monitor point that only
  // shows a signal once it's actually wired to one of these.
  const sources = useMemo(() => {
    const s = {};
    switches.forEach((v, i) => { s[`swled_${i}`] = v; });
    s["flag_0"] = clk;        // onboard clock generator terminal
    s["flag_1"] = pushBtns[0]; // push-button 1 terminal
    s["flag_2"] = pushBtns[1]; // push-button 2 terminal
    return s;
  }, [switches, clk, pushBtns]);

  // Combinational settle — recomputed every render off current inputs +
  // the latched sequential state.
  const { values: nodeValues, shorts: shortNodes } = useMemo(
    () => evaluateCircuit(netlist, placedICs, sources, icRegs),
    [netlist, placedICs, sources, icRegs],
  );
  const hasShortCircuit = shortNodes.size > 0;

  // Clocked (edge-triggered) state update — flip-flops, counter, shift
  // register all latch on a 0->1 transition of their own clock pin,
  // however it's actually wired.
  useEffect(() => {
    const next = advanceSequential(netlist, placedICs, nodeValues, icRegs, prevClkRef.current);
    if (next) setIcRegs((r) => ({ ...r, ...next }));
  }, [netlist, placedICs, nodeValues, icRegs]);

  // Reads the resolved value of any monitor pin (0 if unconnected/floating).
  const monitor = useCallback((ref) => readNode(netlist, nodeValues, ref), [netlist, nodeValues]);

  const dec = [0, 1, 2, 3, 4, 5, 6, 7].reduce((a, i) => a + monitor(`databus_${i}`) * (1 << i), 0);

  return { netlist, poweredIds, nodeValues, shortNodes, hasShortCircuit, monitor, dec, icRegs, setIcRegs };
}
