#!/usr/bin/env node
// Lo-Claude Status Line for Claude Code
// Cross-platform (Windows / Linux / macOS) — no external deps
// Single line: 🤖 model | 📁 folder | 🌿 branch +added -removed | bar pct%

const { execSync } = require("node:child_process");
const path = require("node:path");
const fs = require("node:fs");

const C = {
  R: "\x1b[0m",
  CYAN: "\x1b[36m",
  BLUE: "\x1b[34m",
  GREEN: "\x1b[32m",
  RED: "\x1b[31m",
  YELLOW: "\x1b[33m",
  MAGENTA: "\x1b[35m",
  DIM: "\x1b[2m",
  BOLD: "\x1b[1m",
};

function readStdin() {
  try {
    return fs.readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function git(args, cwd) {
  try {
    return execSync(`git ${args}`, {
      cwd,
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim();
  } catch {
    return "";
  }
}

function computePct(transcriptPath) {
  if (!transcriptPath || !fs.existsSync(transcriptPath)) return 0;
  let tokens = 0;
  try {
    const lines = fs.readFileSync(transcriptPath, "utf8").split(/\r?\n/);
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i].trim();
      if (!line) continue;
      try {
        const obj = JSON.parse(line);
        const u = obj?.message?.usage;
        if (u) {
          tokens =
            (u.input_tokens || 0) +
            (u.cache_read_input_tokens || 0) +
            (u.cache_creation_input_tokens || 0) +
            (u.output_tokens || 0);
          break;
        }
      } catch {}
    }
  } catch {
    return 0;
  }
  if (!tokens) return 0;
  return Math.min(100, Math.floor((tokens * 100) / 160000));
}

function buildBar(pct) {
  const filled = Math.floor(pct / 10);
  return "█".repeat(filled) + "░".repeat(10 - filled);
}

function barColor(pct) {
  if (pct >= 80) return C.RED;
  if (pct >= 60) return C.YELLOW;
  return C.GREEN;
}

function main() {
  let input = {};
  try {
    input = JSON.parse(readStdin() || "{}");
  } catch {}

  const model = input?.model?.display_name || "Claude";
  const dir = input?.workspace?.current_dir || process.cwd();
  const transcript = input?.transcript_path || "";
  const folder = path.basename(dir) || dir;

  const pct = computePct(transcript);
  const bar = buildBar(pct);
  const bColor = barColor(pct);

  let gitPart = "";
  if (git("rev-parse --git-dir", dir)) {
    let branch = git("branch --show-current", dir);
    if (!branch) branch = git("rev-parse --short HEAD", dir);

    const diff = git("diff --shortstat", dir);
    const addedM = diff.match(/(\d+) insertion/);
    const delM = diff.match(/(\d+) deletion/);
    const added = addedM?.[1];
    const deleted = delM?.[1];

    const worktreeDir = git("rev-parse --show-toplevel", dir);
    const worktreeName = worktreeDir ? path.basename(worktreeDir) : "";
    const worktreeList = git("worktree list", dir);
    const mainRepoPath = worktreeList.split(/\r?\n/)[0]?.split(/\s+/)[0] || "";
    const mainRepoName = mainRepoPath ? path.basename(mainRepoPath) : "";

    if (worktreeName && worktreeName !== mainRepoName) {
      gitPart = `${C.MAGENTA}🌲 ${worktreeName}${C.R} ${C.GREEN}🌿 ${branch}${C.R}`;
    } else if (branch) {
      gitPart = `${C.GREEN}🌿 ${branch}${C.R}`;
    }

    if (added || deleted) {
      gitPart += " ";
      if (added) gitPart += `${C.GREEN}+${added}${C.R}`;
      if (added && deleted) gitPart += " ";
      if (deleted) gitPart += `${C.RED}-${deleted}${C.R}`;
    }
  }

  const sep = ` ${C.DIM}|${C.R} `;
  let line = `${C.BOLD}${C.CYAN}🤖 ${model}${C.R}${sep}${C.BLUE}📁 ${folder}${C.R}`;
  if (gitPart) line += `${sep}${gitPart}`;
  line += `${sep}${bColor}${bar} ${pct}%${C.R}`;

  process.stdout.write(line + "\n");
}

main();
