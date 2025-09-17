const User = require('./user');
const Blog = require('./blog');
const ReadingList = require('./readingList');

User.hasMany(Blog);
Blog.belongsTo(User);

User.addScope('withBlogs', {
  include: {
    model: Blog,
    attributes: { exclude: ['userId'] }
  }
});

User.addScope('withBlogsAndReadings', {
  attributes: ['id', 'name', 'username'],
  include: [
    {
      model: Blog,
      attributes: { exclude: ['userId'] }
    },
    {
      model: Blog,
      as: 'readings',
      attributes: { exclude: ['userId'] },
      through: { attributes: ['id', 'read'] }
    }
  ]
});

Blog.addScope('withUserName', {
  attributes: { exclude: ['userId'] },
  include: {
    model: User,
    attributes: ['name']
  }
});

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' });
Blog.belongsToMany(User, { through: ReadingList });

module.exports = {
  User,
  Blog,
  ReadingList
};