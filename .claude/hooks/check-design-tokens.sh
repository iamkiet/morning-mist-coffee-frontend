#!/usr/bin/env bash
# Dual-mode design token enforcer:
#   PreToolUse (Edit/Write): checks content being written — blocks on violation (exit 2)
#   Stop: scans full codebase and prints a report — never blocks (exit 0)

set -euo pipefail

get_message() {
  case "$1" in
    "bg-surface-")           echo "bg-surface-* → use bg-background or bg-card" ;;
    "bg-outline-variant")    echo "bg-outline-variant → use border-border" ;;
    "border-primary-container") echo "border-primary-container → use border-border or border-accent" ;;
    "text-on-surface")       echo "text-on-surface-* → use text-foreground or text-muted-foreground" ;;
    "bg-secondary-container") echo "bg-secondary-container → use bg-muted or bg-accent" ;;
    "bg-tertiary-container") echo "bg-tertiary-container → use bg-accent or bg-card" ;;
    "px-margin-safe")        echo "px-margin-safe → use px-4 sm:px-6" ;;
    *)                       echo "forbidden token: $1" ;;
  esac
}

FORBIDDEN_PATTERNS=("bg-surface-" "bg-outline-variant" "border-primary-container" "text-on-surface" "bg-secondary-container" "bg-tertiary-container" "px-margin-safe")

check_content() {
  local content="$1"
  local blocked=0

  for pattern in "${FORBIDDEN_PATTERNS[@]}"; do
    if echo "$content" | grep -qE "$pattern"; then
      echo "  ❌ $(get_message "$pattern")"
      echo "     See: .claude/skills/design-tokens/SKILL.md"
      blocked=1
    fi
  done

  # Raw <img> check
  if echo "$content" | grep -qE '<img[[:space:]]'; then
    if echo "$content" | grep -E '<img[[:space:]]' | grep -qvE '^\s*[/*]|^\s*//'; then
      echo "  ❌ Raw <img> tag → use next/image <Image> instead"
      echo "     See: CLAUDE.md — Images: MANDATORY RULES"
      blocked=1
    fi
  fi

  return "$blocked"
}

# --- Read stdin ---
INPUT=$(cat)
CONTENT=$(echo "$INPUT" | jq -r '.new_string // .content // ""' 2>/dev/null || echo "")

# -------------------------------------------------------
# MODE A — PreToolUse: content present → check and block
# -------------------------------------------------------
if [ -n "$CONTENT" ]; then
  if ! check_content "$CONTENT"; then
    echo ""
    echo "Edit blocked. Fix the tokens above before writing."
    exit 2
  fi
  exit 0
fi

# -------------------------------------------------------
# MODE B — Stop hook: scan codebase and report
# -------------------------------------------------------
echo "🔍 Design token audit (post-turn scan)..."
echo ""

FOUND=0
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo ".")"

while IFS= read -r file; do
  FILE_FLAGGED=0
  FILE_OUTPUT=""

  for pattern in "${FORBIDDEN_PATTERNS[@]}"; do
    matches=$(grep -nE "$pattern" "$file" 2>/dev/null || true)
    if [ -n "$matches" ]; then
      FILE_OUTPUT+="  ⚠️  $file — $(get_message "$pattern")\n"
      while IFS= read -r match_line; do
        FILE_OUTPUT+="       $match_line\n"
      done <<< "$matches"
      FILE_FLAGGED=1
    fi
  done

  img_matches=$(grep -nE '<img[[:space:]]' "$file" 2>/dev/null | grep -vE '^\s*[0-9]+:\s*[/*]|^\s*[0-9]+:\s*//' || true)
  if [ -n "$img_matches" ]; then
    FILE_OUTPUT+="  ⚠️  $file — raw <img> tag (use next/image)\n"
    while IFS= read -r match_line; do
      FILE_OUTPUT+="       $match_line\n"
    done <<< "$img_matches"
    FILE_FLAGGED=1
  fi

  if [ "$FILE_FLAGGED" -eq 1 ]; then
    echo -e "$FILE_OUTPUT"
    FOUND=1
  fi
done < <(find "$ROOT" \( -path "*/node_modules" -o -path "*/.next" -o -path "*/.git" \) -prune -o \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -print)

if [ "$FOUND" -eq 0 ]; then
  echo "  ✅ No forbidden design tokens found."
else
  echo "Fix violations before committing. See .claude/skills/design-tokens/SKILL.md"
fi

exit 0
