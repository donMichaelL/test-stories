import { chromium } from "playwright";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const WIDTH = 1080;
const HEIGHT = 1920;

const LOCALES = ["en-US"];
const FRAMES = ["1", "2"];
const OUTPUT_DIRS = ["phoneScreenshots", "sevenInchScreenshots", "tenInchScreenshots"];

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

function serve(dir) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const rel = req.url === "/" ? "/template.html" : decodeURIComponent(req.url.split("?")[0]);
      const file = path.join(dir, rel);
      fs.readFile(file, (err, data) => {
        if (err) {
          res.statusCode = 404;
          res.end("not found");
          return;
        }
        res.setHeader("Content-Type", MIME[path.extname(file)] || "application/octet-stream");
        res.end(data);
      });
    });
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

function sweep(imagesDir) {
  for (const sub of OUTPUT_DIRS) {
    const dir = path.join(imagesDir, sub);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (file.endsWith(".png") && !FRAMES.includes(path.basename(file, ".png"))) {
        fs.unlinkSync(path.join(dir, file));
        console.log(`swept stale ${sub}/${file}`);
      }
    }
  }
}

async function main() {
  const requested = process.argv.slice(2);
  const locales = requested.length ? requested.filter((l) => LOCALES.includes(l)) : LOCALES;

  const server = await serve(ROOT);
  const port = server.address().port;
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });

  for (const locale of locales) {
    const imagesDir = path.join(ROOT, "..", "..", "fastlane", "metadata", "android", locale, "images");
    if (!fs.existsSync(imagesDir)) {
      console.log(`skip ${locale}: ${path.relative(ROOT, imagesDir)} does not exist`);
      continue;
    }

    await page.goto(`http://127.0.0.1:${port}/template.html`, { waitUntil: "networkidle" });
    await page.evaluate(async (loc) => {
      window.applyLocale(loc);
      await document.fonts.ready;
    }, locale);

    for (const frame of FRAMES) {
      const card = await page.$(`#frame-${frame}`);
      if (!card) {
        console.log(`skip frame ${frame}: no #frame-${frame} in template`);
        continue;
      }
      const buffer = await card.screenshot();
      for (const sub of OUTPUT_DIRS) {
        const outDir = path.join(imagesDir, sub);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, `${frame}.png`), buffer);
      }
      console.log(`rendered ${locale} frame ${frame} -> ${OUTPUT_DIRS.join(", ")}`);
    }

    sweep(imagesDir);
  }

  await browser.close();
  server.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
