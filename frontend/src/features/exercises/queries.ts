// TanStack Query hooks for Sound Identification exercise
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createSession, fetchRounds, submitAttempt, getSessionSummary } from './api';
import type { ExerciseType, SubmitAttemptRequest } from '../../types/exercises';

// Create a new session
export function useCreateSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      exerciseType,
      difficulty,
      targetRounds,
    }: {
      exerciseType: ExerciseType;
      difficulty: number;
      targetRounds?: number;
    }) => createSession(exerciseType, difficulty, targetRounds),
    onSuccess: (data) => {
      // Cache the new session
      qc.setQueryData(['session', data.session.id], data.session);
    },
  });
}

// Fetch rounds for a session
export function useRounds(sessionId: string | null) {
  return useQuery({
    queryKey: ['rounds', sessionId],
    queryFn: () => {
      if (!sessionId) throw new Error('Session ID required');
      return fetchRounds(sessionId);
    },
    enabled: !!sessionId,
    staleTime: Infinity, // Rounds don't change once generated
  });
}

// Submit an attempt
export function useSubmitAttempt(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (attempt: SubmitAttemptRequest) => submitAttempt(sessionId, attempt),
    onSuccess: (data) => {
      // If session is complete, invalidate session summary
      if (data.sessionSummary) {
        qc.setQueryData(['session-summary', sessionId], data.sessionSummary);
      }
    },
  });
}

// Get session summary
export function useSessionSummary(sessionId: string | null) {
  return useQuery({
    queryKey: ['session-summary', sessionId],
    queryFn: () => {
      if (!sessionId) throw new Error('Session ID required');
      return getSessionSummary(sessionId);
    },
    enabled: !!sessionId,
  });
}

