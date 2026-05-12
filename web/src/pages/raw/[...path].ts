import type { APIRoute } from "astro";
import { readFileSync } from "node:fs";
import { join, extname } from "node:path";
import { getTree, flattenPaths, getFilesDir } from "@utils/walk-files";

export async function getStaticPaths() {
  const tree = getTree();
  return flattenPaths(tree)
    .filter((n) => n.type === "file")
    .map((node) => ({
      params: { path: node.path },
    }));
}

const MIME: Record<string, string> = {
  ".md": "text/markdown; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".ts": "text/x-typescript; charset=utf-8",
  ".sh": "text/x-shellscript; charset=utf-8",
  ".lua": "text/x-lua; charset=utf-8",
  ".yml": "application/yaml; charset=utf-8",
  ".yaml": "application/yaml; charset=utf-8",
  ".toml": "application/toml; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

export const GET: APIRoute = ({ params }) => {
  const path = params.path;
  if (!path) return new Response("Not found", { status: 404 });

  const abs = join(getFilesDir(), path);
  const ext = extname(path).toLowerCase();
  const contentType = MIME[ext] ?? "text/plain; charset=utf-8";

  try {
    const buf = readFileSync(abs);
    return new Response(buf, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
};
