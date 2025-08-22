import { test, expect } from '@playwright/test';
import { resetDb, seedDb } from './helpers/seed';
import { fillAndSubmitLoginForm } from './helpers/login';

test.describe('Login flow', () => {
  test.beforeEach(async ({}, testInfo) => {
    const { backendURL } = testInfo.project.use;
    await resetDb(backendURL);
    await seedDb(backendURL);
  });

  test('successful login shows AuthStatus + global popup', async ({ page }) => {
    await page.goto('/');
    await fillAndSubmitLoginForm(page, 'harrypotter', 'sekret');
    await expect(page.getByTestId('auth-status')).toHaveText(/Harry Potter\s+logged in/i);
    await expect(page.getByText(/logged in/i)).toBeVisible();
  });

  test('invalid login shows inline error', async ({ page }) => {
    await page.goto('/');
    await fillAndSubmitLoginForm(page, 'harrypotter', 'wrongpassword');

    const form = page.getByTestId('login-form');

    await expect(form.getByText(/invalid username or password/i)).toBeVisible();
    await expect(page.getByText(/logged in/i)).not.toBeVisible();
    await expect(page.getByTestId('username')).toHaveValue('harrypotter');
    await expect(page.getByTestId('password')).toHaveValue('wrongpassword');
  });
});
