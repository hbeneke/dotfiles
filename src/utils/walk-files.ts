import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, posix, relative, sep } from "node:path";
import ignore, { type Ignore } from "ignore";

export type TreeNode = {
  name: string;
  path: string;
  type: "file" | "directory";
  size?: number;
  children?: TreeNode[];
  hasReadme?: boolean;
};

const ROOT = posix.normalize(
  process.cwd().split(sep).join("/"),
);
const FILES_DIR = posix.join(ROOT, "files");

const ALWAYS_IGNORE = [".git", "node_modules", ".DS_Store", "Thumbs.db"];

function loadIgnoreFor(dir: string, parent: Ignore | null): Ignore {
  const ig = ignore();
  if (parent) ig.add(parent as unknown as string);
  ig.add(ALWAYS_IGNORE);

  const dotignorePath = join(dir, ".dotignore");
  if (existsSync(dotignorePath)) {
    ig.add(readFileSync(dotignorePath, "utf8"));
  }
  return ig;
}

function toPosix(p: string): string {
  return p.split(sep).join("/");
}

function walk(absDir: string, relDir: string, parentIg: Ignore | null): TreeNode[] {
  const ig = loadIgnoreFor(absDir, parentIg);
  const entries = readdirSync(absDir, { withFileTypes: true });
  const nodes: TreeNode[] = [];

  for (const entry of entries) {
    const name = entry.name;
    const relPath = posix.join(relDir, name);
    const checkPath = entry.isDirectory() ? `${name}/` : name;
    if (ig.ignores(checkPath)) continue;

    const absPath = join(absDir, name);

    if (entry.isDirectory()) {
      const children = walk(absPath, relPath, ig);
      const hasReadme = children.some(
        (c) => c.type === "file" && /^readme\.md$/i.test(c.name),
      );
      nodes.push({
        name,
        path: relPath,
        type: "directory",
        children,
        hasReadme,
      });
    } else if (entry.isFile()) {
      const stats = statSync(absPath);
      nodes.push({
        name,
        path: relPath,
        type: "file",
        size: stats.size,
      });
    }
  }

  nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return nodes;
}

export function getTree(): TreeNode[] {
  if (!existsSync(FILES_DIR)) return [];
  return walk(FILES_DIR, "", null);
}

export function flattenPaths(nodes: TreeNode[]): TreeNode[] {
  const out: TreeNode[] = [];
  const visit = (n: TreeNode) => {
    out.push(n);
    if (n.children) for (const c of n.children) visit(c);
  };
  for (const n of nodes) visit(n);
  return out;
}

export function readFileSafe(relPath: string): { content: string; binary: boolean } {
  const abs = join(FILES_DIR, relPath);
  const buf = readFileSync(abs);
  const sample = buf.subarray(0, Math.min(buf.length, 8000));
  let nonText = 0;
  for (const byte of sample) {
    if (byte === 0) return { content: "", binary: true };
    if ((byte < 9 || (byte > 13 && byte < 32)) && byte !== 27) nonText++;
  }
  if (sample.length > 0 && nonText / sample.length > 0.1) {
    return { content: "", binary: true };
  }
  return { content: buf.toString("utf8"), binary: false };
}

export function findNode(nodes: TreeNode[], path: string): TreeNode | null {
  const target = posix.normalize(path);
  for (const node of flattenPaths(nodes)) {
    if (node.path === target) return node;
  }
  return null;
}

export function relativeFromFiles(absPath: string): string {
  return toPosix(relative(FILES_DIR, absPath));
}

export function getFilesDir(): string {
  return FILES_DIR;
}
