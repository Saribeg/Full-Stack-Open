import { addCases } from '../utils/addCases';
import { fetchBlogById, likeBlog, createComment, deleteBlog } from './thunks';
import { logout } from '../auth/thunks';

const assignToBlogHandlers = {
  fulfilled: (state, action) => {
    state.blog = action.payload;
  }
};

export const extraReducers = (builder) => {
  addCases(builder)
    .for(fetchBlogById, 'fetch', assignToBlogHandlers)
    .for(likeBlog, 'like', assignToBlogHandlers)
    .for(createComment, 'comment', assignToBlogHandlers)
    .for(deleteBlog, 'delete', {
      fulfilled: (state) => {
        state.blog = null;
      }
    })
    .also(logout.fulfilled, (state) => {
      state.blog = null;
    });
};
