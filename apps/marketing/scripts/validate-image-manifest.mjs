import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.join(appRoot, 'public/images/source');
const manifestPath = path.join(appRoot, 'public/images/images.manifest.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
if (!Array.isArray(manifest.images)) throw new Error('images.manifest.json must contain an images array.');

let files = [];
try { files = (await readdir(sourceDir)).filter((name) => !name.startsWith('.')); }
catch { /* The owner has not supplied images yet; neutral page placeholders are used. */ }

const seen = new Set();
for (const image of manifest.images) {
  for (const field of ['filename', 'alt', 'subject', 'credit', 'licence']) {
    if (typeof image[field] !== 'string' || image[field].trim() === '') throw new Error(`Image entry is missing ${field}.`);
  }
  if (!image.focalPoint || !Number.isFinite(image.focalPoint.x) || !Number.isFinite(image.focalPoint.y) || image.focalPoint.x < 0 || image.focalPoint.x > 100 || image.focalPoint.y < 0 || image.focalPoint.y > 100) {
    throw new Error(`Image entry ${image.filename} needs focalPoint x/y values from 0 to 100.`);
  }
  if (seen.has(image.filename)) throw new Error(`Duplicate image manifest entry: ${image.filename}`);
  seen.add(image.filename);
  if (!files.includes(image.filename)) throw new Error(`Manifest source does not exist: ${image.filename}`);
  if (!(await stat(path.join(sourceDir, image.filename))).isFile()) throw new Error(`Image source is not a file: ${image.filename}`);
}

for (const filename of files) if (!seen.has(filename)) throw new Error(`Source image is missing a manifest entry: ${filename}`);
console.log(`Validated ${manifest.images.length} licensed source image(s).`);
