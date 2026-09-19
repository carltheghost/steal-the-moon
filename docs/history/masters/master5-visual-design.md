# MASTER 5 — VISUAL DESIGN SYSTEM: "Steal the Moon"

Single static page. CSS/SVG/canvas only. OFL fonts via Google Fonts CDN (self-host optional). Everything below maps to the canon palette + forensic grammar.

---

## 1. DESIGN TOKENS

### Color
| Token | Value | Use |
|---|---|---|
| `--paper` | `#E9E2D2` | page + plate ground |
| `--paper-2` | `#DFD7C2` | recessed panels |
| `--paper-3` | `#F2EDDF` | raised cards |
| `--ink` | `#202321` | body text, rules |
| `--ink-soft` | `#3A3D3A` | secondary text |
| `--slate` | `#667681` | structural blue-gray (borders, chrome) |
| `--slate-deep` | `#46525A` | dark chrome, headers |
| `--slate-wash` | `rgba(102,118,129,.14)` | tints, hover |
| `--cyan` | `#71A9AD` | canonical/archive path, OBSERVED |
| `--cyan-deep` | `#4E7D82` | cyan text on paper (contrast-safe) |
| `--amber` | `#C69A45` | fuel, uncertainty, PLAYER path, PREDICTED |
| `--amber-deep` | `#8F6E2C` | amber text on paper |
| `--red` | `#8E3434` | errors, stamps, redactions accents |
| `--red-wash` | `rgba(142,52,52,.10)` | error fields |

Truth-grammar line colors: OBSERVED=`--cyan-deep` on paper / `#71A9AD` on dark; PREDICTED=`--amber-deep`/`--amber`; HYPOTHETICAL=`--slate` at 60%; DISPUTED=`--red` double-line. Success/OK states: **cyan = archive/canonical**, never green.

### Type
- **Data/mono:** `'IBM Plex Mono'` (OFL) — 400/500/600. All numbers, labels, captions, code.
- **Headers:** `'Oswald'` (OFL) 600/700, uppercase, letter-spacing `.04em` — EXHIBIT 13D plates, section heads.
- **Marginalia:** `'Caveat'` (OFL) 600 — Dotty handwriting. Decorative-only; never carries essential info (redundant with mono caption).
- **Type scale (clamp):** `--fs-hero: clamp(2rem, 5vw, 3.5rem)` (Oswald 700); `--fs-h2: clamp(1.25rem,2.6vw,1.75rem)`; `--fs-body: clamp(.95rem,1.6vw,1.05rem)`; `--fs-mono: clamp(.72rem,1.5vw,.85rem)`; `--fs-tiny: .68rem` mono microcopy.

### Spacing / radii
`--sp: 1rem` base; scale 0.25/0.5/1/1.5/2/3/4. `--r: 3px` (paper, archival — no bubbly cards), `--r-lg: 6px`. Borders: `1px solid var(--ink)` primary rules, `1px dashed var(--slate)` secondary, `2px` for plate frames.

### Stamps & labels
- `.stamp`: Oswald 700 uppercase, `color: var(--red)`, `border: 3px double var(--red)`, `border-radius: 4px`, `padding: .25em .6em`, `transform: rotate(-4deg)`, `opacity: .88`, `mix-blend-mode: multiply`, slight `mask`/grunge via repeating-linear-gradient. Text: "DECLASSIFIED", "EXHIBIT 7B", "DO NOT MOVE".
- `.tape`: amber-wash translucent strip `rgba(198,154,69,.28)` with 45° hatch — seals plate corners.
- Redaction bar: `.redact { background: var(--ink); color: transparent; }` with `::after` label in mono tiny "▓ REDACTED — L2".
- Humor labels live here only (stamps, tape, marginalia, redaction tags), never in geometry.

### Paper texture (CSS only)
```css
body{
  background-color:var(--paper);
  background-image:
    radial-gradient(ellipse at 20% 10%, rgba(255,255,255,.35), transparent 50%),
    url("data:image/svg+xml,...feTurbulence fractalNoise baseFrequency=.9 numOctaves=2 opacity=.05...");
}
```
feTurbulence SVG data-URI at 4–6% opacity + a subtle vignette. No image assets.

---

## 2. SCREEN COMPOSITION SYSTEM

### Master layout (desktop ≥1024px)
Three fixed zones + one scroll region:

1. **Archive chrome (top bar, 56px):** left: `TOP SECRET / EXHIBIT 7B` Oswald plate tab; center: breadcrumb `DOSSIER ▸ <SECTION> ▸ <SCENE>`; right: declassification ladder L0–L4 mini-meter + "DOT" status dot. `background: var(--slate-deep)`, ivory text. Never scrolls away.
2. **Sim viewport (left/center, ~62%):** the active canvas/SVG stage, framed as an exhibit plate (see §3). Aspect 16/10 desktop.
3. **Evidence rail (right, ~38%):** scrollable column: hero line (one per view, Oswald), Dotty marginalia card, telemetry readouts (mono), control strip (sliders/buttons), "FILE AS EXHIBIT" capture button.
4. **Marginalia gutter (left edge, 44px, desktop only):** vertical strip of rotated Caveat notes + redaction tags. `aria-hidden`, decorative.

Scene switcher: a bottom drawer ("ARCHIVE INDEX") listing the 11 plates + 6 sims + atlas + codex as index cards; opens over viewport, `translateY` slide.

### Compositional grammar shared by all screens
Every screen = **one plate in the viewport + rail dossier**. 11 scenes, 6 sim screens, atlas, codex all instantiate the same DOM skeleton:
```
<section class="plate-screen">
  <div class="plate-frame">   <!-- viewport: canvas or svg -->
     <div class="plate-chrome">EXHIBIT 13D · title · scale label</div>
     <canvas|svg class="stage"/>
     <div class="dom-overlay"/>  <!-- labels, anchors, stamps -->
  </div>
  <aside class="rail"> hero line · marginalia · telemetry · controls </aside>
</section>
```
Human-scale anchor: a fixed rail module `.human-anchor` (mono: "≈ 1 Mimas = 396 km across — about the drive from X to Y" or a 1.8 m figure silhouette SVG next to Herschel crater depth). Present on every dense viz, never optional.

### DOM-over-WebGL layering rules
- z-order: canvas(0) → svg-annotation(10) → DOM labels(20) → stamps/tape(30) → modal/drawer(50).
- All annotation text is DOM/SVG, never baked into canvas/WebGL → crisp at any DPI, selectable, localizable.
- Pointer events: canvas gets them only in sim-interactive regions; labels `pointer-events:none` except controls.
- Seam rule: canvas background must be `transparent`; plate ground color comes from CSS so canvas and DOM always match. WebGL scenes use a paper-tinted fog/clear color sampled from `--paper` at runtime, not hard-coded.

---

## 3. EXHIBIT PLATE SYSTEM

### Plate furniture (identical on all 11 stills)
- **Header bar:** `EXHIBIT <n> · <TITLE>` Oswald left; right: `FIG. <n>` + honesty label mono tiny (`SCHEMATIC — NOT TO SCALE` or `DIVERGENCE ×12 EXAGGERATED`).
- **Scale bar:** bottom-left mono SVG scale with alternating black/ivory segments + labeled length.
- **Human anchor:** bottom-right: one-line mono comparison + optional silhouette.
- **Stamps:** 1–2 rotated red stamps top-right corner; amber tape strip on one corner.
- **Footer:** `SOURCE: <canon file>` mono tiny, e.g. `stills.json · plate 04`.

### Capture spec
"FILE AS EXHIBIT" button composites: plate-frame DOM (header/footer/stamps) + canvas bitmap → single PNG via `canvas.toBlob` for WebGL plus SVG-serialized overlay, drawn into an offscreen 2× canvas, exported 1600×1000. Filename `exhibit-7b-plate-<nn>.png`. Reduced-motion/static: capture from the SVG fallback directly.

### In-flow vs archive index
- **In-flow:** plates render at full compositional grammar inside the scene's viewport as the scene's hero visual.
- **Archive index:** 11 plates as contact-sheet cards (4-col desktop, 2-col mobile): thumbnail (the captured PNG or live SVG), EXHIBIT number, title, POV tag (`REN`/`QIAO`/`VOSS`/`DOTTY`), declassification lock state. Locked plates show redaction-bar cover with `REQUIRES L<n>`.

---

## 4. TRUTH-GRAMMAR & STATE VISUALIZATION

### Line grammar (identical in WebGL + SVG/DOM)
| State | SVG stroke | WebGL equivalent |
|---|---|---|
| OBSERVED (solid) | `stroke: cyan-deep; stroke-width:3; stroke-dasharray:none` | solid `THREE.Line`, cyan `#71A9AD` |
| PREDICTED (dashed) | `stroke: amber-deep; stroke-width:2.5; dasharray: 8 5` | `LineDashedMaterial`, `dashSize:.35 gapSize:.22` |
| HYPOTHETICAL (dotted) | `stroke: slate 60%; stroke-width:2; dasharray: 1.5 5; linecap:round` | dashed material, `dashSize:.02 gapSize:.18`, round points |
| DISPUTED (double) | two parallel strokes 3px apart, `stroke: red`, widths 2 | two offset lines, red `#8E3434` |

Every legend is a fixed DOM module `.legend` (four swatches, mono labels) pinned top-left inside the plate — same component on all screens. Divergence at a glance: cyan solid vs amber dashed split is the only trajectory comparison ever used; gap between them labeled `Δ = <value>` in amber mono with a bracket.

### Meters
- **Δv gauge (S3):** horizontal bar, ivory track, fill split: cyan (spent/archive) + amber (remaining/uncertainty). Tick marks every 100 m/s mono. Needle variant for dial screens: 180° arc, Oswald numerals.
- **TIME / Δv / TRUST triple meter:** three slim vertical bars side by side, mono labels beneath; TRUST drains as redaction lifts (visual irony: more truth, less trust — Dotty marginalia: "rude.").
- **ICE / SLIP / EXPOSURE (Herschel):** stacked segmented bars (10 segments each, filled squares), colors: ICE cyan, SLIP amber, EXPOSURE red. Segment = 10%.
- All meters: `<div role="meter" aria-valuenow…>` + redundant mono numeric readout. No color-only encoding.

---

## 5. POV & DECLASSIFICATION STYLING

### Four POV grammars (CSS classes on `.plate-frame`)
- `.pov-ren` — immaculate: no stamps, hairline 1px slate rules, generous whitespace, Oswald headers only, zero rotation, `--paper-3` ground. "Lab report."
- `.pov-qiao` — annotated: Caveat notes absolutely positioned with SVG leader arrows (`stroke: ink; dasharray 4 3`), one circled item per plate (`border:2px solid red; border-radius:50%`), a pinned note reading "Don't move this one." in Caveat. Slight `rotate(-1deg)` on notes.
- `.pov-voss` — redacted: heavy `.redact` bars over telemetry values, `filter: contrast(1.05)`; stamp `REDACTED BY ORDER` diagonal across plate at 12% opacity; some labels replaced with `▓▓▓`.
- `.pov-dotty` — bureaucratic overlays: form-field boxes (`border:1px solid slate; background:paper-2`) around readouts, `FORM 88-J` headers, rubber-stamp "FILED" in slate, checkbox glyphs `☐/☒` in mono, marginalia dense.

### Declassification ladder L0–L4
Global `body[data-declass="L<n>"]` attribute drives everything:
- **L0:** viewport shows plate at 8% opacity behind full-ink cover card: giant stamp `TOP SECRET`, mono "CLEARANCE L1 REQUIRED". Rail shows only hero line + locked telemetry (`▓▓▓`).
- **L1:** cover lifts (opacity/translate), plate visible but key numbers redacted; stamps `PRELIMINARY`.
- **L2:** numbers revealed; one annotation per plate still redacted (the "good stuff").
- **L3:** full plate; amber `DECLASSIFIED <date>` stamp; Voss plates get diagonal `OVERRULED` stamp.
- **L4:** adds Dotty's unredacted marginalia layer + "analyst notes" rail module.
- Progression animation: redaction bars `scaleX → 0` with `transform-origin: left`, 300ms, staggered 60ms — pure CSS, `prefers-reduced-motion` → instant.

### FINAL CANON [PARTIALLY UNREADABLE]
Dedicated end-plate: paper ground with charred-edge effect (radial-gradient darkening + feTurbulence displacement on an SVG frame), surviving text in Oswald/cyan, destroyed passages as irregular ink blots (SVG blobs, not bars — "burned, not redacted"), mono tag `RECOVERED 2051 — PARTIALLY UNREADABLE`. Stamps: `FINAL` (red) + `SORRY` (Caveat, Dotty).

---

## 6. MOBILE & REDUCED-MOTION DESIGN

### Phone collapse (<768px)
- Chrome compresses: breadcrumb → current scene only; ladder meter → `L<n>` chip.
- Viewport stacks above rail (viewport 16/10, min-height 240px); evidence rail becomes full-width stacked cards.
- Marginalia gutter hidden (`display:none`, `aria-hidden` anyway). Dotty notes move inline as a rail card.
- Archive index: 2-col contact sheet; bottom drawer → full-screen sheet.
- Controls: sliders ≥ 48px thumb (`::-webkit-slider-thumb {width:48px;height:48px}`), buttons `min-height:48px`, telemetry in 2-col grid.
- Human anchor + honesty label never hidden — they shrink to one line.
- Tap targets: everything interactive ≥ 44×44px; plate furniture non-interactive.

### Reduced-motion / static fallbacks
- `@media (prefers-reduced-motion: reduce)`: kill all transitions/animations (`* {animation: none !important; transition: none !important}`); canvas scenes render one static frame; WebGL → pre-rendered SVG fallback per sim (same plate furniture, same line grammar, "STATIC PLATE — MOTION OFF" honesty tag in header).
- Per-element substitutions:
  - S1 timeline scrub → stepped SVG frames with prev/next buttons.
  - S2 sandbox → side-by-side cyan vs amber static trajectories + Δ readout.
  - S3 gauge → static bar + number.
  - S4 ghost cloud → single SVG scatter with density contours.
  - S5 shepherd → formation diagram, numbered callouts.
  - Billiards cascade → numbered freeze-frame sequence (1→2→3).
  - Core cutaway → labeled SVG cross-section (always SVG anyway).
  - Declass lift → instant reveal, no stagger.
- Static aesthetic: the SVG fallbacks use the full plate furniture — they must look like deliberate archival plates, not error states. A tiny mono tag `STATIC` in the header marks them honestly.

---

## 7. TOP 3 RISKS

1. **Visual bloat (stamps/tape/notes on every plate).** 11 plates × furniture × POV treatments → clutter, slow paint. *Mitigation:* furniture is a single shared DOM component; POV = one class swap; cap of 2 stamps + 3 marginalia notes per plate enforced in the plate template; `content-visibility: auto` on off-screen plates.
2. **Canvas/DOM seam visibility.** WebGL clear color vs CSS paper mismatch, annotation misalignment on resize. *Mitigation:* transparent canvas over CSS ground (never paint paper in GL); all annotations in DOM/SVG overlay; resize via ResizeObserver re-fitting overlay coordinates; capture composites from the same overlay tree so export matches screen.
3. **Accessibility: contrast & focus.** Amber `#C69A45` and cyan `#71A9AD` fail on ivory at text sizes; red stamps decorative-but-meaningful. *Mitigations:* text always uses `--cyan-deep`/`--amber-deep`/`--red` (all ≥ 4.5:1 on `--paper` — verify with a contrast check in build); line grammar never color-only (dash patterns differ); every canvas/SVG has `role="img"` + `aria-label` + adjacent mono data table (visually collapsible); focus-visible 3px cyan-deep outline; Dotty marginalia `aria-hidden` with redundant mono captions; keyboard-operable sim controls (sliders are native inputs).

---

### Font loading (OFL, exact)
`Oswald:600,700` · `IBM Plex Mono:400,500,600` · `Caveat:600` via Google Fonts with `font-display:swap`; system fallbacks: `Impact, 'Arial Narrow', sans-serif` / `ui-monospace, Menlo, monospace` / `cursive`.
