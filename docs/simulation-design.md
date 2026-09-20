# Simulation Design — Steal the Moon (engine spec, build-ready)

## 1. Scene model

**Hard bound: Saturn system only.** The scene contains Saturn, its rings, and the
293 moons of the catalog. Neptune and Uranus are EXCLUDED from the scene — no
bodies, no references, no ephemeris data for either is loaded or baked. The scene
hard-bounds at Phoebe's orbit (~12.9M km): nothing is simulated, rendered, or
queryable beyond that radius. The canonical trajectory's Jupiter/Earth encounters
(S1/S2 in sim-spec) are **event-card overlays on baked trajectory data only**
(see §6) — they are not live bodies in the scene graph.

**Scale strategy — two spaces, never mixed:**
- PHYSICS space: real kilometers, float64, centered on Saturn. All orbital math,
  impulse vectors, margins, and ledgers live here.
- DISPLAY space: `log2(1 + r_phys / R_SATURN)` radial compression (per sim-spec
  "PHYSICS vs DISPLAY"), applied at render time only. Permanent
  "SCHEMATIC — NOT TO SCALE" badge on every view.
- Hierarchical scene graph to defeat float-precision death: the camera carries a
  floating origin (camera-centered origin shifting). World position =
  bodyNode.position (double-precision local) → GPU gets a float32 offset
  relative to the active origin node. Origin re-centers when the camera target
  moves >50,000 km. Saturn (60,268 km radius — value from JPL planetary facts, baked in a
  constants block in the data bundle, not invented) never renders at 1:1 in a system-wide view; at the
  Mimas zoom tier (§5) it renders at true relative scale within the local node.

## 2. Keplerian solver

- **Time base:** real GM_Saturn seconds, value baked from JPL in
  `major-moons-elements.json` (never hard-coded as a literal; loaded as `GM`).
- **Propagation:** fixed-step Keplerian solver (solve Kepler's equation by
  Newton iteration to 1e-12 rad tolerance), mean elements at J2000 epoch
  (2000-01-01 12:00 TDB) from the same JSON. Fixed dt: 3600 s nominal sim tick;
  bodies are evaluated on demand per date, not integrated continuously —
  Keplerian propagation is analytic, so determinism is exact.
- **Date slider:** calendar date → TDB Julian date → mean longitude
  `M = M0 + n·(t − J2000)`, `n = sqrt(GM/a³)`. Null/unverified elements (§3)
  render as static catalog dots, never propagated.
- **Time-warp:** pause / 1× / 10× / 1000×. At 1000×, bodies are analytically
  re-evaluated per frame (no integration error accumulates). All warps are
  deterministic: same date = same state, always.
- **RNG:** mulberry32 seeded PRNG (`seed = missionEpoch ^ runId`) for ghost
  ensembles, uncertainty cones, cloud sampling. `Math.random` is forbidden in
  render/simulation paths; CI greps for it. Seeded runs replay identically
  ("SAME PLAN. DIFFERENT SECOND. DIFFERENT HISTORY." — the one-second mechanic
  changes the seed input, not the algorithm).

## 3. Data layer

- **Baked JSON, loaded once at startup:** `moons-293.json` (catalog:
  `{name, provisional_designation, discovery_year, discoverer,
  semi_major_axis_km, orbital_period_days, mean_radius_km, orbital_group,
  source, verified}` — `verified: false`, or null for unverified values),
  `major-moons-elements.json`
  (JPL mean elements + GM_Saturn), `nasa-imagery.json`
  (verified photo manifest), `canonical-chain.json` (12 links), trajectory
  LUT (N pos+vel Float32Array points, N TBD at build). All in `data/`,
  versioned, fetched via one async bundle before first frame; failure to load =
  hard error screen (no half-built scene).
- **Null/unverified records:** graceful fallback, honest UI. A moon with missing
  or `verified: false` elements gets `propagatable: false`, renders as a
  labeled catalog point (no orbit line), and its card shows "ELEMENTS UNVERIFIED
  — position shown at catalog epoch, not propagated." Never silently invent
  elements; never render an unverified orbit as real.

## 4. Real-image pipeline

- `nasa-imagery.json` lists only verified NASA photos (Cassini-era). Each entry:
  `{body, url_hash, license: "PD-USGov-NASA", equirectangular: bool,
  verified_date}`. At build time (offline), images are reprojected to 2:1
  equirectangular and converted to sRGB color space; runtime loads the baked
  texture, never the raw source.
- **Texture budget:** Mimas hero texture 2048² (desktop) / 1024² (mobile);
  other major moons 1024² / 512²; 293-catalog moons share one 512² atlas.
  Max anisotropy 4 desktop / 2 mobile. Total texture budget ≤ 150 MB desktop,
  ≤ 60 MB mobile.
- **Photo vs CGI compare mode:** split-view slider. LEFT = real NASA photo on
  the body mesh (labeled "VERIFIED PHOTOGRAPH — <mission>, <date>"); RIGHT =
  the engine's procedural/CGI render (labeled "RECONSTRUCTION — NOT A PHOTO").
  If a body has no verified photo, the LEFT pane shows "NO VERIFIED PHOTO —
  reconstruction only" and the compare control disables itself.

## 5. Performance budget

- **Draw calls:** ≤ 120 desktop / ≤ 60 mobile for the scene (bodies + orbits +
  rings + tail). Total frame ≤ 2000 / ≤ 800 including DOM-instrumented HUD
  (kept out of the WebGL budget).
- **293 moons:** single `InstancedMesh` point-cloud swarm with per-instance size
  and color; only the 24 "regulars" + current encounter bodies get individual
  meshes. LOD: 4 zoom tiers — SYSTEM (swarm only), NEIGHBORHOOD (regulars as
  billboards), LOCAL (detailed meshes ≤ 8 bodies), SURFACE (Mimas hero mesh).
- **DPR cap:** ≤ 1.5 desktop and mobile (project-wide hard rule). Frame budget
  16.6 ms desktop / 33 ms mobile; auto-tier drops: 293→128 instances, hero
  2048→1024, ghosts 5000→500 (see sim-spec mobile tier). All resolution budgets
  are set against the ≤ 1.5 DPR cap — nothing in the texture or render budget
  assumes a 2× framebuffer.
- **Reduced motion:** time-warp disabled, ghost animation frozen to static
  cloud texture, per `prefers-reduced-motion`.

## 6. Fictional mechanics labeling

**Where the abstract lives:** all non-physical heist mechanics — nuclear impulse
tiers, coupling efficiency, the Δv ledger, the "ONE-SECOND" scrubber, TRUST
meter, declassification states, RUN archive branches — live in the
`FictionEngine` module, a cleanly separated layer that consumes PHYSICS-space
positions but never modifies them. Fiction writes its own ledger; physics
remains JPL-pure.

**UI labeling contract (non-negotiable):**
- Real physics elements are labeled in mono/typewriter voice with provenance:
  "POSITION FROM JPL MEAN ELEMENTS, J2000 EPOCH".
- Every fictional mechanic carries a visible tag in the UI:
  `[ABSTRACT]` = gameplay lever with no physical counterpart (e.g., TRUST,
  impulse tiers beyond patched-conic approximation).
  `[EXAGGERATED ×N]` = physical quantity with visual scale distortion (e.g.,
  S2's ×12 divergence).
  `[DRAMATIZED]` = event sequence condensed for narrative (e.g., 0.5 s impact
  freeze).
- The cascade report and ledger screens show a footer line:
  "REAL SATURN. FICTIONAL CRIME. — Physics: JPL ephemeris. Everything else is
  the heist."
