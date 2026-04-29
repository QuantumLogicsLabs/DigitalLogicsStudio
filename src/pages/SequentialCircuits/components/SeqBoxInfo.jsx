export default function SeqBoxInfo() {
  return (
    <>
      <div className="seq-box info">
        <span className="seq-box-title">Key Terminology</span>
        <p>
          <ul>
            <li>
              <strong>State</strong> — The binary values stored in flip-flops at
              a given instant.
            </li>
            <li>
              <strong>Present State</strong> — The current stored value in the
              state register.
            </li>
            <li>
              <strong>Next State</strong> — The value the state will take after
              the next clock edge.
            </li>
            <li>
              <strong>State Register</strong> — All flip-flops holding the
              current circuit state.
            </li>
          </ul>
        </p>
      </div>
    </>
  );
}
