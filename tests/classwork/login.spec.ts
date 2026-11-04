import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import users from './data/users.json';
import negatives from './data/login-negative.json';

async function login(page: Page, username: string, password: string) {
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('AT-01 valid login opens the dashboard @smoke', async ({ page }) => {
    await login(page, users.ram.username, users.ram.password);
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: 'Namaste, Ram Thapa' })).toBeVisible();
  });

  for (const data of negatives) {
    test(`AT-02 ${data.id} login fails: ${data.title} @regression`, async ({ page }) => {
      await login(page, data.username, data.password);
      await expect(page.getByTestId(data.field)).toHaveText(data.message);
      await expect(page).toHaveURL(/\/login$/);
    });
  }
});