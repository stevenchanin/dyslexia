import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
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

// Create handlers with absolute URLs for testing
const BASE_URL = 'http://localhost';
const sessions = new Map<string, Session>();
const attempts = new Map<string, Attempt[]>();

const testHandlers = [
  http.post(`${BASE_URL}/api/sessions`, async ({ request }) => {
    const body = (await request.json()) as CreateSessionRequest;
    const session: Session = {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      studentId: 'student-mock',
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

  http.get(`${BASE_URL}/api/sessions/:sessionId/rounds`, ({ params }) => {
    const { sessionId } = params;
    const session = sessions.get(sessionId as string);
    if (!session) return new HttpResponse(null, { status: 404 });
    const rounds = getRoundsForSession(session.id, session.difficulty, session.targetRounds);
    const response: FetchRoundsResponse = { rounds, sessionId: session.id };
    return HttpResponse.json(response);
  }),

  http.post(`${BASE_URL}/api/sessions/:sessionId/attempts`, async ({ params, request }) => {
    const { sessionId } = params;
    const body = (await request.json()) as SubmitAttemptRequest;
    const session = sessions.get(sessionId as string);
    if (!session) return new HttpResponse(null, { status: 404 });
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
    let sessionSummary: SessionSummary | undefined;
    if (sessionAttempts.length >= session.targetRounds) {
      session.status = 'completed';
      session.completedAt = new Date().toISOString();
      sessions.set(session.id, session);
      sessionSummary = calculateSessionSummary(session.id, sessionAttempts);
    }
    const response: SubmitAttemptResponse = { attempt, sessionSummary };
    return HttpResponse.json(response);
  }),

  http.get(`${BASE_URL}/api/sessions/:sessionId/summary`, ({ params }) => {
    const { sessionId } = params;
    const session = sessions.get(sessionId as string);
    if (!session) return new HttpResponse(null, { status: 404 });
    const sessionAttempts = attempts.get(session.id) || [];
    const summary = calculateSessionSummary(session.id, sessionAttempts);
    return HttpResponse.json(summary);
  }),
];

function calculateSessionSummary(sessionId: string, sessionAttempts: Attempt[]): SessionSummary {
  const totalRounds = sessionAttempts.length;
  const correctRounds = sessionAttempts.filter(a => a.isCorrect).length;
  const accuracy = totalRounds > 0 ? (correctRounds / totalRounds) * 100 : 0;
  const totalResponseTime = sessionAttempts.reduce((sum, a) => sum + a.responseTimeMs, 0);
  const averageResponseTime = totalRounds > 0 ? totalResponseTime / totalRounds : 0;
  const modeGroups = new Map<SoundMode, { attempted: number; correct: number }>();
  sessionAttempts.forEach(attempt => {
    const existing = modeGroups.get(attempt.mode) || { attempted: 0, correct: 0 };
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
  const pointsEarned = correctRounds * 5 + (maxStreak >= 3 ? maxStreak * 2 : 0);
  return { sessionId, totalRounds, correctRounds, accuracy, averageResponseTime, modeStats, pointsEarned, maxStreak };
}

// Setup MSW server for testing
const server = setupServer(...testHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  sessions.clear();
  attempts.clear();
});
afterAll(() => server.close());

describe('MSW API Handlers', () => {
  describe('POST /api/sessions', () => {
    it('should create a new session with correct structure', async () => {
      const response = await fetch('http://localhost/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseType: 'sound-identification',
          difficulty: 3,
          targetRounds: 10,
        }),
      });

      expect(response.ok).toBe(true);

      const data = await response.json();

      expect(data).toHaveProperty('session');
      expect(data.session).toHaveProperty('id');
      expect(data.session).toHaveProperty('studentId');
      expect(data.session.exerciseType).toBe('sound-identification');
      expect(data.session.difficulty).toBe(3);
      expect(data.session.targetRounds).toBe(10);
      expect(data.session.status).toBe('in-progress');
      expect(data.session).toHaveProperty('startedAt');
    });

    it('should generate unique session IDs', async () => {
      const response1 = await fetch('http://localhost/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseType: 'sound-identification',
          difficulty: 2,
        }),
      });

      const response2 = await fetch('http://localhost/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseType: 'sound-identification',
          difficulty: 2,
        }),
      });

      const data1 = await response1.json();
      const data2 = await response2.json();

      expect(data1.session.id).not.toBe(data2.session.id);
    });

    it('should use default targetRounds if not provided', async () => {
      const response = await fetch('http://localhost/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseType: 'sound-identification',
          difficulty: 2,
        }),
      });

      const data = await response.json();

      expect(data.session.targetRounds).toBe(10);
    });
  });

  describe('GET /api/sessions/:sessionId/rounds', () => {
    it('should return rounds for a valid session', async () => {
      // First create a session
      const createResponse = await fetch('http://localhost/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseType: 'sound-identification',
          difficulty: 3,
          targetRounds: 5,
        }),
      });

      const { session } = await createResponse.json();

      // Then fetch rounds
      const roundsResponse = await fetch(
        `http://localhost/api/sessions/${session.id}/rounds`
      );

      expect(roundsResponse.ok).toBe(true);

      const roundsData = await roundsResponse.json();

      expect(roundsData).toHaveProperty('rounds');
      expect(roundsData).toHaveProperty('sessionId', session.id);
      expect(roundsData.rounds).toHaveLength(5);

      roundsData.rounds.forEach((round: any) => {
        expect(round).toHaveProperty('id');
        expect(round).toHaveProperty('word');
        expect(round).toHaveProperty('phonemes');
        expect(round).toHaveProperty('mode');
        expect(round).toHaveProperty('options');
        expect(round).toHaveProperty('difficulty');
      });
    });

    it('should return 404 for non-existent session', async () => {
      const response = await fetch(
        'http://localhost/api/sessions/non-existent-id/rounds'
      );

      expect(response.status).toBe(404);
    });

    it('should return consistent rounds for same session', async () => {
      // Create session
      const createResponse = await fetch('http://localhost/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseType: 'sound-identification',
          difficulty: 3,
          targetRounds: 5,
        }),
      });

      const { session } = await createResponse.json();

      // Fetch rounds twice
      const roundsResponse1 = await fetch(
        `http://localhost/api/sessions/${session.id}/rounds`
      );
      const roundsResponse2 = await fetch(
        `http://localhost/api/sessions/${session.id}/rounds`
      );

      const roundsData1 = await roundsResponse1.json();
      const roundsData2 = await roundsResponse2.json();

      expect(roundsData1.rounds).toEqual(roundsData2.rounds);
    });
  });

  describe('POST /api/sessions/:sessionId/attempts', () => {
    it('should accept and store attempts', async () => {
      // Create session and fetch rounds
      const createResponse = await fetch('http://localhost/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseType: 'sound-identification',
          difficulty: 3,
          targetRounds: 5,
        }),
      });

      const { session } = await createResponse.json();

      const roundsResponse = await fetch(
        `http://localhost/api/sessions/${session.id}/rounds`
      );
      const { rounds } = await roundsResponse.json();

      // Submit attempt
      const attemptResponse = await fetch(
        `http://localhost/api/sessions/${session.id}/attempts`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roundId: rounds[0].id,
            selectedOption: 'k',
            correctOption: 'k',
            isCorrect: true,
            responseTimeMs: 1500,
            mode: 'begin',
            retries: 0,
          }),
        }
      );

      expect(attemptResponse.ok).toBe(true);

      const attemptData = await attemptResponse.json();

      expect(attemptData).toHaveProperty('attempt');
      expect(attemptData.attempt).toHaveProperty('id');
      expect(attemptData.attempt.sessionId).toBe(session.id);
      expect(attemptData.attempt.roundId).toBe(rounds[0].id);
      expect(attemptData.attempt.isCorrect).toBe(true);
      expect(attemptData.attempt.responseTimeMs).toBe(1500);
    });

    it('should return 404 for non-existent session', async () => {
      const response = await fetch(
        'http://localhost/api/sessions/non-existent-id/attempts',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roundId: 'round-1',
            selectedOption: 'k',
            correctOption: 'k',
            isCorrect: true,
            responseTimeMs: 1500,
            mode: 'begin',
            retries: 0,
          }),
        }
      );

      expect(response.status).toBe(404);
    });

    it('should include session summary when session complete', async () => {
      // Create session
      const createResponse = await fetch('http://localhost/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseType: 'sound-identification',
          difficulty: 3,
          targetRounds: 2,
        }),
      });

      const { session } = await createResponse.json();

      const roundsResponse = await fetch(
        `http://localhost/api/sessions/${session.id}/rounds`
      );
      const { rounds } = await roundsResponse.json();

      // Submit first attempt
      await fetch(`http://localhost/api/sessions/${session.id}/attempts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roundId: rounds[0].id,
          selectedOption: 'k',
          correctOption: 'k',
          isCorrect: true,
          responseTimeMs: 1500,
          mode: 'begin',
          retries: 0,
        }),
      });

      // Submit second (final) attempt
      const finalResponse = await fetch(
        `http://localhost/api/sessions/${session.id}/attempts`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roundId: rounds[1].id,
            selectedOption: 't',
            correctOption: 't',
            isCorrect: true,
            responseTimeMs: 1200,
            mode: 'end',
            retries: 0,
          }),
        }
      );

      const finalData = await finalResponse.json();

      expect(finalData).toHaveProperty('sessionSummary');
      expect(finalData.sessionSummary.totalRounds).toBe(2);
      expect(finalData.sessionSummary.correctRounds).toBe(2);
      expect(finalData.sessionSummary.accuracy).toBe(100);
    });
  });

  describe('GET /api/sessions/:sessionId/summary', () => {
    it('should calculate session summary correctly', async () => {
      // Create session
      const createResponse = await fetch('http://localhost/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseType: 'sound-identification',
          difficulty: 3,
          targetRounds: 5,
        }),
      });

      const { session } = await createResponse.json();

      const roundsResponse = await fetch(
        `http://localhost/api/sessions/${session.id}/rounds`
      );
      const { rounds } = await roundsResponse.json();

      // Submit multiple attempts
      await fetch(`http://localhost/api/sessions/${session.id}/attempts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roundId: rounds[0].id,
          selectedOption: 'k',
          correctOption: 'k',
          isCorrect: true,
          responseTimeMs: 1500,
          mode: 'begin',
          retries: 0,
        }),
      });

      await fetch(`http://localhost/api/sessions/${session.id}/attempts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roundId: rounds[1].id,
          selectedOption: 'wrong',
          correctOption: 't',
          isCorrect: false,
          responseTimeMs: 2000,
          mode: 'end',
          retries: 1,
        }),
      });

      // Get summary
      const summaryResponse = await fetch(
        `http://localhost/api/sessions/${session.id}/summary`
      );

      const summary = await summaryResponse.json();

      expect(summary.totalRounds).toBe(2);
      expect(summary.correctRounds).toBe(1);
      expect(summary.accuracy).toBe(50);
      expect(summary.averageResponseTime).toBe(1750); // (1500 + 2000) / 2
      expect(summary.maxStreak).toBe(1);
      expect(summary).toHaveProperty('pointsEarned');
      expect(summary).toHaveProperty('modeStats');
    });

    it('should return 404 for non-existent session', async () => {
      const response = await fetch(
        'http://localhost/api/sessions/non-existent-id/summary'
      );

      expect(response.status).toBe(404);
    });

    it('should calculate mode-specific statistics', async () => {
      // Create session with attempts
      const createResponse = await fetch('http://localhost/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseType: 'sound-identification',
          difficulty: 3,
          targetRounds: 5,
        }),
      });

      const { session } = await createResponse.json();

      const roundsResponse = await fetch(
        `http://localhost/api/sessions/${session.id}/rounds`
      );
      const { rounds } = await roundsResponse.json();

      // Submit attempts with different modes
      await fetch(`http://localhost/api/sessions/${session.id}/attempts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roundId: rounds[0].id,
          selectedOption: 'k',
          correctOption: 'k',
          isCorrect: true,
          responseTimeMs: 1500,
          mode: 'begin',
          retries: 0,
        }),
      });

      await fetch(`http://localhost/api/sessions/${session.id}/attempts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roundId: rounds[1].id,
          selectedOption: 't',
          correctOption: 't',
          isCorrect: true,
          responseTimeMs: 1200,
          mode: 'end',
          retries: 0,
        }),
      });

      const summaryResponse = await fetch(
        `http://localhost/api/sessions/${session.id}/summary`
      );

      const summary = await summaryResponse.json();

      expect(summary.modeStats).toBeInstanceOf(Array);
      expect(summary.modeStats.length).toBeGreaterThan(0);

      summary.modeStats.forEach((stat: any) => {
        expect(stat).toHaveProperty('mode');
        expect(stat).toHaveProperty('attempted');
        expect(stat).toHaveProperty('correct');
        expect(stat).toHaveProperty('accuracy');
      });
    });
  });
});
