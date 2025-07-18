const blogsRouter = require('express').Router();
const middleware = require('../utils/middleware');
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });

  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id).populate('user', { username: 1, name: 1 });

  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' });
  }

  response.json(blog);
});

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const user = request.user;
  const { title, author, url, likes } = request.body;
  const blog = new Blog({ title, author, url, likes: likes || 0, user: user._id });
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json({
    ...savedBlog.toJSON(),
    user: {
      id: user._id,
      username: user.username,
      name: user.name,
    }
  });
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
  ).populate('user');

  if (!updatedBlog) {
    return response.status(404).json({ error: 'Blog is not found' });
  }

  response.json(updatedBlog);
});

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user;
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).json({ error: 'Blog is not found' });
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'blog can be deleted only by user who created it' });
  }

  await Blog.findByIdAndDelete(request.params.id);

  user.blogs = user.blogs.filter(b => b.toString() !== blog._id.toString());
  await user.save();

  response.status(204).end();
});

blogsRouter.post('/:id/comments', async (request, response) => {
  const { comment } = request.body;

  if (!comment || typeof comment !== 'string') {
    return response.status(400).json({ error: 'Comment is required and must be a string' });
  }

  const newComment = { text: comment };

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { $push: { comments: newComment } },
    {
      new: true,           // Return updated document
      runValidators: true, // Apply schema validations when updating
      context: 'query'     // For correct work of custom validators
    }
  ).populate('user');;

  if (!updatedBlog) {
    return response.status(404).json({ error: 'Blog is not found' });
  }

  response.status(201).json(updatedBlog);
});

module.exports = blogsRouter;