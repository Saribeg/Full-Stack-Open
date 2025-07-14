import { addCases } from '../utils/addCases';
import { fetchBlogs, createBlog } from './thunks';
import { logout } from '../auth/thunks';

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
    });
};
