// API layer for Sound Identification exercise
import type {
  CreateSessionRequest,
  CreateSessionResponse,
  FetchRoundsResponse,
  SubmitAttemptRequest,
  SubmitAttemptResponse,
  SessionSummary,
  ExerciseType,
} from '../../types/exercises';

// Create a new exercise session
export async function createSession(
  exerciseType: ExerciseType,
  difficulty: number,
  targetRounds?: number
): Promise<CreateSessionResponse> {
  const body: CreateSessionRequest = {
    exerciseType,
    difficulty,
    targetRounds,
  };

  const res = await fetch('/api/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Failed to create session: ${res.statusText}`);
  }

  return res.json();
}

// Fetch rounds for a session
export async function fetchRounds(sessionId: string): Promise<FetchRoundsResponse> {
  const res = await fetch(`/api/sessions/${sessionId}/rounds`);

  if (!res.ok) {
    throw new Error(`Failed to fetch rounds: ${res.statusText}`);
  }

  return res.json();
}

// Submit an attempt for a round
export async function submitAttempt(
  sessionId: string,
  attempt: SubmitAttemptRequest
): Promise<SubmitAttemptResponse> {
  const res = await fetch(`/api/sessions/${sessionId}/attempts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(attempt),
  });

  if (!res.ok) {
    throw new Error(`Failed to submit attempt: ${res.statusText}`);
  }

  return res.json();
}

// Get session summary
export async function getSessionSummary(sessionId: string): Promise<SessionSummary> {
  const res = await fetch(`/api/sessions/${sessionId}/summary`);

  if (!res.ok) {
    throw new Error(`Failed to fetch session summary: ${res.statusText}`);
  }

  return res.json();
}

