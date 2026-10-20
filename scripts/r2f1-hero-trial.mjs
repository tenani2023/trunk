// R2-F1 hero trial: renders one hero candidate into src/assets/photos/hero-portrait.jpg, builds,
// and captures the first screen at 390×844, 375×667 and 1440×900 (cold) into docs/review/r2-f1/hero-trials/<name>/.
// The original hero-portrait.jpg is restored afterwards. Usage: node scripts/r2f1-hero-trial.mjs <name> <rawId> <cx> <cy> <zoom>
import sharp from 'sharp';
import { execSync } from 'node:child_process';
import { copyFileSync, mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';

const [name, id, cx = '0.5', cy = '0.4', zoom = '1'] = process.argv.slice(2);
const src = `src/assets/photos/_raw/${id}.jpg`;
const dst = 'src/assets/photos/hero-portrait.jpg';
const out = `docs/review/r2-f1/hero-trials/${name}`;
mkdirSync(out, { recursive: true });
copyFileSync(dst, `${out}/_hero-portrait.backup.jpg`);

const m = await sharp(src).metadata();
const W = m.width, H = m.height, target = 4 / 5;
let cw = W, ch = Math.round(W / target); if (ch > H) { ch = H; cw = Math.round(H * target); }
cw = Math.round(cw / +zoom); ch = Math.round(ch / +zoom);
let left = Math.round(+cx * W - cw / 2), top = Math.round(+cy * H - ch / 2);
left = Math.max(0, Math.min(W - cw, left)); top = Math.max(0, Math.min(H - ch, top));
await sharp(src).rotate().extract({ left, top, width: cw, height: ch }).resize({ width: 2000, withoutEnlargement: true })
  .modulate({ saturation: 0.92 }).recomb([[1.03, 0, 0], [0, 1, 0], [0, 0, 0.97]]).jpeg({ quality: 88, mozjpeg: true }).toFile(dst);
console.log(`${name}: crop ${cw}x${ch} @${left},${top} of ${W}x${H}`);

execSync('pnpm build', { stdio: 'pipe' });
const b = await chromium.launch();
for (const [w, h, dpr] of [[390, 844, 2], [375, 667, 2], [1440, 900, 1]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, isMobile: w < 600, hasTouch: w < 600, locale: 'ja-JP' });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:4322/', { waitUntil: 'load' }); await p.waitForTimeout(800);
  await p.screenshot({ path: `${out}/hero-${w}x${h}.png` });
  await ctx.close();
}
await b.close();
copyFileSync(`${out}/_hero-portrait.backup.jpg`, dst);
console.log('restored original hero-portrait.jpg (dist still has the trial build)');
