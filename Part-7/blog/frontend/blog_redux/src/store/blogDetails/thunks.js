import { createThunkWithNotify } from '../utils/createThunkWithNotify';
import blogService from '../../services/blogs';

export const fetchBlogById = createThunkWithNotify('blogDetails/fetchById', async (id) => {
  return await blogService.getById(id);
});

export const likeBlog = createThunkWithNotify('blogDetails/like', async (blog) => {
  const updated = await blogService.update({ ...blog, likes: blog.likes + 1 });
  return updated;
});

export const createComment = createThunkWithNotify(
  'blogDetails/comment',
  async ({ id, comment }) => {
    const updated = await blogService.createComment({ id, comment });
    return updated;
  }
);

export const deleteBlog = createThunkWithNotify('blogDetails/delete', async (id) => {
  await blogService.deleteBlog(id);
  return id;
});

export const updateComment = createThunkWithNotify(
  'blogDetails/updateComment',
  async ({ blogId, commentId, comment }) => {
    const updated = await blogService.updateComment({ blogId, commentId, comment });
    return updated;
  }
);

export const deleteComment = createThunkWithNotify(
  'blogDetails/deleteComment',
  async ({ blogId, commentId }) => {
    const updatedBlog = await blogService.deleteComment({ blogId, commentId });
    return updatedBlog;
  }
);
