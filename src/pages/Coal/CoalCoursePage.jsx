import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Map,
} from "lucide-react";
import { Navbar } from "../Home/Navbar";
import CoalFooter from "../../components/coal/CoalFooter";
import { useTheme } from "../../context/ThemeContext";
import {
  coalCourseParts,
  getAllCoalModules,
  getCoalTopicPath,
} from "../../utils/coalCourseUtils";
import { coalCourseMeta } from "../../data/coalCourseOutline";
import "./CoalPages.css";

function CoalCoursePage() {
  const { theme, toggle: toggleTheme } = useTheme();
  const modules = getAllCoalModules();

  return (
    <div className="coal-page">
      <Navbar toggleTheme={toggleTheme} theme={theme} />

      <div className="coal-page__layout">
        <aside className="coal-sidebar" aria-label="Course outline">
          <div className="coal-sidebar__head">
            <p className="coal-sidebar__eyebrow">Course outline</p>
            <h2 className="coal-sidebar__title">Parts</h2>
            <p className="coal-sidebar__meta">
              {coalCourseParts.length} parts · {modules.length} topics
            </p>
          </div>

          <nav className="coal-sidebar__nav">
            {coalCourseParts.map((part) => (
              <a
                key={part.id}
                href={`#coal-part-${part.id}`}
                className="coal-sidebar__part"
              >
                <span className="coal-sidebar__part-num">Part {part.part}</span>
                <span className="coal-sidebar__part-title">{part.title}</span>
              </a>
            ))}
          </nav>
        </aside>

        <div className="coal-page__body">
          <main className="coal-page__content">
          <section className="coal-home-hero">
            <Link to="/" className="coal-home-hero__back">
              <ArrowLeft size={16} />
              Home
            </Link>
            <span className="coal-home-hero__badge">{coalCourseMeta.eyebrow}</span>
            <h1>{coalCourseMeta.title}</h1>
            <p className="coal-home-hero__lead">
              Learn computer organization and assembly step by step — from how a CPU
              works to writing real instructions. No rush. One topic at a time.
            </p>
            <div className="coal-home-hero__stats">
              <span>
                <Map size={16} /> {coalCourseParts.length} parts
              </span>
              <span>
                <BookOpen size={16} /> {modules.length} topics
              </span>
              <span>
                <Clock size={16} /> ~{coalCourseMeta.estimatedWeeks} weeks
              </span>
            </div>
          </section>

          <section className="coal-home-path">
            <div className="coal-home-path__header">
              <h2>Your full learning path</h2>
              <p>
                Every major COAL concept is listed below — from basics to advanced
                architecture. Topics unlock as we publish them.
              </p>
            </div>

            {coalCourseParts.map((part) => (
              <div
                key={part.id}
                id={`coal-part-${part.id}`}
                className="coal-home-part"
              >
                <div className="coal-home-part__head">
                  <span className="coal-home-part__label">Part {part.part}</span>
                  <h3>{part.title}</h3>
                  <p>{part.summary}</p>
                  <span className="coal-home-part__meta">
                    {part.level} · {part.duration}
                  </span>
                </div>

                <ul className="coal-home-modules">
                  {part.modules.map((module) => {
                    const info = modules.find((m) => m.slug === module.slug);
                    const hasContent = info?.hasContent;

                    return (
                      <li key={module.slug} className="coal-home-module">
                        <div className="coal-home-module__info">
                          <strong>{module.title}</strong>
                          <span>{info?.summaryLine}</span>
                        </div>
                        {hasContent ? (
                          <Link
                            to={getCoalTopicPath(module.slug)}
                            className="coal-btn coal-btn--small"
                          >
                            Explore <ArrowRight size={14} />
                          </Link>
                        ) : (
                          <span className="coal-home-module__soon">Soon</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </section>

          <section className="coal-home-promise">
            <CheckCircle2 size={22} />
            <div>
              <h3>You will cover everything</h3>
              <p>
                Registers, memory, assembly syntax, x86 architecture, I/O,
                interrupts, and pipelining — all in plain language with examples
                you can relate to.
              </p>
            </div>
          </section>
          </main>

          <CoalFooter showPartAnchors />
        </div>
      </div>
    </div>
  );
}

export default CoalCoursePage;
