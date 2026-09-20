# Steal the Moon — Wow Features (creative director brief)

Five showpiece features, each implementable in the static three.js build, each driven by real data or imagery baked in offline. None invents constants; fictional framing is always tagged.

**Shared chrome convention (apply to all five):** every feature carries a two-tag legend — a brass/amber `HEIST FRAME` tag on the fictional wrapper, a teal `REAL PHYSICS` tag on measured data — plus a source strip at the bottom citing the mission or paper behind the numbers.

## The Slingshot Ledger

- **The wow**: A top-down solar-system view replays Cassini's real 6.7-year, 2-billion-mile crime spree — two Venus kisses, one Earth flyby at ~1,166 km, a Jupiter nudge — showing the crew the only route to Saturn no rocket could afford alone.
- **Real-data backbone**: NASA/JPL Cassini trajectory timeline — launch 15 Oct 1997; Venus-1 26 Apr 1998 @ 284 km alt (+7 km/s); Venus-2 24 Jun 1999 @ 600 km; Earth 18 Aug 1999 @ ~1,166 km (+5.5 km/s); Jupiter 30 Dec 2000 @ 9.7 million km; Saturn orbit insertion 1 Jul 2004.
- **Build notes**:
  - Bake waypoints to `data/vvej.json`: date, planet, closest-approach km, Δv gain. Only verified numbers; no computed extras.
  - Three.js: flat ecliptic-plane scene, planets on uniform circular rails (semi-major axes 0.72/1.0/5.2/9.5 AU, not to scale in size); Cassini as an instanced sprite with a ribbon trail that brightens at each assist.
  - Each flyby fires a "ledger card": date, closest approach, speed stolen — with a red "direct route" ghost path that visibly fizzles short (no fake numbers, just a dead line).
  - Scrubber 1997→2004 with play/pause; clicking a planet node isolates its flyby card.
  - Performance trivial: 4 planets + one trail mesh. Everything offline; no ephemeris service.
- **Fiction label**: the timeline ribbon and ledger cards are tagged `REAL PHYSICS`; the sidebar asking "how does the crew steal a moon with the same trick?" is tagged `HEIST FRAME`.

## The Missing Day

- **The wow**: Two clocks on screen — Voyager's day and the rings' day — visibly drift out of sync until the planet's own spin runs minutes behind, and only ripples in the rings reveal which clock is real.
- **Real-data backbone**: Voyager 1981 radio: 10h39m22s; Mankovich 2019 ring seismology (ApJ, Cassini C-ring wave patterns): 10h33m38s; Cassini SKR ranged 10:36–10:48; Saturn's magnetic axis is nearly aligned with its spin axis, which is why radio tracking fails.
- **Build notes**:
  - Bake to `data/saturn-day.json`: the two published values, ±1m52s uncertainty, citations.
  - UI: two Saturn globes side by side, each with a marker line; a time-lapse control runs simulated days, and the ~5m45s/day deficit accumulates visibly (7 days → 40m15s of lag — real arithmetic, shown in a ticker).
  - C-ring overlay with propagating sine-modulated ripple rings that "read out" the faster 10:33:38 period.
  - One slider: "which clock do you trust?" — defaults to ring seismology.
  - Cheap build: two spheres, one torus stack, a time uniform in the shader.
- **Fiction label**: day-length values and the seismology story tagged `REAL PHYSICS`; the overlay copy about the crew's heist countdown being measured in "slippery Saturn days" tagged `HEIST FRAME`.

## Harbor Lights (Lakes of Titan)

- **The wow**: A 3D Titan rolls out of the haze and its north pole lights up with three methane seas — the only standing surface liquid outside Earth — each with its real shoreline mapped by Cassini radar.
- **Real-data backbone**: Cassini ISS 938-nm polar maps (NASA 2015, PIA17655/PIA11146) + RADAR — Kraken Mare ~400,000 km² (~1,200 km wide, ~Caspian Sea); Ligeia Mare 126,000 km² (500 km); Punga Mare ~390 km across; liquid methane/ethane; north-polar concentration.
- **Build notes**:
  - Bake `data/titan-lakes.json`: per sea — name, area, width, centroid, and a low-poly shoreline polygon (~64 pts) digitized from the 2015 polar maps.
  - Three.js: Titan sphere with an orange-haze fresnel shader; a "haze off" toggle swaps in the baked 938-nm near-IR base map, explicitly labeled "haze-penetrating IR, not visible light"; seas rendered as glossy dark meshes at the north pole.
  - Hover/click a sea → fact card: real size, which Cassini instrument measured it, Earth comparison (Kraken ≈ Caspian Sea).
  - Optional methane-cycle overlay (evaporation → clouds → rivers → seas) animated as arrow sprites.
  - All textures baked at 1024², local files, zero network.
- **Fiction label**: sizes, instruments, and chemistry tagged `REAL PHYSICS`; the "refuel depots for the getaway fleet" framing tagged `HEIST FRAME`.

## Plume Clock

- **The wow**: Scrub Enceladus around one orbit and watch its tiger-stripe geysers flare from a dim hallway to a brightly lit office — 3–4× brighter at the far side of the orbit — exactly as Cassini's VIMS saw it.
- **Real-data backbone**: Hedman et al. 2013, *Nature* 500:182–184 — 252 VIMS images (2005–2012): plume brightness peaks near true anomaly ~180° (apocentre), several times brighter than at pericentre; tidal stress opens and closes the four tiger-stripe fissures; Enceladus ~505 km across.
- **Build notes**:
  - Bake `data/enceladus-plume.json`: brightness curve B(true anomaly) as a simplified peak-at-180° curve, explicitly labeled "illustrative fit to Hedman 2013," not raw figure data.
  - Three.js: Enceladus on a visibly eccentric orbit around Saturn; the plume is an additive particle fan from the south pole whose opacity follows B(anomaly); anomaly scrubber plus auto-play.
  - Tidal-stress glyph: squeeze/stretch arrows on the moon at pericentre vs apocentre.
  - "Freeze at apoapsis" button holds the bright state for a screenshot moment.
  - ~2k particles in one draw call; fully offline.
- **Fiction label**: the brightness curve and tidal-stress explanation tagged `REAL PHYSICS`; the overlay line "the crew times the heist to the geyser clock" tagged `HEIST FRAME`.

## Thread the Gap

- **The wow**: A knife-edge side view of the Cassini Division — ~4,800 km of near-nothing between the B and A rings — where you drag a probe through the baked radial density profile, feel every ripple Mimas carved, then thread it for real.
- **Real-data backbone**: Cassini Division spans 117,580–122,170 km from Saturn's center, carved by Mimas's 2:1 mean-motion resonance; radial optical-depth profile baked from published Cassini UVIS stellar-occultation geometry (shape only, simplified).
- **Build notes**:
  - Bake `data/division-profile.json`: sampled τ(r) across the gap (a few hundred points), labeled "simplified profile shape."
  - Three.js: edge-on ring slab with per-fragment optical depth driven by the profile via a custom shader on a radial strip; named sub-gap markers (Huygens Gap etc.); radial axis honestly log-scaled with km labels.
  - Mode 1 "survey": scrub the radius, read τ and km at the cursor.
  - Mode 2 "thread it": drag the probe through; entering τ above threshold drains the shield; crossing under budget = "clean escape."
  - Local geometry only; the whole scene is two meshes plus the probe.
- **Fiction label**: division width, location, and resonance cause tagged `REAL PHYSICS`; the "heist's escape corridor" framing plus the shield budget tagged `HEIST FRAME`.
