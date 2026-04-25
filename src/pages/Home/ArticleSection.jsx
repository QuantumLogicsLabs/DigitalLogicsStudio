import React from "react";
import { Link } from "react-router-dom";

const ArticleSection = ({ data }) => {
  return (
    <>
      {data.map((article, index) => (
        <article
          key={index}
          className={`home-card ${
            article.featured ? "featured-card" : ""
          } ${article.className || ""}`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <h3>{article.title}</h3>
          <p>{article.description}</p>

          <div className="home-card-links">
            {article.links.map((link, i) => (
              <Link
                key={i}
                to={link.to}
                className={`home-card-link ${
                  link.primary ? "primary-link" : ""
                }`}
              >
                {link.text}
              </Link>
            ))}
          </div>
        </article>
      ))}
    </>
  );
};

export default ArticleSection;
