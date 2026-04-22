export default function SeqBoxInfo() {
  return (
    <>
      <div className="seq-box info">
        <span className="seq-box-title">Key Terminology</span>
        <p>
          <strong>State</strong> — The binary values stored in flip-flops at a
          given instant.
          <br />
          <strong>Present State</strong> — The current stored value in the state
          register.
          <br />
          <strong>Next State</strong> — The value the state will take after the
          next clock edge.
          <br />
          <strong>State Register</strong> — All flip-flops holding the current
          circuit state.
        </p>
      </div>
    </>
  );
}
