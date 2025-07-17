import { addCases } from '../utils/addCases';
import { fetchBlogs, createBlog } from './thunks';
import { logout } from '../auth/thunks';
import { deleteBlog } from '../blogDetails/thunks';

export const extraReducers = (builder) => {
  addCases(builder)
    .for(fetchBlogs, 'fetch', {
      fulfilled: (state, action) => {
        state.blogList = action.payload;
      }
    })
    .for(createBlog, 'create', {
      fulfilled: (state, action) => {
        state.blogList.push(action.payload);
      }
    })
    .also(logout.fulfilled, (state) => {
      state.blogList = [];
    })
    .also(deleteBlog.fulfilled, (state, action) => {
      const deletedId = action.payload;
      state.blogList = state.blogList.filter((b) => b.id !== deletedId);
    });
};
