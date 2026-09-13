/** Easing used by the intro loader counter. */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Loader counter display: always three digits — 000 … 100. */
export function padProgress(progress: number): string {
  return String(Math.round(progress)).padStart(3, '0');
}

/** Progress (0–100) for a given elapsed time within the fill duration. */
export function loaderProgress(elapsedMs: number, durationMs: number): number {
  const t = Math.min(Math.max(elapsedMs / durationMs, 0), 1);
  return Math.round(easeInOutCubic(t) * 100);
}
