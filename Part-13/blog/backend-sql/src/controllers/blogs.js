const blogsRouter = require('express').Router();
const { Blog } = require('../models');
const { blogFinder, userExtractor } = require('../utils/middlewares');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.scope('withUserName').findAll();

  res.json(blogs);
});

blogsRouter.get('/:id', blogFinder, async (req, res) => {
  if (!req.blog) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  res.json(req.blog);
});

blogsRouter.post('/', userExtractor, async (req, res) => {
  const user = req.user;
  const { title, author, url, likes } = req.body;
  const blog = await Blog.create({
    title,
    author,
    url,
    likes: likes || 0,
    userId: user.id
  }).then(b => b.reload(Blog.options.scopes.withUserName));

  res.status(201).json(blog);
});

blogsRouter.put('/:id', blogFinder, async (req, res) => {
  if (!req.blog) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  const { title, author, url, likes } = req.body;
  const updated = await req.blog
    .update({ title, author, url, likes })
    .then(b => b.reload(Blog.options.scopes.withUserName));

  return res.json(updated);
});

blogsRouter.delete('/:id', userExtractor, blogFinder, async (req, res) => {
  if (!req.blog) {
    return res.status(404).json({ error: 'Blog is not found' });
  }

  if (req.blog.userId !== req.user.id) {
    return res.status(403).json({ error: 'blog can be deleted only by user who created it' });
  }

  await req.blog.destroy();
  return res.status(204).end();
});

module.exports = blogsRouter;