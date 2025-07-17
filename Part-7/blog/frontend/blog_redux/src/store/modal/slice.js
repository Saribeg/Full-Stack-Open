import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    isOpened: false,
    type: '',
    params: null
  },
  reducers: {
    showModal(state, action) {
      const { type, params } = action.payload;
      state.isOpened = true;
      state.type = type;
      state.params = params;
    },
    hideModal(state) {
      state.isOpened = false;
      state.type = '';
      state.params = null;
    }
  }
});

export const { showModal, hideModal } = modalSlice.actions;
export default modalSlice.reducer;
