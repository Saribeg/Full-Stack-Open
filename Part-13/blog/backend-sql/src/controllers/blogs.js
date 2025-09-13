const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.findAll();

  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findByPk(id);

  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' });
  }

  response.json(blog);
});

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body;
  const blog = await Blog.create({
    title,
    author,
    url,
    likes: likes || 0
  });

  response.status(201).json(blog);
});

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id;
  const result = await Blog.destroy({ where: { id } });

  if (result) {
    return response.status(204).end();
  }

  return response.status(404).json({ error: 'Blog is not found' });
});

module.exports = blogsRouter;