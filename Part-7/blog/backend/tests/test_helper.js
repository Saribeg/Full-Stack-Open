const supertest = require('supertest');
const mongoose = require('mongoose');
const Blog = require('../models/blog');
const User = require('../models/user');
const app = require('../app');

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(user => user.toJSON());
};

const nonExistingId = async () => {
  return new mongoose.Types.ObjectId().toString();
};

const getAuthenticatedAgent = async ({ username, password }) => {
  const agent = supertest.agent(app);

  const response = await agent
    .post('/api/login')
    .send({ username, password })
    .expect(200);

  const token = response.body.token;

  agent.auth(token, { type: 'bearer' });

  return {
    agent,
    user: {
      id: response.body.id,
      username: response.body.username,
      name: response.body.name
    }
  };
};

module.exports = {
  blogsInDb, usersInDb, nonExistingId, getAuthenticatedAgent
};