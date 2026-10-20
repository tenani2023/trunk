// Crawls dist/ and checks that every internal link, image and srcset target exists.
// Usage: node scripts/verify-links.mjs  (run after `pnpm build`)
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';

const dist = 'dist';
if (!existsSync(dist)) { console.error('dist/ not found. Run pnpm build first.'); process.exit(1); }

const htmlFiles = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = path.join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) htmlFiles.push(p);
  }
})(dist);

const resolveTarget = (url) => {
  const clean = decodeURIComponent(url.split('#')[0].split('?')[0]);
  if (!clean) return null; // pure anchor
  if (/^(https?:|mailto:|tel:)/.test(clean)) return 'external';
  let p = path.join(dist, clean);
  if (existsSync(p) && statSync(p).isDirectory()) p = path.join(p, 'index.html');
  if (!existsSync(p) && existsSync(p + '.html')) p = p + '.html';
  if (!existsSync(p) && existsSync(path.join(dist, clean, 'index.html'))) p = path.join(dist, clean, 'index.html');
  return existsSync(p) ? p : false;
};

let problems = 0, checked = 0, externals = new Set();
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const urls = new Set();
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) urls.add(m[1]);
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) for (const part of m[1].split(',')) urls.add(part.trim().split(/\s+/)[0]);
  // in-page anchors
  for (const m of html.matchAll(/href="#([^"]+)"/g)) {
    if (!new RegExp(`id="${m[1]}"`).test(html)) { console.log(`✗ ${file}: missing anchor #${m[1]}`); problems++; }
  }
  for (const u of urls) {
    if (u.startsWith('#') || u.startsWith('data:')) continue;
    if (u === '#' || u === '') { console.log(`✗ ${file}: dead href`); problems++; continue; }
    const r = resolveTarget(u);
    checked++;
    if (r === 'external') { externals.add(u); continue; }
    if (r === false) { console.log(`✗ ${file}: broken ${u}`); problems++; }
  }
  if (!/name="robots" content="noindex/.test(html)) { console.log(`✗ ${file}: noindex missing`); problems++; }
  if (/LocalBusiness|application\/ld\+json/.test(html)) { console.log(`✗ ${file}: structured data present in demo`); problems++; }
}
console.log(`${htmlFiles.length} pages, ${checked} references checked, ${externals.size} external URLs (${[...externals].join(', ') || 'none'})`);
if (problems) { console.log(`${problems} problem(s)`); process.exit(1); }
console.log('All internal links, images and anchors resolve. noindex present on every page.');
