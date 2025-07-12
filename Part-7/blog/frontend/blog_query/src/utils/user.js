import { setToken, clearToken } from '../services/api';
import { safeParseJSON } from './commonHelpers';
import loginService from '../services/login';

export const initializeUser = (dispatchUser) => {
  const userJSON = window.localStorage.getItem('user');
  const user = safeParseJSON(userJSON);

  if (user?.token) {
    dispatchUser({ type: 'SET_USER', payload: user });
    setToken(user.token);
  }
};

export const loginUser = async (dispatchUser, { username, password }) => {
  const userData = await loginService.login({ username, password });
  window.localStorage.setItem('user', JSON.stringify(userData));
  dispatchUser({ type: 'SET_USER', payload: userData });
  setToken(userData.token);
  return userData;
};

export const logoutUser = (dispatchUser) => {
  window.localStorage.removeItem('user');
  clearToken();
  dispatchUser({ type: 'LOGOUT_USER' });
};
