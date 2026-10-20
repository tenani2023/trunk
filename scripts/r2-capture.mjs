// R2 before/after captures under fixed, recorded conditions.
// Usage: node scripts/r2-capture.mjs <label>   (e.g. before / after) → docs/review/r2/<label>/
// Conditions per shot: Chromium, viewport listed, deviceScaleFactor 2 (phone) / 1 (desktop),
//   "cold"  = brand-new context, no cache (first visit: system Japanese font, web display font via preload)
//   "warm"  = same context after a prior visit to every page (fonts cached)
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const label = process.argv[2] ?? 'before';
const base = process.argv[3] ?? 'http://127.0.0.1:4322';
const out = `docs/review/r2/${label}`;
await mkdir(out, { recursive: true });

const viewports = [
  { name: '390', width: 390, height: 844, dpr: 2, mobile: true },
  { name: '375s', width: 375, height: 667, dpr: 2, mobile: true },
  { name: '1440', width: 1440, height: 900, dpr: 1, mobile: false },
];
const pages = { top: '/', styles: '/styles', staff: '/staff', 'staff-aoi': '/staff/aoi', menu: '/menu', salon: '/salon', reserve: '/reserve' };
const notes = [];
const browser = await chromium.launch();

async function shoot(page, file, full) {
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 250))));
  await page.screenshot({ path: file, fullPage: full });
}
async function settle(page) {
  await page.evaluate(async () => {
    document.head.insertAdjacentHTML('beforeend', '<style>html{scroll-behavior:auto!important}</style>');
    const H = document.documentElement.scrollHeight;
    for (let y = 0; y < H; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
    scrollTo(0, 0); await new Promise((r) => setTimeout(r, 600));
  });
}

for (const vp of viewports) {
  // COLD: fresh context, first paint captured as early as possible, then settled state
  {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.dpr, isMobile: vp.mobile, hasTouch: vp.mobile, locale: 'ja-JP' });
    const page = await ctx.newPage();
    const fonts = [];
    page.on('response', (r) => { if (/\.woff2?(\?|$)/.test(r.url())) fonts.push(r.url().split('/').pop()); });
    await page.goto(base + '/', { waitUntil: 'commit' });
    await page.waitForSelector('h1', { state: 'attached' });
    await page.screenshot({ path: `${out}/top-${vp.name}-cold-firstpaint.png` });
    await page.waitForLoadState('load');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${out}/top-${vp.name}-cold-settled.png` });
    const applied = await page.evaluate(() => ({
      bodyFont: getComputedStyle(document.body).fontFamily.split(',')[0],
      notoLoaded: [...document.fonts].some((f) => f.family.replace(/"/g, '') === 'Noto Sans JP Variable' && f.status === 'loaded'),
      serifLoaded: document.fonts.check('16px "Instrument Serif"'),
      fontsCount: document.fonts.size,
    }));
    notes.push(`[${vp.name} cold] woff2 requested by load+1.5s: ${fonts.length} (${fonts.slice(0, 3).join(', ')}${fonts.length > 3 ? ', …' : ''}); Noto applied=${applied.notoLoaded}; Instrument Serif=${applied.serifLoaded}`);
    await ctx.close();
  }
  // WARM: prime every page in one context, then capture
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.dpr, isMobile: vp.mobile, hasTouch: vp.mobile, locale: 'ja-JP' });
  const prime = await ctx.newPage();
  for (const p of Object.values(pages)) { await prime.goto(base + p, { waitUntil: 'load' }); await prime.waitForTimeout(300); }
  await prime.evaluate(() => document.fonts.ready);
  await prime.close();
  for (const [name, path] of Object.entries(pages)) {
    if (vp.name === '375s' && !['top', 'staff', 'menu'].includes(name)) continue;
    const page = await ctx.newPage();
    await page.goto(base + path, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await shoot(page, `${out}/${name}-${vp.name}-warm-fold.png`, false);
    await settle(page);
    await shoot(page, `${out}/${name}-${vp.name}-warm-full.png`, true);
    if (name === 'top') {
      // second and third screens (scroll by viewport height)
      for (const n of [1, 2]) {
        await page.evaluate((y) => scrollTo(0, y), vp.height * n);
        await page.waitForTimeout(500);
        await page.screenshot({ path: `${out}/top-${vp.name}-warm-screen${n + 1}.png` });
      }
      // People section framed
      const box = await page.locator('.people').first().evaluate((el) => { const r = el.getBoundingClientRect(); return { y: r.top + window.scrollY, h: r.height }; });
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${out}/top-${vp.name}-warm-people.png`, fullPage: true, clip: { x: 0, y: box.y, width: vp.width, height: box.h } });
    }
    await page.close();
  }
  const fontsWarm = await (async () => { const p = await ctx.newPage(); await p.goto(base + '/', { waitUntil: 'load' }); const r = await p.evaluate(async () => { await document.fonts.ready; return [...document.fonts].some((f) => f.family.replace(/"/g, '') === 'Noto Sans JP Variable' && f.status === 'loaded'); }); await p.close(); return r; })();
  notes.push(`[${vp.name} warm] Noto Sans JP applied on revisit: ${fontsWarm}`);
  await ctx.close();
}
await browser.close();
await writeFile(`${out}/CONDITIONS.txt`, `label=${label}\nbase=${base}\ncaptured=${new Date().toISOString()}\nbrowser=Playwright Chromium (Windows 11)\nviewports=390x844@2x, 375x667@2x, 1440x900@1x\ncold=new context, no cache; warm=after priming all pages in the same context\n\n${notes.join('\n')}\n`);
console.log(notes.join('\n'));
