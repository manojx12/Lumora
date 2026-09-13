/**
 * Shared curves and keyframes for the text reveals, so every heading on the
 * page rides the same motion.
 */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

/** Lines slide up out of a clipping mask. */
export const LINE_CONFIG = { duration: 900, easing: easeOutCubic };
export const LINE_IN = { y: '0%', opacity: 1 };
export const LINE_OUT = { y: '100%', opacity: 0 };

/** Words rise into place, used by the About statement. */
export const WORD_CONFIG = { duration: 700, easing: easeOutQuart };
export const WORD_IN = { y: 0, opacity: 1 };
export const WORD_OUT = { y: 24, opacity: 0 };
