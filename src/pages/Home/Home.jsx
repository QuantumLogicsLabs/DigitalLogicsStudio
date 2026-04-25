import React from "react";
import { Navbar } from "./Navbar";
import HeroSection from "./HeroSection";
import Footer from "./Footer";
import ArticleSection from "./ArticleSection";
import homeData from "./HomeData";
import "./Home.css";

const Home = ({ toggleTheme, theme }) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredData = homeData.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.links.some(link => link.text.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="home-page">
      <div className="grid-background" />
      <Navbar toggleTheme={toggleTheme} theme={theme} />

      <main className="home-main">
        <HeroSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <section className="home-grid">
          {filteredData.length > 0 ? (
            <ArticleSection data={filteredData} />
          ) : (
            <div className="no-results" style={{
              gridColumn: '1 / -1',
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
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
