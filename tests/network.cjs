// Optional test-only bridge for environments whose Chrome does not trust the
// outbound proxy CA. curl retains certificate verification. Production is unchanged.
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");
const { promisify } = require("util");
const run = promisify(execFile);
module.exports = async function network(page) {
  if (!process.env.TEST_ASSET_CACHE) return;
  await page.route("https://unpkg.com/**", async (route) => {
    const url = new URL(route.request().url());
    const name = path.basename(url.pathname);
    const file = path.join(process.env.TEST_ASSET_CACHE, name);
    if (fs.existsSync(file))
      await route.fulfill({
        body: fs.readFileSync(file),
        contentType: name.endsWith(".css")
          ? "text/css"
          : "application/javascript",
        headers: { "access-control-allow-origin": "*" },
      });
    else await route.abort();
  });
  await page.route(
    /^https:\/\/[abc]\.tile\.openstreetmap\.org\/\d+\/\d+\/\d+\.png$/,
    async (route) => {
      const url = new URL(route.request().url());
      const file = path.join(
        process.env.TEST_ASSET_CACHE,
        url.pathname.replaceAll("/", "_"),
      );
      try {
        if (!fs.existsSync(file))
          await run("curl", [
            "--fail",
            "--silent",
            "--show-error",
            "--max-time",
            "20",
            "--user-agent",
            "HarmonCountyHistoricalAtlas-LocalReview/1.0 (+https://github.com/kshorton96/B)",
            "--referer",
            route.request().headers().referer || "http://127.0.0.1/",
            url.href,
            "-o",
            file,
          ]);
        await route.fulfill({
          body: fs.readFileSync(file),
          contentType: "image/png",
        });
      } catch {
        await route.abort();
      }
    },
  );
};
