# Technical Alternatives Focused on Readability and Mobile-First

Goal: Identify widely used, low-complexity alternatives that still deliver mobile-first PWA functionality (offline, TTS/STT, IndexedDB, progress tracking), and assess whether they improve developer readability and maintainability versus the current plan.

Evaluation criteria
- Readability/approachability: code clarity, convention, boilerplate
- Mobile-first + offline: PWA quality, cache, install, background sync
- Capability match: exercises, audio, WCPM, i18n, analytics
- Ecosystem & hiring: maturity, docs, library support
- Performance on low-end phones: bundle size, runtime overhead
- Migration risk: learning curve, vendor lock-in, portability

Current baseline (from docs)
- Frontend: React + TypeScript + Vite + Tailwind + Workbox; Zustand + Dexie; i18next; charts (Recharts/Chart.js)
- Backend: Node.js + Express + TypeScript + PostgreSQL; optional Redis; storage R2/B2; Auth0

Summary recommendations
- Keep React + TypeScript + Vite as default for ubiquity and hiring, but enforce a lean, conventioned setup for readability: TanStack Query for server state, small local store for UI state, feature folders, Workbox for offline, i18next for i18n.
- If readability for new contributors (especially non-React folks) is paramount, Vue 3 + Vite + Pinia + Vue I18n is the most widely used alternative with very approachable Single File Components (SFCs).
- For the backend, consider NestJS (opinionated Node/TS) if you want stronger structure without leaving TypeScript, or FastAPI (Python) if you want readability and an easier path for ML/analytics work.


## Frontend Alternatives

Option A — React + TypeScript + Vite (Lean, opinionated usage)
- What: Stay on React but standardize on a minimal set of libraries and conventions.
- Suggested stack: Vite, React 18, TypeScript, Workbox (PWA), Tailwind (or CSS Modules), TanStack Query (server state), Zustand (UI state only), i18next, Dexie.
- Pros
  - Ubiquitous ecosystem and hiring pool
  - Vite keeps DX fast, bundles small; PWA well supported
  - TanStack Query simplifies data flows (less custom fetch boilerplate)
  - Minimal local store keeps code legible; easy to onboard
  - i18next widely used, good docs; Workbox is the standard for offline
- Cons
  - JSX/React patterns may feel verbose compared to Svelte/Vue
  - Many choices; needs a documented project structure to avoid drift
- Assessment: Still a strong default; prioritize readability via conventions and a small, known set of libs.

Option B — Vue 3 + Vite + Pinia + Vue I18n
- What: Vue SFCs (Composition API or Options API), Pinia for state, Vue I18n, Workbox PWA.
- Pros
  - SFCs are easy to read: template + script + style in one file
  - Pinia is simple, typed-friendly, and readable
  - Vue I18n integrates cleanly; community is large and mature
  - Great mobile-first tooling with Vite; PWA via vite-plugin-pwa/workbox
- Cons
  - Smaller hiring pool than React in some regions
  - Mixed Composition vs Options API styles can fragment code if not standardized
- Assessment: Excellent readability; widely used; viable if team is open to Vue.

Option C — SvelteKit + TypeScript
- What: Svelte’s compiled reactivity, SvelteKit routing, vite-plugin-pwa or Workbox.
- Pros
  - Very low boilerplate; reactive code is terse and readable
  - Small bundles, good perf on low-end devices
  - Stores are trivial; SvelteKit file-based routing feels natural
- Cons
  - Smaller ecosystem than React/Vue; fewer hires with Svelte experience
  - Some PWA patterns (service workers) require more hand-rolled setup
- Assessment: Readability is strong, but ecosystem size is the main risk. Good choice if maintainers are comfortable with Svelte.

Option D — Next.js (React) with static export + PWA
- What: Next.js App Router, static export for PWA, Workbox for offline.
- Pros
  - Strong conventions and docs; massive ecosystem
  - Built-in routing/layouts; good i18n options
- Cons
  - SSR/ISR features add mental model complexity not needed for a mostly client-side PWA
  - Larger baseline runtime than plain Vite React
- Assessment: Viable, but adds framework complexity for limited benefit in an offline-first PWA.

Option E — Capacitor-wrapped PWA (optional later)
- What: Keep web code; wrap with Capacitor to access native APIs or distribute in app stores.
- Pros
  - Reuse same code base; unlock native features (notifications, background audio)
  - Popular and well-documented
- Cons
  - Adds mobile build/release complexity; store policies and reviews
- Assessment: Consider as a distribution option post-MVP, not a core stack change.


## Backend Alternatives

Option A — Keep Node.js + Express + TypeScript (baseline) with Prisma
- Pros
  - Same language front/back simplifies hiring and shared types
  - Extremely common stack; many examples and libs
  - Prisma improves schema clarity and readability
- Cons
  - Express is unopinionated; structure must be enforced
- Assessment: Fine choice if you add conventions (layered folders, DTOs, validation, logging) to keep code readable.

Option B — NestJS (Node/TS, opinionated)
- Pros
  - Strong architectural conventions (modules/controllers/services/providers)
  - Built-in DI, validation pipes, testing patterns; Swagger generation
  - Easier for teams to navigate and onboard
- Cons
  - Framework learning curve; more boilerplate than Express
- Assessment: Better long-term readability/consistency than raw Express if the team is TypeScript-centric.

Option C — FastAPI (Python) + PostgreSQL
- Pros
  - Very readable, type-hinted Python; excellent auto-generated docs (OpenAPI)
  - Great for analytics/ML; many devs are comfortable reading Python
  - Performance is adequate for this workload; strong ecosystem
- Cons
  - Two-language stack; operational split front/back
  - Need to choose ORM (SQLModel/SQLAlchemy) and auth integrations
- Assessment: If readability and future ML integration are priorities, FastAPI is a strong alternative.

Option D — Django + Django REST Framework (DRF)
- Pros
  - Batteries-included; admin, auth, migrations, serializer/validation patterns
  - DRF is mature and well-documented; very consistent code organization
- Cons
  - Heavier than needed; DRF serializers can feel verbose
  - Two-language split like FastAPI
- Assessment: Very maintainable and familiar to many engineers; good if you want strong conventions and an admin out of the box.

Option E — Supabase (Postgres + Auth + Storage) with edge functions
- Pros
  - Very fast to ship; auth/storage/database managed; generous free tier
  - Realtime, Row Level Security built-in; client SDKs
- Cons
  - Vendor lock-in and coupling; less control over backend logic structure
  - Complex domain logic can get messy in edge functions
- Assessment: Viable for MVP speed; readability is good at first but can degrade if a lot of logic moves into SQL/edge functions. Consider as a stepping stone.


## Offline & Sync Alternatives

Option A — IndexedDB (Dexie) + custom sync (current)
- Pros: Flexible, minimal dependencies, fits PWA; you control data model
- Cons: You must implement conflict resolution and background sync
- Assessment: Good balance; readable if scoped and documented.

Option B — PouchDB (IndexedDB) + CouchDB sync
- Pros: Built-in incremental sync and conflict handling; proven offline-first pattern
- Cons: Querying can be awkward vs SQL; adds CouchDB infra; less mainstream than Dexie
- Assessment: Consider if multi-device sync becomes a core requirement; otherwise stick to Dexie + custom sync.


## i18n Alternatives
- React: i18next (current), or FormatJS/React-Intl (popular but heavier)
- Vue: Vue I18n (first-class)
- Svelte: svelte-i18n or i18next adapter
- Assessment: i18next remains a good default; Vue I18n if using Vue.


## Recommended Paths

Path 1 — Keep React/Vite, tighten conventions (most pragmatic)
- Why better: Minimal migration, largest ecosystem, simple mental model with Vite PWA.
- Concrete steps for readability
  - Adopt TanStack Query for all server state; keep Zustand limited to UI state
  - Feature-sliced folders (features/exercises, features/progress, etc.)
  - Centralized types and API client; zod for request/response validation
  - Document service worker and offline rules; add an ADR for each big choice

Path 2 — Vue 3 + Vite + Pinia (readability-first alternative)
- Why better: SFCs are easy for new contributors to read; strong conventions; still widely used.
- Migration risk: Moderate (component rewrite), but worth it if team comfort favors Vue.

Path 3 — Backend shift for structure/readability
- If staying in TypeScript: prefer NestJS over raw Express for long-term maintainability.
- If optimizing for readability/ML: FastAPI + Postgres is an excellent alternative.


## Bottom-Line Assessment
- Frontend: React/Vite remains a top choice given ubiquity and tooling. If the primary concern is code approachability for a diverse contributor base, Vue 3 is the strongest widely used alternative that may increase readability with minimal runtime cost.
- Backend: Express is fine with conventions; NestJS improves structure in TS ecosystems. FastAPI improves readability and aligns with analytics/ML aspirations at the cost of a two-language stack.
- Offline/i18n: Current choices (Workbox + Dexie + i18next) are standards-aligned and readable. Only consider PouchDB/CouchDB if turnkey cross-device sync becomes critical.

Decision suggestion
- Stay on React/Vite/TS with a lean, standardized library set and clear structure; adopt NestJS (TS) or keep Express with Prisma and strong conventions.
- Re-evaluate Vue 3 only if the contributor pool skews toward non-React developers or if early contributors strongly prefer SFC ergonomics.
