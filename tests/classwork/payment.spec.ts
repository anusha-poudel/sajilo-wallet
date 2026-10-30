import { test, expect } from './fixtures';
import users from './data/users.json';
import boundaries from './data/amount-boundaries.json';

test.describe('Send Money', () => {
  test('AT-05 send Rs. 500 to Sita end to end @smoke', async ({ loggedInPage: page }) => {
    await page.getByRole('link', { name: 'Make a Payment' }).click();
    await page.getByLabel('Receiver').fill(users.sita.mobile);
    await page.getByLabel('Amount (Rs.)').fill('500');
    await page.getByLabel('Purpose').selectOption('Bill Sharing');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByTestId('confirm-receiver-name')).toHaveText('Sita Sharma');
    await expect(page.getByTestId('confirm-amount')).toHaveText('Rs. 500.00');
    await page.getByLabel('Transaction PIN').fill(users.ram.pin);
    await page.getByRole('button', { name: 'Confirm Payment' }).click();
    await expect(page.getByText('Payment Successful')).toBeVisible();
    await expect(page.getByText('Rs. 31,950.00')).toBeVisible();
    const txnId = (await page.getByTestId('success-txn-id').textContent())!.trim();
    await page.getByRole('link', { name: 'History' }).click();
    const firstRow = page.getByTestId('txn-row').first();
    await expect(firstRow.getByTestId('txn-id')).toHaveText(txnId);
    await expect(firstRow.getByTestId('txn-type')).toHaveText('Debit');
    await expect(firstRow).toContainText('Rs. 500.00');
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await expect(page.getByTestId('balance-amount')).toHaveText('Rs. 31,950.00');
  });

  for (const b of boundaries) {
    test(`AT-06 amount ${b.amount} is ${b.valid ? 'accepted' : 'rejected'} @regression`, async ({ loggedInPage: page }) => {
      await page.goto('/payment');
      await page.getByLabel('Receiver').fill(users.sita.mobile);
      await page.getByLabel('Amount (Rs.)').fill(b.amount);
      await page.getByLabel('Purpose').selectOption('Personal Use');
      await page.getByRole('button', { name: 'Continue' }).click();
      if (b.valid) {
        await expect(page.getByRole('heading', { name: 'Confirm Payment' })).toBeVisible();
      } else {
        await expect(page.getByTestId('amount-error')).toHaveText(b.message!);
      }
    });
  }
  
  test('AT-07 wrong PIN blocks the payment @regression', async ({ loggedInPage: page }) => {
    await page.getByRole('link', { name: 'Make a Payment' }).click();
    await page.getByLabel('Receiver').fill('9800000004');
    await page.getByLabel('Amount (Rs.)').fill('100');
    await page.getByLabel('Purpose').selectOption('Personal Use');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByLabel('Transaction PIN').fill('9999');
    await page.getByRole('button', { name: 'Confirm Payment' }).click();
    await expect(page.getByTestId('pin-error')).toHaveText('Incorrect transaction PIN');
    await expect(page.getByTestId('success-message')).toHaveCount(0);
  });
});