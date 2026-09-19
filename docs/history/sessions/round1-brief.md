# STEAL THE MOON — Round 1 master proposals: condensed brief for Round 2 critique
Full texts: ~/workspace/steal-the-moon/master2-threejs-visualization.md,
master3-interaction-game-design.md, master5-visual-design.md. Masters 1 (orbital) and 4
(story) delivered in-report only (no files).

## A. WHAT EACH MASTER PROPOSED

### M1 — Orbital/geophysics
- Sim models: S1 analytic patched-conic legs + Catmull-Rom knot interpolation (knots in
  canon.json); S2 two-layer (analytic hyperbola + 41×41 bilinear LUT generated at runtime
  from closed-form seeded formula); S3 pure ledger arithmetic; S4 seeded Box-Muller
  ghosts through the S2 LUT (honestly a response-surface mapping, not n-body); S5
  closed-form Clohessy-Wiltshire relative dynamics; Billiards discrete event graph
  (coupling η(d)=η₀·exp(−d/λ), fracture p_f(d)=1−exp(−d/ρ), seeded draws → outcome class);
  Core analytic mass-loss with two density regimes + discrete Slip event; buried charges
  share the η/p_f model. Honestly-faked list per sim.
- Shared state: **`STEAL`** object, full schema (version, seed, scene 1..11, declass 0..5,
  trajectory{tau,playing,speed,aimDx,aimDy,jupiterRp,checkpoints}, dv{reserve 35.0, spent,
  ledger[], projectedEarthReserve, earthCaptureBurn 2.5, earthPerigeeKm 500},
  billiards{run, runs[], forbiddenUsed, trust 50.0 (0..100), timeDays}, core{throttle,
  alloc[4], massKg, diameterMi 246.0, shellMi, slipTriggered}, s5{impulseBudget 100,
  score, best}, s4{seed, n 5000/800, pSuccess}, flags{reducedMotion, mobileTier}).
  Derived values recomputed by single `recompute(STEAL)`; persisted to localStorage.
  Note: `seed: 0x5TEA1` in the draft is a pseudo-code joke — invalid hex, must not ship.
- Data flow table: canon.json→S1/S2/S3/S4/Core; chain.json→Billiards; core.json→Core;
  characters.json→annotations/hearing; scenes.json→gating; declassification.json→gates;
  stills.json→thumbnails/backdrops; moons.json→atlas masses. Build-time precompute
  minimal (knot tables, indices); LUT/clouds/replays runtime-generated from seeds.
- Coupling variables (all on STEAL): aimDx/aimDy→S5 inherited bias; billiards dvSpent→dv
  ledger; timeDays→S2 valid-band shrink; core.diameterMi/massKg→S1 readout, S4
  CORE_EXPOSED_EARLY tag, S5 CW gain; projectedEarthReserve<0→S4 P(success)=0;
  trust≥60 gates FORBIDDEN; declass gates Gary record, L4 core density, FINAL CANON.
- OSS: three.js pinned **0.170.0** (jsdelivr ESM importmap); NO math lib (hand-rolled
  mulberry32, Box-Muller, bilinear, Catmull-Rom, CW); no build step; dev-only Node
  schema validator for the 8 JSON files.

### M2 — three.js visualization
- One persistent WebGL2 scene, 6 mode root groups (gTimeline/gFlyby/gCloud/gShepherd/
  gBilliards/gCore) toggled visible, never rebuilt; pooled Saturn/Jupiter/Earth/
  Titan/Rhea/Dione/Mimas shells; LinePool/PointPool/SpritePool/MeshPool; single RAF,
  fixed-step sim accumulator; OrbitControls attached only in FLYBY/CLOUD/SHEPHERD/
  BILLIARDS/CORE, detached otherwise; WebGL owns trajectories/bodies/clouds, DOM owns
  all chrome/text.
- Per-sim render: S1 one Line strip 8,400 verts vertex-colored + sprite marker; S2 cyan
  archive line vs amber player line (512-pt conic family from LUT), draggable aim sprite,
  banded-shader Jupiter; S3 torch arc (partial torus) + plume sprites, numerals in DOM;
  S4 **5,000 ghosts as ONE THREE.Points with vertex-shader curve lookup (1 draw call)**;
  S5 Mimas-centered instanced spheres + pooled shockwave rings; Billiards local
  Saturn frames, flash quad ≤10% viewport, orbit strips 90%, 0.5s freeze = sim-time
  pause; 293-moon atlas = 1 Points + 12 instanced LOD meshes; Core cutaway = clipped
  hemisphere (global clipping plane, mouse-draggable), Seismic/X-ray/Exploded toggles,
  zoned vertex-colored core, procedural Herschel groove, arrival state (ocean shell +
  gold/silver massif cones), charge depth markers 2/7/17/25 mi + stress-wave rings.
- Display mapping: trajectory modes log2 radial compression; S2/S5/billiards/core local
  linear frames; permanent DOM badge "SCHEMATIC — NOT TO SCALE" (+ WebGL sprite backup).
- Stills: stills.json entries {mode, camera, state, seed}; runtime capture pipeline
  (set state → 3 deterministic warm-up frames → toDataURL PNG + sidecar JSON → exhibits/).
- Tiers: desktop full (5k ghosts, PR≤2); mobile reduced (500–1k ghosts, **S2 and S5 become
  SVG/DOM**, atlas Points only, PR≤1.5, frame governor); no-WebGL full DOM/SVG fallback
  with pre-rendered PNGs; reduced-motion = instant cuts, static outlines, no drift.
- OSS: **three@0.186.0** via npm lockfile + jsdelivr importmap fallback; addons
  OrbitControls + BufferGeometryUtils only; custom GLSL for cloud/shockwaves/dashed
  lines/ocean; deliberately NO EffectComposer/bloom, NO physics engine, NO GLTF,
  NO react-three-fiber.
- Open question: should truth-grammar line styles be a shared LineStyle utility with the
  DOM/SVG tier? (recommends yes)

### M3 — Interaction/game design
- Screen map: **30 screens** — linear chapter spine (S-1→S-10, +S-8F fail branch) with
  free-roam Archive hub (Esc from anywhere). 10 story + 5 sims + 5 billiards wizard
  steps (B-1→B-5) + 2 core (C-1→C-2) + 6 archive (A-0→A-5). Breadcrumbs everywhere.
- Sim grammar (shared): set inputs → commit → observe → report → resource delta.
  S1: RECORD CONFLICT freezes with ACCEPT A/B/FLAG BOTH. S2: ±5,000 km clamp, rehearsals
  vs one real S-6 commit. S3: five-band meter + RECONCILE at L2 (14.2 reported → 9.8
  recovered ghost reserve). S4: progressive reveal, tap tags, 2 comparisons to complete.
  S5: 60s choreography with STEP MODE alternative, arrow lock final 10s. Billiards:
  deterministic re-simulation, timing slider = only chaos lever; FORBIDDEN L3-gated,
  redacted, 1 use. Core: burn table w/ cooldowns, EXPOSURE hidden until L4, LISTEN has
  prerequisites.
- Resources: **TIME 120d / Δv 35.0 / TRUST 5** starting; earn/spend matrix per action;
  fail states labeled in advance; ledger-lie = player-controlled difficulty lever
  (reconcile or don't, S-9 consequences either way). TRUST 0 = soft fail.
- RUN archive: RUN #N stores **decisions + seed only** (trajectories re-derived);
  one-second scrubber varies timing axis only; branching → RUN #N+1; S-9 exhibits pull
  live numbers; skipped sims = "NO DATA — subject declined."
- Declass: L0–L4 + FINAL CANON, all action-gated never time-gated, persists per browser;
  locked controls show lock reasons.
- Mobile: canvas display-only, all inputs real DOM controls below canvas; drag→
  drag-or-stepper, hover→tap, keyboard→on-screen transport bar; S5 STEP MODE (12×5s);
  0.5s freeze = input lock not skill; reduced-motion stepped alternatives, no dead ends.
- Risks: scope creep (one shared commit/report module, no new mechanics after L2);
  unwinnable states (auto-checkpoints, pre-commit warnings, S-8F always exits);
  tutorialization (grammar taught before billiards, 3-step coach, RUN #1 = rehearsal).
- Open questions: (a) S-9 verdict mechanical teeth beyond FINAL CANON lock? (b)
  localStorage for run archive — acceptable?

### M4 — Storytelling
- Scene→sim wiring (11 scenes, each with a reader COMMIT): 1 THE FILE (folder UI, break
  seal); 2 THE MOON (S1 as Mimas tour/rotator, pin-drop); 3 THE MACHINE (**S2 as heist
  engine sim**, burn-budget allocation); 4 THE FIRST LIE (**S4 as helium-3 worksheet**,
  ledger never balances); 5 THE CASCADE (**S3 as cascade/resonance chain**); 6 THREE
  TRILLION DOORS (Billiards shot planner); 7 THE SHEPHERDS (dossier wall, NO sim, trust
  vote); 8 THE SLIP (**S5 as Slip window sim**, Ren's traces); 9 EARTH, SOMEHOW (S4
  recall, return ledger); 10 THE HEARING (replay console, TESTIFY defend/condemn);
  11 DECLASSIFIED (Core burn console).
- Motive-flip 5 reveals with mechanics: I READ sealed folder (S1) → II FAIL THE MATH
  worksheet (S4) → III VERIFY checksum button (S6) → IV DISCOVER hidden-burn toggle (S8)
  → V BURN final declassification (S11).
- Declass narrative: L0 SEALED → L1 UNSEALED (break S1 seal) → L2 LEAKED (S8 file slips
  in) → L3 CORRECTED (S10 testimony) → L4 COMPLICATED (S11 core burn) → FINAL CANON
  (reader's record becomes the file). Levels earned only by commits; skipping holds the
  level. NATURAL REACTOR file: hover to un-redact, re-redacts on release. ARTIFACT file:
  admit-or-suppress choice in S10 changes verdict.
- Characters: Dotty = UI chrome (worsening redactions 5%→60%); Ren = transcript clips +
  margin notes, 4th testimony needs S8 hidden-burn toggle; Qiao = sim-free mission log
  (S5 "hers alone"); Voss = unsigned inserts, attribution "archival error"; ARGUS =
  sim status line ("Civilization remains intact. For now."). Ren's sabotage = 3
  discoverable traces, never named.
- Scene 10: pulls S2 allocation + S3 cascade + Billiards plan from localStorage;
  "Exhibit 42B. The trajectory you selected." staged as hearing room; DEFEND/CONDEMN
  per exhibit + optional free text; skipped sims = empty folder "NO RECORD — WITNESS
  DECLINED TO PARTICIPATE" (absence testifies).
- Gags: corrections counter #17→#18→#19→CLASSIFIED with stamp animation + hover log;
  ARGUS politeness every sim (+3s pause in S8); 1.7mm motif (tolerance→footnote→core
  fragment width); "MOON STATUS: STILL A MOON" header pill updating per scene.
- Risks: lore drift (render from JSON, never assert); pacing bloat (one screen/one
  commit/one exit per scene, ~15 min critical path, sims skippable); hearing flat
  (cross-examine, don't recap; verdict computed from commits).

### M5 — Visual design
- Tokens: 6 canon colors + text-safe deep variants (cyan-deep #4E7D82, amber-deep
  #8F6E2C, ≥4.5:1 on ivory); IBM Plex Mono / Oswald / Caveat (OFL, exact weights);
  clamp() type scale; stamp/tape/redaction CSS; feTurbulence paper texture (data-URI SVG).
- Composition: fixed 56px archive chrome + 62/38 viewport/rail split + marginalia
  gutter; one shared DOM skeleton (`plate-frame` viewport, `rail` dossier) for all
  scenes/sims/atlas/codex; DOM-over-WebGL with transparent canvas over CSS paper;
  mandatory `.human-anchor` module on every dense viz.
- Exhibit plates: uniform furniture (EXHIBIT header, honesty label, scale bar, human
  anchor, stamps/tape, canon source footer); capture composites canvas+SVG → 1600×1000
  PNG; in-flow hero vs contact-sheet archive index with lock states.
- Truth grammar: exact SVG dash specs + WebGL equivalents (LineDashedMaterial params)
  for solid/dashed/dotted/double-line; shared `.legend`; Δv gauge, TIME/Δv/TRUST bars,
  ICE/SLIP/EXPOSURE segmented meters, all role="meter" + numeric redundancy, never
  color-only.
- POV/declass: `.pov-ren/.pov-qiao/.pov-voss/.pov-dotty` CSS classes; ladder via
  `body[data-declass]`; redaction bars lift via scaleX stagger (instant reduced-motion);
  FINAL CANON = charred-edge plate, "burned, not redacted."
- Mobile/reduced-motion: stack <768px, 48px targets, gutter hidden; **static SVG fallback
  plates per sim tagged STATIC** (designed, not broken).
- Risks: bloat (shared furniture component, content-visibility), canvas/DOM seams
  (transparent canvas, ResizeObserver refit), a11y (deep-variant colors, dash
  redundancy, aria-labeled canvases + data tables).

## B. DETECTED CONFLICTS (coordinator — resolve in Round 2)

1. **three.js version pin: M1 says 0.170.0, M2 says 0.186.0.** One pin must win.
2. **TRUST scale: M1 STEAL.trust = 50.0 on 0..100 (FORBIDDEN gated at trust ≥ 60);
   M3 says TRUST starts at 5.** Units/scale conflict.
3. **TIME resource: M3 starts TIME at 120d with earn/spend matrix; M1 has only a
   `timeDays` consumed counter from 0.** Define TIME properly.
4. **M4 redefines canon sims.** Canon (locked): S1=trajectory timeline, S2=Jupiter flyby
   sandbox, S3=Δv meter, S4=probability cloud, S5=shepherd mini-game. M4's wiring uses
   S2 as "heist engine sim", S4 as "helium-3 worksheet", S3 as "cascade chain",
   S5 as "Slip window sim", S1 as "Mimas tour", and makes Scene 7 sim-free while giving
   Qiao's log to "S5". M4 must realign scene→sim wiring to the canonical sim
   definitions (the worksheet/cascade/slip-window/hearing mechanics can exist as scene
   interactions WITHOUT renaming sims).
5. **Scene/screen count: canon = 11 scenes. M3's spine is S-1→S-10 + S-8F fail branch
   (10 chapters).** Map to 11 scenes explicitly.
6. **Mobile canvas interactivity: M2 attaches OrbitControls in 5 modes; M3/M5 say canvas
   is display-only on mobile with real DOM controls below.** Decide the mobile
   interaction contract.
7. **Stills pipeline: M2 = runtime capture (toDataURL + sidecar, re-capturable);
   M5 = build-time pre-rendered PNGs in exhibits/.** Decide primary + fallback.
8. **S2 response surface: sim-spec canon = 81×81 B-plane grid; M1 = 41×41 runtime LUT
   from formula.** Decide grid/formula (both bilinear; pick one).
9. **S5 bodies: canon = 5–7 asteroids; M2 renders 3 shepherd bodies.** Align.
10. **Persistence: M1 (STEAL→localStorage), M3 (RUN archive→localStorage?), M4 (hearing
    pulls localStorage)** — agreement emerging; ratify localStorage as THE persistence
    layer and its schema/versioning.
11. **M4's Scene 2 "pin drop" and M3's screens** — fine, but every M4 scene-commit must
    map to an M3 screen. Round 2 must produce the mapping.
12. **Declass earning: M4 (seal→S1, leak→S8, testimony→S10, burn→S11) vs M3
    (action-gated, persists).** Compatible — ratify the unified earning table.

## C. CONVERGENCE CHECKLIST (vote ACCEPT/REJECT + one-line reason in Round 2)
- C1. Shared state object named **STEAL** per M1's schema (fix the 0x5TEA1 joke seed to a
  valid uint32; resolve trust/time scales via C2/C3).
- C2. **three.js single pinned version** (choose 0.170.0 or 0.186.0 with reason).
- C3. **TRUST = 0..100 scale, starts 50** (M1) — or M3's alternative with conversion.
- C4. **TIME = mission-day budget**: starts 0 consumed, cap = 4,200-day mission + 120d
  contingency (M3's 120d becomes the contingency reserve) — or alternative.
- C5. **Canon sim definitions are FIXED** (S1 timeline / S2 flyby / S3 meter / S4 cloud /
  S5 shepherd); M4 realigns scene wiring; new mechanics (worksheet, checksum, hidden
  burn, hearing) are scene interactions, not sim renames.
- C6. **11 scenes**, mapped 1:1 to M3's screen spine (S-8F becomes Scene 8's fail state
  within the 11).
- C7. **localStorage** is the persistence layer (STEAL snapshot + RUN records,
  versioned, schema-checked on load).
- C8. **Mobile contract**: canvas display-only; ALL sim inputs as DOM controls;
  OrbitControls desktop-only (or fully removed — decide).
- C9. **Stills**: build-time pre-rendered PNGs are primary (M5); runtime re-capture
  (M2) is the dev/QA tool. Sidecar JSON ships with each still.
- C10. **S2 LUT**: runtime-generated 41×41 from closed-form seeded formula (M1),
  diegetic footnote "declassified targeting approximation".
