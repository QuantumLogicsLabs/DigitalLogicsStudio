const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const projectRoot = path.resolve(__dirname, "..");
const publicDir = path.join(projectRoot, "public");
const catalogPath = path.join(projectRoot, "src", "seo", "seoCatalog.mjs");

const escapeXml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

async function main() {
  const catalog = await import(pathToFileURL(catalogPath).href);
  const routes = catalog.SEO_ROUTES.filter((route) => !route.noindex);
  const lastmod = new Date().toISOString();

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...routes.map((route) => {
      const loc = `${catalog.SITE_URL}${route.path}`;
      return [
        "  <url>",
        `    <loc>${escapeXml(loc)}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        "  </url>",
      ].join("\n");
    }),
    "</urlset>",
    "",
  ].join("\n");

  const robots = [
    "User-agent: *",
    "Allow: /",
    "",
    "Disallow: /login",
    "Disallow: /signup",
    "Disallow: /profile",
    "Disallow: /api/",
    "",
    "Sitemap: https://circuits.quantumlogicslimited.com/sitemap.xml",
    "",
  ].join("\n");

  const prerenderRoutes = JSON.stringify(
    routes.map((route) => route.path),
    null,
    2,
  );

  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap, "utf8");
  fs.writeFileSync(path.join(publicDir, "robots.txt"), robots, "utf8");
  fs.writeFileSync(
    path.join(projectRoot, "react-snap-routes.json"),
    prerenderRoutes,
    "utf8",
  );

  console.log(
    `Generated SEO assets for ${routes.length} canonical routes in ${publicDir}`,
  );
}

main().catch((error) => {
  console.error("Failed to generate SEO assets:", error);
  process.exit(1);
});
