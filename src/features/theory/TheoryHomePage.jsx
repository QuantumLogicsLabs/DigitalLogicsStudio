import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, ArrowLeft, Cpu } from "lucide-react";
import Navbar from "../../shared/components/Navbar";
import Footer from "../../shared/components/Footer";
import { useTheme } from "../../shared/context/ThemeContext";
import usePointerGlow from "../../shared/hooks/usePointerGlow";
import CoreTopicsSection from "../../shared/components/topics/CoreTopicsSection";
import buildCoreTopics from "./utils/coreTopicsBuilder";
import "../home/Home.css";
import "./TheoryHomePage.css";

// ── Generic theory home page ────────────────────────────────────────
// Hero + quick links + the FULL course overview, all on one page — this
// is DLD's existing pattern (LearningResourcesPage), now shared with
// COAL so the overview no longer lives on a separate page.
export default function TheoryHomePage({ track }) {
  const { theme, toggle: toggleTheme } = useTheme();
  const location = useLocation();
  const accent = track.meta.accent;
  const glowRootRef = usePointerGlow({ color: accent, alpha: 0.2 });
  const coreTopics = buildCoreTopics(track);
  const publishedCount = track.utils.getAllModules().filter((m) => m.hasContent).length;
  const totalModules = track.utils.getAllModules().length;

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const section = document.getElementById(id);
      if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  const handleHomeClick = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="learning-resources-page" ref={glowRootRef}>
      <div className="grid-background" />
      <Navbar toggleTheme={toggleTheme} theme={theme} onHomeClick={handleHomeClick} />

      <main className="learning-resources-main">
        <section className="learning-resources-hero">
          <div className="learning-resources-hero-content">
            <span className="learning-resources-badge">{track.meta.eyebrow}</span>
            <h1>{track.meta.title}</h1>
            <p>{track.homeDescription}</p>

            <div className="learning-resources-hero-actions">
              <Link to="/" className="learning-resources-btn primary">
                <ArrowLeft size={16} />
                Back to home
              </Link>
              <Link to={track.otherTrackPath} className="learning-resources-btn secondary">
                {track.otherTrackLabel}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="learning-resources-hero-card" style={{ borderColor: `${accent}40` }}>
            <div className="learning-resources-hero-icon" style={{ background: `${accent}16`, color: accent }}>
              <Cpu size={30} />
            </div>
            <h2>Course overview</h2>
            <p>
              {track.courseParts.length} parts · {totalModules} topics
              {track.meta.estimatedWeeks ? ` · ~${track.meta.estimatedWeeks} weeks` : ""} · {publishedCount} published
            </p>
          </div>
        </section>

        {track.quickLinks?.length ? (
          <section className="learning-resources-section">
            <div className="learning-resources-section-header">
              <h2>Start with these resources</h2>
              <p>Choose a path that matches your current level and learning goal.</p>
            </div>

            <div className="learning-resources-grid">
              {track.quickLinks.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <Link key={item.title} to={item.to} className="learning-resources-card learning-resources-glow-card">
                    <div className="learning-resources-card-top">
                      <div className="learning-resources-card-meta">
                        <div className="learning-resources-card-icon" style={{ color: accent }}>
                          <ItemIcon size={24} />
                        </div>
                        <div className="learning-resources-card-copy">
                          <h3>{item.title}</h3>
                          <p>{item.description}</p>
                        </div>
                      </div>
                      <span className="learning-resources-card-link">
                        Open <ArrowRight size={16} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        {track.concepts?.length ? (
          <section id="concepts" className="learning-resources-section">
            <div className="learning-resources-section-header">
              <h2>Beginner concepts</h2>
              <p>Core ideas to study first before moving on to more advanced material.</p>
            </div>

            <div className="learning-resources-concepts-grid">
              {track.concepts.map((concept) => (
                <article key={concept.title} className="learning-resources-concept-card">
                  <h3>{concept.title}</h3>
                  <p>{concept.description}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {/* ── Overview — every part, right here on the home page ── */}
        <CoreTopicsSection topics={coreTopics} parentTopicId={track.parentProgressTopicId} />
      </main>

      <Footer />
    </div>
  );
}
