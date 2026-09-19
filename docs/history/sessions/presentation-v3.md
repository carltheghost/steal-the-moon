# STEAL THE MOON — Presentation / UI Concepts (v3)
*Presentation designer output. Companion to tone + structure crew outputs: goofy-doc tone, 4 temporal layers, 9–12 scenes, contradiction map, 4 endings.*

---

## 1. OVERALL ART DIRECTION

**"A government archive leaked onto a true-crime podcast fan wiki at 2am."** The whole page is a declassified case file brought back to life: deep space-black background (`#06080d`) with faint starfield grain, documents rendered as warm off-white paper cards (`#f2ede1`) floating in the dark, and a forensic overlayer of redaction bars, rubber stamps, tape strips, and yellow "ARCHIVIST'S NOTE" sticky tabs. Accent palette: **signal orange** (`#ff6b1a`, warnings / the Long Torch), **classified teal** (`#2dd4bf`-ish, the Archivist's own voice), and **alarm red** (`#e5484d`, contradictions / the Herschel Slip). Typography: heavy condensed sans for headlines (think documentary title cards — shouty, all-caps, slightly distressed), a typewriter-mono for transcripts, redaction labels, and data readouts, and a clean readable serif or humanist sans for body copy so the goofy footnotes stay legible. Texture: subtle CRT scanlines + vignette only on "recovered footage" frames; paper cards get a faint noise/fiber texture and coffee-ring-free torn edges; everything official-looking gets a stamped treatment (rotated, slightly misaligned, semi-transparent). Never full VHS degradation everywhere — save the grime for the footage moments so they land.

---

## 2. TEMPORAL LAYER STYLING

Every scene declares its layer with a persistent top-of-viewport **layer ribbon** (thin bar, ~28px) plus a scene-label badge. Layers crossfade with a brief "channel-static" wipe (see §5).

| Layer | Ribbon + tint | Border/chrome motif | Label badge example |
|---|---|---|---|
| **THE EVENT** (past — the heist itself) | Orange-amber ribbon `#ff6b1a`; scenes sit on near-black with warm light-leak corners, like old film | Rounded "film frame" chrome: sprocket-hole strip along top edge of scene cards | `EVENT RECORD — T-DAY −214` / `RECOVERED FOOTAGE` |
| **THE RECORD** (present-day archivist narration) | Teal ribbon `#2dd4bf`; clean dark background, minimal texture — the "now" is the calmest layer | Thin teal rule lines, document-folder tabs ("FILE 03 — TOW PHASE"), page-corner fold motif | `ARCHIVIST'S RECORD — DECLASSIFIED 2049` |
| **THE AFTERMATH** (future consequences) | Cold blue-violet ribbon `#7c8cff`; background gets a faint grid/hologram feel | Dashed "projection" borders, corner brackets like a targeting HUD, subtle scan sweep | `AFTERMATH PROJECTION — +30 YEARS` / `SIMULATION` |
| **THE HEARING** (testimony transcript) | Parchment ribbon `#d8c98a` on dark, or full paper-card scenes (inverted: paper background, dark text) | Courtroom-stenographer chrome: line numbers down the left margin, `Q.`/`A.` typography, a witness-stand "sworn" stamp | `HEARING TRANSCRIPT — DAY 4` / `UNDER OATH` |

**Transitions between layers:** a 400ms "rewind/static" wipe — the outgoing scene glitches horizontally (2–3 frames of RGB-split), a timestamp counter spins to the new date, and the ribbon slides in with the new badge. Going backward in time adds a quick reverse-play "VCR rewind" sound-alternative: a visual rewind icon + spinning date counter (no autoplay audio; motion only).

---

## 3. POV SWITCHING UI

**Metaphor: "channel surfing a declassified broadcast."** A persistent bottom (desktop) / top-sticky (mobile) **POV tuner bar** with three big tactile buttons styled like old TV channel presets:

- **CH-1 · CAPT. REN** — official gold badge, medal icon. Label: "THE OFFICIAL STORY."
- **CH-2 · QIAO** — taikonaut blue, orbit icon. Label: "THE FLIGHT RECORD."
- **CH-3 · SERA VOSS** — defector red, broken-seal icon. Label: "THE TESTIMONY."

Tapping a channel "tunes" the scene: static burst, then the same event replays from the new POV (scenes the structure crew marks as multi-POV). Unavailable channels for a scene are greyed with a "NO SIGNAL" tooltip. A small "SYNC" indicator lights when all three POVs for an event have been viewed — that's the reader's cue that contradictions may be hiding there.

**TRUST readout — "WHO DO YOU BELIEVE?"** A fixed side panel (desktop, right edge) / collapsible drawer (mobile) showing three horizontal trust bars (Ren gold, Qiao blue, Voss red), each 0–100. Bars shift when: the reader picks a side in choice moments, catches a contradiction (trust drops for the liar, rises for the one vindicated), or asks a sharp counsel question at the hearing. The readout is styled like a polygraph / courtroom exhibit: "EXHIBIT T — CREDIBILITY INDEX," with a tiny needle-gauge aesthetic. It never shows exact math — bars animate smoothly, values are vibes, not scores.

**Contradiction caught — "CONTRADICTION LOGGED."** When the reader spots a discrepancy (taps the highlighted conflicting detail, or picks the right counsel question), the moment plays out in three beats: (1) the conflicting line **glitches** (RGB-split shake, 600ms) and a red stamp slams down rotated −8°: `CONTRADICTION LOGGED`; (2) both versions pin side-by-side in a "VS" split card with the delta highlighted (e.g., *"burn duration: 11 min"* vs *"burn duration: 47 min"*); (3) the contradiction flies into the **Contradiction Ledger** (a case-file drawer, count badge increments: `DISCREPANCIES: 3/9`), the liar's trust bar drains with a descending tick sound-alternative (visual only), and the secret-ending progress ticks up. The ledger is always reviewable — it's the key to THE THIRD TRUTH.

---

## 4. KEY COMPONENTS

### (a) Hero — "EXHIBIT A: THE ACTUAL STOLEN MOON"
The real NASA Cassini photo (`images/saturn/mimas.jpg`) is the hero, revealed with ceremony. Sequence: black screen → typewriter text: *"The following is a genuine NASA Cassini photograph. It shows the victim."* → photo fades in inside an evidence-bag frame (heat-seal border, exhibit tag `EXHIBIT A — MIMAS, 396 KM, PRE-TOW`, chain-of-custody sticker). Herschel crater gets a pulsing annotation ring on load with the label *"Herschel Crater, Ø 130 km. The crack starts here."* A tap toggles a "mugshot mode" overlay: height/weight-style placard (`NAME: MIMAS / STATUS: STOLEN / LAST SEEN: SATURN`). **Do not crop out Herschel** — the crater is the whole point. Slight Ken Burns drift on the photo; caption in archivist voice: *"Yes, the Death Star one. No, that's not a coincidence the crew noticed either."*

### (b) Heist-trajectory map — "THE LONG WAY HOME"
A stylized top-down solar-system map (Saturn → Jupiter gravity-assist flyby → Earth), drawn as a glowing orange trajectory arc on dark starfield. It's **scrubable**: a timeline slider from `T−214 days` to `T+0 (capture)` with play/pause. As the reader scrubs: the torch-ship + Mimas icon moves along the arc, a readout shows distance-to-Earth, velocity, and fuel/"torch-on" status, and event pins pop up at key beats (Lucky-77 demo, Herschel Slip, the cover-up burn). Jupiter flyby triggers a "GRAVITY ASSIST" flash + the trajectory visibly bending. Keep it schematic, not to scale — a footnote admits *"distances compressed; the solar system is embarrassingly large."* Mobile: map stacks above the slider; pins become a tappable event list.

### (c) Integrity / fracture meter — "THE HERSCHEL SLIP"
A circular cross-section diagram of Mimas (grey ice ball, Herschel crater divot at top) with an **integrity ring** around it (100% → green/white, degrading to alarm red). As the tow phase progresses (tied to the trajectory scrubber and story beats), a jagged crack visibly grows from Herschel's rim across the disc — SVG path that extends in stages, with small "icequake" shake on each growth spurt. Readout: `SHELL INTEGRITY: 78%` + status line that escalates: `NOMINAL` → `MICROFRACTURES` → `THE HERSCHEL SLIP — 40 KM` → `FRAGMENTATION RISK: KESSLER CASCADE`. The cover-up beat literally stamps `REDACTED` over the crack for a scene, then the archivist peels it back. This meter persists as a mini-widget in later scenes — the reader watches the number they were told ("a cosmetic fissure") vs. the number shown.

### (d) The hearing room — "YOU ARE COMMITTEE COUNSEL"
Full paper-card inversion: warm transcript page on dark background, stenographer line numbers, `Q.` (counsel = the reader) / `A.` (Voss) typography in mono. At decision points the transcript pauses and a **question picker** slides up: 2–4 counsel questions as "filed motions" (e.g., *"Ask about the burn duration."* / *"Ask what she was promised."* / *"Let her keep talking."*). Picking the contradiction-exposing question triggers the CONTRADICTION LOGGED sequence (§3); soft questions build Voss's trust bar but may miss the discrepancy (it's logged as "UNASKED" in the ledger — catchable on replay). A gallery/audience reaction line in italics after big answers (*"— audible gasp from the press gallery —"*) keeps the goofy-doc energy. Witness portrait: **no real persons depicted** — Voss is a redacted silhouette / document icon, never a face.

### (e) Footnotes & archivist's marginalia
Footnotes are **tappable superscript markers** that pop a marginalia card (desktop: slides in from the right margin; mobile: bottom sheet) in the Archivist's teal voice — the goofy-doc narrator lives here: *"The math checks out, which is the most upsetting part."* / *"Translator's note: he absolutely said the quiet part out loud."* Some footnotes are redacted first — tap the black bar and it **wipes away** with a marker-squeak visual to reveal the spoiler underneath. Marginalia also include "math checks" (real orbital-mechanics asides, e.g., delta-v napkin math) and callback jokes that reward replay.

### (f) Endings screen — "CASE CLOSED?"
Each ending gets a full-screen **declassification stamp ceremony**: the ending title slams down as a giant rotated rubber stamp (`THE OFFICIAL STORY` in gold, `THE TESTIMONY` in red, `THE THIRD TRUTH` in black-on-teal with a "need-to-know" seal, `HERSCHEL'S FALL` in cracked alarm-red with a shattering-glass effect). Below: a one-paragraph archivist verdict, the final TRUST readout frozen as "the committee's finding," and stats (discrepancies caught x/9, POVs synced, time). Buttons: `REOPEN THE FILE` (restart), `REVIEW THE LEDGER` (contradiction recap), and for locked endings a greyed stamp showing the unlock condition (*"Catch 6+ contradictions to unlock"*). **Gating must be exact:** Official Story = finish without enough contradictions; Testimony = side with Voss at the final choice; Third Truth = contradiction threshold met (secret — never name the number in-UI beyond a hint); Herschel's Fall = trigger via the dark path (ignore/deny the Slip at key beats).

---

## 5. MOTION & MICRO-INTERACTIONS (8)

1. **Redaction wipe:** black bars over spoilers wipe away on tap with a diagonal marker-stroke animation, revealing text beneath — used for footnotes, the covered-up crack, and Qiao's redacted flight log lines.
2. **Rewind transition:** jumping to a past layer plays a 500ms VCR-style rewind — timestamp counter spins backward, tracking-line glitch, then the new scene drops in. Forward jumps get a "fast-forward" variant.
3. **Contradiction glitch:** when two POVs disagree on screen, the contested line does a 600ms RGB-split shake before the CONTRADICTION LOGGED stamp slams down (rotated, with a paper-thud scale bounce).
4. **Stamp slam:** all stamps (EXHIBIT, DECLASSIFIED, CONTRADICTION LOGGED, ending titles) animate as: drop from above with slight rotation → overshoot bounce → ink-bleed settle. ~450ms, deeply satisfying.
5. **Trust-bar drain:** when a POV is caught lying, their trust bar drains with a red flash and descending tick marks; the vindicated POV's bar pulses once. Pure CSS/JS animation, no audio dependency.
6. **Torch flicker:** the Long Torch drive status light (map + scene chrome) flickers orange like a barely-contained fusion flame whenever the torch is "on" in-story; it gutters and dies at the Herschel Slip moment.
7. **Ledger fly-to:** on catching a contradiction, a mini stamp icon flies from the scene to the Contradiction Ledger badge (FLIP-style animation), badge count increments with a pop.
8. **Archivist's sticky-note peek:** teal sticky tabs on scene edges wiggle on hover/tap; tapping flips them open to reveal the marginalia card with a paper-curl effect.

*Motion rules: all animations respect `prefers-reduced-motion` (crossfade only, no shake/glitch). No autoplay audio anywhere; any sound-alternative is visual.*

---

## 6. MOBILE + ACCESSIBILITY

- **Mobile-first layout:** single column; POV tuner becomes a sticky top bar with three compact channel buttons; trust readout becomes a collapsible drawer (default collapsed, badge shows leader); trajectory map stacks map-over-slider; hearing question picker is a bottom sheet.
- **Touch targets:** all interactive elements ≥ 44px; redaction bars, footnote markers, and contradiction hotspots get generous padding.
- **Readability:** body text ≥ 16px, line-height ≥ 1.6; paper cards keep dark-on-light contrast ≥ 7:1; orange/teal accents never used for body text on dark (decorative + large text only, or paired with dark backing).
- **Reduced motion:** `prefers-reduced-motion` disables glitch/shake/rewind; stamps fade in; scrubber still works.
- **Screen readers:** layer changes announced via `aria-live` ("Now entering: The Hearing, Day 4"); trust bars have `role="meter"` with values; contradiction moments announce "Contradiction logged"; stamps are decorative (`aria-hidden`) with text equivalents in the DOM.
- **No time pressure:** scrubber, question picker, and choices never auto-advance; the 10–15 min runtime is reader-paced.
- **Keyboard:** full tab order through POV tuner, choices, question picker, footnotes, ledger; visible focus rings in signal orange.

---

## 7. BUILDER NOTES — DO NOT BREAK

1. **The real photo is sacred.** `images/saturn/mimas.jpg` (real NASA Cassini image) is EXHIBIT A and the hero. Never substitute a generated/illustrated moon. Keep Herschel crater visible — no cropping it out. Credit line: "NASA / Cassini" in the exhibit tag.
2. **Four endings, exact gating.** Official Story (default finish), Testimony (final choice sides with Voss), Third Truth (secret — unlocked only at the contradiction threshold; never display the threshold number plainly), Herschel's Fall (dark path — deny/ignore the Slip at key beats). Test all four paths; a reader must never be soft-locked out of finishing.
3. **No real persons depicted.** Ren, Qiao, Voss are fictional. No photographic faces for any character — silhouettes, document icons, redacted ID photos only. No real agencies' actual seals; all stamps are clearly fictional ("LUNAR RECOVERY COMMITTEE" etc.).
4. **Static only, no backend.** All state (trust values, ledger, ending flags) in client-side JS (localStorage for "reopen the file" continuity is fine). No network calls except loading local assets.
5. **Contradiction ledger is the spine.** The 9 contradictions from the structure crew's contradiction map must each be catchable in-UI, logged in the ledger, and reflected in trust bars. If a contradiction exists in script but has no catch interaction, that's a bug.
6. **Temporal layers must stay visually distinct.** The ribbon/badge system (§2) is load-bearing for comprehension — never render a scene without its layer badge, and never reuse one layer's chrome for another.
7. **Tone guardrails.** Goofy-doc, meme-aware, unscary. Thriller bones + real science stay; nothing graphic (the Slip is an engineering disaster, not body horror). Footnotes carry the jokes; the main narrative stays propulsive.
8. **Performance.** One hero image + SVG/CSS effects; keep total page weight modest for mobile. All "footage" degradation is CSS (scanlines, noise via SVG filters), not video files.
