import React from "react";
import { Link } from "react-router-dom";

const ArticleSection = ({
  title,
  description,
  data,
  sectionClassName = "",
  gridClassName = "",
}) => {
  const sectionRef = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const sectionElement = sectionRef.current;

    if (!sectionElement) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -48px 0px",
      }
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, []);

  if (!data.length) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className={`home-section ${sectionClassName} ${
        isVisible ? "is-visible" : ""
      }`.trim()}
    >
      <div className="home-section-header">
        <h2 className="home-section-title">{title}</h2>
        <p className="home-section-description">{description}</p>
      </div>

      <div className={`home-section-grid ${gridClassName}`.trim()}>
        {data.map((article, index) => (
          <article
            key={article.title}
            className={`home-card ${
              article.featured ? "feature-card" : ""
            } ${article.className || ""}`.trim()}
            style={{ "--card-delay": `${index * 90}ms` }}
          >
            <div className="home-card-copy">
              <h3 className="home-card-title">{article.title}</h3>
              <p className="home-card-description">{article.description}</p>
            </div>

            <div className="home-card-links">
              {article.links.map((link) => (
                <Link
                  key={`${article.title}-${link.to}`}
                  to={link.to}
                  className={`home-card-link ${
                    link.primary ? "primary-link" : ""
                  }`.trim()}
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ArticleSection;
