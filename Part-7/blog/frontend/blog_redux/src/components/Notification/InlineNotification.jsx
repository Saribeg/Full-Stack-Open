import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Notification from './Notification';

import { selectNotificationPlacement } from '../../store/notification/selectors';

const InlineNotification = ({ placement }) => {
  const currentPlacement = useSelector(selectNotificationPlacement);

  return <div className="min-h-[92px]">{currentPlacement === placement && <Notification />}</div>;
};

InlineNotification.propTypes = {
  placement: PropTypes.string.isRequired
};

export default InlineNotification;
