import { useContext } from 'react'
import { useQueryClient, useMutation  } from '@tanstack/react-query'
import { createAnecdote } from '../queries/requests'
import NotificationContext from '../contexts/NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })
  const { notificationDispatch } = useContext(NotificationContext)

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({
      content,
      votes: 0
    })
    notificationDispatch({
      type: 'SHOW_MESSAGE',
      payload: { type: 'info', message: `Anecdote created! The content is "${content}"` }
    })
    setTimeout(() => {
      notificationDispatch({ type: 'HIDE_MESSAGE' })
    }, 5000)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
