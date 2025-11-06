# ADR 0001: State Management Approach

Date: 2025-11-05

Decision
- Adopt TanStack Query for server state and a small Zustand store for UI/app state in the React + Vite frontend.

Context
- Goal: readable, low-ceremony state management aligned with a mobile-first PWA.
- Prior experience: Redux was considered too boilerplate-heavy.

Rationale
- TanStack Query eliminates hand-rolled caching and invalidation for API data.
- Zustand keeps UI/app state tiny and explicit without actions/reducers.
- Both are widely used, well-documented, and perform well on low-end phones.

Consequences
- Clear separation of concerns: API data in Query; UI flags/preferences in Zustand.
- No Redux store, action types, reducers, or thunks. Reduced ceremony and surface area.
- Patterns and examples are documented in STATE_PATTERNS.md.

Links
- ../docs/STATE_PATTERNS.md
- ../docs/TECHNICAL_PLAN.md#state-management
