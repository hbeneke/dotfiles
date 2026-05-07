# Dotfiles

Personal configuration files + tooling, synced across machines via Git, browsable as a static [Astro](https://astro.build) site.

## Structure

```
.
├── files/                    ← actual dotfiles content (synced to $HOME)
│   ├── .claude/              ← Claude Code settings, statusline, commands
│   ├── nvim/                 ← AstroNvim configuration
│   ├── git-flow/             ← templates: hooks + sync-master script
│   ├── bin/                  ← cross-platform CLIs (git-flow-init)
│   └── install.sh            ← symlink installer
│
├── src/                      ← Astro site sources
├── public/                   ← static assets (favicon, fonts, logo)
└── package.json              ← Astro app
```

## Dotfiles installation

```bash
git clone git@github.com:hbeneke/dotfiles.git ~/dotfiles
cd ~/dotfiles/files
bash install.sh
```

The install script creates symlinks from your `$HOME` into `files/`, so edits stay in sync with Git.

To use the bundled `git-flow-init` CLI from anywhere, add `files/bin/` to your `PATH` (the install script prints the exact command for your shell).

## Web (development)

```bash
npm install
npm run dev      # local dev at http://localhost:4321
npm run build    # static build into dist/
npm run preview
```

The site walks `files/` at build time, respects per-folder `.dotignore` entries, and renders any `README.md` it finds.
