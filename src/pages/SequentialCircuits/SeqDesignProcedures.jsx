import React, { useState } from "react";
import SeqLayout from "./SeqLayout";
import SeqTable from "./components/SeqTable";
import { 
  ClipboardList, 
  Workflow, 
  TableProperties, 
  Minimize2, 
  Binary, 
  Cpu, 
  Ruler, 
  Upload, 
  CircuitBoard,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const stateAssignmentData = {
  headers: ['Strategy', 'Description', 'Best For'],
  rows: [
    { 'Strategy': 'Binary sequential', 'Description': '00, 01, 10, 11 …', 'Best For': 'Simple, easy to analyze' },
    { 'Strategy': 'Gray code', 'Description': '00, 01, 11, 10 …', 'Best For': 'Minimizes transitions → simpler logic' },
    { 'Strategy': 'One-hot', 'Description': '0001, 0010, 0100 …', 'Best For': 'FPGAs with abundant flip-flops' },
    { 'Strategy': 'Output-based', 'Description': 'State code = output value', 'Best For': 'Simplifies output logic' }
  ]
};

const ffTypeData = {
  headers: ['Flip-Flop', 'Input Logic Complexity', 'Don\'t-Cares in Excitation'],
  rows: [
    { 'Flip-Flop': 'D', 'Input Logic Complexity': 'Simplest (D = Q⁺)', 'Don\'t-Cares in Excitation': 'None' },
    { 'Flip-Flop': 'JK', 'Input Logic Complexity': 'Moderate, but more X\'s help K-maps', 'Don\'t-Cares in Excitation': 'Most (2 per row)' },
    { 'Flip-Flop': 'T', 'Input Logic Complexity': 'Simple for counters', 'Don\'t-Cares in Excitation': 'None' },
    { 'Flip-Flop': 'SR', 'Input Logic Complexity': 'Moderate, has forbidden state', 'Don\'t-Cares in Excitation': 'Some' }
  ]
};

const designExampleStateData = {
  headers: ['Present Q₁Q₀', 'x=0 → Next', 'x=1 → Next', 'Output Z'],
  rows: [
    { 'Present Q₁Q₀': '00 (S0)', 'x=0 → Next': '00', 'x=1 → Next': '01', 'Output Z': '0' },
    { 'Present Q₁Q₀': '01 (S1)', 'x=0 → Next': '10', 'x=1 → Next': '01', 'Output Z': '0' },
    { 'Present Q₁Q₀': '10 (S2)', 'x=0 → Next': '00', 'x=1 → Next': '11', 'Output Z': '0' },
    { 'Present Q₁Q₀': '11 (S3)', 'x=0 → Next': '00', 'x=1 → Next': '01', 'Output Z': '1' }
  ]
};;

const designSteps = [
  {
    icon: ClipboardList,
    title: "1. Understand the Spec",
    desc: "Identify inputs, outputs, and what must be remembered between clock cycles.",
  },
  {
    icon: Workflow,
    title: "2. Draw State Diagram",
    desc: "Sketch a directed graph of all states and transitions for all inputs.",
  },
  {
    icon: TableProperties,
    title: "3. Build State Table",
    desc: "Convert the diagram into a tabular form with all present state / input / next state / output entries.",
  },
  {
    icon: Minimize2,
    title: "4. Reduce States",
    desc: "Merge equivalent states to minimize hardware. Fewer states = fewer flip-flops.",
  },
  {
    icon: Binary,
    title: "5. State Assignment",
    desc: "Assign unique binary codes to each state. Need ⌈log₂(n)⌉ flip-flops for n states.",
  },
  {
    icon: Cpu,
    title: "6. Choose FF Type",
    desc: "Select D, JK, T, or SR based on which gives simpler input logic for your state transitions.",
  },
  {
    icon: Ruler,
    title: "7. Derive FF Inputs",
    desc: "Use excitation tables + K-maps to find minimal Boolean equations for each FF input.",
  },
  {
    icon: Upload,
    title: "8. Derive Outputs",
    desc: "Use K-maps to find output equations — f(state) for Moore, f(state,input) for Mealy.",
  },
  {
    icon: CircuitBoard,
    title: "9. Draw the Circuit",
    desc: "Implement all equations as gates feeding the flip-flops, with state feedback.",
  },
];

const SeqDesignProcedures = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const goToPrevious = () => {
    setCurrentStep((prev) => (prev === 0 ? designSteps.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentStep((prev) => (prev === designSteps.length - 1 ? 0 : prev + 1));
  };

  const step = designSteps[currentStep];
  const IconComponent = step.icon;

  return (
    <SeqLayout
      title="Design Procedures"
      subtitle="A systematic methodology for designing synchronous sequential circuits — from word problem to working schematic."
    >
      <div className="seq-content-body">
        <div className="seq-box">
          <span className="seq-box-title">Design vs Analysis</span>
          <p>
            <strong>Analysis</strong> starts with a circuit and finds its
            behavior.
            <strong>Design</strong> starts with a behavior specification and
            derives the circuit. The process is systematic and reversible.
          </p>
        </div>

        <h2>Complete 9-Step Design Flow</h2>

         <div className="seq-carousel-wrap">
                <div className="seq-carousel-row">
                  <button
                    className="seq-carousel-nav seq-carousel-prev"
                    onClick={goToPrevious}
                    aria-label="Previous step"
                  >
                    <ChevronLeft size={24} />
                  </button>
        
                  <div className="seq-carousel-card seq-carousel-card-large">
                    <div className="seq-carousel-card-content">
                      <div className="seq-feature-icon">
                        <IconComponent size={40} />
                      </div>
                      <div className="seq-card-body">
                        <p className="seq-feature-title seq-carousel-title-large">{step.title}</p>
                        <p className="seq-feature-desc seq-carousel-desc-large">{step.desc}</p>
                      </div>
                    </div>
                  </div>
        
                  <button
                    className="seq-carousel-nav seq-carousel-next"
                    onClick={goToNext}
                    aria-label="Next step"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
        
                <div className="seq-carousel-counter-wrap">
                  <div className="seq-carousel-counter">{currentStep + 1} / {designSteps.length}</div>
                </div>
              </div>

      <h2>Step 1 — Problem Specification</h2>
      <p>Carefully identify:</p>
      <ul>
        <li>
          <strong>Inputs</strong> — what triggers state changes
        </li>
        <li>
          <strong>Outputs</strong> — what the circuit must produce
        </li>
        <li>
          <strong>Memory</strong> — what must be remembered between clocks
        </li>
        <li>
          <strong>Machine type</strong> — Moore (output on state) or Mealy
          (output on transition)
        </li>
      </ul>

      <h2>Step 5 — State Assignment Strategies</h2>
      <SeqTable data={stateAssignmentData} className="seq-flip-table" />

      <h2>Step 6 — Choosing Flip-Flop Type</h2>
      <SeqTable data={ffTypeData} className="seq-flip-table" />

      <h2>Design Example — "101" Sequence Detector</h2>
      <p>
        Design a <strong>Moore machine</strong> that outputs Z=1 when the last
        three bits of the serial input x form the pattern <strong>"101"</strong>{" "}
        (overlapping detection allowed).
      </p>

      <div className="seq-box info">
        <span className="seq-box-title">State Plan</span>
        <p>
          <strong>S0</strong> — No progress (initial / reset state), Z=0
          <br />
          <strong>S1</strong> — Received "1", Z=0
          <br />
          <strong>S2</strong> — Received "10", Z=0
          <br />
          <strong>S3</strong> — Received "101" ✓, Z=1
        </p>
      </div>

      <div className="seq-diagram">
        <svg
          viewBox="0 0 560 250"
          xmlns="http://www.w3.org/2000/svg"
          style={{ fontFamily: "'JetBrains Mono',monospace" }}
        >
          <defs>
            <marker
              id="aDp"
              markerWidth="7"
              markerHeight="7"
              refX="5"
              refY="2.5"
              orient="auto"
            >
              <path d="M0,0 L0,5 L7,2.5z" fill="#10b981" />
            </marker>
          </defs>
          {/* States */}
          {[
            [80, 125, "S0", "Z=0"],
            [220, 60, "S1", "Z=0"],
            [360, 60, "S2", "Z=0"],
            [460, 125, "S3", "Z=1"],
          ].map(([cx, cy, s, z]) => (
            <g key={s}>
              <circle
                cx={cx}
                cy={cy}
                r="36"
                fill="rgba(30,27,75,.9)"
                stroke={s === "S3" ? "#10b981" : "#6366f1"}
                strokeWidth="2.5"
              />
              <text
                x={cx}
                y={cy - 4}
                fontSize="13"
                fill={s === "S3" ? "#34d399" : "#c7d2fe"}
                textAnchor="middle"
                fontWeight="700"
              >
                {s}
              </text>
              <text
                x={cx}
                y={cy + 13}
                fontSize="9"
                fill={s === "S3" ? "#10b981" : "#475569"}
                textAnchor="middle"
              >
                {z}
              </text>
            </g>
          ))}
          {/* S0 → S1 (x=1) */}
          <path
            d="M113,108 Q160,65 184,70"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            markerEnd="url(#aDp)"
          />
          <text x="140" y="72" fontSize="10" fill="#fbbf24" fontWeight="700">
            x=1
          </text>
          {/* S1 → S2 (x=0) */}
          <line
            x1="256"
            y1="60"
            x2="324"
            y2="60"
            stroke="#10b981"
            strokeWidth="2"
            markerEnd="url(#aDp)"
          />
          <text x="285" y="52" fontSize="10" fill="#fbbf24" fontWeight="700">
            x=0
          </text>
          {/* S2 → S3 (x=1) */}
          <path
            d="M393,78 Q420,95 428,105"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            markerEnd="url(#aDp)"
          />
          <text x="420" y="85" fontSize="10" fill="#fbbf24" fontWeight="700">
            x=1
          </text>
          {/* S0 self-loop (x=0) */}
          <path
            d="M58,100 Q20,70 58,90"
            fill="none"
            stroke="#6366f1"
            strokeWidth="1.5"
            markerEnd="url(#aDp)"
            strokeDasharray="4"
          />
          <text x="12" y="82" fontSize="9" fill="#6366f1">
            x=0
          </text>
          {/* S1 → S0 (x=1) */}
          <path
            d="M220,96 Q150,145 108,140"
            fill="none"
            stroke="#ef4444"
            strokeWidth="1.5"
            markerEnd="url(#aDp)"
            strokeDasharray="4"
          />
          <text x="154" y="145" fontSize="9" fill="#ef4444">
            x=1 → S1
          </text>
          {/* S1 self back to S0 x=0 already done, S1 on x=1 → S1 self */}
          {/* S2 → S0 (x=0) */}
          <path
            d="M340,88 Q240,195 108,155"
            fill="none"
            stroke="#ef4444"
            strokeWidth="1.5"
            markerEnd="url(#aDp)"
            strokeDasharray="4"
          />
          <text x="225" y="205" fontSize="9" fill="#ef4444">
            x=0 → S0
          </text>
          {/* S3 → S1 (x=1, overlap) */}
          <path
            d="M460,161 Q460,220 220,96"
            fill="none"
            stroke="#818cf8"
            strokeWidth="1.5"
            markerEnd="url(#aDp)"
            strokeDasharray="4"
          />
          <text x="360" y="235" fontSize="9" fill="#818cf8">
            x=1 → S1 (overlap)
          </text>
          {/* S3 → S0 (x=0) */}
          <path
            d="M428,152 Q350,200 112,155"
            fill="none"
            stroke="#818cf8"
            strokeWidth="1.2"
            markerEnd="url(#aDp)"
            strokeDasharray="3"
          />
          {/* Initial arrow */}
          <line
            x1="20"
            y1="125"
            x2="44"
            y2="125"
            stroke="#94a3b8"
            strokeWidth="1.5"
            markerEnd="url(#aDp)"
          />
          <text x="4" y="122" fontSize="8" fill="#64748b">
            start
          </text>
        </svg>
        <p className="seq-diagram-caption">
          Figure 1 — Moore FSM for "101" overlapping sequence detector
        </p>
      </div>

      <h2>State Table (after assignment: S0=00, S1=01, S2=10, S3=11)</h2>
      <SeqTable data={designExampleStateData} className="seq-flip-table" />

      <div className="seq-box success">
        <span className="seq-box-title">Design Checklist</span>
        <p>
          ✓ All states reachable from the initial state
          <br />
          ✓ Every state handles all possible inputs
          <br />
          ✓ Initial/reset state clearly defined
          <br />
          ✓ Output correct in every state / transition
          <br />✓ Don't-care states used where appropriate
        </p>
      </div>
    </div>
  </SeqLayout>
  );
};

export default SeqDesignProcedures;
