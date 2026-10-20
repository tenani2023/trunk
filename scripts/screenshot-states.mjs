// Screenshots of interactive states (open menu, 200% text zoom) against the preview server.
// Usage: node scripts/screenshot-states.mjs
import { chromium } from '@playwright/test';
const b = await chromium.launch(); const ctx = await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2 });
const p = await ctx.newPage(); await p.goto('http://127.0.0.1:4322/', { waitUntil:'networkidle' });
await p.click('[data-menu-open]'); await p.waitForTimeout(600);
await p.screenshot({ path: 'docs/screenshots/menu-open-chromium-390.png' });
await p.keyboard.press('Escape'); await p.waitForTimeout(400);
await p.addStyleTag({ content: 'html{font-size:200%!important} body{font-size:32px!important}' }); await p.waitForTimeout(300);
await p.screenshot({ path: 'docs/screenshots/top-zoom200-chromium-390.png' });
await b.close();
