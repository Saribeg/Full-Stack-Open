import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

import notificationReducer from '../../src/store/notification/slice';
import modalReducer from '../../src/store/modal/slice';
import authReducer from '../../src/store/auth/slice';
import blogsReducer from '../../src/store/blogs/slice';
import blogDetailsReducer from '../../src/store/blogDetails/slice';
import usersReducer from '../../src/store/users/slice';

import { setNotification } from '../../src/store/notification/thunks';
import { uiConfigs } from '../../src/utils/uiConfigs';

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    route = '/',
    store = configureStore({
      reducer: {
        notification: notificationReducer,
        modal: modalReducer,
        auth: authReducer,
        blogs: blogsReducer,
        blogDetails: blogDetailsReducer,
        users: usersReducer
      },
      preloadedState,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          thunk: {
            extraArgument: {
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
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
