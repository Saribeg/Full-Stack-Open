import { createThunkWithNotify } from '../utils/createThunkWithNotify';
import loginService from '../../services/login';
import { setToken, clearToken } from '../../services/api';
import { safeParseJSON } from '../../utils/commonHelpers';

export const login = createThunkWithNotify('auth/login', async ({ username, password }) => {
  const user = await loginService.login({ username, password });
  localStorage.setItem('user', JSON.stringify(user));
  setToken(user.token);
  return user;
});

export const initialize = createThunkWithNotify('auth/initialize', async () => {
  const raw = localStorage.getItem('user');
  const user = safeParseJSON(raw);
  if (user?.token) {
    setToken(user.token);
    return user;
  }
  return null;
});

export const logout = createThunkWithNotify('auth/logout', async ({ name }) => {
  localStorage.removeItem('user');
  clearToken();
  return { name };
});
