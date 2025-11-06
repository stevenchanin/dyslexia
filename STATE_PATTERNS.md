# State Management Patterns: React vs Vue (Readable, Low‑Ceremony)

This guide shows how to handle server state vs UI/app state using minimal, widely used tooling for both stacks. Examples match the dyslexia app needs: exercises, sessions, progress, offline, and i18n.

Contents
- React Path: TanStack Query + small Zustand store
- Vue Path: @tanstack/vue-query (or simple composables) + Pinia
- Shared patterns: offline (IndexedDB/Dexie), invalidation, i18n, testing

---

## React Path

Libraries
- Server state: `@tanstack/react-query`
- UI/app state: `zustand` (+ optional `immer`, `zustand/middleware`)
- Persistence (offline): `dexie`
- i18n: `i18next`

Suggested structure
```
src/
  features/
    exercises/
      api.ts         # fetchers (typed)
      queries.ts     # useQuery/useMutation hooks
      store.ts       # small UI store (Zustand)
      components/
        ExercisePlayer.tsx
    progress/
      api.ts, queries.ts, store.ts, components/
  services/
    http.ts          # axios/fetch wrapper
    db.ts            # Dexie tables
  types/
    domain.ts
```

Server state (fetch + cache) — no reducers, no actions
```ts
// src/features/exercises/api.ts
import { z } from 'zod';

export const Exercise = z.object({ id: z.string(), module: z.string(), difficulty: z.number(), content: z.any() });
export type Exercise = z.infer<typeof Exercise>;

export async function fetchExercises(module: string, difficulty: number): Promise<Exercise[]> {
  const res = await fetch(`/api/exercises?module=${module}&difficulty=${difficulty}`);
  if (!res.ok) throw new Error('Failed to fetch');
  const data = await res.json();
  return z.array(Exercise).parse(data);
}

export async function submitAttempt(sessionId: string, payload: unknown) {
  const res = await fetch(`/api/sessions/${sessionId}/submit`, { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } });
  if (!res.ok) throw new Error('Submit failed');
  return res.json();
}
```

```ts
// src/features/exercises/queries.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchExercises, submitAttempt } from './api';

export function useExercises(module: string, difficulty: number) {
  return useQuery({
    queryKey: ['exercises', module, difficulty],
    queryFn: () => fetchExercises(module, difficulty),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSubmitAttempt(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: unknown) => submitAttempt(sessionId, payload),
    onSuccess: () => {
      // Invalidate progress/session views
      qc.invalidateQueries({ queryKey: ['progress'] });
      qc.invalidateQueries({ queryKey: ['session', sessionId] });
    },
  });
}
```

UI/app state (tiny) — no action types, no dispatch
```ts
// src/features/exercises/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ExerciseUIState {
  lowBandwidth: boolean;
  ttsRate: number;
  currentDifficulty: number;
  setLowBandwidth(v: boolean): void;
  setTtsRate(v: number): void;
  setDifficulty(v: number): void;
}

export const useExerciseUI = create<ExerciseUIState>()(
  persist(
    (set) => ({
      lowBandwidth: false,
      ttsRate: 1.0,
      currentDifficulty: 2,
      setLowBandwidth: (v) => set({ lowBandwidth: v }),
      setTtsRate: (v) => set({ ttsRate: v }),
      setDifficulty: (v) => set({ currentDifficulty: v }),
    }),
    { name: 'exercise-ui' }
  )
);
```

Using both in a component (simple hooks)
```tsx
// src/features/exercises/components/ExercisePlayer.tsx
import { useExercises, useSubmitAttempt } from '../queries';
import { useExerciseUI } from '../store';

export function ExercisePlayer({ module }: { module: string }) {
  const difficulty = useExerciseUI((s) => s.currentDifficulty);
  const { data: items, isLoading } = useExercises(module, difficulty);
  const { mutate: submit } = useSubmitAttempt('session-123');

  if (isLoading) return <div>Loading…</div>;
  return (
    <div>
      {items?.map((ex) => (
        <button key={ex.id} onClick={() => submit({ exId: ex.id, correct: true })}>
          Try {ex.title ?? ex.id}
        </button>
      ))}
    </div>
  );
}
```

Notes
- Server state lives in Query; UI state in a very small store. No reducers, no actions, no thunks.
- Invalidations describe data dependencies explicitly via keys.
- Add `react-query/devtools` in dev only for visibility.

---

## Vue Path

Libraries
- Server state: `@tanstack/vue-query` (or simple `useFetch*` composables with caching)
- UI/app state: `pinia`
- Persistence (offline): `dexie`
- i18n: `vue-i18n`

Suggested structure
```
src/
  features/
    exercises/
      api.ts
      queries.ts       # using @tanstack/vue-query
      stores.ts        # Pinia stores
      ExercisePlayer.vue
  services/
    db.ts
```

Server state (Vue Query)
```ts
// src/features/exercises/queries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { fetchExercises, submitAttempt } from './api';
import { computed } from 'vue';

export function useExercises(module: string, difficulty: number) {
  return useQuery({
    queryKey: ['exercises', module, difficulty],
    queryFn: () => fetchExercises(module, difficulty),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSubmitAttempt(sessionId: string) {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: unknown) => submitAttempt(sessionId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['progress'] });
      qc.invalidateQueries({ queryKey: ['session', sessionId] });
    },
  });
  return mutation;
}
```

UI/app state (Pinia)
```ts
// src/features/exercises/stores.ts
import { defineStore } from 'pinia';

export const useExerciseUI = defineStore('exercise-ui', {
  state: () => ({ lowBandwidth: false, ttsRate: 1.0, currentDifficulty: 2 }),
  getters: {
    isLowBandwidth: (s) => s.lowBandwidth,
  },
  actions: {
    setLowBandwidth(v: boolean) { this.lowBandwidth = v; },
    setTtsRate(v: number) { this.ttsRate = v; },
    setDifficulty(v: number) { this.currentDifficulty = v; },
  },
});
```

Usage in SFC
```vue
<!-- src/features/exercises/ExercisePlayer.vue -->
<script setup lang="ts">
import { useExercises, useSubmitAttempt } from './queries';
import { useExerciseUI } from './stores';

const props = defineProps<{ module: string }>();
const ui = useExerciseUI();
const { data, isLoading } = useExercises(props.module, ui.currentDifficulty);
const { mutate } = useSubmitAttempt('session-123');
</script>

<template>
  <div v-if="isLoading">Loading…</div>
  <div v-else>
    <button v-for="ex in data" :key="ex.id" @click="mutate({ exId: ex.id, correct: true })">
      Try {{ ex.title ?? ex.id }}
    </button>
  </div>
  </template>
```

Notes
- Pinia reads like plain objects; no mutations/action types.
- Vue Query mirrors React Query ergonomics.

---

## Shared Patterns

Offline with Dexie
```ts
// src/services/db.ts (both stacks)
import Dexie, { Table } from 'dexie';
export interface AttemptRow { id: string; sessionId: string; payload: unknown; createdAt: number; synced: boolean }
class AppDB extends Dexie {
  attempts!: Table<AttemptRow, string>;
  constructor() {
    super('appdb');
    this.version(1).stores({ attempts: 'id, sessionId, synced' });
  }
}
export const db = new AppDB();
```

Background sync queue
```ts
export async function saveAttemptOffline(row: AttemptRow) {
  await db.attempts.put(row);
}

export async function flushAttemptsSync(submit: (row: AttemptRow) => Promise<void>) {
  const unsynced = await db.attempts.where({ synced: false }).toArray();
  for (const r of unsynced) {
    try { await submit(r); r.synced = true; await db.attempts.put(r); } catch { /* retry later */ }
  }
}
```

Invalidation rules
- Name queries by domain and parameters (e.g., `['exercises', module, difficulty]`).
- On mutation success, invalidate only affected keys (progress, session, dashboards).

i18n
- Keep translation keys by feature namespace: `exercises.play.try_button`.
- Load per-route namespaces to keep bundles small.

Testing
- Query hooks: mock fetchers; verify cache/invalidation behavior.
- Stores: call actions and assert derived outputs; avoid testing library internals.

When to add more structure
- If UI store grows beyond a few files, split by feature and document a pattern (init state, selectors, actions).
- Add ESLint rules for import boundaries to prevent store coupling.

Decision cheat-sheet
- Heavy server data? Use Query. Small UI flags/preferences? Use a tiny store.
- Avoid re-implementing cache/invalidation in a global store.
- Keep state close to the feature. Promote to shared only when needed.

---

Bottom line
- These patterns avoid Redux-style ceremony while handling offline, caching, and i18n needs.
- Choose the path that matches your team’s comfort. Both are widely used and mobile-first friendly.
