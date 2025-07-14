import { createSlice } from '@reduxjs/toolkit';
import { buildBlogDetailsExtraReducers } from './extraReducers';

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
  reducers: {
    clearUser(state) {
      state.selectedUser = null;
    }
  },
  extraReducers: buildBlogDetailsExtraReducers
});

export const { clearUser } = usersSlice.actions;
export default usersSlice.reducer;
