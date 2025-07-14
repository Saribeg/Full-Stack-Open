import { createSlice } from '@reduxjs/toolkit';
import { extraReducers } from './extraReducers';

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
  reducers: {},
  extraReducers
});

export default blogDetailsSlice.reducer;
