import { describe, expect, it } from 'vitest';
import {
  ADAPTIVE_BASE_WIDTH,
  FONT_BASE,
  adaptiveFontSize,
  applyAdaptiveFontSize,
} from '../../src/lib/adaptiveGrid';

describe('adaptiveFontSize', () => {
  it('defers to the CSS media queries at or below the design base', () => {
    expect(adaptiveFontSize(ADAPTIVE_BASE_WIDTH)).toBeNull();
    expect(adaptiveFontSize(1440)).toBeNull();
    expect(adaptiveFontSize(390)).toBeNull();
  });

  it('scales up past the design base with the damping coefficient applied', () => {
    // 16 - (16 * ((1920 - 2560) / 1920 * 100) * 0.6666) / 100
    expect(adaptiveFontSize(2560)).toBeCloseTo(19.5552, 4);
    expect(adaptiveFontSize(3840)).toBeCloseTo(26.6656, 4);
  });

  it('grows monotonically with viewport width', () => {
    const widths = [1921, 2200, 2560, 3000, 3840];
    const sizes = widths.map((width) => adaptiveFontSize(width) ?? 0);
    for (let i = 1; i < sizes.length; i += 1) {
      expect(sizes[i]).toBeGreaterThan(sizes[i - 1]);
    }
    expect(sizes[0]).toBeGreaterThan(FONT_BASE);
  });
});

describe('applyAdaptiveFontSize', () => {
  it('writes an inline font size above the base width', () => {
    const element = document.createElement('html');
    applyAdaptiveFontSize(2560, element);
    expect(element.style.fontSize).toMatch(/px$/);
    expect(parseFloat(element.style.fontSize)).toBeCloseTo(19.5552, 4);
  });

  it('clears the inline font size at or below the base width', () => {
    const element = document.createElement('html');
    element.style.fontSize = '24px';
    applyAdaptiveFontSize(1440, element);
    expect(element.style.fontSize).toBe('');
  });
});
