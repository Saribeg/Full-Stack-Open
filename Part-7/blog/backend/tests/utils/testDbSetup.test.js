const { test, beforeEach, after, describe } = require('node:test');
const assert = require('assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../../app');
const User = require('../../models/user');
const Blog = require('../../models/blog');
const {
  initialData,
  resetDb,
  createInitialUsers,
  createInitialBlogs,
  handleInitialDataInDb
} = require('../../utils/testDbSetup');

const api = supertest(app);

const createMinimalDataInDb = async () => {
  const user = new User({ username: 'temp', passwordHash: 'xxx' });
  await user.save();

  const blog = new Blog({
    title: 'Temporary Blog Title',
    author: 'Temporary Author',
    url: 'Temporary Blog Url',
    likes: 1,
    user: user._id
  });
  await blog.save();
};

describe('testDbSetup utilities', () => {
  beforeEach(async () => {
    await resetDb();
  });

  describe('resetDb', () => {
    test('clears both users and blogs collections', async () => {
      await createMinimalDataInDb();

      assert.ok(await User.countDocuments() > 0);
      assert.ok(await Blog.countDocuments() > 0);

      await resetDb();

      assert.strictEqual(await User.countDocuments(), 0);
      assert.strictEqual(await Blog.countDocuments(), 0);
    });
  });

  describe('createInitialUsers', () => {
    test('creates all users from initialData with passwordHash', async () => {
      const users = await createInitialUsers();

      assert.strictEqual(users.length, initialData.users.length);

      users.forEach(u => {
        assert.ok(u.passwordHash);
        assert.strictEqual(typeof u.passwordHash, 'string');
      });

      const dbUsers = await User.find({});
      assert.strictEqual(dbUsers.length, initialData.users.length);
    });
  });

  describe('createInitialBlogs', () => {
    test('associates blogs with the correct users and populates comments', async () => {
      const users = await createInitialUsers();
      const blogs = await createInitialBlogs(users);

      assert.strictEqual(blogs.length, initialData.blogs.length);

      for (const blog of blogs) {
        const user = await User.findById(blog.user);
        assert.ok(user, 'user for blog exists');
        assert.ok(user.blogs.some(id => id.equals(blog._id)), 'user.blogs contains blog');

        if (blog.comments && blog.comments.length > 0) {
          for (const comment of blog.comments) {
            assert.ok(comment.user, 'comment has user');
            assert.ok(comment.createdAt instanceof Date, 'comment has createdAt');
          }
        }
      }
    });
  });

  describe('handleInitialDataInDb', () => {
    test('resets db and populates with users and blogs', async () => {
      const { users, blogs } = await handleInitialDataInDb();

      assert.strictEqual(users.length, initialData.users.length);
      assert.strictEqual(blogs.length, initialData.blogs.length);

      assert.strictEqual(await User.countDocuments(), initialData.users.length);
      assert.strictEqual(await Blog.countDocuments(), initialData.blogs.length);
    });
  });

  describe('integration via /api/test/reset', () => {
    test('resets DB', async () => {
      await createMinimalDataInDb();

      await api
        .post('/api/test/reset')
        .expect(204);

      assert.strictEqual(await User.countDocuments(), 0);
      assert.strictEqual(await Blog.countDocuments(), 0);
    });
  });

  describe('integration via /api/test/initiate-db', () => {
    test('returns created users and blogs', async () => {
      const response = await api
        .post('/api/test/initiate-db')
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const { users, blogs } = response.body;

      assert.strictEqual(users.length, initialData.users.length);
      assert.strictEqual(blogs.length, initialData.blogs.length);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});