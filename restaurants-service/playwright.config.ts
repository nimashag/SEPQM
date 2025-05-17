import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'http://localhost:3001', // Your restaurant microservice base URL
    headless: true,
    ignoreHTTPSErrors: true,
  },
  timeout: 30000,
  testDir: './e2e-tests/tests',
  reporter: [['html', { open: 'always' }]],

  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'WebKit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
