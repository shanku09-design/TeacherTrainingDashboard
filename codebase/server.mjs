import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const host = "127.0.0.1";
const port = 4173;
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".pdf": "application/pdf" };

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url || "/", "http://" + host + ":" + port).pathname);
    const requested = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    const target = resolve(root, requested);
    const rel = relative(root, target);
    if (rel.startsWith("..") || isAbsolute(rel)) {
      response.writeHead(403, { "content-type": "text/plain; charset=utf-8" }).end("Forbidden");
      return;
    }
    const data = await readFile(target);
    response.writeHead(200, { "content-type": types[extname(target).toLowerCase()] || "application/octet-stream", "cache-control": "no-store", "x-content-type-options": "nosniff" });
    response.end(data);
  } catch (error) {
    const missing = error && (error.code === "ENOENT" || error.code === "EISDIR");
    response.writeHead(missing ? 404 : 500, { "content-type": "text/plain; charset=utf-8" });
    response.end(missing ? "Not found" : "Local demo server error");
  }
});

server.listen(port, host, () => console.log("Teacher Training Tracker ready at http://" + host + ":" + port));

export { server };
