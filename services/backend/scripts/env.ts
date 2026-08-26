import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export function resolveDatabaseUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const devVarsPath = join(dirname(fileURLToPath(import.meta.url)), '..', '.dev.vars');
  if (existsSync(devVarsPath)) {
    for (const line of readFileSync(devVarsPath, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const separator = trimmed.indexOf('=');
      if (separator === -1) continue;
      const key = trimmed.slice(0, separator);
      const value = trimmed.slice(separator + 1);
      if (key === 'DATABASE_URL') return value;
    }
  }

  return 'postgres://odyssey:odyssey@localhost:5432/odyssey';
}
