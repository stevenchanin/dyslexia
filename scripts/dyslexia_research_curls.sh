#!/usr/bin/env bash
set -euo pipefail

run() {
  echo ">>> $*"
  # Allow individual commands to fail without aborting the entire script so we still capture partial data.
  if ! eval "$*"; then
    echo "    (command above failed but continuing)"
  fi
  echo
}

# Wikipedia overview
run "curl -s https://en.wikipedia.org/wiki/Dyslexia | head"

# International Dyslexia Association article – search for early intervention lines
run "curl -s https://dyslexiaida.org/dyslexia-basics/ | rg -n \"early\" | head"
run "curl -s https://dyslexiaida.org/dyslexia-basics/ | rg -n \"grade\""
run "curl -s https://dyslexiaida.org/dyslexia-basics/ | rg -n \"kindergarten\""

# NICHD guidance on reading interventions
run "curl -s https://www.nichd.nih.gov/health/topics/learning/conditioninfo/treatments | rg -n \"grade\""
run "curl -s https://www.nichd.nih.gov/health/topics/learning/conditioninfo/treatments | head"

# CDC fact sheet (currently returns 404 but included for completeness)
run "curl -s https://www.cdc.gov/ncbddd/childdevelopment/facts-about-dyslexia.html | rg -n \"age\""

# Reading Rockets early intervention article
run \"curl -s https://www.readingrockets.org/topics/dyslexia/articles/early-intervention-dyslexia-how-early-too-early | rg -n \\\"grade\\\"\"
run \"curl -s https://www.readingrockets.org/topics/dyslexia/articles/early-intervention-dyslexia-how-early-too-early | grep -n \\\"K\\\" | head\"

# Wikipedia REST summary (JSON)
run "curl -s https://en.wikipedia.org/api/rest_v1/page/summary/Dyslexia"
