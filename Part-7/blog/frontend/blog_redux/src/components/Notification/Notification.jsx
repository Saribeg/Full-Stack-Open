import { useSelector } from 'react-redux';
import { selectNotification } from '../../store/notification/selectors';
import './Notification.css';

const Notification = () => {
  const { message, type = 'success', popup } = useSelector(selectNotification);

  if (!message || typeof message !== 'string') return null;

  return popup ? (
    <div className={`toast toast-${type}`}>{message}</div>
  ) : (
    <div className={`notification notification-${type}`}>{message}</div>
  );
};

export default Notification;
