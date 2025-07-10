import { useContext } from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './queries/requests'
import NotificationContext from './contexts/NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })

      notificationDispatch({
        type: 'SHOW_MESSAGE',
        payload: { type: 'info', message: `Anecdote "${updatedAnecdote.content}" is voted for! Now there are ${updatedAnecdote.votes} votes!` }
      })
      setTimeout(() => {
        notificationDispatch({ type: 'HIDE_MESSAGE' })
      }, 5000)
    }
  })

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes
  })

  const { notificationDispatch } = useContext(NotificationContext)

  const handleVote = (anecdote) => {
    const updatedAnecdote = {...anecdote, votes: anecdote.votes + 1 }
    updateAnecdoteMutation.mutate(updatedAnecdote)
  }

  const anecdotes = result.data

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />

      {
        result.isLoading
          ? <div>loading data...</div>
          : anecdotes.map(anecdote =>
            <div key={anecdote.id}>
              <div>
                {anecdote.content}
              </div>
              <div>
                has {anecdote.votes}
                <button onClick={() => handleVote(anecdote)}>vote</button>
              </div>
            </div>
          )
      }
    </div>
  )
}

export default App
