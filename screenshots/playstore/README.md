# playstore screenshots

Composes the Play Store **phone screenshots** (1080×1920) from raw device captures in `cropped/`,
wrapping each into a captioned marketing frame and writing the result into
`../../fastlane/metadata/android/<locale>/images/{phoneScreenshots,sevenInchScreenshots,tenInchScreenshots}/`.

## Why frames

Raw captures from modern phones (e.g. 1080×2400) exceed Play's max **2:1** aspect ratio, so they get
rejected/letterboxed. The frame re-composes each capture onto a compliant **1080×1920** canvas.

## Use

```bash
npm install
npx playwright install chromium   # only if not already installed for the feature graphic
npm run render                    # all locales in LOCALES
node render.mjs en-US             # specific locales only
```

## How it works

- `template.html` holds one `#frame-<id>` card per screenshot (1080×1920), each showing a caption
  plus a `cropped/` capture. `window.applyLocale(loc)` swaps the captions per language.
- `render.mjs` loads the template, calls `applyLocale`, screenshots each `#frame-<id>` card, and
  writes the same PNG into the three size folders under each locale's `images/`.
- **Sweeps stale files**: any PNG whose name is not in `FRAMES` is deleted, so dropped frames don't
  linger on Play Console.

## Retarget / edit

- `FRAMES` + `LOCALES` at the top of `render.mjs` control what renders.
- Add a capture to `cropped/`, add a `#frame-<id>` card in `template.html`, add its id to `FRAMES`.
- Edit captions in the `COPY` object inside `template.html`.
