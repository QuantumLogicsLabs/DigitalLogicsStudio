export default function SeqTable() {
  return (
    <>
      <div className="seq-table-wrap">
        <table className="seq-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Combinational</th>
              <th>Sequential</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Output depends on</td>
              <td>Current inputs only</td>
              <td>Inputs + stored state</td>
            </tr>
            <tr>
              <td>Memory elements</td>
              <td>None</td>
              <td>Flip-flops / Latches</td>
            </tr>
            <tr>
              <td>Feedback paths</td>
              <td>No</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>Clock required</td>
              <td>No (usually)</td>
              <td>Yes (synchronous)</td>
            </tr>
            <tr>
              <td>Examples</td>
              <td>Adder, Mux, Decoder</td>
              <td>Counter, Register, FSM</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
