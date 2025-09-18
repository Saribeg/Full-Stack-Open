import { addCases } from '../utils/addCases';
import { fetchUsers, fetchUserById, registerUser } from './thunks';
import { logout } from '../auth/thunks';

export const extraReducers = (builder) => {
  addCases(builder)
    .for(fetchUsers, 'fetch', {
      fulfilled: (state, action) => {
        state.userList = action.payload;
      }
    })
    .for(fetchUserById, 'fetchById', {
      fulfilled: (state, action) => {
        state.selectedUser = action.payload;
      }
    })
    .for(registerUser, 'register', {
      fulfilled: (state, action) => {
        state.selectedUser = action.payload;
      }
    })
    .also(logout.fulfilled, (state) => {
      state.userList = [];
      state.selectedUser = null;
    });
};
