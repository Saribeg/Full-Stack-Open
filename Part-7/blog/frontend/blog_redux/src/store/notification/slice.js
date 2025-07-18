import { createSlice } from '@reduxjs/toolkit';
import { uiConfigs } from '../../utils/uiConfigs';

const initialState = {
  message: null,
  type: null,
  popup: false,
  placement: 'global',
  duration: uiConfigs.notificationDuration
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
      state.duration = action.payload.duration ?? uiConfigs.notificationDuration;
    },
    hideNotification(state) {
      state.message = null;
      state.type = null;
      state.popup = false;
      state.placement = 'global';
      state.duration = uiConfigs.notificationDuration;
    }
  }
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
