const User = require('./user');
const Blog = require('./blog');

User.sync();
Blog.sync();

module.exports = {
  User,
  Blog
};