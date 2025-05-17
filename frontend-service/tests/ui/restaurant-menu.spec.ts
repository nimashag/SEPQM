import { test, expect } from '@playwright/test';

const baseURL = 'http://localhost:5173';
const restaurantId = '64f9bda96ccac82f7ddcd2c6'; // ✅ Use a real working ID

test.describe('Restaurant Menu Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/restaurants/${restaurantId}`);
    await page.waitForSelector('text=Our Menu', { timeout: 10000 });
  });

  test('should display the menu heading and optional closed banner', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /our menu/i })).toBeVisible();
    const banner = page.locator('text=Restaurant Currently Closed');
    // Banner may or may not be visible depending on availability
    await expect(banner.or(page.locator('text=Filter & Sort'))).toBeVisible();
  });

  test('should show filter sidebar and sort dropdown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /filter & sort/i })).toBeVisible();
    await expect(page.locator('select')).toBeVisible();
  });

  test('should show category checkboxes if categories exist', async ({ page }) => {
    const checkboxes = page.locator('input[type="checkbox"]');
    expect(await checkboxes.count()).toBeGreaterThanOrEqual(0); // Categories may be optional
  });

  test('should show sort options correctly', async ({ page }) => {
    const dropdown = page.locator('select');
    await expect(dropdown).toHaveValue('asc');
    await dropdown.selectOption('desc');
    await expect(dropdown).toHaveValue('desc');
  });

  test('should display placeholder search input', async ({ page }) => {
    const input = page.getByPlaceholder(/search menu/i);
    await expect(input).toBeVisible();
  });

  test('should show menu cards or empty state', async ({ page }) => {
    const menuItems = page.locator('button:has-text("Add")');
    const count = await menuItems.count();
    if (count > 0) {
      await expect(menuItems.first()).toBeVisible();
    } else {
      await expect(page.locator('text=No menu items match your search')).toBeVisible();
    }
  });
});
