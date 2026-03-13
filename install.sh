#!/bin/bash
# Dotfiles installer — creates symlinks from ~ to this repo
# Usage: git clone <repo> ~/dotfiles && cd ~/dotfiles && bash install.sh

set -e

DOTFILES_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="$HOME/.claude"

echo "Installing dotfiles from $DOTFILES_DIR"

# ── Claude Code ─────────────────────────────────────
mkdir -p "$CLAUDE_DIR/commands"

# Symlink settings
ln -sf "$DOTFILES_DIR/.claude/settings.json" "$CLAUDE_DIR/settings.json"
echo "  ✓ Claude settings"

# Symlink statusline
ln -sf "$DOTFILES_DIR/.claude/statusline-command.sh" "$CLAUDE_DIR/statusline-command.sh"
echo "  ✓ Claude statusline"

# Symlink commands
for cmd in "$DOTFILES_DIR/.claude/commands/"*.md; do
  name=$(basename "$cmd")
  ln -sf "$cmd" "$CLAUDE_DIR/commands/$name"
  echo "  ✓ Claude command: /$name"
done

echo ""
echo "Done! Restart Claude Code to apply changes."
