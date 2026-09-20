# ARTIFACT-BRIEF.md — Steal the Moon rebuild build spec

**Status:** BUILD SPEC (2026-09-20). Not code. The builder (artifact.edit pipeline)
implements this file verbatim into the live `steal-the-moon` web artifact.
**Rule:** real data or honestly-marked nulls — never invent a constant, URL, or date.
Every value below is copied from the cited repo file; when a value is unavailable,
the spec says so explicitly and names the fallback.

## 0. Reading order for the builder

1. This file — the complete screen-by-screen spec.
2. `engine/saturnEngine.js` — the physics source of truth (API in §4.1).
3. `docs/simulation-design.md` — physics/display split, data layer, perf budget,
   fiction-labeling contract.
4. `docs/wow-features.md` — the five wow exhibits (exact verified numbers in §7).
5. `docs/chronology-resolution.md` — the canonical timeline (pinned dates in §11).
6. `docs/removal-audit.md` — Neptune/Uranus purge (per-screen bounds checks in §8).
7. `docs/system-spec.md` — the converged 24-screen system spec (STEAL schema,
   interaction grammar, visual system). Where this brief and system-spec conflict,
   **this brief wins** (it is the newer rebuild ruling).
8. `docs/rebuild-artifact/ASSETS.md` — the exact bake list (imagery in §10).

## 1. What the rebuild changes (vs the live artifact)

| # | Change | Source |
|---|---|---|
| 1 | Every catalog moon position on every screen comes from `engine/saturnEngine.js`
`stateAtJD(jd)` — no hand-placed orbits, ever | this brief §4 |
| 2 | Global date slider = real Julian dates, T−117 → T+0 (26 Jul 2032 → 20 Nov 2032) | this brief §4.2 |
| 3 | Time-warp pause/1×/60×/3600×/86400×, true/log scale toggle | saturnEngine `TIME_PRESETS` |
| 4 | Hard Saturn-system bound via `isOutOfBounds()` — nothing renders beyond Phoebe's orbit | this brief §4.5 |
| 5 | Five wow features as showpiece exhibits W-1…W-5 | this brief §7 |
| 6 | 293-moon explorer (A-1) with search, filters, discovery-timeline scrubber | this brief §6 (A-1) |
| 7 | Neptune/Uranus purge per removal-audit.md (5 confirmed deletions applied) | this brief §8 |
| 8 | Chronology defaults per chronology-resolution.md §4–5 | this brief §11 |
| 9 | Real NASA imagery baked at build time; zero runtime network; photo-vs-CGI compare | this brief §10 |
| 10 | three.js vendored into the artifact (no CDN importmap at runtime — this is a
deliberate change from system-spec §8, required by the zero-runtime-network rule) | this brief §12 |

What does NOT change: the 24-screen spine (11 story / 5 Billiards / 2 Core / 6 Archive),
the STEAL state schema v2, the interaction grammar and resource economy (TRUST/TIME/Δv,
declassification levels), the canon-locked lines, and the visual register
(NASA binder × forensic evidence board × incompetent archive).

## 2. Global architecture (one artifact file)

- One self-contained static page: `index.html` (+ sibling local assets for textures/fonts;
  relative refs only — no `http(s)://` URL anywhere in the shipped bundle).
- All JSON data inlined as `<script type="application/json">` blocks at build time:
  `canon.json`, `chain.json` (re-dated per §11), `core.json`, `characters.json`,
  `scenes.json`, `declassification.json`, `stills.json`, `moons-293.json`,
  `major-moons-elements.json`, `nasa-imagery.json` (manifest sidecars only),
  plus the five new build-time wow JSONs from §7.
- `engine/saturnEngine.js` is vendored inline (ES module). `three@0.186.0` is vendored
  inline or as a same-directory local file — never a CDN importmap.
- One persistent WebGL2 scene, six pooled roots (`timeline`, `flyby`, `cloud`,
  `shepherd`, `billiards`, `core`) per system-spec §5. DOM owns chrome, meters, text,
  and every mobile input.
- Screen router: 24 screens per §6. Wow exhibits W-1…W-5 are full-viewport plates
  hosted inside A-0 (Archive hub) — showpiece weight, but not new screens, so the
  24-screen count stands.

## 3. STEAL state (unchanged from system-spec §1)

Schema v2, seed `0x5EA17`, LUT seed `0xC0FFEE`, `recompute(STEAL)` owns every derived
value, anti-rename sim API contract from master1-round3 F10
(`s1PathAt, s2Outcome, s2PathFor, s3Band, s4Ghosts, s4Compare, s5Step, s5StateAt,
billiardsSimulate, coreBurn, reconcileLedger, resetSim, stillStateHash,
displayTransform, outcomeAtSecond, conflictTaus[], slipModel` read-only).
Fiction lives in the FictionEngine layer: it consumes physics positions, never modifies them.

## 4. Simulation core integration — saturnEngine

### 4.1 API surface the artifact uses

From `engine/saturnEngine.js` (vanilla JS, zero deps):
`stateAtJD(jd)` → `{saturn:{x,y,z}, moons:{Name:{x,y,z,vx,vy,vz}}}` (km, km/s,
Saturn-centered, JPL SAT441 mean elements, epoch J2000 = JD 2451545.0, Saturn GM
37,931,206.23 km³/s², Newton–Raphson 1e-12).
`TIME_PRESETS` = `{PAUSE:0, REALTIME:1, MINUTE:60, HOUR:3600, DAY:86400}`.
`trueScale(km)` (km/1e6 scene units) · `logScale(km)` (`10·log10(1+km/58232)`).
`isOutOfBounds(km)` (BOUND_KM = 12.9e6). `getMoonNames()` / `getMoonData(name)` /
`mulberry32(seed)` / `hohmannDeltaV(r1,r2)` / `keplerSolve(M,e)`.

### 4.2 Global date slider — real Julian dates, T−117 → T+0

- Range: **JD 2463440.0 → JD 2463557.0** (26 Jul 2032 → 20 Nov 2032, capture = T+0).
- All 8 engine moons (+ Phoebe, §4.7) are positioned by `stateAtJD(jd)` on every
  screen that shows catalog moons. The 285 non-engine catalog moons render as
  catalog dots per §4.6 — never propagated, never hand-placed.
- Ticks pinned on the slider rail: LINK 11 "Mimas begins Earth transfer" (26 Jul 2032,
  JD 2463440.0) · Jupiter flyby ~10 Sep 2032 (JD 2463486.0) · braking burn 13 Nov 2032
  (JD 2463550.0) · CAPTURE 20 Nov 2032 (JD 2463557.0). Ticks are labels only —
  the underlying date is continuous and honest.
- S-2's canon missionDay scrubber (0→4200) maps to real dates by the locked chronology:
  JD = 2459357.0 + missionDay (22 May 2021 + missionDay; Day 4200 = 20 Nov 2032).
  Moon positions on S-2 use `stateAtJD(2459357.0 + missionDay)`. This is the one screen
  where the date range differs from the global slider — because the canon story arc
  (FIRST LIGHT → CAPTURE) is itself a real 4,200-day date range.
- The slider's T−117 start (LINK 11) means the Saturn escape (LINK 10, 13 Feb 2032)
  is outside the global slider; it is covered narratively on S-6/S-8/B-5 from
  `chain.json` and the baked trajectory LUT, not live-propagated. This is the
  settled answer to chronology-resolution §7 Q2: escape+transfer coverage lives in
  narrative screens; the sim slider covers the transfer leg.

### 4.3 Time warp

pause / 1× / 60× / 3600× / 86400× exactly (`TIME_PRESETS`), applied via the engine's
own `setTimeScale`/`advance` so warped motion is analytic (re-evaluate per frame —
no integration drift, same date = same state). Reduced motion: warp disabled, bodies
frozen at the slider date.

### 4.4 Scale toggle

True/log toggle on every system view. TRUE = `trueScale` (linear km/1e6).
LOG = `logScale` (`10·log10(1+km/58232)`). Toggle never changes physics-space values,
only the render transform, and every system view carries the permanent badge
"SCHEMATIC — NOT TO SCALE" regardless of the toggle position.

### 4.5 Hard bound

`isOutOfBounds(km)` gates every non-moon entity: camera targets, probe bodies,
trajectory LUT points, ghost ensembles. Anything with |km| > 12.9e6 is rejected —
never rendered, never queryable. The S2 Jupiter sandbox and W-1 Slingshot Ledger
are separate bounded local frames (see §8 notes), not the Saturn scene.

### 4.6 Unverified elements — catalog dots

`moons-293.json` carries `verified` per record. 292 records are `verified:true`;
**S/2009 S2 is `verified:false`** (no published radius, orbital_group null). Per
simulation-design §3: S/2009 S2 gets `propagatable:false`, renders as a labeled
catalog point with NO orbit line, and its card reads "ELEMENTS UNVERIFIED —
position shown at catalog epoch, not propagated." The same rule applies to any
record missing `semi_major_axis_km` or `orbital_period_days` (none currently).
Never render an unverified orbit as real.

### 4.7 Phoebe note (known engine gap, closed here)

`major-moons-elements.json` has 9 rows (the engine's 8 + Phoebe). Phoebe's row is
verified SAT441 data: a = 12,929,400 km, e = 0.164, i = 175.2°, period 550.30391 d,
node 192.7°, argp 240.3°, M0 308.0°, radius 106.5 km. The builder extends
`MOON_DATA` with Phoebe verbatim from that row — same propagation path, no new math.
Phoebe straddles the 12.9e6 km bound (periapsis ≈ 10.8M km, apoapsis ≈ 15.0M km):
catalog moons are scene contents, not gated entities — the bound gates the camera,
probes, and LUT (§4.5). Phoebe's orbit line is drawn clipped at the bound sphere
with the clip honestly visible (dotted beyond, no invented cutoff).

## 5. Global chrome & UI conventions

- **Two-tag legend** on every screen: brass `HEIST FRAME` on fictional framing,
  teal `REAL PHYSICS` on measured data. Never one without the other where both appear.
- **Fictional mechanics tags** (simulation-design §6): `[ABSTRACT]` (TRUST, impulse
  tiers, Δv ledger, ONE-SECOND scrubber, declassification), `[EXAGGERATED ×N]`
  (S2's ×12 divergence, any visual scale distortion — N printed), `[DRAMATIZED]`
  (condensed event sequences: 0.5 s impact freeze, 90-second montages).
- **Source strip** on every data-driven screen: mission/paper + PIA/catalog ID,
  e.g. "Positions: JPL SAT441 mean elements, J2000 epoch" / "Photo: Cassini ISS,
  PIA12570" / "Day length: Mankovich 2019, ApJ (ring seismology)".
- **Honesty badges:** "SCHEMATIC — NOT TO SCALE" on every system view;
  "VISUAL DIVERGENCE EXAGGERATED ×12" wherever the ×12 transform applies;
  "PHOTO vs CGI" labeling per §10.
- **Footer (every screen, verbatim):** "REAL SATURN. FICTIONAL CRIME. — Physics:
  JPL ephemeris. Everything else is the heist."
- **Temporal layer header** on story screens: `[LAYER] · [POV] · [DATE]` per
  story-bible §3 (EVENT 2031–2033 / RECORD 2051 / AFTERMATH 2040s–2051 / HEARING 2034).
- **Gag furniture** per system-spec §6: `#seal`, `#moon-status` ("MOON STATUS:
  STILL A MOON"), `#corrections-counter` (#17→#18→#19→CLASSIFIED), `.insert-voss`,
  `.canon-reader-record`, S4 `displayCounter` ("ACTUAL RUNS 3,847,221,004,913,882",
  display-only, never feeds a formula).
- **Lock affordance:** locked controls show the reason on tap/hover/keyboard focus
  ("Requires L2 · break the S1 seal"); locked codex entries are redaction bars.
- **Persistence keys:** `stm.steal.v2` / `stm.runs.v1` / `stm.clearance.v1`
  (versioned localStorage, migrate-or-reset with "ARCHIVE DAMAGED — STARTED NEW
  FILE" card; quota fallback drops oldest non-current runs first, then
  "ARCHIVE NOT SAVING" badge).
- **Mobile:** <768 px, canvas display-only, all sim inputs are real DOM controls
  (≥48 px); OrbitControls desktop-only; rail stacks below viewport; meters to top strip.
- **Reduced motion:** STATIC SVG plates, stepped paths for every timed moment,
  time-warp disabled, ghosts frozen, first-run one-time dismissible prompt card.
  No-WebGL = intentional SVG/static exhibit plates, not a broken page.

## 6. Screen-by-screen spec (24 screens)

Conventions: **Screen** = ID + title (canon scene). **Layout** = plate skeleton
(`plate-frame + rail` or `index-screen`) + GL root. **Interact** = concrete controls
and commits. **Data** = exact files/fields consumed. **Tags** = which parts carry
`HEIST FRAME` vs `REAL PHYSICS` (fiction mechanics additionally tagged per §5).
**Bounds** = the Neptune/Uranus purge note for this screen (see §8 for the audit
table — "Jupiter flyby stays" is canon everywhere).

### SPINE — S-1 … S-11

**S-1 — THE FILE (Scene 1, "CASE FILE 7B — SEAL INTACT.")**
Layout: `plate-frame + rail`, DOM-led, GL timeline root dimmed behind a sealed-file cover.
Interact: BREAK THE SEAL commit (grants L1, −5 TRUST, `reveal.sealBroken`); starting-archive
picker (REN'S SHIP LOG / QIAO'S FLIGHT RECORDER / THE HEARING) tilts initial TRUST.
Hero line verbatim: "CASE FILE 7B — SEAL INTACT."
Data: `scenes.json` (scene 1: title, presenter, commit contract), `declassification.json`
(L0/L1 grants), `canon.json` framing ("THE MIMAS INQUIRY: A Declassified History of
the Saturn Heist"). Frame card tagline verbatim: "Declassified 2049. Assembled 2051.
Believed by nobody."
Tags: HEIST FRAME (all of it — the seal ritual is pure fiction) [ABSTRACT].
Bounds: none needed — DOM file-desk, no bodies.

**S-2 — THE MOON (Scene 2, "246 MILES. PICK IT UP.")**
Layout: `plate-frame + rail`, WebGL `timeline` root, timeline-strip camera.
Interact: PIN DROP + resolve 2 RECORD CONFLICTs (freeze days from `conflictTaus[]`);
native range scrubber: missionDay 0→4200, mapped to JD 2459357.0 + missionDay
(§4.2); time-warp + true/log toggle.
Hero line verbatim: "246 MILES. PICK IT UP."
Data: `canon.json` (mission clock cap 4200, knot days), `scenes.json` (scene 2),
`major-moons-elements.json` via engine (all moon positions `stateAtJD`), `nasa-imagery.json`
(mimas-global-map PIA17214 texture on the hero moon sphere; mimas close-up PIA12570 in
the compare pane). Hero sphere uses canon `mimas-surface-gaze.webp` per §9 visual canon;
the PIA17214 photo appears in the photo-vs-CGI compare pane only.
Tags: REAL PHYSICS (all moon positions, JPL SAT441 strip); HEIST FRAME (pin drop,
RECORD CONFLICTs, canon trajectory overlay) [DRAMATIZED].
Bounds: Saturn-system scene only; slider is the global T−117→T+0 on sim views and
0→4200 missionDay on this screen — no out-of-bounds content.

**S-3 — THE MACHINE (Scene 3, "THE MATH DOESN'T WORK.")**
Layout: `plate-frame + rail`, DOM ledger + GL meter strip, ledger-desk camera.
Interact: He-3 WORKSHEET attempt (5 rows vs the ledger — refuses to balance →
`reveal.worksheetFailed`); GARY BELIEVE-2 toggle (±10 TRUST); burn-budget allocation;
RECONCILE gated at L2 (`reconcileLedger()`: meter reads the 14.2 lie until reconciled,
then shows ghost 9.8 hatched amber; books 14.2 / 9.8 recovered / 4.4 unexplained).
Hero line verbatim: "THE MATH DOESN'T WORK."
Data: `canon.json` (dv_ledger figures), `chain.json` (LINK 01 GARY, FISSION tier),
`core.json` (4 ice jobs), `scenes.json` (scene 3).
Tags: REAL PHYSICS (burn arithmetic); HEIST FRAME (the ledger lie, the worksheet
gag, "ABSOLUTELY DO NOT USE THIS FUEL" row) [ABSTRACT].
Bounds: none — ledger desk, no bodies.

**S-4 — THE FIRST LIE (Scene 4, "HELIUM-3 WAS INSERTED AFTER THE SEAL.")**
Layout: `plate-frame + rail`, WebGL `flyby` root (local Jupiter frame — NOT the
Saturn scene), flyby-chase camera.
Interact: CHECKSUM VERIFY commit (`reveal.checksumVerified`, grants L2 with the S1
conflicts); S2 rehearsal sandbox — drag/desktop aim sprite or steppers/numeric field
(mobile) writing `STEAL.trajectory.aimDx/aimDy` clamped ±5000 km, read back via
`recompute`; `s2Outcome`/`s2PathFor` closed-form scalars; 41×41 LUT bilinear →
`conicPath(r_p)`; rail telemetry: valid band 1.10–1.30 R_J shrinking with mission
time, capture-error %, Δv correction cost. Verdicts MARGINAL/SUCCESS/FAIL.
Hero line verbatim: "HELIUM-3 WAS INSERTED AFTER THE SEAL."
Data: `canon.json` (LUT provenance note, ×12 factor), `chain.json` (S2 link spec),
`scenes.json` (scene 4). Aim-frame constants (r_p 1.20 nominal, valid 1.10–1.30,
invalid <1.00 R_J) from sim-spec.
Tags: REAL PHYSICS (patched-conic closed-form math, labeled as response surface
where approximated); HEIST FRAME (the checksum beat, ARGUS re-planning) [DRAMATIZED].
Bounds: **scoped local frame** — Jupiter sandbox is a linear-scale local view with its
own camera; it is not a solar-system scene and contains no Neptune/Uranus. Labeled
"LOCAL FRAME — JUPITER ENCOUNTER" with "SCHEMATIC — NOT TO SCALE".

**S-5 — THE CASCADE (Scene 5, "COMMIT THE BURN. OWN THE LIE.")**
Layout: `plate-frame + rail`, WebGL `flyby` root (local Jupiter frame), flyby-chase.
Interact: S2 real COMMIT (rehearsals only before this spine beat; capture err <0.5%
gate; +10d surcharge if zero rehearsals; MARGINAL shrinks capture window 30→15 d;
−5d TIME) + S3 cascade strip recall.
Hero line verbatim: "COMMIT THE BURN. OWN THE LIE."
Data: same as S-4 + `declassification.json` (L2 gate), `stills.json` (Exhibit 1A
"THE LONG WAY HOME", FIG. 08C "THE FLYBY TWEAK" bindings).
Tags: as S-4; COMMIT is [ABSTRACT] (game lever on real math).
Bounds: scoped local Jupiter frame, as S-4. No Neptune/Uranus.

**S-6 — THREE TRILLION DOORS (Scene 6, "THREE TRILLION DOORS. PICK ONE.")**
Layout: `plate-frame + rail`, WebGL `cloud` root + billiards overlay, cloud-drift camera.
Interact: S4 cloud — 2 required `s4Compare(a,b)` comparisons (+10 TRUST); explicit
P(success) rail readout incl. `projectedEarthReserve < 0 → P = 0` state; seeded ghost
trajectories via `s4Ghosts(seed,n)` (5000 desktop / 500–1000 mobile), honestly labeled
"response-surface mapping, not n-body"; tap-to-inspect rejection tags (DOM overlay taps,
never canvas); B-1→B-5 wizard entry; ACCEPT SHOT grants L3.
Hero line verbatim: "THREE TRILLION DOORS. PICK ONE."
Data: `chain.json` (12 links, re-dated per §11), `canon.json` (canon hashes), `moons-293.json`
(B-1 293→24 target filter), `scenes.json` (scene 6).
Tags: REAL PHYSICS (Keplerian positions underneath); HEIST FRAME (ghost clouds,
rejection tags, ACCEPT SHOT) [ABSTRACT].
Bounds: Saturn-system scene, bound-enforced; billiard targets are Saturn moons only.

**S-7 — THE SHEPHERDS (Scene 7, "HOLD THE LINE. LET IT RING.")**
Layout: `plate-frame + rail`, WebGL `shepherd` root, shepherd-top camera.
Interact: S5 shepherd sim — 3 nudgeable shepherd moons + 3 corridor context bodies
(`STEAL.config.shepherdN = 6` from chain.json, never hardcoded); drag arrows / −/+
steppers desktop, tap arrows ≥44px or steppers mobile; STEP MODE (12×5 s, win needs
2 consecutive in-band steps); 100-unit impulse budget meter; win = 3 corrections +
corridor held 10 s + impulse <100 → `dv.shepherdDiscount`; fail → retry costs TIME,
3rd fail → half discount + TRUST −10. Trust vote + Qiao rail journal.
Hero line verbatim: "HOLD THE LINE. LET IT RING."
Data: `chain.json` (shepherdN 6, S5 initial conditions), `characters.json` (Qiao log
milestones), `scenes.json` (scene 7). Shepherd body starting positions: from
`chain.json` S5 initial conditions [ABSTRACT fictional constructs]; any catalog moon
shown (e.g. Dione as corridor reference) positioned by `stateAtJD`.
Tags: REAL PHYSICS (any catalog-moon reference positions); HEIST FRAME (the shepherd
fleet, the game, the vote) [ABSTRACT].
Bounds: Saturn-system scene, bound-enforced. Shepherd fleet = captured asteroids
(fictional); not out-of-bounds bodies.

**S-8 — THE SLIP (Scene 8, "THEY AREN'T DRILLING. THEY'RE PEELING.")**
Layout: `plate-frame + rail`, WebGL `core` + `timeline` recall, cutaway camera.
Interact: S1 crack overlay (Herschel crack at scripted tau, fed by `slipModel`
read-only); S5 recall; C-1 burn drills (EXPOSURE meter accrued BLIND, revealed at
drill completion — F4); hidden-burn toggle iff `traces.renFound == 3` (Ren's 3
sabotage traces from `characters.json`).
Hero line verbatim: "THEY AREN'T DRILLING. THEY'RE PEELING."
Locked lines verbatim in copy: the Herschel Slip — "during the final braking burn,
a ~40 km fracture propagated from Herschel's rim"; official story: "expected
settling."; "don't log that".
Data: `core.json` (246→159→199 mi geometry, `p_f`/`σ_slip` coefficients, charge
depths 2/7/17/25), `canon.json`, `characters.json` (Ren traces), `scenes.json`
(scene 8).
Tags: REAL PHYSICS (cutaway geometry from locked dimensions; fracture mechanics
coefficients); HEIST FRAME (the slip, the cover-up, the hidden burn) [DRAMATIZED].
Bounds: Mimas-local cutaway — no system bodies rendered except the global slider
context; nothing out of bounds.

**S-8F — THE RECKONING (fail state of S-8)**
Layout: `plate-frame`, DOM. Not a 25th screen. Interact: rewind → checkpoint,
restart → RUN #N+1. Trigger: TIME ≤ 0 (WINDOW CLOSED) or drill catastrophe.
Tags: HEIST FRAME [ABSTRACT]. Bounds: none.

**S-9 — EARTH, SOMEHOW (Scene 9, "EARTH, SOMEHOW. CHECK THE BOOKS.")**
Layout: `plate-frame + rail`, DOM + GL recall, ledger-desk camera.
Interact: ledger sign-off; arrival check (±30 d window, reserve > 0); fail = scene
setback (−10 d, checkpoint rewind).
Hero line verbatim: "EARTH, SOMEHOW. CHECK THE BOOKS."
Data: `canon.json` (parking: distant retrograde orbit ~70,000 km; "like a roommate's
couch" — verbatim), `chain.json` (capture link), `scenes.json` (scene 9).
Tags: REAL PHYSICS (DRO 70,000 km figure); HEIST FRAME (the arrival narrative)
[DRAMATIZED]. Bounds: no system scene — arrival recall; Earth shown only as the
baked route endpoint card (event-card overlay, per simulation-design §1).

**S-10 — THE HEARING (Scene 10, "EXHIBIT 42B. THE TRAJECTORY YOU SELECTED.")**
Layout: `plate-frame + rail`, DOM-led (no GL root; replay numbers from STEAL via
`stateFromRun`).
Interact: per-exhibit DEFEND/CONDEMN + free text + ARTIFACT ADMIT/SUPPRESS;
skipped sims render "NO DATA — SUBJECT DECLINED." (verbatim, standardized) with live
TRUST consequences; verdict VINDICATED/SEALED/CONDEMNED with tribunal readout and
stamped RUN card (clearance_at_win + verdict badges).
Hero line verbatim: "EXHIBIT 42B. THE TRAJECTORY YOU SELECTED."
Data: `characters.json` (Voss objectives, 9 insert slots — never scenes 7 or 10),
`stills.json` (exhibit bindings), `declassification.json`, RUN archive.
Tags: HEIST FRAME throughout [ABSTRACT]; perjury-warning banner is in-fiction.
Bounds: none — hearing room, no bodies.

**S-11 — DECLASSIFIED (Scene 11, "IF ARGUS SIMULATED TRILLIONS OF FUTURES, WHY IS
THE ARCHIVE STILL CHANGING?")**
Layout: `plate-frame + rail`, WebGL `core` root, cutaway camera.
Interact: S4-returns-altered cold open ("THE ARCHIVE HAS BEEN MODIFIED" — verified
against per-file `canonHash`); C-2 final choice TAKE IT / LEAVE IT / LISTEN (LISTEN
needs L4 prereqs); IGNITE FINAL BURN executes via `coreBurn`.
Hero line verbatim: "IF ARGUS SIMULATED TRILLIONS OF FUTURES, WHY IS THE ARCHIVE
STILL CHANGING?"
Data: `core.json`, `declassification.json` (L4, LISTEN gate, FINAL CANON
eligibility), `canon.json` (canon hashes), `scenes.json` (scene 11).
Tags: HEIST FRAME (the choice, the altered archive) [ABSTRACT]/[DRAMATIZED].
Bounds: Mimas cutaway — no system bodies.

### BILLIARDS — B-1 … B-5 (Scene 6)

**B-1 — Shot planner: target select.** `index-screen`, WebGL `billiards` atlas,
atlas camera. Interact: 293→24 candidate filter (needs mass/orbit/resonance per
candidate from `moons-293.json` for η₀); choose target → `billiards.plan.target`.
Catalog dots for unverified records (§4.6). 8 engine moons live-propagated at the
global slider date; the other 285 are catalog points. Tags: REAL PHYSICS (positions);
HEIST FRAME (shot planner) [ABSTRACT]. Bounds: Saturn-system only; targets are
Saturn moons — no out-of-bounds targets offered.

**B-2 — Impulse tier.** `plate-frame + rail`, DOM + GL preview, atlas camera.
Interact: choose tier — conventional 0.55 / fission 0.70 / fusion 0.80 /
FORBIDDEN🔒 0.90 base confidence (FORBIDDEN needs L3 + trust ≥ 60 +
`forbiddenUsesLeft = 1`). Tags: HEIST FRAME [ABSTRACT]. Bounds: none.

**B-3 — Depth + timing dials.** `plate-frame + rail`, DOM dials + GL preview,
cutaway camera. Interact: native dials — depth 2/7/17/25 mi, timing Δt ±30 d;
confidence readout `clamp01(tierBase × (1 − p_f(d)) × exp(−(|Δt|/30)²))`;
**corrected tradeoff copy, verbatim:** "deeper = less SLIP + more TIME + more FRACTURE"
(never "deep = safe"). Tags: HEIST FRAME [ABSTRACT]. Bounds: none.

**B-4 — SIMULATE.** `plate-frame + rail`, WebGL `billiards`, encounter camera.
Interact: SIMULATE commit → `billiardsSimulate(plan, runSeed)` with
`mulberry32(hash(planFields) ⊕ runSeed)`; triple-path render with the forensic
grammar — INTENDED dotted-slate / PREDICTED amber-dashed / OBSERVED cyan-solid;
output: outcomeClass (SMASH / PASS THROUGH / GRAVITY ASSIST / CRASH INTO MOON / MISS),
missDistanceKm, deltaV, momentumTransferPct, nextLinkErrorKm, confidence; governing
rule verbatim: "THE EXPLOSION IS NEVER THE EVENT. THE ORBIT AFTER THE EXPLOSION
IS THE EVENT."; replay line verbatim: "SAME PLAN. DIFFERENT SECOND. DIFFERENT HISTORY."
Tags: REAL PHYSICS (Keplerian underpinnings); HEIST FRAME (impulse model,
outcomes) [ABSTRACT]. Bounds: encounter-local frame; target body positions from
`stateAtJD` where catalog moons.

**B-5 — Cascade report.** `plate-frame + rail`, DOM report + GL chain, chain camera.
Interact: 12-link cascade report (dates re-dated per §11); ACCEPT SHOT → L3
(`billiards.cascade`, outcome classes). Example LINK 07 report form verbatim from
`chain.json`: "SMASH 83% / PASS THROUGH 11% / MISS 5% / MOON COLLISION 1%;
MOMENTUM TRANSFER 63%; MIMAS ORBITAL ENERGY +0.000004%; NEXT ENCOUNTER ERROR
+18,400 km". Tags: HEIST FRAME [ABSTRACT]/[DRAMATIZED] (planning values — the
chain.json disclaimer stays visible: "All dates and mechanics are fictional
planning values; do not present as real alignments until verified against JPL
Horizons."). Bounds: Saturn-system chain view; no out-of-bounds links.

### CORE — C-1, C-2

**C-1 — Burn-table drills (Scene 8).** `plate-frame + rail`, WebGL `core` cutaway,
cutaway camera. Interact: drill commits (ICE-0 jury-rig −20 TRUST); buried-charge
depth selector (L2+); EXPOSURE accrued blind during drills, revealed at drill
completion (F4). Data: `core.json`. Cutaway geometry verbatim: 159-mi core inside
diminishing ice shell; diameter readout live from 246. Tags: REAL PHYSICS (geometry);
HEIST FRAME (drills, charges) [ABSTRACT]. Bounds: Mimas-local.

**C-2 — The final choice (Scene 11).** `plate-frame + rail`, core choice console,
WebGL `core` cutaway. Interact: TAKE IT / LEAVE IT / LISTEN (LISTEN gated on L4
prerequisites); IGNITE FINAL BURN. Data: `core.json`, `declassification.json`.
Tags: HEIST FRAME [ABSTRACT]. Bounds: Mimas-local.

### ARCHIVE — A-0 … A-5

**A-0 — Archive hub / sim-card drawer.** `index-screen`, DOM. Clearance-gated sim
cards (S1–S5 replayable from the Archive; "all five complete" is not a spine gate);
hosts the five wow exhibits W-1…W-5 as full-viewport plates (public — no clearance
needed; they're the "REAL SATURN" wing). Tags per card. Bounds: DOM.

**A-1 — Atlas: 293-moon explorer.** `index-screen`, WebGL `billiards` atlas,
atlas camera. THE 293-moon explorer screen:
- Search: name or provisional designation (matches `name` and `provisional` fields).
- Filters: orbital group (inner/main, Trojan/co-orbital, Alkyonides, Inuit, Norse,
  Phoebe group, Gallic — the actual groups in the data, plus "ungrouped"), discovery
  year range, `verified` only toggle, has-photo toggle (joins `nasa-imagery.json`).
- Discovery-timeline scrubber **1789 → 2026**: moons fade in at their
  `discovery_year`; the 4 moons discovered before 1789 (Titan 1655, Iapetus 1671,
  Rhea 1672, Dione 1684) are present from the 1789 tick with a "KNOWN BEFORE 1789"
  note. (Data max discovery year is 2023; ticks after 2023 add nothing — honest.)
- Render: one `InstancedMesh` for all 293 (per-instance size/color); only the
  9 engine moons get individual meshes. 9 engine moons live at `stateAtJD(slider)`;
  the 284 others are catalog points at baked catalog positions, labeled
  "catalog position — not propagated"; S/2009 S2 additionally carries the §4.6
  unverified card.
- Click/hover a moon → card: name, designation, IAU number, discovery year +
  discoverer, semi-major axis, period, radius (or "unpublished" where null),
  group, source note. Photo-compare button where a `nasa-imagery.json` entry exists
  (6 moons); otherwise "NO VERIFIED PHOTO — reconstruction only".
- Data: `moons-293.json`, `major-moons-elements.json` (via engine),
  `nasa-imagery.json`.
- Tags: REAL PHYSICS (everything in this view is measured data); the atlas chrome
  itself carries no HEIST FRAME — it is the one view with none.
- Bounds: Saturn-system bound sphere drawn honestly (dotted 12.9M km shell);
  Phoebe orbit line clipped per §4.7.

**A-2 — RUN archive.** `index-screen`, DOM + GL replay, replay camera. Run cards
(two-badge row: `clearance_at_win` + `verdict`); one-second scrubber varies the
timing axis only via `outcomeAtSecond(planHash, second)` — "SAME PLAN. DIFFERENT
SECOND. DIFFERENT HISTORY." (verbatim); branch → RUN #N+1. Data: `stm.runs.v1`.
Tags: HEIST FRAME [ABSTRACT]. Bounds: replay of committed sims only.

**A-3 — Codex.** `index-screen`, DOM. Declass-gated entries; locked entries =
redaction bars (never hidden text). Data: `declassification.json`. L4 top-secret
codex includes "DOTTY'S RECONSTRUCTION" (fragments). Tags: HEIST FRAME. Bounds: none.

**A-4 — Stills.** `index-screen`, DOM + PNG. Exhibit gallery; "file as exhibit"
(QA recapture path); pre-rendered 1600×1000 PNG + JSON sidecar per system-spec §10;
`stills.json` manifest. Tags: mixed per still. Bounds: per-still.

**A-5 — Settings.** `index-screen`, DOM. Reduced-motion, tier, archive tools;
storage management (the three keys, quota state). Tags: none (chrome). Bounds: none.

## 7. The five wow exhibits (W-1 … W-5, hosted in A-0)

Each is a full-viewport plate inside the Archive hub — showpiece weight, public
(no clearance). Every exhibit carries the two-tag legend (§5) + a source strip.
**Data files below do not exist yet — the builder creates them at build time from
the values in this section only (all copied from `docs/wow-features.md`); no
computed extras, no invented numbers.**

**W-1 — The Slingshot Ledger.** Cassini's real VVEJ replay, 1997→2004.
Layout: flat ecliptic-plane scene; planets on uniform circular rails
(0.72/1.0/5.2/9.5 AU — sizes not to scale, labeled); Cassini as an instanced sprite
with a ribbon trail that brightens at each assist; red "direct route" ghost path
that visibly fizzles short (no fake numbers — just a dead line).
Interact: 1997→2004 scrubber with play/pause; click a planet node → isolate its
flyby card: date, closest approach, speed stolen.
Data: new `data/vvej.json` (bake exactly): launch 15 Oct 1997 (no approach/Δv —
null) · Venus-1 26 Apr 1998, 284 km alt, +7 km/s · Venus-2 24 Jun 1999, 600 km,
Δv null (not published in the brief) · Earth 18 Aug 1999, ~1,166 km, +5.5 km/s ·
Jupiter 30 Dec 2000, 9.7 million km, Δv null · Saturn orbit insertion 1 Jul 2004.
Tags: timeline ribbon + ledger cards = REAL PHYSICS; sidebar "how does the crew
steal a moon with the same trick?" = HEIST FRAME.
Bounds: **separate solar-system rail view** — explicitly not the Saturn scene;
labeled "ECLIPTIC RAIL VIEW — NOT TO SCALE. PLANETS ON UNIFORM CIRCULAR RAILS."
Contains no Neptune/Uranus (4 planets + Cassini only — the purge is trivially satisfied).

**W-2 — The Missing Day.** Two Saturn clocks drift out of sync.
Layout: two Saturn globes side by side, each with a marker line; C-ring overlay
with propagating sine-modulated ripple rings; ticker showing accumulated lag.
Interact: time-lapse control runs simulated days — the ~5m45s/day deficit
accumulates visibly (7 days → 40m15s of lag — real arithmetic, shown in a ticker);
one slider: "which clock do you trust?" (defaults to ring seismology); ripple
rings "read out" the faster 10:33:38 period.
Data: new `data/saturn-day.json`: Voyager 1981 radio 10h39m22s (= 38,362 s);
Mankovich 2019 ring seismology (ApJ, Cassini C-ring wave patterns) 10h33m38s
(= 38,018 s); ±1m52s uncertainty (= 112 s); Cassini SKR range 10:36–10:48;
note "Saturn's magnetic axis is nearly aligned with its spin axis — radio
tracking fails" (verbatim mechanism).
Tags: day-length values + seismology story = REAL PHYSICS; overlay copy "the
crew's heist countdown is measured in slippery Saturn days" = HEIST FRAME.
Bounds: Saturn-local view; bound n/a.

**W-3 — Harbor Lights (Lakes of Titan).** 3D Titan, north-polar methane seas.
Layout: Titan sphere with orange-haze fresnel shader; "haze off" toggle swaps in
the baked 938-nm near-IR base map, explicitly labeled "haze-penetrating IR, not
visible light"; three seas as glossy dark meshes at the north pole.
Interact: hover/click a sea → fact card (real size, measuring instrument, Earth
comparison: Kraken ≈ Caspian Sea); optional methane-cycle overlay
(evaporation → clouds → rivers → seas) as animated arrow sprites.
Data: new `data/titan-lakes.json`: Kraken Mare ~400,000 km² (~1,200 km wide) ·
Ligeia Mare 126,000 km² (500 km) · Punga Mare ~390 km across; liquid
methane/ethane; north-polar concentration; instruments "Cassini ISS 938-nm
(Cassini RADAR)"; map refs "NASA 2015, PIA17655/PIA11146" as the digitization
source note (not photo URLs — shoreline polygons are 64-pt low-poly
digitizations, labeled reconstruction); per-sea centroid lat/lon baked at build.
Tags: sizes, instruments, chemistry = REAL PHYSICS; "refuel depots for the
getaway fleet" framing = HEIST FRAME.
Bounds: Titan-local view; bound n/a.

**W-4 — Plume Clock.** Enceladus's geysers vs true anomaly.
Layout: Enceladus on a visibly eccentric orbit around Saturn; plume = additive
particle fan from the south pole (~2k particles, one draw call) whose opacity
follows B(anomaly); tidal-stress glyphs (squeeze/stretch arrows) at pericentre
vs apocentre.
Interact: anomaly scrubber + auto-play; "Freeze at apoapsis" button holds the
bright state.
Data: new `data/enceladus-plume.json`: brightness curve B(true anomaly) as a
simplified peak-at-180° curve — **labeled verbatim "illustrative fit to Hedman
2013," not raw figure data**; source "Hedman et al. 2013, Nature 500:182–184 —
252 VIMS images (2005–2012): plume brightness peaks near true anomaly ~180°
(apocentre), several times brighter than at pericentre; tidal stress opens and
closes the four tiger-stripe fissures; Enceladus ~505 km across."
Enceladus position itself from `stateAtJD` at the global slider date (its orbit
is real); the plume brightness modulation is the exhibit's data layer.
Tags: brightness curve + tidal-stress explanation = REAL PHYSICS; "the crew
times the heist to the geyser clock" = HEIST FRAME.
Bounds: Saturn-system scene, bound-enforced.

**W-5 — Thread the Gap.** Cassini Division probe threading.
Layout: knife-edge side view of the Cassini Division; edge-on ring slab with
per-fragment optical depth driven by the baked profile via a custom shader on a
radial strip; named sub-gap markers (Huygens Gap etc.); radial axis honestly
log-scaled with km labels.
Interact: Mode 1 "survey" — scrub radius, read τ and km at cursor; Mode 2 "thread
it" — drag the probe through; entering τ above threshold drains the shield;
crossing under budget = "clean escape".
Data: new `data/division-profile.json`: sampled τ(r) across 117,580–122,170 km
(a few hundred points), **labeled "simplified profile shape"**; cause "carved by
Mimas's 2:1 mean-motion resonance" (verbatim); division span 117,580–122,170 km
from Saturn's center (verbatim). The probe is a fictional construct inside the
bound — no bound interaction.
Tags: division width, location, resonance cause = REAL PHYSICS; "heist's escape
corridor" framing + shield budget = HEIST FRAME [ABSTRACT].
Bounds: Saturn-local ring view; well inside the bound.

## 8. Neptune/Uranus purge — per-screen bounds check

From `docs/removal-audit.md`: 5 confirmed in-scene deletions, all inside
`story-bible-v3.md`. The builder's copy deck MUST apply them:

| # | Location | Action |
|---|---|---|
| 1 | story-bible-v3.md:404 — gag tail "assists off Uranus, Neptune, three of their moons" | DELETE/REWRITE — the gag ends at the Jupiter assist (canon) |
| 2 | story-bible-v3.md:405–406 — "'one (1) extremely rude maneuver around Triton…'" | DELETE — Triton is Neptune's moon |
| 3 | story-bible-v3.md:70 — "gravity assists off all four gas giants AND their moons" | REFRAME → "gravity assists off Saturn's moons, then the Jupiter flyby" (matches the canon route one paragraph below) |
| 4 | story-bible-v3.md:153 — "four-gas-giant + moon billiard shot" | REFRAME → "Saturn-moons + Jupiter-flyby billiard shot" |
| 5 | story-bible-v3.md:440 — "threads gravity assists off all four gas giants and a selection of their moons" | REFRAME → Saturn-system moons + Jupiter |

Per-screen verdicts: **S-1, S-3, S-8F, S-9, S-10, S-11, B-2, B-3, C-1, C-2, A-0, A-2,
A-3, A-4, A-5** — PASS (DOM or Mimas-local; no planetary content). **S-2, S-6, S-7,
B-1, B-4, B-5, A-1, W-4, W-5** — PASS (Saturn-system scene, bound-enforced via
§4.5; targets/bodies are Saturn moons only). **S-4, S-5** — PASS (scoped local
Jupiter frame; Jupiter flyby is a canon plot beat and stays). **W-1** — PASS
(separate ecliptic rail view; 4 planets + Cassini only, no Neptune/Uranus —
consistent with the purge). **W-2, W-3** — PASS (Saturn-local / Titan-local).
The Jupiter flyby is canon in every source (canon.json route, characters.json
ARGUS beat, scenes.json Scene 5, sim-spec S2) and is NOT a purge target.

## 9. Canon section

### 9.1 Locked lines (verbatim, never paraphrased)

- "Declassified 2049. Assembled 2051. Believed by nobody."
- "They thought they were stealing a mineral. They were stealing a question."
- "Whoever holds the core holds the next century."
- "THE EXPLOSION IS NEVER THE EVENT. THE ORBIT AFTER THE EXPLOSION IS THE EVENT."
- "SAME PLAN. DIFFERENT SECOND. DIFFERENT HISTORY."
- "We spent twelve years figuring out how to move it." (Qiao — kept verbatim
  even though it conflicts with the ~4–5-year active arc; the conflict is canon)
- Qiao's exchange: "It's not worth anything." / "That's the point."
- "MOON STATUS: STILL A MOON"
- "like a roommate's couch"
- "expected settling." · "don't log that"
- "246 miles? That's nothing. We can move that."
- "NO DATA — SUBJECT DECLINED."
- "ACTUAL RUNS 3,847,221,004,913,882" (display-only gag, never feeds a formula)
- "REAL SATURN. FICTIONAL CRIME. — Physics: JPL ephemeris. Everything else is the heist." (footer)
- "You decide. I'm just a bot with a badge." (Dotty)
- B-3 tradeoff copy: "deeper = less SLIP + more TIME + more FRACTURE" (never "deep = safe")
- Hero lines per screen — the 11 from §6 (S-1…S-11).

### 9.2 Visual canon

- **Mimas full sphere:** `mimas-surface-gaze.webp` wraps the WHOLE moon sphere —
  all terrain, valleys, fracture networks. Sun-driven phases; drag on desktop,
  display-only canvas on mobile. Never replaced, reprojected, or re-sourced.
- **Debris tail:** `mimas-tail-cinematic-flipped.webp` — horizontally flipped canon;
  the tail streams **AWAY from Earth**. Shown in BOTH debris and world-response
  views. Never re-flip, never mirror again.
- **State frames** (`mimas-state-arrival/pristine/peeling/tail.webp`) — user canon,
  leave untouched, bind to Mimas state transitions per STORY-STATUS.
- NASA textures (baked per §10) never replace canon textures; the photo-compare
  pane is where NASA photography lives.

### 9.3 Locked physics/plot beats (story-bible §2, with the §8 reframes applied)

Mimas 396 km; Herschel ~130 km; ~1/9 the Moon's width, ~2,000× less massive;
surface gravity 0.064 m/s²; the Long Torch burns "roughly two million years of
humanity's total energy output"; Lucky-77 demo, 4.2M viewers, "it's just a nudge
bro"; helium-3 prize "enough fusion fuel for a century"; extraction threading past
Titan, Rhea, Dione, Tethys, Enceladus; Jupiter flyby — shed energy and fall inward,
"mistime it and Mimas gets flung, captured, or tidally shredded in Jupiter's
Roche zone, plus the radiation belts"; shepherd fleet of captured asteroids
("Goose is drifting again"); DART-style impactors ("moving Mimas 1 m/s would take
~ten trillion DART-sized hits"); mass drivers throwing Mimas's own ice overboard —
"the moon burns pieces of itself to travel"; parking at distant retrograde orbit
~70,000 km, "two-thirds the Moon's width"; Roche ~26,000 km; the Herschel Slip —
~40 km fracture, "expected settling."; "the ice was fuel, not cargo"; the core is
159-mile heterogeneous exotic-mineral body; "They thought they were stealing a
mineral. They were stealing a question." All characters fictional.

## 10. Real-imagery integration

Per `docs/rebuild-artifact/ASSETS.md` (which defers to `data/nasa-imagery.json`
as source of truth):

- **Bake table (10 records, verbatim PIA/credit/URL):** PIA17172 Saturn mosaic
  ("The Day the Earth Smiled", NASA/JPL-Caltech/Space Science Institute, orig +
  medium); PIA12570 Mimas close-up ("Flying by the Death", orig + medium);
  PIA17214 Mimas global map (orig + medium); PIA17202 Enceladus (orig + small);
  PIA20016 Titan VIMS (orig + medium); PIA17155 Rhea (orig + small); PIA19653
  Dione (orig only — no medium/small exists); PIA11690 Iapetus (orig + small);
  PIA07733 Tethys (orig + small); PIA04202 HST starfield (orig only, credit
  "NASA / Hubble Space Telescope"). Excluded variants (PIA11141, PIA21324,
  PIA11178, PIA12567, PIA12572, PIA11169) must never be fetched.
- **Build-time pipeline (offline):** download only the approved variants (curl,
  HTTP-200 check; 403/404 = build failure, never a cue to guess a variant);
  reproject to 2:1 equirectangular where needed; convert to sRGB; resize per the
  texture table (Mimas hero 2048² desktop / 1024² mobile; other majors 1024²/512²;
  293-catalog moons share one 512² procedural atlas — derived from verified
  color/albedo data only, no invented photos); bake as local asset files with
  relative refs (or base64 inline) — **no `http(s)://` URL in the shipped bundle**.
  Verification greps the artifact for outbound fetches and fails on any hit.
- **Texture budget (hard):** ≤150 MB desktop / ≤60 MB mobile; anisotropy 4/2;
  DPR cap ≤1.5 everywhere.
- **Sidecar per baked texture:** `{body, url_hash, license: "PD-USGov-NASA",
  equirectangular: bool, verified_date}`.
- **Photo-vs-CGI compare mode** (S-2 hero moon, A-1 cards for the 6 photographed
  moons): split-view slider. LEFT = real NASA photo on the body mesh, labeled
  "VERIFIED PHOTOGRAPH — <mission>, <date>". RIGHT = engine render, labeled
  "RECONSTRUCTION — NOT A PHOTO". Bodies without a verified photo (the other 287
  catalog moons): LEFT shows **"NO VERIFIED PHOTO — reconstruction only"** and the
  compare control disables itself — a feature, not a missing asset.
- **Credits block** pasted verbatim into the artifact credits (ASSETS.md §5):
  "Imagery: NASA/JPL-Caltech/Space Science Institute (Cassini mission) — Saturn
  mosaic (PIA17172), Mimas (PIA12570, PIA17214), Enceladus (PIA17202), Titan
  (PIA20016), Rhea (PIA17155), Dione (PIA19653), Iapetus (PIA11690), Tethys
  (PIA07733). Starfield: NASA / Hubble Space Telescope (PIA04202). All imagery is
  public domain under PD-USGov-NASA (work of the U.S. federal government)."
- **Failure rule:** a texture that fails to bake FAILS THE BUILD LOUD — no silent
  substitution, no placeholder gradient.

## 11. Chronology defaults (chronology-resolution.md §4–5 applied)

Program day 0 = **FIRST LIGHT, 22 May 2021** (JD 2459357.0). Capture = program day
4,200 = **20 Nov 2032** (JD 2463557.0). The 4,200 days = the full program
(inception → capture burn); `canon.json` `duration_days: 4200` / `duration_years:
11.5` survive numerically untouched.

| Date | JD | Beat |
|---|---|---|
| 22 May 2021 | 2459357.0 | FIRST LIGHT — program day 0 |
| 20 Feb 2027 | 2461457.0 | Midpoint beat — program day 2,100 (ARGUS threads the first complete trajectory) |
| 30 Sep 2029 | — | Chain LINK 00 (re-dated −7,200 d) |
| 15 Oct 2029 | — | LINK 01 · 2 Dec 2029 LINK 02 · 24 Jan 2030 LINK 03 |
| 21 Apr 2030 | — | LINK 04 · 6 Aug 2030 LINK 05 · 28 Dec 2030 LINK 06 |
| 19 May 2031 | — | LINK 07 · 31 Aug 2031 LINK 08 · 10 Dec 2031 LINK 09 |
| 18 Apr 2031 | 2462975.0 | Lucky-77 demo (pinned) |
| 11–13 Feb 2032 | 2463276.0 | THE 72 HOURS — LINK 10 Saturn escape (footage "from 2032" holds) |
| 26 Jul 2032 | 2463440.0 | LINK 11 — Mimas begins Earth transfer; **global slider T−117 start** |
| ~10 Sep 2032 | 2463486.0 | Jupiter flyby (pinned) — slider tick |
| 13 Nov 2032 | 2463550.0 | Braking burn — Herschel Slip ~40 km; "don't log that" — slider tick |
| 20 Nov 2032 | 2463557.0 | **CAPTURE** — program day 4,200; **global slider T+0** |
| 4 Dec 2032 | 2463571.0 | Parking at DRO declared (day 4,214) |
| Feb 2033 | — | Mining ops begin |
| 2034 | — | The Hearing |
| 2049 | — | Declassified (Ending D's fracture propagation also lives here — intentional) |
| 2051 | — | THE MIMAS INQUIRY assembled — 19 years after the heist |

Replacements applied in copy/data: chain.json's 12 dates are the re-dated values
(§6 B-5); "14 months" → "four months" for the inward fall (117 days: 26 Jul →
20 Nov 2032); quest stage label "I THE CASING (2029) — fellowship assembles".

## 12. Tech rules

- **Stack:** pinned `three@0.186.0` (vendored into the artifact — no CDN importmap
  at runtime) + vanilla JS ES modules only. No frameworks, no paid services, no
  physics/math libs (hand-rolled deterministic math per system-spec §8).
- **Static page:** ZERO runtime network requests (fetch, XHR, WebSocket, beacon,
  CDN — all forbidden; CI greps for `http://`, `https://`, `fetch(`, `XMLHttpRequest`
  in the shipped bundle). All imagery baked per §10. Self-hosted OFL fonts
  (IBM Plex Mono, Oswald, Caveat).
- **Determinism:** `mulberry32` seeded PRNG only in sim paths; **no `Math.random`
  in render/simulation paths** (CI greps for it); same seed + same decisions =
  same state; run seed `0x5EA17`, LUT seed `0xC0FFEE`; S1 8,400-vert strip and
  41×41 LUT keep their honestly-faked footnotes ("declassified targeting
  approximation").
- **DPR cap ≤ 1.5** desktop and mobile (hard, project-wide).
- **Mobile perf budget:** ≤60 scene draw calls (bodies + orbits + rings + tail),
  ≤800 total frame; 293 moons as ONE `InstancedMesh`; only the 9 engine moons get
  individual meshes; 4 zoom tiers (SYSTEM swarm / NEIGHBORHOOD billboards / LOCAL
  detailed ≤8 bodies / SURFACE Mimas hero); auto-tier drops (293→128 instances,
  hero 2048→1024, ghosts 5000→500) keyed to the ≤1.5 DPR cap.
- **Reduced motion:** per §5 — STATIC SVG plates, stepped paths, warp disabled.
- **"SCHEMATIC — NOT TO SCALE"** badge permanent on every system view (both scale
  toggle positions).
- **Context loss:** `contextHealthy` exposed; every commit gated on it
  ("TAPESTRY PAUSED — RESTORING"); scene restores from snapshot.
- **Failure honesty:** data bundle load failure = hard error screen (no half-built
  scene); corrupt storage = migrate-or-reset card ("ARCHIVE DAMAGED — STARTED NEW
  FILE"); quota = drop oldest non-current runs, then "ARCHIVE NOT SAVING" badge.
- **Do NOT touch the live artifact's current public behavior** beyond this rebuild;
  the rebuild replaces it wholesale per this brief.

## 13. Spec gaps the builder must resolve (flagged, not silently closed)

1. **S/2009 S2 propagation:** `verified:false` → catalog dot per §4.6. Its record
   DOES contain semi-major axis/period values; the builder must not use them for
   propagation — the null-handling is intentional honesty, not a data gap to fix.
2. **vvej.json flyby Δv nulls:** Venus-2 (600 km) and Jupiter (9.7M km) have no Δv
   gains in the source brief — the builder bakes them as `null` with the card
   reading "Δv gain — not published in source". Never compute or invent them.
3. **titan-lakes.json shorelines:** 64-pt polygons are digitized at build time from
   the cited maps — the brief does not contain the coordinates; the builder
   digitizes them and labels the polygons "reconstruction digitized from
   PIA17655/PIA11146 (2015)" — an honest derivation, not verified data.
4. **division-profile.json τ(r):** the brief gives the span and "simplified profile
   shape" only — the builder synthesizes a smooth illustrative profile over
   117,580–122,170 km with a pronounced dip structure at the Huygens Gap,
   labeled verbatim "simplified profile shape". Not real UVIS data.
5. **enceladus-plume.json curve:** labeled "illustrative fit to Hedman 2013" —
   peak at true anomaly ~180°, several× brighter than pericentre. Illustrative,
   not the paper's data.
6. **A-1 discovery scrubber floor:** data min discovery year is 1655, max 2023;
   the brief mandates the 1789→2026 scrubber (Mimas's discovery year → present).
   Pre-1789 moons get the "KNOWN BEFORE 1789" note; post-2023 ticks add nothing.
7. **three.js vendoring vs system-spec §8:** system-spec allows a jsdelivr
   importmap fallback; this brief forbids it (§12, zero runtime network). The
   builder vendors three@0.186.0. If vendoring breaks a license/audit check, flag
   back — do not silently add a CDN.

---

*End of ARTIFACT-BRIEF.md. Builder: implement top to bottom. When this brief and
any older doc disagree, this brief wins. When this brief and the data files
disagree on a number, the data file wins and the brief gets a correction note.*
