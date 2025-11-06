// TanStack Query hooks for server state (example only)
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchExercises, submitAttempt } from './api';

export function useExercises(module: string, difficulty: number) {
  return useQuery({
    queryKey: ['exercises', module, difficulty],
    queryFn: () => fetchExercises(module, difficulty),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSubmitAttempt(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: unknown) => submitAttempt(sessionId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['progress'] });
      qc.invalidateQueries({ queryKey: ['session', sessionId] });
    },
  });
}

