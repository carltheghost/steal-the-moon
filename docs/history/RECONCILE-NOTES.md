# Steal the Moon — GitHub data reconcile notes (2026-09-19)

Data reconciler run: stale GitHub `data/*.json` (fetched today, in `/tmp/stm-github/data/`)
brought current against the docs in `~/workspace/research_notes/steal-the-moon/`
(core-spec.md, drama-spec.md, billiards-spec.md, sim-spec.md, system-spec.md).

Rule followed throughout: no invented canon — every added value cites a doc + section.
Doc-vs-JSON contradictions resolved in favor of the DOC; none required overwriting an
existing stale value (existing values were extended, not contradicted). No top-level
keys were dropped from any file; all 8 files validated with `python json.load`.

---

## canon.json (10 → 12 top-level keys; added 3 keys, 4 fields)

- **arrival**: added `"diameter_status": "PROVISIONAL"` and `"status": "awaiting user decision"`
  — task rule; core-spec §Moon geometry gives arrival as "~199 miles" and system-spec §0
  as "≈ 199", i.e. unconfirmed final.
- **departure**: added `"buried_charges_mi": [2, 7, 17, 25]` — core-spec §Moon geometry +
  §Buried charges (user canon 2026-09-19).
- **added `chronology`**: records all five co-existing datings with
  `"chronology_status": "UNRESOLVED — Phase 0 open item"` (task rule; drama-spec §6;
  system-spec §0, §13 item 0.1): 2051 documentary framing (system-spec §0; temporal
  layers), 2049–2052 billiards chain — with JPL-Horizons non-validation warning
  (billiards-spec; system-spec §0), 4,200-day/~11.5-year mission (sim-spec §Canonical
  numbers; system-spec §1), Qiao's "twelve years" (drama-spec §6; billiards-spec quest
  VII), ~4–5-year active arc (core-spec §THE WORLD WATCHES).
- **added `canon_hash`: "PENDING — assigned at Phase 0 data lock"** (system-spec §9, §13 item 0.4).

## chain.json (13 → 17 top-level keys; added 4 keys, 5 fields)

- **added `dv_ledger`**: reported 14.2 / recovered 9.8 / unexplained 4.4 km/s,
  "never resolve who lied" — billiards-spec (link 05 THE CLEAN SHOT); system-spec §0
  ("The ledger lie").
- **added `emotional_beats`**: LOVE@07 (Qiao's hesitation), GREED@helium-3, DEATH@stage VI,
  LIES@stage V, BETRAYAL@Voss — billiards-spec §How it plays / NARRATIVE (17–18).
- **added `tail`**: cometary debris-tail canon + TAIL FOOTPRINT sim + OPEN damage question
  (casualty figures [DISPUTED]) — drama-spec §1.10, §3.
- **forbidden_shot**: added `"clearance_gate": "L3"` and `"trust_gate_min": 60` —
  system-spec §4 (declassification table; FORBIDDEN = L3 + trust ≥ 60 + 1 use).
- **cascade_example**: added `"cascade_report_note"` with the canonical LINK 07 report
  form (SMASH 83% / PASS THROUGH 11% / MISS 5% / MOON COLLISION 1%; 63%; +0.000004%;
  +18,400 km) — billiards-spec §How it plays.
- **totals**: added `"impact_window_s": "±30"` and `"one_second_mechanic"` (2049-06-17
  14:32:00 vs 14:32:01 TDB) — billiards-spec §Key numbers.
- **added `canon_hash`** placeholder as above.

## characters.json (4 → 5 top-level keys; added 1 key, 8 fields/lines)

- **Dotty**: +3 locked key_lines — "It's just math. TNT, and how you release it, and
  what happens." (drama-spec §2, sim honesty), "They thought they were stealing a
  mineral. They were stealing a question." (drama-spec §2, core reveal),
  "ooh, spicy, writing that down" (story bible report.md §C-contradiction table, line 290;
  see deliberate-non-encodings §1 below). Added `"millennium_framing"` (drama-spec §1.5)
  and `"seed_note"` (Dotty does not say whether anything is still awake — drama-spec §1.7).
- **Ren**: added `"life_question"` — "Was there life — or anything — that they
  destroyed?" UNANSWERED, Ren's millennium question — core-spec §THE MILLENNIUM QUESTIONS.
- **Qiao**: added `"twelve_years_conflict"` — UNRESOLVED vs the ~4–5-year active arc /
  2049–2052 chain (drama-spec §6; system-spec §0).
- **Voss**: added `"inserts"` — 9 unsigned inserts, scenes 1/2/3/4/5/6/8/9/11, never 7
  or 10 — system-spec §0 ("Character objectives").
- **ARGUS**: +1 key_line — "ARGUS wasn't searching for the successful route — it was
  eliminating the unsuccessful ones." — sim-spec §S4 (narrative midpoint).
- **added `canon_hash`** placeholder.

## core.json (6 → 18 top-level keys; added 12 keys, 1 field)

- **added `wrong_in_four_ways`**: californium+transuranics list; pressure exotics;
  superheavies past 118 (island of stability + mid-decay chains); residual heat —
  core-spec §Core composition + the Millennium Questions; drama-spec §1.1.
- **added `two_pressures`**: Pressure One (neutron capture cascades, deep) / Pressure
  Two (particle escape, proton emission, lesser); converge on new stable exotics;
  TWO PRESSURES exhibit — core-spec §THE TWO PRESSURES; drama-spec §1.2.
- **added `cascade`**: breeder loop (more bred than burned), heist-math motive-flip II
  beat, algorithms free/open/seeded/deterministic in repo, CASCADE VIEW exhibit —
  core-spec §THE CASCADE; drama-spec §1.3.
- **added `as_device`**: POWER-not-price summary + motive lines (Qiao's pair, Ren's
  sabotage motive, Voss's cover) + motive-level-only rule (abstract impulse levers, no
  weapon mechanics, no yields) — core-spec §THE CORE AS DEVICE; drama-spec §1.4, §6.
- **added `millennium_questions`**: Dotty framing + flow / transmutation-network
  ([UNOBSERVED]) / life (UNANSWERED, Ren's) — drama-spec §1.5; core-spec §THE
  MILLENNIUM QUESTIONS.
- **added `debate`**: AXIS 1 THE CHOICE (convenience vs foreknowledge; Dotty never
  confirms) / AXIS 2 THE PARENT (planet type, age, contents, conditions, where;
  nobody wins); threading beginning/middle/memory/late — drama-spec §1.6; core-spec
  §THE DEBATE.
- **added `seed`**: robots under the ice, self-sustaining machine, 2051 telemetry
  (some recent), "still awake?" open, Ren's sabotage axis — drama-spec §1.7; core-spec
  §THE SEED.
- **added `sim_honesty_line`**: Dotty's "It's just math..." + abstract-energy rule —
  core-spec §DOTTY'S LINE.
- **added `the_quote`**: "We didn't crack a moon tonight. We cracked the century."
  (DRAFT, first release) — drama-spec §1.11; core-spec §THE QUOTE.
- **added `world_watches`**: tail, sun warming, months of visibility, nations debate,
  actor's response (Voss cover under pressure), OPEN damage question, ~4–5-year arc —
  drama-spec §1.10; core-spec §THE WORLD WATCHES.
- **added `scale`**: Tsar Bomba (~50 Mt, 1961) real anchor vs californium release;
  axis breaks; fictional quantities labeled — drama-spec §1.8; core-spec §SCALE.
- **ice_as_fuel**: added `"tagline"`: "The stolen moon is consuming itself to pay
  for its own escape." — drama-spec §2 (locked verbatim lines).
- Kept as-is: 5 core zones, 2 redacted alternatives (REJECTED / EVIDENCE INSUFFICIENT),
  4 buried charges, burn table, Slip chain, data_aspect — core-spec.
- **added `canon_hash`** placeholder.

## scenes.json (4 → 7 top-level keys; added 3 keys; 11 scenes preserved)

- **added `canon_screen_map`**: the 24-screen convention — 11 spine (S-1→S-11 with
  system-spec §0 canon titles + §2 hero lines), 5 Billiards (B-1→B-5), 2 Core (C-1, C-2),
  6 Archive (A-0→A-5); S-8F is a fail state, not a 25th screen — system-spec §2.
- **added `placement_map_drama`**: beginning / middle / past_memory / late placement —
  drama-spec §4 (verbatim placement map).
- The existing 11 scene entries (beats, choices, POVs, sim tags) and `temporal_layers`
  were kept unchanged per task.
- **added `canon_hash`** placeholder.

## declassification.json (4 → 7 top-level keys; added 3 keys, 18 fields)

- **ladder** (levels 0–5, FINAL CANON [PARTIALLY UNREADABLE] kept): each level gained
  `"granted_by"` and `"reveals"` from the system-spec §4 declassification table
  (L0 start; L1 seal-break; L2 conflicts+rehearsal commit; L3 ACCEPT shot; L4 Scene 11
  + trust ≥ 40; FINAL = CAPTURED win + VINDICATED verdict at L4 + S11 burn) and
  `"trust_cost": -5`.
- **added `trust_rule`**: "−5 TRUST per declass grant — 'TRUST drains as redaction
  lifts'" — system-spec §4.
- **added `archive_fragments`** (5): buried charge logs; checksum mismatch
  (helium-3 inserted after sealing); robot deployment records + 2051 "didn't stop"
  telemetry; pre-heist survey foreknowledge hints (never confirming); debate thread
  (AXIS 1/AXIS 2 across beginning/middle/memory/late, feeds FINAL CANON) —
  drama-spec §4 (placement map); motive-flip III (core-spec) for the checksum docs.
- **added `canon_hash`** placeholder.

## stills.json (4 → 6 top-level keys; added 2 keys; 11 planned stills preserved)

- **added `canon_visual_set`** with the six assets at `assets/`:
  mimas-state-pristine.webp (departure), mimas-state-peeling.webp (mid-voyage peel),
  mimas-state-arrival.webp (arrival), mimas-state-tail.webp (tail state),
  mimas-surface-gaze.webp (canon 360° sphere wrap — all terrain/valleys/fractures),
  mimas-tail-cinematic-flipped.webp (canon cinematic — tail streams AWAY from Earth;
  debris + world-response views).
- **Provenance notes**: the four media-generation-*.webp pixels are agent/Grok-generated
  via the media-generation pipeline (sibling sidecar JSONs in assets/ carry generation
  snapshot IDs); mimas-surface-gaze.webp is byte-identical to the pristine render;
  the two mimas-* files are the user-designated canon selections (full-sphere wrap;
  tail-away composition) per the project visual-canon record (2026-09-19, user's own
  material). They sit alongside, not replacing, the 11 planned exhibit stills.
- Existing palette, render_notes, 11 stills kept unchanged.
- **added `canon_hash`** placeholder.

## moons.json (7 → 9 top-level keys; added 2 keys; zero entries changed)

- **added `catalog_status`: "INCOMPLETE — full 293-moon catalog pending real JPL data
  assembly (Phase 0 open item)"** — task rule; system-spec §13 item 0.2.
- **added `canon_hash`** placeholder.
- All 24 regular moons + 3 irregular families + disclaimer kept byte-identical; no
  unknowns were marked known; no JPL data fabricated.

---

## Deliberately NOT encoded (and why)

1. **story-bible-v3.md was listed as an input but does not exist** in
   `research_notes/steal-the-moon/` — the story bible present is `report.md`, which
   drama-spec §1 cites as the bible. I sourced Dotty's "ooh, spicy, writing that down"
   (report.md line 290) from it and flagged this gap rather than inventing the file.
2. **Chronology conflict not resolved** — 2051 framing vs 2049–2052 chain vs 4,200-day
   mission vs "twelve years" vs 4–5-year arc recorded as co-existing claims with
   `chronology_status: UNRESOLVED` (canon.json). drama-spec §6 + system-spec §0/§13-0.1
   forbid silent resolution.
3. **Arrival 199 mi kept but PROVISIONAL** ("awaiting user decision") — docs say ~199 /
   ≈199, unconfirmed final (core-spec §Moon geometry; system-spec §0).
4. **Full 293-moon catalog NOT assembled** — only existing 24 regulars + condensed
   irregular families retained; real JPL data assembly is a Phase 0 open item
   (system-spec §13 item 0.2); catalog_status INCOMPLETE (moons.json).
5. **2049–2052 chain dates stay "fictional planning values"** — not validated vs JPL
   Horizons; do not present as real alignments (system-spec §0, §13 item 0.3).
6. **Qiao's "twelve years" vs ~4–5-year active arc not reconciled** — flagged UNRESOLVED
   in characters.json and canon.json (drama-spec §6).
7. **Nuclear weapon-design mechanics and yields absent** — standing rule: nuclear events
   stay abstract impulse levers, no yields, no weapon design (drama-spec §6; core-spec
   §THE CORE AS DEVICE rule).
8. **Forbidden Shot internals stay redacted** — full antimatter spec was a killed idea;
   it is a mystery, not a datasheet (billiards-spec §Killed ideas).
9. **Fictional cascade rates / multiplication factor k values** — not encoded as data;
   core-spec marks rates fictional and labeled; the sims own them.
10. **Tsar-vs-californium chart quantities** — fictional, labeled, chart-only
    (drama-spec §1.8); encoded as the concept, no numbers.
11. **Casualty figures for the damage question** — Dotty marks them [DISPUTED];
    recorded as open, not facts (drama-spec §1.10).
12. **Robot telemetry timestamps / "still awake?"** — Dotty does not confirm; recorded as
    the open beat, no invented timestamps (drama-spec §1.7).
13. **Full debate transcript text** — a build artifact to author; only axes, threading,
    and resolution status encoded (drama-spec §1.6, §5 item 5).
14. **Voss's 9 insert contents** — presence + scene placements only (system-spec §0);
    insert contents are build artifacts.
15. **Ren's 3 sabotage traces** — count only (system-spec §1 `traces.renFound = 3`);
    trace contents are build artifacts.
16. **canonHash values** — placeholder "PENDING" in all 8 files; assigned at Phase 0
    data lock (system-spec §13 item 0.4).
17. **The six .webp asset files themselves** — referenced by path, not embedded; the
    repo sync must copy them into `assets/` (they currently live in
    `research_notes/steal-the-moon/assets/`).
