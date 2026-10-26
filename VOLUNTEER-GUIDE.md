# Volunteer guide

## Add a historical place
Open the Volunteer record editor. Load the current website archive before adding history so that existing records are retained. Choose Add a New Historical Place or select an existing place. Fill in what you know. Leave unknown years blank; describe approximate dates in Historical period. Choose all applicable categories. Generated place identifiers stay unchanged when you edit.

Click the map to locate a place and drag its marker to adjust. Choose approximate or uncertain where appropriate. Use Location unknown if necessary. If the map cannot connect, leave coordinates blank or enter known coordinates. Never guess.

## Add photographs and sources
Use Add a Historical Source for each citation. Include author, date and page or collection reference when known. Add Photos or Documents selects multiple files; you can also drop them on that area. Supported files: JPG, PNG, WebP, PDF, MP3, OGG and WAV, up to 50 MB each. Use Replace selected file, Remove, Move earlier and Move later as needed. Give every public file a caption, description, owner/photographer and permission reference. Do not put private correspondence in public fields.

This version packages selected files without resizing or removing embedded metadata. Make separate web copies first, check embedded location/personal metadata, and select only those copies for public review. Preserve full resolution originals separately. PNG/JPG thumbnails do not replace archival originals. TIFF and other preservation formats belong in private archival storage. Keep at least two original backups in different locations.

## Save and recover work
Changes save automatically after a short pause to this browser, including selected files. Save Draft saves immediately. Continue browser draft recovers that working copy, including incomplete entries. There is one working draft per browser/site; avoid editing in multiple tabs. Private browsing, clearing browser data, storage quotas and changing devices can lose drafts.

Export unfinished work downloads a private draft with attached originals. Check that the download finished, keep a dated backup, and choose that file under Continue from a saved archive or draft to restore. These private drafts are not for public upload. Saving locally never sends anything to the museum.

## Submit a record for review
Preview record shows text, sources and selected images. Complete validation errors without closing the editor. Prepare review package downloads a ZIP with data/records.json, newly selected files under assets/, and reviewer instructions. Existing website media stay on the website and are not duplicated. This download does not submit anything: deliver it to your designated museum reviewer. No online reviewer address has been invented.

## Review community contributions
The public Share a Photograph or Story page can save a private package to bring to a volunteer, without any account. Online delivery is awaiting museum setup. Packages and contact details must never be placed in the public repository.

Maintain a private review register with columns: reference, received date, related place, reviewer, status, evidence, permission reference, follow-up, publication link. Use Submitted → Under Review → Approved → Published, or Needs More Information / Rejected. Contact the contributor privately when clarification is needed. Review consent permits review/contact only, not publication. Obtain and preserve publication permission separately. Incorporate cleared material through the editor; do not upload raw public submissions. Set Published only after checking the live result.

## Publish approved changes (authorized maintainer)
1. Keep a dated backup of the current archive and media. Extract the review ZIP privately.
2. Compare the package archive with the latest website archive. Reconcile other volunteers' edits; a package contains the whole archive and can overwrite newer work. Preserve identifiers, citations, unknown metadata and illustrative flags.
3. On GitHub create a new branch (a separate proposed version), upload data/records.json into data/ and new cleared files into their assets/ folders. Never upload private drafts, contact information, originals or permission correspondence.
4. Open a pull request (a request for someone to check your changes) targeting main. Include evidence and permission references. An authorized reviewer checks the data, files, privacy, citations and automated checks. Preview the branch locally; GitHub Pages has no automatic branch preview here.
5. Only merge after the owner's approval. Check map/list search, record links and media on the live site afterwards. Record the published link in the private register. A verified label is a human assessment, not proof supplied by software.

There is no authenticated publishing button or automated submission-to-publication connection. Configure GitHub branch protection with required reviewer approval and validation checks if enforcement is wanted; this change does not alter account settings.

## Back up and restore
Regularly keep dated repository downloads, data/records.json and public assets, separately from original scans and private permission records. Test a restore by opening the saved archive/private draft in the editor on a local preview. Export before loading another archive. The draft export is portable ordinary JSON, not a cloud backup.
