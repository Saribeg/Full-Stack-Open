const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');

const api = supertest(app);
let authenticatedApi;
let authenticatedUser;

describe('Integration tests. Testing the CRUD API for blogs', () => {
  beforeEach(async () => {
    await helper.handleInitialDataInDb();
    const { agent, user } = await helper.getAuthenticatedAgent({
      username: 'jessica',
      password: 'sekret',
    });

    authenticatedApi = agent;
    authenticatedUser = user;
  });

  describe('test GET/posts', () => {
    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs');

      assert.strictEqual(response.body.length, helper.initialData.blogs.length);
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

      const response = await authenticatedApi
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1);

      const savedBlog = response.body;
      const { id, title, author, url, likes, user } = savedBlog;

      assert.ok(id);
      assert.deepStrictEqual({ title, author, url, likes }, newBlog);
      assert.strictEqual(user, authenticatedUser.id);
    });

    test('when adding a new blog without likes property the default value 0 is set ', async () => {
      const newBlog = {
        title: 'React Server Components and Next.js',
        author: 'Harry Potter',
        url: 'https://reactandnextjs.com/'
      };

      const blogsAtStart = await helper.blogsInDb();

      const response = await authenticatedApi
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

      const response = await authenticatedApi
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

      const response = await authenticatedApi
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);

      assert.ok(response.body.error);
      assert.match(response.body.error, /validation/i);
    });

    test('creation fails with 401 if token is missing', async () => {
      const newBlog = { title: 'No Token', author: 'Test', url: 'https://no.token' };
      const response = await api.post('/api/blogs').send(newBlog).expect(401);
      assert.match(response.body.error, /token/i);
    });
  });

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid and user is creator', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const userId = authenticatedUser.id;
      const blogToDelete = blogsAtStart.find(blog => blog.user.toString() === userId);

      await authenticatedApi.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

      const ids = blogsAtEnd.map(b => b.id);
      assert(!ids.includes(blogToDelete.id));
      const deleted = blogsAtEnd.find(b => b.id === blogToDelete.id);
      assert.strictEqual(deleted, undefined);
    });

    test('returns 404 if a blog for deletion is not found', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const userId = authenticatedUser.id;
      const blogToDelete = blogsAtStart.find(blog => blog.user.toString() !== userId);

      const response = await authenticatedApi.delete(`/api/blogs/${blogToDelete.id}`).expect(401);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
      assert.ok(response.body.error);
      assert.strictEqual(response.body.error, 'blog can be deleted only by user who created it');
    });

    test('blog can be deleted only by user who created it', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogIdToDelete = await helper.nonExistingId();

      const response = await authenticatedApi.delete(`/api/blogs/${blogIdToDelete}`).expect(404);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
      assert.ok(response.body.error);
      assert.strictEqual(response.body.error, 'Blog is not found');
    });

    test('deletion fails with 401 if token is missing', async () => {
      const blogs = await helper.blogsInDb();
      const blogToDelete = blogs[0];

      const response = await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);
      assert.match(response.body.error, /token/i);
    });
  });

  describe('update of a blog', () => {
    test('successfully updates likes of a blog', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];

      const updatedData = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };

      const response = await authenticatedApi
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

      const response = await authenticatedApi
        .put(`/api/blogs/${blogIdToUpdate}`)
        .send(updatedData)
        .expect(404);

      assert.ok(response.body.error);
      assert.strictEqual(response.body.error, 'Blog is not found');
    });

    test('update fails with 401 if token is missing', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];

      const response = await api.put(`/api/blogs/${blogToUpdate.id}`).expect(401);
      assert.match(response.body.error, /token/i);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});