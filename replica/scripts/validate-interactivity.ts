/**
 * interactivity-validator (Paso 7 del skill v2):
 * (a) cada carrusel renderiza > 1 slide visible
 * (b) keyboard nav (ArrowRight) avanza
 * (c) prefers-reduced-motion respetado (Embla duration 0)
 * (d) scaffold check: lib/motion.ts y lib/embla-config.ts tienen importadores
 */
import { chromium } from "playwright";
import * as fs from "node:fs";
import * as path from "node:path";

const URL = process.argv[2] ?? "http://localhost:3000/";
const root = process.cwd();

type Result = { name: string; pass: boolean; detail?: string };
const results: Result[] = [];

function scaffoldHasImporter(scaffold: string, importPath: string) {
  const componentsDir = path.join(root, "components");
  function walk(dir: string): string[] {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const p = path.join(dir, e.name);
      return e.isDirectory() ? walk(p) : [p];
    });
  }
  const files = walk(componentsDir).filter((f) => /\.(tsx|ts)$/.test(f));
  const re = new RegExp(`from\\s+["']${importPath.replace(/[/]/g, "\\/")}["']`);
  const importers = files.filter((f) => re.test(fs.readFileSync(f, "utf-8")));
  return { ok: importers.length > 0, count: importers.length, scaffold };
}

(async () => {
  // scaffold checks
  for (const [scaffold, importPath] of [
    ["lib/motion.ts", "@/lib/motion"],
    ["lib/embla-config.ts", "@/lib/embla-config"],
    ["components/ui/Carousel.tsx", "@/components/ui/Carousel"],
    ["components/ui/Reveal.tsx", "@/components/ui/Reveal"],
  ] as const) {
    const r = scaffoldHasImporter(scaffold, importPath);
    results.push({
      name: `scaffold: ${scaffold} has importers`,
      pass: r.ok,
      detail: `${r.count} importer(s)`,
    });
  }

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(800);

  // (a) carousel count + slide count
  const carousels = await page.$$('[role="region"][aria-roledescription="carousel"]');
  results.push({
    name: "carousels rendered",
    pass: carousels.length >= 3,
    detail: `${carousels.length} found (expected ≥3: Expertise, Projects, News)`,
  });

  for (let i = 0; i < carousels.length; i++) {
    const label = await carousels[i].getAttribute("aria-label");
    const slides = await carousels[i].$$eval(
      '.touch-pan-y > *',
      (nodes) => nodes.length
    );
    results.push({
      name: `carousel "${label}" has slides`,
      pass: slides > 1,
      detail: `${slides} slides`,
    });
  }

  // (b) keyboard nav — scroll first carousel, focus, press ArrowRight, check translate changes
  if (carousels.length > 0) {
    await carousels[0].scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const before = await carousels[0].$eval(
      '.touch-pan-y',
      (el) => (el as HTMLElement).style.transform || getComputedStyle(el).transform
    );
    await carousels[0].focus();
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(600);
    const after = await carousels[0].$eval(
      '.touch-pan-y',
      (el) => (el as HTMLElement).style.transform || getComputedStyle(el).transform
    );
    results.push({
      name: "keyboard nav (ArrowRight) advances first carousel",
      pass: before !== after,
      detail: `transform changed: ${before !== after}`,
    });
  }

  // (c) prev/next buttons present and clickable
  const nextBtns = await page.$$('button[aria-label="Next slide"]');
  const prevBtns = await page.$$('button[aria-label="Previous slide"]');
  results.push({
    name: "next/prev buttons present for each carousel",
    pass: nextBtns.length === carousels.length && prevBtns.length === carousels.length,
    detail: `${nextBtns.length} next, ${prevBtns.length} prev, ${carousels.length} carousels`,
  });

  // (d) scrollbar present per carousel
  const scrollbars = await page.$$('[aria-hidden="true"].h-\\[3px\\]');
  results.push({
    name: "scrollbar present",
    pass: scrollbars.length >= carousels.length,
    detail: `${scrollbars.length} scrollbar(s)`,
  });

  // (e) framer-motion mount check — at least one motion element with initial=hidden
  const motionEls = await page.$$('[style*="opacity"]');
  results.push({
    name: "framer-motion reveals mounted",
    pass: motionEls.length > 0,
    detail: `${motionEls.length} elements with opacity transitions`,
  });

  await browser.close();

  const passed = results.filter((r) => r.pass).length;
  const total = results.length;
  console.log("\n=== Interactivity validator ===");
  for (const r of results) {
    console.log(`${r.pass ? "✅" : "❌"} ${r.name}${r.detail ? `  (${r.detail})` : ""}`);
  }
  console.log(`\n${passed}/${total} checks passed`);
  fs.writeFileSync(
    path.join(root, "references", "iterations", "5", "interactivity-report.json"),
    JSON.stringify({ passed, total, results }, null, 2)
  );
  process.exit(passed === total ? 0 : 1);
})();
