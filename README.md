# STEAL THE MOON — open data & specs

**"Declassified 2049. Assembled 2051. Believed by nobody."**

Open-source data and build specs for *Steal the Moon*, an interactive
"declassified history" web story about the greatest theft in history: towing
Saturn's moon Mimas — all 246 miles of it — to Earth orbit with a fusion torch
drive, and what was really inside it.

**Real Saturn. Fictional crime.** All characters are fictional; no real persons
depicted. Moon data below is real (NASA/Cassini, IAU Minor Planet Center); the
heist, the core, and the chain are fiction.

## Launch

The complete playable site is committed at `web/index.html` as a self-contained static artifact. It includes the archival UI, Saturn engine, 24 navigable screens, seven simulation systems, baked imagery, local persistence, reduced-motion fallbacks, and no runtime backend.

**Intended GitHub Pages URL:** https://carltheghost.github.io/steal-the-moon/

The repository now contains an automated Pages deployment workflow at `.github/workflows/deploy-pages.yml`. Before the first deployment, GitHub Pages must be enabled for the repository with **Settings → Pages → Build and deployment → Source: GitHub Actions**. The repository API currently reports Pages as disabled, so that account-level switch cannot be completed through the connected GitHub API. Once enabled, pushes to `main` run the verification gate and deploy `web/` automatically.

## Verification

The deployment workflow checks:

- all canonical and rebuild JSON files parse;
- `scripts/check.py` passes;
- `web/index.html` exists at the expected scale and contains the required self-contained boot markers;
- the shipped artifact contains no direct runtime `fetch`, XHR, WebSocket, beacon, or external script/style URL patterns.

## The canon in 60 seconds

- Mimas departs Saturn at **246 miles** diameter (NASA figure): a **159-mile
  heterogeneous exotic-mineral core** wrapped in ~43 miles of ice.
- *"246 miles? That's nothing. We can move that."*
- The voyage strips and burns the ice as fusion fuel — the moon loses
  **diameter AND mass**. It arrives at ~199 miles: a **metal core** wearing a
  **~20-mile-deep global ocean**, with exposed metallic massifs breaching the
  surface — mountains with the luster of gold and silver.
- The gold look is the perfect lie made physical: everyone assumes a gold rush.
  The truth is **POWER, not price** — "the thing you need to accomplish
  everything about the unknown."
- The official story (helium-3 mining) was inserted into the archive *after*
  the fact. The motive flips in five reveals: helium-3 → bad math → checksum
  mismatch → the ice was fuel → the core.
- Qiao: *"It's not worth anything."* / *"That's the point."*
- Ren (love's mirror) sabotages the mission to save the moon: *"You keep
  asking who owns the moon. That is the wrong question."*
- Saturn has **293 confirmed moons** (August 2026): 24 regular, ~269 irregular
  (Norse retrograde; Gallic and Inuit prograde).

## Data dictionary (`data/`)

| File | Contents |
|---|---|
| `canon.json` | Moon/core geometry, voyage departure → arrival, diameter/mass loss, route, torch reserve |
| `chain.json` | The 12-link Saturn Billiards nuclear chain: dates, bodies, impulse tiers (Conventional → Fission → Fusion → FORBIDDEN SHOT), outcomes, cascade report, quest stages |
| `core.json` | The 159-mile core: 5 exotic zones, buried-charge depths (2/7/17/25 mi), ice-as-fuel 4 jobs, burn table, Herschel Slip chain, redacted alternatives |
| `characters.json` | Ren / Qiao / Voss / Dotty (+ ARGUS): objectives, key lines, POV visual grammars |
| `scenes.json` | 11 scenes with layers, POVs, beats, choices, sim wiring |
| `declassification.json` | LEVEL 0 (HELIUM-3) → LEVEL 4 (CORE) → FINAL CANON [PARTIALLY UNREADABLE], plus the 5-reveal motive flip |
| `stills.json` | 11 planned exhibit stills (EXHIBIT 1A … EXHIBIT 51), palette, render notes |
| `moons.json` | Saturn's 293: 24 regular moons with real data; irregulars grouped by family (unknowns explicit) |

## Specs (`docs/`)

- `story-bible-v3.md` — full story bible: logline, locked canon, 11 scenes, 8 contradictions, 4 endings, tone guide, UI notes
- `sim-spec.md` — the 5 three.js simulation features (S1 timeline, S2 flyby sandbox, S3 Δv meter, S4 probability cloud, S5 shepherd mini-game)
- `billiards-spec.md` — the Saturn Billiards: 12-link chain, shot planner, cascade reports, quest structure
- `core-spec.md` — the Core Truth: converged canon, buried charges, ice-as-fuel, build checklist
- `drama-spec.md` — the drama layer: canon inventory, locked lines, placement map, exhibits/sims, ordered build checklist
- `system-spec.md` — the 540-line converged system spec: one shared `STEAL` state, 24 screens, 7 sim systems

## Canon visuals (`assets/`)

The six canonical visual assets (see `STORY-STATUS.md`):

- `mimas-state-pristine.webp`, `mimas-state-peeling.webp`, `mimas-state-arrival.webp`, `mimas-state-tail.webp` — the four Mimas transformation states
- `mimas-surface-gaze.webp` — wraps the full 360° moon sphere
- `mimas-tail-cinematic-flipped.webp` — debris tail streaming AWAY from Earth

## Implementation records (`docs/history/`)

- `masters/` — the five masters agents' proposals across three propose → critique → revise rounds
- `sessions/` — idea lineage: original story report, tone guide, structure v3, presentation v3, swarm round briefs and results

## Open-source stack

Everything is client-side and free — no paid services, no backend:

- **three.js** (WebGL2) for trajectories, probability clouds, cutaways, the 293-body atlas
- **Vanilla JS + DOM/CSS** for all archival UI (the paperwork owns the DOM; WebGL owns the orbits)
- **Static hosting only** — all state in client-side JS; `localStorage` for "re-open the archive" continuity
- **Deterministic seeded PRNG** drives every sim (same seed = same history — the archive demands it)
- Fallbacks: static/SVG stills, reduced-motion support, mobile tiers

## Contributing

Found a contradiction in the archive? That's the point — file it. Dotty will
write it down. (*"Ooh, spicy."*)

## License

Story, data, and specs: CC-BY 4.0. Real moon data: NASA / IAU Minor Planet
Center. The heist itself: fictional, and the committee would like to stress the
word "fictional."
