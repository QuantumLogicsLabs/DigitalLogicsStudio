import React, { useEffect } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Cpu,
  Layers3,
  Sparkles,
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
        description:
          "Understand AND, OR, NOT, NAND, NOR, XOR, and XNOR behavior.",
      },
      {
        title: "Boolean Algebra",
        description:
          "Practice simplification, duality, and algebraic identities.",
      },
      {
        title: "Karnaugh Maps",
        description: "Reduce complex expressions into simpler circuits.",
      },
      {
        title: "Sequential Logic",
        description:
          "Explore latches, flip-flops, counters, and memory basics.",
      },
    ],
    studyPlan: [
      "Review the fundamentals of logic gates and truth tables.",
      "Practice simplification using Boolean laws and K-maps.",
      "Connect theory with interactive timing and circuit tools.",
    ],
  },
};

const LearningResourcesPage = () => {
  const { theme, toggle: toggleTheme } = useTheme();
  const location = useLocation();
  const { track } = useParams();
  const content = trackConfig.dld;
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

  if (track === "coal") {
    return <Navigate to="/resources/coal" replace />;
  }

  if (track && track !== "dld") {
    return <Navigate to="/resources/dld" replace />;
  }

  const Icon = content.icon;

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
                <ArrowLeft size={16} />
                Back to home
              </Link>
              <Link to="/resources/coal" className="learning-resources-btn secondary">
                Explore COAL
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div
            className="learning-resources-hero-card"
            style={{ borderColor: `${content.accent}40` }}
          >
            <div
              className="learning-resources-hero-icon"
              style={{
                background: `${content.accent}16`,
                color: content.accent,
              }}
            >
              <Icon size={30} />
            </div>
            <h2>Study focus</h2>
            <p>
              Strengthen your foundation in digital logic with guided practice
              and visual tools.
            </p>
          </div>
        </section>

        <section className="learning-resources-section">
          <div className="learning-resources-section-header">
            <h2>Start with these resources</h2>
            <p>
              Choose a path that matches your current level and learning goal.
            </p>
          </div>

          <div className="learning-resources-grid">
            {content.quickLinks.map((item) => {
              const ItemIcon = item.icon;
              return (
                <Link
                  key={item.title}
                  to={item.to}
                  className="learning-resources-card learning-resources-glow-card"
                >
                  <div className="learning-resources-card-top">
                    <div className="learning-resources-card-meta">
                      <div
                        className="learning-resources-card-icon"
                        style={{ color: content.accent }}
                      >
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

        <section id="concepts" className="learning-resources-section">
          <div className="learning-resources-section-header">
            <h2>Beginner concepts</h2>
            <p>
              Core ideas to study first before moving on to more advanced
              material.
            </p>
          </div>

          <div className="learning-resources-concepts-grid">
            {content.concepts.map((concept) => (
              <article
                key={concept.title}
                className="learning-resources-concept-card"
              >
                <h3>{concept.title}</h3>
                <p>{concept.description}</p>
              </article>
            ))}
          </div>
        </section>

        <CoreTopicsSection topics={coreTopics} />
      </main>

      <Footer />
    </div>
  );
};

export default LearningResourcesPage;
