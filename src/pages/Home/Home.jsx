import React from "react";
import { Navbar } from "./Navbar";
import HeroSection from "./HeroSection";
import Footer from "./Footer";
import ArticleSection from "./ArticleSection";
import homeData from "./HomeData";
import { useTheme } from "../../context/ThemeContext";
import "./Home.css";

const topicGroupOrder = {
  algebra: 1,
  circuits: 2,
  advanced: 3,
};

const Home = () => {
  const { theme, toggle: toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = React.useState("");
  const resultsRef = React.useRef(null);
  const handleHomeClick = React.useCallback(() => {
    setSearchTerm("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const filteredData = homeData.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.links.some(link => link.text.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const featuredTools = filteredData
    .filter((item) => item.section === "featured")
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const topicCards = filteredData
    .filter((item) => item.section === "topics")
    .sort((a, b) => {
      const groupDiff =
        (topicGroupOrder[a.topicGroup] || 99) -
        (topicGroupOrder[b.topicGroup] || 99);

      if (groupDiff !== 0) {
        return groupDiff;
      }

      return (a.topicOrder || 0) - (b.topicOrder || 0);
    });

  const learningResources = filteredData
    .filter((item) => item.section === "resources")
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return (
    <div className="home-page">
      <div className="grid-background" />
      <Navbar
        toggleTheme={toggleTheme}
        theme={theme}
        onHomeClick={handleHomeClick}
      />

      <main className="home-main">
        <HeroSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearchSubmit={handleSearchSubmit}
        />

        <div className="home-sections" ref={resultsRef}>
          {filteredData.length > 0 ? (
            <>
              <ArticleSection
                title="Featured Tools"
                description="Start with the most-used interactive tools for building, visualizing, and simplifying logic quickly."
                data={featuredTools}
                sectionClassName="home-featured-section"
                gridClassName="home-featured-grid"
              />
              <ArticleSection
                title="Core Logic Topics"
                description="Browse the main learning and problem-solving modules in a clear progression from algebraic foundations to circuit design and advanced logic."
                data={topicCards}
                sectionClassName="home-topic-section"
              />
              <ArticleSection
                title="Learning Resources"
                description="Use these supporting resources for practice, reference, and timing-based visualization."
                data={learningResources}
                sectionClassName="home-resource-section"
                gridClassName="home-resource-grid"
              />
            </>
          ) : (
            <div className="no-results" style={{
              textAlign: 'center',
              padding: '4rem',
              color: 'var(--secondary-text)',
              background: 'var(--card-bg)',
              borderRadius: '1rem',
              border: '1px dashed var(--border-color)'
            }}>
              <p style={{ fontSize: '1.2rem' }}>🔍 No tools found matching "<strong>{searchTerm}</strong>"</p>
              <button 
                onClick={() => setSearchTerm("")}
                style={{
                  marginTop: '1rem',
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-color)',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >Clear search</button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
