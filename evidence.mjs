// The two JFK analyses: hypotheses and evidence, in plain data. `node build.mjs` turns this into Open ACH files.
// IDs are stable so evidence can be added later without disturbing ratings already made.
//
// Evidence fields: [id, text, type, source, date, credibility, relevance, notes]
//   type: Fact | Report | Assumption | Absence of evidence | Argument
//   credibility / relevance: L | M | H (see METHOD.md for how these were set; adjust freely)
// Ratings are left blank on purpose: rating every cell is the analyst's job.
//
// Source shorthand (full list in SOURCES.md):
//   Syllabus = Sheehan, Cowell 103 course syllabus (146 pp.); page numbers are PDF pages
//   Sheehan Chron. = Sheehan, JFK Chronology; Ext. Chron. = Extended Chronology (PDF pages)
//   Reitzes = David Reitzes, "JFK Conspiracy Theories at 50," Skeptic 18:3 (2013), article pages 1–16
//   WR = Warren Commission Report (1964); HSCA = House Select Committee on Assassinations, Final Report (1979)
//   NAS = National Academy of Sciences, Report of the Committee on Ballistic Acoustics (1982)
//   Church = Senate Select (Church) Committee: Alleged Assassination Plots (1975) and Book V (1976)

export const WHO_FIRED = {
  slug: "a-who-fired",
  title: "JFK (A): Who fired the shots?",
  question: "Who fired the shots that struck President Kennedy and Governor Connally in Dealey Plaza on November 22, 1963?",
  hypotheses: [
    ["ha1", "Oswald alone fired all the shots, from the Book Depository's sixth floor", "Course Thesis 1 (lone gunman), as concluded by the Warren Commission."],
    ["ha2", "Oswald fired, and at least one other gunman also fired (for example from the grassy knoll)", "The HSCA's 1979 conclusion (four shots, one from the knoll, which missed) and many conspiracy theses."],
    ["ha3", "Oswald fired no shots; he was set up as the fall guy", "Oswald's own claim (\"I'm just a patsy\"); the planted-rifle, planted-bullet and impersonator theories (Syllabus, Appendix V)."]
  ],
  evidence: [
    ["a01", "A Mannlicher-Carcano rifle (C2766) was found hidden among boxes on the sixth floor; it had been mail-ordered under the alias \"A. Hidell\" to Oswald's post office box, and handwriting experts matched the order form to Oswald.", "Fact", "WR ch. 4; Reitzes p. 11", "1963-11-22", "H", "H", "Critics argue the rifle was planted (Syllabus App. V, \"Planted-Rifle Theory\"); early reports called it a Mauser."],
    ["a02", "Three spent cartridge cases found by the sixth-floor southeast window were matched to that rifle to the exclusion of all other weapons.", "Fact", "WR ch. 4; Reitzes pp. 10–11", "1963-11-22", "H", "H", ""],
    ["a03", "A nearly whole bullet (CE 399, found on a Parkland stretcher) and the two largest fragments from the limousine were matched to the rifle.", "Fact", "WR ch. 4; Reitzes p. 11", "1963-11-22", "H", "H", "Chain of custody of CE 399 is disputed by critics (Syllabus App. V, \"Planted-Bullet Theory\")."],
    ["a04", "Oswald's palm print was reported on the rifle's barrel, and prints on the trigger housing were later attributed to him.", "Report", "WR; Reitzes p. 11", "1963-11-22", "M", "H", "The palm print was lifted by Dallas police and not seen by the FBI at first; critics question when it was taken."],
    ["a05", "Boxes were stacked into a sniper's perch at the southeast window, screened from the rest of the floor; Oswald's prints were on boxes there.", "Fact", "WR; Reitzes p. 10", "1963-11-22", "H", "M", "Oswald worked on that floor, which can explain prints on boxes."],
    ["a06", "Witness Howard Brennan saw a man fire a rifle from the sixth-floor southeast window; his later identification of Oswald was hesitant.", "Report", "WR", "1963-11-22", "M", "H", ""],
    ["a07", "Oswald left the Book Depository within minutes of the shooting; about 45 minutes later Officer J.D. Tippit was shot, witnesses identified Oswald, shells at the scene matched the revolver Oswald carried when arrested in the Texas Theatre.", "Fact", "WR; Reitzes p. 11; Syllabus p. 67", "1963-11-22", "H", "M", "Bears on consciousness of guilt rather than directly on who fired in Dealey Plaza."],
    ["a08", "Oswald denied shooting anyone and called himself \"just a patsy\"; there are no recordings or transcripts of his roughly 12 hours of questioning.", "Report", "Syllabus pp. 2–3; Reitzes p. 11", "1963-11-22", "H", "M", "Credibility here is that he said it, not that it is true."],
    ["a09", "The autopsy found the President was struck by two bullets from above and behind; review panels in 1968 (Clark), 1975 (Rockefeller) and 1978 (HSCA forensic pathology panel, 8 of 9, Wecht dissenting) agreed.", "Report", "Reitzes p. 11; HSCA", "1963-11-22", "H", "H", ""],
    ["a10", "Parkland Hospital doctors and nurses described the throat wound as an entrance and a large wound at the back of the head, observations that suggest a shot from the front.", "Report", "Reitzes p. 3; Syllabus pp. 2, 123", "1963-11-22", "M", "H", "They were treating the President, not examining the wounds forensically; their accounts conflict with each other."],
    ["a11", "A 1993 JAMA study found trauma specialists misjudged gunshot wounds (entrance vs. exit, number of bullets) in 52% of fatal cases compared with forensic pathologists.", "Fact", "Reitzes p. 3", "1993", "M", "M", "General reliability evidence; bears on how much weight a10 deserves."],
    ["a12", "The HSCA's photographic panel tested the autopsy photographs and X-rays and the \"backyard\" photographs for fakery and found none.", "Report", "Reitzes p. 11; HSCA", "1978", "H", "H", "Directly contrary to body- and photo-alteration claims (Thesis 7)."],
    ["a13", "FBI agents Sibert and O'Neill, present at the Bethesda autopsy, wrote that there had been \"surgery of the head area\" before the autopsy began.", "Report", "Syllabus p. 123 n. 137", "1963-11-22", "M", "H", "The foundation of David Lifton's body-alteration thesis (Thesis 7). Others read it as recording a pathologist's first impression."],
    ["a14", "Lifton's thesis: the President's wounds were altered before the autopsy to hide shots from the front.", "Argument", "Syllabus p. 30 (Thesis 7); Lifton, Best Evidence", "1980", "L", "H", "An inference from a13 and the Parkland accounts, not independent evidence."],
    ["a15", "Of witnesses who gave an opinion, 81% heard three shots, 12% two, 5% four or more.", "Report", "Reitzes p. 2", "1963-11-22", "M", "M", ""],
    ["a16", "Witnesses disagreed about where the shots came from, but very few said they came from more than one direction; Dealey Plaza's buildings produce strong echoes.", "Report", "Reitzes pp. 2–3", "1963-11-22", "M", "H", ""],
    ["a17", "Some witnesses reported shots or smoke near the grassy knoll, and people and police ran toward the stockade fence after the shooting.", "Report", "Reitzes pp. 1–2, 10; Syllabus", "1963-11-22", "M", "H", "No one reported actually seeing a gunman there (Reitzes p. 10)."],
    ["a18", "A search of the grassy knoll and stockade fence area found no weapon, shells or suspect.", "Absence of evidence", "Reitzes p. 10", "1963-11-22", "M", "H", ""],
    ["a19", "The Zapruder film shows the President's head moving back and to the left after the fatal shot.", "Fact", "Zapruder film; Reitzes p. 5", "1963-11-22", "H", "H", ""],
    ["a20", "Rockefeller Commission medical experts (1975) and the HSCA panel attributed the backward motion to a neuromuscular reaction, and noted a brief forward head movement between frames 312 and 313.", "Report", "Reitzes pp. 5–6", "1975", "M", "H", "Directly addresses how much weight a19 should carry."],
    ["a21", "HSCA acoustics consultants concluded from a police Dictabelt recording that four shots were fired, one from the grassy knoll (\"95 percent\" probability).", "Report", "Syllabus pp. 14, 81; HSCA", "1978-12-29", "M", "H", "The HSCA's \"probable conspiracy\" finding rested on this; three committee members dissented (Syllabus p. 14)."],
    ["a22", "The National Academy of Sciences' Ramsey Panel found the Dictabelt sounds were recorded about a minute after the shooting and were not gunshots; the FBI and Justice Department also disputed the HSCA analysis. A later reanalysis (Donald Thomas) disputes the NAS.", "Report", "NAS 1982; Reitzes p. 6; Syllabus p. 14", "1982", "H", "H", ""],
    ["a23", "The HSCA's photogrammetry (20-expert panel) and trajectory analysis (NASA engineer Thomas Canning) supported the single-bullet explanation; later 3D reconstructions agreed.", "Report", "Reitzes p. 12; HSCA", "1978", "M", "H", "The single-bullet explanation is what makes one gunman's timing possible."],
    ["a24", "Governor and Mrs. Connally testified in 1964 and again in 1978 that he was hit by a separate bullet from the one that first hit the President.", "Report", "Syllabus p. 81", "1978-09-06", "M", "H", "Honest eyewitness belief; whether a wounded man can time his own wound is the question."],
    ["a25", "The Zapruder film limits all the shots to a few seconds; the Warren Commission and HSCA judged three shots from the bolt-action rifle feasible in that time, which critics dispute.", "Argument", "WR; HSCA; Syllabus App. V", "1964", "M", "H", ""],
    ["a26", "Oswald qualified as a \"sharpshooter\" (1956) and later \"marksman\" (1959) in the Marine Corps.", "Fact", "WR", "1959", "H", "M", ""],
    ["a27", "Marina Oswald testified that she took the \"backyard\" photographs of Oswald holding the rifle and revolver.", "Report", "WR; Reitzes p. 11", "1963", "M", "M", "Question 6 asks whether these were faked; see a12."],
    ["a28", "Marina Oswald testified, supported by documents, that Oswald fired at Gen. Edwin Walker in April 1963.", "Report", "Reitzes p. 12; WR", "1963-04-10", "M", "M", "Shows willingness and ability to attempt a rifle shooting."],
    ["a29", "Dallas police paraffin tests were positive on Oswald's hands and negative on his cheek; the test is unreliable and the Warren Commission did not rely on it.", "Report", "Syllabus p. 4", "1963-11-22", "L", "L", ""],
    ["a30", "James Tague was slightly wounded by a fragment or ricochet near the triple underpass, showing that at least one shot missed or broke up.", "Fact", "Syllabus p. 2", "1963-11-22", "H", "M", ""],
    ["a31", "The \"three tramps\" taken from a boxcar near the knoll were identified from Dallas police files released in 1989 as transients Doyle, Abrams and Gedney.", "Fact", "Reitzes p. 4", "1989", "H", "L", "Rules out the identifications as Hunt, Sturgis or Harrelson (Question 8)."],
    ["a32", "Figures \"found\" in enlargements of the Moorman photo (\"Badge Man\" and others) were judged photographic artifacts; Lifton himself concluded enlargements had very limited value.", "Report", "Reitzes pp. 3–4", "1988", "M", "M", ""],
    ["a33", "The \"Umbrella Man\" was identified as Louie Steven Witt, who testified to the HSCA that the umbrella was a political protest.", "Fact", "Reitzes pp. 4–5", "1978", "H", "L", ""],
    ["a34", "Critics document chain-of-custody gaps and handling problems in key exhibits (the stretcher bullet, the palm print, the autopsy materials).", "Argument", "Syllabus App. V; Reitzes p. 11", "", "M", "M", "Bears on whether a01–a04 could have been planted."]
  ]
};

export const WHO_BEHIND = {
  slug: "b-who-was-behind-it",
  title: "JFK (B): Who was behind the assassination?",
  question: "Who, if anyone, planned or directed the assassination of President Kennedy?",
  hypotheses: [
    ["hb1", "No one: Oswald acted alone", "Course Thesis 1; the Warren Commission."],
    ["hb2", "Organized crime (Marcello, Trafficante, Giancana), possibly using anti-Castro Cubans", "Course Theses 3 (HSCA / Blakey & Billings) and 6 (Trafficante's \"S-Force\")."],
    ["hb3", "Elements of the CIA, working with anti-Castro Cuban exiles", "Course Theses 2 (the CIA) and 4 (Garrison's case against Clay Shaw)."],
    ["hb4", "Fidel Castro's Cuba, in retaliation for U.S. plots against Castro", "Course Thesis 5 (the Roselli \"backfire\" theory)."],
    ["hb5", "The Soviet KGB", "Course Thesis 9."],
    ["hb6", "U.S. military leaders (LeMay and the Joint Chiefs)", "Course Thesis 8 (\"Seven Days in May\")."],
    ["hb7", "A coalition of establishment, intelligence, military and organized-crime figures acting together (\"Rulers of the Realm\")", "Course Thesis 10 (Sheehan & Billings). The syllabus doesn't spell this thesis out; this wording is inferred from the course's Polinode network (\"ROTR Test 4\"). Correct it from class notes."]
  ],
  evidence: [
    ["b01", "Oswald was a self-professed Marxist who defected to the USSR in 1959 and returned in 1962; documents and testimony show a troubled history, contempt for the U.S. system, violence toward his wife, and an attempt to shoot Gen. Walker.", "Report", "Reitzes pp. 6–7, 12; WR", "1959–1963", "H", "H", ""],
    ["b02", "Despite decades of scrutiny, no money, payments or handlers tying Oswald to any group have been documented; researcher Harold Weisberg said he \"never had an extra penny.\"", "Absence of evidence", "Reitzes p. 8", "", "M", "H", ""],
    ["b03", "Oswald's New Orleans Fair Play for Cuba Committee chapter was a one-man operation using documents he made himself; other leftists kept their distance from him.", "Fact", "Reitzes p. 7", "1963-08", "H", "M", ""],
    ["b04", "Some of Oswald's pro-Castro leaflets were stamped 544 Camp Street, the building that housed former FBI agent Guy Banister's office, a hub of anti-Castro activity.", "Fact", "Syllabus p. 54; Sheehan Chron. p. 17", "1963-08", "H", "H", "Whether Oswald actually worked out of that building is disputed."],
    ["b05", "The HSCA concluded Oswald was likely seen with David Ferrie, and probably Guy Banister, in Clinton, Louisiana, in late summer 1963.", "Report", "Syllabus p. 58; HSCA", "1963-08", "M", "H", "Ferrie and Banister were anti-Castro activists; Ferrie also worked for Carlos Marcello's lawyer."],
    ["b06", "Silvia Odio reported that in late September 1963 three men, one introduced as \"Leon Oswald,\" an ex-Marine, visited her seeking help for anti-Castro activities; the HSCA found her account credible.", "Report", "Sheehan Chron. pp. 23, 34; HSCA", "1963-09", "M", "H", "The Warren Commission doubted the timing because Oswald was believed to be traveling to Mexico."],
    ["b07", "CIA records show Oswald (or someone using his name) contacted Soviet vice consul Valery Kostikov in Mexico City; Kostikov was suspected of belonging to the KGB department responsible for sabotage and assassination.", "Report", "Syllabus pp. 62–63", "1963-09-28", "M", "H", ""],
    ["b08", "There are unresolved questions about the Mexico City visit: whether recorded calls were really Oswald, and why CIA reporting at the time omitted details (the HSCA's Lopez Report).", "Report", "Syllabus pp. 12, 62–63", "1963-10", "M", "M", ""],
    ["b09", "CIA headquarters' October 1963 response about Oswald omitted recent information it had on file (his New Orleans activities); a signer later told researcher John Newman she was signing off on something she knew was not accurate.", "Report", "Syllabus p. 62 n. 112", "1963-10-10", "M", "M", ""],
    ["b10", "The Cuban consulate refused Oswald a visa, and a staffer told him someone like him could only harm the revolution.", "Report", "Reitzes p. 7", "1963-09-27", "M", "M", ""],
    ["b11", "On September 7, 1963, Castro publicly warned that U.S. leaders aiding plans to eliminate Cuban leaders would themselves not be safe.", "Fact", "AP interview (Daniel Harker); HSCA", "1963-09-07", "H", "M", ""],
    ["b12", "The CIA plotted with Mafia figures Johnny Roselli, Sam Giancana and Santo Trafficante to assassinate Castro (1960–63), as part of a wider covert war against Cuba (Operation Mongoose).", "Fact", "Church 1975; Syllabus pp. 39, 42, 47", "1960–1963", "H", "H", "Gives several groups both motive and capability; also gives Castro a motive."],
    ["b13", "On the day of the assassination, a CIA officer met Cuban official Rolando Cubela (AMLASH) and offered him a poison device for use against Castro.", "Fact", "Church 1976 (Book V)", "1963-11-22", "H", "M", ""],
    ["b14", "The CIA and FBI did not tell the Warren Commission about the plots against Castro; the Church Committee found both agencies' investigations deficient.", "Report", "Syllabus p. 12; Church 1976", "1976", "H", "H", "Withholding can protect operations or hide involvement; the inference is the analyst's."],
    ["b15", "The HSCA concluded the Soviet and Cuban governments, organized crime as a group, and anti-Castro groups as groups were not involved, but could not rule out individual members.", "Report", "Syllabus p. 13; HSCA", "1979", "M", "H", ""],
    ["b16", "Carlos Marcello allegedly threatened the President in 1962 (the Ed Becker account); the HSCA found Marcello had motive, means and opportunity but no direct evidence of involvement.", "Report", "HSCA; Syllabus p. 89 (Davis, Mafia Kingfish)", "1962", "L", "M", "Becker's account is single-sourced and was told years later."],
    ["b17", "Santo Trafficante allegedly said in 1962 that Kennedy was \"going to be hit\" (the Jose Aleman account); Aleman qualified his account before the HSCA.", "Report", "HSCA", "1962", "L", "M", ""],
    ["b18", "Jack Ruby made phone calls to mob-connected figures in the months before the assassination; testimony links many of them to his dispute with the corruption-ridden variety artists' union (AGVA).", "Report", "Reitzes p. 10", "1963", "M", "M", ""],
    ["b19", "People who knew Ruby, including Dallas police intelligence and his prosecutor, described a volatile, talkative police groupie, not a mob operative; evidence at his trial showed organic brain damage.", "Report", "Reitzes pp. 9–10", "1964", "M", "M", ""],
    ["b20", "Ruby shot Oswald in the Dallas police basement on November 24 during a transfer, ending any chance of a trial; how he got into the basement is disputed.", "Fact", "Ext. Chron. p. 20; WR; HSCA", "1963-11-24", "H", "H", ""],
    ["b21", "In June 1964 Ruby begged Earl Warren to take him to Washington so he could tell the truth; Warren declined.", "Report", "Syllabus p. 70", "1964-06-07", "M", "M", "Ruby's mental state by then is part of the question."],
    ["b22", "Rose Cheramie, a drug-addicted woman injured on a Louisiana highway, told a state police lieutenant on November 20 that two men she traveled with planned to kill Kennedy in Dallas.", "Report", "Syllabus p. 66", "1963-11-20", "L", "M", "Single account through the officer, never independently corroborated."],
    ["b23", "Secret Service agent Abraham Bolden says a plot to shoot the President in Chicago in early November 1963 was reported and handled without written records.", "Report", "Ext. Chron. p. 1; Syllabus p. 89 (Bolden)", "1963-11-01", "L", "M", "No records of the plot exist."],
    ["b24", "Oswald left a note for FBI agent James Hosty at the Dallas office weeks before the assassination; after the assassination it was destroyed on the special agent in charge's order, a fact not revealed until 1975.", "Fact", "Ext. Chron. p. 14", "1963-11", "H", "M", "Hosty testified the note complained about visits to his wife; its true content can't be checked."],
    ["b25", "Allen Dulles, the CIA director Kennedy replaced after the Bay of Pigs, served on the Warren Commission; he was recommended by Robert Kennedy.", "Report", "Reitzes p. 8", "1963-11", "M", "L", ""],
    ["b26", "Kennedy's relationship with the CIA was repaired after the Bay of Pigs; weeks before his death he publicly defended the agency. The quote about splintering the CIA \"into a thousand pieces\" is anonymously sourced.", "Report", "Reitzes pp. 7–8", "1963", "M", "M", ""],
    ["b27", "NSAM 263 (October 11, 1963) approved withdrawing 1,000 U.S. advisers from Vietnam by the end of 1963, conditional on progress.", "Fact", "Syllabus p. 62; Reitzes p. 8", "1963-10-11", "H", "M", "Read as a planned exit (Syllabus) or as leverage on Diem (Reitzes, quoting Karnow)."],
    ["b28", "In public through November 22, 1963, Kennedy said the U.S. should stay in Vietnam; aides later recalled private talk of withdrawal (O'Donnell, Morse, Forrestal; \"Vietnam is not worth another American life\").", "Report", "Reitzes pp. 8–9; Syllabus p. 66", "1963", "M", "M", "Recollections came years later and may be colored by politics (Reitzes p. 9)."],
    ["b29", "In 1962 the Joint Chiefs proposed Operation Northwoods, staged incidents to justify war with Cuba; Kennedy's administration rejected it.", "Fact", "Declassified by the Assassination Records Review Board (1997)", "1962-03-13", "H", "M", "Shows hostility and willingness at the top of the military, not involvement in 1963."],
    ["b30", "The claim that Gen. Curtis LeMay ordered the assassination or attended the autopsy is raised in the course but not documented in its materials.", "Report", "Syllabus p. 34 (Question 15)", "", "L", "M", ""],
    ["b31", "Jim Garrison prosecuted Clay Shaw for conspiracy; the jury acquitted him in March 1969.", "Fact", "Syllabus pp. 10, 25, 72", "1969-03-01", "H", "M", ""],
    ["b32", "Clay Shaw had been a source for the CIA's Domestic Contact Service in the 1950s, something he denied at trial.", "Report", "HSCA; later released CIA records", "1950s", "M", "M", "Domestic contacts were common among internationally active businessmen."],
    ["b33", "E. Howard Hunt, late in life, told his son of a CIA-linked plot (the \"Big Event\").", "Report", "Syllabus p. 5", "2007", "L", "M", "Hunt gave differing accounts at different times."],
    ["b34", "Years later the KGB forged documents tying Oswald to the CIA as disinformation.", "Report", "Reitzes p. 7", "1970s", "M", "M", ""],
    ["b35", "Days before the assassination the Soviet embassy received a crude letter signed \"Lee H. Oswald\" that seemed to implicate the USSR; Soviet officials treated it as a forgery or provocation.", "Report", "Syllabus p. 13", "1963-11-18", "M", "M", ""],
    ["b36", "KGB defector Yuri Nosenko said the KGB took no interest in Oswald and judged him unstable; the CIA confined and questioned Nosenko for years before accepting him as genuine.", "Report", "Syllabus p. 70; Reitzes pp. 6–7", "1964-02-04", "M", "H", ""],
    ["b37", "After the assassination Soviet propaganda blamed a right-wing cabal; Jacqueline Kennedy lamented that her husband was killed by \"some silly little Communist.\"", "Report", "Reitzes pp. 6–7", "1963-11", "M", "L", ""],
    ["b38", "Thesis 10's network maps long-running ties among financiers, intelligence officers, military figures and organized-crime and exile operatives.", "Argument", "Course Polinode network \"ROTR Test 4\"", "", "L", "M", "Connections show who knew whom, not who did what."],
    ["b39", "President Johnson pressed the Dallas police to end their investigation and leave it to the FBI.", "Report", "Syllabus p. 5", "1963-11", "L", "M", "Single-sourced in a secondary primer; could reflect a wish to close down rumors of a foreign plot."],
    ["b40", "Record releases under the 1992 JFK Records Act and by the Review Board (1998) exposed agency secrecy and withheld information but no document showing who, if anyone, directed the assassination.", "Absence of evidence", "Syllabus p. 14; ARRB Final Report (1998)", "1998", "M", "H", "Researchers disagree on what the later releases mean."]
  ]
};
