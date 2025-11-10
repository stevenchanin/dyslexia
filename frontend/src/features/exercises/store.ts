// UI/app state with Zustand - includes session management
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SessionState = 'not-started' | 'in-progress' | 'paused' | 'completed';

type ExerciseUIState = {
  // UI preferences
  lowBandwidth: boolean;
  ttsRate: number;
  currentDifficulty: number;

  // Session state
  activeSessionId: string | null;
  sessionState: SessionState;
  roundsCompleted: number;
  targetRounds: number;
  sessionStartTime: number | null;
  pausedAt: number | null;

  // UI actions
  setLowBandwidth(v: boolean): void;
  setTtsRate(v: number): void;
  setDifficulty(v: number): void;

  // Session actions
  startSession(sessionId: string, targetRounds: number): void;
  pauseSession(): void;
  resumeSession(): void;
  completeSession(): void;
  incrementRound(): void;
  resetSession(): void;
};

export const useExerciseUI = create<ExerciseUIState>()(
  persist(
    (set) => ({
      // UI preferences
      lowBandwidth: false,
      ttsRate: 1.0,
      currentDifficulty: 2,

      // Session state
      activeSessionId: null,
      sessionState: 'not-started',
      roundsCompleted: 0,
      targetRounds: 10,
      sessionStartTime: null,
      pausedAt: null,

      // UI actions
      setLowBandwidth: (v) => set({ lowBandwidth: v }),
      setTtsRate: (v) => set({ ttsRate: v }),
      setDifficulty: (v) => set({ currentDifficulty: v }),

      // Session actions
      startSession: (sessionId, targetRounds) => set({
        activeSessionId: sessionId,
        sessionState: 'in-progress',
        targetRounds,
        roundsCompleted: 0,
        sessionStartTime: Date.now(),
        pausedAt: null,
      }),

      pauseSession: () => set({
        sessionState: 'paused',
        pausedAt: Date.now(),
      }),

      resumeSession: () => set({
        sessionState: 'in-progress',
        pausedAt: null,
      }),

      completeSession: () => set({
        sessionState: 'completed',
      }),

      incrementRound: () => set((state) => ({
        roundsCompleted: state.roundsCompleted + 1,
      })),

      resetSession: () => set({
        activeSessionId: null,
        sessionState: 'not-started',
        roundsCompleted: 0,
        targetRounds: 10,
        sessionStartTime: null,
        pausedAt: null,
      }),
    }),
    { name: 'exercise-ui' }
  )
);

