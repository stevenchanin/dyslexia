# Project Plan: 12 Sprints with Stories (2-week cadence)

Scope: Mobile-first, offline-capable PWA for free dyslexia intervention, aligned to RESEARCH.md, FEATURE_DESIGN.md, TECHNICAL_PLAN.md, MOBILE_FIRST_STRATEGY.md, and brainstorm.md.

Cadence: 12 sprints x 2 weeks (~24 weeks). Each sprint lists key stories with concise acceptance criteria (AC) and primary dependencies. Lightweight enhancements from brainstorm.md are integrated where they deliver high value with low effort.

## Sprint 1 — Foundations & PWA Shell
- Story: Initialize monorepo (frontend React+TS+Vite, backend Node+TS) with ESLint/Prettier, Husky
  - AC: Repos scaffolded; lint/format scripts pass; CI runs on PR
- Story: PWA baseline with Workbox (app shell cache-first)
  - AC: Installable PWA; offline landing page loads; Lighthouse PWA checks green
- Story: IndexedDB (Dexie) and persistence wrapper
  - AC: Read/write API with versioned schema; unit tests cover happy/error paths
- Story: Low-bandwidth mode toggle (brainstorm #2)
  - AC: Global toggle persists; reduces images/animations; verified smaller payload
- Story: Haptics + reduced motion (brainstorm #15)
  - AC: navigator.vibrate used on correct answers (guarded); prefers-reduced-motion respected

## Sprint 2 — Auth, Profiles, Data Model
- Story: Auth (parent/educator) + student profile basics
  - AC: Login/logout; parent can create/manage 1 student; COPPA consent stub
- Story: Core DB schema (users, students, exercises, sessions)
  - AC: DB migrations deployed; CRUD smoke tests
- Story: Settings & accessibility prefs
  - AC: Font size, contrast, TTS speed persisted (local first)
- Story: Telemetry plumbing (PostHog or Mixpanel, env-guarded)
  - AC: Basic events (session start/complete) emit behind a feature flag

## Sprint 3 — Exercise Engine & Module 1 (Part 1)
- Story: Exercise engine (prompts, attempts, feedback, timers)
  - AC: Pluggable exercise types; attempt logging; pause/resume
- Story: Sound Identification (Sound Detective)
  - AC: Beginning/middle/end modes; accuracy/RT captured; works offline
- Story: How Many Sounds?
  - AC: Phoneme count with validation & hints; accuracy/RT captured
- Story: Phoneme-by-phoneme tap-to-hear (brainstorm #11)
  - AC: Tap graphemes to hear phonemes via Web Speech API; blend playback

## Sprint 4 — Module 1 (Part 2) + Local Progress
- Story: Sound Swapper (phoneme substitution)
  - AC: Change target phoneme; correctness & RT captured; hinting present
- Story: Sound Builder (blending)
  - AC: Progressive pacing; blending speed logged
- Story: Local progress model + basic dashboard
  - AC: Skill categories & mastery %; daily streak count; minimal chart
- Story: Streak forgiveness (brainstorm #14)
  - AC: 1 miss per week forgiven (configurable); UX copy updated

## Sprint 5 — Placement, Manual WCPM, Rules-Based Adaptation
- Story: 1-minute placement probe (brainstorm #3)
  - AC: 3 short probes (phoneme seg, CVC decoding, sight words); maps to start levels
- Story: Manual WCPM mode (brainstorm #4)
  - AC: 1-minute timer; error tap UI; WCPM auto-calculated and saved
- Story: Baseline adaptive rules (difficulty +/-)
  - AC: Rules from TECHNICAL_PLAN applied; logging explains adjustments
- Story: HCI polish and accessibility quick pass
  - AC: Keyboard/touch parity; color contrast AA; labels/aria on core views

## Sprint 6.5 — Pedagogy Engine & Decodables Integration (Mini)
- Story: Integrate corrective feedback engine into Module 1 exercises
  - AC: Error observations routed; cueing ladder shows prompts/scaffolds/model; TTS and highlights work offline
- Story: Enforce mastery gates from phonics sequence
  - AC: Stage advancement blocked until thresholds met; spaced review scheduled
- Story: Decodable text loader + schema validation in CI
  - AC: JSON Schema validation for decodables; example content renders; lints on PR

## Sprint 6 — Module 2/3 Seed + Gamification
- Story: Letter-sound match (Module 2.1)
  - AC: Digraphs & vowel teams supported; spaced repetition scheduling stub
- Story: Word decoding practice (real + pseudowords)
  - AC: Adjustable pace; accuracy & RT captured
- Story: Points + basic achievements
  - AC: Earn on completion/accuracy; first 5 badges live
- Story: Micro parent coaching tips (brainstorm #12)
  - AC: 1-sentence tips post-session; configurable content list; opt-out

## Sprint 7 — Reporting, Decodable Texts, Charts
- Story: Printable Progress & IEP packet (brainstorm #5)
  - AC: Print CSS; includes WCPM trend, skill mastery, streak; private by default
- Story: Decodable text generator v1 (brainstorm #10)
  - AC: Rule-based sentences based on grapheme inventory; basic templates
  - Dep: Uses `phonics-sequence.json` and honors `allowedGraphemes`
- Story: Charts: progress over time (recharts/Chart.js)
  - AC: WCPM and mastery charts responsive on mobile; cached for offline view

## Sprint 8 — i18n + Spanish + Accessibility
- Story: i18next integration + resource loading (brainstorm #6)
  - AC: Language switch; JSON namespaces per view; fallback to en
- Story: Spanish locale for top flows (home, exercises, progress)
  - AC: ≥90% string coverage; pseudo-locale test for overflow
- Story: Accessibility pass 2 (labels, focus, semantics)
  - AC: Axe CI clean on core screens; screen-reader checks for exercise flows

## Sprint 9 — Offline Content Packs & Sync
- Story: Offline content packs (brainstorm #1)
  - AC: Download per module/week; size estimates; cache manifests; progress indicates download state
- Story: Background sync for progress
  - AC: Queue when offline; retry with backoff; dedupe by session id
- Story: Low-bandwidth refinements
  - AC: Verified lower data usage per session (<200KB new data)

## Sprint 10 — Educator & Messaging Utilities
- Story: Teacher CSV import/export (brainstorm #13)
  - AC: Roster upload with mapping screen; export progress CSV; role-gated
- Story: Parent SMS/WhatsApp nudges (opt-in) (brainstorm #7)
  - AC: Consent flows; weekly summaries + reminders; unsub support; rate-limited
- Story: Household profiles (PIN quick switch) (brainstorm #8)
  - AC: Switch student via 4-digit PIN; lockout/backoff; parent-managed

## Sprint 11 — AI Assist (Phase 1)
- Story: Weekly AI progress report generator (LLM) (LLM_INTEGRATION_SUMMARY)
  - AC: Structured prompt; cached system prompt; JSON+markdown output; parent-safe tone
- Story: Ask AI Tutor (MVP)
  - AC: Context-limited Q&A; safety moderation; clear disclaimers; opt-in
- Story: Prompt regression & safety checks
  - AC: Canonical prompts set; CI guard; moderation logs retained

## Sprint 12 — Pilot Readiness, Performance, QA
- Story: Performance budget checks (bundle, TTI, offline)
  - AC: <200KB initial JS; TTI <5s on 3G profile; caching verified
- Story: Accessibility AA and mobile audit
  - AC: Lighthouse ≥90; screen reader journey validated; tap targets ≥44px
- Story: Micro-pilot setup (LOW_COST_TESTING_PLAN)
  - AC: 5–10 families onboarded; analytics dashboards; weekly evidence packet
- Story: Launch playbook & docs
  - AC: README usage; caregiver guide; privacy/coppa statement; feedback channels

---

# Backlog (Post-MVP or Stretch)
- QR-based offline backup/transfer (brainstorm #9)
- Local LLM or hybrid serving for cost control
- Expanded content library and module coverage
- Advanced educator analytics & heat maps
- Push notifications (web push) where allowed

---

# Cross-Cutting Definition of Done
- Tests: unit on core logic; smoke E2E on critical flows
- A11y: labels, focus order, color contrast, SR hints where needed
- Mobile-first: verified on iPhone SE + budget Android viewport sizes
- Offline-first: every new user-facing feature answers “what happens offline?”
- Telemetry: key events instrumented behind an env-guarded flag

---

# Milestones & Dependencies
- Milestone A (Sprints 1–4): Usable offline PWA with Module 1 exercises and basic progress
- Milestone B (Sprints 5–7): Placement + manual WCPM + reporting and decodables
- Milestone C (Sprints 8–10): i18n, content packs, educator utilities, nudges
- Milestone D (Sprints 11–12): AI assist MVP + pilot readiness
