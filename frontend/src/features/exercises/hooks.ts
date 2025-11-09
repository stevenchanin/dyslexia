import { useCallback, useEffect } from 'react';
import { useExerciseUI } from './store';
import { useCreateSession, useSubmitAttempt } from './queries';
import type { ExerciseType, SubmitAttemptRequest } from '../../types/exercises';

/**
 * Hook for managing exercise session lifecycle
 * Handles session creation, state management, and cleanup
 */
export function useSession(exerciseType: ExerciseType, difficulty: number, targetRounds: number = 10) {
  const {
    activeSessionId,
    sessionState,
    roundsCompleted,
    sessionStartTime,
    pausedAt,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    incrementRound,
    resetSession,
  } = useExerciseUI();

  const createSessionMutation = useCreateSession();

  // Create session on mount if not already active
  useEffect(() => {
    if (!activeSessionId && sessionState === 'not-started' && !createSessionMutation.isPending) {
      createSessionMutation.mutate(
        { exerciseType, difficulty, targetRounds },
        {
          onSuccess: (data) => {
            startSession(data.session.id, targetRounds);
          },
        }
      );
    }
  }, [activeSessionId, sessionState, exerciseType, difficulty, targetRounds, createSessionMutation, startSession]);

  // Calculate total elapsed time
  const getElapsedTime = useCallback(() => {
    if (!sessionStartTime) return 0;
    if (pausedAt) return pausedAt - sessionStartTime;
    return Date.now() - sessionStartTime;
  }, [sessionStartTime, pausedAt]);

  // Pause handler
  const handlePause = useCallback(() => {
    if (sessionState === 'in-progress') {
      pauseSession();
    }
  }, [sessionState, pauseSession]);

  // Resume handler
  const handleResume = useCallback(() => {
    if (sessionState === 'paused') {
      resumeSession();
    }
  }, [sessionState, resumeSession]);

  // Complete handler
  const handleComplete = useCallback(() => {
    if (sessionState === 'in-progress') {
      completeSession();
    }
  }, [sessionState, completeSession]);

  // Round complete handler
  const handleRoundComplete = useCallback(() => {
    const newRoundsCompleted = roundsCompleted + 1;
    incrementRound();
    if (newRoundsCompleted >= targetRounds) {
      completeSession();
    }
  }, [roundsCompleted, targetRounds, incrementRound, completeSession]);

  return {
    sessionId: activeSessionId,
    sessionState,
    roundsCompleted,
    targetRounds,
    isLoading: createSessionMutation.isPending,
    isReady: !!activeSessionId && sessionState !== 'not-started',
    isComplete: sessionState === 'completed',
    isPaused: sessionState === 'paused',
    getElapsedTime,
    pause: handlePause,
    resume: handleResume,
    complete: handleComplete,
    roundComplete: handleRoundComplete,
    reset: resetSession,
  };
}

/**
 * Hook for logging exercise attempts with detailed metrics
 * Tracks timing, retries, and provides submission helper
 */
export function useAttemptLogger(sessionId: string | null) {
  const submitMutation = useSubmitAttempt(sessionId || '');

  // State for tracking current round attempt
  let roundStartTime: number | null = null;
  let replayCount = 0;
  let retryCount = 0;

  // Start timing for a new round
  const startRound = useCallback((roundId: string) => {
    roundStartTime = Date.now();
    replayCount = 0;
    retryCount = 0;
  }, []);

  // Track audio replay (indicates hesitation)
  const trackReplay = useCallback(() => {
    replayCount++;
  }, []);

  // Track incorrect attempt (retry)
  const trackRetry = useCallback(() => {
    retryCount++;
  }, []);

  // Submit attempt with all tracked metrics
  const submitAttempt = useCallback(
    (attempt: Omit<SubmitAttemptRequest, 'retries'>) => {
      const responseTimeMs = roundStartTime ? Date.now() - roundStartTime : 0;

      const fullAttempt: SubmitAttemptRequest = {
        ...attempt,
        responseTimeMs,
        retries: retryCount,
      };

      return submitMutation.mutateAsync(fullAttempt);
    },
    [submitMutation, retryCount]
  );

  // Get hesitation time (time spent replaying audio)
  const getHesitationTime = useCallback(() => {
    // Rough estimate: each replay adds ~2 seconds
    return replayCount * 2000;
  }, []);

  // Check if first attempt was correct
  const isFirstAttemptCorrect = useCallback(() => {
    return retryCount === 0;
  }, []);

  return {
    startRound,
    trackReplay,
    trackRetry,
    submitAttempt,
    getHesitationTime,
    isFirstAttemptCorrect,
    isSubmitting: submitMutation.isPending,
    submitError: submitMutation.error,
  };
}
