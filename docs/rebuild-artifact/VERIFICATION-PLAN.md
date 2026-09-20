# VERIFICATION-PLAN.md — Artifact Rebuild QA Gate

The pass/fail gate the parent runs after the artifact rebuild, on **desktop
1440×900** and **mobile 390×844**. The artifact is fully static: it makes **zero**
runtime network requests. Every check below is independent; a single FAIL blocks
the gate.

**Tooling:** headless Chromium (desktop + mobile emulation), console-error
capture, screenshot capture. Keep concurrent Chromium instances to **2–3 max**
(environment memory limit).

---

## 1. Screen reachability (30 checks)

Navigate to every screen via its normal entry point (no deep-link shortcuts).
Each screen must render with no errors and respond to its primary interaction.

**Story spine (11):**
- [ ] V-01 — S-1 THE FILE renders; BREAK THE SEAL gate works
- [ ] V-02 — S-2 THE MOON renders; Saturn-approach scrubber moves; PIN DROP works
- [ ] V-03 — S-3 THE MACHINE renders; Δv ledger + worksheet refuse to balance
- [ ] V-04 — S-4 THE FIRST LIE renders; CHECKSUM VERIFY works
- [ ] V-05 — S-5 THE CASCADE renders; COMMIT BURN path reachable
- [ ] V-06 — S-6 THREE TRILLION DOORS renders; billiards wizard entry works
- [ ] V-07 — S-7 THE SHEPHERDS renders; trust vote works
- [ ] V-08 — S-8 THE SLIP renders; drill commits register
- [ ] V-09 — S-8F THE RECKONING reachable as fail state of S-8 (not a 25th screen)
- [ ] V-10 — S-9 EARTH, SOMEHOW renders; ledger sign-off reachable
- [ ] V-11 — S-10 THE HEARING renders; TESTIFY per-exhibit DEFEND/CONDEMN works
- [ ] V-12 — S-11 DECLASSIFIED renders; TAKE IT / LEAVE IT / LISTEN works

**Billiards (5):**
- [ ] V-13 — B-1 shot planner: 293→24 target filter selects a target
- [ ] V-14 — B-2 impulse tier selectable (FORBIDDEN locked behind L3 + trust ≥ 60)
- [ ] V-15 — B-3 depth + timing dials set and reflect in confidence readout
- [ ] V-16 — B-4 SIMULATE runs; INTENDED/PREDICTED/OBSERVED paths display
- [ ] V-17 — B-5 cascade report shows 12-link chain; ACCEPT SHOT grants L3

**Core (2):**
- [ ] V-18 — C-1 burn-table drills run; exposure accrues
- [ ] V-19 — C-2 final choice console; LISTEN gated on L4 prereqs

**Archive (6):**
- [ ] V-20 — A-0 archive hub renders; clearance-gated sim cards
- [ ] V-21 — A-1 atlas / 293-moon explorer renders and is interactive
- [ ] V-22 — A-2 RUN archive; run cards + one-second scrubber vary outcome
- [ ] V-23 — A-3 codex; locked entries show redaction bars
- [ ] V-24 — A-4 stills gallery renders
- [ ] V-25 — A-5 settings; reduced-motion + tier controls apply

**Wow features (5):**
- [ ] V-26 — The Slingshot Ledger: scrubber 1997→2004 replays; flyby cards fire
- [ ] V-27 — The Missing Day: two clocks drift; ring-seismology readout works
- [ ] V-28 — Harbor Lights: Titan haze-off toggle swaps IR base map; seas clickable
- [ ] V-29 — Plume Clock: Enceladus orbit scrub changes plume brightness at apocentre
- [ ] V-30 — Thread the Gap: probe drag reads τ/radius; thread mode completable

---

## 2. Zero errors / zero failed requests (3 checks)

- [ ] V-31 — Desktop: zero real console errors across the full screen pass
  (ignore Chromium-internal warnings only when they carry no stack pointing at
  artifact code; record any warning that mentions an artifact file).
- [ ] V-32 — Mobile 390×844: zero page errors during the same pass.
- [ ] V-33 — **Zero failed requests** — and zero successful ones: capture the
  network log and assert the artifact issues **no HTTP(S) requests at all**
  after initial page load (fonts, telemetry, CDN scripts all banned). Any fetch
  is a FAIL precisely because the page is fully static.

---

## 3. Mobile layout + DPR (3 checks)

- [ ] V-34 — Zero horizontal overflow at 390×844 on every screen in §1
  (`document.documentElement.scrollWidth <= 390`); no clipped interactive controls.
- [ ] V-35 — Renderer pixel ratio ≤ 1.5 on desktop and mobile
  (read `renderer.getPixelRatio()` at runtime; assert ≤ 1.5).
- [ ] V-36 — Reduced-motion honored: with `prefers-reduced-motion`, time-warp is
  disabled and ghost animation freezes to static cloud texture.

---

## 4. Determinism (3 checks)

- [ ] V-37 — Same seed + same date = same moon positions: run
  `saturnEngine.stateAtJD(jd)` twice (same seed) for a fixed JD and assert
  **bitwise-identical** outputs.
- [ ] V-38 — Same one-second-perturbed seed input yields a *different but
  reproducible* state: seed+1 run twice gives identical results to each other,
  different from V-37.
- [ ] V-39 — Grep gate on the final artifact source: **zero occurrences of
  `Math.random`** in simulation/render paths. `grep -rn "Math.random"
  <artifact-src>` must return nothing. (mulberry32 seeded PRNG is the only
  allowed RNG.)

---

## 5. Bounds enforcement + out-of-scope exclusion (2 checks)

- [ ] V-40 — Attempt to push camera/target beyond Phoebe's orbit (~12.9M km):
  `isOutOfBounds()` rejects it; nothing renders, simulates, or queries beyond
  the bound.
- [ ] V-41 — Grep gate on the final artifact source (case-insensitive):
  **zero matches** for `neptune|uranus|triton|titania|oberon`. (Removal audit
  `docs/removal-audit.md`: 5 in-scene references deleted; story-context Jupiter
  mentions are allowed, Uranus/Neptune are not.) Any match = FAIL.

---

## 6. Imagery (5 checks)

- [ ] V-42 — Every baked texture loads with no error on both viewports; the
  Mimas hero sphere shows the real global map (PIA17214) / canon
  `mimas-surface-gaze.webp` per the builder's wiring.
- [ ] V-43 — Photo-compare split-view works on a body with a verified photo
  (e.g. Mimas): LEFT labeled `VERIFIED PHOTOGRAPH — <mission>, <date>`, RIGHT
  labeled `RECONSTRUCTION — NOT A PHOTO`, slider operates.
- [ ] V-44 — A catalog moon with no verified photo shows
  `NO VERIFIED PHOTO — reconstruction only` in the LEFT pane and the compare
  control disables itself.
- [ ] V-45 — Saturn mosaic (PIA17172) background plate renders on the system view.
- [ ] V-46 — Canon textures intact: `mimas-surface-gaze.webp` wraps the full
  sphere; `mimas-tail-cinematic-flipped.webp` debris tail streams **AWAY from
  Earth** in both debris and world-response views (visual check on screenshots).

---

## 7. Chronology (5 checks)

Per `docs/chronology-resolution.md` (resolved 2026-09-20):
- [ ] V-47 — Trajectory slider at T−117 → T+0 lands on **20 Nov 2032** (capture,
  program day 4,200).
- [ ] V-48 — Chain screens show the re-dated 2029–2032 links:
  LINK 00 = 30 Sep 2029, LINK 10 = 13 Feb 2032, LINK 11 = 26 Jul 2032.
- [ ] V-49 — Pinned events at their dates: Jupiter flyby ~10 Sep 2032,
  Lucky-77 demo 18 Apr 2031, braking burn 13 Nov 2032, HEARING 2034.
- [ ] V-50 — No occurrence of the old 2049–2052 chain dates anywhere in artifact
  text: grep artifact for `2049-0?6|2049-0?7|2049-0?8|2049-10|2050-|2051-|2052-`
  must return zero hits (2049/2051 survive only as declassification/documentary
  years in copy).
- [ ] V-51 — Inward-fall copy reads "four months", not "14 months"
  (`scenes.json` Scene 6 / bible §4 beat).

---

## 8. Required screenshots (4 checks)

Capture all four on desktop **1440×900** and mobile **390×844** (8 files total);
attach to the gate report:
- [ ] V-52 — System view (293-moon swarm visible)
- [ ] V-53 — Mimas hero (full-sphere view)
- [ ] V-54 — One wow screen (verifier's choice; record which)
- [ ] V-55 — Moon explorer (A-1 atlas)

---

## 9. Pass/fail table template

The verifier copies this table into the gate report and fills every row.
**PASS requires all 55 checks green.** One FAIL = gate blocked; record the
check ID, the observed behavior, and the suspected source.

| ID | Check | Desktop | Mobile | Notes / evidence |
|---|---|---|---|---|
| V-01 | S-1 THE FILE | | | |
| V-02 | S-2 THE MOON | | | |
| V-03 | S-3 THE MACHINE | | | |
| V-04 | S-4 THE FIRST LIE | | | |
| V-05 | S-5 THE CASCADE | | | |
| V-06 | S-6 THREE TRILLION DOORS | | | |
| V-07 | S-7 THE SHEPHERDS | | | |
| V-08 | S-8 THE SLIP | | | |
| V-09 | S-8F THE RECKONING | | | |
| V-10 | S-9 EARTH, SOMEHOW | | | |
| V-11 | S-10 THE HEARING | | | |
| V-12 | S-11 DECLASSIFIED | | | |
| V-13 | B-1 shot planner | | | |
| V-14 | B-2 impulse tier | | | |
| V-15 | B-3 depth + timing dials | | | |
| V-16 | B-4 SIMULATE | | | |
| V-17 | B-5 cascade report | | | |
| V-18 | C-1 burn drills | | | |
| V-19 | C-2 final choice | | | |
| V-20 | A-0 archive hub | | | |
| V-21 | A-1 293-moon explorer | | | |
| V-22 | A-2 RUN archive | | | |
| V-23 | A-3 codex | | | |
| V-24 | A-4 stills | | | |
| V-25 | A-5 settings | | | |
| V-26 | Wow: Slingshot Ledger | | | |
| V-27 | Wow: Missing Day | | | |
| V-28 | Wow: Harbor Lights | | | |
| V-29 | Wow: Plume Clock | | | |
| V-30 | Wow: Thread the Gap | | | |
| V-31 | Desktop zero console errors | | | |
| V-32 | Mobile zero page errors | | | |
| V-33 | Zero network requests | | | |
| V-34 | Zero mobile overflow 390×844 | | | |
| V-35 | DPR ≤ 1.5 | | | |
| V-36 | Reduced-motion honored | | | |
| V-37 | Determinism: same seed+date | | | |
| V-38 | Determinism: seed+1 reproducible | | | |
| V-39 | No Math.random (grep gate) | | | |
| V-40 | isOutOfBounds rejection | | | |
| V-41 | No Neptune/Uranus (grep gate) | | | |
| V-42 | All baked textures load | | | |
| V-43 | Photo-compare works | | | |
| V-44 | NO VERIFIED PHOTO fallback | | | |
| V-45 | Saturn mosaic background | | | |
| V-46 | Canon textures intact / tail away from Earth | | | |
| V-47 | Slider T+0 = 20 Nov 2032 | | | |
| V-48 | Chain links re-dated 2029–2032 | | | |
| V-49 | Pinned events at dates | | | |
| V-50 | No old 2049–2052 dates | | | |
| V-51 | "four months" not "14 months" | | | |
| V-52 | Screenshot: system view | | | |
| V-53 | Screenshot: Mimas hero | | | |
| V-54 | Screenshot: one wow screen | | | |
| V-55 | Screenshot: moon explorer | | | |

**Verdict:** PASS / FAIL — verifier name, date, artifact build hash:
