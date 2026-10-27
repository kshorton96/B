// Visual and interaction regression. Fixture records exist only in intercepted responses.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");
const assert = require("assert/strict");
const root = path.resolve(__dirname, "..");
const server = http
  .createServer((req, res) => {
    let target = path.join(
      root,
      decodeURIComponent(req.url.split("?")[0]).replace(/^\/B/, ""),
    );
    if (fs.existsSync(target) && fs.statSync(target).isDirectory())
      target = path.join(target, "index.html");
    if (!target.startsWith(root + "/") || !fs.existsSync(target)) {
      res.writeHead(404);
      return res.end();
    }
    const ext = path.extname(target);
    res.setHeader(
      "Content-Type",
      {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".json": "application/json",
      }[ext] || "application/octet-stream",
    );
    res.end(fs.readFileSync(target));
  })
  .listen(8125, "127.0.0.1");
(async () => {
  const browser = await chromium.launch({
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
  fs.mkdirSync(path.join(root, "docs/screenshots"), { recursive: true });
  try {
    for (const width of [1440, 390, 720]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      const errors = [];
      await require("./network.cjs")(page);
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto("http://127.0.0.1:8125/B/");
      await page.waitForFunction(
        () => document.querySelector("#count").textContent === "0 records",
      );
      await page.waitForSelector(".leaflet-container");
      await page.waitForFunction(
        () =>
          [...document.querySelectorAll(".leaflet-tile")].length > 0 &&
          [...document.querySelectorAll(".leaflet-tile")].every(
            (i) => i.complete && i.naturalWidth > 0,
          ),
      );
      assert.equal(
        await page.locator("#filter-index").getAttribute("open"),
        null,
      );
      assert(
        await page
          .getByRole("button", { name: "Explore the illustrative examples" })
          .isVisible(),
      );
      assert.equal(
        await page.locator("meta[name=robots]").getAttribute("content"),
        "noindex,nofollow",
      );
      if (width !== 720)
        await page.screenshot({
          animations: "disabled",
          path: path.join(
            root,
            `docs/screenshots/${width === 1440 ? "desktop-home" : "mobile-home"}.png`,
          ),
          fullPage: true,
        });
      await page
        .getByRole("button", { name: "Explore the illustrative examples" })
        .click();
      assert.equal(await page.locator(".record").count(), 4);
      await page.waitForSelector(".marker-cluster");
      if (width === 1440)
        await page.locator(".layout").screenshot({
          path: path.join(root, "docs/screenshots/desktop-map.png"),
          animations: "disabled",
        });
      await page.locator(".atlas-pin").first().click();
      assert(await page.locator("#detail").isVisible());
      await page.keyboard.press("Escape");
      await page.getByRole("button", { name: "Zoom in", exact: true }).click();
      assert(await page.locator(".leaflet-container").isVisible());
      await page.locator("#filter-index summary").click();
      await page.getByLabel("Industry", { exact: true }).check();
      await page.getByLabel("Business", { exact: true }).check();
      assert.equal(await page.locator(".record").count(), 2);
      await page.fill("#search", "Warren");
      assert.equal(await page.locator(".record").count(), 1);
      await page.locator(".record").click();
      assert(await page.locator("#detail").isVisible());
      assert.equal(
        await page.locator(".archive-ref").textContent(),
        "Archive record hc-002",
      );
      assert(
        await page
          .locator(".evidence")
          .textContent()
          .then((s) => s.includes("ILLUSTRATIVE")),
      );
      assert.equal(await page.locator("#detail img").count(), 0);
      assert.equal(
        await page.locator("#detail .record-contribute").getAttribute("href"),
        "contribute.html?record=hc-002&place=Warren%E2%80%93Horton%20Motor%20Company",
      );
      assert(await page.evaluate(() => document.activeElement.id === "detail"));
      if (width !== 720)
        await page.screenshot({
          animations: "disabled",
          path: path.join(
            root,
            `docs/screenshots/${width === 1440 ? "desktop-record" : "mobile-record"}.png`,
          ),
        });
      await page.keyboard.press("Escape");
      assert(await page.locator("#detail").isHidden());
      assert(
        await page.evaluate(
          () => document.activeElement.dataset.recordId === "hc-002",
        ),
      );
      await page.goto("http://127.0.0.1:8125/B/#record=hc-001");
      await page.waitForSelector("#detail h2");
      assert.equal(
        await page.locator("#detail h2").textContent(),
        "Hollis Cotton Oil Mill",
      );
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      // 720 CSS pixels model the reflow width of a 1440px viewport at 200% zoom.
      assert.deepEqual(errors, []);
      await page.close();
      console.log(
        `PASS redesign ${width}px: map/clustering, empty state, multiselect, search, evidence, IDs, links, focus, Escape, reflow.`,
      );
    }
    const page = await browser.newPage();
    const archive = JSON.parse(
      fs.readFileSync(path.join(root, "data/records.json")),
    );
    const p = archive.records[0];
    p.media = [
      {
        type: "image",
        url: "assets/test.png",
        alt: "Synthetic pixel fixture",
        caption: "Test caption",
        date: "Fixture date",
        credit: "Fixture credit",
        rights: "Fixture rights",
        source: "Fixture source",
      },
    ];
    p.sources = [
      {
        title: "Fixture citation",
        url: "https://example.org/",
        reference: "Fixture page",
      },
    ];
    p.relatedIds = ["hc-002"];
    await page.route("**/data/records.json", (r) =>
      r.fulfill({ json: archive }),
    );
    await page.route("**/assets/test.png", (r) =>
      r.fulfill({
        contentType: "image/png",
        body: Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1cAAAAASUVORK5CYII=",
          "base64",
        ),
      }),
    );
    await page.goto("http://127.0.0.1:8125/B/#record=hc-001");
    await page.waitForSelector("#detail img");
    assert.equal(
      await page.locator("#detail img").getAttribute("alt"),
      "Synthetic pixel fixture",
    );
    assert(
      (await page.locator("figcaption").textContent()).includes(
        "Fixture rights",
      ),
    );
    assert(
      (await page.locator("figcaption").textContent()).includes("Fixture date"),
    );
    assert.equal(
      await page
        .getByRole("link", { name: "Fixture citation" })
        .getAttribute("href"),
      "https://example.org/",
    );
    await page
      .getByRole("link", { name: "Related: Warren–Horton Motor Company" })
      .click();
    assert.equal(
      await page.locator("#detail h2").textContent(),
      "Warren–Horton Motor Company",
    );
    await page.goto(
      "http://127.0.0.1:8125/B/contribute.html?record=hc-002&place=Test",
    );
    await page.waitForSelector("#online:not([hidden])");
    assert(
      (await page.locator("#online").getAttribute("href")).includes(
        "record=hc-002",
      ),
    );
    console.log(
      "PASS fixture media, caption/date/rights, citations, related navigation and configured online contribution context. No external submission sent.",
    );
    await page.close();
  } finally {
    await browser.close();
  }
})()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => server.close());
