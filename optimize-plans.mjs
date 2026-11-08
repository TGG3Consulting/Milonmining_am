// Point the published catalogue at the web-sized copies of the plans.
//
// The CRM stores every plan at full resolution - a floor plan is a 3509x2482 JPEG of
// about 3 MB, shown in a box around 900 px wide. The API keeps serving those
// originals; the site only needs the light copies, which the server generates
// under /storage/web and lists in a manifest.
//
// This rewrites dist/site-data.js only, so the source file keeps the canonical
// URLs and a failed fetch simply leaves the build untouched.

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const MANIFEST = process.env.PLAN_MANIFEST
  || "https://api.milonmining.am/storage/web/manifest.json";
const BASE = "https://api.milonmining.am/storage/";

export async function optimizePlans(distDir) {
  const target = path.join(distDir, "site-data.js");

  let manifest;
  try {
    const res = await fetch(MANIFEST, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    manifest = await res.json();
  } catch (error) {
    console.warn(`  plan manifest unavailable (${error.message}) - keeping full-size URLs`);
    return;
  }

  const entries = Object.entries(manifest);
  if (!entries.length) {
    console.warn("  plan manifest is empty - keeping full-size URLs");
    return;
  }

  let source = await readFile(target, "utf-8");
  let replaced = 0;
  for (const [original, web] of entries) {
    const from = BASE + original;
    if (!source.includes(from)) continue;
    source = source.split(from).join(BASE + web);
    replaced++;
  }

  await writeFile(target, source, "utf-8");
  console.log(`  ${replaced} of ${entries.length} plan URLs now point at the web-sized copies`);
}
