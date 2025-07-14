import { createSlice } from '@reduxjs/toolkit';
import { buildAuthExtraReducers } from './extraReducers';

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
  extraReducers: buildAuthExtraReducers
});

export default authSlice.reducer;
