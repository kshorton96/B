# Harmon County Historical Atlas

Static GitHub Pages archive with a traditional county-atlas visual design and portable version-1 records. Existing historical data are unchanged. All four inherited entries remain illustrative and hidden by default; no authenticated historical material was added.

See [Volunteer guide](VOLUNTEER-GUIDE.md) for adding places, sources and media, saving/recovering drafts, review, publication and backups. See [Submission setup](SUBMISSION-SETUP.md) to connect a Society-owned private submission inbox. No ongoing paid service or frontend credentials are introduced.

The editor supports ordinary repeating source/media fields, multiple categories, map clicks and draggable markers, optional coordinates, browser IndexedDB drafts including files, portable private draft export/import, record previews and dependency-free review ZIP generation. New files are included in ZIPs; existing website files remain in place. The public contribution page associates place/photograph context and creates private offline packages; the Tally form is connected in this branch, with a two-file test received in its private inbox. Public records include correction/identification links. Historical certainty, claims, stable identifiers and existing extra metadata are preserved.

Limitations: one browser draft, no concurrent editing reconciliation, no server-backed draft guarantee, no automatic image resizing/metadata stripping, no account system, no direct submission/publishing or automated approval enforcement. Human review and separate archival originals remain required. The ZIP contains selected public files unchanged. Read all review instructions before uploading anything.

Local preview: run a static web server from this folder and visit its HTTP address. Keep the Pages /B/ relative paths. Map resources require internet; forms and record list work if map libraries fail.

Checks: node tests/validate.js; node --check app.js; node --check editor.js; node --check contribute.js; node --check package.js. Browser tests: node tests/browser.cjs (Playwright; PLAYWRIGHT_MODULE and CHROME_PATH may select installed dependencies). Tests use synthetic temporary entries without changing archive data. Do not merge/deploy without owner approval.

## Traditional atlas redesign

The public interface now uses a paper-and-ink masthead, four visitor destinations, visible search, collapsible multi-category index, map/index spread and accessible nonmodal gazetteer reader. Volunteer and contribution forms share the palette without changing their workflows. [Design system](DESIGN-SYSTEM.md) defines tokens and layout rules; [validation notes](TESTING.md) distinguish actual tests from remaining limitations. [Desktop homepage](docs/screenshots/desktop-home.png), [map](docs/screenshots/desktop-map.png), [record reader](docs/screenshots/desktop-record.png), [mobile homepage](docs/screenshots/mobile-home.png) and [mobile reader](docs/screenshots/mobile-record.png) are review captures, not a deployment.

No archive data, category values, source citations, coordinates, IDs, submission settings or search-engine restrictions were changed. No fonts, paid APIs or production dependencies were added. Historical overlays remain a future phase requiring rights-cleared, accurately aligned sources. Keep this branch unmerged until the owner approves.
