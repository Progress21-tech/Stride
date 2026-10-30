import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const allowedWaitlist = path.join(root, 'packages', 'waitlist');
// The old Next app is temporarily allowlisted until D8 migration/cutover is decided.
const legacyApp = path.join(root, 'apps', 'legacy');
const sourceExtensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs']);
const violations = [];

async function walk(directory) {
  let entries;
  try { entries = await readdir(directory, { withFileTypes: true }); } catch { return; }
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.git', 'dist'].includes(entry.name)) continue;
      await walk(fullPath);
    } else if (sourceExtensions.has(path.extname(entry.name).toLowerCase())) {
      const normalized = path.resolve(fullPath);
      if (normalized.startsWith(allowedWaitlist + path.sep) || normalized.startsWith(legacyApp + path.sep)) continue;
      const source = await readFile(fullPath, 'utf8');
      if (/(?:import\s+(?:[^'";]*?\s+from\s+)?|export\s+[^'";]*?\s+from\s+|require\(\s*|import\(\s*)['"]@supabase\//.test(source)) violations.push(path.relative(root, fullPath));
    }
  }
}

await walk(path.join(root, 'apps'));
await walk(path.join(root, 'packages'));

if (violations.length) {
  console.error('Supabase imports are restricted to packages/waitlist (legacy app allowlisted pending D8):');
  for (const file of violations) console.error(` - ${file}`);
  process.exit(1);
}
console.log('No Supabase imports in new application or package code.');
