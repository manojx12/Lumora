import { useEffect, useState } from 'react';
import {
  CLOCK_DATE_FALLBACK,
  CLOCK_TIME_FALLBACK,
  formatDate,
  formatTime,
} from '../lib/format';

export interface Clock {
  time: string;
  date: string;
  /** False until the first tick, while the fallbacks are on screen. */
  live: boolean;
}

/** Local time, refreshed every second. */
export function useClock(): Clock {
  const [clock, setClock] = useState<Clock>({
    time: CLOCK_TIME_FALLBACK,
    date: CLOCK_DATE_FALLBACK,
    live: false,
  });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock({ time: formatTime(now), date: formatDate(now), live: true });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return clock;
}
