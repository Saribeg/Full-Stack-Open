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