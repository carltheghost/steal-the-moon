# Publish checklist — steal-the-moon launch

## Current state

The complete rebuilt browser artifact is committed at `web/index.html`.

The repository is wired for GitHub Pages deployment through `.github/workflows/deploy-pages.yml`. The workflow first validates canonical JSON, runs `scripts/check.py`, runs `scripts/check_web.py`, and only then deploys the `web/` directory.

## Verification now enforced

- [x] Canonical/rebuild JSON validation is encoded in the Pages workflow.
- [x] Repository smoke check is encoded in the Pages workflow.
- [x] Browser artifact size and required boot markers are checked.
- [x] Runtime fetch/XHR/WebSocket/beacon/external script-style URL patterns are rejected by the artifact check.
- [x] `web/.nojekyll` is present for static hosting hygiene.
- [x] The site is a single self-contained HTML artifact; no backend or runtime CDN is required.
- [x] Pages workflow uses `configure-pages`, `upload-pages-artifact`, and `deploy-pages`.

## Final account-level launch switch

The connected GitHub API reports `has_pages: false` for `carltheghost/steal-the-moon`. The code and automation are complete, but GitHub Pages itself is not enabled for this repository.

Enable it once at:

https://github.com/carltheghost/steal-the-moon/settings/pages

Set **Build and deployment → Source → GitHub Actions**.

After that, every qualifying push to `main` deploys automatically and the expected public site is:

https://carltheghost.github.io/steal-the-moon/
