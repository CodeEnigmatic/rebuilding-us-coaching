# Source code and personal records

## Intended for GitHub

The Python server, browser code, fictional exercises, automated tests and setup documentation are shareable source. `baseline.example.json` contains documentation-only addresses, not the owner's network configuration. The `lab-student` credential is intentionally public training data, not a production secret.

## Local only

`private/` contains the owner's network baseline and personal learning records and is ignored by Git. Keep future private notes and backups here or outside the repository. The local baseline endpoint reads this folder at runtime; personal values are not embedded in the JavaScript bundle. The static server serves only `web/`, and both listeners bind to loopback.

Browser local storage holds entered lesson evidence, checklists, journal snapshots, investigations and simulator records. Git cannot back these up. Export them separately and keep the exports private. Common export names, `exports/`, `backups/`, environment files and packet captures are ignored. Arbitrarily named files are not automatically classified: put private files in `private/`.

Ignoring a file is not encryption, access control or removal from existing Git history. These lab records were untracked before the first source commit. Review staged files before future commits. Do not force-add private files. Do not bind the server to a public address or expose it through a tunnel with a real baseline present: `/local-baseline.json` deliberately returns that local file to the dashboard.

## New checkout

Run `python3 -B serve.py` from this folder. The site works without a private baseline; enter observations manually. To seed a local baseline, create `private/`, copy `baseline.example.json` to `private/baseline.json`, and edit the local copy. Never put credentials in the baseline or lesson evidence.

A GitHub source backup is separate from a private data backup. Saving this lab's source on GitHub does not publish or host the running Python service.
