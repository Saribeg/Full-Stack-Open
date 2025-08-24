import { defineConfig } from 'cypress';
import mochawesome from 'cypress-mochawesome-reporter/plugin.js';

const E2E_BASE_URL = process.env.CYPRESS_BASE_URL
  ?? process.env.E2E_BASE_URL
  ?? 'http://localhost:5173';

const E2E_API_URL = process.env.CYPRESS_API_URL
  ?? process.env.E2E_API_URL
  ?? 'http://localhost:3003/api';

export default defineConfig({
  e2e: {
    baseUrl: E2E_BASE_URL,
    specPattern: 'tests/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'tests/e2e/support/e2e.js',
    fixturesFolder: 'tests/e2e/fixtures',
    screenshotsFolder: 'tests/e2e/screenshots',
    videosFolder: 'tests/e2e/videos',
    retries: { runMode: 1, openMode: 0 },
    setupNodeEvents(on, config) {
      mochawesome(on);
      config.env = { ...(config.env ?? {}), API_URL: E2E_API_URL };
      return config;
    }
  },
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    reportPageTitle: 'E2E Report',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    overwrite: false,
    html: false,
    json: true
  },
  video: false
});