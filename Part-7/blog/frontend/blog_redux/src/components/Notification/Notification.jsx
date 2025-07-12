import { useSelector } from 'react-redux';
import './Notification.css';

const Notification = () => {
  const notification = useSelector((state) => state.notification);

  if (!notification) return null;

  const { message, type } = notification;

  if (!message || typeof message !== 'string') return null;

  return <div className={`notification ${type}`}>{message}</div>;
};

export default Notification;
