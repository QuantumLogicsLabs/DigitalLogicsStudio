import React from "react";
import { useLocation } from "react-router-dom";
import SeoHead from "./SeoHead";
import { getSeoMeta, normalizePath } from "../../seo/seoUtils";

const RouteSeoManager = () => {
  const location = useLocation();
  const pathname = normalizePath(location.pathname);
  const meta = React.useMemo(() => getSeoMeta(pathname), [pathname]);

  return <SeoHead pathname={pathname} meta={meta} />;
};

export default RouteSeoManager;
