import { createSlice } from '@reduxjs/toolkit';

const initialState = '';

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification(state, action) {
      return action.payload;
    },
    hideNotification() {
      return null;
    }
  }
});

export const setNotification = (message, type, seconds = 3) => {
  return (dispatch) => {
    dispatch(showNotification({ message, type }));

    setTimeout(() => {
      dispatch(hideNotification());
    }, seconds * 1000);
  };
};

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
