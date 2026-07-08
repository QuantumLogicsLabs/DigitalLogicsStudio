import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Cpu,
  FlaskConical,
  Terminal,
  Wrench,
} from "lucide-react";
import { Navbar } from "../Home/Navbar";
import Footer from "../Home/Footer";
import { useTheme } from "../../context/ThemeContext";
import usePointerGlow from "../../hooks/usePointerGlow";
import { coalCourseMeta } from "../../data/coalCourseOutline";
import "../Home/Home.css";
import "../LearningResources/LearningResourcesPage.css";

const COAL_ACCENT = coalCourseMeta.accent;

const PLANNED_PRACTICALS = [
  {
    key: "instruction-trace-lab",
    title: "Instruction trace lab",
    description:
      "Step through fetch–decode–execute for short programs by hand.",
    icon: Terminal,
    ready: true,
    path: "/resources/coal/practical/instruction-trace-lab",
  },
  {
    key: "alu-flags-simulator",
    title: "ALU & flags simulator",
    description: "Practice arithmetic and see how ZF, CF, OF, and SF change.",
    icon: Cpu,
    ready: false,
  },
  {
    key: "stack-memory-simulator",
    title: "Stack & Memory Simulator",
    description: "Trace PUSH, POP, CALL, and RET with visual stack diagrams.",
    icon: FlaskConical,
    ready: true,
    path: "/resources/coal/practical/stack-memory-simulator",
  },
  {
    key: "assembly-drills",
    title: "Assembly drills",
    description: "Short COAL/MASM-style programs with guided solutions.",
    icon: Wrench,
    ready: false,
  },
  {
    key: "addressing-mode-playground",
    title: "Addressing Mode Playground",
    description:
      "Build instructions, calculate effective addresses, and quiz yourself on all 8 addressing modes.",
    icon: Cpu,
    ready: true,
    path: "/resources/coal/practical/addressing-mode-playground",
  },
];

function CoalPracticalPage() {
  const { theme, toggle: toggleTheme } = useTheme();
  const glowRootRef = usePointerGlow({ color: COAL_ACCENT, alpha: 0.2 });

  return (
    <div className="learning-resources-page coal-site-shell" ref={glowRootRef}>
      <div className="grid-background" />
      <Navbar toggleTheme={toggleTheme} theme={theme} />

      <main className="learning-resources-main">
        <section className="learning-resources-hero">
          <div className="learning-resources-hero-content">
            <span className="learning-resources-badge">Practical</span>
            <h1>Practical labs & exercises</h1>
            <p>
              Hands-on work to pair with theory — tracing programs, using
              simulators, and building assembly confidence.
            </p>

            <div className="learning-resources-hero-actions">
              <Link
                to="/resources/coal"
                className="learning-resources-btn primary"
              >
                <ArrowLeft size={16} />
                COAL home
              </Link>
              <Link
                to="/resources/coal/theory"
                className="learning-resources-btn secondary"
              >
                Open theory
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section className="learning-resources-section">
          <div className="learning-resources-section-header">
            <h2>Planned modules</h2>
            <p>
              Content will be added here as practical exercises are published.
            </p>
          </div>

          <div className="learning-resources-concepts-grid">
            {PLANNED_PRACTICALS.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.key}
                  className={`learning-resources-concept-card${
                    item.ready ? " learning-resources-concept-card--ready" : ""
                  }`}
                >
                  <div
                    className="learning-resources-card-icon"
                    style={{ color: COAL_ACCENT, marginBottom: "0.65rem" }}
                  >
                    <Icon size={22} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>

                  {item.ready ? (
                    <Link
                      to={item.path}
                      className="learning-resources-badge learning-resources-badge--open"
                      style={{ marginTop: "0.75rem" }}
                    >
                      Open
                      <ArrowUpRight size={14} />
                    </Link>
                  ) : (
                    <span
                      className="learning-resources-badge"
                      style={{ marginTop: "0.75rem" }}
                    >
                      Coming soon
                    </span>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default CoalPracticalPage;
