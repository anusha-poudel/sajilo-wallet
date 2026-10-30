import { test, expect } from './fixtures';
test.describe('Dashboard', () => {
  test('AT-03 shows balance, wallet ID and recent transactions @smoke', async ({ loggedInPage: page }) => {
    await expect(page.getByTestId('balance-amount')).toHaveText('Rs. 32,450.00');
    await expect(page.getByTestId('wallet-id')).toHaveText('9841000001');
    await expect(page.getByTestId('recent-txn')).toHaveCount(3);
  });
  test('AT-04 hide and show balance @regression', async ({ loggedInPage: page }) => {
    await page.getByRole('button', { name: 'Hide balance' }).click();
    await expect(page.getByTestId('balance-amount')).toHaveText('Rs. XXXX.XX');
    await page.getByRole('button', { name: 'Show balance' }).click();
    await expect(page.getByTestId('balance-amount')).toHaveText('Rs. 32,450.00');
  });
});