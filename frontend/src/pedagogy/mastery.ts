export interface SkillMetrics {
  attempts: number;
  correct: number;
  recentAccuracy: number; // last N attempts
  averageResponseTimeMs?: number;
  sessions: number;
}

export interface MasteryRule {
  minAccuracy: number; // e.g., 0.9
  minAttempts: number; // e.g., 40
  minSessions: number; // e.g., 2
  maxAvgResponseTimeMs?: number; // optional speed criterion
}

export function isMastered(metrics: SkillMetrics, rule: MasteryRule): boolean {
  if (metrics.attempts < rule.minAttempts) return false;
  if (metrics.sessions < rule.minSessions) return false;
  if (metrics.recentAccuracy < rule.minAccuracy) return false;
  if (
    rule.maxAvgResponseTimeMs !== undefined &&
    metrics.averageResponseTimeMs !== undefined &&
    metrics.averageResponseTimeMs > rule.maxAvgResponseTimeMs
  ) {
    return false;
  }
  return true;
}

// Simplified spaced review scheduler
export interface ReviewItem {
  skillId: string;
  lastPracticed: number; // epoch ms
  masteryLevel: number; // 0-100
  reviewIntervalDays: number;
}

export function nextReviewDateMs(item: ReviewItem): number {
  const base = item.reviewIntervalDays || 1;
  let factor = 1;
  if (item.masteryLevel >= 80) factor = 2.5;
  else if (item.masteryLevel >= 60) factor = 1.5;
  const days = Math.max(1, Math.floor(base * factor));
  return item.lastPracticed + days * 24 * 60 * 60 * 1000;
}

