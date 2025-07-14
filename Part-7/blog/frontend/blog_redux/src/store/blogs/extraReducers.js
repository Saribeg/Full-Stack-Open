import { addCases } from '../utils/addCases';
import { fetchBlogs, createBlog } from './thunks';

export const buildBlogDetailsExtraReducers = (builder) => {
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
    });
};
