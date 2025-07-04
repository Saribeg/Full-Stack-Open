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

      await helper.createBlog(page, {
        title: 'Custom hooks in React',
        author: 'Albus Dumbledore',
        url: 'https://reactcustomhooks.com/',
      });

      const blogTitle = page.locator('.blog-title', {
        hasText: 'Custom hooks in React by Albus Dumbledore'
      });
      await expect(blogTitle).toBeVisible();
    })

    test('a blog can be liked', async ({ page }) => {
      const blogTitle = page.locator('.blog-title', {
        hasText: 'Type wars by Robert C. Martin',
      });
      // Start from the element blogTitle, and search upwards (ancestor) in the DOM hierarchy for the nearest <div> element
      // whose class includes "blog-card".
      const blogCard = blogTitle.locator('xpath=ancestor::div[contains(@class, "blog-card")]');

      await blogTitle.click();
      await expect(blogCard.locator('.blog-details')).toBeVisible();
      await expect(blogCard.locator('.blog-likes')).toContainText('Likes: 2');
      await expect(blogCard.locator('.blog-user')).toContainText('Jessica Huston');
      await blogCard.locator('.blog-like').click();
      await expect(blogCard.locator('.blog-likes')).toContainText('Likes: 3');
      await expect(blogCard.locator('.blog-user')).toContainText('Harry Potter');
      await blogCard.locator('.blog-like').click();
      await expect(blogCard.locator('.blog-likes')).toContainText('Likes: 4');
      await expect(blogCard.locator('.blog-user')).toContainText('Harry Potter');
    });

    test('a blog can be deleted by the user who created it', async ({ page }) => {
      page.on('dialog', async (dialog) => {
        expect(dialog.type()).toBe('confirm');
        expect(dialog.message()).toContain('Are you sure');
        await dialog.accept();
      });
      await helper.createBlog(page, {
        title: 'Custom hooks in React',
        author: 'Albus Dumbledore',
        url: 'https://reactcustomhooks.com/',
      });

      const blogTitle = page.locator('.blog-title', {
        hasText: 'Custom hooks in React by Albus Dumbledore',
      });
      await blogTitle.click();
      const blogCard = blogTitle.locator('xpath=ancestor::div[contains(@class, "blog-card")]');
      const deleteButton = blogCard.getByRole('button', { name: /delete/i });
      await expect(deleteButton).toBeVisible();
      await deleteButton.click();
      const deletedBlog = page.locator('.blog-title', {
        hasText: 'Custom hooks in React by Albus Dumbledore'
      });
      await expect(deletedBlog).toHaveCount(0);
    });

    test('only creator of a blog can see the delete button', async ({ page }) => {
      const blogTitleFromOther = page.locator('.blog-title', {
        hasText: 'React patterns by Michael Chan',
      });
      await blogTitleFromOther.click();
      const blogCardFromOther = blogTitleFromOther.locator('xpath=ancestor::div[contains(@class, "blog-card")]');
      const deleteButtonFromOther = blogCardFromOther.getByRole('button', { name: /delete/i });
      await expect(deleteButtonFromOther).toHaveCount(0);

      const blogTitleFromMe = page.locator('.blog-title', {
        hasText: 'Full Stack Open by Albus Dumbledore',
      });
      await blogTitleFromMe.click();
      const blogCardFromMe = blogTitleFromMe.locator('xpath=ancestor::div[contains(@class, "blog-card")]');
      const deleteButtonFromMe = blogCardFromMe.getByRole('button', { name: /delete/i });
      await expect(blogCardFromMe).toBeVisible();
    });
  });
});
