# Validation record — October 26, 2026

Passed locally on Node 24 and installed Chrome using Playwright:

- Archive schema, related identifiers, URL safety, dates, filters and illustrative exclusion.
- JavaScript syntax checks for viewer, editor, contribution form and ZIP writer.
- Desktop 1280 px and phone-size 390 px browser regression: /B/ relative paths, map fallback, search/filters, direct record links and reload, editor preview, browser draft save/recovery, ZIP generation, account-free offline contribution export and no uncaught errors.
- Full workflow at both widths with real Leaflet loaded: new synthetic place, map click and automatic coordinates, date fields, two ordinary citation forms, two selected image fixtures, caption/rights fields, IndexedDB reload including image files, preview, ZIP containing selected file bytes and source text, invalid year error retaining input, no horizontal overflow.
- git diff confirms data/records.json unchanged.

Run node tests/browser.cjs and node tests/workflow.cjs with PLAYWRIGHT_MODULE set to the installed Playwright package and CHROME_PATH to Chrome if needed. The workflow test needs internet for Leaflet. These are viewport simulations, not physical phone or screen-reader tests.

Not tested/claimed: external Tally delivery (not connected), authenticated publishing, an actual live record publication (owner approval required), end-to-end archival restoration at the museum, historical truth or publication rights, multiuser concurrency. Review ZIP packaging is tested locally. Real volunteers should trial five records before expanding functionality.

Follow-up October 26, 2026: Tally form rDD57v was published in the user-created account. A TEST ONLY contribution with two synthetic PNG uploads reached its private submissions inbox; hidden record/place values and required review consent were present, optional name/contact/place remained blank. Preview DOM inspection verified optional multiple file uploads and required story/consent. Signed-out access, a physical phone, oversize rejection and spam controls remain untested. No historical record was published.

## Traditional atlas redesign — October 27, 2026

Tested locally with Node 24.22.1 and Chrome for Testing 145 through Playwright:

- `node tests/validate.js` and syntax checks for app, editor, contribution and package scripts: PASS.
- Existing `tests/browser.cjs`: PASS at 1280px and 390px, both with external resources blocked (list fallback) and with real Leaflet/markercluster resources supplied.
- Existing `tests/workflow.cjs`: PASS at 1280px and 390px. Real Leaflet coordinate selection, two sources, two image attachments, captions/rights, IndexedDB file recovery, preview, review ZIP bytes and invalid-date retention.
- New `tests/redesign.cjs`: PASS at 1440px, 390px and 720px. Map initialization and clustering, empty state, category multi-select, search, direct URLs, record IDs, evidence labels, contribution context, focus on opening, Escape and return focus, and no document horizontal overflow. Temporary intercepted media/source fixtures verify captions, dates, credits, rights, citations and related-record navigation; production archive is never modified.
- Configured Tally URL/context checked locally; no external submission was sent.
- Screenshots in `docs/screenshots/` show actual example records and the default empty archive. No historical imagery was invented. Desktop homepage, map, reader and phone homepage/reader were captured and visually inspected.
- `git diff` confirms no changes to `data/records.json`, `archive-core.js`, `editor.js`, `contribute.js`, `package.js`, `contribution-config.json` or publishing workflows. Public `noindex,nofollow` remains intact.

### Reproduction

Run the existing commands above, plus `node tests/redesign.cjs`. Select an installed Playwright package with `PLAYWRIGHT_MODULE` and Chrome executable with `CHROME_PATH` if necessary. `TEST_PROXY` is an optional browser proxy.

In this environment Chrome did not trust the outbound proxy CA. Tests used the optional `TEST_ASSET_CACHE` directory and `tests/network.cjs` to serve the exact Leaflet 1.9.4 and markercluster 1.5.3 JS/CSS downloaded through certificate-verified curl; map tiles were fetched through curl with an identifying test User-Agent and the local page Referer. This bridge is test-only, introduces no production dependency, and is not an independent test of production CDN availability. The first blocked-tile screenshots were discarded and replaced with normal cartography.

### Limits

Viewport tests simulate phone/tablet dimensions. The 720 CSS-pixel test exercises the reflow width corresponding to a 1440px display at 200% zoom; actual browser zoom UI, physical devices and assistive screen readers were not tested. No authenticated historical records, real museum media, external form delivery, historical overlays, merge, deployment or live publication were performed. A volunteer trial on actual devices remains recommended before launch.
