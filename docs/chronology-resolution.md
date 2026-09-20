# STEAL THE MOON — Chronology Resolution
### Story-continuity ruling on the 2051 / 2049–2052 / 4,200-day conflict

**Status:** RESOLVED (editorial ruling, 2026-09-20). One premise in the task brief is corrected below (§3).
**Sources read:** `docs/story-bible-v3.md`, `data/canon.json`, `data/chain.json`, `data/scenes.json`, `data/characters.json`.

---

## 1. The arithmetic

- 4,200 ÷ 365 = **11.5068 years** (naive; this is where the brief's figure came from)
- 4,200 ÷ 365.25 = **11.4990 years** (true, accounting for leap years)
- `canon.json` locks `duration_days: 4200` and `duration_years: 11.5` — **11.499 rounds to 11.5, so canon.json is internally consistent.** No numeric change needed there.
- `chain.json` link span: 2049-06-17 → 2052-04-12 = **1,030 days** (≈ 2.82 years).

## 2. The contradiction, stated plainly

Three claims in the sources cannot all be literally true:

1. **The heist ends with Mimas captured in 2032** — locked in four places: bible §1 ("Mimas captured 2032", "nineteen years after the heist" in 2051), bible §3 (EVENT layer 2031–2033), `characters.json` (Dotty: "leaked footage from 2032"), `scenes.json` (temporal layers).
2. **The Billiards nuclear chain runs 2049-06-17 → 2052-04-12**, ending with LINK 11 "Mimas begins Earth transfer" — but Mimas cannot *begin* its Earth transfer in 2052 if it was captured in 2032. Twenty years late.
3. **The voyage/program lasts 4,200 days (11.5 years)** — which fits neither a ~2-year 2031→2033 tow nor a 2049→2052 window.

A 4,200-day mission cannot fit inside the 1,030-day 2049–2052 chain window, and the chain cannot end after the capture it causes.

## 3. Premise correction (divergence from the task brief)

The brief suggested the resolution "planning 2039 → execution 2051" and a "heist date in 2051." **The sources do not support this.** 2051 is the year the fictional documentary is *assembled* ("Declassified 2049. Assembled 2051. Believed by nobody."), nineteen years after the heist: 2051 − 2032 = 19 ✓. The heist's climax — the capture perigee burn — is **2032**, locked in four independent sources. Moving the heist to 2051 would break more locked lines than it saves. This ruling keeps 2032.

## 4. The resolution

**Ruling: the 4,200 days = the full STEAL THE MOON program, from secret inception to the capture burn.** The 2049–2052 dates on the Billiards chain are a decade-stamp error (see in-world justification below) and are re-dated by a uniform shift of **−7,200 days**.

### Why this model wins

- `canon.json`'s 4,200 days / 11.5 years survives **numerically untouched** — it just needed its scope pinned down (program, not transit alone).
- The 2032 capture, the 2032 footage, EVENT 2031–2033, HEARING 2034, declassified 2049, assembled 2051, and "nineteen years" all survive untouched.
- The chain's 12 links keep their exact relative spacing and order — only the decade changes.
- The Saturn escape (LINK 10) lands in **February 2032**, so Dotty's "leaked footage from 2032" of the 72 hours stays true.

### In-world justification for the chain re-dating (for Dotty to lampshade)

The Billiards chain files were declassified in **2049**, and the archive mis-stamped the 2029–2032 campaign with the declassification decade. Corrected dates below. Suggested Dotty line: *"Fun fact: these files were declassified in 2049 and some intern filed the whole Saturn campaign under the wrong decade. The archive apologizes. The archive has fired the intern. The intern was me."*

### Date arithmetic (all computed, not guessed)

- **Program day 0 (inception):** 2032-11-20 − 4,200 days = **22 May 2021** (Saturday)
- **Program day 2,100 (midpoint):** 22 May 2021 + 2,100 days = **20 February 2027** (Saturday)
- **Program day 4,200 (capture):** **20 November 2032** (Saturday) ✓ (22 May 2021 + 4,200 days verified)
- **Chain shift:** every `chain.json` link date − 7,200 days (uniform; internal gaps preserved)
  - LINK 00: 2049-06-17 → **30 Sep 2029** (campaign opens)
  - LINK 10 (Saturn escape / the 72 hours): 2051-10-31 → **13 Feb 2032** ✓ "footage from 2032" holds
  - LINK 11 (Mimas begins Earth transfer): 2052-04-12 → **26 Jul 2032**
  - Chain span stays 1,030 days; LINK 11 → capture = **117 days** (≈ four months)
- **Parking at DRO declared:** 20 Nov 2032 + 14 days = **4 Dec 2032** (day 4,214; aftermath begins)

### The one casualty

`scenes.json` Scene 6 and bible §4 Scene 6 say the inward fall was "**14 months** of burns and assists." With LINK 11 (transfer begins) on 26 Jul 2032 and capture on 20 Nov 2032, the fall is **117 days ≈ four months**. "14 months" cannot survive; both occurrences are changed to "four months" (flagged [CHANGED] below). This is a scene-outline line, not locked §2 canon — the cheapest possible break.

---

## 5. Canonical timeline

| Phase | Start | End | Duration (days) | Story event |
|---|---|---|---|---|
| FIRST LIGHT (program inception) | 22 May 2021 | 29 Sep 2029 | 3,054 | Secret torch program founded; target selection; ARGUS built; shepherd fleet assembled (captured asteroids) |
| Midpoint beat | 20 Feb 2027 | — | day 2,100 of 4,200 | *(editorial)* ARGUS threads the first complete Saturn→Earth trajectory |
| THE CASING → THE RETURN (Billiards campaign) | 30 Sep 2029 | 26 Jul 2032 | 1,030 | 12-link nuclear billiards: Phoebe recon → Gary → Beautiful Miss → Three-Moon Pocket → Ring Problem → Clean Shot → Resonance → Tethys → Rhea → Titan/Hyperion (FORBIDDEN SHOT) → Mimas escape → Earth transfer begins |
| Lucky-77 demo | 18 Apr 2031 | — | (1 day, pinned) | Public "propulsion test" — actually a rehearsal, mid-campaign cover |
| THE 72 HOURS (Saturn escape) | 11 Feb 2032 | 13 Feb 2032 | 3 | LINK 10: Mimas ripped out of Saturn's system; possible first crack (C3); "That was it?" — Dotty |
| THE LONG FALL | 26 Jul 2032 | 20 Nov 2032 | 117 | Jupiter flyby (~10 Sep 2032, pinned); inward fall; "four months of burns and assists" |
| THE BRAKING BURN | 13 Nov 2032 | 13 Nov 2032 | (11 min / 9 min) | Herschel Slip: ~40 km fracture; "don't log that" |
| **CAPTURE (program day 4,200)** | **20 Nov 2032** | — | **4,200 total** | Capture perigee burn. The heist is complete. |
| PARKING | 20 Nov 2032 | 4 Dec 2032 | 14 | Parked at distant retrograde orbit, ~70,000 km; "like a roommate's couch" |
| MINING OPS | Feb 2033 | 2040s | — | He-3 mining begins — "mining the crack" |
| THE HEARING | 2034 | 2034 | — | Voss testifies; reader is committee counsel |
| FRACTURE WATCH / aftermath | 2035 | 2049 | — | Orbital economy booms; crack monitored; Ending D's 2049 propagation lives here |
| DECLASSIFIED | 2049 | — | — | Files released (and mis-stamped — see §4) |
| THE MIMAS INQUIRY assembled | 2051 | — | — | Dotty's documentary; **19 years after the heist** ✓ |

Full corrected chain dates: 00 → 30 Sep 2029 · 01 → 15 Oct 2029 · 02 → 2 Dec 2029 · 03 → 24 Jan 2030 · 04 → 21 Apr 2030 · 05 → 6 Aug 2030 · 06 → 28 Dec 2030 · 07 → 19 May 2031 · 08 → 31 Aug 2031 · 09 → 10 Dec 2031 · 10 → 13 Feb 2032 · 11 → 26 Jul 2032.

---

## 6. Locked-line changes

### [CHANGED] `data/chain.json` — 12 link dates (−7,200 days each) + 1 quest-stage label

Original (example, LINK 00): `"date":"2049-06-17"` → Replacement: `"date":"2029-09-30"`.
All twelve, original → replacement:
- LINK 00: `2049-06-17` → `2029-09-30`
- LINK 01: `2049-07-02` → `2029-10-15`
- LINK 02: `2049-08-19` → `2029-12-02`
- LINK 03: `2049-10-11` → `2030-01-24`
- LINK 04: `2050-01-06` → `2030-04-21`
- LINK 05: `2050-04-23` → `2030-08-06`
- LINK 06: `2050-09-14` → `2030-12-28`
- LINK 07: `2051-02-03` → `2031-05-19`
- LINK 08: `2051-05-18` → `2031-08-31`
- LINK 09: `2051-08-27` → `2031-12-10`
- LINK 10: `2051-10-31` → `2032-02-13`
- LINK 11: `2052-04-12` → `2032-07-26`
- Quest stages: original `"I THE CASING (2049) — fellowship assembles"` → replacement `"I THE CASING (2029) — fellowship assembles"`.

Justification: these dates are the direct contradiction (Mimas beginning Earth transfer in 2052, twenty years after its 2032 capture). Relative spacing, order, bodies, and outcomes are untouched.

### [CHANGED] `data/scenes.json` — Scene 6 beat

Original: `"beat":"The inward fall compressed: 14 months of burns and assists in a 90-second montage. 2051 interview with a teenager born on the Mimas mining station."`
Replacement: `"beat":"The inward fall compressed: four months of burns and assists in a 90-second montage. 2051 interview with a teenager born on the Mimas mining station."`
Justification: transfer leg is 117 days (26 Jul → 20 Nov 2032); "14 months" is arithmetically impossible.

### [CHANGED] `docs/story-bible-v3.md` — §4 Scene 6

Original: "The inward fall compressed: 14 months of burns and assists in a 90-second montage."
Replacement: "The inward fall compressed: four months of burns and assists in a 90-second montage."
Justification: same as above (mirror of the scenes.json change).

### [CLARIFIED — no numeric change] `data/canon.json` — voyage scope

Original block keeps `"duration_days":4200, "duration_years":11.5` verbatim. Proposed addition of one field:
`"scope":"full program: secret inception (22 May 2021) → Earth capture burn (20 Nov 2032); the Saturn→Earth transit is the final 1,147 days (chain campaign 1,030 d + transfer leg 117 d)"`.
Justification: the numbers were never wrong (11.499 ≈ 11.5 ✓); only the scope was ambiguous. This pins it without altering a locked value.

**Changed-line count: 15** (12 chain dates + 1 quest-stage label + 1 scenes.json beat + 1 bible line). **Numeric locked values changed: 0.** canon.json gets one clarifying field, no value altered.

---

## 7. Open questions for the user

1. **Program day 0 naming:** 22 May 2021 is currently "FIRST LIGHT" (secret torch program founded) — an editorial beat. Does the user want a named in-story event for day 0, or should the program's start stay off-page?
2. **Trajectory-map slider (§8b):** the UI spec says `T−214 days → T+0 (capture)`, but the transfer leg is now 117 days — T−214 lands mid-chain-endgame (21 Apr 2032, between LINK 10 and LINK 11). Keep the slider covering escape + transfer, or change to T−117?
3. **Pinned (non-locked) dates** — Jupiter flyby ~10 Sep 2032, Lucky-77 18 Apr 2031, braking burn 13 Nov 2032, hearing 2034, mining Feb 2033, midpoint beat 20 Feb 2027: all editorial pins. Confirm or adjust.
4. **Ending D's 2049 fracture** now coincides with the declassification year — dramatically convenient (the truth comes out as the moon breaks). Intentional keep, or move the fracture year?
5. **`chain.json` disclaimer** ("All dates and mechanics are fictional planning values…") stays as-is; the re-dated links remain fictional. Confirm the −7,200-day shift should be applied to the repo file, or held as a proposal.
