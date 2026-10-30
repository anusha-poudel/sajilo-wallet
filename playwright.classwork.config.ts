import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/classwork',

  // The app keeps its data in memory and all of us share one server.
  // Run tests one at a time so one test cannot spend another test's balance.
  fullyParallel: false,
  workers: 1,

  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  // Starts the app for you (or reuses it if it is already running)
  webServer: {
    command: 'node apps/sajilo-wallet/server.js',
    url: 'http://localhost:4000/api/config',
    reuseExistingServer: true,
  },
});