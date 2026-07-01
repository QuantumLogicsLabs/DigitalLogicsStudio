import React, { useEffect } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Code2,
  Cpu,
  GraduationCap,
  Layers3,
  ListChecks,
  MonitorPlay,
  Sparkles,
  Zap,
} from "lucide-react";
import { Navbar } from "../Home/Navbar";
import Footer from "../Home/Footer";
import { useTheme } from "../../context/ThemeContext";
import usePointerGlow from "../../hooks/usePointerGlow";
import CoreTopicsSection from "../../components/topics/CoreTopicsSection";
import coreTopics from "../../data/coreTopics";
import "../Home/Home.css";
import "./LearningResourcesPage.css";

const trackConfig = {
  dld: {
    slug: "dld",
    title: "Digital Logic Design",
    eyebrow: "Foundation Track",
    description:
      "A polished study hub for number systems, Boolean algebra, combinational circuits, and timing concepts.",
    accent: "#3b82f6",
    icon: Cpu,
    quickLinks: [
      {
        title: "Chapter 1 Practice",
        description: "Start with basics, logic gates, and number systems.",
        to: "/book",
        icon: BookOpen,
      },
      {
        title: "Chapter 2 Practice",
        description: "Move to simplification, K-maps, and circuit design.",
        to: "/book/ch2",
        icon: Layers3,
      },
      {
        title: "Timing Diagrams",
        description: "Visualize how digital signals evolve over time.",
        to: "/timing-diagrams",
        icon: Sparkles,
      },
    ],
    concepts: [
      {
        title: "Logic Gates",
        description: "Understand AND, OR, NOT, NAND, NOR, XOR, and XNOR behavior.",
      },
      {
        title: "Boolean Algebra",
        description: "Practice simplification, duality, and algebraic identities.",
      },
      {
        title: "Karnaugh Maps",
        description: "Reduce complex expressions into simpler circuits.",
      },
      {
        title: "Sequential Logic",
        description: "Explore latches, flip-flops, counters, and memory basics.",
      },
    ],
    studyPlan: [
      "Review the fundamentals of logic gates and truth tables.",
      "Practice simplification using Boolean laws and K-maps.",
      "Connect theory with interactive timing and circuit tools.",
    ],
  },
  coal: {
    slug: "coal",
    title: "COAL Language",
    eyebrow: "Beginner Track",
    description:
      "A beginner-friendly learning space for COAL concepts, instruction flow, and first practice problems.",
    accent: "#8b5cf6",
    icon: Code2,
    quickLinks: [
      {
        title: "Core Concepts",
        description: "Start with the building blocks of COAL language.",
        to: "#concepts",
        icon: BrainCircuit,
      },
      {
        title: "Practice Problems",
        description: "Try simple beginner exercises to build confidence.",
        to: "#practice",
        icon: GraduationCap,
      },
    ],
    concepts: [
      {
        title: "COAL Syntax Basics",
        description: "Learn how instructions, labels, and comments are structured.",
      },
      {
        title: "Registers and Memory",
        description: "Understand how values are stored and moved in a simple machine.",
      },
      {
        title: "Control Flow",
        description: "Practice branching, jumps, and decision-making instructions.",
      },
      {
        title: "Instruction Logic",
        description: "Build confidence with basic arithmetic and data movement tasks.",
      },
    ],
    visualConcepts: [
      {
        title: "Fetch → Decode → Execute",
        description: "See how the CPU steps through each instruction and updates the program flow.",
        icon: MonitorPlay,
      },
      {
        title: "Registers in Action",
        description: "Understand how AX, BX, CX, and DX hold temporary values during computation.",
        icon: Cpu,
      },
      {
        title: "Control Flow Logic",
        description: "Learn how jumps and comparisons guide the program from one instruction to another.",
        icon: Zap,
      },
    ],
    demoCode: [
      {
        title: "Simple data movement",
        code: `MOV AX, 5\nMOV BX, 10\nADD AX, BX`,
      },
      {
        title: "Branch example",
        code: `CMP AX, BX\nJE equal_label\nJNE continue`,
      },
      {
        title: "Looping idea",
        code: `MOV CX, 5\nloop_start:\nADD AX, 1\nLOOP loop_start`,
      },
    ],
    practiceQuestions: [
      {
        difficulty: "Beginner",
        title: "What does MOV do?",
        prompt: "Explain the purpose of a MOV instruction and give one example.",
      },
      {
        difficulty: "Beginner",
        title: "Register understanding",
        prompt: "Name two registers and describe what each is commonly used for.",
      },
      {
        difficulty: "Intermediate",
        title: "Branch logic",
        prompt: "How does a jump instruction change the order of execution in a program?",
      },
      {
        difficulty: "Intermediate",
        title: "Flag awareness",
        prompt: "What happens when a comparison instruction is executed before a conditional jump?",
      },
    ],
    studyPlan: [
      "Start with the basic structure of COAL instructions and syntax.",
      "Understand registers, memory, and simple data movement.",
      "Practice branching and beginner problems before advancing to more complex topics.",
    ],
    roadmapPhases: [
      {
        phase: "Phase 1",
        title: "Computer Fundamentals",
        duration: "1 Week",
        points: ["What is a computer?", "CPU, memory, I/O, bus, clock cycles"],
      },
      {
        phase: "Phase 2",
        title: "Number Systems",
        duration: "3–4 Days",
        points: ["Binary, decimal, hexadecimal, octal", "1's and 2's complement, signed vs unsigned"],
      },
      {
        phase: "Phase 3",
        title: "Boolean Algebra & Logic Gates",
        duration: "1 Week",
        points: ["AND, OR, NOT, XOR, NAND, NOR", "Truth tables, De Morgan's law, K-maps"],
      },
      {
        phase: "Phase 4",
        title: "Digital Logic Circuits",
        duration: "1 Week",
        points: ["Half/full adder", "Decoder, encoder, multiplexer, demultiplexer"],
      },
      {
        phase: "Phase 5",
        title: "Computer Organization",
        duration: "4–5 Days",
        points: ["ALU, control unit, registers", "Cache, main memory, secondary memory"],
      },
      {
        phase: "Phase 6",
        title: "Instruction Cycle",
        duration: "3 Days",
        points: ["Fetch, decode, execute, store", "Program counter and instruction register"],
      },
      {
        phase: "Phase 7",
        title: "Assembly Language Basics",
        duration: "3 Days",
        points: ["Basic syntax", "MOV, ADD, SUB, JMP, comparison instructions"],
      },
      {
        phase: "Phase 8",
        title: "Assembly Instructions",
        duration: "1 Week",
        points: ["Data transfer, arithmetic, logic, shift", "Control flow and loops"],
      },
      {
        phase: "Phase 9",
        title: "Flags Register",
        duration: "3 Days",
        points: ["Zero, carry, overflow, sign flags", "How comparisons affect flags"],
      },
      {
        phase: "Phase 10",
        title: "Addressing Modes",
        duration: "4 Days",
        points: ["Immediate, register, direct, indirect", "Indexed and base-indexed addressing"],
      },
      {
        phase: "Phase 11",
        title: "Stack & Procedures",
        duration: "4 Days",
        points: ["PUSH, POP, CALL, RET", "Parameters and local variables"],
      },
      {
        phase: "Phase 12",
        title: "Arrays, Strings & Interrupts",
        duration: "1 Week",
        points: ["Array access and string instructions", "Interrupt-driven input/output"],
      },
    ],
  },
};

const LearningResourcesPage = () => {
  const { theme, toggle: toggleTheme } = useTheme();
  const location = useLocation();
  const { track } = useParams();
  const resolvedTrack = track === "coal" ? "coal" : "dld";
  const content = trackConfig[resolvedTrack];
  const glowRootRef = usePointerGlow({ color: content.accent, alpha: 0.2 });

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location.hash]);

  if (track && !trackConfig[track]) {
    return <Navigate to="/resources/dld" replace />;
  }

  const Icon = content.icon;

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAnchorClick = (target) => {
    const id = target.replace("#", "");
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };


  return (
    <div className="learning-resources-page" ref={glowRootRef}>
      <div className="grid-background" />
      <Navbar
        toggleTheme={toggleTheme}
        theme={theme}
        onHomeClick={handleHomeClick}
      />

      <main className="learning-resources-main">
        <section className="learning-resources-hero">
          <div className="learning-resources-hero-content">
            <span className="learning-resources-badge">{content.eyebrow}</span>
            <h1>{content.title}</h1>
            <p>{content.description}</p>

            <div className="learning-resources-hero-actions">
              <Link to="/" className="learning-resources-btn primary">
                Back to home
              </Link>
              <Link
                to={resolvedTrack === "dld" ? "/resources/coal" : "/resources/dld"}
                className="learning-resources-btn secondary"
              >
                Explore {resolvedTrack === "dld" ? "COAL" : "DLD"}
              </Link>
            </div>
          </div>

          <div className="learning-resources-hero-card" style={{ borderColor: `${content.accent}40` }}>
            <div className="learning-resources-hero-icon" style={{ background: `${content.accent}16`, color: content.accent }}>
              <Icon size={30} />
            </div>
            <h2>Study focus</h2>
            <p>
              {resolvedTrack === "dld"
                ? "Strengthen your foundation in digital logic with guided practice and visual tools."
                : "Build confidence with beginner-level COAL topics and structured problem practice."}
            </p>
          </div>
        </section>

        <section className="learning-resources-section">
          <div className="learning-resources-section-header">
            <h2>Start with these resources</h2>
            <p>Choose a path that matches your current level and learning goal.</p>
          </div>

          <div className="learning-resources-grid">
            {content.quickLinks.map((item) => {
              const ItemIcon = item.icon;
              const isAnchor = item.to?.startsWith("#");

              return isAnchor ? (
                <button
                  key={item.title}
                  type="button"
                  className="learning-resources-card learning-resources-card-button learning-resources-glow-card"
                  onClick={() => handleAnchorClick(item.to)}
                >
                  <div className="learning-resources-card-meta">
                    <div className="learning-resources-card-icon" style={{ color: content.accent }}>
                      <ItemIcon size={20} />
                    </div>
                    <div className="learning-resources-card-copy">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                  <span className="learning-resources-card-link">
                    Open <ArrowRight size={16} />
                  </span>
                </button>
              ) : (
                <Link
                  key={item.title}
                  to={item.to}
                  className="learning-resources-card learning-resources-glow-card"
                >
                  <div className="learning-resources-card-meta">
                    <div className="learning-resources-card-icon" style={{ color: content.accent }}>
                      <ItemIcon size={20} />
                    </div>
                    <div className="learning-resources-card-copy">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                  <span className="learning-resources-card-link">
                    Open <ArrowRight size={16} />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section id="concepts" className="learning-resources-section">
          <div className="learning-resources-section-header">
            <h2>Beginner concepts</h2>
            <p>Core ideas to study first before moving on to more advanced material.</p>
          </div>

          <div className="learning-resources-concepts-grid">
            {content.concepts.map((concept) => (
              <article key={concept.title} className="learning-resources-concept-card">
                <h3>{concept.title}</h3>
                <p>{concept.description}</p>
              </article>
            ))}
          </div>
        </section>

        {resolvedTrack === "coal" ? (
          <>
            <section className="learning-resources-section">
              <div className="learning-resources-section-header">
                <h2>Visual concept highlights</h2>
                <p>Quick mental models to connect machine behavior with assembly concepts.</p>
              </div>

              <div className="learning-resources-visual-grid">
                {content.visualConcepts.map((item) => {
                  const VisualIcon = item.icon;
                  return (
                    <article key={item.title} className="learning-resources-visual-card">
                      <div className="learning-resources-visual-icon">
                        <VisualIcon size={20} />
                      </div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="learning-resources-section">
              <div className="learning-resources-section-header">
                <h2>Mini demo code</h2>
                <p>Small examples that help you see how assembly instructions look in practice.</p>
              </div>

              <div className="learning-resources-demo-grid">
                {content.demoCode.map((item) => (
                  <article key={item.title} className="learning-resources-demo-card">
                    <h3>{item.title}</h3>
                    <pre>{item.code}</pre>
                  </article>
                ))}
              </div>
            </section>

            <section id="practice" className="learning-resources-section">
              <div className="learning-resources-section-header">
                <h2>Practice questions</h2>
                <p>Try these beginner-friendly questions and grade yourself by difficulty.</p>
              </div>

              <div className="learning-resources-practice-grid">
                {content.practiceQuestions.map((question) => (
                  <article key={question.title} className="learning-resources-practice-card">
                    <div className="learning-resources-practice-top">
                      <span className="learning-resources-difficulty">{question.difficulty}</span>
                      <span className="learning-resources-idea">
                        <ListChecks size={15} /> Practice
                      </span>
                    </div>
                    <h3>{question.title}</h3>
                    <p>{question.prompt}</p>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : null}

        {resolvedTrack === "dld" ? (
          <CoreTopicsSection topics={coreTopics} />
        ) : null}
      </main>

      <Footer />
    </div>
  );
};

export default LearningResourcesPage;
