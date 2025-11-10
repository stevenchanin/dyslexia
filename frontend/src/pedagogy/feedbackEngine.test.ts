import { describe, it, expect } from 'vitest';
import { selectFeedbackAction } from './feedbackEngine';
import type { ErrorObservation } from './errorTaxonomy';

const baseErr: ErrorObservation = {
  domain: 'gpc',
  type: 'vowel-confusion',
  target: 'a'
};

describe('feedback engine', () => {
  it('starts with a specific prompt', () => {
    const action = selectFeedbackAction({ attemptCount: 1, consecutiveErrors: 0, lastError: baseErr });
    expect(action.step).toBe('specific-prompt');
    expect(action.hint).toBeTruthy();
  });

  it('scaffolds on second error', () => {
    const action = selectFeedbackAction({ attemptCount: 2, consecutiveErrors: 1, lastError: baseErr });
    expect(['scaffold', 'specific-prompt']).toContain(action.step);
  });

  it('models on third error', () => {
    const action = selectFeedbackAction({ attemptCount: 3, consecutiveErrors: 2, lastError: baseErr });
    expect(['model','scaffold']).toContain(action.step);
  });

  it('steps back after repeated errors', () => {
    const action = selectFeedbackAction({ attemptCount: 5, consecutiveErrors: 3, lastError: baseErr });
    expect(action.step).toBe('step-back');
  });
});

