import { createSlice } from '@reduxjs/toolkit';
import { extraReducers } from './extraReducers';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: {
      login: { loading: false, error: null },
      initialize: { loading: false, error: null },
      logout: { loading: false, error: null }
    }
  },
  reducers: {},
  extraReducers
});

export default authSlice.reducer;
