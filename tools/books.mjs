// Parses the two book lists in syllabus Appendix IV into citations for the public site:
// node tools/books.mjs [path to jfk-hypotheses]   (default ../jfk-hypotheses)
// Bibliographic facts only. Reads private/text, which is not committed.
import { readFileSync, writeFileSync } from "node:fs";

const out = process.argv[2] || new URL("../../jfk-hypotheses/", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
const text = readFileSync(new URL("../private/text/Cowell103146pagesyllabus.txt", import.meta.url), "utf8");
const body = text.slice(text.indexOf("Alphabetically by Author"), text.indexOf("\nAPPENDIX V"));
const lines = body.split("\n").map(l => l.trim())
  .filter(l => l && !/^=== page \d+ ===$/.test(l) && !/^\d{1,3}$/.test(l));
const split = lines.findIndex(l => l.startsWith("Alphabetically by Title"));
const tidy = s => s.replace(/\s+/g, " ").replace(/\s+([,.:;])/g, "$1").replace(/\(\(/g, "(").trim();

// List 1: "Surname, Given. Title. Publisher, year." wrapped across lines and sometimes run together.
// Join it all, then split where a year (or closing period) is followed by "Surname, Given".
const AUTHOR = String.raw`[A-Z][A-Za-z’'\-]+(?: [A-Z][a-z]+)?, (?:[A-Z][a-z]+|[A-Z]\. [A-Z][a-z]+)[^.:;]{0,45}?\. (?=[A-Z“"'])`;
const joined = tidy(lines.slice(1, split).join(" "));
const pieces = [];
for (const p of joined.split(new RegExp(String.raw`(?<=(?:\d{4}\)?\.?|\.))\s+(?=${AUTHOR})`)))
  if (pieces.length && !/\. /.test(p)) pieces[pieces.length - 1] += " " + p;   // a stray publisher line
  else pieces.push(p);
const list1 = pieces.map(e => {
  const years = e.match(/\b(?:1[89]\d\d|20[0-2]\d)\b/g) || [];
  return { cite: e.replace(/\.$/, ""), year: years.at(-1) || "", list: 1 };
});

// List 2: title lines, then "Author (year)"
const list2 = [];
let title = [];
for (const l of lines.slice(split + 1)) {
  // Author lines end in "(year)"; a few name only a publisher, or give two years
  const m = l.match(/^(.+?),?\s*\(((?:1[89]|20)\d\d)\)(?:\s*\((?:1[89]|20)\d\d\))?\s*$/);
  if (m) {
    const t = tidy(title.join(" ")).replace(/,$/, "") || "(title missing in the source)";
    list2.push({ cite: `${t}. ${tidy(m[1]).replace(/,$/, "")}, ${m[2]}`, year: m[2], list: 2 });
    title = [];
  } else title.push(l);
}
if (title.length) console.warn("Unmatched trailing lines:", title);

const books = [...list1, ...list2];
writeFileSync(out + "/data/books.json", JSON.stringify({
  intro: "Two book lists from the syllabus (Appendix IV), compiled at different times by different people, so they overlap only in part. Entries are as given there, lightly cleaned; a few are incomplete or run together in the original.",
  books
}, null, 1) + "\n");
console.log(`list 1: ${list1.length}, list 2: ${list2.length}, untitled: ${books.filter(b => b.cite.startsWith("(title missing")).length}, no year: ${books.filter(b => !b.year).length}`);
