// Public sources for the chronology: each entry gets up to two links, a topical one (Wikipedia article on the
// person or event, or the report part that covers it) and an official report (topical, else chosen by period).
// Used by timeline.mjs; `node tools/timeline-cite.mjs` prints coverage and checks the Wikipedia titles exist.
import { pathToFileURL } from "node:url";
import { L } from "./cite.mjs";

// [pattern, Wikipedia title or null, official report key or null]. First match wins for each slot.
// Wikipedia titles checked against the API on 2026-10-13.
const RULES = [
  [/single[- ]bullet|magic bullet|CE ?399|stretcher bullet/i, "Single-bullet theory", "H1A"],
  [/Dictabelt|acoustic|police (tape|recording)|Channel (One|1|Two|2)\b/i, "John F. Kennedy assassination Dictabelt recording", "H1B"],
  [/autopsy|Bethesda|Humes|Boswell|Finck|X-rays?\b|brain|head wound|throat wound|back wound/i, "Autopsy of John F. Kennedy", "HV7"],
  [/Zapruder/, "Zapruder film", "HV6"],
  [/Parkland|Perry|McClelland|Kemp Clark|Carrico|Burkley/, "Parkland Memorial Hospital", "WR3"],
  [/Tippit|Benavides|Markham|Tenth Street|Patton/, "J. D. Tippit", "WR4"],
  [/Texas Theat|theater/i, "Texas Theatre", "WR4"],
  [/Ruby|Carousel/, "Jack Ruby", "WR5"],
  [/Mexico City|Duran|Kostikov|Soviet embassy|Cuban consulate/i, null, "LOPEZ"],
  [/AM\/?LASH|Cubela|poison pen/, "Rolando Cubela Secades", "CH5"],
  [/Mongoose|Lansdale/, "Operation Mongoose", "CHP"],
  [/Roselli|Giancana|Maheu|ZR\/?RIFLE|plots? (to|against) (kill|assassinate) Castro/i, "CIA assassination attempts on Fidel Castro", "CHP"],
  [/Bay of Pigs/, "Bay of Pigs Invasion", "CHP"],
  [/Marcello/, "Carlos Marcello", "HV9"],
  [/Trafficante/, "Santo Trafficante Jr.", "HV5"],
  [/Hoffa/, "Jimmy Hoffa", "H1C"],
  [/Ferrie/, "David Ferrie", "HV10"],
  [/Banister/, "Guy Banister", "HV10"],
  [/Garrison|Clay Shaw/, "Jim Garrison", null],
  [/Veciana|Maurice Bishop|Alpha 66/, "Antonio Veciana", "HV10"],
  [/David (Atlee )?Phillips/, "David Atlee Phillips", "HV10"],
  [/Odio/, "Silvia Odio", "WR6"],
  [/Morales/, "David Sánchez Morales", null],
  [/Hemming|Sturgis|Interpen|No Name Key/, "Frank Sturgis", "HV10"],
  [/\bDRE\b|Directorio|Joannides|Bringuier/, "Directorio Revolucionario Estudiantil", "HV10"],
  [/Fair Play|FPCC/, "Fair Play for Cuba Committee", "WR7"],
  [/Milteer/, null, "H1D"],
  [/Bolden/, "Abraham Bolden", null],
  [/Nagell/, "Richard Case Nagell", null],
  [/Nosenko/, "Yuri Nosenko", "H1C"],
  [/Angleton/, "James Jesus Angleton", "CH5"],
  [/Hosty/, "James P. Hosty", "H1D"],
  [/Mohrenschildt/, "George de Mohrenschildt", "WR7"],
  [/Marina/, "Marina Oswald Porter", "WR7"],
  [/Paine/, "Ruth Paine", "WR7"],
  [/General Walker|Edwin Walker|Walker shooting/, "Edwin Walker", "WR4"],
  [/Minsk|defect/i, "Lee Harvey Oswald", "WR7"],
  [/tramps/, "Three tramps", "H1A"],
  [/umbrella/i, "Umbrella man (JFK assassination)", null],
  [/Badge Man|Roscoe White/, "Badge Man", "HV6"],
  [/grassy knoll|picket fence|stockade fence|Bowers|S\. M\. Holland|railroad overpass/i, "Grassy knoll", "H1B"],
  [/Craig/, "Roger D. Craig", "WH"],
  [/Jean Hill/, "Jean Hill", "WH"],
  [/Brennan/, "Howard Brennan", "WR3"],
  [/Tague/, "James Tague", "WR3"],
  [/rifle|Carcano|Mannlicher|Mauser|Klein's|Hidell|cartridge|shells|paraffin/i, "Carcano", "WR4"],
  [/sixth floor|Depository|sniper/i, "Texas School Book Depository", "WR3"],
  [/Connally/, "John Connally", "WR3"],
  [/Kellerman|Greer|Clint Hill|Youngblood|Rowley|Behn|Secret Service/, "United States Secret Service", "WR2"],
  [/Air Force One|sworn in|oath of office|Love Field|Andrews (Air|AFB|Field)/, "Air Force One", "WR2"],
  [/motorcade|Dealey|Elm Street|Houston Street|Trade Mart|route/i, "Dealey Plaza", "WR2"],
  [/\b(Nix|Moorman|Altgens|Muchmore|Bronson|Hughes) (film|photo)|\bfilm\b|photograph/i, "Zapruder film", "HV6"],
  [/missile crisis|missiles in Cuba/i, "Cuban Missile Crisis", null],
  [/Curry|Fritz|interrogat|lineup|arraign|police (head)?quarters|City Hall/i, "Lee Harvey Oswald", "WR5"],
  [/Warren Commission|the Commission\b|Warren Report/, "Warren Commission", "WR"],
  [/\bHSCA\b|House (Select )?Committee|Blakey|Sprague|Fonzi/, "United States House Select Committee on Assassinations", "H1A"],
  [/Church Committee|Schweiker|Senate (Select )?(Intelligence )?Committee/, "Church Committee", "CH5"],
  [/Rockefeller Commission/, "Rockefeller Commission", null],
  [/Review Board|\bARRB\b|Records (Collection )?Act/, "Assassination Records Review Board", "ARRB"],
  [/Diem|Nhu\b/, "Arrest and assassination of Ngo Dinh Diem", null],
  [/NSAM ?263|withdraw(al)? .*Vietnam|Vietnam .*withdraw/i, "National Security Action Memorandum 263", null],
  [/NSAM ?273/, "National Security Action Memorandum 273", null],
  [/Vietnam|Saigon/, "Vietnam War", null],
  [/Attwood|rapprochement/i, "William Attwood", null],
  [/Khrushchev/, "Nikita Khrushchev", null],
  [/Northwoods/, "Operation Northwoods", null],
  [/Joint Chiefs|LeMay|Lemnitzer/, "Joint Chiefs of Staff", null],
  [/Dulles/, "Allen Dulles", null],
  [/Helms/, "Richard Helms", "CH5"],
  [/McCone/, "John A. McCone", "CH5"],
  [/FitzGerald/, "Desmond FitzGerald (CIA officer)", "CH5"],
  [/E\. Howard Hunt|Howard Hunt/, "E. Howard Hunt", null],
  [/H\. ?L\. Hunt|Murchison/, "H. L. Hunt", null],
  [/Katzenbach/, "Nicholas Katzenbach", "CH5"],
  [/Hoover/, "J. Edgar Hoover", "CH5"],
  [/Johnson .*\b(phones?|calls?|talks? (with|to))\b|telephone/, "Lyndon B. Johnson", "LBJ"],
  [/Robert Kennedy|Bobby|Attorney General/, "Robert F. Kennedy", null],
  [/Nixon/, "Richard Nixon", null],
  [/Johnson|LBJ/, "Lyndon B. Johnson", null],
  [/Castro|Cuba/, "Cuba–United States relations", "CHP"],
  [/\bCIA\b/, "Central Intelligence Agency", "CH5"],
  [/\bFBI\b/, "Federal Bureau of Investigation", "CH5"],
  [/Oswald/, "Lee Harvey Oswald", "WR7"],
];

// Official report by period, when no rule supplies one
const byDate = (d, text) =>
  d < "1960-01-01" ? "MFF"
  : d < "1963-11-22" ? (/Cuba|Castro/.test(text) ? "CHP" : "H1C")
  : d === "1963-11-22" ? "WR2"
  : d <= "1963-11-24" ? "WR5"
  : d < "1964-10-01" ? "WR"
  : d < "1976-01-01" ? "CH5"
  : d < "1980-01-01" ? "H1A"
  : d < "1992-01-01" ? "MFF"
  : "ARRB";

const wpUrl = t => "https://en.wikipedia.org/wiki/" + encodeURIComponent(t.replace(/ /g, "_"));
export const TITLES = [...new Set(RULES.map(r => r[1]).filter(Boolean))];

// entries: [id, date, time, page, text, ...] → { links: {key: [label, url]}, cites: [[key, key?], ...] }
export function citeTimeline(entries) {
  const links = {};
  const use = k => {
    if (!links[k]) links[k] = L[k] || (k.startsWith("wp:") && ["Wikipedia: " + k.slice(3), wpUrl(k.slice(3))]);
    if (!links[k]) throw new Error(`unknown source ${k}`);
    return k;
  };
  const cites = entries.map(([, date, , , text]) => {
    let w = null, o = null;
    for (const [re, wt, ok] of RULES) {
      if (!re.test(text)) continue;
      w ||= wt; o ||= ok;
      if (w && o) break;
    }
    return [w && use("wp:" + w), use(o || byDate(date, text))];
  }).map(c => c.filter(Boolean));
  return { links, cites };
}

// Self-check: coverage on the published timeline, and Wikipedia titles exist (not redirects to elsewhere-missing pages)
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { readFileSync } = await import("node:fs");
  const t = JSON.parse(readFileSync(new URL("../../jfk-hypotheses/data/timeline.json", import.meta.url), "utf8"));
  const { cites } = citeTimeline(t.entries);
  console.assert(cites.every(c => c.length >= 1 && c.length <= 2), "1-2 links per entry");
  console.log(`${cites.length} entries; ${cites.filter(c => c[0].startsWith("wp:")).length} with a Wikipedia article`);
  const missing = [];
  for (let i = 0; i < TITLES.length; i += 50) {
    const q = TITLES.slice(i, i + 50).join("|");
    const r = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&redirects=1&titles=${encodeURIComponent(q)}`,
      { headers: { "User-Agent": "jfk-hypotheses citation check (github.com/jc0h3n)" } }).then(r => r.json());
    for (const p of Object.values(r.query.pages)) if ("missing" in p) missing.push(p.title);
  }
  console.log(missing.length ? `MISSING Wikipedia titles: ${missing.join("; ")}` : `all ${TITLES.length} Wikipedia titles exist`);
}
