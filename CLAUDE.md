# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a software application designed to help people with dyslexia improve their reading skills through computer-based exercises.

### Core Objectives
- Provide on-computer exercises that develop reading skills
- Implement measurements of success so users can track progress
- Consider integration of special fonts designed for dyslexia

### Current Status
Research and planning phase is **complete**. The project now has comprehensive documentation ready for implementation:

- **RESEARCH.md** - Evidence-based dyslexia intervention methods and findings
- **FEATURE_DESIGN.md** - Detailed exercise modules, progress tracking, and user experience design
- **TECHNICAL_PLAN.md** - Complete technical architecture, database schema, API design, and implementation roadmap

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

## Technology Stack (Recommended)

### Frontend
- **React + TypeScript** - Component-based UI with type safety
- **Material-UI or Chakra UI** - Accessible component library
- **Web Audio API + Web Speech API** - TTS and audio playback
- **Recharts** - Progress visualization

### Backend
- **Node.js + Express + TypeScript** - API server
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions
- **Google Cloud TTS/STT** - High-quality audio processing

### Infrastructure
- **Vercel/Netlify** - Frontend hosting
- **Railway/Render** - Backend hosting
- **Auth0** - Authentication (COPPA-compliant)
- **Sentry** - Error monitoring

## Development Guidelines

When implementing this project, remember:
- **Accessibility is paramount** - The target users have dyslexia
- **Evidence-based design** - All features should be grounded in research (see RESEARCH.md)
- **Progress tracking is core** - Users must see measurable improvement
- **COPPA compliance** - App targets children, requires parental consent and privacy controls
- **Multimodal learning** - Combine visual, auditory, and kinesthetic approaches
- **Immediate feedback** - Students learn best with quick, constructive feedback

## Implementation Priorities

### MVP Phase 1 (Weeks 1-8)
1. Project setup and infrastructure
2. Authentication and user management
3. First exercise module: Phonological Awareness
4. Basic progress tracking

See TECHNICAL_PLAN.md for complete week-by-week implementation roadmap.
