// Proves that real information can be swapped in without touching page code:
// temporarily replaces data files and one photo with alternative values, builds,
// greps the output for the new values (and absence of the old ones), then restores.
// Usage: node scripts/swap-test.mjs
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';

const files = ['src/data/site.ts', 'src/data/staff.ts', 'src/data/menu.ts', 'src/data/media.ts'];
const photo = 'src/assets/photos/hero-portrait.jpg';
const altPhoto = 'src/assets/photos/style-long.jpg';
const backup = mkdtempSync(path.join(os.tmpdir(), 'trunk-swap-'));
const fontBefore = existsSync('src/data/fonts.generated.ts') ? readFileSync('src/data/fonts.generated.ts', 'utf8') : '';
const bak = (f) => path.join(backup, f.replace(/[\\/]/g, '__'));

for (const f of [...files, photo]) copyFileSync(f, bak(f));

const edit = (f, pairs) => {
  let s = readFileSync(f, 'utf8');
  for (const [from, to] of pairs) {
    if (!s.includes(from)) throw new Error(`swap-test: pattern not found in ${f}: ${from}`);
    s = s.replace(from, to);
  }
  writeFileSync(f, s);
};

let ok = true;
try {
  edit('src/data/site.ts', [
    ["name: 'TRUNK'", "name: 'TRUNK KOENJI'"],
    ["address: { value: '○○県○○市○○ 0-0-0 ○○ビル 1F', status: 'demo' }", "address: { value: '東京都杉並区高円寺南 1-2-3 テストビル 2F', status: 'confirmed' }"],
    ["reserveUrl: null as string | null", "reserveUrl: 'https://example.com/reserve' as string | null"],
  ]);
  edit('src/data/staff.ts', [["name: '水野 あおい'", "name: '山田 テスト'"]]);
  edit('src/data/menu.ts', [["{ name: 'カット', price: 6600, minutes: 60, featured: true }", "{ name: 'カット', price: 7150, minutes: 60, featured: true }"]]);
  copyFileSync(altPhoto, photo);

  console.log('building with swapped data…');
  execSync('pnpm build', { stdio: 'pipe' });

  const top = readFileSync('dist/index.html', 'utf8');
  const salon = readFileSync('dist/salon/index.html', 'utf8');
  const staff = readFileSync('dist/staff/aoi/index.html', 'utf8');
  const checks = [
    ['店名が反映', top.includes('TRUNK KOENJI')],
    ['住所が反映', salon.includes('高円寺南 1-2-3')],
    ['旧住所が消えた', !salon.includes('○○県○○市')],
    ['料金が反映', top.includes('¥7,150')],
    ['スタッフ名が反映', staff.includes('山田 テスト') && top.includes('山田 テスト')],
    ['予約リンクが外部URLへ', top.includes('href="https://example.com/reserve"') && top.includes('target="_blank"')],
    ['内部予約案内へのリンクが予約ボタンから消えた', !/data-reserve-link[^>]*href="\/reserve"/.test(top) && !/href="\/reserve"[^>]*data-reserve-link/.test(top)],
    // 差し替えた写真は 3:4（2000×2667）なので、ヒーローの img の固有サイズが変わっていれば反映されている
    ['ヒーロー写真が差し替わった（固有サイズ 2000×2667 で判定）', /class="hero__media"[\s\S]*?<img[^>]*width="2000" height="2667"/.test(top)],
    ['日本語フォントのサブセットが新しい文字（高円寺）を含めて再生成された', readFileSync('src/data/fonts.generated.ts', 'utf8') !== fontBefore],
  ];
  for (const [label, pass] of checks) { console.log(`${pass ? '✓' : '✗'} ${label}`); if (!pass) ok = false; }
  // noindex は「写真がdemo」等の残りブロッカーがあるため残るはず
  console.log(`${top.includes('noindex') ? '✓' : '✗'} 未確認項目が残るあいだ noindex が維持される`);
  if (!top.includes('noindex')) ok = false;
} catch (e) {
  ok = false;
  console.error(e.stdout?.toString?.() || e.message);
} finally {
  for (const f of [...files, photo]) copyFileSync(bak(f), f);
  rmSync(backup, { recursive: true, force: true });
  console.log('restored original data files and photo.');
  console.log('rebuilding with original data…');
  execSync('pnpm build', { stdio: 'pipe' });
}
console.log(ok ? '\nswap-test PASSED' : '\nswap-test FAILED');
process.exit(ok ? 0 : 1);
