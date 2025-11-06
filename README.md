# Free Dyslexia Reading Intervention

> **Help us build the first comprehensive, AI-powered dyslexia intervention program that's completely free for families who need it most.**

## The Problem We're Solving

Every year, millions of children with dyslexia fall behind in reading—not because they can't learn, but because **effective intervention costs $100-600 per month**, putting it out of reach for the families who need it most. Research shows that **95% of children with dyslexia can achieve functional literacy** with proper intervention, yet **4-5 million low-income students** in the US lack access to these proven programs.

**We're changing that.**

## What We're Building

A free, open-source, mobile-first web app that provides:

- ✅ **Evidence-based intervention** using Orton-Gillingham and Structured Literacy methods
- ✅ **AI-powered adaptive learning** that personalizes difficulty and provides family guidance (replacing expensive professional oversight)
- ✅ **Works on smartphones** (71% of low-income families rely on mobile devices)
- ✅ **Offline capability** for families with limited internet access
- ✅ **Progress tracking** with automated assessments (WCPM, skill mastery)
- ✅ **Engaging gamification** to keep kids motivated

**The result:** Professional-grade dyslexia intervention that any family can access, for free, from any smartphone.

## Why This Matters

- Market gap: No free comprehensive dyslexia intervention program exists. Free tools are either assistive (text-to-speech) or scattered resources, not structured intervention.
- Our advantage: By leveraging modern technology (PWAs, LLMs, open source), we can deliver what competitors charge $1,200-7,200/year for at a cost of pennies per student.
- Impact potential: If we help even 10,000 children learn to read who couldn't afford intervention, we've changed 10,000 lives. At scale, we could reach millions.

## The Opportunity for Collaborators

This project is **fully planned and ready for implementation**. We have:

- 📚 **50,000+ words of research and planning** covering intervention methods, features, technical architecture, competitive strategy, and go-to-market
- 🏗️ **Complete technical specifications** (mobile-first PWA, React/TypeScript, LLM integration)
- 🎯 **Clear roadmap** with 26-week implementation plan
- 💰 **Minimal costs** (~$127/month to serve 1,000 students)
- 🌍 **Massive underserved market** (millions of families waiting for this solution)

**We need collaborators who want to:**
- 💻 Build life-changing software (React, TypeScript, Node.js, ML/AI)
- 📝 Create educational content (exercises, reading materials)
- 🎨 Design accessible, mobile-first interfaces
- 📊 Analyze data and measure impact
- 🤝 Connect with schools and nonprofits
- 📣 Spread the word to families who need this

**What you'll gain:**
- Build something that genuinely changes lives
- Work with cutting-edge AI/education technology
- Join a mission-driven open-source project
- Portfolio piece that demonstrates technical skill and social impact
- Potential for grants/funding as project grows

## Project Status

✅ **Planning complete** - Extensive research, feature design, technical architecture, and go-to-market strategy all documented
⬜ **Implementation starting** - Ready to build

**See documentation below for complete details on every aspect of the project.**

---

## Project Overview

This app delivers evidence‑based Structured Literacy via a mobile‑first PWA with AI‑powered personalization. See docs/FEATURE_DESIGN.md for the complete feature set and UX details.

## Documentation

The research and planning phase is complete. Detailed documentation includes:

- See docs/ for the full set:
  - **docs/RESEARCH.md** - Comprehensive research on dyslexia intervention methods, exercise types, and assessment metrics
  - **docs/FEATURE_DESIGN.md** - Complete feature specifications, exercise modules, progress tracking, and UX design
  - **docs/TECHNICAL_PLAN.md** - Full technical architecture, database schema, API design, and 26-week implementation roadmap
  - **docs/MOBILE_FIRST_STRATEGY.md** - Mobile-first PWA approach, offline functionality, and mobile optimization
  - **docs/LLM_INTEGRATION_STRATEGY.md** - AI-powered tutoring, adaptive learning, and intelligent feedback system
  - **docs/MARKETING_STRATEGY.md** - Zero-budget go-to-market plan for widespread adoption
  - **docs/COMPETITIVE_ANALYSIS.md** - Market analysis, competitor comparison, and differentiation strategy
  - **docs/COMPETITIVE_SUMMARY.md** - Quick reference competitive positioning
  - **docs/PROJECT_SUMMARY.md** - Executive summary of all research and planning
  - **docs/CLAUDE.md** - Guidance for contributors when working in this repository

## Technology Stack

**⚡ Mobile-First Progressive Web App (PWA)**

- **Frontend**: React + TypeScript, Vite, Workbox (PWA/offline), Chakra UI via a small `/ui` wrapper
- **State**: TanStack Query (server state) + Zustand (UI/app state)
- **Backend**: Node.js + Express + TypeScript, PostgreSQL
- **Storage**: IndexedDB (offline data), Cloudflare R2 (audio files)
- **Audio**: Web Audio API, Web Speech API (browser-native, free)
- **Infrastructure**: Vercel/Netlify (PWA hosting), Railway/Render (backend)

**Why Mobile-First:** 26% of low-income households are smartphone-only. See docs/MOBILE_FIRST_STRATEGY.md

### State Management Approach
- TanStack Query for all server-derived data (API responses) with caching and invalidation via query keys.
- A small Zustand store for UI/app state (e.g., low-bandwidth toggle, TTS rate), optionally persisted.
- Chakra UI components are accessed through `frontend/src/ui` wrappers (Button, Card, Stack, TextInput, Modal, Typography) to keep JSX clean and consistent.
- This keeps the codebase readable and avoids Redux-style boilerplate. See docs/STATE_PATTERNS.md.

## Getting Started

Frontend (React + Vite + Chakra UI)

Prereqs:
- Node.js 18+
- npm 9+ (or pnpm/yarn if you prefer)

Run the demo shell:
```bash
cd frontend
npm install
npm run dev
# open http://localhost:5173
```

Notes:
- The demo renders a minimal ExercisePlayer with Query + Zustand and Chakra UI via the `/ui` wrapper.
- No backend is wired yet; API calls will 404 unless you proxy or mock.

Next steps:
- See docs/STATE_PATTERNS.md for client state patterns.
- See docs/TECHNICAL_PLAN.md for the end-to-end roadmap.

## Repository Layout

- `frontend/` — React + Vite app (Chakra via `/ui`, TanStack Query + Zustand)
- `docs/` — All planning and research documentation (see docs/README.md)
- `decisions/` — Architecture Decision Records (ADRs)
- `scripts/` — Utility scripts

## Research Summary

See docs/RESEARCH.md for the evidence base and docs/PROJECT_SUMMARY.md for an executive overview of findings and recommendations.

## Contributing

This project is in early development. Contribution guidelines will be added as implementation begins.

## License

License to be determined.
