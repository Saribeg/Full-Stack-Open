import { defineConfig, devices } from '@playwright/test';

const FRONT_PORT = 5173;
const FRONT_URL = process.env.E2E_BASE_URL ?? `http://localhost:${FRONT_PORT}`;

const BACK_PORT = 3003;
const RAW_BACK_URL = process.env.E2E_API_URL ?? `http://localhost:${BACK_PORT}`;
const BACK_URL = RAW_BACK_URL.endsWith('/api') ? RAW_BACK_URL : `${RAW_BACK_URL}/api`;

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: isCI ? 2 : 0,
  timeout: 60_000,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: FRONT_URL,
    backendURL: BACK_URL,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  webServer: isCI
    ? []
    : [
        {
          command: 'npm run start:backend:test',
          url: `${RAW_BACK_URL}/health`,
          reuseExistingServer: true,
          timeout: 120_000,
          name: 'Backend'
        },
        {
          command: `npm run dev -- --port ${FRONT_PORT}`,
          url: FRONT_URL,
          reuseExistingServer: true,
          timeout: 120_000,
          name: 'Frontend'
        }
      ],

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
});
