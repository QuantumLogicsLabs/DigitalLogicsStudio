import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../Home/Navbar";
import Footer from "../Home/Footer";
import { useTheme } from "../../context/ThemeContext";
import usePointerGlow from "../../hooks/usePointerGlow";
import { coalCourseMeta } from "../../data/coalCourseOutline";
import CPUExplorer from "./CPUExplorer";
import "../Home/Home.css";
import "../LearningResources/LearningResourcesPage.css";

const COAL_ACCENT = coalCourseMeta.accent;

function InstructionTraceLabPage() {
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
            <h1>Instruction Trace Lab</h1>
            <p>
              Click any CPU component, step through the fetch–decode–execute
              cycle, and watch data travel across the buses in real time.
            </p>

            <div className="learning-resources-hero-actions">
              <Link
                to="/resources/coal/practical"
                className="learning-resources-btn primary"
              >
                <ArrowLeft size={16} />
                Back to Practical
              </Link>
            </div>
          </div>
        </section>

        <section className="learning-resources-section">
          <CPUExplorer />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default InstructionTraceLabPage;
