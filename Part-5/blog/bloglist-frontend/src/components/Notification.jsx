import PropTypes from 'prop-types';

const Notification = ({ message, type }) => {
  if (!message || typeof message !== 'string') return null;

  return <div className={`notification ${type}`}>{message}</div>;
};

export default Notification;

Notification.propTypes = {
  message: PropTypes.string,
  type: PropTypes.string
};