# Boolforge SEO Architecture

## Overview

Boolforge now uses a shared SEO architecture that keeps the existing CRA + React Router + Express + MongoDB stack while improving crawlability, metadata quality, structured data coverage, and pre-render readiness.

## Core pieces

- `src/seo/seoCatalog.mjs`
  Single source of truth for canonical routes, titles, descriptions, keywords, schema type, and internal link clusters.
- `src/seo/seoUtils.js`
  Canonical path normalization, metadata resolution, JSON-LD generation, sitemap route extraction, and breadcrumb helpers.
- `src/components/seo/SeoHead.jsx`
  Reusable `react-helmet-async` head manager for titles, descriptions, canonicals, Open Graph tags, Twitter cards, robots rules, and structured data.
- `src/components/seo/RouteSeoManager.jsx`
  Route-level metadata orchestration.
- `src/components/seo/RouteNormalizer.jsx`
  Lowercase and trailing-slash normalization for canonical consistency.
- `src/components/seo/AnalyticsTracker.jsx`
  GA4 page-view tracking tied to route changes.
- `scripts/generateSeoAssets.js`
  Build-time generator for `public/sitemap.xml`, `public/robots.txt`, and the pre-render route list.

## Pre-rendering

The build uses a deterministic `postbuild` prerender step driven by `react-snap-routes.json` and `scripts/runReactSnap.js`. The runner serves the CRA build locally, renders each canonical route with Puppeteer using a `ReactSnap` user agent, and writes static HTML snapshots back into `build/`.

Prerendering is required by default, including on Vercel. Set `PRERENDER_REQUIRED=false` only for an intentional emergency deploy where serving the JavaScript shell is acceptable.

The app uses hydration-safe bootstrapping in `src/index.js`:

- `hydrateRoot()` when pre-rendered HTML already exists
- `createRoot()` for normal client-side rendering

This keeps the current CRA stack intact while generating search-engine-readable HTML snapshots for crawlers.

## Structured data coverage

- Home: `WebSite` + `EducationalOrganization` + `BreadcrumbList`
- Tool pages: `SoftwareApplication` + `BreadcrumbList`
- Tutorial pages: `LearningResource` + `BreadcrumbList`
- Problem hub and topic practice pages: `LearningResource` + `FAQPage` + `BreadcrumbList`

## Environment variables

Frontend:

- `REACT_APP_API_URL`
- `REACT_APP_SITE_URL`
- `REACT_APP_GA_MEASUREMENT_ID`
- `REACT_APP_GOOGLE_SITE_VERIFICATION`
- `REACT_APP_BING_SITE_VERIFICATION`

If `REACT_APP_SITE_URL` is not provided, canonical URLs default to `https://circuits.quantumlogicslimited.com`.

## Search Console rollout

1. Add the Google verification value to `REACT_APP_GOOGLE_SITE_VERIFICATION`.
2. Deploy the updated build.
3. Submit `https://circuits.quantumlogicslimited.com/sitemap.xml` in Google Search Console.
4. Repeat the sitemap submission in Bing Webmaster Tools.

## Recommended validation checklist

1. Validate metadata on key pages using browser devtools and rendered HTML.
2. Test structured data in Google Rich Results Test.
3. Confirm canonical URLs match lowercased route targets.
4. Verify `robots.txt` and `sitemap.xml` over production URLs.
5. Run Lighthouse on home, a tool page, a tutorial page, and `/problems`.
6. Confirm GA4 receives page views, practice events, and tool interaction events.
