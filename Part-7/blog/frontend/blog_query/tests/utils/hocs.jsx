import { createRenderWithStaticContext, createRenderWithLiveContext, createLiveProvider } from './contextTestUtils';
import NotificationContext from '../../src/contexts/NotificationContext';
import UserContext from '../../src/contexts/UserContext';

// Notifications
const notificationReducer = (state, action) => {
  if (action.type === 'HIDE_MESSAGE') return null;
  return state;
};

export const renderWithContextNotification = createRenderWithStaticContext(
  NotificationContext,
  ({ notification, notificationDispatch }) => ({
    notification,
    notificationDispatch,
  })
);

export const LiveNotificationProvider = createLiveProvider(
  NotificationContext,
  notificationReducer,
  null,
  (notification, dispatchSpy) => ({
    notification,
    notificationDispatch: dispatchSpy,
  })
);

export const renderWithLiveNotification = createRenderWithLiveContext(
  NotificationContext,
  notificationReducer,
  null,
  (notification, dispatchSpy) => ({
    notification,
    notificationDispatch: dispatchSpy,
  })
);

// User
export const renderWithContextUser = createRenderWithStaticContext(
  UserContext,
  ({ dispatchUser }) => ({ dispatchUser })
);