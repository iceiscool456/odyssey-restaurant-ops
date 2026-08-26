import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import app from '../src/index';

const doc = app.getOpenAPI31Document({
  openapi: '3.1.0',
  info: {
    title: 'Odyssey Restaurant Ops API',
    version: '0.1.0',
  },
});

const outPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'openapi.json');
writeFileSync(outPath, JSON.stringify(doc, null, 2) + '\n');
console.log(`OpenAPI spec written to ${outPath}`);
