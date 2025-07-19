import { useContext } from 'react';
import NotificationContext from '../contexts/NotificationContext';
import { uiConfigs } from '../utils/uiConfigs';

export const useNotification = () => {
  const { notificationDispatch } = useContext(NotificationContext);

  const notify = ({ message, type = 'success', duration = uiConfigs.notificationDuration }) => {
    notificationDispatch({
      type: 'SHOW_MESSAGE',
      payload: { message, type, duration }
    });

    setTimeout(() => {
      notificationDispatch({ type: 'HIDE_MESSAGE' });
    }, duration);
  };

  return notify;
};