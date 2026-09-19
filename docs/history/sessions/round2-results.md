# STEAL THE MOON — Round 2 results & coordinator fiat list

Date: 2026-09-19. All five masters filed Round 2 ballots (critiques + revised proposals + C1–C10 votes).

Full ballot texts:
- M1 (orbital/geophysics): in coordinator context (no file saved this round)
- M2 (three.js): `~/workspace/steal-the-moon/` (Round 2 report filed)
- M3 (interaction/game): `~/workspace/steal-the-moon/master3-round2.md`
- M4 (storytelling): in coordinator context (no file saved this round)
- M5 (visual): `~/workspace/steal-the-moon/` (Round 2 report filed)

Round 1 references: `~/workspace/research_notes/steal-the-moon/round1-brief.md`,
`~/workspace/steal-the-moon/master2-threejs-visualization.md`,
`~/workspace/steal-the-moon/master3-interaction-game-design.md`,
`~/workspace/steal-the-moon/master5-visual-design.md`.

## 1. C1–C10 vote table (Round 2)

| # | Item | M1 | M2 | M3 | M4 | M5 | Result |
|---|------|----|----|----|----|----|--------|
| C1 | STEAL shared state | Accept (+schema deltas) | Accept | Accept | Accept (+narrative fields) | Accept | **ACCEPT** — merged schema (see §3) |
| C2 | three.js 0.186.0 | Accept (0.170→0.186) | Accept | Accept | Accept | Accept | **ACCEPT unanimous** |
| C3 | TRUST 0–100, start 50 | Accept (float) | Accept | Accept (×10 deltas) | Accept (×10 rescale named) | Accept | **ACCEPT unanimous** |
| C4 | TIME = 120d contingency | Accept as `{spentDays, marginDays:120, missionCapDays:4200}` | Accept | Accept (`contingencyLeft` + `missionDay`) | Accept (`timeMargin`) | Accept | **ACCEPT** — merged fields (see §3) |
| C5 | Canon S1–S5 definitions fixed | Accept | Accept | Accept | Accept (full B4 realignment) | Accept | **ACCEPT unanimous** |
| C6 | 11 scenes | Accept (S-8F = Sc.8 fail) | Accept | Accept (S-8F = Sc.8 internal) | **Reject as specified** — demote S-3 to drawer/hub; S-8F = Sc.9 fail branch; "Scene N" numbering mandate | Accept | **ACCEPT count; mapping by fiat** (F1, F5) |
| C7 | localStorage persistence | Accept (`stm.steal.v2` / `stm.runs.v1` / `stm.clearance.v1`) | Accept | Accept (`stealthemoon.v1`) | Accept (`steal-moon/v1`) | Accept | **ACCEPT** — keys by fiat (F3) |
| C8 | Mobile canvas display-only, DOM inputs | Accept (OrbitControls desktop-only amendment) | Accept | Accept | Accept | Accept | **ACCEPT unanimous** |
| C9 | Pre-rendered PNG stills primary | Accept (+`resetSim`, `stillStateHash`) | Accept | Accept | Accept (+`canonHash` in sidecar) | Accept | **ACCEPT unanimous** |
| C10 | 41×41 runtime LUT + footnote | Accept (LUT seed `0xC0FFEE`; HUD uses exact formula) | Accept | Accept | Accept (footnote = story beat) | Accept | **ACCEPT unanimous** |

## 2. Settled by Round 2 (no fiat needed)

- **Seed:** valid uint32 required (all five agree the `0x5TEA1` joke is a shipping hazard). Value by fiat: **F7**.
- **S5 bodies:** 5–7 per canon; N=6 from chain.json (M1, M3, M4, M5 agree; M2 must stop hardcoding 3). Nudgeable split + win condition by fiat: **F8**.
- **Billiards outcome API:** `billiardsSimulate(plan, runSeed)` returns `{outcomeClass, intendedPath[], predictedPath[], observedPath[], ...}` (M1 new); M5 renders the INTENDED/PREDICTED/OBSERVED triple layer; M3's B-4 copy names all three.
- **Δv dual ledger:** `dv = {reserve:35.0, spent, reported:14.2, ghostReserve:9.8, reconciled:false, ghostSpent:0.0, ledger[], ...}` (M1). Meter reads the lie until RECONCILE (M3, M5). Main burns draw `reported`; B-3 torch-correction draws `ghostReserve` post-reconcile.
- **Buried-charge depth model:** split into fracture `p_f(d)=1−exp(−d/ρ)` (rises with depth → C-1 risk) and slip coupling `σ_slip(d)=σ₀·exp(−d/σ_d)` (falls with depth → less SLIP). M3's B-3 tradeoff: deeper = less SLIP + more TIME + more FRACTURE. M3 must fix card copy ("deep = safe" dies).
- **S2 LUT:** 41×41 runtime from closed-form seeded formula (LUT seed canon-fixed); bilinear → `s2PathFor()` for strip geometry; HUD scalars always from the exact formula (zero interp error). Diegetic footnote "declassified targeting approximation."
- **S4 ghosts:** M2/M5 STATIC tiers must call M1's `s4Ghosts()` / `s2PathFor()` / `s5StateAt()` — no hand-drawn approximations, no private dispersion math.
- **Scene-callable sim API** (M1): `s1PathAt, s2Outcome, s2PathFor, s3Band, s4Ghosts, s4Compare, s5Step, s5StateAt, billiardsSimulate, coreBurn, reconcileLedger, resetSim, stillStateHash, displayTransform` — pure functions; M4's worksheet/checksum/hidden-burn/hearing are scene interactions calling these, never renames, never duplicate ledgers.
- **TRUST economy:** 0–100 float, start 50.0. All M3 deltas ×10. Gates: FORBIDDEN SHOT requires L3 + trust ≥ 60 + `forbiddenUsesLeft = 1`; L4 requires trust ≥ 40. TRUST 0 = soft fail (Dotty hints stop, verdict caps at SEALED).
- **TIME:** spendable contingency; TIME ≤ 0 → WINDOW CLOSED run fail. S2 valid-band shrink uses elapsed *mission* time, never the margin — two clocks, never conflated.
- **Declass costs:** −5 TRUST per level granted (M4's "TRUST drains as redaction lifts" — adopted).
- **Skipped sims:** render `NO DATA — SUBJECT DECLINED.` (standardized phrasing); absence is evidence, verdict consequence applied live.
- **Commit during GPU context loss:** M2 exposes `contextHealthy`; M3 disables all commit buttons while false ("TAPESTRY PAUSED — RESTORING").
- **Scene 7:** hosts S5 (canon); trust vote is the scene interaction around the S5 commit; Qiao's log = sim-free rail journal beside it.
- **Scene 11:** Core finale + "S4 returns altered — THE ARCHIVE HAS BEEN MODIFIED" framing (one S4 instance only).
- **Voss:** 9 unsigned inserts, Scenes 1/2/3/4/5/6/8/9/11 (never 7 or 10 — the absence in the hearing is the tell); `.insert-voss` component never renders inside `.pov-voss`.
- **Every-data-file-consumed audit (M1):** canon.json ✓ · chain.json ✓ (+S5) · core.json ✓ · characters.json → M4 annotations ✓ · scenes.json → gating ✓ · declassification.json → STEAL.declass gates ✓ · stills.json → M2/M5 ✓ · moons.json → M2 atlas + M1 billiards η₀ ✓. All eight consumed.

## 3. Merged STEAL schema deltas (C1/C4)

```js
STEAL = {
  schema: 2, seed: 0x5EA17,            // F7 — valid uint32, M1 owns
  lutSeed: 0xC0FFEE,                  // canon-fixed, same every run
  scene: 1, declass: 0,               // declass 0–4 + FINAL
  time: { spentDays: 0.0, marginDays: 120.0, missionCapDays: 4200, missionDay: 0 },
  // derived: timeLeft = marginDays - spentDays  (aliases: contingencyLeft, timeMargin)
  trust: 50.0,                        // 0–100 float
  trajectory: { tau, aimDx, aimDy, captureWindowDays: 30, ... },
  dv: { reserve: 35.0, spent: 0.0, reported: 14.2, ghostReserve: 9.8,
        reconciled: false, ghostSpent: 0.0, ledger: [],
        projectedEarthReserve, earthCaptureBurn: 2.5, earthPerigeeKm: 500,
        shepherdDiscount: 0.0 },
  sims: { s1: {...}, s2: {committed: {aim_km, capture_err_pct, verdict}, ...},
          s3: {reconciled, ghost_spent, ledger[], worksheet: {rows, balanced}},
          s4: {displayCounter: "3,847,221,004,913,882", ...},
          s5: {impulseUsed: 0, corrections: 0, ...} },
  billiards: { plan, shots: [], cascade, ... },
  core: { diameterMi: 246.0, massKg, burn, exposure, slip, ... },
  config: { shepherdN: 6, ... },
  reveal: { sealBroken, worksheetFailed, checksumVerified, hiddenBurnFound, artifactAdmitted },
  hearing: { testimony: [], verdict: null },   // VINDICATED | SEALED | CONDEMNED
  voss: { insertsPlanted: 9, insertsSeen: 0 },
  traces: { renFound: 0 },                    // 3 Ren sabotage traces
  dotty: { fragmentsFound: 0 },
  flags: { reducedMotion, mobileTier },
}
```

## 4. Coordinator fiat list (Round 3 ratification targets)

**F1 — Fail branch.** S-8F THE RECKONING = **Scene 8's** fail branch (M1 + M3 explicit votes; M2/M5 accepted C6). Scene 9's arrival-check fail is a *scene-level setback* (−10d contingency, rewind to Scene 9 checkpoint), not a numbered branch. "Scene N" always means canon numbering in all docs/code (adopts M4's shipping-hazard fix).

**F2 — Verdict.** Classes: **VINDICATED / SEALED / CONDEMNED** (M3's names + new-run+ table; M3 owned open question (a)). Scene 10 commit = per-exhibit DEFEND/CONDEMN + optional free text + **ARTIFACT ADMIT/SUPPRESS** (M4's mechanic folded in). VINDICATED: majority DEFEND, books reconciled (or lie never taken), TRUST ≥ 40 → FINAL CANON eligible; new-run+: +10 TRUST, keep reconciled ledger + codex. SEALED: mixed record, TRUST < 40, or >2 sims skipped → FINAL CANON locked; new-run+: keep codex. CONDEMNED: majority CONDEMN or unreconciled books exhibited → FINAL CANON locked; next run: ghost reserve locked, TRUST starts 40, Dotty redactions worsen one cosmetic tier.

**F3 — Storage keys.** `stm.steal.v2` (STEAL snapshot, schema v2) · `stm.runs.v1` (RUN archive, decisions+seed only) · `stm.clearance.v1` (per-player clearance, survives runs). Version-checked on load; mismatch → fresh run + Dotty "archive format corrected" note. Quota: try/catch, drop oldest non-current runs first, always keep current run + clearance + codex; failing that, session-only + "ARCHIVE NOT SAVING" badge.

**F4 — L4 + Core placement.** L4 COMPLICATED granted at **reaching Scene 11 with TRUST ≥ 40** (M3's grant); reveals EXPOSURE meter (accrued blind through C-1), LISTEN prerequisites, top-secret codex. **C-1 burn-table drills at Scene 8** (M4's "THEY AREN'T DRILLING. THEY'RE PEELING"); **C-2 TAKE IT / LEAVE IT / LISTEN at Scene 11** (M3 + core-spec checklist); "IGNITE FINAL BURN" executes the choice. Rationale: the meter reveal must precede the final choice; M4 keeps drills-at-8 and burn-at-11; M3 keeps the choice at 11.

**F5 — S-3 demoted.** No numbered "sim selector" spine screen (M4's canon point stands). Scene 3 THE MACHINE = S3 ledger + helium-3 worksheet + Gary records (moved from M3's S-5 function) + burn-budget allocation scene interaction. The five-sim card hub lives in the **Archive drawer (A-0)**, reachable from anywhere. Spine stays 11 screens.

**F6 — Billiards at Scene 6.** B-1→B-5 wizard + S4 comparisons co-host Scene 6 (M3 + M4 agree); ACCEPT SHOT grants L3. M1's Scenes-4–5-era proposal rejected: it rested on M3's stale Round 1 chapter mapping, and "THREE TRILLION DOORS. PICK ONE." is the exact thematic home for the shot commit.

**F7 — Seed.** `0x5EA17` (M1 owns determinism). LUT seed `0xC0FFEE` canon-fixed.

**F8 — S5.** 6 bodies from chain.json via `STEAL.config.shepherdN`; **3 nudgeable shepherd moons** (drag arrows or −/+ steppers; tap arrows / STEP MODE in mobile SVG tier), 3 corridor context. **Win = 3 corrections + corridor held 10 s + impulse < 100** (canon). M1's "all 6 hold resonance bands" restatement rejected — canon's win condition stands. 100-unit impulse budget meter in the rail.

**F9 — Time fields.** As in §3. `timeLeft = marginDays − spentDays` is the single derived value; `contingencyLeft` (M3) and `timeMargin` (M4) are aliases, not separate fields. M1 adds the §3 narrative fields (`reveal{}`, `hearing{}`, `voss{}`, `s4.displayCounter`, `traces{}`, `dotty{}`) to the schema in build.

**F10 — Sim API contract.** M1's §2 pure-function list (§2 "Settled") is the anti-rename contract. M2/M5 tiers and M4 scene interactions call these; nobody reimplements math. M2's aim sprite writes `STEAL.trajectory.aimDx/aimDy` and reads back via `recompute(STEAL)` — no private copies.

**F11 — Declass earning table (merged).** All action-gated, never time-gated; −5 TRUST per grant; clearance is the player's (persists across runs in the same browser).

| Level | Name | Granted by | Reveals |
|---|---|---|---|
| L0 | PUBLIC | start | S1, S2 rehearsals, S3, Conventional tier, public codex |
| L1 | UNSEALED | break the S1 seal, Scene 1 commit | S4 cloud, Fission tier, Gary records, Atlas chain viewer |
| L2 | LEAKED | resolve both S1 RECORD CONFLICTs + S2 rehearsal commit (Sc.4) | S5, **S3 RECONCILE** (ghost 9.8), Fusion tier, charge-depth selector |
| L3 | CORRECTED | ACCEPT a billiards shot (Sc.6) | FORBIDDEN SHOT (1 use + trust ≥ 60), S-10 exhibit preview, secret codex |
| L4 | COMPLICATED | reach Scene 11 with TRUST ≥ 40 | EXPOSURE meter revealed (accrued blind), LISTEN prerequisites, top-secret codex |
| FINAL | CANON | CAPTURED win + VINDICATED verdict at L4 + S11 burn | full canon browser, gold "true" trajectory in S2, new-run+ |

Sim unlock: L0: S1–S3 (S2 rehearsals only; real COMMIT gated to Scene 5 spine) · L1: +S4 · L2: +S5. Sims are rehearsal tools, stay replayable from the Archive; "all five complete" is not a spine gate. M4's L1 alternative ("complete any 2 sims") rejected — the seal ritual is the L1 gate, keep it clean.

**F12 — Unrehearsed COMMIT surcharge.** A real COMMIT with zero rehearsals costs +10d `spentDays` (adopts M3's open question; tutorializes rehearsal).

**F13 — LineStyle truth grammar.** One shared module; **M5 owns the tokens**, M2 consumes in shaders/WebGL, DOM/SVG consumes in CSS. Solid = observed · dashed = predicted · dotted = hypothetical · double = disputed. Billiards forensic view adds the INTENDED (dotted-slate) third layer from M1's `intendedPath[]`. Never color-only; `.committed-ring` adopted as an annotation state (not a 5th line style).

**F14 — Plate furniture ownership.** **M5 owns the DOM `plate-frame` component**; M2 feeds canvas bitmaps; M4 feeds gag slots (`#seal`, `#moon-status`, `#corrections-counter`, `.insert-voss`, `.canon-reader-record`, `.committed-ring`). No triple-building.

## 5. Merged scene↔screen map (spine)

| # | Scene | Screen | Sim / interaction home | Commit | Grants |
|---|---|---|---|---|---|
| 1 | THE FILE | S-1 | case-file folder UI; S1 | BREAK THE SEAL (exit gate) | L1 |
| 2 | THE MOON | S-2 | S1 timeline; pin drop; 2 RECORD CONFLICTs (M1 publishes `conflictTaus[]`) | PIN DROP + resolve conflicts | — |
| 3 | THE MACHINE | S-3 | S3 ledger + He-3 worksheet (5 rows, refuses to balance) + Gary BELIEVE-2 + burn-budget allocation | worksheet attempt | — |
| 4 | THE FIRST LIE | S-4 | CHECKSUM VERIFY + S2 rehearsal sandbox | S2 rehearsal commit | L2 |
| 5 | THE CASCADE | S-5 | S2 real COMMIT (capture err < 0.5% gate) + S3 cascade strip JUPITER→EARTH→CAPTURE→MIMAS | COMMIT BURN | — |
| 6 | THREE TRILLION DOORS | S-6 | S4 (2 comparisons logged) + B-1→B-5 wizard | ACCEPT SHOT | L3 |
| 7 | THE SHEPHERDS | S-7 | S5 + trust vote (scene interaction) + Qiao rail journal | SHEPHERDS ALIGNED + vote | — |
| 8 | THE SLIP | S-8 | S1 crack overlay + S5 recall + C-1 burn drills + hidden-burn toggle (needs 3 Ren traces) | drills; toggle discovery | — |
| — | — | S-8F | THE RECKONING — fail branch of Scene 8 (rewind → checkpoint, restart → RUN #N+1) | — | — |
| 9 | EARTH, SOMEHOW | S-9 | S1 + S3: arrival check (±30d, reserve > 0) + return ledger; fail = scene setback | ledger sign-off | — |
| 10 | THE HEARING | S-10 | replay console; per-exhibit DEFEND/CONDEMN + free text + ARTIFACT ADMIT/SUPPRESS → verdict | TESTIFY | — |
| 11 | DECLASSIFIED | S-11 | S4-returns-altered cold open + C-2 final choice + IGNITE FINAL BURN | TAKE IT / LEAVE IT / LISTEN | L4, FINAL CANON |

Sub-screens (structure unchanged): Billiards B-1→B-5 · Core C-1, C-2 · Archive A-0→A-5 (hub/drawer, atlas, RUN archive, replay, codex, index).
Screen count: **11 spine + 5 billiards + 2 core + 6 archive = 24 navigable screens** (fail branch S-8F is a state of S-8, not a 25th screen).
Sim count: **7 major simulation systems** — S1 trajectory timeline, S2 Jupiter flyby sandbox, S3 Δv ledger, S4 probability cloud, S5 shepherd mini-game, Billiards (planner/encounter/cascade/replay), Core (cutaway/burn/charge/descent). Counting convention: one system per canon sim definition; Billiards and Core each count once despite internal sub-screens.

## 6. Still open (build-phase, not architecture)

1. **Chronology (canon-blocking, unresolved):** 2051 declassified-framing vs 2049–2052 Billiards chain vs ~4,200-day mission vs Qiao's "twelve years." No Round 2 ballot resolved it. The system spec must flag it; do not invent a fix silently.
2. Billiards coach-copy ownership (M4 words, M3 dismissal wiring) — assign in build.
3. Reduced-motion first-run auto-prompt card — one dismissible card, once (M3 chrome, M5 styling).
4. `s2.validBandRp` data contract — M1 exposes via `recompute(STEAL)`; M3's rail reads it.
5. `outcomeAtSecond(planHash, second)` for the A-2 one-second scrubber — M1 to confirm seeded timing-axis function.
6. Keyboard tab order + `aria-live` rail regions for B-1→B-5 and S5 STEP MODE — M3 defines, M5 styles.
7. Lock-reason tap pattern spec — M5 owes the visual + tap behavior.
8. RUN archive card layout must fit both `clearance_at_win` and `verdict` stamps — M5.
9. M4's ARTIFACT admit-or-suppress mechanical stakes — now folded into F2; M3 wires the commit buttons.
10. ARGUS status-line hook — M2 to confirm: no GL status line; ARGUS politeness lives in DOM chrome (M4).

## 7. Round 3 instructions

Each master: review ONLY the fiat items touching your domain (listed in your brief). **SIGN OFF** or raise a **BLOCKING** objection with a concrete alternative. A fiat stands unless its owning master blocks with an alternative. Non-blocking notes go in a separate list. Do not reopen settled C1–C10 items.

- M1: F3 (yours — sign off), F7 (yours), F8 (your restatement rejected — block or accept), F9 (add the narrative fields — confirm), F10 (yours — sign off), F4 (C-1 at 8 / C-2 at 11 split).
- M2: F8 (render 6), F10 (write aimDx/aimDy via recompute; call sim APIs), F13 (consume M5 tokens), F14 (feed bitmaps to M5's plate-frame), §6.10 (ARGUS status line — decide).
- M3: F1 (yours — sign off), F2 (yours — sign off), F4 (your L4 grant kept; C-1 moved to 8 — confirm wiring), F5 (your S-3 spine screen demoted to Archive drawer — block or accept), F6 (yours — sign off), F9 (time aliases), F11 (your schedule + M4 names/costs), F12 (your surcharge — adopted).
- M4: F1 (your Sc.9 placement rejected — block or accept), F2 (your class names rejected — block or accept), F4 (your Sc.7 grant rejected; C-2 at 11 — block or accept), F5 (yours — sign off), F9 (your fields adopted — confirm), F11 (your names/costs kept), F14 (your gag slots — confirm feed contract).
- M5: F11 (meter math with −5/level), F13 (you own the tokens — confirm), F14 (you own plate-frame — confirm), §6.7/§6.8 (lock-reason tap pattern + archive card stamps — acknowledge).
