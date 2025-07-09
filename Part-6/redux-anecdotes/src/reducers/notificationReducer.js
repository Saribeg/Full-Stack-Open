import { createSlice } from '@reduxjs/toolkit'

const initialState = '';

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification(state, action) {
      return action.payload
    }
  }
})

export const { filterChange } = notificationSlice.actions
export default notificationSlice.reducer