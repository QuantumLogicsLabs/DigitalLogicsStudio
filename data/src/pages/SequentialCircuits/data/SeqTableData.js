// SeqTableData.js
// Central data store for all truth tables, characteristic tables, and comparison
// tables used across the Sequential Circuits pages.

const SeqTableData = {
  // ── Combinational vs Sequential comparison (SeqIntro) ─────────────────────
  sequentialcircuit: {
    headers: ["Property", "Combinational", "Sequential"],
    rows: [
      {
        Property: "Output depends on",
        Combinational: "Current inputs only",
        Sequential: "Inputs + stored state",
      },
      {
        Property: "Memory elements",
        Combinational: "None",
        Sequential: "Flip-flops / Latches",
      },
      {
        Property: "Feedback paths",
        Combinational: "No",
        Sequential: "Yes",
      },
      {
        Property: "Clock required",
        Combinational: "No (usually)",
        Sequential: "Yes (synchronous)",
      },
      {
        Property: "Examples",
        Combinational: "Adder, Mux, Decoder",
        Sequential: "Counter, Register, FSM",
      },
    ],
  },

  // ── SR Latch NOR — truth table (SeqLatches) ───────────────────────────────
  // Active-HIGH inputs. The forbidden state occurs when both S and R are 1
  // simultaneously — both NOR outputs collapse to 0, violating Q ≠ Q̄.
  SRLatch: {
    headers: ["S", "R", "Q (next)", "Q̄ (next)", "Action"],
    rows: [
      {
        S: "0",
        R: "0",
        "Q (next)": "Q",
        "Q̄ (next)": "Q̄",
        Action: "Hold — latch retains its current value",
      },
      {
        S: "1",
        R: "0",
        "Q (next)": "1",
        "Q̄ (next)": "0",
        Action: "Set — Q is forced to 1",
      },
      {
        S: "0",
        R: "1",
        "Q (next)": "0",
        "Q̄ (next)": "1",
        Action: "Reset — Q is forced to 0",
      },
      {
        S: "1",
        R: "1",
        "Q (next)": "?",
        "Q̄ (next)": "?",
        Action:
          "⚠ Forbidden — Q and Q̄ both collapse to 0; undefined on release",
      },
    ],
  },

  // ── SR Latch NAND — truth table (SeqLatches) ─────────────────────────────
  // Active-LOW inputs (S̄, R̄). Idle state is S̄=1, R̄=1 (both HIGH).
  // A LOW pulse on S̄ sets, a LOW pulse on R̄ resets.
  // Forbidden: S̄=0, R̄=0 (both LOW simultaneously).
  SRLatchNAND: {
    headers: ["S̄", "R̄", "Q (next)", "Q̄ (next)", "Action"],
    rows: [
      {
        S̄: "1",
        R̄: "1",
        "Q (next)": "Q",
        "Q̄ (next)": "Q̄",
        Action: "Hold — no change, idle state",
      },
      {
        S̄: "0",
        R̄: "1",
        "Q (next)": "1",
        "Q̄ (next)": "0",
        Action: "Set — active-LOW pulse on S̄ sets Q to 1",
      },
      {
        S̄: "1",
        R̄: "0",
        "Q (next)": "0",
        "Q̄ (next)": "1",
        Action: "Reset — active-LOW pulse on R̄ resets Q to 0",
      },
      {
        S̄: "0",
        R̄: "0",
        "Q (next)": "?",
        "Q̄ (next)": "?",
        Action:
          "⚠ Forbidden — both NAND outputs forced to 1; unpredictable on release",
      },
    ],
  },

  // ── D Latch — truth table (SeqLatches) ───────────────────────────────────
  // No forbidden state — R is internally tied to D̄, so S and R can never
  // both be 1. EN=1 makes the latch "transparent" (Q follows D continuously).
  // EN=0 makes it "opaque" (Q is frozen regardless of D).
  DLatch: {
    headers: ["EN", "D", "Q (next)", "Action"],
    rows: [
      {
        EN: "0",
        D: "X",
        "Q (next)": "Q",
        Action: "Opaque / Hold — latch is locked, D is completely ignored",
      },
      {
        EN: "1",
        D: "0",
        "Q (next)": "0",
        Action: "Transparent — Q follows D = 0",
      },
      {
        EN: "1",
        D: "1",
        "Q (next)": "1",
        Action: "Transparent — Q follows D = 1",
      },
    ],
  },

  // ── Latch Timing Parameters (SeqLatches) ─────────────────────────────────
  // Timing constraints that must be satisfied to avoid metastability.
  // These are analogous to setup/hold times on flip-flops.
  LatchTiming: {
    headers: ["Parameter", "Symbol", "Description"],
    rows: [
      {
        Parameter: "Propagation delay",
        Symbol: "tpd",
        Description:
          "Time from an input change to a stable, valid output. Both low-to-high (tpLH) and high-to-low (tpHL) matter.",
      },
      {
        Parameter: "Setup time",
        Symbol: "tsu",
        Description:
          "D must be stable for at least this long BEFORE EN falls (goes LOW). Violating this risks metastability.",
      },
      {
        Parameter: "Hold time",
        Symbol: "th",
        Description:
          "D must remain stable for at least this long AFTER EN falls. Even a brief glitch during this window can corrupt the stored value.",
      },
      {
        Parameter: "Enable pulse width",
        Symbol: "tw",
        Description:
          "EN must remain HIGH for at least this duration to guarantee that D is reliably captured inside the latch.",
      },
    ],
  },
};

export default SeqTableData;
