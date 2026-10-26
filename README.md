# Harmon County Historical Atlas — GitHub Pages Preview

This is the original starter website with its **existing design preserved**. Files are organized to work on GitHub Pages and ordinary static hosting. No build, backend, or API key is required.

## Verified diagnosis of the Android screenshot

The browser was opening `index.html` as an Android `content://` document. That is not an ordinary HTTP website URL, and access to neighboring CSS/JS files can fail in this viewing mode. The original archive **does contain** `styles.css`, `app.js`, and `data/places.js` in the correct positions, and `index.html` uses correct relative paths. The unstyled screenshot therefore does not establish a broken website.

This build also repairs one small filtering bug: **Verified locations only** now requires both `status: "verified"` and `locationAccuracy: "exact"`. Previously it tested coordinate precision alone.

## Fastest Android test without publishing

Open the separately supplied `harmon_county_atlas_phone_preview.html` (not the multi-file `index.html`). This single-file preview embeds the site's own CSS, records, and JavaScript so Android's `content://` file viewer cannot break those relative references. **The Leaflet library and map tiles still require an internet connection.** If Leaflet is blocked, a helpful placeholder and the styled record list should remain usable.

## Publish through GitHub Pages (public preview)

1. Sign in to GitHub and create a new repository (for example, `harmon-county-historical-atlas`). With GitHub Free, choose a **public repository** to use GitHub Pages. The site will be available to anyone with its URL.
2. Extract `harmon_county_atlas_github_pages.zip` first. In your new GitHub repository use **Add file → Upload files** and upload the **contents** of the extracted folder, not the ZIP itself or the enclosing folder. The repository root should show `index.html`, `styles.css`, `app.js`, `README.md`, and `data/places.js`. On Android, GitHub's website in browser Desktop site mode is often easier to use for multi-file uploads.
3. Commit the files to the default `main` branch.
4. Open **Settings → Pages → Build and deployment**. Select **Deploy from a branch**, choose **main** and **/(root)**, then Save.
5. Visit `https://YOUR-USERNAME.github.io/harmon-county-historical-atlas/`. Pages publication can take several minutes after a commit.
6. Test that the dark green header, map, four demonstration records, search, categories, and detail panels appear. Map tiles still require internet access.

The `index.html` includes a `noindex,nofollow` meta tag during the preview phase to discourage search indexing, **not** to restrict access. Remove that tag only after you are comfortable launching the public site.

## Preview from a computer via an HTTP server

From the extracted project folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/` on the same computer. From a phone on the same Wi-Fi, you may use the computer's LAN IP instead, if your firewall allows it.

## Files

- `index.html` — website markup and Leaflet CDN references
- `styles.css` — original responsive design
- `app.js` — search, filter, records, markers and detail panels
- `data/places.js` — editable data for all four **illustrative, unverified** demonstration entries
- `assets/` — place for future photographs and other static assets
- `.nojekyll` — tells GitHub Pages to serve the files without Jekyll processing
- `tests/validate.js` — optional Node.js data and file-reference checker

## Add historical records

Edit `data/places.js`, which assigns an array to `window.ATLAS_PLACES`. Each record needs a unique `id`, `name`, a `lat` and `lng` (decimal degrees), a category, description, and research metadata. `locationAccuracy` is `exact`, `approximate`, or `unknown`. `status` is `draft` or `verified`. Do not invent coordinates, dates, sources, or imagery. For demonstration records, `sources` is empty and `status` is `draft`.

Validate edits with:

```bash
node tests/validate.js
node --check app.js
node --check data/places.js
```

## Before public promotion

- Replace the `historical-society@example.org` contribution email in `index.html`.
- Verify all four demonstration records or remove them. Their historical coordinates and narratives must **not** be treated as verified.
- Obtain permission for photographs and avoid sensitive or private location data.
- Back up original archival records outside GitHub.
- Leave OpenStreetMap attribution intact and review the OSM tile usage policy if traffic increases.
- Remove the temporary `noindex` tag when ready for search engines.

No major visual redesign has been made. The historical atlas prototype remains a read-only public viewer, not an administration system.
