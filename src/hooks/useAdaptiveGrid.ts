import { useEffect } from 'react';
import { applyAdaptiveFontSize } from '../lib/adaptiveGrid';

/**
 * Keeps the root font size in step with the viewport so the rem-based layout
 * scales past the 1920px design base. Below it the CSS media queries win.
 */
export function useAdaptiveGrid(): void {
  useEffect(() => {
    const apply = () => applyAdaptiveFontSize(window.innerWidth, document.documentElement);
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);
}
