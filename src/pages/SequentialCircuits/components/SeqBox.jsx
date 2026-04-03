export default function SeqBox() {
  return (
    <>
      <div className="seq-box">
        <span className="seq-box-title">Core Definition</span>
        <p>
          A <strong>sequential circuit</strong> is a digital circuit whose
          output depends not only on the current inputs but also on the{" "}
          <strong>history of past inputs</strong>. It contains memory elements
          that store state information between clock cycles.
        </p>
      </div>
    </>
  );
}
