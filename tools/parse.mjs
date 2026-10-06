// Splits the course documents (extracted text in private/text/) into structured, verbatim data in private/data/.
// Private: this is the documents' own wording, for reference and search only. Never publish private/.
//   node tools/parse.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const P = new URL("../private/", import.meta.url);
mkdirSync(new URL("data/", P), { recursive: true });
const read = f => readFileSync(new URL(`text/${f}.txt`, P), "utf8").split(/\r?\n/);
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const M = MONTHS.join("|");
const pad = n => String(n).padStart(2, "0");
const clean = s => s.replace(/\s+/g, " ").replace(/\s([,.;:])/g, "$1").trim();
// Lines with page numbers, keeping track of the PDF page; drops bare page numbers and glyph garbage
function paged(lines) {
  const out = []; let page = 0;
  for (const l of lines) {
    const m = /^=== page (\d+) ===$/.exec(l); if (m) { page = +m[1]; continue; }
    const t = l.trim();
    if (!t || /^\d{1,3}$/.test(t)) continue;
    if (t.replace(/[A-Za-z0-9 ,.'’“”"():;—–-]/g, "").length > t.length * 0.3) continue;   // garbled glyph lines
    out.push({ page, t });
  }
  return out;
}
// Footnotes: once a page reaches a line like "93 Silvia Odio was…" or "17 http://…", the rest of the page is footnotes
function splitFootnotes(lines) {
  const body = [], notes = []; let fnPage = -1;
  for (const x of lines) {
    if (x.page !== fnPage && /^\d{1,3} (https?:\/\/|[A-Z“"'(])/.test(x.t)) fnPage = x.page;
    (x.page === fnPage ? notes : body).push(x);
  }
  return { body, notes };
}
const save = (name, data) => { writeFileSync(new URL(`data/${name}.json`, P), JSON.stringify(data, null, 1)); console.log(`${name}: ${Array.isArray(data) ? data.length : Object.keys(data).length}`); };

// ---- Syllabus ---------------------------------------------------------------------------------------------
const syl = read("Cowell103146pagesyllabus");
const at = re => syl.findIndex(l => re.test(l));
const iI = at(/^SELECTED CHRONOLOGY$/), iII = at(/^APPENDIX II$/), iIII = at(/^APPENDIX III$/), iIV = at(/^APPENDIX IV$/), iV = at(/^APPENDIX V$/);
const iQ = at(/^20 KEY QUESTIONS/), iQend = syl.findIndex((l, i) => i > iQ && /^III$/.test(l));
const slice = (a, b) => { const pre = syl.slice(0, a).filter(l => /^=== page/.test(l)).pop() || "=== page 1 ==="; return [pre, ...syl.slice(a, b)]; };

// Appendix I: the Selected Chronology
{
  const { body, notes } = splitFootnotes(paged(slice(iI + 1, iII)));
  const entries = []; let cur = null;
  const start = t => {
    let m = /^(\d{2})\/(\d{2})\/(\d{2})\s*[—–-]\s*(.*)$/.exec(t);
    if (m) return { date: `19${m[3]}-${m[1]}-${m[2]}`, text: m[4], style: "Fonzi" };
    m = new RegExp(`^(${M}) (\\d{1,2})(?:\\s*[—–-]\\s*\\d{1,2})?,? (\\d{4})\\s*[:—–-]\\s*(.*)$`).exec(t);
    if (m) return { date: `${m[3]}-${pad(MONTHS.indexOf(m[1]) + 1)}-${pad(m[2])}`, text: m[4], style: "Douglass/Hancock" };
    m = new RegExp(`^(${M}),? (\\d{4})\\s*[:—–-]\\s*(.*)$`).exec(t);
    if (m) return { date: `${m[2]}-${pad(MONTHS.indexOf(m[1]) + 1)}`, text: m[3], style: "month" };
    return null;
  };
  for (const x of body) {
    const s = start(x.t);
    if (s) { cur = { id: `c${pad(entries.length + 1).padStart(3, "0")}`, ...s, page: x.page }; entries.push(cur); }
    else if (cur) cur.text += " " + x.t;
  }
  for (const e of entries) e.text = clean(e.text);
  save("chronology-selected", entries);
  save("chronology-selected-footnotes", notes.map(n => ({ page: n.page, text: n.t })));
}

// 20 Key Questions
{
  const lines = paged(slice(iQ + 1, iQend)).map(x => x.t);
  const qs = []; let cur = null;
  for (const t of lines) {
    const m = /^(\d{1,2})\.\s*(.*)$/.exec(t), sub = /^([a-t])\.\)\s*(.*)$/.exec(t);
    if (m && +m[1] === qs.length + 1) { cur = { n: +m[1], text: m[2], people: [] }; qs.push(cur); }
    else if (sub && cur) cur.people.push(clean(sub[2].replace(/;$/, "")));
    else if (cur) cur.text += " " + t;
  }
  for (const q of qs) q.text = clean(q.text);
  save("key-questions", qs);
}

// Appendix II: cryptonyms
{
  const lines = paged(slice(iII + 2, iIII)).map(x => x.t);
  const out = []; let cur = null;
  for (const t of lines) {
    const m = /^([A-Z][A-Z0-9/ \-]{1,28}?),\s*(.*)$/.exec(t);
    if (m && !/^(The|And|In|A)\b/.test(m[1])) { cur = { code: m[1].trim(), meaning: m[2] }; out.push(cur); }
    else if (cur) cur.meaning += " " + t;
  }
  for (const c of out) c.meaning = clean(c.meaning);
  save("cryptonyms", out);
}

// Appendix III: FBI and CIA communications about Oswald
{
  const lines = paged(slice(iIII + 1, iIV));
  const intro = [], docs = []; let cur = null, inTable = false;
  for (const x of lines) {
    const t = x.t;
    if (/^Document Overview/.test(t)) { inTable = true; continue; }
    if (!inTable) { intro.push(t); continue; }
    const d = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.? (\d{1,2})$/.exec(t);
    if (d) { cur = { date: `${d[1]} ${d[2]}`, page: x.page, source: "", to: "", content: "" }; docs.push(cur); continue; }
    if (!cur) continue;
    const f = /^(Source|To|Content\/Action):\s*(.*)$/.exec(t);
    if (f) cur[{ Source: "source", To: "to", "Content/Action": "content" }[f[1]]] = f[2];
    else cur.content += " " + t;
  }
  for (const d of docs) for (const k of ["source", "to", "content"]) d[k] = clean(d[k]);
  save("agency-documents", { intro: clean(intro.join(" ")), documents: docs });
}

// Appendix IV: books
{
  const lines = paged(slice(iIV + 1, iV)).map(x => x.t);
  const books = []; let cur = null;
  for (const t of lines) {
    if (/^(PLEASE NOTE|created at|other\.|Alphabetically)/.test(t)) continue;
    if (/^[A-Z][A-Za-z’'\-]+(?: [A-Z][A-Za-z’'\-]+)?, [A-Z]/.test(t) && !/^(New York|Boston|London|Washington)/.test(t)) { cur = { entry: t }; books.push(cur); }
    else if (cur) cur.entry += " " + t;
  }
  for (const b of books) b.entry = clean(b.entry);
  save("books", books);
}

// Appendix V: the Primer of Assassination Theories
{
  const { body } = splitFootnotes(paged(slice(iV + 2, syl.length)));
  const theories = []; let cur = null, field = "text";
  for (const x of body) {
    const h = /^(\d{1,2})\. ([A-Z0-9“"][A-Z0-9 .’'“”"!\-()&/,]+)$/.exec(x.t);
    if (h && +h[1] === theories.length + 1) { cur = { n: +h[1], name: h[2].trim(), page: x.page, text: "", selling: "", drawbacks: [] }; theories.push(cur); field = "text"; continue; }
    if (!cur) continue;
    const s = /^Selling [Pp]oint:\s*(.*)$/.exec(x.t), d = /^Drawbacks?(?: No\. ?\d)?:\s*(.*)$/.exec(x.t);
    if (s) { field = "selling"; cur.selling = s[1]; }
    else if (d) { field = "drawback"; cur.drawbacks.push(d[1]); }
    else if (field === "drawback") cur.drawbacks[cur.drawbacks.length - 1] += " " + x.t;
    else cur[field] += " " + x.t;
  }
  for (const t of theories) { t.text = clean(t.text); t.selling = clean(t.selling); t.drawbacks = t.drawbacks.map(clean); }
  save("primer-theories", theories);
}

// ---- Extended Chronology (November 1, 1963 – January 21, 1964) ----------------------------------------------
{
  const lines = paged(read("EXTENDED-CHRONOLOGY"));
  const days = []; let day = null, para = null, prevLen = 0;
  // Day headings look like "November 21, 1963: …" or "NOVEMBER 22 1963 (Friday)". A stray date in the middle of a
  // day's text (e.g. "December 9, 1963... subsequent investigation") is only a new day if it follows within two weeks.
  // A real heading is followed by a colon, a weekday, a capitalized word, or nothing; a stray mention in running text
  // ("November 28, 1963, the gray zipper jacket…", "November 22, 1963 began…") is followed by a comma or lowercase.
  const dayRe = new RegExp(`^(${M}|${M.toUpperCase()}) (\\d{1,2}),? (\\d{4})(?:\\s*\\((?:Mon|Tues|Wednes|Thurs|Fri|Satur|Sun)day\\))?(?:\\s*:\\s*(.*)|\\s+([A-Z‘'“"(].*)|\\s*)$`);
  const monthOf = s => MONTHS.findIndex(m => m.toLowerCase() === s.toLowerCase()) + 1;
  const days14 = (a, b) => (Date.parse(b) - Date.parse(a)) / 86400000;
  for (const x of lines) {
    const d = dayRe.exec(x.t), date = d && `${d[3]}-${pad(monthOf(d[1]))}-${pad(d[2])}`;
    if (d && (!day || (date > day.date && days14(day.date, date) <= 14))) {
      day = { date, page: x.page, items: [] }; days.push(day);
      para = null; prevLen = 0;
      const rest = d[4] || d[5];
      if (rest) { para = { page: x.page, time: "", text: rest }; day.items.push(para); prevLen = x.t.length; }
      continue;
    }
    if (!day) { day = { date: "1963-11-01", page: x.page, items: [] }; days.push(day); }
    const tm = /^(\d{1,2}:\d{2}\s?(?:AM|PM|a\.m\.|p\.m\.)?)\s*(.*)$/i.exec(x.t);
    const startsNew = tm || !para || (prevLen < 78 && /[.’'”")\]]$/.test(para.text) && /^[A-Z‘“"(]/.test(x.t));
    if (startsNew) { para = { page: x.page, time: tm ? tm[1].replace(/\s+/g, " ") : "", text: tm ? tm[2] : x.t }; day.items.push(para); }
    else para.text += " " + x.t;
    prevLen = x.t.length;
  }
  let n = 0;
  for (const d of days) for (const it of d.items) {
    it.text = clean(it.text); it.id = `x${String(++n).padStart(4, "0")}`;
    const tag = /\(([A-Z]{2,6}(?:[,/ ]+[A-Z]{2,6})*)\)\s*$/.exec(it.text);   // trailing source tags like (AOT) or (TOD)
    if (tag) it.src = tag[1];
  }
  save("chronology-extended", days);
  console.log(`  extended items: ${n}`);
}

// ---- Cast of Characters -------------------------------------------------------------------------------------
{
  const lines = paged(read("Cowell103CastofCharacters"));
  const cast = []; let cur = null;
  for (const x of lines) {
    if (/^Cowell 103/.test(x.t)) continue;
    // "John Martino -" or "Rip Robertson-" on its own line, or "Name - text" with spaces around the dash
    const own = /^([A-Z][A-Za-z.’'“”"()/ ]{2,60}?)\s*[-–—]\s*$/.exec(x.t);
    const inline = /^([A-Z][A-Za-z.’'“”"()/]+(?: [A-Z(“"][A-Za-z.’'“”"()/]*){1,5}) [-–—] (.+)$/.exec(x.t);
    const m = own ? [own[0], own[1], ""] : inline;
    if (m && m[1].split(/\s+/).length <= 7) { cur = { name: clean(m[1]), page: x.page, text: m[2] }; cast.push(cur); }
    else if (cur) cur.text += " " + x.t;
  }
  for (const c of cast) c.text = clean(c.text);
  save("cast", cast);
}
