import React from "react";
import { Navbar } from "./Navbar";
import HeroSection from "./HeroSection";
import Footer from "./Footer";
import ArticleSection from "./ArticleSection";
import homeData from "./HomeData";

const Home = () => {
  return (
    <div className="home-page calculator-container">
      <div className="grid-background" />

      <Navbar />

      <main className="home-main">
        <HeroSection />

        <section className="home-grid">
          <ArticleSection data={homeData} />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
