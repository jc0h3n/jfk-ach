// Builds the Open ACH files (format "open-ach/1") from evidence.mjs: node build.mjs
// Writes analyses/<slug>.json. Open them in Open ACH with "Open a file".
// If a file already exists, ratings, conclusion, milestones and analyst are kept, so you can add evidence and rebuild
// without losing work. To keep ratings made in the browser, export the analysis from Open ACH over the file first.
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { WHO_FIRED, WHO_BEHIND } from "./evidence.mjs";

const TYPES = ["Fact", "Report", "Assumption", "Absence of evidence", "Argument"], LEVELS = ["L", "M", "H"];
mkdirSync(new URL("./analyses/", import.meta.url), { recursive: true });

// Built B first, then A, so A (the newer) is listed first in Open ACH, which sorts by last update
for (const def of [WHO_BEHIND, WHO_FIRED]) {
  const file = new URL(`./analyses/${def.slug}.json`, import.meta.url);
  const old = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : null;
  const ids = new Set();
  for (const [id, , type, , , cred, rel] of def.evidence) {
    if (ids.has(id)) throw new Error(`Duplicate evidence id ${id}`);
    ids.add(id);
    if (!TYPES.includes(type)) throw new Error(`${id}: unknown type ${type}`);
    if (!LEVELS.includes(cred) || !LEVELS.includes(rel)) throw new Error(`${id}: credibility/relevance must be L, M or H`);
  }
  const now = new Date().toISOString();
  const keep = id => old?.evidence?.find(e => e.id === id);
  const analysis = {
    format: "open-ach/1",
    id: old?.id || `jfk-${def.slug}`,
    title: def.title,
    question: def.question,
    analyst: old?.analyst || "",
    created: old?.created || now,
    updated: now,
    hypotheses: def.hypotheses.map(([id, text, notes]) => ({ id, text, notes })),
    evidence: def.evidence.map(([id, text, type, source, date, credibility, relevance, notes]) => ({
      id, text, source, type, date, credibility, relevance, notes, excluded: keep(id)?.excluded || false
    })),
    // Ratings stay the analyst's: keep any already made for evidence and hypotheses that still exist
    ratings: Object.fromEntries(Object.entries(old?.ratings || {}).filter(([k]) => { const [e, h] = k.split("|"); return ids.has(e) && def.hypotheses.some(x => x[0] === h); })),
    conclusion: old?.conclusion || "",
    milestones: old?.milestones || []
  };
  writeFileSync(file, JSON.stringify(analysis, null, 2) + "\n");
  console.log(`${def.slug}: ${analysis.hypotheses.length} hypotheses, ${analysis.evidence.length} evidence items, ${Object.keys(analysis.ratings).length} ratings kept`);
}
