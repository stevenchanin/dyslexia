#!/usr/bin/env bash
set -euo pipefail

# Extract human-readable text from files in research_scrapes/
# - HTML: prefer pandoc -> lynx -> w3m -> html2text -> sed fallback
# - JSON: if jq present, dump all string values (best-effort); else copy
#
# Output: research_scrapes_text/<timestamp>/ preserving directory structure

SRC_ROOT="${1:-research_scrapes}"
TS="$(date +%Y%m%d_%H%M%S)"
DEST_ROOT="research_scrapes_text/${TS}"

echo "Source: $SRC_ROOT"
echo "Destination: $DEST_ROOT"

if [[ ! -d "$SRC_ROOT" ]]; then
  echo "ERROR: Source directory '$SRC_ROOT' not found" >&2
  exit 1
fi

mkdir -p "$DEST_ROOT"

have() { command -v "$1" >/dev/null 2>&1; }

extract_html() {
  local in="$1" out="$2"
  if have pandoc; then
    pandoc -f html -t plain -o "$out" "$in" || true
    return
  fi
  if have lynx; then
    # Use absolute path for file URI
    local abs
    abs="$(cd "$(dirname "$in")" && pwd)/$(basename "$in")"
    lynx -dump -nolist -assume_charset=UTF-8 -display_charset=UTF-8 "file://$abs" > "$out" || true
    return
  fi
  if have w3m; then
    w3m -dump -cols 1000 -T text/html "$in" > "$out" || true
    return
  fi
  if have html2text; then
    html2text -width 1000 "$in" > "$out" || true
    return
  fi
  # Sed fallback: strip scripts/styles/tags and decode a few entities
  sed -E \
    -e ':a;N;$!ba;s/<script[\s\S]*?<\/script>//gI' \
    -e ':a;N;$!ba;s/<style[\s\S]*?<\/style>//gI' \
    -e 's/<[^>]+>//g' \
    -e 's/&nbsp;/ /g; s/&amp;/\&/g; s/&lt;/</g; s/&gt;/>/g' \
    -e 's/\r/ /g; s/\t/ /g' \
    -e 's/  +/ /g' \
    -e 's/^ +//; s/ +$//' "$in" | tr -s '\n' > "$out" || true
}

extract_json() {
  local in="$1" out="$2"
  if have jq; then
    # Dump all scalar strings (best-effort human text) one per line
    jq -r '.. | select(type=="string")' "$in" > "$out" || true
  else
    cp "$in" "$out" || true
  fi
}

while IFS= read -r -d '' file; do
  rel="${file#$SRC_ROOT/}"
  out_dir="$DEST_ROOT/$(dirname "$rel")"
  mkdir -p "$out_dir"
  base_no_ext="${rel%.*}"
  out="$DEST_ROOT/${base_no_ext}.txt"
  case "$file" in
    *.html|*.htm)
      echo "HTML -> $out"
      extract_html "$file" "$out"
      ;;
    *.json)
      echo "JSON -> $out"
      extract_json "$file" "$out"
      ;;
    *)
      # Fallback: copy as-is with .txt extension
      echo "COPY -> $out"
      cp "$file" "$out" || true
      ;;
  esac
done < <(find "$SRC_ROOT" -type f -print0)

echo "Done. Text outputs under: $DEST_ROOT"

