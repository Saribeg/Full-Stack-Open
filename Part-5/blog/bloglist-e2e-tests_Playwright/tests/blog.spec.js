const { test, expect, beforeEach, describe } = require('@playwright/test');
const helper = require('./helper');
let blogs = [];

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    const response = await request.post('/api/test/initiate-db');
    const savedTestData = await response.json();
    blogs = savedTestData.blogs;
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
      await expect(deleteButtonFromMe).toBeVisible();
    });

    test('blogs are sorted in correct order by likes count', async ({ page }) => {
      // Check initial sorting
      const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
      const expectedTitles = sortedBlogs.map(blog => `${blog.title} by ${blog.author}`);

      await expect(page.locator('.blog-title')).toHaveCount(expectedTitles.length);
      const actualTitlesLocators = page.locator('.blog-title');
      const actualTitles  = await actualTitlesLocators.allTextContents();

      expect(actualTitles).toEqual(expectedTitles);
      await expect(actualTitlesLocators).toHaveText(expectedTitles);

      // Click 3 times to a blog to change the general order
      const blogTitle = page.locator('.blog-title', {
        hasText: 'First class tests by Robert C. Martin',
      });
      const blogCard = blogTitle.locator('xpath=ancestor::div[contains(@class, "blog-card")]');
      await blogTitle.click();
      await blogCard.locator('.blog-like').click();
      await expect(blogCard.locator('.blog-likes')).toContainText('Likes: 11');
      await blogCard.locator('.blog-like').click();
      await expect(blogCard.locator('.blog-likes')).toContainText('Likes: 12');
      await blogCard.locator('.blog-like').click();
      await expect(blogCard.locator('.blog-likes')).toContainText('Likes: 13');

      // Check new order after new likes
      const updatedSortedBlogs = [...blogs]
        .map(blog => blog.title === 'First class tests' ? { ...blog, likes: 13 } : blog)
        .sort((a, b) => b.likes - a.likes);
      const updatedExpectedTitles = updatedSortedBlogs.map(blog => `${blog.title} by ${blog.author}`);

      const updatedActualTitlesLocators = page.locator('.blog-title');
      const updatedActualTitles  = await updatedActualTitlesLocators.allTextContents();

      expect(updatedActualTitles).toEqual(updatedExpectedTitles);
      await expect(updatedActualTitlesLocators).toHaveText(updatedExpectedTitles);
    });
  });
});
