import { describe, expect, it } from 'vitest';
import { formatDate, formatTime } from '../../src/lib/format';

describe('formatTime', () => {
  it('uses a 12-hour clock with no leading zero on the hour', () => {
    expect(formatTime(new Date(2025, 2, 12, 9, 41))).toBe('9:41am');
    expect(formatTime(new Date(2025, 2, 12, 14, 5))).toBe('2:05pm');
  });

  it('renders midnight and noon as 12', () => {
    expect(formatTime(new Date(2025, 2, 12, 0, 0))).toBe('12:00am');
    expect(formatTime(new Date(2025, 2, 12, 12, 0))).toBe('12:00pm');
  });

  it('pads minutes to two digits', () => {
    expect(formatTime(new Date(2025, 2, 12, 8, 7))).toBe('8:07am');
  });
});

describe('formatDate', () => {
  it('renders day, full month name and year', () => {
    expect(formatDate(new Date(2025, 2, 12))).toBe('12 March, 2025');
    expect(formatDate(new Date(2026, 0, 1))).toBe('1 January, 2026');
    expect(formatDate(new Date(2024, 11, 31))).toBe('31 December, 2024');
  });
});
