import { expect, test, waitForIntro } from './fixtures';

/** Counts canvas pixels with meaningful alpha, sampled for speed. */
const OPAQUE_SAMPLES = () => {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="liquid-canvas"]');
  if (!canvas) return -1;
  const context = canvas.getContext('2d');
  if (!context) return -1;
  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  let count = 0;
  for (let i = 3; i < data.length; i += 4 * 997) if (data[i] > 8) count += 1;
  return count;
};

test.describe('hero liquid reveal', () => {
  // The brush trail is pointer-driven; there is nothing to assert on touch.
  test.skip(({ isMobile }) => !!isMobile, 'pointer-driven effect');

  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForIntro(page);
  });

  test('sizes the canvas to the hero at device resolution', async ({ page }) => {
    const size = await page.evaluate(() => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="liquid-canvas"]')!;
      const hero = document.getElementById('home')!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      return {
        width: canvas.width,
        expectedWidth: Math.round(hero.width * dpr),
        height: canvas.height,
        expectedHeight: Math.round(hero.height * dpr),
      };
    });

    expect(size.width).toBe(size.expectedWidth);
    expect(size.height).toBe(size.expectedHeight);
  });

  test('paints a trail under the pointer and clears it once idle', async ({ page }) => {
    expect(await page.evaluate(OPAQUE_SAMPLES)).toBe(0);

    await page.mouse.move(300, 400);
    for (let i = 0; i < 25; i += 1) {
      await page.mouse.move(300 + i * 30, 400 + Math.sin(i / 3) * 80);
      await page.waitForTimeout(16);
    }

    await expect.poll(() => page.evaluate(OPAQUE_SAMPLES)).toBeGreaterThan(0);

    // With the pointer at rest the trail decays and is hard-cleared.
    await expect.poll(() => page.evaluate(OPAQUE_SAMPLES), { timeout: 15_000 }).toBe(0);
  });
});
