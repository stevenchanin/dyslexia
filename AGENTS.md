# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a software application designed to help people with dyslexia improve their reading skills through computer-based exercises.

### Core Objectives
- Provide mobile-first exercises that develop reading skills
- Implement measurements of success so users can track progress
- FREE and accessible to low-income families (competitive differentiator)
- Works offline (critical for users with limited/unstable internet)

### Current Status
Research and planning phase is **complete**. The project now has comprehensive documentation ready for implementation:

- **RESEARCH.md** - Evidence-based dyslexia intervention methods and findings
- **FEATURE_DESIGN.md** - Detailed exercise modules, progress tracking, and user experience design
- **TECHNICAL_PLAN.md** - Complete technical architecture, database schema, API design, and implementation roadmap
- **MOBILE_FIRST_STRATEGY.md** - PWA approach, offline functionality, mobile optimization
- **COMPETITIVE_ANALYSIS.md** - Market gaps, competitor comparison, differentiation strategy

The codebase does not yet contain implementation code - ready to begin development.

## Key Research Findings

### Evidence-Based Methods
- **95% of children with dyslexia can achieve functional literacy** with proper intervention
- Structured Literacy (Orton-Gillingham method) is the gold standard
- Multicomponent interventions (phonological awareness, phonics, fluency, vocabulary, comprehension) are most effective
- Computer-assisted instruction shows comparable effectiveness to traditional delivery

### Critical Metrics
- **WCPM (Words Correct Per Minute)** - Primary fluency measurement
- Phonological awareness accuracy and response time
- Decoding skills (real words vs. pseudowords)
- Reading comprehension at appropriate difficulty levels

### Design Insights
- **Special dyslexia fonts (OpenDyslexic, Dyslexie) show no measurable benefit** - use standard Arial instead
- Text-to-Speech (TTS) support is essential for accessibility
- Adaptive difficulty and spaced repetition improve retention
- Gamification increases engagement and practice consistency

## Technology Stack (Mobile-First PWA)

### Frontend - Progressive Web App
- **React 18+ + TypeScript** - Component-based UI with type safety
- **Vite** - Fast build tool with PWA plugin
- **Workbox** - Service workers for offline functionality
- **Tailwind CSS + shadcn/ui** - Lightweight, mobile-first styling
- **Zustand** - Lightweight state management (~1KB)
- **IndexedDB (Dexie.js)** - Offline data storage
- **Web Audio API + Web Speech API** - Browser-native TTS/STT (free!)

### Backend
- **Supabase** - Backend-as-a-Service (BaaS)
  - PostgreSQL database (managed)
  - Authentication (JWT-based)
  - Object storage (S3-compatible)
  - Auto-generated REST/GraphQL APIs
  - Real-time subscriptions
  - Edge Functions (Deno runtime)

### Infrastructure
- **Vercel/Netlify/Cloudflare Pages** - PWA hosting
- **Supabase Cloud** - Managed backend platform
- **Sentry** - Error monitoring

**Why Supabase:**
- Replaces separate backend server, auth service, and file storage
- Generous free tier aligns with free app mission
- Reduces infrastructure complexity by ~60%
- Row Level Security (RLS) for data protection
- Open-source and self-hostable if needed

### Why PWA over Native Apps
- Works on ALL devices (iOS, Android, desktop) from single codebase
- No app store approval or fees
- Instant updates
- Offline functionality via service workers
- 26% of low-income households are smartphone-only - mobile-first is critical

## Development Guidelines

When implementing this project, remember:
- **Mobile-first, always** - 71% of low-income families rely on smartphones
- **Offline-first** - Design every feature to work offline (service workers, IndexedDB)
- **Performance budget** - < 3s load on 3G, < 200KB initial bundle
- **Touch-optimized** - Large tap targets (44x44px min), thumb-zone navigation
- **Accessibility is paramount** - The target users have dyslexia
- **Evidence-based design** - All features grounded in research (see RESEARCH.md)
- **Progress tracking is core** - Users must see measurable improvement
- **COPPA compliance** - App targets children, requires parental consent and privacy
  - ⚠️ **Important**: Research Supabase Auth's COPPA compliance status
  - May need custom parental consent flow before child account creation
  - Consider age-gated registration requiring parent email verification
- **Data conservation** - Compress assets, lazy load, cache aggressively
- **Multimodal learning** - Combine visual, auditory, and kinesthetic approaches
- **Immediate feedback** - Students learn best with quick, constructive feedback

## Implementation Priorities (Mobile-First MVP)

### MVP Phase 1 (Weeks 1-4) - Core Mobile PWA
1. Set up Vite + React + TypeScript + PWA plugin
2. Implement service worker (offline shell, caching)
3. Mobile-first UI (bottom navigation, touch targets)
4. First exercise module (phonological awareness)
5. Local progress storage (IndexedDB)
6. Works completely offline

### MVP Phase 2 (Weeks 5-8) - Enhanced Features
1. Audio playback (Web Speech API TTS)
2. More exercises (10+ activities)
3. Progress dashboard (mobile-optimized)
4. Install prompt (Add to Home Screen)
5. Background sync for progress

See TECHNICAL_PLAN.md for complete implementation roadmap.
See MOBILE_FIRST_STRATEGY.md for mobile-specific guidance.

## Key Statistics to Remember

**Target Audience (Low-Income Families with Dyslexia):**
- 71% own smartphones
- 26% are smartphone-only (no computer/home internet)
- 4-5 million low-income US students have dyslexia
- Existing solutions cost $100-600/month (unaffordable)

**This project aims to be the first free, comprehensive, mobile-first dyslexia intervention program.**
