// A tiny static server for app/ (Node 22, standard library only).
//
// Run `node serve.ts` and open http://localhost:8080 (or
// `node serve.ts --port 8081` for another port). It serves only files
// under app/, with the MIME types a browser needs, and refuses paths
// that escape the folder. A local convenience for testing — not a
// server for the internet.

import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = resolve(fileURLToPath(new URL('./app', import.meta.url)));

const args = process.argv.slice(2);
const flagAt = args.indexOf('--port');
const wanted = flagAt === -1 ? 8080 : Number(args[flagAt + 1]);
const port = Number.isInteger(wanted) && wanted > 0 && wanted < 65536 ? wanted : 8080;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

function safePath(pathname) {
  const clean = normalize(pathname).replace(/^(\.\.[/\\])+/, '').replace(/^[/\\]/, '');
  return join(appRoot, clean === '' ? 'index.html' : clean);
}

createServer((request, response) => {
  const url = new URL(request.url ?? '/', 'http://localhost');
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    response.writeHead(400).end('bad request');
    return;
  }
  const file = safePath(pathname);
  if (!file.startsWith(appRoot + sep) && file !== appRoot) {
    response.writeHead(403).end('forbidden');
    return;
  }
  let info;
  try {
    info = statSync(file);
  } catch {
    response.writeHead(404).end('not found');
    return;
  }
  if (!info.isFile()) {
    response.writeHead(404).end('not found');
    return;
  }
  response.writeHead(200, { 'content-type': MIME_TYPES[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(response);
}).listen(port, '127.0.0.1', () => {
  console.log(`Maplewood Budget at http://localhost:${port}/`);
});
