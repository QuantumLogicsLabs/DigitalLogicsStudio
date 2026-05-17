const fs = require("fs");
const path = require("path");
const express = require("express");
const puppeteer = require("puppeteer");

const packageJson = require("../package.json");

const routesPath = path.resolve(__dirname, "..", "react-snap-routes.json");
const buildDir = path.resolve(__dirname, "..", "build");
const defaultPort = Number.parseInt(process.env.PRERENDER_PORT || "45678", 10);

const loadIncludeRoutes = () => {
  if (!fs.existsSync(routesPath)) {
    throw new Error(
      `Missing prerender route manifest at ${routesPath}. Run the SEO asset generator first.`,
    );
  }

  const routes = JSON.parse(fs.readFileSync(routesPath, "utf8"));

  if (!Array.isArray(routes) || routes.length === 0) {
    throw new Error("The prerender route manifest is empty.");
  }

  const singleRoute = process.env.PRERENDER_ROUTE;
  if (singleRoute) {
    return [singleRoute];
  }

  return routes;
};

const removeStalePrerenderArtifacts = () => {
  ["200.html", "404.html"].forEach((fileName) => {
    const filePath = path.join(buildDir, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });
};

const ensureHtml = (markup) =>
  markup.trimStart().toLowerCase().startsWith("<!doctype")
    ? markup
    : `<!DOCTYPE html>\n${markup}`;

const resolveOutputPath = (route) => {
  if (route === "/") {
    return path.join(buildDir, "index.html");
  }

  return path.join(buildDir, route.replace(/^\/+/, ""), "index.html");
};

const writeSnapshot = (route, html) => {
  const outputPath = resolveOutputPath(route);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, ensureHtml(html), "utf8");
};

const createServer = () => {
  const app = express();

  app.use(
    express.static(buildDir, {
      extensions: ["html"],
      fallthrough: true,
      redirect: false,
    }),
  );

  app.get("*", (_req, res) => {
    res.sendFile(path.join(buildDir, "index.html"));
  });

  return new Promise((resolve, reject) => {
    const server = app.listen(defaultPort, () => resolve(server));
    server.on("error", reject);
  });
};

const waitForPageContent = async (page) => {
  await page
    .waitForFunction(
      () =>
        document.readyState === "complete" &&
        Boolean(
          document.querySelector(
            "main, h1, .home-page, .premium-learning-shell, .tool-layout-shell",
          ),
        ),
      { timeout: 15000 },
    )
    .catch(() => null);

  await page
    .waitForFunction(() => !document.querySelector(".app-route-loading"), {
      timeout: 10000,
    })
    .catch(() => null);

  await new Promise((resolve) => setTimeout(resolve, 300));
};

const prerenderRoute = async (browser, baseUrl, route) => {
  const page = await browser.newPage();
  await page.setUserAgent("ReactSnap");
  await page.setViewport({ width: 1440, height: 960 });
  await page.setRequestInterception(true);

  page.on("request", (request) => {
    const requestUrl = request.url();
    if (requestUrl.startsWith(baseUrl)) {
      request.continue();
      return;
    }

    request.abort();
  });

  await page.goto(`${baseUrl}${route}`, {
    waitUntil: "domcontentloaded",
    timeout: 45000,
  });

  await waitForPageContent(page);

  const html = await page.content();
  await page.close();
  writeSnapshot(route, html);
  console.log(`Rendered ${route}`);
};

async function main() {
  if (!fs.existsSync(path.join(buildDir, "index.html"))) {
    throw new Error(
      "Missing build/index.html. Run the CRA production build before prerendering.",
    );
  }

  const include = loadIncludeRoutes();
  const concurrency = Math.max(
    1,
    Number.parseInt(process.env.PRERENDER_CONCURRENCY || "2", 10) || 2,
  );

  removeStalePrerenderArtifacts();

  console.log(
    `Prerendering ${include.length} canonical Boolforge route${include.length === 1 ? "" : "s"} with concurrency ${concurrency}...`,
  );

  const server = await createServer();
  const browser = await puppeteer.launch({
    headless: packageJson.reactSnap?.headless ?? true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-background-networking",
      "--disable-default-apps",
      "--disable-extensions",
      "--no-first-run",
    ],
  });
  const baseUrl = `http://127.0.0.1:${defaultPort}`;

  try {
    for (let index = 0; index < include.length; index += concurrency) {
      const chunk = include.slice(index, index + concurrency);
      await Promise.all(chunk.map((route) => prerenderRoute(browser, baseUrl, route)));
    }

    const rootHtml = fs.readFileSync(path.join(buildDir, "index.html"), "utf8");
    fs.writeFileSync(path.join(buildDir, "200.html"), rootHtml, "utf8");
    fs.writeFileSync(path.join(buildDir, "404.html"), rootHtml, "utf8");
  } finally {
    await browser.close();
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
}

main().catch((error) => {
  console.error("Prerender failed:", error);
  process.exit(1);
});
