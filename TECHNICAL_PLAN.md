# Technical Implementation Plan

## Technology Stack Recommendations

### Frontend

#### Web Application (Recommended Primary Platform)
**Framework: React + TypeScript**
- **Why**: Component reusability, large ecosystem, excellent TypeScript support
- Rich UI libraries available
- Strong accessibility (a11y) support
- Can be packaged as desktop app (Electron) or mobile (React Native)

**UI Framework: Material-UI (MUI) or Chakra UI**
- Built-in accessibility features
- Clean, professional components
- Easy customization
- Responsive design out-of-box

**State Management: Zustand or Redux Toolkit**
- Manage user progress, exercise state
- Persist data locally and sync with backend
- Handle complex adaptive learning logic

**Audio/Voice: Web Audio API + Web Speech API**
- Text-to-speech (TTS) for accessibility
- Speech recognition for pronunciation exercises
- Audio playback for phoneme sounds

**Charts/Visualization: Recharts or Chart.js**
- Progress graphs and dashboards
- Performance over time
- Skill heat maps

**Styling: Tailwind CSS + CSS Modules**
- Rapid UI development
- Consistent design system
- Easy theming for accessibility options

### Backend

#### API Server: Node.js + Express or Python + FastAPI
**Node.js Option:**
- Consistent language with frontend (TypeScript)
- Excellent for real-time features
- Large package ecosystem

**Python Option:**
- Better for ML/AI features (adaptive learning algorithms)
- Data analysis libraries (pandas, numpy)
- Natural language processing (NLTK, spaCy)

**Recommendation: Start with Node.js/TypeScript for consistency, migrate to Python microservices if ML complexity grows**

#### Database
**Primary: PostgreSQL**
- Relational structure for user data, progress, exercises
- Strong data integrity
- Excellent JSON support for flexible data
- Proven scalability

**Caching/Sessions: Redis**
- Fast session management
- Cache frequently accessed data
- Real-time features (leaderboards, live updates)

**File Storage: AWS S3 or Cloudflare R2**
- Audio files (phoneme sounds, word pronunciations)
- User voice recordings
- Images and visual assets

#### Authentication
**Auth0 or Firebase Authentication**
- Secure user management
- Social login options
- COPPA compliance for children
- Parent/educator account types

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
**Frontend: Vercel or Netlify**
- Automatic deployments
- Global CDN
- Great developer experience
- Free tier available

**Backend: Railway, Render, or AWS**
- Easy PostgreSQL hosting
- Environment management
- Scalable infrastructure

**Full Stack Alternative: AWS Amplify**
- Complete solution (frontend, backend, auth, database)
- Pay-as-you-grow pricing
- Strong mobile support

#### CI/CD
**GitHub Actions**
- Automated testing
- Deployment pipelines
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

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Web App    │  │  Desktop App │  │  Mobile App  │  │
│  │  (React TS)  │  │  (Electron)  │  │(React Native)│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           │ HTTPS / REST API / GraphQL
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    API Gateway Layer                     │
│                  (Express / FastAPI)                     │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Authentication Middleware (Auth0 / Firebase)      │ │
│  │  Rate Limiting │ Request Validation │ CORS         │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                           │
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   Application Services                   │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │   User     │  │   Exercise   │  │    Progress    │  │
│  │  Service   │  │   Service    │  │    Service     │  │
│  └────────────┘  └──────────────┘  └────────────────┘  │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  Adaptive  │  │    Audio     │  │   Assessment   │  │
│  │  Learning  │  │  Processing  │  │    Service     │  │
│  └────────────┘  └──────────────┘  └────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                      Data Layer                          │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ PostgreSQL │  │    Redis     │  │   S3 / R2      │  │
│  │  (Primary  │  │   (Cache)    │  │ (File Storage) │  │
│  │   Data)    │  │              │  │                │  │
│  └────────────┘  └──────────────┘  └────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  External Services                       │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │   Google   │  │   Analytics  │  │     Sentry     │  │
│  │ Cloud TTS/ │  │   (PostHog)  │  │  (Monitoring)  │  │
│  │    STT     │  │              │  │                │  │
│  └────────────┘  └──────────────┘  └────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

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

## API Design

### REST API Endpoints

#### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

#### Users & Students
```
GET    /api/users/:userId
PATCH  /api/users/:userId
GET    /api/students/:studentId
PATCH  /api/students/:studentId
POST   /api/students/:studentId/settings
```

#### Exercises
```
GET    /api/exercises?module=phonological_awareness&difficulty=3
GET    /api/exercises/:exerciseId
POST   /api/exercises/:exerciseId/start      # Start session
POST   /api/sessions/:sessionId/submit       # Submit attempt
POST   /api/sessions/:sessionId/complete     # Complete session
```

#### Progress & Assessment
```
GET    /api/students/:studentId/progress
GET    /api/students/:studentId/progress/skills
GET    /api/students/:studentId/fluency-assessments
POST   /api/students/:studentId/fluency-assessments
GET    /api/students/:studentId/dashboard
```

#### Achievements & Gamification
```
GET    /api/students/:studentId/achievements
GET    /api/students/:studentId/points
GET    /api/students/:studentId/streak
```

#### Audio Processing
```
POST   /api/audio/synthesize               # TTS
POST   /api/audio/analyze-recording        # STT + WCPM calculation
```

### GraphQL Alternative (Optional)

For more complex data fetching needs:

```graphql
type Student {
  id: ID!
  displayName: String!
  gradeLevel: Int
  progress: Progress!
  achievements: [Achievement!]!
  dailyStreak: Int!
  recentSessions: [ExerciseSession!]!
}

type Progress {
  overallMastery: Float!
  skillProgress: [SkillProgress!]!
  fluencyAssessments: [FluencyAssessment!]!
  weeklyPracticeTime: Int!
}

type Query {
  student(id: ID!): Student
  nextExercise(studentId: ID!, module: String): Exercise
  dashboard(studentId: ID!): Dashboard
}

type Mutation {
  startExercise(exerciseId: ID!): ExerciseSession!
  submitAttempt(sessionId: ID!, response: JSON!): AttemptResult!
  completeSession(sessionId: ID!): SessionResult!
}
```

## Development Workflow

### Project Structure

```
dyslexia-reading-app/
├── frontend/                   # React TypeScript app
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── exercises/     # Exercise components
│   │   │   ├── dashboard/     # Dashboard components
│   │   │   └── common/        # Shared components
│   │   ├── pages/             # Page-level components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API client services
│   │   ├── store/             # State management
│   │   ├── utils/             # Utility functions
│   │   └── types/             # TypeScript types
│   ├── public/                # Static assets
│   └── package.json
│
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── routes/            # API route handlers
│   │   ├── controllers/       # Business logic
│   │   ├── services/          # Service layer
│   │   │   ├── adaptive-learning.ts
│   │   │   ├── audio-processing.ts
│   │   │   └── progress-tracking.ts
│   │   ├── models/            # Database models
│   │   ├── middleware/        # Express middleware
│   │   ├── utils/             # Utility functions
│   │   └── types/             # TypeScript types
│   ├── tests/                 # Test files
│   ├── prisma/                # Prisma ORM schema
│   └── package.json
│
├── shared/                     # Shared types/utilities
│   └── types/                 # Common TypeScript types
│
├── content/                    # Exercise content
│   ├── phonological-awareness/
│   ├── phonics/
│   ├── reading-passages/
│   └── audio-assets/
│
├── docs/                       # Documentation
│   ├── RESEARCH.md
│   ├── FEATURE_DESIGN.md
│   └── TECHNICAL_PLAN.md
│
└── infrastructure/             # Deployment configs
    ├── docker-compose.yml
    └── k8s/                   # Kubernetes (if needed)
```

### Development Setup

#### Prerequisites
```bash
# Install Node.js 18+ and pnpm
node --version  # v18+
pnpm --version  # v8+

# Install PostgreSQL 14+
postgres --version  # 14+

# Install Redis 6+
redis-server --version  # 6+
```

#### Initial Setup
```bash
# Clone repository
git clone <repo-url>
cd dyslexia-reading-app

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with database credentials, API keys, etc.

# Database setup
cd backend
pnpm prisma migrate dev
pnpm prisma seed  # Load initial exercise content

# Start development servers
pnpm dev  # Runs both frontend and backend
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

## Cost Estimation (Monthly)

### MVP Stage (100 active users)
- **Hosting**: $20-50 (Render/Railway)
- **Database**: $20 (PostgreSQL)
- **Storage**: $5 (S3 for audio)
- **Auth**: $0 (Auth0 free tier)
- **TTS/STT**: $10-30 (usage-based)
- **Monitoring**: $0 (free tiers)
- **Total**: ~$55-105/month

### Growth Stage (1,000 active users)
- **Hosting**: $100-200
- **Database**: $50-100
- **Storage**: $20-50
- **Auth**: $30
- **TTS/STT**: $100-300
- **CDN**: $20
- **Monitoring**: $30
- **Total**: ~$350-730/month

### Scale Stage (10,000+ users)
- Plan for $2,000-5,000/month
- Consider enterprise pricing
- Optimize expensive operations (TTS/STT)
- Implement more caching

## Next Steps for Implementation

### Week 1-2: Project Setup
- [ ] Initialize Git repository structure
- [ ] Set up frontend (React + TypeScript + Vite)
- [ ] Set up backend (Node.js + Express + TypeScript)
- [ ] Configure PostgreSQL + Prisma ORM
- [ ] Set up development environment
- [ ] Configure ESLint, Prettier, Husky

### Week 3-4: Core Infrastructure
- [ ] Implement authentication (Auth0)
- [ ] Design and create database schema
- [ ] Build basic API endpoints
- [ ] Create user registration flow
- [ ] Implement student profile management

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
