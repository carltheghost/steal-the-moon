# MASTER 4 (storytelling) — Round 3 ratification ballot

Date: 2026-09-19. Scope: F1, F2, F4, F5, F9, F11, F14 only. Verdicts: SIGN OFF or BLOCK + concrete alternative. No settled items reopened.

## Verdicts

**F1 — Fail branch: SIGN OFF.**
S-8F as Scene 8's fail branch works on story terms: Scene 8 THE SLIP is the buried-charge/drill scene, so a drill-gone-wrong RECKONING is the natural consequence beat. Scene 9's arrival fail as a scene-level setback (−10d, rewind to checkpoint) preserves the inevitability of "EARTH, SOMEHOW" — arrival isn't in question, only the cost. Also signs off on the "Scene N = canon numbering" mandate (my shipping-hazard fix, adopted).

**F2 — Verdict classes: SIGN OFF.**
VINDICATED / SEALED / CONDEMNED accepted. CONDEMNED carries more weight than my CENSURED; SEALED is the shared middle; the register is consistent. ARTIFACT ADMIT/SUPPRESS folded into the Scene 10 commit preserves my mechanic intact.

**F4 — L4 + Core placement: BLOCK.**
Alternative: (1) EXPOSURE meter revealed at completion of the Scene 8 C-1 drills — **untrustgated**; the drills are the accrual event and the reveal is its narrative payoff. (2) Full L4 (LISTEN prerequisites + top-secret codex) stays gated at Scene 11 with TRUST ≥ 40 (M3's gate intact). (3) C-2 choice at Scene 11 with the meter already known.
Rationale: revealing the meter in the same scene as the final choice compresses revelation into decision — the player gets no time to carry the knowledge through Scenes 9–10. Worse, a player reaching Scene 11 with TRUST < 40 would never see the meter at all despite accruing it blind through Scene 8 — a dead narrative thread. This preserves the fiat's stated rationale (reveal must precede the choice), my drills-at-8, and M3's TRUST ≥ 40 gate and choice-at-11.

**F5 — S-3 demoted to Archive drawer: SIGN OFF.**
Scene 3 THE MACHINE keeps the S3 ledger + helium-3 worksheet + Gary BELIEVE-2 + burn-budget allocation as its spine interaction; the five-sim card hub lives in the Archive drawer (A-0), reachable from anywhere. The "worksheet refuses to balance" beat stays where the story needs it.

**F9 — Time fields + narrative schema fields: SIGN OFF / CONFIRM.**
`reveal{}`, `hearing{testimony[], verdict}`, `voss{insertsPlanted, insertsSeen}`, `s4.displayCounter`, `traces{renFound}`, `dotty{fragmentsFound}` are adopted into STEAL schema v2 as merged in §3. M4 confirms.

**F11 — Declass table: SIGN OFF.**
Level names (PUBLIC / UNSEALED / LEAKED / CORRECTED / COMPLICATED / CANON) and −5 TRUST per grant kept. My L1 alternative ("complete any 2 sims") is withdrawn — the seal ritual is the cleaner inciting incident, and "sims are rehearsal tools, never gated" is settled. The fiat's seal-break L1 gate stands.

**F14 — Plate furniture: SIGN OFF / CONFIRM feed contract.**
M5 owns the DOM `plate-frame`; M4 feeds the gag slots `#seal`, `#moon-status`, `#corrections-counter`, `.insert-voss`, `.canon-reader-record`. M4 confirms the feed direction and retains copy ownership of slot content.

## Notes (non-blocking)

1. **F1:** S-8F copy must tie the fail to the drill/charge failure specifically, not a generic crash; Scene 9 setback copy should frame the rewind as "the approach holds, the margin doesn't."
2. **F2:** The ARTIFACT admit/suppress mechanical stakes must be legible in copy at the Scene 10 commit moment — the player needs to know what each does to the record before choosing.
3. **F5:** Gary records moved from M3's S-5 function — they must be re-voiced by M4 (Gary's BELIEVE-2 register) in build.
4. **F9:** `hearing.testimony[]` entries must key back to specific scene interactions so the Scene 10 replay console can quote the player's own record.
5. **F11:** Seal-break copy must land the irrevocability — one-time, witnessed (Dotty witnesses).
6. **F14:** M4+M5 to fix a per-slot payload contract in build: which STEAL fields each gag slot reads, so M5 can style without touching story logic. `.insert-voss` never renders inside `.pov-voss` (settled); the absence in Scene 10 remains the tell.
