const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const Blog = require('../models/blog');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

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

test.only('a new blog can be added ', async () => {
  const newBlog = {
    title: 'Node.js event loop',
    author: 'Saribeh Karakhanian',
    url: 'https://nodejseventloop.com/',
    likes: 100
  };

  const blogsBefore = await helper.blogsInDb();

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, blogsBefore.length + 1);

  const savedBlog = response.body;
  const { id, title, author, url, likes } = savedBlog;

  assert.ok(id);
  assert.deepStrictEqual({ title, author, url, likes }, newBlog);
});

after(async () => {
  await mongoose.connection.close();
});