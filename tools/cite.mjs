// Replaces course-document citations in the published ACH matrices with public, linkable sources.
// node tools/cite.mjs [path to jfk-hypotheses]   Each evidence item gets source (text) and links [[label, url], ...].
import { readFileSync, writeFileSync } from "node:fs";

const out = process.argv[2] || new URL("../../jfk-hypotheses/", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
const NARA = "https://www.archives.gov/research/jfk";
const HM = "https://www.history-matters.com/archive/contents/hsca";
const wp = t => ["Wikipedia: " + t, "https://en.wikipedia.org/wiki/" + encodeURIComponent(t.replace(/ /g, "_"))];

// Public sources, each verified to resolve (HTTP 200) on 2026-10-06
const L = {
  WR: ["Warren Report", `${NARA}/warren-commission-report`],
  WR2: ["Warren Report ch. 2", `${NARA}/warren-commission-report/chapter-2.html`],
  WR3: ["Warren Report ch. 3", `${NARA}/warren-commission-report/chapter-3.html`],
  WR4: ["Warren Report ch. 4", `${NARA}/warren-commission-report/chapter-4.html`],
  WR5: ["Warren Report ch. 5", `${NARA}/warren-commission-report/chapter-5.html`],
  WR6: ["Warren Report ch. 6", `${NARA}/warren-commission-report/chapter-6.html`],
  WR7: ["Warren Report ch. 7", `${NARA}/warren-commission-report/chapter-7.html`],
  WRX: ["Warren Report app. X", `${NARA}/warren-commission-report/appendix-10.html`],
  WRXI: ["Warren Report app. XI", `${NARA}/warren-commission-report/appendix-11.html`],
  WRXII: ["Warren Report app. XII", `${NARA}/warren-commission-report/appendix-12.html`],
  WH: ["Warren Commission hearings and exhibits", "https://www.history-matters.com/archive/contents/wc/contents_wh.htm"],
  H1A: ["HSCA Report I.A", `${NARA}/select-committee-report/part-1a.html`],
  H1B: ["HSCA Report I.B", `${NARA}/select-committee-report/part-1b.html`],
  H1C: ["HSCA Report I.C", `${NARA}/select-committee-report/part-1c.html`],
  H1D: ["HSCA Report I.D", `${NARA}/select-committee-report/part-1d.html`],
  HV5: ["HSCA vol. 5", `${HM}/contents_hsca_vol5.htm`],
  HV6: ["HSCA vol. 6 (photographic panel)", `${HM}/contents_hsca_vol6.htm`],
  HV7: ["HSCA vol. 7 (medical panel)", `${HM}/contents_hsca_vol7.htm`],
  HV8: ["HSCA vol. 8 (acoustics; Ruby polygraph)", `${HM}/contents_hsca_vol8.htm`],
  HV9: ["HSCA vol. 9 (organized crime; Ruby)", `${HM}/contents_hsca_vol9.htm`],
  HV10: ["HSCA vol. 10 (anti-Castro activities)", `${HM}/contents_hsca_vol10.htm`],
  LOPEZ: ["HSCA Lopez Report (Mexico City)", "https://www.history-matters.com/archive/jfk/hsca/lopezrpt_2003/html/LopezRpt_0001a.htm"],
  CHP: ["Church Committee, Alleged Assassination Plots (1975)", "https://www.intelligence.senate.gov/sites/default/files/94465.pdf"],
  CH5: ["Church Committee Book V (1976)", "https://www.intelligence.senate.gov/sites/default/files/94755_V.pdf"],
  ARRB: ["ARRB Final Report (1998)", `${NARA}/review-board/report`],
  NAS: ["National Academies, Committee on Ballistic Acoustics (1982)", "https://nap.nationalacademies.org/catalog/10264/report-of-the-committee-on-ballistic-acoustics"],
  LBJ: ["Miller Center, Johnson telephone recordings", "https://millercenter.org/the-presidency/secret-white-house-tapes"],
  MFF: ["Mary Ferrell Foundation archive", "https://www.maryferrell.org/pages/JFK_Assassination.html"],
  REITZES: ["Reitzes, Skeptic 18.3 (2013)", "https://archive.skeptic.com/archive/reading_room/jfk-conspiracy-theories-at-50-how-the-skeptics-got-it-wrong-and-why-it-matters"],
};
const W = t => ({ wp: t });

// Evidence id → sources. Strings are keys in L; {wp} is a Wikipedia article (titles checked to exist).
const MAP = {
  a01: ["WR4", "REITZES"], a02: ["WR4", "H1A"], a03: ["WR4", "H1A", W("Single-bullet theory")], a04: ["WR4", "H1A"], a05: ["WR4"],
  a06: ["WR3", W("Howard Brennan")], a07: ["WR4", W("J. D. Tippit")], a08: ["WRXI", W("Lee Harvey Oswald")], a09: ["H1A", "HV7", W("Autopsy of John F. Kennedy")],
  a10: ["WR3", W("Autopsy of John F. Kennedy")], a11: ["REITZES"], a12: ["HV6", "HV7"], a13: ["ARRB", W("Autopsy of John F. Kennedy")], a14: [W("Autopsy of John F. Kennedy"), "ARRB"],
  a15: ["H1A", "REITZES"], a16: ["WR3", "REITZES"], a17: ["WH", W("Dealey Plaza")], a18: ["WR3"], a19: [W("Zapruder film")], a20: ["HV7", W("Zapruder film")],
  a21: ["H1B", "HV8", W("John F. Kennedy assassination Dictabelt recording")], a22: ["NAS", W("John F. Kennedy assassination Dictabelt recording")], a23: ["H1A", "HV6"],
  a24: ["WR3", "H1A"], a25: ["WR3", "H1A", W("Zapruder film")], a26: ["WR4"], a27: ["WR4", "HV6"], a28: ["WR4"], a29: ["WR4", W("Gunshot residue")], a30: ["WR3", W("James Tague")],
  a31: ["H1A", W("Three tramps")], a32: ["HV6", W("Badge Man")], a33: ["H1A", W("Umbrella man (JFK assassination)")], a34: ["ARRB", W("Single-bullet theory")],
  a35: ["WR4", "WH"], a36: ["WR4"], a37: ["WH", "MFF"], a38: ["WR4"], a39: ["WR4"], a40: ["WH", "MFF"], a41: ["WR4"], a42: ["WH", "MFF"], a43: ["WR4"],
  a44: ["WRX", W("Carcano")], a45: ["WRX"], a46: ["WR4", W("Carcano")], a47: ["ARRB", "MFF"], a48: ["WR4", "H1A"], a49: ["MFF", W("Lee Harvey Oswald")], a50: ["WR4"],
  a51: ["WH", W("Roger D. Craig")], a52: ["WR4"], a53: ["WR4"], a54: ["WR4"], a55: ["WR4", W("J. D. Tippit")], a56: ["WR4", "H1A"], a57: ["WR4"], a58: ["WR4"],
  a59: ["WRXI"], a60: ["WRXI"], a61: ["WR4"], a62: ["HV6"], a63: ["MFF"], a64: ["WR4", "MFF"], a65: ["WH", W("Marina Oswald Porter")], a66: ["WH", W("Dealey Plaza")],
  a67: ["WH", W("Jean Hill")], a68: ["WH", W("Autopsy of John F. Kennedy")], a69: ["ARRB", "HV7"], a70: ["ARRB", W("Autopsy of John F. Kennedy")], a71: ["WR3", W("Malcolm Perry")],
  a72: ["ARRB", "MFF"], a73: ["WH", "HV7"], a74: ["WH", W("Autopsy of John F. Kennedy")], a75: ["ARRB"], a76: ["ARRB"], a77: ["ARRB", "HV7"], a78: ["ARRB", "MFF"],
  a79: ["HV7", "MFF"], a80: ["WH", W("Single-bullet theory")], a81: ["MFF", W("Single-bullet theory")], a82: ["H1A", W("Single-bullet theory")], a83: ["WH", "MFF"],
  a84: [W("SS-100-X")], a85: ["WR2", "WH"], a86: ["HV7"], a87: [W("Zapruder film")], a88: [W("Zapruder film")], a89: [W("Zapruder film")], a90: ["MFF"], a91: ["MFF"], a92: ["MFF"],
  a93: ["WR3", W("Howard Brennan")], a94: ["WH", "WR3"], a95: ["HV6"], a96: ["WR4"], a97: ["WR7"], a98: ["WR4", "WH"], a99: ["MFF"], a100: ["MFF"],
  a101: ["H1B", "HV8"], a102: ["WR", "H1A"], a103: [W("Nicholas Katzenbach"), "CH5"], a104: ["LBJ", "CH5"], a105: ["NAS", "HV8"], a106: ["WRXI", "WR5"],
  b01: ["WR7", "REITZES"], b02: ["H1C", "REITZES"], b03: ["WR7", W("Fair Play for Cuba Committee")], b04: ["HV10", W("Guy Banister")], b05: ["H1C", "HV10", W("David Ferrie")],
  b06: ["WR6", "HV10", W("Silvia Odio")], b07: ["LOPEZ", "H1C"], b08: ["LOPEZ", "ARRB"], b09: ["LOPEZ", W("Lee Harvey Oswald")], b10: ["WR6", "LOPEZ"], b11: ["CH5", "H1C"],
  b12: ["CHP", W("Operation Mongoose")], b13: ["CH5", W("Rolando Cubela Secades")], b14: ["CH5"], b15: ["H1C"], b16: ["H1C", "HV9", W("Carlos Marcello")], b17: ["H1C", "HV5", W("Santo Trafficante Jr.")],
  b18: ["H1C", "HV9", W("Jack Ruby")], b19: ["WR5", "REITZES"], b20: ["WR5", "H1C"], b21: ["WH", W("Jack Ruby")], b22: ["HV10"], b23: [W("Abraham Bolden"), "ARRB"], b24: [W("James P. Hosty"), "H1D"],
  b25: [W("Allen Dulles"), W("Warren Commission")], b26: ["CH5", "REITZES"], b27: [W("National Security Action Memorandum 263")], b28: [W("National Security Action Memorandum 263"), "REITZES"],
  b29: [W("Operation Northwoods"), "ARRB"], b30: [W("Curtis LeMay")], b31: [W("Clay Shaw"), W("Jim Garrison")], b32: [W("Clay Shaw"), "ARRB"], b33: [W("E. Howard Hunt")],
  b34: ["REITZES", W("John F. Kennedy assassination conspiracy theories")], b35: ["H1C", "MFF"], b36: [W("Yuri Nosenko"), "H1C"], b37: ["REITZES"], b38: [W("John F. Kennedy assassination conspiracy theories")],
  b39: ["LBJ", W("Lyndon B. Johnson")], b40: ["ARRB", W("President John F. Kennedy Assassination Records Collection Act of 1992")],
  b41: ["WR5", W("Jack Ruby")], b42: ["WR5", "H1C"], b43: ["WR5", "H1C"], b44: ["WR5", "H1C"], b45: ["WH", W("Jack Ruby")], b46: ["WR5"], b47: ["WR5"], b48: ["WH", "MFF"],
  b49: [W("John Roselli"), "H1C"], b50: ["HV8"], b51: ["HV9", "MFF"], b52: ["HV9", "H1C"], b53: [W("Frank Ragano"), W("Santo Trafficante Jr.")], b54: [W("Carlos Marcello"), W("David Ferrie")],
  b55: [W("David Ferrie"), "HV10"], b56: [W("David Ferrie"), "HV10"], b57: [W("David Ferrie"), "HV10"], b58: ["HV10", "H1C"], b59: [W("Guy Banister")], b60: ["H1D", "MFF"],
  b61: [W("Jimmy Hoffa"), "H1C"], b62: [W("Robert F. Kennedy")], b63: [W("Robert F. Kennedy")], b64: [W("John Garrett Underhill Jr.")], b65: [W("Desmond FitzGerald (CIA officer)"), "CH5"],
  b66: ["CH5", "LOPEZ"], b67: ["LOPEZ", "LBJ"], b68: ["LOPEZ", "ARRB"], b69: ["LOPEZ"], b70: [W("David Atlee Phillips"), "LOPEZ"], b71: [W("Antonio Veciana"), "HV10"],
  b72: [W("George Joannides"), W("Directorio Revolucionario Estudiantil"), "ARRB"], b73: [W("William King Harvey"), "CHP"], b74: [W("David Sánchez Morales")], b75: ["HV10", "MFF"],
  b76: [W("Manuel Artime"), "CH5"], b77: ["H1C", "MFF"], b78: ["WR6", "HV10", W("Silvia Odio")], b79: ["HV10", "MFF"], b80: [W("Abraham Bolden")], b81: ["MFF"],
  b82: ["CH5", "H1C", W("Fidel Castro")], b83: ["MFF"], b84: ["H1C"], b85: ["WR6"], b86: ["LOPEZ", "H1C"], b87: ["MFF", "CH5"], b88: [W("Yuri Nosenko"), "H1C"],
  b89: ["MFF"], b90: ["MFF"], b91: ["H1C", "MFF"], b92: ["LBJ", W("Warren Commission")], b93: ["LBJ", "MFF"], b94: [W("Nicholas Katzenbach"), "CH5"], b95: ["CH5", W("J. Edgar Hoover")],
  b96: ["CH5", "MFF"], b97: ["LBJ"], b98: [W("Lyndon B. Johnson")], b99: [W("National Security Action Memorandum 273")], b100: [W("Richard Russell Jr."), W("Warren Commission")],
  b101: [W("John Whitten"), "ARRB"], b102: ["MFF", "ARRB"], b103: [W("James P. Hosty"), "H1D"], b104: ["WH", "MFF"], b105: ["H1D", "MFF"], b106: [W("Lee Harvey Oswald"), "WR7"],
  b107: [W("H. L. Hunt"), "MFF"], b108: ["HV7", "ARRB"], b109: [W("Curtis LeMay")], b110: ["H1D", "WR2"], b111: [W("Warren Commission"), W("Gerald Ford")],
  b112: ["REITZES", W("John F. Kennedy assassination conspiracy theories")],
};

const COURSE = /Syllabus|Sheehan Chron|Ext\. Chron|\bCast\b|Polinode|\bCourse\b/;
// Citations replaced by the links above, or too vague to help a reader
const DROP = /^(WR|HSCA|ARRB|NAS|Church|Reitzes|Zapruder film$|later released CIA records$|Declassified by the Assassination Records Review Board|AP interview \(Daniel Harker\)$)/;
const LABELS = new Set(Object.values(L).map(l => l[0]));
// Notes that pointed readers to the course documents
const NOTE_FIX = [
  [/ \(Syllabus App\. V, "Planted-Rifle Theory"\)/, ""],
  [/ \(Syllabus App\. V, "Planted-Bullet Theory"\)/, ""],
  [/ \(Syllabus p\. 14\)/, ""],
  [/a planned exit \(Syllabus\)/, "a planned exit (John Newman, JFK and Vietnam)"],
];
for (const f of ["a-who-fired", "b-who-was-behind-it"]) {
  const path = `${out}/analyses/${f}.json`;
  const a = JSON.parse(readFileSync(path, "utf8"));
  for (const e of a.evidence) {
    const keys = MAP[e.id];
    if (!keys) throw new Error(`no citation mapped for ${e.id}`);
    const links = [...new Map(keys.map(k => typeof k === "string" ? L[k] : wp(k.wp)).map(l => [l[1], l])).values()];
    if (links.some(l => !l)) throw new Error(`bad key in ${e.id}`);
    // Keep any non-course citations already present (books, the official record), drop the course documents.
    // (Re-running is safe: labels written by an earlier run are recognized and rebuilt.)
    const kept = e.source.split(/;\s*/).filter(s => s && !COURSE.test(s) && !DROP.test(s) && !LABELS.has(s) && !s.startsWith("Wikipedia, "));
    for (const [re, to] of NOTE_FIX) e.notes = e.notes.replace(re, to);
    e.links = links;
    e.source = [...links.map(l => l[0].replace(/^Wikipedia: /, "Wikipedia, ")), ...kept].join("; ");
  }
  a.updated = new Date().toISOString();
  writeFileSync(path, JSON.stringify(a, null, 1) + "\n");
  const left = a.evidence.filter(e => COURSE.test(e.source) || COURSE.test(e.notes)).length;
  console.log(`${f}: ${a.evidence.length} items cited${left ? `, ${left} still cite course documents` : ""}`);
}
export { L, MAP };
