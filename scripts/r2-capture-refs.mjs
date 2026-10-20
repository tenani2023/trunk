// R2 research only: captures the reference salon sites at 390 and 1440px in a real Chromium.
// Output goes to docs/review/r2/refs/ (research material, not site assets). Errors are recorded, not bypassed.
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const out = 'docs/review/r2/refs';
await mkdir(out, { recursive: true });
const sites = {
  ile: ['https://ile-hair-harajuku.com/', 'https://ile-hair-harajuku.com/stylists', 'https://ile-hair-harajuku.com/menu'],
  gala: ['https://galahair-official.com/', 'https://galahair-official.com/price', 'https://galahair-official.com/category/staff'],
  trace: ['https://www.trace-hair.jp/', 'https://www.trace-hair.jp/staff', 'https://www.trace-hair.jp/price'],
};
const log = [];
const browser = await chromium.launch();
for (const [name, urls] of Object.entries(sites)) {
  for (const [w, h, dpr] of [[390, 844, 2], [1440, 900, 1]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, locale: 'ja-JP', isMobile: w < 600, hasTouch: w < 600 });
    for (const url of urls) {
      const page = await ctx.newPage();
      const slug = url.replace(/https?:\/\/[^/]+\/?/, '').replace(/\//g, '-') || 'top';
      const file = `${out}/${name}-${slug}-${w}.png`;
      try {
        const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
        await page.waitForTimeout(1500);
        await page.screenshot({ path: file.replace('.png', '-fold.png') });
        await page.evaluate(async () => { const H = document.documentElement.scrollHeight; for (let y = 0; y < H; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } scrollTo(0, 0); await new Promise((r) => setTimeout(r, 800)); });
        await page.screenshot({ path: file, fullPage: true });
        log.push(`OK   ${w}px ${url} → HTTP ${res?.status()} → ${file}`);
      } catch (e) {
        log.push(`FAIL ${w}px ${url} → ${String(e.message).split('\n')[0]}`);
      }
      await page.close();
    }
    await ctx.close();
  }
}
await browser.close();
await writeFile(`${out}/CAPTURE_LOG.txt`, `Captured ${new Date().toISOString()} with Playwright Chromium (Windows). No certificate bypass.\n\n` + log.join('\n') + '\n');
console.log(log.join('\n'));
