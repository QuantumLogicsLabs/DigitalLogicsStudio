import React from "react";
import SeqLayout from "./SeqLayout";
import SeqBox from "./components/SeqBox";
import SeqTable from "./components/SeqTable";
import SeqGrid from "./components/SeqGrid";
import SeqDiagram from "./components/SeqDiagram";
import SeqGridData from "./data/SeqGridData";
import SeqBoxData from "./data/SeqBoxData";
import SeqBoxInfo from "./components/SeqBoxInfo";
import SeqBoxSuccess from "./components/SeqBoxSuccess";
import SeqTableData from "./data/SeqTableData";

const SeqIntro = () => (
  <SeqLayout
    title="Introduction to Sequential Circuits"
    subtitle="Understanding circuits with memory — where outputs depend on both current inputs and past history."
  >
    <div className="seq-content-body">
      <SeqBox data={SeqBoxData.sequentialcircuit} />
      <h2>Combinational vs Sequential</h2>
      <p>
        In a <strong>combinational circuit</strong>, output is determined purely
        by the current inputs — there is no memory. In a{" "}
        <strong>sequential circuit</strong>, feedback paths and storage elements
        allow the circuit to "remember" previous states.
      </p>

      <SeqTable data={SeqTableData.sequentialcircuit} />

      <h2>General Model</h2>
      <p>Every sequential circuit has three fundamental parts:</p>

      <SeqGrid data={SeqGridData.GeneralModel} />

      <SeqDiagram />

      <h2>Types of Sequential Circuits</h2>

      <SeqGrid data={SeqGridData.TypesofSequentialCircuits} />

      <h2>The Clock Signal</h2>
      <p>
        In synchronous circuits, a periodic square-wave <strong>clock</strong>{" "}
        coordinates all state changes. Flip-flops respond on the{" "}
        <strong>rising edge</strong> (positive-edge triggered) or
        <strong>falling edge</strong> (negative-edge triggered).
      </p>

      <SeqBoxInfo />

      <h2>Real-World Applications</h2>
      <SeqGrid data={SeqGridData.RealWorldApplications} />

      <SeqBoxSuccess />
    </div>
  </SeqLayout>
);

export default SeqIntro;
