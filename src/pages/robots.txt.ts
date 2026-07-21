import { siteUrl } from "@lib/seo";

export function GET() {
  return new Response(
    `User-agent: *
Allow: /

Sitemap: ${siteUrl("/sitemap.xml").href}
`,
    {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=3600",
      },
    },
  );
}
