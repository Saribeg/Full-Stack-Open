import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer';

const AnecdoteList = () => {
  // There are three possible places to handle sorting: in the reducer, in the selector, or in the component.
  // Sorting in the reducer mixes UI logic with state logic, which breaks separation of concerns.
  // Using a selector function is ideal for reuse, but here we sort inline for simplicity and readability,
  // as this is the only place where sorted anecdotes are needed.
  const anecdotes = useSelector(state => [...state].sort((a, b) => b.votes - a.votes))
  const dispatch = useDispatch()

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => dispatch(vote(anecdote.id))}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList