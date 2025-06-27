const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  if (!Array.isArray(blogs) || !blogs.length) {
    return 0;
  }

  return blogs.reduce((acc, blog) => acc += blog.likes, 0);
};

module.exports = {
  dummy,
  totalLikes
};