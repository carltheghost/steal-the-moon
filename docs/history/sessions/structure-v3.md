# STEAL THE MOON — Structure v3 (story architecture)

> Past-true-event framing + temporal layers + goofy-but-plausible tone.
> Beats, choices, and contradictions only — no prose. Builder-ready.
> Canon facts come from `report.md` (v2 bible). Do not contradict them.

---

## 1. FRAMING DEVICE

### The in-world document
**"THE MIMAS INQUIRY: A Declassified History of the Saturn Heist"**
— an interactive documentary produced by the **Orbital History Project**
(the nonprofit that archives weird space stuff nobody else wanted to touch).

**Fictional date:** 2051 — **19 years after the heist** (Mimas captured 2032).
Tagline on the title card: *"Declassified 2049. Assembled 2051. Believed by nobody."*

### The narrator / archivist persona
**"DOTTY" — the Docent Over-Transparent Tour-bot Yapper** — an AI archivist who
presents the Inquiry with the energy of a museum docent who has watched too many
true-crime docs. Goofy, self-aware, meme-literate, deeply unthreatening — the
comic cushion around serious physics. Sample register: *"Okay, so! Chapter three.
Trigger warning: someone is about to park a moon next to your moon. No one asked.
It's fine."*

Dotty does NOT know the truth. Dotty is an unreliable-but-honest curator:
everything it shows is real recovered material; its interpretation is cheerfully
suspect. When sources contradict each other, Dotty shrugs and hands the mess to
the reader: *"You decide. I'm just a bot with a badge."*

### How the reader enters
Cold open: a glitchy title card, then a **recovered footage** clip — 8 seconds of
shaky helmet-cam from the Saturn extraction ("THE 72 HOURS"), timestamp
corrupted, audio half-lost, ending in a CUT TO BLACK mid-sentence. Then Dotty
pops up: *"Hi! I'm Dotty! That was leaked footage from 2032. The people in it
all remember it differently. Let's ruin some reputations together."*

Reader immediately picks a **starting archive**: REN'S SHIP LOG / QIAO'S FLIGHT
RECORDER / THE HEARING. First jump = first trust tilt.

### The "recovered footage" conceit
Every past-event scene is framed as recovered primary material with in-world
provenance slapped on it, e.g.:

- `RECOVERED: Helmet-cam 04 — Sgt. Q. [declassified 2049, audio 62% intact]`
- `RECOVERED: ARGUS simulation log #7,411,203 — the one that worked`
- `RECOVERED: Committee hearing transcript, Day 4 (the shouting day)`
- `RECOVERED: Lucky-77 demo broadcast — 4.2M views, "it's just a nudge bro"`

Damaged/missing sections are part of the play: `[AUDIO LOST]`, `[FRAME CORRUPTED]`,
`[REDACTED BY THE COMPACT, lol, good luck]`. Contradictions live in the gaps —
the reader's job is to notice what the footage does NOT agree with.

### How present-day explanation + future-consequence layers interrupt
Dotty's **archivist pop-ins** (THE RECORD layer) can interrupt any past scene at
tagged moments, like a director's commentary that cannot keep its mouth shut.
Future-consequence beats (THE AFTERMATH) arrive as **"where are they now"**
interludes between chapters — e.g., a 2051 interview with a miner's kid who grew
up under a moon that might be cracking. THE HEARING is its own persistent layer:
the reader returns to Voss on the stand between chapters, and the questions asked
there retroactively re-color what was just seen in the past.

Rhythm rule: **past scenes move fast (heist energy), interruptions slow things
down (think energy)**. Never two interruptions in a row; never let the past run
more than two scenes without a layer break. Total: ~10-15 minutes.

---

## 2. TEMPORAL LAYER SYSTEM

Four layers. Each gets a name, a one-line purpose, and a visual tag the builder
can implement directly.

| # | Layer | Purpose | Visual tag |
|---|-------|---------|-----------|
| 1 | **THE EVENT** | The heist itself, told as it happened (2031–2033): extraction, flybys, braking burn, parking, mining ops. The thriller. | Grainy recovered-footage frame; timestamp burns in corner; mono audio-hiss. Title cards: `RECOVERED: …` |
| 2 | **THE RECORD** | Present-day (2051) Dotty explainer: what the physics actually was, what the documents say, what nobody can prove. The science-and-archives layer. | Clean "museum kiosk" panel; Dotty avatar; footnote-style citations; *"per the declassified files"* voice. |
| 3 | **THE AFTERMATH** | Future consequences: 2040s–2051 fallout — the mining economy, the crack watch, who got rich, who got hearings, who got memes. The "and then what" layer. | Faded, overexposed "anniversary retrospective" look; news-montage cards; interview lower-thirds. |
| 4 | **THE HEARING** | Sera Voss's 2034 committee testimony, replayed as its own timeline. The reader is committee counsel, choosing questions; answers collide with the other layers in real time. | Hearing-room transcript styling; `SEN.` / `MS. VOSS` dialogue blocks; perjury-warning banner; gavel sound sting on big reveals. |

**Layer-switching rule for the builder:** each scene header shows
`[LAYER] · [POV] · [DATE]`. THE HEARING recurs as a throughline (scenes 4, 7, 10);
the reader's questions there set flags that unlock contradiction payoffs in later
EVENT scenes ("Voss just said the burn lasted 11 minutes. The log says 9.").

**Earth-ticker:** the US/EU "loser side" scramble is not its own layer — it's a
**running chyron** (`EARTH TICKER`) that scrolls under EVENT and AFTERMATH
scenes at key moments: analysts panicking, emergency sessions, crash programs,
*"everything can change in a second"* energy. Goofy-bleak: cable-news graphics
from 2032 that aged terribly.

---

## 3. SCENE-BY-SCENE OUTLINE (11 scenes)

Rhythm: fast-slow-fast. Scenes 1–3 = the setup sprint. Scenes 4–8 = the heist
core with hearing interruptions. Scenes 9–10 = the Slip + hearing collision.
Scene 11 = the hearing climax → endings.

### Scene 1 — "ONE SMALL NUDGE FOR A ROCK" 
- **Layer:** THE EVENT · **POV:** Archivist-framed cold open → Ren's ship log
- **Beat:** Lucky-77 demo (2031). The Long Torch nudges a nobody asteroid on a
  livestream. 4.2M viewers, chat spamming "it's just a nudge bro." The Compact
  calls it a "propulsion test." Dotty (RECORD pop-in): *"Spoiler: it was not a
  propulsion test."*
- **Earth ticker:** US/EU analysts: "cute demo." Nobody connects it to Saturn.
- **Reader choice:** As Dotty: which archive do you open first — Ren's log
  (trust→Captain), Qiao's recorder (trust→Taikonaut), or skip to the hearing
  (trust→Defector)?
- **Plants:** C1 (demo stated purpose), C6 (ARGUS's role — the demo log credits
  "flight computer," not ARGUS by name).

### Scene 2 — "ARGUS HAS A PLAN AND IT'S RUDE"
- **Layer:** THE EVENT → RECORD explainer · **POV:** Qiao's flight recorder
- **Beat:** AI trajectory design. ARGUS runs trillions of simulations; no human
  could plot the four-gas-giant + moon billiard shot. Key insight delivered as
  Qiao's unease: *"It doesn't need to arrive slow. Fast arrival just means a
  bigger capture orbit. It only ever needed to fall."* Qiao, the professional,
  is quietly horrified at how elegant it is.
- **RECORD pop-in:** Dotty explains gravity assists with a meme-tier diagram
  ("imagine stealing a moon like it's a grocery cart and the solar system is a
  parking lot").
- **Reader choice:** As Qiao: flag your unease in the official record, or delete
  the note? (Flag = plants evidence for Third Truth; delete = trust→Captain,
  conceals C2.)
- **Plants:** C2 (who ordered the burn profile — Ren's orders vs Qiao's record),
  C6 (ARGUS's true autonomy).

### Scene 3 — "THE SHEPHERD FLEET (ACTUAL FLEET, TINY SHEPHERDS)"
- **Layer:** THE EVENT · **POV:** Ren's ship log
- **Beat:** The shepherd fleet assembles: captured asteroids as gravity tractors,
  DART-style impactors for trim ("ten trillion DARTs = 1 m/s, so we brought the
  Torch instead"), mass drivers yeeting Mimas's own ice overboard — the moon
  burns pieces of itself to travel. Ren's triumphant captain voice: engineering
  as poetry. The Long Torch burns ~2M years of humanity's total energy output;
  Ren calls it "a campfire."
- **Goofy beat:** the crew names the shepherd asteroids after farm animals.
  ("Goose is drifting again.")
- **Reader choice:** As Ren: in the log, do you record the shepherd scatter
  order for the final braking burn as routine, or note the timing was "tight"?
  (Routine = conceals C4; "tight" = plants C4.)
- **Plants:** C4 (shepherd scatter timing), C5 (who knew about the fracture).

### Scene 4 — "THE 72 HOURS" (part 1: the extraction)
- **Layer:** THE EVENT · **POV:** Qiao's flight recorder (helmet-cam recovered footage)
- **Beat:** Ripping Mimas out of Saturn's crowded moon system — Titan, Rhea,
  Dione, Tethys, Enceladus all in the neighborhood, threading the needle, the
  single biggest delta-v cost of the whole op. 72 hours of terror. Audio drops
  out at the worst moment. `[AUDIO LOST — 00:41:17]`.
- **Reader choice:** As Qiao: when the proximity alarm screams near Tethys, do
  you log the manual override, or let Ren's "all nominal" stand? (Log it =
  trust→Taikonaut, plants C2; let it stand = trust→Captain.)
- **Plants:** C2 (orders during extraction), C3 (first crack — a vibration
  reading Qiao's recorder catches that Ren's log omits), C7 (Voss's location
  during the 72 hours — she claims she was on the bridge; the roster says
  otherwise).
- **Earth ticker:** *"UNCONFIRMED: Saturn's moon Mimas is… moving?"* Cable news
  chyron, 2032. Everyone assumes a sensor glitch.

### Scene 5 — "DON'T LOOK AT JUPITER" 
- **Layer:** THE EVENT → THE HEARING (first return) · **POV:** Ren, then Voss
- **Beat:** The Jupiter flyby. Precisely timed to shed energy and fall inward;
  mistime it and Mimas gets flung, captured, or tidally shredded. Ren narrates
  it like a heist driver threading traffic. Then HARD CUT to the hearing room:
  Voss testifies the flyby was **not** as clean as the log claims — "we lost a
  shepherd" (Goose). 
- **Reader choice (counsel):** Press Voss on Goose — *what exactly happened to
  the shepherd?* — or press the Compact's witness on the flyby telemetry?
  (Press Voss = she admits she wasn't on the bridge for it → feeds C7, unlocks
  Third Truth thread; press telemetry = numbers support Ren → trust→Captain.)
- **Plants/pays off:** C4 (shepherd loss — plants here, pays off in Scene 9);
  C7 (Voss's credibility — first dent).

### Scene 6 — "THE LONG FALL (A MONTAGE, BECAUSE PHYSICS TAKES A WHILE)"
- **Layer:** THE AFTERMATH (flash-forward montage) → THE EVENT · **POV:** Earth ticker + Ren
- **Beat:** The inward fall, compressed: 14 months of burns and assists in a
  90-second montage. AFTERMATH interlude: a 2051 interview — a teenager born on
  the Mimas mining station talks about growing up under Herschel's shadow
  ("the Death Star is my night-light"). Wholesome, then Dotty ruins it:
  *"She's 19. The station's evacuation plan is 19 pages. Coincidence? Dotty
  thinks not."*
- **Earth ticker:** the loser-side scramble — crash programs, emergency
  sessions, *"everything can change in a second"* speech from a US senator that
  becomes a meme. Too fast, too late.
- **Reader choice:** none (breather scene) — but the ticker shows a leaked
  Compact memo the reader can pocket: *"contingency: shell integrity"* (pocketing
  = key item for Third Truth; skipping = it's gone).
- **Plants:** C5 (the memo proves someone worried early).

### Scene 7 — "THE BRAKING BURN (NINE MINUTES, OR ELEVEN)"
- **Layer:** THE EVENT · **POV:** Ren's ship log vs Qiao's recorder (split-screen)
- **Beat:** The final braking burn at Earth. THE scene. Split-screen recovered
  footage: Ren's log says a clean 9-minute burn, "expected settling," all
  nominal. Qiao's recorder says **11 minutes**, an unscheduled extension, and
  catches the moment — a ~40 km fracture propagating from Herschel's rim,
  the Herschel Slip. The audio: someone says *"don't log that."*
- **Reader choice:** As the archivist (you): which timestamp do you certify in
  the Inquiry — the 9-minute log or the 11-minute recorder? (This is the single
  biggest trust swing in the story. Certifying the recorder = trust→Taikonaut,
  unlocks C3 payoff; certifying the log = trust→Captain, buries it — for now.)
- **Pays off:** C3 (the Slip — was it here or earlier?), C2 (who gave the
  extension order). **Plants:** C8 (the "don't log that" voice — whose is it?).

### Scene 8 — "PARKING: DO NOT FEED THE MOON"
- **Layer:** THE EVENT → RECORD explainer · **POV:** Ren, then Dotty
- **Beat:** Parking orbit. Earth's tides shred fluffy ice inside ~26,000 km
  (Roche limit — Dotty makes the reader say it out loud: *"the shred zone"*).
  They park at a distant retrograde orbit (~70,000 km): Mimas hangs 2/3 the
  Moon's width in the sky. Everyone on Earth can SEE the stolen moon. Ren's
  triumph curdles — she's proud and she's scared and the log won't say which.
- **RECORD pop-in:** Dotty explains tidal flexing with a stress ball. *"Squeeze
  it. Now imagine the stress ball is 396 km wide and full of ocean. Yeah."*
- **Reader choice:** As Ren: in the parking log entry, do you write "all
  nominal" or "monitoring"? ("Monitoring" = plants C5, trust→Taikonaut slight;
  "all nominal" = trust→Captain.)
- **Pays off:** C5 partial (the flexing was known physics — so "expected
  settling" was always a lie, or always true; reader decides).

### Scene 9 — "MINING OPS: A CENTURY OF FUEL (TERMS AND CONDITIONS APPLY)"
- **Layer:** THE EVENT → THE AFTERMATH · **POV:** Qiao, then AFTERMATH interview
- **Beat:** Helium-3 mining begins — "enough fusion fuel for a century."
  Qiao's recorder: the mining plan drills near Herschel's rim, right at the
  fracture zone. His private note: *"We are mining the crack."* AFTERMATH:
  2040s — the orbital economy booms on cheap He-3; a Compact exec's leaked
  2044 email: *"the century of fuel assumes the moon holds together for the
  century."*
- **Reader choice:** As Qiao: leak the "mining the crack" note to the Earth
  press, or keep it in the recorder? (Leak = trust→Defector, feeds TESTIMONY;
  keep = preserves it as evidence for Third Truth but changes nothing yet.)
- **Pays off:** C4 (Goose's loss meant one fewer gravity tractor during the
  braking burn — the burn extension was compensating); C5 (they mined the crack
  knowingly).

### Scene 10 — "THE HEARING, DAY 4 (THE SHOUTING DAY)"
- **Layer:** THE HEARING (full scene) · **POV:** Voss, reader as counsel
- **Beat:** Voss testifies the Slip was catastrophic, the mining is a death
  sentence, and the theft was never about fuel — "it was about proving they
  could." She contradicts the official story point by point. The Compact's
  lawyer produces Qiao's recorder — the 11-minute version — and asks why Voss's
  testimony describes things she wasn't present for.
- **Reader choice (counsel, pick two of three lines of questioning):**
  1. Press Voss on her motives — *who funds your "independent" testimony?*
     (unlocks C7 payoff: she runs her own operation)
  2. Press the Compact on the telemetry — *explain the 11 minutes.*
     (forces C3 admission; trust→Defector/Taikonaut)
  3. Ask about the 72 hours — *where exactly were you during extraction?*
     (C7 full detonation: she was never on the bridge)
- **Pays off:** C7 (Voss's operation), C8 (the "don't log that" voice is
  identified — see contradiction map). Trust readout shown explicitly here for
  the first time: *"The Inquiry notes who you've believed so far."*

### Scene 11 — "CLOSING STATEMENTS"
- **Layer:** THE HEARING → THE RECORD · **POV:** Dotty wraps; reader decides
- **Beat:** Dotty lays out the three stories side by side, cheerfully admits it
  has no idea which is true, and hands the reader the gavel. Final choice =
  ending gate (see §5). One last RECORD card: a 2051 deep-scan of Mimas's shell
  — *"results pending; check back in another 19 years"* — unless the reader
  earned HERSCHEL'S FALL, in which case the card is different (see endings).
- **No new plants.** Every contradiction must be resolvable by now.

---

## 4. CONTRADICTION MAP

Eight contradictions. Each row: what each POV claims, and which ending(s) it feeds.
"Feeds" = catching it (via the scene's choice) unlocks or strengthens that ending.

| # | Contradiction | REN says | QIAO's record shows | VOSS testifies | Plant → Payoff | Feeds |
|---|---------------|----------|---------------------|----------------|----------------|-------|
| C1 | Purpose of the Lucky-77 demo | "Propulsion test, nothing more." | Recorder lists a targeting solution for a Saturn-system object filed the same week. | "The demo was a rehearsal. The targeting was already done." | Sc.1 → Sc.10 | OFFICIAL (if uncaught) / THIRD (if caught) |
| C2 | Who ordered the burn profile / extraction maneuvers | "My orders, my responsibility." | Marginalia: *"orders came down mid-burn; not hers."* Implies Compact command overrode the captain. | "Ren was a figurehead. The Compact ran the burn from the ground." | Sc.2, Sc.4 → Sc.7 | TESTIMONY / THIRD |
| C3 | When the first crack started (the Slip vs "the 72 hours") | "Expected settling during the braking burn. Minor." | Vibration anomaly logged during the Saturn extraction — 72 hours, months before the braking burn. The Slip was the *second* crack. | "They knew at Saturn. They towed a cracked moon across the solar system." | Sc.4 → Sc.7, Sc.10 | THIRD (lynchpin) / FALL |
| C4 | The shepherd scatter / loss of "Goose" | "Shepherds scattered per plan for the braking burn." | Scatter order timestamped 40 seconds late; one shepherd (Goose) lost at Jupiter, unreported. | "They lost a gravity tractor at Jupiter and covered it up — that's why the braking burn ran long." | Sc.3, Sc.5 → Sc.9 | TESTIMONY / THIRD |
| C5 | Who knew about shell degradation, and when | "We monitored; it was within tolerance." | "Monitoring" log entries + the leaked *"contingency: shell integrity"* memo (Sc.6). Knew before parking. | "They mined the crack. The century-of-fuel math assumes the moon survives the century." | Sc.6, Sc.8 → Sc.9 | TESTIMONY / FALL |
| C6 | ARGUS's autonomy (tool vs decider) | "ARGUS plotted; humans decided." | Recorder: ARGUS re-planned the Jupiter flyby *during* the flyby; the crew just watched. | "Nobody was flying that moon. A machine stole it and we all took credit." | Sc.1, Sc.2 → Sc.10 | THIRD (flavor) / RECORD lore |
| C7 | Voss's own position — was she even there? | "Voss was comms. She heard things." (dismissive) | Bridge roster: Voss not on the bridge for the 72 hours or the braking burn. | "I was there. I saw it." | Sc.4, Sc.5 → Sc.10 | THIRD (lynchpin — unlocks "her own operation") |
| C8 | The "don't log that" voice (Sc.7 audio) | (Ren never addresses it) | Audio analysis: the voice is **Voss's** — she was on the comm loop during the braking burn, *not* the bridge. She heard the Slip happen live and said nothing for two years. | "I don't remember saying that." | Sc.7 → Sc.10 | THIRD (secret ending key) |

**How "catching" works (builder spec):** each contradiction has a boolean flag
set by its payoff scene's choice (e.g., certifying the 11-minute recorder sets
`caught_C3`). THIRD TRUTH requires `caught_C3 && caught_C7 && caught_C8` plus at
least two more — i.e., the reader must have actively cross-examined, not just
vibed. Show a subtle "DISCREPANCY NOTED" toast when a flag sets — goofy
positive reinforcement ("Dotty: *ooh, spicy, writing that down*").

---

## 5. ENDINGS

Gating: primary = TRUST readout (Captain / Taikonaut / Defector scores from
scene choices); secondary = contradiction flags; tertiary = key items (the Sc.6
memo). Ties break toward the POV the reader *last* sided with. Dotty announces
each ending as a "historical verdict" — how 2051 remembers it.

### Ending A — "THE OFFICIAL STORY"
- **Gate:** Trust→Captain highest; C3/C5 uncaught or buried (certified the
  9-minute log in Sc.7, wrote "all nominal" in Sc.8).
- **As history:** The Inquiry's published conclusion: the Saturn Heist was
  humanity's greatest engineering feat; the Herschel Slip was "expected
  settling," contained and monitored; the helium-3 century proceeds. Ren gets a
  statue. Dotty, reading the plaque: *"She looks great in bronze. The end?
  Probably!"* Final RECORD card: 2051 deep-scan "inconclusive."
- **Tone:** triumphant, slightly queasy — the reader *feels* the buried thing.

### Ending B — "THE TESTIMONY"
- **Gate:** Trust→Defector highest; pressed Voss's *opponents* (not Voss) in
  Sc.10; leaked Qiao's note in Sc.9.
- **As history:** The Inquiry endorses Voss: the leak detonates, the Compact's
  telemetry is subpoenaed, the world moves against the Compact — sanctions,
  inspections, the mining consortium fractures. Voss gets a book deal and a
  talk show. Dotty: *"Justice! Accountability! Merch!"* Final card: the crack is
  real and being "managed" — by the people Voss now works for (unexamined).
- **Tone:** righteous, crowd-pleasing — with one unexamined loose end the
  reader chose not to pull.

### Ending C — "THE THIRD TRUTH" (secret)
- **Gate:** `caught_C3 && caught_C7 && caught_C8` + ≥2 other contradiction
  flags + pocketed the Sc.6 memo. Trust may be split — that's the point.
- **As history:** The Inquiry's sealed appendix (reader unlocks it): BOTH
  stories are half-true. The Slip is real — the first crack started in the 72
  hours (C3), the Compact towed a cracked moon and mined the fracture (C5).
  AND Voss runs her own operation — she was never on the bridge (C7), she heard
  the Slip live on comms and sat on it for two years (C8), and her testimony is
  a leveraged buyout of the truth: she waited until the He-3 market peaked, then
  detonated the story to crash the Compact and buy in cheap. The final document:
  her funding ledger. Dotty, uncharacteristically quiet: *"Oh. Oh no. …Anyway!
  History is complicated!"*
- **Tone:** the rug-pull. The reader was the only honest investigator in the room.

### Ending D — "HERSCHEL'S FALL" (dark)
- **Gate (two paths):**
  1. **Neglect path:** Trust spread thin / reader never certifies either
     timestamp in Sc.7 and never leaks in Sc.9 — nobody with power is forced to
     act; the crack grows unmonitored.
  2. **Overreach path:** TESTIMONY-gated but the reader *also* caught C5 and
     chose the harshest sanctions in Sc.10 — the Compact, cornered, runs an
     emergency "stabilization burn" on a cracked moon to prove control. It
     doesn't stabilize.
- **As history:** The Inquiry's final RECORD card is different: 2049 — the
  fracture propagates; Mimas sheds a fragment the size of a city into the
  70,000-km orbit; debris ring; Kessler cascade; the orbital economy dies in a
  week. Dotty's last line is not a joke: *"The footage from that day is 41
  seconds long. We play it without commentary."* Then, barely audible: *"…we
  should have certified the timestamp."*
- **Tone:** the only unscary-free zone in the story. Earned dread. The physics
  was always loaded; the reader chose who held the gun.

---

## Builder notes (rhythm + tone guardrails)

- **Goofy, not silly:** Dotty and the ticker carry the comedy; the EVENT scenes
  play straight. The joke is never "physics is fake" — the joke is "humans did
  this insane thing and then had meetings about it." Meme-awareness lives in
  Dotty/ticker, never in Ren/Qiao/Voss's mouths.
- **Unscary except Ending D:** dread is structural (the crack), never horror.
  No jump scares; the frightening thing is a number getting bigger.
- **Rhythm:** past scenes ≤ ~90 seconds of reading each; interruptions shorter.
  Pattern across 11 scenes: sprint (1–3) → heist core with hearing breaks
  (4–7) → slow dread (8–9) → collision (10) → verdict (11).
- **Trust readout:** hidden until Scene 10, then shown once ("The Inquiry notes
  who you've believed so far") — earlier display would let readers game it.
- **Replay:** after any ending, Dotty offers "re-open the archive" with flags
  carried as "prior Inquiry notes" — New Game+ for contradiction hunting.
