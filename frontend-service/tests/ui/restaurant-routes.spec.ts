// tests/ui/restaurant-routes.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Restaurant List Page - Basic Tests', () => {
  const baseUrl = 'http://localhost:5173/restaurants'; // Adjust if needed

  test('should load the restaurant list page', async ({ page }) => {
    await page.goto(baseUrl);
    await expect(page).toHaveURL(/\/restaurants/);
  });

  test('should show the main heading', async ({ page }) => {
    await page.goto(baseUrl);
    await expect(page.getByRole('heading', { name: /Restaurants/i })).toBeVisible();
  });

  test('should render restaurant cards or a message', async ({ page }) => {
    await page.goto(baseUrl);

    const cards = page.locator('div.rounded-3xl');
    const noData = page.getByText(/no restaurants found/i);

    if (await cards.count() > 0) {
      await expect(cards.first()).toBeVisible();
    } else {
      await expect(noData).toBeVisible();
    }
  });

  test('should have a visible search input', async ({ page }) => {
    await page.goto(baseUrl);
    const searchInput = page.getByPlaceholder('Search your favorite restaurant...');
    await expect(searchInput).toBeVisible();
  });

  test('should not crash when using search input', async ({ page }) => {
    await page.goto(baseUrl);
    const searchInput = page.getByPlaceholder('Search your favorite restaurant...');
    await searchInput.fill('Test');
    await page.waitForTimeout(500); // allow time for filtering to react
    expect(await page.title()).not.toBeNull();
  });
});
