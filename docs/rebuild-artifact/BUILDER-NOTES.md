# BUILDER NOTES — read before ARTIFACT-BRIEF.md

These are settled decisions from the parent agent. They override any
contradictory suggestion in the brief.

1. **Use GPT's renderer as-is.** `engine/saturnScene.js` was written by GPT
   (ChatGPT, via the user's signed-in session) for this rebuild. It is the
   cinematic 3D renderer — `createSaturnSystem(THREE, engine, textures)`,
   real ring radii, engine-driven moon positions, deterministic, DPR ≤1.5.
   Integrate it; do not rewrite it.

2. **Phoebe stays OUT of the engine.** `saturnEngine.js` keeps exactly its 8
   major moons (Mimas, Enceladus, Tethys, Dione, Rhea, Titan, Hyperion,
   Iapetus). Phoebe's apoapsis (~15.0M km) straddles the 12.9M km hard scene
   bound, so propagating it would contradict the bound. Phoebe appears in the
   293-moon explorer as catalog data only (from `data/moons-293.json`), never
   as a propagated body. Brief §13's suggestion to add it is rejected.

3. **Noon-convention Julian dates everywhere.** `jdFromISO` maps bare calendar
   dates to 12:00 UT (matches J2000 = JD 2451545.0 and the engine epoch).
   Capture = JD 2463557.0, slider T−117 → T+0 = JD 2463440.0 → 2463557.0.

4. **Chronology is already applied in the data.** `data/chain.json` carries
   the corrected 2029–2032 dates; `data/canon.json` has the `scope` clarifier.
   Do not re-date anything.

5. **Static artifact rules.** All NASA imagery baked at build time from
   `data/nasa-imagery.json` (verbatim credits in ASSETS.md). No runtime
   network. No Neptune, no Uranus, no Triton anywhere.
