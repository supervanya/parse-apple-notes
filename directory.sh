#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
YEARS_BACK="${YEARS_BACK:-2}"
SNIPPET_LEN="${SNIPPET_LEN:-200}"
MODEL="${MODEL:-sonnet}"
OUTPUT_FILE="${OUTPUT_FILE:-$SCRIPT_DIR/directory.md}"
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

# Step 1: Fetch note metadata
echo "📂 Fetching notes modified in the last ${YEARS_BACK} year(s)..." >&2
NOTES_JSON=$(osascript -l JavaScript "$SCRIPT_DIR/fetch-directory.js" "$YEARS_BACK" "$SNIPPET_LEN")

# Extract counts for display
NOTE_COUNT=$(echo "$NOTES_JSON" | grep -o '"notesInRange": [0-9]*' | grep -o '[0-9]*')
FOLDER_COUNT=$(echo "$NOTES_JSON" | grep -o '"uniqueFolders": [0-9]*' | grep -o '[0-9]*')
echo "Found ${NOTE_COUNT} notes across ${FOLDER_COUNT} folders." >&2

# Step 2: Build system prompt with today's date and count
SYSTEM_PROMPT=$(sed -e "s/{DATE}/$TODAY/g" -e "s/{COUNT}/$NOTE_COUNT/g" "$SCRIPT_DIR/directory-prompt.txt")

# Step 3: Generate directory with Claude
echo "🧠 Generating categorized directory with Claude ($MODEL)..." >&2
DIRECTORY=$(echo "$NOTES_JSON" | claude -p \
  --model "$MODEL" \
  --system-prompt "$SYSTEM_PROMPT" \
  "Here are my Apple Notes from the last ${YEARS_BACK} year(s). Please create a categorized directory for navigation. Every note must appear exactly once.")

# Step 4: Write to file and stdout
echo "$DIRECTORY" > "$OUTPUT_FILE"
echo "" >&2
echo "✅ Directory written to: $OUTPUT_FILE" >&2
echo "$DIRECTORY"
