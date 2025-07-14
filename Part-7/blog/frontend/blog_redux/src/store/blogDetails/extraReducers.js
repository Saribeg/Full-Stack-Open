import { addCases } from '../utils/addCases';
import { fetchBlogById, likeBlog, createComment, deleteBlog } from './thunks';

const assignToBlogHandlers = {
  fulfilled: (state, action) => {
    state.blog = action.payload;
  }
};

export const buildBlogDetailsExtraReducers = (builder) => {
  addCases(builder)
    .for(fetchBlogById, 'fetch', assignToBlogHandlers)
    .for(likeBlog, 'like', assignToBlogHandlers)
    .for(createComment, 'comment', assignToBlogHandlers)
    .for(deleteBlog, 'delete', {
      fulfilled: (state) => {
        state.blog = null;
      }
    });
};
