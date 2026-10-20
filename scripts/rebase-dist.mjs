// Rewrites root-relative URLs in dist/ so the site works under a sub-path (e.g. GitHub Pages /trunk/).
// Usage: node scripts/rebase-dist.mjs /trunk   (run after `pnpm build` and `pnpm verify:links`)
// Local dev/preview keep serving from "/", so the source never has to know the base.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import path from 'node:path';

const base = (process.argv[2] || process.env.BASE_PATH || '').replace(/\/+$/, '');
if (!base || !base.startsWith('/')) { console.error('Usage: node scripts/rebase-dist.mjs /sub-path'); process.exit(1); }

const dist = 'dist';
const files = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = path.join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(html|css|js)$/.test(p)) files.push(p);
  }
})(dist);

// "/x" → "/trunk/x"; leaves "//host", already-rebased and non-root URLs untouched.
const fix = (u) => (u.startsWith('/') && !u.startsWith('//') && u !== base && !u.startsWith(base + '/') ? base + u : u);
const fixSrcset = (v) => v.split(',').map((part) => part.replace(/^(\s*)(\S+)/, (_, s, u) => s + fix(u))).join(',');

let changed = 0;
for (const file of files) {
  const before = readFileSync(file, 'utf8');
  let s = before;
  if (file.endsWith('.html')) {
    s = s.replace(/(\s(?:href|src|poster|action)=)"([^"]*)"/g, (_, a, u) => `${a}"${fix(u)}"`);
    s = s.replace(/(\s(?:srcset|imagesrcset)=)"([^"]*)"/g, (_, a, v) => `${a}"${fixSrcset(v)}"`);
  }
  s = s.replace(/url\((['"]?)(\/[^)'"]*)\1\)/g, (_, q, u) => `url(${q}${fix(u)}${q})`);
  // Quoted asset paths inside inline/bundled scripts (e.g. the deferred font loader).
  s = s.replace(/(["'`])(\/(?:_astro|fonts)\/[^"'`]*)\1/g, (_, q, u) => `${q}${fix(u)}${q}`);
  if (s !== before) { writeFileSync(file, s); changed++; }
}
console.log(`rebase-dist: ${changed}/${files.length} files rewritten for base ${base}`);
