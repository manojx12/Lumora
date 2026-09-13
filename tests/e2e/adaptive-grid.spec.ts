import { expect, test } from './fixtures';

const rootFontSize = () => parseFloat(getComputedStyle(document.documentElement).fontSize);

test.describe('adaptive rem grid', () => {
  test.skip(({ isMobile }) => !!isMobile, 'viewport is resized directly');

  // Each width maps to the design base its media query targets.
  const CSS_BREAKPOINTS: [number, number][] = [
    [1920, 16],       // 1920 * 0.833333vw
    [1441, 12.0083],  // 1441 * 0.833333vw
    [1025, 11.3889],  // 1025 * 1.111111vw
    [641, 10.0156],   // 641  * 1.5625vw
    [640, 28.4444],   // 640  * 4.444444vw — the 360px mobile base
  ];

  for (const [width, expected] of CSS_BREAKPOINTS) {
    test(`is ${expected}px at ${width}px wide`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      expect(await page.evaluate(rootFontSize)).toBeCloseTo(expected, 1);
    });
  }

  test('scales up beyond the 1920px design base', async ({ page }) => {
    await page.setViewportSize({ width: 2560, height: 1200 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // 16 - (16 * ((1920 - 2560) / 1920 * 100) * 0.6666) / 100
    await expect.poll(() => page.evaluate(rootFontSize)).toBeCloseTo(19.5552, 2);
  });
});
