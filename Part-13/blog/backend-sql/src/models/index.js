const User = require('./user');
const Blog = require('./blog');

User.hasMany(Blog);
Blog.belongsTo(User);

User.addScope('withBlogs', {
  include: {
    model: Blog,
    attributes: { exclude: ['userId'] }
  }
});

Blog.addScope('withUserName', {
  attributes: { exclude: ['userId'] },
  include: {
    model: User,
    attributes: ['name']
  }
});

module.exports = {
  User,
  Blog
};