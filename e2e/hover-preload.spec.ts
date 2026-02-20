import { expect, test } from '@playwright/test';

test.describe('Atomic link hover preload', () => {
  test('preloads lazy feature chunk on hover before navigation', async ({ page }) => {
    await page.goto('/');

    const featureLink = page.getByRole('link', { name: 'Feature' });
    await expect(featureLink).toBeVisible();

    const preloadRequest = page.waitForRequest(
      (request) => request.resourceType() === 'script' && /chunk-.*\.js/.test(request.url()),
      { timeout: 10_000 }
    );

    await featureLink.hover();

    const request = await preloadRequest;
    expect(request.url()).toContain('.js');

    await featureLink.click();
    await expect(page).toHaveURL(/\/feature$/);
  });

  test('preloads lazy feature chunk on keyboard focus', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Feature' })).toBeVisible();

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
