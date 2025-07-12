import { useContext } from 'react';
import NotificationContext from '../contexts/NotificationContext';

export const useNotification = () => {
  const { notificationDispatch } = useContext(NotificationContext);

  const notify = ({ message, type = 'success', seconds = 5 }) => {
    notificationDispatch({
      type: 'SHOW_MESSAGE',
      payload: { message, type }
    });

    setTimeout(() => {
      notificationDispatch({ type: 'HIDE_MESSAGE' });
    }, seconds * 1000);
  };

  return notify;
};