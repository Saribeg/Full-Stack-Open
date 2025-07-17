import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: null,
  type: null,
  popup: false,
  placement: 'global'
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification(state, action) {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.popup = action.payload.popup ?? false;
      state.placement = action.payload.placement ?? 'global';
    },
    hideNotification(state) {
      state.message = null;
      state.type = null;
      state.popup = false;
      state.placement = 'global';
    }
  }
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
