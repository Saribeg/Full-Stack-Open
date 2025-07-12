import { createSlice } from '@reduxjs/toolkit';
import blogService from '../../services/blogs';

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    addBlog(state, action) {
      state.push(action.payload);
    },
    updateBlog(state, action) {
      const updated = action.payload;
      return state.map((b) => (b.id !== updated.id ? b : updated));
    },
    deleteBlog(state, action) {
      const id = action.payload;
      return state.filter((b) => b.id !== id);
    }
  }
});

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = ({ title, author, url }) => {
  return async (dispatch) => {
    const newBlog = await blogService.create({ title, author, url });
    dispatch(addBlog(newBlog));
    return newBlog;
  };
};

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const updated = await blogService.update({ ...blog, likes: blog.likes + 1 });
    dispatch(updateBlog(updated));
    return updated;
  };
};

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.deleteBlog(id);
    dispatch(deleteBlogAction(id));
  };
};

export const { setBlogs, addBlog, updateBlog, deleteBlog: deleteBlogAction } = blogsSlice.actions;
export default blogsSlice.reducer;
