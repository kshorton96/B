# Harmon County Historical Atlas — first archive release

A static GitHub Pages archive preserving the original green, paper and serif design. No database, login service, payment service, API key or build step is required. `data/records.json` is the canonical portable archive (version 1). The older `data/places.js` is retained only as provenance for the original demonstrations; the website never loads it.

## What is ready

- Map and equivalent keyboard-accessible record list, marker clustering, multiple records at the same coordinates.
- Multiple categories per record; selected categories match **any**, combined with text, verification and year filters. Text covers names, alternative names, people, families, descriptions and period text.
- Inclusive year overlap. One known year is treated as a point date, not an assumed open-ended lifetime. Undated records can be included or excluded during year filtering.
- Shareable `#record=hc-001` links; loading a link clears filters so its record is visible. Examples remain clearly labeled even through direct links.
- Unknown coordinates are permitted as two null values and remain browsable without a marker. Accuracy (exact / approximate / uncertain / unknown) is separate from historical verification.
- Multiple photos, document links, audio recordings, citations, related records, land descriptions, contributors and rights metadata. Photos and audio have native browser controls or links; there is no document viewer or transcription service.
- Local file editor, archive validation and download. No browser-local change publishes anything.
- Moderated GitHub contribution issue template and printable worksheet; no fictional contact address. GitHub issues are public and require an account. Maintainers must enable Issues in repository settings if disabled. Contributions never automatically enter the archive.
- Membership, donation and sponsorship content areas awaiting Society approval, without payment collection.

**All four inherited records are illustrative examples, with unverified details and coordinates. They are hidden by default. This release supplies no authenticated historical records, imagery or permission grants.** No synthetic historical facts have been added. Keep `noindex` until the Society approves a researched public launch; it is not access control.

## Volunteer: add or edit a record

1. Open `editor.html` from the website or a local web preview. Click **Load current website archive**, or choose a downloaded `records.json` file. Loading the website uses the currently deployed archive, which may be older than an unmerged branch; use the branch's downloaded JSON when continuing that branch.
2. Select a record, or click **Add blank record**. Choose a permanent unique lowercase ID, such as `hc-005`. Do not change existing IDs: shared links and related records depend on them.
3. Enter the known information. Leave unknown coordinates and years blank. Do not guess coordinates. Add categories and people one per line. Categories must use the choices listed on the atlas. Put uncertainty in the description and choose accuracy and claim type separately.
4. Sources and media use small JSON lists in this initial editor. Empty lists are `[]`. Copy these patterns and replace the text:

```json
[{"title":"Author, item title, date, page, collection/accession number", "url":"https://archive.example.org/item"}]
```

A source URL is optional: a physical museum reference is valid. The URL above is a syntax example, not a historical citation.

```json
[{"type":"image","url":"assets/hc-005/photo-web.jpg","caption":"What the photograph shows, date if known","alt":"Description for a visitor who cannot see it","credit":"Owner or photographer","rights":"Written permission reference and permitted uses"}]
```

Use `document` for scans/PDF links and `audio` for oral history recordings. Supply captions, alternative text, credit and rights for every media item. Use HTTPS or an `assets/` path. Do not paste HTML or embed code. The editor deliberately rejects script/data URLs. A future repeatable source/media form can remove the JSON typing; it is deferred.

5. Choose `draft`, `verified`, `disputed`, or `illustrative`. Verification requires at least one citation but the program cannot judge its truth. A Society reviewer must inspect evidence before selecting verified. Examples must have the illustrative checkbox and status. Oral tradition is a distinct claim type, not automatic verification.
6. Click **Apply edits to session**. Correct any errors. Repeat for other records. Unapplied form edits are excluded from downloads. Switching records discards unapplied edits after confirmation.
7. Click **Download records.json**. Check the browser download folder. This is your complete archive file; it is NOT a GitHub save. Leaving the editor can lose session changes. Keep a dated copy before continuing.

## Media, review and corrections

Keep archival originals outside the public repository in at least two backed-up locations. Publish resized web images, readable PDFs and compressed audio under `assets/<record-id>/`. Upload those files separately: the editor only downloads metadata. Store permission correspondence privately and put an appropriate reference in rights text. Do not publish private addresses, sensitive sites, personal contact details, or restricted media. Remove a sensitive item's public copy and review Git history exposure with the repository owner; a new commit alone does not erase history.

For corrections, update the existing record ID, cite the correction's evidence, and explain the change in the PR. Use related IDs to connect events and places; several records can share coordinates. Conflicting evidence belongs in the description with disputed status/claim type. A source's existence does not prove a claim.

## Publish safely through review

1. Download the current archive and preserve a backup. Sign into GitHub with authorized repository access.
2. Create a new branch from current main in the branch selector. **Do not upload directly to main.**
3. Upload the downloaded file to `data/records.json` (the exact filename, not a browser-renamed `records (1).json`). Upload approved web media under assets/. Commit to your branch.
4. Open a pull request targeting main. Explain additions, evidence and permissions. Ask a Society reviewer to inspect changes, check validation and preview on a local web server. GitHub Pages does not automatically provide branch previews.
5. Only an authorized maintainer should merge after approval. The existing Pages deployment then publishes from main. This development PR has not been merged and does not modify the live site.
6. After publication, check the live record links, media and phone layout. To undo a bad update, use GitHub's revert workflow in a new reviewed PR.

The file editor has no authentication or write credentials because it cannot write to the repository. Anyone may prepare a file; only GitHub-authorized maintainers can publish. It does not replace a multiuser CMS. Avoid concurrent archive editing: load the latest branch JSON and reconcile other changes before review. Configure branch protection separately if the Society wants enforcement; this release does not change account settings.

## Local preview, tests and backups

From the repository directory use a static HTTP server (for example `python -m http.server 8000`) and open `http://localhost:8000/`. Opening the HTML as a local file does not support JSON fetching reliably. Pages `/B/` relative paths are supported.

Run with Node 24 or later:

```
node tests/validate.js
node --check app.js
node --check editor.js
```

The GitHub Actions workflow runs these checks on pushes and PRs, without deployment. Browser regression tests additionally require Playwright and its Chromium browser:

```
node tests/browser.cjs
```

Set `PLAYWRIGHT_MODULE` to an absolute installed Playwright module path if needed; `CHROME_PATH` optionally selects an installed Chrome. Default browser tests block remote resources to test graceful map failure. Set `ONLINE_MAP=1` to test live CDN libraries and clustering instead. Tests serve the app at `/B/`, check desktop 1280px and phone 390px layouts, filters, example exclusion, deep link reload, editor round-trip JSON download and uncaught JavaScript errors. These are browser viewport simulations, not physical phone tests. Schema tests cover invalid coordinates/years/IDs/categories, citations, related IDs and unsafe URLs. Tests do not establish historical accuracy, ownership, all external-link availability, audio codecs, large collection performance or screen-reader usability. No approved real media is supplied, so full archival media review remains necessary.

Map libraries use pinned Leaflet 1.9.4 and markercluster 1.5.3 from unpkg; tiles use OpenStreetMap. Network availability is required for these resources; records and editing still work if map libraries fail. No offline tile cache or uptime guarantee. The fallback shows individual markers if clustering is unavailable. Keep OSM attribution and review provider usage requirements before substantial traffic. No paid services are introduced.

Download `data/records.json`, approved assets and a GitHub repository ZIP regularly. Keep dated copies separate from the repository, plus original media and permissions in separate archival backups. JSON uses ordinary text and arrays with stable IDs for future migration; preserve its version and all metadata. Test restoration by loading a backup into the editor and previewing it before publishing.

## Deferred

Authentic research and collection population, permission clearance, source adjudication, Society-approved contact/payment/member systems, private submissions, accounts/server-side CMS, convenient repeating media/source fields, archival original storage, offline maps, full accessibility audit and performance testing with hundreds of authentic records are not implemented. All are independent of this working static first release.
