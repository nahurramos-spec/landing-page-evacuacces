import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const base = resolve("."),
  port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ttf": "font/ttf",
  ".md": "text/plain; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};
export const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      ),
      file = resolve(
        base,
        "." + (pathname.endsWith("/") ? pathname + "index.html" : pathname),
      );
    if (file !== base && !file.startsWith(base + sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    const info = await stat(file);
    if (!info.isFile()) throw Error();
    res.writeHead(200, {
      "Content-Type": types[extname(file)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404);
    res.end("Recurso no encontrado");
  }
});
server.listen(port, "127.0.0.1", () =>
  console.log(`EvacuAccess: http://127.0.0.1:${port}`),
);
