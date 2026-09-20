# Publish checklist — steal-the-moon rebuild merge

**Origin:** `carltheghost/steal-the-moon` at `042dba3` (origin/main).
All work below is **local-only** — nothing has been pushed. See the standing rule
at the bottom.

## Exact changes vs origin

Run `git diff --stat origin/main` from `main` after review.

## The 3 new commits (local)

1. `27d4381` — data: real 293-moon catalog, J2000 major-moon elements, verified NASA
   imagery manifest
2. `38f5025` — docs: simulation design, chronology resolution, wow features,
   Neptune/Uranus removal audit
3. layout: engine/ and web/ placeholders, rebuild index, publish checklist

## Files added (10)

- `data/moons-293.json`
- `data/major-moons-elements.json`
- `data/nasa-imagery.json`
- `docs/simulation-design.md`
- `docs/chronology-resolution.md`
- `docs/wow-features.md`
- `docs/removal-audit.md`
- `docs/REBUILD-INDEX.md`
- `engine/README.md`
- `web/README.md`

No existing file was modified — all 8 canon `data/*.json` files, all existing
`docs/*`, `README.md`, `LICENSE`, `STORY-STATUS.md`, `assets/`, and `scripts/` are
untouched.

## What to verify before the browser-session push

- [ ] The 3 new JSONs parse (`python3 -m json.tool` each): 293 moons, 9 major moons,
      10 imagery entries.
- [ ] New docs render on GitHub (md headings intact).
- [ ] No invented data — all figures come from the 2026-09-20 rebuild swarm
      deliverables; `engine/` contains no fabricated code (placeholder only).
- [ ] Assets untouched; canon files untouched.
- [ ] Origin untouched — commits are local-only, branch is exactly 3 ahead of
      `origin/main`.

## Standing rule

**Pushing happens only through the user's logged-in browser session.** Do not
`git push` from this VM — not now, not on schedule. When the user approves, the
browser route (their signed-in GitHub session) performs the push after this
checklist is reviewed.
