const blogsRouter = require('express').Router();
const { Blog } = require('../models');
const { blogFinder } = require('../utils/middlewares');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.findAll();

  res.json(blogs);
});

blogsRouter.get('/:id', blogFinder, async (req, res) => {
  if (!req.blog) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  res.json(req.blog);
});

blogsRouter.post('/', async (req, res) => {
  const { title, author, url, likes } = req.body;
  const blog = await Blog.create({
    title,
    author,
    url,
    likes: likes || 0
  });

  res.status(201).json(blog);
});

blogsRouter.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const result = await Blog.destroy({ where: { id } });

  if (result) {
    return res.status(204).end();
  }

  return res.status(404).json({ error: 'Blog is not found' });
});

module.exports = blogsRouter;