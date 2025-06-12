import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState({})

  const handleVote = () => {
    const currentVotes = {...votes};
    if (currentVotes[selected]) {
      currentVotes[selected] += 1
    } else {
      currentVotes[selected] = 1
    }
    setVotes(currentVotes)
  }

  const handleNextAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomIndex)
  }

  const getMaxVoteKey = votes => {
    const keys = Object.keys(votes)
    if (keys.length === 0) return null
  
    return +keys.reduce((maxKey, currentKey) =>
      votes[currentKey] > votes[maxKey] ? currentKey : maxKey,
      keys[0]
    )
  }
  const maxVoteKey = getMaxVoteKey(votes)

  return (
    <div>
      <div>
        <h1>Anecdote of The Day</h1>
        <p>{anecdotes[selected]}</p>
        <p>Has {votes[selected] || 0} Votes</p>
        <button onClick={handleVote}>Vote</button>
        <button onClick={handleNextAnecdote}>Next Anecdote</button>
      </div>
      {maxVoteKey !== null ? (
        <div>
          <h1>Anecdote with most votes</h1>
          <p>{anecdotes[maxVoteKey]}</p>
          <p>Has {votes[maxVoteKey]} votes</p>
        </div>
      ) : null}
    </div>
  )
}

export default App