# MASTER 2 (three.js visualization) — Round 3 ratification ballot

Date: 2026-09-19. Reviewed only my assigned items: F8, F10, F13, F14, and open item §6.10. Settled items (0.186.0 pin, mobile display-only, pre-rendered stills, 41×41 LUT) not reopened.

## Verdicts

**F8 — 6 shepherd bodies from `STEAL.config.shepherdN` (not hardcoded 3): SIGN OFF.**
Render loop iterates the chain.json body list keyed off `STEAL.config.shepherdN`; 3 nudgeable + 3 corridor-context distinguished by data flags, not by me. No new math, no camera changes. Accepted.

**F10 — Sim API contract: SIGN OFF.**
- Aim sprite writes `STEAL.trajectory.aimDx/aimDy`, reads back only via `recompute(STEAL)` — no private aim copies in my scene graph; sprite position becomes a pure projection of STEAL state.
- S2 strip built by bilinear sampling of the 41×41 LUT → `conicPath` — geometry is a deterministic function of the LUT, which is canon-fixed and seeded (`0xC0FFEE`), so the strip can be built once per aim change and cached; no per-frame cost concern.
- S4/S5 STATIC tiers call `s4Ghosts()` / `s5StateAt()` — confirmed; this contract *removes* math from my domain, which I welcome. Nothing reimplemented, nothing renamed.

**F13 — LineStyle truth grammar (M5 owns tokens, M2 consumes in shaders/WebGL): SIGN OFF.**
Solid = observed · dashed = predicted · dotted = hypothetical · double = disputed; billiards forensic view gains the INTENDED dotted-slate third layer from `intendedPath[]`. Consuming is implementable: dashed/dotted map to dash-pattern shader uniforms, double renders as two offset lines, never color-only. No objection.

**F14 — Plate furniture: M5 owns DOM `plate-frame`, M2 feeds canvas bitmaps, M4 feeds gag slots: SIGN OFF.**
Ownership split is clean and ends the triple-building risk. My side of the contract: I render WebGL/still bitmaps into my canvas; M5's plate-frame positions and frames it.

**§6.10 — ARGUS status-line hook: DECIDED — no GL status line; ARGUS politeness lives in DOM chrome.**
Rationale: (1) DOM is the single accessible status surface (aria-live, screen readers, mobile where canvas is display-only); a GL status line would be invisible to assistive tech and dead weight on the mobile tier. (2) GL text sprites require texture re-renders per status change — GPU churn for information that belongs to chrome. (3) No z-order or framing fights with M5's plate-frame. (4) The context-loss path already settles this pattern: M2 exposes `contextHealthy`, M3 gates commits, and "TAPESTRY PAUSED — RESTORING" lives in DOM. My GL-side politeness commitments (no sprite slot needed): pause rAF on `visibilitychange`, DPR caps per tier, `contextHealthy` exposure, and freeze idle animation under `STEAL.flags.reducedMotion`.

## Notes (non-blocking, build-phase)

1. **F13 token shape:** M5 to publish LineStyle tokens with GLSL-consumable values before build (dash/gap arrays, double-offset distance, dotted fragment pattern) alongside the CSS tokens — I need the exact export shape to consume in shaders.
2. **F10 LUT access:** confirm the 41×41 LUT ships as a typed-array export from M1's shared module that my strip builder can bilinear-sample directly (seed is canon-fixed, so build-once-per-aim is fine).
3. **F14 resize detail:** propose M2 owns the canvas element + `ResizeObserver` + DPR/viewport handling; M5's plate-frame owns the CSS box; M4's gag slots (`#seal`, `#moon-status`, `#corrections-counter`, `.insert-voss`, `.canon-reader-record`, `.committed-ring`) never touch the canvas element directly. Pre-rendered stills (settled primary): M2 blits the still bitmap into its canvas in STATIC tiers; M5 frames it the same as live GL.
4. **F8 rebuild hook:** M2 reads `STEAL.config.shepherdN` at render-init and rebuilds the S5 body group if it changes (canon constant at 6, but config-driven per fiat).
5. **§6.10 follow-through:** my DOM-chrome politeness items are implemented on my side as listed above; no further fiat needed.

**Summary: all five items resolved — F8/F10/F13/F14 SIGN OFF, §6.10 decided (no GL status line). Zero blocking objections.**
