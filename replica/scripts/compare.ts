/**
 * Compare references/pages/<page>/screenshots/<vp>.png vs .captures/<iter>/<vp>.png
 * Outputs diff PNGs + JSON report to references/iterations/<iter>/
 * Usage: tsx scripts/compare.ts <iter> <pageName>
 */
import * as fs from "node:fs";
import * as path from "node:path";
import sharp from "sharp";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const iter = process.argv[2] ?? "1";
const pageName = process.argv[3] ?? "home";

const VIEWPORTS = ["desktop", "tablet", "mobile"] as const;

const refDir = path.join(process.cwd(), "references", "pages", pageName, "screenshots");
const genDir = path.join(process.cwd(), ".captures", iter);
const outDir = path.join(process.cwd(), "references", "iterations", iter);
fs.mkdirSync(outDir, { recursive: true });

async function loadAndResize(p: string, w: number, h: number): Promise<Buffer> {
  return sharp(p)
    .resize({ width: w, height: h, fit: "fill" })
    .png()
    .toBuffer();
}

async function compareViewport(vp: string) {
  const refPath = path.join(refDir, `${vp}.png`);
  const genPath = path.join(genDir, `${vp}.png`);
  if (!fs.existsSync(refPath) || !fs.existsSync(genPath)) {
    console.log(`[${vp}] missing input (ref:${fs.existsSync(refPath)} gen:${fs.existsSync(genPath)})`);
    return null;
  }
  const refMeta = await sharp(refPath).metadata();
  const w = refMeta.width ?? 1440;
  const h = refMeta.height ?? 900;
  const refBuf = await loadAndResize(refPath, w, h);
  const genBuf = await loadAndResize(genPath, w, h);
  const refPng = PNG.sync.read(refBuf);
  const genPng = PNG.sync.read(genBuf);
  const diff = new PNG({ width: w, height: h });
  const mismatch = pixelmatch(refPng.data, genPng.data, diff.data, w, h, {
    threshold: 0.1,
    includeAA: true,
  });
  const ratio = mismatch / (w * h);
  const similarity = 1 - ratio;
  const diffPath = path.join(outDir, `diff-${vp}.png`);
  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  console.log(`[${vp}] ${(similarity * 100).toFixed(2)}% similar (${mismatch} px diff)`);
  return { viewport: vp, width: w, height: h, similarity, mismatch, diffPath };
}

(async () => {
  const results = [] as Array<Awaited<ReturnType<typeof compareViewport>>>;
  for (const vp of VIEWPORTS) results.push(await compareViewport(vp));
  const report = {
    iteration: iter,
    page: pageName,
    timestamp: new Date().toISOString(),
    results: results.filter(Boolean),
  };
  fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
  console.log(`✓ report → ${path.join(outDir, "report.json")}`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
