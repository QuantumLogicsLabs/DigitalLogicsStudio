import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <>
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
            <Link to="/sequential/intro" className="home-nav-link">
              Sequential
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
