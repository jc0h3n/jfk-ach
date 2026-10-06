// Copies the analyses (and METHOD.md, SOURCES.md) to the public site, jc0h3n/jfk-hypotheses:
//   node publish.mjs [path to the jfk-hypotheses folder]      (default: ../jfk-hypotheses)
// Then commit and push there. Only the analyses and the two notes are copied; nothing else here is published.
import { copyFileSync, existsSync, writeFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const site = resolve(process.argv[2] || new URL("../jfk-hypotheses", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
if (!existsSync(resolve(site, "analyses"))) { console.error(`No analyses/ folder in ${site}. Pass the path to the jfk-hypotheses folder.`); process.exit(1); }
const here = new URL("./", import.meta.url);
const files = readdirSync(new URL("analyses/", here)).filter(f => f.endsWith(".json"));
for (const f of files) copyFileSync(new URL(`analyses/${f}`, here), resolve(site, "analyses", f));
for (const f of ["METHOD.md", "SOURCES.md"]) copyFileSync(new URL(f, here), resolve(site, f));
writeFileSync(resolve(site, "analyses", "manifest.json"), JSON.stringify(files) + "\n");
console.log(`Published ${files.length} analyses and the notes to ${site}. Review, then commit and push there.`);
