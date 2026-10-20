// Builds side-by-side before/after comparison PNGs (same viewport, same scale, same cache state)
// from docs/review/r2/before and docs/review/r2/after. Output: docs/review/r2/compare/*.png
// Also exports the "selected" set for handover into docs/review/r2/selected/.
import sharp from 'sharp';
import { mkdir, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const B = 'docs/review/r2/before', A = 'docs/review/r2/after', OUT = 'docs/review/r2/compare', SEL = 'docs/review/r2/selected';
await mkdir(OUT, { recursive: true }); await mkdir(SEL, { recursive: true });

const pairs = [
  ['top-390-cold-settled.png', '01-hero-390-cold'],
  ['top-1440-cold-settled.png', '02-hero-1440-cold'],
  ['top-390-warm-people.png', '03-people-390-warm'],
  ['top-1440-warm-people.png', '04-people-1440-warm'],
  ['top-375s-cold-settled.png', '05-hero-375x667-cold'],
  ['top-390-nofont-fold.png', '06-hero-390-webfonts-blocked'],
  ['staff-aoi-390-warm-fold.png', '07-staff-detail-390-warm'],
  ['menu-390-warm-fold.png', '08-menu-390-warm'],
  ['top-390-warm-full.png', '09-top-full-390-warm'],
  ['top-1440-warm-full.png', '10-top-full-1440-warm'],
];

const label = async (text, w) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="44"><rect width="100%" height="100%" fill="#232521"/><text x="16" y="29" font-family="Segoe UI, Arial, sans-serif" font-size="20" fill="#f4f2ed">${text}</text></svg>`);

for (const [file, name] of pairs) {
  const b = `${B}/${file}`, a = `${A}/${file}`;
  if (!existsSync(b) || !existsSync(a)) { console.log('skip', file); continue; }
  const [mb, ma] = await Promise.all([sharp(b).metadata(), sharp(a).metadata()]);
  const w = Math.max(mb.width, ma.width);
  const cap = 3200; // long full-page shots are cut for the side-by-side; the originals stay in before/after
  const hb = Math.min(mb.height, cap), ha = Math.min(ma.height, cap);
  const h = Math.max(hb, ha) + 44;
  const gap = 24;
  const left = await sharp(b).extract({ left: 0, top: 0, width: mb.width, height: hb }).toBuffer();
  const right = await sharp(a).extract({ left: 0, top: 0, width: ma.width, height: ha }).toBuffer();
  await sharp({ create: { width: w * 2 + gap, height: h, channels: 3, background: '#d9d6cf' } })
    .composite([
      { input: await label(`BEFORE (R1)  ${file}`, w), top: 0, left: 0 },
      { input: await label(`AFTER (R2)  ${file}`, w), top: 0, left: w + gap },
      { input: left, top: 44, left: 0 },
      { input: right, top: 44, left: w + gap },
    ])
    .png({ compressionLevel: 9 }).toFile(`${OUT}/${name}.png`);
  console.log('compare', name);
}

// Selected handover set (after state only)
const selected = [
  ['top-390-cold-settled.png', 'hero-390-first-visit.png'],
  ['top-390-warm-fold.png', 'hero-390-revisit.png'],
  ['top-1440-cold-settled.png', 'hero-1440-first-visit.png'],
  ['top-390-warm-people.png', 'people-390.png'],
  ['top-1440-warm-people.png', 'people-1440.png'],
  ['staff-aoi-390-warm-fold.png', 'staff-detail-390.png'],
  ['staff-aoi-1440-warm-fold.png', 'staff-detail-1440.png'],
  ['menu-390-warm-fold.png', 'menu-390.png'],
  ['menu-1440-warm-fold.png', 'menu-1440.png'],
  ['top-390-warm-full.png', 'top-full-390.png'],
  ['top-1440-warm-full.png', 'top-full-1440.png'],
];
for (const [src, dst] of selected) if (existsSync(`${A}/${src}`)) await copyFile(`${A}/${src}`, `${SEL}/${dst}`);
console.log('selected set written to', SEL);
