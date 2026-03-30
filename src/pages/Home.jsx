import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-page calculator-container">
      <div className="grid-background" />
      <header className="home-header">
        <div className="home-header-inner">
          <div className="home-brand">
            <span className="home-logo">𝔅</span>
            <div>
              <h1 className="home-title">Boolforge</h1>
              <p className="home-tagline">Your digital logic playground</p>
            </div>
          </div>

          <nav className="home-nav">
            <Link to="/boolforge" className="home-nav-link">
              Circuit Forge
            </Link>
            <Link to="/gates" className="home-nav-link">
              Gates
            </Link>
            <Link to="/timing-diagrams" className="home-nav-link">
              Timing
            </Link>
            <Link to="/numbersystemcalculator" className="home-nav-link">
              Number Calculator
            </Link>
            <Link to="/numberconversation" className="home-nav-link">
              Base Converter
            </Link>
            <Link to="/binaryrepresentation" className="home-nav-link">
              Binary Visualizer
            </Link>
            <Link to="/significant-digits" className="home-nav-link">
              Significant Digits
            </Link>
            <Link to="/bcd-notation" className="home-nav-link">
              BCD
            </Link>
            <Link to="/ascii-notation" className="home-nav-link">
              ASCII
            </Link>
            <Link to="/bit-extension" className="home-nav-link">
              Bit Extension
            </Link>
            <Link to="/kmapgenerator" className="home-nav-link">
              K‑Map Studio
            </Link>
            <Link to="/encoder" className="home-nav-link">
              Encoder
            </Link>
            <Link to="/decoder" className="home-nav-link">
              Decoder
            </Link>
            <Link to="/book" className="home-nav-link">
              Book Ch1
            </Link>
            <Link to="/book/ch2" className="home-nav-link">
              Book Ch2
            </Link>
          </nav>
        </div>
      </header>

      <main className="home-main">
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

        <section className="home-grid">
          {/* Core Tools - Most Important */}
          <article className="home-card featured-card">
            <h3>🔧 Circuit Forge</h3>
            <p>
              Drag‑and‑drop logic gates, connect wires, and instantly see truth
              tables and outputs.
            </p>
            <Link to="/boolforge" className="home-card-link primary-link">
              Open Circuit Forge →
            </Link>
          </article>

          <article className="home-card featured-card">
            <h3>🗺️ K‑Map Generator</h3>
            <p>
              Generate and simplify boolean expressions visually using
              interactive Karnaugh maps with SOP/POS optimization.
            </p>
            <Link to="/kmapgenerator" className="home-card-link primary-link">
              Go to K‑Maps →
            </Link>
          </article>

          {/* Boolean Algebra Section */}
          <article className="home-card">
            <h3>📐 Boolean Algebra</h3>
            <p>
              Master the foundations of digital logic with interactive tools for
              identities, laws, and expressions.
            </p>
            <div className="home-card-links">
              <Link to="/boolean-algebra" className="home-card-link">
                Overview
              </Link>
              <Link to="/boolean-identities" className="home-card-link">
                Identities
              </Link>
              <Link to="/boolean-laws" className="home-card-link">
                Laws
              </Link>
              <Link to="/duality-principle" className="home-card-link">
                Duality
              </Link>
              <Link to="/consensus-theorem" className="home-card-link">
                Consensus
              </Link>
              <Link to="/complement" className="home-card-link">
                Complement
              </Link>
              <Link to="/standard-forms" className="home-card-link">
                SOP & POS
              </Link>
              <Link to="/minterms" className="home-card-link">
                Minterms
              </Link>
              <Link to="/maxterms" className="home-card-link">
                Maxterms
              </Link>
              <Link to="/minterms-maxterms" className="home-card-link">
                Relation
              </Link>
            </div>
          </article>

          {/* Advanced Logic Section */}
          <article className="home-card">
            <h3>⚡ Advanced Logic</h3>
            <p>
              Explore circuit optimization, universal gates, and special
              functions for deeper understanding.
            </p>
            <div className="home-card-links">
              <Link to="/circuit-cost" className="home-card-link">
                Circuit Cost
              </Link>
              <Link to="/universal-gates" className="home-card-link">
                Universal Gates
              </Link>
              <Link to="/odd-function" className="home-card-link">
                Odd Function
              </Link>
              <Link to="/gates" className="home-card-link">
                Gate Explanations
              </Link>
            </div>
          </article>

          {/* Combinational Circuits Section — NEW */}
          <article className="home-card">
            <h3>🔀 Combinational Circuits</h3>
            <p>
              Explore encoders and decoders — the core combinational building
              blocks used in memory systems, displays, keyboards, and interrupt
              controllers.
            </p>
            <div className="home-card-links">
              <Link to="/encoder" className="home-card-link">
                Encoder
              </Link>
              <Link to="/decoder" className="home-card-link">
                Decoder
              </Link>
            </div>
          </article>

          {/* Number Systems Section */}
          <article className="home-card">
            <h3>🔢 Number Systems</h3>
            <p>
              Convert between bases and run detailed step‑by‑step operations
              across different number systems.
            </p>
            <div className="home-card-links">
              <Link to="/numbersystemcalculator" className="home-card-link">
                System Calculator
              </Link>
              <Link to="/numberconversation" className="home-card-link">
                Base Converter
              </Link>
              <Link to="/binaryrepresentation" className="home-card-link">
                Binary Visualizer
              </Link>
              <Link to="/bcd-notation" className="home-card-link">
                BCD Notation
              </Link>
              <Link to="/ascii-notation" className="home-card-link">
                ASCII Codes
              </Link>
            </div>
          </article>

          {/* Binary Operations Section */}
          <article className="home-card">
            <h3>➕ ARITHMETIC FUNCTIONS AND HDLs</h3>
            <p>
              Dedicated interactive modules for arithmetic logic design and
              number operations.
            </p>
            <div className="home-card-links">
              <Link to="/arithmetic/binary-adders" className="home-card-link">
                Binary Adders
              </Link>
              <Link
                to="/arithmetic/binary-subtractor"
                className="home-card-link"
              >
                Binary Subtractor
              </Link>
              <Link
                to="/arithmetic/binary-add-subtractor"
                className="home-card-link"
              >
                Adder/Subtractor
              </Link>
              <Link
                to="/arithmetic/binary-multipliers"
                className="home-card-link"
              >
                Binary Multipliers
              </Link>
              <Link to="/arithmetic/code-conversion" className="home-card-link">
                Code Conversion
              </Link>
              <Link
                to="/arithmetic/magnitude-comparator"
                className="home-card-link"
              >
                Magnitude Comparator
              </Link>
              <Link
                to="/arithmetic/parity-generators"
                className="home-card-link"
              >
                Parity Generators
              </Link>
              <Link
                to="/arithmetic/design-applications"
                className="home-card-link"
              >
                Design Applications
              </Link>
              <Link to="/arithmetic/complements" className="home-card-link">
                1's and 2's Complements
              </Link>
              <Link to="/arithmetic/signed-unsigned" className="home-card-link">
                Signed/Unsigned Arithmetic
              </Link>
            </div>
          </article>

          {/* Additional Tools */}
          <article className="home-card">
            <h3>📚 Learning Resources</h3>
            <p>
              Access curated problems and additional tools to enhance your
              digital logic learning.
            </p>
            <div className="home-card-links">
              <Link to="/book" className="home-card-link">
                Book Ch1 Problems
              </Link>
              <Link to="/book/ch2" className="home-card-link">
                Book Ch2 Problems
              </Link>
              <Link to="/timing-diagrams" className="home-card-link">
                Timing Diagrams
              </Link>
            </div>
          </article>
        </section>
      </main>

      <footer className="home-footer">
        <p>
          © {new Date().getFullYear()} Boolforge. Built for learning digital
          logic.
        </p>
      </footer>
    </div>
  );
};

export default Home;
