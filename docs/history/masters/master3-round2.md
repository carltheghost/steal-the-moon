# MASTER 3 (INTERACTION / GAME DESIGN) — ROUND 2

## 1. CRITIQUES

### M1 — Orbital/geophysics
- **Breaks:** M1's coupling variables have no UI surface in my proposal. Required readouts I must add: (1) `timeDays → S2 valid-band shrink` — S2 rail needs a live "valid band 1.10–1.30 R_J, shrinking −X/day as missionDay advances" readout; (2) `core.diameterMi/massKg → S1 readout` — S1 HUD needs a live diameter/mass readout (246 mi / 396 km, updating); (3) `projectedEarthReserve < 0 → S4 P(success) = 0` — S4 needs an explicit probability readout including the zero state, not just point tags; (4) `trust ≥ 60 gates FORBIDDEN` — covered by my B-3 gate, but only after scale conversion (see B2 revision). **Cites B2.**
- **Unplayable/unreachable:** Nothing directly — M1 is backend. But M1 consumes `flags.reducedMotion` and `flags.mobileTier` without owning their UI. **Decision:** M3 owns the reduced-motion toggle (in archive chrome, first-run auto-prompt from `prefers-reduced-motion`); M2's tier detection feeds `mobileTier`, exposed read-only to M1.
- **Missing:** (1) My S5 spec omitted canon's impulse budget — S5 UI must show the **100-unit impulse budget meter** and the win condition must be canon's: **3 corrections + corridor held 10s + impulse < 100**, not just my resonance-hold rule. (2) S3 ledger needs the canon gag as a real row: an "ABSOLUTELY DO NOT USE THIS FUEL" redacted ledger line (listed, locked, lock reason shown). (3) M1's billiards outcome classes (SMASH / PASS THROUGH / GRAVITY ASSIST / CRASH INTO MOON / MISS) must map 1:1 onto my B-5 cascade report — they do, but M1 must expose the class as a stable string, not just probabilities.
- **Contradicts canon:** `seed: 0x5TEA1` is invalid hex and a shipping hazard — replace with a valid uint32 (e.g. `41770`; matches the seed already in my RUN #N example). Otherwise M1's honestly-faked list is consistent with my determinism contract.

### M2 — three.js visualization
- **Breaks:** OrbitControls attached in FLYBY/CLOUD/SHEPHERD/BILLIARDS/CORE directly conflicts with the mobile display-only contract. **Winner: M3's contract (C8)** — OrbitControls is desktop-only; on mobile it stays detached everywhere, camera rigs are fixed, and every sim input is a DOM control. M2 already conceded the principle by making mobile S2/S5 SVG/DOM; extend the concession to all modes. **Cites B6.**
- **Unplayable:** M2's mobile S2/S5 SVG/DOM tiers are my mobile input surface — but only if they expose the same contracts as desktop: the SVG aim sandbox must honor the **±5,000 km clamp** and emit `aimKm` events my DOM steppers/numeric field bind to; the SVG S5 must support **STEP MODE (12 × 5 s)**, not just the 60 s real-time game. Without that binding, mobile S2/S5 are unreachable toys.
- **Missing:** (1) M2's open question on a shared LineStyle truth-grammar utility — **yes**, one shared module; M5 owns the tokens, M2 consumes them in shaders, DOM/SVG consumes in CSS. Non-negotiable for the "never color-only" rule. (2) A commit-guard for context loss: M2 restores the scene from snapshot, but if `webglcontextlost` fires mid-commit (S2 COMMIT, B-4 SIMULATE, C-2 choice), my layer must **disable commit buttons while the "tapestry paused" card is up** — M2 must expose a `contextHealthy` boolean.
- **Contradicts canon:** (1) M2 renders **3 shepherd bodies**; canon (sim-spec) says **5–7 asteroids** — M2 must render 5–7; my corrected S5 makes the 3 shepherd moons nudgeable and the rest corridor context. **Cites B9.** (2) M2's S1 strip is 8,400 verts (2/day) vs canon's 16,800 points (6-hour samples) — take M2's 8,400 for perf and log it in the honestly-faked list; no interaction impact. (3) Version pin — resolved by C2 (0.186.0). **Cites B1.**

### M4 — Storytelling
- **Breaks:** M4 renames the canon sims (S2 as "heist engine sim," S4 as "helium-3 worksheet," S3 as "cascade chain," S5 as "Slip window sim," S1 as "Mimas tour"). From the interaction standpoint this breaks every exhibit reference ("Exhibit 42B. The trajectory you selected" must mean S2-the-flyby-sandbox, deterministically) and the S-3 hub's sim cards. **Fix per C5:** sim definitions are locked; worksheet / cascade / slip-window / checksum / hidden-burn are **scene interactions layered on canon sims**, never renames. **Cites B4.**
- **Unplayable:** Scene 7 declared "sim-free" while Qiao's log is assigned to "S5" — that leaves S5 with no story home and contradicts canon (S5 = shepherd mini-game, presented by Qiao). **Fix:** Scene 7 hosts **both**: S5 sim as the mechanical interaction, the trust vote as the reader COMMIT. One screen, one commit, one exit — M4's pacing rule survives.
- **Missing that my screens need:** (1) Every M4 scene-commit needs listed costs and lock reasons in my grammar — the ARTIFACT admit-or-suppress choice (Scene 10) needs explicit mechanical stakes; Ren's 3 sabotage traces need a tap-to-inspect UI with prerequisites shown; (2) NATURAL REACTOR hover-to-unredact needs a **touch equivalent (tap toggles) and a reduced-motion instant** — hover-only is a dead end on mobile; (3) the corrections-counter gag (#17→#18→#19→CLASSIFIED) needs a hover-log that is also tap-accessible.
- **Contradicts canon / misaligns:** (1) M4's declass "L2 LEAKED (S8 file slips in)" — in 11-scene numbering the leak fiction belongs to **Scene 4 (THE FIRST LIE)**, not Scene 8; remapped in the unified table below. (2) "S10 testimony" as an L3 earner misplaces the hearing (Scene 10) against the ladder — testimony feeds the verdict, not L3; corrected below. (3) Skipped-sim phrasing: M4's "NO RECORD — WITNESS DECLINED TO PARTICIPATE" vs my "NO DATA — subject declined" — **standardize on: `NO DATA — SUBJECT DECLINED.`** **Cites B12.**

### M5 — Visual design
- **Breaks:** M5's "static SVG fallback plates per sim tagged STATIC" read as the *mobile* tier would kill my mobile interaction story (live SVG S2 sandbox, tap S5, DOM steppers). **Clarification, not a fight:** STATIC plates are the **reduced-motion** tier only. Mobile-with-motion uses M2's interactive SVG/DOM tier + my DOM controls. If a STATIC plate ever renders on a motion-ok phone, that's a bug.
- **Unplayable/unreachable:** Nothing — M5's per-sim fallback list covers every sim, billiards, and core, so every reduced-motion path has a visual home. But M5's mobile rail *is* my "controls below canvas" pattern — **confirm:** on <768 px the evidence rail stacks below the viewport and becomes the controls panel, inputs ≥ 48 px, meters collapse to the top strip. That is the contract; no separate mobile control pattern gets invented.
- **Missing:** (1) My S3 ledger-lie needs a third meter segment — the **recovered 9.8 ghost reserve** as a hatched amber segment distinct from remaining reserve; add to M5's Δv gauge spec. (2) The lock-reason affordance: M5 must spec how locked controls render and how their lock reason surfaces on **tap** (not hover) — my gating behavior requires it ("REQUIRES L2 — resolve the record conflicts in S1"). (3) Adopt M2's shared LineStyle module (see M2 critique) — M5 owns the tokens.
- **Contradicts canon:** Nothing. M5's color/deep-variant system already satisfies the contrast rules my meters need.

---

## 2. REVISION OF YOUR PROPOSAL (changed sections only)

### §1 SCREEN MAP — REVISED to 11 scenes (resolves B5/B11, C6)
Old S-1→S-10 + S-8F is replaced by **S-1→S-11, one screen per canon scene**. S-8F ("THE RECKONING") becomes an **internal fail state of Scene 8**, not a numbered screen. Corrected scene↔screen mapping (every M4 scene-commit maps to exactly one screen):

| Scene | Title | Screen | Sim / interaction home | Reader COMMIT |
|---|---|---|---|---|
| 1 | THE FILE | S-1 THE FILE | case-file folder UI | break seal → **L1** |
| 2 | THE MOON | S-2 SATURN APPROACH | S1 timeline embedded; pin-drop | drop pin (S1 analysis flag) |
| 3 | THE MACHINE | S-3 SIM SELECTOR | five sim cards; S3 Δv focus; heist-engine allocation = scene interaction on S3 | allocate burn budget (scene interaction) |
| 4 | THE FIRST LIE | S-4 THE FIRST LIE | He-3 worksheet = scene interaction; S2 sandbox unlocked | worksheet balance attempt → **L2** |
| 5 | THE CASCADE | S-5 THE CASCADE | S2+S3 embedded; cascade chain = scene interaction | acknowledge cascade |
| 6 | THREE TRILLION DOORS | S-6 BILLIARDS | B-1→B-5 wizard | ACCEPT shot → **L3** (+FORBIDDEN unlock) |
| 7 | THE SHEPHERDS | S-7 THE SHEPHERDS | S5 shepherd sim + trust vote | trust vote |
| 8 | THE SLIP | S-8 THE SLIP | S5 slip-window traces + S1; **fail state lives here** (rewind → checkpoint, restart → RUN #N+1) | hidden-burn toggle discovery |
| 9 | EARTH, SOMEHOW | S-9 ARRIVAL | S4 recall + S3 return ledger; ±30-day arrival check | ledger sign-off |
| 10 | THE HEARING | S-10 THE HEARING | replay console; TESTIFY per exhibit | DEFEND/CONDEMN per exhibit → verdict |
| 11 | DECLASSIFIED | S-11 DECLASSIFIED | Core C-1→C-2 burn console; S4-returns-altered cold open (canon) | TAKE IT / LEAVE IT / LISTEN → **L4** |

Notes: (a) Scene 6's primary sim is **Billiards** (per M4 + billiards-spec canon); the sim-spec's parenthetical "(S4)" for Scene 6 is superseded — S4 stays hub-playable (Scene 3) and returns altered in Scene 11 (canon). (b) Sims unlock by clearance (L0: S1–S3; L1: +S4; L2: +S5), are rehearsal tools, and stay replayable from the Archive after first completion; "all five complete" is **not** a spine gate — the spine is linear, sims are preparation. (c) Billiards (B-1→B-5), Core (C-1→C-2), Archive (A-0→A-5) sub-screens: **UNCHANGED** in structure, renumbered parents only.

### §2 SIM INTERACTION SPECS — changed sims only
- **S2:** ADD rail telemetry readout: live valid band (1.10–1.30 R_J nominal, shrinking with `missionDay`) + capture-error % + Δv correction cost. The ±5,000 km clamp, rehearsal-vs-real-commit rule, MARGINAL/SUCCESS/FAIL bands: UNCHANGED.
- **S3:** ADD (1) ghost-reserve segment on the meter (hatched amber, needs M5 token) once RECONCILE unlocks; (2) a listed-but-locked ledger row "ABSOLUTELY DO NOT USE THIS FUEL" (canon gag, lock reason shown). Reported 14.2 / recovered 9.8 / reconcile-at-L2: UNCHANGED.
- **S4:** ADD an explicit **P(success) readout** in the rail, including the `projectedEarthReserve < 0 → P = 0` state ("ARGUS ASSESSMENT: 0% — RESERVE NEGATIVE"). Progressive reveal, tap tags, 2-comparison completion: UNCHANGED.
- **S5 — REVISED per canon:** 5–7 asteroids on screen; the **3 shepherd moons are nudgeable** (drag arrows or −/+ steppers), the rest are corridor context. **Impulse budget meter: 100 units** (canon); every nudge deducts. **Win = 3 corrections + corridor held 10 s + impulse < 100.** Fail = timer expires (unchanged economy: retry costs TIME; 3rd fail → half discount + TRUST −10 on the 0–100 scale). STEP MODE (12 × 5 s, win needs 2 consecutive in-band steps): UNCHANGED, and it must work identically in M2's mobile SVG tier. Final-10 s arrow lock: UNCHANGED.
- **S1, Billiards, Core:** UNCHANGED except TRUST figures ×10 (see §3) and standardized `NO DATA — SUBJECT DECLINED.` phrasing.

### §3 RESOURCE ECONOMY — REVISED scales (resolves B2, B3)
- **TRUST is 0–100, starts at 50** (accept C3). Conversion: every Round 1 TRUST delta ×10. Revised matrix deltas: S1 complete **+10**; S1 skip conflicts **−20**; S2 MARGINAL **−10**; S4 two comparisons **+10**; S5 third-fail partial **−10**; Gary belief pair **±10**; C-1 ICE-0 jury-rig **−20**; S-9 redaction **−20** each; S-9 exhibit-matches-archive **+20**; FORBIDDEN SHOT use **−20**. Gates: **L4 requires TRUST ≥ 40**; **FORBIDDEN SHOT requires trust ≥ 60** (M1) — first-run arc: complete S1 (+10) → 60 → eligible. TRUST 0 = soft fail (Dotty hints stop, verdict caps at SEALED): UNCHANGED.
- **TIME is the 120-day contingency reserve** (accept C4 with this definition): `STEAL.time = { missionDay (0→4200 canon clock, narrative; drives S2 band shrink and S1 timeline), contingencyLeft (120 → 0, the spendable TIME) }`. Displayed TIME = `contingencyLeft`. TIME ≤ 0 → "WINDOW CLOSED" run fail (→ Scene 8 fail state). All Round 1 TIME costs (−5d S2 COMMIT, −3d ADJUST, etc.): UNCHANGED.
- Δv 35.0 km/s, ledger-lie mechanic, fail states: UNCHANGED.

### §4 RUN ARCHIVE & REPLAY — revised fields + (b) localStorage verdict
- RUN #N JSON: ADD `clearance_at_win` and `verdict` (`VINDICATED`/`SEALED`/`CONDEMNED`) fields. Decisions+seed-only storage, one-second scrubber (timing axis only), branch → RUN #N+1, S-10 exhibits pull live numbers: UNCHANGED.
- **(b) localStorage: CONFIRMED as THE persistence layer (accept C7).** Single namespaced key `stealthemoon.v1` holding `{ schemaVersion: 1, STEAL, runs[], codex, clearance }`; M1's schema validator runs on load; corrupt/old data → migrate-or-reset with a "ARCHIVE DAMAGED — STARTED NEW FILE" card (never a dead end). Quota: try/catch on write; on `QuotaExceededError` drop oldest non-current runs first, always keep current run + clearance + codex; if still failing, continue session-only with a visible "ARCHIVE NOT SAVING" badge.

### §5 DECLASSIFICATION GATING — REVISED unified earning table (resolves B12)
Action-gated, never time-gated; clearance is the player's, persists across runs in the same browser.

| Level | Narrative name (M4) | Granted by (action) | Mechanically reveals |
|---|---|---|---|
| L0 | SEALED | start | S1–S3, Conventional tier, public codex |
| L1 | UNSEALED | break the S1 seal (Scene 1 commit) | S4, Fission tier, Gary records, Atlas chain viewer |
| L2 | LEAKED | resolve both S1 conflicts + commit S2 rehearsal (the worksheet numbers "leak" in Scene 4) | S5, **S3 RECONCILE**, Fusion tier, buried-charge depth selector |
| L3 | SECRET | ACCEPT a billiards shot (Scene 6) | **FORBIDDEN SHOT** (1 use, trust ≥ 60), S-10 exhibit preview, secret codex |
| L4 | COMPLICATED | reach Scene 11 with TRUST ≥ 40 | Core EXPOSURE meter revealed (accrued blind before), LISTEN prerequisites shown, top-secret codex |
| FINAL CANON | — | win a run (CAPTURED) with verdict VINDICATED at L4 | S-11 full canon browser, gold "true" trajectory in S2, new-run+ |

Locked controls show lock reasons on hover *and* tap; locked codex entries render as redaction bars, never hidden text: UNCHANGED.

### §6 MOBILE INTERACTION STORY — REVISED contract (resolves B6, accept C8)
**Canvas is display-only on mobile. Every sim input is a DOM control.** OrbitControls is desktop-only; on mobile it stays detached in all modes (M2's FLYBY/CLOUD/SHEPHERD/BILLIARDS/CORE attachments are desktop-only). Concretely: S2 aim = steppers + numeric field bound to M2's mobile SVG sandbox (±5,000 km clamp, `aimKm` event contract); S5 = tap arrows with 44 px handles or steppers, STEP MODE fully supported in the SVG tier; S4 = tap points (overlay DOM, so taps never touch the canvas); B-3 dial/sliders = native inputs; the 0.5 s freeze is input-lock, identical on touch. Desktop ≥1024 px keeps drag + OrbitControls where M2 attaches them. Reduced-motion: M5's STATIC plates; every timed moment has its stepped path — no dead ends. Nothing else in §6 changes.

### §7 RISKS — one addition
R1–R3: UNCHANGED. **ADD R4 — commit during GPU context loss:** M2 exposes `contextHealthy`; while false, all commit buttons (S2 COMMIT, B-4 SIMULATE, C-2 choices, seal-breaks) disable with reason "TAPESTRY PAUSED — RESTORING." No commit is ever silently dropped.

### Open question (a): S-10/S-11 verdict — FINAL CALL: yes, mechanical teeth
The verdict is computed from the hearing, not decorative. Per exhibit: DEFEND or CONDEMN (+ optional free text, M4). Verdict classes:
- **VINDICATED:** majority DEFEND, books reconciled (or lie never taken), TRUST ≥ 40 → unlocks FINAL CANON eligibility; new-run+: +10 TRUST, keep reconciled ledger, keep codex.
- **SEALED:** mixed record, or TRUST < 40, or >2 sims skipped → story complete, FINAL CANON locked; new-run+: keep codex only.
- **CONDEMNED:** majority CONDEMN, or unreconciled books exhibited → FINAL CANON locked; next run: ghost reserve locked for RUN #N+1, TRUST starts at 40, Dotty redactions worsen one cosmetic tier.
The verdict is stamped on the RUN archive card and read aloud by the tribunal with the player's real numbers. TRUST-spend-to-redact (−20 each) remains the hearing's resource lever.

---

## 3. CHECKLIST VOTES

- **C1 — ACCEPT.** STEAL per M1's schema; seed fixed to a valid uint32 (41770); trust/time scales resolved per C3/C4 as revised above.
- **C2 — ACCEPT 0.186.0.** M2 verified it as the current stable line (Sept 2026); npm lockfile + jsdelivr importmap fallback. Determinism doesn't depend on the pin, currency does.
- **C3 — ACCEPT TRUST 0–100, starts 50.** My deltas convert ×10 cleanly; the S1-complete (+10) → FORBIDDEN-eligible (≥60) arc is a better first-run tutorial than my old scale.
- **C4 — ACCEPT with amendment.** TIME = 120 d contingency reserve (`contingencyLeft`, spendable, fail at ≤ 0); `missionDay` 0→4200 is the separate canon clock driving S2 band shrink/S1 timeline. One display, two fields, no ambiguity.
- **C5 — ACCEPT.** Canon sim definitions are FIXED (S1 timeline / S2 flyby / S3 meter / S4 cloud / S5 shepherd). M4's worksheet/cascade/slip-window/checksum/hidden-burn are scene interactions, never renames.
- **C6 — ACCEPT.** 11 scenes ↔ S-1→S-11; old S-8F becomes Scene 8's internal fail state.
- **C7 — ACCEPT.** localStorage is THE layer: `stealthemoon.v1`, versioned, schema-validated on load, quota fallback specified.
- **C8 — ACCEPT.** Mobile: canvas display-only, all inputs DOM, OrbitControls desktop-only. S4 overlay taps are DOM, consistent.
- **C9 — ACCEPT.** Build-time PNGs primary (M5), runtime re-capture is the dev/QA tool (M2), sidecar JSON ships with every still.
- **C10 — ACCEPT.** 41×41 runtime LUT from the closed-form seeded formula, with the diegetic footnote "declassified targeting approximation." No interaction change (±5,000 km clamp stands).

---

## 4. STILL MISSING (interaction domain)

1. **Billiards coach copy ownership.** B-1's 3-step coach overlay is spec'd; the words belong to M4 (story), the dismissal wiring to M3. Unassigned — assign in build.
2. **Reduced-motion onboarding.** The global toggle lives in archive chrome (M3) with M5 styling, but the first-run `prefers-reduced-motion` auto-prompt is undesigned. Needs one dismissible card, once.
3. **S2 valid-band data contract.** S2's rail needs `bandWidth(missionDay)` from M1 — function signature unagreed. Propose: `STEAL` exposes `s2.validBandRp` recomputed by `recompute(STEAL)`; my rail reads it.
4. **Scrubber determinism contract.** The A-2 one-second scrubber varies the timing axis only; M1 must expose a seeded `outcomeAtSecond(planHash, second)` — unconfirmed. Without it the scrubber is a mock.
5. **Commit-during-context-loss wiring.** M2 must expose `contextHealthy`; M3 disables commits on it (R4). Agreed in principle, unwired.
6. **Keyboard tab order + live regions.** B-1→B-5 wizard and S5 STEP MODE need a defined keyboard-only path; PREDICTED→OBSERVED transitions need an `aria-live` rail region. Spec'd nowhere — M3 will define, M5 styles.
7. **Lock-reason tap pattern.** M5 must spec the visual + tap behavior for locked controls (my gating requires it on touch). Currently hover-only in M5's draft.
8. **Skipped-sim economy edge.** If a player skips S2 entirely (no rehearsal), the S-6… (Scene 9) arrival check and S-10 exhibits still function via `NO DATA — SUBJECT DECLINED.` — confirmed working, but the **S-6 real burn with zero rehearsals** needs an explicit difficulty note: first COMMIT without rehearsal costs double TIME (−10 d). Undecided — flag for Round 3.
9. **Clearance vs verdict on the archive card.** RUN card must show both `clearance_at_win` and `verdict` — fields added (§4); M5's card layout must fit both stamps.
10. **M4's ARTIFACT admit-or-suppress stakes.** Scene 10 choice needs explicit mechanical costs from M4 before I can wire the commit buttons. Currently unwirable.
