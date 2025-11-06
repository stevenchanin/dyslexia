// Tiny UI/app state with Zustand (example only)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ExerciseUIState = {
  lowBandwidth: boolean;
  ttsRate: number;
  currentDifficulty: number;
  setLowBandwidth(v: boolean): void;
  setTtsRate(v: number): void;
  setDifficulty(v: number): void;
};

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

