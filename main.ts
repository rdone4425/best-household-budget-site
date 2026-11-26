// Hand in the Maplewood Budget site (Node 22, standard library only).
//
// The entry is the plain static site in app/ next to this file —
// index.html plus its own JavaScript, CSS and data, no build step and
// nothing loaded over the network. This program copies app/ and
// screenshots/ into the output directory and writes dossier.json there,
// the summary the judge reads (screenshots, first-load files and bytes,
// and the source), built with the vendored make.fun library.
// vendor/makefun-frontend.ts is the kit's copy, unchanged: the scorer
// rebuilds the dossier with its own copy and requires a byte-for-byte
// match.
//
// Serve the site locally with `node serve.ts` (http://localhost:8080).
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function copyTree(from, to) {
  mkdirSync(to, { recursive: true });
  if (existsSync(from)) cpSync(from, to, { recursive: true });
}

copyTree(join(repoRoot, 'app'), join(outDir, 'app'));
copyTree(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'));

// The scorer's caps, mirrored here so a local run refuses what the
// scorer would refuse: at most 4 screenshots of 256 KiB each, at most
// 993 files and directories in app/ totalling 16 MiB, and the dossier
// text capped at 160 KiB. Only the text cap shapes the bytes.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
