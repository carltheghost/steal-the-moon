# Removal Audit — Neptune/Uranus (and other out-of-bounds) references

Project: Steal the Moon
Audit date: 2026-09-20
Order: Neptune and Uranus must be REMOVED — Saturn-system-only scene; they are way out of bounds.
Scope searched: all 10 spec .md files in `~/workspace/steal-the-moon/`, all 8 JSON data files in `~/workspace/steal-the-moon-repo/data/`, all 4 docs in `~/workspace/steal-the-moon-repo/docs/`.
Patterns: `neptune`, `uranus`, `ice.?giant`, `kuiper`, `jupiter`, `solar system`, plus `triton|nereid|oberon|titania|ariel|umbriel|miranda|proteus`, `gas.?giant|outer.planet`, `oort`.
Note: the live web artifact was NOT touched, per instructions.

## Summary

- Total hits: 34 (29 from primary pattern grep + 5 from moon/gas-giant follow-up greps).
- **Confirmed deletions (in-scene content): 5**
- **Story-context mentions to keep: 29** (all Jupiter canon content, "solar system" flavor, one research file path)
- Zero hits for: "ice giant", "Kuiper", "Oort" — none exist anywhere in the searched scopes.
- All 22 files readable; no files could not be read.

## Confirmed deletions (in-scene content)

| File | Line | Quoted text | Action |
|---|---|---|---|
| `steal-the-moon-repo/docs/story-bible-v3.md` | 404 | "Then a Saturn assist. Then assists off Uranus, Neptune, three of their moons, and —" | **Delete/rewrite.** Direct Neptune + Uranus name hits inside the "list that escalates past reason" gag. The gag's punchline escalates into out-of-bounds bodies. |
| `steal-the-moon-repo/docs/story-bible-v3.md` | 405–406 | "'one (1) extremely rude maneuver around Triton that we do not discuss.'" | **Delete.** Triton is Neptune's moon — a Neptune reference by another name; part of the same gag as line 404. |
| `steal-the-moon-repo/docs/story-bible-v3.md` | 70 | "- **The trajectory:** gravity assists off **all four gas giants AND their moons**" | **Reframe.** "All four gas giants" includes Uranus + Neptune assists. This contradicts the actual canon route one paragraph below (lines 77–81: Saturn departure → Titan/Rhea/Dione assists → **Jupiter** flyby → Earth). Reframe to Saturn-system assists + the Jupiter flyby. |
| `steal-the-moon-repo/docs/story-bible-v3.md` | 153 | "four-gas-giant + moon billiard shot" | **Reframe.** Same "all four gas giants" implication (Scene 2 beat). Change to "Saturn-moons + Jupiter-flyby billiard shot" or equivalent Saturn-system/Jupiter wording. |
| `steal-the-moon-repo/docs/story-bible-v3.md` | 440 | "No human plotted the trajectory. A human *can't* — it threads gravity assists off all four gas giants and a selection of their moons" | **Reframe.** Same issue (ARGUS story section). Change to Saturn-system moons + Jupiter. |

Note: lines 70, 153, and 440 never name Uranus/Neptune directly, but "all four gas giants" is a canon claim that their moons were used for assists — materially out of bounds under the order. They also conflict with the canonical trajectory stated elsewhere in the same document (Saturn → Jupiter → Earth), so reframing removes an internal contradiction too.

## Story-context mentions (keep or reframe?)

All of these are JUPITER — the Jupiter flyby is a real, canonical plot beat in every source (it is the trajectory event that sheds energy for the inward fall; it is not an out-of-bounds error). Recommendation: **keep**.

| File | Line | Quoted text | Recommendation |
|---|---|---|---|
| `steal-the-moon-repo/data/canon.json` | 1 | `"route":["Saturn departure","Titan assist","Rhea assist","Dione assist","Jupiter flyby","Earth encounter","capture perigee burn"]` | Keep — canon trajectory. |
| `steal-the-moon-repo/data/characters.json` | 1 | `"role":"AGI trajectory planner — ran trillions of simulations; re-planned the Jupiter flyby DURING the flyby"` | Keep — ARGUS character beat. |
| `steal-the-moon-repo/data/scenes.json` | 1 | `"beat":"The Jupiter flyby — shed energy and fall inward, or get flung/captured/shredded. ... "title":"DON'T LOOK AT JUPITER"` | Keep — canon Scene 5. |
| `steal-the-moon-repo/data/stills.json` | 1 | `"subject":"master trajectory — Saturn → Jupiter → Earth, the one thread through the maze", "title":"THE LONG WAY HOME"` | Keep — Exhibit 1A. |
| `steal-the-moon-repo/data/stills.json` | 1 | `"subject":"Jupiter assist close-up — aim point, response surface, ARCHIVE (cyan) vs YOURS (amber)", "title":"THE FLYBY TWEAK"` | Keep — Exhibit FIG. 08C. |
| `steal-the-moon-repo/docs/sim-spec.md` | 9 | "Jupiter flyby (r_p nominal 1.20 R_J, valid 1.10–1.30, invalid <1.00 R_J) →" | Keep — S2 physics sandbox spec. |
| `steal-the-moon-repo/docs/sim-spec.md` | 27 | "- **S2 Flyby tweak sandbox**: zoom to Jupiter, drag aim marker (±5,000 km), live" | Keep — S2 sandbox spec. |
| `steal-the-moon-repo/docs/sim-spec.md` | 31 | "cascade strip JUPITER→EARTH ARRIVAL→CAPTURE→MIMAS ORBIT, RESET SANDBOX." | Keep — S2 cascade strip. |
| `steal-the-moon-repo/docs/sim-spec.md` | 38 | "with glitch gag; hover → rejection tags (\"MISSED JUPITER BY 11 SECONDS\"," | Keep — S4 glitch gag. |
| `steal-the-moon-repo/docs/story-bible-v3.md` | 79–81 | "Then the **Jupiter flyby**: precisely timed to shed energy and fall inward; mistime it and Mimas gets flung, captured, or tidally shredded in Jupiter's Roche zone, plus the radiation belts." | Keep — canonical trajectory beat. |
| `steal-the-moon-repo/docs/story-bible-v3.md` | 191, 193 | "### Scene 5 — \"DON'T LOOK AT JUPITER\" / **Beat:** The Jupiter flyby — precisely timed to shed energy and fall inward;" | Keep — canonical Scene 5. |
| `steal-the-moon-repo/docs/story-bible-v3.md` | 297 (C4) | "Scatter order 40 seconds late; Goose lost at Jupiter, unreported." / "They lost a gravity tractor at Jupiter — that's why the braking burn ran long." | Keep — contradiction C4 (flyby loss of "Goose"). |
| `steal-the-moon-repo/docs/story-bible-v3.md` | 299 (C6) | "ARGUS re-planned the Jupiter flyby *during* the flyby; the crew just watched." / "Nobody was flying that moon. A machine stole it and we all took credit." | Keep — contradiction C6 (ARGUS autonomy). |
| `steal-the-moon-repo/docs/story-bible-v3.md` | 403 | "*\"ARGUS needed a Jupiter assist. Then*" | Keep — this line opens the gag that the confirmed deletions (lines 404–406) belong to. Only the escalating tail (Uranus/Neptune/Triton) goes; "Jupiter assist" itself is canon. |
| `steal-the-moon-repo/docs/story-bible-v3.md` | 558 | "Saturn → Jupiter flyby → Earth, glowing orange arc on dark starfield." | Keep — trajectory map exhibit. |
| `steal-the-moon-repo/docs/story-bible-v3.md` | 561 | "(Lucky-77, Jupiter assist flash that visibly bends the trajectory, Herschel Slip)" | Keep — timeline event pins. |
| `steal-the-moon/master2-threejs-visualization.md` | 11 | "`gShared` (pooled bodies: Saturn/Jupiter/Earth/Titan/Rhea/Dione/Mimas instanced shells reused across modes)." | Keep — scene-graph bodies (Saturn-system + Jupiter + Earth only; correct). |
| `steal-the-moon/master2-threejs-visualization.md` | 30 | "(cruise teal → assists gold → Jupiter flyby orange → capture white)" | Keep — route-line color grammar. |
| `steal-the-moon/master2-threejs-visualization.md` | 31 | "assist-node rings (Saturn, Titan, Rhea, Dione, Jupiter, Earth) = 6 torus sprites, pulse on arrival." | Keep — assist nodes (Saturn-system + Jupiter + Earth; correct). |
| `steal-the-moon/master2-threejs-visualization.md` | 33 | "**Truth-grammar dash params vs my log2 compression.** ... a dash that reads correctly near Saturn reads wrong near Jupiter." | Keep — rendering note, scene-content-neutral. |
| `steal-the-moon/master2-threejs-visualization.md` | 34–37 | "### S2 — Jupiter flyby tweak sandbox (presenter: ARGUS)" / "Aim marker: draggable sprite ...; Jupiter: shaded sphere w/ banded procedural shader; encounter corridor: translucent tube showing capture vs miss." / "Camera: fixed offset view of Jupiter system, slight parallax on drag; no orbit (mobile-safe)." | Keep — S2 sandbox spec. |
| `steal-the-moon/master2-threejs-visualization.md` | 73 | "- **S2 Flyby:** local Jupiter frame, linear scale (no compression needed at this range); r_p readout in R_J (physics units, linear = honest locally)." | Keep — S2 frame spec. |
| `steal-the-moon/master3-interaction-game-design.md` | 18 | "| S-4 | SATURN BILLIARDS | Shot planner ..., repeated until Saturn→Jupiter link solved |" | Keep — game link gate. |
| `steal-the-moon/master3-interaction-game-design.md` | 20 | "| S-6 | JUPITER FLYBY | S2 sandbox lives here in-story; COMMIT BURN is the narrative gate |" | Keep — game screen. |
| `steal-the-moon/master3-interaction-game-design.md` | 75 | "- **Feedback:** Event cards slide in at markers (6 total: departure, 3 assists, Jupiter flyby, Earth capture window)." | Keep — scrubber event cards. |
| `steal-the-moon-repo/docs/story-bible-v3.md` | 158 | "\"stealing a moon like it's a grocery cart and the solar system is a parking lot\"" | Keep — flavor ("solar system" used as narrator metaphor, not scene content). |
| `steal-the-moon-repo/docs/story-bible-v3.md` | 296 (C3) | "\"They knew at Saturn. They towed a cracked moon across the solar system.\"" | Keep — flavor testimony; no out-of-bounds bodies named. |
| `steal-the-moon-repo/docs/story-bible-v3.md` | 562 | "Footnote: *\"distances compressed; the solar system is embarrassingly large.\"*" | Keep — trajectory-map footnote; distances-compression honesty label. |
| `steal-the-moon-repo/docs/story-bible-v3.md` | 549 | "photo (`~/workspace/research_notes/outer-planets-moons/images/saturn/mimas.jpg`)" | Keep — a research-folder file path for the Mimas reference photo, not scene content. |

## Verification notes

- All 22 in-scope files were read via grep with line numbers (10 spec `.md`, 8 data `.json`, 4 docs `.md`); zero unreadable files.
- "ice giant" and "Kuiper" have zero occurrences in the searched scopes — confirmed with dedicated greps.
- No Uranus/Neptune (or their moons) appear in any data JSON or any spec `.md` — the only in-scene violations are the five rows in the deletions table, all inside `story-bible-v3.md`.
- Jupiter is uniformly story-canon (the flyby is a plot event in canon.json, scenes.json, stills.json, the sim specs, and both master specs); no Jupiter reference was scene-content out of bounds.
