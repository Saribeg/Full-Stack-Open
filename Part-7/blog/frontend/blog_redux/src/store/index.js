import { configureStore } from '@reduxjs/toolkit';

import notificationReducer from './notification/slice';
import authReducer from './auth/slice';
import blogsReducer from './blogs/slice';
import blogDetailsReducer from './blogDetails/slice';
import usersReducer from './users/slice';

import { setNotification } from './notification/thunks';
import { uiConfigs } from '../utils/uiConfigs';

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    auth: authReducer,
    blogs: blogsReducer,
    blogDetails: blogDetailsReducer,
    users: usersReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          notify: ({
            message,
            type = 'success',
            popup,
            ms = uiConfigs.notificationDuration,
            placement = 'global'
          }) => store.dispatch(setNotification(message, type, popup, ms, placement))
        }
      }
    })
});

export default store;
