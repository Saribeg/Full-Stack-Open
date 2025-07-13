import { createSlice } from '@reduxjs/toolkit';
import loginService from '../../services/login';
import { setToken, clearToken } from '../../services/api';
import { safeParseJSON } from '../../utils/commonHelpers';

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    showUsers(state, action) {
      return action.payload;
    }
  }
});

export const loginUser = ({ username, password }) => {
  return async (dispatch) => {
    const userData = await loginService.login({ username, password });
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(userData.token);
    dispatch(setUser(userData));
    return userData;
  };
};

export const initializeUser = () => {
  return async (dispatch) => {
    const userJSON = window.localStorage.getItem('user');
    const user = safeParseJSON(userJSON);

    if (user && user.token) {
      setToken(user.token);
      dispatch(setUser(user));
    }
  };
};

export const logoutUser = () => {
  return async (dispatch) => {
    localStorage.removeItem('user');
    clearToken();
    dispatch(setUser(null));
  };
};

export const { setUser, showUsers } = userSlice.actions;
export default userSlice.reducer;
