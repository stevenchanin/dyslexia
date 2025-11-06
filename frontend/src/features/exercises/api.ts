// Minimal typed fetchers for exercises (example only)
// This illustrates the React pattern documented in STATE_PATTERNS.md
export type Exercise = {
  id: string;
  module: string;
  difficulty: number;
  title?: string;
  content: unknown;
};

export async function fetchExercises(module: string, difficulty: number): Promise<Exercise[]> {
  // Placeholder implementation
  const res = await fetch(`/api/exercises?module=${module}&difficulty=${difficulty}`);
  if (!res.ok) throw new Error('Failed to fetch exercises');
  return (await res.json()) as Exercise[];
}

export async function submitAttempt(sessionId: string, payload: unknown) {
  const res = await fetch(`/api/sessions/${sessionId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Submit failed');
  return res.json();
}

