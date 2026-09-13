import { expect, test, waitForIntro } from './fixtures';

test.beforeEach(async ({ page }) => {
  await page.goto('/lumora.html', { waitUntil: 'domcontentloaded' });
});

test.describe('intro loader', () => {
  test('counts up to 100, then unmounts and releases the scroll lock', async ({ page }) => {
    const counter = page.getByTestId('loader-count');
    await expect(counter).toBeVisible();
    await expect(counter).toHaveText(/^\d{3}$/);

    await waitForIntro(page);

    // The lock is applied as inline styles on <html> and removed on release.
    await expect
      .poll(() => page.evaluate(() => document.documentElement.style.overflow))
      .toBe('');
  });
});

test.describe('hero', () => {
  test('reveals the headline as three fixed lines', async ({ page }) => {
    await waitForIntro(page);
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Bold ideas,');
    await expect(heading).toContainText('shipped with');
    await expect(heading).toContainText('quiet precision');
  });

  test('shows a live local time in place of the fallback', async ({ page }) => {
    await waitForIntro(page);
    const time = page.getByTestId('clock-time');
    await expect(time).toHaveText(/^\d{1,2}:\d{2}(am|pm)$/);
  });

  test('advances the highlight carousel', async ({ page }) => {
    await waitForIntro(page);
    await expect(page.getByText('Crafted to convert.')).toBeVisible();

    await page.getByRole('button', { name: 'Next highlight' }).click();
    await expect(page.getByText('Built to scale.')).toBeVisible();

    await page.getByRole('button', { name: 'Previous highlight' }).click();
    await expect(page.getByText('Crafted to convert.')).toBeVisible();
  });
});

test.describe('navigation overlay', () => {
  test('opens from the header, closes on Escape and restores scrolling', async ({ page }) => {
    await waitForIntro(page);

    await page.getByRole('button', { name: /menu/i }).click();
    const menu = page.getByTestId('nav-menu');
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('button', { name: /^0\d Work$/ })).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.style.overflow))
      .toBe('hidden');

    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.style.overflow))
      .toBe('');
  });

  test('closes when a section link is chosen', async ({ page }) => {
    await waitForIntro(page);
    await page.getByRole('button', { name: /menu/i }).click();
    await page.getByTestId('nav-menu').getByRole('button', { name: /Services/ }).click();
    await expect(page.getByTestId('nav-menu')).toBeHidden();
  });
});

test.describe('request modal', () => {
  test('submits to the success state and closes', async ({ page }) => {
    await waitForIntro(page);

    await page.getByRole('button', { name: /let's talk/i }).click();
    const modal = page.getByTestId('request-modal');
    await expect(modal).toBeVisible();

    await modal.getByPlaceholder('Your name').fill('Ada Lovelace');
    await modal.getByPlaceholder('you@company.com').fill('ada@example.com');
    await modal.getByPlaceholder(/A few words/).fill('A analytical engine, end to end.');
    await modal.getByRole('button', { name: /send request/i }).click();

    await expect(page.getByTestId('request-success')).toBeVisible();
    await expect(page.getByText('Request received')).toBeVisible();

    await page.getByTestId('request-success').getByRole('button', { name: 'Close' }).click();
    await expect(modal).toBeHidden();
  });

  test('closes on Escape and resets the form', async ({ page }) => {
    await waitForIntro(page);
    await page.getByRole('button', { name: /let's talk/i }).click();

    const modal = page.getByTestId('request-modal');
    await modal.getByPlaceholder('Your name').fill('Ada');
    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();

    await page.getByRole('button', { name: /let's talk/i }).click();
    await expect(page.getByPlaceholder('Your name')).toHaveValue('');
  });
});

test.describe('stats', () => {
  test('counts each figure up to its target once scrolled through', async ({ page }) => {
    await waitForIntro(page);

    const values = page.getByTestId('stat-value');
    await expect(values).toHaveCount(4);
    await expect.poll(() => values.allTextContents()).toEqual(['0', '0', '0', '0']);

    // Each figure reaches its target when its centre meets the centre of the
    // viewport. Park the last one there rather than jumping to the foot of the
    // page — the count-up only advances while the panel is on screen, so
    // scrolling clean past it would leave the figures behind.
    await page.evaluate(() => {
      const stats = [...document.querySelectorAll('[data-testid="stat-value"]')];
      const last = stats[stats.length - 1].getBoundingClientRect();
      const centre = last.top + window.scrollY + last.height / 2;
      window.scrollTo(0, centre - window.innerHeight / 2);
    });

    await expect.poll(() => values.allTextContents(), { timeout: 10_000 }).toEqual([
      '150',
      '98',
      '12',
      '40',
    ]);
  });
});

test.describe('content', () => {
  test('renders every project, service and footer column', async ({ page }) => {
    await waitForIntro(page);

    await expect(page.locator('#works article')).toHaveCount(4);
    await expect(page.getByRole('heading', { name: 'Aster Labs' })).toBeVisible();
    await expect(page.locator('#services li')).toHaveCount(4);
    await expect(page.getByRole('heading', { name: 'Consulting' })).toBeVisible();
    await expect(page.getByText('© 2025 Lumora Studio. All rights reserved.')).toBeVisible();
  });
});

test.describe('layout', () => {
  test('never scrolls horizontally', async ({ page }) => {
    await waitForIntro(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
