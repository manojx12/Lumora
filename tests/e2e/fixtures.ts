import { test as base, expect } from '@playwright/test';

/**
 * An opaque 2x2 PNG standing in for the hero photography, so the suite is
 * hermetic: no test depends on the asset bucket or Google Fonts being
 * reachable. It must be opaque — the liquid reveal stamps this image through
 * an alpha mask, so a transparent stub would paint nothing at all.
 */
const PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAADklEQVR42mP4DwYMEAoAU7oL9YXEbhEAAAAASUVORK5CYII=',
  'base64',
);

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('**://api.getlayers.ai/**', (route) =>
      route.fulfill({ contentType: 'image/png', body: PIXEL_PNG }),
    );
    await page.route('**://fonts.googleapis.com/**', (route) =>
      route.fulfill({ contentType: 'text/css', body: '' }),
    );
    await page.route('**://fonts.gstatic.com/**', (route) => route.abort());
    await use(page);
  },
});

export { expect };

/** Waits for the intro loader to count out and unmount. */
export async function waitForIntro(page: import('@playwright/test').Page) {
  await page.waitForSelector('[data-testid="page-loader"]', { state: 'detached', timeout: 15_000 });
}
