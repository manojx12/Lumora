import { describe, expect, it } from 'vitest';
import { computeCoverRect } from '../../src/lib/cover';

describe('computeCoverRect', () => {
  it('fills the height and overflows the width for a wide source', () => {
    const { dx, dy, dw, dh } = computeCoverRect(2000, 1000, 800, 800);
    expect(dh).toBe(800);
    expect(dw).toBe(1600);
    expect(dy).toBe(0);
    expect(dx).toBe(-400); // overflow split evenly either side
  });

  it('fills the width and overflows the height for a tall source', () => {
    const { dx, dy, dw, dh } = computeCoverRect(1000, 2000, 800, 800);
    expect(dw).toBe(800);
    expect(dh).toBe(1600);
    expect(dx).toBe(0);
    expect(dy).toBe(-400);
  });

  it('fits exactly when the ratios match', () => {
    expect(computeCoverRect(1600, 900, 800, 450)).toEqual({ dx: 0, dy: 0, dw: 800, dh: 450 });
  });

  it('always covers the destination on both axes', () => {
    const cases: [number, number, number, number][] = [
      [1920, 1080, 400, 900],
      [800, 600, 1440, 400],
      [1000, 1000, 375, 812],
    ];
    for (const [sw, sh, dw, dh] of cases) {
      const rect = computeCoverRect(sw, sh, dw, dh);
      expect(rect.dw).toBeGreaterThanOrEqual(dw - 0.001);
      expect(rect.dh).toBeGreaterThanOrEqual(dh - 0.001);
    }
  });
});
