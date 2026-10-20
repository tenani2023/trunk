import { test, expect, type Page } from '@playwright/test';

const pages = ['/', '/styles', '/works', '/works/category/cut', '/works/category/kids', '/works/bob', '/works/highlight', '/staff', '/staff/aoi', '/staff/rin', '/staff/yuto', '/staff/kanata', '/menu', '/salon', '/reserve'];

async function noHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, 'horizontal overflow (px)').toBeLessThanOrEqual(0);
}

test.describe('pages', () => {
  for (const path of pages) {
    test(`renders ${path} without console errors or horizontal overflow`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
      await noHorizontalOverflow(page);
      // すべての画像に alt 属性と width/height がある
      const bad = await page.$$eval('img', (imgs) => imgs.filter((i) => !i.hasAttribute('alt') || !i.getAttribute('width') || !i.getAttribute('height')).length);
      expect(bad).toBe(0);
      expect(errors).toEqual([]);
    });
  }

  test('404 page renders with links home', async ({ page }) => {
    const res = await page.goto('/this-page-does-not-exist');
    expect(res?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Not');
    await expect(page.getByRole('link', { name: /トップへ/ })).toBeVisible();
  });
});

test.describe('reservation entry', () => {
  test('reserve links point to internal guide while no external URL is set', async ({ page }) => {
    await page.goto('/');
    const hrefs = await page.$$eval('[data-reserve-link]', (as) => as.map((a) => (a as HTMLAnchorElement).getAttribute('href')));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const h of hrefs) expect(h).toBe('/reserve');
    // 予約案内ページには4つの窓口（LINE / Instagram / 電話 / ホットペッパー）があり、入力欄は無い
    await page.goto('/reserve');
    for (const id of ['line', 'instagram', 'tel', 'hotpepper']) await expect(page.locator(`#${id}`)).toBeVisible();
    await expect(page.locator('input, textarea')).toHaveCount(0);
  });

  test('no dead anchors (href="#") anywhere', async ({ page }) => {
    for (const path of pages) {
      await page.goto(path);
      const dead = await page.$$eval('a', (as) => as.filter((a) => a.getAttribute('href') === '#' || a.getAttribute('href') === '').length);
      expect(dead, `dead anchors on ${path}`).toBe(0);
    }
  });
});

test.describe('staff', () => {
  test('top page shows all four members and links to each detail page', async ({ page }) => {
    await page.goto('/');
    const names = ['水野 あおい', '高橋 りん', '小林 ゆうと', '石井 かなた'];
    for (const n of names) await expect(page.locator('.staff-card').filter({ hasText: n })).toBeVisible();
    await page.locator('.staff-card').filter({ hasText: '石井 かなた' }).getByRole('link').click();
    await expect(page).toHaveURL(/\/staff\/kanata/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('石井 かなた');
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe('mobile menu', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) >= 900, 'mobile only');

  test('opens, traps focus, closes with Esc and restores focus', async ({ page }) => {
    await page.goto('/');
    const openBtn = page.locator('[data-menu-open]');
    await expect(openBtn).toBeVisible();
    const box = await openBtn.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.width).toBeGreaterThanOrEqual(44);

    await openBtn.click();
    const menu = page.locator('#site-menu');
    await expect(menu).toBeVisible();
    await expect(openBtn).toHaveAttribute('aria-expanded', 'true');
    // 初期フォーカスは閉じるボタン
    await expect(page.locator('[data-menu-close]')).toBeFocused();
    // Tab を回してもメニュー内に留まる
    for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
    const inside = await page.evaluate(() => !!document.activeElement?.closest('#site-menu'));
    expect(inside).toBe(true);
    // Esc で閉じてフォーカスが戻る
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(openBtn).toBeFocused();
  });

});

test.describe('accessibility basics', () => {
  test('keyboard: skip link, visible focus on nav', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'WebKit/Safari は既定で Tab がリンクを飛ばす（Option+Tab）。プラットフォーム仕様のため Chromium のみ検証');
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
  });

  test('reduced motion: reveal elements are visible without scrolling', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('/');
    const hidden = await page.$$eval('[data-reveal]', (els) => els.filter((e) => getComputedStyle(e).opacity !== '1').length);
    expect(hidden).toBe(0);
    await ctx.close();
  });

  test('200% text zoom keeps reserve entry usable', async ({ page }) => {
    await page.goto('/');
    await page.addStyleTag({ content: 'html { font-size: 200% !important; } body { font-size: 32px !important; }' });
    await page.waitForTimeout(200);
    await noHorizontalOverflow(page);
    const link = page.locator('[data-reserve-link]:visible').first();
    await expect(link).toBeVisible();
  });
});
