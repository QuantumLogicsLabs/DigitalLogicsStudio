import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// PAGES:
import Home from "./pages/Home/Home";
import Boolforge from "./pages/Boolforge";
import SignificantDigits from "./pages/SignificantDigits";
import BCDNotation from "./pages/NumberSystems/BCDNotation";
import ASCIINotation from "./pages/NumberSystems/ASCIINotation";
import BitExtension from "./pages/BitExtension";
import RegIntro from "./pages/RegistersAndTransfers/RegIntro";
import RegCounters from "./pages/RegistersAndTransfers/RegCounters";
import RegSyncAsync from "./pages/RegistersAndTransfers/RegSyncAsync";
import RegShiftRegisters from "./pages/RegistersAndTransfers/RegShiftRegisters";
import RegSerialShift from "./pages/RegistersAndTransfers/RegSerialShift";
import RegLoading from "./pages/RegistersAndTransfers/RegLoading";
import RegParallel from "./pages/RegistersAndTransfers/RegParallel";
import RegRippleCounters from "./pages/RegistersAndTransfers/RegRippleCounters";
import RegSyncBinaryCounters from "./pages/RegistersAndTransfers/RegSyncBinaryCounters";

// UTILS / OTHER TOOLS:
import ScrollToTop from "./utils/ScrollToTop";
import NumberConverter from "./pages/NumberSystems/NumberConversation";
import NumberSystemCalculator from "./pages/NumberSystems/NumberSystemCalculator";
import BinaryRepresentation from "./pages/NumberSystems/BinaryRepresentation";
import ProblemSolver from "./pages/Book/Ch1";
import Ch2ProblemSolver from "./pages/Book/Ch2";
import BitConverter from "./pages/Bitconverter";
import ParityBitCalculator from "./pages/ParityBitCalculator";
import KMapGenerator from "./pages/KmapGenerator";
import GateExplanation from "./pages/GateExplanation";
import TimeDiagrams from "./pages/TimeDiagrams";
import BooleanAlgebraOverview from "./pages/BooleanAlgebra/BooleanAlgebraOverview";
import BooleanIdentities from "./pages/BooleanIdentities";
import DualityPrinciple from "./pages/DualityPrinciple";
import BooleanLaws from "./pages/BooleanLaws";
import ConsensusTheorem from "./pages/ConsensusTheorem";
import ComplementPage from "./pages/ComplementPage";
import StandardForms from "./pages/StandardForms";
import MintermsPage from "./pages/MintermsPage";
import MaxtermsPage from "./pages/MaxtermsPage";
import MintermsMaxtermsRelation from "./pages/MintermsMaxtermsRelation";
import CircuitCost from "./pages/CircuitCost";
import UniversalGates from "./pages/UniversalGates";
import OddFunction from "./pages/OddFunction";

import BinaryAdders from "./pages/ArithmeticFunctionsAndHDLs/BinaryAdders";
import BinarySubtractor from "./pages/ArithmeticFunctionsAndHDLs/BinarySubtractor";
import BinaryAddSubtractor from "./pages/ArithmeticFunctionsAndHDLs/BinaryAddSubtractor";
import BinaryMultipliers from "./pages/ArithmeticFunctionsAndHDLs/BinaryMultipliers";
import CodeConversion from "./pages/ArithmeticFunctionsAndHDLs/CodeConversion";
import MagnitudeComparator from "./pages/ArithmeticFunctionsAndHDLs/MagnitudeComparator";
import ParityGenerators from "./pages/ArithmeticFunctionsAndHDLs/ParityGenerators";
import DesignApplications from "./pages/ArithmeticFunctionsAndHDLs/DesignApplications";
import Complements from "./pages/ArithmeticFunctionsAndHDLs/Complements";
import SignedUnsignedArithmetic from "./pages/ArithmeticFunctionsAndHDLs/SignedUnsignedArithmetic";

// COMBINATIONAL CIRCUITS:
import EncoderPage from "./pages/EncoderPage";
import DecoderPage from "./pages/DecoderPage";

// SEQUENTIAL CIRCUITS:
import SeqIntro from "./pages/SequentialCircuits/SeqIntro";
import SeqLatches from "./pages/SequentialCircuits/SeqLatches";
import SeqFlipFlops from "./pages/SequentialCircuits/SeqFlipFlops";
import SeqFlipFlopTypes from "./pages/SequentialCircuits/SeqFlipFlopTypes";
import SeqAnalysis from "./pages/SequentialCircuits/SeqAnalysis";
import SeqDesignProcedures from "./pages/SequentialCircuits/SeqDesignProcedures";
import SeqStateDiagram from "./pages/SequentialCircuits/SeqStateDiagram";
import SeqStateReduction from "./pages/SequentialCircuits/SeqStateReduction";

import ModuleLayout from "./components/layout/ModuleLayout";

function App() {
  return (
    <div className="app-root">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Grouped Routes with ModuleLayout */}
          <Route path="/boolforge" element={<ModuleLayout title="Circuit Forge" subtitle="Drag-and-drop logic builder"><Boolforge /></ModuleLayout>} />
          
          {/* Number Systems */}
          <Route path="/numbersystemcalculator" element={<ModuleLayout title="Number System Calculator"><NumberSystemCalculator /></ModuleLayout>} />
          <Route path="/numberconversation" element={<ModuleLayout title="Base Converter"><NumberConverter /></ModuleLayout>} />
          <Route path="/binaryrepresentation" element={<ModuleLayout title="Binary Visualizer"><BinaryRepresentation /></ModuleLayout>} />
          <Route path="/bcd-notation" element={<ModuleLayout title="BCD Notation"><BCDNotation /></ModuleLayout>} />
          <Route path="/ascii-notation" element={<ModuleLayout title="ASCII Codes"><ASCIINotation /></ModuleLayout>} />
          <Route path="/bit-extension" element={<ModuleLayout title="Bit Extension"><BitExtension /></ModuleLayout>} />
          <Route path="/bitconvertor" element={<ModuleLayout title="Bit Converter"><BitConverter /></ModuleLayout>} />
          
          {/* Boolean Algebra */}
          <Route path="/boolean-algebra" element={<ModuleLayout title="Boolean Algebra Overview"><BooleanAlgebraOverview /></ModuleLayout>} />
          <Route path="/boolean-identities" element={<ModuleLayout title="Boolean Identities"><BooleanIdentities /></ModuleLayout>} />
          <Route path="/boolean-laws" element={<ModuleLayout title="Boolean Laws"><BooleanLaws /></ModuleLayout>} />
          <Route path="/duality-principle" element={<ModuleLayout title="Duality Principle"><DualityPrinciple /></ModuleLayout>} />
          <Route path="/consensus-theorem" element={<ModuleLayout title="Consensus Theorem"><ConsensusTheorem /></ModuleLayout>} />
          <Route path="/complement" element={<ModuleLayout title="Complement"><ComplementPage /></ModuleLayout>} />
          <Route path="/standard-forms" element={<ModuleLayout title="SOP & POS Forms"><StandardForms /></ModuleLayout>} />
          <Route path="/minterms" element={<ModuleLayout title="Minterms"><MintermsPage /></ModuleLayout>} />
          <Route path="/maxterms" element={<ModuleLayout title="Maxterms"><MaxtermsPage /></ModuleLayout>} />
          <Route path="/minterms-maxterms" element={<ModuleLayout title="Minterms-Maxterms Relation"><MintermsMaxtermsRelation /></ModuleLayout>} />
          
          {/* Advanced Logic */}
          <Route path="/circuit-cost" element={<ModuleLayout title="Circuit Cost"><CircuitCost /></ModuleLayout>} />
          <Route path="/universal-gates" element={<ModuleLayout title="Universal Gates"><UniversalGates /></ModuleLayout>} />
          <Route path="/odd-function" element={<ModuleLayout title="Odd Function"><OddFunction /></ModuleLayout>} />
          <Route path="/gates" element={<ModuleLayout title="Gate Explanations"><GateExplanation /></ModuleLayout>} />
          <Route path="/kmapgenerator" element={<ModuleLayout title="K-Map Generator"><KMapGenerator /></ModuleLayout>} />
          <Route path="/timing-diagrams" element={<ModuleLayout title="Timing Diagrams"><TimeDiagrams /></ModuleLayout>} />

          {/* Combinational */}
          <Route path="/encoder" element={<ModuleLayout title="Encoder"><EncoderPage /></ModuleLayout>} />
          <Route path="/decoder" element={<ModuleLayout title="Decoder"><DecoderPage /></ModuleLayout>} />

          {/* Arithmetic */}
          <Route path="/arithmetic/binary-adders" element={<ModuleLayout title="Binary Adders"><BinaryAdders /></ModuleLayout>} />
          <Route path="/arithmetic/binary-subtractor" element={<ModuleLayout title="Binary Subtractor"><BinarySubtractor /></ModuleLayout>} />
          <Route path="/arithmetic/binary-add-subtractor" element={<ModuleLayout title="Adder/Subtractor"><BinaryAddSubtractor /></ModuleLayout>} />
          <Route path="/arithmetic/binary-multipliers" element={<ModuleLayout title="Binary Multipliers"><BinaryMultipliers /></ModuleLayout>} />
          <Route path="/arithmetic/code-conversion" element={<ModuleLayout title="Code Conversion"><CodeConversion /></ModuleLayout>} />
          <Route path="/arithmetic/magnitude-comparator" element={<ModuleLayout title="Magnitude Comparator"><MagnitudeComparator /></ModuleLayout>} />
          <Route path="/arithmetic/parity-generators" element={<ModuleLayout title="Parity Generators"><ParityGenerators /></ModuleLayout>} />
          <Route path="/arithmetic/design-applications" element={<ModuleLayout title="Design Applications"><DesignApplications /></ModuleLayout>} />
          <Route path="/arithmetic/complements" element={<ModuleLayout title="1's and 2's Complements"><Complements /></ModuleLayout>} />
          <Route path="/arithmetic/signed-unsigned" element={<ModuleLayout title="Signed/Unsigned Arithmetic"><SignedUnsignedArithmetic /></ModuleLayout>} />

          {/* Sequential */}
          <Route path="/sequential/intro" element={<ModuleLayout title="Sequential Intro"><SeqIntro /></ModuleLayout>} />
          <Route path="/sequential/latches" element={<ModuleLayout title="Latches"><SeqLatches /></ModuleLayout>} />
          <Route path="/sequential/flip-flops" element={<ModuleLayout title="Flip-Flops"><SeqFlipFlops /></ModuleLayout>} />
          <Route path="/sequential/flip-flop-types" element={<ModuleLayout title="Flip-Flop Types"><SeqFlipFlopTypes /></ModuleLayout>} />
          <Route path="/sequential/analysis" element={<ModuleLayout title="Sequential Analysis"><SeqAnalysis /></ModuleLayout>} />
          <Route path="/sequential/design-procedures" element={<ModuleLayout title="Design Procedures"><SeqDesignProcedures /></ModuleLayout>} />
          <Route path="/sequential/state-diagram" element={<ModuleLayout title="State Diagrams"><SeqStateDiagram /></ModuleLayout>} />
          <Route path="/sequential/state-reduction" element={<ModuleLayout title="State Reduction"><SeqStateReduction /></ModuleLayout>} />

          {/* Registers */}
          <Route path="/registers/intro" element={<ModuleLayout title="Registers Intro"><RegIntro /></ModuleLayout>} />
          <Route path="/registers/counters" element={<ModuleLayout title="Counters"><RegCounters /></ModuleLayout>} />
          <Route path="/registers/sync-async" element={<ModuleLayout title="Sync / Async"><RegSyncAsync /></ModuleLayout>} />
          <Route path="/registers/shift-registers" element={<ModuleLayout title="Shift Registers"><RegShiftRegisters /></ModuleLayout>} />
          <Route path="/registers/serial-shift" element={<ModuleLayout title="Serial Shift"><RegSerialShift /></ModuleLayout>} />
          <Route path="/registers/loading" element={<ModuleLayout title="Loading Registers"><RegLoading /></ModuleLayout>} />
          <Route path="/registers/parallel" element={<ModuleLayout title="Parallel Registers"><RegParallel /></ModuleLayout>} />
          <Route path="/registers/ripple-counters" element={<ModuleLayout title="Ripple Counters"><RegRippleCounters /></ModuleLayout>} />
          <Route path="/registers/sync-binary-counters" element={<ModuleLayout title="Sync Binary Counters"><RegSyncBinaryCounters /></ModuleLayout>} />
          
          {/* Miscellaneous */}
          <Route path="/significant-digits" element={<ModuleLayout title="Significant Digits"><SignificantDigits /></ModuleLayout>} />
          <Route path="/book" element={<ModuleLayout title="Book Ch1 Problems"><ProblemSolver /></ModuleLayout>} />
          <Route path="/book/ch2" element={<ModuleLayout title="Book Ch2 Problems"><Ch2ProblemSolver /></ModuleLayout>} />
          <Route path="/paritybitcalculator" element={<ModuleLayout title="Parity Bit Calculator"><ParityBitCalculator /></ModuleLayout>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
