import { createStore, combineReducers } from 'redux'

import anecdoteReducer from './anecdoteReducer'
import filterReducer from './filterReducer'

const reducer = combineReducers({
  anecdotes: anecdoteReducer,
  filter: filterReducer
})

const store = createStore(reducer)

export default store