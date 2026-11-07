import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";

// Step 1: fetch live data from Laravel backend and patch site-data.js
console.log("=== Syncing units from Laravel API ===");
await import("./generate-units.mjs");
console.log("=== Building dist ===");

const root = process.cwd();
const output = path.join(root, "dist");
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
  "components",
  "Milon Mining — Պրեմիում բնակելի համալիրներ Հայաստանում_files"
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const entry of publicFiles) {
  await cp(path.join(root, entry), path.join(output, entry), { recursive: true });
}

await mkdir(path.join(output, ".openai"), { recursive: true });
await cp(path.join(root, ".openai", "hosting.json"), path.join(output, ".openai", "hosting.json"));
