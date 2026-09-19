# MASTER 3 (INTERACTION / GAME DESIGN) — ROUND 3 RATIFICATION

## FIAT VERDICTS

**F1 — S-8F = Scene 8's fail branch: SIGN OFF.** Matches my Round 2 vote; my commit wiring already treats it as an internal fail state (rewind → checkpoint, restart → RUN #N+1), not a screen.

**F2 — Verdict classes VINDICATED / SEALED / CONDEMNED + new-run+ table: SIGN OFF.** My names, my open question (a) teeth. Scene 10 wiring (per-exhibit DEFEND/CONDEMN + free text + ARTIFACT ADMIT/SUPPRESS) is mine to wire; ARTIFACT stakes now mechanically anchored.

**F4 — L4 grant at Scene 11 arrival (TRUST ≥ 40) + C-1 drills at Scene 8 + C-2 at Scene 11: SIGN OFF.** My commit wiring works with the split: drills at 8 accrue `core.exposure` blind; the Scene 11 arrival grant reveals the EXPOSURE meter + LISTEN prerequisites + top-secret codex; then C-2 choice (TAKE IT / LEAVE IT / LISTEN) → IGNITE FINAL BURN. Ordering preserved: accrual → reveal → choice → ignite. S-8F checkpoints drill data so a fail doesn't wipe the accrual the Scene 11 reveal depends on.

**F5 — S-3 "sim selector" spine screen demoted to Archive drawer A-0: SIGN OFF.** My S-3 hub card was a navigation entry point, not a mechanic: sims unlock by clearance (F11), stay replayable from the Archive, and "all five complete" is not a spine gate, so nothing mechanical depended on the spine screen. Scene 3's allocation commit (scene interaction on S3) is untouched; Gary records land in Scene 3 either way. The hub function survives — the drawer is reachable from anywhere.

**F6 — B-1→B-5 wizard + S4 comparisons co-host Scene 6, ACCEPT SHOT grants L3: SIGN OFF.** Mine; "THREE TRILLION DOORS. PICK ONE." is the right home.

**F9 — Time aliases: SIGN OFF.** My rail's displayed TIME resolves to the single derived `timeLeft = marginDays − spentDays` (read via `recompute(STEAL)`); `contingencyLeft`/`timeMargin` are aliases of that getter, never stored fields. One source of truth; no interaction change.

**F11 — Declass table (my schedule + M4's names + −5 TRUST/level): SIGN OFF.** Economy balances. Grants cost −20 total (L1–L4); floor after grants = 30. VINDICATED's TRUST ≥ 40 floor is reachable on a clean run (start 50 + S1 complete +10 − 20 = 40). M4's "PUBLIC" for L0 is a genuine improvement — it kills the L0-SEALED/verdict-SEALED name collision. Names otherwise adopted cleanly.

**F12 — Unrehearsed COMMIT surcharge +10d spentDays: SIGN OFF.** My open question, adopted. Tutorializes rehearsal at the commit point where it matters.

No blocking objections. No settled items reopened.

## NOTES (non-blocking)

1. **F11 tightening:** the −5/level costs supersede my Round 2 "complete S1 (+10) → 60 → FORBIDDEN-eligible" arc. Diligent first-run path to FORBIDDEN SHOT (trust ≥ 60 at L3): S1 complete (+10) + S4 two comparisons (+10) + one more positive delta (Gary belief pair or exhibit-matches-archive). Recommend the Scene 6 lock reason surface this ("REQUIRES TRUST 60 — the shot demands it"), per my lock-reason grammar.
2. **F4 wiring detail:** C-1 drills at Scene 8 must write `core.exposure` to the same accumulator the Scene 11 L4 reveal reads; the meter must not render pre-reveal (blind accrual). Drill checkpoints persist before any S-8F rewind point.
3. **F9 wiring detail:** aliases must resolve through the same derived getter so the rail, S2 band-shrink readout, and TIME ≤ 0 fail check can never disagree.
4. **F5 fallout:** the Archive drawer A-0 hub now carries clearance-gated sim cards, so it inherits the lock-reason tap pattern spec (my §6 still-missing #7 — M5 owes the tap behavior).
