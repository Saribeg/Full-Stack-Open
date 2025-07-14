import { addCases } from '../utils/addCases';
import { login, initialize, logout } from './thunks';

const assignUserHandlers = {
  fulfilled: (state, action) => {
    state.user = action.payload;
  }
};

export const buildAuthExtraReducers = (builder) => {
  addCases(builder)
    .for(login, 'login', assignUserHandlers)
    .for(initialize, 'initialize', assignUserHandlers)
    .for(logout, 'logout', {
      fulfilled: (state) => {
        state.user = null;
      }
    });
};
