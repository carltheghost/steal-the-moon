# STEAL THE MOON — Unified System Specification

**Status:** FINAL — converged 2026-09-19 after three design rounds across five masters.
**Process record:** `round1-brief.md` (proposals + B1–B12 conflicts + C1–C10 checklist) →
Round 2 ballots (all C1–C10 accepted) → `round2-results.md` (14 coordinator fiats F1–F14) →
Round 3 ratification (13 fiats signed off unanimously; F4 blocked once, resolved by fiat).
**Convergence:** full. No Round 4 required.

## 0. What this system is

One coherent interactable system: an 11-scene forensic narrative ("the declassified account of the Mimas heist")
wrapped around **7 major simulation systems**, all reading and writing a single shared state object (`STEAL`),
rendered by one persistent three.js scene with DOM-owned chrome, playable on desktop and mobile,
fully deterministic and replayable, with a pre-rendered exhibit pipeline for its archival stills.

### Fixed canon (not negotiable in build)

- **The moon:** Mimas departs at 246 miles / 396 km diameter. It loses diameter and mass as ice is stripped and burned.
- **The Core:** 159-mile metallic, heterogeneous, zoned exotic core. Arrival target ≈ 199 miles diameter
  (159-mi core + ≈ 20-mi global ocean + exposed metallic massifs). Departure radial ice thickness ≈ 43.5 miles.
- **The lie about value:** metallic treasure appearance is the visual lie; true value is POWER — energy, data
  (anomalous isotopic ratios, crystalline structure, lattice defects, phase boundaries), future capability. Not market price.
- **Ice has four jobs:** fusion feedstock · reaction mass · thermal/working mass · structural mass.
  Every burn removes load-bearing mass and worsens the Herschel Slip.
- **The ledger lie:** Δv books report 14.2 km/s; 9.8 km/s recovered at RECONCILE; 4.4 km/s unexplained.
  Who falsified it is never resolved. Voss is never confirmed as saboteur.
- **Billiards:** 293 Saturnian moons (August 2026 count — date-sensitive). Shot planner over a 12-link cascade.
  Abstract impulse tiers only: conventional / fission / fusion / one redacted Forbidden Shot. No weapon-construction
  or detailed-yield gameplay. Buried charges at abstract depths 2 / 7 / 17 / 25 miles; depth = coupling vs fracture.
  Outcomes: SMASH · PASS THROUGH · GRAVITY ASSIST · CRASH INTO MOON · MISS.
  Governing rule: **"THE EXPLOSION IS NEVER THE EVENT. THE ORBIT AFTER THE EXPLOSION IS THE EVENT."**
  Replay: **"SAME PLAN. DIFFERENT SECOND. DIFFERENT HISTORY."** Explosions ≈ 10% visual emphasis; changed orbits 90%.
- **Five motive reveals:** (I) official helium-3 story → (II) the math doesn't work → (III) checksum proves "helium-3"
  was inserted after sealing → (IV) the ice was fuel, not cargo → (V) the 159-mile Core is the truth.
- **Eleven scenes:** 1 THE FILE · 2 THE MOON · 3 THE MACHINE · 4 THE FIRST LIE · 5 THE CASCADE ·
  6 THREE TRILLION DOORS · 7 THE SHEPHERDS · 8 THE SLIP · 9 EARTH, SOMEHOW · 10 THE HEARING · 11 DECLASSIFIED.
- **Character objectives:** Voss controls the story (9 unsigned inserts, scenes 1/2/3/4/5/6/8/9/11 — never 7 or 10).
  Qiao completes the mission. Ren tries to save the moon (sabotage discoverable, never announced).
  Dotty finds what was erased. Qiao's exchange: *"It's not worth anything." / "That's the point."*
  Core line: *"They thought they were stealing a mineral. They were stealing a question."*
- **Resources:** TRUST (0–100, starts 50.0) · TIME (120-day contingency; TIME ≤ 0 → WINDOW CLOSED) ·
  Δv (35.0 km/s reserve, lied about).

### ⚠ Open canon issue (build-blocking, unresolved by design rounds)

**Chronology:** the 2051 declassified-framing (19 years after the heist) vs the 2049–2052 Billiards chain
vs the ≈ 4,200-day / 11.5-year mission vs Qiao's "twelve years" line cannot all remain unchanged.
**Do not invent a fix silently.** The build must surface one canonical timeline decision before data lock.
Related: proposed 2049–2052 configurations are not validated against JPL Horizons — do not present
planning dates as real reproducible alignments until ephemeris work is done.

---

## 1. Shared state — `STEAL` (schema v2)

Single serializable source of truth. Gameplay actions mutate inputs and call `recompute(STEAL)`,
which owns every derived value. No private copies in render or DOM layers.

```js
STEAL = {
  schema: 2,
  seed: 0x5EA17,                 // run seed, valid uint32 (M1 owns determinism)
  lutSeed: 0xC0FFEE,            // canon-fixed; S2 41×41 LUT formula seed, same every run
  scene: 1,                     // 1–11 current canon scene
  declass: 0,                   // 0–4, plus FINAL CANON eligibility flag
  time: {
    spentDays: 0.0,             // every TIME cost debits here
    marginDays: 120.0,          // the spendable contingency
    missionCapDays: 4200,       // canon mission clock cap
    missionDay: 0,              // narrative clock 0→4200; drives S1 timeline + S2 band shrink
  },
  // derived (never stored): timeLeft = marginDays - spentDays
  // aliases contingencyLeft (M3), timeMargin (M4) resolve to the same getter
  trust: 50.0,                  // 0–100 float; FORBIDDEN gate ≥ 60; L4 gate ≥ 40; 0 = soft fail
  trajectory: {
    tau: 0.0,                   // S1 scrub position, 0→1 over 4200 days
    aimDx: 0.0, aimDy: 0.0,     // S2 B-plane aim offsets, km, clamped ±5000
    captureWindowDays: 30,      // 15 after S2 MARGINAL; consumed by Scene 9 arrival check
    validBandRp: [1.10, 1.30],  // recomputed; shrinks with elapsed mission time
  },
  dv: {
    reserve: 35.0, spent: 0.0,
    reported: 14.2,             // the lie: what the meter shows pre-RECONCILE
    ghostReserve: 9.8,          // recovered at RECONCILE (S3, requires L2)
    reconciled: false, ghostSpent: 0.0,
    ledger: [],                 // entries tagged by sim, e.g. 's2-burn'
    projectedEarthReserve: 0.0, // < 0 → S4 P(success) = 0
    earthCaptureBurn: 2.5, earthPerigeeKm: 500,
    shepherdDiscount: 0.0,      // S5 win → discount on the Scene 6 burn
  },
  sims: {
    s1: { conflictsResolved: [false, false], pinDropped: false },
    s2: { rehearsals: 0, committed: null,
          // committed: {aim_km, capture_err_pct, verdict: MARGINAL|SUCCESS|FAIL} | null
        },
    s3: { reconciled: false, ghost_spent: 0.0, ledger: [],
          worksheet: { rows: [null×5], balanced: false } },
    s4: { comparisons: [],      // logged pairs for the 2-comparison completion
          displayCounter: "3,847,221,004,913,882" },  // display-only gag, never feeds a formula
    s5: { impulseUsed: 0.0,     // ≤ 100 budget
          corrections: 0, corridorHeld_s: 0.0, won: false },
  },
  billiards: {
    plan: null,                 // B-1→B-3 inputs: target, tier, depth, timing
    shots: [],                  // {plan_hash, outcomeClass, intendedPath, predictedPath,
                               //  observedPath, missDistanceKm, deltaV, ...}
    cascade: null,              // B-5 12-link report
    forbiddenUsesLeft: 1,
  },
  core: {
    diameterMi: 246.0,          // live; 246 → ~199 across the burn-down
    massKg: 0.0,
    burn: 0.0,                  // C-1 drill state
    exposure: 0.0,              // accrued BLIND during C-1; revealed at drill completion (F4)
    exposureRevealed: false,
    slip: 0.0,                  // Herschel Slip model readout
    choice: null,               // C-2: TAKE IT | LEAVE IT | LISTEN
  },
  config: { shepherdN: 6 },     // from chain.json; M2/M3 must not hardcode body counts
  // --- narrative fields (M4; drive reveals, hearing, declass) ---
  reveal: { sealBroken: false, worksheetFailed: false, checksumVerified: false,
            hiddenBurnFound: false, artifactAdmitted: false },
  hearing: { testimony: [],     // per-exhibit {exhibitId, stance: DEFEND|CONDEMN, text?}
             verdict: null },   // VINDICATED | SEALED | CONDEMNED
  voss: { insertsPlanted: 9, insertsSeen: 0 },
  traces: { renFound: 0 },       // 3 Ren sabotage traces → hidden-burn toggle
  dotty: { fragmentsFound: 0 },  // → L4 codex entry "DOTTY'S RECONSTRUCTION"
  flags: { reducedMotion: false, mobileTier: false },
}
```

**Writer ownership:** sim pure functions compute; scene commits write; `recompute(STEAL)` derives.
M1 publishes `conflictTaus[]` (S1 RECORD CONFLICT knot days — M3 must not hardcode freeze days).
`stateFromRun(run)` deterministically rebuilds any hearing exhibit's WebGL state from a RUN record
(decisions + seed only) — required owner: M1, build phase.

---

## 2. Unified screen map — 24 navigable screens

**Counting convention:** 11 spine screens (S-1→S-11, one per canon scene) + 5 Billiards sub-screens (B-1→B-5)
+ 2 Core sub-screens (C-1, C-2) + 6 Archive sub-screens (A-0→A-5) = **24**.
S-8F THE RECKONING is a fail *state* of S-8, not a 25th screen. "Scene N" always means canon numbering in docs/code.

**Layout skeletons** (M5): `plate-frame + rail` for story/sim/exhibit views · `index-screen` for atlas,
RUN archive, archive hub, and large data tables.

| Screen | Scene | Title / function | Sim home | Reader COMMIT | Render | Camera | Plate | Key state read/written |
|---|---|---|---|---|---|---|---|---|
| S-1 | 1 | THE FILE — case-file folder UI | S1 (sealed) | **BREAK THE SEAL** (exit gate) | DOM-led, GL timeline dimmed | file-desk | plate-frame + rail | → `reveal.sealBroken`, grants **L1** |
| S-2 | 2 | THE MOON — Saturn approach | S1 timeline scrubber | PIN DROP + resolve 2 RECORD CONFLICTs | WebGL `timeline` root | timeline-strip | plate-frame + rail | `trajectory.tau`, `sims.s1.*`; reads `conflictTaus[]` |
| S-3 | 3 | THE MACHINE — Δv ledger + worksheet | S3 meter | He-3 WORKSHEET attempt (5 rows; refuses to balance) + GARY BELIEVE-2 + burn-budget allocation | DOM ledger + GL meter strip | ledger-desk | plate-frame + rail | `sims.s3.worksheet`, `dv.ledger`, `reveal.worksheetFailed` |
| S-4 | 4 | THE FIRST LIE | CHECKSUM VERIFY + S2 rehearsal sandbox | S2 rehearsal COMMIT | WebGL `flyby` root | flyby-chase | plate-frame + rail | `reveal.checksumVerified`, `sims.s2.rehearsals`, grants **L2** |
| S-5 | 5 | THE CASCADE — the real burn | S2 COMMIT + S3 cascade strip | **COMMIT BURN** (capture err < 0.5% gate; +10d surcharge if zero rehearsals) | WebGL `flyby` root | flyby-chase | plate-frame + rail | `sims.s2.committed`, `dv.spent`, `time.spentDays` |
| S-6 | 6 | THREE TRILLION DOORS | S4 cloud (2 comparisons) + B-1→B-5 wizard | **ACCEPT SHOT** | WebGL `cloud` root + billiards | cloud-drift | plate-frame + rail | `billiards.plan/shots`, `sims.s4.comparisons`, grants **L3** |
| S-7 | 7 | THE SHEPHERDS | S5 shepherd sim + trust vote + Qiao rail journal | SHEPHERDS ALIGNED + trust vote | WebGL `shepherd` root | shepherd-top | plate-frame + rail | `sims.s5.*`, vote |
| S-8 | 8 | THE SLIP — drills + hidden burn | S1 crack overlay + S5 recall + C-1 burn drills; hidden-burn toggle iff `traces.renFound == 3` | drill commits; toggle discovery | WebGL `core` + `timeline` recall | cutaway | plate-frame + rail | `core.burn/exposure/slip`, `reveal.hiddenBurnFound`; **EXPOSURE meter revealed at drill completion** (F4) |
| S-8F | 8 | THE RECKONING — fail branch (state of S-8) | — | rewind → checkpoint · restart → RUN #N+1 | DOM | — | plate-frame | run fail (WINDOW CLOSED / drill catastrophe) |
| S-9 | 9 | EARTH, SOMEHOW — arrival + return ledger | S1 + S3 recall | ledger sign-off; arrival check (±30d window, reserve > 0); fail = scene setback (−10d, checkpoint rewind) | DOM + GL recall | ledger-desk | plate-frame + rail | `trajectory.captureWindowDays`, `dv.projectedEarthReserve` |
| S-10 | 10 | THE HEARING — replay console | replays as exhibits ("Exhibit 42B. The trajectory you selected.") | **TESTIFY**: per-exhibit DEFEND/CONDEMN + free text + ARTIFACT ADMIT/SUPPRESS → verdict | DOM-led (no GL root; replay numbers from STEAL via `stateFromRun`) | — | plate-frame + rail | `hearing.testimony[]`, `hearing.verdict`, `reveal.artifactAdmitted` |
| S-11 | 11 | DECLASSIFIED | S4-returns-altered cold open ("THE ARCHIVE HAS BEEN MODIFIED") + C-2 final choice + IGNITE FINAL BURN | **TAKE IT / LEAVE IT / LISTEN** | WebGL `core` root | cutaway | plate-frame + rail | `core.choice`, grants **L4**, FINAL CANON eligibility |
| B-1 | 6 | Shot planner — target select (293→24 filter) | billiards planner | choose target | WebGL `billiards` atlas | atlas | index-screen | `billiards.plan.target` |
| B-2 | 6 | Impulse tier (conventional/fission/fusion/FORBIDDEN🔒) | planner | choose tier | DOM + GL preview | atlas | plate-frame + rail | `billiards.plan.tier`; FORBIDDEN needs L3 + trust ≥ 60 |
| B-3 | 6 | Depth + timing dials | planner | set depth (2/7/17/25 mi) + timing ±30d | DOM dials + GL preview | cutaway | plate-frame + rail | `billiards.plan.depth/dt`; confidence readout |
| B-4 | 6 | SIMULATE — INTENDED/PREDICTED/OBSERVED | encounter sim | run simulation | WebGL `billiards` | encounter | plate-frame + rail | `billiards.shots[]` (triple path arrays) |
| B-5 | 6 | Cascade report — 12-link chain | cascade | **ACCEPT SHOT** → L3 | DOM report + GL chain | chain | plate-frame + rail | `billiards.cascade`; outcome classes |
| C-1 | 8 | Burn-table drills | core burn console | drill commits (ICE-0 jury-rig −20 TRUST) | WebGL `core` cutaway | cutaway | plate-frame + rail | `core.burn/exposure` (blind accrual) |
| C-2 | 11 | The final choice | core choice console | **TAKE IT / LEAVE IT / LISTEN** | WebGL `core` cutaway | cutaway | plate-frame + rail | `core.choice`; LISTEN needs L4 prereqs |
| A-0 | — | Archive hub / sim-card drawer (replaces S-3 selector) | hub | — | DOM | — | index-screen | clearance-gated sim cards |
| A-1 | — | Atlas — 293-body chain viewer | billiards data | — | WebGL `billiards` atlas | atlas | index-screen | reads moons.json, chain.json |
| A-2 | — | RUN archive — run cards + one-second scrubber | replay | branch → RUN #N+1 | DOM + GL replay | replay | index-screen | `stm.runs.v1`; scrubber varies timing axis only via `outcomeAtSecond(planHash, second)` |
| A-3 | — | Codex — declass-gated entries | lore | — | DOM | — | index-screen | `declass` gates; locked entries = redaction bars |
| A-4 | — | Stills — exhibit gallery | stills | "file as exhibit" (dev/QA recapture) | DOM + PNG | — | index-screen | stills.json + sidecars |
| A-5 | — | Settings — reduced-motion, tier, archive tools | chrome | — | DOM | — | index-screen | `flags.*`, storage management |

**Hero lines** (one per view; M4): S-1 "CASE FILE 7B — SEAL INTACT." · S-2 "246 MILES. PICK IT UP." ·
S-3 "THE MATH DOESN'T WORK." · S-4 "HELIUM-3 WAS INSERTED AFTER THE SEAL." · S-5 "COMMIT THE BURN. OWN THE LIE." ·
S-6 "THREE TRILLION DOORS. PICK ONE." · S-7 "HOLD THE LINE. LET IT RING." · S-8 "THEY AREN'T DRILLING. THEY'RE PEELING." ·
S-9 "EARTH, SOMEHOW. CHECK THE BOOKS." · S-10 "EXHIBIT 42B. THE TRAJECTORY YOU SELECTED." ·
S-11 "IF ARGUS SIMULATED TRILLIONS OF FUTURES, WHY IS THE ARCHIVE STILL CHANGING?"

---

## 3. Simulation inputs / outputs

Every sim is a pure function over (STEAL inputs, seeds). Scene interactions call the same APIs —
the anti-rename contract (F10). HUD numbers always use exact formulas, never interpolated geometry.

### S1 — trajectory timeline (Scene 1, 2, 8-recall, 9-recall)
- **In:** `time.missionDay` (scrub 0→4200d), `trajectory.tau`, `core.diameterMi/massKg` (live HUD readout), `conflictTaus[]` (M1 knot table).
- **Out:** scrub position; encounter cards at knot days; 2 RECORD CONFLICT freezes (S-2) with Ren margin-note slot;
  Herschel crack overlay at scripted tau (S-8, fed by Core `slipModel` read-only).
- **Render:** 8,400-vert strip (documented decimation of canon 16,800 6-hour samples; knot days hit exact indices).

### S2 — Jupiter flyby sandbox (Scene 4 rehearsals, Scene 5 real burn)
- **In:** `trajectory.aimDx/aimDy` (±5,000 km clamp, DOM steppers + numeric field on mobile, drag on desktop —
  both write the same fields via `recompute`), `time.missionDay` (valid-band shrink), rehearsal count.
- **Out:** `s2Outcome(dx,dy)` → {miss km, Δv cost, arrival day, capture err %} (exact closed-form scalars);
  `s2PathFor(dx,dy)` → 512-pt strip via bilinear sampling of the 41×41 LUT → analytic `conicPath(r_p)`;
  verdict MARGINAL / SUCCESS / FAIL; real COMMIT writes `sims.s2.committed`, spends −5d TIME,
  +10d surcharge if zero rehearsals; MARGINAL shrinks `captureWindowDays` 30→15.
- **Rail telemetry:** live valid band (1.10–1.30 R_J nominal, shrinking), capture-error %, Δv correction cost.

### S3 — Δv ledger (Scene 3, 5, 9; hub-replayable)
- **In:** burn commits from S2/Billiards/Core, `dv.reconciled`.
- **Out:** `s3Band()` → band on the 35.0 scale; displayed reserve = reconciled ? (reportedLeft + ghostLeft) : reportedLeft —
  **the meter reads the lie (14.2) until RECONCILE**; ghost segment (9.8, hatched amber) renders only when `reconciled`;
  listed-but-locked gag row "ABSOLUTELY DO NOT USE THIS FUEL"; `reconcileLedger()` — the single function
  Scene 8's hidden-burn toggle also calls (one ledger, one truth).
- **Worksheet (Scene 3 interaction):** 5 rows vs the ledger; refuses to balance → `reveal.worksheetFailed`.

### S4 — probability cloud (Scene 6, hub at L1, returns altered in Scene 11)
- **In:** run seed, `dv.projectedEarthReserve`, `core.diameterMi` (CORE_EXPOSED_EARLY tag).
- **Out:** 5,000 desktop / 500–1,000 mobile seeded ghost trajectories via `s4Ghosts(seed,n)` mapped through
  the S2 response surface (honestly a response-surface mapping, not n-body — labeled as such);
  `s4Compare(a,b)` logs the 2 required comparisons; **explicit P(success) rail readout** including the
  `projectedEarthReserve < 0 → P = 0` state ("ARGUS ASSESSMENT: 0% — RESERVE NEGATIVE");
  committed outcome rendered ringed/untouchable (`.committed-ring`).
- **Deterministic rejection tags** on pruned futures; tap-to-inspect (touch + reduced-motion safe).

### S5 — shepherd mini-game (Scene 7)
- **In:** `config.shepherdN = 6` (chain.json), S2 inherited aim error (bias), impulse nudges.
- **Out:** 6 bodies; **3 shepherd moons nudgeable** (drag arrows / −/+ steppers desktop; tap arrows or steppers,
  44px handles, in mobile SVG tier), 3 corridor context; **100-unit impulse budget meter** (every nudge deducts);
  **win = 3 corrections + corridor held 10 s + impulse < 100**; STEP MODE (12 × 5 s; win needs 2 consecutive
  in-band steps) works identically in the mobile SVG tier; final-10 s arrow lock; fail → retry costs TIME,
  3rd fail → half discount + TRUST −10; win → `dv.shepherdDiscount`.

### Billiards — shot planner → encounter → 12-link cascade → replay (Scene 6; B-1→B-5)
- **In:** target (293→24 filter needs mass/orbit/resonance per candidate from moons.json for η₀),
  tier (conventional 0.55 / fission 0.70 / fusion 0.80 / forbidden 0.90 base confidence),
  depth (2/7/17/25 mi), timing Δt ±30d, run seed.
- **Out:** `billiardsSimulate(plan, runSeed)` → {outcomeClass, **intendedPath[]** (ideal conic),
  **predictedPath[]** (η-model mean), **observedPath[]** (seeded draw), missDistanceKm, deltaV,
  momentumTransferPct, nextLinkErrorKm, confidence}; confidence =
  `clamp01(tierBase × (1 − p_f(d)) × exp(−(|Δt|/30)²))`; B-5 cascade report; RUN archive entry
  (decisions + seed; one-second scrubber varies timing axis only via `outcomeAtSecond(planHash, second)`).
- **Draw rule:** `mulberry32(hash(planFields) ⊕ runSeed)` — re-simulating the identical plan yields the identical result.
- **B-3 tradeoff (corrected copy):** deeper = less SLIP + more TIME + more FRACTURE
  (fracture `p_f(d)` rises; slip coupling `σ_slip(d)` falls). Never "deep = safe."

### Core — cutaway → burn drills → charge → descent → choice (Scene 8 C-1; Scene 11 C-2)
- **In:** `core.diameterMi/massKg`, drill actions, charge depth, declass.
- **Out:** `coreBurn(state, action)`; burn/structural-integrity tradeoff; buried-charge depth selector (L2+);
  `slipModel` read-only for Scene 8 overlays; **EXPOSURE meter accrued blind during C-1 drills,
  revealed at drill completion** (F4); C-2 choice TAKE IT / LEAVE IT / LISTEN (LISTEN needs L4 prerequisites);
  IGNITE FINAL BURN executes the choice.
- **Geometry:** cutaway shows 159-mi core inside diminishing ice shell; diameter readout live from 246.

## 4. Interaction grammar & resource economy

**Every interaction:** Set inputs → Commit → Observe → Report → Resource delta.
**Commits** (S2 COMMIT, B-4 SIMULATE, C-2 choice, seal-breaks, ACCEPT SHOT) disable while
`contextHealthy == false` ("TAPESTRY PAUSED — RESTORING"). No commit is ever silently dropped.

### TRUST (0–100 float, start 50.0)
| Event | Δ |
|---|---|
| S1 complete | +10 |
| S1 skip conflicts | −20 |
| S2 MARGINAL | −10 |
| S4 two comparisons | +10 |
| S5 third-fail partial | −10 |
| Gary belief pair | ±10 |
| C-1 ICE-0 jury-rig | −20 |
| S-10 redaction (each) | −20 |
| S-10 exhibit matches archive | +20 |
| FORBIDDEN SHOT use | −20 |
| Declass grant (each level) | −5 ("TRUST drains as redaction lifts") |

Gates: FORBIDDEN SHOT = L3 + trust ≥ 60 + `forbiddenUsesLeft = 1`. L4 needs trust ≥ 40.
Diligent path to FORBIDDEN-eligibility: S1 (+10) + S4 comparisons (+10) + one more positive delta (lock reason says so).
TRUST 0 = soft fail: Dotty hints stop, verdict caps at SEALED.

### TIME (120-day contingency)
`timeLeft = marginDays − spentDays`; TIME ≤ 0 → WINDOW CLOSED run fail (→ S-8F).
Costs: S2 COMMIT −5d · ADJUST −3d · unrehearsed COMMIT +10d surcharge · Scene 9 setback −10d ·
S5 retry costs TIME. `missionDay` (0→4200) is the separate canon clock driving S1/S2 band shrink.

### Δv (35.0 km/s reserve, lied about)
Dual-pool schema (§1). Main burns draw `reported`; B-3 torch-correction toggle + Scene 6 margin top-ups
draw `ghostReserve` (post-reconcile only). "INSUFFICIENT Δv" disable logic checks the correct pool.

### Declassification (action-gated, never time-gated; −5 TRUST per grant; clearance persists per-player)

| Level | Name | Granted by | Reveals |
|---|---|---|---|
| L0 | PUBLIC | start | S1, S2 rehearsals, S3, Conventional tier, public codex |
| L1 | UNSEALED | break the S1 seal (Scene 1) | S4 cloud, Fission tier, Gary records, Atlas chain viewer |
| L2 | LEAKED | both S1 RECORD CONFLICTs + S2 rehearsal commit (Scene 4) | S5, **S3 RECONCILE** (ghost 9.8), Fusion tier, charge-depth selector |
| L3 | CORRECTED | ACCEPT a billiards shot (Scene 6) | FORBIDDEN SHOT (1 use, trust ≥ 60), S-10 exhibit preview, secret codex |
| L4 | COMPLICATED | reach Scene 11 with TRUST ≥ 40 | LISTEN prerequisites, top-secret codex (EXPOSURE meter already revealed at Scene 8 drill completion) |
| FINAL | CANON | CAPTURED win + VINDICATED verdict at L4 + S11 burn | full canon browser, gold "true" trajectory in S2, new-run+ |

Sim unlock: L0: S1–S3 (S2 rehearsals only; real COMMIT is a Scene 5 spine beat) · L1: +S4 · L2: +S5.
Sims are rehearsal tools, replayable from the Archive; "all five complete" is not a spine gate.
Locked controls show lock reasons on tap *and* hover; locked codex entries are redaction bars, never hidden text.

### The Hearing (Scene 10) — verdict with teeth
Per-exhibit DEFEND / CONDEMN + optional free text + ARTIFACT ADMIT/SUPPRESS.
Skipped sims render `NO DATA — SUBJECT DECLINED.` (standardized) and apply their TRUST consequence live.
- **VINDICATED:** majority DEFEND, books reconciled (or lie never taken), TRUST ≥ 40 → FINAL CANON eligible;
  new-run+: +10 TRUST, keep reconciled ledger, keep codex.
- **SEALED:** mixed record, TRUST < 40, or >2 sims skipped → FINAL CANON locked; new-run+: keep codex only.
- **CONDEMNED:** majority CONDEMN or unreconciled books exhibited → FINAL CANON locked; next run: ghost reserve
  locked for RUN #N+1, TRUST starts at 40, Dotty redactions worsen one cosmetic tier.
Stamped on the RUN archive card (two-badge row: `clearance_at_win` + `verdict`) and read aloud by the tribunal
with the player's real numbers. RUN #N JSON also stores `clearance_at_win`.

---

## 5. Render architecture (M2)

- **One persistent WebGL2 scene**, transparent canvas over CSS paper (no WebGL-painted paper background).
- **Six pooled root groups** (one active invariant): `timeline` · `flyby` · `cloud` · `shepherd` · `billiards` · `core`.
  Scene 10 (hearing) is DOM-led with no GL root — replay numbers reach DOM exhibit cards from STEAL via `stateFromRun`.
- **Ownership split:** WebGL owns trajectories, bodies, probability clouds, orbit changes, cutaways, stress waves.
  DOM/CSS owns archive controls, text, meters, testimony, legends, and all sim inputs on mobile.
- **DOM→render API:** `SceneDirector.setModeState(mode, partialState)`; aim sprite writes
  `STEAL.trajectory.aimDx/aimDy`, reads back via `recompute(STEAL)` — no private copies.
- **Truth grammar in GL:** line materials use `toneMapped: false` (exact colors); dash/dotted map to shader uniforms,
  double line = offset line pair; divergence labels take Δ values from M1's scalars in physics units.
- **All 293 bodies are not detailed meshes** — irregulars are point-cloud entries with local LOD.
- **Context loss:** M2 exposes `contextHealthy`; M3 gates every commit on it; scene restores from snapshot.
- **ARGUS politeness:** DOM chrome only (no GL status line — decided §6.10/Round 3).
  M2-side: rAF pause on `visibilitychange`, DPR caps per tier, idle-animation freeze under reduced motion.

## 6. Visual system (M5)

- **Register:** NASA binder × forensic evidence board × incompetent archive. "Science Serious, Paperwork Stupid."
- **Palette:** ivory `#E9E2D2` · blue-gray `#667681` · near-black `#202321` · cyan `#71A9AD` ·
  amber `#C69A45` · red `#8E3434`. No green-good/red-bad outcome grammar. Never color-only:
  lines, patterns, labels, and numeric readouts duplicate every meaning.
- **Typography (self-hosted OFL):** IBM Plex Mono (data/readouts) · Oswald (headers) · Caveat (marginalia).
- **Permanent honesty labels:** "SCHEMATIC — NOT TO SCALE" · "VISUAL DIVERGENCE EXAGGERATED ×12" (×12 canon-locked;
  single `displayTransform` owned by M1, used by both live and STATIC tiers).
- **Truth grammar (M5 owns the shared LineStyle token module; M2 consumes in shaders, DOM/SVG in CSS):**
  solid = observed · dashed = predicted · dotted = hypothetical · double = disputed.
  Billiards forensic triple layer: INTENDED dotted-slate / PREDICTED amber-dashed / OBSERVED cyan-solid.
  `.committed-ring` is an annotation state (player's committed outcome: ringed, untouchable), not a 5th style.
- **Every dense visualization gets a human-scale anchor.** One hero line per view.
- **Gag furniture (M4 copy, M5 component, slot contract F14):** `#seal` (L0 cover; breaking fires the L1 lift),
  `#moon-status` pill ("MOON STATUS: STILL A MOON", fed per scene), `#corrections-counter`
  (#17→#18→#19→CLASSIFIED, stamp animation, tap-accessible hover log), `.insert-voss`
  (furniture-mismatched strip, "attribution: archival error" microcopy — never inside `.pov-voss`),
  `.canon-reader-record` (writable end-plate slot fed by Scene 10 testimony),
  S4 `displayCounter` gag ("ACTUAL RUNS 3,847,221,004,913,882", display-only).
- **Lock affordance:** tap/click any locked element → dismissible reason chip
  (e.g. "Requires L2 · break the S1 seal"); keyboard-focusable, `aria-describedby` parity across tiers.
- **Reduced-motion:** M5's STATIC SVG plates are the reduced-motion tier only (never the mobile tier);
  every timed moment has a stepped path; ARGUS +3s politeness renders instantly as text, never an input lock.
  First-run `prefers-reduced-motion` auto-prompt: one dismissible card, once (M3 chrome, M5 styling).
- **No-WebGL fallback:** intentional SVG/static exhibit plates, not a degraded page.

## 7. Desktop / mobile flow

**Contract (C8):** canvas is display-only on mobile; every sim input is a real DOM control; OrbitControls is desktop-only
(detached in all modes on mobile; camera rigs fixed).

- **S2 aim:** desktop drag + DOM steppers · mobile steppers + numeric field bound to the SVG sandbox
  (±5,000 km clamp, `aimKm` event contract — identical rules, enforced in shared math, not the GL layer).
- **S5:** desktop drag arrows / −/+ steppers · mobile tap arrows (≥ 44px handles) or steppers; STEP MODE fully
  supported in the SVG tier; 0.5 s freeze is input-lock, identical on touch.
- **S4:** tap points via overlay DOM (taps never touch the canvas).
- **B-3 dials/sliders:** native inputs. **S1 scrubber:** native range input everywhere.
- **Breakpoints:** <768 px → evidence rail stacks below the viewport and becomes the controls panel;
  inputs ≥ 48 px; meters collapse to the top strip. Desktop ≥ 1024 px keeps drag + OrbitControls where attached.
- **Reduced-motion + mobile:** STATIC plates + stepped paths; the full story and every decision path survive.

## 8. Open-source stack (all free, no paid services)

| Layer | Choice | License / note |
|---|---|---|
| 3D | `three@0.186.0` (pinned; npm lockfile + jsdelivr importmap fallback) | MIT |
| App | Vanilla JavaScript ES modules — no React, no react-three-fiber | — |
| 2D | CSS, SVG, Canvas | — |
| three.js extras | `OrbitControls`, `BufferGeometryUtils` (desktop only for controls) | MIT |
| Shaders | Custom GLSL only where needed; no EffectComposer/bloom dependency | — |
| Math | Hand-rolled deterministic: `mulberry32`, Box–Muller, bilinear interp, Catmull-Rom, Clohessy–Wiltshire dynamics, lightweight orbital equations. **No physics engine, no math lib, no GLTF requirement.** | — |
| Fonts | IBM Plex Mono, Oswald, Caveat — self-hosted | OFL |
| Persistence | Versioned `localStorage`: `stm.steal.v2` (STEAL snapshot) · `stm.runs.v1` (RUN archive, decisions+seed) · `stm.clearance.v1` (per-player clearance) | — |

**Repo posture:** build from suitable existing free/open-source GitHub software where it fits
(three.js and its examples ecosystem carry the heavy rendering load); everything else is hand-rolled
deterministic code rather than new dependencies. The user authorized starting a new repository if needed —
no public repository URL is confirmed yet; that decision is build Phase 0.

## 9. JSON data mapping (every file consumed — M1 audit)

| File | Schema (essence) | Consumers |
|---|---|---|
| `data/canon.json` | mission constants: 4200d cap, 35.0 Δv reserve, 14.2/9.8/4.4 ledger figures, S1 knot days (`conflictTaus[]`), 41×41→81×81 LUT provenance note, ×12 divergence factor, canon hashes (per-file `canonHash` for the Scene 11 "archive modified" beat) | S1, S2, S3, stills sidecars |
| `data/chain.json` | 12-link cascade definition: link bodies, encounter order, 2049–2052 windows, `shepherdN: 6` + S5 initial conditions | Billiards B-1→B-5, S5, A-1 atlas |
| `data/core.json` | 246→159→199 mi geometry, ice-shell model params, 4 ice jobs, burn/slip/fracture coefficients (`p_f`, `σ_slip`), charge depths 2/7/17/25 | Core C-1/C-2, S-8 overlays |
| `data/characters.json` | Voss/Qiao/Ren/Dotty objectives, 9 Voss insert slots, Ren's 3 traces, Dotty fragments, Qiao log milestones | M4 annotations, S-7 journal, S-10 exhibits |
| `data/scenes.json` | 11 scenes: titles, hero lines, presenters, commit definitions, per-scene STEAL write contracts (identical via spine or Archive replay) | gating, S-1→S-11 |
| `data/declassification.json` | L0–L4 + FINAL CANON: names, grants, reveals, −5 TRUST costs, tier gates (FORBIDDEN), RECONCILE/EXPOSURE/LISTEN gates | `STEAL.declass`; sims read the gates, scenes don't freelance them |
| `data/stills.json` | exhibit manifest: still IDs, scene bindings, camera presets, seed + STEAL snapshot hash refs | M2/M5 stills pipeline, A-4 gallery |
| `data/moons.json` | **full 293-body catalog** (Aug 2026 count, date-sensitive): names/designations, families, orbital elements, sizes where known, explicit unknowns; state vectors for major/candidate bodies | M2 atlas (point-cloud LOD), M1 billiards η₀ (B-1 293→24 filter) |

**Data gaps (build must close):** the 293-body catalog is not yet assembled (only 19 major moons exist in the
current artifact); 2049–2052 configurations unvalidated vs JPL Horizons; chronology decision pending (§0).

## 10. Stills / exhibits pipeline

1. three.js captures a deterministic raw bitmap + sidecar state (`resetSim(seed)` before warm-up frames;
   sidecar: camera, STEAL snapshot hash via `stillStateHash()`, seed, per-file `canonHash`, LUT formula version).
2. Visual compositor adds archival furniture, stamps, labels, scales, human anchor.
3. Final 1600×1000 PNG + JSON sidecar committed under `exhibits/`.
4. **Pre-rendered PNGs are the production assets** (M5); runtime recapture is the dev/QA tool (M2)
   and the "file as exhibit" action. Pixel-determinism under the 0.186.0 pin underwrites
   the Scene 4 checksum and Scene 11 "archive has been modified" story beats.

## 11. Determinism & persistence

- Two seeds, two purposes: run seed `0x5EA17` (billiards timing chaos + S4 ghost draws) ·
  LUT seed `0xC0FFEE` (canon-fixed S2 formula — archive data, same every run).
- `mulberry32(hash(planFields) ⊕ runSeed)` — identical plan, identical result, every run.
- Honestly-faked list (disclosed in-fiction): S1 8,400-vert decimation · S4 64-sample texture (of canon 96) ·
  41×41 LUT (of canon 81×81) with diegetic "declassified targeting approximation" footnote ·
  response-surface-mapped ghosts (not n-body) · point-cloud irregulars.
- Persistence: versioned localStorage (§8); corrupt/old data → migrate-or-reset with
  "ARCHIVE DAMAGED — STARTED NEW FILE" card (never a dead end); quota fallback: drop oldest
  non-current runs first, keep current run + clearance + codex, else session-only + "ARCHIVE NOT SAVING" badge.

---

## 12. Killed ideas (with what replaced them)

1. **M4's sim renames — the biggest kill.** S2 as "heist engine," S4 as "helium-3 worksheet," S3 as "cascade chain,"
   S5 as "Slip window," S1 as "Mimas tour." Killed because it broke every exhibit reference
   ("Exhibit 42B. The trajectory you selected" must mean one deterministic thing) and would have forked
   the ledgers. Replaced by: canon sim definitions locked (C5) + worksheet/checksum/hidden-burn/hearing
   as **scene interactions calling one shared sim API** (F10).
2. **S-3 "FIVE SIMS" spine screen.** No canon scene is a sim selector. Demoted to the Archive drawer (A-0);
   Scene 3 became THE MACHINE (S3 ledger + worksheet + Gary records + allocation).
3. **M1's S5 win restatement** ("all 6 hold resonance bands"). Canon's win stands:
   3 corrections + corridor held 10 s + impulse < 100.
4. **M4's Scene-7-sim-free, Scene-9 fail branch, EXONERATED/CENSURED verdict names.** Resolved by fiat:
   Scene 7 hosts S5; S-8F stays Scene 8's branch; VINDICATED/SEALED/CONDEMNED.
5. **M4's reveal-at-11 EXPOSURE meter** (the one Round 3 block). Moved to Scene 8 drill completion —
   a sub-40-TRUST player would otherwise accrue it blind and never see it.
6. **M2's hardcoded 3 shepherd bodies.** Now 6 from chain.json via `STEAL.config.shepherdN`.
7. **M3's 0–10 integer TRUST.** Now 0–100 float (all deltas ×10; finer granularity for ±1-class events).
8. **M1's three.js 0.170 pin.** Now 0.186.0 (M2 verified current-stable; physics is three-agnostic).
9. **M4's L1 alternative ("complete any 2 sims").** The seal ritual is the sole L1 gate.
10. **Mobile canvas dragging / OrbitControls on touch.** Display-only canvas contract (C8); all inputs are DOM.
11. **Runtime recapture as production stills.** Dev/QA tool only; build-time PNGs are the assets.
12. **Canon 81×81 LUT at runtime.** 41×41 with the diegetic "declassified targeting approximation" footnote.
13. **`0x5TEA1` joke seed.** Invalid hex; replaced by `0x5EA17` (+ canon-fixed `0xC0FFEE` for the LUT).
14. **M2's GL status line for ARGUS politeness.** DOM chrome only (accessibility + context-loss pattern).
15. **"Deeper = less slip, more TIME" B-3 copy.** Physically backwards as stated; now
    deeper = less SLIP + more TIME + more FRACTURE (two functions, not one).
16. **S2 real burn available from L0.** Rehearsals only until the Scene 5 spine beat.
17. **Scene 6 as billiards-only or S4-only.** Both co-host: S4 comparisons + B-1→B-5 wizard, ACCEPT grants L3.
18. **M1's consumed-only `timeDays` without a margin.** Merged `{spentDays, marginDays: 120, missionCapDays: 4200}`
    + `missionDay` canon clock; `timeLeft` is the single derived getter.
19. **M3's "TRUST ≥ 4"-style gates.** ×10 across the board (≥ 40).
20. **M4's S-8/Scene-8 numbering collision.** "Scene N" = canon numbering mandated in all docs/code.

## 13. Ordered build checklist

**Phase 0 — Canon & data lock**
- [ ] 0.1 Resolve the chronology conflict (§0) — one canonical timeline decision, surfaced not silent.
- [ ] 0.2 Assemble `data/moons.json`: full 293-body catalog (names/designations, families, orbital elements,
      sizes where known, explicit unknowns; state vectors for major/candidate bodies).
- [ ] 0.3 Validate 2049–2052 configurations against JPL Horizons (or mark planning dates as illustrative).
- [ ] 0.4 Author the 8 JSON files per §9 schemas; add per-file `canonHash`.
- [ ] 0.5 Repository decision: new repo vs existing (user authorized either).

**Phase 1 — Deterministic core (M1)**
- [ ] 1.1 `mulberry32`, Box–Muller, bilinear, Catmull-Rom, CW dynamics — hand-rolled, seeded.
- [ ] 1.2 Sim pure-function API: `s1PathAt, s2Outcome, s2PathFor, s3Band, s4Ghosts, s4Compare, s5Step,
      s5StateAt, billiardsSimulate, coreBurn, reconcileLedger, slipModel (read-only), resetSim,
      stillStateHash, displayTransform, outcomeAtSecond, conflictTaus[]`.
- [ ] 1.3 `STEAL` schema v2 (§1) + `recompute(STEAL)` owning all derived values + `stateFromRun(run)`.
- [ ] 1.4 41×41 S2 LUT from the closed-form seeded formula (LUT seed `0xC0FFEE`); exact-formula HUD scalars.

**Phase 2 — Persistence**
- [ ] 2.1 `stm.steal.v2` / `stm.runs.v1` / `stm.clearance.v1`; version check on load; migrate-or-reset card.
- [ ] 2.2 Quota fallback (drop oldest non-current runs; "ARCHIVE NOT SAVING" badge).

**Phase 3 — Visual system (M5)**
- [ ] 3.1 LineStyle token module (CSS + GLSL-consumable values: dash/gap arrays, double offset).
- [ ] 3.2 `plate-frame` component + slot API (`#seal`, `#moon-status`, `#corrections-counter`,
      `.insert-voss`, `.canon-reader-record`, `.committed-ring`); `index-screen` skeleton.
- [ ] 3.3 Self-hosted OFL fonts; palette; honesty labels; lock-reason tap pattern; archive card two-badge row.

**Phase 4 — Render (M2)**
- [ ] 4.1 three@0.186.0; one WebGL2 scene; six pooled roots; `SceneDirector.setModeState`.
- [ ] 4.2 Aim sprite ↔ `STEAL.trajectory` via `recompute` (no private copies); S2 strip via LUT bilinear → conic.
- [ ] 4.3 `contextHealthy` exposure; rAF/DPR/reduced-motion handling; mobile SVG/DOM tiers for S2/S5
      (same clamps, same contracts as desktop).
- [ ] 4.4 Stills capture pipeline: `resetSim(seed)` → warm-up → bitmap + sidecar (§10).

**Phase 5 — Spine S-1→S-11 (M3 + M4)**
- [ ] 5.1 All 11 screens per §2 map: commits, costs, lock reasons, hero lines, presenter voices.
- [ ] 5.2 Seal ritual (S-1), pin drop + conflicts (S-2), worksheet + Gary (S-3), checksum (S-4),
      real burn (S-5), S4 comparisons (S-6), S5 + trust vote + Qiao journal (S-7),
      crack overlay + C-1 drills + hidden-burn toggle + EXPOSURE reveal (S-8), arrival + ledger (S-9),
      hearing console (S-10), S4-altered + C-2 + ignite (S-11).
- [ ] 5.3 S-8F fail state; Scene 9 setback path; commit-guard wiring (`contextHealthy`).
- [ ] 5.4 Scene-commit STEAL-write contracts identical via spine or Archive replay.

**Phase 6 — Sims S1–S5 wiring (M1+M2+M3)**
- [ ] 6.1 Rail telemetry: S2 valid band (`s2.validBandRp`), S4 P(success) incl. zero state, S5 impulse meter,
      S1 diameter/mass readout, S3 dual-pool gauge.
- [ ] 6.2 Gag rows, margin-note slots, rejection tags, `.committed-ring` states.

**Phase 7 — Billiards B-1→B-5 + Archive A-0→A-5 (M3)**
- [ ] 7.1 Planner, tier/depth/timing inputs, triple-path SIMULATE, 12-link cascade report, RUN archive,
      one-second scrubber, branch → RUN #N+1.
- [ ] 7.2 Archive hub drawer with clearance-gated sim cards; atlas; codex; stills gallery; settings.

**Phase 8 — Core C-1/C-2**
- [ ] 8.1 Burn-table drills with blind `core.exposure` accrual; charge-depth selector (L2+).
- [ ] 8.2 C-2 choice console (LISTEN gated on L4 prerequisites); IGNITE FINAL BURN.

**Phase 9 — Hearing, verdict, new-run+**
- [ ] 9.1 Per-exhibit DEFEND/CONDEMN + free text + ARTIFACT ADMIT/SUPPRESS; `NO DATA — SUBJECT DECLINED.` paths.
- [ ] 9.2 Verdict computation (VINDICATED/SEALED/CONDEMNED) + stamped RUN cards + tribunal readout + new-run+ effects.

**Phase 10 — Exhibits**
- [ ] 10.1 Pre-render all stills (1600×1000 PNG + sidecar) under `exhibits/`; A-4 gallery; "file as exhibit" QA path.

**Phase 11 — Mobile, reduced-motion, a11y**
- [ ] 11.1 <768 px rail-stacks-below pattern; ≥48px inputs; top-strip meters; display-only canvas verification.
- [ ] 11.2 STATIC plates as the reduced-motion tier; stepped paths for every timed moment; first-run prompt card.
- [ ] 11.3 Keyboard tab order + `aria-live` rail regions; tap lock-reasons; `NO DATA` screen-reader paths.

**Phase 12 — QA & lock**
- [ ] 12.1 Determinism: same seed + same decisions → same exhibits (hearing replay check via `stateFromRun`).
- [ ] 12.2 Checksum beat (Scene 4) and "archive modified" beat (Scene 11) verified against pinned 0.186.0 pixels.
- [ ] 12.3 Context-loss mid-commit drill; quota-exceeded drill; corrupt-storage drill.
- [ ] 12.4 Honestly-faked list review; ×12 label audit; no-WebGL fallback pass.

---

*Spec converged 2026-09-19. Owners: M1 orbital/geophysics · M2 three.js · M3 interaction/game ·
M4 storytelling · M5 visual. Coordinator: this document.*
