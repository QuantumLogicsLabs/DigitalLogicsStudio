import React from "react";
import { useLocation } from "react-router-dom";
import { getSeoMeta, normalizePath } from "../../seo/seoUtils";
import { initAnalytics, trackPageView } from "../../utils/analytics";
import { isPrerendering } from "../../utils/prerender";

const AnalyticsTracker = () => {
  const location = useLocation();

  React.useEffect(() => {
    if (isPrerendering()) return;
    initAnalytics();
  }, []);

  React.useEffect(() => {
    if (isPrerendering()) return;
    const pathname = normalizePath(location.pathname);
    const meta = getSeoMeta(pathname);
    trackPageView({ path: pathname, title: meta.title });
  }, [location.pathname]);

  return null;
};

export default AnalyticsTracker;
