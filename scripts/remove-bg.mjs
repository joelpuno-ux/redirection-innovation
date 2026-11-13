/**
 * Background remover v2 for images in public/ (JPEG or PNG input).
 * Usage: node scripts/remove-bg.mjs <input> <output.png> [--tol N] [--content-crop]
 *  - Flood-fills background mula sa image borders (kaya ang gradients/textures)
 *  - Drop ng maliliit na isolated foreground specks (< 0.1% ng pixels)
 *  - Tight crop; optional --content-crop = crop sa bbox ng makulay/madilim na content
 *    (para gumawa ng app-icon tile mula sa signage/plaque images)
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

const args = process.argv.slice(2);
const inName = args[0];
const outName = args[1];
const tolIdx = args.indexOf('--tol');
const TOL = tolIdx > -1 ? Number(args[tolIdx + 1]) : 55;
const CONTENT_CROP = args.includes('--content-crop');

if (!inName || !outName) {
  console.error('Usage: node scripts/remove-bg.mjs <input> <output.png> [--tol N] [--content-crop]');
  process.exit(1);
}

const root = path.resolve(import.meta.dirname, '..');
const srcBuf = fs.readFileSync(path.join(root, 'public', inName));
const isJpeg = srcBuf[0] === 0xff && srcBuf[1] === 0xd8;

function processImage(w, h, data) {
  const lum = (i) => 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  const diffBg = (i, bg) =>
    Math.max(Math.abs(data[i] - bg[0]), Math.abs(data[i + 1] - bg[1]), Math.abs(data[i + 2] - bg[2]));

  // Background estimate: corners + edge midpoints
  const samples = [
    [0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1],
    [Math.floor(w / 2), 0], [Math.floor(w / 2), h - 1],
    [0, Math.floor(h / 2)], [w - 1, Math.floor(h / 2)],
  ].map(([x, y]) => {
    const i = (y * w + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  });
  const bg = [0, 1, 2].map((c) => samples.reduce((a, p) => a + p[c], 0) / samples.length);

  // Flood fill ng background mula sa borders
  const bgMask = new Uint8Array(w * h);
  const stack = [];
  const seed = (x, y) => {
    const p = y * w + x;
    if (!bgMask[p] && diffBg(p * 4, bg) <= TOL) {
      bgMask[p] = 1;
      stack.push(p);
    }
  };
  for (let x = 0; x < w; x++) { seed(x, 0); seed(x, h - 1); }
  for (let y = 0; y < h; y++) { seed(0, y); seed(w - 1, y); }
  while (stack.length) {
    const p = stack.pop();
    const x = p % w;
    const y = (p - x) / w;
    if (x > 0) seed(x - 1, y);
    if (x < w - 1) seed(x + 1, y);
    if (y > 0) seed(x, y - 1);
    if (y < h - 1) seed(x, y + 1);
  }

  // Connected components ng foreground; drop ang mga specks (< 0.1%)
  const minSize = Math.max(50, Math.floor(w * h * 0.001));
  const comp = new Int32Array(w * h).fill(-1);
  let compCount = 0;
  const compSizes = [];
  for (let start = 0; start < w * h; start++) {
    if (bgMask[start] || comp[start] !== -1) continue;
    const id = compCount++;
    let size = 0;
    const q = [start];
    comp[start] = id;
    while (q.length) {
      const p = q.pop();
      size++;
      const x = p % w;
      const y = (p - x) / w;
      const nb = [x > 0 && p - 1, x < w - 1 && p + 1, y > 0 && p - w, y < h - 1 && p + w];
      for (const n of nb) {
        if (n !== false && !bgMask[n] && comp[n] === -1) {
          comp[n] = id;
          q.push(n);
        }
      }
    }
    compSizes[id] = size;
  }
  for (let p = 0; p < w * h; p++) {
    if (!bgMask[p] && compSizes[comp[p]] < minSize) bgMask[p] = 1;
  }

  // Crop region
  let x0, y0, x1, y1;
  if (CONTENT_CROP) {
    // bbox ng makulay (saturated) o madilim na pixels = ang totoong logo content
    x0 = w; y0 = h; x1 = -1; y1 = -1;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const maxc = Math.max(data[i], data[i + 1], data[i + 2]);
        const minc = Math.min(data[i], data[i + 1], data[i + 2]);
        if (maxc - minc > 40 || lum(i) < 130) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
      }
    }
    const pad = 10;
    x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad);
    x1 = Math.min(w - 1, x1 + pad); y1 = Math.min(h - 1, y1 + pad);
  } else {
    x0 = w; y0 = h; x1 = -1; y1 = -1;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (!bgMask[y * w + x]) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
      }
    }
  }

  const cw = x1 - x0 + 1;
  const ch = y1 - y0 + 1;
  const out = new PNG({ width: cw, height: ch });
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const sp = (y0 + y) * w + (x0 + x);
      const si = sp * 4;
      const di = (y * cw + x) * 4;
      out.data[di] = data[si];
      out.data[di + 1] = data[si + 1];
      out.data[di + 2] = data[si + 2];
      out.data[di + 3] = CONTENT_CROP ? 255 : bgMask[sp] ? 0 : 255;
    }
  }
  fs.writeFileSync(path.join(root, 'public', outName), PNG.sync.write(out));
  const removed = CONTENT_CROP ? 'n/a (tile)' : `${(bgMask.reduce((a, b) => a + b, 0) / (w * h) * 100).toFixed(1)}%`;
  console.log(`${outName}: ${cw}x${ch} (from ${w}x${h}, bg removed: ${removed})`);
}

if (isJpeg) {
  const img = jpeg.decode(srcBuf, { useTArray: true, formatAsRGBA: true });
  processImage(img.width, img.height, img.data);
} else {
  const png = new PNG();
  // Async parse (ang pngjs sync read ay broken sa Node 27 alpha)
  fs.createReadStream(path.join(root, 'public', inName)).pipe(png).on('parsed', function () {
    processImage(this.width, this.height, this.data);
  }).on('error', (e) => {
    console.error('Failed:', e.message);
    process.exit(1);
  });
}