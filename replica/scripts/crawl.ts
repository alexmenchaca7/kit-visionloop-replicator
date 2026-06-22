/**
 * VisionLoop crawler — captures references for ONE page.
 * Usage: tsx scripts/crawl.ts <url> <pageName>
 *   ex:  tsx scripts/crawl.ts https://virya-energy.com/en/ home
 */
import { chromium, Browser, Page } from "playwright";
import * as fs from "node:fs";
import * as path from "node:path";
import * as https from "node:https";
import * as http from "node:http";

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 375, height: 812 },
];

const targetUrl = process.argv[2] ?? "https://virya-energy.com/en/";
const pageName = process.argv[3] ?? "home";

const ROOT = path.join(process.cwd(), "references", "pages", pageName);
const SHARED = path.join(process.cwd(), "references", "shared-assets");
const SHOTS = path.join(ROOT, "screenshots");
const ASSETS_IMG = path.join(ROOT, "assets", "images");
const ASSETS_SVG = path.join(ROOT, "assets", "svgs");
const SHARED_IMG = path.join(SHARED, "images");
const SHARED_FONTS = path.join(SHARED, "fonts");

[ROOT, SHOTS, ASSETS_IMG, ASSETS_SVG, SHARED, SHARED_IMG, SHARED_FONTS].forEach(
  (d) => fs.mkdirSync(d, { recursive: true })
);

function sanitize(s: string) {
  return s.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

function downloadOnce(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) return resolve(true);
    try {
      const u = new URL(url);
      const lib = u.protocol === "https:" ? https : http;
      const req = lib.get(
        url,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
            Accept: "*/*",
          },
        },
        (res) => {
          if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            downloadOnce(new URL(res.headers.location, url).toString(), dest).then(resolve);
            return;
          }
          if (res.statusCode !== 200) {
            res.resume();
            return resolve(false);
          }
          const file = fs.createWriteStream(dest);
          res.pipe(file);
          file.on("finish", () => file.close(() => resolve(true)));
          file.on("error", () => resolve(false));
        }
      );
      req.on("error", () => resolve(false));
      req.setTimeout(15000, () => {
        req.destroy();
        resolve(false);
      });
    } catch {
      resolve(false);
    }
  });
}

async function autoScroll(page: Page) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let total = 0;
      const distance = 600;
      const timer = setInterval(() => {
        const sh = document.documentElement.scrollHeight;
        window.scrollBy(0, distance);
        total += distance;
        if (total >= sh) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          setTimeout(resolve, 800);
        }
      }, 250);
    });
  });
}

async function capture(browser: Browser, viewport: (typeof VIEWPORTS)[number]) {
  const ctx = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
  });
  const page = await ctx.newPage();
  console.log(`[${viewport.name}] navigating…`);
  await page.goto(targetUrl, { waitUntil: "networkidle", timeout: 60000 }).catch(async () => {
    await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  });
  await page.waitForTimeout(1500);
  // dismiss cookie banners if visible
  for (const sel of [
    'button:has-text("Accept")',
    'button:has-text("Agree")',
    'button:has-text("OK")',
    '#cookie-accept',
    '.cky-btn-accept',
    'button[aria-label*="accept" i]',
  ]) {
    try {
      const el = await page.$(sel);
      if (el) {
        await el.click({ timeout: 1500 });
        await page.waitForTimeout(500);
        break;
      }
    } catch {}
  }
  await autoScroll(page);
  await page.waitForTimeout(800);
  const outPath = path.join(SHOTS, `${viewport.name}.png`);
  await page.screenshot({ path: outPath, fullPage: true });
  console.log(`[${viewport.name}] screenshot saved → ${outPath}`);

  if (viewport.name === "desktop") {
    // Save DOM
    const html = await page.content();
    fs.writeFileSync(path.join(ROOT, "dom.html"), html, "utf-8");

    // Computed styles for significant nodes
    const styles = await page.evaluate(() => {
      const out: Array<Record<string, unknown>> = [];
      const TAGS = [
        "header",
        "nav",
        "main",
        "section",
        "article",
        "footer",
        "h1",
        "h2",
        "h3",
        "p",
        "a",
        "button",
        "img",
        "ul",
        "li",
      ];
      const els = Array.from(document.querySelectorAll(TAGS.join(",")));
      els.slice(0, 600).forEach((el, idx) => {
        const cs = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        out.push({
          idx,
          tag: el.tagName.toLowerCase(),
          cls: (el as HTMLElement).className || "",
          text: (el.textContent || "").slice(0, 120).trim(),
          rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
          font: {
            family: cs.fontFamily,
            size: cs.fontSize,
            weight: cs.fontWeight,
            lineHeight: cs.lineHeight,
            letterSpacing: cs.letterSpacing,
            color: cs.color,
          },
          box: {
            padding: cs.padding,
            margin: cs.margin,
            display: cs.display,
            position: cs.position,
            bg: cs.backgroundColor,
            border: cs.border,
            radius: cs.borderRadius,
          },
        });
      });
      return out;
    });
    fs.writeFileSync(
      path.join(ROOT, "computed-styles.json"),
      JSON.stringify(styles, null, 2),
      "utf-8"
    );

    // Asset URLs (images, svgs, fonts)
    const assetData = await page.evaluate(() => {
      const imgs = Array.from(document.images).map((i) => i.currentSrc || i.src).filter(Boolean);
      const bgs = Array.from(document.querySelectorAll("*"))
        .map((el) => getComputedStyle(el).backgroundImage)
        .filter((b) => b && b !== "none")
        .flatMap((b) => Array.from(b.matchAll(/url\(["']?([^"')]+)["']?\)/g)).map((m) => m[1]));
      const svgs = Array.from(document.querySelectorAll("svg"))
        .slice(0, 30)
        .map((s) => s.outerHTML);
      const fonts = Array.from(document.styleSheets)
        .flatMap((ss) => {
          try {
            return Array.from(ss.cssRules || []);
          } catch {
            return [];
          }
        })
        .filter((r) => (r as CSSRule).constructor.name === "CSSFontFaceRule")
        .map((r) => (r as CSSFontFaceRule).cssText);
      return { imgs, bgs, svgs, fonts };
    });

    fs.writeFileSync(
      path.join(ROOT, "asset-urls.json"),
      JSON.stringify(assetData, null, 2),
      "utf-8"
    );

    // Save inline SVGs
    assetData.svgs.forEach((svg: string, i: number) => {
      fs.writeFileSync(path.join(ASSETS_SVG, `inline-${i}.svg`), svg, "utf-8");
    });

    // Download up to 40 image assets (page-specific) + try to detect shared (logo)
    const allUrls = Array.from(new Set([...assetData.imgs, ...assetData.bgs]))
      .filter((u: string) => /^https?:\/\//.test(u))
      .slice(0, 60);

    console.log(`[assets] downloading ${allUrls.length} image candidates…`);
    let ok = 0;
    for (const u of allUrls) {
      try {
        const url = new URL(u);
        const fname = sanitize(decodeURIComponent(path.basename(url.pathname)) || "asset");
        // Heuristic: logos/icons → shared; everything else → page-specific
        const lower = url.pathname.toLowerCase();
        const isShared = /logo|favicon|icon|brand/.test(lower);
        const dir = isShared ? SHARED_IMG : ASSETS_IMG;
        if (await downloadOnce(u, path.join(dir, fname))) ok++;
      } catch {}
    }
    console.log(`[assets] downloaded ${ok}/${allUrls.length}`);
  }

  await ctx.close();
}

(async () => {
  console.log(`VisionLoop crawler → ${targetUrl} (page: ${pageName})`);
  const browser = await chromium.launch({ headless: true });
  try {
    for (const vp of VIEWPORTS) {
      await capture(browser, vp);
    }
    console.log("✓ crawl complete");
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error("CRAWL FAILED:", e);
  process.exit(1);
});
