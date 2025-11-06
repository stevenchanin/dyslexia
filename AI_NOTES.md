# AI Notes for Future Contributors

This file captures high‑signal context that isn’t obvious from the code or docs, to accelerate future programming sessions.

## Current Working State (Frontend)
- Minimal React + Vite app lives under `frontend/`.
- UI: Chakra UI via a small wrapper in `frontend/src/ui` (Button, Card, Stack, Modal, TextInput, Typography, Badge, Alert, SimpleTable, Provider + Theme).
- State: TanStack Query (server state) + a tiny Zustand store for UI prefs. See `docs/STATE_PATTERNS.md` for patterns.
- Example feature code under `frontend/src/features/exercises/`:
  - `components/SoundIdentificationMock.tsx` – interactive mock of Module 1.1 with Web Speech API TTS.
  - `components/ExercisePlayer.tsx`, `api.ts`, `queries.ts`, `store.ts` – stubs showing intended patterns (not wired to real data).
- Offline helpers: `frontend/src/services/db.ts` (Dexie + simple background sync stubs) – not yet used by the mock UI.
- Entry points: `frontend/index.html`, `frontend/src/main.tsx`, `frontend/src/App.tsx`.

## What’s Not Implemented Yet
- No backend/API – `fetch` calls in `api.ts` will 404.
- No router – the app renders one page (App). Consider React Router or file‑based routing later.
- No PWA service worker yet – Workbox is listed in docs but not configured.
- No analytics/monitoring – PostHog/Sentry are mentioned in docs but not installed.
- No i18n plumbing – i18next is recommended but not set up in code yet.
- No test framework configured – recommend Vitest + React Testing Library + Playwright later.
- No CI – GitHub Actions not added yet.

## Decisions That Matter (quick refresh)
- Mobile‑first PWA; design for slow networks and small screens.
- State mgmt: TanStack Query (server) + small Zustand (UI only). No Redux.
- UI system: Chakra via local `/ui` wrapper to keep JSX terse and consistent.
- Docs consolidated under `docs/`, including specs (see `docs/specs/`).
- IP guidance: `docs/INTELLECTUAL_PROPERTY.md` – author original content; link to research.

## Recommended Next Steps (Engineering)
- Add API mocking for local dev to avoid 404s:
  - Option A: MSW (Mock Service Worker) – best DX.
  - Option B: Vite dev proxy to a stub backend.
- Add PWA baseline:
  - Install `vite-plugin-pwa` or add a Workbox service worker.
  - Cache app shell + basic offline fallback.
- Add i18n plumbing:
  - Install `i18next`, `react-i18next`; set up `I18nextProvider` with an `en` namespace.
- Add routing:
  - React Router – routes for Home, Exercise, Progress.
- Add project hygiene:
  - ESLint + Prettier configs; ensure CI formatting checks.
  - Vitest + RTL for unit/component tests; Playwright for a smoke E2E.
- Add environment shape:
  - Document `.env` keys (API base URL, feature flags). `.gitignore` already covers `.env*`.
- Create a stub backend (Node/Express + TypeScript) or a mock API folder structure to align with `docs/TECHNICAL_PLAN.md`.

## Content & Data Model Notes (for exercises)
- For Module 1.1, keep a simple round schema: `{ id, word, phonemes[], mode, options[] }`.
- Generate distractors by phoneme similarity (e.g., confusable pairs) as difficulty increases.
- Track metrics per attempt: accuracy, responseTimeMs, targetPosition, selectedOption, retries.
- Persist locally first (Dexie) and sync later – align with offline‑first strategy.

## Accessibility & Performance Guardrails
- Maintain ≥44px tap targets; respect `prefers-reduced-motion` globally.
- Keep initial JS under ~200KB where possible; code‑split features and load on demand.
- Always test on a small viewport (e.g., iPhone SE) and a budget Android profile.

## Known Gaps / Cleanup Items
- Replace placeholder “(word: …)” text in the mock with an icon‑only caregiver toggle per `docs/specs/module-1-phonological-awareness/sound-identification.md`.
- Add TTS fallback messaging if `speechSynthesis` is unavailable or disabled (right now the button simply disables).
- Create a centralized theme tokens file for colors/spacing if customization grows.
- Remove the legacy `research_cache/` directory entirely (already moved/removed); do not re‑add.

## Suggested Directory Conventions (Frontend)
- `src/features/<domain>/` – `api.ts`, `queries.ts`, `store.ts`, `components/` per feature.
- `src/ui/` – only primitives and provider; no feature logic.
- `src/services/` – cross‑cutting utilities (db, http, auth).
- `src/types/` – shared domain types.

## Quick Run Reminders
- Dev:
  ```bash
  cd frontend
  npm install
  npm run dev
  # http://localhost:5173
  ```
- No backend required for the mock, but API stubs/MSW recommended before extending.

## Low‑Risk Starter Tasks for a New Agent
- Add MSW with a simple `/api/exercises` GET and `/api/sessions/:id/submit` POST to drive the demo.
- Introduce `react-i18next` with a single `common.json` and a language switch.
- Add `vite-plugin-pwa` minimal config (manifest + register SW).
- Add ESLint/Prettier and CI workflow.

## Suggested 1–2 Sprint Roadmap (2 weeks each)
- Sprint A (App Foundation + DX)
  - Add MSW and wire the ExercisePlayer flows end‑to‑end (mock data).
  - Introduce React Router with routes: `/`, `/exercise/:id`, `/progress`.
  - Add i18n scaffold (react‑i18next, `en` namespace) and language switcher.
  - Configure ESLint + Prettier; add GitHub Actions CI with typecheck/lint/test.
  - Tests: Vitest + RTL for UI store and a couple of components.

- Sprint B (PWA + Offline + Metrics)
  - Add `vite-plugin-pwa` (manifest, SW registration), cache app shell, offline fallback page.
  - Persist attempts in Dexie; add a background flush on reconnect.
  - Instrument basic metrics (attempt accuracy, response time) to a local store and surface in a minimal progress view.
  - A11y polish on the mock (labels, focus order, reduced‑motion checks).
  - Optional: Add Sentry (errors) and a lightweight analytics event sink (console/MSW for now).
