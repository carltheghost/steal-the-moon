# engine/

Simulation code for the Steal the Moon rebuild. Vanilla JS, zero dependencies,
deterministic (seeded PRNG only in sim paths).

## saturnEngine.js

Real-physics Saturn-system Keplerian propagator.

- **Origin:** drafted by GPT as a build-engineer consult (2026-09-20) in the
  user's signed-in ChatGPT session; reconciled by the assistant against the
  verified JPL SAT441 table in `../data/major-moons-elements.json`.
- **Constants:** all 8 moon element rows matched the verified table exactly.
  Saturn GM = 37,931,206.23 km³/s² (SAT441; the older Jacobson-2006 canonical
  value 3.7931187e7 was replaced — it differs by ~19, outside SAT441's ±0.24).
- **Scope:** Saturn system only. Hard scene bound at Phoebe's orbit (~12.9M km);
  `isOutOfBounds()` rejects anything farther — Neptune and Uranus cannot enter.
- **API:** `keplerSolve(M, e)` (Newton-Raphson, 1e-12), `stateAtJD(jd)`
  (Saturn-centered positions km + velocities km/s), `setTimeScale` /
  `setEpochJD` / `advance`, `hohmannDeltaV(r1, r2)`, `trueScale` / `logScale`,
  `mulberry32` seeded PRNG.
- **Known approximation (documented in-module):** propagation derives
  n = √(GM/a³), so derived periods differ from the published JPL periods by up
  to 0.51% (worst moon) because the published mean elements are rounded.
  Verified by `node` smoke test 2026-09-20: 8/8 checks pass (kepler residual
  1.8e-15, determinism, bounds, Hohmann Mimas→Titan 7.242 km/s, PRNG).

No fabricated data: every element row carries its JPL source in
`../data/major-moons-elements.json`.
