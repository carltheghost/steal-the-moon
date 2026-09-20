# Rebuild Index

Index of the 2026-09-20 rebuild deliverables (data + docs), what each is, and which
canon open item it closes.

- `data/moons-293.json` — the full 293-moon catalog assembled from real JPL/NASA data
  (293 records, each with name, provisional designation, IAU number, discovery year /
  discoverer, semi-major axis, orbital period, radius, orbital group, source note).
  **Closes:** the "full 293-moon catalog still needing assembly with real JPL data"
  canon-blocking open item.
- `data/major-moons-elements.json` — J2000 orbital elements for the 9 major moons used
  by the simulation (Enceladus, Iapetus, Mimas, Titan, etc.).
- `data/nasa-imagery.json` — manifest of 10 verified NASA/JPL imagery URLs
  (http200_checked, with PIA IDs and credits) for use as art references; the file also
  records excluded variants and the verification method.
- `docs/simulation-design.md` — the engineering design for the deterministic
  Saturn-system simulation (shared state model, seed/derive rules, two-ledger Δv,
  billiards trajectory, reduced-motion rules).
- `docs/chronology-resolution.md` — editorial ruling on the canon-blocking chronology
  conflict: 2051 framing (documentary assembly date) vs the 2049–2052 chain vs the
  4,200-day mission. **Closes:** the chronology-conflict open item — the heist
  climax is locked to 2032 ("Declassified 2049. Assembled 2051." is the documentary
  wrapper, nineteen years later). The ruling keeps `canon.json`'s
  `duration_days: 4200` / `duration_years: 11.5` numeric locks unchanged.
- `docs/wow-features.md` — the cinematic "wow" feature list feeding the engine spec
  (Kage-style acceptance criteria, ember/debris tail, Mimas gaze surfacing).
- `docs/removal-audit.md` — audit of all Neptune/Uranus/out-of-bounds references across
  specs, data, and docs (34 hits): 5 confirmed in-scene deletions (Saturn-system-only
  scene), 29 story-context mentions intentionally kept (Jupiter canon content,
  "solar system" flavor). **Closes:** the Neptune/Uranus removal order.
