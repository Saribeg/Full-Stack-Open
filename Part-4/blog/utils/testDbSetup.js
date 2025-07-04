const bcrypt = require('bcrypt');
const User = require('../models/user');
const Blog = require('../models/blog');

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
    },
    {
      username: 'harrypotter',
      name: 'Harry Potter'
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
    },
    {
      title: 'Full Stack Open',
      author: 'Albus Dumbledore',
      url: 'https://fullstackopen.com/',
      likes: 150,
      user: 'harrypotter'
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
  const blogs = await createInitialBlogs(users);

  return { users, blogs };
};

module.exports = {
  initialData,
  resetDb,
  createInitialUsers,
  createInitialBlogs,
  handleInitialDataInDb
};