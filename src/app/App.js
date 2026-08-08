import React, { Suspense, lazy } from "react";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
 
} from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { useTheme } from "../shared/context/ThemeContext";
import RouteSeoManager from "../shared/seo/RouteSeoManager";
import RouteNormalizer from "../shared/seo/RouteNormalizer";
import AnalyticsTracker from "../shared/seo/AnalyticsTracker";
import DlsMentorWidget from "../shared/widgets/DlsMentorWidget/DlsMentorWidget";

// UTILS / OTHER TOOLS:
import ScrollToTop from "../shared/utils/ScrollToTop";
import ProtectedRoute from "../auth/ProtectedRoute";

const Home = lazy(() => import("../features/home/Home"));
const Boolforge = lazy(() => import("../features/boolforge/Boolforge"));
const ProblemsPage = lazy(() => import("../features/problems/ProblemsPage"));
// ── COAL Practical Labs (now lazy-loaded, previously eager imports) ──
const InstructionTraceLabPage = lazy(
  () => import("../features/coal/InstructionTraceLabPage"),
);
const AluFlagsSimulatorPage = lazy(
  () => import("../features/coal/AluFlagsSimulatorPage"),
);
const StackMemorySimulatorPage = lazy(
  () => import("../features/coal/StackMemorySimulatorPage"),
);
const AssemblyDrillsPage = lazy(
  () => import("../features/coal/AssemblyDrillsPage"),
);
const AddressingModePlaygroundPage = lazy(
  () => import("../features/coal/AddressingModePlaygroundPage"),
);
const InstructionLaboratoryPage = lazy(
  () => import("../features/coal/InstructionLaboratoryPage"),
);
const RegCounters = lazy(
  () => import("../features/registers-transfers/RegCounters"),
);
const RegSyncAsync = lazy(
  () => import("../features/registers-transfers/RegSyncAsync"),
);
const RegShiftRegisters = lazy(
  () => import("../features/registers-transfers/RegShiftRegisters"),
);
const RegIntro = lazy(() => import("../features/registers-transfers/RegIntro"));
const RegSerialShift = lazy(
  () => import("../features/registers-transfers/RegSerialShift"),
);
const RegLoading = lazy(
  () => import("../features/registers-transfers/RegLoading"),
);
const RegParallel = lazy(
  () => import("../features/registers-transfers/RegParallel"),
);
const RegRippleCounters = lazy(
  () => import("../features/registers-transfers/RegRippleCounters"),
);
const RegSyncBinaryCounters = lazy(
  () => import("../features/registers-transfers/RegSyncBinaryCounters"),
);
const ProblemSolver = lazy(() => import("../features/book/Ch1"));
const Ch2ProblemSolver = lazy(() => import("../features/book/Ch2"));
const DldHomeRoute = lazy(() => import("../features/theory/DldHomeRoute"));
const CoalHomeRoute = lazy(() => import("../features/coal/CoalHomeRoute"));
const CoalPracticalPage = lazy(() => import("../features/coal/CoalPracticalPage"));
const CoalTopicPageRoute = lazy(() => import("../features/coal/CoalTopicPageRoute"));
const DldMemoryTopicPage = lazy(() => import("../features/theory/DldMemoryTopicRoute"));
const ParityBitCalculator = lazy(() => import("../features/arithmetic-hdl/ParityBitCalculator"));
const KMapGenerator = lazy(() => import("../features/kmap/KmapGenerator"));
const GateExplanation = lazy(() => import("../features/logic-gates/GateExplanation"));
const TimeDiagrams = lazy(() => import("../features/TimeDiagrams/TimeDiagrams"));
const BooleanAlgebraOverview = lazy(
  () => import("../features/boolean-algebra/BooleanAlgebraOverview"),
);
const StandardForms = lazy(() => import("../features/boolean-algebra/StandardForms"));
const CircuitCost = lazy(() => import("../features/boolean-algebra/CircuitCost"));
const UniversalGates = lazy(() => import("../features/logic-gates/UniversalGates"));
const OddFunction = lazy(() => import("../features/logic-gates/OddFunction"));
const BooleanLaws = lazy(() => import("../features/boolean-algebra/BooleanLaws"));
const BooleanIdentities = lazy(
  () => import("../features/boolean-algebra/BooleanIdentities"),
);
const MintermsPage = lazy(() => import("../features/boolean-algebra/MintermsPage"));
const MaxtermsPage = lazy(() => import("../features/boolean-algebra/MaxtermsPage"));
const ComplementPage = lazy(
  () => import("../features/boolean-algebra/ComplementPage"),
);
const ConsensusTheorem = lazy(
  () => import("../features/boolean-algebra/ConsensusTheorem"),
);
const DualityPrinciple = lazy(
  () => import("../features/boolean-algebra/DualityPrinciple"),
);
const MintermsMaxtermsRelation = lazy(
  () => import("../features/boolean-algebra/MintermsMaxtermsRelation"),
);
const SignificantDigits = lazy(
  () => import("../features/boolean-algebra/SignificantDigits"),
);
const BinaryAdders = lazy(
  () => import("../features/arithmetic-hdl/BinaryAdders"),
);
const BinarySubtractor = lazy(
  () => import("../features/arithmetic-hdl/BinarySubtractor"),
);
const BinaryAddSubtractor = lazy(
  () => import("../features/arithmetic-hdl/BinaryAddSubtractor"),
);
const BinaryMultipliers = lazy(
  () => import("../features/arithmetic-hdl/BinaryMultipliers"),
);
const CodeConversion = lazy(
  () => import("../features/arithmetic-hdl/CodeConversion"),
);
const MagnitudeComparator = lazy(
  () => import("../features/arithmetic-hdl/MagnitudeComparator"),
);
const ParityGenerators = lazy(
  () => import("../features/arithmetic-hdl/ParityGenerators"),
);
const DesignApplications = lazy(
  () => import("../features/arithmetic-hdl/DesignApplications"),
);
const Complements = lazy(
  () => import("../features/arithmetic-hdl/Complements"),
);
const SignedUnsignedArithmetic = lazy(
  () => import("../features/arithmetic-hdl/SignedUnsignedArithmetic"),
);
const BitConverter = lazy(() => import("../features/number-systems/Bitconverter"));
const BitExtension = lazy(() => import("../features/number-systems/BitExtension"));
const NumberConverter = lazy(
  () => import("../features/number-systems/NumberConversation"),
);
const NumberSystemCalculator = lazy(
  () => import("../features/number-systems/NumberSystemCalculator"),
);
const BinaryRepresentation = lazy(
  () => import("../features/number-systems/BinaryRepresentation"),
);
const BCDNotation = lazy(() => import("../features/number-systems/BCDNotation"));
const ASCIINotation = lazy(() => import("../features/number-systems/ASCIINotation"));
const EncoderPage = lazy(
  () => import("../features/combinational-circuits/encoder-decoder/encoder/EncoderPage"),
);
const DecoderPage = lazy(
  () => import("../features/combinational-circuits/encoder-decoder/decoder/DecoderPage"),
);
const MuxPage = lazy(
  () => import("../features/combinational-circuits/mux-demux/mux/MuxPage"),
);
const DemuxPage = lazy(
  () => import("../features/combinational-circuits/mux-demux/demux/DemuxPage"),
);
const SeqIntro = lazy(() => import("../features/sequential-circuits/SeqIntro"));
const SeqLatches = lazy(() => import("../features/sequential-circuits/SeqLatches"));
const SeqFlipFlops = lazy(
  () => import("../features/sequential-circuits/SeqFlipFlops"),
);
const SeqFlipFlopTypes = lazy(
  () => import("../features/sequential-circuits/SeqFlipFlopTypes"),
);
const SeqAnalysis = lazy(
  () => import("../features/sequential-circuits/SeqAnalysis"),
);
const SeqDesignProcedures = lazy(
  () => import("../features/sequential-circuits/SeqDesignProcedures"),
);
const SeqStateDiagram = lazy(
  () => import("../features/sequential-circuits/SeqStateDiagram"),
);
const SeqStateReduction = lazy(
  () => import("../features/sequential-circuits/SeqStateReduction"),
);
const DLDTrainerBoard = lazy(() => import("../features/trainer-board/TrainerBoard"));
const LoginPage = lazy(() => import("../auth/pages/LoginPage"));
const SignupPage = lazy(() => import("../auth/pages/SignupPage"));
const ForgotPasswordPage = lazy(() => import("../auth/pages/ForgotPasswordPage"));
const ProfilePage = lazy(() => import("../auth/pages/ProfilePage"));
const SettingsPage = lazy(() => import("../auth/pages/SettingsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// ScrollToTop and route synchronization
const AppContent = () => {
  

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

          <Route
            path="/resources/coal/problems"
            element={<Navigate to="/problems?course=coal" replace />}
          />
          <Route
            path="/resources/coal/problems/:topicSlug"
            element={<Navigate to="/problems?course=coal" replace />}
          />

          <Route
            path="/resources/coal/theory"
            element={<Navigate to="/resources/coal" replace />}
          />
          <Route
            path="/resources/coal/practical"
            element={<CoalPracticalPage />}
          />
          <Route path="/resources/coal" element={<CoalHomeRoute />} />
          <Route path="/coal/:slug" element={<CoalTopicPageRoute />} />
          <Route
            path="/resources/:track?"
            element={<DldHomeRoute />}
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

          {/* ── Memory Systems ── now fully data-driven (see
              features/theory/data/dldTopicContent.js) ─────────── */}
          <Route path="/memory/basics" element={<DldMemoryTopicPage />} />
          <Route path="/memory/read-only-memories" element={<DldMemoryTopicPage />} />
          <Route path="/memory/programmable-logic-array" element={<DldMemoryTopicPage />} />
          <Route path="/memory/random-access-memory" element={<DldMemoryTopicPage />} />
          <Route path="/memory/static-dynamic-ram" element={<DldMemoryTopicPage />} />
          <Route path="/memory/array-of-ram-ics" element={<DldMemoryTopicPage />} />
          <Route path="/memory/memory-construction-ram" element={<DldMemoryTopicPage />} />

          {/* ── COAL Practical Labs ───────────────────────────── */}
          <Route
            path="/resources/coal/practical/instruction-trace-lab"
            element={<InstructionTraceLabPage />}
          />
          <Route
            path="/resources/coal/practical/alu-flags-simulator"
            element={<AluFlagsSimulatorPage />}
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
