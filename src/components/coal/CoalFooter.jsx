import { Link } from "react-router-dom";
import { BookOpen, Cpu } from "lucide-react";
import { coalCourseParts } from "../../data/coalCourseOutline";
import { getAllCoalModules, getCoalTopicPath } from "../../utils/coalCourseUtils";

const RELATED_TOOLS = [
  { label: "Number Systems", to: "/number-systems/calculator" },
  { label: "Boolean Algebra", to: "/boolean/overview" },
  { label: "Circuit Forge", to: "/boolforge" },
  { label: "K-Map Studio", to: "/kmapgenerator" },
];

const LEARN_LINKS = [
  { label: "Learning Resources", to: "/resources" },
  { label: "Sequential Circuits", to: "/sequential/intro" },
  { label: "Registers & Transfers", to: "/registers/intro" },
  { label: "Arithmetic Circuits", to: "/arithmetic/binary-adders" },
];

function CoalFooter({ showPartAnchors = true }) {
  const publishedTopics = getAllCoalModules().filter((m) => m.hasContent).slice(0, 6);

  return (
    <footer className="coal-footer">
      <div className="coal-footer__glow" aria-hidden="true" />

      <div className="coal-footer__inner">
        <div className="coal-footer__brand">
          <span className="coal-footer__logo">
            <Cpu size={18} strokeWidth={2.25} />
            Boolforge · COAL
          </span>
          <p className="coal-footer__desc">
            Computer Organization &amp; Assembly Language — structured lessons with
            diagrams, real-life examples, and hands-on tools.
          </p>
          <Link to="/resources/coal" className="coal-footer__course-link">
            <BookOpen size={15} />
            COAL home
          </Link>
          <Link to="/resources/coal/theory" className="coal-footer__course-link coal-footer__course-link--secondary">
            Theory path
          </Link>
        </div>

        <div className="coal-footer__col">
          <h4 className="coal-footer__heading">Course parts</h4>
          <ul className="coal-footer__list">
            {coalCourseParts.map((part) => (
              <li key={part.id}>
                {showPartAnchors ? (
                  <a href={`#coal-part-${part.id}`} className="coal-footer__link">
                    Part {part.part} — {part.title}
                  </a>
                ) : (
                  <Link to={`/resources/coal/theory#coal-part-${part.id}`} className="coal-footer__link">
                    Part {part.part} — {part.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="coal-footer__col">
          <h4 className="coal-footer__heading">Published topics</h4>
          <ul className="coal-footer__list">
            {publishedTopics.map((topic) => (
              <li key={topic.slug}>
                <Link to={getCoalTopicPath(topic.slug)} className="coal-footer__link">
                  {topic.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="coal-footer__col">
          <h4 className="coal-footer__heading">Related tools</h4>
          <ul className="coal-footer__list">
            {RELATED_TOOLS.map(({ label, to }) => (
              <li key={to}>
                <Link to={to} className="coal-footer__link">
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <h4 className="coal-footer__heading coal-footer__heading--spaced">More learning</h4>
          <ul className="coal-footer__list">
            {LEARN_LINKS.map(({ label, to }) => (
              <li key={to}>
                <Link to={to} className="coal-footer__link">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="coal-footer__bottom">
        <p>© {new Date().getFullYear()} Boolforge — Built for learning computer organization.</p>
      </div>
    </footer>
  );
}

export default CoalFooter;
