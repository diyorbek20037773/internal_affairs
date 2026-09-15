// Writes public/sw.js from src/pwa/sw.template.js with a per-build VERSION.
// Order of truth: RAILWAY_GIT_COMMIT_SHA (Railway) → `git rev-parse` (local) → timestamp.
import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

function buildId() {
  const env = process.env.RAILWAY_GIT_COMMIT_SHA || process.env.SOURCE_VERSION || process.env.GIT_SHA;
  if (env) return env.slice(0, 12);
  try {
    return execSync("git rev-parse --short=12 HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return `t${Date.now().toString(36)}`;
  }
}

const id = buildId();
const src = readFileSync(new URL("../src/pwa/sw.template.js", import.meta.url), "utf8");
if (!src.includes("__H360_VERSION__")) throw new Error("sw.template.js has no __H360_VERSION__ placeholder");
mkdirSync(new URL("../public/", import.meta.url), { recursive: true });
writeFileSync(new URL("../public/sw.js", import.meta.url), src.replaceAll("__H360_VERSION__", id));
console.log(`sw.js: version h360-${id}`);
