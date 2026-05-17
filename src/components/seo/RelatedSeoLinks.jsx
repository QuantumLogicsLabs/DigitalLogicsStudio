import React from "react";
import { Link, useLocation } from "react-router-dom";
import { getSeoMeta, normalizePath } from "../../seo/seoUtils";

const RelatedSeoLinks = ({ title = "Related Topics" }) => {
  const location = useLocation();
  const pathname = normalizePath(location.pathname);
  const meta = React.useMemo(() => getSeoMeta(pathname), [pathname]);

  if (!meta.relatedLinks?.length) {
    return null;
  }

  return (
    <section className="afhdl-section premium-related-links" aria-labelledby="related-topics-heading">
      <div className="afhdl-section-header">
        <p className="afhdl-section-kicker">Discover More</p>
        <h2 className="afhdl-section-title" id="related-topics-heading">
          {title}
        </h2>
        <p className="afhdl-section-description">
          Continue this learning path with connected tutorials, tools, and practice pages.
        </p>
      </div>
      <div className="afhdl-card-group">
        {meta.relatedLinks.map((link) => (
          <Link key={link.to} to={link.to} className="afhdl-card premium-related-link-card">
            <h3 className="afhdl-card-title">{link.label}</h3>
            <p className="afhdl-card-subtitle">Open the linked learning resource</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedSeoLinks;
