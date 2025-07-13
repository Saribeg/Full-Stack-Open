import { createSlice } from '@reduxjs/toolkit';
import userService from '../../services/users';

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    userList: [],
    selectedUser: null
  },
  reducers: {
    setUsers(state, action) {
      state.userList = action.payload;
    },
    setSelectedUser(state, action) {
      state.selectedUser = action.payload;
    }
  }
});

export const getUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAll();
    dispatch(setUsers(users));
  };
};

export const getUserById = (id) => {
  return async (dispatch) => {
    const user = await userService.getById(id);
    dispatch(setSelectedUser(user));
  };
};

export const { setUsers, setSelectedUser } = usersSlice.actions;
export default usersSlice.reducer;
