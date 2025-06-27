const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  if (!Array.isArray(blogs) || !blogs.length) {
    return 0;
  }

  return blogs.reduce((acc, blog) => acc += blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (!Array.isArray(blogs) || !blogs.length) {
    return null;
  }

  return blogs.reduce((acc, blog) => blog.likes > acc.likes ? blog : acc, blogs[0]);
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};