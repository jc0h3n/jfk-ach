// Merges the own-words chronology in public-src/ into the public site's data/timeline.json:
// node tools/timeline.mjs [path to jfk-hypotheses]   (default ../jfk-hypotheses)
// public-src/selected-*.json: [id, date, page, text]   (Selected Chronology, syllabus Appendix I)
// public-src/extended-*.json: [id, date, time, page, text, tag]   (Extended Chronology)
// Checks that IDs and dates are well formed, unique, and (when private/data exists) match the parsed originals.
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";

const here = p => new URL("../" + p, import.meta.url);
const out = process.argv[2] || new URL("../../jfk-hypotheses/", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
const files = prefix => readdirSync(here("public-src")).filter(f => f.startsWith(prefix) && f.endsWith(".json")).sort();
const read = f => JSON.parse(readFileSync(here("public-src/" + f), "utf8"));
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const entries = [], seen = new Set();
const add = (id, date, time, page, text, src, tag) => {
  if (seen.has(id)) throw new Error(`duplicate id ${id}`);
  if (!DATE.test(date)) throw new Error(`${id}: bad date ${date}`);
  if (!text || /\s$/.test(text)) throw new Error(`${id}: empty or untrimmed text`);
  seen.add(id);
  entries.push([id, date, time || "", page, text, src, tag || ""]);
};
for (const f of files("selected-")) for (const [id, date, page, text] of read(f)) add(id, date, "", page, text, "S");
for (const f of files("extended-")) for (const [id, date, time, page, text, tag] of read(f)) add(id, date, time, page, text, "X", tag);

// Cross-check against the private parse, if present (it is not committed)
const priv = n => existsSync(here(`private/data/${n}.json`)) ? JSON.parse(readFileSync(here(`private/data/${n}.json`), "utf8")) : null;
const sel = priv("chronology-selected");
if (sel) {
  const ids = new Set(sel.map(x => x.id));
  const missing = sel.filter(x => !seen.has(x.id)).length;
  for (const e of entries) if (e[5] === "S" && !ids.has(e[0])) throw new Error(`${e[0]}: not in the Selected Chronology`);
  console.log(`selected: ${entries.filter(e => e[5] === "S").length} of ${sel.length}${missing ? `, ${missing} still to write` : ""}`);
}
const ext = priv("chronology-extended");
if (ext) {
  const items = Object.values(ext).flatMap(d => d.items || []);
  const ids = new Set(items.map(x => x.id));
  for (const e of entries) if (e[5] === "X" && !ids.has(e[0])) throw new Error(`${e[0]}: not in the Extended Chronology`);
  console.log(`extended: ${entries.filter(e => e[5] === "X").length} of ${items.length}`);
}

entries.sort((a, b) => a[1].localeCompare(b[1]) || a[2].localeCompare(b[2]) || a[0].localeCompare(b[0]));
writeFileSync(out + "/data/timeline.json", JSON.stringify({
  sources: {
    S: { name: "Selected Chronology", cite: "Course syllabus, Appendix I" },
    X: { name: "Extended Chronology", cite: "Extended Chronology (course document)" }
  },
  fields: ["id", "date", "time", "page", "text", "source", "tag"],
  entries
}) + "\n");
console.log(`wrote ${entries.length} entries`);
