import {
  DEFAULT_OG_IMAGE,
  BRAND_ALTERNATE_NAMES,
  BRAND_TOPICS,
  SEO_ROUTES,
  SEO_ROUTE_MAP,
  SITE_NAME,
  SITE_URL,
  TWITTER_HANDLE,
} from "./seoCatalog.mjs";

const authPaths = new Set(["/login", "/signup", "/profile"]);
const sectionRootMatchers = [
  { test: /^\/problems(\/|$)/, path: "/problems", label: "Practice" },
  { test: /^\/boolean\//, path: "/boolean/overview", label: "Boolean Algebra" },
  {
    test: /^\/number-systems\//,
    path: "/number-systems/binary-representation",
    label: "Number Systems",
  },
  {
    test: /^\/arithmetic\//,
    path: "/arithmetic/binary-adders",
    label: "Arithmetic Functions and HDLs",
  },
  { test: /^\/sequential\//, path: "/sequential/intro", label: "Sequential Circuits" },
  {
    test: /^\/registers\//,
    path: "/registers/intro",
    label: "Registers & Transfers",
  },
  { test: /^\/memory\//, path: "/memory/basics", label: "Memory Systems" },
  { test: /^\/book(\/|$)/, path: "/book", label: "Solved Examples" },
];

const capitalize = (value) =>
  value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const normalizePath = (pathname = "/") => {
  if (!pathname) return "/";

  let normalized = pathname.trim();
  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }

  normalized = normalized.toLowerCase();
  if (normalized.length > 1) {
    normalized = normalized.replace(/\/+$/, "");
  }

  return normalized || "/";
};

export const buildAbsoluteUrl = (path = "/") =>
  `${SITE_URL}${normalizePath(path)}`;

export const resolveSeoRoute = (pathname = "/") => {
  const normalized = normalizePath(pathname);
  return SEO_ROUTE_MAP[normalized] || null;
};

export const buildDefaultSeo = (pathname = "/") => {
  const normalized = normalizePath(pathname);
  const slugLabel =
    normalized === "/"
      ? "Digital Logic Learning"
      : capitalize(normalized.split("/").filter(Boolean).slice(-1)[0] || "Boolforge");

  return {
    path: normalized,
    title: `${slugLabel} | ${SITE_NAME}`,
    description:
      "Explore Boolforge interactive digital logic learning resources, circuit tools, and guided computer engineering practice.",
    keywords: [
      "Boolforge",
      "Boolforge digital logic",
      "digital logic",
      "boolean algebra",
      "computer engineering",
    ],
    type: authPaths.has(normalized) ? "WebPage" : "LearningResource",
    section: authPaths.has(normalized) ? "Account" : "Learn",
    category: authPaths.has(normalized) ? "Authentication" : "Digital Logic",
    breadcrumbLabel: slugLabel,
    relatedLinks: [],
    faq: [],
    noindex: authPaths.has(normalized),
    ogImage: DEFAULT_OG_IMAGE,
  };
};

export const getSeoMeta = (pathname = "/") =>
  resolveSeoRoute(pathname) || buildDefaultSeo(pathname);

const getSectionRoot = (pathname, meta) => {
  const normalized = normalizePath(pathname);
  const matchedRoot = sectionRootMatchers.find(({ test }) => test.test(normalized));

  if (matchedRoot) {
    return matchedRoot;
  }

  if (meta.section && meta.section !== "Home" && normalized !== "/") {
    return {
      path: normalized,
      label: meta.section,
    };
  }

  return null;
};

export const buildBreadcrumbs = (pathname, meta) => {
  const normalized = normalizePath(pathname);
  if (normalized === "/") {
    return [{ name: "Home", path: "/" }];
  }

  const crumbs = [{ name: "Home", path: "/" }];
  const sectionRoot = getSectionRoot(normalized, meta);

  if (sectionRoot && sectionRoot.path !== normalized) {
    crumbs.push({ name: sectionRoot.label, path: sectionRoot.path });
  }

  if (!sectionRoot || meta.breadcrumbLabel !== sectionRoot.label) {
    crumbs.push({
      name: meta.breadcrumbLabel || meta.title,
      path: normalized,
    });
  }

  return crumbs;
};

export const buildBreadcrumbSchema = (pathname, meta) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: buildBreadcrumbs(pathname, meta).map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: buildAbsoluteUrl(crumb.path),
  })),
});

const schemaId = (suffix) => `${SITE_URL}/#${suffix}`;

const buildWebsiteSchema = (meta) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": schemaId("website"),
  name: SITE_NAME,
  alternateName: BRAND_ALTERNATE_NAMES,
  url: SITE_URL,
  description: meta.description,
  inLanguage: "en-US",
  publisher: {
    "@id": schemaId("organization"),
  },
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
});

const buildOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": schemaId("organization"),
  name: SITE_NAME,
  legalName: SITE_NAME,
  alternateName: BRAND_ALTERNATE_NAMES,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.png`,
  image: DEFAULT_OG_IMAGE,
  description:
    "Boolforge is an interactive educational platform for Boolean algebra, digital logic design, logic gates, Karnaugh maps, number systems, computer architecture, and computer engineering practice.",
  sameAs: [
    SITE_URL,
  ],
  knowsAbout: BRAND_TOPICS,
  slogan: "Forge digital logic mastery with interactive computer engineering tools.",
});

const buildSoftwareApplicationSchema = (pathname, meta) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: meta.title.replace(` | ${SITE_NAME}`, ""),
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript. Works in modern browsers.",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description: meta.description,
  image: meta.ogImage || DEFAULT_OG_IMAGE,
  url: buildAbsoluteUrl(pathname),
  author: {
    "@id": schemaId("organization"),
  },
  publisher: {
    "@id": schemaId("organization"),
  },
});

const buildLearningResourceSchema = (pathname, meta) => ({
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: meta.title.replace(` | ${SITE_NAME}`, ""),
  description: meta.description,
  url: buildAbsoluteUrl(pathname),
  educationalLevel: ["Beginner", "Intermediate", "University"],
  learningResourceType: meta.section === "Practice" ? "Practice Problems" : "Tutorial",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  provider: {
    "@id": schemaId("organization"),
  },
  about: [meta.category, ...BRAND_TOPICS.slice(1, 6)].filter(Boolean),
});

const buildFaqSchema = (meta) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: meta.faq.map((entry) => ({
    "@type": "Question",
    name: entry.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: entry.answer,
    },
  })),
});

export const buildStructuredData = (pathname, meta) => {
  const graph = [
    buildOrganizationSchema(),
    buildWebsiteSchema(meta),
    buildBreadcrumbSchema(pathname, meta),
  ];

  if (meta.type === "SoftwareApplication") {
    graph.push(buildSoftwareApplicationSchema(pathname, meta));
  } else if (meta.type === "FAQPage") {
    graph.push(buildLearningResourceSchema(pathname, meta));
    if (meta.faq?.length) {
      graph.push(buildFaqSchema(meta));
    }
  } else if (meta.type !== "WebSite" && meta.type !== "WebPage") {
    graph.push(buildLearningResourceSchema(pathname, meta));
  }

  return graph;
};

export const getSitemapRoutes = () =>
  SEO_ROUTES.filter((route) => !route.noindex).map((route) => route.path);

export const buildMetaKeywords = (meta) =>
  Array.from(new Set(meta.keywords || [])).join(", ");

export { SITE_NAME, SITE_URL, TWITTER_HANDLE, DEFAULT_OG_IMAGE };
