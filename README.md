# JFK ACH

An Analysis of Competing Hypotheses on the assassination of President John F. Kennedy, built for use with [Open ACH](https://jc0h3n.github.io/open-ach/) and drawn from the Cowell 103 course materials (*The Alternative Theories of the Assassination of President John F. Kennedy & the Implications of Each*) and the official record.

## Two matrices

The course's ten theses overlap (some are about *who fired*, some about *who was behind it*, and Lifton's is about whether the evidence was altered). ACH works best when hypotheses exclude each other, so the analysis is split in two:

- **A. Who fired the shots?** (34 evidence items) Oswald alone; Oswald plus another gunman; Oswald not a shooter (framed).
- **B. Who was behind it?** (40 evidence items) No one (Oswald alone); organized crime; CIA elements with Cuban exiles; Castro's Cuba; the KGB; U.S. military leaders; a "Rulers of the Realm" coalition.

| Course thesis | Where it lives |
|---|---|
| 1. Lone gunman | A: Oswald alone; B: No one |
| 2. The CIA | B: CIA elements |
| 3. HSCA "probable conspiracy" / Blakey & Billings: the Mob | A: Oswald plus another gunman; B: organized crime |
| 4. Garrison / Clay Shaw | B: CIA elements (evidence b04–b05, b31–b32) |
| 5. Castro "backfire" | B: Castro's Cuba |
| 6. Trafficante's "S-Force" | B: organized crime |
| 7. Lifton, *Best Evidence* | A: tested as evidence (a12–a14) bearing on all three |
| 8. Military coup | B: U.S. military leaders |
| 9. The KGB | B: the KGB |
| 10. Rulers of the Realm | B: coalition (definition inferred; see the hypothesis note) |

## Using it

1. Open [Open ACH](https://jc0h3n.github.io/open-ach/) and choose **Open a file**.
2. Open `analyses/a-who-fired.json`, then `analyses/b-who-was-behind-it.json`.
3. **Rate every cell yourself.** Work across each row, rating one item against every hypothesis. The ratings are deliberately blank: they are the analysis, and the thesis is yours.
4. Adjust credibility and relevance where you disagree; they are starting points (see [METHOD.md](METHOD.md)).
5. Add evidence as the course goes on, and write the conclusion and milestones.
6. Export your work from Open ACH as JSON and save it over the file here to keep it.

Everything you do in Open ACH stays in your browser until you export it.

## Adding evidence here

Edit [evidence.mjs](evidence.mjs) and run `node build.mjs`. Evidence IDs are stable, and ratings already saved in the files are kept.

## Publishing to the public site

The public version lives at https://jc0h3n.github.io/jfk-hypotheses/ (repo jc0h3n/jfk-hypotheses). After rating, export from Open ACH over the files in `analyses/`, then run `node publish.mjs` to copy the analyses, METHOD.md and SOURCES.md to the jfk-hypotheses folder, and commit and push there. Nothing else from this repo is published.

## Files

- `analyses/`: the two Open ACH files
- `evidence.mjs`: hypotheses and evidence as plain data, with sources
- `build.mjs`: turns that into the Open ACH files
- `publish.mjs`: copies the analyses and notes to the public site
- [METHOD.md](METHOD.md): how evidence was chosen and weighted
- [SOURCES.md](SOURCES.md): what the source shorthand refers to

**Private repository.** The course materials are not included and must not be committed: they belong to their authors and publishers. Keep copies in `private/`, which git ignores.
