import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="home-hero" id="top">
      <div className="home-hero-content">
        <h2>Explore, visualize and master digital logic.</h2>
        <p>
          Jump into interactive tools for circuits, Karnaugh maps, number
          systems, and binary arithmetic — all in one smooth experience.
        </p>
        <div className="home-hero-actions">
          <Link to="/boolforge" className="home-primary-btn">
            Start Building Circuits
          </Link>
          <Link to="/numbersystemcalculator" className="home-secondary-btn">
            Try Number Calculator
          </Link>
        </div>
      </div>
    </section>
  );
}
