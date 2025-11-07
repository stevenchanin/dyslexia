#!/usr/bin/env bash
set -euo pipefail

# RDAP availability checker using rdap.org aggregator with optional throttling.
# Usage:
#   TLDs="org com app" DELAY=1 scripts/check_domains.sh name1 name2 ...
# Defaults: TLDs="org com app", DELAY=0 (no sleep)
# Output: grouped by name with lines: \t<domain>\t<status>

UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
DELAY=${DELAY:-0}
read -r -a TLDs_ARRAY <<< "${TLDs:-org com app}"

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 base_name [base_name ...]" >&2
  exit 1
fi

check() {
  local domain="$1"
  local url="https://rdap.org/domain/${domain}"
  local code
  code=$(curl -sSL -A "$UA" -o /dev/null -w "%{http_code}" --connect-timeout 10 --max-time 20 "$url" || true)
  case "$code" in
    404) echo -e "\t$domain\tAVAILABLE" ;;
    200) echo -e "\t$domain\tTAKEN" ;;
    429) echo -e "\t$domain\trate limited (HTTP 429)" ;;
    *)   echo -e "\t$domain\tunknown (HTTP $code)" ;;
  esac
}

for base in "$@"; do
  echo "$base"
  for tld in "${TLDs_ARRAY[@]}"; do
    check "${base}.${tld}"
    if [[ "$DELAY" != "0" ]]; then sleep "$DELAY"; fi
  done
done
