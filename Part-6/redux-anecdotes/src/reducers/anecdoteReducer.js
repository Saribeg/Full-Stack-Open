import { createSlice } from '@reduxjs/toolkit'

const anecdotesSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    vote(state, action) {
      const anecdoteToUpdate = state.find(a => a.id === action.payload)
      if (anecdoteToUpdate) {
        anecdoteToUpdate.votes += 1
      }
    },
    addAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { vote, addAnecdote, setAnecdotes } = anecdotesSlice.actions
export default anecdotesSlice.reducer