import { showNotification, hideNotification } from './slice';

export const setNotification = (message, type, popup, duration, placement) => {
  return (dispatch) => {
    dispatch(showNotification({ message, type, popup, duration, placement }));

    if (typeof duration === 'number' && duration > 0) {
      setTimeout(() => {
        dispatch(hideNotification());
      }, duration);
    }
  };
};
