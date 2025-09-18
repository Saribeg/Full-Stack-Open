import { createThunkWithNotify } from '../utils/createThunkWithNotify';
import userService from '../../services/users';
import { setToken } from '../../services/api';
import { login } from '../auth/thunks';

export const fetchUsers = createThunkWithNotify('users/fetchAll', async () => {
  return await userService.getAll();
});

export const fetchUserById = createThunkWithNotify('users/fetchById', async (id) => {
  return await userService.getById(id);
});

export const registerUser = createThunkWithNotify(
  'users/register',
  async ({ username, name, password }, thunkAPI) => {
    const user = await userService.register({ username, name, password });
    localStorage.setItem('user', JSON.stringify(user));
    setToken(user.token);

    thunkAPI.dispatch({ type: login.fulfilled.type, payload: user });

    return user;
  }
);
