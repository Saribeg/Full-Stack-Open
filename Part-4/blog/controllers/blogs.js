const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});

  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);
  const savedBlog = await blog.save();

  response.status(201).json(savedBlog);
});

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    {
      new: true,           // Return updated document
      runValidators: true, // Apply schema validations when updating
      context: 'query'     // For correct work of custom validators
    }
  );

  if (!updatedBlog) {
    return response.status(404).json({ error: 'Blog is not found' });
  }

  response.json(updatedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  const deletedBlog = await Blog.findByIdAndDelete(request.params.id);

  if (!deletedBlog) {
    return response.status(404).json({ error: 'Blog is not found' });
  }

  response.status(204).end();
});

module.exports = blogsRouter;