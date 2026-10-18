// Marks each build directory with its module format so Node picks the right loader.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
writeFileSync(join(dist, 'esm', 'package.json'), '{"type":"module","sideEffects":false}\n');
writeFileSync(join(dist, 'cjs', 'package.json'), '{"type":"commonjs","sideEffects":false}\n');
