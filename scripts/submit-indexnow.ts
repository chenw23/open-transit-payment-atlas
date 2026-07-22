import fs from "node:fs";

const KEY = "6d0db5d1eb9aa70cc895bebd66a35556";
const HOST = "chenw23.github.io";
const BASE_URL = `https://${HOST}/open-transit-payment-atlas`;
const sitemap = fs.readFileSync("dist/sitemap.xml", "utf8");
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (match) => match[1],
);

if (!urlList.length) {
  throw new Error("No URLs found in dist/sitemap.xml. Run npm run build first.");
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: {
    "content-type": "application/json; charset=utf-8",
  },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `${BASE_URL}/${KEY}.txt`,
    urlList,
  }),
});

if (!response.ok) {
  const body = await response.text();
  throw new Error(
    `IndexNow submission failed with ${response.status}: ${body || response.statusText}`,
  );
}

console.log(`Submitted ${urlList.length} URLs to IndexNow (${response.status}).`);
