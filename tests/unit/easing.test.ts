import { describe, expect, it } from 'vitest';
import { easeInOutCubic, loaderProgress, padProgress } from '../../src/lib/easing';
import { LOADER_FILL_MS } from '../../src/lib/constants';

describe('easeInOutCubic', () => {
  it('pins both ends and passes through the midpoint', () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5, 10);
    expect(easeInOutCubic(1)).toBe(1);
  });

  it('eases in before the midpoint and out after it', () => {
    expect(easeInOutCubic(0.25)).toBeLessThan(0.25);
    expect(easeInOutCubic(0.75)).toBeGreaterThan(0.75);
  });
});

describe('padProgress', () => {
  it('always renders three digits', () => {
    expect(padProgress(0)).toBe('000');
    expect(padProgress(7)).toBe('007');
    expect(padProgress(42)).toBe('042');
    expect(padProgress(100)).toBe('100');
  });
});

describe('loaderProgress', () => {
  it('runs 0 to 100 across the fill duration', () => {
    expect(loaderProgress(0, LOADER_FILL_MS)).toBe(0);
    expect(loaderProgress(LOADER_FILL_MS, LOADER_FILL_MS)).toBe(100);
    expect(loaderProgress(LOADER_FILL_MS / 2, LOADER_FILL_MS)).toBe(50);
  });

  it('clamps outside the duration rather than overshooting', () => {
    expect(loaderProgress(-500, LOADER_FILL_MS)).toBe(0);
    expect(loaderProgress(LOADER_FILL_MS * 3, LOADER_FILL_MS)).toBe(100);
  });

  it('never decreases as time advances', () => {
    let previous = -1;
    for (let elapsed = 0; elapsed <= LOADER_FILL_MS; elapsed += 50) {
      const value = loaderProgress(elapsed, LOADER_FILL_MS);
      expect(value).toBeGreaterThanOrEqual(previous);
      previous = value;
    }
  });
});
