# Technical Implementation Plan

## ⚠️ MOBILE-FIRST STRATEGY

**Critical Decision:** This application will be built as a **Progressive Web App (PWA)** with mobile-first design.

**Why:**
- 26% of low-income households are smartphone-only (no computer/home internet)
- 71% of people earning <$30,000 own smartphones
- Our target audience (low-income families with dyslexia) primarily uses mobile devices
- See [MOBILE_FIRST_STRATEGY.md](./MOBILE_FIRST_STRATEGY.md) for complete rationale

## Technology Stack Recommendations

### Frontend - Progressive Web App (PWA)

#### Core Framework
**React 18+ with TypeScript**
- **Why**: Component reusability, large ecosystem, excellent TypeScript support
- Strong accessibility (a11y) support
- Excellent PWA tooling ecosystem
- Works on all platforms (iOS, Android, desktop) from single codebase

#### Build Tool
**Vite** (Recommended over Create React App)
- Extremely fast development builds
- Optimized production bundles
- Built-in PWA plugin (vite-plugin-pwa)
- Better performance for mobile

#### PWA Implementation
**Workbox (Google's Service Worker Library)**
- Simplified service worker setup
- Proven caching strategies
- Offline-first architecture
- Background sync capabilities

**Progressive Features:**
- Service workers for offline functionality
- Cache-first for app shell
- Background sync for progress data
- Install to home screen (appears like native app)
- Push notifications (optional, future feature)

#### UI Framework
**Tailwind CSS + Lightweight Component Library**
- **Tailwind CSS**: Mobile-first by default, tiny bundle size
- **shadcn/ui or Headless UI**: Lightweight, accessible, customizable
- **NOT Material-UI**: Too heavy for mobile (~300KB+)
- Custom components optimized for touch

#### State Management
**TanStack Query (server state) + Zustand (UI/app state)**
- TanStack Query for API/server data: caching, deduping, retries, background refetch, and fine-grained invalidation via query keys.
- Zustand for small UI/app state only (preferences, toggles, ephemeral UI), optionally persisted locally.
- Result: Minimal boilerplate and clear separation; avoids Redux-style ceremony while remaining widely used and well-documented.

See STATE_PATTERNS.md for examples and conventions.

#### Local Storage & Offline Data
**IndexedDB via Dexie.js**
- Store exercises offline
- Cache audio files locally
- Save progress when offline
- Sync to server when online

**LocalStorage**
- User preferences and settings
- Small, simple key-value data

#### Curriculum Data & Pedagogy
- Phonics scope-and-sequence: `frontend/src/content/phonics/phonics-sequence.json` defines ordered stages with grapheme inventories, patterns, examples, and mastery thresholds. Drives item generation, gating, and review.
- Decodable text tagging: `frontend/src/schemas/decodableText.schema.json` standardizes metadata for controlled texts; example at `frontend/src/content/phonics/examples/decodable-s1-001.json`.
- Corrective feedback engine: `frontend/src/pedagogy/*` contains a rule-based system for error taxonomy, vetted hints, cueing ladder (prompt → scaffold → model → step-back), and mastery/review helpers.
- Integration: Exercise components emit error observations; the feedback engine returns the next cue and hint. Mastery gates are checked against scope thresholds; spaced review schedules are derived from mastery levels.

#### Audio/Voice
**Web Audio API + Web Speech API** (Browser-Native, Free)
- Text-to-speech (TTS) for accessibility
- Speech recognition for pronunciation exercises
- MediaRecorder API for voice recording
- No external dependencies, no cost
- Works offline (if audio pre-cached)

Validation for ASR scoring
- If using ASR for WCPM, validate automated scores against human ratings on child speech samples; maintain a manual scoring fallback.

#### Charts/Visualization
**Lightweight Charting Library**
- **recharts** (React-specific, tree-shakeable)
- **Chart.js** (smaller bundle than Recharts)
- Mobile-optimized touch interactions
- Responsive by default

### Backend

#### Backend-as-a-Service: Supabase
**Why Supabase:**
- Built on PostgreSQL - production-grade relational database
- Replaces multiple services (Auth + Database + Storage + Real-time)
- Generous free tier perfect for nonprofit/free app model
- Auto-generated REST and GraphQL APIs
- Row Level Security (RLS) for data protection
- Real-time subscriptions out of the box
- Open-source and self-hostable if needed

**What Supabase Provides:**
1. **PostgreSQL Database** - Managed, with automatic backups
2. **Authentication** - Email/password, OAuth providers, magic links
3. **Storage** - S3-compatible object storage for audio files
4. **Real-time** - WebSocket subscriptions for live updates
5. **Edge Functions** - Serverless Deno functions for custom logic
6. **Client Libraries** - Official TypeScript/JavaScript SDK

#### Database
**Supabase PostgreSQL**
- Relational structure for user data, progress, exercises
- Strong data integrity with foreign keys and constraints
- Excellent JSONB support for flexible exercise data
- Built-in full-text search
- Automatic REST API generation
- PostGIS extension available for future location features

#### File Storage
**Supabase Storage**
- S3-compatible object storage
- Audio files (phoneme sounds, word pronunciations)
- User voice recordings (with automatic deletion policies)
- Images and visual assets
- CDN integration via Supabase CDN
- Access policies integrated with RLS
- Automatic image transformations/optimization

#### Authentication
**Supabase Auth**
- Secure user management with JWT tokens
- Email/password, magic links, OAuth providers
- Built-in email templates for verification
- Parent/educator account types via user metadata
- Row Level Security for data isolation

**⚠️ COPPA Compliance Note:**
Since the app targets children under 13, we must:
- Implement parental consent flow before child account creation
- Research Supabase Auth's COPPA compliance status
- Consider age-gated registration requiring parent email
- May need custom edge function for consent verification
- Alternative: Keep Supabase for students 13+, add custom consent layer for younger users

#### Edge Functions (Optional)
**Supabase Edge Functions** (Deno runtime)
- Custom business logic (adaptive learning algorithms)
- Audio processing pipelines
- WCPM calculation from speech-to-text results
- Integration with external AI services (if needed)
- Runs at the edge for low latency

### Audio Processing

#### Text-to-Speech
**Options:**
1. **Web Speech API** (Free, browser-native)
   - Good for basic TTS
   - Limited voice options
   - No server cost

2. **Google Cloud Text-to-Speech** (Paid)
   - High-quality, natural voices
   - Multiple languages
   - Adjustable speed/pitch

3. **Amazon Polly** (Paid)
   - Neural voices
   - Pronunciation customization
   - Good pricing model

**Recommendation: Start with Web Speech API, upgrade to Google/Amazon for better quality**

#### Speech Recognition (Voice Recording Analysis)
**Options:**
1. **Web Speech API**
   - Basic transcription
   - Free
   - Limited accuracy

2. **Google Cloud Speech-to-Text**
   - High accuracy
   - Real-time transcription
   - Word-level timestamps

**Recommendation: Google Cloud Speech-to-Text for WCPM calculation accuracy**

### Deployment & Infrastructure

#### Hosting
**Frontend: Vercel, Netlify, or Cloudflare Pages**
- Automatic deployments from Git
- Global CDN for PWA assets
- Free tier perfect for MVP
- Excellent developer experience
- Zero-config HTTPS

**Backend: Supabase Cloud**
- Fully managed PostgreSQL database
- Built-in CDN for storage assets
- Automatic scaling
- Daily backups included
- Global edge network

**Architecture Simplicity:**
- No separate backend server needed
- No infrastructure management
- Frontend connects directly to Supabase via client SDK
- Edge Functions deploy like serverless functions (optional)

#### CI/CD
**GitHub Actions**
- Automated testing (Vitest, Playwright)
- Linting and type checking
- Automatic frontend deployments (Vercel/Netlify)
- Supabase migration automation
- Code quality checks

### Monitoring & Analytics

**Application Monitoring: Sentry**
- Error tracking
- Performance monitoring
- User session replay

**User Analytics: PostHog or Mixpanel**
- Privacy-focused analytics
- Feature usage tracking
- A/B testing capabilities
- Self-hostable option (PostHog)

**Logging: Winston (Node.js) or Loguru (Python)**
- Structured logging
- Multiple output targets
- Debugging support

## System Architecture

### High-Level Architecture (Supabase)

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                        │
│                  Progressive Web App                     │
│              (React 18 + TypeScript + Vite)              │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Service Workers (Workbox) - Offline Support     │  │
│  │  IndexedDB (Dexie) - Local Data Cache            │  │
│  │  Supabase Client SDK - Auth/DB/Storage           │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
              HTTPS / WebSocket / REST / GraphQL
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  SUPABASE PLATFORM                       │
│  ┌────────────────────────────────────────────────────┐ │
│  │           Supabase Auth (JWT)                      │ │
│  │  Email/Password │ OAuth │ Magic Links │ RLS       │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │         Auto-Generated REST/GraphQL APIs           │ │
│  │  PostgREST │ Rate Limiting │ CORS │ Validation    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌───────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │  PostgreSQL   │  │   Storage    │  │  Realtime   │ │
│  │   Database    │  │  (S3-compat) │  │ (WebSocket) │ │
│  │  + Extensions │  │ Audio/Assets │  │ Live Updates│ │
│  └───────────────┘  └──────────────┘  └─────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │     Edge Functions (Deno) - Optional               │ │
│  │  Custom Logic │ Audio Processing │ AI Integration │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                           │
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  External Services                       │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │   Google   │  │   PostHog    │  │     Sentry     │  │
│  │ Cloud TTS/ │  │  (Analytics) │  │  (Monitoring)  │  │
│  │    STT     │  │              │  │                │  │
│  └────────────┘  └──────────────┘  └────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Key Architecture Benefits:**
- **Simplified Stack**: Single platform replaces separate backend, auth, storage services
- **Offline-First**: Service workers + IndexedDB cache Supabase data locally
- **Real-time Ready**: Built-in WebSocket support for live progress updates
- **Row Level Security**: Database-level access control for multi-tenant data isolation
- **No Backend Code Needed**: Auto-generated APIs reduce development time by ~40%

### Database Schema Design

#### Core Tables

**users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  auth_provider_id VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'student', 'parent', 'educator'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**students** (profile linked to user)
```sql
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  display_name VARCHAR(100),
  date_of_birth DATE,
  grade_level INTEGER,
  accessibility_settings JSONB, -- font size, TTS preferences, etc.
  created_at TIMESTAMP DEFAULT NOW()
);
```

**exercises**
```sql
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module VARCHAR(100) NOT NULL, -- 'phonological_awareness', 'phonics', etc.
  exercise_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty_level INTEGER NOT NULL, -- 1-10
  content JSONB NOT NULL, -- exercise-specific data
  metadata JSONB, -- tags, learning objectives, etc.
  created_at TIMESTAMP DEFAULT NOW()
);
```

**exercise_sessions**
```sql
CREATE TABLE exercise_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id),
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  duration_seconds INTEGER,
  status VARCHAR(50), -- 'in_progress', 'completed', 'abandoned'
);
```

**exercise_attempts**
```sql
CREATE TABLE exercise_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES exercise_sessions(id) ON DELETE CASCADE,
  question_data JSONB, -- what was asked
  student_response JSONB, -- what they answered
  is_correct BOOLEAN,
  response_time_ms INTEGER,
  hints_used INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**reading_fluency_assessments**
```sql
CREATE TABLE reading_fluency_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  passage_id UUID REFERENCES reading_passages(id),
  audio_recording_url VARCHAR(500), -- S3 URL
  words_correct_per_minute DECIMAL(5,2),
  accuracy_percentage DECIMAL(5,2),
  total_words INTEGER,
  errors_count INTEGER,
  self_corrections_count INTEGER,
  assessed_at TIMESTAMP DEFAULT NOW()
);
```

**skill_progress**
```sql
CREATE TABLE skill_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  skill_category VARCHAR(100) NOT NULL, -- 'phoneme_segmentation', 'decoding', etc.
  skill_name VARCHAR(100) NOT NULL,
  mastery_level DECIMAL(5,2), -- 0-100
  total_attempts INTEGER DEFAULT 0,
  correct_attempts INTEGER DEFAULT 0,
  last_practiced_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, skill_category, skill_name)
);
```

**achievements**
```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  achievement_type VARCHAR(100) NOT NULL,
  achievement_name VARCHAR(255) NOT NULL,
  description TEXT,
  earned_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB -- points earned, milestone details, etc.
);
```

**daily_practice_log**
```sql
CREATE TABLE daily_practice_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  practice_date DATE NOT NULL,
  total_time_minutes INTEGER,
  exercises_completed INTEGER,
  points_earned INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, practice_date)
);
```

## Adaptive Learning Algorithm

### Difficulty Adjustment Logic

```typescript
interface PerformanceMetrics {
  recentAccuracy: number; // Last 10 attempts
  averageResponseTime: number; // milliseconds
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
}

function calculateNextDifficulty(
  currentDifficulty: number,
  metrics: PerformanceMetrics
): number {
  let adjustment = 0;

  // Accuracy-based adjustment
  if (metrics.recentAccuracy >= 0.9 && metrics.consecutiveCorrect >= 5) {
    adjustment += 1; // Increase difficulty
  } else if (metrics.recentAccuracy < 0.6 && metrics.consecutiveIncorrect >= 3) {
    adjustment -= 1; // Decrease difficulty
  }

  // Speed-based adjustment (if accurate AND fast)
  if (metrics.recentAccuracy >= 0.85 && metrics.averageResponseTime < expectedTime) {
    adjustment += 0.5;
  }

  // Clamp to valid range (1-10)
  return Math.max(1, Math.min(10, currentDifficulty + adjustment));
}
```

### Spaced Repetition System

```typescript
interface SkillReview {
  skillId: string;
  lastPracticed: Date;
  masteryLevel: number; // 0-100
  reviewInterval: number; // days
}

function calculateNextReviewDate(skill: SkillReview): Date {
  // SM-2 algorithm simplified
  const baseInterval = skill.reviewInterval || 1;

  let nextInterval: number;
  if (skill.masteryLevel >= 80) {
    nextInterval = baseInterval * 2.5; // Well mastered
  } else if (skill.masteryLevel >= 60) {
    nextInterval = baseInterval * 1.5; // Moderately mastered
  } else {
    nextInterval = 1; // Needs more practice
  }

  const nextDate = new Date(skill.lastPracticed);
  nextDate.setDate(nextDate.getDate() + Math.floor(nextInterval));
  return nextDate;
}
```

## API Design (Supabase)

### Auto-Generated REST API (PostgREST)

Supabase automatically generates RESTful APIs for all database tables. No backend code needed!

#### Authentication (Supabase Auth SDK)
```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// Sign out
const { error } = await supabase.auth.signOut();

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

#### Database Queries (Supabase Client SDK)

**Fetch Students:**
```typescript
// Get student by ID
const { data, error } = await supabase
  .from('students')
  .select('*')
  .eq('id', studentId)
  .single();

// Update student profile
const { data, error } = await supabase
  .from('students')
  .update({ display_name: 'New Name' })
  .eq('id', studentId);
```

**Fetch Exercises:**
```typescript
// Get exercises by module and difficulty
const { data, error } = await supabase
  .from('exercises')
  .select('*')
  .eq('module', 'phonological_awareness')
  .lte('difficulty_level', 3)
  .order('difficulty_level', { ascending: true });
```

**Start Exercise Session:**
```typescript
// Insert new session
const { data, error } = await supabase
  .from('exercise_sessions')
  .insert({
    student_id: studentId,
    exercise_id: exerciseId,
    status: 'in_progress'
  })
  .select()
  .single();
```

**Submit Exercise Attempt:**
```typescript
// Insert attempt
const { data, error } = await supabase
  .from('exercise_attempts')
  .insert({
    session_id: sessionId,
    question_data: questionData,
    student_response: response,
    is_correct: isCorrect,
    response_time_ms: responseTime
  });
```

**Progress & Dashboard (with JOIN):**
```typescript
// Get student with progress and recent sessions
const { data, error } = await supabase
  .from('students')
  .select(`
    *,
    skill_progress(*),
    exercise_sessions(
      *,
      exercises(title, module)
    ),
    achievements(*)
  `)
  .eq('id', studentId)
  .single();
```

### Real-time Subscriptions

```typescript
// Listen to progress updates in real-time
const subscription = supabase
  .channel('student-progress')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'skill_progress',
      filter: `student_id=eq.${studentId}`
    },
    (payload) => {
      console.log('Progress updated:', payload.new);
    }
  )
  .subscribe();
```

### Custom Edge Functions (for Complex Logic)

For operations that can't be done with simple queries:

```typescript
// Edge Function: /functions/calculate-wcpm/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { audioUrl, expectedText } = await req.json();

  // Call Google Cloud Speech-to-Text
  const transcript = await transcribeAudio(audioUrl);

  // Calculate WCPM
  const wcpm = calculateWCPM(transcript, expectedText);

  return new Response(JSON.stringify({ wcpm }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

**Invoke from frontend:**
```typescript
const { data, error } = await supabase.functions.invoke('calculate-wcpm', {
  body: { audioUrl, expectedText }
});
```

### Storage API

```typescript
// Upload audio recording
const { data, error } = await supabase.storage
  .from('user-recordings')
  .upload(`${studentId}/${sessionId}.webm`, audioFile);

// Get public URL for audio file
const { data } = supabase.storage
  .from('audio-files')
  .getPublicUrl('phonics/sounds/a.mp3');
```

### Benefits of Supabase APIs:
- **No Backend Code**: Auto-generated from database schema
- **Type-Safe**: TypeScript types auto-generated from schema
- **Real-time**: WebSocket subscriptions built-in
- **Secure**: Row Level Security enforced at database level
- **Performance**: Automatic query optimization and connection pooling

## Development Workflow

### Project Structure (Supabase)

```
dyslexia-reading-app/
├── frontend/                   # React TypeScript PWA
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── exercises/     # Exercise components
│   │   │   ├── dashboard/     # Dashboard components
│   │   │   └── common/        # Shared components
│   │   ├── pages/             # Page-level components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Core libraries
│   │   │   └── supabase.ts    # Supabase client setup
│   │   ├── services/          # Business logic services
│   │   │   ├── exercises.ts   # Exercise logic
│   │   │   ├── progress.ts    # Progress tracking
│   │   │   └── db.ts          # IndexedDB for offline
│   │   ├── store/             # Zustand state management
│   │   ├── utils/             # Utility functions
│   │   ├── types/             # TypeScript types
│   │   └── content/           # Static content
│   │       ├── phonics/       # Phonics data
│   │       └── schemas/       # JSON schemas
│   ├── public/                # Static assets
│   │   └── audio/             # Pre-cached audio files
│   ├── supabase/              # Supabase configuration
│   │   ├── migrations/        # SQL migration files
│   │   ├── seed.sql           # Seed data
│   │   └── config.toml        # Local Supabase config
│   └── package.json
│
├── supabase/                   # Supabase Edge Functions (optional)
│   └── functions/
│       ├── calculate-wcpm/    # WCPM calculation
│       └── adaptive-difficulty/ # Difficulty adjustment
│
├── docs/                       # Documentation
│   ├── RESEARCH.md
│   ├── FEATURE_DESIGN.md
│   ├── TECHNICAL_PLAN.md
│   └── specs/                 # Feature specifications
│
└── scripts/                    # Utility scripts
    ├── generate-types.sh      # Generate TS types from DB
    └── seed-exercises.ts      # Load exercise content
```

**Key Differences:**
- **No backend folder**: Supabase replaces traditional backend
- **supabase/ folder**: Contains SQL migrations and Edge Functions
- **lib/supabase.ts**: Single Supabase client for entire app
- **Simpler structure**: ~40% less code to maintain

### Development Setup (Supabase)

#### Prerequisites
```bash
# Install Node.js 18+ and pnpm
node --version  # v18+
pnpm --version  # v8+

# Install Supabase CLI (for local development)
npm install -g supabase
supabase --version
```

#### Initial Setup
```bash
# Clone repository
git clone <repo-url>
cd dyslexia-reading-app

# Install frontend dependencies
cd frontend
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with Supabase project URL and anon key:
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key

# Option 1: Use Supabase Cloud (Recommended for MVP)
# 1. Create project at https://supabase.com
# 2. Copy URL and anon key to .env
# 3. Run migrations via Supabase dashboard or CLI

# Option 2: Local Supabase Development (Advanced)
supabase init  # Initialize local Supabase
supabase start  # Starts local Postgres + PostgREST + Auth
supabase db reset  # Load schema and seed data

# Start development server
pnpm dev  # Runs frontend on localhost:5173
```

#### Supabase Project Setup
```sql
-- Run these migrations in Supabase SQL Editor or via CLI

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (example for students table)
CREATE POLICY "Users can view their own student profiles"
  ON students FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Parents can view their children's profiles"
  ON students FOR SELECT
  USING (
    auth.uid() IN (
      SELECT parent_id FROM parent_student_links
      WHERE student_id = students.id
    )
  );

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio-files', 'audio-files', true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('user-recordings', 'user-recordings', false);
```

### Testing Strategy

#### Unit Tests
- **Frontend**: Jest + React Testing Library
- **Backend**: Jest + Supertest
- Test individual components and functions
- Aim for 80%+ code coverage

#### Integration Tests
- Test API endpoints with test database
- Test audio processing pipeline
- Test adaptive learning algorithms

#### End-to-End Tests
- **Tool**: Playwright or Cypress
- Test complete user flows
- Exercise completion flows
- Progress tracking accuracy
- Audio recording and analysis

#### Accessibility Testing
- **Tool**: axe-core, WAVE
- Automated a11y checks in CI
- Manual screen reader testing
- Keyboard navigation testing

### Code Quality

#### Linting & Formatting
```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "type-check": "tsc --noEmit"
  }
}
```

#### Pre-commit Hooks (Husky)
```bash
# Install husky
pnpm add -D husky lint-staged

# Pre-commit hook
npm test
npm run lint
npm run type-check
```

## Security Considerations

### Data Privacy
1. **COPPA Compliance** - App targets children under 13
   - Parental consent required
   - Minimal data collection
   - No advertising
   - Secure data handling

2. **Data Encryption**
   - TLS/HTTPS for all connections
   - Encrypt sensitive data at rest
   - Hash passwords with bcrypt/argon2

3. **Audio Recordings**
   - Explicit consent for voice recording
   - Automatic deletion after analysis (optional retention)
   - Secure storage with access controls

### Authentication & Authorization
- JWT tokens with short expiration
- Refresh token rotation
- Role-based access control (RBAC)
- Rate limiting on API endpoints

### Input Validation
- Validate all user inputs
- Sanitize text inputs
- Limit file upload sizes
- Check audio file formats

## Performance Optimization

### Frontend
1. **Code Splitting** - Lazy load routes and heavy components
2. **Asset Optimization** - Compress images, audio files
3. **Caching** - Service workers for offline support
4. **Memoization** - React.memo, useMemo, useCallback

### Backend
1. **Database Indexing** - Index frequently queried fields
2. **Query Optimization** - Use joins, avoid N+1 queries
3. **Caching** - Redis for session data, frequent queries
4. **Connection Pooling** - Reuse database connections

### Audio Processing
1. **Async Processing** - Use job queues (BullMQ) for STT
2. **File Compression** - Compress audio before storage
3. **CDN Delivery** - Serve static audio from CDN

## Monitoring & Maintenance

### Error Tracking
- Sentry for exception monitoring
- Alert on critical errors
- User session replay for debugging

### Performance Monitoring
- Track API response times
- Monitor database query performance
- Frontend performance metrics (Core Web Vitals)

### User Analytics
- Exercise completion rates
- Time spent per module
- Common drop-off points
- Feature usage statistics

### Logging
- Structured JSON logs
- Log levels (debug, info, warn, error)
- Centralized log aggregation (if multi-server)

## Scalability Considerations

### Horizontal Scaling
- Stateless API servers (scale horizontally)
- Load balancer (AWS ALB, Nginx)
- Database read replicas for heavy read workloads

### Content Delivery
- CDN for static assets and audio files
- Edge caching for API responses
- Optimize for global distribution

### Database Scaling
- Partitioning by student_id for large tables
- Archive old session data
- Consider sharding if user base grows significantly

## Cost Estimation (Monthly) - Supabase Stack

### MVP Stage (100-500 active users)
- **Supabase Free Tier**: $0
  - 500MB database storage
  - 1GB file storage (audio assets)
  - 50,000 monthly active users
  - 2GB bandwidth
  - Unlimited API requests
- **Frontend Hosting**: $0 (Vercel/Netlify free tier)
- **TTS/STT**: $10-30 (Google Cloud usage-based)
- **Monitoring**: $0 (Sentry free tier)
- **Total**: ~$10-30/month

### Growth Stage (1,000-5,000 active users)
- **Supabase Pro**: $25/month
  - 8GB database storage
  - 100GB file storage
  - Unlimited users
  - 250GB bandwidth
  - Daily backups
  - 7-day log retention
- **Frontend Hosting**: $0-20 (likely still free)
- **TTS/STT**: $100-300 (usage-based)
- **Monitoring**: $0-30 (Sentry)
- **Total**: ~$125-375/month

### Scale Stage (10,000-50,000 users)
- **Supabase Pro**: $25/month (base)
  - Additional database storage: ~$25/month (per 50GB)
  - Additional bandwidth: ~$100/month (per 250GB)
- **Frontend Hosting**: $20-50
- **TTS/STT**: $500-1,500 (optimize with caching)
- **Monitoring**: $50-100
- **Total**: ~$720-1,700/month

### Enterprise Stage (50,000+ users)
- **Supabase Team/Enterprise**: Custom pricing (~$599+/month)
- **Consider optimizations**:
  - Pre-generate common audio files (reduce TTS costs)
  - Implement aggressive caching strategies
  - Use Web Speech API for basic TTS (free)
  - Self-host Supabase if cost-effective
- **Total**: ~$2,000-5,000/month

**Cost Savings vs. Traditional Stack:**
- **MVP**: 60-80% cheaper (no separate backend hosting)
- **Growth**: 40-50% cheaper (consolidated services)
- **Scale**: 20-30% cheaper (reduced DevOps overhead)

## Next Steps for Implementation (Supabase)

### Week 1-2: Project Setup & Supabase Integration
- [ ] Initialize Git repository structure (DONE - already exists)
- [ ] Set up frontend (React + TypeScript + Vite) (DONE - already exists)
- [ ] Create Supabase project on Supabase Cloud
- [ ] Install Supabase JavaScript client (`@supabase/supabase-js`)
- [ ] Configure environment variables (Supabase URL, anon key)
- [ ] Set up Supabase CLI for local development
- [ ] Configure ESLint, Prettier, Husky (if not done)

### Week 3-4: Database Schema & Authentication
- [ ] Design and create database schema in Supabase
- [ ] Write SQL migrations for all tables (users, students, exercises, etc.)
- [ ] Set up Row Level Security (RLS) policies
- [ ] Implement Supabase Auth integration in frontend
- [ ] Create user registration flow with email verification
- [ ] Build parent/student profile management
- [ ] Add COPPA-compliant parental consent flow
- [ ] Create storage buckets for audio files and user recordings

### Week 5-8: First Exercise Module
- [ ] Build phonological awareness exercises
- [ ] Implement "Sound Identification" exercise
- [ ] Implement "Sound Manipulation" exercise
- [ ] Add audio playback support
- [ ] Create exercise session tracking
- [ ] Build basic progress dashboard

### Week 9-12: Progress Tracking & Gamification
- [ ] Implement skill progress calculation
- [ ] Build student dashboard with charts
- [ ] Add points and achievement system
- [ ] Create adaptive difficulty algorithm
- [ ] Add daily streak tracking

### Week 13-16: Additional Exercise Modules
- [ ] Build phonics exercises
- [ ] Build word recognition exercises
- [ ] Add more exercise variety
- [ ] Implement spaced repetition

### Week 17-20: Audio Features
- [ ] Integrate TTS (Google Cloud)
- [ ] Implement audio recording
- [ ] Build fluency assessment with WCPM
- [ ] Add speech recognition for pronunciation

### Week 21-24: Polish & Testing
- [ ] Comprehensive accessibility testing
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] User feedback testing
- [ ] Bug fixes and refinement

### Week 25-26: Launch Preparation
- [ ] Set up production infrastructure
- [ ] Configure monitoring and alerts
- [ ] Create user documentation
- [ ] Plan beta testing program
- [ ] Deploy MVP

## Conclusion

This technical plan provides a comprehensive roadmap for building a research-backed, accessible, and engaging dyslexia reading intervention application. The architecture is designed to be scalable, maintainable, and focused on delivering measurable results for students with dyslexia.

Key success factors:
1. **Evidence-based approach** - All features grounded in research
2. **Accessibility first** - Designed for the target audience
3. **Measurable progress** - Clear tracking and reporting
4. **Engagement** - Gamification and adaptive learning
5. **Scalable architecture** - Can grow with user base
