import { useContext } from 'react';
import NotificationContext from '../../contexts/NotificationContext';
import './Notification.css';

const Notification = () => {
  const { notification } = useContext(NotificationContext);

  if (!notification) return null;

  const { message, type } = notification;

  if (!message || typeof message !== 'string') return null;

  return <div className={`notification ${type}`}>{message}</div>;
};

export default Notification;