import sharp from 'sharp';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(await readFile(path.join(appRoot, 'public/images/images.manifest.json'), 'utf8'));
const sourceDir = path.join(appRoot, 'public/images/source');
const outputDir = path.join(appRoot, 'public/images/generated');
await mkdir(outputDir, { recursive: true });

for (const image of manifest.images) {
  const source = path.join(sourceDir, image.filename);
  const base = path.parse(image.filename).name;
  for (const width of [480, 960, 1600]) {
    const avifPath = path.join(outputDir, `${base}-${width}.avif`);
    const webpPath = path.join(outputDir, `${base}-${width}.webp`);
    await sharp(source).rotate().resize({ width, withoutEnlargement: true }).avif({ quality: 60 }).toFile(avifPath);
    await sharp(source).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 76 }).toFile(webpPath);
    if (image.isHero && width === 960) {
      const { size } = await import('node:fs/promises').then((fs) => fs.stat(avifPath));
      if (size > 200 * 1024) throw new Error(`Hero image ${image.filename} exceeds 200 KB as 960px AVIF.`);
    }
  }
}
