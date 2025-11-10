#!/usr/bin/env bash
set -euo pipefail

# Batch-fetch key research and guidance sources referenced for validation.
# Usage: scripts/fetch_research_sources.sh [output_dir]
# Defaults to saving under docs/sources

OUTPUT_DIR=${1:-docs/sources}
mkdir -p "$OUTPUT_DIR"

log() { printf "[%s] %s\n" "$(date '+%Y-%m-%d %H:%M:%S')" "$*"; }

# Fetch helper: continues on error but logs it; set STRICT=1 to exit on first error
fetch() {
  local url="$1"; shift
  local out="$1"; shift
  log "Fetching: $url -> $out"
  mkdir -p "$(dirname "$out")"
  if ! curl -fsSL "$url" -o "$out"; then
    log "ERROR: Failed to fetch $url"
    if [[ "${STRICT:-0}" == "1" ]]; then
      exit 1
    fi
  fi
}

# What Works Clearinghouse: Foundational Reading Skills practice guide (HTML page)
fetch "https://ies.ed.gov/ncee/wwc/PracticeGuide/21" \
      "$OUTPUT_DIR/wwc_foundational_skills.html"

# National Reading Panel (NRP) summary booklet (ERIC full text PDF)
fetch "https://files.eric.ed.gov/fulltext/ED444126.pdf" \
      "$OUTPUT_DIR/national_reading_panel_smallbook.pdf"

# International Dyslexia Association: Structured Literacy
fetch "https://dyslexiaida.org/structured-literacy-effective-instruction-for-students-with-dyslexia-and-related-reading-difficulties/" \
      "$OUTPUT_DIR/ida_structured_literacy_effective_instruction.html"
fetch "https://dyslexiaida.org/what-is-structured-literacy/" \
      "$OUTPUT_DIR/ida_what_is_structured_literacy.html"

# Dyslexia fonts evidence (example peer-reviewed publisher landing pages)
fetch "https://www.tandfonline.com/doi/full/10.1080/09658416.2017.1394276" \
      "$OUTPUT_DIR/wery_diliberto_2017_fonts.html"
fetch "https://link.springer.com/article/10.1007/s11145-018-9853-6" \
      "$OUTPUT_DIR/kuster_2018_dyslexie_font.html"

# Screening and monitoring references
fetch "https://www.nwea.org/product/map-reading-fluency/" \
      "$OUTPUT_DIR/map_reading_fluency_overview.html"
fetch "https://amplify.com/programs/mclass/dibels-8th-edition/" \
      "$OUTPUT_DIR/dibels8_mclass_overview.html"

# Rapid Automatized Naming (RAN) overview
fetch "https://dyslexia.yale.edu/resources/understanding-dyslexia/what-is-dyslexia/rapid-naming/" \
      "$OUTPUT_DIR/ycdc_rapid_naming_overview.html"

# Technology-assisted reading instruction meta/overview (Best Evidence Encyclopedia summary)
fetch "https://www.bestevidence.org/reading/tech/tech.html" \
      "$OUTPUT_DIR/bee_reading_technology_overview.html"

log "Done. Files saved under: $OUTPUT_DIR"

