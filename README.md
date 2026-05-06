# Dotfiles

Personal configuration files, synced across machines via Git.

## What's included

### Claude Code (`~/.claude/`)

| File | Description |
|------|-------------|
| `settings.json` | Global settings: model, plugins, status line |
| `statusline.js` | Custom status line (Node.js, cross-platform) — model, folder, git info, context usage |
| `commands/audit.md` | `/audit` — Full technical audit as a senior software architect |
| `commands/ssh.md` | `/ssh` — Load SSH key for git remote operations |

## Installation

```bash
git clone git@github.com:hbeneke/dotfiles.git ~/dotfiles
cd ~/dotfiles
bash install.sh
```

The install script creates symlinks from `~/.claude/` to this repo, so changes stay in sync with Git.

## Adding new configurations

1. Add the file to this repo
2. Update `install.sh` to create the symlink
3. Commit and push
4. Run `install.sh` on other machines after pulling
