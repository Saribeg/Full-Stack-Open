import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: null,
  type: null,
  popup: false
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification(state, action) {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.popup = action.payload.popup ?? false;
    },
    hideNotification(state) {
      state.message = null;
      state.type = null;
      state.popup = false;
    }
  }
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
