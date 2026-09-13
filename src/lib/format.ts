export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

/** Shown until the clock's first tick, so the markup is stable on first paint. */
export const CLOCK_TIME_FALLBACK = '9:41am';
export const CLOCK_DATE_FALLBACK = '12 March, 2025';

/** `9:41am` — no leading zero on the hour, minutes padded, lowercase meridiem. */
export function formatTime(date: Date): string {
  const hours = date.getHours() % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const meridiem = date.getHours() >= 12 ? 'pm' : 'am';
  return `${hours}:${minutes}${meridiem}`;
}

/** `12 March, 2025` — day, full month name, year. */
export function formatDate(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]}, ${date.getFullYear()}`;
}
