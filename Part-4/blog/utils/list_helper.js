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

const mostBlogs = (blogs) => {
  if (!Array.isArray(blogs) || !blogs.length) {
    return null;
  }

  const authors = blogs.reduce((acc, blog) => {
    const author = blog.author;
    const existingAuthor = acc.find(authorData => authorData.author === author);

    if (existingAuthor) {
      existingAuthor.blogs += 1;
    } else {
      acc.push({
        author,
        blogs: 1
      });
    }

    return acc;
  }, []);

  return authors.reduce((acc, author) => author.blogs > acc.blogs ? author : acc, authors[0]);
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
};