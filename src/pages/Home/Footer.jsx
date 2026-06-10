import { Link } from "react-router-dom";

// SVG icon reused from the navbar toggle pattern
function LayoutBottomIcon() {
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
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="15" x2="21" y2="15" />
    </svg>
  );
}

const FOOTER_COLS = [
  {
    heading: "Tools",
    links: [
      { label: "Problems", to: "/problems" },
      { label: "Circuit Forge", to: "/boolforge" },
      { label: "K-Map Studio", to: "/kmapgenerator" },
      { label: "Boolean Algebra", to: "/boolean/overview" },
      { label: "Number Systems", to: "/number-systems/calculator" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { label: "Sequential Circuits", to: "/sequential/intro" },
      { label: "Registers & Transfers", to: "/registers/intro" },
      { label: "Multiplexers", to: "/mux" },
      { label: "Demultiplexers", to: "/demux" },
      { label: "Arithmetic", to: "/arithmetic/binary-adders" },
      { label: "Timing Diagrams", to: "/timing-diagrams" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Book Ch1 Problems", to: "/book" },
      { label: "Book Ch2 Problems", to: "/book/ch2" },
    ],
  },
];

export default function Footer({ onToggleFooter }) {
  return (
    <footer className="home-footer">
      {onToggleFooter && (
        <button
          onClick={onToggleFooter}
          className="home-footer-toggle-btn"
          aria-label="Hide footer"
          title="Hide footer"
        >
          <LayoutBottomIcon />
        </button>
      )}
      <div className="home-footer-inner">
        <div className="home-footer-brand">
          <span className="home-footer-logo">Boolforge</span>
          <p className="home-footer-desc">
            A free, interactive learning platform for digital logic, boolean
            algebra, and circuit design.
          </p>
        </div>

        {FOOTER_COLS.map(({ heading, links }) => (
          <div key={heading} className="home-footer-col">
            <h4 className="home-footer-col-heading">{heading}</h4>
            <ul className="home-footer-col-list">
              {links.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="home-footer-col-link">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="home-footer-bottom">
        <p>
          © {new Date().getFullYear()} Boolforge — Built for learning digital
          logic.
        </p>
      </div>
    </footer>
  );
}
