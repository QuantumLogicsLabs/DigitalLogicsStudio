import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";

// PAGES:
import Home from "./pages/Home/Home";
import Boolforge from "./pages/Boolforge";

// REGISTER AND TRANSFERS:
import RegCounters from "./pages/RegistersAndTransfers/RegCounters";
import RegSyncAsync from "./pages/RegistersAndTransfers/RegSyncAsync";
import RegShiftRegisters from "./pages/RegistersAndTransfers/RegShiftRegisters";
import RegIntro from "./pages/RegistersAndTransfers/RegIntro";
import RegSerialShift from "./pages/RegistersAndTransfers/RegSerialShift";
import RegLoading from "./pages/RegistersAndTransfers/RegLoading";
import RegParallel from "./pages/RegistersAndTransfers/RegParallel";
import RegRippleCounters from "./pages/RegistersAndTransfers/RegRippleCounters";
import RegSyncBinaryCounters from "./pages/RegistersAndTransfers/RegSyncBinaryCounters";

// UTILS / OTHER TOOLS:
import ScrollToTop from "./utils/ScrollToTop";
import ProblemSolver from "./pages/Book/Ch1";
import Ch2ProblemSolver from "./pages/Book/Ch2";
import ParityBitCalculator from "./pages/ParityBitCalculator";
import KMapGenerator from "./pages/KmapGenerator";
import GateExplanation from "./pages/GateExplanation";
import TimeDiagrams from "./pages/TimeDiagrams";
import BooleanAlgebraOverview from "./pages/BooleanAlgebra/BooleanAlgebraOverview";
import StandardForms from "./pages/StandardForms";
import CircuitCost from "./pages/CircuitCost";
import UniversalGates from "./pages/UniversalGates";
import OddFunction from "./pages/OddFunction";

// BOOLEAN ALGEBRA:
import BooleanLaws from "./pages/BooleanAlgebra/BooleanLaws";
import BooleanIdentities from "./pages/BooleanAlgebra/BooleanIdentities";
import MintermsPage from "./pages/BooleanAlgebra/MintermsPage";
import MaxtermsPage from "./pages/BooleanAlgebra/MaxtermsPage";
import ComplementPage from "./pages/BooleanAlgebra/ComplementPage";
import ConsensusTheorem from "./pages/BooleanAlgebra/ConsensusTheorem";
import DualityPrinciple from "./pages/BooleanAlgebra/DualityPrinciple";
import MintermsMaxtermsRelation from "./pages/BooleanAlgebra/MintermsMaxtermsRelation";
import SignificantDigits from "./pages/BooleanAlgebra/SignificantDigits";

// ARITHMETIC FUNCTIONS AND HDLs:
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

// NUMBER SYSTEMS:
import BitConverter from "./pages/NumberSystems/Bitconverter";
import BitExtension from "./pages/NumberSystems/BitExtension";
import NumberConverter from "./pages/NumberSystems/NumberConversation";
import NumberSystemCalculator from "./pages/NumberSystems/NumberSystemCalculator";
import BinaryRepresentation from "./pages/NumberSystems/BinaryRepresentation";
import BCDNotation from "./pages/NumberSystems/BCDNotation";
import ASCIINotation from "./pages/NumberSystems/ASCIINotation";

// COMBINATIONAL CIRCUITS:
import EncoderPage from "./pages/EncoderAndDecoder/encoder/EncoderPage";
import DecoderPage from "./pages/EncoderAndDecoder/decoder/DecoderPage";

// SEQUENTIAL CIRCUITS:
import SeqIntro from "./pages/SequentialCircuits/SeqIntro";
import SeqLatches from "./pages/SequentialCircuits/SeqLatches";
import SeqFlipFlops from "./pages/SequentialCircuits/SeqFlipFlops";
import SeqFlipFlopTypes from "./pages/SequentialCircuits/SeqFlipFlopTypes";
import SeqAnalysis from "./pages/SequentialCircuits/SeqAnalysis";
import SeqDesignProcedures from "./pages/SequentialCircuits/SeqDesignProcedures";
import SeqStateDiagram from "./pages/SequentialCircuits/SeqStateDiagram";
import SeqStateReduction from "./pages/SequentialCircuits/SeqStateReduction";

// MEMORY SYSTEMS:
import MemoryBasics from "./pages/Memory/MemoryBasics";
import ReadOnlyMemories from "./pages/Memory/ReadOnlyMemories";
import ProgrammableLogicArray from "./pages/Memory/ProgrammableLogicArray";
import RandomAccessMemory from "./pages/Memory/RandomAccessMemory";
import StaticDynamicRAM from "./pages/Memory/StaticDynamicRAM";
import ArrayOfRAMICs from "./pages/Memory/ArrayOfRAMICs";
import MemoryConstructionRAM from "./pages/Memory/MemoryConstructionRAM";

function App() {
  const { theme } = useTheme();

  return (
    <div className={`app-root ${theme}`}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/boolforge" element={<Boolforge />} />
          <Route path="/significant-digits" element={<SignificantDigits />} />
          <Route path="/bcd-notation" element={<BCDNotation />} />
          <Route path="/ascii-notation" element={<ASCIINotation />} />
          <Route path="/bit-extension" element={<BitExtension />} />
          <Route path="/book" element={<ProblemSolver />} />
          <Route path="/book/ch2" element={<Ch2ProblemSolver />} />
          <Route path="/numberconversation" element={<NumberConverter />} />
          <Route
            path="/numbersystemcalculator"
            element={<NumberSystemCalculator />}
          />
          <Route
            path="/binaryrepresentation"
            element={<BinaryRepresentation />}
          />
          <Route
            path="/paritybitcalculator"
            element={<ParityBitCalculator />}
          />
          <Route path="/bitconvertor" element={<BitConverter />} />
          <Route path="/kmapgenerator" element={<KMapGenerator />} />
          <Route path="/gates" element={<GateExplanation />} />
          <Route path="/timing-diagrams" element={<TimeDiagrams />} />
          <Route path="/boolean-algebra" element={<BooleanAlgebraOverview />} />
          <Route path="/boolean-identities" element={<BooleanIdentities />} />
          <Route path="/duality-principle" element={<DualityPrinciple />} />
          <Route path="/boolean-laws" element={<BooleanLaws />} />
          <Route path="/consensus-theorem" element={<ConsensusTheorem />} />
          <Route path="/complement" element={<ComplementPage />} />
          <Route path="/standard-forms" element={<StandardForms />} />
          <Route path="/minterms" element={<MintermsPage />} />
          <Route path="/maxterms" element={<MaxtermsPage />} />
          <Route
            path="/minterms-maxterms"
            element={<MintermsMaxtermsRelation />}
          />
          <Route path="/circuit-cost" element={<CircuitCost />} />
          <Route path="/universal-gates" element={<UniversalGates />} />
          <Route path="/odd-function" element={<OddFunction />} />
          <Route path="/arithmetic/binary-adders" element={<BinaryAdders />} />
          <Route
            path="/arithmetic/binary-subtractor"
            element={<BinarySubtractor />}
          />
          <Route
            path="/arithmetic/binary-add-subtractor"
            element={<BinaryAddSubtractor />}
          />
          <Route
            path="/arithmetic/binary-multipliers"
            element={<BinaryMultipliers />}
          />
          <Route
            path="/arithmetic/code-conversion"
            element={<CodeConversion />}
          />
          <Route
            path="/arithmetic/magnitude-comparator"
            element={<MagnitudeComparator />}
          />
          <Route
            path="/arithmetic/parity-generators"
            element={<ParityGenerators />}
          />
          <Route
            path="/arithmetic/design-applications"
            element={<DesignApplications />}
          />
          <Route path="/arithmetic/complements" element={<Complements />} />
          <Route
            path="/arithmetic/signed-unsigned"
            element={<SignedUnsignedArithmetic />}
          />

          {/* Combinational Circuits */}
          <Route path="/encoder" element={<EncoderPage />} />
          <Route path="/decoder" element={<DecoderPage />} />

          {/* Sequential Circuits */}
          <Route path="/sequential/intro" element={<SeqIntro />} />
          <Route path="/sequential/latches" element={<SeqLatches />} />
          <Route path="/sequential/flip-flops" element={<SeqFlipFlops />} />
          <Route
            path="/sequential/flip-flop-types"
            element={<SeqFlipFlopTypes />}
          />
          <Route path="/sequential/analysis" element={<SeqAnalysis />} />
          <Route
            path="/sequential/design-procedures"
            element={<SeqDesignProcedures />}
          />
          <Route
            path="/sequential/state-diagram"
            element={<SeqStateDiagram />}
          />
          <Route
            path="/sequential/state-reduction"
            element={<SeqStateReduction />}
          />

          <Route path="/registers/intro" element={<RegIntro />} />
          <Route path="/registers/counters" element={<RegCounters />} />
          <Route path="/registers/sync-async" element={<RegSyncAsync />} />
          <Route
            path="/registers/shift-registers"
            element={<RegShiftRegisters />}
          />
          <Route path="/registers/serial-shift" element={<RegSerialShift />} />
          <Route path="/registers/loading" element={<RegLoading />} />
          <Route path="/registers/parallel" element={<RegParallel />} />
          <Route
            path="/registers/ripple-counters"
            element={<RegRippleCounters />}
          />
          <Route
            path="/registers/sync-binary-counters"
            element={<RegSyncBinaryCounters />}
          />
          <Route path="/memory/basics" element={<MemoryBasics />} />
          <Route
            path="/memory/read-only-memories"
            element={<ReadOnlyMemories />}
          />
          <Route
            path="/memory/programmable-logic-array"
            element={<ProgrammableLogicArray />}
          />
          <Route
            path="/memory/random-access-memory"
            element={<RandomAccessMemory />}
          />
          <Route
            path="/memory/static-dynamic-ram"
            element={<StaticDynamicRAM />}
          />
          <Route path="/memory/array-of-ram-ics" element={<ArrayOfRAMICs />} />
          <Route
            path="/memory/memory-construction-ram"
            element={<MemoryConstructionRAM />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
