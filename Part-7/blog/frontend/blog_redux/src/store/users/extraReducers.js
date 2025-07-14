import { addCases } from '../utils/addCases';
import { fetchUsers, fetchUserById } from './thunks';

export const buildBlogDetailsExtraReducers = (builder) => {
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
    });
};
