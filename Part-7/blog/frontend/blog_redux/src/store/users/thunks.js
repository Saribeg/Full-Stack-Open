import { createThunkWithNotify } from '../utils/createThunkWithNotify';
import userService from '../../services/users';

export const fetchUsers = createThunkWithNotify('users/fetchAll', async () => {
  return await userService.getAll();
});

export const fetchUserById = createThunkWithNotify('users/fetchById', async (id) => {
  return await userService.getById(id);
});
