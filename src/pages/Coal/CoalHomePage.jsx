import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Cpu,
  Wrench,
  Trophy,
} from "lucide-react";
import { Navbar } from "../Home/Navbar";
import Footer from "../Home/Footer";
import { useTheme } from "../../context/ThemeContext";
import usePointerGlow from "../../hooks/usePointerGlow";
import { coalCourseParts, coalCourseMeta } from "../../data/coalCourseOutline";
import { getAllCoalModules } from "../../utils/coalCourseUtils";
import "../Home/Home.css";
import "../LearningResources/LearningResourcesPage.css";

const COAL_ACCENT = coalCourseMeta.accent;

function CoalHomePage() {
  const { theme, toggle: toggleTheme } = useTheme();
  const modules = getAllCoalModules();
  const publishedCount = modules.filter((m) => m.hasContent).length;
  const glowRootRef = usePointerGlow({ color: COAL_ACCENT, alpha: 0.2 });

  return (
    <div className="learning-resources-page coal-site-shell" ref={glowRootRef}>
      <div className="grid-background" />
      <Navbar toggleTheme={toggleTheme} theme={theme} />

      <main className="learning-resources-main">
        <section className="learning-resources-hero">
          <div className="learning-resources-hero-content">
            <span className="learning-resources-badge">{coalCourseMeta.eyebrow}</span>
            <h1>{coalCourseMeta.title}</h1>
            <p>
              A structured path from computer fundamentals to assembly and processor
              architecture. Open theory for lessons or practical for hands-on work.
            </p>

            <div className="learning-resources-hero-actions">
              <Link to="/" className="learning-resources-btn primary">
                <ArrowLeft size={16} />
                Back to home
              </Link>
              <Link to="/resources/dld" className="learning-resources-btn secondary">
                Explore DLD
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div
            className="learning-resources-hero-card"
            style={{ borderColor: `${COAL_ACCENT}40` }}
          >
            <div
              className="learning-resources-hero-icon"
              style={{
                background: `${COAL_ACCENT}16`,
                color: COAL_ACCENT,
              }}
            >
              <Cpu size={30} />
            </div>
            <h2>Course overview</h2>
            <p>
              {coalCourseParts.length} parts · {modules.length} topics · ~
              {coalCourseMeta.estimatedWeeks} weeks · {publishedCount} published
            </p>
          </div>
        </section>

        <section className="learning-resources-section">
          <div className="learning-resources-section-header">
            <h2>Choose a section</h2>
            <p>Explore theory, attempt interactive practicals, or tackle conceptual problems.</p>
          </div>

          <div className="learning-resources-grid">
            <Link
              to="/resources/coal/theory"
              className="learning-resources-card learning-resources-glow-card"
            >
              <div className="learning-resources-card-top">
                <div className="learning-resources-card-meta">
                  <div
                    className="learning-resources-card-icon"
                    style={{ color: COAL_ACCENT }}
                  >
                    <BookOpen size={24} />
                  </div>
                  <div className="learning-resources-card-copy">
                    <h3>Theory</h3>
                    <p>
                      Full course path with diagrams, examples, and topic lessons
                      across all {coalCourseParts.length} parts.
                    </p>
                  </div>
                </div>
                <span className="learning-resources-card-link">
                  Open <ArrowRight size={16} />
                </span>
              </div>
            </Link>

            <Link
              to="/resources/coal/practical"
              className="learning-resources-card learning-resources-glow-card"
            >
              <div className="learning-resources-card-top">
                <div className="learning-resources-card-meta">
                  <div
                    className="learning-resources-card-icon"
                    style={{ color: COAL_ACCENT }}
                  >
                    <Wrench size={24} />
                  </div>
                  <div className="learning-resources-card-copy">
                    <h3>Practical</h3>
                    <p>
                      Labs, tracing exercises, assembly drills, and simulators —
                      coming soon.
                    </p>
                  </div>
                </div>
                <span className="learning-resources-card-link">
                  View <ArrowRight size={16} />
                </span>
              </div>
            </Link>

            <Link
              to="/resources/coal/problems"
              className="learning-resources-card learning-resources-glow-card"
            >
              <div className="learning-resources-card-top">
                <div className="learning-resources-card-meta">
                  <div
                    className="learning-resources-card-icon"
                    style={{ color: COAL_ACCENT }}
                  >
                    <Trophy size={24} />
                  </div>
                  <div className="learning-resources-card-copy">
                    <h3>Problems Arena</h3>
                    <p>
                      Tackle 15 COAL conceptual and code tracing challenges to test your understanding.
                    </p>
                  </div>
                </div>
                <span className="learning-resources-card-link">
                  Solve <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default CoalHomePage;
