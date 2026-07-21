import { loadSystems } from "@lib/data";
import { siteUrl, systemModifiedDate } from "@lib/seo";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const systems = loadSystems();
  const latestVerified = systems
    .map(systemModifiedDate)
    .sort()
    .at(-1);
  const entries = [
    {
      location: siteUrl("/").href,
      lastModified: latestVerified,
    },
    ...systems.map((system) => ({
      location: siteUrl(`/systems/${system.id}/`).href,
      lastModified: systemModifiedDate(system),
    })),
  ];

  const urls = entries
    .map(
      ({ location, lastModified }) => `  <url>
    <loc>${escapeXml(location)}</loc>
    ${lastModified ? `<lastmod>${lastModified}</lastmod>` : ""}
  </url>`,
    )
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
    {
      headers: {
        "content-type": "application/xml; charset=utf-8",
        "cache-control": "public, max-age=3600",
      },
    },
  );
}
