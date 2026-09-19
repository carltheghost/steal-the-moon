# DRAMA SPEC — implementation brief for the build agents (2026-09-19)

Everything in this file is canon from the user's drama session. Implement it as specified.
It supplements (does not replace): report.md (story bible), sim-spec.md, billiards-spec.md,
core-spec.md, system-spec.md. All data lives in the public repo
https://github.com/carltheghost/steal-the-moon (data/*.json + docs/).

## 1. Canon inventory — tonight's additions (all locked)

1. WRONG IN FOUR WAYS — the core is ancient and wrong in four ways: (1) californium +
   transuranics (neptunium, plutonium, americium, curium, berkelium, einsteinium,
   fermium, on up) sitting NATURALLY in the rock; (2) billion-year pressure exotics
   with no Earth equivalent; (3) superheavies past 118 — some in the island of
   stability, others caught mid-decay in active chains; (4) residual heat — hot spots
   that should have cooled eons ago.
2. THE TWO PRESSURES — Pressure One (deep): neutron capture cascades hop mineral to
   mineral, building heavier nuclei, feeding the superheavies. Pressure Two (lesser):
   particles escape, protons get shoved out, decay runs down other paths. Both forge
   NEW STABLE exotic minerals with no Earth equivalent.
3. THE CASCADE — the core breeds fuel as it works: captures build new fissionables,
   decays feed more captures, the loop closes. MORE fuel bred than burned. The heist
   math never added up for mining because they were hauling a BREEDER, not cargo.
   The cascade algorithms are FREE/OPEN (in the repo, seeded, deterministic).
4. THE CORE AS DEVICE — everything in the core is RICH (high-grade nuclear feedstock,
   automatically, because it is a core). The hydrogen is RIGHT THERE in the ice.
   The energy can be TARGETED — released in certain ways, directed, aimed. POWER, not
   price. Motive-level only: sims keep nuclear events as abstract levers, no
   weapon-design mechanics, no yields. The story is about who holds the aim.
5. THE MILLENNIUM QUESTIONS — Dotty frames the core's mysteries as prize problems
   (everyone and every AI trying to answer): the unsolved interior-flow problem
   (Navier-Stokes flavor: "liquid moving"), "Map the transmutation network"
   ([UNOBSERVED]), and the moral one: "Was there life — or anything — that they
   destroyed?" (UNANSWERED — Ren's question).
6. THE DEBATE — two axes, threaded through BEGINNING (planning), MIDDLE (mid-heist
   crew fights), PAST/MEMORY (archive fragments), and LATE (full transcript).
   AXIS 1 — THE CHOICE: small/easy convenience target, or did they KNOW what the
   core held? (Dotty never confirms.) AXIS 2 — THE PARENT: what type of planet, how
   old, what it contained, what conditions, where. Nobody wins.
7. THE SEED — the crew seeds robots deep under the ice; no fuel brought or needed;
   they tap the cascade and tend the burn. In 2051 the archive holds robot telemetry —
   some of it recent. Dotty does not say whether anything is still awake down there.
   The robots are Ren's sabotage axis (hands to stay ahead of — or turn).
8. SCALE — Tsar Bomba (~50 Mt, 1961, real anchor) vs a californium release: the
   archive's chart shows the Tsar bar, then the axis breaks. Fictional quantities,
   labeled.
9. DOTTY'S LINE — "It's just math. TNT, and how you release it, and what happens."
   (Sim honesty, in her voice, up front.)
10. THE WORLD WATCHES — the voyage strips megatons of debris into a cometary TAIL;
    the SUN WARMS IT inward — volatiles sublimate, it brightens, visible for MONTHS.
    Nations debate, protest, pile up moral questions; the actor that pulled it off
    must answer the world with the evidence burning overhead (Voss's cover under
    maximum pressure). Open: THE DAMAGE QUESTION — what the debris hits (meteor
    uptick? satellites? [DISPUTED] casualties). Arc runs ~4–5 years; dramatic
    compression allowed ("fast will be good").
11. THE QUOTE — at the first big energy release, telemetry confirmed, room quiet,
    one scientist says the history-books line. DRAFT: "We didn't crack a moon
    tonight. We cracked the century."

## 2. Locked verbatim lines (do not reword)

- "It's not worth anything." / "That's the point." — Qiao (turning point)
- "You keep asking who owns the moon. That is the wrong question." — Ren (fourth testimony)
- "It's just math. TNT, and how you release it, and what happens." — Dotty (sim intro)
- "They thought they were stealing a mineral. They were stealing a question." — Dotty (core reveal)
- "The stolen moon is consuming itself to pay for its own escape."
- "They aren't drilling through Mimas. They're peeling it."
- "We didn't crack a moon tonight. We cracked the century." — scientist (DRAFT, first release)

## 3. New exhibits / sims to build

- CASCADE VIEW (Core screens): live flow diagram — feedstock nodes, animated neutron-hop
  streams (Pressure One), branching decay paths (Pressure Two), feedback loop visibly
  closing. Counters: FUEL BRED vs FUEL BURNED, multiplication factor k (fictional).
  Pressure-mix slider re-tunes the cascade. Labels: SCHEMATIC — NOT TO SCALE.
- TWO PRESSURES diagram: same feedstock in, two pressure columns, two element ladders,
  converging on new stable exotics.
- TAIL FOOTPRINT (sim): debris-tail trajectory model, Earth meteor uptick, satellite
  exposure, casualty figures marked [DISPUTED].
- Robot telemetry feed: timestamps that should have stopped — and didn't.
- Tsar-vs-californium scale chart: axis breaks after the Tsar bar.
- Debate fragments: planning-room argument (early), crew fights (mid-heist),
  archive/memory inserts (throughout), full engineer/scientist transcript (late,
  Core screens).
- Millennium Questions framing for the Core section (Dotty voice).
- The Quote moment: first release — telemetry confirmation, room quiet, line on screen.
- World-reaction thread: news/debate/moral-question ticker running across scenes during
  the voyage months; the actor's response beats (Voss).

## 4. Placement map

- BEGINNING: planning-room debate fragment (THE CHOICE), mission brief with helium-3 cover.
- MIDDLE (voyage): CASCADE VIEW + TWO PRESSURES live as the burn progresses; crew-fight
  fragments as anomalies surface; world-reaction ticker starts when the tail brightens;
  TAIL FOOTPRINT sim unlocks.
- PAST/MEMORY: archive inserts — buried charge logs, checksum mismatch (helium-3
  insertion), robot deployment records, pre-heist survey fragments hinting at
  foreknowledge (never confirming).
- LATE: full debate transcript (THE PARENT), declassification ladder to FINAL CANON
  [PARTIALLY UNREADABLE], Qiao's turning point, Ren's fourth testimony, Dotty's
  closing screen, robot telemetry "still awake?" beat.

## 5. Build checklist — drama layer (in order)

1. Add the 11 canon items above to the bible's canon register (report.md § canon).
2. Implement CASCADE VIEW + TWO PRESSURES (Core screens C-1/C-2), wired to STEAL.core.
3. Implement TAIL FOOTPRINT sim + Tsar scale chart.
4. Build the Quote moment as a scripted beat on the first release.
5. Write and place debate fragments (early/mid/memory/late) + full transcript.
6. Build the world-reaction ticker across voyage scenes + the actor's response beats.
7. Add robot telemetry feed exhibit + "still awake?" beat.
8. Frame the Core section with the Millennium Questions (Dotty voice).
9. Wire motive-flip beats: breeder math (reveal 2), foreknowledge hints (reveal 3),
   POWER-not-price (reveal 5, Qiao's line).
10. Verify: every locked line appears verbatim; every sim labeled schematic/fictional
    where required; mobile + reduced-motion paths intact.

## 6. Standing rules (unchanged)

- Nuclear events stay abstract impulse levers. No weapon-design mechanics, no yields.
- The algorithms are open: seeded, deterministic, inspectable, in the repo.
- Truth grammar: solid = observed, dashed = predicted, dotted = hypothetical,
  double = disputed.
- Honest labels: SCHEMATIC — NOT TO SCALE; fictional rates labeled as such.
- Open canon conflicts (do NOT silently resolve): 2051 framing vs 2049–2052 chain vs
  4,200-day mission vs "twelve years"; full 293-moon catalog still to assemble
  (Phase 0).
