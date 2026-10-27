# Pages CMS integration trial — not activated

Selected approach: the hosted Pages CMS editor, backed by the existing GitHub repository. It supplies authentication, forms and media uploads without a custom server. The website and existing offline/map-based editor remain available.

The configuration edits the existing version-1 archive in place and retains all current fields, including legacy fields. It provides nested sources/media, category selection and asset uploads with relative paths compatible with /B/. No archive records have been modified.

## Account connection

1. Visit https://app.pagescms.org and sign in with the GitHub account that owns kshorton96/B.
2. Install/authorize the official Pages CMS GitHub App for **only B**.
3. Select B and branch **feature/pages-cms-archive**, not main, for the initial trial.
4. Open Historical places. Confirm all four illustrative records and their existing IDs appear.

The GitHub connector used to prepare this branch does not authorize another application's GitHub App. Repository write permission must be granted by the owner.

## Required acceptance test before merging

Use only synthetic text and a test image on this branch. Edit an existing example, add a new entry, upload a file, save, sign out/in and verify persistence. Then validate the exact saved JSON with `node tests/validate.js`, and test the viewer against those files. Confirm that blank optional text/list/number fields round-trip as the types required by archive-core.js. If the hosted editor omits these fields or writes empty strings for nullable numbers, add a tested normalization/publishing adapter before activation. Do not weaken archive validation to accept corrupt records.

Check that unknown metadata survives an edit, existing IDs stay stable, source/media captions and permissions survive, asset paths start with assets/, and concurrent edits do not silently discard another volunteer's changes. Remove synthetic changes from the proposed merge.

## Publication and privacy limitations

Saving on main can publish immediately through GitHub Pages. Evidence status `draft` is NOT a publication switch: the current viewer displays non-demo draft records. Do not represent this integration as an approval queue or private drafting system. This public repository makes branch content and uploads public even before website publication. Keep private submissions and contact/permission documents in the existing private submission channel.

The hosted form does not automatically inherit the custom editor's map coordinate picker, browser draft recovery or review-package workflow. Retain the existing editor for those tasks during the trial. Before recommending this as the final archive desk, evaluate these tradeoffs with the owner and either add a supported map field/workflow or retain the custom editor with an authenticated publishing adapter.

## Validation status

Local schema coverage and existing archive validation passed. Hosted login, editor rendering, new-record serialization, file upload, saving and end-to-end publication have NOT been tested. This branch must remain unmerged pending that trial. No new runtime dependency, credentials, paid API or public link has been introduced.
