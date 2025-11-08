# Sound Identification: Mock → Full Implementation Plan

## Current State (Baseline)

**Working Mock Features:**
- ✅ Basic UX flow (prompt → options → feedback → next)
- ✅ Three modes (begin/end/middle sound)
- ✅ Web Speech API TTS integration
- ✅ Zustand store for UI preferences (ttsRate, lowBandwidth)
- ✅ Visual feedback (color-coded buttons, alerts)
- ✅ Points and streak display
- ✅ Component architecture established

**Known Gaps:**
- ❌ Hardcoded data (3 rounds, cycles infinitely)
- ❌ No backend integration
- ❌ No session management or metrics collection
- ❌ No offline support (data or audio caching)
- ❌ Missing UX spec features (position strips, animations, timer, etc.)
- ❌ No adaptive difficulty
- ❌ No proper error handling
- ❌ No accessibility polish

---

## Evolution Path: 6 Phases

### Phase 1: Local Development Infrastructure (Foundation)
**Goal:** Enable full-featured local development without a real backend

**Tasks:**
1. **Add MSW (Mock Service Worker)**
   - Install `msw` dev dependency
   - Create `/frontend/src/mocks/handlers.ts` with:
     - `GET /api/sessions` - Create new session
     - `GET /api/exercises/sound-identification/rounds` - Return round set
     - `POST /api/sessions/:id/attempts` - Log attempt
   - Mock data generator for realistic rounds (50+ variations)
   - Add `npm run dev:mock` script

2. **Define TypeScript Types**
   - Create `/frontend/src/types/exercises.ts`:
     ```ts
     export type SoundMode = 'begin' | 'end' | 'middle';

     export interface SoundIdentificationRound {
       id: string;
       word: string;
       phonemes: string[];
       mode: SoundMode;
       options: string[];
       difficulty: number;
       metadata?: {
         wordFrequency?: number;
         distractorStrategy?: string;
       };
     }

     export interface Session {
       id: string;
       studentId: string;
       exerciseType: 'sound-identification';
       startedAt: string;
       completedAt?: string;
       targetRounds: number;
       difficulty: number;
     }

     export interface Attempt {
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

3. **Refactor API Layer**
   - Update `/frontend/src/features/exercises/api.ts`:
     - `createSession(exerciseType, difficulty): Promise<Session>`
     - `fetchRounds(sessionId): Promise<SoundIdentificationRound[]>`
     - `submitAttempt(sessionId, attempt): Promise<void>`
   - Add Zod schemas for runtime validation
   - Add error types (NetworkError, ValidationError, etc.)

4. **Wire Mock to Component**
   - Replace `SAMPLE_ROUNDS` with `useQuery(['rounds', sessionId])`
   - Create session on component mount
   - Use MSW-backed API for all data

**Deliverable:** Mock works identically to current, but uses realistic API layer
**Effort:** 4-6 hours
**Dependencies:** None

---

### Phase 2: Session Management & Metrics Collection
**Goal:** Track student performance accurately

**Tasks:**
1. **Session Lifecycle Management**
   - Add session state machine:
     ```ts
     type SessionState = 'not-started' | 'in-progress' | 'paused' | 'completed';
     ```
   - Create `useSession()` hook:
     - Manages session creation, resumption, completion
     - Handles timers (total time, per-round time)
     - Persists state to localStorage for recovery

2. **Metrics Collection**
   - Enhance component to track:
     - `responseTimeMs` (from prompt shown to selection)
     - `retries` (count of incorrect attempts per round)
     - `firstAttemptCorrect` (boolean)
     - `hesitationTime` (if replay button used)
   - Create `useAttemptLogger()` hook:
     ```ts
     const logger = useAttemptLogger(sessionId);
     logger.start(roundId); // Starts timer
     logger.select(option); // Records selection
     logger.submit(); // Sends to API
     ```

3. **Update Store for Session Context**
   - Extend Zustand store:
     ```ts
     interface ExerciseUIState {
       // existing...
       activeSessionId: string | null;
       roundsCompleted: number;
       targetRounds: number;
       pausedAt: number | null;
     }
     ```

4. **MSW Updates**
   - Mock session storage (in-memory Map)
   - Return session-specific rounds (deterministic seed)
   - Store attempts and calculate stats

5. **Session Summary Screen**
   - Show at completion:
     - Total rounds completed
     - Accuracy (overall, by mode)
     - Average response time
     - Streak achieved
     - Points earned
   - "Continue" returns to hub (stub for now)

**Deliverable:** Full session tracking with metrics logged to mock API
**Effort:** 6-8 hours
**Dependencies:** Phase 1

---

### Phase 3: Offline-First Architecture
**Goal:** Works completely offline after initial load

**Tasks:**
1. **IndexedDB Schema**
   - Update `/frontend/src/services/db.ts`:
     ```ts
     class AppDB extends Dexie {
       sessions!: Table<Session, string>;
       rounds!: Table<SoundIdentificationRound, string>;
       attempts!: Table<Attempt, string>;
       audioCache!: Table<{ url: string; blob: Blob }, string>;
     }
     ```

2. **Cache Rounds Locally**
   - On session creation, cache all rounds to IndexedDB
   - TanStack Query integration:
     ```ts
     useQuery({
       queryKey: ['rounds', sessionId],
       queryFn: async () => {
         // Try cache first
         const cached = await db.rounds.where({ sessionId }).toArray();
         if (cached.length) return cached;
         // Fall back to network
         const fresh = await fetchRounds(sessionId);
         await db.rounds.bulkPut(fresh);
         return fresh;
       }
     })
     ```

3. **Offline Attempt Queue**
   - When offline, attempts go to IndexedDB:
     ```ts
     await db.attempts.put({ ...attempt, synced: false });
     ```
   - Background sync on reconnect:
     ```ts
     const unsynced = await db.attempts.where({ synced: false }).toArray();
     for (const a of unsynced) {
       await submitAttempt(a.sessionId, a);
       await db.attempts.update(a.id, { synced: true });
     }
     ```

4. **Audio Caching Strategy**
   - Pre-generate TTS for all words in round set
   - Cache as Blobs in IndexedDB
   - Fallback to live TTS if cache miss
   - Add cache management UI (show storage used, clear cache)

5. **Network Status Indicator**
   - Add UI element showing online/offline state
   - Show sync status ("3 attempts queued for sync")
   - Auto-sync on reconnect with visual feedback

**Deliverable:** Exercise works fully offline, syncs when reconnected
**Effort:** 8-10 hours
**Dependencies:** Phase 2

---

### Phase 4: Complete UX Spec Implementation
**Goal:** Match sound-identification.md spec exactly

**Tasks:**
1. **Visual Enhancements**
   - Position strip hint on error:
     ```tsx
     {correct === false && (
       <PositionStrip mode={round.mode} phonemeCount={round.phonemes.length} />
     )}
     // Renders: [■][□][□] for 'begin', [□][□][■] for 'end', etc.
     ```
   - Confetti animation on correct (respect reduced-motion)
   - Button shake animation on incorrect
   - Timer display in header (session time elapsed)

2. **Interaction Improvements**
   - Disable options during TTS playback
   - Auto-replay on first error (optional)
   - Large, thumb-friendly buttons (≥44px tap target)
   - Bottom-aligned "Next" button for thumb reach

3. **Accessibility**
   - ARIA labels on all interactive elements
   - `role="status"` for feedback alerts (screen reader announcements)
   - `aria-live="polite"` for points/streak updates
   - Focus management (auto-focus "Next" on correct)
   - Respect `prefers-reduced-motion`
   - High contrast mode support

4. **Low-Bandwidth Mode Polish**
   - When enabled:
     - Skip animations (instant feedback)
     - Use text labels instead of icons
     - Don't preload audio (TTS on-demand only)
     - Show data savings estimate
   - Toggle in settings with explanation

5. **Caregiver Mode**
   - Small "👁️" icon toggle (top-right)
   - Shows word text when enabled
   - Persists preference
   - Replace mock text "(word: cat)" with this

6. **Edge Case Handling**
   - No audio permission: Show instructions, disable audio exercises
   - TTS unavailable: Show error with fallback options
   - Network timeout: Queue and show "will sync later"
   - Session recovery: Resume from last round on crash/refresh

**Deliverable:** Polished, spec-compliant UX
**Effort:** 10-12 hours
**Dependencies:** Phase 3

---

### Phase 5: Adaptive Difficulty & Content Generation
**Goal:** Intelligent distractor selection and difficulty progression

**Tasks:**
1. **Phoneme Similarity Database**
   - Create `/shared/phoneme-similarity.ts`:
     ```ts
     export const PHONEME_FEATURES = {
       'k': { voicing: false, place: 'velar', manner: 'stop' },
       'g': { voicing: true, place: 'velar', manner: 'stop' },
       // ... all English phonemes
     };

     export function phonemeSimilarity(a: string, b: string): number {
       // Returns 0-1 score based on feature overlap
     }
     ```

2. **Distractor Generation Algorithm**
   - Backend/MSW logic:
     ```ts
     function generateDistractors(
       target: string,
       difficulty: number,
       count: number
     ): string[] {
       const pool = ALL_PHONEMES.filter(p => p !== target);
       const sorted = pool.sort((a, b) => {
         const simA = phonemeSimilarity(target, a);
         const simB = phonemeSimilarity(target, b);
         // Higher difficulty = more similar distractors
         return difficulty > 5
           ? simB - simA  // Most similar first
           : simA - simB; // Most different first
       });
       return sorted.slice(0, count);
     }
     ```

3. **Difficulty Progression Rules**
   - Track per-mode performance:
     ```ts
     interface ModeStats {
       mode: SoundMode;
       attempts: number;
       correct: number;
       avgResponseTime: number;
     }
     ```
   - Advancement criteria:
     - Easy (diff 1-3): 80% accuracy over 10 rounds → next
     - Medium (diff 4-6): 75% accuracy over 15 rounds → next
     - Hard (diff 7-9): 70% accuracy over 20 rounds → mastery
   - Regression on struggle (< 50% accuracy over 5 rounds)

4. **Dynamic Round Generation**
   - MSW generates rounds on-demand based on:
     - Current difficulty level
     - Previously-seen words (avoid immediate repeats)
     - Error patterns (re-test confused phonemes)
   - Implement spaced repetition for errors:
     ```ts
     // Confused /k/ with /g/? Re-test with /k/ in 3, 7, 14 rounds
     ```

5. **Performance Feedback**
   - After 10 rounds, show:
     - "You're getting better at ending sounds!"
     - "Let's practice beginning sounds a bit more."
   - Subtle encouragement without discouragement

**Deliverable:** Intelligent, adaptive exercise that responds to student performance
**Effort:** 12-16 hours
**Dependencies:** Phase 4

---

### Phase 6: Backend Integration & Production Readiness
**Goal:** Replace MSW with real API, deploy-ready

**Tasks:**
1. **Backend API Implementation**
   - Create `/backend/src/exercises/sound-identification/` module:
     - `routes.ts` - Express routes
     - `controller.ts` - Request handling
     - `service.ts` - Business logic
     - `repository.ts` - Database queries
   - Implement endpoints:
     - `POST /api/sessions` - Create session with difficulty
     - `GET /api/sessions/:id/rounds` - Generate/fetch rounds
     - `POST /api/sessions/:id/attempts` - Log attempt
     - `GET /api/sessions/:id/summary` - Session stats

2. **Database Schema**
   - SQL migrations:
     ```sql
     CREATE TABLE sessions (
       id UUID PRIMARY KEY,
       student_id UUID REFERENCES students(id),
       exercise_type VARCHAR(50) NOT NULL,
       difficulty INTEGER NOT NULL,
       started_at TIMESTAMPTZ NOT NULL,
       completed_at TIMESTAMPTZ,
       metadata JSONB
     );

     CREATE TABLE sound_id_rounds (
       id UUID PRIMARY KEY,
       session_id UUID REFERENCES sessions(id),
       word VARCHAR(50) NOT NULL,
       phonemes TEXT[] NOT NULL,
       mode VARCHAR(10) NOT NULL,
       options TEXT[] NOT NULL,
       difficulty INTEGER NOT NULL,
       round_number INTEGER NOT NULL
     );

     CREATE TABLE attempts (
       id UUID PRIMARY KEY,
       session_id UUID REFERENCES sessions(id),
       round_id UUID REFERENCES sound_id_rounds(id),
       selected_option VARCHAR(10) NOT NULL,
       correct_option VARCHAR(10) NOT NULL,
       is_correct BOOLEAN NOT NULL,
       response_time_ms INTEGER NOT NULL,
       retries INTEGER DEFAULT 0,
       created_at TIMESTAMPTZ DEFAULT NOW()
     );

     CREATE INDEX idx_attempts_session ON attempts(session_id);
     CREATE INDEX idx_attempts_correct ON attempts(is_correct, created_at);
     ```

3. **Content Database**
   - Seed database with word pool:
     - 500+ common words categorized by difficulty
     - Phoneme breakdowns (use CMU Pronouncing Dictionary)
     - Frequency data for selection
   - Migration script: `/backend/migrations/seed-sound-id-words.sql`

4. **Analytics Pipeline**
   - Add event tracking:
     - Session start/complete
     - Round complete (accuracy, RT)
     - Difficulty changes
     - Errors by phoneme pair
   - PostHog/Mixpanel integration (env-gated)
   - Data retention policy (COPPA-compliant)

5. **Performance Optimization**
   - Paginate round fetching (fetch 10 at a time)
   - Redis cache for common round sets
   - CDN for audio files (if pre-recorded)
   - Bundle size optimization (lazy-load exercise components)

6. **Error Monitoring**
   - Sentry integration:
     - API errors
     - Frontend crashes
     - Performance metrics
   - Alerting for critical errors

7. **Testing**
   - **Unit tests:**
     - Distractor generation algorithm
     - Difficulty progression logic
     - Attempt metrics calculations
   - **Integration tests:**
     - API endpoint contracts
     - Database transactions
     - Cache invalidation
   - **E2E tests (Playwright):**
     - Complete exercise flow
     - Offline → online sync
     - Error recovery

8. **Documentation**
   - API documentation (OpenAPI/Swagger)
   - Developer setup guide
   - Exercise content authoring guide
   - Deployment runbook

**Deliverable:** Production-ready implementation with real backend
**Effort:** 20-30 hours
**Dependencies:** Phase 5, Backend infrastructure (Sprint 1-2)

---

## Implementation Timeline

### Solo Developer (Part-Time)
- **Phase 1:** Week 1
- **Phase 2:** Week 2-3
- **Phase 3:** Week 4-5
- **Phase 4:** Week 6-7
- **Phase 5:** Week 8-10
- **Phase 6:** Week 11-14

**Total: ~14 weeks part-time** (3-4 months)

### Small Team (2-3 developers)
- **Phase 1:** Sprint 1 (days 1-3)
- **Phase 2:** Sprint 1 (days 4-7)
- **Phase 3:** Sprint 2 (days 1-5)
- **Phase 4:** Sprint 2 (days 6-10)
- **Phase 5:** Sprint 3 (days 1-7)
- **Phase 6:** Sprint 3-4 (days 8-14)

**Total: ~4 sprints** (8 weeks)

---

## Parallel Workstreams

These can be developed alongside:

### Workstream A: Backend Foundation
- Set up Node.js + Express + TypeScript
- Database setup (PostgreSQL + migrations)
- Auth integration (Auth0/Firebase)
- API scaffolding

*Enables Phase 6, can start during Phase 3-4*

### Workstream B: PWA Infrastructure
- Vite PWA plugin configuration
- Service worker setup (Workbox)
- Manifest.json and icons
- Install prompt flow

*Enables offline distribution, can start during Phase 2-3*

### Workstream C: Content Creation
- Phoneme database compilation
- Word list curation (500+ words)
- Audio recording/TTS generation
- Quality review

*Enables richer content, can start during Phase 1*

---

## Validation Checkpoints

### After Phase 2: "Can we track learning?"
- [ ] Metrics are accurate and complete
- [ ] Session data persists correctly
- [ ] Summary stats are meaningful

### After Phase 3: "Does it work offline?"
- [ ] Complete session works without network
- [ ] Data syncs correctly on reconnect
- [ ] No data loss in offline scenarios

### After Phase 4: "Is it usable?"
- [ ] Accessibility audit passes (Lighthouse, axe)
- [ ] Mobile testing on real devices (iOS/Android)
- [ ] Reduced-motion/high-contrast work correctly

### After Phase 5: "Does it adapt?"
- [ ] Difficulty progression feels natural
- [ ] Distractors are appropriately challenging
- [ ] Students show measurable improvement

### After Phase 6: "Is it production-ready?"
- [ ] Load testing (100 concurrent users)
- [ ] Security audit (OWASP Top 10)
- [ ] COPPA compliance review
- [ ] Performance budget met (<3s TTI on 3G)

---

## Success Metrics

### Technical
- **Performance:** <3s load on 3G, <200KB initial bundle
- **Reliability:** >99% uptime, <1% error rate
- **Offline:** 100% feature parity offline vs online
- **Accessibility:** Lighthouse score >95, zero critical a11y issues

### Educational
- **Engagement:** >80% session completion rate
- **Accuracy:** Students show >70% accuracy within 20 rounds
- **Improvement:** Measurable WCPM gains after 4 weeks
- **Retention:** Students return 3+ times per week

### User Experience
- **Load time:** Perceived load <1s on repeat visits
- **Clarity:** <5% of users need help/support
- **Satisfaction:** >4.5/5 rating from parents/educators

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| TTS quality inconsistent across devices | Medium | Pre-record audio for critical exercises, TTS as fallback |
| Offline sync conflicts | High | Use last-write-wins with timestamps, warn on conflict |
| Performance on low-end devices | High | Test on budget Android, set performance budgets, lazy load |
| Distractor algorithm too hard/easy | Medium | A/B test different difficulty curves, collect feedback |
| Content generation quality | Medium | Manual review process, seed with curated content |
| Backend scalability at launch | Low | Start with conservative limits, monitor, scale gradually |

---

## Next Steps

1. **Start with Phase 1** (highest ROI, lowest risk)
   - Enables rapid iteration with MSW
   - No backend dependency
   - Validates API contract early

2. **Consider Parallel Backend Work**
   - If team has backend capacity, start Workstream A
   - Frontend can continue with MSW while backend catches up

3. **User Testing After Phase 4**
   - Recruit 3-5 families for beta testing
   - Validate UX with real students
   - Iterate before expensive backend work

4. **Incremental Deployment**
   - Deploy Phase 6 in stages (session → rounds → attempts → analytics)
   - Feature flags for gradual rollout
   - Rollback plan for each stage

---

## Related Documents
- [UX Spec: Sound Identification](./specs/module-1-phonological-awareness/sound-identification.md)
- [State Management Patterns](./STATE_PATTERNS.md)
- [Technical Plan](./TECHNICAL_PLAN.md)
- [Sprint Plan](./SPRINT_PLAN.md)
- [Mobile-First Strategy](./MOBILE_FIRST_STRATEGY.md)
