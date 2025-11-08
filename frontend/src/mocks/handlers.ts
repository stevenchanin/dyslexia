import { http, HttpResponse } from 'msw';
import type {
  Session,
  Attempt,
  CreateSessionRequest,
  CreateSessionResponse,
  FetchRoundsResponse,
  SubmitAttemptRequest,
  SubmitAttemptResponse,
  SessionSummary,
  SoundMode,
} from '../types/exercises';
import { getRoundsForSession } from './roundGenerator';

// In-memory storage for mock data
const sessions = new Map<string, Session>();
const attempts = new Map<string, Attempt[]>();

export const handlers = [
  // Create a new session
  http.post('/api/sessions', async ({ request }) => {
    const body = (await request.json()) as CreateSessionRequest;

    const session: Session = {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      studentId: 'student-mock', // TODO: get from auth context
      exerciseType: body.exerciseType,
      difficulty: body.difficulty,
      targetRounds: body.targetRounds || 10,
      startedAt: new Date().toISOString(),
      status: 'in-progress',
    };

    sessions.set(session.id, session);
    attempts.set(session.id, []);

    const response: CreateSessionResponse = { session };
    return HttpResponse.json(response);
  }),

  // Fetch rounds for a session
  http.get('/api/sessions/:sessionId/rounds', ({ params }) => {
    const { sessionId } = params;
    const session = sessions.get(sessionId as string);

    if (!session) {
      return new HttpResponse(null, { status: 404 });
    }

    const rounds = getRoundsForSession(
      session.id,
      session.difficulty,
      session.targetRounds
    );

    const response: FetchRoundsResponse = {
      rounds,
      sessionId: session.id,
    };

    return HttpResponse.json(response);
  }),

  // Submit an attempt
  http.post('/api/sessions/:sessionId/attempts', async ({ params, request }) => {
    const { sessionId } = params;
    const body = (await request.json()) as SubmitAttemptRequest;
    const session = sessions.get(sessionId as string);

    if (!session) {
      return new HttpResponse(null, { status: 404 });
    }

    const attempt: Attempt = {
      id: `attempt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sessionId: session.id,
      roundId: body.roundId,
      selectedOption: body.selectedOption,
      correctOption: body.correctOption,
      isCorrect: body.isCorrect,
      responseTimeMs: body.responseTimeMs,
      mode: body.mode,
      retries: body.retries,
      timestamp: new Date().toISOString(),
    };

    const sessionAttempts = attempts.get(session.id) || [];
    sessionAttempts.push(attempt);
    attempts.set(session.id, sessionAttempts);

    // Check if session is complete
    let sessionSummary: SessionSummary | undefined;
    if (sessionAttempts.length >= session.targetRounds) {
      session.status = 'completed';
      session.completedAt = new Date().toISOString();
      sessions.set(session.id, session);

      sessionSummary = calculateSessionSummary(session.id, sessionAttempts);
    }

    const response: SubmitAttemptResponse = {
      attempt,
      sessionSummary,
    };

    return HttpResponse.json(response);
  }),

  // Get session summary
  http.get('/api/sessions/:sessionId/summary', ({ params }) => {
    const { sessionId } = params;
    const session = sessions.get(sessionId as string);

    if (!session) {
      return new HttpResponse(null, { status: 404 });
    }

    const sessionAttempts = attempts.get(session.id) || [];
    const summary = calculateSessionSummary(session.id, sessionAttempts);

    return HttpResponse.json(summary);
  }),
];

function calculateSessionSummary(
  sessionId: string,
  sessionAttempts: Attempt[]
): SessionSummary {
  const totalRounds = sessionAttempts.length;
  const correctRounds = sessionAttempts.filter(a => a.isCorrect).length;
  const accuracy = totalRounds > 0 ? (correctRounds / totalRounds) * 100 : 0;

  const totalResponseTime = sessionAttempts.reduce(
    (sum, a) => sum + a.responseTimeMs,
    0
  );
  const averageResponseTime =
    totalRounds > 0 ? totalResponseTime / totalRounds : 0;

  // Calculate mode-specific stats
  const modeGroups = new Map<
    SoundMode,
    { attempted: number; correct: number }
  >();

  sessionAttempts.forEach(attempt => {
    const existing = modeGroups.get(attempt.mode) || {
      attempted: 0,
      correct: 0,
    };
    existing.attempted++;
    if (attempt.isCorrect) existing.correct++;
    modeGroups.set(attempt.mode, existing);
  });

  const modeStats = Array.from(modeGroups.entries()).map(([mode, stats]) => ({
    mode,
    attempted: stats.attempted,
    correct: stats.correct,
    accuracy: stats.attempted > 0 ? (stats.correct / stats.attempted) * 100 : 0,
  }));

  // Calculate streak
  let currentStreak = 0;
  let maxStreak = 0;
  sessionAttempts.forEach(attempt => {
    if (attempt.isCorrect) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });

  // Simple points: 5 per correct, 10 bonus for streak > 3
  const pointsEarned =
    correctRounds * 5 + (maxStreak >= 3 ? maxStreak * 2 : 0);

  return {
    sessionId,
    totalRounds,
    correctRounds,
    accuracy,
    averageResponseTime,
    modeStats,
    pointsEarned,
    maxStreak,
  };
}
