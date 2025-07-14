import { createThunkWithNotify } from '../utils/createThunkWithNotify';
import blogService from '../../services/blogs';

export const fetchBlogs = createThunkWithNotify('blogs/fetchAll', async () => {
  return await blogService.getAll();
});

export const createBlog = createThunkWithNotify('blogs/create', async ({ title, author, url }) => {
  return await blogService.create({ title, author, url });
});
