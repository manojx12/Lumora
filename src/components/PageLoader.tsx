import { animated, useSpring } from '@react-spring/web';
import { useEffect, useRef, useState } from 'react';
import { LogoMark } from './icons';
import { LOADER_FILL_MS, SPRING } from '../lib/constants';
import { loaderProgress, padProgress } from '../lib/easing';
import { startScroll, stopScroll } from '../lib/scroll';
import { useUI } from '../context/ui-context';

interface PageLoaderProps {
  brand?: string;
  tagline?: string;
}

/**
 * Full-screen intro. Counts 000 → 100, then slides away and releases the
 * `ready` flag every above-the-fold reveal waits on.
 */
export function PageLoader({
  brand = 'Lumora',
  tagline = 'Bold ideas, shipped with quiet precision.',
}: PageLoaderProps = {}) {
  const { setReady } = useUI();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    stopScroll();
  }, []);

  useEffect(() => {
    let frame = 0;

    const step = (now: number) => {
      startedAt.current ??= now;
      const next = loaderProgress(now - startedAt.current, LOADER_FILL_MS);
      setProgress(next);
      if (next < 100) frame = requestAnimationFrame(step);
      else setDone(true);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, []);

  const slideStyle = useSpring({
    y: done ? '-100%' : '0%',
    config: SPRING.loaderSlide,
    onRest: () => {
      if (!done) return;
      setReady(true);
      startScroll();
      setGone(true);
    },
  });

  const contentStyle = useSpring({
    opacity: done ? 0 : 1,
    y: done ? -12 : 0,
    config: SPRING.loaderContent,
  });

  if (gone) return null;

  return (
    <animated.div
      style={slideStyle}
      data-testid="page-loader"
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center gap-8 rounded-b-card bg-ink text-white"
    >
      <animated.div style={contentStyle} className="flex flex-col items-center gap-5 text-center">
        <div className="flex items-center gap-2 text-2xl font-semibold sm:text-3xl">
          <LogoMark className="text-3xl text-accent-from" />
          {brand}
        </div>
        <p className="max-w-[24ch] text-sm text-white/55">{tagline}</p>
      </animated.div>

      <div className="flex w-[min(22rem,72vw)] flex-col gap-3">
        <div className="h-px w-full bg-white/15">
          <div
            className="h-full bg-accent-from transition-[width] duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs font-medium tracking-[0.05em] text-white/45 uppercase">
          <span>Loading</span>
          <span data-testid="loader-count" className="tnum text-white/80">
            {padProgress(progress)}
          </span>
        </div>
      </div>
    </animated.div>
  );
}
