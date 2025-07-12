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

export const { setBlogs, addBlog } = blogsSlice.actions;
export default blogsSlice.reducer;
