# STEAL THE MOON — Simulation Build Spec (5-agent roundtable output, 2026-09-19)

Source: 5 ChatGPT master agents (orbital mechanics, three.js, game design, storytelling,
visual design), 2 rounds. All 5 simulation features use three.js + simulation stills.

## Canonical numbers (locked)
- Mimas 396.4 km; Herschel crater ~130 km.
- Route: Saturn departure (v∞ nominal 3.0 km/s) → Titan → Rhea → Dione assists →
  Jupiter flyby (r_p nominal 1.20 R_J, valid 1.10–1.30, invalid <1.00 R_J) →
  Earth encounter → capture perigee burn (~2.5 km/s, perigee nominal 500 km).
- Mission duration 4200 days (~11.5 yr). Trajectory polyline: 6-hour samples =
  16,800 pos+vel points (Float32Array). 1 AU = 100 scene units.
- Δv budget: 35.0 km/s TORCH RESERVE (nominal spend ~28.5–30). Tweak cost =
  base + 0.015·dev² (dev in 100-km units). BURN TIMING 00:00:17.4 (±1s → +11 days).
- Ghost ensemble: 5,000 rendered trajectories × 96 samples, seeded PRNG;
  counter gag: ACTUAL RUNS 3,847,221,004,913,882.
- Failure signatures (stable IDs): BODY_IMPACT, EARTH_MISS, FUEL_EXHAUSTED,
  SATURN_RETURN, LATE_ARRIVAL, CAPTURE_FAILURE.
- S5: impulse budget 100 units; inherit S2 arrival error (+0.021°) → correct to +0.004°.
- Win thresholds: arrival ±30 days, capture error <0.5%, reserve positive.

## The 5 features
- **S1 Scrubbable trajectory timeline**: filmstrip ruler t=0..1, play/pause, 0.25/1/4/16×,
  HUD (MISSION CLOCK DAY x/4,200, DATE, ON NOMINAL PATH), event cards + Dotty
  annotations at encounters, "HISTORY BUFFERING..." fast-scrub gag, RECORD CONFLICT
  markers that freeze the timeline where POVs disagree.
- **S2 Flyby tweak sandbox**: zoom to Jupiter, drag aim marker (±5,000 km), live
  response-surface lookup 10–20 Hz (81×81 B-plane grid, bilinear interp), HUD shows
  miss distance / Δv / arrival date / capture error, COMMIT BURN flow, ARCHIVE PLAN
  (cyan) vs YOUR VERSION (amber), "VISUAL DIVERGENCE EXAGGERATED ×12" honesty label,
  cascade strip JUPITER→EARTH ARRIVAL→CAPTURE→MIMAS ORBIT, RESET SANDBOX.
- **S3 Delta-v meter**: DOM instrument "TORCH ΔV ACCOUNT 28.7/35.0 km/s", PROJECTED
  EARTH RESERVE marker, CAPTURE BURN: POSSIBLE/RUDE/ABSOLUTELY NOT, stamped ledger,
  states NOMINAL→UNCOMFORTABLE→OH→OH NO→EXHAUSTED, "ABSOLUTELY DO NOT USE THIS FUEL"
  redacted ledger gag, rewind checkpoints ("LAST STABLE HISTORY: 2046-07-19").
- **S4 Probability cloud**: 5,000 faint ghost trajectories (3–8% opacity) converging on
  the one chosen path; progressive reveal 500→5000; decoupled bureaucratic counter
  with glitch gag; hover → rejection tags ("MISSED JUPITER BY 11 SECONDS",
  "TECHNICALLY ARRIVED IN 2089", "REJECTION REASON: PHYSICS"); click to compare.
  Narrative midpoint: "ARGUS wasn't searching for the successful route — it was
  eliminating the unsuccessful ones."
- **S5 Shepherd mini-game**: Mimas-centered view, 5–7 asteroids, AUTHORIZED CORRIDOR
  band, drag velocity-vector arrow with predicted preview, 60s choreography
  (READ→NUDGE→CHAIN REACTION→STABILIZE→REVEAL), win: 3 corrections, corridor held
  10s, <100 impulse. Fail: "SHEPHERD OVERCORRECTION" / "You were the problem."

## Render architecture (three.js)
- One persistent WebGL2 scene, orthographic top-down camera. PHYSICS space vs
  DISPLAY space (log2 radial transform) with permanent "SCHEMATIC — NOT TO SCALE" badge.
- DOM/CSS owns all archival UI; WebGL owns trajectories/cloud/bodies only.
- One deterministic MissionState drives all five sims. sceneMode
  TIMELINE/FLYBY/CLOUD/SHEPHERD switches without destroying the scene.
- Mobile tier: 500–1000 ghosts × 48–64 samples; poor-WebGL fallback: static cloud
  texture + DOM scrubber, SVG/DOM for S2/S5. Keyboard: Space/←/→/Shift/Enter/Backspace/Esc.
- Perf: 60fps@1080p, ≤2000 draw calls, ≤100MB GPU, pixelRatio≤2. REDUCE MOTION supported.

## Art direction
- Identity: "TOP SECRET / EXHIBIT 7B" — NASA mission binder × forensic evidence board.
- Palette: ivory #E9E2D2, blue-gray #667681, near-black #202321, cyan #71A9AD
  (canonical path), amber #C69A45 (fuel/uncertainty), red #8E3434 (errors/stamps).
- 3 type voices: mono/typewriter (data), condensed bold sans (EXHIBIT 13D),
  handwritten marker (Dotty marginalia — never carries essential info).
- Rules: One Hero Line per view; Science Serious, Paperwork Stupid (humor in
  labels/stamps/redactions, never in geometry); every dense viz gets a human-scale anchor.
- 11 stills: EXHIBIT 1A master trajectory; FIG. 02 Mimas plate; FIG. 08C assist
  close-up; EXHIBIT 13D sandbox; FUEL ACCOUNTING GAUGE; ATTACHMENT 42 cloud;
  FIG. 19 shepherd fleet; FIG. 19B before/after; EXHIBIT 27 capture;
  EXHIBIT 31 Earth catch-up strip; EXHIBIT 51 Herschel Slip fracture map.

## Narrative wiring (Agent 4)
- Presenters: S1 Dotty, S2 ARGUS, S3 Ren+Dotty, S4 ARGUS+Dotty, S5 Qiao.
- Scene map: 1 THE FILE (S1), 2 THE MOON (S1), 3 THE MACHINE (S3), 4 THE FIRST LIE (S2),
  5 THE CASCADE (S2+S3), 6 THREE TRILLION DOORS (S4), 7 THE SHEPHERDS (S5),
  8 THE SLIP (S1+S5), 9 EARTH, SOMEHOW (S1+S3), 10 THE HEARING (replays reader's
  actual S2/S3 results as "Exhibit 42B. The trajectory you selected."),
  11 DECLASSIFIED (S4 returns altered — "The archive has been modified.").
- Running gags: "HISTORY HAS BEEN CORRECTED" #17→#18→#19→CLASSIFIED; ARGUS technically
  polite ("Civilization remains intact. For now."); Dotty's worsening redactions;
  the 1.7 mm motif (S2 gag → S4 sensitivity → Scene 8 Slip correction).
- Final hook: "If ARGUS simulated trillions of futures, why is the archive still changing?"

## Build order
Data (ephemeris LUT, canonical traj, response surface, ghosts, failure registry) →
render core → S1 → S2 → S3 → S4 → S5 → stills → narrative wiring.
Honestly faked: trillions of sims, real-time n-body, Mimas deformation, exact capture.
