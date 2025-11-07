#!/usr/bin/env bash
set -euo pipefail

# Fetches a small set of authoritative, parent-facing sources
# to capture language/themes around dyslexia support.
# Outputs are saved under research_scrapes/<timestamp>/

OUT_DIR="research_scrapes/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$OUT_DIR"

UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"

fetch() {
  local url="$1"
  local out="$2"
  echo "Fetching: $url -> $OUT_DIR/$out"
  # Use sane defaults; don't fail the whole script on a single fetch error
  if ! curl -sSL --compressed --connect-timeout 10 --max-time 40 -A "$UA" "$url" -o "$OUT_DIR/$out"; then
    echo "WARN: failed to fetch $url" >&2
  fi
}

# International Dyslexia Association (IDA) homepage
fetch "https://dyslexiaida.org" "ida_home.html"

# Decoding Dyslexia (parent advocacy) homepage
fetch "https://decodingdyslexia.net" "decoding_dyslexia_home.html"

# Understood.org parent-facing explainer
fetch "https://www.understood.org/en/articles/what-is-dyslexia" "understood_what_is_dyslexia.html"

# Reddit r/Dyslexia top posts (JSON) — parent/student language in titles/comments
echo "Fetching: Reddit r/Dyslexia top posts JSON"
if curl -sS -A "$UA" "https://www.reddit.com/r/Dyslexia/top/.json?limit=25&t=year" -o "$OUT_DIR/reddit_r_dyslexia_top_year.json"; then
  if command -v jq >/dev/null 2>&1; then
    jq -r '.data.children[].data.title' "$OUT_DIR/reddit_r_dyslexia_top_year.json" \
      > "$OUT_DIR/reddit_r_dyslexia_top_year.titles.txt" || true
  fi
else
  echo "WARN: failed to fetch Reddit JSON" >&2
fi

echo "Done. Outputs saved under: $OUT_DIR"

