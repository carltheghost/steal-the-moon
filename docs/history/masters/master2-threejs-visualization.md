# MASTER 2 — THREE.JS VISUALIZATION SYSTEM ("Steal the Moon")
**Round 1 proposal.** Canon files: `data/{canon,chain,core,characters,scenes,declassification,stills,moons}.json` — all scene parameters derive from these; the viz layer reads numbers, never hardcodes narrative.

---

## 1. SCENE ARCHITECTURE

**One persistent scene, mode-switched — never rebuilt.**

- **Renderer:** single `WebGLRenderer` (WebGL2, `antialias:true` on desktop tier only), `outputColorSpace: SRGB`, `toneMapping: ACESFilmic`, `powerPreference:'high-performance'`. `pixelRatio = min(devicePixelRatio, 2)`; drops to ≤1.5 dynamically if frame time > 19ms for 60 consecutive frames.
- **Scene graph:** one `THREE.Scene` + one `SceneDirector`. Each sceneMode owns a root `THREE.Group` created once at boot: `gTimeline, gFlyby, gCloud, gShepherd, gBilliards, gCore`. Switching modes = toggle `visible`, run `director.enter(mode)` (camera tween + state load), never dispose/recreate. Shared roots always present: `gStarfield` (Points, 4k), `gHonesty` (badge sprites — WebGL-safe redundant with DOM badge), `gShared` (pooled bodies: Saturn/Jupiter/Earth/Titan/Rhea/Dione/Mimas instanced shells reused across modes).
- **Cameras:** one persistent `PerspectiveCamera` (45°). A `CameraRig` per mode (position/quaternion/up targets) lerped via damped tween on `enter()`. Modes define their own rig; `OrbitControls` attaches only in FLYBY/CLOUD/SHEPHERD/BILLIARDS/CORE modes, detached (not destroyed) otherwise.
- **Object pooling:** 
  - `LinePool`: preallocated `BufferGeometry` strips (Float32Array max verts) reused for trajectory lines; `drawRange` adjusts per sim. No per-frame allocation.
  - `PointPool`: `THREE.Points` clouds for ghosts/atlas with preallocated buffers; visibility via shader alpha, not add/remove.
  - `SpritePool`: billboard markers (encounter flags, aim marker, moon labels) — one `InstancedMesh` of quads + per-instance data texture.
  - `MeshPool`: LOD moon meshes; pool of 8 geometries reused with per-mesh scale/material.
- **Render loop:** single `requestAnimationFrame`; `SceneDirector.update(dt, state)` delegates to active mode only; inactive groups skip update and are culled by `visible=false`. Fixed-step sim accumulator (dt=1/60, max 4 steps) keeps determinism; render interpolation off — deterministic frames required for stills.
- **WebGL vs DOM split per mode:**
  - WebGL owns: trajectories (line strips), bodies (instanced/sprite spheres), ghost cloud (Points), billiards encounter geometry, core cutaway meshes, charge depth markers, shockwave rings, freeze-frame flash quads.
  - DOM/CSS owns: all archival chrome — timeline scrubber, Δv meter numerals, probability readouts, truth-grammar legend, encounter OBSERVED/PREDICTED cards, honesty badge text ("SCHEMATIC — NOT TO SCALE"), presenters' dialogue, Hearing replay summary. DOM overlays never drawn in WebGL; WebGL never renders text except tiny sprite labels for bodies.

---

## 2. PER SIM RENDER PLAN

**Shared inputs:** `canon.json` (route waypoints, 4,200-day ephemeris table, Δv budget 35.0 km/s), `chain.json` (12-link sequence), `moons.json` (293 entries), `core.json` (core radius 159 mi/2, mineral zones, charge depths 2/7/17/25 mi).

### S1 — Scrubbable trajectory timeline (presenter: Dotty)
- Route line: one `Line` strip, 8,400 verts (2/day from canon ephemeris), vertex-colored (cruise teal → assists gold → Jupiter flyby orange → capture white). Log2-compressed display positions, precomputed once.
- Mimas marker: one sprite + glow; scrubber sets `t` → marker lerps along strip; assist-node rings (Saturn, Titan, Rhea, Dione, Jupiter, Earth) = 6 torus sprites, pulse on arrival.
- Camera: slow auto-orbit around system barycenter, user drag = orbit offset; scrub doesn't move camera (deterministic framing).

### S2 — Jupiter flyby tweak sandbox (presenter: ARGUS)
- Archive path: cyan `Line` strip (nominal r_p = 1.20 R_J from canon). Player path: amber `Line` strip recomputed live from drag — physics stub maps aim offset → new r_p → resamples a precomputed conic family (no integration at runtime; 512-point strip from lookup table).
- Aim marker: draggable sprite (raycast against flyby plane); Jupiter: shaded sphere w/ banded procedural shader; encounter corridor: translucent tube showing capture vs miss.
- Camera: fixed offset view of Jupiter system, slight parallax on drag; no orbit (mobile-safe).

### S3 — Live delta-v meter (presenters: Ren + Dotty)
- Torch gauge: 3D arc (TorusGeometry partial) around Mimas sprite filling as Δv spends toward 35.0 km/s reserve; tick marks at canon burn events (from canon.json burns array).
- Burn plumes: additive cone sprites at burn nodes on the S1 strip (reused line group, dimmed). Numerals in DOM; WebGL only shows arc + plume intensity.
- Camera: chase-cam behind Mimas marker along trajectory — position = f(scrub t) on strip, lookAt marker.

### S4 — Monte Carlo probability cloud (presenters: ARGUS + Dotty)
- 5,000 ghost trajectories: ONE `THREE.Points` (not lines) — 5,000 pts × 64 samples = 320k points max, but rendered as per-ghost single points animated along precomputed curves via shader: each point stores (ghostId, sampleT); vertex shader computes position from a 64×3 texture of the nominal path + per-ghost offset texture (precomputed CPU once from canon dispersion params). **1 draw call, ~2 draw calls total.**
- Density heat: same Points with additive blending = cloud glow; final capture-probability readout DOM.
- Camera: pulled-back system view; slow drift.

### S5 — Shepherd nudge mini-game (presenter: Qiao, Mimas-centered)
- Mimas at origin; 3 shepherd bodies (from chain.json link context) as instanced spheres on eccentric orbits; nudge impulse = expanding ring shockwave (shader ring mesh, pooled ×8).
- Player nudges via click/tap → raycast to orbital plane → impulse vector; trajectory of Mimas strip re-tints (green = within tolerance, red = drifting).
- Camera: fixed Mimas-centered, slight follow-rotation; tap targets ≥48px.

### Billiards encounter renderer (12-link nuclear chain)
- Local Saturn-system frame per link: Saturn + target moon instanced, explosion = pooled flash quad + shockwave rings (custom shader, 0.5s freeze implemented as sim-time pause while render continues — the 0.5s freeze is time-stop, not frame-stop).
- OBSERVED vs PREDICTED: two line strips overlaid — solid (observed) vs dashed (predicted, `LineDashedMaterial`), dotted hypothetical, double-line disputed (two offset solid strips). Post-freeze outcome banner DOM; outcome classes: SMASH / PASS THROUGH / GRAVITY ASSIST / CRASH INTO MOON / MISS.
- Rule honored in layout: explosion flash quad sized to ≤10% viewport, changed-orbit strip drawn across 90% of frame width.
- 293-moon atlas: ONE `Points` (293 pts, irregular moons) + 12 major moons as instanced LOD meshes (icosahedron detail 1, procedural craters via vertex noise seeded per moon id). Local LOD: mesh shown only within camera distance threshold.

### Core cutaway + charge viz ("THE THING INSIDE THE THING")
- Mimas sphere (radius scaled): outer shell = clipped hemisphere via `material.clippingPlanes` (one global plane, mouse-draggable normal/offset). Three toggles: Seismic (zone-colored shells by mineral zones from core.json), X-ray (additive transparent shells, core glowing), Exploded (concentric shells separated along radial axis, lerp).
- Core: 159-mile heterogeneous core mesh with zoned mineral bands (vertex colors from core.json zones); Herschel crack = procedural darkened groove (displaced vertices along seeded great-circle arc).
- Arrival state (~199 mi): outer shell shows metal core + 20-mile ocean band (translucent blue shell) + metallic massifs (gold/silver instanced cones, metalness 1).
- Charges: 4 depth markers at 2/7/17/25 mi sinking animation (lerp inward over timeline) + stress wave rings expanding through shell on detonation (pooled ring shader).

---

## 3. DISPLAY-SPACE MAPPING

**Physics space → Display space is mode-specific, always via one documented transform; the badge never lies.**

- **Trajectory modes (S1/S3/S4):** radial log2 compression: `r_disp = R0 * log2(1 + r_phys / R_ref)` (R_ref = 1 R_Saturn-ish scale from canon.json `display` block); angles preserved. Distances shown in DOM always use physics values (246 mi / 396 km departure, r_p 1.20 R_J, 4,200 days, 35.0 km/s).
- **S2 Flyby:** local Jupiter frame, linear scale (no compression needed at this range); r_p readout in R_J (physics units, linear = honest locally).
- **S5 Shepherd:** Mimas-centered linear frame, Hill-sphere-scaled; impulse vectors in m/s shown DOM.
- **Billiards:** per-link Saturn-local frames; inter-link jumps fade through starfield (no fake continuous zoom). Atlas: same log2 radial as trajectory for consistency.
- **Core cutaway:** pure linear scale (body-scale, no compression); scale bar in DOM ("159-mi core").
- **Honesty badges:** permanent DOM badge top-left of canvas in every mode: `SCHEMATIC — NOT TO SCALE`. WebGL duplicate: tiny corner sprite in `gHonesty` as redundancy if DOM is stripped. Scene 10 (THE HEARING) replay keeps badge on.

---

## 4. STILLS — 11 exhibit stills as renderable views

`stills.json` defines 11 entries: `{ id, mode, camera: {pos, lookAt, fov}, state: {t or linkIndex or chargePhase, toggles}, seed }`. Capture pipeline:

1. `StillCapture.capture(stillId)`: set mode → apply state snapshot (scrub t / chain link / core toggle / ghost seed) → set camera preset exactly → render 3 deterministic warm-up frames (fixed dt) → `renderer.domElement.toDataURL('image/png')` (with `preserveDrawingBuffer:true` only during capture, off otherwise).
2. Stored: PNG dataURL + sidecar JSON (mode, state, camera, canon file hashes) written to exhibit manifest; files land in `exhibits/` for the static build.
3. Deterministic: seeded RNG (mulberry32) for cloud ghosts/craters; fixed-step sim → identical pixels across runs. Each still re-capturable from its sidecar — "renderable views," not screenshots of chance.

---

## 5. MOBILE + FALLBACK TIERS

**Tier detection:** `WebGL2` support + `deviceMemory`/`hardwareConcurrency` heuristics + screen width.

- **Desktop full:** all above; 5,000 ghosts; pixelRatio ≤2; 4k starfield; shadows off (baked/AO faked); target 60fps@1080p, ≤2000 draw calls, ≤100MB GPU.
- **Mobile reduced:** 500–1,000 ghosts (Points shader identical, smaller buffer); S2 becomes SVG/DOM sandbox (same aim-marker math, DOM-rendered path — WebGL canvas hidden for that scene); S5 becomes DOM/SVG tap game (Mimas-centered 2D projection, same impulse logic); atlas Points only (no LOD meshes); pixelRatio ≤1.5; antialias off; starfield 1.5k. Auto-degrade: frame-time governor steps pixelRatio down then ghost count.
- **No-WebGL:** full DOM/SVG fallback — static trajectory SVG (from canon ephemeris), pre-rendered still PNGs for encounters/core, S2/S5 as SVG games, S4 as static cloud texture (pre-rendered PNG from the same shader via offscreen capture at build time). All narrative + numbers intact; only 3D interactivity lost.
- **Reduced motion** (`prefers-reduced-motion` or manual toggle): no auto camera drift; 0.5s encounter freeze becomes instant cut; shockwave rings become static outlines; cloud ghosts render as single static frame; scrub/tweens become instant jumps; particle counts unchanged (no vestibular triggers, no flashing).

---

## 6. OPEN-SOURCE NEEDS

**Pin: `three@0.186.0`** (MIT; verified current stable line as of Sept 2026 — r184 stable Apr 2026, r186 latest). Load via npm + lockfile for build; CDN fallback `https://cdn.jsdelivr.net/npm/three@0.186.0/...` with importmap. Zero other runtime deps — no paid services, everything client-side per brief.

- **`three/addons/controls/OrbitControls.js`** — camera orbit in FLYBY/CLOUD/BILLIARDS/CORE modes. Justification: battle-tested, touch + wheel; we detach (not destroy) per mode. Deliberately *not* used in S1/S3/S5 (fixed rigs = determinism).
- **`three/addons/utils/BufferGeometryUtils.js`** (`mergeGeometries`) — merge static geometry (assist rings, tick marks, massifs) into single draw calls. Justification: direct draw-call budget lever.
- **Custom GLSL only** for: ghost-cloud vertex displacement, shockwave rings, dashed truth-grammar lines (beyond LineDashedMaterial for animated dash offset), ocean shimmer, fur-free — no, that's another master. No post-processing chain.
- **Deliberately NOT used:** EffectComposer/UnrealBloomPass (bloom via additive sprites = 10× cheaper, no extra render targets); any physics engine (paths are precomputed/lookup — determinism + perf); GLTFLoader/model assets (all geometry procedural — zero asset weight, matches "no paid services"); react-three-fiber or any framework wrapper (vanilla module = smallest bundle, full control of the one-scene invariant); PointsMaterial for ghosts (custom ShaderMaterial required for per-ghost curve lookup).

---

## 7. TOP 3 RISKS

1. **Ghost-cloud shader perf cliff on mobile GPUs (320k points, texture lookups).** Mitigation: mobile tier drops to 500–1,000 ghosts (16k–64k points); point size attenuation off on mobile; static-cloud-texture fallback pre-rendered at build; frame governor sheds ghosts before pixels.
2. **Context loss on mobile (background tab / memory pressure) mid-story.** Mitigation: listen `webglcontextlost` → show DOM "tapestry paused" card (narrative-safe), `webglcontextrestored` → rebuild from pooled buffers + re-apply current mode state from the deterministic state snapshot (all mode state is serializable: `{mode, t, linkIndex, toggles, aimOffset}` — restore is exact, not approximate). All GPU buffers re-uploadable from CPU-side typed arrays we already keep.
3. **Draw-call / memory creep from 11 scenes × 6 modes in one persistent scene.** Mitigation: hard budgets enforced in code — `Director` asserts draw calls ≤2000 and GPU mem ≤100MB in dev builds (via `renderer.info` + estimated buffer sizes); groups hidden = skipped entirely; pooled everything; procedural textures ≤512px; atlas is 1 Points + 12 instanced meshes max. If a mode exceeds budget in QA, its LOD tier engages automatically (same path as mobile degrade).
