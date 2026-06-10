import type { Confidence } from "./qso-object.js";

export function clampConfidence(score: number): number {
  if (Number.isNaN(score)) return 0;
  return Math.max(0, Math.min(1, score));
}

export function createConfidence(score: number, method = "declared", notes?: string): Confidence {
  return {
    score: clampConfidence(score),
    method,
    ...(notes ? { notes } : {}),
  };
}

export function combineConfidence(values: Confidence[]): Confidence {
  if (values.length === 0) return createConfidence(0, "empty");

  const total = values.reduce((sum, value) => sum + clampConfidence(value.score), 0);
  return createConfidence(total / values.length, "average", `combined ${values.length} confidence values`);
}
