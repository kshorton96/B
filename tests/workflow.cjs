const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const fs = require("fs"),
  http = require("http"),
  path = require("path"),
  assert = require("assert/strict");
(async () => {
  const root = path.resolve(__dirname, ".."),
    server = http
      .createServer((req, res) => {
        const p = path.join(root, req.url.split("?")[0]);
        if (!p.startsWith(root) || !fs.existsSync(p)) {
          res.writeHead(404);
          return res.end();
        }
        res.setHeader(
          "Content-Type",
          p.endsWith(".js")
            ? "application/javascript"
            : p.endsWith(".json")
              ? "application/json"
              : p.endsWith(".css")
                ? "text/css"
                : "text/html",
        );
        res.end(fs.readFileSync(p));
      })
      .listen(8124, "127.0.0.1");
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      ...(process.env.TEST_PROXY
        ? {
            proxy: {
              server: process.env.TEST_PROXY,
              bypass: "127.0.0.1,localhost",
            },
          }
        : {}),
      executablePath: process.env.CHROME_PATH,
    });
    for (const width of [1280, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } }),
        errors = [];
      await require("./network.cjs")(page);
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("dialog", (d) => d.accept());
      await page.goto("http://127.0.0.1:8124/editor.html");
      await page.click("#load");
      await page.waitForFunction(
        () => document.querySelector("#records").options.length === 4,
      );
      await page.click("#add");
      await page.fill("#f-name", "Temporary test place");
      await page.fill(
        "#f-description",
        "Synthetic test entry, never published",
      );
      await page.fill("#f-startYear", "1900");
      await page.fill("#f-endYear", "1910");
      await page.waitForSelector("#location-map.leaflet-container");
      await page
        .locator("#location-map")
        .click({ position: { x: 140, y: 140 } });
      assert(Number(await page.inputValue("#f-lat")) > 30);
      for (const title of ["Test book", "Test newspaper"]) {
        await page.click("#add-source");
        await page
          .locator("#sources fieldset")
          .last()
          .locator("input")
          .first()
          .fill(title);
      }
      const png = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1cAAAAASUVORK5CYII=",
        "base64",
      );
      await page.setInputFiles("#media-files", [
        { name: "one.png", mimeType: "image/png", buffer: png },
        { name: "two.png", mimeType: "image/png", buffer: png },
      ]);
      assert.equal(await page.locator("#media fieldset").count(), 2);
      for (const box of await page.locator("#media fieldset").all()) {
        await box
          .getByLabel("Caption (required for review)", { exact: true })
          .fill("Synthetic test");
        await box
          .getByLabel("Description for visitors who cannot see the image", {
            exact: true,
          })
          .fill("Single pixel");
        await box
          .getByLabel("Photographer, owner or contributor", { exact: true })
          .fill("Test");
        await box
          .getByLabel("Copyright or publication permission", { exact: true })
          .fill("Test fixture only");
      }
      await page.click("#save");
      await page.waitForFunction(() =>
        document
          .querySelector("#save-status")
          .textContent.startsWith("Draft saved"),
      );
      await page.reload();
      await page.click("#resume");
      await page.waitForFunction(
        () =>
          document.querySelector("#f-name").value === "Temporary test place",
      );
      assert.equal(await page.locator("#media img").count(), 2);
      assert.equal(await page.locator("#sources fieldset").count(), 2);
      await page.locator("#form button[type=submit]").click();
      assert(
        (await page.locator("#errors").textContent()).includes("Preview ready"),
      );
      const wait = page.waitForEvent("download");
      await page.click("#download");
      const dl = await wait,
        zip = fs.readFileSync(await dl.path());
      assert(zip.includes(png));
      assert(zip.includes(Buffer.from("Test newspaper")));
      await page.fill("#f-endYear", "1800");
      await page.click("#download");
      assert(
        (await page.locator("#errors").textContent()).includes(
          "Years reversed",
        ),
      );
      assert.equal(await page.inputValue("#f-name"), "Temporary test place");
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      assert.deepEqual(errors, []);
      await page.close();
      console.log(
        "PASS full workflow " +
          width +
          "px: new place, real Leaflet click, dates, two sources, two photos, captions/rights, IndexedDB reload including files, preview, ZIP bytes and validation retention.",
      );
    }
  } finally {
    await browser?.close();
    server.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
