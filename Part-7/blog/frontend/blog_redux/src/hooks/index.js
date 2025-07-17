// Reserved for manual one-off notifications (non-thunk)
import { useDispatch } from 'react-redux';
import { setNotification } from '../store/notification/thunks';
import { uiConfigs } from '../utils/uiConfigs';

export const useNotification = () => {
  const dispatch = useDispatch();

  return ({
    message,
    type = 'success',
    popup,
    duration = uiConfigs.notificationDuration,
    placement = 'global'
  }) => {
    dispatch(setNotification(message, type, popup, duration, placement));
  };
};
