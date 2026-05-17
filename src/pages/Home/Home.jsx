import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import HeroSection from "./HeroSection";
import Footer from "./Footer";
import ArticleSection from "./ArticleSection";
import homeData from "./HomeData";
import { useTheme } from "../../context/ThemeContext";
import CoreTopicsSection from "../../components/topics/CoreTopicsSection";
import coreTopics from "../../data/coreTopics";
import { buildSearchIndex, searchIndexedItems } from "../../utils/search";
import "./Home.css";

const Home = () => {
  const { theme, toggle: toggleTheme } = useTheme();
  const [authAlert, setAuthAlert] = React.useState("");
  const resultsRef = React.useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const initialQuery = React.useMemo(
    () => new URLSearchParams(location.search).get("q") || "",
    [location.search],
  );
  const [searchTerm, setSearchTerm] = React.useState(initialQuery);
  const deferredSearchTerm = React.useDeferredValue(searchTerm);
  const indexedHomeData = React.useMemo(
    () => homeData.map((item) => buildSearchIndex(item)),
    [],
  );

  React.useEffect(() => {
    setSearchTerm(initialQuery);
  }, [initialQuery]);

  React.useEffect(() => {
    const incomingMessage = location.state?.authMessage;

    if (!incomingMessage) {
      return;
    }

    setAuthAlert(incomingMessage);
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.pathname, location.state, navigate]);

  React.useEffect(() => {
    if (!authAlert) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setAuthAlert("");
    }, 4500);

    return () => window.clearTimeout(timerId);
  }, [authAlert]);

  const handleHomeClick = React.useCallback(() => {
    setSearchTerm("");
    setAuthAlert("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const filteredData = React.useMemo(
    () => searchIndexedItems(indexedHomeData, deferredSearchTerm),
    [deferredSearchTerm, indexedHomeData],
  );

  const filteredTopics = React.useMemo(() => {
    const query = deferredSearchTerm.trim().toLowerCase();

    if (!query) {
      return coreTopics;
    }

    return coreTopics.filter((topic) => {
      const haystack = [
        topic.title,
        topic.description,
        topic.eyebrow,
        topic.progressLabel,
        ...topic.links.map((link) => link.text),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [deferredSearchTerm]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const nextSearch = searchTerm.trim()
      ? `?q=${encodeURIComponent(searchTerm.trim())}`
      : "";
    navigate({ pathname: "/", search: nextSearch }, { replace: true });
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const featuredTools = filteredData
    .filter((item) => item.section === "featured")
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const learningResources = filteredData
    .filter((item) => item.section === "resources")
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const hasResults =
    featuredTools.length > 0 ||
    filteredTopics.length > 0 ||
    learningResources.length > 0;

  return (
    <div className="home-page">
      <div className="grid-background" />
      <Navbar
        toggleTheme={toggleTheme}
        theme={theme}
        onHomeClick={handleHomeClick}
      />

      <main className="home-main">
        {authAlert ? (
          <div className="home-auth-alert-wrap">
            <div className="home-auth-alert" role="status" aria-live="polite">
              <span>{authAlert}</span>
              <button
                type="button"
                className="home-auth-alert-close"
                onClick={() => setAuthAlert("")}
                aria-label="Dismiss login alert"
              >
                x
              </button>
            </div>
          </div>
        ) : null}

        <HeroSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearchSubmit={handleSearchSubmit}
        />

        <div className="home-sections" ref={resultsRef}>
          {hasResults ? (
            <>
              <ArticleSection
                title="Featured Tools"
                description="Start with the most-used interactive tools for building, visualizing, and simplifying logic quickly."
                data={featuredTools}
                sectionClassName="home-featured-section"
                gridClassName="home-featured-grid"
              />
              {filteredTopics.length > 0 ? <CoreTopicsSection topics={filteredTopics} /> : null}
              <ArticleSection
                title="Learning Resources"
                description="Use these supporting resources for practice, reference, and timing-based visualization."
                data={learningResources}
                sectionClassName="home-resource-section"
                gridClassName="home-resource-grid"
              />
              <section className="home-section home-problems-cta">
                <div className="home-problems-cta-copy">
                  <span className="home-problems-cta-badge">Dedicated Practice Arena</span>
                  <h2 className="home-section-title">
                    Solve digital logic problems in a real practice workspace.
                  </h2>
                  <p className="home-section-description">
                    Move into the new three-column Problems experience with topic filters,
                    search, solved tracking, calendar activity, and learner stats inspired by
                    premium competitive-learning platforms.
                  </p>
                </div>
                <div className="home-problems-cta-actions">
                  <Link to="/problems" className="home-problems-cta-link primary">
                    Open Problems
                  </Link>
                  <Link to="/boolforge" className="home-problems-cta-link">
                    Open Circuit Forge
                  </Link>
                </div>
              </section>
            </>
          ) : (
            <div
              className="no-results"
              style={{
                textAlign: "center",
                padding: "4rem",
                color: "var(--secondary-text)",
                background: "var(--card-bg)",
                borderRadius: "1rem",
                border: "1px dashed var(--border-color)",
              }}
            >
              <p style={{ fontSize: "1.2rem" }}>
                🔍 No tools found matching "<strong>{searchTerm}</strong>"
              </p>
              <button
                onClick={() => setSearchTerm("")}
                style={{
                  marginTop: "1rem",
                  background: "none",
                  border: "none",
                  color: "var(--accent-color)",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
