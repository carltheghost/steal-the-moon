# web/

The complete rebuilt Steal the Moon site. `index.html` is the exported, self-contained build of the `steal-the-moon` artifact (2026-09-20): 24 navigable screens, seven simulation systems, Keplerian Saturn engine, baked imagery, local persistence, responsive/reduced-motion fallbacks, and zero runtime network requests.

## Living Reality

`living-reality.html` is the tactile 3-D navigation layer inspired by the maTumbo Living Reality demo: a glass-cube field for the archive and simulations with select, orbit, drag, double-click-to-dive, keyboard focus, Reality Lens, and local position persistence.

Open `index.html` for the main archive, or `living-reality.html` for the Living Reality field.

For hosted deployment, this directory is the GitHub Pages payload. The repository workflow verifies the artifact before publishing it.

Expected hosted URL after enabling GitHub Pages with **Source = GitHub Actions**:

https://carltheghost.github.io/steal-the-moon/

Deployment contract: this directory is published by `.github/workflows/deploy-pages.yml` after all verification gates pass.
