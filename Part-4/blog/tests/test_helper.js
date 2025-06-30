const supertest = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Blog = require('../models/blog');
const User = require('../models/user');
const app = require('../app');

const initialData = {
  users: [
    {
      username: 'alex',
      name: 'Alex Smith'
    },
    {
      username: 'john',
      name: 'John Doe'
    },
    {
      username: 'lisa',
      name: 'Lisa Parker'
    },
    {
      username: 'jessica',
      name: 'Jessica Huston'
    }
  ],
  blogs: [
    {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      user: 'alex'
    },
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      user: 'jessica'
    },
    {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      user: 'jessica'
    },
    {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      user: 'john'
    },
    {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0,
      user: 'alex'
    },
    {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
      user: 'jessica'
    }
  ]
};

const resetDb = async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
};

const createInitialUsers = async () => {
  const passwordHash = await bcrypt.hash('sekret', 10);
  const savedUsers = await Promise.all(
    initialData.users.map(async (u) => {
      const user = new User({ ...u, passwordHash });
      return user.save();
    })
  );
  return savedUsers;
};

const createInitialBlogs = async (users) => {
  const allSavedBlogs = [];

  for (const user of users) {
    const userBlogsData = initialData.blogs
      .filter(blog => blog.user === user.username)
      .map(blog => ({ ...blog, user: user._id }));

    const savedBlogs = await Blog.insertMany(userBlogsData);
    allSavedBlogs.push(...savedBlogs);

    // Update user with all blog IDs at once
    const blogIds = savedBlogs.map(blog => blog._id);
    user.blogs = blogIds;
    await user.save();
  }

  return allSavedBlogs;
};

const handleInitialDataInDb = async () => {
  await resetDb();
  const users = await createInitialUsers();
  await createInitialBlogs(users);
};

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
  initialData, resetDb, createInitialUsers, handleInitialDataInDb,
  blogsInDb, usersInDb, nonExistingId, getAuthenticatedAgent
};