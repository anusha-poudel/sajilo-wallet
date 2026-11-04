import { test, expect } from './fixtures';
import type { Page } from '@playwright/test';
import users from './data/users.json';
import boundaries from './data/amount-boundaries.json';

async function startPayment(page: Page, receiver: string, amount: string, purpose: string) {
  await page.getByRole('link', { name: 'Make a Payment' }).click();
  await page.getByLabel('Receiver').fill(receiver);
  await page.getByLabel('Amount (Rs.)').fill(amount);
  await page.getByLabel('Purpose').selectOption(purpose);
  await page.getByRole('button', { name: 'Continue' }).click();
}

async function confirmWithPin(page: Page, pin: string) {
  await page.getByLabel('Transaction PIN').fill(pin);
  await page.getByRole('button', { name: 'Confirm Payment' }).click();
}

test.describe('Send Money', () => {
  test('AT-05 send Rs. 500 to Sita end to end @smoke', async ({ loggedInPage: page }) => {
    await startPayment(page, users.sita.mobile, '500', 'Bill Sharing');
    await expect(page.getByTestId('confirm-receiver-name')).toHaveText('Sita Sharma');
    await expect(page.getByTestId('confirm-amount')).toHaveText('Rs. 500.00');
    await confirmWithPin(page, users.ram.pin);
    await expect(page.getByText('Payment Successful')).toBeVisible();
    await expect(page.getByText('Rs. 31,950.00')).toBeVisible();
    const txnId = (await page.getByTestId('success-txn-id').innerText()).trim();
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
      await startPayment(page, users.sita.mobile, b.amount, 'Personal Use');
      if (b.valid) {
        await expect(page.getByRole('heading', { name: 'Confirm Payment' })).toBeVisible();
      } else {
        await expect(page.getByTestId('amount-error')).toHaveText(b.message!);
      }
    });
  }

  test('AT-07 wrong PIN blocks the payment @regression', async ({ loggedInPage: page }) => {
    await startPayment(page, '9800000004', '100', 'Personal Use');
    await confirmWithPin(page, '9999');
    await expect(page.getByTestId('pin-error')).toHaveText('Incorrect transaction PIN');
    await expect(page.getByTestId('success-message')).toHaveCount(0);
  });
});