/**
 * Logo processor: binabasa ang public/logo.jpg, tinatanggal ang light-gray
 * background (transparent PNG), tina-tight-crop, at gumagawa ng dalawang asset:
 *   - public/logo-full.png  (buong lockup: mark + wordmark + tagline)
 *   - public/logo-mark.png  (mark lang: chevron + cross) para sa navbar/favicon
 * Usage: node scripts/process-logo.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

const root = path.resolve(import.meta.dirname, '..');
const srcPath = path.join(root, 'public', 'logo.jpg');
const src = jpeg.decode(fs.readFileSync(srcPath), { useTArray: true, formatAsRGBA: true });
const { width: w, height: h, data } = src;

const px = (x, y) => {
  const i = (y * w + x) * 4;
  return [data[i], data[i + 1], data[i + 2]];
};

// Background color = average ng apat na corners
const corners = [px(0, 0), px(w - 1, 0), px(0, h - 1), px(w - 1, h - 1)];
const bg = [0, 1, 2].map((c) => corners.reduce((a, p) => a + p[c], 0) / corners.length);

const T = 20; // strict threshold
const F = 30; // feather band para sa malambot na edges

const alpha = new Uint8ClampedArray(w * h);
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const [r, g, b] = px(x, y);
    const d = Math.max(Math.abs(r - bg[0]), Math.abs(g - bg[1]), Math.abs(b - bg[2]));
    const i = y * w + x;
    if (d <= T) alpha[i] = 0;
    else if (d >= T + F) alpha[i] = 255;
    else alpha[i] = Math.round(((d - T) / F) * 255);
  }
}

const has = (x, y) => alpha[y * w + x] > 16;

// Bounding box ng buong content
let x0 = w, y0 = h, x1 = -1, y1 = -1;
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    if (has(x, y)) {
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
}

// Hanapin ang puting gap sa pagitan ng mark at ng text block
const colCount = new Array(w).fill(0);
for (let x = x0; x <= x1; x++) {
  for (let y = y0; y <= y1; y++) if (has(x, y)) colCount[x]++;
}
let gapStart = -1, gapLen = 0, bestStart = -1, bestLen = 0;
for (let x = x0; x <= x1 + 1; x++) {
  const empty = x <= x1 && colCount[x] === 0;
  if (empty) {
    if (gapStart < 0) gapStart = x;
    gapLen++;
  } else {
    if (gapLen >= 4 && gapStart > x0 + 0.1 * w && gapStart < x0 + 0.6 * w && gapLen > bestLen) {
      bestStart = gapStart;
      bestLen = gapLen;
    }
    gapStart = -1;
    gapLen = 0;
  }
}

// Mark-only bbox (kaliwang bahagi bago ang gap)
const markX1 = bestStart > 0 ? bestStart - 1 : x1;
let mx0 = w, my0 = h, mx1 = -1, my1 = -1;
for (let y = y0; y <= y1; y++) {
  for (let x = x0; x <= markX1; x++) {
    if (has(x, y)) {
      if (x < mx0) mx0 = x;
      if (x > mx1) mx1 = x;
      if (y < my0) my0 = y;
      if (y > my1) my1 = y;
    }
  }
}

function writeCrop(outName, cx0, cy0, cx1, cy1) {
  const cw = cx1 - cx0 + 1;
  const ch = cy1 - cy0 + 1;
  const out = new PNG({ width: cw, height: ch });
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const si = ((cy0 + y) * w + (cx0 + x)) * 4;
      const di = (y * cw + x) * 4;
      out.data[di] = data[si];
      out.data[di + 1] = data[si + 1];
      out.data[di + 2] = data[si + 2];
      out.data[di + 3] = alpha[(cy0 + y) * w + (cx0 + x)];
    }
  }
  fs.writeFileSync(path.join(root, 'public', outName), PNG.sync.write(out));
  console.log(`${outName}: ${cw}x${ch}`);
}

writeCrop('logo-full.png', x0, y0, x1, y1);
writeCrop('logo-mark.png', mx0, my0, mx1, my1);
console.log('done');