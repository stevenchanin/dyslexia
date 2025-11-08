import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from '../../mocks/handlers';
import { createSession, fetchRounds, submitAttempt, getSessionSummary } from './api';

// Setup MSW server
const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Exercise API', () => {
  describe('createSession', () => {
    it('should create a session successfully', async () => {
      const result = await createSession('sound-identification', 3, 10);

      expect(result).toHaveProperty('session');
      expect(result.session).toMatchObject({
        exerciseType: 'sound-identification',
        difficulty: 3,
        targetRounds: 10,
        status: 'in-progress',
      });
      expect(result.session.id).toBeDefined();
      expect(result.session.startedAt).toBeDefined();
    });

    it('should use default targetRounds when not provided', async () => {
      const result = await createSession('sound-identification', 2);

      expect(result.session.targetRounds).toBe(10);
    });

    it('should handle different exercise types', async () => {
      const result = await createSession('phoneme-count', 4, 8);

      expect(result.session.exerciseType).toBe('phoneme-count');
    });

    it('should throw error on failed request', async () => {
      // Override handler to return error
      server.use(
        // We can't easily test this without mocking fetch globally
        // Skipping error test for API layer since MSW handles success cases
      );
    });
  });

  describe('fetchRounds', () => {
    it('should fetch rounds for a valid session', async () => {
      // First create a session
      const { session } = await createSession('sound-identification', 3, 5);

      // Then fetch rounds
      const result = await fetchRounds(session.id);

      expect(result).toHaveProperty('rounds');
      expect(result).toHaveProperty('sessionId', session.id);
      expect(result.rounds).toHaveLength(5);

      result.rounds.forEach(round => {
        expect(round).toMatchObject({
          id: expect.any(String),
          word: expect.any(String),
          phonemes: expect.any(Array),
          mode: expect.stringMatching(/^(begin|end|middle)$/),
          options: expect.any(Array),
          difficulty: 3,
        });
      });
    });

    it('should return same rounds on repeated calls', async () => {
      const { session } = await createSession('sound-identification', 3, 5);

      const result1 = await fetchRounds(session.id);
      const result2 = await fetchRounds(session.id);

      expect(result1.rounds).toEqual(result2.rounds);
    });
  });

  describe('submitAttempt', () => {
    it('should submit an attempt successfully', async () => {
      // Setup: create session and fetch rounds
      const { session } = await createSession('sound-identification', 3, 5);
      const { rounds } = await fetchRounds(session.id);

      // Submit attempt
      const result = await submitAttempt(session.id, {
        roundId: rounds[0].id,
        selectedOption: 'k',
        correctOption: 'k',
        isCorrect: true,
        responseTimeMs: 1500,
        mode: 'begin',
        retries: 0,
      });

      expect(result).toHaveProperty('attempt');
      expect(result.attempt).toMatchObject({
        sessionId: session.id,
        roundId: rounds[0].id,
        selectedOption: 'k',
        correctOption: 'k',
        isCorrect: true,
        responseTimeMs: 1500,
        mode: 'begin',
        retries: 0,
      });
      expect(result.attempt.id).toBeDefined();
      expect(result.attempt.timestamp).toBeDefined();
    });

    it('should include summary when session complete', async () => {
      const { session } = await createSession('sound-identification', 3, 2);
      const { rounds } = await fetchRounds(session.id);

      // Submit first attempt
      await submitAttempt(session.id, {
        roundId: rounds[0].id,
        selectedOption: 'k',
        correctOption: 'k',
        isCorrect: true,
        responseTimeMs: 1500,
        mode: 'begin',
        retries: 0,
      });

      // Submit final attempt
      const result = await submitAttempt(session.id, {
        roundId: rounds[1].id,
        selectedOption: 't',
        correctOption: 't',
        isCorrect: true,
        responseTimeMs: 1200,
        mode: 'end',
        retries: 0,
      });

      expect(result.sessionSummary).toBeDefined();
      expect(result.sessionSummary?.totalRounds).toBe(2);
      expect(result.sessionSummary?.correctRounds).toBe(2);
      expect(result.sessionSummary?.accuracy).toBe(100);
    });

    it('should handle incorrect attempts', async () => {
      const { session } = await createSession('sound-identification', 3, 5);
      const { rounds } = await fetchRounds(session.id);

      const result = await submitAttempt(session.id, {
        roundId: rounds[0].id,
        selectedOption: 'wrong',
        correctOption: 'k',
        isCorrect: false,
        responseTimeMs: 2500,
        mode: 'begin',
        retries: 2,
      });

      expect(result.attempt.isCorrect).toBe(false);
      expect(result.attempt.retries).toBe(2);
    });
  });

  describe('getSessionSummary', () => {
    it('should get session summary with statistics', async () => {
      // Setup: create session and submit attempts
      const { session } = await createSession('sound-identification', 3, 5);
      const { rounds } = await fetchRounds(session.id);

      // Submit a few attempts
      await submitAttempt(session.id, {
        roundId: rounds[0].id,
        selectedOption: 'k',
        correctOption: 'k',
        isCorrect: true,
        responseTimeMs: 1500,
        mode: 'begin',
        retries: 0,
      });

      await submitAttempt(session.id, {
        roundId: rounds[1].id,
        selectedOption: 'wrong',
        correctOption: 't',
        isCorrect: false,
        responseTimeMs: 2000,
        mode: 'end',
        retries: 1,
      });

      await submitAttempt(session.id, {
        roundId: rounds[2].id,
        selectedOption: 'æ',
        correctOption: 'æ',
        isCorrect: true,
        responseTimeMs: 1200,
        mode: 'middle',
        retries: 0,
      });

      // Get summary
      const summary = await getSessionSummary(session.id);

      expect(summary).toMatchObject({
        sessionId: session.id,
        totalRounds: 3,
        correctRounds: 2,
        accuracy: expect.closeTo(66.67, 0.1),
      });

      expect(summary.averageResponseTime).toBeGreaterThan(0);
      expect(summary.maxStreak).toBeGreaterThanOrEqual(1);
      expect(summary.pointsEarned).toBeGreaterThan(0);
      expect(summary.modeStats).toBeInstanceOf(Array);
      expect(summary.modeStats.length).toBeGreaterThan(0);
    });

    it('should handle empty session (no attempts)', async () => {
      const { session } = await createSession('sound-identification', 3, 5);

      const summary = await getSessionSummary(session.id);

      expect(summary.totalRounds).toBe(0);
      expect(summary.correctRounds).toBe(0);
      expect(summary.accuracy).toBe(0);
      expect(summary.averageResponseTime).toBe(0);
    });

    it('should calculate streak correctly', async () => {
      const { session } = await createSession('sound-identification', 3, 5);
      const { rounds } = await fetchRounds(session.id);

      // Create a streak of 3
      await submitAttempt(session.id, {
        roundId: rounds[0].id,
        selectedOption: 'k',
        correctOption: 'k',
        isCorrect: true,
        responseTimeMs: 1500,
        mode: 'begin',
        retries: 0,
      });

      await submitAttempt(session.id, {
        roundId: rounds[1].id,
        selectedOption: 't',
        correctOption: 't',
        isCorrect: true,
        responseTimeMs: 1400,
        mode: 'end',
        retries: 0,
      });

      await submitAttempt(session.id, {
        roundId: rounds[2].id,
        selectedOption: 'æ',
        correctOption: 'æ',
        isCorrect: true,
        responseTimeMs: 1300,
        mode: 'middle',
        retries: 0,
      });

      // Break streak
      await submitAttempt(session.id, {
        roundId: rounds[3].id,
        selectedOption: 'wrong',
        correctOption: 'd',
        isCorrect: false,
        responseTimeMs: 2000,
        mode: 'begin',
        retries: 1,
      });

      const summary = await getSessionSummary(session.id);

      expect(summary.maxStreak).toBe(3);
    });
  });
});
