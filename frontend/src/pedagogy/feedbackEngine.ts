import type { ErrorObservation } from './errorTaxonomy';
import { getHintsFor, type Hint } from './hints';

export type CueStep = 'specific-prompt' | 'scaffold' | 'model' | 'contrast' | 'retry' | 'step-back' | 'review-later';

export interface FeedbackState {
  attemptCount: number;
  consecutiveErrors: number;
  lastError?: ErrorObservation;
  stageId?: string;
}

export interface FeedbackAction {
  step: CueStep;
  hint?: Hint;
}

// Cueing ladder policy
export const MAX_RETRIES_BEFORE_MODEL = 2;
export const MAX_ERRORS_BEFORE_STEP_BACK = 3;

export function selectFeedbackAction(state: FeedbackState): FeedbackAction {
  const err = state.lastError;
  if (!err) return { step: 'retry' };

  const hints = getHintsFor(err.domain, err.type);

  if (state.consecutiveErrors === 0) {
    // First error: specific prompt (priority 1 hint)
    return hints.length ? { step: 'specific-prompt', hint: hints[0] } : { step: 'retry' };
  }

  if (state.consecutiveErrors < MAX_RETRIES_BEFORE_MODEL) {
    // Second pass: scaffold (priority 2 if present)
    const scaffold = hints[1] ?? hints[0];
    return scaffold ? { step: 'scaffold', hint: scaffold } : { step: 'retry' };
  }

  if (state.consecutiveErrors === MAX_RETRIES_BEFORE_MODEL) {
    // Provide a model (priority 3 if present)
    const model = hints[2] ?? hints[1] ?? hints[0];
    return model ? { step: 'model', hint: model } : { step: 'retry' };
  }

  if (state.consecutiveErrors >= MAX_ERRORS_BEFORE_STEP_BACK) {
    // Step back to simpler item and schedule review later
    return { step: 'step-back' };
  }

  // Otherwise, contrast or retry
  const contrast = hints.find(h => h.id.includes('contrast'));
  if (contrast) return { step: 'contrast', hint: contrast };
  return { step: 'retry' };
}

