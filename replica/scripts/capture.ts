/**
 * Capture the implementation running on http://localhost:3000/<route>
 * Saves to .captures/<iter>/<viewport>.png
 * Usage: tsx scripts/capture.ts <iter> [route] [port]
 */
import { chromium } from "playwright";
import * as fs from "node:fs";
import * as path from "node:path";

const iter = process.argv[2] ?? "current";
const route = process.argv[3] ?? "/";
const port = process.argv[4] ?? "3000";

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 375, height: 812 },
];

const outDir = path.join(process.cwd(), ".captures", iter);
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await ctx.newPage();
      const url = `http://localhost:${port}${route}`;
      console.log(`[${vp.name}] capturing ${url}`);
      await page.goto(url, { waitUntil: "networkidle", timeout: 45000 }).catch(async () => {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
      });
      await page.waitForTimeout(1200);
      // scroll to trigger lazy stuff
      await page.evaluate(async () => {
        await new Promise<void>((res) => {
          let y = 0;
          const t = setInterval(() => {
            const h = document.documentElement.scrollHeight;
            window.scrollBy(0, 500);
            y += 500;
            if (y >= h) {
              clearInterval(t);
              window.scrollTo(0, 0);
              setTimeout(res, 400);
            }
          }, 150);
        });
      });
      await page.waitForTimeout(500);
      const outPath = path.join(outDir, `${vp.name}.png`);
      await page.screenshot({ path: outPath, fullPage: true });
      console.log(`  saved → ${outPath}`);
      await ctx.close();
    }
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
