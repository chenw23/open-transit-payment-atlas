import fs from "node:fs";
import path from "node:path";
import { loadSystems } from "../src/lib/data";
import { siteUrl, systemModifiedDate } from "../src/lib/seo";

const DIST_DIR = path.resolve("dist");
const SITE_PREFIX = "/open-transit-payment-atlas";

function walkHtml(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return walkHtml(file);
    return entry.name.endsWith(".html") ? [file] : [];
  });
}

function matches(html: string, pattern: RegExp): string[] {
  return [...html.matchAll(pattern)].map((match) => match[1] ?? match[0]);
}

function targetCandidates(sourceFile: string, href: string): string[] {
  const targetPath = href.split("#")[0];
  const resolved = targetPath.startsWith(SITE_PREFIX)
    ? path.join(DIST_DIR, targetPath.slice(SITE_PREFIX.length))
    : path.resolve(path.dirname(sourceFile), targetPath);

  if (path.extname(resolved)) return [resolved];
  return [resolved, path.join(resolved, "index.html")];
}

const htmlFiles = walkHtml(DIST_DIR).sort();
const errors: string[] = [];
const titles = new Map<string, string>();
const descriptions = new Map<string, string>();
const canonicalUrls = new Map<string, string>();

for (const file of htmlFiles) {
  const relativeFile = path.relative(DIST_DIR, file);
  const html = fs.readFileSync(file, "utf8");
  const pageChecks: Array<[string, RegExp, number]> = [
    ["title", /<title>(.*?)<\/title>/gis, 1],
    ["description", /<meta\s+name="description"\s+content="([^"]+)"/gis, 1],
    ["canonical", /<link\s+rel="canonical"\s+href="([^"]+)"/gis, 1],
    ["H1", /<h1\b[^>]*>/gis, 1],
    ["Open Graph title", /<meta\s+property="og:title"\s+content="([^"]+)"/gis, 1],
    ["Open Graph image", /<meta\s+property="og:image"\s+content="([^"]+)"/gis, 1],
    ["JSON-LD", /<script\s+type="application\/ld\+json"/gis, 1],
  ];

  for (const [label, pattern, expected] of pageChecks) {
    const count = matches(html, pattern).length;
    if (count !== expected) {
      errors.push(`${relativeFile}: expected ${expected} ${label}, found ${count}`);
    }
  }

  const title = matches(html, /<title>(.*?)<\/title>/gis)[0];
  const description = matches(
    html,
    /<meta\s+name="description"\s+content="([^"]+)"/gis,
  )[0];
  const canonical = matches(
    html,
    /<link\s+rel="canonical"\s+href="([^"]+)"/gis,
  )[0];

  if (title) {
    if (titles.has(title)) {
      errors.push(`${relativeFile}: duplicate title also used by ${titles.get(title)}`);
    }
    titles.set(title, relativeFile);
  }
  if (description) {
    if (description.length < 70 || description.length > 170) {
      errors.push(
        `${relativeFile}: description length ${description.length} is outside 70-170`,
      );
    }
    if (descriptions.has(description)) {
      errors.push(
        `${relativeFile}: duplicate description also used by ${descriptions.get(description)}`,
      );
    }
    descriptions.set(description, relativeFile);
  }
  if (canonical) {
    if (
      !canonical.startsWith(
        "https://chenw23.github.io/open-transit-payment-atlas/",
      )
    ) {
      errors.push(`${relativeFile}: canonical is outside the deployed site: ${canonical}`);
    }
    if (canonicalUrls.has(canonical)) {
      errors.push(
        `${relativeFile}: duplicate canonical also used by ${canonicalUrls.get(canonical)}`,
      );
    }
    canonicalUrls.set(canonical, relativeFile);
  }

  const pageIds = new Set(matches(html, /\sid="([^"]+)"/g));
  for (const href of matches(html, /\shref="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:)/.test(href)) continue;
    if (href.startsWith("#")) {
      if (!pageIds.has(href.slice(1))) {
        errors.push(`${relativeFile}: missing same-page fragment ${href}`);
      }
      continue;
    }

    const candidates = targetCandidates(file, href);
    const target = candidates.find(
      (candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile(),
    );
    if (!target) {
      errors.push(`${relativeFile}: missing internal target ${href}`);
      continue;
    }

    const fragment = href.split("#")[1];
    if (fragment && target.endsWith(".html")) {
      const targetHtml = fs.readFileSync(target, "utf8");
      const targetIds = new Set(matches(targetHtml, /\sid="([^"]+)"/g));
      if (!targetIds.has(fragment)) {
        errors.push(`${relativeFile}: missing target fragment ${href}`);
      }
    }
  }
}

const sitemapFile = path.join(DIST_DIR, "sitemap.xml");
if (!fs.existsSync(sitemapFile)) {
  errors.push("sitemap.xml: missing");
} else {
  const sitemap = fs.readFileSync(sitemapFile, "utf8");
  const sitemapUrls = matches(sitemap, /<loc>(.*?)<\/loc>/g);
  const sitemapEntries = new Map(
    [...sitemap.matchAll(/<url>\s*<loc>(.*?)<\/loc>\s*<lastmod>(.*?)<\/lastmod>\s*<\/url>/gs)]
      .map((match) => [match[1], match[2]]),
  );
  if (sitemapUrls.length !== htmlFiles.length) {
    errors.push(
      `sitemap.xml: expected ${htmlFiles.length} URLs, found ${sitemapUrls.length}`,
    );
  }
  for (const canonical of canonicalUrls.keys()) {
    if (!sitemapUrls.includes(canonical)) {
      errors.push(`sitemap.xml: missing canonical ${canonical}`);
    }
  }
  const systems = loadSystems();
  const expectedModifiedDates = new Map([
    [
      siteUrl("/").href,
      systems.map(systemModifiedDate).sort().at(-1) as string,
    ],
    ...systems.map(
      (system) =>
        [
          siteUrl(`/systems/${system.id}/`).href,
          systemModifiedDate(system),
        ] as const,
    ),
  ]);
  for (const [url, expectedDate] of expectedModifiedDates) {
    if (sitemapEntries.get(url) !== expectedDate) {
      errors.push(
        `sitemap.xml: expected lastmod ${expectedDate} for ${url}, found ${sitemapEntries.get(url) ?? "none"}`,
      );
    }
  }
}

for (const asset of ["favicon.svg", "og-image.png", "robots.txt"]) {
  if (!fs.existsSync(path.join(DIST_DIR, asset))) {
    errors.push(`${asset}: missing from generated site`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(
  `SEO audit passed for ${htmlFiles.length} HTML pages and ${canonicalUrls.size} canonical URLs.`,
);
