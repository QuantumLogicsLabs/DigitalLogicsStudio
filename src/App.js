import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// PAGES:
import Home from "./pages/Home";
import Boolforge from "./pages/Boolforge";
import SignificantDigits from "./pages/SignificantDigits";
import BCDNotation from "./pages/BCDNotation";
import ASCIINotation from "./pages/ASCIINotation";
import BitExtension from "./pages/BitExtension";

// UTILS / OTHER TOOLS:
import ScrollToTop from "./utils/ScrollToTop";
import NumberConverter from "./pages/NumberConversation";
import NumberSystemCalculator from "./pages/NumberSystemCalculator";
import BinaryRepresentation from "./pages/BinaryRepresentation";
import ProblemSolver from "./pages/Book/Ch1";
import Ch2ProblemSolver from "./pages/Book/Ch2";
import BitConverter from "./pages/Bitconverter";
import ParityBitCalculator from "./pages/ParityBitCalculator";
import KMapGenerator from "./pages/KmapGenerator";
import GateExplanation from "./pages/GateExplanation";
import TimeDiagrams from "./pages/TimeDiagrams";
import BooleanAlgebraOverview from "./pages/BooleanAlgebraOverview";
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

function App() {
  return (
    <>
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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
