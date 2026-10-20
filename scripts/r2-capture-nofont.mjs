// Captures how pages look when web fonts are unavailable (blocked): this is what a first visit
// looks like on a slow network before/without web fonts, and what a font-fetch failure looks like.
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const label = process.argv[2] ?? 'before'; const base = 'http://127.0.0.1:4322';
const out = `docs/review/r2/${label}`; await mkdir(out, { recursive: true });
const b = await chromium.launch();
for (const [w, h, dpr] of [[390, 844, 2], [1440, 900, 1]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, locale: 'ja-JP', isMobile: w < 600, hasTouch: w < 600 });
  await ctx.route(/\.woff2?(\?|$)/, (r) => r.abort());
  for (const [name, path] of [['top', '/'], ['menu', '/menu'], ['staff', '/staff']]) {
    const p = await ctx.newPage(); await p.goto(base + path, { waitUntil: 'load' }); await p.waitForTimeout(800);
    await p.screenshot({ path: `${out}/${name}-${w}-nofont-fold.png` });
    if (name === 'top') { const people = p.locator('.people').first(); await people.scrollIntoViewIfNeeded(); await p.waitForTimeout(400); await people.screenshot({ path: `${out}/top-${w}-nofont-people.png` }); }
    await p.close();
  }
  // JS disabled
  const ctx2 = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, javaScriptEnabled: false, locale: 'ja-JP' });
  const p2 = await ctx2.newPage(); await p2.goto(base + '/', { waitUntil: 'load' }); await p2.waitForTimeout(800);
  await p2.screenshot({ path: `${out}/top-${w}-nojs-fold.png` }); await ctx2.close();
  await ctx.close();
}
await b.close(); console.log('done');
