import { createSlice } from '@reduxjs/toolkit';
import { buildBlogDetailsExtraReducers } from './extraReducers';

const blogDetailsSlice = createSlice({
  name: 'blogDetails',
  initialState: {
    blog: null,
    status: {
      fetch: { loading: false, error: null },
      like: { loading: false, error: null },
      comment: { loading: false, error: null },
      delete: { loading: false, error: null }
    }
  },
  reducers: {
    clearBlog(state) {
      state.blog = null;
    }
  },
  extraReducers: buildBlogDetailsExtraReducers
});

export const { clearBlog } = blogDetailsSlice.actions;
export default blogDetailsSlice.reducer;
