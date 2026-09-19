# MASTER 3 — INTERACTION / GAME DESIGN: "Steal the Moon"

Free/open-source only: vanilla JS + canvas, client-side, deterministic seeded state, one static page. No rendering internals, no physics math, no narrative prose — this document owns screens, inputs, states, and rules.

---

## 1. SCREEN MAP

**Navigation model: linear chapters + free-roam Archive.** The story spine is linear (Scene 1 → 11, gates onward movement only at hard win conditions). At any time, the player can open the ARCHIVE (Esc / tab) — a hub containing: Run Archive, Codex (declassified records), Atlas (moons/canon browser), Glossary of clearance terms. Archive screens are read-mostly + replay; they never advance the story but can trigger replays that branch. Exiting Archive returns to the exact screen/state left. Scene map below: every screen reachable via spine, Archive hub, or both.

### Story screens (linear spine)

| # | Screen | Purpose | Entry | Exit |
|---|--------|---------|-------|------|
| S-1 | THE FILE | Landing: case-file cover, clearance application, "BEGIN INVESTIGATION" | Page load | Enter → S-2 |
| S-2 | SATURN APPROACH | Establish departure (246 mi), first Dotty narration, unlock Archive tab | S-1 | → S-3 |
| S-3 | THE FIVE SIMS / Sim selector | Hub-of-sims: five sim cards with lock states, TIME/Δv/TRUST meters visible | S-2 | Enter sim → Sx; all five complete → S-4 |
| S-4 | SATURN BILLIARDS | Shot planner (ball selection → lineup → simulate → cascade), repeated until Saturn→Jupiter link solved | S-3 | Link solved → S-5; abort → back to S-3 |
| S-5 | THE LONG COAST | Interstitial: 4,200-day cruise summary, S1 scrubbable timeline embedded, Gary's 3 conflicting records presented | S-4 | Player picks which 2 records to believe → S-6 |
| S-6 | JUPITER FLYBY | S2 sandbox lives here in-story; COMMIT BURN is the narrative gate | S-5 | Burn committed & capture error <0.5% → S-7; else stay (retry allowed, costs TIME) |
| S-7 | CORE DRILL | S-core burn console; ICE/SLIP/PROXIMITY meters; final TAKE IT / LEAVE IT / LISTEN choice | S-6 | Choice made → S-8 |
| S-8 | EARTH CAPTURE | Arrival check: ±30 days window, reserve positive → captured; else failure branch | S-7 | Success → S-9; failure → S-8F |
| S-8F | THE RECKONING (fail) | Failure debrief, option to rewind to checkpoint or restart run | S-8 | Rewind → S-4/S-6/S-7 checkpoint; restart → S-1 new RUN #N |
| S-9 | THE HEARING | Replays player's actual S2/S3 results as Exhibit 42B; TRUST spend decisions; verdict | S-8 | Verdict → S-10 |
| S-10 | DECLASSIFIED | L4/FINAL CANON content, full file unlock, credits, "new run+" prompt | S-9 | → Archive or new RUN #N |

### Sim screens (launched from S-3, also embedded in S-5/S-6)

| Screen | Purpose | Entry | Exit |
|--------|---------|-------|------|
| SIM-S1 | Timeline scrubber: 4,200-day route, play/pause, 0.25/1/4/16×, event cards, RECORD CONFLICT freeze | S-3 card, S-5 embedded | Close → return; "analysis complete" flag when all 6 event cards viewed |
| SIM-S2 | Flyby sandbox: drag aim marker ±5,000 km, COMMIT BURN / RESET, archive cyan vs player amber trajectories | S-3 card, S-6 embedded | COMMIT → locks result into run record |
| SIM-S3 | Δv meter: NOMINAL→UNCOMFORTABLE→OH→OH NO→EXHAUSTED ladder, spend actions, rewind checkpoints | S-3 card | Close → return; checkpoints saved |
| SIM-S4 | Probability cloud: progressive reveal, hover/tap rejection tags, click-to-compare two outcomes | S-3 card | "Comparison logged" after 2 comparisons → complete |
| SIM-S5 | Shepherd mini-game: drag velocity arrows on 3 shepherd bodies, 60s choreography, win/fail | S-3 card | Win → unlocks "shepherd assist" bonus (−Δv cost on S-6 burn); fail → retry |

### Billiards screens (sub-screens of S-4, stepped wizard)

| Screen | Purpose | Entry | Exit |
|--------|---------|-------|------|
| B-1 OBSERVE | Field of 293 moons; filter 293→24 by sortable columns (mass, orbit, resonance); click to shortlist | S-4 | ≥1 shortlisted → B-2 |
| B-2 CHOOSE THE BALL | Shortlist detail cards; pick exactly one moon | B-1 | Pick → B-3 |
| B-3 LINE UP THE SHOT | Approach vector dial, timing slider, standoff distance, impulse tier selector (conventional/fission/fusion/FORBIDDEN), torch correction toggle, confidence readout; buried-charge depth 2/7/17/25 mi | B-2 | All fields valid → B-4 |
| B-4 SIMULATE | PREDICTED overlay → 0.5s encounter freeze → OBSERVED result | B-3 | → B-5 |
| B-5 CASCADE REPORT | Outcome %, momentum transfer, miss distance, next-link error; accept or adjust | B-4 | Accept → link solved → S-5; Adjust → B-3 (costs TIME) |

### Core screens (sub-screens of S-7)

| Screen | Purpose | Entry | Exit |
|--------|---------|-------|------|
| C-1 BURN CONSOLE | Three coupled meters (ICE RESERVE / SLIP INTEGRITY / CORE PROXIMITY + CORE EXPOSURE sub-meter); burn table actions: Conservative / Hard / Emergency (−ice, +progress, +slip) | S-7 | Progress 100% → C-2 |
| C-2 FINAL CHOICE | TAKE IT / LEAVE IT / LISTEN — three large commit buttons, each with listed cost | C-1 | Commit → S-8 |

### Archive hub (Esc anytime; read + replay)

| Screen | Purpose | Entry | Exit |
|--------|---------|-------|------|
| A-0 ARCHIVE INDEX | Tabs: Runs / Codex / Atlas / Clearance | Esc or Archive tab | Esc → resume |
| A-1 RUN ARCHIVE | List of RUN #N objects; select → replay viewer with one-second scrubber | A-0 | Launch replay → A-2 |
| A-2 REPLAY VIEWER | "SAME PLAN. DIFFERENT SECOND. DIFFERENT HISTORY." scrubber; branch-from-second button | A-1 | Branch → creates RUN #N+1 at chosen second → S-4 |
| A-3 CODEX | Declassified records browser; entries gated by clearance L0–L4 | A-0 | — |
| A-4 ATLAS | moons.json browser: all 293 moons, filterable; canon.json/chain.json chain viewer | A-0 | Selecting moon in Atlas → can "import" as B-1 shortlist seed |
| A-5 CLEARANCE | Declassification ladder L0–L4 + FINAL CANON status, what unlocked each | A-0 | — |

**Reachability guarantee:** spine screens advance linearly; sim screens via S-3 cards or story embeds; billiards/core sub-screens via wizard flow; archive screens via Esc from anywhere (except during the 0.5s freeze and S5's 60s run, where Esc pauses first). A "YOU ARE HERE" breadcrumb on every screen shows spine position.

---

## 2. SIM INTERACTION SPECS

Global sim rules: all sims read/write the seeded run state; no sim grants free momentum — every Δv change routes through the S3 ledger; every sim is pausable; every timed moment has a reduced-motion/stepped alternative (see §6).

### S1 — Scrubbable timeline
- **Controls:** Play/Pause (Space), speed 0.25/1/4/16× (keys 1–4), scrubber drag (0–4,200 days), ←/→ step ±10 days (Shift = ±100), event markers clickable.
- **Feedback:** Event cards slide in at markers (6 total: departure, 3 assists, Jupiter flyby, Earth capture window). Scrubbing shows day counter + position readout.
- **RECORD CONFLICT freeze:** at 2 scripted days the timeline halts, screen desaturates, two contradictory record cards appear; player must pick "ACCEPT A" / "ACCEPT B" / "FLAG BOTH" to resume. Choice is logged to run record and affects TRUST (±).
- **Win/partial:** "analysis complete" when all 6 cards viewed AND both conflicts resolved. Cannot fail; can be skipped at cost of −TRUST (Dotty notes the gap in S-9 hearing).
- **Cannot:** change the timeline (read-only history), skip conflicts without penalty.

### S2 — Flyby sandbox
- **Controls:** Drag aim marker on approach plane (±5,000 km clamp — marker stops at edge, readout shows clamped value); COMMIT BURN (Enter), RESET (Backspace).
- **Feedback:** Two trajectories drawn: archive cyan (the "official" record) vs player amber (live from marker). Numeric readouts: capture error %, Δv cost of correction. Marker drag updates amber line live.
- **Win:** COMMIT with capture error <0.5% → success, result locked to run record, shown later in S-9 as Exhibit 42B. **Partial:** 0.5–2% → "MARGINAL": allowed to proceed but Earth capture window shrinks (±30 → ±15 days) and TRUST −1. **Fail:** >2% or RESET abuse (>5 resets) → must retry; each COMMIT attempt costs TIME.
- **Cannot:** place marker beyond ±5,000 km; commit twice (locked after commit until S-6 story gate re-opens for the real burn — sandbox commits are "rehearsals," only the S-6 commit counts).

### S3 — Δv meter
- **Controls:** Spend buttons (each sim action elsewhere deducts here), REWIND TO CHECKPOINT (checkpoints auto-saved at each scene entry; list selectable).
- **Feedback:** Vertical meter with five labeled bands: NOMINAL (35–25) → UNCOMFORTABLE (25–18) → OH (18–12) → OH NO (12–6) → EXHAUSTED (6–0), values in km/s of the 35.0 torch reserve. Band transitions trigger Dotty warning + screen-edge tint. **Ledger-lie mechanic:** meter shows *reported* 14.2 initially; a "RECONCILE" action (unlocked at L2) reveals *recovered* 9.8 — the missing 4.4 becomes a spendable "ghost reserve" with its own small meter, usable only for torch correction.
- **Win/partial/fail:** No win — it's a resource dial. **EXHAUSTED** = run fail unless ghost reserve covers the next mandatory burn, then "ON FUMES" partial state (all future spends ×2 TIME cost).
- **Cannot:** spend below 0 (buttons disable, "INSUFFICIENT Δv"); rewind past the most recent COMMIT (commits are permanent — stated in UI).

### S4 — Probability cloud
- **Controls:** "REVEAL" steps the cloud through 4 progressive densities; hover (desktop) / tap (mobile) a point → rejection tag ("rejected: miss distance", etc.); click two points → side-by-side compare panel.
- **Feedback:** Points fade as rejected; compare panel shows delta table of the two outcomes.
- **Complete:** after 2 comparisons logged → sim marked complete, unlocks "confidence" bonus (+1 TRUST, +5% confidence in B-3).
- **Cannot:** reject the player's own committed outcome (it's ringed, untouchable); cannot compare unrevealed points.

### S5 — Shepherd mini-game
- **Controls:** Drag velocity arrows on 3 shepherd moons (arrow length = Δv nudge, capped per-body); START CHOREOGRAPHY (60s); PAUSE.
- **Feedback:** Live resonance readout; shepherds drift; win when all 3 hold resonance bands for 10 consecutive seconds within the 60s.
- **Win:** "SHEPHERDS ALIGNED" → −Δv cost on the S-6 burn (discount applied in S3 ledger) + codex entry. **Fail:** timer expires → "SCATTERED": retry allowed, each retry costs TIME; 3rd fail auto-grants partial ("good enough" — half discount, TRUST −1).
- **Reduced-motion:** "STEP MODE" replaces 60s real-time with 12 discrete 5-second steps the player advances manually (see §6).
- **Cannot:** exceed per-body nudge caps; drag during the final 10s hold (arrows lock — "hands off, let it ring").

### Billiards shot planner (B-1 → B-5)
- **B-1:** Sortable table of 293 moons (mass, orbit radius, resonance flag); filters narrow to 24 candidates; click toggles shortlist (max 8).
- **B-2:** Shortlist cards with "draft" stats; SELECT one → locks ball.
- **B-3 controls:** Approach vector dial (0–360°, drag or arrow keys), timing slider (T−30d…T+30d), standoff distance (100–10,000 km), impulse tier radio: Conventional / Fission / Fusion / FORBIDDEN SHOT (redacted card — requires L3 clearance AND shows "1 AUTHORIZED USE" counter; selecting it spends the single use permanently for the run), torch correction toggle (only enabled if ghost reserve exists), buried-charge depth 2/7/17/25 mi (affects slip, not Δv — deeper = less slip, more TIME), confidence readout (computed, not editable).
- **B-4:** SIMULATE → "PREDICTED" ghost overlay 1.2s → 0.5s encounter freeze (all input locked, "HOLD" banner) → "OBSERVED" result animates in. Reduced-motion: freeze becomes a static "ENCOUNTER" card the player dismisses.
- **B-5 CASCADE REPORT:** outcome %, momentum transfer, miss distance, next-link error. ACCEPT (locks, costs the Δv shown) or ADJUST (→ B-3, costs TIME). **No free-momentum cheats:** every simulate consumes the listed Δv from S3; PREDICTED→OBSERVED delta is seeded — re-simulating the identical plan yields the identical result (deterministic; the replay scrubber's "different second" varies only the *timing slider*, which is the documented chaos lever).
- **No weapon-design detail:** impulse tiers show only yield class + Δv + slip cost; FORBIDDEN SHOT shows redacted bars, never mechanism.

### Core burn console (C-1 → C-2)
- **Meters:** ICE RESERVE (0–100), SLIP INTEGRITY (0–100, falling = danger), CORE PROXIMITY (0–100 progress), CORE EXPOSURE sub-meter (rises when PROXIMITY > 80 — risk dial).
- **Burn table (each action = one "shift"):** Conservative (−5 ice, +8 progress, +2 slip), Hard (−12 ice, +18 progress, +9 slip), Emergency (−25 ice, +35 progress, +25 slip). Cooldown: Emergency locks for 2 shifts after use.
- **Fail states:** ICE 0 → "DARK DRILL" (must spend TRUST 2 to jury-rig coolant or run fails); SLIP 100 → "SHEAR EVENT" (PROXIMITY −20, EXPOSURE spike); EXPOSURE 100 → forced LEAVE IT ending branch.
- **C-2 final choice:** TAKE IT (requires PROXIMITY 100; spends remaining ICE as bonus Δv), LEAVE IT (safe, −TRUST 1, no bonus), LISTEN (unlocked only if both Gary conflicts flagged in S-5 AND S1 conflicts resolved a certain way — grants L4 hint + small Δv bonus, costs TIME).
- **Cannot:** burn with ICE 0; pick LISTEN without its prerequisites (button shows lock reason).

---

## 3. RESOURCE ECONOMY

Three resources, always visible in the top bar (DOM, not canvas): **TIME** (days remaining of margin), **Δv** (km/s, via S3 meter), **TRUST** (0–10, Dotty/hearing currency).

**Starting values (RUN #1):** TIME 120 days margin · Δv 35.0 km/s torch reserve (meter *reports* 14.2 until reconciled) · TRUST 5.

### Earn / spend matrix

| Action | TIME | Δv | TRUST |
|--------|------|----|-------|
| S1 complete (all cards + conflicts) | — | — | +1 |
| S1 skip conflicts | — | — | −2 |
| S2 COMMIT attempt | −5d | — | — |
| S2 MARGINAL result (0.5–2%) | — | — | −1 |
| S2 RESET beyond 5 | −2d each | — | — |
| S4 two comparisons | — | — | +1 |
| S5 win | — | discount on S-6 burn | — |
| S5 fail ×3 → partial | −10d total | half discount | −1 |
| B-3→B-5 ADJUST loop | −3d each | — | — |
| B-5 ACCEPT | — | −(shot cost) | — |
| FORBIDDEN SHOT use | −15d | −(redacted, large) | −2 |
| Gary: believe any 2 records | — | — | ±1 by pair (shown upfront) |
| C-1 burns | −1d/shift | — | — |
| C-1 ICE 0 jury-rig | — | — | −2 |
| S-9 hearing: spend TRUST to redact | — | — | −2 per redaction |
| S-9 hearing: exhibit matches archive | — | — | +2 |

**Fail states:** TIME ≤ 0 → "WINDOW CLOSED" run fail (→ S-8F). Δv EXHAUSTED with mandatory burn unpaid → "DEAD STICK" run fail. TRUST 0 → Dotty stops volunteering hints and S-9 verdict caps at "sealed" (soft fail: story completable, FINAL CANON locked).

**The ledger lie, mechanically:** The S3 meter opens showing **14.2 km/s reported**. A "DISCREPANCY?" flag appears after the S-6 burn (actual spend doesn't match the books). At clearance L2, RECONCILE unlocks: meter splits into **reported 14.2 (spent down normally)** and **recovered 9.8 ghost reserve** — the lie made tangible. Ghost Δv can only fund torch correction (B-3 toggle) and S-6 margin top-ups; it cannot fund main burns. If the player never reconciles, the ghost 9.8 is simply absent — the run is harder, and S-9's hearing exhibits the unreconciled books as a TRUST −2 event. The lie is thus a difficulty lever the player controls, not a gotcha.

---

## 4. RUN ARCHIVE & REPLAY

**RUN #N object** (stored in localStorage, seeded, JSON-serializable):
```json
{
  "n": 3, "seed": 41770,
  "choices": { "s1_conflicts": ["A","FLAG"], "gary_beliefs": [0,2], "forbidden_used": false, "core_choice": "LISTEN" },
  "sims": {
    "s2": { "rehearsals": 4, "committed": {"aim_km": 1234, "capture_err_pct": 0.31, "verdict": "SUCCESS"} },
    "s3": { "checkpoints": [...], "reconciled": true, "ghost_spent": 1.2 },
    "s5": { "attempts": 2, "result": "WIN" }
  },
  "billiards": { "ball": "Mimas", "impulse": "fusion", "depth_mi": 17, "shots": [ {"plan_hash": "a91f", "second": 12, "outcome_pct": 87, "accepted": true} ] },
  "resources": { "time_left": 61, "dv_left": 6.4, "trust": 7 },
  "outcome": "CAPTURED|FAILED|SEALED", "arrival_delta_days": 12, "clearance": "L3"
}
```
Only *decisions + seed* are stored — trajectories are re-derived deterministically, so archives stay tiny.

**One-second scrubber (A-2):** For the accepted billiards shot, the scrubber replays the encounter ±30s around the committed second at 1s steps. Label: "SAME PLAN. DIFFERENT SECOND. DIFFERENT HISTORY." Scrubbing shows outcome % per second (seeded variance on the timing axis only — the documented chaos lever). **Branch:** "BRANCH FROM THIS SECOND" creates RUN #N+1 copying all choices up to B-3 with the new timing value, jumping the player to B-4. Original run is untouched.

**Scene 10 (S-9 THE HEARING) pull:** S-9 reads the *current* run object and renders: Exhibit 42B = the S2 committed aim/capture-error + S3 spend ledger (reconciled or not), Exhibit 43 = billiards plan hash + accepted outcome %, Exhibit 44 = Gary belief pair. The hearing's questions reference actual numbers ("You committed at +1,234 km with 0.31% error — the archive says +1,190"). If the player exhibits unreconciled books, the tribunal flags it. No mock data — if a sim was skipped, the exhibit reads "NO DATA — subject declined," with the TRUST consequence applied live.

---

## 5. DECLASSIFICATION GATING

Clearance is earned by *actions*, never by time. Ladder: **L0 PUBLIC → L1 RESTRICTED → L2 CONFIDENTIAL → L3 SECRET → L4 TOP SECRET → FINAL CANON.**

| Level | Granted by (action) | Mechanically reveals |
|-------|---------------------|----------------------|
| L0 | Start | S1–S3, billiards Conventional tier, codex public records |
| L1 | Complete any 2 sims | S4, Fission tier, Gary records (3 conflicting), Atlas chain viewer |
| L2 | Resolve both S1 conflicts + commit S2 rehearsal | S5, **S3 RECONCILE** (ledger lie becomes actionable), Fusion tier, buried-charge depth selector |
| L3 | Solve billiards link (ACCEPT a shot) | **FORBIDDEN SHOT** (1 authorized use, redacted card), S-9 hearing exhibits preview, codex secret records |
| L4 | Reach S-7 with TRUST ≥ 4 | Core EXPOSURE meter visible (hidden before — burns still accrue it blind), LISTEN prerequisites shown, codex top-secret records |
| FINAL CANON | Win a run (CAPTURED) with clearance L4 | S-10: full canon JSON browser, "true" trajectory overlay in S2 (archive cyan replaced by gold), new-run+ (carry +1 TRUST, keep codex) |

**Gating behavior:** locked controls show the lock reason on hover/tap ("REQUIRES L2 — resolve the record conflicts in S1"). Content gates are hard (no peeking via DOM — locked codex entries render as redaction bars, not hidden text). Clearance persists across runs in the same browser (it's the *player's* clearance, not the run's). FINAL CANON is per-run-win but once earned, stays earned.

---

## 6. MOBILE INTERACTION STORY

**Principle:** every drag has a tap/step equivalent; every hover becomes tap; every timed sequence has a stepped alternative. Layout: single-column, meters collapse to a top strip, canvas sims get a "controls below canvas" DOM panel (all inputs are real DOM controls — canvas is display-only, so touch targets are natively accessible).

| Desktop gesture | Mobile equivalent |
|-----------------|-------------------|
| Drag S2 aim marker | Drag on canvas (touch-action none on marker) **or** ±/∓ stepper buttons + numeric field (±5,000 km clamp shown) |
| S1 scrubber drag | Drag **or** ←/→ step buttons (±10d, long-press = ±100d) |
| B-3 approach vector dial drag | Dial drag **or** −/+ 5° steppers |
| Timing slider drag | Native range input (works on touch as-is) |
| S4 hover rejection tags | Tap point → tag appears; tap again → dismiss |
| S5 drag velocity arrows | Drag arrows (large 44px touch handles) **or** per-body −/+ nudge steppers |
| Keyboard (Space/←/→/Shift/Enter/Backspace/Esc) | On-screen transport bar during sims: ⏯ ◀ ▶ ✕ ⏎ equivalents; Esc = "ARCHIVE" button |

**S5 60s choreography on touch:** identical rules; arrows lock during final 10s hold with a "HANDS OFF" banner. **STEP MODE** (reduced-motion *or* player choice on mobile): 60s becomes 12 manual steps ("ADVANCE 5s" button); resonance checked per step; win needs 2 consecutive in-band steps. Same win/fail economy.

**0.5s encounter freeze on touch:** the freeze is input-lock, not timing-skill — on touch it behaves identically (0.5s, then OBSERVED). No dexterity required anywhere; nothing is lost by touch.

**Simplifications on small screens:** S1 event cards become bottom sheets; B-1's 293-row table becomes search + filter chips (no wide table); cascade report stacks vertically; the A-2 scrubber keeps 1s granularity but shows ±15s window with page arrows. Nothing mechanical is removed — only density.

**Reduced-motion (global toggle + prefers-reduced-motion):** all tweens become instant cuts; S5 defaults to STEP MODE; B-4 freeze becomes a dismissible "ENCOUNTER" card; S1 autoplay off (manual step only); confetti/win flourishes replaced by static stamps ("ALIGNED ✓"). Every timed/choreographed moment verified to have its stepped path — no dead ends with motion off.

---

## 7. TOP 3 RISKS

**R1 — Scope creep: 11 scenes × 5 sims × billiards × core × archive reads as 3 games.**
*Mitigation:* One interaction grammar reused everywhere — every sim is *set inputs → commit → observe → report → resource delta*. B-1→B-5 and C-1→C-2 are the same wizard skeleton as S2's aim→commit. Build the commit/report/resource-delta loop once as a shared module; sims differ only in their input widgets and seeded outcome tables. Cut line: no new mechanic after L2 — L3/L4 add *permissions* (tiers, reconcile), not new loops.

**R2 — Unwinnable states: EXHAUSTED Δv, TIME ≤ 0, TRUST 0, ICE 0 with no jury-rig.**
*Mitigation:* (a) Checkpoints auto-save at every scene entry and S3 exposes rewind to any checkpoint *before* the last COMMIT — unwinnable-by-math is always rewindable. (b) Fail states are *labeled before they happen*: meter bands, "this burn leaves you EXHAUSTED" confirm dialogs, TIME cost shown on every button that spends it. (c) S-8F fail screen always offers two exits (rewind / new run) — no dead screen. (d) Deterministic seeds mean a "stuck" player can share seed+choices for exact repro.

**R3 — Tutorialization: the billiards loop (observe→ball→lineup→simulate→cascade) is the game's thesis and its steepest learning curve.**
*Mitigation:* (a) S1–S3 teach the commit/report grammar on simpler toys *before* S-4 billiards. (b) B-1 opens with a 3-step coach overlay ("1. Filter the field. 2. Pick your ball. 3. Line up the shot.") that dismisses forever after first ACCEPT. (c) Confidence readout in B-3 narrates the plan back in plain language ("Fusion push, 17 mi deep, T+4d — 87% the archive agrees"). (d) First run is explicitly a *rehearsal run*: Dotty frames RUN #1 as "the archive expects you to fail it," removing the fear of wasting resources while learning.
