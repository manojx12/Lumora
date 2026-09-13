/** Design base: every rem in the layout is authored against 16px. */
export const FONT_BASE = 16;
export const ADAPTIVE_BASE_WIDTH = 1920;
/** Damping applied to the scale-up so very wide displays grow gently. */
export const ADAPTIVE_COEF = 0.6666;

/**
 * Root font size for viewports wider than the design base.
 *
 * Returns `null` below/at the base width, where the `max-width` media queries
 * in index.css drive the scale instead.
 */
export function adaptiveFontSize(viewportWidth: number): number | null {
  const widthReduction = ((ADAPTIVE_BASE_WIDTH - viewportWidth) / ADAPTIVE_BASE_WIDTH) * 100;
  const size = FONT_BASE - (FONT_BASE * (widthReduction * ADAPTIVE_COEF)) / 100;
  return size > FONT_BASE ? size : null;
}

/** Applies (or clears) the scale-up on the document element. */
export function applyAdaptiveFontSize(width: number, element: HTMLElement): void {
  const size = adaptiveFontSize(width);
  if (size === null) element.style.removeProperty('font-size');
  else element.style.fontSize = `${size}px`;
}
