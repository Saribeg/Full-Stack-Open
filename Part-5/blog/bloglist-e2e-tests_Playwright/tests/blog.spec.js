const { test, expect, beforeEach, describe } = require('@playwright/test');
const helper = require('./helper');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/test/initiate-db');
    await page.goto('/');
  });

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log In to see blogs and work with them')).toBeVisible();
    await expect(page.getByTestId('username')).toBeVisible();
    await expect(page.getByTestId('password')).toBeVisible();
    await expect(page.getByTestId('login')).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await helper.fillAndSubmitLoginForm(page, 'harrypotter', 'sekret');

      await expect(page.locator('.notification.success')).toHaveText(/User Harry Potter is successfully logged in/);
      await expect(page.locator('.user')).toBeVisible();
      await expect(page.locator('.user-name')).toHaveText(/Harry Potter/);
      await expect(page.locator('.user-status')).toHaveText('Status: Logged In');
    });

    test('fails with wrong credentials', async ({ page }) => {
      await helper.fillAndSubmitLoginForm(page, 'harrypotter', 'wrong');

      await expect(page.locator('.user')).toHaveCount(0);
      await expect(page.locator('.notification.error')).toHaveText(/invalid username or password/);
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page, request }) => {
      await helper.loginByLocalStorage(page, request, 'harrypotter', 'sekret');
    })
  
    test('a new blog can be created', async ({ page }) => {
      await expect(page.locator('.user')).toBeVisible();

      await page.getByRole('button', { name: /new blog/i }).click()
      await page.getByTestId('blogTitle').fill('Custom hooks in React');
      await page.getByTestId('blogAuthor').fill('Albus Dumbledore');
      await page.getByTestId('blogUrl').fill('https://reactcustomhooks.com/');
      await page.getByTestId('createBlog').click();

      const blog = page.locator('.blog-title', {
        hasText: 'Custom hooks in React by Albus Dumbledore',
      });
      await expect(blog).toBeVisible();
    })
  })
});
