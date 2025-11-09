import { describe, it, expect, beforeEach } from 'vitest';
import { useExerciseUI } from './store';
import { act, renderHook } from '@testing-library/react';

describe('Exercise UI Store', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    const { result } = renderHook(() => useExerciseUI());
    act(() => {
      result.current.resetSession();
    });
  });

  describe('UI Preferences', () => {
    it('should have default UI preferences', () => {
      const { result } = renderHook(() => useExerciseUI());

      expect(result.current.lowBandwidth).toBe(false);
      expect(result.current.ttsRate).toBe(1.0);
      expect(result.current.currentDifficulty).toBe(2);
    });

    it('should update low bandwidth setting', () => {
      const { result } = renderHook(() => useExerciseUI());

      act(() => {
        result.current.setLowBandwidth(true);
      });

      expect(result.current.lowBandwidth).toBe(true);
    });

    it('should update TTS rate', () => {
      const { result } = renderHook(() => useExerciseUI());

      act(() => {
        result.current.setTtsRate(1.5);
      });

      expect(result.current.ttsRate).toBe(1.5);
    });

    it('should update difficulty', () => {
      const { result } = renderHook(() => useExerciseUI());

      act(() => {
        result.current.setDifficulty(5);
      });

      expect(result.current.currentDifficulty).toBe(5);
    });
  });

  describe('Session State', () => {
    it('should have default session state', () => {
      const { result } = renderHook(() => useExerciseUI());

      expect(result.current.activeSessionId).toBeNull();
      expect(result.current.sessionState).toBe('not-started');
      expect(result.current.roundsCompleted).toBe(0);
      expect(result.current.targetRounds).toBe(10);
      expect(result.current.sessionStartTime).toBeNull();
      expect(result.current.pausedAt).toBeNull();
    });

    it('should start a session', () => {
      const { result } = renderHook(() => useExerciseUI());
      const sessionId = 'test-session-123';
      const targetRounds = 15;

      act(() => {
        result.current.startSession(sessionId, targetRounds);
      });

      expect(result.current.activeSessionId).toBe(sessionId);
      expect(result.current.sessionState).toBe('in-progress');
      expect(result.current.targetRounds).toBe(targetRounds);
      expect(result.current.roundsCompleted).toBe(0);
      expect(result.current.sessionStartTime).toBeGreaterThan(0);
      expect(result.current.pausedAt).toBeNull();
    });

    it('should pause a session', () => {
      const { result } = renderHook(() => useExerciseUI());

      act(() => {
        result.current.startSession('session-1', 10);
      });

      act(() => {
        result.current.pauseSession();
      });

      expect(result.current.sessionState).toBe('paused');
      expect(result.current.pausedAt).toBeGreaterThan(0);
    });

    it('should resume a session', () => {
      const { result } = renderHook(() => useExerciseUI());

      act(() => {
        result.current.startSession('session-1', 10);
      });

      act(() => {
        result.current.pauseSession();
      });

      act(() => {
        result.current.resumeSession();
      });

      expect(result.current.sessionState).toBe('in-progress');
      expect(result.current.pausedAt).toBeNull();
    });

    it('should complete a session', () => {
      const { result } = renderHook(() => useExerciseUI());

      act(() => {
        result.current.startSession('session-1', 10);
      });

      act(() => {
        result.current.completeSession();
      });

      expect(result.current.sessionState).toBe('completed');
    });

    it('should increment rounds completed', () => {
      const { result } = renderHook(() => useExerciseUI());

      act(() => {
        result.current.startSession('session-1', 10);
      });

      act(() => {
        result.current.incrementRound();
      });

      expect(result.current.roundsCompleted).toBe(1);

      act(() => {
        result.current.incrementRound();
      });

      expect(result.current.roundsCompleted).toBe(2);
    });

    it('should reset session to initial state', () => {
      const { result } = renderHook(() => useExerciseUI());

      act(() => {
        result.current.startSession('session-1', 10);
        result.current.incrementRound();
        result.current.incrementRound();
      });

      act(() => {
        result.current.resetSession();
      });

      expect(result.current.activeSessionId).toBeNull();
      expect(result.current.sessionState).toBe('not-started');
      expect(result.current.roundsCompleted).toBe(0);
      expect(result.current.targetRounds).toBe(10);
      expect(result.current.sessionStartTime).toBeNull();
      expect(result.current.pausedAt).toBeNull();
    });
  });

  describe('Session Lifecycle', () => {
    it('should track complete session lifecycle', () => {
      const { result } = renderHook(() => useExerciseUI());

      // Start session
      act(() => {
        result.current.startSession('session-1', 3);
      });

      expect(result.current.sessionState).toBe('in-progress');
      expect(result.current.roundsCompleted).toBe(0);

      // Complete round 1
      act(() => {
        result.current.incrementRound();
      });

      expect(result.current.roundsCompleted).toBe(1);
      expect(result.current.sessionState).toBe('in-progress');

      // Pause
      act(() => {
        result.current.pauseSession();
      });

      expect(result.current.sessionState).toBe('paused');

      // Resume
      act(() => {
        result.current.resumeSession();
      });

      expect(result.current.sessionState).toBe('in-progress');

      // Complete round 2 and 3
      act(() => {
        result.current.incrementRound();
        result.current.incrementRound();
      });

      expect(result.current.roundsCompleted).toBe(3);

      // Complete session
      act(() => {
        result.current.completeSession();
      });

      expect(result.current.sessionState).toBe('completed');
    });
  });
});
