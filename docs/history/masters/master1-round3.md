# MASTER 1 (orbital / geophysics) — Round 3 ratification

Per-fiat verdicts. SIGN OFF / BLOCK only; settled items not reopened.

## F3 — Storage keys: SIGN OFF
`stm.steal.v2` / `stm.runs.v1` / `stm.clearance.v1`. This was my Round 2 vote; the quota/fresh-load behavior described (try/catch, drop oldest non-current runs, "ARCHIVE NOT SAVING" badge) is compatible with determinism: runs archive stores decisions + seed only, and any seed replays identically under schema v2. No physics dependency.

## F7 — Seed 0x5EA17: SIGN OFF
Valid uint32, mine to own. LUT seed `0xC0FFEE` canon-fixed stays distinct from run seed — two seeds, two purposes, never conflated (mirrors the two-clocks rule from §2).

## F8 — S5 win = canon: SIGN OFF (accept the rejection)
I accept the rejection of my "all 6 hold resonance bands" restatement. C5 fixed the canon S1–S5 definitions unanimously; canon's "3 corrections + corridor held 10 s + impulse < 100" stands, and blocking it would reopen C5. Physics support is already in place: `s5Step`/`s5StateAt` are seeded and deterministic, `STEAL.s5` carries `{impulseUsed, corrections}` (§3), and the 100-unit impulse budget meter + corridor-hold 10 s timing both read from those same pure functions — no private sim state needed. 3 nudgeable shepherds + 3 corridor-context bodies from `STEAL.config.shepherdN` matches the 6-body chain.json split.

## F9 — Narrative fields in STEAL schema: CONFIRM / SIGN OFF
`reveal{}` / `hearing{}` / `voss{}` / `s4.displayCounter` / `traces{}` / `dotty{}` will be present in the build schema as shown in §3. No collision with physics fields. `s4.displayCounter` is display-only (the gag string "3,847,221,004,913,882"); the actual S4 probability math still flows through `s4Ghosts`/`s4Compare` — the counter never feeds a formula. Single derived value `timeLeft = marginDays − spentDays`; `contingencyLeft`/`timeMargin` remain aliases, not separate fields.

## F10 — Sim API as anti-rename contract: SIGN OFF
My §2 list (`s1PathAt, s2Outcome, s2PathFor, s3Band, s4Ghosts, s4Compare, s5Step, s5StateAt, billiardsSimulate, coreBurn, reconcileLedger, resetSim, stillStateHash, displayTransform`) is adopted as the contract. M2/M5/M4 call these; no reimplementation. M2's aim sprite writing `STEAL.trajectory.aimDx/aimDy` and reading back via `recompute(STEAL)` is the correct pattern — no private copies.

## F4 — C-1 drills at Scene 8 / C-2 choice at Scene 11: SIGN OFF
The physics callables support the split as specified:
- **Scene 8 (drills):** `slipModel` is read-only — a pure function of core slip state. Drills accruing exposure *blind* is enforced at the interaction layer (meter reveal is Scene 11's L4 gate), not in physics: the slip model never writes exposure counters, so read-only calls at Scene 8 cannot leak the meter.
- **Scene 11 (finale):** `coreBurn` is the mutating burn executor called by "IGNITE FINAL BURN" for the C-2 TAKE IT / LEAVE IT / LISTEN choice.
- Buried-charge depth split (fracture `p_f(d)=1−exp(−d/ρ)` vs slip coupling `σ_slip(d)=σ₀·exp(−d/σ_d)`) applies at both sites: drills at 8 feed slip state that `coreBurn` at 11 consumes.

## Notes (non-blocking)
1. `slipModel` is referenced by F4 but is not named in the §2 anti-rename list. Add it to the contract in build as a pure read-only function (suggested name `slipRead`/`slipModel`), same purity rules as the rest. This is a build-phase addition, not a fiat change.
2. §6.5 `outcomeAtSecond(planHash, second)` for the A-2 scrubber: confirmed as a seeded timing-axis function from the billiards cascade; I will expose it in build alongside `billiardsSimulate`.
3. S2 valid-band shrink (§6.4): `recompute(STEAL)` exposes `s2.validBandRp` from elapsed *mission* time only — already consistent with the two-clocks rule; no change.
