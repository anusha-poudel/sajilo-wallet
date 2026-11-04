# Sajilo Wallet: Playwright Test Automation

Manual test cases and an automated Playwright + TypeScript test suite for Sajilo Wallet, a demo digital wallet web app. Built as classwork for the QA Automation bootcamp at Qrius by Qniverse. The app was provided as the system under test.

## What is tested
- **Login:** valid login, empty username, wrong password
- **Dashboard:** greeting, balance, Wallet ID, recent transactions, hide/show balance
- **Send Money:** end-to-end payment, amount boundary values (Rs. 10 minimum, Rs. 25,000 maximum), wrong PIN
- **Transaction History:** newest-first order, count, Credit filter

## Project structure
```
apps/sajilo-wallet/          app under test
tests/classwork/
  data/                      JSON test data (users, negative logins, amount boundaries)
  fixtures.ts                loggedInPage fixture
  login.spec.ts              AT-01, AT-02
  dashboard.spec.ts          AT-03, AT-04
  payment.spec.ts            AT-05, AT-06, AT-07
  history.spec.ts            AT-08
playwright.classwork.config.ts
test_cases.xlsx              manual cases, BVA table, automation table
```

## How the suite is built
- **Data-driven tests:** negative logins and amount boundaries run from JSON files, one test per row
- **Custom fixture:** `loggedInPage` resets the app data and logs in, so every test starts from the same state
- **Helper functions:** repeated steps (login, start a payment, confirm with PIN) are extracted into small functions
- **Tags:** `@smoke` for core flows, `@regression` for edge cases
- **Locators:** role and label first, test IDs for messages and data
- **Single worker:** the app keeps data in memory, so tests run one at a time

## How to run
```bash
git clone https://github.com/anusha-poudel/sajilo-wallet.git
cd sajilo-wallet
npm install
npx playwright install chromium
npx playwright test -c playwright.classwork.config.ts
```

The config starts the app automatically at http://localhost:4000.