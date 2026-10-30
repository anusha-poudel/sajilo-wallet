import { test, expect } from './fixtures';
test.describe('Transaction History', () => {
  test.beforeEach(async ({ loggedInPage: page }) => {
    await page.getByRole('link', { name: 'View All Transactions' }).click();
  });
  test('AT-08 newest first, then Credit filter @regression', async ({ loggedInPage: page }) => {
    await expect(page.getByTestId('txn-row')).toHaveCount(6);
    await expect(page.getByTestId('txn-row').first().getByTestId('txn-id')).toHaveText('TXN1006');
    await page.getByLabel('Type').selectOption('Credit');
    await expect(page.getByTestId('txn-row')).toHaveCount(2);
    for (const cell of await page.getByTestId('txn-type').all()) {
      await expect(cell).toHaveText('Credit');
    }
  });
});
