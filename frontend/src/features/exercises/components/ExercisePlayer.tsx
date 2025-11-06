// Minimal component showing combined usage (example only)
import React from 'react';
import { useExercises, useSubmitAttempt } from '../queries';
import { useExerciseUI } from '../store';

export function ExercisePlayer({ module }: { module: string }) {
  const difficulty = useExerciseUI((s) => s.currentDifficulty);
  const { data: items, isLoading } = useExercises(module, difficulty);
  const { mutate: submit } = useSubmitAttempt('session-123');

  if (isLoading) return <div>Loading…</div>;
  return (
    <div>
      {(items ?? []).map((ex) => (
        <button key={ex.id} onClick={() => submit({ exId: ex.id, correct: true })}>
          Try {ex.title ?? ex.id}
        </button>
      ))}
    </div>
  );
}

