import Filter from './components/Filter'
import AnecdoteList from './components/AnecdoteList'
import AnecdoteForm from './components/AnecdoteForm'

const App = () => {
  return (
    <div>
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App