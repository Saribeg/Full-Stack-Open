import { createSlice } from '@reduxjs/toolkit';
import { extraReducers } from './extraReducers';

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    userList: [],
    selectedUser: null,
    status: {
      fetch: { loading: false, error: null },
      fetchById: { loading: false, error: null }
    }
  },
  reducers: {},
  extraReducers
});

export default usersSlice.reducer;
