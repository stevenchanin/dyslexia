# Next Steps (High-Impact)

These steps operationalize the evidence-aligned plan and the new artifacts added to the repo.

## 1) Integrate Corrective Feedback Engine
- Wire `frontend/src/pedagogy/feedbackEngine.ts` into Module 1 exercise components.
- Emit `ErrorObservation` on incorrect attempts (include domain, type, target, stageId).
- Render returned hints with TTS and simple visuals (highlight grapheme, slowed audio, segment/blend).
- Telemetry: log step transitions (prompt → scaffold → model → step‑back) for later tuning.

## 2) Enforce Mastery Gates and Spaced Review
- Use thresholds from `frontend/src/content/phonics/phonics-sequence.json` and helpers in `pedagogy/mastery.ts`.
- Block advancement until mastery criteria met; schedule spaced review for mastered skills.
- Dashboard: show mastery status by stage; indicate scheduled reviews.

## 3) Decodable Text Pipeline
- Add loader to parse decodable JSON (`frontend/src/schemas/decodableText.schema.json`).
- Validate decodables in CI using JSON Schema; reject PRs that introduce untaught patterns for a given `stageId`.
- Render simple decodable reader component; support repeated readings and WCPM tracking.

## 4) Expand Hints Library
- Author 5–10 short hints per major error type and early stages (s1–s3).
- Keep phrases kid‑friendly, TTS‑friendly; constrain selection to vetted hints.
- Add minimal‑pair contrasts for frequent confusions (e.g., p/b, short a/e).

## 5) ASR Validation Plan (If used)
- Collect small child‑speech sample for oral reading; double‑score by humans.
- Compare ASR WCPM to human WCPM (agreement and bias by rate/accuracy).
- Keep manual scoring available until validation passes.

## 6) Content Growth & Scope Refinement
- Iterate `phonics-sequence.json` graphemes/patterns with educator input.
- Add 10–20 decodable passages per stage; tag unknown patterns explicitly.
- Ensure exercise generators draw only from allowed graphemes/patterns per stage.

## 7) Documentation & Guardrails
- Add a brief “caregiver correction script” UI tip card for self/family use.
- Note privacy/COPPA posture and offline‑first constraints in caregiver guide.

## Tracking
- Sprint integration items added to `docs/SPRINT_PLAN.md` (Sprint 6.5 and Sprint 7 deps).
- Technical references added to `docs/TECHNICAL_PLAN.md` and `docs/specs/phonics-sequence.md`.

