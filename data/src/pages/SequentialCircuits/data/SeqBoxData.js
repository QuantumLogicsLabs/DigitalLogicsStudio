// SeqBoxData.js
// Info-box content reused across Sequential Circuits pages.
// Each entry maps to a <SeqBox data={SeqBoxData.key} /> component.

let SeqBoxData = {
  // ── Used on SeqIntro ──────────────────────────────────────────────────────
  sequentialcircuit: {
    title: "Core Definition",
    description: () => (
      <>
        A <strong>sequential circuit</strong> is a digital circuit whose output
        depends not only on the current inputs but also on the{" "}
        <strong>history of past inputs</strong>. It contains memory elements
        that store state information between clock cycles.
      </>
    ),
  },

  // ── Used on SeqLatches ────────────────────────────────────────────────────
  // Gives students a plain-English anchor before diving into gates and truth tables.
  latch: {
    title: "What is a latch?",
    description: () => (
      <>
        A <strong>latch</strong> is the simplest digital memory element. It
        stores <strong>exactly one bit</strong> — either a 0 or a 1 — and holds
        that value indefinitely until it receives an explicit signal to change.
        <br />
        <br />
        The secret behind a latch's memory is <strong>feedback</strong>: the
        output of each gate is wired back to the input of the other gate. This
        cross-coupling creates two stable states and prevents the output from
        drifting.
        <br />
        <br />
        Latches are <strong>level-sensitive</strong> (asynchronous) — they
        respond to input levels at any time, unlike flip-flops which only react
        on a clock edge.
      </>
    ),
  },
};

export default SeqBoxData;
