import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { handlers } from '../../mocks/handlers';
import { useSession, useAttemptLogger } from './hooks';
import { useExerciseUI } from './store';
import * as React from 'react';

// Setup MSW server
const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Helper to render hook with providers
function renderWithProviders<T>(hook: () => T) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  return renderHook(hook, { wrapper });
}

describe('useSession', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useExerciseUI());
    act(() => {
      result.current.resetSession();
    });
  });

  it('should create a session on mount', async () => {
    const { result } = renderWithProviders(() =>
      useSession('sound-identification', 3, 10)
    );

    // Initially not ready (session creation happens in useEffect)
    expect(result.current.isReady).toBe(false);

    // Wait for session creation
    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    }, { timeout: 3000 });

    expect(result.current.sessionId).toBeTruthy();
    expect(result.current.sessionState).toBe('in-progress');
    expect(result.current.roundsCompleted).toBe(0);
    expect(result.current.targetRounds).toBe(10);
  });

  it('should pause and resume a session', async () => {
    const { result } = renderWithProviders(() =>
      useSession('sound-identification', 3, 10)
    );

    // Wait for session to be ready
    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    }, { timeout: 3000 });

    // Pause
    act(() => {
      result.current.pause();
    });

    expect(result.current.isPaused).toBe(true);
    expect(result.current.sessionState).toBe('paused');

    // Resume
    act(() => {
      result.current.resume();
    });

    expect(result.current.isPaused).toBe(false);
    expect(result.current.sessionState).toBe('in-progress');
  });

  it('should complete a session', async () => {
    const { result } = renderWithProviders(() =>
      useSession('sound-identification', 3, 10)
    );

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    }, { timeout: 3000 });

    act(() => {
      result.current.complete();
    });

    expect(result.current.isComplete).toBe(true);
    expect(result.current.sessionState).toBe('completed');
  });

  it('should track round completion', async () => {
    const { result } = renderWithProviders(() =>
      useSession('sound-identification', 3, 3)
    );

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    }, { timeout: 3000 });

    expect(result.current.roundsCompleted).toBe(0);

    // Complete round 1
    act(() => {
      result.current.roundComplete();
    });

    expect(result.current.roundsCompleted).toBe(1);

    // Complete round 2
    act(() => {
      result.current.roundComplete();
    });

    expect(result.current.roundsCompleted).toBe(2);
  });

  it('should auto-complete when target rounds reached', async () => {
    const { result } = renderWithProviders(() =>
      useSession('sound-identification', 3, 3)
    );

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    }, { timeout: 3000 });

    // Complete rounds one at a time to allow state updates
    act(() => {
      result.current.roundComplete();
    });

    expect(result.current.roundsCompleted).toBe(1);

    act(() => {
      result.current.roundComplete();
    });

    expect(result.current.roundsCompleted).toBe(2);

    act(() => {
      result.current.roundComplete();
    });

    expect(result.current.roundsCompleted).toBe(3);
    expect(result.current.isComplete).toBe(true);
    expect(result.current.sessionState).toBe('completed');
  });

  it('should calculate elapsed time correctly', async () => {
    const { result } = renderWithProviders(() =>
      useSession('sound-identification', 3, 10)
    );

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    }, { timeout: 3000 });

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 100));

    const elapsed = result.current.getElapsedTime();
    expect(elapsed).toBeGreaterThan(0);
  });

  it('should freeze elapsed time when paused', async () => {
    const { result } = renderWithProviders(() =>
      useSession('sound-identification', 3, 10)
    );

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    }, { timeout: 3000 });

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 100));

    // Pause
    act(() => {
      result.current.pause();
    });

    const pausedTime = result.current.getElapsedTime();

    // Wait more
    await new Promise(resolve => setTimeout(resolve, 100));

    // Time should be frozen
    const stillPausedTime = result.current.getElapsedTime();
    expect(stillPausedTime).toBe(pausedTime);
  });

  it('should reset session', async () => {
    const { result } = renderWithProviders(() =>
      useSession('sound-identification', 3, 10)
    );

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    }, { timeout: 3000 });

    act(() => {
      result.current.roundComplete();
      result.current.roundComplete();
    });

    expect(result.current.roundsCompleted).toBe(2);

    act(() => {
      result.current.reset();
    });

    expect(result.current.sessionId).toBeNull();
    expect(result.current.sessionState).toBe('not-started');
    expect(result.current.roundsCompleted).toBe(0);
  });
});

describe('useAttemptLogger', () => {
  it('should start tracking a round', () => {
    const { result } = renderWithProviders(() =>
      useAttemptLogger('session-123')
    );

    act(() => {
      result.current.startRound('round-1');
    });

    // Should not throw
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should track replays', () => {
    const { result } = renderWithProviders(() =>
      useAttemptLogger('session-123')
    );

    act(() => {
      result.current.startRound('round-1');
      result.current.trackReplay();
      result.current.trackReplay();
    });

    const hesitation = result.current.getHesitationTime();
    expect(hesitation).toBe(4000); // 2 replays * 2000ms
  });

  it('should track retries', () => {
    const { result } = renderWithProviders(() =>
      useAttemptLogger('session-123')
    );

    act(() => {
      result.current.startRound('round-1');
    });

    expect(result.current.isFirstAttemptCorrect()).toBe(true);

    act(() => {
      result.current.trackRetry();
    });

    expect(result.current.isFirstAttemptCorrect()).toBe(false);
  });

  it('should submit attempt with metrics', async () => {
    // First create a session and get rounds
    const { createSession, fetchRounds } = await import('./api');
    const { session } = await createSession('sound-identification', 3, 5);
    const { rounds } = await fetchRounds(session.id);

    const { result } = renderWithProviders(() =>
      useAttemptLogger(session.id)
    );

    act(() => {
      result.current.startRound(rounds[0].id);
    });

    // Wait a bit for time to pass
    await new Promise(resolve => setTimeout(resolve, 50));

    act(() => {
      result.current.trackRetry();
    });

    let response: any;
    await act(async () => {
      response = await result.current.submitAttempt({
        roundId: rounds[0].id,
        selectedOption: 'k',
        correctOption: 't',
        isCorrect: false,
        mode: 'begin',
        responseTimeMs: 0, // Will be overridden
      });
    });

    expect(response.attempt).toBeDefined();
    expect(response.attempt.retries).toBe(1);
    expect(response.attempt.responseTimeMs).toBeGreaterThan(0);
  });

  it('should handle null sessionId gracefully', () => {
    const { result } = renderWithProviders(() =>
      useAttemptLogger(null)
    );

    act(() => {
      result.current.startRound('round-1');
    });

    // Should not throw
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should reset metrics on new round', () => {
    const { result } = renderWithProviders(() =>
      useAttemptLogger('session-123')
    );

    act(() => {
      result.current.startRound('round-1');
      result.current.trackReplay();
      result.current.trackRetry();
    });

    expect(result.current.getHesitationTime()).toBe(2000);
    expect(result.current.isFirstAttemptCorrect()).toBe(false);

    // Start new round
    act(() => {
      result.current.startRound('round-2');
    });

    // Metrics should be reset
    expect(result.current.getHesitationTime()).toBe(0);
    expect(result.current.isFirstAttemptCorrect()).toBe(true);
  });
});
