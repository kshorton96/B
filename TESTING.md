# Validation record — October 26, 2026

Passed locally on Node 24 and installed Chrome using Playwright:
- Archive schema, related identifiers, URL safety, dates, filters and illustrative exclusion.
- JavaScript syntax checks for viewer, editor, contribution form and ZIP writer.
- Desktop 1280 px and phone-size 390 px browser regression: /B/ relative paths, map fallback, search/filters, direct record links and reload, editor preview, browser draft save/recovery, ZIP generation, account-free offline contribution export and no uncaught errors.
- Full workflow at both widths with real Leaflet loaded: new synthetic place, map click and automatic coordinates, date fields, two ordinary citation forms, two selected image fixtures, caption/rights fields, IndexedDB reload including image files, preview, ZIP containing selected file bytes and source text, invalid year error retaining input, no horizontal overflow.
- git diff confirms data/records.json unchanged.

Run node tests/browser.cjs and node tests/workflow.cjs with PLAYWRIGHT_MODULE set to the installed Playwright package and CHROME_PATH to Chrome if needed. The workflow test needs internet for Leaflet. These are viewport simulations, not physical phone or screen-reader tests.

Not tested/claimed: external Tally delivery (not connected), authenticated publishing, an actual live record publication (owner approval required), end-to-end archival restoration at the museum, historical truth or publication rights, multiuser concurrency. Review ZIP packaging is tested locally. Real volunteers should trial five records before expanding functionality.
