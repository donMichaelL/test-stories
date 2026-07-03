const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const WIDTH = 1024;
const HEIGHT = 500;

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
      const rel = req.url === "/" ? "/generator.html" : decodeURIComponent(req.url.split("?")[0]);
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

async function main() {
  const locales = JSON.parse(fs.readFileSync(path.join(ROOT, "locales.json"), "utf8"));
  const requested = process.argv.slice(2);
  const targets = requested.length ? requested : Object.keys(locales);

  const server = await serve(ROOT);
  const port = server.address().port;
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });

  for (const locale of targets) {
    const copy = locales[locale];
    if (!copy) {
      console.log(`skip ${locale}: no entry in locales.json`);
      continue;
    }
    const outDir = path.join(ROOT, "..", "metadata", "android", locale, "images");
    if (!fs.existsSync(outDir)) {
      console.log(`skip ${locale}: ${path.relative(ROOT, outDir)} does not exist`);
      continue;
    }

    await page.goto(`http://127.0.0.1:${port}/generator.html`, { waitUntil: "networkidle" });
    await page.evaluate(async (c) => {
      for (const [id, text] of Object.entries(c)) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
      }
      await document.fonts.ready;
    }, copy);

    const out = path.join(outDir, "featureGraphic.png");
    await page.screenshot({ path: out, clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
    console.log(`rendered ${locale} -> ${path.relative(path.join(ROOT, "..", ".."), out)}`);
  }

  await browser.close();
  server.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
