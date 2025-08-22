// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

const FRONT_PORT = 5173;
const FRONT_URL = `http://localhost:${FRONT_PORT}`;
const BACK_URL = `http://localhost:3003`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  timeout: 60_000,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: FRONT_URL,
    backendURL: BACK_URL,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  webServer: [
    {
      command: 'npm run start:backend:dev',
      url: `${BACK_URL}/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      name: 'Backend'
    },
    {
      command: process.env.CI
        ? `npm run preview -- --port ${FRONT_PORT}`
        : `npm run dev -- --port ${FRONT_PORT}`,
      url: FRONT_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      name: 'Frontend'
    }
  ],

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
});
