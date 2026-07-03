# feature-graphic-generator

Renders the Play Store **feature graphic** (1024×500) for each locale from `generator.html`
using headless Chromium, writing `featureGraphic.png` straight into
`../metadata/android/<locale>/images/`. No image editor, no manual per-locale work.

## Use

```bash
npm install
npx playwright install chromium
npm run render          # every locale in locales.json
node render.js en-US    # specific locales only
```

## How it works

- `generator.html` is a static 1024×500 template. `render.js` serves the folder, loads it in
  headless Chromium, swaps the copy, and screenshots it at a 1024×500 viewport.
- The contract between `render.js` and the template is four element IDs — keep them on redesign:
  - `#pill` — small uppercase label
  - `#headline-main` — line 1 of the headline
  - `#headline-accent` — line 2 (the gradient line)
  - `#tagline` — the subtitle
- Output: `../metadata/android/<locale>/images/featureGraphic.png`. A locale whose `images/`
  dir does not exist is skipped, so create the fastlane locale dir first.
- Fonts load from Google Fonts over the network — rendering needs internet.

## Retarget for a new app

1. Edit the design / brand mark in `generator.html`.
2. Replace the copy in `locales.json` (one key per fastlane locale).
3. Keep the four IDs above.
4. `npm run render`.
