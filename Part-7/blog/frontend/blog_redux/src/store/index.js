import { configureStore } from '@reduxjs/toolkit';

import notificationReducer from './notification/slice';
import modalReducer from './modal/slice';
import authReducer from './auth/slice';
import blogsReducer from './blogs/slice';
import blogDetailsReducer from './blogDetails/slice';
import usersReducer from './users/slice';

import { setNotification } from './notification/thunks';
import { uiConfigs } from '../utils/uiConfigs';

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    modal: modalReducer,
    auth: authReducer,
    blogs: blogsReducer,
    blogDetails: blogDetailsReducer,
    users: usersReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          // For centralization of notification popups
          notify: ({
            message,
            type = 'success',
            popup,
            duration = uiConfigs.notificationDuration,
            placement = 'global'
          }) => store.dispatch(setNotification(message, type, popup, duration, placement))
        }
      }
    })
});

export default store;
