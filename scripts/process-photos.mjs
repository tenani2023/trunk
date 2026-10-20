// Prepares the demo photographs: crops to the ratios the layout expects, applies a
// light, uniform grade so photos from different photographers sit together, and writes
// 2000px-wide JPEGs into src/assets/photos/. Astro's image service generates the final
// srcset/AVIF/WebP variants at build time from these files.
//
// Run: node scripts/process-photos.mjs
// Source originals stay in src/assets/photos/_raw/ (see docs/ASSETS.md for credits).

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const RAW = 'src/assets/photos/_raw';
const OUT = 'src/assets/photos';
// works/* jobs go to src/assets/works/ (a sibling folder) so the content collection can reference them.

// The shared "TRUNK grade": slightly lifted blacks, a touch less saturation, warm tint.
// Kept subtle on purpose — the brief forbids hiding weak photos behind heavy toning.
function grade(img, { warmth = 1, sat = 0.92, gamma = 1.0, bright = 1.0 } = {}) {
  // warmth: a very small channel recombination (red up, blue down) — keeps colour, avoids sharp.tint() which desaturates.
  const w = 0.03 * warmth;
  return img
    .modulate({ saturation: sat, brightness: bright })
    .gamma(gamma)
    .recomb([
      [1 + w, 0, 0],
      [0, 1, 0],
      [0, 0, 1 - w],
    ]);
}

/**
 * @typedef {Object} Job
 * @property {string} id      Unsplash id (file in _raw)
 * @property {string} out     output filename (without extension)
 * @property {[number, number]} ratio  target aspect ratio w:h
 * @property {number} [cx]    crop center x (0..1) in the source
 * @property {number} [cy]    crop center y (0..1) in the source
 * @property {number} [zoom]  1 = largest crop that fits; >1 zooms in
 * @property {object} [tone]  grade overrides
 * @property {number} [width] output width (default 2000)
 */

/** @type {Job[]} */
const jobs = [
  // Hero — R2: hair is the subject (short layered hair in soft daylight). Same photo for SP and PC, different crops.
  { id: 'CwDiph-y_TQ', out: 'hero-portrait', ratio: [4, 5], cx: 0.55, cy: 0.36, zoom: 1.05, tone: { sat: 0.88, bright: 1.0 } },
  { id: 'CwDiph-y_TQ', out: 'hero-wide', ratio: [4, 3], cx: 0.55, cy: 0.4, zoom: 1.0, tone: { sat: 0.9 }, width: 2400 },

  // Concept details — R2: the former hero portrait becomes the hair-texture detail (strands in backlight).
  { id: '0NN4f10YE5g', out: 'concept-hair', ratio: [4, 5], cx: 0.24, cy: 0.2, zoom: 2.0, tone: { sat: 0.95, bright: 1.02 } },
  { id: 'Obm20i8OEX4', out: 'concept-light', ratio: [3, 4], cx: 0.5, cy: 0.55, tone: { sat: 0.9 } },

  // Styles (3:4)
  { id: 'HD6QL8UmnGM', out: 'style-bob', ratio: [3, 4], cx: 0.5, cy: 0.38, zoom: 1.05 },
  { id: 'B6urSV4bhLA', out: 'style-short-layer', ratio: [3, 4], cx: 0.45, cy: 0.4, zoom: 1.0, tone: { sat: 0.9 } },
  { id: 'Defp8o9qtJQ', out: 'style-short-fringe', ratio: [3, 4], cx: 0.5, cy: 0.5, zoom: 1.0, tone: { sat: 0.9 } },
  { id: '-67sdrvMjx4', out: 'style-medium-layer', ratio: [3, 4], cx: 0.45, cy: 0.42, zoom: 1.0, tone: { sat: 0.85 } },
  { id: 'p0kwFu51vao', out: 'style-long', ratio: [3, 4], cx: 0.5, cy: 0.38, zoom: 1.0 },
  { id: 'bm-ySgfMeAc', out: 'style-mens-part', ratio: [3, 4], cx: 0.5, cy: 0.35, zoom: 1.0, tone: { sat: 0.9 } },
  { id: 'lxsduAdWXy4', out: 'style-perm', ratio: [3, 4], cx: 0.5, cy: 0.45, zoom: 1.0 },
  { id: 'qMclM6hzlCI', out: 'style-color', ratio: [3, 4], cx: 0.5, cy: 0.42, zoom: 1.0 },
  { id: 'n4KewLKFOZw', out: 'style-mens-short', ratio: [3, 4], cx: 0.5, cy: 0.5, zoom: 1.0, tone: { sat: 0.95, warmth: 1 } },

  // Staff (4:5) — R2-F1: four portraits with the same shooting conditions: pale plain background,
  // soft light, bust framing at a similar distance. Head width ≈ 40% of the frame, eyes at ≈ 38–42% height.
  { id: 'Phz4l-BWJnY', out: 'staff-01', ratio: [4, 5], cx: 0.5, cy: 0.44, zoom: 1.0, tone: { sat: 0.86, bright: 1.0 } },
  { id: 'kmFsL9-e5bs', out: 'staff-02', ratio: [4, 5], cx: 0.5, cy: 0.55, zoom: 1.22, tone: { sat: 0.86, bright: 1.02 } },
  { id: 'JddS3Gig2kU', out: 'staff-03', ratio: [4, 5], cx: 0.55, cy: 0.42, zoom: 1.3, tone: { sat: 0.86, bright: 1.0 } },
  { id: 'jhIAP6Le4OY', out: 'staff-04', ratio: [4, 5], cx: 0.6, cy: 0.42, zoom: 1.4, tone: { sat: 0.86, bright: 1.0 } },

  // Salon
  { id: 'wmS0POWkVrg', out: 'salon-main', ratio: [4, 5], cx: 0.5, cy: 0.5, tone: { sat: 0.9 } },
  { id: 'wmS0POWkVrg', out: 'salon-main-wide', ratio: [16, 10], cx: 0.5, cy: 0.55, tone: { sat: 0.9 }, width: 2400 },
  { id: 'QjUsb_ir3II', out: 'salon-detail', ratio: [4, 3], cx: 0.5, cy: 0.5, tone: { sat: 0.9 } },
  { id: 'gI9rvJK61L8', out: 'salon-products', ratio: [4, 5], cx: 0.42, cy: 0.5, zoom: 1.0, tone: { sat: 0.9 } },

  // Works (施術事例) — demo before/after pairs, 3:4, written to src/assets/works/.
  // The two photos of a pair are different people (stock material); each case is flagged isDemo.
  { id: 'QGECZ9lT8F0', out: 'works/bob-before', ratio: [3, 4], cx: 0.55, cy: 0.42, zoom: 1.0, tone: { sat: 0.88 } },
  { id: 'HD6QL8UmnGM', out: 'works/bob-after', ratio: [3, 4], cx: 0.5, cy: 0.38, zoom: 1.05 },
  { id: 'G9f4Enb8XVM', out: 'works/short-layer-before', ratio: [3, 4], cx: 0.5, cy: 0.4, zoom: 1.0, tone: { sat: 0.85 } },
  { id: 'B6urSV4bhLA', out: 'works/short-layer-after', ratio: [3, 4], cx: 0.45, cy: 0.4, zoom: 1.0, tone: { sat: 0.9 } },
  { id: 'iGzHMzRZjRs', out: 'works/mens-part-before', ratio: [3, 4], cx: 0.5, cy: 0.4, zoom: 1.0, tone: { sat: 0.9 } },
  { id: 'bm-ySgfMeAc', out: 'works/mens-part-after', ratio: [3, 4], cx: 0.5, cy: 0.35, zoom: 1.0, tone: { sat: 0.9 } },
  { id: 'OuxJHYeUYpk', out: 'works/grad-color-before', ratio: [3, 4], cx: 0.5, cy: 0.42, zoom: 1.0, tone: { sat: 0.85, bright: 1.04 } },
  { id: 'qMclM6hzlCI', out: 'works/grad-color-after', ratio: [3, 4], cx: 0.5, cy: 0.42, zoom: 1.0 },
  { id: 'N6DAg3r5YFc', out: 'works/highlight-after', ratio: [3, 4], cx: 0.5, cy: 0.45, zoom: 1.0, tone: { sat: 0.95 } },
  { id: 'ZIRCZUqvl0g', out: 'works/perm-before', ratio: [3, 4], cx: 0.5, cy: 0.42, zoom: 1.0, tone: { sat: 0.88 } },
  { id: 'lxsduAdWXy4', out: 'works/perm-after', ratio: [3, 4], cx: 0.5, cy: 0.45, zoom: 1.0 },
  { id: '8HYnWP4MRGQ', out: 'works/mens-perm-before', ratio: [3, 4], cx: 0.5, cy: 0.4, zoom: 1.1, tone: { sat: 0.85 } },
  { id: 'OFSQ6bHjFjs', out: 'works/mens-perm-after', ratio: [3, 4], cx: 0.5, cy: 0.42, zoom: 1.0, tone: { sat: 0.9 } },
  { id: 'HjxY9EE9eVY', out: 'works/straight-before', ratio: [3, 4], cx: 0.5, cy: 0.45, zoom: 1.0, tone: { sat: 0.88 } },
  { id: '0b_7r_dNjFs', out: 'works/straight-after', ratio: [3, 4], cx: 0.5, cy: 0.4, zoom: 1.0, tone: { sat: 0.9 } },
  { id: 'hZMfmBuCRkw', out: 'works/kids-after', ratio: [3, 4], cx: 0.5, cy: 0.42, zoom: 1.0, tone: { sat: 0.9 } },
];

// `node scripts/process-photos.mjs works` → only the works/ jobs (keeps the other files' mtimes untouched).
const only = process.argv[2];
const selected = only ? jobs.filter((j) => j.out.startsWith(only + '/')) : jobs;

await mkdir(OUT, { recursive: true });

for (const job of selected) {
  const src = path.join(RAW, `${job.id}.jpg`);
  const meta = await sharp(src).metadata();
  const W = meta.width, H = meta.height;
  const [rw, rh] = job.ratio;
  const target = rw / rh;
  let cw = W, ch = Math.round(W / target);
  if (ch > H) { ch = H; cw = Math.round(H * target); }
  const zoom = job.zoom ?? 1;
  cw = Math.round(cw / zoom); ch = Math.round(ch / zoom);
  const cx = (job.cx ?? 0.5) * W, cy = (job.cy ?? 0.5) * H;
  let left = Math.round(cx - cw / 2), top = Math.round(cy - ch / 2);
  left = Math.max(0, Math.min(W - cw, left));
  top = Math.max(0, Math.min(H - ch, top));
  const width = job.width ?? 2000;
  const outPath = job.out.startsWith('works/') ? path.join('src/assets', `${job.out}.jpg`) : path.join(OUT, `${job.out}.jpg`);
  await mkdir(path.dirname(outPath), { recursive: true });
  let img = sharp(src).rotate().extract({ left, top, width: cw, height: ch }).resize({ width, withoutEnlargement: true });
  img = grade(img, job.tone);
  await img.jpeg({ quality: 88, mozjpeg: true }).toFile(outPath);
  const o = await sharp(outPath).metadata();
  console.log(`${job.out}.jpg  ${o.width}x${o.height}  (crop ${cw}x${ch} @${left},${top} from ${W}x${H})`);
}
