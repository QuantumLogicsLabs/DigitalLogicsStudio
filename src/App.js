import React, { Suspense, lazy, useEffect, useRef } from "react";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { useTheme } from "./context/ThemeContext";
import RouteSeoManager from "./components/seo/RouteSeoManager";
import RouteNormalizer from "./components/seo/RouteNormalizer";
import AnalyticsTracker from "./components/seo/AnalyticsTracker";
import DlsMentorWidget from "./components/DlsMentorWidget/DlsMentorWidget";
import InstructionTraceLabPage from "./pages/Coal/InstructionTraceLabPage";
import StackMemorySimulatorPage from "./pages/Coal/StackMemorySimulatorPage";
import AssemblyDrillsPage from "./pages/Coal/AssemblyDrillsPage";
import AddressingModePlaygroundPage from "./pages/Coal/AddressingModePlaygroundPage";
import InstructionLaboratoryPage from "./pages/Coal/InstructionLaboratoryPage";
// UTILS / OTHER TOOLS:
import ScrollToTop from "./utils/ScrollToTop";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const Home = lazy(() => import("./pages/Home/Home"));
const Boolforge = lazy(() => import("./pages/Boolforge"));
const ProblemsPage = lazy(() => import("./pages/Problems/ProblemsPage"));
const CoalProblemsPage = lazy(() => import("./pages/Problems/CoalProblemsPage"));
const RegCounters = lazy(
  () => import("./pages/RegistersAndTransfers/RegCounters"),
);
const RegSyncAsync = lazy(
  () => import("./pages/RegistersAndTransfers/RegSyncAsync"),
);
const RegShiftRegisters = lazy(
  () => import("./pages/RegistersAndTransfers/RegShiftRegisters"),
);
const RegIntro = lazy(() => import("./pages/RegistersAndTransfers/RegIntro"));
const RegSerialShift = lazy(
  () => import("./pages/RegistersAndTransfers/RegSerialShift"),
);
const RegLoading = lazy(
  () => import("./pages/RegistersAndTransfers/RegLoading"),
);
const RegParallel = lazy(
  () => import("./pages/RegistersAndTransfers/RegParallel"),
);
const RegRippleCounters = lazy(
  () => import("./pages/RegistersAndTransfers/RegRippleCounters"),
);
const RegSyncBinaryCounters = lazy(
  () => import("./pages/RegistersAndTransfers/RegSyncBinaryCounters"),
);
const ProblemSolver = lazy(() => import("./pages/Book/Ch1"));
const Ch2ProblemSolver = lazy(() => import("./pages/Book/Ch2"));
const LearningResourcesPage = lazy(
  () => import("./pages/LearningResources/LearningResourcesPage"),
);
const CoalHomePage = lazy(() => import("./pages/Coal/CoalHomePage"));
const CoalTheoryPage = lazy(() => import("./pages/Coal/CoalTheoryPage"));
const CoalPracticalPage = lazy(() => import("./pages/Coal/CoalPracticalPage"));
const CoalTopicPage = lazy(() => import("./pages/Coal/CoalTopicPage"));
const ParityBitCalculator = lazy(() => import("./pages/ParityBitCalculator"));
const KMapGenerator = lazy(() => import("./pages/KmapGenerator"));
const GateExplanation = lazy(() => import("./pages/GateExplanation"));
const TimeDiagrams = lazy(() => import("./pages/TimeDiagrams"));
const BooleanAlgebraOverview = lazy(
  () => import("./pages/BooleanAlgebra/BooleanAlgebraOverview"),
);
const StandardForms = lazy(() => import("./pages/StandardForms"));
const CircuitCost = lazy(() => import("./pages/CircuitCost"));
const UniversalGates = lazy(() => import("./pages/UniversalGates"));
const OddFunction = lazy(() => import("./pages/OddFunction"));
const BooleanLaws = lazy(() => import("./pages/BooleanAlgebra/BooleanLaws"));
const BooleanIdentities = lazy(
  () => import("./pages/BooleanAlgebra/BooleanIdentities"),
);
const MintermsPage = lazy(() => import("./pages/BooleanAlgebra/MintermsPage"));
const MaxtermsPage = lazy(() => import("./pages/BooleanAlgebra/MaxtermsPage"));
const ComplementPage = lazy(
  () => import("./pages/BooleanAlgebra/ComplementPage"),
);
const ConsensusTheorem = lazy(
  () => import("./pages/BooleanAlgebra/ConsensusTheorem"),
);
const DualityPrinciple = lazy(
  () => import("./pages/BooleanAlgebra/DualityPrinciple"),
);
const MintermsMaxtermsRelation = lazy(
  () => import("./pages/BooleanAlgebra/MintermsMaxtermsRelation"),
);
const SignificantDigits = lazy(
  () => import("./pages/BooleanAlgebra/SignificantDigits"),
);
const BinaryAdders = lazy(
  () => import("./pages/ArithmeticFunctionsAndHDLs/BinaryAdders"),
);
const BinarySubtractor = lazy(
  () => import("./pages/ArithmeticFunctionsAndHDLs/BinarySubtractor"),
);
const BinaryAddSubtractor = lazy(
  () => import("./pages/ArithmeticFunctionsAndHDLs/BinaryAddSubtractor"),
);
const BinaryMultipliers = lazy(
  () => import("./pages/ArithmeticFunctionsAndHDLs/BinaryMultipliers"),
);
const CodeConversion = lazy(
  () => import("./pages/ArithmeticFunctionsAndHDLs/CodeConversion"),
);
const MagnitudeComparator = lazy(
  () => import("./pages/ArithmeticFunctionsAndHDLs/MagnitudeComparator"),
);
const ParityGenerators = lazy(
  () => import("./pages/ArithmeticFunctionsAndHDLs/ParityGenerators"),
);
const DesignApplications = lazy(
  () => import("./pages/ArithmeticFunctionsAndHDLs/DesignApplications"),
);
const Complements = lazy(
  () => import("./pages/ArithmeticFunctionsAndHDLs/Complements"),
);
const SignedUnsignedArithmetic = lazy(
  () => import("./pages/ArithmeticFunctionsAndHDLs/SignedUnsignedArithmetic"),
);
const BitConverter = lazy(() => import("./pages/NumberSystems/Bitconverter"));
const BitExtension = lazy(() => import("./pages/NumberSystems/BitExtension"));
const NumberConverter = lazy(
  () => import("./pages/NumberSystems/NumberConversation"),
);
const NumberSystemCalculator = lazy(
  () => import("./pages/NumberSystems/NumberSystemCalculator"),
);
const BinaryRepresentation = lazy(
  () => import("./pages/NumberSystems/BinaryRepresentation"),
);
const BCDNotation = lazy(() => import("./pages/NumberSystems/BCDNotation"));
const ASCIINotation = lazy(() => import("./pages/NumberSystems/ASCIINotation"));
const EncoderPage = lazy(
  () => import("./pages/EncoderAndDecoder/encoder/EncoderPage"),
);
const DecoderPage = lazy(
  () => import("./pages/EncoderAndDecoder/decoder/DecoderPage"),
);
const MuxPage = lazy(
  () => import("./pages/MultiplexersAndDemultiplexers/mux/MuxPage"),
);
const DemuxPage = lazy(
  () => import("./pages/MultiplexersAndDemultiplexers/demux/DemuxPage"),
);
const SeqIntro = lazy(() => import("./pages/SequentialCircuits/SeqIntro"));
const SeqLatches = lazy(() => import("./pages/SequentialCircuits/SeqLatches"));
const SeqFlipFlops = lazy(
  () => import("./pages/SequentialCircuits/SeqFlipFlops"),
);
const SeqFlipFlopTypes = lazy(
  () => import("./pages/SequentialCircuits/SeqFlipFlopTypes"),
);
const SeqAnalysis = lazy(
  () => import("./pages/SequentialCircuits/SeqAnalysis"),
);
const SeqDesignProcedures = lazy(
  () => import("./pages/SequentialCircuits/SeqDesignProcedures"),
);
const SeqStateDiagram = lazy(
  () => import("./pages/SequentialCircuits/SeqStateDiagram"),
);
const SeqStateReduction = lazy(
  () => import("./pages/SequentialCircuits/SeqStateReduction"),
);
const MemoryBasics = lazy(() => import("./pages/Memory/MemoryBasics"));
const ReadOnlyMemories = lazy(() => import("./pages/Memory/ReadOnlyMemories"));
const ProgrammableLogicArray = lazy(
  () => import("./pages/Memory/ProgrammableLogicArray"),
);
const RandomAccessMemory = lazy(
  () => import("./pages/Memory/RandomAccessMemory"),
);
const StaticDynamicRAM = lazy(() => import("./pages/Memory/StaticDynamicRAM"));
const ArrayOfRAMICs = lazy(() => import("./pages/Memory/ArrayOfRAMICs"));
const MemoryConstructionRAM = lazy(
  () => import("./pages/Memory/MemoryConstructionRAM"),
);
const DLDTrainerBoard = lazy(() => import("./pages/TrainerBoard"));
const LoginPage = lazy(() => import("./pages/Auth/LoginPage"));
const SignupPage = lazy(() => import("./pages/Auth/SignupPage"));
const ForgotPasswordPage = lazy(() => import("./pages/Auth/ForgotPasswordPage"));
const ProfilePage = lazy(() => import("./pages/Auth/ProfilePage"));
const SettingsPage = lazy(() => import("./pages/Auth/SettingsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// ScrollToTop and route synchronization
const AppContent = () => {
  const location = useLocation();
  const typesetTimerRef = useRef(null);

  useEffect(() => {
    const root = document.getElementById("root");
    const typeset = () => {
      if (!window.MathJax?.typesetPromise) return;
      window.MathJax.typesetPromise([root || document.body]).catch(() => {});
    };

    const scheduleTypeset = () => {
      window.clearTimeout(typesetTimerRef.current);
      typesetTimerRef.current = window.setTimeout(typeset, 80);
    };

    scheduleTypeset();

    const observer = root ? new MutationObserver(scheduleTypeset) : null;
    observer?.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    const stopObserver = window.setTimeout(() => observer?.disconnect(), 1800);

    return () => {
      observer?.disconnect();
      window.clearTimeout(stopObserver);
      window.clearTimeout(typesetTimerRef.current);
    };
  }, [location]);

  return (
    <>
      <ScrollToTop />
      <RouteNormalizer />
      <RouteSeoManager />
      <AnalyticsTracker />
      <Suspense
        fallback={<div className="app-route-loading">Loading workspace...</div>}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/problems/:topicSlug" element={<ProblemsPage />} />
          <Route path="/resources/coal/theory" element={<CoalTheoryPage />} />
          <Route
            path="/resources/coal/practical"
            element={<CoalPracticalPage />}
          />
          <Route path="/resources/coal/problems" element={<CoalProblemsPage />} />
          <Route path="/resources/coal/problems/:topicSlug" element={<CoalProblemsPage />} />
          <Route path="/resources/coal" element={<CoalHomePage />} />
          <Route path="/coal/:slug" element={<CoalTopicPage />} />
          <Route
            path="/resources/:track?"
            element={<LearningResourcesPage />}
          />
          <Route path="/boolforge" element={<Boolforge />} />

          {/* ── Boolean Algebra (/boolean/* matches baConfig.js) ── */}
          <Route
            path="/boolean/overview"
            element={<BooleanAlgebraOverview />}
          />
          <Route path="/boolean/identities" element={<BooleanIdentities />} />
          <Route path="/boolean/laws" element={<BooleanLaws />} />
          <Route path="/boolean/complement" element={<ComplementPage />} />
          <Route path="/boolean/duality" element={<DualityPrinciple />} />
          <Route path="/boolean/consensus" element={<ConsensusTheorem />} />
          <Route path="/boolean/minterms" element={<MintermsPage />} />
          <Route path="/boolean/maxterms" element={<MaxtermsPage />} />
          <Route
            path="/boolean/minterms-maxterms"
            element={<MintermsMaxtermsRelation />}
          />
          <Route
            path="/boolean/significant-digits"
            element={<SignificantDigits />}
          />

          {/* ── Standard Forms (no boolean/ prefix, standalone) ── */}
          <Route path="/standard-forms" element={<StandardForms />} />

          {/* ── Advanced Logic ────────────────────────────────── */}
          <Route path="/circuit-cost" element={<CircuitCost />} />
          <Route path="/universal-gates" element={<UniversalGates />} />
          <Route path="/odd-function" element={<OddFunction />} />
          <Route path="/gates" element={<GateExplanation />} />
          <Route path="/timing-diagrams" element={<TimeDiagrams />} />

          {/* ── Number Systems (/number-systems/* matches nsConfig.js) ── */}
          <Route
            path="/number-systems/binary-representation"
            element={<BinaryRepresentation />}
          />
          <Route
            path="/number-systems/number-conversion"
            element={<NumberConverter />}
          />
          <Route
            path="/number-systems/bit-extension"
            element={<BitExtension />}
          />
          <Route
            path="/number-systems/bcd-notation"
            element={<BCDNotation />}
          />
          <Route
            path="/number-systems/ascii-notation"
            element={<ASCIINotation />}
          />
          <Route
            path="/number-systems/bit-converter"
            element={<BitConverter />}
          />
          <Route
            path="/number-systems/calculator"
            element={<NumberSystemCalculator />}
          />

          {/* ── Number Systems legacy redirects (old routes → new) ── */}
          <Route
            path="/binaryrepresentation"
            element={
              <Navigate to="/number-systems/binary-representation" replace />
            }
          />
          <Route
            path="/numberconversation"
            element={
              <Navigate to="/number-systems/number-conversion" replace />
            }
          />
          <Route
            path="/bit-extension"
            element={<Navigate to="/number-systems/bit-extension" replace />}
          />
          <Route
            path="/bcd-notation"
            element={<Navigate to="/number-systems/bcd-notation" replace />}
          />
          <Route
            path="/ascii-notation"
            element={<Navigate to="/number-systems/ascii-notation" replace />}
          />
          <Route
            path="/bitconvertor"
            element={<Navigate to="/number-systems/bit-converter" replace />}
          />
          <Route
            path="/numbersystemcalculator"
            element={<Navigate to="/number-systems/calculator" replace />}
          />

          {/* ── Parity Bit Calculator (standalone) ── */}
          <Route
            path="/paritybitcalculator"
            element={<ParityBitCalculator />}
          />

          {/* ── K-Map ─────────────────────────────────────────── */}
          <Route path="/kmapgenerator" element={<KMapGenerator />} />

          {/* ── Book Problems ─────────────────────────────────── */}
          <Route path="/book" element={<ProblemSolver />} />
          <Route path="/book/ch2" element={<Ch2ProblemSolver />} />

          {/* ── Arithmetic Functions & HDLs ───────────────────── */}
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

          {/* ── Combinational Circuits ────────────────────────── */}
          <Route path="/encoder" element={<EncoderPage />} />
          <Route path="/decoder" element={<DecoderPage />} />
          <Route path="/mux" element={<MuxPage />} />
          <Route path="/demux" element={<DemuxPage />} />

          {/* ── Sequential Circuits ───────────────────────────── */}
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

          {/* ── Registers & Transfers ─────────────────────────── */}
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

          {/* ── Memory Systems ────────────────────────────────── */}
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

          {/* ── COAL Practical Labs ───────────────────────────── */}
          <Route
            path="/resources/coal/practical/instruction-trace-lab"
            element={<InstructionTraceLabPage />}
          />
          <Route
            path="/resources/coal/practical/stack-memory-simulator"
            element={<StackMemorySimulatorPage />}
          />
          <Route
            path="/resources/coal/practical/assembly-drills"
            element={<AssemblyDrillsPage />}
          />
          <Route
            path="/resources/coal/practical/addressing-mode-playground"
            element={<AddressingModePlaygroundPage />}
          />
          <Route
            path="/resources/coal/practical/instruction-laboratory"
            element={<InstructionLaboratoryPage />}
          />

          {/* ── Misc ──────────────────────────────────────────── */}
          <Route path="/trainer-board" element={<DLDTrainerBoard />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
};

function App() {
  const { theme } = useTheme();

  return (
    <div className={`app-root ${theme}`}>
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <AppContent />
        <DlsMentorWidget />
      </BrowserRouter>
      <Analytics />
    </div>
  );
}

export default App;
