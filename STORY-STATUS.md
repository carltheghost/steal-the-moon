# STORY-STATUS.md — where Steal the Moon stands (2026-09-19)

This file is the project's current position in one place: what the story is,
what's built, what's canon, and what's deliberately left open. It is updated
when canon changes. Nothing in the open-items section is resolved silently.

## The story in one paragraph

*Steal the Moon* is an interactive "declassified history" of the greatest theft
in history: towing Saturn's moon Mimas — all 246 miles of it — to Earth orbit
with a fusion torch drive, and what was really inside it. **Real Saturn.
Fictional crime.** All characters are fictional; no real persons are depicted.
The framing device: the archive was declassified in 2049 and assembled in 2051.
The motive flips in five reveals — helium-3 → bad math → checksum mismatch →
the ice was fuel → the core. The core is a 159-mile heterogeneous body of
exotic minerals: californium and other transuranics sitting *naturally* in the
rock, billion-year pressure exotics, superheavies past 118, residual heat.
The truth is POWER, not price: "Whoever holds the core holds the next century."

## The build

The complete interactive browser artifact is now committed in `web/index.html` and is the deploy target for the site. It is a self-contained static export with the renderer, UI, canonical story content, baked imagery, and local persistence.

- **24 screens across 7 sim systems**: 11 story scenes, 5 Saturn Billiards screens, 2 Core lab screens, 6 Archive screens.
- **7 simulations**: timeline, flyby sandbox, Δv ledger, Monte Carlo cloud, shepherd game, Saturn Billiards, Core.
- **One shared `STEAL` state object**; a single `recompute(STEAL)` derives seed, scene, declassification, trust, trajectory, dual-pool Δv ledger, billiards, core.
- **Stack**: pinned `three@0.186.0`, vanilla ES modules, deterministic handwritten math. Zero frameworks, zero paid services.
- **Static artifact**: one HTML file with embedded JavaScript and data URIs for the vendored renderer and baked media; no runtime backend and no runtime CDN dependency.
- **Launch automation**: `.github/workflows/deploy-pages.yml` runs JSON validation, repository smoke checks, browser-artifact checks, then publishes `web/` through GitHub Pages.
- **Verification script**: `scripts/check_web.py` enforces artifact presence, size bounds, required boot markers, and the zero-runtime-network contract.
- **Pages status**: the GitHub repository currently reports `has_pages: false`. The deployment workflow is ready, but the repository-level Pages setting must be enabled once in GitHub Settings before the first Pages deployment can execute.

- **24 screens across 7 sim systems**: 11 story scenes, 5 Saturn Billiards
  screens, 2 Core lab screens, 6 Archive screens.
- **7 simulations**: timeline, flyby sandbox, Δv ledger, Monte Carlo cloud,
  shepherd game, Saturn Billiards, Core.
- **One shared `STEAL` state object**; a single `recompute(STEAL)` derives seed,
  scene, declassification, trust, trajectory, dual-pool Δv ledger, billiards, core.
- **Stack**: pinned `three@0.186.0`, vanilla ES modules, deterministic
  handwritten math. Zero frameworks, zero paid services.
- **Verification**: zero real console errors on desktop, zero horizontal
  overflow / unreachable controls at 390px mobile.
- **Visual canon**: the full 360° moon wraps `mimas-surface-gaze.webp` around the
  entire sphere (sun-driven phases; drag on desktop, display-only canvas on
  mobile). The debris-tail cinematic uses `mimas-tail-cinematic-flipped.webp`
  with the tail streaming AWAY from Earth, shown in both debris/world-response
  views.

The five-agent "masters" swarm converged on the 540-line system spec in
`docs/system-spec.md` via three rounds of propose → critique → revise. The
cute-titles rename was killed (it would have forked the ledgers and broken
exhibit references).

## Canon snapshot

- **Departure**: 246-mile moon, 159-mile core, ~43-mile ice shell, buried
  charges at 2/7/17/25 miles under the ice.
- **Voyage**: ice stripped and burned as fusion fuel; the moon loses diameter
  AND mass. Duration: ~4,200 days.
- **Arrival**: ~199 miles — a metal core wearing a ~20-mile-deep global ocean,
  exposed core-mountains breaching the waterline. *(PROVISIONAL — see open items.)*
- **The core**: ancient and wrong in four ways; the Two Pressures (neutron
  capture cascades + decay paths) forge new stable exotic minerals; the Cascade
  is a breeder loop (more fuel bred than burned — they hauled a BREEDER, not
  cargo); cascade algorithms are free/open, seeded, deterministic.
- **The seed**: the crew seeds robots deep under the ice; no fuel brought or
  needed; the 2051 archive holds robot telemetry.
- **The debate**: two axes threaded through beginning, middle, memory, and late
  game — AXIS 1 THE CHOICE (convenience target, or did they know what the core
  held? Dotty never confirms), AXIS 2 THE PARENT (what type of planet, how old,
  what it contained — nobody wins).
- **Millennium questions**: Dotty frames the core's mysteries as prize problems —
  the unsolved interior-flow problem, "Map the transmutation network"
  ([UNOBSERVED]), and the moral one: "Was there life — or anything — that they
  destroyed?" (UNANSWERED — Ren's question).
- **The chain**: 12-link Saturn Billiards nuclear chain, 2049–2052; impulse tiers
  Conventional → Fission → Fusion → FORBIDDEN SHOT (authorized uses remaining:
  see `data/chain.json`); Sims keep nuclear events as abstract levers — no
  weapon-design mechanics, no yields. The story is about who holds the aim.
- **Saturn's moons**: 293 confirmed (August 2026): 24 regular, ~269 irregular
  (Norse retrograde; Gallic and Inuit prograde). *Catalog incomplete — see open
  items.*

## OPEN ITEMS — deliberately unresolved (Phase 0)

These block nothing in the build, but nothing in the story is finalized on
their behalf. They are recorded here so they are never silently resolved.

1. **Chronology conflict.** Three datings coexist in canon and have NOT been
   reconciled:
   - 2051 documentary framing (the archive's assembly),
   - the 2049–2052 billiards chain,
   - the ~4,200-day / 11.5-year mission vs. the later 4–5-year active arc.
   Qiao says "twelve years." A decision has not been made. (`canon.json` carries
   all claims with `chronology_status: UNRESOLVED`.)

2. **293-moon JPL catalog.** The full catalog has NOT been assembled with real
   JPL data. `data/moons.json` carries the 24 regular moons and marks the
   irregulars as unknown-by-family; `catalog_status: INCOMPLETE`.

3. **Core diameter.** Offered at 72 / 159 / other; recorded as 159 miles in
   `canon.json` but **awaiting the user's final decision**.

4. **Arrival diameter.** ~199 miles is a derived value, **not explicitly
   accepted** — marked `PROVISIONAL` in `canon.json`, awaiting the user's
   decision.

## Where the conversation lives

- Idea lineage: `docs/history/sessions/` (original story report, tone guide,
  structure v3, presentation v3, swarm round briefs and results).
- Implementation records: `docs/history/masters/` (the five masters' proposals
  across three converge rounds).
- The day's working notes (2026-09-19) exist in the builder's session memory
  under `memory/2026-09-19.md`; the raw chat transcript lives with the user in
  their chat history and is not exported here.

## License

Story, data, and specs: CC-BY 4.0. Real moon data: NASA / IAU Minor Planet
Center. The heist itself: fictional, and the committee would like to stress the
word "fictional."
