import { existsSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const out = join(root, "out");
const docs = join(root, "docs");

if (!existsSync(out)) {
  throw new Error("No out/ folder found. Check that output: 'export' is set in next.config.");
}

// Remove the previous docs/ so the new build replaces it instead of nesting inside it.
rmSync(docs, { recursive: true, force: true });
renameSync(out, docs);

// Stops GitHub Pages' Jekyll from hiding folders that start with an underscore, like _next/.
writeFileSync(join(docs, ".nojekyll"), "");

console.log("Moved out/ to docs/ and added .nojekyll");