// Full-page screenshots of every public page at phone and desktop widths.
// Usage: node scripts/screenshots.mjs [baseUrl] [outDir] [--widths=390,1440] [--browser=chromium|webkit]
// Default base URL is the preview server (http://localhost:4321).
import { chromium, webkit } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith('http')) ?? 'http://localhost:4321';
const outDir = args.find((a) => !a.startsWith('http') && !a.startsWith('--')) ?? 'docs/screenshots';
const widths = (args.find((a) => a.startsWith('--widths='))?.split('=')[1] ?? '390,1440').split(',').map(Number);
const browserName = args.find((a) => a.startsWith('--browser='))?.split('=')[1] ?? 'chromium';
const pages = ['/', '/styles', '/staff', '/staff/aoi', '/menu', '/salon', '/reserve', '/404'];

await mkdir(outDir, { recursive: true });
const browser = await (browserName === 'webkit' ? webkit : chromium).launch();
const errors = [];
for (const width of widths) {
  const height = width < 600 ? 844 : width < 1100 ? 1024 : 900;
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: width < 600 ? 2 : 1,
    isMobile: width < 600 && browserName !== 'webkit' ? true : false,
    hasTouch: width < 600,
    locale: 'ja-JP',
  });
  // Warm-up pass: the Japanese web font uses font-display: optional and is loaded after window.load,
  // so a first visit renders in the system font. Visiting once first makes the captures represent a
  // repeat visit (web font from cache). Pass --cold to skip and capture first-visit rendering instead.
  if (!args.includes('--cold')) {
    const warm = await ctx.newPage();
    for (const p of pages) { await warm.goto(base + p, { waitUntil: 'load' }); await warm.waitForTimeout(400); }
    await warm.close();
  }
  for (const p of pages) {
    const page = await ctx.newPage();
    page.on('console', (m) => { if (m.type() === 'error') errors.push(`[${width}] ${p}: ${m.text()}`); });
    page.on('pageerror', (e) => errors.push(`[${width}] ${p}: ${e.message}`));
    await page.addInitScript(() => { document.addEventListener('DOMContentLoaded', () => { const st = document.createElement('style'); st.textContent = 'html{scroll-behavior:auto!important}'; document.head.appendChild(st); }); });
    const res = await page.goto(base + p, { waitUntil: 'networkidle' });
    if (res && res.status() >= 400 && p !== '/404') errors.push(`[${width}] ${p}: HTTP ${res.status()}`);
    // trigger reveal animations by scrolling through the page
    await page.evaluate(async () => {
      const h = document.documentElement.scrollHeight;
      for (let y = 0; y < h; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 500));
    });
    const name = (p === '/' ? 'top' : p.replace(/^\//, '').replace(/\//g, '-')) + `-${browserName}-${width}.png`;
    await page.screenshot({ path: path.join(outDir, name), fullPage: true });
    // horizontal overflow check
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 0) errors.push(`[${width}] ${p}: horizontal overflow ${overflow}px`);
    console.log(`${name}${overflow > 0 ? `  (overflow ${overflow}px)` : ''}`);
    await page.close();
  }
  await ctx.close();
}
await browser.close();
if (errors.length) { console.log('\nIssues:'); errors.forEach((e) => console.log(' - ' + e)); process.exitCode = 1; }
else console.log('\nNo console errors or horizontal overflow.');
