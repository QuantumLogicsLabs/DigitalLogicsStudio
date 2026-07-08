import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../Home/Navbar";
import Footer from "../Home/Footer";
import { useTheme } from "../../context/ThemeContext";
import usePointerGlow from "../../hooks/usePointerGlow";
import { coalCourseMeta } from "../../data/coalCourseOutline";
import AddressingModePlayground from "../../components/coal/AddressingModePlayground";
import "../Home/Home.css";
import "../LearningResources/LearningResourcesPage.css";

const COAL_ACCENT = coalCourseMeta.accent;

function AddressingModePlaygroundPage() {
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
            <h1>Addressing Mode Playground</h1>
            <p>
              Build instructions, calculate effective addresses, visualise memory
              access step-by-step, compare modes side-by-side, and quiz yourself
              — all in one place. No memorisation needed.
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
          <AddressingModePlayground />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AddressingModePlaygroundPage;
