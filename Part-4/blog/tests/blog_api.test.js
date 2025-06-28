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

test('a new blog can be added ', async () => {
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

test('when adding a new blog without likes property the default value 0 is set ', async () => {
  const newBlog = {
    title: 'React Server Components and Next.js',
    author: 'Harry Potter',
    url: 'https://reactandnextjs.com/'
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
  assert.deepStrictEqual({ title, author, url, likes }, { ...newBlog, likes: 0 });
  assert.strictEqual(likes, 0);
});

test('when adding a new blog without title property the error is returned', async () => {
  const newBlog = {
    author: 'Harry Potter',
    url: 'https://rabbitmqorkafka.com/',
    likes: 5
  };

  const blogsBefore = await helper.blogsInDb();

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, blogsBefore.length);

  assert.ok(response.body.error);
  assert.match(response.body.error, /validation/i);
});

test('when adding a new blog without url property the error is returned', async () => {
  const newBlog = {
    title: 'RabbitMQ or Kafka?',
    author: 'Harry Potter',
    likes: 5
  };

  const blogsBefore = await helper.blogsInDb();

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, blogsBefore.length);

  assert.ok(response.body.error);
  assert.match(response.body.error, /validation/i);
});

after(async () => {
  await mongoose.connection.close();
});