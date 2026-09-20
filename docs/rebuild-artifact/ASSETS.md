# ASSETS.md — Artifact Rebuild Bake List

Exact asset list for the Steal the Moon artifact builder. **No invented URLs, no invented credits.**
Every NASA URL below is copied verbatim from `data/nasa-imagery.json` (10 records,
18 HTTP-200-verified variants). Only the variants listed here are approved for
download; missing variants on images-assets.nasa.gov return HTTP 403 and must not
be attempted.

Source-of-truth ordering: this file < `data/nasa-imagery.json`? No — the JSON is
the source of truth. If this file and the JSON disagree, the JSON wins.

---

## 1. NASA imagery bake table (all 10 records)

| # | Subject | PIA | Credit (verbatim) | Approved URL(s) | Intended use |
|---|---|---|---|---|---|
| 1 | Saturn mosaic — "The Day the Earth Smiled" | PIA17172 | NASA/JPL-Caltech/Space Science Institute | `https://images-assets.nasa.gov/image/PIA17172/PIA17172~orig.jpg` · `https://images-assets.nasa.gov/image/PIA17172/PIA17172~medium.jpg` | Hero texture: scene background plate / iconic wide shot — Saturn + full ring system + Earth pale-blue dot, natural color, July 19 2013 eclipse mosaic |
| 2 | Mimas close-up — "Flying by the Death" | PIA12570 | NASA/JPL-Caltech/Space Science Institute | `https://images-assets.nasa.gov/image/PIA12570/PIA12570~orig.jpg` · `https://images-assets.nasa.gov/image/PIA12570/PIA12570~medium.jpg` | Photo-compare: closest-ever Cassini flyby (Feb 13 2010), Herschel Crater dominates, "Death Star" view |
| 3 | Mimas global map — June 2017 | PIA17214 | NASA/JPL-Caltech/Space Science Institute | `https://images-assets.nasa.gov/image/PIA17214/PIA17214~orig.jpg` · `https://images-assets.nasa.gov/image/PIA17214/PIA17214~medium.jpg` | Hero texture: equirectangular Mimas texture for the 3D sphere (216 m/px, includes Herschel; updated with Nov 2016 / Feb 2017 flyby data) |
| 4 | Enceladus — "Approaching Enceladus" | PIA17202 | NASA/JPL-Caltech/Space Science Institute | `https://images-assets.nasa.gov/image/PIA17202/PIA17202~orig.jpg` · `https://images-assets.nasa.gov/image/PIA17202/PIA17202~small.jpg` | Photo-compare: approach view before closest-ever dive past active south polar region; cratered northern latitudes → fractured terrain |
| 5 | Titan — "Peering Through Titan Haze" | PIA20016 | NASA/JPL-Caltech/Space Science Institute | `https://images-assets.nasa.gov/image/PIA20016/PIA20016~orig.jpg` · `https://images-assets.nasa.gov/image/PIA20016/PIA20016~medium.jpg` | Photo-compare: infrared composite from VIMS, T-114 flyby Nov 13 2015, peering through the haze |
| 6 | Rhea — "Rhea Day in the Sun" | PIA17155 | NASA/JPL-Caltech/Space Science Institute | `https://images-assets.nasa.gov/image/PIA17155/PIA17155~orig.jpg` · `https://images-assets.nasa.gov/image/PIA17155/PIA17155~small.jpg` | Photo-compare: nearly full, sunlit second-largest Saturn moon |
| 7 | Dione — "Cassini Closest Views of Dione I" | PIA19653 | NASA/JPL-Caltech/Space Science Institute | `https://images-assets.nasa.gov/image/PIA19653/PIA19653~orig.jpg` | Photo-compare: closest Cassini view, wide-angle with narrow-angle inset (10× detail). **No medium/small variant exists — only the orig URL above.** |
| 8 | Iapetus — "Global View of Iapetus Dichotomy" | PIA11690 | NASA/JPL-Caltech/Space Science Institute | `https://images-assets.nasa.gov/image/PIA11690/PIA11690~orig.jpg` · `https://images-assets.nasa.gov/image/PIA11690/PIA11690~small.jpg` | Photo-compare: global two-hemisphere view showing extreme brightness dichotomy (dark leading / bright trailing) |
| 9 | Tethys — "Cassini Close Look at Tethys" | PIA07733 | NASA/JPL-Caltech/Space Science Institute | `https://images-assets.nasa.gov/image/PIA07733/PIA07733~orig.jpg` · `https://images-assets.nasa.gov/image/PIA07733/PIA07733~small.jpg` | Photo-compare: close Cassini look at the cratered icy moon |
| 10 | Starfield — "Globular Cluster M22" | PIA04202 | NASA / Hubble Space Telescope | `https://images-assets.nasa.gov/image/PIA04202/PIA04202~orig.jpg` | Starfield plate: dense HST starfield, usable as equirect-ish backdrop or tiled star plate. **No medium/small variant exists — only the orig URL above.** |

**Asset count:** 10 records → 18 approved URL variants (2+2+2+2+2+2+1+2+2+1).

**Excluded (do NOT use):** PIA11141 (not the real Day the Earth Smiled mosaic — PIA17172 is),
PIA21324 (Mars, "Nirgal Vallis"), PIA11178 (Mars dunes), PIA12567 (Saturn rings view,
"Planet Six"), PIA12572 (Mimas, "Color Near Herschel Crater" — wrong subject for Dione),
PIA11169 (Earth, "Northern Greenland"). Recorded as excluded in the manifest; the
builder must not "correct" toward any of these.

---

## 2. Target resolutions (per simulation-design §4)

| Texture | Desktop | Mobile | Notes |
|---|---|---|---|
| Mimas hero (global map PIA17214) | 2048² | 1024² | Reprojected to 2:1 equirectangular if source aspect differs; sRGB |
| Other major moons (Enceladus, Titan, Rhea, Dione, Iapetus, Tethys) | 1024² | 512² | sRGB; downsample from orig variant |
| 293-catalog moons | one shared 512² atlas | same atlas | Procedural atlas derived from verified color/albedo data only — no invented NASA photos |
| Starfield plate (PIA04202) | plate resolution as-is | same | Equirect-ish backdrop or tiled; sRGB |
| Saturn mosaic (PIA17172) | as-is (background plate) | as-is (background plate) | Scene background; NOT a body texture |
| Mimas close-up (PIA12570) | as-is | as-is | Photo-compare left pane only |

**Texture budget (hard):** ≤ 150 MB desktop total, ≤ 60 MB mobile total.
**Anisotropy:** max 4 desktop / 2 mobile.
Budgets are measured against the project-wide **DPR cap ≤ 1.5** — never assume a 2× framebuffer.

---

## 3. Build-time pipeline (offline)

The artifact itself makes **ZERO runtime network requests**. All fetching happens
at build time, in this order:

1. **Download** — fetch only the approved variants in §1 (curl with HTTP-200
   check; treat 403/404 as build failure, never as a cue to guess a variant URL).
2. **Reproject** — reproject to **2:1 equirectangular** where the source is not
   already equirectangular (required: Mimas global map if needed, major-moon
   textures used on spheres). Photo-compare panes keep the source framing.
3. **Color** — convert to **sRGB** color space.
4. **Resize** — produce desktop and mobile variants per the §2 table.
5. **Inline or reference** — inline as base64 into the artifact bundle, or emit
   as local asset files with relative references. Both are acceptable; what is
   **not** acceptable is any `http(s)://` URL in the final artifact. Verification
   greps the artifact for outbound fetches and fails the build on any hit.
6. **Manifest embed** — each baked texture carries a sidecar entry:
   `{body, url_hash, license: "PD-USGov-NASA", equirectangular: bool,
   verified_date}` per simulation-design §4.

**Failure rule:** if a texture asset fails to bake, the artifact build FAILS LOUD —
no silent substitution, no placeholder gradient. (The only legitimate fallback is
the runtime "NO VERIFIED PHOTO" compare-pane state, §6.)

---

## 4. Canon textures — NOT NASA (keep as-is, separate list)

These are user-canon visual assets in `assets/` and are **never** replaced,
reprojected, or re-sourced. They are the visual canon, not NASA photography.

| File | Role | Usage rules |
|---|---|---|
| `assets/mimas-surface-gaze.webp` | Full-sphere hero texture | Wraps the WHOLE moon sphere — all terrain, valleys, and fracture networks. Sun-driven phases: drag on desktop, display-only canvas on mobile. |
| `assets/mimas-tail-cinematic-flipped.webp` | Debris-tail cinematic | Horizontally flipped canon: the tail streams **AWAY from Earth**. Shown in BOTH debris and world-response views. Never re-flip, never mirror again. |

Also present in `assets/` (state frames, user canon — leave untouched):
`mimas-state-arrival.webp`, `mimas-state-peeling.webp`, `mimas-state-pristine.webp`,
`mimas-state-tail.webp`.

---

## 5. Credit lines block — paste VERBATIM into the artifact credits

The builder must paste this block unchanged (PD-USGov-NASA licensing):

```
Imagery: NASA/JPL-Caltech/Space Science Institute (Cassini mission) — Saturn mosaic
(PIA17172), Mimas (PIA12570, PIA17214), Enceladus (PIA17202), Titan (PIA20016),
Rhea (PIA17155), Dione (PIA19653), Iapetus (PIA11690), Tethys (PIA07733).
Starfield: NASA / Hubble Space Telescope (PIA04202).
All imagery is public domain under PD-USGov-NASA (work of the U.S. federal
government). Saturn mosaic and moon photography courtesy NASA/JPL-Caltech/Space
Science Institute.
```

**Licensing note:** `license: "PD-USGov-NASA"` on every baked texture sidecar
(sim-design §4). Public domain — no additional permission needed; credit is
required by the project, not the license.

---

## 6. Photo-compare mode wiring

Per simulation-design §4, the compare mode split-view uses the baked assets:

- **LEFT pane:** real NASA photo on the body mesh, labeled
  `VERIFIED PHOTOGRAPH — <mission>, <date>` (bodies with a §1 entry).
- **RIGHT pane:** the engine's procedural/CGI render, labeled
  `RECONSTRUCTION — NOT A PHOTO`.
- **Bodies without a verified photo** (the remaining 287 catalog moons): LEFT pane
  shows `NO VERIFIED PHOTO — reconstruction only` and the compare control
  **disables itself**. This is a feature, not a missing asset — the verifier
  spot-checks it (see VERIFICATION-PLAN.md).
