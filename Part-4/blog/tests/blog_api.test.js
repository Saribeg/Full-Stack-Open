const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const Blog = require('../models/blog');

const api = supertest(app);

describe('Integration tests. Testing the CRUD API for blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
  });

  describe('test GET/posts', () => {
    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs');

      assert.strictEqual(response.body.length, helper.initialBlogs.length);
    });

    test('the unique identifier property of the blog posts is named id', async () => {
      const response = await api.get('/api/blogs');
      const blog = response.body[0];

      assert.ok(blog.id);
      assert.strictEqual(blog._id, undefined);
    });
  });

  describe('creation of a new blog', () => {
    test('a new blog can be added ', async () => {
      const newBlog = {
        title: 'Node.js event loop',
        author: 'Saribeh Karakhanian',
        url: 'https://nodejseventloop.com/',
        likes: 100
      };

      const blogsAtStart = await helper.blogsInDb();

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1);

      const savedBlog = response.body;
      const { id, title, author, url, likes } = savedBlog;

      assert.ok(id);
      assert.deepStrictEqual({ title, author, url, likes }, newBlog);
    });

    test('when adding a new blog without likes property the default value 0 is set ', async () => {
      const newBlog = {
        title: 'React Server Components and Next.js',
        author: 'Harry Potter',
        url: 'https://reactandnextjs.com/'
      };

      const blogsAtStart = await helper.blogsInDb();

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1);

      const savedBlog = response.body;
      const { id, title, author, url, likes } = savedBlog;

      assert.ok(id);
      assert.deepStrictEqual({ title, author, url, likes }, { ...newBlog, likes: 0 });
      assert.strictEqual(likes, 0);
    });

    test('when adding a new blog without title property the error is returned', async () => {
      const newBlog = {
        author: 'Harry Potter',
        url: 'https://rabbitmqorkafka.com/',
        likes: 5
      };

      const blogsAtStart = await helper.blogsInDb();

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);

      assert.ok(response.body.error);
      assert.match(response.body.error, /validation/i);
    });

    test('when adding a new blog without url property the error is returned', async () => {
      const newBlog = {
        title: 'RabbitMQ or Kafka?',
        author: 'Harry Potter',
        likes: 5
      };

      const blogsAtStart = await helper.blogsInDb();

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);

      assert.ok(response.body.error);
      assert.match(response.body.error, /validation/i);
    });
  });

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

      const ids = blogsAtEnd.map(b => b.id);
      assert(!ids.includes(blogToDelete.id));
      const deleted = blogsAtEnd.find(b => b.id === blogToDelete.id);
      assert.strictEqual(deleted, undefined);
    });

    test('returns 404 if a blog for deletion is not found', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogIdToDelete = await helper.nonExistingId();

      const response = await api.delete(`/api/blogs/${blogIdToDelete}`).expect(404);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
      assert.ok(response.body.error);
      assert.strictEqual(response.body.error, 'Blog is not found');
    });
  });

  describe('update of a blog', () => {
    test('successfully updates likes of a blog', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];

      const updatedData = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(response.body.likes, updatedData.likes);
    });

    test('returns 404 if a blog for update is not found', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const exampleData = blogsAtStart[0];
      const updatedData = { ...exampleData, likes: exampleData.likes + 1 };
      const blogIdToUpdate = await helper.nonExistingId();

      const response = await api
        .put(`/api/blogs/${blogIdToUpdate}`)
        .send(updatedData)
        .expect(404);

      assert.ok(response.body.error);
      assert.strictEqual(response.body.error, 'Blog is not found');
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});