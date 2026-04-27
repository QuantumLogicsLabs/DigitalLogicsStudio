import React, { useState } from "react";
import { Settings, HardDrive, RefreshCw, Cpu, BarChart3, Workflow, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
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

const generalModelItems = [
  {
    icon: Settings,
    title: "Combinational Logic",
    desc: "Computes the next state and output values from current state and inputs.",
  },
  {
    icon: HardDrive,
    title: "Memory Elements",
    desc: "Flip-flops that hold the current state between clock cycles.",
  },
  {
    icon: RefreshCw,
    title: "Feedback Path",
    desc: "Current state feeds back into the combinational block to influence the next state.",
  },
];

const realWorldItems = [
  {
    icon: Cpu,
    title: "Registers & Shift Registers",
    desc: "Store and shift data in processors and communication systems.",
  },
  {
    icon: BarChart3,
    title: "Counters",
    desc: "Ripple, synchronous, and modulo-N counting circuits.",
  },
  {
    icon: Workflow,
    title: "FSMs — Moore & Mealy",
    desc: "Control units in CPUs, communication protocols, traffic lights.",
  },
  {
    icon: MessageSquare,
    title: "Serial Communication",
    desc: "UART, SPI, I²C interfaces that send data bit-by-bit over time.",
  },
];

const SeqIntro = () => {
  const [currentGeneral, setCurrentGeneral] = useState(0);
  const [currentRealWorld, setCurrentRealWorld] = useState(0);

  const goToPreviousGeneral = () => {
    setCurrentGeneral((prev) =>
      prev === 0 ? generalModelItems.length - 1 : prev - 1
    );
  };

  const goToNextGeneral = () => {
    setCurrentGeneral((prev) =>
      prev === generalModelItems.length - 1 ? 0 : prev + 1
    );
  };

  const goToPreviousRealWorld = () => {
    setCurrentRealWorld((prev) =>
      prev === 0 ? realWorldItems.length - 1 : prev - 1
    );
  };

  const goToNextRealWorld = () => {
    setCurrentRealWorld((prev) =>
      prev === realWorldItems.length - 1 ? 0 : prev + 1
    );
  };

  const generalItem = generalModelItems[currentGeneral];
  const GeneralIconComponent = generalItem.icon;
  const realWorldItem = realWorldItems[currentRealWorld];
  const RealWorldIconComponent = realWorldItem.icon;

  return (
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

      <div className="seq-carousel-wrap">
        <button
          className="seq-carousel-nav seq-carousel-prev"
          onClick={goToPreviousGeneral}
          aria-label="Previous model"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="seq-carousel-card seq-carousel-card-large">
          <span className="seq-feature-icon">
            <GeneralIconComponent size={40} />
          </span>
          <p className="seq-feature-title seq-carousel-title-large">{generalItem.title}</p>
          <p className="seq-feature-desc seq-carousel-desc-large">{generalItem.desc}</p>
        </div>

        <button
          className="seq-carousel-nav seq-carousel-next"
          onClick={goToNextGeneral}
          aria-label="Next model"
        >
          <ChevronRight size={24} />
        </button>

        <div className="seq-carousel-counter">
          {currentGeneral + 1} / {generalModelItems.length}
        </div>
      </div>

      {/* Updated Diagram */}
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
      <div className="seq-carousel-wrap">
        <button
          className="seq-carousel-nav seq-carousel-prev"
          onClick={goToPreviousRealWorld}
          aria-label="Previous application"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="seq-carousel-card seq-carousel-card-large">
          <span className="seq-feature-icon">
            <RealWorldIconComponent size={40} />
          </span>
          <p className="seq-feature-title seq-carousel-title-large">{realWorldItem.title}</p>
          <p className="seq-feature-desc seq-carousel-desc-large">{realWorldItem.desc}</p>
        </div>

        <button
          className="seq-carousel-nav seq-carousel-next"
          onClick={goToNextRealWorld}
          aria-label="Next application"
        >
          <ChevronRight size={24} />
        </button>

        <div className="seq-carousel-counter">
          {currentRealWorld + 1} / {realWorldItems.length}
        </div>
      </div>

      <SeqBoxSuccess />
    </div>
  </SeqLayout>
  );
};

export default SeqIntro;
