import { Link } from "react-router-dom";

const FOOTER_COLS = [
  {
    heading: "Tools",
    links: [
      { label: "Circuit Forge", to: "/boolforge" },
      { label: "K-Map Studio", to: "/kmapgenerator" },
      { label: "Boolean Algebra", to: "/boolean-algebra" },
      { label: "Number Systems", to: "/numbersystemcalculator" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { label: "Sequential Circuits", to: "/sequential/intro" },
      { label: "Registers & Transfers", to: "/registers/intro" }, // ← NEW
      { label: "Logic Gates", to: "/gates" },
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

export default function Footer() {
  return (
    <footer className="home-footer">
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
