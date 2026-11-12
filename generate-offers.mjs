// Generates the localised offer pages that site.js routes to:
//   {lang}/offers/index.html            -> data-page="offers"
//   {lang}/offers/{slug}/index.html     -> data-page="offer"  data-offer="{id}"
//
// The content itself is rendered client-side by site.js from site-data.js, so
// these files are thin shells. Running this keeps them in sync with D.offers.

import { mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dir = path.dirname(fileURLToPath(import.meta.url));

// cache-busting token; keep in step with the root pages
const ASSET_V = 41;
const LANGS = ["hy", "ru"];

// site-data.js is an IIFE that assigns window.MILON_DATA
const source = await readFile(path.join(__dir, "site-data.js"), "utf-8");
const scope = { window: {} };
new Function("window", source)(scope.window);
const D = scope.window.MILON_DATA;
if (!D?.offers?.length) throw new Error("no offers found in site-data.js");

const esc = value => String(value ?? "").replace(/[&<>"]/g, ch =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));

const SITE = "https://milonmining.am";

function shell({ lang, title, description, canonical, alternates, page, offerId, depth }) {
  const up = "../".repeat(depth);
  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${esc(description)}">
  <meta name="theme-color" content="#f2efe7">
  <title>${esc(title)}</title>
  <link rel="icon" href="/assets/favicon.ico" sizes="any">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <link rel="manifest" href="/assets/site.webmanifest">
  <link rel="canonical" href="${canonical}">
${alternates.map(a => `  <link rel="alternate" hreflang="${a.lang}" href="${a.href}">`).join("\n")}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Milon Mining">
  <meta property="og:locale" content="${lang === "ru" ? "ru_RU" : "hy_AM"}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${SITE}/assets/og-image.jpg">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Milon Mining">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${SITE}/assets/og-image.jpg">
  <link rel="stylesheet" href="${up}styles.css?v=${ASSET_V}">
  <script src="${up}site-data.js?v=${ASSET_V}" defer></script>
  <script src="${up}site.js?v=${ASSET_V}" defer></script>
</head>
<body data-page="${page}" data-lang="${lang}"${offerId ? ` data-offer="${esc(offerId)}"` : ""}>
  <div id="app"></div>
</body>
</html>
`;
}

const TITLES = {
  hy: { index: "Գործող առաջարկներ — Milon Mining", desc: "Milon Mining-ի գործող առաջարկներն ու ծրագրերը։" },
  ru: { index: "Действующие предложения — Milon Mining", desc: "Действующие предложения и программы Milon Mining." }
};

let written = 0;

for (const lang of LANGS) {
  const base = path.join(__dir, lang, "offers");
  await rm(base, { recursive: true, force: true });
  await mkdir(base, { recursive: true });

  // index
  await writeFile(path.join(base, "index.html"), shell({
    lang,
    title: TITLES[lang].index,
    description: TITLES[lang].desc,
    canonical: `${SITE}/${lang}/offers/index.html`,
    alternates: LANGS.map(l => ({ lang: l === "hy" ? "hy-AM" : "ru-RU", href: `${SITE}/${l}/offers/index.html` })),
    page: "offers",
    depth: 2
  }), "utf-8");
  written++;

  // one page per offer
  for (const offer of D.offers) {
    const dir = path.join(base, offer.slug);
    await mkdir(dir, { recursive: true });
    const title = `${offer.title?.[lang] ?? offer.slug} — Milon Mining`;
    const description = offer.summary?.[lang] ?? TITLES[lang].desc;
    await writeFile(path.join(dir, "index.html"), shell({
      lang,
      title,
      description,
      canonical: `${SITE}/${lang}/offers/${offer.slug}/index.html`,
      alternates: LANGS.map(l => ({ lang: l === "hy" ? "hy-AM" : "ru-RU", href: `${SITE}/${l}/offers/${offer.slug}/index.html` })),
      page: "offer",
      offerId: offer.id,
      depth: 3
    }), "utf-8");
    written++;
  }
}

console.log(`generate-offers: ${written} pages for ${D.offers.length} offers x ${LANGS.length} languages`);
