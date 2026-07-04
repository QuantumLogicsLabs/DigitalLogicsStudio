import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Clock, GraduationCap } from "lucide-react";
import { Navbar } from "../Home/Navbar";
import CoalFooter from "../../components/coal/CoalFooter";
import { useTheme } from "../../context/ThemeContext";
import CoalTopicContent from "../../components/coal/CoalTopicContent";
import { getCoalTopicContent } from "../../data/coalTopicContent";
import { getCoalModuleBySlug, getCoalTopicPath } from "../../utils/coalCourseUtils";
import "./CoalPages.css";

function CoalTopicPage() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { slug } = useParams();
  const resolved = getCoalModuleBySlug(slug);
  const content = getCoalTopicContent(slug);

  if (!resolved) {
    return (
      <div className="coal-page">
        <Navbar toggleTheme={toggleTheme} theme={theme} />
        <main className="coal-page__main coal-page__main--narrow">
          <p>Topic not found.</p>
          <Link to="/resources/coal" className="coal-btn coal-btn--ghost">
            <ArrowLeft size={16} /> Back to COAL course
          </Link>
        </main>
        <CoalFooter showPartAnchors={false} />
      </div>
    );
  }

  const { module, prev, next } = resolved;

  return (
    <div className="coal-page">
      <Navbar toggleTheme={toggleTheme} theme={theme} />

      <main className="coal-page__main coal-page__main--narrow">
        <nav className="coal-breadcrumb" aria-label="Breadcrumb">
          <Link to="/resources/coal">COAL Course</Link>
          <span>/</span>
          <span>{module.title}</span>
        </nav>

        <header className="coal-topic-hero">
          <p className="coal-topic-hero__part">
            Part {module.partNumber} · {module.partTitle}
          </p>
          <h1>{module.title}</h1>
          <div className="coal-topic-hero__meta">
            <span>
              <GraduationCap size={15} /> {content?.level || module.partLevel}
            </span>
            <span>
              <Clock size={15} /> {content?.duration || module.duration}
            </span>
          </div>
        </header>

        {content ? (
          <CoalTopicContent content={content} />
        ) : (
          <div className="coal-coming-soon">
            <BookOpen size={28} />
            <h2>Coming soon</h2>
            <p>
              We are preparing simple lessons, diagrams, and examples for this topic.
              Check back soon or continue with the topics already available.
            </p>
          </div>
        )}

        <footer className="coal-topic-nav">
          {prev ? (
            <Link to={getCoalTopicPath(prev.slug)} className="coal-topic-nav__link">
              <span className="coal-topic-nav__icon" aria-hidden="true">
                <ArrowLeft size={18} />
              </span>
              <span className="coal-topic-nav__copy">
                <small>Previous</small>
                <strong>{prev.title}</strong>
              </span>
            </Link>
          ) : (
            <Link to="/resources/coal" className="coal-topic-nav__link">
              <span className="coal-topic-nav__icon" aria-hidden="true">
                <ArrowLeft size={18} />
              </span>
              <span className="coal-topic-nav__copy">
                <small>Course path</small>
                <strong>Back to full course</strong>
              </span>
            </Link>
          )}
          {next ? (
            <Link
              to={getCoalTopicPath(next.slug)}
              className="coal-topic-nav__link coal-topic-nav__link--next"
            >
              <span className="coal-topic-nav__copy">
                <small>Next lesson</small>
                <strong>{next.title}</strong>
              </span>
              <span className="coal-topic-nav__icon" aria-hidden="true">
                <ArrowRight size={18} />
              </span>
            </Link>
          ) : (
            <Link
              to="/resources/coal"
              className="coal-topic-nav__link coal-topic-nav__link--next"
            >
              <span className="coal-topic-nav__copy">
                <small>Finished</small>
                <strong>Back to course path</strong>
              </span>
              <span className="coal-topic-nav__icon" aria-hidden="true">
                <ArrowRight size={18} />
              </span>
            </Link>
          )}
        </footer>
      </main>

      <CoalFooter showPartAnchors={false} />
    </div>
  );
}

export default CoalTopicPage;
