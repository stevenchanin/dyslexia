# Project Plan (Checklist Outline)

Use this plan to track progress across design, implementation, testing, and marketing. Check items off as they are completed. Link to source specs where appropriate.

## 1. Design
- [x] Research synthesis and principles documented (RESEARCH.md)
- [x] Mobile-first strategy articulated (MOBILE_FIRST_STRATEGY.md)
- [x] Feature Design drafted (FEATURE_DESIGN.md)
- [x] Technical Plan authored (TECHNICAL_PLAN.md)
- [x] Phonics scope-and-sequence created (`frontend/src/content/phonics/phonics-sequence.json`, specs/phonics-sequence.md)
- [x] Decodable-text tagging schema and example (`frontend/src/schemas/decodableText.schema.json`, examples)
- [x] Corrective feedback approach defined (pedagogy modules, hints, cueing ladder)
- [ ] UI visual guidelines and components finalized (refer to background/UI_SYSTEM_OPTIONS.md)
- [ ] Caregiver-facing correction script tip card content

## 2. Implementation
### 2.1 PWA/Frontend Foundation
- [ ] Vite + React + TS scaffold hardened; PWA plugin + Workbox configured
- [ ] Service worker: offline shell + cache strategies
- [ ] IndexedDB (Dexie) storage for progress/content
- [ ] Accessibility preferences (text size, contrast, TTS speed) persisted

### 2.2 Exercise Engine & Module 1
- [ ] Pluggable exercise engine (prompts, timers, attempts)
- [x] Sound Identification (begin/middle/end) — reference implementation present
- [ ] Phoneme Count
- [ ] Sound Substitution (“Sound Swapper”)
- [ ] Blending (“Sound Builder”)
- [x] Corrective feedback engine integrated (reference: SoundIdentificationMock)
- [ ] Corrective feedback engine integrated across all Module 1 exercises
- [ ] Mastery gates enforced via scope thresholds

### 2.3 Decodables & Fluency
- [x] Decodable JSON validation in CI (workflow + validator script)
- [ ] Decodable text loader in app
- [ ] Decodable reader component with repeated reading
- [ ] Decodable reader component with repeated reading
- [ ] Manual WCPM scoring tool
- [ ] ASR WCPM scoring (optional) with validation + manual fallback

### 2.4 Modules 2–5
- [ ] Letter-sound association (digraphs, vowel teams)
- [ ] Word decoding (real + pseudowords)
- [ ] Sight word practice + sentence fluency
- [ ] Reading comprehension (literal)
- [ ] Spelling/encoding (pattern practice)

### 2.5 Adaptation & Review
- [ ] Rules-based difficulty adjustment (accuracy, response time)
- [ ] Spaced review scheduling (mastery.ts)
- [ ] Error-pattern analysis dashboards (basic)

### 2.6 Data, Auth, Sync
- [ ] Background sync for progress
- [ ] Basic auth (parent/educator) + student profiles
- [ ] Cloud storage plan for audio (later phase)

## 3. Testing & QA
- [x] Unit tests: pedagogy engine — feedback cueing ladder
- [ ] Unit tests: pedagogy engine — mastery and review scheduler
- [ ] Unit tests: exercise flows and data stores
- [x] Decodable JSON validation in CI
- [ ] Accessibility audit (axe, screen reader pass)
- [ ] Performance budget: <200KB initial JS, TTI <5s (3G)
- [ ] ASR validation study (if ASR used): compare to human WCPM
- [ ] Offline behavior verification for all user flows

## 4. Marketing & Outreach
- [ ] Messaging and landing page draft (marketing/MARKETING_STRATEGY.md)
- [ ] Competitive positioning (background/COMPETITIVE_ANALYSIS.md)
- [ ] Pilot recruitment plan (LOW_COST_TESTING_PLAN.md)
- [ ] Caregiver onboarding materials (privacy, COPPA, usage tips)
- [ ] Progress reporting templates (printable packets)

## 5. Data & Privacy
- [ ] COPPA consent flows and policy draft
- [ ] Privacy policy + data retention docs
- [ ] Telemetry behind explicit opt-in; PII minimized

## 6. Deployment & Monitoring
- [ ] Hosting (Vercel/Netlify) with CI/CD
- [ ] Error monitoring (Sentry) and basic analytics (PostHog/Mixpanel) behind flags
- [ ] Environment config and secrets management

## 7. Evaluation & Iteration
- [ ] Low-cost pilot data collection (docs/testing/)
- [ ] Iteration plan based on early evidence (WCPM growth, decoding accuracy)
- [ ] A/B experiments for feedback variants (later)
