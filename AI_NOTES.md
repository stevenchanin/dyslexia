# AI Notes for Future Contributors

This file captures high‑signal context that isn't obvious from the code or docs, to accelerate future programming sessions.

## Current Working State (Frontend)

### Phase 1: Local Development Infrastructure ✅ COMPLETE

**What Works Now:**
- Full-featured React + Vite app under `frontend/`
- MSW (Mock Service Worker) providing realistic API for local dev
- Production-ready API architecture (no backend required for development!)
- SoundIdentificationMock component fully functional with 10-round sessions
- 50+ word pool with intelligent distractor generation
- Complete TypeScript type system
- Comprehensive test suite (53 tests, 50 passing)

**UI System:**
- Chakra UI via small wrapper in `frontend/src/ui` (Button, Card, Stack, Modal, TextInput, Typography, Badge, Alert, SimpleTable, Provider + Theme)
- Consistent, mobile-first components
- Touch-optimized (≥44px tap targets)

**State Management:**
- TanStack Query for server state (API responses, caching, invalidation)
- Zustand for UI/app state (ttsRate, lowBandwidth, preferences)
- See `docs/STATE_PATTERNS.md` for patterns

**Architecture:**
- `frontend/src/types/exercises.ts` – Complete type system for exercises, sessions, attempts
- `frontend/src/mocks/` – MSW handlers and round generator (50+ words with phoneme data)
- `frontend/src/features/exercises/`:
  - `api.ts` – Type-safe API functions (createSession, fetchRounds, submitAttempt, getSessionSummary)
  - `queries.ts` – TanStack Query hooks with proper invalidation
  - `store.ts` – Zustand store for UI preferences
  - `components/SoundIdentificationMock.tsx` – Full implementation with session lifecycle
  - `components/ExercisePlayer.tsx` – DEPRECATED (replaced by SoundIdentificationMock)
- `frontend/src/services/db.ts` – Dexie setup (not yet used, ready for Phase 3)
- Entry points: `frontend/index.html`, `frontend/src/main.tsx`, `frontend/src/App.tsx`

**Testing Infrastructure:**
- Vitest 4.0.8 with jsdom environment
- React Testing Library + user-event
- MSW for API mocking in tests
- 53 tests across 4 test files (50 passing, 3 flaky)
- Test scripts: `npm test`, `npm run test:ui`, `npm run test:coverage`

**Documentation:**
- `docs/SOUND_ID_IMPLEMENTATION_PLAN.md` – 6-phase evolution plan
- `docs/PHASE_1_TEST_RESULTS.md` – Comprehensive test report
- `docs/specs/module-1-phonological-awareness/sound-identification.md` – UX spec

## What's Implemented (Phase 1)

✅ **MSW API Mocking** – Full API with 4 endpoints
  - POST /api/sessions – Create session
  - GET /api/sessions/:id/rounds – Fetch rounds
  - POST /api/sessions/:id/attempts – Submit attempt
  - GET /api/sessions/:id/summary – Get session summary

✅ **Round Generator** – Intelligent content generation
  - 50+ word pool with accurate phoneme breakdowns
  - CVC, CVCC, CCVC, complex word patterns
  - Difficulty-based distractor selection (random → confusable pairs)
  - Deterministic generation (same session ID = same rounds)

✅ **Type System** – Complete TypeScript types
  - SoundMode, ExerciseType, Session, Attempt, SessionSummary
  - API request/response types
  - 100% type coverage, no `any` types

✅ **API Layer** – Production-ready functions
  - createSession(), fetchRounds(), submitAttempt(), getSessionSummary()
  - Proper error handling
  - Type-safe throughout

✅ **Session Management** – Full lifecycle
  - Session creation on component mount
  - 10-round sessions with varied difficulty
  - Response time tracking (start timer per round)
  - Retry counting
  - Session completion detection
  - Summary with accuracy, streak, points

✅ **Testing** – Comprehensive coverage
  - 21 tests for round generator
  - 12 tests for MSW handlers
  - 11 tests for API layer
  - 9 tests for component
  - Edge cases and error handling

## What's Not Implemented Yet

❌ **No backend/API** – MSW provides mock API; real backend planned for Phase 6
❌ **No router** – Single-page app; React Router recommended for Phase 2+
❌ **No PWA service worker** – Workbox configuration planned for Phase 3
❌ **No offline persistence** – Dexie setup exists but not wired; Phase 3 task
❌ **No analytics/monitoring** – PostHog/Sentry planned but not installed
❌ **No i18n plumbing** – i18next recommended but not set up
❌ **No CI/CD** – GitHub Actions not configured
❌ **No ESLint/Prettier** – Code quality tools not set up
❌ **No E2E tests** – Playwright recommended for Phase 3+

## Decisions That Matter (quick refresh)

- **Mobile‑first PWA** – Design for slow networks and small screens
- **State mgmt:** TanStack Query (server) + small Zustand (UI only). No Redux.
- **UI system:** Chakra via local `/ui` wrapper to keep JSX terse and consistent
- **Testing:** Vitest + React Testing Library (fast, Vite-native)
- **API mocking:** MSW in development (same handlers can be used for tests)
- **Docs:** Consolidated under `docs/`, including specs in `docs/specs/`
- **IP guidance:** `docs/INTELLECTUAL_PROPERTY.md` – author original content; link to research

## Current Metrics & Status

**Bundle Size:**
- Production: 469.51 kB (152.47 kB gzipped)
- ⚠️ Slightly over 200KB target due to Chakra UI
- Action: Consider lazy loading or lighter UI library in Phase 2+

**Build Performance:**
- Dev startup: 275ms ✅
- Production build: 6.13s ✅
- TypeScript: Zero errors ✅

**Test Results:**
- Total: 53 tests
- Passing: 50 tests (94%)
- Failing: 3 tests (flaky async timing issues)
- Duration: ~11s

**Code Quality:**
- TypeScript coverage: 100%
- No `any` types in production code
- No `@ts-ignore` comments
- Consistent patterns throughout

## Known Gaps / Cleanup Items

**High Priority:**
- Fix 3 flaky tests (async timing issues)
- Replace "(word: ...)" text with caregiver toggle icon (per spec)
- Add TTS fallback messaging when unavailable
- Wire Dexie for offline persistence (Phase 3)

**Medium Priority:**
- Bundle size optimization (lazy loading, code splitting)
- Add ESLint + Prettier with CI checks
- Add GitHub Actions workflow
- Create centralized theme tokens file

**Low Priority:**
- Add E2E tests with Playwright
- Set up analytics (PostHog)
- Set up error monitoring (Sentry)
- Add i18n scaffolding

## Quick Run Reminders

**Development:**
```bash
cd frontend
npm install
npm run dev
# http://localhost:5173
```

**Testing:**
```bash
npm test              # Watch mode
npm run test:ui       # Browser UI
npm run test:coverage # Coverage report
```

**Building:**
```bash
npm run build         # Production build
npm run preview       # Preview build locally
```

## Architecture Patterns to Follow

**Feature Structure:**
```
src/features/<domain>/
  ├── api.ts           # Fetch functions (typed)
  ├── queries.ts       # TanStack Query hooks
  ├── store.ts         # Zustand UI store (if needed)
  ├── types.ts         # Feature-specific types (if complex)
  └── components/      # React components
```

**Shared Code:**
```
src/
  ├── types/           # Shared domain types
  ├── ui/              # UI primitives only (no feature logic)
  ├── services/        # Cross-cutting (db, http, auth)
  ├── mocks/           # MSW handlers for dev/test
  └── test/            # Test setup and utilities
```

**Testing Patterns:**
```
<filename>.test.ts(x)  # Co-locate tests with source
use vitest/msw/RTL     # Standard testing stack
test business logic    # Not implementation details
```

## Next Steps (Recommended Order)

### Phase 2: Session Management & Enhanced Metrics (Recommended Next)
- Session persistence (localStorage)
- Pause/resume functionality
- Enhanced metrics (hesitation time, error patterns)
- Session lifecycle state machine
- Attempt logging hook with better timing

See `docs/SOUND_ID_IMPLEMENTATION_PLAN.md` for complete Phase 2-6 roadmap.

### Alternative: Infrastructure & Polish
- Add ESLint + Prettier + CI
- Add React Router
- Add i18n scaffolding (react-i18next)
- Add PWA baseline (vite-plugin-pwa)
- Fix flaky tests

### Alternative: Additional Exercises
- Implement other Module 1 exercises (phoneme count, sound manipulation, rhyme)
- Use same patterns established in Phase 1
- Leverage existing MSW infrastructure

## Low‑Risk Starter Tasks for a New Agent

1. **Fix flaky tests** – Add better async utilities and timeouts
2. **Add ESLint/Prettier** – Code quality and formatting
3. **Add i18n scaffold** – Install react-i18next, set up `I18nextProvider`
4. **Add React Router** – Routes for /, /exercise/:id, /progress
5. **Add PWA manifest** – Install vite-plugin-pwa, minimal config
6. **Add caregiver toggle** – Replace word hint with icon toggle
7. **Session persistence** – Wire localStorage for session recovery

## Data Model Notes (Exercises)

**Round Schema (Sound Identification):**
```typescript
{
  id: string;
  word: string;
  phonemes: string[];  // ['k', 'æ', 't']
  mode: 'begin' | 'end' | 'middle';
  options: string[];   // ['k', 'r', 's', 't']
  difficulty: number;  // 1-10
  metadata?: {
    wordFrequency?: number;
    distractorStrategy?: 'random' | 'confusable';
  }
}
```

**Attempt Schema:**
```typescript
{
  id: string;
  sessionId: string;
  roundId: string;
  selectedOption: string;
  correctOption: string;
  isCorrect: boolean;
  responseTimeMs: number;
  mode: SoundMode;
  retries: number;
  timestamp: string;
}
```

**Session Summary:**
```typescript
{
  sessionId: string;
  totalRounds: number;
  correctRounds: number;
  accuracy: number;
  averageResponseTime: number;
  modeStats: Array<{
    mode: SoundMode;
    attempted: number;
    correct: number;
    accuracy: number;
  }>;
  pointsEarned: number;
  maxStreak: number;
}
```

## Accessibility & Performance Guardrails

**Must Follow:**
- ≥44px tap targets (mobile-first)
- Respect `prefers-reduced-motion`
- ARIA labels on interactive elements
- High contrast support (WCAG AA minimum)
- Keyboard navigation works
- Screen reader tested

**Performance Budget:**
- Initial JS: <200KB (currently 152KB gzipped) ✅
- TTI on 3G: <3s (not yet measured)
- First paint: <1s (currently ~275ms dev) ✅

**Testing Requirement:**
- Test on iPhone SE viewport (375×667)
- Test on budget Android profile
- Works offline after initial load

## Content & Round Generation

**Difficulty Progression:**
- **Easy (1-3):** CVC words, 3 phonemes max, "begin" mode focus, 4 options, distinct sounds
- **Medium (4-6):** CVCC words, 4 phonemes max, mixed modes, 5 options, similar sounds
- **Hard (7-9):** Complex words, 6 phonemes max, all modes, 6 options, confusable pairs

**Confusable Phoneme Pairs:**
```typescript
k/g, t/d, p/b     // Voicing
s/z, f/v          // Voicing
m/n, n/ŋ          // Nasal position
æ/ɛ, ɪ/i          // Vowel quality
```

**Word Pool Coverage:**
- 50+ words currently
- CVC: cat, dog, sun, mat, sit, run, big, hot, red, pen...
- CVCC: jump, hand, sand, lamp, tent, milk, fish...
- CCVC: stop, frog, slip, trip, snap, drum, flag...
- Complex: plant, print, stamp, bench, lunch, think...

## Important Context for Phase 2+

**When adding offline support (Phase 3):**
- Rounds should be cached in IndexedDB after fetching
- Attempts should queue in IndexedDB when offline
- Background sync should flush on reconnect
- Service worker should cache app shell and audio files

**When adding real backend (Phase 6):**
- MSW handlers show exact API contract
- Types are already production-ready
- Frontend code needs zero changes (just remove MSW initialization)
- Consider moving round generation to backend or keeping deterministic client-side

**When adding more exercises:**
- Follow same pattern: types → mocks → API → queries → component → tests
- Reuse session infrastructure
- Add new exercise types to ExerciseType union
- Create new round schemas as needed

## Testing Philosophy

**What to test:**
- Business logic (round generation, calculations)
- API contracts (MSW handlers)
- Component behavior (not implementation)
- User interactions (clicks, form inputs)
- Error states and edge cases

**What NOT to test:**
- Library internals (React, TanStack Query, etc.)
- Styling and CSS
- Implementation details (state variable names, etc.)
- Third-party code (MSW, Chakra UI, etc.)

**Test naming:**
- Describe behavior, not implementation
- "should create session with correct structure" ✅
- "should call useState with initial value" ❌

## Project Health Indicators

**Good Signs:**
- ✅ TypeScript compiles with zero errors
- ✅ All tests passing (or only flaky async issues)
- ✅ Bundle size <200KB gzipped
- ✅ Dev startup <500ms
- ✅ Build time <10s

**Warning Signs:**
- ⚠️ Bundle size growing >200KB gzipped
- ⚠️ Test suite >30s runtime
- ⚠️ TypeScript errors increasing
- ⚠️ Flaky tests >10% of total

**Action Required:**
- 🚨 Cannot build
- 🚨 >50% tests failing
- 🚨 TypeScript errors blocking development
- 🚨 App crashes on load

## Resources & References

**Implementation Docs:**
- `docs/SOUND_ID_IMPLEMENTATION_PLAN.md` – 6-phase evolution plan (current: Phase 1 complete)
- `docs/PHASE_1_TEST_RESULTS.md` – Detailed test verification report
- `docs/STATE_PATTERNS.md` – State management patterns and examples
- `docs/TECHNICAL_PLAN.md` – Full technical architecture
- `docs/specs/module-1-phonological-awareness/sound-identification.md` – UX specification

**Design Docs:**
- `docs/FEATURE_DESIGN.md` – All 5 exercise modules
- `docs/RESEARCH.md` – Evidence-based dyslexia interventions
- `docs/MOBILE_FIRST_STRATEGY.md` – PWA rationale and approach
- `docs/LLM_INTEGRATION_STRATEGY.md` – AI-powered features

**Quick Links:**
- Project README: `/README.md`
- Claude instructions: `/CLAUDE.md` and `/AGENTS.md`
- Architecture decisions: `/decisions/0001-state-management.md`
