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
ln -sf "$DOTFILES_DIR/.claude/statusline.js" "$CLAUDE_DIR/statusline.js"
echo "  ✓ Claude statusline"

# Cleanup legacy bash statusline if present
rm -f "$CLAUDE_DIR/statusline-command.sh"

# Symlink commands
for cmd in "$DOTFILES_DIR/.claude/commands/"*.md; do
  name=$(basename "$cmd")
  ln -sf "$cmd" "$CLAUDE_DIR/commands/$name"
  echo "  ✓ Claude command: /$name"
done

# ── Neovim ─────────────────────────────────────────
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
  NVIM_CONFIG="$APPDATA/../Local/nvim"
else
  NVIM_CONFIG="${XDG_CONFIG_HOME:-$HOME/.config}/nvim"
fi

if [ -d "$NVIM_CONFIG" ] && [ ! -L "$NVIM_CONFIG" ]; then
  echo "  ⚠ Backing up existing nvim config to ${NVIM_CONFIG}.bak"
  mv "$NVIM_CONFIG" "${NVIM_CONFIG}.bak"
elif [ -L "$NVIM_CONFIG" ]; then
  rm "$NVIM_CONFIG"
fi

ln -sf "$DOTFILES_DIR/nvim" "$NVIM_CONFIG"
echo "  ✓ Neovim config"

# ── bin/ scripts ───────────────────────────────────
chmod +x "$DOTFILES_DIR/bin/git-flow-init" 2>/dev/null || true
echo "  ✓ bin/git-flow-init (chmod +x)"

echo ""
echo "Done! Restart Claude Code and Neovim to apply changes."
echo ""
echo "To use the bootstrap CLI from anywhere, add bin/ to PATH:"
echo "  Linux/macOS (bash):    echo 'export PATH=\"$DOTFILES_DIR/bin:\$PATH\"' >> ~/.bashrc"
echo "  Linux/macOS (zsh):     echo 'export PATH=\"$DOTFILES_DIR/bin:\$PATH\"' >> ~/.zshrc"
echo "  Windows (PowerShell):  [Environment]::SetEnvironmentVariable('Path', \$env:Path + ';$DOTFILES_DIR\\bin', 'User')"
echo ""
echo "Then: git-flow-init <project-path>"
