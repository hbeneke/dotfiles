# Dotfiles

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)](https://dotfiles.equero.dev)
[![Version](https://img.shields.io/badge/version-0.1.0-green.svg)](https://github.com/hbeneke/dotfiles)

Personal configuration files + tooling, synced across machines via Git and browsable as a static [Astro](https://astro.build) site.

**[Live Demo](https://dotfiles.equero.dev)**

## About This Project

This repo collects the dotfiles, scripts, and editor configs I carry between machines — plus a small Astro site that renders the tree so anyone can browse it from the web without cloning. Everything inside [`files/`](./files) is symlinked into `$HOME` by [`files/install.sh`](./files/install.sh); the [`web/`](./web) folder builds the static site that ships to [dotfiles.equero.dev](https://dotfiles.equero.dev).

## Tech Stack

- **[Astro](https://astro.build/)** — static site generator for the browsable view
- **[TypeScript](https://www.typescriptlang.org/)** — type-safe tree walker and renderers
- **[Tailwind CSS](https://tailwindcss.com/)** — utility-first styling
- **[Shiki](https://shiki.matsu.io/)** — syntax highlighting for code previews
- **[Biome](https://biomejs.dev/)** — lint + format
- **[Vercel](https://vercel.com/)** — deploy + hosting

Plus the dotfiles themselves: **Claude Code** (settings, commands, agents, statusline), **AstroNvim**, and a **git-flow bootstrap CLI**.

## Project Structure

```text
.
├── files/                    ← actual dotfiles content (symlinked to $HOME)
│   ├── .claude/              ← Claude Code settings, statusline, commands, agents
│   │   ├── commands/         ← user-invocable /commands
│   │   └── agents/           ← orchestrator subagents (model-routed)
│   ├── nvim/                 ← AstroNvim configuration
│   ├── git-flow/             ← templates: hooks + sync-master script
│   ├── bin/                  ← cross-platform CLIs (git-flow-init)
│   └── install.sh            ← symlink installer
│
├── web/                      ← Astro app that renders files/ as a static site
│   ├── src/
│   ├── public/
│   ├── astro.config.mjs
│   └── package.json
│
├── .githooks/                ← pre-commit + post-merge (version bump + tag)
├── scripts/                  ← install-hooks, uninstall-hooks, sync-master
└── package.json              ← root (version + git-flow scripts)
```

## Dotfiles Installation

```bash
git clone git@github.com:hbeneke/dotfiles.git ~/dotfiles
cd ~/dotfiles/files
bash install.sh
```

The script creates symlinks from `$HOME` into `files/`, so edits stay in sync with Git.

To use the bundled `git-flow-init` CLI from anywhere, add `files/bin/` to your `PATH` (`install.sh` prints the exact command for your shell).

## Claude Code Subagents

[`files/.claude/agents/`](./files/.claude/agents) ships an orchestrator + subagent setup so Claude Code routes work to the cheapest capable model instead of running everything on Opus.

| Agent                | Model  | Use for                                                          |
|----------------------|--------|------------------------------------------------------------------|
| `commit-fast`        | haiku  | git diff → Conventional Commits message + commit                 |
| `pr-describe`        | haiku  | branch diff → PR title + body                                    |
| `quick-search`       | haiku  | one-shot symbol/file lookups                                     |
| `test-writer`        | sonnet | write tests matching repo style                                  |
| `refactor-clean`     | sonnet | behavior-preserving refactors                                    |
| `architect`          | sonnet | everyday design / planning multi-file changes (~95% of cases)    |
| `senior-architect`   | opus   | hard design problems — invoke with "senior architect" phrase     |
| `bug-investigator`   | sonnet | static root-cause analysis from a bug description / stack trace  |
| `js-console-debugger`| sonnet | two-phase JS/TS debugging — instruments code, diagnoses logs     |

The main agent acts as the router — it reads each subagent's `description` and delegates. Edit any `.md` file in `files/.claude/agents/` to tune routing or swap models (`model: haiku | sonnet | opus | inherit`).

## Web (Development)

```bash
npm install              # installs root scripts (also installs git hooks)
npm run install:web      # installs web/ dependencies
npm run dev              # local dev at http://localhost:4321
npm run build            # static build into web/dist/
npm run preview
```

The Astro app walks `files/` at build time, respects per-folder `.dotignore` entries, and renders any `README.md` it finds. The Vercel project's **Root Directory** is set to `web/`.

## Git Flow

The repo follows a `develop` → `main` flow with automated version bumping and tagging:

### Available Hooks

- **pre-commit**: auto-increments the patch version (e.g., `0.1.0` → `0.1.1`) when committing non-markdown files on `develop`.
- **post-merge**: auto-increments the minor version (e.g., `0.1.5` → `0.2.0`) when merging `develop` into `main`, then creates an annotated tag with the changelog and syncs the bump back to `develop`.

### Installation

Hooks are installed automatically on `npm install`. To install/reinstall manually:

```bash
npm run hooks:install
```

To uninstall:

```bash
npm run hooks:uninstall
```

For more details, see [`.githooks/README.md`](./.githooks/README.md).

### Releasing (develop → main)

```bash
npm run sync:master            # default: minor bump + tag
npm run sync:master -- --patch # patch bump (X.Y.Z+1)
npm run sync:master -- --minor # minor bump (X.Y+1.0)
npm run sync:master -- --major # major bump (X+1.0.0)
npm run sync:master -- --no-tag # merge without bumping or tagging
```

Must be on `develop` with a clean working tree. The script pushes `develop`, merges into `main` (auto-resolving `package.json` conflicts in favor of `develop`), lets the `post-merge` hook bump + tag, then pushes `main`, `develop`, and the new tag.

For details on each script, see [`scripts/README.md`](./scripts/README.md).

## Contributing

This is a personal repo, but it's open source under the GPL-3.0 license — feel free to fork it as a starting point for your own dotfiles.

### Guidelines

- Follow the existing code style (enforced by Biome inside `web/`).
- Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`, …).
- Branch off `develop`; never commit directly to `main`.
- Update the relevant `README.md` inside `files/<subdir>/` when you change something user-facing.

## License

This project is licensed under the **GNU General Public License v3.0** — see the [LICENSE](./LICENSE) file for details.

## Author

### Enrique Quero (Habakuk Beneke)

- Website: [equero.dev](https://equero.dev)
- GitHub: [@hbeneke](https://github.com/hbeneke)
- LinkedIn: [equerodev](https://www.linkedin.com/in/equerodev/)
- X (Twitter): [@habakukbeneke](https://x.com/habakukbeneke)

---

If you find this repo useful, consider giving it a star on GitHub!
