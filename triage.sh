#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
NOTE_COUNT="${NOTE_COUNT:-20}"
MAX_NOTE_CHARS="${MAX_NOTE_CHARS:-8000}"
MODEL="${MODEL:-sonnet}"
TODAY="$(date '+%A, %B %d, %Y')"

# Check dependencies
if ! command -v osascript &>/dev/null; then
  echo "Error: osascript not found. This tool requires macOS." >&2
  exit 1
fi
if ! command -v claude &>/dev/null; then
  echo "Error: claude CLI not found. Install it from https://claude.com/claude-code" >&2
  exit 1
fi

# Step 1: Fetch notes
echo "☀️  Fetching your ${NOTE_COUNT} most recently modified notes..." >&2
NOTES_JSON=$(osascript -l JavaScript "$SCRIPT_DIR/fetch-notes.js" "$NOTE_COUNT" "$MAX_NOTE_CHARS")
echo "$NOTES_JSON"

# Step 2: Build system prompt with today's date
SYSTEM_PROMPT=$(sed "s/{DATE}/$TODAY/g" "$SCRIPT_DIR/prompt.txt")
echo " System prompt: $SYSTEM_PROMPT" >&2

# Step 3: Triage with Claude
echo "🧠 Analyzing with Claude ($MODEL)..." >&2
echo "$NOTES_JSON" | claude -p \
  --model "$MODEL" \
  --system-prompt "$SYSTEM_PROMPT" \
  "Here are my ${NOTE_COUNT} most recently modified Apple Notes. Please triage them for my morning review."
