// Ищет заглушки в квадратных скобках (например [X ₽] или [2–3]) во всех текстах content/*.json.
// На production-сборке падает со списком мест, на preview и локально только предупреждает.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'content');
const pattern = /\[.+?\]/g;
const found = [];

function walk(value, path, file) {
  if (typeof value === 'string') {
    const hits = value.match(pattern);
    if (hits) for (const h of hits) found.push(`${file} → ${path}: ${h}`);
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => walk(v, `${path}[${i}]`, file));
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) walk(v, path ? `${path}.${k}` : k, file);
  }
}

for (const file of readdirSync(root).filter((f) => f.endsWith('.json'))) {
  walk(JSON.parse(readFileSync(join(root, file), 'utf8')), '', file);
}

const isProduction =
  process.env.VERCEL_ENV === 'production' || process.env.CHECK_PLACEHOLDERS === 'strict';

if (found.length === 0) {
  console.log('check-placeholders: заглушек нет ✓');
  process.exit(0);
}

const report = `check-placeholders: найдено заглушек — ${found.length}\n  ${found.join('\n  ')}`;
if (isProduction) {
  console.error(`${report}\n\nProduction-сборка остановлена: замените заглушки в content/ru.json.`);
  process.exit(1);
}
console.warn(`${report}\n\n(Preview/локальная сборка — только предупреждение.)`);
