import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Clock3, Search, Sparkles } from "lucide-react";
import { Navbar } from "./Navbar";
import HeroSection from "./HeroSection";
import Footer from "./Footer";
import FeaturedToolsSection from "./FeaturedToolsSection";
import homeData from "./HomeData";
import { useTheme } from "../../context/ThemeContext";
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

  const coalResources = [
    {
      title: "COAL Resources",
      description: "Beginner-friendly practice paths and concept guides for COAL topics.",
      badge: "Study track",
    },
    {
      title: "Timing Diagrams",
      description: "Visualize clocked transitions and sequential behavior with a cleaner learning lens.",
      badge: "Visual aid",
    },
    {
      title: "COAL Practice",
      description: "Practice problems and quick drills to lock in the basics.",
      badge: "Practice",
    },
  ];

  const dldResources = [
    {
      title: "DLD Resources",
      description: "Structured lessons and concept guides for digital logic design.",
      badge: "Track",
    },
    {
      title: "Circuit Tools",
      description: "Key tools for Boolean simplification, timing diagrams, and circuits.",
      badge: "Tools",
    },
    {
      title: "Practice Paths",
      description: "Focused exercises to bridge theory with applied design.",
      badge: "Practice",
    },
  ];

  const renderRecommendedResourceMarquee = (resources) => (
    <div className="recommended-resource-marquee" aria-label="Recommended resource carousel">
      <div className="recommended-resource-marquee-track">
        {resources.concat(resources).map((resource, index) => (
          <div key={`${resource.title}-${index}`} className="recommended-resource-pill">
            <span>{resource.badge}</span>
            <strong>{resource.title}</strong>
          </div>
        ))}
      </div>
    </div>
  );

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
              <FeaturedToolsSection data={featuredTools} />

              <section className="home-section home-recommended-section is-visible">
                <div className="home-section-header">
                  <h2 className="home-section-title home-section-title--single-line">Recommended Courses</h2>
                  <p className="home-section-description">
                    A cleaner study experience with guided COAL resources, a full DLD learning path, and a polished intro to Boolforge.
                  </p>
                </div>

                <div className="recommended-courses-grid">
                  <Link to="/resources/coal" className="recommended-course-card recommended-course-card--coal recommended-course-card--link">
                    <div className="recommended-course-card__top">
                      <span className="recommended-course-chip">COAL</span>
                      <span className="recommended-course-badge">Resources</span>
                    </div>
                    <h3>Build confidence with focused COAL practice</h3>
                    <p>
                      Explore beginner-friendly resources, concept refreshers, and visual practice that help you move from fundamentals to fluency.
                    </p>
                    {renderRecommendedResourceMarquee(coalResources)}
                  </Link>

                  <Link to="/resources/dld" className="recommended-course-card recommended-course-card--dld recommended-course-card--link">
                    <div className="recommended-course-card__top">
                      <span className="recommended-course-chip">DLD</span>
                      <span className="recommended-course-badge">Resources</span>
                    </div>
                    <h3>Find everything you need for DLD resources</h3>
                    <p>
                      Clean and compact course entry with focused DLD sections, leaving the detailed topics for the DLD page itself.
                    </p>
                    {renderRecommendedResourceMarquee(dldResources)}
                  </Link>
                </div>

                <div className="boolforge-spotlight">
                  <div className="boolforge-spotlight__content">
                    <div className="boolforge-spotlight__icon">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <span className="recommended-course-chip">Boolforge</span>
                      <h3>Design, simplify, and explore logic with clarity</h3>
                      <p>
                        Boolforge turns abstract digital logic into interactive visual practice. Build circuits, test expressions, and understand behavior in real time without the usual clutter.
                      </p>
                    </div>
                  </div>
                  <Link to="/boolforge" className="boolforge-spotlight__cta">
                    Open Boolforge <ArrowRight size={16} />
                  </Link>
                </div>
              </section>

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
                        icon: "BookOpen",
                        label: "Track",
                        title: "DLD Resources",
                        desc: "A structured study path for digital logic design with beginner-friendly practice and concept guides.",
                        to: "/resources/dld",
                        accent: "#3b82f6",
                        tag: "DLD",
                      },
                      {
                        icon: "BookOpen",
                        label: "Track",
                        title: "COAL Resources",
                        desc: "A fresh beginner collection for COAL language concepts, basic instructions, and guided practice.",
                        to: "/resources/coal",
                        accent: "#8b5cf6",
                        tag: "COAL",
                      },
                      {
                        icon: "Clock3",
                        label: "Visualization",
                        title: "Timing Diagrams",
                        desc: "Visualize signal transitions and clock-driven behavior in sequential circuits.",
                        to: "/timing-diagrams",
                        accent: "#10b981",
                        tag: "Visual Tool",
                      },
                    ].map((res) => {
                      const Icon = res.icon === "Clock3" ? Clock3 : BookOpen;
                      return (
                        <Link key={res.to} to={res.to} className="home-res-card">
                          <div className="home-res-card-glow" style={{ background: res.accent }} />
                          <div className="home-res-card-top">
                            <span className="home-res-card-icon">
                              <Icon size={24} />
                            </span>
                            <span className="home-res-card-tag" style={{ color: res.accent, borderColor: `${res.accent}40`, background: `${res.accent}12` }}>
                              {res.tag}
                            </span>
                          </div>
                          <div className="home-res-card-label">{res.label}</div>
                          <h3 className="home-res-card-title">{res.title}</h3>
                          <p className="home-res-card-desc">{res.desc}</p>
                          <div className="home-res-card-cta" style={{ color: res.accent }}>
                            Open resource <ArrowRight size={16} />
                          </div>
                          <div className="home-res-card-bar" style={{ background: res.accent }} />
                        </Link>
                      );
                    })}
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
              <p style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                <Search size={18} /> No tools found matching "<strong>{searchTerm}</strong>"
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
