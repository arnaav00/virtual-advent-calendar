import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('dist');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.gif': 'image/gif', '.ogg': 'audio/ogg', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };
http.createServer(async (req, res) => {
  try {
    const path = resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname === '/' ? '/index.html' : new URL(req.url, 'http://localhost').pathname));
    if (!path.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    const fileInfo = await stat(path);
    if (!fileInfo.isFile()) { res.writeHead(404).end(); return; }
    const { size } = fileInfo;
    const headers = { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' };
    const range = req.headers.range;
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match || (!match[1] && !match[2])) { res.writeHead(416, { ...headers, 'Content-Range': `bytes */${size}` }).end(); return; }
      let start, end;
      if (!match[1]) {
        const suffixLength = Number(match[2]);
        if (!suffixLength) { res.writeHead(416, { ...headers, 'Content-Range': `bytes */${size}` }).end(); return; }
        start = Math.max(0, size - suffixLength);
        end = size - 1;
      } else {
        start = Number(match[1]);
        end = match[2] ? Number(match[2]) : size - 1;
      }
      if (start >= size || end < start) { res.writeHead(416, { ...headers, 'Content-Range': `bytes */${size}` }).end(); return; }
      end = Math.min(end, size - 1);
      res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1 });
      if (req.method === 'HEAD') { res.end(); return; }
      createReadStream(path, { start, end }).pipe(res);
      return;
    }
    res.writeHead(200, { ...headers, 'Content-Length': size });
    if (req.method === 'HEAD') { res.end(); return; }
    createReadStream(path).pipe(res);
  } catch { res.writeHead(404).end(); }
}).listen(Number(process.env.PORT) || 4173, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${Number(process.env.PORT) || 4173}`));
