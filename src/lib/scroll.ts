import Lenis from 'lenis';

let lenis: Lenis | null = null;
let rafHandle = 0;
let scrollEnabled = true;

/**
 * A single boolean gates every scroll interaction. The intro loader, the nav
 * overlay and the request modal all lock scrolling through `stopScroll`.
 */
export function isScrollEnabled(): boolean {
  return scrollEnabled;
}

export function getLenis(): Lenis | null {
  return lenis;
}

/** Creates the Lenis instance and drives it from a manual rAF loop. */
export function initScroll(): () => void {
  window.scrollTo(0, 0);
  lenis = new Lenis({ smoothWheel: true });

  const raf = (time: number) => {
    lenis?.raf(time);
    rafHandle = requestAnimationFrame(raf);
  };
  rafHandle = requestAnimationFrame(raf);

  return () => {
    cancelAnimationFrame(rafHandle);
    lenis?.destroy();
    lenis = null;
  };
}

export function stopScroll(): void {
  scrollEnabled = false;
  lenis?.stop();
  const html = document.documentElement;
  html.style.position = 'relative';
  html.style.overflow = 'hidden';
  html.style.height = '100%';
}

export function startScroll(): void {
  scrollEnabled = true;
  lenis?.start();
  const html = document.documentElement;
  html.style.removeProperty('position');
  html.style.removeProperty('overflow');
  html.style.removeProperty('height');
}

/**
 * Smooth-scrolls to a section. Scrolling is briefly gated so the wheel-driven
 * Lenis loop does not fight the native smooth scroll.
 */
export function scrollToId(id: string): void {
  const element = document.getElementById(id);
  if (!element) return;

  scrollEnabled = false;
  setTimeout(() => {
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.pageYOffset,
      behavior: 'smooth',
    });
  }, 50);
  setTimeout(() => {
    scrollEnabled = true;
  }, 100);
}
