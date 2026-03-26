#!/usr/bin/env bash
# Symlinks .cursor/rules/*.mdc → .claude/rules/*.md
# Single source of truth: .claude/rules/ (duales Frontmatter für beide Tools)

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

mkdir -p .cursor/rules

for src in .claude/rules/*.md; do
  name=$(basename "$src" .md)
  link=".cursor/rules/${name}.mdc"
  ln -sf "../../${src}" "$link"
  echo "  $link → $src"
done
