# Phonics Scope and Decodable Text Tagging

This spec provides:
- A concrete, editable phonics scope-and-sequence for alignment
- A JSON Schema for tagging decodable texts
- Practical usage guidance for exercises, fluency passages, and mastery rules

## Files
- `frontend/src/content/phonics/phonics-sequence.json` — ordered stages with patterns, graphemes, examples, and mastery thresholds
- `frontend/src/schemas/decodableText.schema.json` — schema for decodable text metadata
- `frontend/src/content/phonics/examples/decodable-s1-001.json` — example passage aligned to `s1_cvc`

## Usage
- Exercises must draw items from the current stage’s graphemes/patterns
- Decodable texts include `stageId` and optional `allowedGraphemes`; tokens may be annotated with `decodable`, `unknownPatterns`, and optional `gpc` breakdowns
- Mastery thresholds in the scope file guide advancement and review scheduling

## Corrective Feedback & Mastery
- Corrective feedback engine: `frontend/src/pedagogy/*`
  - `errorTaxonomy.ts` — error types by domain
  - `hints.ts` — vetted, kid‑friendly hints (expandable library)
  - `feedbackEngine.ts` — cueing ladder logic (prompt → scaffold → model → step‑back)
  - `mastery.ts` — mastery check and spaced review helpers

## Next Edits
- Expand `phonics-sequence.json` grapheme sets per stage as curriculum solidifies
- Grow the hints library with examples per error type and stage
- Tag new passages with the JSON schema; tooling can validate via the schema

