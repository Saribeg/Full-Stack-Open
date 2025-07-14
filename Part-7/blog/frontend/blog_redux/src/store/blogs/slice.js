import { createSlice } from '@reduxjs/toolkit';
import { extraReducers } from './extraReducers';

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: {
    blogList: [],
    status: {
      fetch: { loading: false, error: null },
      create: { loading: false, error: null }
    }
  },
  reducers: {},
  extraReducers
});

export default blogsSlice.reducer;
