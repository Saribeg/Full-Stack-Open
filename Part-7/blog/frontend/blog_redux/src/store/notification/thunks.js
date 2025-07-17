import { showNotification, hideNotification } from './slice';

export const setNotification = (message, type, popup, duration, placement) => {
  return (dispatch) => {
    dispatch(showNotification({ message, type, popup, duration, placement }));

    setTimeout(() => {
      dispatch(hideNotification());
    }, duration);
  };
};
