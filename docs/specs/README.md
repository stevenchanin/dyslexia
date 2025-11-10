# Specs by Module

This directory organizes UX/feature specs by instructional module.

## Module 1 – Phonological Awareness
- Directory: `module-1-phonological-awareness/`
  - sound-identification.md — Module 1.1 “Sound Detective” (beginning/ending/middle sound)
  - (planned) sound-manipulation.md — Module 1.2 Sound Swapper / Sound Builder
  - (planned) rhyme-recognition.md — Module 1.3 Rhyme Time

## Conventions
- One markdown file per exercise/spec.
- Include: goals, flow, micro-interactions, a11y, metrics, edge cases, copy, and a simple wireframe.
- Keep mobile-first constraints explicit.

## Cross-Cutting Specs
- Phonics scope & decodable tagging: `./phonics-sequence.md`
  - Data files: `frontend/src/content/phonics/phonics-sequence.json`, `frontend/src/schemas/decodableText.schema.json`, example at `frontend/src/content/phonics/examples/decodable-s1-001.json`
- Pedagogy engine (feedback & mastery): see `frontend/src/pedagogy/*`
