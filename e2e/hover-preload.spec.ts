import { expect, test } from '@playwright/test';

test.describe('Atomic link hover preload', () => {
  test('preloads lazy buttons chunk on hover before navigation', async ({ page }) => {
    await page.goto('/');

    const buttonsLink = page.getByRole('link', { name: 'Buttons' });
    await expect(buttonsLink).toBeVisible();

    const preloadRequest = page.waitForRequest(
      (request) => request.resourceType() === 'script' && /chunk-.*\.js/.test(request.url()),
      { timeout: 10_000 }
    );

    await buttonsLink.hover();

    const request = await preloadRequest;
    expect(request.url()).toContain('.js');

    await buttonsLink.click();
    await expect(page).toHaveURL(/\/buttons$/);
  });

  test('preloads lazy buttons chunk on keyboard focus', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Buttons' })).toBeVisible();

    const preloadRequest = page.waitForRequest(
      (request) => request.resourceType() === 'script' && /chunk-.*\.js/.test(request.url()),
      { timeout: 10_000 }
    );

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const request = await preloadRequest;
    expect(request.url()).toContain('.js');
  });
});
