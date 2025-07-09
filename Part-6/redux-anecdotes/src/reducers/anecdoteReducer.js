import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdotesSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    vote(state, action) {
      const updated = action.payload
      return state.map(a => a.id !== updated.id ? a : updated)
    },
    addAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createAnecdote(content)
    dispatch(addAnecdote(newAnecdote))
  }
}

export const updateAnecdote = (id) => {
  return async (dispatch, getState) => {
    const state = getState()
    const anecdoteToUpdate = state.anecdotes.find(a => a.id === id)
    const updatedAnecdoteData = { ...anecdoteToUpdate, votes: anecdoteToUpdate.votes + 1}
    const updatedAnecdote = await anecdoteService.updateAnecdote(updatedAnecdoteData)
    dispatch(vote(updatedAnecdote))
  }
}

export const { vote, addAnecdote, setAnecdotes } = anecdotesSlice.actions
export default anecdotesSlice.reducer