import { createSlice } from '@reduxjs/toolkit'

const initialState = '';

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification(state, action) {
      return action.payload
    },
    hideNotification() {
      return initialState
    }
  }
})

export const setNotification = (message, seconds = 3) => {
  return dispatch => {
    dispatch(showNotification(message))

    setTimeout(() => {
      dispatch(hideNotification())
    }, seconds * 1000)
  }
}

export const { showNotification, hideNotification } = notificationSlice.actions
export default notificationSlice.reducer