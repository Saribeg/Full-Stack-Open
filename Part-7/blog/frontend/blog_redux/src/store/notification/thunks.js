import { showNotification, hideNotification } from './slice';

export const setNotification = (message, type, popup, seconds = 3) => {
  return (dispatch) => {
    dispatch(showNotification({ message, type, popup }));

    setTimeout(() => {
      dispatch(hideNotification());
    }, seconds * 1000);
  };
};
