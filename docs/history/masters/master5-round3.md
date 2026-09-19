# STEAL THE MOON — Round 3 ratification: M5 (visual design)

Date: 2026-09-19. Ratification round — SIGN OFF or BLOCK with a concrete alternative. Non-blocking notes separated.

## Verdicts

### F11 — Declass earning table + Δv gauge dual-pool lie: SIGN OFF

Meter math confirmed. Track = `dv.reserve` 0–35.0. Fill A (solid, truth-grammar solid=observed): reported pool, starts 14.2, depletes with main burns. Fill B (hatched-amber, ghost): 9.8 segment appended after reported, **rendered only when `dv.reconciled === true`** — until RECONCILE the gauge reads the lie (reported only). Post-reconcile total visible = 14.2 + 9.8 = 24.0 on the 35.0 track. B-3 torch-correction draws deplete the ghost segment post-reconcile. The −5 TRUST per declass grant (L0→L4 + FINAL) is a rail/delta readout, not gauge logic — no gauge interaction. Trust float display rounds to one decimal per merged schema (50.0 start).

### F13 — LineStyle truth-grammar tokens: SIGN OFF (ownership confirmed)

M5 owns the shared tokens and ships one module: token names, stroke descriptors, and a CSS block (DOM/SVG) + shader-side constants (M2 consumes; exact GLSL/CSS values are my output, published in build). Grammar: **solid = observed · dashed = predicted · dotted = hypothetical · double = disputed**. Never color-only — each style carries a text label in its first legend appearance. Billiards forensic triple layer: INTENDED renders as dotted-slate (hypothetical family), PREDICTED dashed, OBSERVED solid — the three `[]Path` arrays from M1's `billiardsSimulate()` map 1:1. `.committed-ring` is an annotation state (ring overlay on committed trajectories), not a 5th line style — confirmed.

### F14 — plate-frame component: SIGN OFF (ownership confirmed)

M5 owns the single DOM `plate-frame` component. One build, no triple-building. Slot contract: (a) canvas-bitmap mount slots — M2 feeds rendered bitmaps, no DOM re-layout from their side; (b) gag slots — M4 feeds `#seal`, `#moon-status`, `#corrections-counter`, `.insert-voss`, `.canon-reader-record`, `.committed-ring` into named slots, never touching frame chrome. I publish the slot API in build; both consumers mount into it.

### §6.7 — Lock-reason tap pattern spec (I owe it): ACKNOWLEDGED

One-line plan: tapping/clicking any locked element opens a dismissible reason chip ("Requires L2 · break the S1 seal" / "Rehearsal required — unrehearsed COMMIT costs +10d") with keyboard-focus + `aria-describedby` parity across DOM and canvas tiers; spec ships in the build visual doc.

### §6.8 — RUN archive card stamps: ACKNOWLEDGED

Card layout reserves a two-badge stamp row (`clearance_at_win` + `verdict`) under the run ID — compact badges, no card resize; ships in the build visual doc.

## Notes (non-blocking)

1. Ghost-segment aria: the hatched 9.8 segment gets an `aria-label` stating it is the declassified reserve ("Revealed after S3 RECONCILE"), so the visual lie is screen-readable without spoiling pre-reconcile state.
2. Honesty-label pairing: gauge legend first-appearance labels use the settled honesty-label set (no new copy invented).
3. No new tokens beyond F13's four styles + `.committed-ring` state; settled items (palette, honesty labels, STATIC-as-reduced-motion-only, OFL fonts) untouched.
