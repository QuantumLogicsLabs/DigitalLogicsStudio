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
                description="Hands-on interactive tools to build circuits, simplify logic, and visualize boolean expressions."
                data={featuredTools}
                sectionClassName="home-featured-section"
                gridClassName="home-featured-grid home-featured-box"
              />
              {filteredTopics.length > 0 ? <CoreTopicsSection topics={filteredTopics} /> : null}

              {/* ── Learning Resources ── */}
              {learningResources.length > 0 && (
                <section className="home-section home-resources-section is-visible">
                  <div className="home-section-header">
                    <h2 className="home-section-title">Learning Resources</h2>
                    <p className="home-section-description">
                      Structured practice sets and visual aids to reinforce your understanding of digital logic concepts.
                    </p>
                  </div>
                  <div className="home-resources-grid home-featured-box">
                    {[
                      {
                        icon: "📖",
                        label: "Chapter 1",
                        title: "Book Ch1 Problems",
                        desc: "Foundational problems covering number systems, Boolean algebra, and logic gates.",
                        to: "/book",
                        accent: "#3b82f6",
                        tag: "Beginner",
                      },
                      {
                        icon: "📗",
                        label: "Chapter 2",
                        title: "Book Ch2 Problems",
                        desc: "Intermediate problems on combinational circuits, K-maps, and simplification.",
                        to: "/book/ch2",
                        accent: "#8b5cf6",
                        tag: "Intermediate",
                      },
                      {
                        icon: "⏱️",
                        label: "Visualization",
                        title: "Timing Diagrams",
                        desc: "Visualize signal transitions and clock-driven behavior in sequential circuits.",
                        to: "/timing-diagrams",
                        accent: "#10b981",
                        tag: "Visual Tool",
                      },
                    ].map((res) => (
                      <Link key={res.to} to={res.to} className="home-res-card">
                        <div className="home-res-card-glow" style={{ background: res.accent }} />
                        <div className="home-res-card-top">
                          <span className="home-res-card-icon">{res.icon}</span>
                          <span className="home-res-card-tag" style={{ color: res.accent, borderColor: `${res.accent}40`, background: `${res.accent}12` }}>
                            {res.tag}
                          </span>
                        </div>
                        <div className="home-res-card-label">{res.label}</div>
                        <h3 className="home-res-card-title">{res.title}</h3>
                        <p className="home-res-card-desc">{res.desc}</p>
                        <div className="home-res-card-cta" style={{ color: res.accent }}>
                          Open resource <span className="home-res-card-arrow">→</span>
                        </div>
                        <div className="home-res-card-bar" style={{ background: res.accent }} />
                      </Link>
                    ))}
                  </div>
                </section>
              )}
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
