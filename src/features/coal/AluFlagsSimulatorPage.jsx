import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../../shared/components/Navbar";
import Footer from "../../shared/components/Footer";
import { useTheme } from "../../shared/context/ThemeContext";
import usePointerGlow from "../../shared/hooks/usePointerGlow";
import { coalCourseMeta } from "../../shared/data/coalCourseOutline";
import AluFlagsSimulator from "./components/AluFlagsSimulator";
import "../home/Home.css";
import "../../shared/styles/LearningResourcesPage.css";

const COAL_ACCENT = coalCourseMeta.accent;

function AluFlagsSimulatorPage() {
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
            <h1>ALU & Flags Simulator</h1>
            <p>
              Explore simple arithmetic operations and observe how carry, zero,
              overflow, and sign flags respond in real time.
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
          <AluFlagsSimulator />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AluFlagsSimulatorPage;
