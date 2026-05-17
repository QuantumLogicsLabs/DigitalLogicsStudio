import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { normalizePath } from "../../seo/seoUtils";

const RouteNormalizer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const normalizedPath = normalizePath(location.pathname);
    if (normalizedPath !== location.pathname) {
      navigate(`${normalizedPath}${location.search}${location.hash}`, {
        replace: true,
      });
    }
  }, [location.hash, location.pathname, location.search, navigate]);

  return null;
};

export default RouteNormalizer;
