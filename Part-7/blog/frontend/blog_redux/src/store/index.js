import { configureStore } from '@reduxjs/toolkit';

import notificationReducer from './notification/slice';
import authReducer from './auth/slice';
import blogsReducer from './blogs/slice';
import blogDetailsReducer from './blogDetails/slice';
import usersReducer from './users/slice';

import { setNotification } from './notification/thunks';

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
          notify: ({ message, type = 'success', popup }) =>
            store.dispatch(setNotification(message, type, popup))
        }
      }
    })
});

export default store;
