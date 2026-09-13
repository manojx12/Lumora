import { expect, test, waitForIntro } from './fixtures';

test.beforeEach(async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
});

test('runs the intro and releases the scroll lock', async ({ page }) => {
  await expect(page.getByTestId('loader-count')).toHaveText(/^\d{3}$/);
  await waitForIntro(page);
  await expect.poll(() => page.evaluate(() => document.documentElement.style.overflow)).toBe('');
});

test('carries the site name through the page', async ({ page }) => {
  await expect(page).toHaveTitle(/^Manoj Dev — /);

  await waitForIntro(page);
  await expect(page.getByRole('banner').getByText('Manoj Dev')).toBeVisible();
  await expect(page.getByRole('contentinfo').getByText('Manoj Dev').first()).toBeVisible();
  await expect(page.getByRole('contentinfo')).toContainText(/© \d{4} Manoj Dev/);
});

test('reveals the headline as three fixed lines', async ({ page }) => {
  await waitForIntro(page);
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
  await expect(heading).toContainText('Design that ships.');
  await expect(heading).toContainText('Code that lasts.');
  await expect(heading).toContainText('Work that earns trust.');
});

test('loads both halves of the hero portrait pair at the same size', async ({ page }) => {
  await waitForIntro(page);

  const pair = await page.evaluate(async () => {
    const img = document.querySelector('img')!;
    const load = (src: string) =>
      new Promise<{ w: number; h: number }>((resolve, reject) => {
        const probe = new Image();
        probe.onload = () => resolve({ w: probe.naturalWidth, h: probe.naturalHeight });
        probe.onerror = () => reject(new Error(`failed: ${src}`));
        probe.src = src;
      });
    // The reveal layer is fetched by the canvas, so probe it by URL.
    const reveal = img.src.replace(/base\.\w+$/, 'reveal.png');
    return { base: { w: img.naturalWidth, h: img.naturalHeight }, reveal: await load(reveal) };
  });

  expect(pair.base.w).toBeGreaterThan(0);
  // The cursor wipe only registers if both layers share a frame.
  expect(pair.reveal).toEqual(pair.base);
});

test('renders the projects, capabilities and experience', async ({ page }) => {
  await waitForIntro(page);
  await expect(page.locator('#work article')).toHaveCount(4);
  await expect(page.locator('#capabilities li')).toHaveCount(4);
  await expect(page.locator('#experience li')).toHaveCount(3);
});

test('opens the contact modal with its own copy and submits', async ({ page }) => {
  await waitForIntro(page);

  await page.getByRole('button', { name: /get in touch/i }).first().click();
  const modal = page.getByTestId('request-modal');
  await expect(modal).toBeVisible();
  await expect(modal.getByText('Tell me what you have in mind.')).toBeVisible();

  await modal.getByPlaceholder('Your name').fill('Ada Lovelace');
  await modal.getByPlaceholder('you@company.com').fill('ada@example.com');
  await modal.getByPlaceholder(/A few words/).fill('A role, starting in spring.');
  await modal.getByRole('button', { name: /send message/i }).click();

  await expect(page.getByText('Message received')).toBeVisible();
});

test('carries the person through the nav overlay', async ({ page }) => {
  await waitForIntro(page);
  await page.getByRole('button', { name: /menu/i }).click();

  const menu = page.getByTestId('nav-menu');
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('button', { name: /^0\d Experience$/ })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
});

test('never scrolls horizontally', async ({ page }) => {
  await waitForIntro(page);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
