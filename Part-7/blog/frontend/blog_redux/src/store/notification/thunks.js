import { showNotification, hideNotification } from './slice';

export const setNotification = (message, type, popup, ms, placement) => {
  return (dispatch) => {
    dispatch(showNotification({ message, type, popup, placement }));

    setTimeout(() => {
      dispatch(hideNotification());
    }, ms);
  };
};
