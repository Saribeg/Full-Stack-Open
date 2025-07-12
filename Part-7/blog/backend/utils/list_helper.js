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

// Let's use Map as an alternative to not repeat the previous approach with nested iterations.
const mostLikes = (blogs) => {
  if (!Array.isArray(blogs) || !blogs.length) {
    return null;
  }

  const authorMap = new Map();

  for (const blog of blogs) {
    const author = blog.author;
    const currentLikes = authorMap.get(author) || 0;
    authorMap.set(author, currentLikes  + blog.likes);
  }

  let mostLikedAuthor = null;
  let maxLikes = 0;

  for (const [author, likes] of authorMap.entries()) {
    if (likes > maxLikes) {
      mostLikedAuthor = { author, likes };
      maxLikes = likes;
    }
  }

  return mostLikedAuthor;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};