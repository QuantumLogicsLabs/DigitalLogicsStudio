import React from "react";
import { Helmet } from "react-helmet-async";
import {
  buildAbsoluteUrl,
  buildMetaKeywords,
  buildStructuredData,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  TWITTER_HANDLE,
} from "../../seo/seoUtils";

const SeoHead = ({ pathname, meta }) => {
  const canonicalUrl = buildAbsoluteUrl(pathname);
  const robots = meta.noindex ? "noindex, nofollow" : "index, follow";
  const structuredData = buildStructuredData(pathname, meta);
  const title = meta.title || `${SITE_NAME} | Digital Logic Learning Platform`;
  const description = meta.description;
  const image = meta.ogImage || DEFAULT_OG_IMAGE;
  const keywords = buildMetaKeywords(meta);
  const ogType = pathname === "/" ? "website" : "article";
  const imageAlt = `${meta.title || SITE_NAME} preview image`;
  const googleSiteVerification = process.env.REACT_APP_GOOGLE_SITE_VERIFICATION;
  const bingSiteVerification = process.env.REACT_APP_BING_SITE_VERIFICATION;

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <meta name="author" content={SITE_NAME} />
      <meta name="application-name" content={SITE_NAME} />
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      <meta name="theme-color" content="#020617" />
      <link rel="canonical" href={canonicalUrl} />
      {googleSiteVerification ? (
        <meta
          name="google-site-verification"
          content={googleSiteVerification}
        />
      ) : null}
      {bingSiteVerification ? (
        <meta name="msvalidate.01" content={bingSiteVerification} />
      ) : null}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />
      <meta name="twitter:url" content={canonicalUrl} />

      <meta property="article:publisher" content={SITE_URL} />

      {structuredData.map((entry, index) => (
        <script
          key={`${pathname}-jsonld-${index}`}
          type="application/ld+json"
        >
          {JSON.stringify(entry)}
        </script>
      ))}
    </Helmet>
  );
};

export default SeoHead;
