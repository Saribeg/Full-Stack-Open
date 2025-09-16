const User = require('./user');
const Blog = require('./blog');

User.hasMany(Blog);
Blog.belongsTo(User);

const sync = async () => {
  if (process.env.NODE_ENV === 'development') {
    await User.sync({ alter: true });
    await Blog.sync({ alter: true });
  } else {
    await User.sync();
    await Blog.sync();
  }
};

sync();

module.exports = {
  User,
  Blog
};
