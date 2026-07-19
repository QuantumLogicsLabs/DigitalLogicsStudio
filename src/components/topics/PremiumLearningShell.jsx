import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Home } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import progressService from "../../services/progressService";
import "../../pages/ArithmeticFunctionsAndHDLs/AFHDLLayout.css";
import "./PremiumLearningShell.css";
import RelatedSeoLinks from "../seo/RelatedSeoLinks";

function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

const noop = async () => {};
const EMPTY_ALIASES = {};

const PremiumLearningShell = ({
  title,
  subtitle,
  intro,
  highlights = [],
  children,
  pages,
  sidebarPages,
  overviewPath = "",
  isSidebarItemActive = null,
  isSidebarItemDone = null,
  topicLabel,
  sidebarTitle,
  sidebarCopy,
  heroKicker,
  progressVerb = "complete",
  tracking,
  rootClassName = "",
  sidebarFooterLink = "/",
  sidebarFooterLabel = "← Back to All Topics",
}) => {
  const location = useLocation();
  const { theme, toggle: toggleTheme } = useTheme();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const currentPath = location.pathname;
  const navPages = sidebarPages?.length ? sidebarPages : pages;
  const chapterPages = pages;
  const isOverview = Boolean(overviewPath) && currentPath === overviewPath;
  const currentIndex = chapterPages.findIndex((page) => page.path === currentPath);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const dotActiveIndex = currentIndex;
  const prev = isOverview
    ? null
    : currentIndex > 0
      ? chapterPages[currentIndex - 1]
      : null;
  const next = isOverview
    ? chapterPages[0] || null
    : currentIndex >= 0 && currentIndex < chapterPages.length - 1
      ? chapterPages[currentIndex + 1]
      : null;

  const pathToSubtopicId = tracking?.pathToSubtopicId || {};
  const subtopicAliases = tracking?.subtopicAliases || EMPTY_ALIASES;
  const trackedTopic = tracking?.topic || null;
  const subtopicId = pathToSubtopicId[currentPath] || null;
  const userKey = progressService.getUserKey(user);
  const catalog = useMemo(
    () => (trackedTopic ? { topics: [trackedTopic], problems: [] } : null),
    [trackedTopic],
  );

  const getCompletedSubtopics = useCallback(() => {
    if (!trackedTopic || !catalog) return [];
    const snapshot = progressService.getSnapshot(userKey, catalog);
    const completed =
      snapshot.state.topics?.[trackedTopic.id]?.completedSubtopics || [];
    return Array.from(
      new Set(completed.map((id) => subtopicAliases[id] || id)),
    );
  }, [catalog, subtopicAliases, trackedTopic, userKey]);

  const [completedSubtopics, setCompletedSubtopics] = useState(() =>
    getCompletedSubtopics(),
  );

  // Hydrate the in-memory progress cache from MongoDB the first time a
  // tracked topic page is visited. Without this, navigating directly to
  // e.g. /boolean/laws would always show "Mark as Read" as unchecked
  // because the cache starts empty.
  const dbLoadedRef = useRef(null);
  useEffect(() => {
    if (!trackedTopic || !user || userKey === "guest") return;
    if (dbLoadedRef.current === userKey) return;
    dbLoadedRef.current = userKey;

    progressService.loadFromDB(userKey).then(() => {
      setCompletedSubtopics(getCompletedSubtopics());
    });
  }, [user, userKey, trackedTopic, getCompletedSubtopics]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [currentPath]);

  useEffect(() => {
    const updateScrolledState = () => {
      setIsScrolled(window.scrollY > 24);
    };

    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrolledState);
    };
  }, []);

  useEffect(() => {
    setCompletedSubtopics(getCompletedSubtopics());
  }, [getCompletedSubtopics, currentPath]);

  const toggleCompletion = useCallback(async () => {
    if (!trackedTopic || !subtopicId || !catalog) return noop();

    setCompletedSubtopics((prevCompleted) =>
      prevCompleted.includes(subtopicId)
        ? prevCompleted.filter((id) => id !== subtopicId)
        : [...prevCompleted, subtopicId],
    );

    await progressService.toggleSubtopicCompleted(
      userKey,
      trackedTopic,
      subtopicId,
      catalog,
    );

    setCompletedSubtopics(getCompletedSubtopics());
  }, [catalog, getCompletedSubtopics, subtopicId, trackedTopic, userKey]);

  const readCount = trackedTopic
    ? completedSubtopics.filter((id) =>
        Object.values(pathToSubtopicId).includes(id),
      ).length
    : isOverview
      ? 0
      : safeIndex + 1;
  const progress = Math.round(
    (readCount / Math.max(chapterPages.length, 1)) * 100,
  );
  const progressDash = progress * 0.879;
  const isRead = subtopicId ? completedSubtopics.includes(subtopicId) : false;

  const pageDone = (pageIndex, page) => {
    if (isSidebarItemDone) return isSidebarItemDone(page, completedSubtopics);

    if (!trackedTopic) return pageIndex < safeIndex;

    const pageSubtopicId = pathToSubtopicId[page.path];
    return pageSubtopicId ? completedSubtopics.includes(pageSubtopicId) : false;
  };

  return (
    <div
      className={`afhdl-layout premium-topic-shell ${rootClassName} ${
        isScrolled ? "is-scrolled" : ""
      }`.trim()}
      style={{ background: "var(--afhdl-bg)", color: "var(--afhdl-text)" }}
    >
      <div className="afhdl-bg afhdl-bg-1" />
      <div className="afhdl-bg afhdl-bg-2" />

      <header className="afhdl-topbar">
        <div className="afhdl-topbar-left">
          <button
            className={`afhdl-hamburger${sidebarOpen ? " is-open" : ""}`}
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={sidebarOpen}
          >
            <span className="afhdl-ham-bar" />
            <span className="afhdl-ham-bar" />
            <span className="afhdl-ham-bar" />
          </button>
          <Link to="/" className="afhdl-topbar-link">
            <Home size={15} aria-hidden="true" />
            <span>Home</span>
          </Link>
        </div>

        <div className="afhdl-topbar-center">
          <span className="afhdl-category-pill">
            <span className="afhdl-pill-dot" />
            {topicLabel}
          </span>
        </div>

        <div className="afhdl-topbar-right">
          <button
            className="afhdl-theme-btn"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <div
            className="afhdl-progress-ring-wrap"
            title={`${readCount} of ${chapterPages.length} completed`}
          >
            <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="rgba(99,102,241,0.2)"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#818cf8"
                strokeWidth="3"
                strokeDasharray={`${progressDash} 100`}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
                style={{ transition: "stroke-dasharray 0.4s ease" }}
              />
            </svg>
            <span className="afhdl-progress-text">
              {readCount}/{chapterPages.length}
            </span>
          </div>
        </div>
      </header>

      <div className="afhdl-body">
        {sidebarOpen ? (
          <div
            className="afhdl-overlay"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        ) : null}

        <aside
          className={`afhdl-sidebar${sidebarOpen ? " is-open" : ""}`}
          aria-label={`${topicLabel} learning path`}
        >
          <div className="afhdl-sidebar-inner">
            <div className="afhdl-sidebar-card">
              <p className="afhdl-sidebar-kicker">Learning Path</p>
              <h2 className="afhdl-sidebar-title">{sidebarTitle}</h2>
              <p className="afhdl-sidebar-copy">{sidebarCopy}</p>
              <div className="afhdl-sidebar-progress-bar">
                <div
                  className="afhdl-sidebar-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="afhdl-sidebar-progress-label">
                {progress}% {progressVerb}
              </span>
            </div>

            <nav className="afhdl-sidebar-nav">
              {navPages.map((page, index) => {
                const done = pageDone(index, page);
                const active = isSidebarItemActive
                  ? isSidebarItemActive(page, location)
                  : page.path.split("#")[0] === currentPath &&
                    (!page.path.includes("#") ||
                      location.hash === page.path.slice(page.path.indexOf("#")));
                return (
                  <NavLink
                    key={page.path}
                    to={page.path}
                    className={() =>
                      `afhdl-nav-item${active ? " is-active" : ""}${done ? " is-visited" : ""}`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="afhdl-nav-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="afhdl-nav-copy">
                      <span className="afhdl-nav-label">{page.label}</span>
                      <span className="afhdl-nav-description">
                        {page.description}
                      </span>
                    </span>
                    <span className="afhdl-nav-status">
                      {done ? (
                        <span className="afhdl-nav-check" title="Completed">
                          ✓
                        </span>
                      ) : null}
                    </span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="afhdl-sidebar-footer">
              <Link to={sidebarFooterLink} className="afhdl-sidebar-home-btn">
                {sidebarFooterLabel}
              </Link>
            </div>
          </div>
        </aside>

        <main className="afhdl-main">
          <nav className="afhdl-breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="afhdl-bc-link">
              Home
            </Link>
            <span className="afhdl-bc-sep">›</span>
            <span className="afhdl-bc-mid">{topicLabel}</span>
            <span className="afhdl-bc-sep">›</span>
            <span className="afhdl-bc-current">{title}</span>
          </nav>

          <section className="afhdl-hero">
            <div className="afhdl-hero-badge">
              <span className="afhdl-hero-badge-label">
                {isOverview ? "Overview" : "Chapter"}
              </span>
              <strong className="afhdl-hero-badge-num">
                {isOverview ? "·" : safeIndex + 1}
              </strong>
            </div>
            <p className="afhdl-hero-kicker">{heroKicker || topicLabel}</p>
            <h1 className="afhdl-hero-title">{title}</h1>
            {subtitle ? <p className="afhdl-hero-subtitle">{subtitle}</p> : null}
            {intro ? <p className="afhdl-hero-intro">{intro}</p> : null}

            {highlights.length > 0 ? (
              <div className="afhdl-hero-highlights">
                {highlights.map((item) => (
                  <div key={item.title} className="afhdl-hero-highlight">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="afhdl-chapter-dots">
              {chapterPages.map((page, index) => (
                <Link
                  key={page.path}
                  to={page.path}
                  className={`afhdl-dot${index === dotActiveIndex ? " active" : ""}${pageDone(index, page) ? " done" : ""}`}
                  title={page.label}
                />
              ))}
            </div>
          </section>

          <div className="afhdl-content premium-topic-content">{children}</div>

          <RelatedSeoLinks />

          <footer className="afhdl-footer-nav">
            {prev ? (
              <NavLink to={prev.path} className="afhdl-footer-link">
                <span className="afhdl-footer-arrow">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M13 5l-5 5 5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>
                  <span className="afhdl-footer-label">Previous</span>
                  <span className="afhdl-footer-title">{prev.label}</span>
                </span>
              </NavLink>
            ) : (
              <div />
            )}

            <div className="afhdl-footer-right">
              {tracking && subtopicId ? (
                <button
                  className={`afhdl-mark-read-btn${isRead ? " is-read" : ""}`}
                  onClick={toggleCompletion}
                  aria-pressed={isRead}
                  aria-label={isRead ? "Mark as unread" : "Mark as read"}
                >
                  <CheckCircleIcon />
                  <span>{isRead ? "Marked as Read" : "Mark as Read"}</span>
                </button>
              ) : null}

              {next ? (
                <NavLink
                  to={next.path}
                  className="afhdl-footer-link afhdl-footer-link-next"
                >
                  <span>
                    <span className="afhdl-footer-label">Next</span>
                    <span className="afhdl-footer-title">{next.label}</span>
                  </span>
                  <span className="afhdl-footer-arrow afhdl-footer-arrow-next">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 5l5 5-5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </NavLink>
              ) : (
                <Link to="/" className="afhdl-footer-link afhdl-footer-link-next">
                  <span>
                    <span className="afhdl-footer-label">All done!</span>
                    <span className="afhdl-footer-title">Return to Home</span>
                  </span>
                  <span className="afhdl-footer-arrow afhdl-footer-arrow-next">
                    <Home size={16} aria-hidden="true" />
                  </span>
                </Link>
              )}
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default PremiumLearningShell;
