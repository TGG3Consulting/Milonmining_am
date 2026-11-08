import { cp, mkdir, rm, access } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "dist");

// Step 1 (opt-in): refresh the unit inventory from the Laravel API.
// Off by default so a build is reproducible and never depends on the API being up.
// Enable with:  SYNC_UNITS=1 API_BASE=https://api.milonmining.am npm run build
if (process.env.SYNC_UNITS === "1") {
  console.log("=== Syncing units from Laravel API ===");
  await import("./generate-units.mjs");
} else {
  console.log("=== Skipping unit sync (set SYNC_UNITS=1 to enable) ===");
}

// Step 2: regenerate the localised offer pages from site-data.js
console.log("=== Generating offer pages ===");
await import("./generate-offers.mjs");

console.log("=== Building dist ===");

const publicFiles = [
  "index.html",
  "apartments.html",
  "milon-tower.html",
  "milon-hills.html",
  "milon-plaza.html",
  "milon-townhouse.html",
  "about.html",
  "parking.html",
  "privacy-policy.html",
  "ru",
  "hy",
  "styles.css",
  "site-data.js",
  "site.js",
  "facades.js",
  "floorplans.js",
  "components",
  "assets"
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const missing = [];
for (const entry of publicFiles) {
  const from = path.join(root, entry);
  try {
    await access(from);
  } catch {
    missing.push(entry);
    continue;
  }
  await cp(from, path.join(output, entry), { recursive: true });
}

if (missing.length) {
  console.error("\nBuild aborted — these entries are missing:");
  for (const entry of missing) console.error("  - " + entry);
  process.exit(1);
}

console.log("=== Pointing plans at the web-sized copies ===");
const { optimizePlans } = await import("./optimize-plans.mjs");
await optimizePlans(output);

console.log(`dist ready: ${publicFiles.length} entries copied to ${output}`);
